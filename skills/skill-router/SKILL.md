---
name: skill-router
description: "Universal Agent Orchestrator & Capability Router. Otomatis menentukan dan merangkai (chaining) skill dan MCP tools yang paling tepat untuk setiap tugas. Mengklasifikasi intensi, memilih playbook multi-skill (Frontend Craft, Penulisan EYD/Akademik, Bugfixing Ponytail, Motion/3D, Cloud, IoT), memetakan panggilan MCP (Playwright, DevTools, GitHub, Better Icons, Ripple, Arduino), dan menyediakan fallback jaringan jika skill belum terpasang."
triggers:
  - route
  - rute
  - which skill
  - pakai skill apa
  - rekomendasi skill
  - skill routing
  - tool apa
  - pilih skill
  - cari skill
  - orchestrate
---

# Skill Router — Universal Agent Orchestrator

**CRITICAL ROLE: This is a meta-skill. It does not perform the domain work itself; it analyzes intent, selects the best skills/MCP tools from the arsenal, and coordinates multi-skill execution.**

Audit tag: Every routing output or plan emitted by this router should be tagged with `[skill-router]`.

---

## 1. Lifecycle Overview

```
[skill-router] ┌─ ENTRY GUARD ─→ CLASSIFY ─→ PLAYBOOK / MATCH ─→ MCP MATRIX ─→ LOAD GUARD ─→ VERIFY ─┐
[skill-router] └──────────────────────────── persistent session loop ─────────────────────────────────┘
```

1. **ENTRY GUARD**: Tentukan apakah pesan pengguna memerlukan routing skill/tool atau sekadar obrolan kasual.
2. **INTENT CLASSIFICATION**: Petakan prompt ke dalam salah satu domain inti workstation.
3. **PLAYBOOK / SKILL MATCH**: Pilih skill tunggal atau rangkaian *multi-skill playbook*.
4. **MCP TOOL DISPATCH**: Tentukan apakah memerlukan bantuan server MCP (browser, terminal, ikon, DB, hardware).
5. **LOAD GUARD**: Konfirmasikan atau umumkan rencana eksekusi kepada pengguna.
6. **VERIFY HOOK**: Pastikan hasil akhir pekerjaan terverifikasi sebelum sesi diselesaikan.

---

## 2. Domain Taxonomy & Core Playbooks

Workstation ini memiliki 190+ skill dan 10 server MCP. Gunakan playbook siap pakai berikut untuk tugas multi-langkah:

### Playbook A: High-Craft Frontend & Web UI
**Pemicu**: Membuat tampilan web, dashboard, landing page, komponen React/Next.js, redesign UI, atau perbaikan estetika.
* **Alur Eksekusi**:
  1. `writing-plans` (Perencanaan bertahap jika fitur besar)
  2. `impeccable` + `taste-skill` (Art direction anti-slop & penentuan standar craft/tokens)
  3. `shadcn-ui` + `tailwind-v4` (Scaffolding komponen Radix & arsitektur CSS-first)
  4. `better-icons` [MCP] (Pencarian dan penulisan SVG ikon langsung ke file)
  5. `framer-motion` / `gsap` (Interaksi mikro, transisi layout, atau animasi timeline)
  6. `playwright` [MCP] (Membuka browser, inspeksi visual, verifikasi interaksi, dan screenshot)
  7. `verification-before-completion` (Verifikasi akhir)

### Playbook B: Penulisan Bahasa Indonesia, Skripsi & Laporan Akademik
**Pemicu**: Menulis/menyunting naskah berbahasa Indonesia, draf skripsi, tesis, jurnal, proposal, atau laporan bisnis.
* **Alur Eksekusi**:
  1. `bahasa-inti` (Kaidah EYD V ketat: larangan koma sebelum *sehingga*, larangan em dash hiasan, kata baku KBBI)
  2. `bahasa-peneliti` (Khusus naskah ilmiah: larangan sitasi halu, latar belakang berbasis data & research gap)
  3. `paper-lookup` + `pubmed-database` / `literature-search-openalex` (Pencarian literatur kredibel)
  4. `scientific-writing` (Struktur bab IMRaD & narasi ilmiah)
  5. `typst` (Typesetting PDF presisi tinggi super cepat) atau `docx`/`academic-pptx`
  6. `project-logger` (Pencatatan sesi)

