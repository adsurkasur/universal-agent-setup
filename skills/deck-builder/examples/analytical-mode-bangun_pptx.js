// Pembangun deck presentasi ARIMA pasokan tebu (pptxgenjs).
// Semua angka hasil dibaca dari ../skrip/hasil_arima.json supaya tidak ada salin-tempel manual.
// Pakai: node bangun_pptx.js   (jalankan setelah skrip/analisis_arima.py)
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");

const DIR = __dirname;
const H = JSON.parse(fs.readFileSync(path.join(DIR, "..", "skrip", "hasil_arima.json"), "utf8"));
const G = (f) => path.join(DIR, "..", "grafik", f);
// rasio tinggi/lebar PNG dibaca dari header IHDR supaya gambar tidak gepeng
const R = (f) => { const buf = fs.readFileSync(G(f)); return buf.readUInt32BE(20) / buf.readUInt32BE(16); };
for (const f of ["01_pasokan_harian_mg2025.png", "02_asli_vs_differencing.png", "03_acf_pacf.png",
  "04_diagnostik_residual.png", "05_ramalan_vs_aktual_2panel.png", "06_galat_harian.png"]) {
  if (!fs.existsSync(G(f))) throw new Error("Grafik belum ada: " + f + " (jalankan analisis_arima.py dulu)");
}

// ---------- format angka Indonesia ----------
const id = (x, d = 2) => {
  const s = Math.abs(x).toFixed(d).split(".");
  const ribuan = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return (x < 0 ? "−" : "") + ribuan + (d > 0 ? "," + s[1] : "");
};
const sgn = (x, d = 2) => (x >= 0 ? "+" : "") + id(x, d);

const D = H.deskriptif, S = H.stasioneritas.asli_latih, M = H.model_terpilih;
const mu = M.params.const, phi = M.params["ar.L1"], theta = M.params["ma.L1"];
const EA = H.evaluasi["ARIMA(1,0,1)"], EN = H.evaluasi["Naive"];
const C1 = H.contoh_hitung_tangan[0];
const persenTurunRmse = (1 - EA.rmse / EN.rmse) * 100;
const persenTurunMae = (1 - EA.mae / EN.mae) * 100;

// ---------- desain ----------
const HIJAU = "1F4E3D", DAUN = "6A994E", EMAS = "D99A1E", ARANG = "2E2E2E", ABU = "6B6B6B",
  MERAH = "B5452B", MUDA = "EEF3EC", KREM_EMAS = "FBF3E1", PUTIH = "FFFFFF";
const FJ = "Cambria", FB = "Arial";
const W = 13.333, Hh = 7.5, MX = 0.6;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Ade Surya Ananda";
pres.title = "Peramalan Pasokan Tebu Harian dengan ARIMA";

let nomor = 0;
function slideIsi(judul, opsi = {}) {
  const s = pres.addSlide();
  nomor += 1;
  s.background = { color: PUTIH };
  if (opsi.langkah) {
    s.addShape(pres.shapes.OVAL, { x: MX, y: 0.42, w: 0.62, h: 0.62, fill: { color: EMAS }, line: { color: EMAS } });
    s.addText(String(opsi.langkah), { x: MX, y: 0.42, w: 0.62, h: 0.62, fontFace: FJ, fontSize: 22, bold: true, color: PUTIH, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(judul, { x: MX + 0.8, y: 0.3, w: W - 2 * MX - 0.8, h: 0.85, fontFace: FJ, fontSize: 28, bold: true, color: HIJAU, valign: "middle", margin: 0, isTextBox: true });
  } else {
    s.addText(judul, { x: MX, y: 0.3, w: W - 2 * MX, h: 0.85, fontFace: FJ, fontSize: 28, bold: true, color: HIJAU, valign: "middle", margin: 0, isTextBox: true });
  }
  if (opsi.bagian) {
    s.addText(opsi.bagian, { x: W - MX - 3.5, y: 7.02, w: 3.5, h: 0.3, fontFace: FB, fontSize: 10, color: ABU, align: "right", margin: 0, isTextBox: true });
  }
  s.addText(String(nomor), { x: W - MX - 0.5, y: 0.08, w: 0.5, h: 0.25, fontFace: FB, fontSize: 9, color: ABU, align: "right", margin: 0, isTextBox: true });
  if (opsi.sumber) {
    s.addText(opsi.sumber, { x: MX, y: 7.0, w: W - 2 * MX - 3.7, h: 0.35, fontFace: FB, fontSize: 11, italic: true, color: ABU, valign: "bottom", margin: 0, isTextBox: true });
  }
  return s;
}
function teks(s, isi, x, y, w, h, o = {}) {
  s.addText(isi, Object.assign({ x, y, w, h, fontFace: FB, fontSize: 15, color: ARANG, valign: "top", margin: 0, isTextBox: true, paraSpaceAfter: 6 }, o));
}
function kartu(s, x, y, w, h, warna = MUDA) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: warna }, line: { color: warna }, rectRadius: 0.08 });
}
// kotak kecil definisi istilah; items = [[istilah, definisi], ...]
function istilah(s, items, x, y, w, h) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: "F4F7F3" }, line: { color: DAUN, width: 1 }, rectRadius: 0.06 });
  const isi = [{ text: "Istilah", options: { bold: true, color: DAUN, breakLine: true } }];
  items.forEach(([t, d], i) => {
    isi.push({ text: t + ": ", options: { bold: true, color: HIJAU } });
    isi.push({ text: d, options: { color: ARANG, breakLine: i < items.length - 1 } });
  });
  s.addText(isi, { x: x + 0.15, y: y + 0.08, w: w - 0.3, h: h - 0.16, fontFace: FB, fontSize: 12.5, valign: "top", margin: 0, paraSpaceAfter: 3, isTextBox: true });
}
const LB = H.ljungbox_manual, IC = H.aic_bic_manual, SEE = H.see;
const b = (t, o = {}) => Object.assign({ text: t, options: Object.assign({ bullet: true, breakLine: true }, o) });
const p = (t, o = {}) => ({ text: t, options: Object.assign({ breakLine: true }, o) });
function akhiri(arr) { const a = arr.slice(); const l = a[a.length - 1]; l.options = Object.assign({}, l.options, { breakLine: false }); return a; }

function tabel(s, baris, x, y, w, lebarKolom, o = {}) {
  const rows = baris.map((r, i) => r.map((c) => {
    const sel = typeof c === "object" ? c : { text: String(c) };
    sel.options = Object.assign({
      fontFace: FB, fontSize: o.fs || 13, color: i === 0 ? PUTIH : ARANG, bold: i === 0,
      fill: { color: i === 0 ? HIJAU : (i % 2 === 0 ? "F4F7F3" : PUTIH) }, valign: "middle",
      align: "center", margin: [3, 5, 3, 5],
    }, sel.options || {});
    return sel;
  }));
  s.addTable(rows, { x, y, w, colW: lebarKolom, border: { type: "solid", pt: 0.5, color: "D6DDD4" }, rowH: o.rowH || 0.36 });
}

// ======================= 1. JUDUL =======================
{
  const s = pres.addSlide(); nomor += 1;
  s.background = { color: HIJAU };
  s.addText("TUGAS MATA KULIAH SISTEM PRODUKSI AGROINDUSTRI", { x: MX, y: 0.9, w: 12, h: 0.4, fontFace: FB, fontSize: 14, color: EMAS, bold: true, charSpacing: 2, margin: 0, isTextBox: true });
  s.addText("Peramalan Pasokan Tebu Masuk Harian (H+1) dengan Metode ARIMA", { x: MX, y: 1.45, w: 11.5, h: 1.9, fontFace: FJ, fontSize: 40, bold: true, color: PUTIH, margin: 0, valign: "top", isTextBox: true });
  s.addText("Studi kasus Pabrik Gula Modjopanggoong, Tulungagung, Musim Giling 2025", { x: MX, y: 3.4, w: 11.5, h: 0.5, fontFace: FB, fontSize: 20, color: "D8E6D2", margin: 0, isTextBox: true });
  s.addText([
    p("Ade Surya Ananda  |  NIM 2646000083", { bold: true, color: PUTIH }),
    p("Dosen pengampu: Prof. Dr. Ir. Endah Rahayu Lestari, MS", { color: "D8E6D2" }),
    p("Program Studi Teknologi Industri Pertanian, FTAB, Universitas Brawijaya  |  2026", { color: "D8E6D2", breakLine: false }),
  ], { x: MX, y: 5.2, w: 11.5, h: 1.3, fontFace: FB, fontSize: 16, margin: 0, valign: "top", paraSpaceAfter: 4, isTextBox: true });
  s.addNotes("Pembukaan (±30 detik). Perkenalkan diri, lalu sampaikan tujuan presentasi: bukan mencari metode terbaik, tetapi menerapkan satu metode peramalan, yaitu ARIMA, pada masalah nyata di pabrik gula, langkah demi langkah dari masalah sampai hasil.");
}

// ======================= 2. KONTEKS =======================
{
  const s = slideIsi("Gula adalah komoditas strategis, dan Jawa Timur adalah pusatnya", { bagian: "Masalah", sumber: "Sumber: Perpres No. 40 Tahun 2023; Pusdatin Kementan (2025), Outlook Tebu 2025." });
  kartu(s, MX, 1.55, 5.7, 4.9);
  s.addText("49,05%", { x: MX + 0.35, y: 1.9, w: 5, h: 1.3, fontFace: FJ, fontSize: 66, bold: true, color: HIJAU, margin: 0, isTextBox: true });
  teks(s, "kontribusi Jawa Timur terhadap produksi gula nasional (rata-rata 1,19 juta ton per tahun, 2021–2025)", MX + 0.35, 3.3, 5.0, 1.3, { fontSize: 18 });
  teks(s, "Artinya, efisiensi pabrik gula di Jawa Timur ikut menentukan pasokan gula nasional.", MX + 0.35, 4.95, 5.0, 1.2, { fontSize: 17, italic: true, color: ABU });
  teks(s, akhiri([
    p("Arah kebijakan", { bold: true, color: HIJAU, fontSize: 21 }),
    b("Perpres 40/2023 menargetkan percepatan swasembada gula nasional, antara lain lewat peningkatan produktivitas kebun dan efisiensi pabrik gula."),
    b("Efisiensi pabrik tidak hanya soal mesin, tetapi juga soal bahan baku: tebu harus datang dalam jumlah yang pas dan segera digiling."),
    p(" "),
    p("Pertanyaan praktisnya", { bold: true, color: HIJAU, fontSize: 21 }),
    b("Berapa ton tebu yang akan masuk ke pabrik besok? Jika bisa diperkirakan, pabrik dapat bersiap lebih awal."),
  ]), 6.9, 1.6, 5.8, 4.9, { fontSize: 18, paraSpaceAfter: 8 });
  s.addNotes("Mulai dari gambaran besar. Menurut Outlook Tebu 2025 dari Pusdatin Kementan, Jawa Timur menyumbang sekitar 49 persen produksi gula nasional. Pemerintah lewat Perpres 40 tahun 2023 mendorong swasembada gula, salah satunya dengan efisiensi pabrik. Efisiensi pabrik sangat bergantung pada bahan bakunya, yaitu tebu. Dari sini muncul pertanyaan praktis: berapa tebu yang masuk besok?");
}

