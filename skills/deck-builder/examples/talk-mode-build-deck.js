// Build "Viability First" deck (IBC 2026 webinar) with pptxgenjs.
// Inputs: photos in ASSETS, script markdown for speaker notes. Output: OUT.
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");
const { applyTheme } = require("/mnt/skills/public/pptx/scripts/apply_theme.js");

const ASSETS = "/home/claude/ibc/assets";
const SCRIPT = "/mnt/user-data/outputs/docs/04-naskah-presentasi-en.md";
const OUT = process.argv[2] || "viability-first-ibc2026.pptx";

for (const f of ["rice_terraces.jpg", "oil_palm.jpg", "catfish.jpg", "lab_rotavap.jpg", "onions.jpg",
  "farmers.jpg", "soap.jpg", "logo_ub.png", "logo-abc-removebg-preview.png", "bioplastic.jpg",
  "seedling.jpg", "stall.jpg", "logo-abc-trim.png", "team.jpg", "product/haruka_4.png", "product/haruka_9.png",
  "product/kuroki_fig1_setup.jpg", "product/kuroki_fig3_rotlevels.jpg"]) {
  if (!fs.existsSync(path.join(ASSETS, f))) throw new Error(`Missing asset: ${f}`);
}

const HEX = {
  ink: "1C2B24", ink2: "2E3B35", white: "FFFFFF", tint: "F1F5F2", muted: "6B7A72",
  green: "2E7D32", blue: "1565C0", orange: "D9661F", purple: "6A3FA0", grey: "8A9A91", gold: "C9A227",
};
const THEME = {
  name: "Viability First",
  headFontFace: "Arial",
  bodyFontFace: "Calibri",
  colors: {
    dk1: HEX.ink, lt1: HEX.white, dk2: HEX.ink2, lt2: HEX.tint,
    accent1: HEX.green, accent2: HEX.blue, accent3: HEX.orange, accent4: HEX.purple,
    accent5: HEX.grey, accent6: HEX.gold, hlink: HEX.blue, folHlink: HEX.purple,
  },
};

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10 x 5.625 in
pres.author = "Ade Surya Ananda";
pres.title = "Viability First: An Agroindustrial Reality Check for Young Founders";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const SEC = { 1: C.accent1, 2: C.accent2, 3: C.accent3, 4: C.accent4 };

// ---------- speaker notes from the sample script ----------
const notesBySlide = (() => {
  const md = fs.readFileSync(SCRIPT, "utf8").split("## Rehearsal Checklist")[0];
  const parts = md.split(/`\[SLIDE (\d+)\]`(?:\s*\*\([^)]*\)\*)?/);
  const map = {};
  for (let i = 1; i < parts.length; i += 2) {
    map[+parts[i]] = parts[i + 1]
      .replace(/\n---\n[\s\S]*$/m, "")
      .replace(/^## .*$/gm, "")
      .replace(/\*\*\[KEY\]\*\*/g, "[KEY]")
      .replace(/\*\*/g, "").replace(/\*/g, "")
      .replace(/\n{3,}/g, "\n\n").trim();
  }
  return map;
})();

// ---------- icons ----------
const iconCache = {};
async function icon(name, color) {
  const key = name + color;
  if (!iconCache[key]) {
    const svg = ReactDOMServer.renderToStaticMarkup(
      React.createElement(fa[name], { color: "#" + color, size: 256 }));
    const buf = await sharp(Buffer.from(svg)).resize(256, 256).png().toBuffer();
    iconCache[key] = "image/png;base64," + buf.toString("base64");
  }
  return iconCache[key];
}

// ---------- layouts ----------
const FOOT = { x: 0.5, y: 5.22, w: 6, h: 0.25, fontSize: 9, color: C.accent5, margin: 0 };
pres.defineSlideMaster({
  title: "CONTENT",
  background: { color: HEX.white },
  objects: [
    { text: { text: "Viability First  ·  IBC 2026", options: { ...FOOT } } },
    { placeholder: { options: { name: "title", type: "title", x: 1.12, y: 0.32, w: 8.38, h: 0.7,
      fontFace: "Arial", fontSize: 28, bold: true, color: C.text1, valign: "middle", align: "left", margin: 0 }, text: "" } },
  ],
  slideNumber: { x: 9.0, y: 5.2, w: 0.5, h: 0.28, fontSize: 9, color: C.accent5, align: "right" },
});
pres.defineSlideMaster({
  title: "CONTENT_PLAIN",
  background: { color: HEX.white },
  objects: [
    { text: { text: "Viability First  ·  IBC 2026", options: { ...FOOT } } },
    { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.32, w: 8.8, h: 0.7,
      fontFace: "Arial", fontSize: 28, bold: true, color: C.text1, valign: "middle", align: "left", margin: 0 }, text: "" } },
  ],
  slideNumber: { x: 9.0, y: 5.2, w: 0.5, h: 0.28, fontSize: 9, color: C.accent5, align: "right" },
});
pres.defineSlideMaster({
  title: "STATEMENT",
  background: { color: HEX.tint },
  objects: [{ text: { text: "Viability First  ·  IBC 2026", options: { ...FOOT } } }],
  slideNumber: { x: 9.0, y: 5.2, w: 0.5, h: 0.28, fontSize: 9, color: C.accent5, align: "right" },
});
pres.defineSlideMaster({ title: "PHOTO_DARK", background: { color: HEX.ink } });

// ---------- helpers ----------
let sectionTitle = "Opening";
function section(title) { sectionTitle = title; pres.addSection({ title }); }
function addSlide(master, n) {
  const s = pres.addSlide({ masterName: master, sectionTitle });
  if (notesBySlide[n]) s.addNotes(notesBySlide[n]);
  return s;
}
async function iconCircle(s, x, y, d, name, fill, iconColor = HEX.white, label) {
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill, width: 0 },
    objectName: label ? `${label} circle` : undefined });
  const p = d * 0.26;
  s.addImage({ data: await icon(name, iconColor), x: x + p, y: y + p, w: d - 2 * p, h: d - 2 * p });
}
function kicker(s, part) { // numbered circle before the title: deck motif
  s.addShape(pres.shapes.OVAL, { x: 0.45, y: 0.4, w: 0.54, h: 0.54, fill: { color: SEC[part] }, line: { color: SEC[part], width: 0 } });
  s.addText(String(part), { x: 0.45, y: 0.4, w: 0.54, h: 0.54, fontSize: 18, bold: true, color: C.background1,
    align: "center", valign: "middle", margin: 0, isTextBox: true, fontFace: "Arial" });
}
function content(n, part, title) {
  const s = addSlide(part ? "CONTENT" : "CONTENT_PLAIN", n);
  if (part) kicker(s, part);
  s.addText(title, { placeholder: "title" });
  return s;
}
function text(s, t, o) { s.addText(t, { isTextBox: true, margin: 0, fontSize: 16, color: C.text1, valign: "top", ...o }); }
function credit(s, t, o = {}) {
  text(s, t, { x: 0.5, y: 4.92, w: 6.5, h: 0.22, fontSize: 9, color: C.accent5, italic: true, ...o });
}
function card(s, x, y, w, h, fill = HEX.tint) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: fill }, line: { color: fill, width: 0 } });
}
async function statement(n, part, big, small, iconName) {
  const s = addSlide("STATEMENT", n);
  const col = part ? SEC[part] : C.text1;
  const colHex = part ? [null, HEX.green, HEX.blue, HEX.orange, HEX.purple][part] : HEX.ink;
  if (iconName) await iconCircle(s, 4.55, 0.75, 0.9, iconName, colHex);
  text(s, big, { x: 0.8, y: iconName ? 1.85 : 1.4, w: 8.4, h: 1.6, fontSize: 34, bold: true, fontFace: "Arial",
    align: "center", valign: "middle", color: col });
  if (small) text(s, small, { x: 1.2, y: 3.55, w: 7.6, h: 0.9, fontSize: 18, align: "center", color: C.text2 });
  return s;
}
const img = (f) => path.join(ASSETS, f);
const has = (f) => fs.existsSync(img(f));
// Crop to the exact box aspect before inserting, so nothing is ever stretched.
async function photo(s, file, x, y, w, h, position = "centre") {
  const px = Math.round(Math.min(2400, w * 220)), py = Math.round((px * h) / w);
  const buf = await sharp(file).resize(px, py, { fit: "cover", position }).jpeg({ quality: 86 }).toBuffer();
  s.addImage({ data: "image/jpeg;base64," + buf.toString("base64"), x, y, w, h });
}
// Fit inside the box keeping aspect (for figures/logos that must not be cropped).
async function fitImage(s, file, x, y, w, h) {
  const m = await sharp(file).metadata();
  const r = Math.min(w / m.width, h / m.height), iw = m.width * r, ih = m.height * r;
  s.addImage({ path: file, x: x + (w - iw) / 2, y: y + (h - ih) / 2, w: iw, h: ih });
}
function line(s, x1, y1, x2, y2, o = {}) {
  s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.max(Math.abs(x2 - x1), 0.001),
    h: Math.max(Math.abs(y2 - y1), 0.001), flipV: (x2 - x1) * (y2 - y1) < 0,
    line: { color: o.color || HEX.grey, width: o.width || 1.5, dashType: o.dash, endArrowType: o.arrow, beginArrowType: o.both ? o.arrow : undefined } });
}
async function logos(s) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.0, y: 0.35, w: 2.6, h: 0.95, rectRadius: 0.1,
    fill: { color: HEX.white }, line: { color: HEX.white, width: 0 }, objectName: "Logo plate" });
  await fitImage(s, img("logo-abc-trim.png"), 7.12, 0.42, 1.3, 0.81);
  await fitImage(s, img("logo_ub.png"), 8.62, 0.42, 0.81, 0.81);
}

