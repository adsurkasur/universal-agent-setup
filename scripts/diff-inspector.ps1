param(
    [string]$Skill = "ask-matt",
    [string]$RepoPath = "$PSScriptRoot\..",
    [string]$HubPath = "$env:USERPROFILE\.agents\skills"
)

$fRepo = Join-Path $RepoPath "skills\$Skill\SKILL.md"
$fHub  = Join-Path $HubPath "$Skill\SKILL.md"

Write-Host "Comparing $Skill between Repo and Hub:"
Write-Host "Repo: $fRepo"
Write-Host "Hub : $fHub"

$repoLines = Get-Content $fRepo -Encoding UTF8
$hubLines  = Get-Content $fHub -Encoding UTF8

$diff = Compare-Object $repoLines $hubLines
if ($diff) {
    $diff | ForEach-Object {
        [PSCustomObject]@{
            Side = $_.SideIndicator
            Text = $_.InputObject
        }
    } | Format-Table -Wrap
} else {
    Write-Host "WITH UTF-8 ENCODING, THEY ARE IDENTICAL!" -ForegroundColor Green
}