// ======================= 3. PG MODJOPANGGOONG =======================
{
  const s = slideIsi("PG Modjopanggoong: pasokan tebu bergantung pada petani", { bagian: "Masalah", sumber: "Sumber: PT Sinergi Gula Nusantara (profil perusahaan); Radar Tulungagung (22 Mei 2023); detikJatim (9 Mei 2026)." });
  const fakta = [
    ["PT SGN", "pengelola; subholding gula PTPN III (eks PTPN X)"],
    ["±85–90%", "porsi tebu rakyat pada 2023 (Tulungagung, Blitar, Trenggalek)"],
    ["2.864 TCD", "kapasitas giling minimal MG2026 menurut GM pabrik"],
  ];
  fakta.forEach((f, i) => {
    const x = MX + i * 4.1;
    kartu(s, x, 1.5, 3.8, 1.9);
    s.addText(f[0], { x: x + 0.25, y: 1.65, w: 3.3, h: 0.75, fontFace: FJ, fontSize: 32, bold: true, color: HIJAU, margin: 0, isTextBox: true });
    teks(s, f[1], x + 0.25, 2.45, 3.3, 0.9, { fontSize: 15 });
  });
  // alur fisik tebu
  const tahap = ["Kebun tebu rakyat", "Tebang, muat, angkut", "Pos timbang\n(tebu masuk)", "Emplasemen\n(antrean)", "Stasiun giling"];
  tahap.forEach((t, i) => {
    const x = MX + i * 2.47, y = 3.95;
    const sorot = i === 2;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 2.1, h: 1.25, fill: { color: sorot ? EMAS : PUTIH }, line: { color: sorot ? EMAS : DAUN, width: 1.5 }, rectRadius: 0.08 });
    s.addText(t, { x, y, w: 2.1, h: 1.25, fontFace: FB, fontSize: 15, bold: true, color: sorot ? PUTIH : HIJAU, align: "center", valign: "middle", margin: 2, isTextBox: true });
    if (i < tahap.length - 1) s.addShape(pres.shapes.LINE, { x: x + 2.12, y: y + 0.62, w: 0.33, h: 0, line: { color: ABU, width: 1.5, endArrowType: "triangle" } });
  });
  kartu(s, MX, 5.5, W - 2 * MX, 1.25, KREM_EMAS);
  teks(s, "Data yang diramal di tugas ini adalah jumlah tebu yang masuk di pos timbang per hari (kotak emas). Jumlah itu ditentukan oleh ribuan keputusan petani dan armada angkut sehingga pabrik tidak dapat mengaturnya sepenuhnya.", MX + 0.3, 5.62, W - 2 * MX - 0.6, 1.05, { fontSize: 16, valign: "middle" });
  s.addNotes("PG Modjopanggoong di Tulungagung sekarang dikelola PT Sinergi Gula Nusantara, subholding gula PTPN III, dulunya bagian PTPN X. Menurut Radar Tulungagung tahun 2023, sekitar 85 sampai 90 persen tebunya berasal dari tebu rakyat. Menurut GM pabrik di detikJatim, kapasitas giling minimal musim 2026 adalah 2.864 ton tebu per hari. Perhatikan alurnya: tebu dari kebun petani ditebang, dimuat, diangkut, lalu ditimbang di pos timbang. Angka di pos timbang inilah yang disebut tebu masuk, dan inilah yang kita ramal. Karena bergantung pada banyak petani, pabrik tidak bisa mengendalikannya penuh.");
}

// ======================= 3b. DOKUMENTASI LAPANGAN =======================
{
  const s = slideIsi("Dokumentasi lapangan: alur fisik tebu masuk di PG Modjopanggoong", { bagian: "Masalah", sumber: "Sumber: dokumentasi pribadi, PG Modjopanggoong, 12 September 2026." });
  const F = (f) => path.join(DIR, "..", "foto", f);
  const foto = [
    ["truk-ditimbang-mengantre.jpg", "1. Truk tebu ditimbang di jembatan timbang", "Di sinilah angka \"tebu masuk\" yang diramal dicatat setiap hari."],
    ["lori-tebu.jpg", "2. Lori tebu menunggu di emplasemen", "Tebu yang sudah masuk antre sebelum digiling; kadar gulanya terus turun selama menunggu."],
    ["tebu-diangkut-dari-truk-ke-mesin-untuk-digiling.jpg", "3. Tebu dipindah ke meja tebu untuk digiling", "Laju giling relatif tetap, sedangkan tebu yang masuk naik-turun."],
  ];
  const wF = (W - 2 * MX - 0.6) / 3, hF = wF * 0.75;
  foto.forEach((f, i) => {
    const x = MX + i * (wF + 0.3);
    s.addImage({ path: F(f[0]), x, y: 1.35, w: wF, h: hF, rounding: false });
    s.addText(f[1], { x, y: 1.35 + hF + 0.15, w: wF, h: 0.6, fontFace: FJ, fontSize: 17, bold: true, color: HIJAU, valign: "top", margin: 0, isTextBox: true });
    teks(s, f[2], x, 1.35 + hF + 0.8, wF, 0.95, { fontSize: 15 });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: MX, y: 5.85, w: W - 2 * MX, h: 0.95, fill: { color: HIJAU }, line: { color: HIJAU }, rectRadius: 0.08 });
  teks(s, [
    { text: "Inti masalahnya: ", options: { bold: true, color: EMAS } },
    { text: "tebu masuk naik-turun, sedangkan laju giling tetap sehingga antrean di emplasemen kadang menumpuk dan kadang kosong.", options: { color: PUTIH } },
  ], MX + 0.3, 5.85, W - 2 * MX - 0.6, 0.95, { fontSize: 17, valign: "middle" });
  s.addNotes("Ini dokumentasi lapangan di PG Modjopanggoong pada 12 September 2026, mengikuti alur tebu. Pertama, truk tebu ditimbang di jembatan timbang; angka inilah yang disebut tebu masuk dan yang kita ramal. Kedua, tebu yang sudah masuk menunggu di emplasemen, misalnya di lori, sebelum digiling; selama menunggu, kadar gulanya menurun. Ketiga, tebu dipindah ke meja tebu lalu digiling dengan laju yang relatif tetap. Karena tebu yang masuk naik-turun sementara laju giling tetap, antrean kadang menumpuk dan kadang kosong. Itulah masalah yang ingin dibantu dengan peramalan.");
}

// ======================= 4. MASALAH DALAM DATA =======================
{
  const s = slideIsi("Masalahnya terlihat di data: pasokan harian naik-turun tajam", { bagian: "Masalah", sumber: "Sumber: data pos timbang PG Modjopanggoong MG2025 (21 Mei–7 Desember 2025), diolah." });
  s.addImage({ path: G("01_pasokan_harian_mg2025.png"), x: MX, y: 1.35, w: 8.6, h: 8.6 * R("01_pasokan_harian_mg2025.png") });
  const st = [
    [id(D.rata2, 0) + " ton", "rata-rata tebu masuk per hari (201 hari)"],
    [id(D.cv_persen, 1) + "%", "koefisien variasi (sebaran relatif)"],
    [id(D.lompatan_maks_ton, 0) + " ton", `lompatan terbesar antarhari (hari ${D.lompatan_maks_dari_hari}→${D.lompatan_maks_ke_hari})`],
    [`${D.hari_di_bawah_kapasitas} hari`, "pasokan di bawah 2.864 TCD"],
  ];
  st.forEach((v, i) => {
    const y = 1.35 + i * 1.3;
    s.addText(v[0], { x: 9.5, y, w: 3.3, h: 0.6, fontFace: FJ, fontSize: 26, bold: true, color: i === 3 ? MERAH : HIJAU, margin: 0, isTextBox: true });
    teks(s, v[1], 9.5, y + 0.6, 3.3, 0.6, { fontSize: 13, color: ABU });
  });
  teks(s, `Catatan: hari ke-75 (${D.tanggal_nol[0]}) tercatat 0 ton masuk dan 0 ton giling. Data dibiarkan apa adanya dan diperlakukan sebagai temuan.`, MX, 5.6, 8.6, 0.8, { fontSize: 13, italic: true, color: ABU });
  s.addNotes(`Ini data asli musim giling 2025, 201 hari. Rata-rata tebu masuk ${id(D.rata2, 0)} ton per hari, tetapi naik-turunnya besar: koefisien variasi ${id(D.cv_persen, 1)} persen, dan pernah melonjak ${id(D.lompatan_maks_ton, 0)} ton dalam satu hari. Dari 201 hari, ${D.hari_di_bawah_kapasitas} hari pasokannya di bawah kapasitas minimal 2.864 ton. Perlu dicatat, garis kapasitas ini adalah angka musim 2026 menurut GM, jadi dipakai sebagai acuan kasar. Ada satu hari, hari ke-75, dengan nilai nol untuk tebu masuk dan giling. Saya biarkan apa adanya karena tidak ada informasi penyebabnya.`);
}

// ======================= 5. DAMPAK & TUJUAN =======================
{
  const s = slideIsi("Mengapa perlu diramal: dua risiko dari pasokan yang tidak pasti", { bagian: "Masalah", sumber: "Sumber: Bantacut et al. (2012); Muhtadi et al. (2024); Solomon (2009)." });
  kartu(s, MX, 1.5, 5.9, 5.2, KREM_EMAS);
  teks(s, akhiri([
    p("Pasokan berlebih", { bold: true, color: MERAH, fontSize: 22 }),
    p(" ", { fontSize: 8 }),
    b("Tebu menumpuk dan menunggu digiling; kadar gula dalam batang menurun setelah ditebang (Solomon, 2009)."),
    b("Tahap tebang-muat-angkut menyumbang kehilangan sukrosa 5–25% (Bantacut et al., 2012)."),
    b("Giling tertunda 2 hari: bobot batang susut 9,2%; tertunda 4 hari: hasil gula turun 12,3% (Muhtadi et al., 2024)."),
  ]), MX + 0.35, 1.8, 5.2, 4.7, { fontSize: 17, paraSpaceAfter: 10 });
  kartu(s, 6.83, 1.5, 5.9, 5.2, MUDA);
  teks(s, akhiri([
    p("Pasokan kurang", { bold: true, color: HIJAU, fontSize: 22 }),
    p(" ", { fontSize: 8 }),
    b("Stasiun giling berjalan di bawah kapasitas, sementara mesin, uap, dan tenaga kerja tetap berjalan."),
    b(`Di MG2025 terjadi pada ${D.hari_di_bawah_kapasitas} dari ${D.n_hari} hari (acuan 2.864 TCD).`),
    p(" ", { fontSize: 8 }),
    p("Jika pasokan esok hari dapat diperkirakan, kuota tebang dan antrean dapat diatur sejak sehari sebelumnya.", { bold: true, color: HIJAU }),
  ]), 7.18, 1.8, 5.2, 4.7, { fontSize: 17, paraSpaceAfter: 10 });
  s.addNotes("Kenapa ketidakpastian ini jadi masalah? Ada dua sisi. Kalau pasokan berlebih, tebu menunggu. Tebu yang sudah ditebang terus kehilangan gula; Bantacut dan kawan-kawan mencatat kehilangan sukrosa 5 sampai 25 persen di tahap tebang-muat-angkut, dan Muhtadi dan kawan-kawan mencatat susut 9,2 persen bila giling tertunda 2 hari. Kalau pasokan kurang, mesin giling tidak terisi penuh padahal biaya operasinya tetap. Karena itu, kalau pasokan besok bisa diperkirakan, pabrik bisa mengatur kuota tebang dan antrean sejak sehari sebelumnya.");
}

