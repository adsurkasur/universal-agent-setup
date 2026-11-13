# Universal agent setup

When asked to inspect or change this repository, review and test the code without running the installer on the real user profile. Run installation only when the user requests installation.

## Skill layout

- The universal source is `~/.agents/skills`.
- Codex discovers that hub directly. Never copy universal skills into `~/.codex/skills`, and never link that entire folder to the hub.
- Preserve `.codex/skills/.system`, Codex plugins, and Codex-specific skills.
- Claude uses `~/.claude/skills`; Antigravity uses `~/.gemini/config/skills`. The Gemini fallback remains `~/.gemini/skills`.
- Synchronize one way from the hub to Claude/Gemini. Do not merge agent directories back into the hub or repository.
- Existing legacy Codex duplicates require backup and a full-folder comparison before migration. Warn rather than delete or overwrite them automatically.

## Entry points

- Windows: `scripts/install-all.ps1`, which calls `scripts/sync-skills.ps1`.
- macOS/Linux: `scripts/install-all.sh`.
- Shared synchronization engine: `scripts/sync-skills.py` (Python 3).
- MCP configuration is separate from skill discovery. Retain existing merge behavior when changing skill installation.

## Verification

Run `python -m unittest discover -s tests -v`. Use temporary user directories for integration checks. Verify Codex sees the hub without legacy duplicates; do not require equal skill counts in `.agents` and `.codex`. Never claim MCP connections work solely because config files were written.

Keep README and the distributed bundle archive consistent with installer changes. See README for old-install migration guidance.
