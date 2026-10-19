---
name: pdf
description: Read, extract, create, and manipulate PDF files - extract text or tables, merge, split, rotate, watermark, fill forms, encrypt/decrypt, extract images, OCR scanned pages, or produce a new PDF. Use whenever a .pdf is an input or the requested output.
license: MIT
---

# PDF

Tooling: `pypdf` (core), `pdfplumber` for tables and layout-aware text (`pip install pypdf pdfplumber`). Always write results to a new file; never overwrite the input unless asked.

## Extract
```python
from pypdf import PdfReader
r = PdfReader("in.pdf")                       # r.decrypt("pw") first if r.is_encrypted
text = "\n".join(p.extract_text() or "" for p in r.pages)
meta = r.metadata
for i, p in enumerate(r.pages):
    for img in p.images:
        open(f"p{i+1}_{img.name}", "wb").write(img.data)
```
Tables: `import pdfplumber; with pdfplumber.open("in.pdf") as pdf: rows = pdf.pages[0].extract_table()` then load into pandas. Check the result against the page - merged cells and multi-line cells often need cleanup.

If `extract_text()` returns empty strings, the PDF is scanned images: OCR is needed (`ocrmypdf in.pdf out.pdf` with Tesseract installed, or `pytesseract` on rendered pages). Tell the user if OCR tooling is missing.

## Manipulate
```python
from pypdf import PdfReader, PdfWriter
w = PdfWriter()
for f in ["a.pdf", "b.pdf"]:
    w.append(f)                                # merge (also: w.append(f, pages=(0, 3)))
w.pages[0].rotate(90)                          # rotate
stamp = PdfReader("watermark.pdf").pages[0]
for p in w.pages:
    p.merge_page(stamp, over=False)            # watermark underneath content
w.add_metadata({"/Title": "Merged report"})
w.encrypt(user_password="baca", owner_password="edit")
w.write("out.pdf")
```
Split: one `PdfWriter` per page range, `w.add_page(r.pages[i])`.

Forms: `r.get_fields()` lists field names; fill with
`w = PdfWriter(clone_from="form.pdf"); w.update_page_form_field_values(w.pages[0], {"Nama": "Budi"}, auto_regenerate=False); w.write("filled.pdf")`.
Check each field name exists before filling; report any that do not.

## Create a new PDF
- **From HTML (no extra install on Windows):** write a self-contained HTML file with print CSS (`@page { size: A4; margin: 2cm }`), then (PowerShell):
  ```powershell
  $edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
  $html = (Resolve-Path doc.html).Path
  Start-Process $edge -Wait -ArgumentList '--headless','--disable-gpu','--no-pdf-header-footer',"--print-to-pdf=$env:TEMP\out.pdf",([Uri]$html).AbsoluteUri
  ```
  Edge exits 0 but writes **nothing** when the input or output path is long (deep temp/workspace folders), so print to a short path such as `$env:TEMP\out.pdf`, wait until the file exists, then move it to its destination. Chrome accepts the same flags.
- **Programmatic layout:** `reportlab` (`pip install reportlab`) for precise drawing, or build a .docx with the docx skill and convert with Word/LibreOffice.

## QA
Re-open the output with `PdfReader`: check page count, that text is extractable where expected, and that encryption/fields/metadata are set. For created PDFs, open the file (or render a page) and look at it before delivering; say so if you could not.