// ======================= 5b. RUMUSAN MASALAH & TUJUAN =======================
{
  const s = slideIsi("Rumusan masalah dan tujuan", { bagian: "Masalah" });
  const pasang = [
    ["Bagaimana model ARIMA yang sesuai untuk meramalkan pasokan tebu masuk harian PG Modjopanggoong?", "Menentukan model ARIMA yang sesuai untuk meramalkan pasokan tebu masuk harian PG Modjopanggoong."],
    ["Bagaimana akurasi peramalan H+1 model tersebut dibandingkan metode Naive?", "Mengevaluasi akurasi peramalan H+1 model tersebut dibandingkan metode Naive."],
    ["Bagaimana implikasi hasil peramalan bagi pengaturan kuota SPT dan antrean di emplasemen?", "Merumuskan implikasi hasil peramalan bagi pengaturan kuota SPT dan antrean di emplasemen."],
  ];
  s.addText("Rumusan masalah", { x: MX + 0.85, y: 1.3, w: 5.2, h: 0.45, fontFace: FJ, fontSize: 18, bold: true, color: MERAH, margin: 0, isTextBox: true });
  s.addText("Tujuan", { x: 7.35, y: 1.3, w: 5.3, h: 0.45, fontFace: FJ, fontSize: 18, bold: true, color: HIJAU, margin: 0, isTextBox: true });
  pasang.forEach((q, i) => {
    const y = 1.9 + i * 1.65;
    s.addShape(pres.shapes.OVAL, { x: MX, y: y + 0.38, w: 0.62, h: 0.62, fill: { color: EMAS }, line: { color: EMAS } });
    s.addText(String(i + 1), { x: MX, y: y + 0.38, w: 0.62, h: 0.62, fontFace: FJ, fontSize: 20, bold: true, color: PUTIH, align: "center", valign: "middle", margin: 0, isTextBox: true });
    kartu(s, MX + 0.85, y, 5.55, 1.4, KREM_EMAS);
    teks(s, q[0], MX + 1.05, y, 5.15, 1.4, { fontSize: 16, valign: "middle" });
    s.addShape(pres.shapes.LINE, { x: 7.0, y: y + 0.7, w: 0.3, h: 0, line: { color: ABU, width: 1.5, endArrowType: "triangle" } });
    kartu(s, 7.35, y, 5.38, 1.4, MUDA);
    teks(s, q[1], 7.55, y, 4.98, 1.4, { fontSize: 16, valign: "middle", color: HIJAU, bold: true });
  });
  s.addNotes("Dari masalah tadi, ada tiga pertanyaan. Pertama, model ARIMA seperti apa yang sesuai untuk data tebu masuk harian ini. Kedua, seberapa akurat ramalan satu hari ke depannya dibandingkan cara paling sederhana, yaitu Naive. Ketiga, apa artinya bagi pengaturan kuota surat perintah tebang dan antrean di emplasemen. Tujuannya menjawab ketiga pertanyaan itu secara berurutan, dan kesimpulan di akhir nanti juga mengikuti urutan yang sama.");
}

// ======================= 6. MACAM METODE =======================
{
  const s = slideIsi("Macam-macam metode peramalan", { bagian: "Metode", sumber: "Sumber: Heizer et al. (2020); Hyndman & Athanasopoulos (2021); Makridakis et al. (1998); Al Khatib et al. (2026)." });
  const kol = [
    ["Kualitatif", "Pertimbangan dan pengalaman; dipakai saat data historis terbatas", ["Opini juri eksekutif", "Metode Delphi", "Gabungan perkiraan tenaga penjualan", "Survei pasar", "Analogi dan skenario"], PUTIH, HIJAU],
    ["Deret waktu", "Pola nilai masa lalu dari besaran itu sendiri", ["Naive", "Rata-rata bergerak", "Pemulusan eksponensial", "Holt dan Holt–Winters", "Proyeksi tren", "ARIMA (Box-Jenkins)"], EMAS, PUTIH],
    ["Kausal / regresi", "Hubungan dengan variabel penjelas lain", ["Regresi linear sederhana", "Regresi linear berganda", "Regresi dinamis (ARIMAX)"], PUTIH, HIJAU],
    ["Machine learning", "Pola tidak linier dipelajari dari data dan fitur dalam jumlah besar", ["Jaringan saraf tiruan", "Gradient boosting (XGBoost)"], PUTIH, HIJAU],
  ];
  kol.forEach((k, i) => {
    const x = MX + i * 3.08, y = 1.55, w = 2.85;
    const sorot = i === 1;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 4.05, fill: { color: sorot ? KREM_EMAS : "F6F8F5" }, line: { color: sorot ? EMAS : "DCE3D9", width: sorot ? 2 : 1 }, rectRadius: 0.08 });
    s.addText(k[0], { x: x + 0.2, y: y + 0.2, w: w - 0.4, h: 0.5, fontFace: FJ, fontSize: 20, bold: true, color: HIJAU, margin: 0, isTextBox: true });
    teks(s, k[1], x + 0.2, y + 0.7, w - 0.4, 0.85, { fontSize: 13, italic: true, color: ABU });
    teks(s, akhiri(k[2].map((t) => b(t, { bold: sorot && t.startsWith("ARIMA"), color: sorot && t.startsWith("ARIMA") ? MERAH : ARANG }))), x + 0.2, y + 1.55, w - 0.4, 2.45, { fontSize: 14, paraSpaceAfter: 3 });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: MX, y: 5.75, w: W - 2 * MX, h: 1.05, fill: { color: HIJAU }, line: { color: HIJAU }, rectRadius: 0.08 });
  teks(s, [
    { text: "Posisi tugas ini: ", options: { bold: true, color: EMAS } },
    { text: "ARIMA dan pembandingnya, Naive, sama-sama metode deret waktu. Keduanya hanya memakai riwayat tebu masuk itu sendiri, sesuai data yang tersedia.", options: { color: PUTIH } },
  ], MX + 0.3, 5.75, W - 2 * MX - 0.6, 1.05, { fontSize: 17, valign: "middle" });
  s.addNotes("Secara umum metode peramalan ada dua: kualitatif, yang berbasis pertimbangan dan pengalaman, misalnya metode Delphi, dan kuantitatif, yang berbasis data. Yang kuantitatif dibagi lagi. Deret waktu memakai pola masa lalu dari variabel itu sendiri. Di dalamnya ada Naive, rata-rata bergerak, pemulusan eksponensial termasuk Holt-Winters untuk tren dan musiman, proyeksi tren, dan ARIMA. Kausal atau regresi memakai variabel penjelas lain, misalnya curah hujan. Machine learning seperti jaringan saraf tiruan dan XGBoost mempelajari pola tidak linier dari banyak data. ARIMA ada di kelompok deret waktu, dan metode Naive yang nanti jadi pembanding juga ada di kelompok ini.");
}

