<#
.SYNOPSIS
    Copy skills from the universal hub to Claude and Gemini; Codex reads the hub directly.
#>
[CmdletBinding()]
param(
    [string]$SourceHub = "$env:USERPROFILE\.agents\skills",
    [switch]$Bidirectional
)
$ErrorActionPreference = 'Stop'
if ($Bidirectional) {
    throw 'Bidirectional sync is no longer supported. Review changes in the hub, then sync outward.'
}
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    throw 'Python 3 is required for skill synchronization.'
}
& python (Join-Path $PSScriptRoot 'sync-skills.py') --source $SourceHub --home $env:USERPROFILE
if ($LASTEXITCODE -ne 0) { throw "Skill synchronization failed (exit $LASTEXITCODE)." }
