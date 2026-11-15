@echo off
chcp 65001 >nul
set PYTHONUTF8=1
cd /d "%~dp0"
title QiMen Lab
set PY=py -3
where py >nul 2>nul || set PY=python
if not exist ".venv\Scripts\python.exe" (
  echo Первый запуск: готовлю программу, это займёт пару минут...
  %PY% -m venv .venv || (echo Python не найден. Установите его с python.org ^(галочка "Add to PATH"^). & pause & exit /b 1)
  ".venv\Scripts\python.exe" -m pip install -q --upgrade pip
  ".venv\Scripts\python.exe" -m pip install -q -r requirements.txt || (echo Не удалось установить библиотеки. & pause & exit /b 1)
)
".venv\Scripts\python.exe" qimen_lab.py %*
echo.
pause