### Playbook C: Lazy Senior Dev Bugfixing & Refactoring
**Pemicu**: Menemukan bug, optimasi kode, refactoring, atau membersihkan bloat/over-engineering.
* **Alur Eksekusi**:
  1. `systematic-debugging` (Investigasi akar masalah, isolasi reproduksi)
  2. `ponytail` / `ponytail-review` (Prinsip kode paling ringkas, utamakan standard library, hapus dependensi tak perlu)
  3. `test-driven-development` (Tulis tes gagal sebelum menulis fix)
  4. `verification-before-completion` (Pastikan seluruh tes hijau)

### Playbook D: Creative 3D & Video Motion
**Pemicu**: Animasi kanvas 3D, WebGL, pembuatan video terprogram, atau interaksi kompleks.
* **Alur Eksekusi**:
  1. `threejs-fiber` (3D scene, lighting, camera, shaders)
  2. `motion-design` + `lottie-maker` (Koreografi vektor & prinsip animasi)
  3. `remotion` (Programmatic React video generation)

### Playbook E: Cloud & Big Data Pipeline
**Pemicu**: Analisis data, pipeline GCP, BigQuery, Dataproc, dbt, SQL.
* **Alur Eksekusi**:
  1. BigQuery / GCP Suite (`developing-with-bigquery`, `dbt-bigquery`, `gcp-data-pipelines`)
  2. `accidental-data-loss-prevention` (Pencegahan overwrite/drop tabel)

### Playbook F: Hardware & Mobile Testing
**Pemicu**: Mikrokontroler, IoT, sketch Arduino, atau aplikasi mobile Android.
* **Alur Eksekusi**:
  1. `arduino` [MCP] (Kompilasi & upload sketch via Arduino CLI)
  2. `android-emulator` [MCP] (Otomasi UI & inspeksi emulator Android)

---

## 3. Matriks Keputusan MCP Server

Kapan agent harus memanggil tool MCP tertentu:

| Kebutuhan Tugas | Tool MCP yang Dipanggil | Format Pemanggilan |
| :--- | :--- | :--- |
| **Uji coba tampilan web / E2E / visual check** | `playwright` | `@playwright/mcp` (`page.goto`, `screenshot`, `click`) |
| **Debug console error / Network request gagal** | `chrome-devtools` | `chrome-devtools-mcp` (Connect ke Edge/Chrome) |
| **Butuh ikon UI (Lucide, Heroicons, Material)** | `better-icons` | `better-icons search <query>` / get SVG |
| **Cari kode di GitHub / Buat PR / Cek CI** | `github` | `@modelcontextprotocol/server-github` via token `gh` |
| **Dokumentasi library mutakhir (Next.js 15, React 19)** | `context7` | `https://mcp.context7.com/mcp` |
| **Terminal Windows interaktif / REPL** | `ripple` | `@ytsuda/ripple@latest` |
| **Mikrokontroler / Sensor / Serial Monitor** | `arduino` | `arduino-mcp-server` |
| **Uji coba aplikasi Android / Screenshot mobile** | `android-emulator` | `mcp-android-emulator` |
| **Diagram arsitektur & alur sistem** | `drawio` / `figma` | `@drawio/mcp` / Figma API |

---

## 4. Fallback Jaringan (`npx skills`)

Jika setelah pemindaian tidak ada skill lokal yang cocok:
1. Jalankan pencarian di registry:
   ```bash
   npx skills find "<deskripsi kebutuhan dalam 3-6 kata bahasa Inggris>"
   ```
2. Berikan rekomendasi hasil pencarian kepada pengguna.
3. Setelah disetujui pengguna, pasang via:
   ```bash
   npx skills add <owner/repo> -g -y
   ```
4. Jalankan `sync-agents.ps1` agar skill baru tersinkronkan ke seluruh agent.

---

## 5. Output Format Standar

Setiap kali `skill-router` aktif merencanakan tugas, gunakan format ringkas:

```text
[skill-router] Intent: <Domain Tugas>
[skill-router] Playbook: <Nama Playbook atau Single Skill>
[skill-router] Skills Terpilih: <Skill A> -> <Skill B> -> <Skill C>
[skill-router] MCP Tools: <MCP Server yang relevan>
[skill-router] Eksekusi: Memulai langkah pertama...
```
