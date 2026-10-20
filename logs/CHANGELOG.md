# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
