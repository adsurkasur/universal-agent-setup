# scripts/repair-hub-junctions.ps1
param(
    [string]$RepoPath = "$PSScriptRoot\..",
    [string]$HubPath = "$env:USERPROFILE\.agents\skills"
)

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "        REPAIRING BROKEN JUNCTIONS & HYDRATING LOCAL HUB          " -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan

$hubItems = Get-ChildItem -Path $HubPath -Force | Where-Object { $_.LinkType -eq "Junction" }
Write-Host "Total junctions found in Hub: $($hubItems.Count)"

$brokenCount = 0
foreach ($j in $hubItems) {
    $targetPath = [string]($j.Target)
    if (-not (Test-Path $targetPath)) {
        Write-Host " -> Removing broken junction: $($j.Name) (Target: $targetPath)" -ForegroundColor Yellow
        [System.IO.Directory]::Delete($j.FullName)
        $brokenCount++
    }
}

Write-Host "Removed $brokenCount broken junctions from Hub."
Write-Host ""

$repoSkillsDir = Join-Path $RepoPath "skills"
Write-Host "Hydrating real skill folders from Repo ($repoSkillsDir) to Hub ($HubPath)..." -ForegroundColor Yellow

$repoSkills = Get-ChildItem -Path $repoSkillsDir -Directory
$copiedCount = 0

foreach ($s in $repoSkills) {
    $dest = Join-Path $HubPath $s.Name
    if (-not (Test-Path $dest)) {
        Copy-Item -Path $s.FullName -Destination $dest -Recurse -Force
        Write-Host " -> Restored real folder: $($s.Name)" -ForegroundColor Green
        $copiedCount++
    }
}

Write-Host ""
Write-Host "Restored $copiedCount skills into Hub as physical self-contained directories."
Write-Host "Total skills in Hub now: $((Get-ChildItem -Path $HubPath -Directory).Count)"
Write-Host "==================================================================" -ForegroundColor Cyan
