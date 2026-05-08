# ============================================================
#  Kangrui Website - Publish to GitHub
#  Repo: https://github.com/kangxinteam1-cg/kangrui-site
# ============================================================

# Use 'Continue' so PowerShell does not abort when git writes progress to stderr.
# We rely on $LASTEXITCODE to detect failures.
$ErrorActionPreference = 'Continue'
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
    Write-Host "==> Creating commit..." -ForegroundColor Cyan
    git commit `
        -m "Fix truncated HTML files, SEO improvements, add missing assets" `
        -m "- Repair 9 HTML files truncated mid-script tag" `
        -m "- Strip NUL padding from team.html and case-template.html" `
        -m "- Set case-template.html to noindex,nofollow" `
        -m "- Expand sitemap.xml from 14 to 26 URLs" `
        -m "- Add apple-touch-icon.png and visit-map.png" `
        -m "- Add 9th Midjourney prompt for visit-map.png" `
        -m "- Merge local + remote .gitignore rules"

    if ($LASTEXITCODE -ne 0) {
        Write-Host "    Commit failed." -ForegroundColor Red
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
$pushExitCode = $LASTEXITCODE

# If push failed, ask git whether remote is ahead (non-fast-forward).
$nonFastForward = $false
if ($pushExitCode -ne 0) {
    git fetch origin main *>$null
    $remoteAhead = (git rev-list --count HEAD..origin/main 2>$null)
    if ($remoteAhead -and [int]$remoteAhead -gt 0) {
        $nonFastForward = $true
    }
}

if ($pushExitCode -eq 0) {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Green
    Write-Host "  Published successfully!" -ForegroundColor Green
    Write-Host "  https://github.com/kangxinteam1-cg/kangrui-site/commits/main" -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Green
}
elseif ($nonFastForward) {
    Write-Host ""
    Write-Host "==> Remote has new commits we do not have locally." -ForegroundColor Yellow
    Write-Host "==> Auto-fixing: reset HEAD to origin/main and re-commit..." -ForegroundColor Cyan
    Write-Host ""

    git reset --soft origin/main
    if ($LASTEXITCODE -ne 0) {
        Write-Host "    Reset failed." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }

    Write-Host "==> Re-staging all changes..." -ForegroundColor Cyan
    git add -A
    $reStaged = (git diff --cached --name-only | Measure-Object).Count
    Write-Host "    Re-staged $reStaged files." -ForegroundColor Green

    if ($reStaged -gt 0) {
        Write-Host "==> Creating fresh commit on top of origin/main..." -ForegroundColor Cyan
        git commit `
            -m "Fix truncated HTML files, SEO improvements, add missing assets" `
            -m "- Repair 9 HTML files truncated mid-script tag" `
            -m "- Strip NUL padding from team.html and case-template.html" `
            -m "- Set case-template.html to noindex,nofollow" `
            -m "- Expand sitemap.xml from 14 to 26 URLs" `
            -m "- Add apple-touch-icon.png and visit-map.png" `
            -m "- Add 9th Midjourney prompt for visit-map.png" `
            -m "- Merge local + remote .gitignore rules"

        if ($LASTEXITCODE -ne 0) {
            Write-Host "    Re-commit failed." -ForegroundColor Red
            Read-Host "Press Enter to exit"
            exit 1
        }
    }

    Write-Host ""
    Write-Host "==> Pushing again..." -ForegroundColor Cyan
    git push origin main

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "============================================================" -ForegroundColor Green
        Write-Host "  Published successfully (after auto-recovery)!" -ForegroundColor Green
        Write-Host "  https://github.com/kangxinteam1-cg/kangrui-site/commits/main" -ForegroundColor Green
        Write-Host "============================================================" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "============================================================" -ForegroundColor Red
        Write-Host "  Second push still failed. Send the error to Claude." -ForegroundColor Red
        Write-Host "============================================================" -ForegroundColor Red
    }
}
else {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Red
    Write-Host "  Push failed - see error above." -ForegroundColor Red
    Write-Host "    'Authentication failed' -> install GitHub CLI then run 'gh auth login'" -ForegroundColor Yellow
    Write-Host "============================================================" -ForegroundColor Red
}

Write-Host ""
Read-Host "Press Enter to exit"
