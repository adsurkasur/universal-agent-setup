# Universal AI Agent Setup & Skills Bundle (Multi-Machine)

[![Skills](https://img.shields.io/badge/Skills-197%20Unified%20Skills-blue?style=for-the-badge&logo=anthropic)](./skills/)
[![MCP Servers](https://img.shields.io/badge/MCP%20Servers-12%20Active-green?style=for-the-badge&logo=fastapi)](./configs/)
[![License](https://img.shields.io/badge/License-MIT-orange?style=for-the-badge)](./LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey?style=for-the-badge&logo=windows)](./scripts/)

> 🤖 **FOR AI AGENTS (Antigravity, Claude Code, ChatGPT/Codex, Cursor, Cline, etc.):**
> If the user asked you to setup or install this repository on this machine, please read and follow [`AGENTS.md`](./AGENTS.md) immediately to execute the automated installation.

---

### 📌 Catatan Penggunaan (Personal Workstation & Open Access)

> **Repositori ini awalnya dibuat dan dikelola untuk menyinkronkan ekosistem AI Agent pribadi saya antar-mesin (laptop dan desktop)** agar memiliki standar kemampuan, *skills*, dan perkakas MCP yang 100% seragam.
> 
> Namun, seluruh konfigurasi, arsitektur *router*, skrip otomasi, serta kurasi **197 skills** dan **12 MCP servers** di sini dirancang secara terbuka dan modular. **Jika bundel ini bermanfaat untuk setup produktivitas Anda, silakan gunakan, fork, atau adaptasi dengan bebas!**

Dengan bundel ini, setiap mesin baru akan langsung memiliki lingkungan kerja yang setara untuk 4 platform agent utama:
1. **Google Antigravity** (IDE & CLI)
2. **Anthropic Claude** (Claude Desktop & Claude Code)
3. **OpenAI ChatGPT** (ChatGPT Desktop / Codex Agent)
4. **Agent Umum / Shared Protocols** (`~/.agents` & `AGENTS.md`)

---

## 🌟 Apa Saja yang Ada di Dalam Bundle Ini?

### 1. Koleksi 197 Unified Skills (`skills/`)
Seluruh 197 skill tersusun dalam format standar `SKILL.md` (progressive disclosure) yang didukung oleh berbagai agen:

* **The Meta-Orchestrator (Pusat Navigasi Utama)**:
  * `skill-router` — Otomatis menganalisis maksud prompt secara bilingual (ID/EN), menghilangkan *skill blindness*, memetakan alat MCP yang relevan, dan menjalankan *multi-skill playbooks*.
* **Presentation Engineering & Anti-Slop Slide Decks**:
  * `deck-builder` (Ade Surya Ananda) — Universal presentation engineering framework (Talk & Analytical modes, PptxGenJS, Sharp image aspect-fit, zero manual number binding).
  * `anti-slop-presentation` — Standar presentasi level manusia tanpa klise AI (menghilangkan layout 3 kartu identik, bola orb 3D generik, jargon korporat kosong, dan slide kontras rendah; mengedepankan ritme visual dan bukti nyata).
* **Kepenulisan Bahasa Indonesia (EYD V & KBBI Anti-Slop)**:
  * `bahasa-inti` (Alvin Indra / EYD V resmi / KBBI VI) — Kaidah tanda baca presisi (larangan koma sebelum *sehingga/karena/bahwa*, larangan em dash hiasan), kata baku (*silakan, sekadar, risiko, praktik, mengubah*), dan anti-slop bahasa Indonesia (*hiruk pikuk, lanskap, di era digital*).
  * `bahasa-peneliti` (Alvin Indra) — Khusus karya ilmiah, draf skripsi, tesis, dan jurnal. Larangan keras sitasi halu/fiktif, latar belakang berdata + kesenjangan riset (*research gap*), struktur IMRaD, serta kalimat efektif akademik.
* **Engineering Superpowers & Software Methodology (`obra/superpowers`)**:
  * `test-driven-development` (TDD), `systematic-debugging`, `writing-plans`, `executing-plans`, `verification-before-completion`, `subagent-driven-development`, `dispatching-parallel-agents`, `using-git-worktrees`.
* **Matt Pocock Skills Suite (`mattpocock/skills`)**:
  * `/grill-me` & `grilling` (socratic interview sebelum implementasi kode), `wayfinder`, `to-spec`, `to-tickets`, `triage`, `codebase-design`.
* **Ponytail Development (`DietrichGebert/ponytail`)**:
  * `ponytail`, `ponytail-audit`, `ponytail-debt`, `ponytail-gain`, `ponytail-review` (filosofi kode paling ringkas, YAGNI, eliminasi over-engineering).
* **Design Direction, Taste & Frontend Craft**:
  * `impeccable` (`pbakaus/impeccable`) — Direction & craft floor standar penghargaan dunia untuk UI produk dan design system.
  * `taste-skill` (`Leonxlnx/taste-skill`) — Anti-slop frontend art direction dari kurasi 247 gallery sites.
  * `hallmark` (`Nutlope/hallmark`) — Next-gen design taste dan modern layout patterns.
  * `better-icons` (`better-auth/better-icons`) — Integrasi dan pencarian 200.000+ ikon dari 150+ pustaka ikon (Lucide, Heroicons, Material, dsb.).
  * `shadcn-ui` — Pola komponen berbasis Radix UI primitives dan CLI integration.
  * `tailwind-v4` — Panduan CSS-first `@theme` Tailwind CSS v4 terbaru.
* **Motion, 3D & Creative Web**:
  * `threejs-fiber` — 3D WebGL, Three.js, React Three Fiber (R3F), GLSL shaders, dan kanvas 3D interaktif.
  * `framer-motion` — Animasi produksi tinggi untuk React & modern `motion/react` (v12+), gesture, layoutId, dan AnimatePresence.
  * `motion-design` (`LottieFiles/motion-design-skill`) — Prinsip gerak, Disney principles adapted for UI, koreografi multi-elemen.
  * `lottie-maker` (`FWcloud916/skill-lottie-maker`) — Diagnostik dan pembuatan bundel animasi portabel Lottie JSON.
  * **GSAP Animation Suite (8 skills)**: `gsap-core`, `gsap-frameworks`, `gsap-performance`, `gsap-plugins`, `gsap-react`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-utils`.
  * `remotion` — Pembuatan animasi video terprogram menggunakan React dan TypeScript.
* **Web Testing & Quality Assurance**:
  * `playwright` — Otomasi browser E2E, interaksi klik/form, evaluasi visual, dan tangkapan layar web live.
* **Anti-AI Writing & Universal Prose Refining**:
  * `humanizer` (`blader/humanizer`) — Menghilangkan pola tulisan AI berbasis Wikipedia "Signs of AI writing" agar terdengar otentik.
  * `stop-slop` (`hardikpandya/stop-slop`) — Memotong filler phrases, formula buatan AI, kalimat pasif, dan adverb berlebihan.
* **Scientific Writing & Documentation**:
  * `typst` — Typesetting modern pengganti LaTeX untuk dokumen ilmiah & laporan berpresisi tinggi.
  * `readme-generator` (`kimduhee7524/readme-generator`) — Pembuatan dokumentasi README repositori berstandar profesional.
  * `scientific-writing`, `paper-lookup`, `academic-pptx`, `pptx`, `docx`, `xlsx`, `pdf`.
* **Reverse Engineering, Binary Analysis & System Diagnostics**:
  * `reverse-engineer-anything` (`morluto/rea`) — Universal reverse engineering engine untuk native binaries, managed artifacts (PE/CLI), Electron/JS web bundles, APK Android, dan firmware dengan 207 MCP tools terintegrasi.
* **Cloud & Big Data**:
  * 34 skills Google Cloud Platform, BigQuery, BigLake, Dataproc, GCS.
* **Mobile & App Publishing**:
  * `play-console` — Manajemen rilis Google Play Console, audit bundle/APK, staged rollout, reviews, dan Android Vitals.
  * `android-cli` (termasuk `compose-preview` dan `device-hub`).
* **Sains Hayati & Genomika**:
  * 32 skills pencarian struktur & genomika (AlphaFold, AlphaGenome, Biomolecular Mol*, ChEMBL, PDB, PubMed, UniProt, ClinVar, dbSNP, dll.).

---

### 2. Standar 12 MCP Servers (`configs/`)
Konfigurasi MCP yang seragam di seluruh agent:
1. **`playwright` (`@playwright/mcp@latest`)**: Otomasi browser E2E, klik/form, evaluasi visual, dan tangkapan layar web *live*.
2. **`chrome-devtools` (`chrome-devtools-mcp@latest`)**: Inspeksi network tab, console error, dan DOM (otomatis mendeteksi Edge atau Chrome).
3. **`github` (`@modelcontextprotocol/server-github`)**: Review PR, triage issues, pencarian kode lintas repo via token GitHub CLI (`gh`).
4. **`context7` (`@upstash/context7-mcp`)**: Injeksi dokumentasi library terkini (*version-accurate*) secara *real-time* ke prompt.
5. **`better-icons` (`better-icons`)**: Cari dan pasang langsung 200.000+ ikon dari 150+ pustaka ikon ke proyek tanpa manual copy-paste SVG.
6. **`figma` (`https://mcp.figma.com/mcp`)**: Integrasi desain resmi Figma via Streamable HTTP (validasi ketat skema TOML tanpa `args`).
7. **`drawio` (`@drawio/mcp`)**: Membuat dan membuka diagram alir / arsitektur Draw.io langsung dari prompt.
8. **`ripple` (`@ytsuda/ripple@latest`)**: Terminal emulator native ConPTY untuk eksekusi konsol Windows interaktif.
9. **`android-emulator` (`mcp-android-emulator`)**: Otomasi pengujian UI, screenshot, gesture, dan inspeksi tree emulator Android.
10. **`arduino` (`arduino-mcp-server`)**: Kompilasi dan flashing sketch mikrokontroler via Arduino CLI.
11. **`rea` (`rea-agents@6.7.0 mcp`)**: Reverse Engineer Anything dengan 207 MCP tools dekompilasi, disassembler, dan analisis biner terpadu.
12. **`play-console` (`@orellbuehler/play-console-mcp@0.3.1`)**: Query Google Play Console, rilis aplikasi (internal, alpha, beta, production), staged rollout, Android Vitals (crash, ANR), dan review pengguna.

---

## 🚀 Panduan Instalasi Cepat di Mesin Baru

### Opsi A: Instalasi Otomatis (Windows PowerShell)

1. **Clone repository ini** ke mesin baru:
   ```powershell
   git clone https://github.com/adsurkasur/universal-agent-setup.git
   cd universal-agent-setup\scripts
   ```
2. Jalankan script installer:
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   .\install-all.ps1
   ```
3. **Selesai!** Script secara otomatis:
   * Menyiapkan folder `~/.agents/skills`, `~/.codex/skills`, `~/.gemini/config/skills`, `~/.gemini/skills`, dan `~/.claude/skills`.
   * Melakukan sinkronisasi presisi tinggi (hash-based SHA-256) untuk seluruh **197 skills**.
   * Mendeteksi browser target (Chrome/Edge), Android SDK, Arduino CLI, dan token GitHub CLI.
   * Melakukan **Smart Merge** non-destruktif untuk konfigurasi **12 server MCP** ke Antigravity, Claude Desktop, Claude Code, dan ChatGPT Codex (dilengkapi otomatisasi cadangan/backup `.bak`).

---

### Opsi B: Instalasi di macOS / Linux (POSIX)

1. Buka Terminal pada direktori repositori:
   ```bash
   cd universal-agent-setup/scripts
   chmod +x install-all.sh
   ./install-all.sh
   ```

---

## ⚖️ Transparansi, Lisensi & Atribusi

- **Lisensi Repositori**: Skrip installer, konfigurasi, kurasi, dan dokumentasi ini dilisensikan di bawah [MIT License](./LICENSE).
- **Atribusi Karya Asli Pihak Ketiga**: Seluruh *skills* dan perkakas MCP di dalam direktori `skills/` dan `configs/` merupakan hak cipta milik pencipta dan komunitas aslinya masing-masing. Rincian lengkap pencipta, lisensi asli, dan tautan repositori asal dapat dilihat di [**`SOURCES.md`**](./SOURCES.md).
