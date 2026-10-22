#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = ["pillow", "pillow-heif"]
# ///
"""Steps 0–3 of geolocation in one command: metadata, zoomed four edges and four corners, search variants, OCR, run in parallel, one report.
Everything runs locally: the photo is never uploaded. This install has no automatic reverse image search.

Outputs (all in --out-dir, default /tmp/geo-sleuth/<photo name>/ — outside any repository):
  exif.json  edges/  variants/  ocr.json ocr.png  intake.md  intake.json
  work/<name>.png  only when the photo needs it: HEIC/WebP/... decoded, or an EXIF orientation applied. A lossless upright
                   copy with the original's EXIF (orientation reset); every step below then uses it, and intake.json "input"
                   records it. Metadata is always read from the original. Pixel coordinates are in the upright frame either way.
Exit status: 0 ok or partial (the report says which steps failed), 1 every enabled visual step (edges, variants, OCR)
failed, 2 the photo itself can't be read (metadata is still tried and reported). Steps turned off with --no-* don't count.
intake.md is for humans (and the LLM): metadata, OCR text, list of outputs, items skipped and failed.

  intake.py photo.jpg [--out-dir /tmp/geo-sleuth/<name>] [--box x0,y0,x1,y1 ...] [--no-ocr]

Examples:
  intake.py photo.jpg                                  # -> /tmp/geo-sleuth/photo/
  intake.py photo.jpg --box 300,120,900,760            # also tight-crop variants of a distinctive object
"""
from __future__ import annotations

import argparse
from _image import ImageReadError, write_working_copy
import json
import os
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

HERE = Path(__file__).parent
# uv run writes its own path into the UV env var: call child scripts with it, so uv is found even when it isn't on PATH (e.g. just installed, terminal not reopened)
UV = os.environ.get("UV") or "uv"

def _run(cmd: list[str], cwd: Path | None = None, timeout: int = 900) -> tuple[int, str, str]:
    try:
        # Child scripts and this one both use UTF-8: Chinese Windows reads and writes GBK by default, and if the two sides differ you get mojibake or crashes
        r = subprocess.run(cmd, text=True, encoding="utf-8", errors="replace", capture_output=True, cwd=cwd, timeout=timeout,
                           env={**os.environ, "PYTHONUTF8": "1"})
        return r.returncode, r.stdout, r.stderr
    except subprocess.TimeoutExpired:
        return 124, "", f"timed out after {timeout}s"


def _script(name: str) -> str:
    return str(HERE / name)



