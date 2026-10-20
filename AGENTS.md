# AI AGENT OPERATIONAL DIRECTIVE & AUTOMATED INSTALLATION GUIDE

> **ATTENTION AI AGENT (Antigravity, Claude Code, Codex, Cursor, Cline, Copilot, or similar):**
> If the user has cloned this repository and asked you to "scan", "install", "setup", or "configure" the agents/skills on this machine, **follow the execution instructions below immediately**.

---

## Primary Agent Objective
You are tasked with replicating this standardized multi-agent setup onto the host machine.
This repository contains:
1. **193 Unified Skills** in `skills/` (covering `skill-router` Meta-Orchestrator, Indonesian EYD V & KBBI standards, Engineering Superpowers, Matt Pocock, Ponytail, GSAP & Framer Motion Animation, Three.js 3D, Lottie Motion Design, Taste & Impeccable Craft, Humanizer & Anti-Slop Writing, Scientific Writing, Typst, Remotion, Readme Generator, Shadcn UI, Tailwind v4, Playwright, Vercel React, BigQuery/GCP, Bio/Science, and Project Logging).
2. **Standard 10 MCP Server Configurations** in `configs/` (`playwright`, `chrome-devtools`, `github`, `context7`, `better-icons`, `figma`, `drawio`, `ripple`, `android-emulator`, `arduino`).
3. **Automated Setup Scripts** in `scripts/`.

---

## Execution Protocol for AI Agents

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
2. Copies all 193 skills to each location.
3. Automatically detects local browser path (Chrome/Edge), Android SDK, Arduino CLI, and GitHub CLI auth token.
4. Generates/merges 10 MCP configurations for Antigravity (`~/.gemini/config/mcp_config.json`), Claude Desktop (`%APPDATA%\Claude\claude_desktop_config.json`), and ChatGPT Codex (`~/.codex/config.toml`).

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

Expected result: Each directory should report the unified skill set (193 skills, plus any environment-specific overrides).

---

### Step 4: Final Report to the User
After successful execution, provide the user with a concise summary:
1. Confirm that all 193 skills were successfully copied to `~/.agents`, `~/.codex`, `~/.gemini`, and `~/.claude`.
2. Remind them to:
   - **For ChatGPT Desktop**: Start a **New Chat** (or restart the app) so that `/grill-me`, `skill-router`, and all skills are re-indexed.
   - **For Claude Desktop**: Restart the app so the 10 MCP servers (`playwright`, `chrome-devtools`, `github`, `context7`, etc.) are recognized.
3. Inform them that whenever they want to add new skills, they can place them into `~/.agents/skills/` and run `.\scripts\sync-skills.ps1`.
