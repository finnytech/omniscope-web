# OmniScope Web - One-Click Cloudflare Pages Deployment Script
$ErrorActionPreference = "Stop"

$projectDir = $PSScriptRoot
Set-Location $projectDir

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " [OMNISCOPE OSINT] Cloudflare Pages Deployer" -ForegroundColor Yellow
Write-Host " Pfad: $projectDir" -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Resolve Cloudflare API Token (with automated OAuth Refresh)
$tokenFile = "$env:APPDATA\xdg.config\cloudflare\config\default.json"
if (Test-Path $tokenFile) {
    try {
        $json = Get-Content $tokenFile -Raw | ConvertFrom-Json
        $isExpired = $false
        if ($json.expiration_time) {
            $expDate = [DateTime]::Parse($json.expiration_time)
            if ($expDate -le [DateTime]::UtcNow.AddMinutes(2)) {
                $isExpired = $true
            }
        }
        
        # Auto-refresh if expired and refresh_token is available
        if ($isExpired -and $json.refresh_token) {
            Write-Host "[INFO] Cloudflare OAuth Token ist abgelaufen. Erneuere Token via Refresh Flow..." -ForegroundColor Cyan
            $refreshBody = @{
                grant_type    = "refresh_token"
                refresh_token = $json.refresh_token
                client_id     = "cbca97e7-c331-4cdd-8fd8-e25a451b98bf"
            }
            $refreshRes = Invoke-RestMethod -Uri "https://dash.cloudflare.com/oauth2/token" -Method Post -Body $refreshBody -ContentType "application/x-www-form-urlencoded"
            if ($refreshRes.access_token) {
                $json.oauth_token = $refreshRes.access_token
                if ($refreshRes.refresh_token) { $json.refresh_token = $refreshRes.refresh_token }
                $json.expiration_time = [DateTime]::UtcNow.AddSeconds($refreshRes.expires_in).ToString("o")
                $json | ConvertTo-Json -Depth 10 | Set-Content $tokenFile -Force
                Write-Host "[OK] Cloudflare OAuth Token erfolgreich erneuert! Gültig bis: $($json.expiration_time)" -ForegroundColor Green
            }
        }
        
        if ($json.oauth_token) {
            $env:CLOUDFLARE_API_TOKEN = $json.oauth_token
            Write-Host "[OK] Cloudflare OAuth Token geladen aus default.json (Gültig bis: $($json.expiration_time))" -ForegroundColor Green
        }
    } catch {
        Write-Host "[WARN] Konnte default.json nicht parsen/erneuern: $_" -ForegroundColor DarkYellow
    }
}

if (-not $env:CLOUDFLARE_API_TOKEN) {
    $env:CLOUDFLARE_API_TOKEN = "cfoat_u18enbBvSHSss__6slgSXfutRDIDPH6nncxL6I5bXnw.nBJnLbXG1FrUiLrIHb_h0BviDbTS9aNIp08YlIg3GwY"
}

$env:CLOUDFLARE_ACCOUNT_ID = "89092df8cc06f48007f4e87344e99941"
$env:CI = "1"
$env:WRANGLER_SEND_METRICS = "false"

# 2. Sync worker.js with _worker.js if modified
if (Test-Path "$projectDir\_worker.js") {
    Copy-Item "$projectDir\_worker.js" "$projectDir\worker.js" -Force
}

$wranglerJs = "D:\openclaw-state\npm-cache\_npx\32026684e21afda6\node_modules\wrangler\bin\wrangler.js"

# 3. Deploy to Pages (Production Main)
Write-Host "[INFO] Starte Deployment zu Cloudflare Pages (Production: omniscope-web.pages.dev)..." -ForegroundColor Cyan
& node $wranglerJs pages deploy . --project-name=omniscope-web --branch=main --commit-dirty=true

# 4. Deploy www Alias Preview Branch (auto-redirects to main)
Write-Host "[INFO] Aktualisiere www-Alias Branch (www.omniscope-web.pages.dev -> 301 Redirect)..." -ForegroundColor Cyan
& node $wranglerJs pages deploy . --project-name=omniscope-web --branch=www --commit-dirty=true

# 5. Deploy Standalone Worker (omniscope-web.fuchsdany1984.workers.dev)
Write-Host "[INFO] Aktualisiere Standalone Cloudflare Worker (omniscope-web)..." -ForegroundColor Cyan
& node $wranglerJs deploy worker.js --name omniscope-web --compatibility-date 2026-10-14

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " [PAGES PROD]   Live unter: https://omniscope-web.pages.dev" -ForegroundColor Green
Write-Host " [PAGES ALIAS]  Live unter: https://www.omniscope-web.pages.dev (301 Auto-Redirect)" -ForegroundColor Green
Write-Host " [WORKER EDGE]  Live unter: https://omniscope-web.fuchsdany1984.workers.dev" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
