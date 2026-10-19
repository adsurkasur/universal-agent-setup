---
name: pptx
description: Create, read, edit, or restyle PowerPoint files (.pptx) with python-pptx. Use whenever a .pptx file is an input or output - slide decks, pitch decks, lecture or thesis slides, extracting text or notes from slides, replacing text, adding charts, tables, images or speaker notes. Pair with academic-pptx for academic content.
license: MIT
---

# PowerPoint (.pptx)

Tooling: `python-pptx` (`pip install python-pptx` if missing). Work in a script file, not a REPL, so the deck can be regenerated after fixes.

## Workflow
1. **Plan before code.** Write the slide list first: one message per slide, the title is the takeaway sentence ("Yield rose 18% after drying at 60 °C"), not a topic label ("Results").
2. **Build** with a script (skeleton below). Keep layout constants (margins, fonts, colors) at the top so every slide is consistent.
3. **QA** (see below) and fix, then deliver the file path.

## Skeleton
```python
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE

prs = Presentation()                      # or Presentation("existing.pptx") to reuse its theme
prs.slide_width, prs.slide_height = Inches(13.333), Inches(7.5)   # 16:9
BLANK = prs.slide_layouts[6]
M = Inches(0.6)                           # outer margin
TITLE, BODY = Pt(32), Pt(20)
INK = RGBColor(0x1F, 0x29, 0x37)

def text(slide, s, x, y, w, h, size, bold=False):
    tf = slide.shapes.add_textbox(x, y, w, h).text_frame
    tf.word_wrap = True
    for i, line in enumerate(s.split("\n")):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = line
        p.font.size, p.font.bold, p.font.color.rgb = size, bold, INK
    return tf

s = prs.slides.add_slide(BLANK)
text(s, "Yield rose 18% after drying at 60 °C", M, M, prs.slide_width - 2*M, Inches(1), TITLE, bold=True)

data = CategoryChartData()
data.categories = ["40 °C", "50 °C", "60 °C"]
data.add_series("Yield (%)", (61, 68, 72))
s.shapes.add_chart(XL_CHART_TYPE.COLUMN_CLUSTERED, M, Inches(1.8),
                   Inches(7), Inches(5), data)
s.notes_slide.notes_text_frame.text = "Speaker notes go here."

prs.save("deck.pptx")
```
Other building blocks: `shapes.add_picture(path, x, y, width=...)` (give only width to keep aspect ratio), `shapes.add_table(rows, cols, x, y, w, h).table`, `shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, ...)` from `pptx.enum.shapes`.

## Reading and editing existing decks
- Text: iterate `for slide in prs.slides: for sh in slide.shapes: if sh.has_text_frame: ...`; tables via `sh.has_table`; notes via `slide.has_notes_slide`.
- Replace text **per run** (`for p in tf.paragraphs: for r in p.runs: r.text = ...`) to keep formatting. A phrase can be split across runs; if a match spans runs, join the runs' text, replace, put the result in the first run and clear the rest.
- Delete a slide: `xml_slides = prs.slides._sldIdLst; xml_slides.remove(xml_slides[i])`.
- `.potx` templates cannot be opened directly; save a copy as `.pptx` first (PowerPoint or LibreOffice), then use `Presentation(copy)` so new slides inherit the theme and layouts.

## Design rules
- Body text ≥ 18 pt, titles 28-36 pt, at most ~6 short lines per slide; split rather than shrink.
- One font family, 2-3 colors plus neutrals, strong contrast (dark on light or light on dark).
- Align everything to the same margins/grid; leave whitespace.
- Charts: label axes with units, remove chart junk, highlight the one bar/line that carries the message.
- python-pptx does **not** shrink text to fit. Estimate: ~ 9-10 characters per inch of box width at 20 pt. If text may overflow, shorten it or enlarge the box.

## QA
1. Re-open the saved file with python-pptx and assert slide count and that no text frame is empty unexpectedly.
2. Render and look at every slide when possible:
   - LibreOffice: `soffice --headless --convert-to pdf deck.pptx`
   - PowerPoint on Windows (PowerShell):
     `$pp=New-Object -ComObject PowerPoint.Application; $d=$pp.Presentations.Open((Resolve-Path deck.pptx).Path,$true,$false,$false); $d.SaveAs("$PWD\deck.pdf",32); $d.Close(); $pp.Quit()`
   Check for overflow, overlap, tiny text, and misalignment, then fix and re-render.
3. If no renderer is available, say so explicitly instead of claiming visual QA was done.