// ======================= 7. MENGAPA ARIMA =======================
{
  const s = slideIsi("Mengapa ARIMA dipilih untuk kasus ini", { bagian: "Metode", sumber: "Sumber: Box et al. (2015); Harlianingtyas et al. (2020); Suresh & Krishna Priya (2011)." });
  const alasan = [
    ["Data yang tersedia", "Hanya catatan tebu masuk per hari. ARIMA cukup memakai satu deret itu (univariat), tanpa data cuaca atau data kebun."],
    ["Horizon pendek", "Keputusan harian butuh ramalan esok hari (H+1). Di jangka pendek, nilai kemarin dan kejutan kemarin biasanya masih berpengaruh."],
    ["Prosedur baku dan transparan", "Metode Box-Jenkins punya langkah yang jelas dan setiap ramalan bisa dihitung ulang dengan tangan."],
    ["Sudah dipakai di sektor tebu", "ARIMA dipakai untuk meramal produksi tebu di PG Asembagus (Harlianingtyas et al., 2020) dan hasil tebu di Tamil Nadu (Suresh & Krishna Priya, 2011)."],
  ];
  alasan.forEach((a, i) => {
    const x = MX + (i % 2) * 6.15, y = 1.55 + Math.floor(i / 2) * 2.55;
    kartu(s, x, y, 5.9, 2.3);
    s.addShape(pres.shapes.OVAL, { x: x + 0.25, y: y + 0.25, w: 0.5, h: 0.5, fill: { color: HIJAU }, line: { color: HIJAU } });
    s.addText(String(i + 1), { x: x + 0.25, y: y + 0.25, w: 0.5, h: 0.5, fontFace: FJ, fontSize: 16, bold: true, color: PUTIH, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(a[0], { x: x + 0.95, y: y + 0.25, w: 4.7, h: 0.5, fontFace: FJ, fontSize: 18, bold: true, color: HIJAU, valign: "middle", margin: 0, isTextBox: true });
    teks(s, a[1], x + 0.95, y + 0.85, 4.7, 1.4, { fontSize: 16 });
  });
  s.addNotes("Kenapa ARIMA? Pertama, datanya hanya catatan tebu masuk harian, dan ARIMA memang dirancang untuk satu deret data. Kedua, kebutuhannya ramalan esok hari, dan dalam jangka pendek kondisi kemarin masih berpengaruh. Ketiga, prosedurnya baku dan transparan sehingga cocok untuk belajar karena bisa dihitung tangan. Keempat, ARIMA sudah dipakai di sektor tebu, misalnya di PG Asembagus.");
}

// ======================= 8. MENGENAL ARIMA =======================
{
  const s = slideIsi("Mengenal ARIMA(p, d, q): tiga bagian, tiga pertanyaan", { bagian: "Metode", sumber: "Sumber: Box et al. (2015); Hyndman & Athanasopoulos (2021)." });
  const bag = [
    ["AR", "p", "AutoRegressive", "Apakah pasokan hari ini dipengaruhi pasokan hari-hari sebelumnya?", "p = berapa hari ke belakang yang diingat"],
    ["I", "d", "Integrated", "Apakah data perlu dibuat stabil dulu dengan mengurangkan hari ini dengan kemarin?", "d = berapa kali differencing"],
    ["MA", "q", "Moving Average", "Apakah kejutan (galat ramalan) hari sebelumnya masih terbawa ke hari ini?", "q = berapa kejutan lampau yang diingat"],
  ];
  bag.forEach((k, i) => {
    const x = MX + i * 4.1, y = 1.5;
    kartu(s, x, y, 3.85, 3.3);
    s.addText(k[0], { x: x + 0.25, y: y + 0.15, w: 1.5, h: 0.8, fontFace: FJ, fontSize: 36, bold: true, color: EMAS, margin: 0, isTextBox: true });
    s.addText(`(${k[1]})  ${k[2]}`, { x: x + 1.5, y: y + 0.3, w: 2.3, h: 0.55, fontFace: FB, fontSize: 14, bold: true, color: HIJAU, valign: "middle", margin: 0, isTextBox: true });
    teks(s, k[3], x + 0.25, y + 1.0, 3.4, 1.5, { fontSize: 16.5 });
    teks(s, k[4], x + 0.25, y + 2.55, 3.4, 0.65, { fontSize: 14, italic: true, color: ABU });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: MX, y: 5.05, w: W - 2 * MX, h: 1.75, fill: { color: KREM_EMAS }, line: { color: EMAS }, rectRadius: 0.08 });
  s.addText("Contoh ARIMA(1, 0, 1):   Ŷₜ₊₁ = μ + φ (Yₜ − μ) + θ εₜ", { x: MX + 0.3, y: 5.15, w: 11.5, h: 0.6, fontFace: FJ, fontSize: 22, color: HIJAU, bold: true, margin: 0, isTextBox: true });
  teks(s, "Ŷₜ₊₁ ramalan besok;  μ rata-rata jangka panjang;  Yₜ pasokan hari ini;  εₜ galat hari ini (aktual − ramalan);  φ bobot AR;  θ bobot MA. Artinya: ramalan besok = rata-rata, dikoreksi oleh seberapa jauh hari ini dari rata-rata dan oleh kejutan hari ini.", MX + 0.3, 5.8, W - 2 * MX - 0.6, 0.95, { fontSize: 14.5 });
  s.addNotes("ARIMA punya tiga bagian. AR, autoregressive: apakah pasokan hari ini terpengaruh pasokan kemarin. I, integrated: apakah data perlu distabilkan dulu dengan differencing. MA, moving average: apakah kejutan atau galat ramalan kemarin masih terbawa. Huruf p, d, q menyatakan berapa banyak dari masing-masing. Contohnya ARIMA(1,0,1): ramalan besok sama dengan rata-rata, ditambah koreksi karena hari ini di atas atau di bawah rata-rata, ditambah koreksi karena kejutan hari ini. Rumus inilah yang nanti kita hitung dengan tangan.");
}

// ======================= 9. ALUR BOX-JENKINS =======================
{
  const s = slideIsi("Alur kerja Box-Jenkins yang dipakai", { bagian: "Metode", sumber: "Sumber: Box & Jenkins (1970); Box et al. (2015). Pembagian data: kronologis, tidak diacak." });
  const langkah = [["Uji stasioneritas", "ADF dan KPSS"], ["Differencing", "tentukan d"], ["ACF dan PACF", "calon p dan q"], ["Estimasi dan seleksi", "AIC, uji koefisien"], ["Diagnostik residual", "Ljung-Box"], ["Peramalan H+1", "rolling harian"], ["Evaluasi", "MAE, RMSE, MAPE"]];
  langkah.forEach((l, i) => {
    const x = MX + i * 1.75, y = 1.6;
    s.addShape(pres.shapes.OVAL, { x: x + 0.45, y, w: 0.65, h: 0.65, fill: { color: EMAS }, line: { color: EMAS } });
    s.addText(String(i + 1), { x: x + 0.45, y, w: 0.65, h: 0.65, fontFace: FJ, fontSize: 20, bold: true, color: PUTIH, align: "center", valign: "middle", margin: 0, isTextBox: true });
    if (i < langkah.length - 1) s.addShape(pres.shapes.LINE, { x: x + 1.15, y: y + 0.33, w: 1.2, h: 0, line: { color: DAUN, width: 1.5, endArrowType: "triangle" } });
    s.addText(l[0], { x, y: y + 0.8, w: 1.6, h: 0.7, fontFace: FB, fontSize: 14.5, bold: true, color: HIJAU, align: "center", valign: "top", margin: 0, isTextBox: true });
    s.addText(l[1], { x, y: y + 1.5, w: 1.6, h: 0.5, fontFace: FB, fontSize: 13, color: ABU, align: "center", valign: "top", margin: 0, isTextBox: true });
  });
  kartu(s, MX, 3.75, W - 2 * MX, 1.05, KREM_EMAS);
  teks(s, [
    { text: "Apa itu Box-Jenkins? ", options: { bold: true, color: HIJAU } },
    { text: "Prosedur membangun model ARIMA yang diperkenalkan George Box dan Gwilym Jenkins (1970). Intinya tiga tahap berulang: identifikasi (langkah 1–3), estimasi (4), dan pemeriksaan diagnostik (5). Jika pemeriksaan gagal, kembali ke identifikasi; jika lolos, model dipakai meramal (6–7)." },
  ], MX + 0.25, 3.85, W - 2 * MX - 0.5, 0.9, { fontSize: 14.5, valign: "middle" });
  // bar pembagian data
  const x0 = MX, wT = W - 2 * MX, fr = H.n_latih / D.n_hari;
  s.addShape(pres.shapes.RECTANGLE, { x: x0, y: 5.0, w: wT * fr, h: 0.7, fill: { color: HIJAU }, line: { color: HIJAU } });
  s.addShape(pres.shapes.RECTANGLE, { x: x0 + wT * fr, y: 5.0, w: wT * (1 - fr), h: 0.7, fill: { color: EMAS }, line: { color: EMAS } });
  s.addText(`Data latih: hari 1–${H.n_latih} (${D.tanggal_awal} s.d. 2025-10-27), untuk membangun model`, { x: x0 + 0.2, y: 5.0, w: wT * fr - 0.4, h: 0.7, fontFace: FB, fontSize: 14, bold: true, color: PUTIH, valign: "middle", margin: 0, isTextBox: true });
  s.addText(`Data uji: hari ${H.n_latih + 1}–${D.n_hari}`, { x: x0 + wT * fr, y: 5.0, w: wT * (1 - fr), h: 0.7, fontFace: FB, fontSize: 13, bold: true, color: PUTIH, align: "center", valign: "middle", margin: 0, isTextBox: true });
  teks(s, `Model dibangun hanya dari ${H.n_latih} hari pertama (80%). ${H.n_uji} hari terakhir (20%) disembunyikan, lalu dipakai untuk menguji ramalan seolah-olah kita berada di hari tersebut.`, MX, 5.9, W - 2 * MX, 0.9, { fontSize: 15 });
  s.addNotes(`Box-Jenkins adalah nama prosedur membangun ARIMA, dari dua statistikawan George Box dan Gwilym Jenkins, tahun 1970. Idenya: tebak bentuk model dari data, estimasi, periksa; kalau pemeriksaan gagal, ulangi. Kita mengikuti prosedur itu dalam tujuh langkah. Langkah 1 sampai 3 disebut identifikasi: memeriksa stasioneritas, menentukan differencing, lalu membaca ACF dan PACF untuk menebak ordo model. Langkah 4 estimasi, langkah 5 pemeriksaan residual, langkah 6 dan 7 peramalan dan evaluasi. Datanya dibagi berurutan waktu, tidak diacak: ${H.n_latih} hari pertama untuk membangun model, ${H.n_uji} hari terakhir untuk menguji. Data uji tidak boleh dipakai saat memilih model, supaya pengujiannya jujur.`);
}

// ======================= 10. LANGKAH 1 STASIONERITAS =======================
{
  const s = slideIsi("Uji stasioneritas: apakah pola datanya stabil?", { langkah: 1, bagian: "Perhitungan", sumber: "Sumber: Dickey & Fuller (1979); Kwiatkowski et al. (1992); Hyndman & Athanasopoulos (2021). Uji pada 160 hari data latih." });
  teks(s, akhiri([
    p("Stasioner = rata-rata dan besar naik-turunnya tetap sepanjang waktu, tanpa tren. ARIMA membutuhkan deret stasioner.", { bold: true }),
    p(" ", { fontSize: 6 }),
    p("Uji ADF (Augmented Dickey-Fuller)", { bold: true, color: HIJAU, fontSize: 16 }),
    p("Memeriksa apakah perubahan harian ΔYₜ dipengaruhi nilai kemarin Yₜ₋₁. Jika pengaruhnya nyata negatif, data yang menjauh selalu ditarik kembali ke rata-rata, artinya stasioner. H₀: tidak stasioner."),
    p(" ", { fontSize: 6 }),
    p("Uji KPSS (Kwiatkowski-Phillips-Schmidt-Shin)", { bold: true, color: HIJAU, fontSize: 16 }),
    p("Menjumlahkan simpangan data dari rata-rata secara berurutan. Jika jumlah itu melantur makin jauh, data tidak stasioner. H₀: stasioner."),
  ]), MX, 1.45, 5.7, 3.9, { fontSize: 14.5 });
  istilah(s, [["H₀ (hipotesis nol)", "anggapan awal yang diuji"], ["p-value", "peluang mendapat hasil seekstrem ini bila H₀ benar; < 0,05 berarti H₀ ditolak"], ["Nilai kritis", "batas statistik uji pada taraf 5%; melewatinya berarti H₀ ditolak"]], MX, 5.4, 5.7, 1.5);
  tabel(s, [
    ["Uji", "Statistik", "Nilai kritis 5%", "p-value", "Kesimpulan"],
    ["ADF", id(S.adf_stat, 2), id(S.adf_kritis_5, 2), "< 0,001", { text: "Stasioner", options: { bold: true, color: HIJAU } }],
    ["KPSS", id(S.kpss_stat, 3), id(S.kpss_kritis_5, 3), "> 0,10", { text: "Stasioner", options: { bold: true, color: HIJAU } }],
  ], 6.6, 1.5, 6.1, [0.9, 1.25, 1.45, 1.1, 1.4], { fs: 14, rowH: 0.5 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.6, y: 3.3, w: 6.1, h: 2.6, fill: { color: KREM_EMAS }, line: { color: EMAS }, rectRadius: 0.08 });
  teks(s, akhiri([
    p("Cara membaca", { bold: true, color: HIJAU, fontSize: 16 }),
    p(`ADF: statistik ${id(S.adf_stat, 2)} lebih negatif dari nilai kritis ${id(S.adf_kritis_5, 2)} (p < 0,05), jadi H₀ "tidak stasioner" ditolak.`),
    p(`KPSS: statistik ${id(S.kpss_stat, 3)} di bawah nilai kritis ${id(S.kpss_kritis_5, 3)} (p > 0,05), jadi H₀ "stasioner" dipertahankan.`),
    p("Dua uji dengan anggapan berlawanan sepakat: data tebu masuk MG2025 sudah stasioner.", { bold: true }),
  ]), 6.9, 3.45, 5.5, 2.4, { fontSize: 14 });
  s.addNotes(`Langkah pertama: memeriksa stasioneritas. Stasioner artinya rata-rata dan besarnya naik-turun data tetap sepanjang waktu. Kita pakai dua uji yang anggapan awalnya berlawanan supaya saling mengecek. ADF melihat apakah perubahan hari ini dipengaruhi nilai kemarin: kalau data yang sedang tinggi cenderung turun dan yang rendah cenderung naik, berarti data selalu kembali ke rata-rata, jadi stasioner. Anggapan awal ADF adalah tidak stasioner; hasilnya statistik ${id(S.adf_stat, 2)}, jauh lebih negatif dari nilai kritis ${id(S.adf_kritis_5, 2)} sehingga anggapan itu ditolak. KPSS menjumlahkan simpangan dari rata-rata; kalau jumlahnya melantur, data tidak stasioner. Anggapan awal KPSS adalah stasioner; statistiknya ${id(S.kpss_stat, 3)}, di bawah nilai kritis ${id(S.kpss_kritis_5, 3)}, jadi anggapan itu dipertahankan. Istilah p-value: peluang mendapat hasil seperti ini kalau anggapan awal benar; kalau di bawah 0,05, anggapan awal ditolak. Keduanya sepakat: data sudah stasioner.`);
}

// ======================= 11. LANGKAH 2 DIFFERENCING =======================
{
  const s = slideIsi("Differencing: cara menstabilkan data, dan mengapa di sini d = 0", { langkah: 2, bagian: "Perhitungan", sumber: "Sumber: Hyndman & Athanasopoulos (2021). Contoh memakai hari 1–4 MG2025." });
  s.addImage({ path: G("02_asli_vs_differencing.png"), x: MX, y: 1.4, w: 7.4, h: 7.4 * R("02_asli_vs_differencing.png") });
  s.addText("ΔYₜ = Yₜ − Yₜ₋₁", { x: 8.3, y: 1.4, w: 4.4, h: 0.6, fontFace: FJ, fontSize: 24, bold: true, color: HIJAU, margin: 0, isTextBox: true });
  const cd = H.contoh_differencing;
  tabel(s, [["Hari", "Yₜ (ton)", "ΔYₜ (ton)"],
    ...cd.slice(0, 4).map((c) => [String(c.hari), id(c.y), c.diff === null ? "–" : `${id(c.y)} − ${id(c.y_sebelum)}\n= ${sgn(c.diff)}`])],
    8.3, 2.1, 4.4, [0.7, 1.35, 2.35], { fs: 12.5, rowH: 0.55 });
  teks(s, akhiri([
    p("Keputusan", { bold: true, color: HIJAU, fontSize: 16 }),
    p("Differencing hanya dipakai bila data belum stasioner. Karena langkah 1 menyatakan sudah stasioner, dipakai d = 0 dan model dibangun pada data asli. Differencing yang tidak perlu justru menambah gejolak (lihat panel bawah)."),
  ]), 8.3, 5.1, 4.4, 1.85, { fontSize: 14 });
  s.addNotes(`Langkah kedua: differencing. Caranya sederhana: nilai hari ini dikurangi nilai kemarin. Contohnya hari ke-2 dikurangi hari ke-1 menghasilkan ${sgn(cd[1].diff)} ton. Differencing dipakai kalau data punya tren atau rata-ratanya bergeser. Di kasus kita, langkah 1 sudah menyatakan data stasioner, jadi tidak perlu differencing: d sama dengan nol. Grafik bawah menunjukkan data hasil differencing justru lebih bergejolak, jadi differencing yang tidak perlu hanya menambah gangguan.`);
}

// ======================= 12. LANGKAH 3 ACF PACF =======================
{
  const A = H.acf_manual_lag1;
  const s = slideIsi("ACF dan PACF: membaca ingatan data untuk menebak p dan q", { langkah: 3, bagian: "Perhitungan", sumber: "Sumber: Box et al. (2015). Batas signifikansi ±1,96/√n = ±" + id(H.batas_signifikan, 3) + " (n = 160)." });
  s.addImage({ path: G("03_acf_pacf.png"), x: MX, y: 1.35, w: 7.6, h: 7.6 * R("03_acf_pacf.png") });
  kartu(s, MX, 4.1, 7.6, 1.85, KREM_EMAS);
  teks(s, akhiri([
    p("Contoh hitung ACF lag 1 (korelasi hari ini dengan kemarin)", { bold: true, color: HIJAU, fontSize: 14.5 }),
    p("r₁ = Σ (Yₜ − Ȳ)(Yₜ₋₁ − Ȳ)  ÷  Σ (Yₜ − Ȳ)²", { fontFace: FJ, fontSize: 16, bold: true }),
    p(`Ȳ = ${id(A.ybar)} ton;  pembilang = ${id(A.pembilang, 0)};  penyebut = ${id(A.penyebut, 0)}`),
    p(`r₁ = ${id(A.pembilang, 0)} ÷ ${id(A.penyebut, 0)} = ${id(A.r1, 3)}  >  ${id(H.batas_signifikan, 3)}  → signifikan`, { bold: true }),
    ]), MX + 0.25, 4.2, 7.1, 1.7, { fontSize: 13.5 });
  istilah(s, [["Lag", "jarak mundur waktu; lag 1 = kemarin, lag 2 = dua hari lalu"], ["PACF", "seperti ACF, tetapi hanya hubungan langsung (pengaruh lag di antaranya dikeluarkan)"]], MX, 6.05, 7.6, 0.9);
  teks(s, akhiri([
    p("Aturan membaca", { bold: true, color: HIJAU, fontSize: 16 }),
    b("ACF terputus setelah lag q → petunjuk MA(q)."),
    b("PACF terputus setelah lag p → petunjuk AR(p)."),
    p(" "),
    p("Hasil pada data kita", { bold: true, color: HIJAU, fontSize: 16 }),
    b(`ACF: hanya lag 1 (${id(H.acf[1], 3)}) keluar batas → MA(1).`),
    b(`PACF: lag 1 (${id(H.pacf[1], 3)}) dan lag 2 (${id(H.pacf[2], 3)}, tipis) → AR(1) atau AR(2).`),
    p(" "),
    p("Calon model: AR(1), AR(2), MA(1), ARMA(1,1). Untuk aman, semua kombinasi p, q ≤ 2 diuji (8 model).", { bold: true }),
  ]), 8.5, 1.4, 4.25, 5.5, { fontSize: 13.5 });
  s.addNotes(`Langkah ketiga: ACF dan PACF, yaitu grafik ingatan data. ACF lag 1 adalah korelasi antara pasokan hari ini dan kemarin. Rumusnya ada di kotak kuning; hasil hitungnya ${id(A.r1, 3)}, di atas batas ${id(H.batas_signifikan, 3)}, jadi signifikan: pasokan hari ini memang terkait dengan kemarin. Setelah lag 1, ACF langsung masuk ke area krem, artinya terputus, yang mengarah ke MA(1). PACF signifikan di lag 1 dan tipis di lag 2, mengarah ke AR(1) atau AR(2). Jadi calon modelnya AR(1), AR(2), MA(1), atau gabungannya ARMA(1,1). Supaya tidak ada yang terlewat, semua kombinasi p dan q sampai 2 diuji.`);
}

// ======================= 13. LANGKAH 4 ESTIMASI & SELEKSI =======================
{
  const s = slideIsi("Estimasi dan seleksi: memilih satu model dari 8 kandidat", { langkah: 4, bagian: "Perhitungan", sumber: "Sumber: Akaike (1974); Schwarz (1978); Ljung & Box (1978). Estimasi maximum likelihood pada 160 hari data latih; Ljung-Box lag 10." });
  const rows = [["Model", "AIC", "BIC", "Koefisien\nsignifikan?", "Residual acak?\n(Ljung-Box p)", "Status"]];
  H.kandidat.forEach((k) => {
    const pilih = k.orde.join() === M.orde.join();
    const st = pilih ? "Terpilih" : (!k.semua_koef_signifikan ? "Gugur" : "Layak");
    const o = pilih ? { bold: true, color: HIJAU, fill: { color: KREM_EMAS } } : {};
    rows.push([k.nama, id(k.aic, 1), id(k.bic, 1), k.semua_koef_signifikan ? "Ya" : "Tidak", k.residual_white_noise ? `Ya (${id(k.ljungbox_p_lag10, 2)})` : "Tidak", st]
      .map((t) => ({ text: t, options: Object.assign({}, o) })));
  });
  tabel(s, rows, MX, 1.35, 7.9, [1.45, 0.95, 0.95, 1.3, 1.5, 1.75], { fs: 12.5, rowH: 0.37 });
  kartu(s, MX, 5.0, 7.9, 1.95, KREM_EMAS);
  teks(s, akhiri([
    p("AIC = 2k − 2 ln L        BIC = k ln n − 2 ln L", { bold: true, color: HIJAU, fontFace: FJ, fontSize: 16 }),
    p(`L = likelihood, seberapa mungkin data muncul bila model benar (dicari lewat MLE); k = jumlah parameter (${IC.k}: μ, φ, θ, σ²); n = ${IC.n} hari.`),
    p(`ARIMA(1,0,1): ln L = ${id(IC.loglik)} → AIC = 2×${IC.k} + ${id(-2 * IC.loglik)} = ${id(IC.aic_manual)};  BIC = ${IC.k}×ln ${IC.n} + ${id(-2 * IC.loglik)} = ${id(IC.bic_manual)}.`),
    p("Suku −2 ln L mengukur ketidakcocokan; 2k atau k ln n adalah hukuman untuk parameter. BIC menghukum lebih berat."),
  ]), MX + 0.25, 5.08, 7.4, 1.85, { fontSize: 12.5, paraSpaceAfter: 2 });
  teks(s, akhiri([
    p("Tiga saringan", { bold: true, color: HIJAU, fontSize: 15 }),
    b("Koefisien AR dan MA signifikan (p < 0,05)."),
    b("Residual acak (lolos Ljung-Box)."),
    b("Dari yang lolos, AIC terkecil."),
  ]), 8.85, 1.35, 3.9, 1.7, { fontSize: 14.5 });
  istilah(s, [["MLE", "maximum likelihood estimation; komputer mencari μ, φ, θ yang membuat data paling mungkin terjadi"], ["AIC / BIC", "skor kecocokan dengan hukuman kerumitan; makin kecil makin baik"]], 8.85, 3.05, 3.9, 1.65);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.85, y: 4.85, w: 3.9, h: 2.1, fill: { color: HIJAU }, line: { color: HIJAU }, rectRadius: 0.08 });
  teks(s, akhiri([
    p("Terpilih: ARIMA(1,0,1)", { bold: true, color: EMAS, fontSize: 15 }),
    p(`μ = ${id(mu)} ton`, { color: PUTIH }),
    p(`φ₁ = ${id(phi, 3)}  (p = ${id(M.pvalues["ar.L1"], 3)})`, { color: PUTIH }),
    p(`θ₁ = ${id(theta, 3)}  (p = ${id(M.pvalues["ma.L1"], 3)})`, { color: PUTIH }),
    p(`σ² = ${id(M.params.sigma2, 0)} (σ ≈ ${id(Math.sqrt(M.params.sigma2), 0)} ton)`, { color: PUTIH }),
  ]), 9.05, 4.95, 3.5, 1.95, { fontSize: 14.5, fontFace: FJ, paraSpaceAfter: 2 });
  s.addNotes(`Langkah keempat: estimasi. Kedelapan model dihitung koefisiennya dengan maximum likelihood, yaitu komputer mencari nilai μ, φ, dan θ yang membuat data kita paling mungkin terjadi. Lalu disaring tiga kali. Pertama, koefisiennya harus signifikan; empat model gugur. Kedua, residualnya harus acak; semua lolos. Ketiga, dari yang lolos dipilih AIC terkecil. Rumus AIC ada di kotak kuning: dua kali jumlah parameter dikurangi dua kali log-likelihood. Bagian log-likelihood mengukur seberapa cocok model, bagian 2k adalah hukuman kalau parameternya banyak. Untuk model terpilih, log-likelihood ${id(IC.loglik)}, jadi AIC ${id(IC.aic_manual)}. BIC sama, tetapi hukumannya k kali ln n, lebih berat. Pemenangnya ARIMA(1,0,1). Catatan jujur: bila memakai BIC, yang terkecil MA(1); selisihnya kecil, dan di sini AIC dipakai sebagai kriteria utama.`);
}

