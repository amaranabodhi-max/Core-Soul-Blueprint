"""QiMen Lab — automatic analysis of Joey Yap webinars with the Gemini API.

Ruta picks a folder, sees the cost estimate, types START. Everything else is automatic.
Source videos are never modified or deleted.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
from pathlib import Path

from pydantic import BaseModel

APP_DIR = Path(__file__).resolve().parent
CONFIG_PATH = APP_DIR / "config.json"
KEY_PATH = APP_DIR / "gemini_key.txt"  # local only, git-ignored
VIDEO_EXT = {".mp4", ".mkv", ".mov", ".webm", ".avi", ".m4v", ".wmv", ".flv"}
MAX_UPLOAD_BYTES = int(1.9 * 1024**3)  # Files API limit is 2 GB per file

DEFAULT_CONFIG = {
    "free_tier": None,              # asked once
    "transcribe_model": "gemini-2.5-flash",
    "report_model": "gemini-2.5-pro",
    "window_minutes": 20,
    "max_output_tokens": 32768,
    "tokens_per_video_second": 300,  # default media resolution, video + audio
    # USD per 1M tokens; approximate, check ai.google.dev/pricing before big runs
    "prices": {
        "transcribe_in": 0.30, "transcribe_out": 2.50,
        "report_in": 2.50, "report_out": 15.00,
    },
    "results_folder_name": "QiMen_Results",
    # Free tier (Google AI Studio): Pro is unavailable, Flash has 5 RPM / 250K TPM.
    "free": {
        "model": "gemini-2.5-flash",
        "window_minutes": 10,        # 10 min ≈ 180K tokens < 250K TPM per request
        "rpm": 5,
        "tpm": 250000,
        "safety": 0.9,
    },
}

GLOSSARY = """Qi Men Dun Jia (QMDJ), Joey Yap, Destiny Chart, Palace Strength, Palace Energy Level (0 to 7),
Nine Palaces (Kan, Kun, Zhen, Xun, Qian, Dui, Gen, Li, Center),
Heavenly Stems (Jia, Yi, Bing, Ding, Wu, Ji, Geng, Xin, Ren, Gui),
Nine Stars (Tian Peng / Grass, Tian Rui / Grain, Tian Chong / Destructor, Tian Fu / Assistant, Tian Qin / Bird,
Tian Xin / Heart, Tian Zhu / Pillar, Tian Ren / Ambassador, Tian Ying / Hero),
Eight Doors (Open / Kai, Rest / Xiu, Life / Sheng, Harm / Shang, Delusion / Du, Scenery / Jing 景, Death / Si, Fear / Jing 惊),
Eight Deities (Chief / Zhi Fu, Snake / Teng She, Moon / Tai Yin, Six Harmony / Liu He, White Tiger / Bai Hu,
Black Tortoise / Xuan Wu, Nine Earth / Jiu Di, Nine Heaven / Jiu Tian),
Seasonality (Prosperous / Wang, Strengthened / Xiang, Resting / Xiu, Trapped / Qiu, Dead / Si),
Death and Emptiness (DE / Kong Wang / Void), Horse Star (Yi Ma)."""

WINDOW_SYSTEM = f"""You are a meticulous transcriber of Qi Men Dun Jia webinars by Joey Yap.
Use this glossary to spell terms correctly:
{GLOSSARY}
Rules:
- Verbatim English transcript. Never summarise, never invent words.
- Unclear speech: write [inaudible] in the text of that line.
- Timestamps are ABSOLUTE positions in the full video, format HH:MM:SS.
- New transcript line every few sentences and at every slide change.
- Every new slide, table, chart or 9-palace Qi Men chart on screen goes into `visuals`
  with its timestamp, a short description, and (if it contains a table or chart) a faithful
  Markdown table copying every number and label exactly as shown, including any 0-7 values
  in palace corners. Write 'unreadable' rather than guessing a digit."""

REPORT_SYSTEM = """Ты — строгий исследователь системы Qi Men Dun Jia. Тебе дан полный транскрипт вебинара
Джоуи Япа и расшифровка всех слайдов. Напиши отчёт НА РУССКОМ, с точными английскими цитатами и таймкодами [HH:MM:SS].
Ровно 4 раздела:
## 1. Прямые объяснения Джоуи Япа (факты)
Что лектор прямо говорит или показывает про Palace Strength / Palace Energy Level (0–7), Destiny Chart,
сезонность (месяц рождения), Небесные Стволы, Звёзды, Врата, Духов, Пустоту (DE). Каждое утверждение —
дословная цитата + таймкод.
## 2. Визуальные улики
Все карты и таблицы, где видны значения 0–7 или правила начисления баллов, с таймкодами.
## 3. Независимые гипотезы
Закономерности, видимые в ЭТОМ вебинаре. Каждую явно помечай как гипотезу и указывай, на чём она основана.
## 4. Неизвестные переменные (слепые пятна)
Что не объяснено или осталось за кадром.
Главное правило: не подгонять формулу под известные ответы, не выдумывать правил, которых нет в материале.
Не превращать догадки в золото без проверки! Если данных о шкале 0–7 нет — так и напиши."""


class Line(BaseModel):
    t: str
    text: str


class Visual(BaseModel):
    t: str
    description: str
    table_markdown: str = ""


class WindowResult(BaseModel):
    lines: list[Line]
    visuals: list[Visual]


# ---------- small helpers ----------

def say(msg: str = "") -> None:
    print(msg, flush=True)


def hms(sec: float) -> str:
    sec = int(round(sec))
    return f"{sec // 3600:02d}:{sec % 3600 // 60:02d}:{sec % 60:02d}"


def parse_hms(s: str) -> int | None:
    m = re.match(r"^\s*\[?(?:(\d+):)?(\d{1,2}):(\d{2})", s or "")
    if not m:
        return None
    h, mi, se = m.groups()
    return int(h or 0) * 3600 + int(mi) * 60 + int(se)


def load_json(path: Path, default):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return default


def save_json(path: Path, data) -> None:
    tmp = path.with_suffix(".tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    tmp.replace(path)


def load_config() -> dict:
    cfg = json.loads(json.dumps(DEFAULT_CONFIG))
    user = load_json(CONFIG_PATH, {})
    for k, v in user.items():
        if isinstance(v, dict) and isinstance(cfg.get(k), dict):
            cfg[k].update(v)
        else:
            cfg[k] = v
    return cfg


def ask(prompt: str) -> str:
    try:
        return input(prompt).strip()
    except EOFError:
        return ""


# ---------- environment ----------

def ensure_ffmpeg() -> bool:
    if shutil.which("ffmpeg") and shutil.which("ffprobe"):
        return True
    say("⚠ ffmpeg не найден. Он нужен, чтобы узнать длительность видео и сохранить кадры слайдов.")
    if os.name == "nt" and shutil.which("winget"):
        if ask("Установить ffmpeg автоматически (бесплатно, через winget)? [да/нет]: ").lower() in ("да", "д", "y", "yes"):
            subprocess.call(["winget", "install", "--id", "Gyan.FFmpeg", "-e",
                             "--accept-source-agreements", "--accept-package-agreements"])
            say("Готово. Закройте окно и запустите программу ещё раз (Windows должна обновить PATH).")
    else:
        say("Установите ffmpeg: https://ffmpeg.org/download.html")
    return False


def get_api_key(allow_prompt: bool) -> str | None:
    key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not key and KEY_PATH.exists():
        key = KEY_PATH.read_text(encoding="utf-8").strip()
    if not key and allow_prompt:
        say("Нужен ключ Gemini API (aistudio.google.com → Get API key).")
        key = ask("Вставьте ключ и нажмите Enter (он сохранится только на этом компьютере): ")
        if key:
            KEY_PATH.write_text(key, encoding="utf-8")
    return key or None


def pick_folder(cli_value: str | None) -> Path | None:
    if cli_value:
        return Path(cli_value)
    try:
        import tkinter as tk
        from tkinter import filedialog
        root = tk.Tk()
        root.withdraw()
        root.attributes("-topmost", True)
        chosen = filedialog.askdirectory(title="Выберите папку с вебинарами")
        root.destroy()
        if chosen:
            return Path(chosen)
    except Exception:
        pass
    typed = ask("Путь к папке с вебинарами: ").strip('"')
    return Path(typed) if typed else None


def probe_duration(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=nw=1:nk=1", str(path)],
        capture_output=True, text=True)
    try:
        return float(out.stdout.strip())
    except ValueError:
        return 0.0


def find_videos(folder: Path, results_dir: Path) -> list[Path]:
    vids = []
    for p in sorted(folder.rglob("*")):
        if p.suffix.lower() in VIDEO_EXT and p.is_file() and results_dir not in p.parents:
            vids.append(p)
    return vids


# ---------- cost ----------

def estimate(cfg: dict, seconds: float) -> dict:
    tps = cfg["tokens_per_video_second"]
    pr = cfg["prices"]
    in_tok = seconds * tps
    words = seconds / 60 * 150
    out_tok = words * 1.6 + seconds / 60 * 200  # transcript + JSON + visuals
    report_in = out_tok * 1.1
    report_out = 8000 * max(1, seconds / 7200)
    usd = (in_tok * pr["transcribe_in"] + out_tok * pr["transcribe_out"]
           + report_in * pr["report_in"] + report_out * pr["report_out"]) / 1e6
    return {"in_tokens": int(in_tok), "usd": usd}


# ---------- Gemini ----------

def make_client(key: str):
    from google import genai
    return genai.Client(api_key=key)


def resolve_models(client, cfg: dict) -> None:
    try:
        names = [m.name.split("/")[-1] for m in client.models.list()]
    except Exception as e:  # listing is free; failure means bad key / network
        raise SystemExit(f"Не удалось связаться с Gemini API: {e}")
    for k in ("transcribe_model", "report_model"):
        word = "pro" if "pro" in cfg[k] else "flash"
        if cfg[k] in names:
            continue
        cands = sorted(n for n in names if n.startswith("gemini-") and word in n
                       and not any(b in n for b in ("lite", "tts", "image", "audio", "live", "embedding", "exp")))
        stable = [n for n in cands if "preview" not in n] or cands
        if not stable:
            raise SystemExit(f"Не найдена подходящая модель '{word}'. Доступны: {names}")
        say(f"  Модель {cfg[k]} недоступна, беру {stable[-1]}")
        cfg[k] = stable[-1]


class RateLimiter:
    """Keeps requests under the free-tier RPM/TPM by waiting before each call."""

    def __init__(self, rpm: int = 0, tpm: int = 0, safety: float = 0.9):
        self.rpm, self.tpm, self.safety = rpm, int(tpm * safety), safety
        self.log: list[tuple[float, int]] = []

    def wait(self, tokens: int) -> None:
        if not self.rpm:
            return
        if tokens > self.tpm:
            raise RuntimeError(f"Запрос на {tokens} токенов больше лимита {self.tpm} в минуту — уменьшите window_minutes")
        while True:
            now = time.monotonic()
            self.log = [(t, n) for t, n in self.log if now - t < 61]
            used = sum(n for _, n in self.log)
            if len(self.log) < self.rpm and used + tokens <= self.tpm:
                self.log.append((now, tokens))
                return
            pause = max(1.0, 61 - (now - self.log[0][0]))
            say(f"    пауза {int(pause)} с (бесплатный лимит в минуту)...")
            time.sleep(pause)


LIMITER = RateLimiter()


def apply_free_tier(cfg: dict) -> None:
    fr = cfg["free"]
    cfg["transcribe_model"] = cfg["report_model"] = fr["model"]
    cfg["window_minutes"] = min(cfg["window_minutes"], fr["window_minutes"])
    cfg["prices"] = {k: 0.0 for k in cfg["prices"]}
    global LIMITER
    LIMITER = RateLimiter(fr["rpm"], fr["tpm"], fr["safety"])


class QuotaExhausted(Exception):
    pass


def _retryable(exc: BaseException) -> bool:
    code = getattr(exc, "code", None)
    if code in (429, 500, 502, 503, 504):
        return True
    return isinstance(exc, (ConnectionError, TimeoutError)) or "timed out" in str(exc).lower()


def call_with_retry(fn, *a, **kw):
    from tenacity import Retrying, retry_if_exception, stop_after_attempt, wait_exponential
    try:
        for attempt in Retrying(retry=retry_if_exception(_retryable),
                                wait=wait_exponential(multiplier=5, max=120),
                                stop=stop_after_attempt(6), reraise=True):
            with attempt:
                return fn(*a, **kw)
    except Exception as e:
        if getattr(e, "code", None) == 429:
            raise QuotaExhausted(str(e)) from e
        raise


def prepare_upload_copy(video: Path, tmpdir: Path) -> Path:
    if video.stat().st_size <= MAX_UPLOAD_BYTES:
        return video
    say("  Файл больше 2 ГБ — делаю облегчённую копию (оригинал не трогаю)...")
    out = tmpdir / (video.stem + "_light.mp4")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(video),
                    "-vf", "scale=-2:720", "-r", "2", "-c:v", "libx264", "-crf", "28", "-preset", "veryfast",
                    "-c:a", "aac", "-b:a", "64k", "-ac", "1", str(out)], check=True)
    return out


def upload(client, path: Path, state: dict):
    if state.get("file_name"):
        try:
            f = client.files.get(name=state["file_name"])
            if f.state and f.state.name == "ACTIVE":
                return f
        except Exception:
            pass
    say("  Загружаю видео в Gemini...")
    f = call_with_retry(client.files.upload, file=str(path))
    while f.state and f.state.name == "PROCESSING":
        time.sleep(10)
        f = client.files.get(name=f.name)
    if not f.state or f.state.name != "ACTIVE":
        raise RuntimeError(f"Gemini не смог обработать файл: {f.state}")
    state["file_name"] = f.name
    return f


def fix_offsets(res: WindowResult, start: int, end: int) -> WindowResult:
    """Models sometimes give window-relative times. Detect and shift to absolute."""
    if start <= 0:
        return res
    ts = [parse_hms(x.t) for x in [*res.lines, *res.visuals]]
    ts = [t for t in ts if t is not None]
    if ts and max(ts) <= (end - start) + 30 and min(ts) < start - 60:
        for x in [*res.lines, *res.visuals]:
            t = parse_hms(x.t)
            if t is not None:
                x.t = hms(t + start)
    return res


def transcribe_window(client, cfg, f, start: int, end: int, usage: dict) -> WindowResult:
    from google.genai import types
    part = types.Part(file_data=types.FileData(file_uri=f.uri, mime_type=f.mime_type),
                      video_metadata=types.VideoMetadata(start_offset=f"{start}s", end_offset=f"{end}s"))
    prompt = (f"Transcribe this part of the webinar: from {hms(start)} to {hms(end)}. "
              f"Timestamps must be absolute (between {hms(start)} and {hms(end)}).")
    LIMITER.wait(int((end - start) * cfg["tokens_per_video_second"]) + 2000)
    resp = call_with_retry(
        client.models.generate_content, model=cfg["transcribe_model"],
        contents=[types.Content(role="user", parts=[part, types.Part(text=prompt)])],
        config=types.GenerateContentConfig(
            system_instruction=WINDOW_SYSTEM, temperature=0.1,
            max_output_tokens=cfg["max_output_tokens"],
            response_mime_type="application/json", response_schema=WindowResult))
    add_usage(usage, "transcribe", resp)
    cand = resp.candidates[0] if resp.candidates else None
    if cand is None or (cand.finish_reason and cand.finish_reason.name == "MAX_TOKENS") or resp.parsed is None:
        if end - start <= 60:
            raise RuntimeError(f"Не удалось получить транскрипт {hms(start)}–{hms(end)}")
        mid = (start + end) // 2
        say(f"    окно слишком длинное, делю пополам ({hms(start)}–{hms(mid)}–{hms(end)})")
        a = transcribe_window(client, cfg, f, start, mid, usage)
        b = transcribe_window(client, cfg, f, mid, end, usage)
        return WindowResult(lines=a.lines + b.lines, visuals=a.visuals + b.visuals)
    return fix_offsets(resp.parsed, start, end)


def add_usage(usage: dict, kind: str, resp) -> None:
    um = getattr(resp, "usage_metadata", None)
    if not um:
        return
    usage[f"{kind}_in"] = usage.get(f"{kind}_in", 0) + (um.prompt_token_count or 0)
    usage[f"{kind}_out"] = usage.get(f"{kind}_out", 0) + (um.candidates_token_count or 0) + (getattr(um, "thoughts_token_count", 0) or 0)


def usage_cost(cfg, usage: dict) -> float:
    pr = cfg["prices"]
    return sum(usage.get(k, 0) * pr[k] for k in pr) / 1e6


# ---------- outputs ----------

def extract_slide_frames(video: Path, out_dir: Path) -> list[tuple[int, str]]:
    """Free, local: save a full-quality frame at the start and at every scene (slide) change."""
    out_dir.mkdir(exist_ok=True)
    if not any(out_dir.glob("slide_*.jpg")):
        for old in out_dir.glob("frame_*.jpg"):
            old.unlink()
        res = subprocess.run(["ffmpeg", "-y", "-hide_banner", "-i", str(video),
                              "-vf", "select='eq(n\\,0)+gt(scene\\,0.25)',showinfo", "-fps_mode", "vfr",
                              "-q:v", "2", str(out_dir / "frame_%05d.jpg")],
                             capture_output=True, text=True, encoding="utf-8", errors="replace")
        times = [float(x) for x in re.findall(r"pts_time:([\d.]+)", res.stderr)]
        for i, p in enumerate(sorted(out_dir.glob("frame_*.jpg"))):
            if i < len(times):
                target = out_dir / f"slide_{hms(times[i]).replace(':', '-')}.jpg"
                if target.exists():
                    p.unlink()
                else:
                    p.rename(target)
    frames = []
    for p in sorted(out_dir.glob("slide_*.jpg")):
        t = parse_hms(p.stem[6:].replace("-", ":"))
        if t is not None:
            frames.append((t, p.name))
    return frames


def nearest_frame(frames, t: int | None) -> str | None:
    """The slide on screen at time t = the last scene change at or just after t (model timestamps can lag)."""
    if t is None or not frames:
        return None
    before = [fr for fr in frames if fr[0] <= t + 5]
    return before[-1][1] if before else None


def write_outputs(out: Path, title: str, windows: list[dict], frames) -> tuple[str, str]:
    lines = [Line(**l) for w in windows for l in w["lines"]]
    visuals = [Visual(**v) for w in windows for v in w["visuals"]]
    events = [(parse_hms(l.t) or 0, 0, l) for l in lines] + [(parse_hms(v.t) or 0, 1, v) for v in visuals]
    events.sort(key=lambda e: (e[0], e[1]))
    tr = [f"# {title} — Full Transcript (EN)\n"]
    for _, kind, e in events:
        if kind == 0:
            tr.append(f"[{e.t}] {e.text}")
        else:
            tr.append(f"> **[SLIDE / VISUAL AT {e.t}]** {e.description}")
    vs = [f"# {title} — Слайды, таблицы и карты\n"]
    for v in sorted(visuals, key=lambda v: parse_hms(v.t) or 0):
        vs.append(f"\n## [{v.t}] {v.description}\n")
        fr = nearest_frame(frames, parse_hms(v.t))
        if fr:
            vs.append(f"\n![кадр](slides/{fr})\n")
        if v.table_markdown.strip():
            vs.append("\n" + v.table_markdown.strip() + "\n")
    t1, t2 = "\n\n".join(tr) + "\n", "\n".join(vs)
    (out / "01_Full_Transcript_EN.md").write_text(t1, encoding="utf-8")
    (out / "02_Visual_Slides_and_Tables.md").write_text(t2, encoding="utf-8")
    return t1, t2


def make_report(client, cfg, transcript: str, visuals: str, usage: dict) -> str:
    from google.genai import types
    LIMITER.wait((len(transcript) + len(visuals)) // 3 + 2000)
    resp = call_with_retry(
        client.models.generate_content, model=cfg["report_model"],
        contents=f"=== TRANSCRIPT ===\n{transcript}\n\n=== SLIDES AND TABLES ===\n{visuals}",
        config=types.GenerateContentConfig(system_instruction=REPORT_SYSTEM, temperature=0.2,
                                           max_output_tokens=cfg["max_output_tokens"]))
    add_usage(usage, "report", resp)
    return resp.text or ""


# ---------- pipeline ----------

def process_video(client, cfg, video: Path, out: Path, duration: float) -> None:
    out.mkdir(parents=True, exist_ok=True)
    state_path = out / "state.json"
    state = load_json(state_path, {})
    finals = ["01_Full_Transcript_EN.md", "02_Visual_Slides_and_Tables.md", "03_Palace_Strength_Research_Report.md"]
    if state.get("status") == "COMPLETED" and all((out / n).exists() for n in finals):
        say("  уже готово — пропускаю")
        return
    state.setdefault("usage", {})
    state["status"] = "IN_PROGRESS"
    save_json(state_path, state)

    say("  Сохраняю кадры слайдов (бесплатно, локально)...")
    frames = extract_slide_frames(video, out / "slides")

    win = cfg["window_minutes"] * 60
    bounds = [(s, min(s + win, int(duration) + 1)) for s in range(0, int(duration) + 1, win)]
    parts_dir = out / "parts"
    parts_dir.mkdir(exist_ok=True)
    f = None
    with tempfile.TemporaryDirectory() as td:
        for i, (s, e) in enumerate(bounds, 1):
            part_path = parts_dir / f"part_{i:02d}.json"
            if part_path.exists():
                continue
            if f is None:
                f = upload(client, prepare_upload_copy(video, Path(td)), state)
                save_json(state_path, state)
            say(f"  Окно {i}/{len(bounds)}: {hms(s)}–{hms(e)}")
            res = transcribe_window(client, cfg, f, s, e, state["usage"])
            save_json(part_path, res.model_dump())
            state["last_segment"] = i
            save_json(state_path, state)

    windows = [load_json(parts_dir / f"part_{i:02d}.json", {"lines": [], "visuals": []}) for i in range(1, len(bounds) + 1)]
    t1, t2 = write_outputs(out, video.stem, windows, frames)

    rep = out / "03_Palace_Strength_Research_Report.md"
    if not rep.exists():
        say("  Пишу исследовательский отчёт 0–7...")
        rep.write_text(f"# {video.stem} — Palace Strength: исследовательский отчёт\n\n"
                       + make_report(client, cfg, t1, t2, state["usage"]), encoding="utf-8")
    if state.get("file_name"):
        try:
            client.files.delete(name=state["file_name"])  # temporary copy on Google servers only
        except Exception:
            pass
        state.pop("file_name", None)
    state["status"] = "COMPLETED"
    state["cost_usd"] = round(usage_cost(cfg, state["usage"]), 3)
    save_json(state_path, state)
    say(f"  ✓ готово. Фактическая стоимость ≈ ${state['cost_usd']}")


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="QiMen Lab")
    ap.add_argument("folder", nargs="?", help="папка с вебинарами")
    ap.add_argument("--dry-run", action="store_true", help="только оценка, без запросов к API")
    ap.add_argument("--yes", action="store_true", help="не спрашивать подтверждение (для тестов)")
    args = ap.parse_args(argv)

    say("=== QiMen Lab ===")
    cfg = load_config()
    if not ensure_ffmpeg():
        return 1
    folder = pick_folder(args.folder)
    if not folder or not folder.is_dir():
        say("Папка не выбрана.")
        return 1
    results = folder / cfg["results_folder_name"]
    videos = find_videos(folder, results)
    if not videos:
        say(f"В папке {folder} нет видео.")
        return 1

    if cfg.get("free_tier") is None:
        ans = ask("Ваш ключ Gemini на бесплатном тарифе? [да/нет]: ").lower()
        cfg["free_tier"] = ans in ("да", "д", "y", "yes")
        save_json(CONFIG_PATH, {**load_json(CONFIG_PATH, {}), "free_tier": cfg["free_tier"]})
    if cfg["free_tier"]:
        apply_free_tier(cfg)

    say(f"\nПапка: {folder}")
    total = 0.0
    durs = {}
    for v in videos:
        d = probe_duration(v)
        durs[v] = d
        done = load_json(results / v.stem / "state.json", {}).get("status") == "COMPLETED"
        if not done:
            total += d
        say(f"  {'✓' if done else '•'} {v.name}  ({hms(d)}){'  — уже готово' if done else ''}")
    est = estimate(cfg, total) if total else {"in_tokens": 0, "usd": 0.0}
    say(f"\nК обработке: {hms(total)} видео, ≈{est['in_tokens'] / 1e6:.1f} млн токенов")
    say(f"Модели: {cfg['transcribe_model']} (транскрипт), {cfg['report_model']} (отчёт)")
    if cfg["free_tier"]:
        n_req = sum(-(-int(durs[v]) // (cfg["window_minutes"] * 60)) + 1 for v in videos
                    if load_json(results / v.stem / "state.json", {}).get("status") != "COMPLETED")
        say(f"Бесплатный тариф: $0. Запросов ≈ {n_req}, время ≈ {max(1, round(n_req * 1.2))} мин (из-за лимита в минуту)")
    else:
        say(f"Ориентировочная стоимость на платном тарифе: ≈ ${est['usd']:.2f}  (точность ±50%)")

    if args.dry_run:
        say("\nРежим проверки: запросов к Gemini не было, деньги не потрачены.")
        return 0
    if total == 0:
        say("\nВсё уже обработано.")
        return 0

    key = get_api_key(allow_prompt=True)
    if not key:
        say("Без ключа продолжить нельзя.")
        return 1
    if cfg["free_tier"]:
        say("ℹ Бесплатный тариф: денег не спишут, но есть дневные лимиты, а Google может использовать данные для улучшения моделей.")
        say("  Если лимит закончится — программа сохранит прогресс; запустите её завтра, она продолжит с того же места.")

    client = make_client(key)
    resolve_models(client, cfg)
    if not args.yes and ask('\nНапишите СТАРТ, чтобы начать (любое другое — выход): ').lower() not in ("старт", "start"):
        say("Отменено. Ничего не потрачено.")
        return 0

    for v in videos:
        say(f"\n▶ {v.name}")
        try:
            process_video(client, cfg, v, results / v.stem, durs[v])
        except QuotaExhausted:
            say("\n⏸ Лимит Gemini исчерпан. Прогресс сохранён — запустите программу позже, она продолжит с того же места.")
            return 2
        except Exception as e:
            say(f"  ✗ ошибка: {e}\n  Прогресс сохранён; перейду к следующему видео.")
    say(f"\nГотово! Результаты в папке: {results}")
    if os.name == "nt":
        os.startfile(results)  # type: ignore[attr-defined]
    return 0


if __name__ == "__main__":
    sys.exit(main())
