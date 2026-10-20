<div align="center">

# README Generator

Turn your repo into a professional, consistent README — powered by real project data.

</div>

## What is this?

README Generator is an Agent Skill that automates README creation and improvement. Point it at any project — library, app, CLI, monorepo — and it scans the repo, detects the tech stack, and produces a structured, badge-rich README based on real project data. It never fabricates metadata: if something doesn't exist, it's left out.

Works with **Cursor**, **GitHub Copilot**, **Claude Code**, and any agent that supports the skills spec.

## How it works

The skill follows a deterministic 6-step workflow defined in `SKILL.md`:

1. **Scan** — runs `scripts/scan_project.sh` to collect project name, license, git remote, package manager, tech stack, CI setup, and social links as structured JSON
2. **Read best practices** — loads `references/readme-best-practices.md` for structure and tone guidance
3. **Build** — fills `assets/readme-template.md` placeholders with real project data; adapts sections to the project type
4. **Badge** — selects only applicable badges from `assets/badges.json` (shields.io, `style=for-the-badge`)
5. **Validate** — checks output against assertions in `evals/evals.json` (no leftover placeholders, no fabricated badges, proportional length)
6. **Diagram** *(optional)* — adds a Mermaid architecture diagram from `assets/diagrams.md` for multi-component projects

## Project Structure

```
readme-generator/
├── assets/
│   ├── badges.json          # shields.io badge catalog (status, social, extras)
│   ├── diagrams.md          # Mermaid diagram templates by project type
│   └── readme-template.md  # Base README template with {{PLACEHOLDER}} markers
├── evals/
│   └── evals.json           # Eval assertions for 4 scenario types
├── references/
│   └── readme-best-practices.md  # Structure, tone, pitfalls guide
├── scripts/
│   └── scan_project.sh      # Repo metadata scanner (local + GitHub API)
└── SKILL.md                 # Skill entry point — start here
```

## Documentation

| Resource | Description |
|----------|-------------|
| [`SKILL.md`](./SKILL.md) | Skill definition and full workflow instructions |
| [`references/readme-best-practices.md`](./references/readme-best-practices.md) | Writing tone, structure order, and common pitfalls |
| [`assets/readme-template.md`](./assets/readme-template.md) | Base template with placeholder markers |
| [`assets/badges.json`](./assets/badges.json) | Full badge catalog with shields.io URLs |
| [`assets/diagrams.md`](./assets/diagrams.md) | Mermaid diagram templates by architecture type |
| [`evals/evals.json`](./evals/evals.json) | Evaluation scenarios and pass/fail assertions |

## Installation

```bash
npx skills add YOUR-USERNAME/readme-generator
```

Or install manually by cloning this repo into your skills directory and referencing `SKILL.md` from your agent configuration.

## Usage

Once installed, trigger the skill with natural language in any supported agent (Cursor, GitHub Copilot, Claude Code, etc.):

```
"Write a README for this project."
"Make my repo look more professional."
"Add shields.io badges to my README."
```

The agent reads `SKILL.md` and executes the full workflow automatically.

## Evals

Four evaluation scenarios are defined in `evals/evals.json`:

| Scenario | Description |
|----------|-------------|
| `straightforward-request` | Standard README generation from a typical prompt |
| `casual-request` | Triggered by informal language ("make it look professional") |
| `minimal-project` | Ensures output is proportional for small scripts |
| `badge-focus` | Validates badge correctness when badges are the explicit goal |
