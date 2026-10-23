---
name: "deck-builder"
description: "Build any presentation deck (.pptx) end to end, talk or analytical: full grill, script and docs, credited images, layout recipes, pptxgenjs build, QA, verified delivery."
---

# Deck Builder (universal)

Use this for any presentation that will be delivered or graded: webinar talks, keynotes, guest lectures, pitches, coursework, thesis or research presentations, data analyses. It encodes two decks that worked well: a narrative talk deck (story, photos, vector illustrations, 43 slides with notes) and an analytical deck (method steps, charts, tables, worked calculations, field photos). Pick a mode in Phase 1; everything else is shared. Follow the phases in order; each one feeds the next.

## Modes

| | Talk mode | Analytical mode |
| :--- | :--- | :--- |
| Purpose | persuade, inspire, reframe | explain a method and defend results |
| Titles | short labels ("The Lab Trap") plus tinted statement slides for key lines | full-sentence assertion titles stating the takeaway ("The problem shows in the data: daily supply swings sharply") |
| Numbered circle before title | section number (1–4) in that section's color | method step number (1–7), matching a process-timeline slide |
| Visual weight | photos, vector illustrations, big statements | charts, tables, formulas, worked examples, field photos |
| Evidence | validated anecdotes, cited cases | data bound from analysis output, cited literature |

Both modes use: a source line on every slide with outside facts or images, a section label, speaker notes, backup slides, and a references or sources-and-credits slide.

## Core principles

- **Story before slides.** One core message (talk) or one research-question chain (analytical). Every slide is tested against it; cut or merge what does not serve it.
- **Honesty over polish.** Use the exact status verb the owner confirms (designed, built, in progress, tested). Quote numbers exactly as sources state them and say what they measure (accuracy vs detection rate, validation set vs total). Never caption an image with more than is known (location, whether it is a promo render).
- **Owner's real evidence.** Ask for personal anecdotes and field documentation. Label non-business experience honestly (research, student org, competitions) and draw the lesson explicitly. Anonymize third parties; describe patterns, not people.
- **Numbers come from data, not typing.** In analytical mode the build script reads every result from the analysis output (JSON/CSV) and formats it in the audience's locale; slides and notes use the same variables.
- **Verify before reporting done:** image content, figure sources, rendered slides, and the delivered file's hash on the target machine.

## Phase 1: Grill (always full, in rounds, using the question tool)

Ask only questions whose prerequisites are settled; give a recommended answer for each; end with a summary of locked decisions and get explicit confirmation before building.

1. **Frame:** event or course, audience (language, native/non-native mix, expertise), duration and Q&A, mode (talk/analytical), deliverables, deadline.
2. **Message and structure:** the one sentence to remember, or the research questions; sections with minutes (about 1.5–2 min per content slide, 3–4 sections for 30 min); what to cut or merge (idea banks are usually too dense); how to frame region-specific examples for mixed audiences (universal pattern plus local illustration).
3. **Evidence:** which personal experiences, field photos, data files, and papers exist; framing of non-business experience; anonymity of friends and colleagues; how openly to state project or venture stage. For each anecdote, ask which details actually happened (multi-select) and drop the rest. Material drafted by another AI often contains invented specifics; strip them and record them as "claims removed".
4. **Delivery:** hook (a provocative question works well and can be echoed at the close), closing (one reflection question or a small task; "Let's discuss" when the speaker is not positioning as an expert), interaction, register (plain English for mixed audiences), full script vs talking points with memorized key lines, the hardest likely question and the stance for it.
5. **Production:** visual style (default: palette derived from the topic), image licensing stance, missing photos (illustration plus placeholder), logos, speaker-notes content, backup slides, output language.

## Phase 2: Documents (markdown, kept in sync)

- `01-context.md`: profile, positioning, every decision, verified facts with sources, validated anecdotes, claims removed, sensitivity limits, Q&A table, open checklist, and a closing "deck status" section listing image and figure sources per slide.
- `02/03-material-<lang>.md`: full material per section with time budget, section message, transitions (one file per language when bilingual).
- `04-script.md`: spoken script; mark `` `[SLIDE n]` ``, `**[KEY]**` for lines to memorize, `(pause)`, `*(optional)*`; estimate length at about 130 words/min and label it an estimate.
- `05-outline.md`: per slide: slide text, spoken points, visual notes; plus backup slides and sources.

Any later change (status, wording, source, image) is applied to every affected document and the deck in the same pass.

## Phase 3: Images, figures, data

