# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.0] - 2026-10-30

### Added
- **1 New Unified Skill** (total skills increased from 196 to 197):
  - nti-slop-presentation: Human-level, non-cliché presentation engineering framework eliminating AI tropes, generic 3D orbs, low-contrast slides, and empty corporate buzzwords.
  - Added sub-skills compose-preview and device-hub to ndroid-cli.
- **12th Universal Active MCP Server**:
  - 
ea: Reverse Engineer Anything (
ea-agents@6.7.0 mcp) integrated across all agent templates (Codex TOML, Claude Desktop JSON, Claude Code, and Antigravity).
- **Non-Destructive Smart Config Merging (scripts/merge-configs.py)**:
  - Safely merges missing MCP servers into existing JSON and TOML configurations without destroying existing user settings, tokens, or custom paths.
  - Implements automatic timestamped backup creation (.bak_<timestamp>).
- **High-Performance SHA-256 Hash Skill Synchronizer (scripts/sync-skills.ps1)**:
  - Upgraded from simple robocopy timestamps to cryptographic SHA-256 hash comparison with CRLF/LF line-ending normalization.
  - Synchronizes across 5 active agent targets: ~/.agents/skills, ~/.codex/skills, ~/.gemini/config/skills, ~/.gemini/skills, and ~/.claude/skills.

### Fixed
- **Codex TOML Schema Deserialization Crash**:
  - Identified and fixed critical bug in ~/.codex/config.toml where [mcp_servers.figma] included rgs = [], triggering ailed to load workspace requirements: invalid configuration at config.toml:205:1. Streamable HTTP MCP servers in Codex cannot have arguments.
  - Added auto-sanitization to merge-configs.py to permanently prevent this crash.

## [1.5.0] - 2026-10-29

### Added
- **1 New Unified Skill** (total skills increased from 195 to 196):
  - `play-console`: Universal Google Play Developer Console management skill covering app tracks (internal, alpha, beta, production), releases, staged rollouts, release notes, reviews, store listings, and Android Vitals (crash rate, ANRs).
- **1 New Active MCP Server** (total active MCP servers increased from 10 to 11):
  - `play-console`: Official `@orellbuehler/play-console-mcp@0.3.1` server registered across Google Antigravity, Anthropic Claude Desktop, and OpenAI ChatGPT Codex.
- **Dynamic Service Account Key Path Detection**:
  - `scripts/install-all.ps1` dynamically detects Google Service Account credentials (`GOOGLE_SERVICE_ACCOUNT_KEY_PATH` or default `~/.gemini/play-console-key.json`).

## [1.4.0] - 2026-10-23

### Added
- **2 New Unified Skills** (total skills increased from 193 to 195):
  - `deck-builder`: Universal presentation engineering framework supporting Talk Mode (narrative, vector illustrations, exact photo cropping via Sharp) and Analytical Mode (assertion takeaways, method steps, zebra-striped data tables, zero manual number binding) using PptxGenJS and Sharp.
  - `reverse-engineer-anything` (REA): Universal reverse engineering suite by `morluto` for analyzing native binaries, managed artifacts (PE/CLI), Electron/JS web bundles, APKs, and firmware with 207 MCP tools.
- **Node.js Global Dependencies**: Provisioned `pptxgenjs`, `sharp`, `react`, `react-dom`, and `react-icons` with permanent `%NODE_PATH%` configuration.
- **Multi-Agent Hub Distribution**: Synchronized across 64 AI agent hubs on workstation.

### Changed
- Rebuilt `agent-setup-bundle.zip` to include all 195 unified skills.
- Updated `README.md`, `AGENTS.md`, `SOURCES.md`, `scripts/install-all.ps1`, `DECISION_LOG.md`, and `ACTIVITY_LOG.md`.

## [1.3.1] - 2026-10-21

### Added
- **Attribution & Transparency**: Added `SOURCES.md` comprehensively detailing upstream authors, repositories, and licenses across all 193 skills and 10 MCP servers.
- **Repository License**: Added `LICENSE` (MIT) with explicit third-party open-source disclaimer for compilation copyright.
- **`readme-generator` Skill**: Professional README auditing and creation tool (total skills increased from 192 to 193).

### Changed
- **README Overhaul**: Enhanced `README.md` with shields.io badges, personal workstation usage disclaimer, and direct links to `SOURCES.md` and `LICENSE`.
- Rebuilt `agent-setup-bundle.zip` (20.35 MB).

## [1.3.0] - 2026-10-21

### Added
- **9 New Unified Skills** (total skills increased from 183 to 192):
  - `skill-router`: Universal Agent Orchestrator & Capability Router for intelligent skill and MCP tool dispatching.
  - `bahasa-inti`: Official Indonesian language standards adhering to EYD Edisi V and KBBI VI with strict anti-slop rules.
  - `bahasa-peneliti`: Academic, thesis (skripsi), and research paper writing standards with zero-tolerance for hallucinated citations.
  - `playwright`: End-to-end browser automation, visual assertions, and resilient DOM testing.
  - `threejs-fiber`: 3D WebGL development using Three.js and React Three Fiber (R3F).
  - `shadcn-ui`: Modern component architecture using Radix UI primitives and Tailwind CSS.
  - `tailwind-v4`: Modern CSS-first `@theme` architecture for Tailwind CSS v4.
  - `typst`: Modern scientific typesetting and thesis document preparation (faster alternative to LaTeX).
  - `remotion`: Programmatic video creation in React and TypeScript.
- **4 New MCP Servers** (total MCP servers increased from 6 to 10):
  - `playwright`: Live browser automation and visual screenshot verification.
  - `chrome-devtools`: Direct Chromium debugging with dynamic Microsoft Edge / Google Chrome detection.
  - `github`: Full GitHub repository, PR, issue, and CI/CD operations via active GitHub CLI credentials.
  - `context7`: Real-time version-accurate library documentation injection.
- **Enhanced Installer**:
  - `scripts/install-all.ps1` dynamically detects installed Chromium browser (Edge or Chrome) and extracts local GitHub CLI tokens.
  - Rebuilt `agent-setup-bundle.zip` (20.3 MB).

## [1.2.0] - 2026-10-21

### Added
- **9 New Unified Skills** (total skills increased from 174 to 183):
  - `better-icons`, `hallmark`, `humanizer`, `impeccable`, `lottie-maker`, `motion-design`, `stop-slop`, `taste-skill`, `framer-motion`.
- **`better-icons` MCP Server**:
  - Registered across Antigravity, Claude Code, Claude Desktop, and Codex runtimes.
- **Activity & Decision Logs**:
  - Initialized `logs/ACTIVITY_LOG.md`, `logs/DECISION_LOG.md`, and `logs/CHANGELOG.md`.

## [1.1.0] - 2026-10-20
### Added
- Initial two-way sync across local machine and remote repository (174 unified skills, 5 MCP servers).
