# Architecture Decision Log (ADR)

## [DEC-006] Google Play Developer Console (play-console) MCP & Universal Skill
- **Status**: Accepted
- **Context**: Mobile app developers and AI pair programmers need seamless direct querying, track management, release deployment, staged rollout adjustments, user reviews handling, and Android Vitals diagnostics directly from prompt interactions without manual browser dashboard overhead.
- **Decision**: 
  1. Register `@orellbuehler/play-console-mcp@0.3.1` across Google Antigravity, Anthropic Claude Desktop, and OpenAI ChatGPT Codex.
  2. Implement `skills/play-console/SKILL.md` documenting publishing workflows, track promotion, version code integrity, and vitals query syntax.
  3. Support parameterized Google Service Account JSON path via `GOOGLE_SERVICE_ACCOUNT_KEY_PATH` with workstation default at `~/.gemini/play-console-key.json`.
- **Consequences**:
  - Positive: All workstation AI agents can inspect releases, draft updates, monitor ANRs/crashes, and reply to Google Play reviews.
  - Positive: Standardized MCP configuration ensures identical tools and parameters across Claude, ChatGPT, and Antigravity.


## [DEC-005] Presentation Engineering (deck-builder) & Reverse Engineering (REA)
- **Status**: Accepted
- **Context**: AI agents often produce PowerPoint presentations with generic templated layouts, stretched images, and manual typos in analytical figures. Furthermore, agents lacked a standardized reverse-engineering suite for inspecting binaries, web bundles, and native packages.
- **Decision**: 
  1. Integrate `deck-builder`, establishing a dual-mode presentation architecture (Talk Mode for narrative persuasion and Analytical Mode for academic defense) using PptxGenJS and Sharp image pre-cropping.
  2. Integrate `reverse-engineer-anything` (REA by morluto) providing 207 MCP tools and 153 CLI commands for deep multi-target decompilation, disassembly, and dynamic runtime observation.
- **Consequences**:
  - Positive: Guarantees publication-grade, aspect-ratio-accurate PPTX generation directly from agent code without manual polishing.
  - Positive: Equips all 64 workstation agents with binary, managed, web, and firmware reverse engineering capabilities out-of-the-box.

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