- **Free-licensed photos:** Wikimedia Commons API with a real User-Agent (CC0, PD, CC BY, CC BY-SA). Cloud IPs often get HTTP 429; run search and download from the user's machine if needed. Log every file in `assets/ATTRIBUTION.md` (file, title, author, license, page URL).
- **Product/media images:** fine for educational commentary with the source cited. Take the image URL from the source page and log the page URL. If no solid source is found, give the user a shopping list (save-as filename, search keywords, what to record: the source page URL, not the search engine URL).
- **Paper figures:** `pdfimages -j` from the provided PDF; credit the paper in the caption.
- **Field photos:** the owner's own documentation is the strongest evidence; caption with what, where, and date.
- **Charts:** generate from the analysis code at high resolution, then insert keeping aspect ratio.
- Look at every image on a contact sheet before use. Reject images that do not show what the slide claims (a building instead of a lab, a promo render presented as a real factory, a plant in the wrong country). Move replaced files to `assets/_unused/` and note it in the attribution file.

## Phase 4: Layout system

Default canvas `LAYOUT_WIDE` (13.333 x 7.5 in). Grid and type:

- Margins 0.6 in; title band y 0.30, h 0.85; content area y 1.35 to 6.85; footer y 7.0 (source line left in 11 pt italic grey, section label right in 10 pt grey); small slide number top right.
- Headings in a serif (Cambria) 28 pt bold in the dominant dark color; body in a sans (Arial or Calibri) 15–18 pt; captions 11–13 pt; big stats 26–66 pt. Left-aligned titles.
- Palette from the topic: one dominant dark color (60–70% weight), one light tint for cards, one warm highlight for emphasis, one alarm color used sparingly; in talk mode one accent per section.
- Cards: rounded rectangles, radius 0.08, tint fill, no border; highlight a single card or stage with the warm color. Gaps 0.3 in. No accent stripes or underline bars.
- Dark full-bleed slides only for title, conclusion, and closing. Logos sit on a white rounded plate over dark photos.

### Slide recipes (compose from these)

1. **Title:** dark solid or full-bleed photo with a 25–30% dark overlay; small all-caps kicker in the highlight color; 40–48 pt title; subtitle; name and affiliation block; logos top right; photo credit bottom left.
2. **Big stat + argument:** left card with one 60 pt number, its meaning, and an italic "so what" line; right column with two bold mini-headings and bullets.
3. **Facts row + process flow:** three stat cards across the top; a five-box flow with arrows below, the box in focus filled with the highlight color; a tinted callout explaining why that box matters.
4. **Field photo row:** three equal photos, each with a numbered bold caption and one explanatory line; a dark full-width bar at the bottom: "Core problem: ..." with the label in the highlight color.
5. **Chart + stat stack:** chart on the left at its true aspect ratio (about 8.6 in wide); four stacked stats on the right, the worrying one in the alarm color; an italic data note under the chart.
6. **Two contrast cards:** side by side (e.g. oversupply vs undersupply), each with a colored heading, cited bullets, and a bold conclusion line.
7. **Options or reasons grid:** four cards in a row (or 2 x 2) with a numbered circle, heading, and short explanation; highlight the chosen option; a dark bar stating the position of this work.
8. **Process timeline:** numbered circles on a line with step names and tools under each; a tinted definition box; a split bar for train/test or phases.
9. **Method step:** numbered-circle title; figure or chart left; result table right (dark header row, zebra rows); a "How to read" card and a **Terms box** (bordered, small, bold term plus one-line definition) wherever new jargon appears.
10. **Worked example:** formula banner across the top; three tinted input cards; a dark result card with the answer in large type; a reality-check line with the actual value and error.
11. **Results:** chart(s) left, metric table right, three interpretation bullets, Terms box for any new metric.
12. **Statement (talk):** tinted background, a small vector illustration on top, one 30–34 pt sentence, one supporting line.
13. **Half-bleed photo + statement:** photo fills the left 40% edge to edge; statement and supporting line on the right.
14. **Photo + text:** photo cropped to a square-ish box on the left, cards or icon rows on the right, credit under it.
15. **Concept illustrations (vector), meaning not decoration:** plan-on-paper vs field; blueprint-style concept device (grid background, "CONCEPT · CAD" badge, dimension arrows) vs built device with an "IN PROGRESS" badge and dashed parts not yet integrated; supply-chain flow with risk cards under each stage; tasks converging on one person (bottleneck); tombstone for abandoned plans; ladder of rising blocks; concentric circles; laptop with a named folder. Draw unbuilt hardware only as a drawing.
16. **Comparison cards:** two cards with icon circles and a sign between them; the sign must match the narrative ("A beats B" shows B < A).
17. **Implications:** three cards each with a big headline value and a short explanation; dark caveat bar.
18. **Conclusion:** dark slide, three numbered points (circle, bold heading, two lines), key formula or message in bold.
19. **Suggestions/next steps:** one large dark card for the main suggestion plus four small tinted cards.
20. **References:** two columns, 9–10 pt, alphabetical. **Backup slides:** labeled Backup A/B/C with formulas, extra charts, parameter tables, Q&A answers, and a "Sources & Image Credits" slide.

