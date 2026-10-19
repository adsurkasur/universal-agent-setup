---
name: docx
description: Create, read, or edit Word documents (.docx) with python-docx. Use when a .docx file is an input or output - reports, letters, theses, proposals, forms; extracting text or tables; find-and-replace; inserting images, tables, headers/footers, page numbers, or comments; converting content into a polished Word file.
license: MIT
---

# Word (.docx)

Tooling: `python-docx` (`pip install python-docx`). Work in a script so the document can be regenerated.

## Create
```python
from docx import Document
from docx.shared import Pt, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK

doc = Document()                                  # or Document("template.docx") to inherit its styles
sec = doc.sections[0]
sec.top_margin = sec.bottom_margin = Cm(2.5)
sec.left_margin, sec.right_margin = Cm(3), Cm(2.5)

normal = doc.styles["Normal"]
normal.font.name, normal.font.size = "Calibri", Pt(11)

doc.add_heading("Laporan Praktikum", level=0)     # level 0 = Title style
doc.add_heading("1. Pendahuluan", level=1)
p = doc.add_paragraph("Teks isi. ")
p.add_run("Tebal").bold = True
p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
doc.add_paragraph("Poin pertama", style="List Bullet")
doc.add_paragraph("Langkah pertama", style="List Number")

t = doc.add_table(rows=1, cols=3, style="Table Grid")
for cell, h in zip(t.rows[0].cells, ["Parameter", "Nilai", "Satuan"]):
    cell.text = h
row = t.add_row().cells
row[0].text, row[1].text, row[2].text = "Kadar air", "12.4", "%"

doc.add_picture("figure.png", width=Cm(14))
doc.add_paragraph("Gambar 1. Keterangan.", style="Caption")
doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)

sec.header.paragraphs[0].text = "Header text"
doc.save("out.docx")
```
- Use real heading styles (not bold Normal text) so navigation and a table of contents work.
- Page numbers and a table of contents are Word fields; python-docx cannot compute them. Insert the field XML (`w:fldSimple w:instr="PAGE"` or `TOC \o "1-3" \h \z \u`) and tell the user to press F9 / "Update field" in Word, or update them via Word/LibreOffice if available.

## Read and edit
- Text: `for p in doc.paragraphs: p.text`; tables: `for t in doc.tables: for r in t.rows: [c.text for c in r.cells]`. Body order across paragraphs and tables: iterate `doc.element.body.iterchildren()`.
- Find-and-replace: edit `run.text`, not `paragraph.text` (which drops formatting). When the target spans several runs, merge those runs' text into the first run and blank the others. Repeat inside tables, headers and footers.
- Comments (python-docx ≥ 1.2): `doc.add_comment(runs=[run], text="...", author="Reviewer")`.
- Tracked changes are not supported by python-docx; producing them requires writing `w:ins` / `w:del` elements in the XML. Say so rather than silently editing text without tracking.
- `.dotx` templates: save a copy as `.docx` first, then open it.

## QA
1. Re-open the file and check headings, table contents, and that replaced text is gone.
2. Render when possible: `soffice --headless --convert-to pdf out.docx`, or Word via PowerShell COM:
   `$w=New-Object -ComObject Word.Application; $d=$w.Documents.Open((Resolve-Path out.docx).Path); $d.SaveAs2("$PWD\out.pdf",17); $d.Close(); $w.Quit()`
   Inspect page breaks, image sizes, and table widths.
3. If you could not render, say so.
