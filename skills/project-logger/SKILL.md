---
name: project-logger
description: Portfolio-wide guide and protocol for AI agents to record modular logs, track decisions, and maintain submodule hygiene in managed projects.
---

# Project Logger Skill (Superproject & Submodules)

This skill provides step-by-step procedures for AI agents to maintain modular logs and manage submodule handoffs.

## 1. Directory Structure

Each repository (the superproject root and every submodule) maintains:
- `logs/ACTIVITY_LOG.md`: Chronological session work stream.
- `logs/DECISION_LOG.md`: Architecture Decision Records (`[DEC-xxx]`).
- `logs/CHANGELOG.md`: Version release notes.

## 2. Standard Session Workflow

1. **Pre-Flight**:
   - Check `logs/ACTIVITY_LOG.md` and `logs/DECISION_LOG.md` to learn the current operational state.
2. **Execute Work**:
   - Apply edits, refactors, or new features.
3. **Document**:
   - Add new entry to `logs/ACTIVITY_LOG.md`.
   - If design/architecture was modified, record `[DEC-xxx]` in `logs/DECISION_LOG.md`.
   - If version or milestone changed, update `logs/CHANGELOG.md`.
4. **Commit & Push**:
   - In submodule: `git add <files> logs/ AGENTS.md && git commit && git push`
   - In superproject: update submodule pointer, update superproject `logs/ACTIVITY_LOG.md`, commit and push.
