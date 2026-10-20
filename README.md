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

### 1. Koleksi 192 Unified Skills (`skills/`)
Seluruh 192 skill sudah disusun dalam format standar `SKILL.md` yang dapat dibaca oleh seluruh agent:
* **The Meta-Orchestrator (Pemandu Utama)**:
  * `skill-router` — Pusat navigasi penentuan skill & alat MCP. Menghilangkan *skill blindness*, memetakan intensi secara bilingual (ID/EN), dan mengorkestrasi *multi-skill playbooks*.
* **Kepenulisan Bahasa Indonesia (EYD V & KBBI Anti-Slop)**:
  * `bahasa-inti` (`alvinindra/bahasa-skills`) — Standar baku resmi EYD Edisi V dan KBBI VI. Larangan koma sebelum *sehingga/karena/bahwa*, larangan em dash hiasan, kata baku (*silakan, sekadar, risiko, praktik, mengubah*), dan anti-slop bahasa Indonesia (*hiruk pikuk, lanskap, di era digital*).
  * `bahasa-peneliti` (`alvinindra/bahasa-skills`) — Khusus karya ilmiah, draf skripsi, tesis, dan jurnal. Larangan keras sitasi fiktif/halu, latar belakang berdata + kesenjangan riset (*research gap*), serta kalimat efektif akademik.
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
  * `shadcn-ui` — Pola arsitektur komponen berbasis Radix UI primitives dan CLI generator.
  * `tailwind-v4` — Panduan CSS-first `@theme` Tailwind CSS v4 terbaru.
  * `ui-ux-pro-max`, `frontend-design`, `web-design-guidelines`
  * `vercel-react-best-practices`, `vercel-optimize`, `vercel-composition-patterns`
