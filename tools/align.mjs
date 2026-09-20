// Penyelarasan paksa (forced alignment) takarir ke audio.
//
// Riwayat, supaya kesalahan yang sama tidak diulang:
//
//   v1  Pasangan cue-ke-rentang-bicara satu-lawan-satu. r = 0,06. Jumlah yang
//       kebetulan sama (57 = 57) ternyata bukan bukti pasangannya benar.
//   v2  Sebaran proporsional di garis waktu bersuara. r = 0,70, tetapi saat
//       didengar masih meleset karena cue boleh mulai di tengah rentang.
//   v3  DP dengan syarat cue mulai di awal rentang, tetapi rentangnya masih
//       rusak (ambang -48 dBFS terlalu longgar untuk stem vokal). r = 0,19.
//   v4  DP + rentang bersih (-36 dBFS). r = 0,82. Statistiknya bagus, tetapi
//       tetap meleset di telinga: SEMUA versi di atas hanya menebak dari
//       senyap, tanpa tahu kata apa yang sedang diucapkan.
//
//   v5  (ini) Berhenti menebak. Audio ditranskripsi dengan Whisper
//       (tools/transcribe.mjs, transformers.js/ONNX, tanpa Python), sehingga
//       tersedia waktu untuk teks yang benar-benar terdengar. Naskah asli lalu
//       ditambatkan ke transkrip itu dengan penjajaran barisan Needleman-Wunsch.
//       Transkrip Whisper TIDAK dipakai sebagai teks takarir — ia cuma penunjuk
//       waktu; naskah aslinya sudah benar dan tidak boleh diubah.
import { readFileSync, writeFileSync } from "node:fs";

// Catatan: durasi berkas (210,86 dtk) sengaja TIDAK dipakai sebagai batas waktu
// di mana pun. Ada 7,96 detik senyap di ekornya, dan memakai durasi berkas untuk
// menutup potongan terakhir Whisper melempar cue penutup sampai 1,6 detik sesudah
// suara habis. Batas yang berlaku adalah SPEECH_END di bawah.

/* ----------------------------------------------------- naskah asli (kebenaran) */

const src = readFileSync("src/lib/narration.ts", "utf8");
const block = src.slice(
  src.indexOf("const script: Paragraph[]"),
  src.indexOf("Waktu mulai"),
);

