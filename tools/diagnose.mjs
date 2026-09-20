// Diagnosis: apakah teks dan audio benar-benar sepadan?
// Sebelum memilih algoritma penyelarasan lagi, uji dulu asumsi dasarnya.
import { readFileSync } from "node:fs";

const src = readFileSync("src/lib/narration.ts", "utf8");
const block = src.slice(
  src.indexOf("const script: Paragraph[]"),
  src.indexOf("Waktu mulai"),
);
const texts = [];
const re = /\{ text: (["'])((?:\\.|(?!\1).)*)\1 \}/g;
let m;
while ((m = re.exec(block)) !== null) texts.push(m[2].replace(/\\(.)/g, "$1"));

const full = texts.join(" ");
const chars = full.length;
const words = full.split(/\s+/).filter(Boolean).length;

const { segments, duration } = JSON.parse(readFileSync("tools/audio-segments.json", "utf8"));
const speech = segments.reduce((a, s) => a + (s.end - s.start), 0);

console.log("=== SEPADAN ATAU TIDAK ===");
console.log("kata dalam teks     :", words);
console.log("karakter            :", chars);
console.log("durasi audio        :", duration, "dtk");
console.log("waktu bersuara      :", speech.toFixed(1), "dtk", `(${((speech / duration) * 100).toFixed(0)}%)`);
console.log();
console.log("laju bila dihitung atas seluruh audio  :", (words / (duration / 60)).toFixed(1), "kata/menit");
console.log("laju bila dihitung atas waktu bersuara :", (words / (speech / 60)).toFixed(1), "kata/menit");
console.log("  (pidato lambat dan khidmat biasanya 100-140 kata/menit)");
console.log();

console.log("=== SEBARAN PANJANG RENTANG BICARA ===");
const durs = segments.map((s) => Number((s.end - s.start).toFixed(2))).sort((a, b) => a - b);
const q = (p) => durs[Math.floor(p * (durs.length - 1))];
console.log("jumlah rentang :", segments.length);
console.log("min / p25 / median / p75 / max :", q(0), "/", q(0.25), "/", q(0.5), "/", q(0.75), "/", q(1));
console.log();
console.log("rentang terpanjang (kalau ada yang belasan detik, VAD menggabung terlalu banyak):");
segments
  .map((s, i) => ({ i, ...s, d: Number((s.end - s.start).toFixed(2)) }))
  .sort((a, b) => b.d - a.d)
  .slice(0, 8)
  .forEach((s) => console.log(`  #${String(s.i).padStart(2)}  ${String(s.start).padStart(6)}s -> ${String(s.end).padStart(6)}s   ${s.d}s`));
console.log();

console.log("=== SEBARAN JEDA ANTAR RENTANG ===");
const gaps = [];
for (let i = 0; i < segments.length - 1; i += 1) {
  gaps.push(Number((segments[i + 1].start - segments[i].end).toFixed(2)));
}
gaps.sort((a, b) => a - b);
const gq = (p) => gaps[Math.floor(p * (gaps.length - 1))];
console.log("min / p25 / median / p75 / max :", gq(0), "/", gq(0.25), "/", gq(0.5), "/", gq(0.75), "/", gq(1));
console.log("jeda >= 1.0 dtk :", gaps.filter((g) => g >= 1).length, "(kandidat batas kalimat)");
console.log("jeda >= 2.0 dtk :", gaps.filter((g) => g >= 2).length, "(kandidat batas paragraf)");
