---
name: anti-slop-presentation
description: "Create human-level, non-cliché presentations that completely eliminate generic AI presentation slop (bans 3-card pillars, cheesy 3D AI orbs, corporate jargon filler, and low-contrast slides). Delivers high-impact decks using visual cadence, authentic evidence, and modern web/editorial layouts. Use whenever creating pitch decks, slide decks, or PPTX presentations."
---

# Anti-Slop Presentation Design System

## Filosofi: Mengapa AI Slide Selalu Jelek & Cara Memperbaikinya
Kebanyakan AI menghasilkan presentasi yang disebut **"AI Slop"**: membagi setiap slide menjadi 3 kartu rounded rectangle abu-abu, menaruh ikon abstrak (petir/perisai), menggunakan bahasa brosur tanpa nyawa (*"seamless synergy"*), dan menempelkan ilustrasi 3D murahan.

Skill ini menolak formula tersebut dan menerapkan standar presentasi tingkat eksekutif, desainer agensi, dan pendiri startup kelas dunia.

---

## 4 Larangan Keras (The Absolute Bans)

1. 🚫 **DILARANG "Sindrom Tiga Kartu Bersaudara" (No 3-Card Compulsion)**
   - Jangan pernah membuat 3 kotak seragam berjejer (Pilar 1, Pilar 2, Pilar 3). Ini adalah *tell* paling jelas bahwa slide dibuat oleh AI template.
2. 🚫 **DILARANG Ilustrasi 3D AI Abstrak / Clipart Murahan**
   - Jangan generate gambar bola kristal bercahaya, robot bersalaman, atau kubus mengambang.
   - Gantikan dengan: **Bukti nyata (Raw Evidence)**—tangkapan layar UI asli, kutipan pelanggan verbatim, grafik garis data mentah, atau tipografi telanjang.
3. 🚫 **DILARANG Bahasa Brosur Korporat (Corporate Jargon Fluff)**
   - Haram menggunakan kata: *"empower", "seamless synergy", "transformative paradigm", "cutting-edge scalability"*.
   - Gunakan kalimat manusia yang tajam dengan angka riil: *"Server down 4x per minggu"* bukan *"Addressing infrastructure stability challenges"*.
4. 🚫 **DILARANG Masalah Kontras & Teks Tenggelam**
   - Semua teks harus lolos uji **WCAG AAA** (rasio kontras > 7:1). 
   - Latar gelap (`#0B0F17`) WAJIB memakai teks putih bersih (`#FFFFFF`) atau slate terang (`#F1F5F9`). Latar terang memakai slate pekat (`#0F172A`). Tidak ada teks abu-abu redup di atas latar gelap.

---

## 4 Arketipe Slide Non-Klise (Pilih Salah Satu Mode)

Sebelum membuat slide, tentukan jenis kebutuhan presentasi:

### Mode A: The Keynote / Live Presentation (Gaya Steve Jobs)
- **Konteks:** Dipresentasikan langsung di depan orang.
- **Aturan:** Maksimal 1 ide dan 10 kata per slide.
- **Visual:** Kanvas luas, 1 foto bukti otentik atau 1 angka raksasa (`$2.4M`), 1 kesimpulan berani. 0 kartu, 0 bullet points.

### Mode B: The Executive Slidedoc / Memo (Gaya Amazon & McKinsey)
- **Konteks:** Dikirimkan via email untuk dibaca sendiri secara asinkron oleh pimpinan/investor.
- **Aturan:** Padat substansi. Format editorial 2 kolom bergaya majalah/koran (*The New Yorker* atau *Monocle*), garis pemisah *hairline* 1pt, angka indeks kecil (`01 /`), tabel data bersih tanpa border kotak tebal.

### Mode C: The Dialectic / Challenger Deck (Tesis vs. Antitesis)
- **Konteks:** Pitch deck kompetitif atau proposal perubahan radikal.
- **Aturan:** Tampilkan konflik nyata.
  - Sisi Kiri (70%): "Cara lama yang rusak & biaya terselubungnya"
  - Sisi Kanan (30%): "Taruhan baru kita & pembuktian empirisnya"

### Mode D: The Web-Engine Product Deck (Gaya Linear & Vercel)
- **Konteks:** Presentasi arsitektur produk teknis atau software showcase.
- **Aturan:** Tampilan presisi tinggi ala landing page modern. Jendela terminal/browser nyata, badge status aktif, tabel benchmark, tipografi *Plus Jakarta Sans* / *JetBrains Mono*.

---

## Pacing Map: Aturan Ritme Narasi (Visual Cadence)

Slide tidak boleh memiliki kepadatan visual yang seragam. Ikuti alur ritme seperti menyutradarai film:

| Urutan | Tipe Slide | Karakter Visual | Tujuan Emosi |
| :--- | :--- | :--- | :--- |
| **01** | **The Cold Open / Hero** | Tipografi besar, pill tag elegan, 1 visual produk nyata. | Menarik perhatian instan. |
| **02** | **The Pain (The Anti-Thesis)** | Kutipan nyata komplain pelanggan / grafik anjlok. | Membangun urgensi & keresahan. |
| **03** | **Cinematic Pause** | **Nol ornamen.** 1 kalimat provokatif telanjang di kanvas kosong. | Memberi ruang mencerna (*mental reset*). |
| **04** | **Hard Evidence** | Tabel data spesifikasi terbuka / chart teranotasi. | Membuktikan klaim tanpa basa-basi. |
| **05** | **The Paradigm Shift** | Split kontras asimetris (70/30) solusi vs status quo. | Menawarkan jalan keluar yang jelas. |
| **06** | **The Provocative Ask** | Penutup lugas, metrik target, timeline eksekusi. | Menutup dengan aksi konkrit. |

---

## Alur Eksekusi Teknis (Technical Pipeline)

1. **Gunakan Engine HTML + Tailwind (1920x1080) untuk Presisi Visual Maksimal:**
   - Tulis setiap slide sebagai frame HTML 1920x1080 (rasio 16:9).
   - Manfaatkan Google Fonts (*Plus Jakarta Sans*, *Inter*, *Newsreader* untuk editorial).
   - Render menggunakan Headless Chromium (`playwright`) menjadi gambar resolusi tinggi.
   - Masukkan gambar-gambar tersebut ke dalam file `.pptx` 16:9 widescreen (`13.333"` x `7.5"`).
   - *Alternatif:* Jika pengguna menginginkan teks native PowerPoint yang bisa diedit di PPT, buat shape dan textbox native dengan menerapkan aturan tipografi dan larangan 3-card yang sama.

2. **Verifikasi Kualitas Sebelum Selesai:**
   - [ ] Apakah ada layout 3 kartu berjejer yang terulang? (Jika ada, rombak!)
   - [ ] Apakah ada teks yang sulit dibaca karena kontras buruk?
   - [ ] Apakah ada gambar AI generatif yang terasa palsu?
   - [ ] Apakah bahasanya terdengar seperti brosur AI? (Ganti dengan kalimat manusia).