(async () => {
  // =================== OPENING ===================
  section("Opening");
  // 1 Title
  {
    const s = addSlide("PHOTO_DARK", 1);
    await photo(s, img("rice_terraces.jpg"), 0, 0, 10, 5.625);
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: "0E1A14", transparency: 30 }, line: { color: "0E1A14", width: 0 } });
    await logos(s);
    text(s, "Viability First", { x: 0.6, y: 1.75, w: 8.8, h: 1.0, fontSize: 48, bold: true, fontFace: "Arial", color: C.background1 });
    text(s, "An Agroindustrial Reality Check for Young Founders", { x: 0.6, y: 2.75, w: 8.8, h: 0.5, fontSize: 22, color: C.background1 });
    text(s, "Ade Surya Ananda  ·  IBC 2026 Webinar  ·  Agritechno Business Centre, FTAB Universitas Brawijaya",
      { x: 0.6, y: 3.6, w: 8.8, h: 0.4, fontSize: 13, color: C.background1 });
    credit(s, "Photo: Philip Nalangan / Wikimedia Commons, CC BY 4.0", { color: C.background2, y: 5.2 });
  }
  // 2 The question
  {
    const s = addSlide("STATEMENT", 2);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 3.85, y: 0.4, w: 2.3, h: 1.45, rectRadius: 0.08, fill: { color: HEX.ink2 }, line: { color: HEX.ink2, width: 0 }, objectName: "Laptop screen" });
    s.addShape(pres.shapes.RECTANGLE, { x: 3.97, y: 0.52, w: 2.06, h: 1.2, fill: { color: HEX.white }, line: { color: HEX.white, width: 0 } });
    s.addShape(pres.shapes.TRAPEZOID, { x: 3.5, y: 1.85, w: 3.0, h: 0.16, fill: { color: HEX.grey }, line: { color: HEX.grey, width: 0 }, objectName: "Laptop base" });
    s.addImage({ data: await icon("FaFolder", HEX.gold), x: 4.68, y: 0.72, w: 0.64, h: 0.64 });
    text(s, "business_plan_final_v7", { x: 3.97, y: 1.38, w: 2.06, h: 0.25, fontSize: 9, align: "center", color: C.accent5 });
    text(s, "Six months from now, will your business plan still exist outside a folder on your laptop?",
      { x: 1.0, y: 2.3, w: 8.0, h: 1.8, fontSize: 30, bold: true, fontFace: "Arial", align: "center", valign: "middle" });
  }
  // 3 Who I am
  {
    const s = content(3, 0, "Who I Am");
    await photo(s, img("foto-ade.jpeg"), 0.6, 1.35, 2.9, 3.4, "north");
    const rows = [
      ["FaGraduationCap", "Agroindustrial technology student, Universitas Brawijaya"],
      ["FaSeedling", "Building early-stage ventures"],
      ["FaQuoteLeft", "A report from inside the process, not a lecture from the top"],
    ];
    for (let i = 0; i < rows.length; i++) {
      const y = 1.5 + i * 1.08;
      await iconCircle(s, 4.0, y, 0.62, rows[i][0], HEX.ink2);
      text(s, rows[i][1], { x: 4.85, y: y - 0.04, w: 4.65, h: 0.72, fontSize: 18, valign: "middle",
        italic: i === 2, bold: i === 2 });
    }
  }
  // 4 Quiet assumption
  {
    const s = content(4, 0, "The Quiet Assumption");
    const chips = ["Value chain governance", "Circular entrepreneurship", "Food systems", "Human-centric transformation"];
    chips.forEach((t, i) => {
      const x = 0.6 + i * 2.22;
      card(s, x, 1.35, 2.06, 0.75);
      text(s, t, { x: x + 0.1, y: 1.35, w: 1.86, h: 0.75, fontSize: 14, align: "center", valign: "middle", color: C.text2 });
    });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 2.2, w: 8.8, h: 0.62, rectRadius: 0.08,
      fill: { color: HEX.green }, line: { color: HEX.green, width: 0 }, objectName: "Foundation: viable business" });
    text(s, "All four rest on one thing: the business survives", { x: 0.6, y: 2.2, w: 8.8, h: 0.62, fontSize: 18,
      bold: true, color: C.background1, align: "center", valign: "middle" });
    text(s, [
      { text: "Viability first.", options: { bold: true, color: C.accent1, breakLine: true } },
      { text: "ESG only becomes real when the business stays alive.", options: { bold: true } },
    ], { x: 0.6, y: 3.25, w: 8.8, h: 1.3, fontSize: 26, fontFace: "Arial", align: "center", valign: "middle" });
  }
  // 5 Roadmap
  {
    const s = content(5, 0, "Today's Roadmap");
    const items = [["The map is bigger than you think", "FaGlobe"], ["The lab trap & local context", "FaFlask"],
      ["Human-centric is economics", "FaUsers"], ["From competition to execution", "FaRocket"]];
    const hx = [HEX.green, HEX.blue, HEX.orange, HEX.purple];
    for (let i = 0; i < 4; i++) {
      const x = 0.6 + i * 2.22;
      card(s, x, 1.4, 2.06, 3.2);
      await iconCircle(s, x + 0.68, 1.7, 0.7, items[i][1], hx[i]);
      text(s, String(i + 1), { x, y: 2.55, w: 2.06, h: 0.6, fontSize: 30, bold: true, fontFace: "Arial", align: "center", color: SEC[i + 1] });
      text(s, items[i][0], { x: x + 0.15, y: 3.2, w: 1.76, h: 1.2, fontSize: 16, align: "center", color: C.text1 });
    }
  }

  // =================== PART 1 ===================
  section("Part 1: The Map");
  // 6 Beyond rice fields
  {
    const s = content(6, 1, "Beyond Rice Fields");
    await photo(s, img("rice_terraces.jpg"), 0.6, 1.3, 4.2, 2.75);
    await photo(s, img("oil_palm.jpg"), 4.95, 1.3, 2.15, 2.75);
    await photo(s, img("catfish.jpg"), 7.25, 1.3, 2.15, 2.75);
    text(s, "Plantations  ·  Livestock  ·  Fisheries & aquaculture  ·  Floriculture  ·  Industrial forestry",
      { x: 0.6, y: 4.2, w: 8.8, h: 0.45, fontSize: 17, bold: true, align: "center", color: C.accent1 });
    credit(s, "Photos (Wikimedia Commons): Philip Nalangan, CC BY 4.0; Kistara, CC0; W.A. Djatmiko, CC BY-SA 3.0", { w: 8.5 });
  }
  // 7 Beyond food
  {
    const s = content(7, 1, "Beyond Food");
    await photo(s, img("soap.jpg"), 0.6, 1.3, 3.6, 1.62);
    await photo(s, img("bioplastic.jpg"), 0.6, 3.05, 3.6, 1.65);
    const chips = ["Pharma excipients", "Cosmetic actives", "Soap", "Biosurfactants", "Oleochemicals", "Bioplastics"];
    chips.forEach((t, i) => {
      const x = 4.6 + (i % 2) * 2.45, y = 1.35 + Math.floor(i / 2) * 0.72;
      card(s, x, y, 2.3, 0.58);
      text(s, t, { x: x + 0.15, y, w: 2.0, h: 0.58, fontSize: 16, valign: "middle", bold: true, color: C.text2 });
    });
    text(s, "Circular economy doesn't have to end at cheap compost, if volume and quality are consistent.",
      { x: 4.6, y: 3.65, w: 4.8, h: 0.9, fontSize: 16, italic: true, color: C.accent1 });
    credit(s, "Photos (Wikimedia Commons): DimiTalen, CC0; Scott Bauer (USDA), public domain");
  }
  // 8 Beyond physical products
  {
    const s = content(8, 1, "Beyond Physical Products");
    const items = [["FaChalkboardTeacher", "Consulting"], ["FaSitemap", "Traceability as a service"],
      ["FaLaptopCode", "Farm & cold-chain software"], ["FaTools", "Machinery services"]];
    for (let i = 0; i < 4; i++) {
      const x = 0.6 + i * 2.22;
      card(s, x, 1.3, 2.06, 1.6);
      await iconCircle(s, x + 0.73, 1.45, 0.6, items[i][0], HEX.green);
      text(s, items[i][1], { x: x + 0.12, y: 2.1, w: 1.82, h: 0.7, fontSize: 15, bold: true, align: "center", valign: "middle" });
    }
    if (has("product/service_example_app.jpg") && has("product/service_example.jpg")) {
      await photo(s, img("product/service_example_app.jpg"), 0.6, 3.1, 2.45, 1.45);
      await photo(s, img("product/service_example.jpg"), 3.2, 3.1, 2.45, 1.45);
      text(s, "Traceability app (AGRIVI)", { x: 0.6, y: 4.58, w: 2.45, h: 0.28, fontSize: 11, italic: true, align: "center", color: C.text2 });
      text(s, "Sorting machine (TOMRA)", { x: 3.2, y: 4.58, w: 2.45, h: 0.28, fontSize: 11, italic: true, align: "center", color: C.text2 });
      credit(s, "Images: AGRIVI (agrivi.com); TOMRA (tomra.com)", { y: 4.95 });
    } else {
      text(s, "Capital needed to start (illustrative, not to scale)", { x: 0.6, y: 3.08, w: 4.6, h: 0.3, fontSize: 12, italic: true, color: C.accent5 });
      const bars = [["FaIndustry", "Factory", 3.3, HEX.grey], ["FaLaptopCode", "Service", 0.85, HEX.green]];
      for (let i = 0; i < 2; i++) {
        const y = 3.5 + i * 0.62;
        s.addImage({ data: await icon(bars[i][0], bars[i][3]), x: 0.6, y: y + 0.04, w: 0.38, h: 0.38 });
        s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.1, y, w: bars[i][2], h: 0.46, rectRadius: 0.06, fill: { color: bars[i][3] }, line: { color: bars[i][3], width: 0 }, objectName: bars[i][1] + " bar" });
        text(s, bars[i][1], { x: 1.1 + bars[i][2] + 0.12, y, w: 1.2, h: 0.46, fontSize: 14, bold: true, valign: "middle", color: i ? C.accent1 : C.text2 });
      }
    }
    text(s, "Services need far less capital than a factory", { x: 5.95, y: 3.2, w: 3.45, h: 1.3, fontSize: 22,
      bold: true, fontFace: "Arial", valign: "middle", color: C.accent1 });
  }
  // 9 Catfish case
  {
    const s = content(9, 1, "Case: A Catfish Business");
    await photo(s, img("catfish.jpg"), 0.6, 1.3, 3.6, 3.4);
    const steps = [["FaFish", "Live fish by the kg", HEX.grey], ["FaSkullCrossbones", "Mass fingerling death from disease", HEX.orange],
      ["FaUtensils", "Marinated catfish & rice bowls", HEX.green]];
    for (let i = 0; i < 3; i++) {
      const y = 1.3 + i * 0.95;
      await iconCircle(s, 4.6, y, 0.6, steps[i][0], steps[i][2]);
      text(s, steps[i][1], { x: 5.4, y, w: 4.0, h: 0.6, fontSize: 18, bold: true, valign: "middle" });
      if (i < 2) s.addImage({ data: await icon("FaArrowDown", HEX.grey), x: 4.8, y: y + 0.66, w: 0.2, h: 0.22 });
    }
    text(s, "Processing doesn't remove pond risk. It gives you breathing room.",
      { x: 4.6, y: 4.1, w: 4.8, h: 0.6, fontSize: 15, italic: true, color: C.accent1 });
    credit(s, "Photo: W.A. Djatmiko / Wikimedia Commons, CC BY-SA 3.0");
  }
  // 10 Transition
  {
    const s = addSlide("STATEMENT", 10);
    // paper plan
    s.addShape(pres.shapes.RECTANGLE, { x: 2.7, y: 0.45, w: 1.45, h: 1.8, fill: { color: HEX.white }, line: { color: HEX.grey, width: 1.25 }, objectName: "Plan on paper" });
    for (let i = 0; i < 4; i++) s.addShape(pres.shapes.RECTANGLE, { x: 2.9, y: 0.7 + i * 0.28, w: i === 3 ? 0.65 : 1.05, h: 0.07, fill: { color: "C9D3CD" }, line: { color: "C9D3CD", width: 0 } });
    await iconCircle(s, 3.75, 1.75, 0.6, "FaCheck", HEX.green);
    s.addImage({ data: await icon("FaArrowRight", HEX.grey), x: 4.55, y: 1.15, w: 0.45, h: 0.4 });
    // field
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 5.35, y: 0.6, w: 2.1, h: 1.65, rectRadius: 0.08, fill: { color: "E3F0FA" }, line: { color: "E3F0FA", width: 0 }, objectName: "Field" });
    s.addShape(pres.shapes.RECTANGLE, { x: 5.35, y: 1.85, w: 2.1, h: 0.4, fill: { color: "8D6E63" }, line: { color: "8D6E63", width: 0 } });
    for (let i = 0; i < 4; i++) s.addImage({ data: await icon("FaSeedling", i === 2 ? "B0A48A" : HEX.green), x: 5.5 + i * 0.48, y: 1.42, w: 0.42, h: 0.42 });
    await iconCircle(s, 7.0, 0.38, 0.6, "FaTimes", HEX.orange);
    text(s, "Right on paper ≠ right in the field", { x: 0.8, y: 2.55, w: 8.4, h: 0.9, fontSize: 34, bold: true, fontFace: "Arial", align: "center", valign: "middle", color: C.accent1 });
    text(s, "And very often, that failure starts in the lab.", { x: 1.2, y: 3.6, w: 7.6, h: 0.6, fontSize: 18, align: "center", color: C.text2 });
  }
  // 11 Lab trap
  {
    const s = content(11, 2, "The Lab Trap");
    await photo(s, img("lab_rotavap.jpg"), 0.6, 1.3, 3.4, 3.4);
    card(s, 4.4, 1.3, 5.0, 1.0);
    text(s, [{ text: "Research  ", options: { bold: true, color: C.accent2 } }, { text: "highest purity, best quality" }],
      { x: 4.6, y: 1.3, w: 4.7, h: 1.0, fontSize: 17, valign: "middle" });
    card(s, 4.4, 2.45, 5.0, 1.0);
    text(s, [{ text: "Industry  ", options: { bold: true, color: C.accent3 } }, { text: "expensive inputs · energy-hungry steps · low yield" }],
      { x: 4.6, y: 2.45, w: 4.7, h: 1.0, fontSize: 17, valign: "middle" });
    s.addImage({ data: await icon("FaArrowDown", HEX.grey), x: 6.75, y: 3.55, w: 0.3, h: 0.3 });
    text(s, "A price nobody pays", { x: 4.4, y: 3.95, w: 5.0, h: 0.6, fontSize: 24, bold: true, fontFace: "Arial", align: "center", color: C.accent3 });
    credit(s, "Photo: National Eye Institute / Wikimedia Commons, CC BY 2.0");
  }
  // 12 Three numbers
  {
    const s = content(12, 2, "Know Three Numbers");
    const nums = [["Cost per unit", "What it really costs to make one product"], ["Yield", "Finished product from each kg of raw material"],
      ["The price a buyer actually pays", "Not the price you hope for"]];
    nums.forEach((nm, i) => {
      const x = 0.6 + i * 2.97;
      card(s, x, 1.3, 2.8, 2.8);
      text(s, String(i + 1), { x, y: 1.4, w: 2.8, h: 0.95, fontSize: 54, bold: true, fontFace: "Arial", align: "center", color: C.accent2 });
      text(s, nm[0], { x: x + 0.15, y: 2.4, w: 2.5, h: 0.75, fontSize: 18, bold: true, align: "center", valign: "middle" });
      text(s, nm[1], { x: x + 0.15, y: 3.15, w: 2.5, h: 0.8, fontSize: 14, align: "center", color: C.text2 });
    });
    text(s, "A good commercial product is a smart compromise: good-enough quality, sensible cost.",
      { x: 0.6, y: 4.3, w: 8.8, h: 0.5, fontSize: 16, italic: true, align: "center", color: C.accent2 });
  }
  // 13 & 14 BuahSafe diagrams
  const guava = (s, x, y, d = 0.42) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d * 0.88, fill: { color: "A8D46F" }, line: { color: "5E8C2E", width: 1.25 } });
    s.addShape(pres.shapes.OVAL, { x: x + d * 0.2, y: y + d * 0.14, w: d * 0.22, h: d * 0.14, fill: { color: HEX.white, transparency: 40 }, line: { color: HEX.white, width: 0 } });
  };
  {
    const s = content(13, 2, "BuahSafe, Version 1");
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.25, w: 4.0, h: 3.45, rectRadius: 0.08, fill: { color: "EAF2FB" }, line: { color: "EAF2FB", width: 0 }, objectName: "Blueprint card" });
    for (let i = 1; i < 8; i++) line(s, 0.6 + i * 0.5, 1.25, 0.6 + i * 0.5, 4.7, { color: "D3E3F5", width: 0.5 });
    for (let i = 1; i < 7; i++) line(s, 0.6, 1.25 + i * 0.5, 4.6, 1.25 + i * 0.5, { color: "D3E3F5", width: 0.5 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.75, y: 1.38, w: 1.5, h: 0.3, rectRadius: 0.1, fill: { color: HEX.blue }, line: { color: HEX.blue, width: 0 } });
    text(s, "CONCEPT · CAD", { x: 0.75, y: 1.38, w: 1.5, h: 0.3, fontSize: 10, bold: true, align: "center", valign: "middle", color: C.background1 });
    // box housing
    s.addShape(pres.shapes.RECTANGLE, { x: 1.45, y: 1.95, w: 2.3, h: 2.0, fill: { color: HEX.white }, line: { color: HEX.blue, width: 2 }, objectName: "Scan box" });
    s.addShape(pres.shapes.RECTANGLE, { x: 1.45, y: 1.95, w: 2.3, h: 0.32, fill: { color: "D3E3F5" }, line: { color: HEX.blue, width: 2 }, objectName: "Lid" });
    s.addShape(pres.shapes.RECTANGLE, { x: 2.3, y: 2.27, w: 0.6, h: 0.22, fill: { color: HEX.blue }, line: { color: HEX.blue, width: 0 }, objectName: "Sensor head" });
    s.addShape(pres.shapes.ISOSCELES_TRIANGLE, { x: 2.08, y: 2.49, w: 1.04, h: 0.95, fill: { color: HEX.blue, transparency: 78 }, line: { color: HEX.blue, width: 0 }, objectName: "Light beam" });
    guava(s, 2.3, 3.3, 0.6);
    line(s, 1.45, 4.15, 3.75, 4.15, { color: HEX.blue, width: 1, arrow: "triangle", both: true });
    text(s, "1 fruit per scan", { x: 1.45, y: 4.2, w: 2.3, h: 0.3, fontSize: 12, bold: true, align: "center", color: C.accent2 });
    text(s, [
      { text: "Non-destructive internal defect detection for crystal guava", options: { breakLine: true } },
      { text: " ", options: { breakLine: true, fontSize: 8 } },
      { text: "Version 1 concept: a single-scan box", options: { bold: true, breakLine: true } },
      { text: "Designed up to CAD, never built", options: { breakLine: true, color: C.text2 } },
      { text: " ", options: { breakLine: true, fontSize: 8 } },
      { text: "Research project, pre-business", options: { italic: true, color: C.accent5 } },
    ], { x: 5.0, y: 1.3, w: 4.4, h: 2.5, fontSize: 18, valign: "middle" });
    text(s, "In the lab, it made complete sense.", { x: 5.0, y: 3.95, w: 4.4, h: 0.5, fontSize: 18, italic: true, color: C.accent2 });
  }
  {
    const s = content(14, 2, "BuahSafe, Version 2");
    text(s, "Partner: “Our harvest comes in tons.”", { x: 0.6, y: 1.15, w: 6.4, h: 0.4, fontSize: 18, italic: true, color: C.text2 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.75, y: 1.17, w: 1.65, h: 0.36, rectRadius: 0.12, fill: { color: HEX.orange }, line: { color: HEX.orange, width: 0 } });
    text(s, "IN PROGRESS", { x: 7.75, y: 1.17, w: 1.65, h: 0.36, fontSize: 11, bold: true, align: "center", valign: "middle", color: C.background1 });
    // legs and floor
    for (const lx of [1.25, 4.95, 8.6]) s.addShape(pres.shapes.RECTANGLE, { x: lx, y: 2.85, w: 0.1, h: 0.62, fill: { color: HEX.grey }, line: { color: HEX.grey, width: 0 } });
    line(s, 0.8, 3.47, 9.2, 3.47, { color: "C9D3CD", width: 1.5 });
    // belt with end rollers
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.95, y: 2.55, w: 8.1, h: 0.3, rectRadius: 0.15, fill: { color: HEX.ink2 }, line: { color: HEX.ink2, width: 0 }, objectName: "Conveyor belt" });
    for (const rx of [0.98, 8.78]) s.addShape(pres.shapes.OVAL, { x: rx, y: 2.58, w: 0.24, h: 0.24, fill: { color: HEX.grey }, line: { color: HEX.white, width: 1 } });
    for (let i = 0; i < 9; i++) s.addShape(pres.shapes.OVAL, { x: 1.5 + i * 0.8, y: 2.65, w: 0.1, h: 0.1, fill: { color: "6B7A72" }, line: { color: "6B7A72", width: 0 } });
    // motor
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.75, y: 2.95, w: 0.6, h: 0.42, rectRadius: 0.05, fill: { color: HEX.grey }, line: { color: HEX.grey, width: 0 }, objectName: "Motor" });
    text(s, "Motor", { x: 8.75, y: 2.95, w: 0.6, h: 0.42, fontSize: 9, bold: true, align: "center", valign: "middle", color: C.background1 });
    // scanner gantry (sensor not yet integrated: dashed)
    for (const gx of [5.35, 6.55]) s.addShape(pres.shapes.RECTANGLE, { x: gx, y: 1.85, w: 0.08, h: 0.7, fill: { color: HEX.blue }, line: { color: HEX.blue, width: 0 } });
    s.addShape(pres.shapes.RECTANGLE, { x: 5.25, y: 1.65, w: 1.45, h: 0.32, fill: { color: "D3E3F5" }, line: { color: HEX.blue, width: 1.5, dashType: "dash" }, objectName: "Sensor slot" });
    text(s, "Sensor (to integrate)", { x: 5.0, y: 1.66, w: 1.95, h: 0.3, fontSize: 9, bold: true, align: "center", valign: "middle", color: C.accent2 });
    for (let i = 0; i < 8; i++) guava(s, 1.35 + i * 0.98, 2.18);
    s.addImage({ data: await icon("FaArrowRight", HEX.grey), x: 0.95, y: 1.75, w: 0.32, h: 0.3 });
    text(s, "Version 2: a simple conveyor, fruit scanned as it queues", { x: 0.6, y: 3.62, w: 8.8, h: 0.4, fontSize: 17, bold: true, align: "center" });
    text(s, "Design is decided by the user's workflow", { x: 0.6, y: 4.02, w: 8.8, h: 0.5, fontSize: 24, bold: true, fontFace: "Arial", align: "center", color: C.accent2 });
    text(s, "Conveyor frame exists; sensor integration and testing in progress. Partner anonymized; quote paraphrased.", { x: 0.6, y: 4.6, w: 8.8, h: 0.28, fontSize: 10, italic: true, align: "center", color: C.accent5 });
  }
  // 15 Supply chain reality
  {
    const s = content(15, 2, "Supply Chain Reality");
    const nodes = [["FaSeedling", "Farm"], ["FaTractor", "Harvest"], ["FaWarehouse", "Storage"], ["FaTruck", "Transport"], ["FaStore", "Buyer"]];
    const risks = [["FaCalendarAlt", "Seasonal supply"], ["FaChartLine", "Price swings"], ["FaTrashAlt", "Post-harvest losses"], ["FaCoins", "Logistics costs"]];
    for (let i = 0; i < 5; i++) {
      const cx = 1.15 + i * 1.92;
      await iconCircle(s, cx - 0.36, 1.3, 0.72, nodes[i][0], i === 4 ? HEX.green : HEX.blue);
      text(s, nodes[i][1], { x: cx - 0.8, y: 2.06, w: 1.6, h: 0.3, fontSize: 14, bold: true, align: "center" });
      if (i < 4) line(s, cx + 0.45, 1.66, cx + 1.47, 1.66, { color: HEX.grey, width: 2, arrow: "triangle" });
      if (i < 4) {
        const mx = cx + 0.96;
        line(s, mx, 1.78, mx, 2.62, { color: HEX.orange, width: 1, dash: "dash" });
        card(s, mx - 0.85, 2.62, 1.7, 1.25, "FDF0E7");
        s.addImage({ data: await icon(risks[i][0], HEX.orange), x: mx - 0.2, y: 2.75, w: 0.4, h: 0.4 });
        text(s, risks[i][1], { x: mx - 0.8, y: 3.2, w: 1.6, h: 0.6, fontSize: 14, bold: true, align: "center", valign: "middle" });
      }
    }
    text(s, "Calculate them early, or they calculate themselves later.", { x: 0.6, y: 4.15, w: 8.8, h: 0.5, fontSize: 20, italic: true, align: "center", color: C.accent2 });
  }
  // 16 Two kinds of standards
  {
    const s = content(16, 2, "Two Kinds of Standards");
    const cols = [["FaCertificate", "Formal", "ISO · national standards · halal · biosecurity · deforestation rules", "Written down. You can study them."],
      ["FaShoppingBasket", "Unwritten", "Taste · habits · price sensitivity · convenience", "No regulation tells you. They decide if it sells."]];
    for (let i = 0; i < 2; i++) {
      const x = 0.6 + i * 4.5;
      card(s, x, 1.3, 4.3, 3.35);
      await iconCircle(s, x + 0.3, 1.55, 0.7, cols[i][0], i ? HEX.orange : HEX.blue);
      text(s, cols[i][1], { x: x + 1.2, y: 1.55, w: 2.9, h: 0.7, fontSize: 24, bold: true, fontFace: "Arial", valign: "middle", color: i ? C.accent3 : C.accent2 });
      text(s, cols[i][2], { x: x + 0.3, y: 2.5, w: 3.8, h: 1.1, fontSize: 18, bold: true });
      text(s, cols[i][3], { x: x + 0.3, y: 3.65, w: 3.8, h: 0.8, fontSize: 15, italic: true, color: C.text2 });
    }
  }
  // 17 Japan pattern 1
  {
    const s = content(17, 2, "Japan 1: Premium Pays for Innovation");
    await photo(s, img("product/haruka_4.png"), 5.15, 1.3, 2.05, 2.75, "west");
    await photo(s, img("product/haruka_9.png"), 7.35, 1.3, 2.05, 2.75, "west");
    text(s, "Matcha sealed in the cap  →  twist, shake, drink", { x: 5.15, y: 4.12, w: 4.25, h: 0.3, fontSize: 12, italic: true, align: "center", color: C.text2 });
    text(s, [
      { text: "Matcha sealed in the cap, released when twisted", options: { bold: true, breakLine: true } },
      { text: " ", options: { breakLine: true, fontSize: 8 } },
      { text: "HARUKA (Jatex): ¥500 per 200 mL, sold in department stores", options: { breakLine: true } },
      { text: "Similar mechanism in Ito En's Oi Ocha line", options: { breakLine: true } },
      { text: " ", options: { breakLine: true, fontSize: 8 } },
      { text: "Works because buyers pay a premium", options: { bold: true, color: C.accent2, fontSize: 22 } },
    ], { x: 0.6, y: 1.3, w: 4.3, h: 3.2, fontSize: 17, valign: "middle" });
    credit(s, "Images: SoraNews24 (2016), HARUKA by Jatex. Sources: openers.jp; packagingstrategies.com", { w: 8.9 });
  }
  // 18 Japan pattern 2
  {
    const s = content(18, 2, "Japan 2: Research Makes Tech Cheap");
    await fitImage(s, img("product/kuroki_fig3_rotlevels.jpg"), 0.6, 1.25, 4.5, 0.74);
    text(s, "Internal rot levels 0–5, judged on cut bulbs", { x: 0.6, y: 2.02, w: 4.5, h: 0.28, fontSize: 11, italic: true, color: C.text2 });
    await fitImage(s, img("product/kuroki_fig1_setup.jpg"), 0.6, 2.4, 3.6, 1.5);
    text(s, "VIS/NIR transmittance setup", { x: 0.6, y: 3.95, w: 4.5, h: 0.28, fontSize: 11, italic: true, color: C.text2 });
    text(s, "Rot inside onions, seen without cutting", { x: 5.4, y: 1.2, w: 4.0, h: 0.35, fontSize: 14, bold: true });
    s.addShape(pres.shapes.DONUT, { x: 5.4, y: 1.65, w: 1.55, h: 1.55, fill: { color: "D6DEE8" }, line: { color: "D6DEE8", width: 0 }, objectName: "Accuracy ring" });
    s.addShape(pres.shapes.BLOCK_ARC, { x: 5.4, y: 1.65, w: 1.55, h: 1.55, angleRange: [270, 270 + 0.984 * 360 - 360], arcThicknessRatio: 0.25,
      fill: { color: HEX.blue }, line: { color: HEX.blue, width: 0 }, objectName: "Accuracy 98.4%" });
    text(s, "98.4%", { x: 5.4, y: 2.2, w: 1.55, h: 0.45, fontSize: 19, bold: true, fontFace: "Arial", align: "center", color: C.accent2 });
    text(s, "4–6%", { x: 7.2, y: 1.6, w: 2.2, h: 0.6, fontSize: 32, bold: true, fontFace: "Arial", color: C.accent3 });
    text(s, "of market onions were rotten inside (1-ton survey)", { x: 7.2, y: 2.18, w: 2.2, h: 0.55, fontSize: 11, color: C.text2 });
    text(s, "NARO (2014), separately: 91.4% detected", { x: 7.2, y: 2.8, w: 2.2, h: 0.45, fontSize: 11, italic: true, color: C.text2 });
    text(s, "Practical and low-cost in Japan because of years of public research", { x: 5.4, y: 3.3, w: 4.0, h: 0.5, fontSize: 13, italic: true });
    card(s, 5.4, 3.85, 4.0, 0.85);
    text(s, [{ text: "Before copying, ask: ", options: { bold: true } },
      { text: "Do my buyers pay a premium? Does my ecosystem make this cheap?" }],
      { x: 5.55, y: 3.85, w: 3.75, h: 0.85, fontSize: 13, valign: "middle" });
    credit(s, "Figures and data: Kuroki et al. (2017), Postharvest Biol. Technol. 128: 18–23; Ito & Morimoto (2014), NARO", { w: 8.9 });
  }
  // 19 China & emerging markets
  {
    const s = content(19, 2, "China & Emerging Markets");
    for (let i = 0; i < 2; i++) card(s, 0.6 + i * 4.5, 1.3, 4.3, 2.85);
    if (has("product/mengniu_line.jpg") && has("product/xiaomi_dark_factory.jpg")) {
      await photo(s, img("product/xiaomi_dark_factory.jpg"), 0.75, 1.42, 1.95, 1.55);
      await photo(s, img("product/mengniu_line.jpg"), 2.8, 1.42, 1.95, 1.55);
    } else {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.95, y: 2.55, w: 3.6, h: 0.2, rectRadius: 0.1, fill: { color: HEX.ink2 }, line: { color: HEX.ink2, width: 0 }, objectName: "Line" });
      for (let k = 0; k < 3; k++) await iconCircle(s, 1.2 + k * 1.2, 1.55, 0.75, "FaRobot", HEX.blue);
      for (let k = 0; k < 7; k++) s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.05 + k * 0.5, y: 2.36, w: 0.3, h: 0.19, rectRadius: 0.03, fill: { color: HEX.gold }, line: { color: HEX.gold, width: 0 } });
    }
    // network of small actors
    const pts = [[6.1, 1.65], [7.2, 1.5], [8.3, 1.7], [6.6, 2.45], [7.85, 2.5]];
    const links = [[0, 1], [1, 2], [0, 3], [1, 3], [1, 4], [2, 4], [3, 4]];
    for (const [a, b] of links) line(s, pts[a][0] + 0.25, pts[a][1] + 0.25, pts[b][0] + 0.25, pts[b][1] + 0.25, { color: "9DB8DA", width: 1.5 });
    for (const [px, py] of pts) await iconCircle(s, px, py, 0.5, "FaUserFriends", HEX.blue);
    const cols = [["China", "Scale · automation · integrated supply chains"], ["Emerging markets", "Flexibility · labor intensity · small local suppliers"]];
    for (let i = 0; i < 2; i++) {
      const x = 0.6 + i * 4.5;
      text(s, cols[i][0], { x, y: 3.08, w: 4.3, h: 0.45, fontSize: 21, bold: true, fontFace: "Arial", align: "center", color: C.accent2 });
      text(s, cols[i][1], { x: x + 0.25, y: 3.52, w: 3.8, h: 0.5, fontSize: 15, align: "center" });
    }
    text(s, "No single correct model. Each fits its own context.", { x: 0.6, y: 4.3, w: 8.8, h: 0.45, fontSize: 18, italic: true, align: "center", color: C.accent2 });
    if (has("product/mengniu_line.jpg")) credit(s, "Images: Xiaomi phone “dark factory”, Beijing (Xiaomi, via New Atlas, 2024); Mengniu dairy line, China (Tittenberger / Wikimedia Commons, CC BY 3.0)", { w: 8.9 });
  }
  // 20 Right-tech
  {
    const s = addSlide("STATEMENT", 20);
    const opts = [["FaMicrochip", "High-tech", "Impressive in a demo", HEX.grey], ["FaPuzzlePiece", "Right-tech", "Fits buyers, costs, supply chain", HEX.blue]];
    for (let i = 0; i < 2; i++) {
      const x = 1.6 + i * 3.6;
      card(s, x, 0.55, 3.2, 1.4, HEX.white);
      await iconCircle(s, x + 0.25, 0.7, 0.75, opts[i][0], opts[i][3]);
      text(s, opts[i][1], { x: x + 1.15, y: 0.7, w: 1.95, h: 0.4, fontSize: 18, bold: true, fontFace: "Arial", color: i ? C.accent2 : C.accent5 });
      text(s, opts[i][2], { x: x + 1.15, y: 1.1, w: 1.95, h: 0.8, fontSize: 13, color: C.text2 });
    }
    text(s, "<", { x: 4.75, y: 0.95, w: 0.5, h: 0.6, fontSize: 30, bold: true, align: "center", color: C.accent2 });
    text(s, "Right-tech beats high-tech", { x: 0.8, y: 2.5, w: 8.4, h: 0.9, fontSize: 34, bold: true, fontFace: "Arial", align: "center", valign: "middle", color: C.accent2 });
    text(s, "Fit to purchasing power · cost structure · local supply chain", { x: 1.2, y: 3.55, w: 7.6, h: 0.6, fontSize: 18, align: "center", color: C.text2 });
  }
  // 21 Concentric circles
  {
    const s = content(21, 3, "Human-Centric, Practically");
    const rings = [[3.6, "FDE7D9", "Community"], [2.6, "F8C7A6", "Partners"], [1.6, HEX.orange, "Your team"]];
    rings.forEach(([d, fill, label], i) => {
      const cx = 2.8, cy = 3.05;
      s.addShape(pres.shapes.OVAL, { x: cx - d / 2, y: cy - d / 2, w: d, h: d, fill: { color: fill }, line: { color: HEX.white, width: 2 }, objectName: label });
      const ty = i === 2 ? cy - 0.2 : cy - d / 2 + 0.12;
      text(s, label, { x: cx - 1, y: ty, w: 2, h: 0.4, fontSize: i === 2 ? 17 : 15, bold: true, align: "center", color: i === 2 ? C.background1 : C.text1 });
    });
    text(s, [{ text: "Not a moral slogan.", options: { bold: true, breakLine: true } },
      { text: " ", options: { breakLine: true, fontSize: 8 } },
      { text: "It works through incentives, clarity, and trust you can actually measure." }],
      { x: 5.3, y: 1.6, w: 4.1, h: 2.6, fontSize: 22, valign: "middle", color: C.text1 });
  }
  // 22 Cost of informality
  {
    const s = content(22, 3, "The Cost of Informality");
    text(s, "> Rp10 million", { x: 0.6, y: 1.35, w: 4.4, h: 1.2, fontSize: 40, bold: true, fontFace: "Arial", color: C.accent3 });
    text(s, "in accumulated losses, across several incidents", { x: 0.6, y: 2.5, w: 4.4, h: 0.7, fontSize: 16, color: C.text2 });
    const items = [["FaQuestion", "Blurry roles"], ["FaRedo", "Responsibility passed around"], ["FaEye", "“Done” because it looks right, not tested"]];
    for (let i = 0; i < 3; i++) {
      const y = 1.4 + i * 0.95;
      await iconCircle(s, 5.4, y, 0.6, items[i][0], HEX.orange);
      text(s, items[i][1], { x: 6.2, y, w: 3.2, h: 0.6, fontSize: 17, bold: true, valign: "middle" });
    }
    text(s, "Very normal at the early stage. I did it too.", { x: 0.6, y: 4.2, w: 8.8, h: 0.45, fontSize: 16, italic: true, color: C.accent3 });
  }
  // 23 Brief vs technical decisions
  {
    const s = content(23, 3, "Brief vs Technical Decisions");
    // mock form
    card(s, 0.6, 1.3, 4.0, 3.35);
    text(s, "Feature form", { x: 0.85, y: 1.45, w: 3.5, h: 0.35, fontSize: 13, bold: true, color: C.accent5 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.85, y: 2.0, w: 2.7, h: 0.5, rectRadius: 0.05, fill: { color: HEX.white }, line: { color: HEX.grey, width: 1 } });
    text(s, "Select…  ▾", { x: 1.0, y: 2.0, w: 2.4, h: 0.5, fontSize: 14, valign: "middle", color: C.accent5 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.85, y: 2.75, w: 2.7, h: 0.5, rectRadius: 0.05, fill: { color: HEX.white }, line: { color: HEX.grey, width: 1 } });
    text(s, "Type here…", { x: 1.0, y: 2.75, w: 2.4, h: 0.5, fontSize: 14, valign: "middle", color: C.accent5 });
    await iconCircle(s, 3.7, 2.3, 0.65, "FaQuestion", HEX.orange);
    text(s, "“Dropdown or text input?”", { x: 0.85, y: 3.55, w: 3.6, h: 0.5, fontSize: 17, bold: true, italic: true, color: C.accent3 });
    const rows = [["FaUserTie", "Founder", "Users · problem · constraints"], ["FaTools", "Specialist", "The solution"]];
    for (let i = 0; i < 2; i++) {
      const y = 1.5 + i * 1.5;
      await iconCircle(s, 5.0, y, 0.75, rows[i][0], i ? HEX.ink2 : HEX.orange);
      text(s, rows[i][1], { x: 5.95, y: y - 0.05, w: 3.4, h: 0.45, fontSize: 22, bold: true, fontFace: "Arial" });
      text(s, rows[i][2], { x: 5.95, y: y + 0.4, w: 3.4, h: 0.45, fontSize: 17, color: C.text2 });
    }
  }
  // 24 Contract quote
  {
    const s = content(24, 3, "A Contract Doesn't Fix a Bad Hire");
    await iconCircle(s, 0.75, 1.55, 0.8, "FaFileContract", HEX.orange);
    await iconCircle(s, 0.75, 2.6, 0.8, "FaSearch", HEX.ink2);
    text(s, [
      { text: "A contract tells you what to do when things go wrong.", options: { breakLine: true } },
      { text: "It doesn't stop you from choosing the wrong people.", options: {} },
    ], { x: 1.85, y: 1.45, w: 7.55, h: 2.0, fontSize: 26, bold: true, fontFace: "Arial", valign: "middle" });
    text(s, "And it only helps if you can enforce it.", { x: 1.85, y: 3.6, w: 7.55, h: 0.6, fontSize: 20, italic: true, color: C.accent3 });
  }
  // 25 Five things
  {
    const s = content(25, 3, "Five Things to Do Now");
    const items = [["FaSearch", "Select first", "small paid trial"], ["FaClipboardCheck", "Minimum formalization", "scope · definition of done · who fixes · how to part ways"],
      ["FaChartLine", "Measure output & transparency", "not tools or claimed expertise"], ["FaHandshake", "Hire for ownership", "co-founders carry business logic"],
      ["FaFileContract", "Employment contracts", "when you truly hire"]];
    for (let i = 0; i < 5; i++) {
      const y = 1.25 + i * 0.73;
      await iconCircle(s, 0.6, y, 0.55, items[i][0], HEX.orange);
      text(s, [{ text: `${i + 1}. ${items[i][1]}  `, options: { bold: true } }, { text: items[i][2], options: { color: C.text2 } }],
        { x: 1.35, y, w: 8.05, h: 0.55, fontSize: 17, valign: "middle" });
    }
  }
  // 26 Friction is normal
  {
    const s = content(26, 3, "Friction Is Normal");
    await photo(s, img("team.jpg"), 0.6, 1.3, 3.4, 3.4);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 4.3, y: 1.4, w: 2.15, h: 0.8, rectRadius: 0.3, fill: { color: HEX.orange }, line: { color: HEX.orange, width: 0 } });
    text(s, "Direct", { x: 4.3, y: 1.4, w: 2.15, h: 0.8, fontSize: 20, bold: true, align: "center", valign: "middle", color: C.background1 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.25, y: 1.4, w: 2.15, h: 0.8, rectRadius: 0.3, fill: { color: "F8C7A6" }, line: { color: "F8C7A6", width: 0 } });
    text(s, "Indirect", { x: 7.25, y: 1.4, w: 2.15, h: 0.8, fontSize: 20, bold: true, align: "center", valign: "middle", color: C.text1 });
    await iconCircle(s, 6.57, 1.5, 0.6, "FaComments", HEX.ink2);
    text(s, "Different styles, shared boundaries", { x: 4.3, y: 2.5, w: 5.1, h: 0.8, fontSize: 20, bold: true, fontFace: "Arial", valign: "top" });
    text(s, [{ text: "Clear roles", options: { breakLine: true } }, { text: "Objective targets", options: { breakLine: true } }, { text: "Respectful channels" }],
      { x: 4.3, y: 3.05, w: 5.1, h: 1.2, fontSize: 18, bold: true, color: C.accent3, paraSpaceAfter: 4 });
    credit(s, "Photo: Wikimedia Foundation / Wikimedia Commons, CC BY-SA 4.0");
  }
  // 27 Founder bottleneck
  {
    const s = addSlide("STATEMENT", 27);
    for (let i = 0; i < 5; i++) {
      const y = 0.4 + i * 0.36;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 2.4, y, w: 1.1, h: 0.24, rectRadius: 0.05, fill: { color: "F8C7A6" }, line: { color: "F8C7A6", width: 0 }, objectName: `Task ${i + 1}` });
      line(s, 3.5, y + 0.12, 4.6, 1.24, { color: HEX.grey, width: 1.25 });
    }
    await iconCircle(s, 4.6, 0.92, 0.66, "FaUserTie", HEX.orange);
    line(s, 5.26, 1.25, 6.35, 1.25, { color: HEX.grey, width: 1, arrow: "triangle" });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.4, y: 1.11, w: 1.0, h: 0.28, rectRadius: 0.05, fill: { color: HEX.green }, line: { color: HEX.green, width: 0 }, objectName: "Output" });
    text(s, "Output", { x: 6.4, y: 1.11, w: 1.0, h: 0.28, fontSize: 10, bold: true, align: "center", valign: "middle", color: C.background1 });
    text(s, "Everything waits for one person", { x: 2.4, y: 2.25, w: 5.2, h: 0.3, fontSize: 12, italic: true, align: "center", color: C.accent5 });
    text(s, "A leader's job is to build the system, not to be the hero", { x: 0.8, y: 2.6, w: 8.4, h: 1.2, fontSize: 32, bold: true, fontFace: "Arial", align: "center", valign: "middle", color: C.accent3 });
    text(s, "The founder bottleneck: fixing everything yourself kills the team's initiative.", { x: 1.2, y: 3.9, w: 7.6, h: 0.6, fontSize: 17, align: "center", color: C.text2 });
  }
  // 28 Economics of trust
  {
    const s = content(28, 3, "The Economics of Trust");
    await photo(s, img("farmers.jpg"), 0.6, 1.3, 3.2, 3.4);
    text(s, "Partnership ≠ charity", { x: 4.1, y: 1.25, w: 5.3, h: 0.5, fontSize: 22, bold: true, fontFace: "Arial", color: C.accent3 });
    const cols = [["Farmers need", "Transparent grading\nHonest scales\nOn-time payment"], ["Companies need", "Kept supply commitments\nNo side-selling"]];
    cols.forEach(([h, b], i) => {
      const x = 4.1 + i * 2.7;
      card(s, x, 1.85, 2.55, 1.85);
      text(s, h, { x: x + 0.15, y: 1.95, w: 2.25, h: 0.4, fontSize: 16, bold: true, color: C.accent3 });
      text(s, b, { x: x + 0.15, y: 2.4, w: 2.3, h: 1.2, fontSize: 15 });
    });
    text(s, [{ text: "Tools: ", options: { bold: true } }, { text: "fair contracts · adaptive prices · consistent field communication" }],
      { x: 4.1, y: 3.85, w: 5.3, h: 0.8, fontSize: 15, valign: "middle" });
    credit(s, "Photo: M Joko Apriyo Putro / Wikimedia Commons, CC BY-SA 4.0");
  }
  // 29 Stable jobs
  {
    const s = await statement(29, 3, "Stable jobs. Fair wages.", "The most concrete “S” in ESG for a young agroindustrial business.", "FaHandHoldingUsd");
  }

  // =================== PART 4 ===================
  section("Part 4: Competition to Execution");
  // 30 Graveyard
  {
    const s = addSlide("STATEMENT", 30);
    line(s, 3.2, 2.05, 6.8, 2.05, { color: "8D6E63", width: 3 });
    s.addShape(pres.shapes.ROUND_2_SAME_RECTANGLE, { x: 4.25, y: 0.4, w: 1.5, h: 1.65, fill: { color: "B9C3BD" }, line: { color: "9AA59F", width: 1 }, objectName: "Tombstone" });
    text(s, [{ text: "R.I.P.", options: { bold: true, breakLine: true, fontSize: 14 } }, { text: "Pitch deck", options: { breakLine: true } }, { text: "BMC", options: { breakLine: true } }, { text: "2026" }],
      { x: 4.25, y: 0.6, w: 1.5, h: 1.35, fontSize: 11, align: "center", valign: "middle", color: C.text2 });
    for (const gx of [3.6, 6.05]) s.addImage({ data: await icon("FaSeedling", "9DB59F"), x: gx, y: 1.65, w: 0.38, h: 0.38 });
    text(s, "The post-competition graveyard", { x: 0.8, y: 2.3, w: 8.4, h: 0.8, fontSize: 34, bold: true, fontFace: "Arial", align: "center", color: C.accent4 });
    text(s, "Where good proposals go to rest. Learning speed is a founder's most expensive asset.", { x: 1.2, y: 3.15, w: 7.6, h: 0.9, fontSize: 18, align: "center", color: C.text2 });
  }
  // 31 Post-submission clarity
  {
    const s = content(31, 4, "Post-Submission Clarity");
    await iconCircle(s, 0.9, 1.6, 1.6, "FaCubes", HEX.purple);
    text(s, "A competition is a low-risk sandbox", { x: 0.5, y: 3.4, w: 2.8, h: 0.9, fontSize: 16, bold: true, align: "center", color: C.accent4 });
    const rows = [["FaEye", "Blind spots appear after you submit, or after a judge's hard question"], ["FaCheck", "Winning ≠ perfect"], ["FaRedo", "Not winning ≠ failure. It tells you what to fix next"]];
    for (let i = 0; i < 3; i++) {
      const y = 1.45 + i * 1.0;
      await iconCircle(s, 3.8, y, 0.6, rows[i][0], HEX.ink2);
      text(s, rows[i][1], { x: 4.6, y: y - 0.1, w: 4.8, h: 0.8, fontSize: 18, valign: "middle" });
    }
  }
  // 32 Cost of learning
  {
    const s = addSlide("STATEMENT", 32);
    await photo(s, img("seedling.jpg"), 0, 0, 4.1, 5.625, "centre");
    text(s, "Make sure you're still standing after the first failure", { x: 4.55, y: 1.0, w: 4.9, h: 2.0, fontSize: 30, bold: true, fontFace: "Arial", valign: "middle", color: C.accent4 });
    text(s, "Fish die. Harvests fail. Partners reject designs. That is the cost of learning.", { x: 4.55, y: 3.1, w: 4.9, h: 1.0, fontSize: 18, color: C.text2 });
    credit(s, "Photo: Joshua Tree National Park / Wikimedia Commons, public domain", { x: 4.55, w: 4.9 });
  }
  // 33 Prize money
  {
    const s = content(33, 4, "Prize Money = Non-Dilutive Capital");
    await iconCircle(s, 0.8, 1.45, 1.3, "FaMoneyBillWave", HEX.purple);
    const checks = ["No debt", "No equity given away"];
    for (let i = 0; i < 2; i++) {
      await iconCircle(s, 2.5, 1.5 + i * 0.68, 0.48, "FaCheck", HEX.green);
      text(s, checks[i], { x: 3.15, y: 1.5 + i * 0.68, w: 3.5, h: 0.48, fontSize: 20, bold: true, valign: "middle" });
    }
    text(s, "Spend it on the next real validation step:", { x: 0.6, y: 3.0, w: 8.8, h: 0.4, fontSize: 17, bold: true, color: C.accent4 });
    ["Lab tests", "Samples / MVP", "Trial packaging", "Basic legal registration"].forEach((t, i) => {
      const x = 0.6 + i * 2.22;
      card(s, x, 3.5, 2.06, 0.75);
      text(s, t, { x: x + 0.1, y: 3.5, w: 1.86, h: 0.75, fontSize: 16, bold: true, align: "center", valign: "middle" });
    });
  }
  // 34 Warm market
  {
    const s = content(34, 4, "Start with Your Warm Market");
    await photo(s, img("stall.jpg"), 0.6, 1.3, 3.2, 3.4);
    const steps = ["Family", "Campus", "Alumni", "Social media", "Open market"];
    const icons = ["FaHome", "FaUniversity", "FaUserGraduate", "FaInstagram", "FaStore"];
    for (let i = 0; i < 5; i++) {
      const slot = 1.08, d = 0.55 + i * 0.1, sx = 4.05 + i * slot, x = sx + (slot - d) / 2, y = 2.2 - d / 2;
      await iconCircle(s, x, y, d, icons[i], i < 3 ? HEX.purple : "9C84C4");
      text(s, steps[i], { x: sx, y: 2.85, w: slot, h: 0.55, fontSize: 13, bold: true, align: "center" });
      if (i < 4) s.addImage({ data: await icon("FaArrowRight", "C9D3CD"), x: sx + slot - 0.09, y: 2.12, w: 0.16, h: 0.16 });
    }
    text(s, "Cheapest, fastest validation: product response, honest feedback, first cash flow.", { x: 4.1, y: 3.65, w: 5.3, h: 0.9, fontSize: 16, italic: true, color: C.accent4 });
    credit(s, "Photo: YT Arty / Wikimedia Commons, CC BY-SA 4.0");
  }
  // 35 Funding ladder
  {
    const s = content(35, 4, "The Funding Ladder");
    const steps = [["University / government grants & incubation", "FaUniversity"], ["Incubators & accelerators", "FaLayerGroup"], ["Early-stage investors (after traction)", "FaCoins"]];
    for (let i = 0; i < 3; i++) {
      const h = 1.0 + i * 0.9, x = 0.6 + i * 3.0, y = 4.7 - h;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 2.8, h, rectRadius: 0.06, fill: { color: ["C8B8E2", "9C84C4", HEX.purple][i] }, line: { color: HEX.white, width: 0 }, objectName: `Step ${i + 1}` });
      await iconCircle(s, x + 0.12, y + 0.12, 0.5, steps[i][1], HEX.white, HEX.purple);
      text(s, `${i + 1}. ${steps[i][0]}`, { x: x + 0.75, y: y + 0.1, w: 1.95, h: 0.8, fontSize: 15, valign: "middle", bold: true, color: i === 2 ? C.background1 : C.text1 });
    }
    text(s, "Your country very likely has its own versions of each step.", { x: 0.6, y: 1.25, w: 5.5, h: 0.5, fontSize: 15, italic: true, color: C.text2 });
  }
  // 36 Sociopreneur -> technopreneur
  {
    const s = content(36, 4, "Sociopreneur → Technopreneur");
    const stages = [["FaUserFriends", "Relationships & community"], ["FaStore", "Local suppliers"], ["FaLightbulb", "Capital, data, systems"], ["FaTractor", "Technology"]];
    for (let i = 0; i < 4; i++) {
      const x = 0.7 + i * 2.3;
      await iconCircle(s, x + 0.35, 1.6, 0.95, stages[i][0], i < 2 ? "9C84C4" : HEX.purple);
      text(s, stages[i][1], { x, y: 2.7, w: 1.65, h: 0.7, fontSize: 15, bold: true, align: "center" });
      if (i < 3) s.addImage({ data: await icon("FaArrowRight", HEX.grey), x: x + 1.72, y: 1.9, w: 0.35, h: 0.35 });
    }
    text(s, "Start simple. Add technology as capital, data, and systems grow.", { x: 0.6, y: 3.75, w: 8.8, h: 0.6, fontSize: 20, italic: true, align: "center", color: C.accent4 });
  }

  // =================== CLOSING ===================
  section("Closing");
  // 37 Four sentences
  {
    const s = content(37, 0, "Four Sentences");
    const lines = ["The map is wider than packaged food.", "Design follows the user's workflow and market context.", "Human-centric starts with your own team.", "This competition is a beginning."];
    const hx = [HEX.green, HEX.blue, HEX.orange, HEX.purple];
    for (let i = 0; i < 4; i++) {
      const y = 1.3 + i * 0.85;
      s.addShape(pres.shapes.OVAL, { x: 0.6, y, w: 0.6, h: 0.6, fill: { color: hx[i] }, line: { color: hx[i], width: 0 } });
      text(s, String(i + 1), { x: 0.6, y, w: 0.6, h: 0.6, fontSize: 18, bold: true, align: "center", valign: "middle", color: C.background1, fontFace: "Arial" });
      text(s, lines[i], { x: 1.45, y, w: 7.95, h: 0.6, fontSize: 22, bold: true, valign: "middle" });
    }
  }
  // 38 The question again
  {
    const s = addSlide("STATEMENT", 38);
    const cx = 5.0, cy = 1.45;
    for (let k = 0; k < 7; k++) {
      const a = Math.PI * (1.1 + k * 0.133), r1 = 0.85, r2 = 1.25;
      line(s, cx + r1 * Math.cos(a), cy + r1 * Math.sin(a), cx + r2 * Math.cos(a), cy + r2 * Math.sin(a), { color: HEX.gold, width: 2.5 });
    }
    s.addImage({ data: await icon("FaFolderOpen", HEX.gold), x: 4.45, y: 0.95, w: 1.1, h: 1.1 });
    text(s, "Six months from now, will your plan still be alive, and what will it be living on?",
      { x: 1.0, y: 2.25, w: 8.0, h: 1.6, fontSize: 30, bold: true, fontFace: "Arial", align: "center", valign: "middle" });
    text(s, "Enthusiasm is not enough. First customers, clear margins, a team that knows its roles.", { x: 1.2, y: 3.9, w: 7.6, h: 0.7, fontSize: 17, align: "center", color: C.text2 });
  }
  // 39 Thank you
  {
    const s = addSlide("PHOTO_DARK", 39);
    await photo(s, img("rice_terraces.jpg"), 0, 0, 10, 5.625);
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: "0E1A14", transparency: 25 }, line: { color: "0E1A14", width: 0 } });
    await logos(s);
    text(s, "Thank you", { x: 0.6, y: 1.9, w: 8.8, h: 1.0, fontSize: 48, bold: true, fontFace: "Arial", color: C.background1 });
    text(s, "Let's discuss", { x: 0.6, y: 2.9, w: 8.8, h: 0.6, fontSize: 26, color: C.background1 });
    text(s, "Ade Surya Ananda", { x: 0.6, y: 3.8, w: 8.8, h: 0.4, fontSize: 15, color: C.background1 });
    credit(s, "Photo: Philip Nalangan / Wikimedia Commons, CC BY 4.0", { color: C.background2, y: 5.2 });
  }

  // =================== BACKUP ===================
  section("Backup (Q&A)");
  const backup = (title, notes) => {
    const s = pres.addSlide({ masterName: "CONTENT_PLAIN", sectionTitle });
    s.addText(title, { placeholder: "title" });
    text(s, "BACKUP", { x: 0.6, y: 0.12, w: 1.5, h: 0.22, fontSize: 9, bold: true, color: C.accent5, charSpacing: 2 });
    s.addNotes(notes);
    return s;
  };
  {
    const s = backup("Why Listen to a Student?", "Q: Why should we trust a student's view on viability? A: Acknowledge the early stage; I speak from inside the same process; the mistakes I shared are real data, not theory.");
    await iconCircle(s, 0.7, 1.6, 1.1, "FaUserGraduate", HEX.ink2);
    text(s, "Inside the process, not above it.\nRecent mistakes are real data.", { x: 2.2, y: 1.45, w: 7.2, h: 1.6, fontSize: 26, bold: true, fontFace: "Arial", valign: "middle" });
  }
  {
    const s = backup("Profit vs ESG", "Q: Doesn't focusing on profit contradict ESG? A: Profit is the fuel. A dead business cannot protect the environment or pay anyone.");
    await iconCircle(s, 0.7, 1.6, 1.1, "FaLeaf", HEX.green);
    text(s, "Profit is fuel.\nA dead business protects no environment and pays no one.", { x: 2.2, y: 1.45, w: 7.2, h: 1.8, fontSize: 26, bold: true, fontFace: "Arial", valign: "middle" });
  }
  {
    const s = backup("Minimum Formalization Checklist", "Q: Should a small team sign formal contracts with friends? A: Minimum formalization first; full employment contracts when you actually hire employees.");
    ["Scope of work", "Definition of done", "Who fixes defects", "Review schedule", "Exit clause"].forEach((t, i) => {
      card(s, 0.6, 1.3 + i * 0.68, 8.8, 0.56);
      text(s, `${i + 1}.  ${t}`, { x: 0.85, y: 1.3 + i * 0.68, w: 8.4, h: 0.56, fontSize: 18, bold: true, valign: "middle" });
    });
  }
  {
    const s = backup("Sources & Image Credits", "Reference slide. Show only if asked about sources.");
    text(s, [
      { text: "Sources", options: { bold: true, breakLine: true, fontSize: 14 } },
      { text: "Jatex HARUKA: openers.jp/en/lounge/lounge_eat/17620", options: { breakLine: true } },
      { text: "Ito En Oi Ocha matcha cap: packagingstrategies.com/articles/91809", options: { breakLine: true } },
      { text: "Kuroki et al. (2017), Postharvest Biol. Technol. 128: 18–23, doi:10.1016/j.postharvbio.2017.02.001", options: { breakLine: true } },
      { text: "Ito & Morimoto (2014), NARO onion NIR study, doi:10.24514/00001821", options: { breakLine: true } },
      { text: " ", options: { breakLine: true } },
      { text: "Photos (Wikimedia Commons)", options: { bold: true, breakLine: true, fontSize: 14 } },
      { text: "Rice terraces: Philip Nalangan, CC BY 4.0 · Oil palm: Kistara, CC0 · Catfish: W.A. Djatmiko, CC BY-SA 3.0", options: { breakLine: true } },
      { text: "Soap: DimiTalen, CC0 · Lab: National Eye Institute, CC BY 2.0 · Onions: Pascal Kings, CC BY 4.0", options: { breakLine: true } },
      { text: "Rice harvest: M Joko Apriyo Putro, CC BY-SA 4.0 · Bioplastic: Scott Bauer, PD · Seedling: Joshua Tree NP, PD", options: { breakLine: true } },
      { text: "Team: Wikimedia Foundation, CC BY-SA 4.0 · Food stall: YT Arty, CC BY-SA 4.0 · UB logo: public domain", options: { breakLine: true } },
      { text: "HARUKA images: SoraNews24 (2016) · Onion figures: Kuroki et al. (2017) · Full links: assets/ATTRIBUTION.md" },
    ], { x: 0.6, y: 1.3, w: 8.8, h: 3.5, fontSize: 13, color: C.text1 });
  }

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
})().catch((e) => { console.error(e); process.exit(1); });
