# Architecture Decision Log (ADR)

## [DEC-010] Token Optimization & High-Efficiency Developer Stack (RTK & Caveman)
- **Status**: Accepted
- **Context**: Long-running agentic development sessions, repetitive test suites (`pytest`, `npm test`, `cargo test`), git inspection (`git log`, `diff`, `status`), and multi-turn refactoring loops heavily bloat the LLM context window. This creates two distinct cost/latency bottlenecks: (1) voluminous raw terminal logs consumed as input tokens, and (2) verbose conversational pleasantries/filler generated as output tokens.
- **Decision**: 
  1. Adopt a dual-axis token optimization strategy:
     - **Input Axis (`rtk`)**: Integrate RTK (Rust Token Killer by `rtk-ai/rtk`) as the standard CLI proxy to filter, collapse, and summarize terminal outputs by 60%–90% without mutating underlying code or exit codes.
     - **Output Axis (`caveman`)**: Integrate Caveman (by Julius Brussee) as the prompt behavioral modifier stripping polite fluff, filler, and unnecessary articles while maintaining 100% byte-for-byte code, path, and error fidelity.
  2. Implement `skills/caveman/SKILL.md` and `skills/rtk/SKILL.md`, advancing the catalog to **202 Unified Skills**.
  3. Integrate **Playbook J: Token Optimization & High-Efficiency Agent Runs** into `skills/skill-router/SKILL.md`.
  4. Preserve critical auto-clarity guardrails in Caveman (dropping brevity for security alerts and destructive operations).
- **Consequences**:
  - Positive: Drastically minimizes token burn rate and context window degradation during prolonged coding sessions.
  - Positive: Accelerates agent response velocity while guaranteeing strict preservation of code blocks, syntax, and paths.

## [DEC-009] Context7 Documentation Retrieval & Grounding Architecture
- **Status**: Accepted
- **Context**: AI models frequently suffer from training cutoff hallucination when generating code for fast-evolving software libraries and modern frameworks (e.g. Next.js 15 App Router caching, React 19 hooks and Server Actions, Tailwind CSS v4 CSS-first configuration, Prisma 6, and modern cloud SDKs). Relying on general web search often returns outdated blog posts, deprecated StackOverflow answers, or SEO noise.
- **Decision**: 
  1. Integrate Context7 as a universal knowledge retrieval suite with dual access mechanisms: MCP server (`@upstash/context7-mcp` providing `resolve-library-id` and `query-docs`) and CLI (`ctx7` via `npx -y ctx7@latest`).
  2. Deploy both the official Upstash `find-docs` skill and a dedicated `context7` orchestrator skill, expanding the catalog to 200 Unified Skills.
  3. Deploy global instructions in `~/.gemini/GEMINI.md`, `~/.claude/CLAUDE.md`, and `~/.codex/instructions.md` instructing agents to query Context7 before generating code or providing advice on framework APIs and migration tasks.
  4. Ensure graceful degradation: if MCP is disabled or unreachable in an environment, agents seamlessly fall back to `npx -y ctx7@latest`.
- **Consequences**:
  - Positive: Guarantees 100% up-to-date, version-specific, hallucination-free code generation for modern APIs.
  - Positive: Seamless operation without mandatory API keys for standard queries, with optional higher limits via `CONTEXT7_API_KEY`.
  - Positive: Unified across all three flagship environments (Antigravity/Gemini, Claude Desktop/Code, and OpenAI Codex).

## [DEC-008] Indonesian Academic Journal Standards (Sinta 1–3) Skill Adoption
- **Status**: Accepted
- **Context**: While ahasa-inti (EYD V) and ahasa-peneliti (academic integrity and IMRaD structure) cover general grammatical and thesis standards, papers submitted to national accredited journals (Sinta 1 to Sinta 3) frequently fall into two extreme traps: conversational storytelling (popular journalism style with casual metaphors and dangling enclitics) or pompous archaisms (archaic medieval conjunctions like *kendati demikian*, *ihwal*, *niscaya*). Furthermore, journals enforce strict paragraph cohesion (at least 3 sentences per paragraph) and domain-specific terminology for applied sciences, agroindustry, and operations research.
- **Decision**: 
  1. Integrate penulisan-ilmiah-sinta as a core skill in the repository and synchronize across all AI agents.
  2. Embed penulisan-ilmiah-sinta into skill-router (Playbook B) for direct invocation when drafting or auditing journal manuscripts.
  3. Expand scripts/test-suite.ps1 to verify Sinta rules alongside EYD V.
- **Consequences**:
  - Positive: Guarantees publication-ready academic Indonesian prose compliant with Sinta 1–3 editorial standards.
  - Positive: Prevents fragmented one-to-two sentence paragraphs and ensures accurate terminology across technical disciplines.

## [DEC-007] Codex TOML Schema Deserialization Defense & Non-Destructive Smart Merging
- **Status**: Accepted
- **Context**: OpenAI Codex crashes completely upon startup if config.toml contains extraneous keys for untagged MCP server enums (e.g. rgs = [] inside a streamable HTTP server [mcp_servers.figma]). Additionally, previous installers skipped configuration updates if files existed, preventing agents from acquiring newly registered MCP servers without manually editing or destroying their configs.
- **Decision**: 
  1. Develop scripts/merge-configs.py that implements safe AST/regex-based smart merging for both JSON and TOML configuration files.
  2. Implement schema sanitization that automatically detects and strips invalid fields (e.g. rgs on HTTP/SSE servers) in Codex TOML.
  3. Ensure automated timestamped backups (.bak_<timestamp>) are created prior to any file writes.
  4. Integrate REA as standard universal MCP server #12 across all agent platforms.
- **Consequences**:
  - Positive: Eliminates brittle manual configuration and prevents fatal startup crashes in ChatGPT Codex.
  - Positive: Non-destructive merging ensures user tokens and custom settings are permanently preserved across updates.

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
