# Universal AI Agent Setup & Skills Bundle (Multi-Machine)

> 🤖 **FOR AI AGENTS (Antigravity, Claude, ChatGPT/Codex, Cursor, Cline, etc.):**
> If the user asked you to setup or install this repository on this machine, please read and follow [`AGENTS.md`](./AGENTS.md) immediately to execute the automated installation.

Paket distribusi dan panduan instalasi komprehensif untuk mereplikasi ekosistem AI Agent dari PC ini ke komputer atau mesin lain.

Dengan paket ini, mesin baru akan langsung memiliki konfigurasi yang **100% setara dan terstandarisasi** untuk 4 lingkungan agent:
1. **Google Antigravity** (IDE & CLI)
2. **Anthropic Claude** (Claude Desktop & Claude Code)
3. **OpenAI ChatGPT** (ChatGPT Desktop / Codex Agent)
4. **Agent Umum / Shared Protocols** (`~/.agents` & `AGENTS.md`)

---

## 📦 Apa Saja yang Ada di Dalam Bundle Ini?

### 1. Koleksi 154 Unified Skills (`skills/`)
Seluruh 154 skill sudah disusun dalam format standar `SKILL.md` yang dapat dibaca oleh seluruh agent:
* **Engineering Skills (`obra/superpowers`)**:
  * `test-driven-development` (TDD)
  * `systematic-debugging` (investigasi bug terstruktur)
  * `writing-plans` & `executing-plans` (perencanaan dan eksekusi bertahap)
  * `verification-before-completion` (verifikasi ketat sebelum menyelesaikan tugas)
  * `subagent-driven-development` & `dispatching-parallel-agents` (orkestrasi subagent)
  * `using-git-worktrees`
* **Matt Pocock Skills (`mattpocock/skills`)**:
  * `/grill-me` & `grilling` (socratic interview mendalam sebelum implementasi kode)
  * `setup-matt-pocock-skills`, `wayfinder`, `to-spec`, `to-tickets`, `triage`, `codebase-design`
* **Ponytail Development (`DietrichGebert/ponytail`)**:
  * `ponytail`, `ponytail-audit`, `ponytail-debt`, `ponytail-gain`, `ponytail-review` (filosofi kode paling ringkas, YAGNI, eliminasi over-engineering)
* **Scientific & Academic Writing (`k-dense-ai`)**:
  * `scientific-writing` (struktur bab ilmiah, metodologi, narasi tesis/jurnal)
  * `paper-lookup` (pencarian sitasi dan literatur)
* **Frontend, UI/UX & Vercel**:
  * `vercel-react-best-practices`, `vercel-optimize`, `vercel-composition-patterns`
  * `ui-ux-pro-max`, `frontend-design`, `web-design-guidelines`
* **Cloud & Big Data**:
  * 34 skills Google Cloud Platform, BigQuery, BigLake, Dataproc, GCS
* **Sains & Basis Data Hayati**:
  * 29 skills pencarian struktur (AlphaFold, ChEMBL, PDB, PubMed, UniProt, ClinVar, dbSNP, dll.)
* **Protokol Portofolio & Logging**:
  * `project-logger` & `AGENTS.md` (pencatatan otomatis `logs/ACTIVITY_LOG.md`, `logs/DECISION_LOG.md`, dan Git submodule hygiene).

---

### 2. Standar 4 MCP Servers (`configs/`)
Konfigurasi MCP yang seragam di seluruh agent:
* **`drawio` (`@drawio/mcp`)**: Membuat dan membuka diagram alir / arsitektur Draw.io langsung dari prompt.
* **`ripple` (`@ytsuda/ripple@latest`)**: Terminal emulator native ConPTY untuk eksekusi konsol Windows interaktif.
* **`android-emulator` (`mcp-android-emulator`)**: Otomasi pengujian UI, screenshot, gesture, dan inspeksi tree emulator Android.
* **`arduino` (`arduino-mcp-server`)**: Kompilasi dan flashing sketch mikrokontroler via Arduino CLI.

---

## 🚀 Panduan Instalasi Cepat di Mesin Baru

### Opsi A: Instalasi Otomatis 1-Klik (Windows PowerShell)

