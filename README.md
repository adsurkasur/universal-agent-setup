# Universal AI Agent Setup & Skills Bundle (Multi-Machine)

> **FOR AI AGENTS (Antigravity, Claude, ChatGPT/Codex, Cursor, Cline, etc.):**
> If the user asked you to setup or install this repository on this machine, please read and follow [`AGENTS.md`](./AGENTS.md) immediately to execute the automated installation.

Paket distribusi dan panduan instalasi komprehensif untuk mereplikasi ekosistem AI Agent dari PC ini ke komputer atau mesin lain.

Dengan paket ini, mesin baru akan langsung memiliki konfigurasi yang **100% setara dan terstandarisasi** untuk 4 lingkungan agent:
1. **Google Antigravity** (IDE & CLI)
2. **Anthropic Claude** (Claude Desktop & Claude Code)
3. **OpenAI ChatGPT** (ChatGPT Desktop / Codex Agent)
4. **Agent Umum / Shared Protocols** (`~/.agents` & `AGENTS.md`)

---

## Apa Saja yang Ada di Dalam Bundle Ini?

### 1. Koleksi 183 Unified Skills (`skills/`)
Seluruh 183 skill sudah disusun dalam format standar `SKILL.md` yang dapat dibaca oleh seluruh agent:
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
* **Design Direction, Taste & Frontend Craft**:
  * `impeccable` (`pbakaus/impeccable`) — Direction & craft floor standar penghargaan dunia untuk product UI, landing pages, dan design system.
  * `taste-skill` / `design-taste-frontend` (`Leonxlnx/taste-skill`) — Anti-slop frontend art direction dari 247 curated gallery sites.
  * `hallmark` (`Nutlope/hallmark`) — Next-gen design taste dan modern frontend patterns.
  * `better-icons` (`better-auth/better-icons`) — Integrasi dan pencarian 200.000+ ikon dari 150+ pustaka ikon.
  * `ui-ux-pro-max`, `frontend-design`, `web-design-guidelines`
  * `vercel-react-best-practices`, `vercel-optimize`, `vercel-composition-patterns`
* **Motion & Animation Suite**:
  * `framer-motion` — Animasi produksi tinggi untuk React & modern `motion/react` (v12+), gesture, layoutId, AnimatePresence, dan SSR.
  * `motion-design` (`LottieFiles/motion-design-skill`) — Prinsip gerak, Disney principles adapted for UI, koreografi multi-elemen.
  * `lottie-maker` (`FWcloud916/skill-lottie-maker`) — Diagnostik, inspeksi, dan pembuatan bundel animasi portabel Lottie JSON.
  * **GSAP Animation Suite (8 skills)**: `gsap-core`, `gsap-frameworks`, `gsap-performance`, `gsap-plugins`, `gsap-react`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-utils`
* **Anti-AI Writing & Prose Refining**:
  * `humanizer` (`blader/humanizer`) — Menghilangkan tanda-tanda teks buatan AI berdasarkan Wikipedia "Signs of AI writing" agar terdengar otentik.
  * `stop-slop` (`hardikpandya/stop-slop`) — Memotong filler phrases, formula buatan AI, kalimat pasif, dan adverb berlebihan.
* **Scientific & Academic Writing (`k-dense-ai`)**:
  * `scientific-writing` (struktur bab ilmiah, metodologi, narasi tesis/jurnal)
  * `paper-lookup` (pencarian sitasi dan literatur)
  * Dokumen akademik: `academic-pptx`, `pptx`, `docx`, `xlsx`, `pdf`
* **Cloud & Big Data**:
  * 34 skills Google Cloud Platform, BigQuery, BigLake, Dataproc, GCS
* **Sains Hayati & Genomika**:
  * 32 skills pencarian struktur & genomika (AlphaFold, AlphaGenome, Biomolecular Mol*, ChEMBL, PDB, PubMed, UniProt, ClinVar, dbSNP, dll.)
* **Protokol Portofolio & Logging**:
  * `project-logger` & `AGENTS.md` (pencatatan otomatis `logs/ACTIVITY_LOG.md`, `logs/DECISION_LOG.md`, dan Git submodule hygiene).

---

### 2. Standar 6 MCP Servers (`configs/`)
Konfigurasi MCP yang seragam di seluruh agent:
* **`better-icons` (`better-icons`)**: Cari dan pasang langsung 200.000+ ikon dari 150+ pustaka ikon (Lucide, Heroicons, Material, dll.) ke proyek tanpa manual copy-paste SVG.
* **`figma` (`https://mcp.figma.com/mcp`)**: Integrasi desain resmi Figma via Streamable HTTP untuk seluruh agent.
* **`drawio` (`@drawio/mcp`)**: Membuat dan membuka diagram alir / arsitektur Draw.io langsung dari prompt.
* **`ripple` (`@ytsuda/ripple@latest`)**: Terminal emulator native ConPTY untuk eksekusi konsol Windows interaktif.
* **`android-emulator` (`mcp-android-emulator`)**: Otomasi pengujian UI, screenshot, gesture, dan inspeksi tree emulator Android.
* **`arduino` (`arduino-mcp-server`)**: Kompilasi dan flashing sketch mikrokontroler via Arduino CLI.

