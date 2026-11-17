---
name: rtk
description: "RTK (Rust Token Killer) CLI proxy for compressing terminal command outputs (git, tests, build logs) by 60-90% to save LLM context window tokens. Use for /rtk, 'rtk gain', 'token reduction', 'compress cli output'."
---

# RTK (Rust Token Killer) CLI Proxy & Token Optimizer

`rtk` is an ultra-fast CLI proxy written in Rust that intercepts and compresses terminal command outputs before sending them to the LLM context window. It eliminates progress bars, repetitive build logs, verbose test summaries, and empty whitespace, delivering **60% to 90% token reduction** with zero changes to exit codes or underlying code.

## 1. Quick Installation

### Windows
- **Via winget (Recommended)**:
  ```powershell
  winget install rtk-ai.rtk
  ```
- **Via Direct Binary Download**:
  Download `rtk-x86_64-pc-windows-msvc.zip` from [github.com/rtk-ai/rtk/releases](https://github.com/rtk-ai/rtk/releases), extract `rtk.exe`, and place it in your system `PATH` (e.g. `$env:USERPROFILE\.local\bin` or `C:\ProgramData\chocolatey\bin`).

### macOS & Linux
- **macOS (Homebrew)**:
  ```bash
  brew install rtk
  ```
- **Curl script (Linux / macOS)**:
  ```bash
  curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh
  ```
- **Via Cargo (Rust)**:
  ```bash
  cargo install --git https://github.com/rtk-ai/rtk
  ```

## 2. CLI Initialization & Hooks

Initialize RTK globally or for your active agent session:
```bash
rtk init -g
```
This configures shell hooks (for Claude Code, Cursor, Codex, and terminal agents) to automatically wrap high-verbosity commands.

## 3. Command Usage & Compression Mapping

Prefix verbose terminal commands with `rtk` when running shell commands via agent run_command tools:

| Verbose Command | RTK Wrapped Command | Average Token Reduction |
| :--- | :--- | :--- |
| `git log -n 50` | `rtk git log -n 50` | **~92%** |
| `git status` | `rtk git status` | **~76%** |
| `git diff` | `rtk git diff` | **~56%** |
| `pytest` / `vitest` | `rtk pytest` / `rtk vitest` | **~70%** (collapses passing tests) |
| `cargo test` / `cargo build` | `rtk cargo test` | **~65%** |
| `npm test` / `pnpm test` | `rtk npm test` | **~68%** |
| `docker build` | `rtk docker build` | **~80%** (strips layer spam) |

### When to Skip RTK
- Interactive CLI commands requiring terminal input or REPLs.
- Low-output commands (<100 characters) where overhead is negligible.
- When full, raw debug log stacktraces are explicitly requested by the user.

## 4. Savings Analytics & Gain Reporting

Track accumulated token savings and cost reductions:
```bash
# Display summary scoreboard of saved tokens
rtk gain

# Display historical log of compressed command runs
rtk gain --history
```
