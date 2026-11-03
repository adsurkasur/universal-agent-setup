# scripts/migrate-codex-skills.ps1
param(
    [string]$CodexSkills = "$env:USERPROFILE\.codex\skills",
    [string]$BackupRoot  = "$env:USERPROFILE\.codex\skills_backup"
)

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "        MIGRATING CODEX TO NATIVE SHARED HUB (~/.agents/skills)   " -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan

if (-not (Test-Path $CodexSkills)) {
    Write-Host "Codex skills folder does not exist: $CodexSkills"
    exit 0
}

$items = Get-ChildItem -Path $CodexSkills -Force
$junctions = @($items | Where-Object { $_.LinkType -eq "Junction" })
$systemDirs = @($items | Where-Object { $_.Name.StartsWith(".") })
$realDirs = @($items | Where-Object { (-not $_.LinkType) -and (-not $_.Name.StartsWith(".")) })

Write-Host "Found $($junctions.Count) junctions, $($systemDirs.Count) system items, $($realDirs.Count) real items."

if ($junctions.Count -eq 0) {
    Write-Host "[OK] No legacy junctions to migrate in $CodexSkills." -ForegroundColor Green
    exit 0
}

$ts = (Get-Date -Format "yyyyMMdd_HHmmss")
$backupDir = "${BackupRoot}_$ts"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
Write-Host "Created backup folder: $backupDir" -ForegroundColor Yellow

# Record manifest
$manifest = @()
foreach ($j in $junctions) {
    $manifest += [PSCustomObject]@{
        Name   = $j.Name
        Target = [string]$j.Target
    }
}
$manifestPath = Join-Path $backupDir "junctions_manifest.json"
$manifest | ConvertTo-Json -Depth 3 | Set-Content $manifestPath -Encoding UTF8
Write-Host "Saved junction manifest with $($manifest.Count) entries to: $manifestPath" -ForegroundColor Green

# Remove only the junction links (never touches the target folders in ~/.agents/skills)
$removed = 0
foreach ($j in $junctions) {
    [System.IO.Directory]::Delete($j.FullName)
    $removed++
}

Write-Host "Removed $removed legacy junction links from $CodexSkills." -ForegroundColor Green
Write-Host "Preserved all system items:"
Get-ChildItem -Path $CodexSkills -Force | ForEach-Object { Write-Host " - $($_.Name)" -ForegroundColor Cyan }
Write-Host "==================================================================" -ForegroundColor Cyan
