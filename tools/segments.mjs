// Deteksi rentang bicara di sagan-vocals.mp3.
//
// Parameter di bawah dipilih lewat penyapuan (tools/sweep.mjs), bukan ditebak.
// Ambang pertama yang dipakai (-48 dBFS) menghasilkan satu rentang sepanjang
// 14,64 detik tanpa jeda — mustahil untuk pidato. Berkas ini hasil pemisahan
// stem vokal, sehingga rembesan sisa menahan level di atas ambang dan senyap
// asli tidak terbaca. Ambang yang lebih ketat memecahnya kembali menjadi frasa.
import { MPEGDecoder } from "mpg123-decoder";
import { readFileSync, writeFileSync } from "node:fs";

const SRC = "public/audio/sagan-vocals.mp3";
const THRESHOLD_DB = -36; // lebih ketat dari -48 karena ada rembesan stem
const MIN_GAP_SEC = 0.12; // senyap sependek ini sudah dihitung sebagai jeda
const FRAME_SEC = 0.02;
const MIN_SEGMENT_SEC = 0.1;

const decoder = new MPEGDecoder();
await decoder.ready;
const { channelData, samplesDecoded, sampleRate } = decoder.decode(
  new Uint8Array(readFileSync(SRC)),
);
decoder.free();

const n = samplesDecoded;
const mono = new Float32Array(n);
for (let i = 0; i < n; i += 1) {
  let sum = 0;
  for (const ch of channelData) sum += ch[i];
  mono[i] = sum / channelData.length;
}

const frame = Math.round(sampleRate * FRAME_SEC);
const frames = Math.floor(n / frame);
const db = new Float32Array(frames);
for (let f = 0; f < frames; f += 1) {
  let acc = 0;
  const off = f * frame;
  for (let i = 0; i < frame; i += 1) {
    const v = mono[off + i];
    acc += v * v;
  }
  db[f] = 20 * Math.log10(Math.sqrt(acc / frame) + 1e-12);
}

const minGapFrames = Math.round(MIN_GAP_SEC / FRAME_SEC);
const speaking = Array.from(db, (v) => v > THRESHOLD_DB);
const raw = [];
let start = null;
let silence = 0;
for (let i = 0; i < speaking.length; i += 1) {
  if (speaking[i]) {
    if (start === null) start = i;
    silence = 0;
  } else if (start !== null) {
    silence += 1;
    if (silence >= minGapFrames) {
      raw.push([start, i - silence]);
      start = null;
      silence = 0;
    }
  }
}
if (start !== null) raw.push([start, speaking.length - silence]);

const segments = raw
  .map(([s, e]) => ({
    start: Number((s * FRAME_SEC).toFixed(2)),
    end: Number((e * FRAME_SEC).toFixed(2)),
  }))
  .filter((s) => s.end - s.start >= MIN_SEGMENT_SEC);

const duration = Number((n / sampleRate).toFixed(2));
const speech = segments.reduce((a, s) => a + (s.end - s.start), 0);
const durs = segments.map((s) => s.end - s.start).sort((a, b) => a - b);

writeFileSync(
  "tools/audio-segments.json",
  JSON.stringify(
    {
      source: SRC,
      method: `RMS ${FRAME_SEC * 1000}ms, ambang ${THRESHOLD_DB} dBFS, jeda min ${MIN_GAP_SEC}s, tanpa penggabungan`,
      duration,
      count: segments.length,
      segments,
    },
    null,
    2,
  ),
);

console.log("durasi   :", duration, "dtk");
console.log("rentang  :", segments.length);
console.log("bersuara :", speech.toFixed(1), "dtk");
console.log("median   :", durs[Math.floor(durs.length / 2)].toFixed(2), "dtk");
console.log("maks     :", durs[durs.length - 1].toFixed(2), "dtk");
