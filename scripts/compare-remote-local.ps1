# scripts/compare-remote-local.ps1
param(
    [string]$RepoPath = "$PSScriptRoot\..",
    [string]$HubPath = "$env:USERPROFILE\.agents\skills"
)

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "         COMPARING REMOTE / REPO SKILLS WITH LOCAL HUB            " -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan

$repoSkillsDir = Join-Path $RepoPath "skills"
$repoSkills = Get-ChildItem -Path $repoSkillsDir -Directory | Select-Object -ExpandProperty Name | Sort-Object
$hubSkills = Get-ChildItem -Path $HubPath -Directory | Select-Object -ExpandProperty Name | Sort-Object

Write-Host "Repo (GitHub synced) Skills Count : $($repoSkills.Count)"
Write-Host "Local Hub (~/.agents/skills) Count: $($hubSkills.Count)"
Write-Host ""

$missingInHub = $repoSkills | Where-Object { $hubSkills -notcontains $_ }
$missingInRepo = $hubSkills | Where-Object { $repoSkills -notcontains $_ }

if ($missingInHub.Count -gt 0) {
    Write-Host "[WARNING] Found in Remote/Repo but missing in Local Hub ($($missingInHub.Count)):" -ForegroundColor Red
    $missingInHub | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
} else {
    Write-Host "[PASS] 0 skills missing from Local Hub (All Remote skills exist locally)." -ForegroundColor Green
}

if ($missingInRepo.Count -gt 0) {
    Write-Host "[WARNING] Found in Local Hub but missing in Remote/Repo ($($missingInRepo.Count)):" -ForegroundColor Yellow
    $missingInRepo | ForEach-Object { Write-Host " - $_" -ForegroundColor Yellow }
} else {
    Write-Host "[PASS] 0 skills missing from Remote/Repo (All Local skills exist on Remote)." -ForegroundColor Green
}

Write-Host ""
Write-Host "Checking SKILL.md content differences (normalized line-endings)..." -ForegroundColor Yellow

$realMismatches = @()
$lineEndingOnly = 0

foreach ($skill in $repoSkills) {
    $fRepo = Join-Path $repoSkillsDir "$skill\SKILL.md"
    $fHub  = Join-Path $HubPath "$skill\SKILL.md"
    
    if ((Test-Path $fRepo) -and (Test-Path $fHub)) {
        $cRepo = [System.IO.File]::ReadAllText($fRepo)
        $cHub  = [System.IO.File]::ReadAllText($fHub)
        
        $cRepoNorm = $cRepo -replace "\r\n", "`n"
        $cHubNorm  = $cHub -replace "\r\n", "`n"

        if ($cRepoNorm -ne $cHubNorm) {
            $realMismatches += $skill
        } elseif ($cRepo -ne $cHub) {
            $lineEndingOnly++
        }
    }
}

if ($realMismatches.Count -gt 0) {
    Write-Host "[FAIL] Real content mismatches detected ($($realMismatches.Count)):" -ForegroundColor Red
    $realMismatches | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
} else {
    Write-Host "[PASS] 100% of SKILL.md contents are IDENTICAL! ($lineEndingOnly files had Git CRLF/LF line-ending differences, 0 real text differences)." -ForegroundColor Green
}

Write-Host ""
Write-Host "Checking other local agents sync status..." -ForegroundColor Yellow
$codexSkills = if (Test-Path "$env:USERPROFILE\.codex\skills") { (Get-ChildItem "$env:USERPROFILE\.codex\skills" -Directory | Select-Object -ExpandProperty Name).Count } else { 0 }
$claudeSkills = if (Test-Path "$env:USERPROFILE\.claude\skills") { (Get-ChildItem "$env:USERPROFILE\.claude\skills" -Directory | Select-Object -ExpandProperty Name).Count } else { 0 }
$geminiSkills = if (Test-Path "$env:USERPROFILE\.gemini\config\skills") { (Get-ChildItem "$env:USERPROFILE\.gemini\config\skills" -Directory | Select-Object -ExpandProperty Name).Count } else { 0 }

Write-Host " - OpenAI Codex skills count     : $codexSkills"
Write-Host " - Anthropic Claude skills count : $claudeSkills"
Write-Host " - Antigravity/Gemini count      : $geminiSkills"

Write-Host "==================================================================" -ForegroundColor Cyan
