"""Download a sourced (non-Commons) image and log its credit.

Usage: python fetch.py URL out_name "Credit text" "Source page URL"
"""
import sys
import urllib.request
from pathlib import Path

ASSETS = Path(__file__).resolve().parent.parent
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

if len(sys.argv) != 5:
    raise SystemExit(__doc__)
url, out_name, credit, page = sys.argv[1:]
with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
    data = r.read()
if len(data) < 2000:
    raise SystemExit(f"Suspiciously small download ({len(data)} bytes): {url}")
out = ASSETS / "product" / out_name
out.parent.mkdir(exist_ok=True)
out.write_bytes(data)
with open(ASSETS / "ATTRIBUTION.md", "a", encoding="utf-8") as f:
    f.write(f"- `product/{out_name}`: {credit}, {page} (used for educational commentary, source cited)\n")
print(f"saved product/{out_name} ({len(data) // 1024} KB)")
