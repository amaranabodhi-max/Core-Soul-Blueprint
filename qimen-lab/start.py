"""QiMen Lab launcher: updates the program from GitHub, makes a desktop shortcut, then starts it."""
import os
import subprocess
import sys
import urllib.request
from pathlib import Path

APP = Path(__file__).resolve().parent
BASE = "https://raw.githubusercontent.com/amaranabodhi-max/Core-Soul-Blueprint/ccr-297b9b3d-kgxfnr/qimen-lab/"
FILES = ["qimen_lab.py", "requirements.txt", "ИНСТРУКЦИЯ.txt"]


def update() -> None:
    updated = []
    for name in FILES:
        try:
            url = BASE + urllib.request.quote(name)
            new = urllib.request.urlopen(url, timeout=15).read()
        except Exception:
            print("(обновление пропущено: нет связи с GitHub — работаю на текущей версии)")
            return
        if name.endswith(".py"):
            try:
                compile(new, name, "exec")  # never install a broken file
            except SyntaxError:
                continue
        path = APP / name
        if not path.exists() or path.read_bytes() != new:
            path.write_bytes(new)
            updated.append(name)
    if updated:
        print("✓ Программа обновлена до последней версии.")
        if "requirements.txt" in updated:
            subprocess.call([sys.executable, "-m", "pip", "install", "-q", "-r", str(APP / "requirements.txt")])


def desktop_shortcut() -> None:
    if os.name != "nt":
        return
    ps = (
        "$d=[Environment]::GetFolderPath('Desktop');$l=Join-Path $d 'QiMen Lab.lnk';"
        "if(-not (Test-Path $l)){$s=(New-Object -ComObject WScript.Shell).CreateShortcut($l);"
        f"$s.TargetPath='{APP / 'Run_QiMen_Lab.bat'}';$s.WorkingDirectory='{APP}';$s.Save();"
        "Write-Output 'created'}"
    )
    try:
        out = subprocess.run(["powershell", "-NoProfile", "-Command", ps], capture_output=True, text=True, timeout=30)
        if "created" in out.stdout:
            print("✓ На рабочем столе появился значок «QiMen Lab» — дальше запускайте его.")
    except Exception:
        pass


if __name__ == "__main__":
    if "--no-update" not in sys.argv:
        update()
    desktop_shortcut()
    sys.path.insert(0, str(APP))
    import qimen_lab
    sys.exit(qimen_lab.main([a for a in sys.argv[1:] if a != "--no-update"]))
