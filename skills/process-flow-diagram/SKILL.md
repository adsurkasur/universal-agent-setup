---
name: process-flow-diagram
description: Create clean process flow diagrams as a single self-contained HTML file with inline SVG (no libraries, works offline). Use for workflows, process maps, SOPs, approval flows, production or agro-industrial process steps, and automation sequences with manual steps, automated steps, integrations, and decision branches.
license: MIT
---

# Process Flow Diagram (HTML + inline SVG)

Output: one `.html` file (inline `<style>` + `<svg>`, no external assets) saved where the user can open it. Render it yourself in a browser if your environment allows, and check it before delivering.

## 1. Model the process first
List the steps as data before drawing:
```
id | label (≤ 5 words) | type | next (id or "yes:id / no:id") | note (optional)
```
Types and their shapes:
| type | shape | use for |
|---|---|---|
| start / end | pill (fully rounded rect) | trigger and outcome |
| manual | rounded rectangle | a person does it |
| auto | rectangle with thicker left accent bar | system/script does it |
| integration | rectangle with double border | data goes to/from another system |
| decision | diamond | yes/no or multi-way branch; label every outgoing edge |

## 2. Layout rules
- Main path runs left-to-right (or top-to-bottom for > 7 steps on narrow screens). Branches go below the main path and rejoin forward, never backward over other nodes.
- Fixed grid: node 180×64, column gap 60, row gap 70. Compute `x = pad + col*(w+gap)`, `y = pad + row*(h+gap)`; set the `viewBox` from the grid so nothing is clipped.
- Edges: orthogonal `<path>` with `marker-end` arrowheads; label decision edges near their start.
- Text inside a node: centered, ≤ 2 lines, 14-15 px; put detail in a legend or notes list under the diagram, not in the box.
- Include a small legend for the node types actually used, a title, and optionally numbered steps.

## 3. Style (dark theme, tokens on :root)
```html
<style>
:root{--bg:#0f172a;--panel:#111827;--ink:#e5e7eb;--muted:#94a3b8;--line:#64748b;
--manual:#1e3a8a;--auto:#065f46;--integ:#6b21a8;--decision:#92400e;--term:#334155}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.4 system-ui,Segoe UI,sans-serif}
.wrap{max-width:1200px;margin:auto;padding:24px 16px}
svg{width:100%;height:auto}
.node text{fill:var(--ink);font-size:14px;text-anchor:middle;dominant-baseline:middle}
.edge{fill:none;stroke:var(--line);stroke-width:2}
.elabel{fill:var(--muted);font-size:12px}
</style>
```
Arrowhead: `<marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="#64748b"/></marker>`.
Diamond: `<polygon points="cx,cy-h/2 cx+w/2,cy cx,cy+h/2 cx-w/2,cy">`.

Generate the SVG from the step table with a short script (Python/JS) when there are more than ~6 steps; hand-placing coordinates invites overlaps.

## 4. QA
- Every step from the table appears once; every decision edge has a label; no edge crosses a node.
- Text fits inside its shape (shorten labels rather than shrinking font).
- Page works at phone width (SVG scales; no horizontal scroll).
