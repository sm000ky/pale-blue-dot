/**
 * Fetch the Golden Record gallery frames selected as third-party editorial candidates.
 *
 * These are NOT NASA public-domain assets. NASA's own contents page carries a blanket
 * notice over the displayed gallery:
 *
 *   "Due to copyright restrictions, only a subset of the images on the Golden Record are
 *    displayed above. All of these images are copyright protected. Reproduction without
 *    permission of the copyright holder is prohibited."
 *   — https://science.nasa.gov/mission/voyager/golden-record-contents/images/
 *
 * So every file this script writes is held under the third_party_editorial_candidate
 * status in src/lib/exploration/content.ts, with the per-image credit line recorded
 * verbatim from its own NASA detail page. Nothing here is cleared for publication;
 * the status only records that the frame is under editorial consideration.
 *
 * The originals are 640x480 GIFs — already well under the 900px editorial ceiling — so
 * `withoutEnlargement` keeps them at native size rather than inventing pixels. No crop:
 * these are the frames as the record carries them, and trimming one would misrepresent
 * what was actually sent.
 *
 * Run: node tools/fetch-golden-record-editorial.mjs
 */
import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "archive");
const MAX_WIDTH = 900;

/** slug = the NASA image-detail slug; the file lives at the matching uploads path. */
const PICKS = [
  { slug: "calibration-circle-31325346536-o", out: "gr-calibration-circle.webp" },
  { slug: "diagram-of-male-and-female-31326553496-o", out: "gr-diagram-male-female.webp" },
  { slug: "egypt-red-sea-sinal-peninsula-and-the-nile-30993198280-o", out: "gr-egypt-red-sea-nile.webp" },
  { slug: "supermarket-30555896943-o", out: "gr-supermarket.webp" },
  { slug: "fishing-boat-with-nets-30542208064-o", out: "gr-fishing-boat-with-nets.webp" },
];

await mkdir(OUT, { recursive: true });

let total = 0;
for (const { slug, out } of PICKS) {
  const url = `https://science.nasa.gov/wp-content/uploads/2024/03/${slug}.gif`;
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${slug}: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());

  const source = await sharp(buf).metadata();
  const outPath = path.join(OUT, out);
  const info = await sharp(buf)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(outPath);

  const { size } = await stat(outPath);
  total += size;
  console.log(
    `${out}\tsource ${source.width}x${source.height} ${source.format}\t-> ${info.width}x${info.height}\t${size} bytes (${(size / 1024).toFixed(1)} KB)\t${url}`,
  );
}
console.log(`TOTAL\t${total} bytes (${(total / 1024).toFixed(1)} KB)`);