// ======================= 14. LANGKAH 5 DIAGNOSTIK =======================
{
  const Dg = H.diagnostik;
  const s = slideIsi("Diagnostik residual: apakah masih ada pola yang tertinggal?", { langkah: 5, bagian: "Perhitungan", sumber: "Sumber: Ljung & Box (1978); Jarque & Bera (1987); Hyndman & Athanasopoulos (2021). Residual pada 160 hari data latih." });
  s.addImage({ path: G("04_diagnostik_residual.png"), x: MX, y: 1.3, w: 6.6, h: 6.6 * R("04_diagnostik_residual.png") });
  kartu(s, MX, 5.0, 6.6, 1.95, KREM_EMAS);
  teks(s, akhiri([
    p("Uji Ljung-Box:   Q = n(n+2) Σ rₖ² ÷ (n − k),  k = 1…h", { bold: true, color: HIJAU, fontFace: FJ, fontSize: 15 }),
    p("rₖ = ACF residual pada lag k. Jika residual acak, semua rₖ mendekati 0 sehingga Q kecil. H₀: residual acak (white noise)."),
    p(`Data kita (n = ${LB.n}, h = ${LB.h}, derajat bebas h − p − q = 8): Q = ${id(LB.Q, 2)}; p = ${id(LB.p_df8, 2)} > 0,05 → H₀ dipertahankan, residual acak.`, { bold: true }),
  ]), MX + 0.25, 5.08, 6.2, 1.85, { fontSize: 13, paraSpaceAfter: 3 });
  kartu(s, 7.45, 1.35, 5.3, 1.75);
  teks(s, akhiri([
    p("Syarat utama terpenuhi", { bold: true, color: HIJAU, fontSize: 15 }),
    p(`Ljung-Box lag 10: p = ${id(LB.p_df8, 2)} > 0,05, dan panel c tidak menunjukkan lag signifikan. Pola yang bisa ditangkap ARIMA sudah terambil.`),
  ]), 7.65, 1.45, 4.9, 1.6, { fontSize: 14 });
  kartu(s, 7.45, 3.25, 5.3, 1.75, KREM_EMAS);
  teks(s, akhiri([
    p("Catatan: residual tidak normal", { bold: true, color: MERAH, fontSize: 15 }),
    p(`Jarque-Bera p < 0,001; skewness ${id(Dg.skewness_residual, 2)}. Penyebabnya hari anjlok mendadak (hari 57–58, 75). Ramalan titik tetap layak; interval 95% dibaca hati-hati.`),
  ]), 7.65, 3.35, 4.9, 1.6, { fontSize: 14 });
  istilah(s, [["Residual", "aktual − dugaan model"], ["White noise", "deret acak murni tanpa pola"], ["Jarque-Bera", "uji apakah residual berdistribusi normal (H₀: normal)"], ["Q-Q plot", "titik di garis merah = normal"], ["Skewness", "kemencengan; negatif = ekor panjang ke kiri"]], 7.45, 5.15, 5.3, 1.8);
  s.addNotes(`Langkah kelima: memeriksa residual, yaitu aktual dikurangi dugaan model. Model yang baik meninggalkan residual yang acak atau white noise, artinya tidak ada pola tersisa. Alatnya uji Ljung-Box: hitung ACF residual untuk lag 1 sampai 10, kuadratkan, jumlahkan dengan bobot, hasilnya Q. Kalau residual acak, semua ACF-nya mendekati nol sehingga Q kecil. Hasil kita Q ${id(LB.Q, 2)} dengan p ${id(LB.p_df8, 2)} pada derajat bebas 8, jauh di atas 0,05, jadi residual acak. Syarat utamanya terpenuhi. Namun uji Jarque-Bera dan Q-Q plot menunjukkan residual tidak normal: ekornya panjang ke kiri karena hari-hari pasokan anjlok mendadak seperti hari ke-75. Kejadian seperti itu tidak bisa ditebak dari pola harian. Akibatnya, interval ramalan perlu dibaca hati-hati.`);
}