def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("photo")
    ap.add_argument("--out-dir", type=Path, help="default /tmp/geo-sleuth/<photo name>; never inside a repository")
    ap.add_argument("--box", action="append", help="x0,y0,x1,y1: tight-crop variant, repeatable")
    ap.add_argument("--no-ocr", action="store_true")
    args = ap.parse_args()

    photo = Path(args.photo).resolve()
    out = args.out_dir or Path("/tmp/geo-sleuth") / photo.stem
    out.mkdir(parents=True, exist_ok=True)
    (out / "edges").mkdir(exist_ok=True)
    (out / "variants").mkdir(exist_ok=True)
    t_all = time.time()
    timings: dict = {}
    status: dict = {}

    def timed(name, fn):
        t0 = time.time()
        try:
            res = fn()
            status[name] = "ok" if res[0] == 0 else f"failed: {(res[2] or res[1])[-300:].strip()}"
        except Exception as e:  # noqa: BLE001
            status[name] = f"exception: {e}"
            res = (1, "", str(e))
        timings[name] = round(time.time() - t0, 1)
        return res

    # A photo the later steps can't take as stored gets one upright lossless working copy
    try:
        work = write_working_copy(photo, out / "work" / f"{photo.stem}.png")
    except ImageReadError as e:
        _unreadable_input(photo, out, e, timed)
        return
    src = Path(work["working"]) if work else photo

    def exif():
        return _run([UV, "run", _script("exif.py"), str(photo)])

    def edges():
        return _run([UV, "run", _script("imgprep.py"), "edges", str(src), "--out-dir", str(out / "edges")])

    def variants():
        rc, so, se = _run([UV, "run", _script("imgprep.py"), "variants", str(src), "--prefix", "full", "--out-dir", str(out / "variants")])
        for i, b in enumerate(args.box or [], 1):
            r2 = _run([UV, "run", _script("imgprep.py"), "variants", str(src), "--box", b, "--prefix", f"box{i}", "--out-dir", str(out / "variants")])
            rc, so, se = max(rc, r2[0]), so + r2[1], se + r2[2]
        return rc, so, se

    def ocr():
        return _run([UV, "run", _script("ocr.py"), str(src), "--out", str(out / "ocr.json"), "--draw", str(out / "ocr.png")])

    # Batch 1: metadata, edges, variants, OCR in parallel
    with ThreadPoolExecutor(4) as ex:
        f_exif = ex.submit(timed, "exif", exif)
        f_edges = ex.submit(timed, "edges", edges)
        f_var = ex.submit(timed, "variants", variants)
        f_ocr = None if args.no_ocr else ex.submit(timed, "ocr", ocr)
        exif_res = f_exif.result()
        f_edges.result()
        f_var.result()
        if f_ocr:
            f_ocr.result()
    try:
        exif_json = json.loads(exif_res[1].strip().splitlines()[0]) if exif_res[1].strip() else {}
    except Exception:  # noqa: BLE001
        exif_json = {"raw": exif_res[1][:500]}
    (out / "exif.json").write_text(json.dumps(exif_json, ensure_ascii=False, indent=1), encoding="utf-8")

    ocr_items = []
    if (out / "ocr.json").exists():
        try:
            ocr_items = json.loads((out / "ocr.json").read_text(encoding="utf-8")).get("items", [])
        except Exception:  # noqa: BLE001
            pass

    # ---- report
    visual = ["edges", "variants"] + ([] if args.no_ocr else ["ocr"])
    failed = [k for k, v in status.items() if v != "ok"]
    result = "failed" if all(status.get(k) != "ok" for k in visual) else "partial" if failed else "ok"
    L = [f"# Steps 0–3 report: {photo.name}", "", f"Total time {time.time() - t_all:.0f}s; per step: " + ", ".join(f"{k} {v}s" for k, v in timings.items()), ""]
    if result == "failed":
        L += [f"**Result: failed.** Every enabled visual step failed ({', '.join(visual)}); reasons under Status. Fix that before going on.", ""]
    elif result == "partial":
        L += [f"**Result: partial.** Failed: {', '.join(failed)} (reasons under Status); the other steps' outputs below are usable.", ""]
    L += ["Next: record clues on board.py (`clue`), lookup clues with `apply`; list the candidates in full first (`children`), then rank.", ""]
    if work:
        L += [f"Input: {work['reason']}, so the steps below used `work/{Path(work['working']).name}` ({work['working_size'][0]}x{work['working_size'][1]}, lossless, "
              "the original's EXIF kept). Metadata was read from the original. Crops and OCR boxes are in this upright frame, the same frame "
              "every script uses when given the original, so keep passing the original photo to later commands.", ""]
    L += ["## Metadata", ""]
    gps = exif_json.get("gps") or exif_json.get("GPS")
    if exif_json and (gps or exif_json.get("datetime") or exif_json.get("DateTimeOriginal")):
        L.append("```\n" + json.dumps(exif_json, ensure_ascii=False, indent=1)[:1500] + "\n```")
        L.append("Metadata is an assumption (it can be edited, it can be stripped): check both GPS and time against the image.")
    else:
        L.append("No metadata (common for forwarded images, screenshots, rephotographed images)." + (f" Raw output: `{json.dumps(exif_json, ensure_ascii=False)[:300]}`" if exif_json else ""))
    L += ["", "## OCR text (second reader; pass=up/tile was only read after zooming, treat it as an assumption)", ""]
    if args.no_ocr:
        L.append("Not done (--no-ocr).")
    elif ocr_items:
        L.append("| Conf | Pass | Box (px) | Text |")
        L.append("|---|---|---|---|")
        for t in ocr_items[:40]:
            L.append(f"| {t['conf']:.2f} | {t['pass']} | {t['box']} | {t['text']} |")
        L.append("")
        L.append("Phone numbers, plates, proper names on road signs, issuing authorities: first `clues.py lookup`, then `board.py apply`.")
    else:
        L.append("No text read" + (f" (OCR {status.get('ocr')})" if status.get("ocr") != "ok" else ". Maybe there really is no text, or it's too small: zoom in by hand with imgprep.py zoom and look again"))
    L += ["", "## Reverse image search", "",
          "Not run: this install never uploads the photo. If a near-duplicate could break the case, suggest the user check it in Google Lens "
          "themselves and paste back what they find; this is not \"searched, nothing found\".", ""]
    L += ["## Output files", "", f"- Edge crops: `edges/` ({len(list((out / 'edges').glob('*')))} images; look at the four edges and four corners one by one)",
          f"- Variants: `variants/` ({len(list((out / 'variants').glob('*')))} images)", "- OCR annotated image: `ocr.png`" if not args.no_ocr else "",
          "",
          "## Status", ""]
    for k, v in status.items():
        L.append(f"- {k}: {v}")
    (out / "intake.md").write_text("\n".join(x for x in L if x is not None), encoding="utf-8")
    (out / "intake.json").write_text(json.dumps({"photo": str(photo), "input": work, "result": result, "exif": exif_json, "ocr": ocr_items, "status": status, "timings": timings}, ensure_ascii=False, indent=1), encoding="utf-8")
    print("\n".join(L[:6]))
    print(f"-> {out / 'intake.md'} (read this)")
    if result == "failed":
        sys.exit(f"intake: every enabled visual step failed ({', '.join(visual)}); see {out / 'intake.md'}")


def _unreadable_input(photo: Path, out: Path, err: ImageReadError, timed) -> None:
    """The photo itself can't be decoded: still try its metadata (a RAW often carries GPS and time), write a short report, exit 2."""
    res = timed("exif", lambda: _run([UV, "run", _script("exif.py"), str(photo)]))
    try:
        exif_json = json.loads(res[1].strip().splitlines()[0]) if res[1].strip() else {}
    except Exception:  # noqa: BLE001
        exif_json = {}
    (out / "exif.json").write_text(json.dumps(exif_json, ensure_ascii=False, indent=1), encoding="utf-8")
    L = [f"# Steps 0–3 report: {photo.name}", "", f"**Result: input unreadable.** {err.reason}.",
         "No crops, variants or OCR were done.", "", "## Metadata", "",
         "```\n" + json.dumps(exif_json, ensure_ascii=False, indent=1)[:1500] + "\n```" if exif_json else "No metadata could be read either."]
    (out / "intake.md").write_text("\n".join(L), encoding="utf-8")
    (out / "intake.json").write_text(json.dumps({"photo": str(photo), "input": {"error": err.category, "reason": err.reason}, "result": "input unreadable",
                                                 "exif": exif_json}, ensure_ascii=False, indent=1), encoding="utf-8")
    print("\n".join(L[:4]))
    print(f"-> {out / 'intake.md'}")
    sys.exit(2)


if __name__ == "__main__":
    # Chinese Windows outputs GBK by default: it crashes on m², ñ, and Chinese text the agent reads comes out garbled
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8", errors="backslashreplace")
    main()
