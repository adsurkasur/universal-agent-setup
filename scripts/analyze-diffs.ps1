param(
    [string]$RepoPath = "$PSScriptRoot\..",
    [string]$HubPath = "$env:USERPROFILE\.agents\skills"
)

$mismatched = @(
    "ask-matt", "bigquery-data-transfer-service", "brainstorming", "building-data-apps",
    "code-review", "dataform-bigquery", "dbt-bigquery", "diagnosing-bugs",
    "discovering-gcp-data-assets", "find-skills", "gcloud-auth-verification",
    "gcp-composer-troubleshooting", "gcp-dataflow", "gcp-data-pipelines",
    "gcp-pipeline-orchestration", "gcp-spark", "grilling", "handoff", "implement",
    "managing-python-dependencies", "microsoft-foundry", "setup-matt-pocock-skills",
    "tdd", "teach", "to-tickets", "ui-ux-pro-max", "using-superpowers", "wayfinder"
)

Write-Host "Analyzing $($mismatched.Count) skills with differences..."
$report = @()

foreach ($s in $mismatched) {
    $fRepo = Join-Path $RepoPath "skills\$s\SKILL.md"
    $fHub  = Join-Path $HubPath "$s\SKILL.md"

    $itemRepo = Get-Item $fRepo
    $itemHub  = Get-Item $fHub

    $report += [PSCustomObject]@{
        Skill = $s
        RepoTime = $itemRepo.LastWriteTime.ToString("yyyy-MM-dd HH:mm")
        HubTime  = $itemHub.LastWriteTime.ToString("yyyy-MM-dd HH:mm")
        RepoSize = $itemRepo.Length
        HubSize  = $itemHub.Length
        Newer    = if ($itemRepo.LastWriteTime -gt $itemHub.LastWriteTime) { "Repo" } else { "Hub" }
    }
}

$report | Format-Table -AutoSize