## Phase 5: Build with pptxgenjs

Follow the pptx skill's structured-deck rules (theme, scheme colors, sections, layouts, `applyTheme` after `writeFile`). Plus:

- **Never stretch images.** Do not rely on `sizing: {type: "cover"}` with file paths; it can squash images in PowerPoint. Crop photos to the box ratio with sharp; fit charts, figures, and logos at their true aspect ratio:

```js
async function photo(s, file, x, y, w, h, position = "centre") {
  const px = Math.round(Math.min(2400, w * 220)), py = Math.round((px * h) / w);
  const buf = await sharp(file).resize(px, py, { fit: "cover", position }).jpeg({ quality: 86 }).toBuffer();
  s.addImage({ data: "image/jpeg;base64," + buf.toString("base64"), x, y, w, h });
}
async function fitImage(s, file, x, y, w, h) {
  const m = await sharp(file).metadata();
  const r = Math.min(w / m.width, h / m.height), iw = m.width * r, ih = m.height * r;
  s.addImage({ path: file, x: x + (w - iw) / 2, y: y + (h - ih) / 2, w: iw, h: ih });
}
```

  Use `position` ("north", "west") to keep faces and subjects in frame. Trim transparent logo margins first (`sharp(f).trim()`).
- **Helpers worth writing once:** `contentSlide(title, {step|section, sectionLabel, source})`, `text()`, `card()`, `terms(items)`, `table(rows, colW)` with dark header and zebra rows, `statement()`, `line(x1, y1, x2, y2, {arrow, both})` (compute the box from endpoints, `flipV` for up-right lines, `beginArrowType` for two-headed arrows), `iconCircle()` (react-icons rendered to PNG with sharp), and `has(file)` to switch between a dropped-in photo and an illustration so the user can add images later and rebuild.
- **Locale number formatting** in one helper (e.g. Indonesian `2.771,05`, real minus sign); never hand-type results.
- **Shape names:** `ISOSCELES_TRIANGLE` (not TRIANGLE), `ROUND_2_SAME_RECTANGLE`, `TRAPEZOID`, `DONUT`, `BLOCK_ARC`. Draw percentage rings with `DONUT` + `BLOCK_ARC` (`angleRange`, `arcThicknessRatio`) and a centered text box instead of overlaying text on a native doughnut chart (it misaligns in some renderers).
- **Credits:** a small italic caption on every slide that uses an outside image or figure.
- **Speaker notes:** parsed from the script's `[SLIDE n]` markers (keep `[KEY]` and `(pause)`, strip markdown), or written per slide starting with the time budget ("Opening (about 30 s).").
- Keep the build script next to the deck or under `assets/_tools/`; archive superseded decks and scripts in a dated archive folder with a short note.

## Phase 6: QA

1. Run the pptx skill's `validate.py`; it must pass.
2. Render to PDF with the skill's soffice wrapper, rasterize, review grids of 12 slides, then re-render changed slides larger. Check: overflow, titles wrapping into content, cropped subjects or partial words in photos, empty card space, unreadable logos, labels overlapping charts, comparison signs vs narrative.
3. `markitdown deck.pptx | grep` for phrases that must be gone (old claims, "Questions?", placeholder text) and names that must be present.
4. Check documents and slides for punctuation or style the user dislikes.
5. Export the final PDF next to the .pptx for sharing.

## Phase 7: Deliver and verify

- Write into the user's folder directly. When copying through a bridge, stage under a fresh unique filename every time (a reused staged path can deliver a stale copy), then compare hashes on the target machine; report "updated" only after they match.
- Git: commit only the files the user named; leave unrelated or private files untracked and say so. New untracked files committed on another branch vanish from the working tree when switching back, so prefer the current branch in that case and explain.
- Final report: what changed per slide and document, what still needs the user (missing source URLs, higher-resolution logos), and honest caveats (promo images, unverified locations, estimated timings).
## Bundled files

- `scripts/commons.py` and `scripts/fetch.py`: image sourcing with automatic credit logging (see `examples/README.md` for usage).
- `examples/talk-mode-build-deck.js` and `examples/analytical-mode-bangun_pptx.js`: complete reference builds for each mode. Read the one matching the chosen mode before writing a new build script.
