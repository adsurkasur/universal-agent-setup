"""Search and download freely licensed images from Wikimedia Commons.

Usage:
  python commons.py search "query one" "query two"
  python commons.py get "File title.jpg" out_name.jpg [width]
Attribution for each download is appended to ../ATTRIBUTION.md.
"""
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

UA = {"User-Agent": "IBC-deck-builder/1.0 (personal presentation)"}
ASSETS = Path(__file__).resolve().parent.parent
ALLOWED = ("CC0", "Public domain", "CC BY", "CC-BY", "PD")


def api(params):
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode({**params, "format": "json"})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code != 429:
                raise
            time.sleep(4 * (attempt + 1))
    raise RuntimeError("Commons rate limit persisted")


def clean(meta, key):
    return re.sub(r"<[^>]+>", "", meta.get(key, {}).get("value", "")).strip()


def info(pages):
    for p in (pages or {}).values():
        ii = p["imageinfo"][0]
        m = ii.get("extmetadata", {})
        yield {
            "title": p["title"].removeprefix("File:"),
            "w": ii["width"], "h": ii["height"],
            "license": clean(m, "LicenseShortName"),
            "artist": clean(m, "Artist")[:80],
            "thumb": ii.get("thumburl"),
            "page": ii.get("descriptionurl"),
        }


def search(q, n=8):
    r = api({"action": "query", "generator": "search", "gsrsearch": f"{q} filetype:bitmap",
             "gsrnamespace": 6, "gsrlimit": n, "prop": "imageinfo",
             "iiprop": "url|extmetadata|size", "iiurlwidth": 1600})
    return list(info(r.get("query", {}).get("pages")))


def get(title, out_name, width=1600):
    r = api({"action": "query", "titles": f"File:{title}", "prop": "imageinfo",
             "iiprop": "url|extmetadata|size", "iiurlwidth": width})
    item = next(info(r.get("query", {}).get("pages")), None)
    if not item or not item["thumb"]:
        raise SystemExit(f"Not found: {title}")
    if not item["license"].startswith(ALLOWED):
        raise SystemExit(f"License not allowed ({item['license']}): {title}")
    out = ASSETS / out_name
    with urllib.request.urlopen(urllib.request.Request(item["thumb"], headers=UA), timeout=60) as r:
        out.write_bytes(r.read())
    with open(ASSETS / "ATTRIBUTION.md", "a", encoding="utf-8") as f:
        f.write(f"- `{out_name}`: \"{item['title']}\" by {item['artist'] or 'unknown'}, "
                f"{item['license']}, Wikimedia Commons, {item['page']}\n")
    print(f"saved {out_name} ({out.stat().st_size // 1024} KB) | {item['license']} | {item['artist']}")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    if sys.argv[1] == "search":
        for q in sys.argv[2:]:
            print("##", q)
            for t in search(q):
                print(f"   {t['title'][:75]} | {t['w']}x{t['h']} | {t['license']} | {t['artist'][:40]}")
            time.sleep(1)
    elif sys.argv[1] == "get":
        get(sys.argv[2], sys.argv[3], int(sys.argv[4]) if len(sys.argv) > 4 else 1600)
