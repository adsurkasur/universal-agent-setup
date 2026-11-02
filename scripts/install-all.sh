#!/usr/bin/env bash
# ==============================================================================
# Universal AI Agent Multi-Machine Setup Installer (Linux / macOS)
# ==============================================================================

set -e

command -v python3 >/dev/null 2>&1 || { echo "Python 3 diperlukan untuk sinkronisasi skill." >&2; exit 1; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUNDLE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SKILLS_SRC="$BUNDLE_ROOT/skills"

echo "=========================================================="
echo "    UNIVERSAL AI AGENT SETUP INSTALLER (POSIX / UNIX)    "
echo "=========================================================="

# 1. Pastikan direktori agent ada
mkdir -p "$HOME/.agents/skills"
mkdir -p "$HOME/.codex"
mkdir -p "$HOME/.gemini/skills"
mkdir -p "$HOME/.gemini/config"
mkdir -p "$HOME/.claude/skills"

# 2. Salin seluruh skills ke hub (~/.agents/skills)
if [ -d "$SKILLS_SRC" ]; then
    echo "Menyalin skills ke ~/.agents/skills..."
    cp -R "$SKILLS_SRC"/* "$HOME/.agents/skills/"
    echo "Skills tersalin: $(ls -d "$HOME/.agents/skills"/* | wc -l)"
else
    echo "Error: Direktori sumber skills tidak ditemukan di $SKILLS_SRC"
    exit 1
fi

# 3. Sync outward. Codex discovers ~/.agents/skills directly.
python3 "$SCRIPT_DIR/sync-skills.py" --home "$HOME" --source "$HOME/.agents/skills"

echo "Setup selesai. Codex membaca skill dari ~/.agents/skills."
