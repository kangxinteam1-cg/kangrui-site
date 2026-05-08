@echo off
title Kangrui Site - Publish to GitHub
echo.
echo ============================================================
echo   Kangrui Website - One-Click Publish
echo ============================================================
echo.
echo Running publish.ps1 to push changes to GitHub...
echo If this is your first time, a GitHub sign-in window will pop up.
echo Just sign in once and you're done.
echo.
pause

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0publish.ps1"

echo.
echo ============================================================
echo   Done. Press any key to close this window.
echo ============================================================
pause >nul