* **Motion, 3D & Creative Web**:
  * `threejs-fiber` — 3D WebGL, Three.js, React Three Fiber (R3F), GLSL shaders, dan kanvas 3D interaktif.
  * `framer-motion` — Animasi produksi tinggi untuk React & modern `motion/react` (v12+), gesture, layoutId, AnimatePresence, dan SSR.
  * `motion-design` (`LottieFiles/motion-design-skill`) — Prinsip gerak, Disney principles adapted for UI, koreografi multi-elemen.
  * `lottie-maker` (`FWcloud916/skill-lottie-maker`) — Diagnostik, inspeksi, dan pembuatan bundel animasi portabel Lottie JSON.
  * **GSAP Animation Suite (8 skills)**: `gsap-core`, `gsap-frameworks`, `gsap-performance`, `gsap-plugins`, `gsap-react`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-utils`
  * `remotion` — Pembuatan animasi video terprogram menggunakan React dan TypeScript.
* **Testing & Quality Assurance**:
  * `playwright` — Otomasi browser E2E, interaksi klik/form, evaluasi visual, dan tangkapan layar web live.
* **Anti-AI Writing & Prose Refining (English & Universal)**:
  * `humanizer` (`blader/humanizer`) — Menghilangkan tanda-tanda teks buatan AI berdasarkan Wikipedia "Signs of AI writing" agar terdengar otentik.
  * `stop-slop` (`hardikpandya/stop-slop`) — Memotong filler phrases, formula buatan AI, kalimat pasif, dan adverb berlebihan.
* **Scientific & Academic Writing (`k-dense-ai`)**:
  * `scientific-writing` (struktur bab ilmiah, metodologi, narasi tesis/jurnal)
  * `paper-lookup` (pencarian sitasi dan literatur)
  * `typst` — Typesetting modern pengganti LaTeX untuk dokumen ilmiah & laporan berpresisi tinggi.
  * Dokumen akademik: `academic-pptx`, `pptx`, `docx`, `xlsx`, `pdf`
* **Cloud & Big Data**:
  * 34 skills Google Cloud Platform, BigQuery, BigLake, Dataproc, GCS
* **Sains Hayati & Genomika**:
  * 32 skills pencarian struktur & genomika (AlphaFold, AlphaGenome, Biomolecular Mol*, ChEMBL, PDB, PubMed, UniProt, ClinVar, dbSNP, dll.)
* **Protokol Portofolio & Logging**:
  * `project-logger` & `AGENTS.md` (pencatatan otomatis `logs/ACTIVITY_LOG.md`, `logs/DECISION_LOG.md`, dan Git submodule hygiene).

---

### 2. Standar 10 MCP Servers (`configs/`)
Konfigurasi MCP yang seragam di seluruh agent:
* **`playwright` (`@playwright/mcp@latest`)**: Otomasi browser E2E, interaksi klik/form, evaluasi visual, dan tangkapan layar web *live*.
* **`chrome-devtools` (`chrome-devtools-mcp@latest`)**: Inspeksi network tab, console error, dan manipulasi DOM langsung pada Edge atau Chrome.
* **`github` (`@modelcontextprotocol/server-github`)**: Review PR, triage issues, pencarian kode lintas repo via token `gh` yang aktif.
* **`context7` (`@upstash/context7-mcp`)**: Dokumentasi *real-time* library terkini (Next.js 15, Tailwind v4, React 19, Motion v12) langsung ke prompt.
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
   * Menyalin seluruh 192 skills ke seluruh direktori agent.
   * Mendeteksi browser target (Chrome/Edge), Android SDK, Arduino CLI, dan token GitHub CLI.
   * Memasang konfigurasi 10 server MCP ke Claude Desktop, Antigravity, dan ChatGPT Codex.

---

### Opsi B: Instalasi di macOS / Linux (POSIX)

1. Ekstrak bundle, buka Terminal:
   ```bash
   cd path/to/universal-agent-setup/scripts
   chmod +x install-all.sh
   ./install-all.sh
   ```

---

## Struktur Direktori Bundle

```text
universal-agent-setup/
├── README.md                           <-- Dokumen panduan ini
├── agent-setup-bundle.zip              <-- Arsip zip siap kirim (192 skills + 10 MCP)
├── logs/
│   ├── ACTIVITY_LOG.md                 <-- Log sesi kerja & histori instalasi
│   ├── DECISION_LOG.md                 <-- Architecture Decision Records (ADR)
│   └── CHANGELOG.md                    <-- Riwayat rilis Keep a Changelog
├── configs/
│   ├── AGENTS.md                       <-- Standar protokol multi-agent portofolio
│   ├── antigravity-mcp_config.json     <-- Template MCP Antigravity (10 server)
│   ├── claude_desktop_config.json      <-- Template MCP Claude Desktop (10 server)
│   └── codex_config.toml               <-- Template MCP & settings ChatGPT Codex (10 server)
├── scripts/
│   ├── install-all.ps1                 <-- Script master installer Windows
│   ├── sync-skills.ps1                 <-- Script sinkronisasi ulang skills
│   └── install-all.sh                  <-- Script installer macOS/Linux
└── skills/                             <-- 192 direktori skills lengkap
    ├── skill-router/                   <-- The Meta-Orchestrator
    ├── bahasa-inti/                    <-- EYD V & KBBI Anti-Slop (Alvin Indra)
    ├── bahasa-peneliti/                <-- Karya Ilmiah & Skripsi (Alvin Indra)
    ├── playwright/                     <-- E2E Browser Testing
    ├── threejs-fiber/                  <-- 3D WebGL & R3F
    ├── shadcn-ui/                      <-- Radix Primitives Architecture
    ├── tailwind-v4/                    <-- Modern CSS-first @theme
    ├── typst/                          <-- Modern Scientific Typesetting
    ├── remotion/                       <-- Programmatic Video Creation
    ├── better-icons/
    ├── framer-motion/
    ├── hallmark/
    ├── humanizer/
    ├── impeccable/
    ├── lottie-maker/
    ├── motion-design/
    ├── stop-slop/
    ├── taste-skill/
    └── ... (174 skills lainnya)
```
