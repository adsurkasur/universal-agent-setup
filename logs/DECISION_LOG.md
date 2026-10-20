# Architecture Decision Log (ADR)

## [DEC-003] Meta-Skill Orchestrator Architecture (skill-router)
- **Status**: Accepted
- **Context**: As the skill arsenal scales past 180+ skills and 10 MCP servers, agents suffer from "skill blindness" and difficulty orchestrating complex multi-skill pipelines (e.g. chaining planning, art direction, component architecture, icon retrieval, motion, and browser verification).
- **Decision**: Adopt the proven 6-stage lifecycle from `Liber1917/skill-router` (`ENTRY GUARD` -> `SCAN` -> `MATCH` -> `LOAD GUARD` -> `VERIFY HOOK` -> `CONTROL HOOK`) and upgrade it into a bilingual (ID/EN) meta-skill that coordinates both Skills and MCP tools, with pre-configured playbooks for Frontend Craft, Academic Writing, Bugfixing, 3D/Motion, Cloud, and Hardware.
- **Consequences**:
  - Positive: Guarantees reliable skill discovery and systematic multi-step execution.
  - Positive: Drastically cuts token waste by eliminating the need to brute-force inspect entire skill trees.

## [DEC-004] Formal Indonesian Language Standards Adoption (EYD V & KBBI VI)
- **Status**: Accepted
- **Context**: AI models frequently produce Indonesian text with machine-translation artifacts, incorrect comma usage before subordinating conjunctions (*sehingga, bahwa*), decorative em dashes, and outdated non-standard spelling.
- **Decision**: Integrate `bahasa-inti` and `bahasa-peneliti` from `alvinindra/bahasa-skills` based on official Kepmendikbudristek No. 342/M/2022 (EYD Edisi V), KBBI Daring VI, and Ivan Lanin's linguistic frameworks.
- **Consequences**:
  - Positive: High-quality, publication-ready academic and content writing without AI slop.
  - Positive: Direct adherence to Indonesian thesis (skripsi) and journal formatting standards.

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
