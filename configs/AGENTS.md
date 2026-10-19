# Portfolio Agent Guide & Mandatory Protocols (Managed Projects)

This repository serves as the root orchestration superproject aggregating independent projects and submodules.
All AI agents (Antigravity, Gemini, Claude, ChatGPT/Codex, Cursor, etc.) and human contributors working across this portfolio **MUST** comply with these instructions.

---

## 1. Portfolio Working Principles

1. **Read Core Context**: Read the root `README.md`, `PORTFOLIO_GUIDE.md`, and any project-specific guidelines before changing portfolio-level files.
2. **Project-Specific Scope**: Read the nearest project `README.md`, maintainer guide, and any submodule-specific `AGENTS.md`.
3. **Preserve User Changes**: Inspect the relevant Git worktree and preserve unrelated user changes.
4. **Fact Classification**: Treat every status claim as local, remote-verified, operator-reported, proposed, or unknown.
5. **Security & Privacy**: Never copy credentials, API keys, passwords, or production member data into general documentation.
6. **No Spurious Remote Mutation**: Do not mutate remote services merely because local code or a deployment artifact exists.
7. **Scoped Commits**: Prefer additive documentation and small scoped commits. Do not reorganize paths until dependencies and references are proven safe.
8. **Register Updates**: Update the task register and evidence link when work materially changes project state.

---

## 2. Mandatory Modular Logging Protocol

Every AI agent operating in this portfolio—whether in the root superproject or within any submodule—**MUST** maintain and update the `logs/` directory:

1. **`logs/ACTIVITY_LOG.md` (Session Work Stream)**:
   - At the conclusion of every work session or task execution, append a new entry at the top of the activity log.
   - Required fields: timestamp (`[YYYY-MM-DD HH:MM]`), agent identity/role, session goal, specific actions taken, files modified/created, and verification results.
2. **`logs/DECISION_LOG.md` (Architecture & Methodological Decision Records - ADR)**:
   - Record any significant structural, architectural, algorithmic, dependency, or policy decision as an ADR entry (`[DEC-xxx]`).
   - Required fields: date, status, context, decision made, rationale/alternatives considered, and affected components.
3. **`logs/CHANGELOG.md` (Version & Milestone History)**:
   - Document release versions, milestone completions, and notable updates following the Keep a Changelog standard.
4. **Atomic Git Inclusion**:
   - Log updates **must never be omitted**. Always stage and commit relevant log files in the same atomic commit as the code or documentation changes.

---

## 3. Engineering & Quality Invariants

- **Root Cause over Symptom**: Fix shared utilities and underlying root causes rather than patching one-off symptoms.
- **Verification is Mandatory**: Every non-trivial change must leave behind a runnable verification check (test suite, verification script, or assertion check).
- **Preserve Documentation Integrity**: Do not delete unrelated comments, docstrings, or architectural notes without explicit instructions.

---

## 4. RTK - Rust Token Killer

RTK filters and compresses command output before it reaches the LLM context (60-90% fewer tokens).

- Prefix supported CLI commands with `rtk`: `rtk git status`, `rtk ls src/`, `rtk grep "pattern" src/`, `rtk find "*.rs" .`, `rtk npm test`, `rtk cargo test`, `rtk docker ps`, `rtk gh pr list`.
- Do not prefix PowerShell cmdlets (`Get-ChildItem`, `Select-String`, ...) or commands whose raw output you must parse exactly; use `rtk proxy <cmd>` when you need unfiltered output.
- Meta: `rtk gain` (savings), `rtk gain --history`, `rtk discover` (missed opportunities).
