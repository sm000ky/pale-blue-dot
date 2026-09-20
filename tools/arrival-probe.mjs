// Cari baris narasi yang terdengar pada beberapa kandidat waktu tiba kamera,
// supaya pemilihan durasi kedatangan punya alasan naratif, bukan angka bulat.
import { readFileSync } from "node:fs";

const nar = readFileSync("src/lib/narration.ts", "utf8");
const block = nar.slice(
  nar.indexOf("const script: Paragraph[]"),
  nar.indexOf("Waktu mulai"),
);

const texts = [];
const re = /\{ text: (["'])((?:\\.|(?!\1).)*)\1 \}/g;
let m;
while ((m = re.exec(block)) !== null) texts.push(m[2].replace(/\\(.)/g, "$1"));

const starts = nar
  .match(/const MEASURED_STARTS[^=]*=\s*\[([\s\S]*?)\];/)[1]
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean)
  .map(Number);

const lineAt = (t) => {
  let i = 0;
  for (let k = 0; k < starts.length; k += 1) if (starts[k] <= t) i = k;
  return texts[i];
};

console.log("Baris yang sedang terdengar pada tiap kandidat waktu tiba:\n");
for (const t of [40, 60, 75, 90, 105, 120]) {
  console.log(`  ${String(t).padStart(3)}s  "${lineAt(t)}"`);
}

console.log("\nBaris kunci dan waktunya:");
const keys = [
  "Consider again that dot.",
  "that's us.",
  "on a mote of dust suspended in a sunbeam.",
  "The Earth is a very small stage in a vast cosmic arena.",
  "are challenged by this point of pale light.",
];
for (const k of keys) {
  const i = texts.indexOf(k);
  if (i >= 0) console.log(`  ${String(starts[i]).padStart(6)}s  "${k}"`);
}
