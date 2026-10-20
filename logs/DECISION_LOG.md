# Architecture Decision Log (ADR)

## [DEC-001] Centralized Hub Pattern for Cross-Agent Skills Synchronization
- **Status**: Accepted
- **Context**: Different AI agent environments (Claude, Codex, Antigravity) expect skills in different directory paths (`~/.claude/skills`, `~/.codex/skills`, `~/.gemini/skills` or `~/.gemini/config/skills`). Maintaining duplicate independent directories leads to configuration drift and missing skills.
- **Decision**: Designate `~/.agents/skills` as the authoritative single source of truth (Hub). All agent skill directories are either symlinked/junctioned or unidirectionally linked/synced from `~/.agents/skills` using `sync-agents.ps1`.
- **Consequences**:
  - Positive: Adding or updating a skill once in `~/.agents/skills` automatically propagates to all agents.
  - Positive: Eliminates divergence across agents on multi-agent workstations.
  - Negative: Specialized plugin directories (like Antigravity builtin skills) need explicit skip guards during adoption to prevent overwriting vendor bundles.

## [DEC-002] Uniform MCP Server Registration Architecture
- **Status**: Accepted
- **Context**: MCP servers are defined in distinct formats across toolchains (`json` for Antigravity & Claude, `toml` for Codex). Tools like `better-icons`, `ripple`, `drawio`, `arduino`, and `android-emulator` need to be accessible uniformly across all agent runtimes.
- **Decision**: Register MCP servers across all 4 configuration targets (`mcp_config.json`, `mcp.json`, `claude_desktop_config.json`, and `config.toml`) with standard `npx -y` commands, standardizing parameter naming and environment variables.
- **Consequences**:
  - Positive: All agents have access to identical MCP tools without environment mismatches.
