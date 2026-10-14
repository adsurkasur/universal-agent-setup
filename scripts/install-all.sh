#!/usr/bin/env bash
# ==============================================================================
# Universal AI Agent Multi-Machine Setup Installer (Linux / macOS)
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUNDLE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SKILLS_SRC="$BUNDLE_ROOT/skills"

echo "=========================================================="
echo "    UNIVERSAL AI AGENT SETUP INSTALLER (POSIX / UNIX)    "
echo "=========================================================="

# 1. Pastikan direktori agent ada
mkdir -p "$HOME/.agents/skills"
mkdir -p "$HOME/.codex/skills"
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

# 3. Sinkronkan ke direktori agent lainnya
echo "Menyinkronkan ke ~/.codex/skills..."
cp -R "$HOME/.agents/skills"/* "$HOME/.codex/skills/"

echo "Menyinkronkan ke ~/.gemini/skills..."
cp -R "$HOME/.agents/skills"/* "$HOME/.gemini/skills/"

echo "Menyinkronkan ke ~/.claude/skills..."
cp -R "$HOME/.agents/skills"/* "$HOME/.claude/skills/"

echo "=========================================================="
echo "Setup selesai! Semua direktori agent kini memiliki 154 skills."
echo "=========================================================="