// ======================= 15. LANGKAH 6 HITUNG TANGAN =======================
{
  const s = slideIsi("Peramalan dengan tangan: berapa tebu masuk hari ke-161?", { langkah: 6, bagian: "Perhitungan", sumber: "Hasil hitung tangan identik dengan keluaran statsmodels (selisih < 0,001 ton). ε₁₆₀ diambil dari residual model pada hari ke-160." });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: MX, y: 1.4, w: W - 2 * MX, h: 0.9, fill: { color: KREM_EMAS }, line: { color: EMAS }, rectRadius: 0.08 });
  s.addText("Ŷ₁₆₁ = μ + φ (Y₁₆₀ − μ) + θ ε₁₆₀", { x: MX, y: 1.4, w: W - 2 * MX, h: 0.9, fontFace: FJ, fontSize: 28, bold: true, color: HIJAU, align: "center", valign: "middle", margin: 0, isTextBox: true });
  const langkah = [
    ["Bahan yang diketahui", [`μ = ${id(mu)};  φ = ${id(phi, 4)};  θ = ${id(theta, 4)}`, `Y₁₆₀ = ${id(C1.y_t)} ton (aktual 27 Okt)`, `ε₁₆₀ = ${id(C1.eps_t)} ton (galat hari ke-160)`]],
    ["Suku AR (pengaruh hari ini)", [`φ × (Y₁₆₀ − μ)`, `= ${id(phi, 4)} × (${id(C1.y_t)} − ${id(mu)})`, `= ${id(phi, 4)} × ${id(C1.y_t - mu)} = ${sgn(C1.suku_ar)}`]],
    ["Suku MA (pengaruh kejutan)", [`θ × ε₁₆₀`, `= ${id(theta, 4)} × (${id(C1.eps_t)})`, `= ${sgn(C1.suku_ma)}`]],
    ["Jumlahkan", [`Ŷ₁₆₁ = ${id(mu)} ${sgn(C1.suku_ar)} ${sgn(C1.suku_ma)}`, `= ${id(C1.yhat)} ton`]],
  ];
  langkah.forEach((l, i) => {
    const x = MX + i * 3.08, y = 2.6, w = 2.9;
    kartu(s, x, y, w, 2.6, i === 3 ? HIJAU : MUDA);
    s.addText(l[0], { x: x + 0.2, y: y + 0.15, w: w - 0.4, h: 0.5, fontFace: FJ, fontSize: 15, bold: true, color: i === 3 ? EMAS : HIJAU, margin: 0, isTextBox: true });
    teks(s, akhiri(l[1].map((t, j) => p(t, { bold: i === 3 && j === l[1].length - 1, fontSize: i === 3 && j === l[1].length - 1 ? 22 : 15 }))), x + 0.2, y + 0.7, w - 0.4, 1.85, { color: i === 3 ? PUTIH : ARANG, fontFace: FB, paraSpaceAfter: 4 });
  });
  teks(s, akhiri([
    p(`Cek terhadap kenyataan: tebu masuk aktual hari ke-161 (28 Okt 2025) = ${id(C1.aktual)} ton.`, { bold: true }),
    p(`Galat ε₁₆₁ = ${id(C1.aktual)} − ${id(C1.yhat)} = ${sgn(C1.galat)} ton;  APE = |galat| ÷ aktual × 100% = ${id(C1.ape)}%.  Galat ini lalu dipakai untuk meramal hari ke-162.`),
  ]), MX, 5.45, W - 2 * MX, 1.3, { fontSize: 15 });
  s.addNotes(`Langkah keenam: meramal. Kita hitung ramalan hari ke-161 dengan tangan. Bahannya: rata-rata ${id(mu, 2)}, φ ${id(phi, 4)}, θ ${id(theta, 4)}, pasokan hari ke-160 ${id(C1.y_t, 2)} ton, dan galat ramalan hari ke-160 ${id(C1.eps_t, 2)} ton. Suku AR: hari ke-160 berada ${id(C1.y_t - mu, 2)} ton di atas rata-rata, dikali φ jadi ${sgn(C1.suku_ar, 2)}. Suku MA: galat kemarin dikali θ jadi ${sgn(C1.suku_ma, 2)}. Dijumlahkan dengan rata-rata, ramalannya ${id(C1.yhat, 2)} ton. Kenyataannya masuk ${id(C1.aktual, 2)} ton, jadi galatnya ${sgn(C1.galat, 2)} ton atau ${id(C1.ape, 1)} persen. Galat ini tidak dibuang, tetapi dipakai sebagai εₜ untuk meramal hari berikutnya.`);
}

// ======================= 16. TABEL ROLLING =======================
{
  const s = slideIsi("Diulang setiap hari: peramalan bergulir (rolling) H+1", { langkah: 6, bagian: "Perhitungan", sumber: "Parameter μ, φ, θ tetap dari data latih; yang berubah setiap hari hanya Yₜ dan εₜ." });
  const rows = [["Hari target", "Yₜ kemarin", "εₜ kemarin", "Suku AR", "Suku MA", "Ramalan Ŷ", "Aktual", "Galat", "APE"]];
  H.contoh_hitung_tangan.forEach((c) => rows.push([`${c.hari_target} (${c.tanggal.slice(5)})`, id(c.y_t), sgn(c.eps_t), sgn(c.suku_ar), sgn(c.suku_ma), { text: id(c.yhat), options: { bold: true, color: HIJAU } }, id(c.aktual), sgn(c.galat), id(c.ape) + "%"]));
  tabel(s, rows, MX, 1.4, W - 2 * MX, [1.45, 1.3, 1.2, 1.1, 1.1, 1.4, 1.3, 1.2, 1.08], { fs: 13, rowH: 0.48 });
  const siklus = ["Pagi: catat tebu masuk aktual hari t", "Hitung galat εₜ = aktual − ramalan", "Masukkan ke rumus → ramalan hari t+1", "Esok hari: ulangi"];
  siklus.forEach((t, i) => {
    const x = MX + i * 3.08, y = 4.65;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 2.75, h: 1.2, fill: { color: i === 2 ? KREM_EMAS : MUDA }, line: { color: i === 2 ? EMAS : DAUN }, rectRadius: 0.08 });
    s.addText(t, { x: x + 0.1, y, w: 2.55, h: 1.2, fontFace: FB, fontSize: 13.5, bold: true, color: HIJAU, align: "center", valign: "middle", margin: 0, isTextBox: true });
    if (i < siklus.length - 1) s.addShape(pres.shapes.LINE, { x: x + 2.78, y: y + 0.6, w: 0.28, h: 0, line: { color: ABU, width: 1.5, endArrowType: "triangle" } });
  });
  teks(s, `Proses ini dijalankan untuk seluruh ${H.n_uji} hari data uji (hari ${H.n_latih + 1}–${D.n_hari}) sehingga setiap ramalan hanya memakai informasi yang sudah tersedia pada hari sebelumnya.`, MX, 6.1, W - 2 * MX, 0.8, { fontSize: 14 });
  s.addNotes("Perhitungan yang sama diulang setiap hari. Tabel ini menunjukkan lima hari pertama data uji. Perhatikan bahwa kolom Yₜ kemarin dan εₜ kemarin untuk hari 162 adalah aktual dan galat hari 161. Parameter model tidak diubah; yang berubah hanya data terbaru. Dalam praktik, siklusnya: catat tebu masuk hari ini, hitung galatnya, masukkan ke rumus, dapat ramalan besok. Proses ini dijalankan untuk ke-41 hari data uji.");
}

