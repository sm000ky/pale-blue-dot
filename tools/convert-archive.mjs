// One-off: convert downloaded NASA archive originals to WebP (max width 1400, q82).
// Run: node tools/convert-archive.mjs
import sharp from "sharp";
import { readdir, stat, mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = process.argv[2] ?? "/tmp/nasa-dl";
const OUT = path.join(process.cwd(), "public", "archive");

const MAP = {
  "pbd-revisited.jpg": "pale-blue-dot-revisited.webp",
  "pbd-original.jpg": "pale-blue-dot-1990.webp",
  "family-portrait.jpg": "solar-system-family-portrait.webp",
  "gr-cover.jpg": "golden-record-cover.webp",
  "gr-front.jpg": "golden-record-front.webp",
  "gr-mounting.jpg": "golden-record-mounting-1977.webp",
  "gr-cleanroom.jpg": "golden-record-clean-room-1977.webp",
};

await mkdir(OUT, { recursive: true });

const files = await readdir(SRC);
let total = 0;
for (const f of files) {
  const outName = MAP[f];
  if (!outName) continue;
  const outPath = path.join(OUT, outName);
  const info = await sharp(path.join(SRC, f))
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(outPath);
  const { size } = await stat(outPath);
  total += size;
  console.log(
    `${outName}\t${info.width}x${info.height}\t${size} bytes (${(size / 1024).toFixed(1)} KB)`,
  );
}
console.log(`TOTAL\t${total} bytes (${(total / 1024).toFixed(1)} KB)`);
