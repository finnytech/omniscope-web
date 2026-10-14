# OmniScope Web - One-Click Cloudflare Pages Deployment Script
$ErrorActionPreference = "Stop"

$projectDir = $PSScriptRoot
Set-Location $projectDir

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " [OMNISCOPE OSINT] Cloudflare Pages Deployer" -ForegroundColor Yellow
Write-Host " Pfad: $projectDir" -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Resolve Cloudflare API Token
$tokenFile = "$env:APPDATA\xdg.config\cloudflare\config\default.json"
if (Test-Path $tokenFile) {
    try {
        $json = Get-Content $tokenFile -Raw | ConvertFrom-Json
        if ($json.oauth_token) {
            $env:CLOUDFLARE_API_TOKEN = $json.oauth_token
            Write-Host "[OK] Cloudflare OAuth Token geladen aus default.json" -ForegroundColor Green
        }
    } catch {
        Write-Host "[WARN] Konnte default.json nicht parsen, nutze Fallback..." -ForegroundColor DarkYellow
    }
}

if (-not $env:CLOUDFLARE_API_TOKEN) {
    $env:CLOUDFLARE_API_TOKEN = "cfoat_u18enbBvSHSss__6slgSXfutRDIDPH6nncxL6I5bXnw.nBJnLbXG1FrUiLrIHb_h0BviDbTS9aNIp08YlIg3GwY"
}

$env:CLOUDFLARE_ACCOUNT_ID = "89092df8cc06f48007f4e87344e99941"

# 2. Sync worker.js with _worker.js if modified
if (Test-Path "$projectDir\_worker.js") {
    Copy-Item "$projectDir\_worker.js" "$projectDir\worker.js" -Force
}

# 3. Deploy to Pages
Write-Host "[INFO] Starte Deployment zu Cloudflare Pages (Projekt: omniscope-web)..." -ForegroundColor Cyan
npx wrangler pages deploy . --project-name=omniscope-web --commit-dirty=true

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " [DEPLOY COMPLETE] Live unter: https://omniscope-web.pages.dev" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