// ======================= 17. EVALUASI =======================
{
  const s = slideIsi("Hasil: ramalan ARIMA dibanding kenyataan selama 41 hari", { langkah: 7, bagian: "Hasil", sumber: "MAE = rata-rata |galat|; RMSE = √(Σgalat²/n); SEE = √(Σgalat²/(n − k)); MAPE = rata-rata |galat| ÷ aktual × 100%. Naive: besok = hari ini (k = 0)." });
  const hG = 5.6, wG = hG / R("05_ramalan_vs_aktual_2panel.png");
  s.addImage({ path: G("05_ramalan_vs_aktual_2panel.png"), x: MX + (8.2 - wG) / 2, y: 1.3, w: wG, h: hG });
  tabel(s, [["Metrik", "ARIMA(1,0,1)", "Naive"],
    ["MAE (ton)", { text: id(EA.mae), options: { bold: true, color: HIJAU } }, id(EN.mae)],
    ["RMSE (ton)", { text: id(EA.rmse), options: { bold: true, color: HIJAU } }, id(EN.rmse)],
    ["SEE (ton)", { text: id(SEE["ARIMA(1,0,1)"]), options: { bold: true, color: HIJAU } }, id(SEE.Naive)],
    ["MAPE (%)", { text: id(EA.mape), options: { bold: true, color: HIJAU } }, id(EN.mape)]],
    9.0, 1.35, 3.75, [1.3, 1.35, 1.1], { fs: 14, rowH: 0.44 });
  teks(s, akhiri([
    b(`Rata-rata meleset ±${id(EA.mae, 0)} ton/hari (MAPE ${id(EA.mape, 1)}%).`),
    b(`RMSE ${id(persenTurunRmse, 1)}% lebih kecil dari Naive; unggul di semua metrik, tetapi tipis.`),
    b("Galat terbesar: anjlok hari 169 dan penutupan musim (201)."),
  ]), 9.0, 3.75, 3.75, 1.65, { fontSize: 13, paraSpaceAfter: 3 });
  istilah(s, [["Interval 95%", `area hijau; rentang yang diperkirakan memuat aktual dengan peluang 95%. Nyatanya ${id(H.cakupan_interval95_persen, 0)}% hari masuk.`], ["SEE", "seperti RMSE, tetapi dibagi (n − k); k = 3 parameter ARIMA"]], 9.0, 5.45, 3.75, 1.5);
  s.addNotes(`Langkah terakhir: evaluasi. Panel atas membandingkan kenyataan, garis hitam, dengan ramalan ARIMA beserta interval 95 persen. Panel bawah membandingkan kenyataan dengan Naive, yaitu anggapan besok sama dengan hari ini; terlihat ramalan Naive selalu tertinggal satu hari. Rata-rata ramalan ARIMA meleset sekitar ${id(EA.mae, 0)} ton per hari atau ${id(EA.mape, 1)} persen. Dibanding Naive, RMSE turun ${id(persenTurunRmse, 1)} persen. SEE, yaitu RMSE yang dikoreksi jumlah parameter model, juga lebih kecil: ${id(SEE["ARIMA(1,0,1)"], 0)} berbanding ${id(SEE.Naive, 0)} ton. Jadi ARIMA memang lebih baik, tetapi tidak jauh. Perhatikan juga kesalahan terbesar: hari 169 pasokan anjlok ke 888 ton padahal diramal 2.654 ton; lalu karena model memakai data kemarin, ramalan hari 170 ikut turun padahal pasokan sudah pulih sehingga galatnya berantai sampai hari 171. Hari terakhir musim juga meleset besar. Kejadian seperti itu tidak bisa ditebak dari pola harian saja. Area hijau adalah interval 95 persen; ${id(H.cakupan_interval95_persen, 0)} persen data aktual masuk ke dalamnya, sedikit di bawah 95 persen karena residual tidak normal.`);
}

// ======================= 17b. IMPLIKASI =======================
{
  const s = slideIsi("Implikasi bagi kuota SPT dan antrean emplasemen", { bagian: "Hasil", sumber: "Sumber: Kurniawan & Purwono (2018); Purnomo & Supartiningrum (2025); Solomon (2009); Muhtadi et al. (2024). Laju giling = 2.864 TCD ÷ 24 jam." });
  const laju = 2864 / 24;
  const kartuImp = [
    ["Kuota SPT harian", "H+1 vs 2.864", "Setiap sore, ramalan esok dibandingkan dengan kapasitas acuan. Jika jauh di bawah, kuota tebang dinaikkan; jika jauh di atas, kuota ditahan agar antrean tidak memanjang."],
    ["Persediaan penyangga", "600–1.200 ton", `Setara 5–10 jam giling (±${id(laju, 0)} ton/jam). Galat ramalan (RMSE ≈ ${id(EA.rmse, 0)} ton ≈ ${id(EA.rmse / laju, 0)} jam giling) diperhitungkan sebagai cadangan.`],
    ["Perlindungan rendemen", "FIFO", "Antrean yang tertib dan waktu tunggu yang pendek menekan inversi sukrosa dan pembentukan dekstran pada tebu yang menunggu."],
  ];
  kartuImp.forEach((k, i) => {
    const x = MX + i * 4.1, y = 1.4, w = 3.85;
    kartu(s, x, y, w, 4.1, i === 1 ? KREM_EMAS : MUDA);
    s.addText(k[0], { x: x + 0.25, y: y + 0.2, w: w - 0.5, h: 0.45, fontFace: FJ, fontSize: 18, bold: true, color: HIJAU, margin: 0, isTextBox: true });
    s.addText(k[1], { x: x + 0.25, y: y + 0.75, w: w - 0.5, h: 0.85, fontFace: FJ, fontSize: 34, bold: true, color: i === 1 ? EMAS : HIJAU, margin: 0, valign: "middle", isTextBox: true });
    teks(s, k[2], x + 0.25, y + 1.75, w - 0.5, 2.25, { fontSize: 17.5 });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: MX, y: 5.75, w: W - 2 * MX, h: 1.05, fill: { color: HIJAU }, line: { color: HIJAU }, rectRadius: 0.08 });
  teks(s, [
    { text: "Ramalan adalah acuan awal, bukan satu-satunya dasar. ", options: { bold: true, color: EMAS } },
    { text: "Keputusan tetap memadukan informasi lapangan: rencana tebang, cuaca, dan ketersediaan armada.", options: { color: PUTIH } },
  ], MX + 0.3, 5.75, W - 2 * MX - 0.6, 1.05, { fontSize: 17, valign: "middle" });
  s.addNotes(`Lalu apa artinya bagi pabrik? Pertama, kuota surat perintah tebang: setiap sore ramalan esok dibandingkan dengan kapasitas 2.864 ton. Kalau jauh di bawah, kuota tebang bisa dinaikkan; kalau jauh di atas, ditahan supaya antrean tidak menumpuk. Kedua, persediaan penyangga di emplasemen: sekitar 600 sampai 1.200 ton, atau 5 sampai 10 jam giling, cukup untuk menjaga giling malam hari. Karena ramalan bisa meleset sekitar ${id(EA.rmse, 0)} ton, atau kira-kira 4 jam giling, selisih itu perlu disiapkan sebagai cadangan. Ketiga, antrean yang tertib dan waktu tunggu yang pendek melindungi rendemen. Angka 600 sampai 1.200 ton ini contoh hitungan dari kapasitas, bukan kebijakan pabrik. Ramalan ini acuan awal; keputusan tetap perlu informasi lapangan.`);
}

// ======================= 18. KESIMPULAN =======================
{
  const s = pres.addSlide(); nomor += 1;
  s.background = { color: HIJAU };
  s.addText("Kesimpulan", { x: MX, y: 0.4, w: 8, h: 0.8, fontFace: FJ, fontSize: 32, bold: true, color: PUTIH, margin: 0, isTextBox: true });
  s.addText(String(nomor), { x: W - MX - 0.5, y: 0.08, w: 0.5, h: 0.25, fontFace: FB, fontSize: 9, color: "D8E6D2", align: "right", margin: 0, isTextBox: true });
  const poin = [
    ["Model yang sesuai", `ARIMA(1,0,1) tanpa differencing karena data latih stasioner: AIC terendah (${id(M.aic, 2)}), seluruh koefisien signifikan, residual white noise, meskipun tidak berdistribusi normal.`, `Ŷₜ₊₁ = ${id(mu, 0)} + ${id(phi, 3)} (Yₜ − ${id(mu, 0)}) + ${id(theta, 3)} εₜ`],
    ["Akurasi H+1", `Pada 41 hari uji, ARIMA lebih akurat daripada Naive: RMSE ${id(EA.rmse, 0)} vs ${id(EN.rmse, 0)} ton; MAPE ${id(EA.mape, 1)}% vs ${id(EN.mape, 1)}%. Keunggulannya moderat, terutama berupa pengurangan galat besar.`, null],
    ["Implikasi", `Ramalan H+1 dapat menjadi masukan penyesuaian kuota SPT dan persediaan penyangga emplasemen, dengan memperhitungkan galat sekitar ${id(Math.round(EA.rmse / 100) * 100, 0)} ton/hari.`, null],
  ];
  poin.forEach((k, i) => {
    const y = 1.5 + i * 1.95;
    s.addShape(pres.shapes.OVAL, { x: MX, y: y + 0.05, w: 0.7, h: 0.7, fill: { color: EMAS }, line: { color: EMAS } });
    s.addText(String(i + 1), { x: MX, y: y + 0.05, w: 0.7, h: 0.7, fontFace: FJ, fontSize: 22, bold: true, color: HIJAU, align: "center", valign: "middle", margin: 0, isTextBox: true });
    const isi = [
      { text: k[0], options: { bold: true, color: EMAS, fontSize: 20, breakLine: true } },
      { text: k[1], options: { color: PUTIH, breakLine: !!k[2] } },
    ];
    if (k[2]) isi.push({ text: k[2], options: { color: "D8E6D2", fontFace: FJ, bold: true } });
    teks(s, isi, MX + 1.0, y, W - 2 * MX - 1.0, 1.85, { fontSize: 18.5, paraSpaceAfter: 4 });
  });
  s.addNotes(`Kesimpulannya mengikuti tiga rumusan masalah tadi. Pertama, model yang sesuai adalah ARIMA(1,0,1) tanpa differencing, karena datanya sudah stasioner; ramalannya bisa dihitung tangan dari pasokan dan galat hari ini. Kedua, pada 41 hari uji ARIMA lebih akurat daripada Naive, tetapi keunggulannya moderat. Ketiga, ramalan ini bisa dipakai sebagai masukan kuota SPT dan persediaan penyangga, dengan memperhitungkan galat sekitar 500 ton per hari. Keterbatasannya: hanya satu musim giling dan satu variabel, kejadian mendadak tidak bisa diramal dari pola harian, dan acuan 2.864 TCD berasal dari berita, bukan data teknis pabrik.`);
}

// ======================= 18b. SARAN =======================
{
  const s = slideIsi("Saran pengembangan", { bagian: "Penutup" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: MX, y: 1.4, w: 5.6, h: 5.4, fill: { color: HIJAU }, line: { color: HIJAU }, rectRadius: 0.08 });
  teks(s, [
    { text: "1  Horizon yang lebih panjang", options: { bold: true, color: EMAS, fontSize: 22, breakLine: true } },
    { text: "H+7 sampai H+30", options: { bold: true, color: PUTIH, fontFace: FJ, fontSize: 34, breakLine: true } },
    { text: "H+1 hanya memberi waktu satu hari untuk bertindak sehingga terbatas pada keputusan operasional harian. Ramalan mingguan sampai bulanan memungkinkan keputusan taktis dan strategis, seperti penjadwalan tebang, penyiapan armada angkut, dan perencanaan kapasitas giling, diambil jauh-jauh hari.", options: { color: PUTIH } },
  ], MX + 0.35, 1.65, 4.9, 5.0, { fontSize: 18.5, paraSpaceAfter: 12 });
  const lain = [
    ["2  Variabel luar (ARIMAX)", "Tambahkan curah hujan, hari libur, dan jumlah armada untuk menangkap penyebab perubahan mendadak."],
    ["3  Data beberapa musim", "Estimasi ulang parameter tiap musim dan uji beda akurasi dengan uji Diebold–Mariano."],
    ["4  Bandingkan dengan ML", "XGBoost atau CatBoost pada data yang sama, dengan Naive tetap sebagai tolok ukur minimum."],
    ["5  Integrasi ke pos timbang", "Hitung ramalan otomatis setiap hari sebagai rekomendasi kuota SPT."],
  ];
  lain.forEach((k, i) => {
    const x = 6.5 + (i % 2) * 3.17, y = 1.4 + Math.floor(i / 2) * 2.75, w = 3.0;
    kartu(s, x, y, w, 2.6, i % 3 === 0 ? MUDA : KREM_EMAS);
    s.addText(k[0], { x: x + 0.2, y: y + 0.2, w: w - 0.4, h: 0.65, fontFace: FJ, fontSize: 17, bold: true, color: HIJAU, valign: "top", margin: 0, isTextBox: true });
    teks(s, k[1], x + 0.2, y + 0.9, w - 0.4, 1.6, { fontSize: 16 });
  });
  s.addNotes("Ada lima saran. Yang paling penting yang pertama: horizon yang lebih panjang. H+1 hanya memberi waktu satu hari, jadi cuma cukup untuk keputusan operasional. Kalau bisa meramal satu minggu sampai satu bulan ke depan, pabrik bisa menyiapkan jadwal tebang, armada, dan kapasitas giling jauh-jauh hari. Saran lainnya: menambah variabel luar seperti hujan dan armada, memakai data beberapa musim, membandingkan dengan machine learning, dan mengintegrasikan ramalan ke sistem pos timbang. Terima kasih, saya persilakan pertanyaan.");
}