---

## Panduan Instalasi Cepat di Mesin Baru

### Opsi A: Instalasi Otomatis 1-Klik (Windows PowerShell)

1. **Salin atau clone repository ini** ke mesin baru (misalnya di Desktop atau Downloads).
2. Buka **PowerShell** (Run as Administrator jika memungkinkan).
3. Jalankan script installer:
   ```powershell
   cd path\to\universal-agent-setup\scripts
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   .\install-all.ps1
   ```
4. **Selesai!** Script secara otomatis:
   * Membuat folder `~/.agents/skills`, `~/.codex/skills`, `~/.gemini/skills`, dan `~/.claude/skills`.
   * Menyalin seluruh 183 skills ke seluruh direktori agent.
   * Mendeteksi path Android SDK dan Arduino CLI di mesin baru.
   * Memasang konfigurasi MCP ke Claude Desktop, Antigravity, dan ChatGPT Codex.

---

### Opsi B: Instalasi di macOS / Linux (POSIX)

1. Ekstrak bundle, buka Terminal:
   ```bash
   cd path/to/universal-agent-setup/scripts
   chmod +x install-all.sh
   ./install-all.sh
   ```

---

## Cara Menambah Skill Baru di Kemudian Hari

Untuk menjaga seluruh agent tetap setara ketika Anda ingin menambahkan skill baru:

1. **Buat atau unduh skill baru** ke dalam folder Central Hub:
   ```
   C:\Users\<User>\.agents\skills\<nama-skill>\SKILL.md
   ```
   *(Atau unduh menggunakan command: `npx skills add <nama-repo> -g`)*
2. **Jalankan script sinkronisasi**:
   ```powershell
   powershell -File "path\to\universal-agent-setup\scripts\sync-skills.ps1"
   ```
3. Script akan menyalin skill baru tersebut secara serentak ke `.codex\skills`, `.gemini\skills`, dan `.claude\skills`.

---

## Catatan Khusus & Troubleshooting Tiap Agent

### 1. ChatGPT Desktop (Codex) & "Work Mode"
* **Kenapa slash command (seperti `/grill-me`) belum muncul?**
  * Sesi chat yang sedang terbuka menyimpan cache tool pada saat percakapan dibuat.
  * **Solusi**: Mulai **New Chat** (atau restart ChatGPT Desktop). Di chat baru, ketikkan `/grill-me` dan skill akan langsung aktif.
* **Work Mode (Work with Apps)**:
  * Tidak memerlukan konfigurasi manual di dalam UI app. Aplikasi membaca file konfigurasi global di `~/.codex/config.toml` dan `~/.codex/skills/`.

### 2. Claude Desktop
* Konfigurasi tersimpan di `%APPDATA%\Claude\claude_desktop_config.json`.
* Claude Desktop memuat server MCP saat aplikasi dibuka. Jika mengubah konfigurasi MCP, cukup tutup dan buka kembali Claude Desktop.

### 3. Antigravity (IDE & CLI)
* Konfigurasi MCP tersimpan di `~/.gemini/config/mcp_config.json`.
* Antigravity membaca skill dari `~/.gemini/skills/` secara global, atau dari folder `.agents/skills` di dalam workspace proyek aktif.

---

## Struktur Direktori Bundle

```text
universal-agent-setup/
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
└── skills/                             <-- 183 direktori skills lengkap
    ├── better-icons/
    ├── framer-motion/
    ├── hallmark/
    ├── humanizer/
    ├── impeccable/
    ├── lottie-maker/
    ├── motion-design/
    ├── stop-slop/
    ├── taste-skill/
    ├── grill-me/
    ├── grilling/
    ├── test-driven-development/
    ├── systematic-debugging/
    ├── ponytail/
    ├── scientific-writing/
    └── ... (168 skills lainnya)
```
