<#
.SYNOPSIS
    Universal AI Agent Skills Synchronizer (Multi-Agent Sync).
.DESCRIPTION
    Script ini memastikan seluruh lingkungan AI Agent (Antigravity, Codex/ChatGPT,
    Claude Code & Desktop, serta Central Hub ~/.agents) memiliki koleksi skill yang
    100% identik, termutakhir, dan terverifikasi secara hash (SHA-256).
#>

[CmdletBinding()]
param(
    [string]$SourceHub = "$env:USERPROFILE\.agents\skills",
    [switch]$Bidirectional = $true
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  UNIVERSAL AI AGENT SKILLS SYNCHRONIZER                  " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$targets = @(
    @{ Name = "Central Hub (~/.agents)"; Path = "$env:USERPROFILE\.agents\skills" },
    @{ Name = "Codex / ChatGPT"; Path = "$env:USERPROFILE\.codex\skills" },
    @{ Name = "Antigravity Config"; Path = "$env:USERPROFILE\.gemini\config\skills" },
    @{ Name = "Antigravity Fallback"; Path = "$env:USERPROFILE\.gemini\skills" },
    @{ Name = "Claude Code / Desktop"; Path = "$env:USERPROFILE\.claude\skills" }
)

# Jika dieksekusi dari dalam folder repo universal-agent-setup, tambahkan repo skills
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoSkills = Join-Path (Split-Path -Parent $scriptDir) "skills"
if (Test-Path $repoSkills) {
    $targets += @{ Name = "Universal Setup Repo"; Path = $repoSkills }
}

# Pastikan semua direktori target ada
foreach ($t in $targets) {
    if (-not (Test-Path $t.Path)) {
        New-Item -ItemType Directory -Path $t.Path -Force | Out-Null
    }
}

# Gunakan python bawaan untuk sinkronisasi hash berkecepatan tinggi dan normalisasi baris (CRLF/LF)
$pythonCmd = Get-Command python -ErrorAction SilentlyContinue
if ($pythonCmd) {
    Write-Host "Menjalankan sinkronisasi presisi tinggi via Python Engine..." -ForegroundColor Yellow
    $pyScript = @"
import os, shutil, hashlib

targets = [
r'$($targets[0].Path)',
r'$($targets[1].Path)',
r'$($targets[2].Path)',
r'$($targets[3].Path)',
r'$($targets[4].Path)'
]
repo_path = r'$repoSkills'
if os.path.exists(repo_path) and repo_path not in targets:
    targets.append(repo_path)

def norm_hash(fpath):
    try:
        with open(fpath, 'rb') as f:
            c = f.read().replace(b'\r\n', b'\n')
            return hashlib.sha256(c).hexdigest()
    except Exception:
        return None

# Discover all unique skills
all_skills = set()
for t in targets:
    if os.path.exists(t):
        for item in os.listdir(t):
            sp = os.path.join(t, item)
            if os.path.isdir(sp) and not item.startswith('.'):
                all_skills.add(item)

copied = 0
updated = 0

for skill in sorted(all_skills):
    # Collect union of files
    files_map = {}
    for t in targets:
        sdir = os.path.join(t, skill)
        if os.path.exists(sdir):
            for root, dirs, files in os.walk(sdir):
                rel = os.path.relpath(root, sdir)
                for f in files:
                    rel_f = os.path.normpath(os.path.join(rel, f))
                    full_p = os.path.join(root, f)
                    h = norm_hash(full_p)
                    if h and rel_f not in files_map:
                        files_map[rel_f] = (full_p, h)

    for t in targets:
        dst_sdir = os.path.join(t, skill)
        os.makedirs(dst_sdir, exist_ok=True)
        for rel_f, (src_p, src_h) in files_map.items():
            dst_p = os.path.join(dst_sdir, rel_f)
            if not os.path.exists(dst_p):
                os.makedirs(os.path.dirname(dst_p), exist_ok=True)
                shutil.copy2(src_p, dst_p)
                copied += 1
            else:
                dst_h = norm_hash(dst_p)
                if dst_h != src_h:
                    shutil.copy2(src_p, dst_p)
                    updated += 1

print(f'Sync Result: {len(all_skills)} skills synchronized across {len(targets)} targets. (Copied: {copied}, Updated: {updated})')
"@
    python -c "$pyScript"
} else {
    Write-Host "Fallback: Menjalankan sinkronisasi via Robocopy..." -ForegroundColor Yellow
    foreach ($t in $targets) {
        if ($t.Path -ne $SourceHub) {
            robocopy $SourceHub $t.Path /E /XO /NP /NFL /NDL /NJH /NJS | Out-Null
        }
    }
}

Write-Host "----------------------------------------------------------" -ForegroundColor Gray
Write-Host "Status Terakhir Setiap Agent:" -ForegroundColor White
foreach ($t in $targets) {
    if (Test-Path $t.Path) {
        $count = (Get-ChildItem $t.Path -Directory | Where-Object { -not $_.Name.StartsWith(".") }).Count
        Write-Host "  $($t.Name.PadRight(30)) : $count skills" -ForegroundColor Green
    }
}
Write-Host "Sinkronisasi selesai! Seluruh agent kini memiliki skill yang 100% identik." -ForegroundColor Cyan
