<#
.SYNOPSIS
    Automated Multi-Agent Setup & Skills Installer for Windows.
.DESCRIPTION
    Script instalasi lengkap untuk mereplikasi seluruh konfigurasi AI Agent:
    - 197 Unified Skills (Engineering Superpowers, Matt Pocock, Ponytail, GSAP, Motion Design, Framer Motion, Taste/Impeccable, Bahasa Indonesia EYD V & KBBI, Scientific Writing, Vercel, Bio/Science, Playwright, Three.js, Shadcn UI, Tailwind v4, Typst, Remotion, Readme Generator, Skill Router, Deck Builder, Reverse Engineer Anything, dll.)
    - Sinkronisasi ke 5 Direktori: ~/.agents/skills, ~/.codex/skills, ~/.gemini/config/skills, ~/.gemini/skills, dan ~/.claude/skills
    - Setup Konfigurasi 12 MCP Servers (Draw.io, Ripple, Android Emulator, Arduino, Figma, Better Icons, Playwright, Chrome DevTools, GitHub, Context7, REA, Play Console) dengan Smart Merge & Auto-Backup
#>

[CmdletBinding()]
param(
    [switch]$ForceOverwriteConfigs = $false
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$bundleRoot = Split-Path -Parent $scriptDir
$skillsBundle = Join-Path $bundleRoot "skills"
$configsBundle = Join-Path $bundleRoot "configs"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "     UNIVERSAL AI AGENT MULTI-MACHINE SETUP INSTALLER     " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Bundle Directory: $bundleRoot" -ForegroundColor Gray
Write-Host "Target User Home: $env:USERPROFILE" -ForegroundColor Gray
Write-Host ""

# 1. Cek Prerequisites
Write-Host "[1/6] Memeriksa Prasyarat Sistem..." -ForegroundColor Yellow
$hasNode = Get-Command node -ErrorAction SilentlyContinue
$hasNpm = Get-Command npm -ErrorAction SilentlyContinue
$hasGit = Get-Command git -ErrorAction SilentlyContinue
$hasPython = Get-Command python -ErrorAction SilentlyContinue

if ($hasNode -and $hasNpm) {
    Write-Host "  [OK] Node.js & npm terdeteksi ($(node -v))" -ForegroundColor Green
} else {
    Write-Warning "  [PERINGATAN] Node.js/npm belum terdeteksi. Server MCP berbasis npx memerlukan Node.js."
}

if ($hasGit) {
    Write-Host "  [OK] Git terdeteksi" -ForegroundColor Green
} else {
    Write-Host "  [INFO] Git belum terpasang." -ForegroundColor Gray
}

if ($hasPython) {
    Write-Host "  [OK] Python terdeteksi ($(python --version))" -ForegroundColor Green
} else {
    Write-Host "  [INFO] Python belum terdeteksi di PATH." -ForegroundColor Gray
}

# 2. Deteksi Path Khusus (Android SDK, Arduino CLI, Browser & GitHub Token)
Write-Host "`n[2/6] Mendeteksi Hardware & Browser Paths..." -ForegroundColor Yellow
$androidHome = "$env:LOCALAPPDATA\Android\Sdk"
if (Test-Path "E:\Android\Sdk") {
    $androidHome = "E:\Android\Sdk"
} elseif (Test-Path "$env:LOCALAPPDATA\Android\Sdk") {
    $androidHome = "$env:LOCALAPPDATA\Android\Sdk"
}
$adbPath = Join-Path $androidHome "platform-tools\adb.exe"

$arduinoCli = "arduino-cli.exe"
$scoopArduino = "$env:USERPROFILE\scoop\apps\arduino-cli\current\arduino-cli.exe"
if (Test-Path $scoopArduino) {
    $arduinoCli = $scoopArduino
} elseif (Get-Command arduino-cli -ErrorAction SilentlyContinue) {
    $arduinoCli = (Get-Command arduino-cli).Source
}

$browserPath = "msedge.exe"
if (Test-Path "C:\Program Files\Google\Chrome\Application\chrome.exe") {
    $browserPath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
} elseif (Test-Path "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe") {
    $browserPath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
} elseif (Test-Path "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe") {
    $browserPath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
} elseif (Test-Path "C:\Program Files\Microsoft\Edge\Application\msedge.exe") {
    $browserPath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}

$ghToken = ""
if (Get-Command gh -ErrorAction SilentlyContinue) {
    try { $ghToken = (gh auth token 2>$null) } catch {}
}
if (-not $ghToken -and $env:GITHUB_TOKEN) {
    $ghToken = $env:GITHUB_TOKEN
}

$playConsoleKey = "$env:USERPROFILE\.gemini\play-console-key.json"
if ($env:GOOGLE_SERVICE_ACCOUNT_KEY_PATH -and (Test-Path $env:GOOGLE_SERVICE_ACCOUNT_KEY_PATH)) {
    $playConsoleKey = $env:GOOGLE_SERVICE_ACCOUNT_KEY_PATH
}

Write-Host "  Android SDK Root : $androidHome" -ForegroundColor Gray
Write-Host "  ADB Executable   : $adbPath" -ForegroundColor Gray
Write-Host "  Arduino CLI Path : $arduinoCli" -ForegroundColor Gray
Write-Host "  Target Browser   : $browserPath" -ForegroundColor Gray
Write-Host "  GitHub Auth      : $(if ($ghToken) { 'Terdeteksi (Aktif)' } else { 'Tidak terdeteksi (Gunakan gh auth login)' })" -ForegroundColor Gray
Write-Host "  Play Console Key : $(if (Test-Path $playConsoleKey) { $playConsoleKey } else { 'Tidak terdeteksi (~/.gemini/play-console-key.json)' })" -ForegroundColor Gray

# 3. Membuat Struktur Direktori Agent
Write-Host "`n[3/6] Mempersiapkan Struktur Direktori Agent..." -ForegroundColor Yellow
$dirs = @(
    "$env:USERPROFILE\.agents\skills",
    "$env:USERPROFILE\.codex\skills",
    "$env:USERPROFILE\.gemini\config\skills",
    "$env:USERPROFILE\.gemini\skills",
    "$env:USERPROFILE\.gemini\antigravity-ide",
    "$env:USERPROFILE\.claude\skills",
    "$env:APPDATA\Claude"
)

foreach ($d in $dirs) {
    if (-not (Test-Path $d)) {
        New-Item -ItemType Directory -Path $d -Force | Out-Null
        Write-Host "  Dibuat: $d" -ForegroundColor Green
    } else {
        Write-Host "  Sudah ada: $d" -ForegroundColor Gray
    }
}

# 4. Salin Skills ke Source Hub (~/.agents/skills)
Write-Host "`n[4/6] Menyalin 197 Skills ke Central Hub (~/.agents/skills)..." -ForegroundColor Yellow
if (Test-Path $skillsBundle) {
    robocopy $skillsBundle "$env:USERPROFILE\.agents\skills" /E /XO /NP /NFL /NDL /NJH /NJS | Out-Null
    $totalHub = (Get-ChildItem "$env:USERPROFILE\.agents\skills" -Directory | Where-Object { -not $_.Name.StartsWith(".") }).Count
    Write-Host "  [OK] Berhasil menyalin $totalHub skills ke Central Hub." -ForegroundColor Green
} else {
    Write-Error "Direktori sumber skills tidak ditemukan di '$skillsBundle'!"
    exit 1
}

# 5. Sinkronisasi Presisi ke Seluruh Agent Directory
Write-Host "`n[5/6] Menyinkronkan Skills ke Seluruh Agent Directory (Codex, Antigravity, Claude)..." -ForegroundColor Yellow
$syncScript = Join-Path $scriptDir "sync-skills.ps1"
if (Test-Path $syncScript) {
    & $syncScript -SourceHub "$env:USERPROFILE\.agents\skills"
} else {
    # Fallback copy manual
    robocopy "$env:USERPROFILE\.agents\skills" "$env:USERPROFILE\.codex\skills" /E /XO /NP /NFL /NDL /NJH /NJS | Out-Null
    robocopy "$env:USERPROFILE\.agents\skills" "$env:USERPROFILE\.gemini\config\skills" /E /XO /NP /NFL /NDL /NJH /NJS | Out-Null
    robocopy "$env:USERPROFILE\.agents\skills" "$env:USERPROFILE\.gemini\skills" /E /XO /NP /NFL /NDL /NJH /NJS | Out-Null
    robocopy "$env:USERPROFILE\.agents\skills" "$env:USERPROFILE\.claude\skills" /E /XO /NP /NFL /NDL /NJH /NJS | Out-Null
}

# 6. Setup & Smart Merge Konfigurasi MCP (Antigravity, Claude, Codex)
Write-Host "`n[6/6] Memasang & Menggabungkan Konfigurasi 12 MCP Servers..." -ForegroundColor Yellow

# Generate resolved template files temporarily if needed
$tempConfigDir = Join-Path $env:TEMP "agent_configs_resolved"
if (Test-Path $tempConfigDir) { Remove-Item -Path $tempConfigDir -Recurse -Force | Out-Null }
New-Item -ItemType Directory -Path $tempConfigDir -Force | Out-Null

function Process-Template([string]$content) {
    $escapedAdb = $androidHome.Replace('\', '\\')
    $escapedAndroid = $androidHome.Replace('\', '\\')
    $escapedArduino = $arduinoCli.Replace('\', '\\')
    $escapedBrowser = $browserPath.Replace('\', '\\')
    $escapedToken = if ($ghToken) { $ghToken } else { "" }
    $escapedPlayKey = $playConsoleKey.Replace('\', '\\')
    
    return $content.
        Replace('__ANDROID_ADB_PATH__', $escapedAdb).
        Replace('__ANDROID_HOME__', $escapedAndroid).
        Replace('__ARDUINO_CLI_PATH__', $escapedArduino).
        Replace('__BROWSER_PATH__', $escapedBrowser).
        Replace('__GITHUB_PERSONAL_ACCESS_TOKEN__', $escapedToken).
        Replace('__GOOGLE_PLAY_KEY_PATH__', $escapedPlayKey)
}

# Resolve each config template into temp
Get-ChildItem $configsBundle | ForEach-Object {
    if (-not $_.PSIsContainer) {
        $raw = Get-Content $_.FullName -Raw -Encoding UTF8
        $resolved = Process-Template $raw
        $dest = Join-Path $tempConfigDir $_.Name
        [System.IO.File]::WriteAllText($dest, $resolved, [System.Text.Encoding]::UTF8)
    }
}

$mergePy = Join-Path $scriptDir "merge-configs.py"
if ($hasPython -and (Test-Path $mergePy)) {
    $forceFlag = if ($ForceOverwriteConfigs) { "--force" } else { "" }
    python $mergePy --action all $forceFlag --bundle-dir (Split-Path -Parent $tempConfigDir)
} else {
    Write-Warning "Python tidak ditemukan, beralih ke pemasangan langsung..."
    # Fallback copy
    $agSrc = Join-Path $tempConfigDir "antigravity-mcp_config.json"
    $clSrc = Join-Path $tempConfigDir "claude_desktop_config.json"
    $cdSrc = Join-Path $tempConfigDir "codex_config.toml"

    if (Test-Path $agSrc) { Copy-Item $agSrc "$env:USERPROFILE\.gemini\config\mcp_config.json" -Force }
    if (Test-Path $clSrc) { Copy-Item $clSrc "$env:APPDATA\Claude\claude_desktop_config.json" -Force }
    if (Test-Path $cdSrc) { Copy-Item $cdSrc "$env:USERPROFILE\.codex\config.toml" -Force }
}

# Cleanup temp
Remove-Item -Path $tempConfigDir -Recurse -Force -ErrorAction SilentlyContinue | Out-Null

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "         INSTALLASI DAN SETUP SELESAI DENGAN SUKSES!      " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Ringkasan Hasil:" -ForegroundColor White
Write-Host "1. Seluruh 197 skills kini tersedia di Antigravity, Claude, Codex, dan ~/.agents."
Write-Host "2. 12 MCP Servers (Figma, Draw.io, Ripple, Android, Arduino, Better Icons, Playwright, Chrome DevTools, GitHub, Context7, REA, Play Console) siap dijalankan."
Write-Host "3. Buka 'New Chat' pada ChatGPT Desktop atau Claude Desktop untuk memuat ulang skill."
Write-Host ""