1. **Salin atau ekstrak folder `agent-setup-bundle`** ke mesin baru (misalnya di Desktop atau Downloads).
2. Buka **PowerShell** (Run as Administrator jika memungkinkan).
3. Jalankan script installer:
   ```powershell
   cd path\to\agent-setup-bundle\scripts
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   .\install-all.ps1
   ```
4. **Selesai!** Script secara otomatis:
   * Membuat folder `~/.agents/skills`, `~/.codex/skills`, `~/.gemini/skills`, dan `~/.claude/skills`.
   * Menyalin 154 skills ke seluruh direktori agent.
   * Mendeteksi path Android SDK dan Arduino CLI di mesin baru.
   * Memasang konfigurasi MCP ke Claude Desktop, Antigravity, dan ChatGPT Codex.

---

### Opsi B: Instalasi di macOS / Linux (POSIX)

1. Ekstrak bundle, buka Terminal:
   ```bash
   cd path/to/agent-setup-bundle/scripts
   chmod +x install-all.sh
   ./install-all.sh
   ```

---

## 🔄 Cara Menambah Skill Baru di Kemudian Hari

Untuk menjaga seluruh agent tetap setara ketika Anda ingin menambahkan skill baru:

1. **Buat atau unduh skill baru** ke dalam folder Central Hub:
   ```
   C:\Users\<User>\.agents\skills\<nama-skill>\SKILL.md
   ```
   *(Atau unduh menggunakan command: `npx skills add <nama-repo> -g`)*
2. **Jalankan script sinkronisasi**:
   ```powershell
   powershell -File "path\to\agent-setup-bundle\scripts\sync-skills.ps1"
   ```
3. Script akan menyalin skill baru tersebut secara serentak ke `.codex\skills`, `.gemini\skills`, dan `.claude\skills`.

---

## 💡 Catatan Khusus & Troubleshooting Tiap Agent

### 1. ChatGPT Desktop (Codex) & "Work Mode"
* **Kenapa slash command (seperti `/grill-me`) belum muncul?**
  * Sesi chat yang sedang terbuka menyimpan cache tool pada saat percakapan dibuat.
  * **Solusi**: Mulai **New Chat** (atau restart ChatGPT Desktop). Di chat baru, ketikkan `/grill-me` dan skill akan langsung aktif.
* **Work Mode (Work with Apps)**:
  * Tidak memerlukan konfigurasi manual di dalam UI app. Aplikasi membaca file konfigurasi global di `~/.codex/config.toml` dan `~/.codex/skills/`.

### 2. Claude Desktop
* Konfigurasi tersimpan di `%APPDATA%\Claude\claude_desktop_config.json`.
* MCP kustom `my-skills-mcp` yang lama telah dihapus karena obsolete.
* Claude Desktop memuat server MCP saat aplikasi dibuka. Jika mengubah konfigurasi MCP, cukup tutup dan buka kembali Claude Desktop.

### 3. Antigravity (IDE & CLI)
* Konfigurasi MCP tersimpan di `~/.gemini/config/mcp_config.json`.
* Antigravity membaca skill dari `~/.gemini/skills/` secara global, atau dari folder `.agents/skills` di dalam workspace proyek aktif.

---

## 📁 Struktur Direktori Bundle

```text
agent-setup-bundle/
├── README.md                           <-- Dokumen panduan ini
├── agent-setup-bundle.zip              <-- Arsip zip siap kirim
├── configs/
│   ├── AGENTS.md                       <-- Standar protokol multi-agent portofolio
│   ├── antigravity-mcp_config.json     <-- Template MCP Antigravity
│   ├── claude_desktop_config.json      <-- Template MCP Claude Desktop
│   └── codex_config.toml               <-- Template MCP & settings ChatGPT Codex
├── scripts/
│   ├── install-all.ps1                 <-- Script master installer Windows
│   ├── sync-skills.ps1                 <-- Script sinkronisasi ulang skills
│   └── install-all.sh                  <-- Script installer macOS/Linux
└── skills/                             <-- 154 direktori skills lengkap
    ├── grill-me/
    ├── grilling/
    ├── test-driven-development/
    ├── systematic-debugging/
    ├── ponytail/
    ├── scientific-writing/
    ├── project-logger/
    └── ... (147 skills lainnya)
```
