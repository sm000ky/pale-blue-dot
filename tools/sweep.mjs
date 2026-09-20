// Cari ambang deteksi suara yang benar untuk berkas ini.
//
// Ambang pertama (-48 dBFS) menghasilkan satu "rentang bicara" sepanjang 14,64
// detik tanpa jeda — mustahil untuk pidato. Berkas ini hasil pemisahan stem
// vokal, jadi diduga masih ada rembesan yang menahan level di atas ambang
// sehingga senyap asli tidak terbaca.
//
// Kriteria rentang yang sehat untuk pidato lambat: median 1-3 dtk, maksimum di
// bawah ~6 dtk, dan jumlah rentang tidak jauh dari jumlah cue (57).
import { readFileSync } from "node:fs";

const { frameSec, db } = JSON.parse(
  readFileSync(process.env.TEMP + "/pbd-align/db.json", "utf8"),
);

function segmentize(thresh, minGapSec, mergeGapSec) {
  const minGap = Math.round(minGapSec / frameSec);
  const speaking = db.map((v) => v > thresh);
  const segs = [];
  let start = null;
  let silence = 0;
  for (let i = 0; i < speaking.length; i += 1) {
    if (speaking[i]) {
      if (start === null) start = i;
      silence = 0;
    } else if (start !== null) {
      silence += 1;
      if (silence >= minGap) {
        segs.push([start, i - silence]);
        start = null;
        silence = 0;
      }
    }
  }
  if (start !== null) segs.push([start, speaking.length - silence]);

  const out = [];
  for (const [s, e] of segs) {
    const seg = { start: +(s * frameSec).toFixed(2), end: +(e * frameSec).toFixed(2) };
    const last = out[out.length - 1];
    if (last && seg.start - last.end < mergeGapSec) last.end = seg.end;
    else out.push(seg);
  }
  return out.filter((s) => s.end - s.start >= 0.1);
}

const stat = (segs) => {
  const d = segs.map((s) => +(s.end - s.start).toFixed(2)).sort((a, b) => a - b);
  const q = (p) => d[Math.floor(p * (d.length - 1))];
  const speech = d.reduce((a, b) => a + b, 0);
  return { n: segs.length, med: q(0.5), max: q(1), speech: +speech.toFixed(1) };
};

console.log("ambang  jedaMin  gabung |  n  median   max   bicara");
console.log("------------------------+---------------------------");
for (const th of [-48, -44, -40, -36, -32, -28]) {
  for (const gap of [0.12, 0.2]) {
    for (const merge of [0.0, 0.25]) {
      const s = stat(segmentize(th, gap, merge));
      const flag = s.n >= 45 && s.n <= 90 && s.max <= 6.5 ? "  <== layak" : "";
      console.log(
        `${String(th).padStart(5)}   ${String(gap).padStart(5)}   ${String(merge).padStart(5)} | ${String(s.n).padStart(3)} ${String(s.med).padStart(6)} ${String(s.max).padStart(6)} ${String(s.speech).padStart(7)}${flag}`,
      );
    }
  }
}
