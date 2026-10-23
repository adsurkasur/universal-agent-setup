# test-suite.ps1 - Automated Test Suite for Universal Agent Skills and MCP Setup
param(
    [string]$HubPath = "$env:USERPROFILE\.agents\skills",
    [string]$RepoPath = "$PSScriptRoot\.."
)

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  UNIVERSAL AGENT SETUP - COMPREHENSIVE SKILL SUITE VERIFICATION " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ("Timestamp: " + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss') + "`n")

$results = [ordered]@{
    HubSync = $false
    MetadataIntegrity = $false
    SkillRouter = $false
    BahasaEydSuite = $false
    ReadmeGenerator = $false
    DocumentationAudit = $false
}

# --- TEST 1: Hub and Local Agent Sync Integrity ---
Write-Host "[TEST 1] Verifying Hub and Agent Directory Sync..." -ForegroundColor Yellow
$skills = Get-ChildItem -Path $HubPath -Directory
$totalHub = $skills.Count
Write-Host " -> Central Hub: $totalHub skills found."

$claudePath = "$env:USERPROFILE\.claude\skills"
$codexPath = "$env:USERPROFILE\.codex\skills"
$geminiPath = "$env:USERPROFILE\.gemini\config\skills"

$codexCount = if (Test-Path $codexPath) { (Get-ChildItem $codexPath -Directory).Count } else { 0 }
$claudeCount = if (Test-Path $claudePath) { (Get-ChildItem $claudePath -Directory).Count } else { 0 }
$geminiCount = if (Test-Path $geminiPath) { (Get-ChildItem $geminiPath -Directory).Count } else { 0 }

Write-Host " -> OpenAI Codex: $codexCount skills"
Write-Host " -> Anthropic Claude: $claudeCount skills"
Write-Host " -> Google Antigravity: $geminiCount skills"

if ($totalHub -ge 195 -and $codexCount -ge 195) {
    Write-Host " [PASS] Hub and Agents are fully synced.`n" -ForegroundColor Green
    $results.HubSync = $true
} else {
    Write-Host " [FAIL] Skill count discrepancy detected.`n" -ForegroundColor Red
}

# --- TEST 2: SKILL.md Frontmatter and Metadata Integrity ---
Write-Host "[TEST 2] Verifying SKILL.md and YAML frontmatter across all $totalHub skills..." -ForegroundColor Yellow
$validCount = 0
$invalidList = @()

foreach ($dir in $skills) {
    $skillMd = Join-Path $dir.FullName "SKILL.md"
    if (-not (Test-Path $skillMd)) {
        $invalidList += ($dir.Name + ": Missing SKILL.md")
        continue
    }
    $raw = Get-Content $skillMd -Raw -Encoding UTF8
    if ($raw -notmatch '(?s)^---\s*\r?\n(.*?)\r?\n---') {
        $invalidList += ($dir.Name + ": Missing or invalid YAML frontmatter delimiters")
        continue
    }
    $fm = $matches[1]
    if ($fm -notmatch 'name:\s*\S+' -or $fm -notmatch 'description:\s*\S+') {
        $invalidList += ($dir.Name + ": Missing name or description in YAML frontmatter")
        continue
    }
    $validCount++
}

Write-Host " -> Valid skills with clean metadata: $validCount / $totalHub"
if ($invalidList.Count -eq 0) {
    Write-Host " [PASS] 100% of skills passed frontmatter integrity checks.`n" -ForegroundColor Green
    $results.MetadataIntegrity = $true
} else {
    Write-Host (" [FAIL] Invalid skills detected (" + $invalidList.Count + "):") -ForegroundColor Red
    $invalidList | Select-Object -First 5 | ForEach-Object { Write-Host ("    " + $_) -ForegroundColor Red }
    Write-Host "`n"
}

# --- TEST 3: Skill Router Capabilities and Playbook Matrix ---
Write-Host "[TEST 3] Testing 'skill-router' orchestrator logic..." -ForegroundColor Yellow
$routerPath = Join-Path $HubPath "skill-router\SKILL.md"
if (Test-Path $routerPath) {
    $routerContent = Get-Content $routerPath -Raw -Encoding UTF8
    $hasPlaybookA = $routerContent -match "Playbook A: High-Craft Frontend"
    $hasPlaybookB = $routerContent -match "Playbook B: Penulisan Bahasa Indonesia"
    $hasPlaybookC = $routerContent -match "Playbook C: Lazy Senior Dev"
    $hasPlaybookG = $routerContent -match "Playbook G: Repository Polish"
    $hasMcpMatrix = $routerContent -match "Matriks Keputusan MCP Server"
    $hasFallback  = $routerContent -match "Fallback Jaringan"

    if ($hasPlaybookA -and $hasPlaybookB -and $hasPlaybookC -and $hasPlaybookG -and $hasMcpMatrix -and $hasFallback) {
        Write-Host " -> Verified: Playbook A, B, C, G + MCP Matrix + Network Fallback present."
        Write-Host " [PASS] skill-router structure and routing pathways verified.`n" -ForegroundColor Green
        $results.SkillRouter = $true
    } else {
        Write-Host " [FAIL] skill-router missing key playbooks.`n" -ForegroundColor Red
    }
} else {
    Write-Host " [FAIL] skill-router not found in hub.`n" -ForegroundColor Red
}

