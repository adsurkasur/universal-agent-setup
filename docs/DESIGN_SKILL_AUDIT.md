# External design skill review — 2026-11-18

Scope: static source/instruction review; no downloaded script, package install, dev server,
renderer or upstream visual gate was executed. No claimed benchmark of generated designs.
ARSC redesign remains paused until the user says `jalan`.

## Decisions

| Skill | What it is / latest relevant update | License | Risks and instruction quality | Comparison / decision |
|---|---|---|---|---|
| [Stageshow](https://github.com/benjitaylor/skills/tree/299140fafd08df55a9c234e610c3f64af3f45531/stageshow) | Authored faux product scenes, app-window illustrations and cursor stories. Skill 1.1.1; path updated 2026-11-05. | Source MIT (2026 Benji Taylor). NOTICE excludes app-bundle icon artwork; brand registry has separate licenses/terms. | Detailed framing, examples, causal beats, compact layouts, reduced-motion posters, keyframe/rehearsal checklist. Full package asks npm install/dev, React/react-dom/lucide, Vite/Playwright/Chrome; film scripts spawn child processes, load a URL and write outputs. These are operations requiring review, not passive prose. | **Adopt a guarded documentation-only adaptation**, not a replacement for production UI design. It fills the authored-illustration gap better than generic motion advice. No executable kit, logos, artwork or assets vendored. |
| [Kubai Icons](https://github.com/kubai087/kubai-icons/tree/ecccdd11b2008c7b8608dadbcc5a94c3f36c01b6) | Custom layered animated functional icons and static SVG export. Skill 1.2.0; SKILL.md updated 2026-11-14. | Skill is source-available under custom Kubai Icons License. Icon library is separately MIT (LICENSE-ICONS); do not confuse them. | Strong geometric, palette and small-size rules; explicit measurement/check scripts. Distinct shaded/layered style is not automatically compatible with an existing icon system. Chrome scripts write/export files and remove their own temp directories; export/media use OS temp by default. Gallery loads Google Fonts. Engine inserts authored SVG with innerHTML, so treat definitions as trusted source, not user input. | **Skip vendoring; reference only.** Better Icons is a lookup tool; Kubai is an authoring system, so neither replaces the other. Useful optional specialist, not a reason to abandon the user's Phosphor choice. Unmodified free redistribution is allowed, but modified/adapted/translated skill distribution is restricted. Do not create a renamed/translated UAS fork without permission. |
| [Anthropic frontend-design](https://github.com/anthropics/skills/tree/e4bb5d960d87126ff3b3a8af1a104b7db67560ba/skills/frontend-design) | Brief-grounded direction, token plan, restraint, critique and user-facing copy. Path updated 2026-09-03. | Apache-2.0 in skill LICENSE.txt. | Good planning/copy baseline; no scripts, installation or mandatory network fetch in this skill. Aesthetic warnings are heuristics, not permission to override a pinned design system. | **Skip replacement: already current.** Hub and UAS SKILL.md match upstream after newline normalization; zero textual diff. Keep using the current copy. |
| [Vercel web-design-guidelines](https://github.com/vercel-labs/agent-skills/tree/1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62/skills/web-design-guidelines) | UI-code audit entry point; fetches live web-interface-guidelines/command.md. Skill version 1.0.0; path updated 2026-01-16. | No LICENSE/COPYING file found in the pinned agent-skills tree; do not infer MIT from the publisher. | Compact, actionable file:line review, but its real rules are a mutable remote dependency. Fresh fetch is network access and remote content must stay untrusted. No local executable in this skill. | **Skip replacement: already current.** Both hub and UAS match upstream after newline normalization. Re-fetching the rules is separate from updating this wrapper; no extra copy needed. |

## Evidence excerpts

- Stageshow SKILL.md: “These are authored illustrations, not browser automation”. This is the decisive scope distinction: a scripted screen is not E2E evidence.
- Stageshow NOTICE.md excludes `assets/app-icons.ts` from its MIT grant. The UAS addition therefore includes no upstream artwork or brand registry.
- Kubai LICENSE section 5 permits “exact, unmodified copies”; section 6 restricts modified skill distribution. Sections 2–3 distinguish output/engine use from redistribution of generation prompts. [Exact license](https://github.com/kubai087/kubai-icons/blob/ecccdd11b2008c7b8608dadbcc5a94c3f36c01b6/LICENSE).
- frontend-design SKILL.md: “the brief's own words always win”. Keep this over conflicting aesthetic prescriptions.
- Vercel SKILL.md: “Fetch fresh guidelines before each review”. The local wrapper is current even though its remote rule text can change independently.

## Existing hub comparison

Read from C:/Users/super/.agents/skills; these were comparison data, not invoked workflows.

| Existing skill | Strength retained | Relationship to the candidates |
|---|---|---|
| hallmark | Design direction, component/page scope, visual audit and responsive gates. Its fake-chrome prohibition conflicts with Stageshow's illustration purpose. | Keep production/page guidance; use Stageshow only for an explicitly authored illustration. Never apply both sets of absolutes blindly. |
| impeccable 4.7.0 | Persuade/Operate/Read/Experience distinction, critique/hardening and surface briefs. | More relevant for usable application UI. Its launcher can download a binary; it was not run in this review. |
| taste-skill v2 | Subject-specific art direction, copy, browser inspect/look/fix loop. | Strong general design process; Stageshow adds concrete miniature product framing and choreography. Its local scripts/network asset search were not run. |
| frontend-design | Brief-first plan, restraint, critique and plain UX copy. | Already the same upstream content; retain. |
| web-design-guidelines | A11y/focus/form/performance audit via fetched rules. | Complementary technical audit, not art direction; retain current wrapper. |
| better-icons | Iconify search and SVG retrieval across families including Phosphor. | Prefer for existing-family selection. It recommends global/npm installation and can alter MCP setup; no such action was taken. |
| motion-design | Duration/easing/personality and choreography across engines. | Keep functional motion principles; Stageshow adds a scene-specific illustration process. |
| framer-motion | React animation implementation, presence/layout/gesture/performance/reduced motion. | Implementation tool guidance, not a substitute for scene direction or accessibility review. Installation examples were not run. |

## Diff and provenance

Hub frontend-design SKILL.md SHA256 b8009ae690dfa69edc7f08bb8715f32db8817112cfa4388741dbaf876c237df8.
Upstream raw SHA256 d91970639e9f5c37682ac7ab60094d35f1c7c1f38d731bd56396563aee10c1d3.
Hub web-design-guidelines SHA256 17e48da905f83a19c174079b50760a98c069527ba50079239b3c187236627c29.
Upstream raw SHA256 f4647ca866a3accf763777f83e7682954f0187cd6bea7eea0399796652414e8f.
Raw bytes differ; text read with universal newline normalization is identical for both.
UAS copies also match that normalized text. Do not call either stale based on raw hashes alone.

Read-only downloads and scan manifest are under E:/OpenBot/tmp/design-skills-audit.
Stageshow package snapshot: 378 files across the three initial source selections; Kubai's
SKILL.md/PROMPT.md/LICENSE and 14 directly selected supporting files were fetched separately.
The extra Kubai repository-wide text crawl was stopped because website/library files are
not needed to review the skill. This is not a review of every one of the 1,368 repository blobs.
Static inspection covered workflow/reference documents and script network/process/write
surfaces; it is not a vulnerability audit or proof of runtime safety.

No credential-exfiltration or instruction-priority attack was identified in the selected
skill instructions. Mandatory execution directives, mutable remote guidelines, SVG insertion,
and subprocess/temp cleanup remain concrete operational risks. None was followed as an
instruction during this audit. The UAS Stageshow adapter explicitly preserves task/user
priority and separates real verification from staged visuals.

## Integration and remaining approval

Only skills/stageshow and this review are added. The adapter retains upstream MIT LICENSE,
NOTICE and attribution, pins provenance, and uses linked references rather than bundling
executable tools or third-party artwork. It cannot claim to run the upstream rehearsal gate.
No existing skill is replaced, no installer/sync runs, and the live hub is unchanged.

Next approval is **push feat/design-skills and/or sync the reviewed Stageshow adapter into
~/.agents/skills**. Neither is authorized by this task. ARSC redesign still requires `jalan`.
