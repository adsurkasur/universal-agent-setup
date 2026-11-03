param(
    [string]$CodexSkills = "$env:USERPROFILE\.codex\skills"
)

$items = Get-ChildItem -Path $CodexSkills -Force
$junctions = @($items | Where-Object { $_.LinkType -eq "Junction" })
$systemDirs = @($items | Where-Object { $_.Name.StartsWith(".") })
$realDirs = @($items | Where-Object { (-not $_.LinkType) -and (-not $_.Name.StartsWith(".")) })

Write-Host "Total items in $CodexSkills : $($items.Count)"
Write-Host "Junctions                   : $($junctions.Count)"
Write-Host "System/Hidden items         : $($systemDirs.Count)"
Write-Host "Real standalone directories : $($realDirs.Count)"

if ($realDirs.Count -gt 0) {
    Write-Host "`nStandalone Directories:"
    $realDirs | ForEach-Object { Write-Host " - $($_.Name)" }
}

if ($systemDirs.Count -gt 0) {
    Write-Host "`nSystem/Hidden Directories:"
    $systemDirs | ForEach-Object { Write-Host " - $($_.Name)" }
}
