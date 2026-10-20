---
name: typst
description: "Modern typesetting and document preparation using Typst. Faster, cleaner alternative to LaTeX for thesis (skripsi/tesis), academic papers, technical documentation, and high-precision PDF publication. Covers markup syntax, page setup, mathematical formulas, citations & bibliography (APA/IEEE), tables, figures, and academic templates."
license: MIT
---

# Typst: Modern Scientific & Academic Typesetting

Guide for authoring academic papers, skripsi/tesis, and publications using Typst—the ultra-fast Rust-based typesetting system replacing LaTeX.

---

## 1. Installation & CLI Usage

```bash
# Windows (Scoop or WinGet)
winget install --id Typst.Typst
# or
scoop install typst

# Compile document to PDF instantly
typst compile document.typ

# Watch mode for live preview on save
typst watch document.typ document.pdf
```

---

## 2. Document Setup & Page Rules

```typst
#set page(
  paper: "a4",
  margin: (top: 3cm, bottom: 3cm, left: 4cm, right: 3cm), // Standar margin skripsi Indonesia (4-4-3-3 atau 4-3-3-3)
  header: align(right)[
    #text(8pt, fill: luma(120))[Draf Penelitian — Skripsi]
  ],
  footer: locate(loc => {
    let page_number = counter(page).at(loc).first()
    align(center)[#page_number]
  })
)

#set text(
  font: "Times New Roman",
  size: 12pt,
  lang: "id",
  region: "ID"
)

#set par(
  justify: true,
  leading: 1.5em, // Spasi 1.5 standar karya ilmiah
  first-line-indent: 1.25cm
)

#set heading(numbering: "1.1")
```

---

## 3. Structural Elements & Markup

### Headings
```typst
= Pendahuluan
== Latar Belakang Masalah
=== Identifikasi Masalah
```

### Mathematical Equations
Typst uses clean, intuitive math syntax without cumbersome backslashes:
```typst
Persamaan regresi linier berganda didefinisikan sebagai:

$ Y = beta_0 + beta_1 X_1 + beta_2 X_2 + epsilon $

Untuk matriks kovarians:
$ Sigma = 1/N sum_(i=1)^N (x_i - mu)(x_i - mu)^T $
```

### Figures & Tables
```typst
#figure(
  table(
    columns: (1fr, 2fr, 1fr),
    align: (center, left, right),
    table.header([*No*], [*Variabel Penelitian*], [*Nilai R²*]),
    [1], [Kualitas Layanan], [0.842],
    [2], [Kepercayaan Pengguna], [0.789],
  ),
  caption: [Hasil Uji Koefisien Determinasi]
) <tabel-determinasi>

Sebagaimana terlihat pada @tabel-determinasi, kualitas layanan memiliki pengaruh dominan.
```

---

## 4. Citations & Bibliographies

Typst natively supports BibTeX (`.bib`) and Hayagriva (`.yml`) bibliographies:

```typst
Menurut riset terdahulu @sugiyono2019, metode kuantitatif sangat efektif.
Temuan ini sejalan dengan penelitian terkini @lanin2022.

#line(length: 100%, stroke: 0.5pt)
#bibliography("daftar-pustaka.bib", title: "Daftar Pustaka", style: "apa")
```

---

## 5. Standar Penulisan Skripsi Indonesia

- **Spasi**: 1.5 atau ganda untuk naskah utama, 1.0 (tunggal) untuk kutipan langsung panjang (>4 baris), judul tabel/gambar, dan daftar pustaka.
- **Bab Baru**: Selalu diawali dengan pemisah halaman `#pagebreak()`.
- **Nomor Halaman**: Bagian awal (Kata Pengantar, Daftar Isi) menggunakan angka Romawi kecil (`i, ii, iii`), bagian isi menggunakan angka Arab (`1, 2, 3`).
