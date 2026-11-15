@echo off
chcp 65001 >nul
set PYTHONUTF8=1
cd /d "%~dp0"
title QiMen Lab

rem --- find Python ---
set "PY="
where py >nul 2>nul && set "PY=py -3"
if not defined PY where python >nul 2>nul && set "PY=python"
if not defined PY goto nopython

set "VPY=.venv\Scripts\python.exe"

rem --- create the private environment if missing or broken ---
if exist "%VPY%" "%VPY%" -c "import sys" >nul 2>nul || rmdir /s /q .venv 2>nul
if exist "%VPY%" goto haveenv
echo Первый запуск: готовлю программу...
%PY% -m venv .venv
:haveenv
if not exist "%VPY%" goto novenv

rem --- install libraries if any is missing (every run checks, so an interrupted install is repaired) ---
"%VPY%" -c "import google.genai, tenacity, pydantic" >nul 2>nul && goto run
echo Устанавливаю библиотеки, это займёт 1-3 минуты...
"%VPY%" -m pip install --upgrade pip
"%VPY%" -m pip install -r requirements.txt
"%VPY%" -c "import google.genai, tenacity, pydantic" >nul 2>nul || goto nolibs
echo Библиотеки установлены.

:run
"%VPY%" qimen_lab.py %*
echo.
pause
exit /b

:nopython
echo Python не найден. Установите его с python.org (отметьте галочку "Add python.exe to PATH").
pause
exit /b 1

:novenv
echo Не удалось создать окружение Python. Пришлите этот текст Клодовичу.
pause
exit /b 1

:nolibs
echo Не удалось установить библиотеки. Проверьте интернет и пришлите текст выше Клодовичу.
pause
exit /b 1
