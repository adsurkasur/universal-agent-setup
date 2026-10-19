---
name: xlsx
description: Create, read, clean, or edit spreadsheets (.xlsx, .xlsm, .csv, .tsv) with openpyxl and pandas. Use when a spreadsheet file is the main input or output - adding columns or formulas, formatting, charts, cleaning messy tabular data, converting between tabular formats. Not for Word/HTML reports or Google Sheets API work.
license: MIT
---

# Spreadsheets (.xlsx / .csv)

Tooling: `pandas` for loading/cleaning data, `openpyxl` for formulas, formatting and charts (`pip install pandas openpyxl`).

## Rules that prevent silent errors
- **Prefer live formulas over hard-coded results** for anything the user may change (`ws["D2"] = "=B2*C2"`). Put assumptions (rates, factors) in labeled input cells and reference them.
- openpyxl **writes formulas but never calculates them**. Reading with `load_workbook(p, data_only=True)` returns `None` for formula cells the file has never been calculated in Excel/LibreOffice. Do not report numbers from formulas you have not computed; compute them in pandas/Python for your answer, or recalc (see QA).
- Opening and saving an existing workbook with openpyxl drops unsupported content (e.g. some charts, images, pivot caches, VBA unless `keep_vba=True` for .xlsm). For heavy existing workbooks, write changes to a copy and tell the user.
- Keep the original file untouched; save to a new name unless the user asked to overwrite.

## Clean data (pandas)
```python
import pandas as pd
df = pd.read_excel("raw.xlsx", header=None)          # inspect first: df.head(15)
df = pd.read_excel("raw.xlsx", header=3)              # then pick the real header row
df = df.dropna(how="all").dropna(axis=1, how="all")
df.columns = [str(c).strip() for c in df.columns]
df["Tanggal"] = pd.to_datetime(df["Tanggal"], errors="coerce", dayfirst=True)
df["Berat"] = pd.to_numeric(df["Berat"].astype(str).str.replace(",", "."), errors="coerce")
df.to_excel("clean.xlsx", index=False)
```
CSV/TSV: `pd.read_csv(p, sep=None, engine="python")` sniffs the delimiter; check `encoding="utf-8-sig"` or `"cp1252"` if characters break.

## Build / format (openpyxl)
```python
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.chart import BarChart, Reference
from openpyxl.formatting.rule import CellIsRule

wb = Workbook(); ws = wb.active; ws.title = "Data"
ws.append(["Produk", "Qty", "Harga", "Total"])
for r in [("A", 10, 5000), ("B", 4, 12500)]:
    ws.append([*r, f"=B{ws.max_row+1}*C{ws.max_row+1}"])
last = ws.max_row
ws[f"D{last+1}"] = f"=SUM(D2:D{last})"

for c in ws[1]:
    c.font = Font(bold=True, color="FFFFFF"); c.fill = PatternFill("solid", fgColor="1F2937")
for col, w in {"A": 18, "B": 8, "C": 12, "D": 14}.items():
    ws.column_dimensions[col].width = w
for row in ws.iter_rows(min_row=2, min_col=3, max_col=4):
    for c in row: c.number_format = '#,##0'
ws.freeze_panes = "A2"; ws.auto_filter.ref = f"A1:D{last}"
ws.conditional_formatting.add(f"D2:D{last}", CellIsRule(operator="greaterThan", formula=["50000"], fill=PatternFill("solid", fgColor="FDE68A")))

ch = BarChart(); ch.title = "Total per produk"
ch.add_data(Reference(ws, min_col=4, min_row=1, max_row=last), titles_from_data=True)
ch.set_categories(Reference(ws, min_col=1, min_row=2, max_row=last))
ws.add_chart(ch, "F2")
wb.save("out.xlsx")
```

## QA
1. Re-open with openpyxl and check sheet names, headers, row counts, and that formula strings reference the right ranges.
2. Recalculate when possible, then scan for `#REF!`, `#DIV/0!`, `#VALUE!`, `#NAME?`:
   - LibreOffice: `soffice --headless --convert-to xlsx --outdir recalced out.xlsx`
   - Excel on Windows (PowerShell): `$x=New-Object -ComObject Excel.Application; $b=$x.Workbooks.Open((Resolve-Path out.xlsx).Path); $x.CalculateFull(); $b.Save(); $b.Close(); $x.Quit()`
3. If you could not recalculate, tell the user the formulas will compute when the file is opened.
