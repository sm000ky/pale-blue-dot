// Transkripsi sagan-vocals.mp3 dengan timestamp per kata, memakai Whisper
// lewat transformers.js (ONNX). Tidak butuh Python sama sekali.
//
// Keluarannya BUKAN untuk dipakai sebagai teks takarir — naskah aslinya sudah
// ada dan sudah benar. Yang dipakai hanya WAKTU tiap kata, untuk menambatkan
// naskah itu ke audio (forced alignment) menggantikan tebakan berbasis senyap.
import { pipeline } from "@huggingface/transformers";
import { MPEGDecoder } from "mpg123-decoder";
import { readFileSync, writeFileSync } from "node:fs";

const SRC = "C:/Users/user/pale-blue-dot/public/audio/sagan-vocals.mp3";
const TARGET_RATE = 16000; // Whisper selalu 16 kHz

console.log("[1/4] dekode mp3...");
const decoder = new MPEGDecoder();
await decoder.ready;
const { channelData, samplesDecoded, sampleRate } = decoder.decode(
  new Uint8Array(readFileSync(SRC)),
);
decoder.free();

// mono
const mono = new Float32Array(samplesDecoded);
for (let i = 0; i < samplesDecoded; i += 1) {
  let sum = 0;
  for (const ch of channelData) sum += ch[i];
  mono[i] = sum / channelData.length;
}
console.log(`      ${(samplesDecoded / sampleRate).toFixed(2)} dtk @ ${sampleRate} Hz`);

console.log("[2/4] resample ke 16 kHz...");
const ratio = sampleRate / TARGET_RATE;
const outLen = Math.floor(samplesDecoded / ratio);
const audio = new Float32Array(outLen);
for (let i = 0; i < outLen; i += 1) {
  const pos = i * ratio;
  const i0 = Math.floor(pos);
  const i1 = Math.min(i0 + 1, samplesDecoded - 1);
  const frac = pos - i0;
  audio[i] = mono[i0] * (1 - frac) + mono[i1] * frac;
}
console.log(`      ${outLen} sampel (${(outLen / TARGET_RATE).toFixed(2)} dtk)`);

console.log("[3/4] muat model whisper (unduh sekali, lalu di-cache)...");
const transcriber = await pipeline(
  "automatic-speech-recognition",
  "onnx-community/whisper-base.en",
  { dtype: "q8" },
);

console.log("[4/4] transkripsi dengan timestamp per segmen...");
const t0 = Date.now();
const result = await transcriber(audio, {
  return_timestamps: true,
  chunk_length_s: 30,
  stride_length_s: 5,
});
console.log(`      selesai dalam ${((Date.now() - t0) / 1000).toFixed(0)} dtk`);

const words = (result.chunks ?? []).map((c) => ({
  text: String(c.text).trim(),
  start: c.timestamp?.[0] ?? null,
  end: c.timestamp?.[1] ?? null,
}));

writeFileSync(
  "C:/Users/user/pale-blue-dot/tools/whisper-words.json",
  JSON.stringify({ model: "whisper-base.en", count: words.length, words }, null, 1),
);

console.log();
console.log("kata terdeteksi :", words.length);
console.log("30 kata pertama :");
words.slice(0, 30).forEach((w) => console.log(`  ${String(w.start).padStart(7)}s  ${w.text}`));
