import os, pathlib, subprocess, tempfile, unittest, shutil, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]

class SkillsSyncTests(unittest.TestCase):
    def run_sync(self, home, source):
        return subprocess.run([sys.executable, str(ROOT/'scripts/sync-skills.py'), '--home', str(home), '--source', str(source)], capture_output=True, text=True)

    def test_sync_uses_requested_hub_without_creating_codex_copies(self):
        with tempfile.TemporaryDirectory() as tmp:
            home = pathlib.Path(tmp)/'user'; source = pathlib.Path(tmp)/"custom hub's skills"
            (source/'sample').mkdir(parents=True)
            (source/'sample/SKILL.md').write_text('name: sample\n')
            (source/'sample/asset.bin').write_bytes(b'\x00\r\n\xff')
            result = self.run_sync(home, source)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertFalse((home/'.codex/skills/sample').exists())
            for r in ['.claude/skills', '.gemini/config/skills', '.gemini/skills']:
                self.assertEqual((home/r/'sample/asset.bin').read_bytes(), b'\x00\r\n\xff')
            again = self.run_sync(home, source)
            self.assertEqual(again.returncode, 0, again.stderr)
            self.assertIn('Updated: 0', again.stdout)

    def test_existing_codex_system_plugins_and_custom_skills_are_preserved(self):
        with tempfile.TemporaryDirectory() as tmp:
            home = pathlib.Path(tmp); source = home/'.agents/skills'
            for r in ['.agents/skills/sample', '.codex/skills/sample', '.codex/skills/.system/builtin', '.codex/skills/local-only', '.codex/plugins/example']:
                (home/r).mkdir(parents=True)
                (home/r/'SKILL.md').write_text(r)
            result = self.run_sync(home, source)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn('legacy', result.stdout.lower())
            self.assertEqual((home/'.codex/skills/sample/SKILL.md').read_text(), '.codex/skills/sample')
            self.assertTrue((home/'.codex/skills/.system/builtin/SKILL.md').exists())
            self.assertTrue((home/'.codex/skills/local-only/SKILL.md').exists())
            self.assertTrue((home/'.codex/plugins/example/SKILL.md').exists())
            self.assertFalse((source/'local-only').exists())

    def test_missing_hub_fails_before_creating_destinations(self):
        with tempfile.TemporaryDirectory() as tmp:
            home = pathlib.Path(tmp)/'user'
            result = self.run_sync(home, pathlib.Path(tmp)/'missing')
            self.assertNotEqual(result.returncode, 0)
            self.assertFalse(home.exists())

    @unittest.skipUnless(shutil.which('pwsh'), 'PowerShell unavailable')
    def test_powershell_wrapper_leaves_codex_unpopulated_and_repo_untouched(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp); home = root/'user'; scripts = root/'repo/scripts'
            scripts.mkdir(parents=True)
            for name in ['sync-skills.ps1', 'sync-skills.py']:
                shutil.copy2(ROOT/'scripts'/name, scripts/name)
            source = root/"custom hub's skills/sample"
            source.mkdir(parents=True); (source/'SKILL.md').write_text('name: sample')
            env = dict(os.environ, USERPROFILE=str(home))
            command = ['pwsh', '-NoProfile', '-File', str(scripts/'sync-skills.ps1'), '-SourceHub', str(source.parent)]
            result = subprocess.run(command, env=env, capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertFalse((home/'.codex/skills/sample').exists())
            self.assertTrue((home/'.claude/skills/sample/SKILL.md').exists())
            self.assertFalse((scripts.parent/'skills').exists())
            result = subprocess.run(command+['-Bidirectional'], env=env, capture_output=True, text=True)
            self.assertNotEqual(result.returncode, 0)

    def test_agent_only_files_are_not_imported_into_hub(self):
        with tempfile.TemporaryDirectory() as tmp:
            home = pathlib.Path(tmp); source = home/'.agents/skills'
            (source/'sample').mkdir(parents=True)
            (source/'sample/SKILL.md').write_text('hub version')
            destination = home/'.gemini/config/skills'
            (destination/'sample').mkdir(parents=True)
            (destination/'sample/SKILL.md').write_text('old version')
            (destination/'sample/local.txt').write_text('local asset')
            result = self.run_sync(home, source)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual((destination/'sample/SKILL.md').read_text(), 'hub version')
            self.assertFalse((source/'sample/local.txt').exists())
            self.assertTrue((destination/'sample/local.txt').exists())

if __name__ == '__main__':
    unittest.main()
