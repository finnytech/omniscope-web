@echo off
setlocal
cd /d "%~dp0"
echo ==========================================================
echo  [OMNISCOPE OSINT] Cloudflare Pages One-Click Deployer
echo  Pfad: %CD%
echo ==========================================================

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0deploy.ps1"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [FEHLER] Deployment fehlgeschlagen mit Code %ERRORLEVEL%
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo Deployment erfolgreich beendet.
pause