const cues = [];
const re = /\{ text: (["'])((?:\\.|(?!\1).)*)\1 \}/g;
let m;
while ((m = re.exec(block)) !== null) cues.push(m[2].replace(/\\(.)/g, "$1"));

const norm = (w) => w.toLowerCase().replace(/[^a-z']/g, "");

// Barisan kata naskah, tiap kata ingat cue asalnya.
const scriptWords = [];
cues.forEach((text, cueIndex) => {
  text
    .split(/\s+/)
    .map(norm)
    .filter(Boolean)
    .forEach((word, i) => scriptWords.push({ word, cueIndex, firstOfCue: i === 0 }));
});

/* -------------------------------------------- transkrip Whisper (penunjuk waktu) */

const whisper = JSON.parse(readFileSync("tools/whisper-words.json", "utf8"));

// Whisper tidak memberi waktu akhir untuk potongan terakhir. Memakai akhir berkas
// sebagai gantinya keliru: berkas ini punya 7,96 detik senyap di ekornya, sehingga
// potongan penutup jadi terbentang 14,58 detik dan kata-katanya tersebar jauh
// melewati batas suara — "the only home we've ever known." sempat jatuh di 204,5
// dtk, yaitu 1,6 detik SESUDAH Sagan berhenti bicara.
//
// Batas yang benar adalah akhir rentang bicara terakhir hasil VAD.
const vad = JSON.parse(readFileSync("tools/audio-segments.json", "utf8"));
const SPEECH_END = vad.segments[vad.segments.length - 1].end;

// Pecah tiap segmen jadi kata, waktunya diinterpolasi menurut posisi karakter.
// Kasar, tetapi galatnya hanya dalam satu segmen (rata-rata ~5 dtk) dan
// penjajaran barisan di bawah yang menentukan cue mana menempel di kata mana.
const whisperWords = [];
for (let i = 0; i < whisper.words.length; i += 1) {
  const chunk = whisper.words[i];
  const start = chunk.start ?? 0;
  const end = chunk.end ?? whisper.words[i + 1]?.start ?? SPEECH_END;
  const raw = String(chunk.text).split(/\s+/).filter(Boolean);
  const lens = raw.map((w) => w.length);
  const total = lens.reduce((a, b) => a + b, 0) || 1;
  let cum = 0;
  raw.forEach((w, k) => {
    const t = start + ((end - start) * cum) / total;
    cum += lens[k];
    const n = norm(w);
    if (n) whisperWords.push({ word: n, t: Number(t.toFixed(2)) });
  });
}

/* --------------------------------------- bersihkan halusinasi pengulangan */

// Whisper kadang mengulang frasa di batas jendela 30 dtk — di berkas ini terjadi
// pada segmen 44,56 dtk ("every king and peasant..." diulang) dan 164,84 dtk
// ("...which our species could migrate. Visit? Yes." diulang). Pengulangan itu
// menarik jangkar ke belakang dan membuat cue di sekitarnya kebagian 0,3-0,7 dtk.
// Buang blok yang persis mengulang blok tepat sebelumnya.
function dropAdjacentRepeats(words, minBlock = 3) {
  const out = [];
  for (let k = 0; k < words.length; k += 1) {
    let skipped = false;
    // Cari blok panjang yang mengulang ekor keluaran.
    for (let len = Math.min(12, out.length); len >= minBlock; len -= 1) {
      if (k + len > words.length) continue;
      let same = true;
      for (let d = 0; d < len; d += 1) {
        if (out[out.length - len + d].word !== words[k + d].word) {
          same = false;
          break;
        }
      }
      if (same) {
        k += len - 1; // lewati blok ulangan
        skipped = true;
        break;
      }
    }
    if (!skipped) out.push(words[k]);
  }
  return out;
}

const beforeDedup = whisperWords.length;
const deduped = dropAdjacentRepeats(whisperWords);
whisperWords.length = 0;
whisperWords.push(...deduped);

// Waktu harus menaik setelah pembuangan; paksa monoton agar interpolasi aman.
for (let k = 1; k < whisperWords.length; k += 1) {
  if (whisperWords[k].t < whisperWords[k - 1].t) whisperWords[k].t = whisperWords[k - 1].t;
}

/* ------------------------------------ penjajaran barisan (Needleman-Wunsch) */

const A = scriptWords.length;
const B = whisperWords.length;
const MATCH = 2;
const MISMATCH = -1;
const GAP = -1;

// Matriks skor. A dan B masing-masing ratusan kata, jadi ukurannya aman.
const score = Array.from({ length: A + 1 }, () => new Float64Array(B + 1));
const back = Array.from({ length: A + 1 }, () => new Uint8Array(B + 1)); // 1=diag 2=atas 3=kiri

for (let i = 1; i <= A; i += 1) {
  score[i][0] = i * GAP;
  back[i][0] = 2;
}
for (let j = 1; j <= B; j += 1) {
  score[0][j] = j * GAP;
  back[0][j] = 3;
}

for (let i = 1; i <= A; i += 1) {
  const a = scriptWords[i - 1].word;
  for (let j = 1; j <= B; j += 1) {
    const same = a === whisperWords[j - 1].word;
    const diag = score[i - 1][j - 1] + (same ? MATCH : MISMATCH);
    const up = score[i - 1][j] + GAP;
    const left = score[i][j - 1] + GAP;
    let best = diag;
    let dir = 1;
    if (up > best) {
      best = up;
      dir = 2;
    }
    if (left > best) {
      best = left;
      dir = 3;
    }
    score[i][j] = best;
    back[i][j] = dir;
  }
}

// Runut balik: catat waktu Whisper untuk tiap kata naskah yang berpasangan.
const timeOfScriptWord = new Array(A).fill(null);
let i = A;
let j = B;
let matched = 0;
while (i > 0 || j > 0) {
  const dir = back[i][j];
  if (dir === 1) {
    timeOfScriptWord[i - 1] = whisperWords[j - 1].t;
    if (scriptWords[i - 1].word === whisperWords[j - 1].word) matched += 1;
    i -= 1;
    j -= 1;
  } else if (dir === 2) {
    i -= 1;
  } else {
    j -= 1;
  }
}

/* --------------------------------------------------- waktu mulai tiap cue */

// Waktu cue = waktu kata pertamanya. Bila kata itu tidak berpasangan (Whisper
// salah dengar), mundur ke kata berikutnya di cue yang sama, lalu ke tetangga.
const starts = [];
for (let c = 0; c < cues.length; c += 1) {
  const idxs = [];
  scriptWords.forEach((w, k) => {
    if (w.cueIndex === c) idxs.push(k);
  });
  let t = null;
  for (const k of idxs) {
    if (timeOfScriptWord[k] !== null) {
      t = timeOfScriptWord[k];
      break;
    }
  }
  starts.push(t);
}

// Isi lubang dengan interpolasi linear antar jangkar yang diketahui.
for (let c = 0; c < starts.length; c += 1) {
  if (starts[c] !== null) continue;
  let prev = c - 1;
  while (prev >= 0 && starts[prev] === null) prev -= 1;
  let next = c + 1;
  while (next < starts.length && starts[next] === null) next += 1;
  const a = prev >= 0 ? starts[prev] : 0;
  const b = next < starts.length ? starts[next] : SPEECH_END;
  const span = next - prev;
  starts[c] = a + ((b - a) * (c - prev)) / span;
}

/* ------------------------------------------ perbaiki jangkar yang mustahil */

// Whisper berhalusinasi mengulang frasa di batas jendela 30 dtk (di berkas ini
// sekitar 44 dtk dan 164 dtk). Pengulangan itu tidak berdampingan langsung
// sehingga tak bisa dibuang sebagai blok, tapi ia menarik satu-dua jangkar ke
// tempat yang salah — terlihat sebagai cue yang kebagian 0,3-0,7 dtk untuk
// kalimat sepanjang 44 karakter.
//
// Karena itu jangkar tidak ditelan mentah-mentah: cue yang menuntut laju bicara
// di luar batas manusia dinyatakan tidak tepercaya, lalu waktunya dihitung ulang
// dengan membagi rentang antara dua jangkar tepercaya terdekat secara
// proporsional terhadap jumlah karakter. Jangkar yang wajar tidak disentuh.
const MAX_CPS = 22; // di atas ini mustahil untuk pembacaan lambat
const MIN_CPS = 2.2; // di bawah ini cuma masuk akal untuk jeda dramatis terakhir

const lensOf = cues.map((t) => t.length);
const trusted = new Array(cues.length).fill(true);
for (let c = 0; c < cues.length; c += 1) {
  const end = c + 1 < starts.length ? starts[c + 1] : SPEECH_END;
  const dur = end - starts[c];
  if (dur <= 0) {
    trusted[c] = false;
    continue;
  }
  const cps = lensOf[c] / dur;
  // Baris penutup memang ditahan lama; jangan hukum yang lambat di ujung.
  if (cps > MAX_CPS || (cps < MIN_CPS && c < cues.length - 3)) trusted[c] = false;
}
// Jangkar pertama dan terakhir selalu dipertahankan agar interpolasi punya tepi.
trusted[0] = true;

const repaired = starts.slice();
let c = 0;
while (c < cues.length) {
  if (trusted[c]) {
    c += 1;
    continue;
  }
  let end = c;
  while (end < cues.length && !trusted[end]) end += 1;
  const aIdx = c - 1;
  const bIdx = end;
  const aTime = repaired[aIdx];
  const bTime = bIdx < cues.length ? repaired[bIdx] : SPEECH_END;
  // Bagi rentang [aTime, bTime] menurut panjang karakter cue aIdx..bIdx-1.
  let weight = 0;
  for (let k = aIdx; k < bIdx; k += 1) weight += lensOf[k];
  let cum = lensOf[aIdx];
  for (let k = c; k < bIdx; k += 1) {
    repaired[k] = aTime + ((bTime - aTime) * cum) / weight;
    cum += lensOf[k];
  }
  c = end;
}

const repairedCount = trusted.filter((t) => !t).length;

// Jaga urutan menaik ketat, dan majukan sedikit agar teks siap saat kata bunyi.
const LEAD = 0.15;
const MIN_STEP = 0.3;
const final = [];
let prev = -Infinity;
for (const t of repaired) {
  const v = Math.max(prev + MIN_STEP, t - LEAD, 0);
  final.push(Number(v.toFixed(2)));
  prev = final[final.length - 1];
}

/* --------------------------------------------------------------- verifikasi */

const rows = cues.map((text, k) => {
  const end = k + 1 < final.length ? final[k + 1] : SPEECH_END;
  const dur = Number((end - final[k]).toFixed(2));
  return { k, text, dur, len: text.length, cps: Number((text.length / dur).toFixed(1)) };
});

const sorted = rows.map((r) => r.cps).sort((a, b) => a - b);
const median = sorted[Math.floor(sorted.length / 2)];
const n = rows.length;
const mL = rows.reduce((s, r) => s + r.len, 0) / n;
const mD = rows.reduce((s, r) => s + r.dur, 0) / n;
let num = 0;
let dx = 0;
let dy = 0;
for (const r of rows) {
  const p = r.len - mL;
  const q = r.dur - mD;
  num += p * q;
  dx += p * p;
  dy += q * q;
}
const pearson = num / Math.sqrt(dx * dy);
const anchored = timeOfScriptWord.filter((t) => t !== null).length;

console.log("kata naskah      :", A);
console.log("kata whisper     :", B, `(dari ${beforeDedup}, ${beforeDedup - B} ulangan dibuang)`);
console.log("kata berpasangan :", matched, `(${((matched / A) * 100).toFixed(0)}% dari naskah)`);
console.log("kata tertambat   :", anchored, `(${((anchored / A) * 100).toFixed(0)}%)`);
console.log("jangkar diperbaiki:", repairedCount, "dari", cues.length);
console.log("laju median      :", median, "karakter/detik");
console.log("korelasi         : r =", pearson.toFixed(3));
console.log("rentang          :", final[0], "->", final[n - 1], "dtk");
console.log();
console.log("=== 6 penyimpangan terbesar ===");
rows
  .map((r) => ({ ...r, dev: Math.abs(Math.log(r.cps / median)) }))
  .sort((a, b) => b.dev - a.dev)
  .slice(0, 6)
  .forEach((r) =>
    console.log(
      `  #${String(r.k + 1).padStart(2)} ${String(r.dur).padStart(5)}s ${String(r.cps).padStart(5)} c/s  "${r.text.slice(0, 46)}"`,
    ),
  );
console.log();
console.log("=== 12 cue pertama ===");
rows.slice(0, 12).forEach((r) => console.log(`  ${String(final[r.k]).padStart(6)}s  "${r.text}"`));
console.log();
console.log("=== cue yang disebut user ===");
["every mother and father,", "every young couple in love,", "hopeful child, inventor and explorer,"].forEach((t) => {
  const k = cues.indexOf(t);
  if (k >= 0) console.log(`  ${String(final[k]).padStart(6)}s  "${t}"`);
});

writeFileSync("tools/aligned-starts.json", JSON.stringify(final));
