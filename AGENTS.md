# 🤖 AI AGENT OPERATIONAL DIRECTIVE & AUTOMATED INSTALLATION GUIDE

> **ATTENTION AI AGENT (Antigravity, Claude Code, Codex, Cursor, Cline, Copilot, or similar):**
> If the user has cloned this repository and asked you to "scan", "install", "setup", or "configure" the agents/skills on this machine, **follow the execution instructions below immediately**.

---

## 🎯 Primary Agent Objective
You are tasked with replicating this standardized multi-agent setup onto the host machine.
This repository contains:
1. **154 Unified Skills** in `skills/` (covering Engineering Superpowers, Matt Pocock, Ponytail, Scientific Writing, Vercel React, BigQuery/GCP, Bio/Science, and Project Logging).
2. **Standard MCP Server Configurations** in `configs/` (`drawio`, `ripple`, `android-emulator`, `arduino`).
3. **Automated Setup Scripts** in `scripts/`.

---

## ⚡ Execution Protocol for AI Agents

### Step 1: Detect Operating System
Inspect the environment:
- If running on **Windows** (PowerShell/CMD): proceed to **Protocol Windows**.
- If running on **macOS / Linux / WSL** (Bash/Zsh): proceed to **Protocol POSIX**.

---

### Step 2A: Protocol Windows (PowerShell)
Execute the automated installer script located in this repository:

```powershell
# Run the installation script
& ".\scripts\install-all.ps1"
```

If execution policies restrict running scripts, execute with bypass:
```powershell
powershell.exe -ExecutionPolicy Bypass -File ".\scripts\install-all.ps1"
```

What `install-all.ps1` does:
1. Creates `$HOME\.agents\skills`, `$HOME\.codex\skills`, `$HOME\.gemini\skills`, `$HOME\.claude\skills`.
2. Copies all 154 skills to each location.
3. Automatically detects local Android SDK & Arduino CLI paths.
4. Generates/merges MCP configurations for Antigravity (`~/.gemini/config/mcp_config.json`), Claude Desktop (`%APPDATA%\Claude\claude_desktop_config.json`), and ChatGPT Codex (`~/.codex/config.toml`).

---

### Step 2B: Protocol POSIX (Linux / macOS)
Execute the shell installer:

```bash
chmod +x ./scripts/install-all.sh
./scripts/install-all.sh
```

---

### Step 3: Verification
Verify that the skills are properly distributed by running:

**On Windows (PowerShell):**
```powershell
[PSCustomObject]@{
    SharedHub = (Get-ChildItem "$env:USERPROFILE\.agents\skills" -Directory -ErrorAction SilentlyContinue).Count
    Codex     = (Get-ChildItem "$env:USERPROFILE\.codex\skills" -Directory -ErrorAction SilentlyContinue).Count
    Gemini    = (Get-ChildItem "$env:USERPROFILE\.gemini\skills" -Directory -ErrorAction SilentlyContinue).Count
    Claude    = (Get-ChildItem "$env:USERPROFILE\.claude\skills" -Directory -ErrorAction SilentlyContinue).Count
}
```

**On Linux/macOS (Bash):**
```bash
echo "Shared: $(ls -d ~/.agents/skills/* 2>/dev/null | wc -l)"
echo "Codex:  $(ls -d ~/.codex/skills/* 2>/dev/null | wc -l)"
echo "Gemini: $(ls -d ~/.gemini/skills/* 2>/dev/null | wc -l)"
echo "Claude: $(ls -d ~/.claude/skills/* 2>/dev/null | wc -l)"
```

Expected result: Each directory should report **154** skills (plus any system directories).

---

### Step 4: Final Report to the User
After successful execution, provide the user with a concise summary:
1. Confirm that all 154 skills were successfully copied to `~/.agents`, `~/.codex`, `~/.gemini`, and `~/.claude`.
2. Remind them to:
   - **For ChatGPT Desktop**: Start a **New Chat** (or restart the app) so that `/grill-me` and all skills are re-indexed.
   - **For Claude Desktop**: Restart the app so the new MCP servers (`drawio`, `ripple`, etc.) are recognized.
3. Inform them that whenever they want to add new skills, they can place them into `~/.agents/skills/` and run `.\scripts\sync-skills.ps1`.