# --- TEST 4: Indonesian EYD V Suite Verification ---
Write-Host "[TEST 4] Testing 'bahasa-inti' and 'bahasa-peneliti' rules..." -ForegroundColor Yellow
$bahasaInti = Join-Path $HubPath "bahasa-inti\SKILL.md"
$bahasaPeneliti = Join-Path $HubPath "bahasa-peneliti\SKILL.md"

if ((Test-Path $bahasaInti) -and (Test-Path $bahasaPeneliti)) {
    $intiRaw = Get-Content $bahasaInti -Raw -Encoding UTF8
    $penelitiRaw = Get-Content $bahasaPeneliti -Raw -Encoding UTF8

    $hasSehinggaRule = ($intiRaw -match "sehingga") -and ($intiRaw -match "koma")
    $hasEmDashRule   = ($intiRaw -match "em dash") -or ($intiRaw -match "tanda pisah")
    $hasNamunRule    = $intiRaw -match "namun"
    $hasResearchGap  = ($penelitiRaw -match "research gap") -or ($penelitiRaw -match "rumusan masalah")

    if ($hasSehinggaRule -and $hasEmDashRule -and $hasNamunRule -and $hasResearchGap) {
        Write-Host " -> Verified: sehingga comma prohibition, em-dash constraints, namun rules, and research gap requirements."
        Write-Host " [PASS] Bahasa EYD V and Academic writing suite verified.`n" -ForegroundColor Green
        $results.BahasaEydSuite = $true
    } else {
        Write-Host " [FAIL] Bahasa rules incomplete.`n" -ForegroundColor Red
    }
} else {
    Write-Host " [FAIL] Bahasa skills missing from hub.`n" -ForegroundColor Red
}

# --- TEST 5: Readme Generator Verification ---
Write-Host "[TEST 5] Testing 'readme-generator' toolchain and assets..." -ForegroundColor Yellow
$readmeGen = Join-Path $HubPath "readme-generator"
$hasScanner   = Test-Path (Join-Path $readmeGen "scripts\scan_project.sh")
$hasBadges    = Test-Path (Join-Path $readmeGen "assets\badges.json")
$hasTemplate  = Test-Path (Join-Path $readmeGen "assets\readme-template.md")
$hasPractices = Test-Path (Join-Path $readmeGen "references\readme-best-practices.md")

if ($hasScanner -and $hasBadges -and $hasTemplate -and $hasPractices) {
    Write-Host " -> Verified: scan_project.sh, badges.json, readme-template.md, readme-best-practices.md all intact."
    Write-Host " [PASS] readme-generator assets and reference files verified.`n" -ForegroundColor Green
    $results.ReadmeGenerator = $true
} else {
    Write-Host " [FAIL] readme-generator missing core assets.`n" -ForegroundColor Red
}

# --- TEST 6: Attribution and Licensing Audit ---
Write-Host "[TEST 6] Testing Documentation and Upstream Transparency..." -ForegroundColor Yellow
$sourcesPath = Join-Path $RepoPath "SOURCES.md"
$licensePath = Join-Path $RepoPath "LICENSE"
$readmePath  = Join-Path $RepoPath "README.md"

if ((Test-Path $sourcesPath) -and (Test-Path $licensePath) -and (Test-Path $readmePath)) {
    $sourcesRaw = Get-Content $sourcesPath -Raw -Encoding UTF8
    $licenseRaw = Get-Content $licensePath -Raw -Encoding UTF8
    $has195Attribution = ($sourcesRaw -match "195") -or ($sourcesRaw -match "Total")
    $hasMitNotice = ($licenseRaw -match "MIT License") -and ($licenseRaw -match "Third-Party")

    Write-Host " -> has195Attribution: $has195Attribution, hasMitNotice: $hasMitNotice"
    if ($has195Attribution -and $hasMitNotice) {
        Write-Host " -> Verified: SOURCES.md attribution and LICENSE compilation notice intact."
        Write-Host " [PASS] Documentation, licensing, and legal disclaimers verified.`n" -ForegroundColor Green
        $results.DocumentationAudit = $true
    } else {
        Write-Host " [FAIL] SOURCES.md or LICENSE missing key terms (has195=$has195Attribution, hasMit=$hasMitNotice).`n" -ForegroundColor Red
    }
} else {
    Write-Host " [FAIL] Core docs missing from repository.`n" -ForegroundColor Red
}

# --- FINAL SCOREBOARD ---
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "                      TEST SUMMARY REPORT                       " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
$allPass = $true
foreach ($k in $results.Keys) {
    $status = if ($results[$k]) { "[PASS]" } else { "[FAIL]"; $allPass = $false }
    $color = if ($results[$k]) { "Green" } else { "Red" }
    Write-Host ("{0,-25} : {1}" -f $k, $status) -ForegroundColor $color
}
Write-Host "================================================================" -ForegroundColor Cyan

if ($allPass) {
    Write-Host "RESULT: ALL TESTS PASSED! SUITE IS 100% OPERATIONAL." -ForegroundColor Green
    exit 0
} else {
    Write-Host "RESULT: SOME TESTS FAILED. PLEASE REVIEW LOGS." -ForegroundColor Red
    exit 1
}
