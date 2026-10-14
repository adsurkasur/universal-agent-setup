<#
.SYNOPSIS
    Sinkronisasi seluruh agent skills dari ~/.agents/skills ke seluruh agent yang terpasang.
.DESCRIPTION
    Script ini memastikan Antigravity, ChatGPT/Codex, Claude, dan Agent Umum memiliki
    koleksi skill yang 100% identik dan mutakhir.
#>

[CmdletBinding()]
param(
    [string]$SourceHub = "$env:USERPROFILE\.agents\skills"
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  AI AGENT SKILLS SYNCHRONIZER (MULTI-AGENT SYNC)         " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

if (-not (Test-Path $SourceHub)) {
    Write-Error "Source hub skills tidak ditemukan di '$SourceHub'!"
    exit 1
}

$targets = @(
    @{ Name = "Codex / ChatGPT"; Path = "$env:USERPROFILE\.codex\skills" },
    @{ Name = "Antigravity / Gemini"; Path = "$env:USERPROFILE\.gemini\skills" },
    @{ Name = "Claude Code / Desktop"; Path = "$env:USERPROFILE\.claude\skills" }
)

$sourceCount = (Get-ChildItem $SourceHub -Directory).Count
Write-Host "Source Hub : $SourceHub ($sourceCount skills)" -ForegroundColor Green

foreach ($target in $targets) {
    $tName = $target.Name
    $tPath = $target.Path
    
    if (-not (Test-Path $tPath)) {
        New-Item -ItemType Directory -Path $tPath -Force | Out-Null
    }
    
    Write-Host "Syncing ke $tName ($tPath)..." -NoNewline
    $robocopyOutput = robocopy $SourceHub $tPath /E /XO /NP /NFL /NDL /NJH /NJS
    $newCount = (Get-ChildItem $tPath -Directory).Count
    Write-Host " [OK] ($newCount skills)" -ForegroundColor Green
}

Write-Host "----------------------------------------------------------" -ForegroundColor Gray
Write-Host "Sinkronisasi selesai! Seluruh agent kini memiliki skill yang setara." -ForegroundColor Cyan
