# Examples

Two real build scripts that this skill was distilled from. They are references, not templates to run as-is: paths, data files, and assets point to the original projects.

- `talk-mode-build-deck.js`: 43-slide narrative webinar deck (10 in canvas). Shows the photo crop and fit helpers, logo plate, section kicker circles, statement slides, vector illustrations (blueprint device, conveyor, supply-chain flow, bottleneck, tombstone), DONUT + BLOCK_ARC ring, and speaker notes parsed from a script with `[SLIDE n]` markers.
- `analytical-mode-bangun_pptx.js`: 26-slide analytical deck (13.33 in canvas, Indonesian). Shows assertion titles, step-number circles, source line and section label per slide, Terms box (`istilah`), zebra tables, numbers read from an analysis JSON with Indonesian number formatting, worked hand calculation, field photo row, conclusion and backup slides.

# Scripts

- `scripts/commons.py`: search and download freely licensed images from Wikimedia Commons; appends credits to `ATTRIBUTION.md`. Usage: `python commons.py search "query"`, `python commons.py get "File title.jpg" out.jpg 1600`.
- `scripts/fetch.py`: download a cited product or media image and log its source page. Usage: `python fetch.py URL out_name "Credit" "Source page URL"`.

Both scripts write next to their parent folder (`../ATTRIBUTION.md`, `../product/`); adjust `ASSETS` if your layout differs.
