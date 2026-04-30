# ============================================================
#  Kangrui Website - Publish to GitHub
#  Repo: https://github.com/kangxinteam1-cg/kangrui-site
# ============================================================

$ErrorActionPreference = 'Stop'
Set-Location -Path $PSScriptRoot

Write-Host "==> Project: $PSScriptRoot" -ForegroundColor Cyan

# --- 1. Clear stale lock ------------------------------------
if (Test-Path '.git\index.lock') {
    Write-Host "==> Found .git\index.lock - removing..." -ForegroundColor Yellow
    Remove-Item '.git\index.lock' -Force -ErrorAction SilentlyContinue
    if (Test-Path '.git\index.lock') {
        Write-Host "    Lock still present. Close VSCode / GitHub Desktop and retry." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "    Lock removed." -ForegroundColor Green
}

# --- 2. Set git author identity (this repo only) ------------
Write-Host "==> Setting git user (repo-local)..." -ForegroundColor Cyan
git config user.name  "Cathy Guan"
git config user.email "cathy.guan@kangxin.com"

# --- 3. Show status ----------------------------------------
Write-Host "==> Current status:" -ForegroundColor Cyan
git status --short

# --- 4. Stage all -------------------------------------------
Write-Host ""
Write-Host "==> Staging all changes..." -ForegroundColor Cyan
git add -A

$staged = (git diff --cached --name-only | Measure-Object).Count
Write-Host "    Staged $staged files." -ForegroundColor Green

if ($staged -eq 0) {
    Write-Host "==> Nothing to commit, skipping." -ForegroundColor Yellow
} else {
    # --- 5. Commit (use multiple -m to build a multi-paragraph message) ---
    Write-Host "==> Creating commit..." -ForegroundColor Cyan

    git commit `
        -m "Restructure team page to Freshfields-style profile cards + add 11 lawyer profile pages" `
        -m "- Replace placeholder team grid with 11 real lawyers (3 partners / 7 associates / 1 senior patent specialist)" `
        -m "- Convert each card to row layout with real photo, name, role, polished tagline and capabilities" `
        -m "- Add 11 dedicated profile pages (team-slug.html) with bio, capabilities, education, positions, cases, publications, honors" `
        -m "- Sort bar with results count and A-Z / Z-A sort" `
        -m "- News-hero image swapped to layered legal journals" `
        -m "- Various copy and asset polish across home, services, news, insights pages"

    if ($LASTEXITCODE -ne 0) {
        Write-Host "    Commit failed - send me the error above." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "    Commit done." -ForegroundColor Green
}

# --- 6. Push -----------------------------------------------
Write-Host ""
Write-Host "==> Pushing to GitHub (origin/main)..." -ForegroundColor Cyan
Write-Host "    First push may pop a GitHub auth window - just sign in." -ForegroundColor Gray

git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Green
    Write-Host "  Published successfully!" -ForegroundColor Green
    Write-Host "  https://github.com/kangxinteam1-cg/kangrui-site/commits/main" -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Red
    Write-Host "  Push failed - see error above." -ForegroundColor Red
    Write-Host "    'Authentication failed' -> install GitHub CLI then run 'gh auth login'" -ForegroundColor Yellow
    Write-Host "    'rejected (non-fast-forward)' -> run 'git pull --rebase origin main' and try again" -ForegroundColor Yellow
    Write-Host "============================================================" -ForegroundColor Red
}

Write-Host ""
Read-Host "Press Enter to exit"