// ======================= 19. DAFTAR PUSTAKA =======================
{
  const s = slideIsi("Daftar pustaka", { bagian: "Referensi" });
  const ref = [
    "Akaike, H. (1974). A new look at the statistical model identification. IEEE Transactions on Automatic Control, 19(6), 716–723.",
    "Al Khatib, A. M. G., Alshaib, B. M., Mishra, P., Tiwari, S., Alshalaby, M. A., & Kumari, B. (2026). Forecasting tomato production in major Asian producers: A comparative study of ARIMA, exponential smoothing, score-driven models, and XGBoost. Scientific Reports, 16, 15722.",
    "Bantacut, T., Sukardi, & Supatma, I. A. (2012). Kehilangan sukrosa dalam sistem tebang muat angkut di Pabrik Gula Sindang Laut dan Tersana Baru Cirebon. Jurnal Teknologi Industri Pertanian, 22(2), 115–121.",
    "Box, G. E. P., & Jenkins, G. M. (1970). Time series analysis: Forecasting and control. Holden-Day.",
    "Box, G. E. P., Jenkins, G. M., Reinsel, G. C., & Ljung, G. M. (2015). Time series analysis: Forecasting and control (5th ed.). Wiley.",
    "detikJatim. (2026, 9 Mei). Tradisi manten tebu tandai buka giling PG Mojopanggung, segini targetnya. detik.com.",
    "Dickey, D. A., & Fuller, W. A. (1979). Distribution of the estimators for autoregressive time series with a unit root. Journal of the American Statistical Association, 74(366a), 427–431.",
    "Harlianingtyas, I., Salim, A., Hartatie, D., & Supriyadi. (2020). Forecasting sugarcane production in the Asembagus sugar factory. IOP Conf. Series: Earth and Environmental Science, 411, 012022.",
    "Heizer, J., Render, B., & Munson, C. (2020). Operations management: Sustainability and supply chain management (13th ed.). Pearson.",
    "Hyndman, R. J., & Athanasopoulos, G. (2021). Forecasting: Principles and practice (3rd ed.). OTexts.",
    "Jarque, C. M., & Bera, A. K. (1987). A test for normality of observations and regression residuals. International Statistical Review, 55(2), 163–172.",
    "Kwiatkowski, D., Phillips, P. C. B., Schmidt, P., & Shin, Y. (1992). Testing the null hypothesis of stationarity against the alternative of a unit root. Journal of Econometrics, 54, 159–178.",
    "Ljung, G. M., & Box, G. E. P. (1978). On a measure of lack of fit in time series models. Biometrika, 65(2), 297–303.",
    "Kurniawan, I. E., & Purwono. (2018). Tebang, muat dan angkut di wilayah PG Madukismo, Yogyakarta. Buletin Agrohorti, 6(3), 354–361.",
    "Makridakis, S., Wheelwright, S. C., & Hyndman, R. J. (1998). Forecasting: Methods and applications (3rd ed.). Wiley.",
    "Muhtadi, M. M., Sitawati, S., & Suryanto, A. (2024). Effect of sugarcane varieties and milling delay time on cane sugar yield. Jurnal Teknik Pertanian Lampung, 13(2), 506–511.",
    "Peraturan Presiden Nomor 40 Tahun 2023 tentang Percepatan Swasembada Gula Nasional dan Penyediaan Bioetanol sebagai Bahan Bakar Nabati (Biofuel).",
    "Purnomo, B. H., & Supartiningrum, L. (2025). Enhancing sugarcane harvest and load scheduling efficiency: A linear programming approach in East Java, Indonesia. Agrointek, 19(2), 491–499.",
    "Pusdatin Kementan. (2025). Outlook tebu 2025. Pusat Data dan Sistem Informasi Pertanian, Kementerian Pertanian.",
    "PT Sinergi Gula Nusantara. (t.t.). Profil perusahaan. sinergigula.com.",
    "Radar Tulungagung. (2023, 22 Mei). Persediaan tebu aman, PG Modjopanggoong siap masuk musim giling. jawapos.com.",
    "Schwarz, G. (1978). Estimating the dimension of a model. The Annals of Statistics, 6(2), 461–464.",
    "Solomon, S. (2009). Post-harvest deterioration of sugarcane. Sugar Tech, 11(2), 109–123.",
    "Suresh, K. K., & Krishna Priya, S. R. (2011). Forecasting sugarcane yield of Tamilnadu using ARIMA models. Sugar Tech, 13(1), 23–26.",
  ];
  const kiri = ref.slice(0, 11), kanan = ref.slice(11);
  [kiri, kanan].forEach((arr, i) => {
    teks(s, akhiri(arr.map((r) => p(r, { indentLevel: 0 }))), MX + i * 6.2, 1.35, 5.95, 5.6, { fontSize: 10.5, paraSpaceAfter: 3, color: ARANG });
  });
  s.addNotes("Seluruh rujukan sudah diperiksa keberadaannya melalui Crossref, laman jurnal, atau laman resmi penerbitnya.");
}

// ======================= CADANGAN =======================
{
  const s = slideIsi("Cadangan A: rumus metrik evaluasi (termasuk SEE)", { bagian: "Cadangan" });
  const r = [
    ["MAE", "MAE = (1/n) Σ |Yₜ − Ŷₜ|", "Rata-rata besar kesalahan, dalam ton. Mudah dibaca."],
    ["MSE", "MSE = (1/n) Σ (Yₜ − Ŷₜ)²", "Rata-rata kuadrat kesalahan; kesalahan besar dihukum lebih berat."],
    ["RMSE", "RMSE = √(Σ(Yₜ − Ŷₜ)² / n)", "MSE dikembalikan ke satuan ton."],
    ["SEE", "SEE = √(Σ(Yₜ − Ŷₜ)² / (n − k))", `Standard error of estimate; pembagi dikurangi k parameter. ARIMA k = 3: SEE ${id(SEE["ARIMA(1,0,1)"])} ton; Naive k = 0: SEE = RMSE. Di data latih setara σ ≈ ${id(SEE.see_latih_sigma, 1)} ton.`],
    ["MAPE", "MAPE = (100%/n) Σ |Yₜ − Ŷₜ| ÷ Yₜ", "Kesalahan relatif dalam persen; tidak bisa dipakai bila ada Yₜ = 0 (tidak ada di data uji)."],
  ];
  r.forEach((x, i) => {
    const y = 1.35 + i * 1.08;
    kartu(s, MX, y, W - 2 * MX, 0.95, i % 2 ? PUTIH : MUDA);
    s.addText(x[0], { x: MX + 0.3, y, w: 1.3, h: 0.95, fontFace: FJ, fontSize: 22, bold: true, color: HIJAU, valign: "middle", margin: 0, isTextBox: true });
    s.addText(x[1], { x: MX + 1.7, y, w: 5.2, h: 0.95, fontFace: FJ, fontSize: 17, color: ARANG, valign: "middle", margin: 0, isTextBox: true });
    teks(s, x[2], MX + 7.1, y + 0.05, 4.9, 0.85, { fontSize: 13, valign: "middle" });
  });
  s.addText(`Nilai MSE: ARIMA ${id(EA.mse, 0)}; Naive ${id(EN.mse, 0)} (ton²).`, { x: MX, y: 6.8, w: 12, h: 0.3, fontFace: FB, fontSize: 11, color: ABU, margin: 0, isTextBox: true });
  s.addNotes("Slide cadangan untuk menjawab pertanyaan tentang rumus metrik.");
}
{
  const Et = H.evaluasi_tanpa_hari_akhir;
  const s = slideIsi("Cadangan B: galat harian ARIMA dan Naive", { bagian: "Cadangan", sumber: "Galat = aktual − ramalan. Batang di atas nol: ramalan terlalu rendah; di bawah nol: terlalu tinggi." });
  s.addImage({ path: G("06_galat_harian.png"), x: MX, y: 1.4, w: 12.1, h: 12.1 * R("06_galat_harian.png") });
  teks(s, `Tanpa hari ke-201 (hari penutupan musim): MAPE ARIMA ${id(Et["ARIMA(1,0,1)"].mape)}% vs Naive ${id(Et.Naive.mape)}%; RMSE ${id(Et["ARIMA(1,0,1)"].rmse)} vs ${id(Et.Naive.rmse)} ton. Urutan kedua metode tidak berubah.`, MX, 1.4 + 12.1 * R("06_galat_harian.png") + 0.3, W - 2 * MX, 0.9, { fontSize: 15 });
  s.addNotes("Slide cadangan bila ditanya hari mana yang paling salah dan apakah hari terakhir musim memengaruhi hasil.");
}
{
  const s = slideIsi("Cadangan C: detail estimasi ARIMA(1,0,1)", { bagian: "Cadangan", sumber: "Estimasi maximum likelihood (statsmodels ARIMA, trend = konstanta) pada 160 hari data latih." });
  const nm = { const: "μ (konstanta/rata-rata)", "ar.L1": "φ₁ (AR lag 1)", "ma.L1": "θ₁ (MA lag 1)", sigma2: "σ² (ragam galat)" };
  const rows = [["Parameter", "Estimasi", "Galat baku", "z", "p-value"]];
  Object.keys(nm).forEach((k) => {
    const est = M.params[k], se = M.se[k];
    rows.push([nm[k], id(est, k === "sigma2" ? 0 : 4), id(se, k === "sigma2" ? 0 : 4), id(est / se, 2), M.pvalues[k] < 0.001 ? "< 0,001" : id(M.pvalues[k], 4)]);
  });
  tabel(s, rows, MX, 1.5, 9, [3.0, 1.6, 1.6, 1.2, 1.6], { fs: 14, rowH: 0.5 });
  teks(s, `AIC = ${id(M.aic, 2)};  BIC = ${id(M.bic, 2)}.  Syarat kestabilan terpenuhi: |φ₁| < 1 dan |θ₁| < 1.`, MX, 4.3, 12, 0.5, { fontSize: 15 });
  s.addNotes("Slide cadangan untuk pertanyaan tentang signifikansi koefisien.");
}

pres.writeFile({ fileName: path.join(DIR, "Presentasi_ARIMA_Pasokan_Tebu_PG_Modjopanggoong.pptx") })
  .then((f) => console.log("Tersimpan:", f));
