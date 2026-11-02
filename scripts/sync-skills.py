"""Copy the shared hub outward; Codex discovers the hub directly."""
import argparse
import os
from pathlib import Path
import shutil


def sync(source, home):
    if not source.is_dir() or not any(not p.parent.name.startswith('.') for p in source.glob('*/SKILL.md')):
        raise ValueError(f'No skills found in source hub: {source}')
    targets = [home / r for r in ('.gemini/config/skills', '.gemini/skills', '.claude/skills')]
    copied = 0
    skills = [p for p in source.iterdir() if not p.name.startswith('.') and (p/'SKILL.md').is_file()]
    for skill in skills:
        # os.walk follows a junction used as the skill root, as existing hubs do.
        for root, dirs, files in os.walk(skill):
            for name in files:
                src = Path(root)/name
                content = src.read_bytes()
                for target in targets:
                    dst = target/skill.name/src.relative_to(skill)
                    if dst.exists() and dst.read_bytes() == content:
                        continue
                    dst.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(src, dst)
                    copied += 1
    legacy = home/'.codex/skills'
    duplicates = sorted(p.name for p in skills if (legacy/p.name/'SKILL.md').exists())
    print(f'Sync Result: {len(skills)} hub skills. Updated: {copied}')
    print('Codex reads ~/.agents/skills directly; no Codex skill copies created.')
    if duplicates:
        print(f'WARNING: {len(duplicates)} legacy Codex duplicates remain. Back up and review before migrating; no legacy files were changed.')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--home', type=Path, default=Path.home())
    parser.add_argument('--source', type=Path)
    args = parser.parse_args()
    try:
        sync(args.source or args.home/'.agents/skills', args.home)
    except (OSError, ValueError) as exc:
        parser.exit(1, f'{exc}\n')


if __name__ == '__main__':
    main()
