/**
 * Narasi "Pale Blue Dot" — Carl Sagan (1994).
 *
 * Teks di bawah ini VERBATIM mengikuti naskah yang dipakai di rekaman audio
 * proyek ini, termasuk pembuka "From this distant vantage point" dan bentuk
 * "Consider again that dot" (bukan "Look again"), ejaan Amerika, serta tanda
 * kutip pada "superstar" dan "supreme leader".
 * Jangan dirapikan, dikoreksi, atau diterjemahkan.
 *
 * Hak cipta: © 1994 Carl Sagan, © 2006 Democritus Properties, LLC.
 * Lihat `src/lib/credits.ts`.
 */

/**
 * `index` adalah posisi cue di dalam `cues` (0-based). Ia dibawa serta karena
 * itulah kunci ke tabel terjemahan di `src/lib/locales.ts`, yang memang disusun
 * sejajar indeks — konsumen jadi tidak perlu mencari ulang posisi cue yang baru
 * saja dikembalikan `cueAt()`.
 */
export type Cue = { id: string; index: number; at: number; text: string };

/** Durasi audio `/public/audio/sagan-vocals.mp3` dalam detik (3m31s). */
export const NARRATION_DURATION: number = 211;

/**
 * Geser SELURUH cue (detik). Naikkan bila file audio punya senyap di awal
 * sehingga takarir mendahului suara; turunkan (negatif) bila takarir telat.
 * Nilai ini sudah ikut terhitung di `cues[].at`, jadi konsumen cukup memakai
 * `currentTime` audio apa adanya.
 */
export const NARRATION_OFFSET: number = 0;

/** Jeda hening sebelum kalimat pertama muncul. */
const LEAD_IN = 1.5;

/** Tambahan napas di akhir tiap paragraf (kecuali paragraf terakhir). */
const PARAGRAPH_PAUSE = 1.6;

/**
 * Bobot dasar per cue, dinyatakan dalam "setara karakter". Tanpa ini kalimat
 * pendek seperti "That's us." akan lewat terlalu cepat; Sagan justru menahannya.
 */
const CUE_BASE_WEIGHT = 10;

type CueSource = {
  text: string;
  /**
   * Pin manual (detik, relatif audio, sebelum NARRATION_OFFSET). Jika diisi,
   * cue ini dipaku ke waktu tersebut dan cue-cue sesudahnya ikut dihitung ulang
   * dari titik itu — dipakai untuk mengoreksi drift di tengah trek.
   */
  at?: number;
};

type Paragraph = { id: string; lines: CueSource[] };

/**
 * Pemecahan baris di sini murni soal ritme takarir: satu cue = satu napas.
 * Waktu kemunculannya TIDAK dihitung dari sini — lihat `MEASURED_STARTS`
 * di bawah, yang diukur langsung dari berkas audionya.
 *
 * Cara menyetel, dari yang paling murah:
 *   1. `NARRATION_OFFSET` — geser semua cue sekaligus (kasus paling umum).
 *   2. Satu angka di `MEASURED_STARTS` — perbaiki satu baris yang meleset.
 *   3. `at` pada baris di `script` — dipakai hanya bila jalur terukur mati.
 *
 * `LEAD_IN` / `PARAGRAPH_PAUSE` / `CUE_BASE_WEIGHT` kini cuma dipakai jalur
 * cadangan proporsional, yang aktif bila jumlah cue tak lagi cocok.
 */
const script: Paragraph[] = [
  {
    id: "p1",
    lines: [
      { text: "From this distant vantage point," },
      { text: "the Earth might not seem of particular interest." },
      { text: "But for us, it's different." },
      { text: "Consider again that dot." },
      { text: "That's here," },
      { text: "that's home," },
      { text: "that's us." },
      { text: "On it everyone you love," },
      { text: "everyone you know," },
      { text: "everyone you ever heard of," },
      { text: "every human being who ever was," },
      { text: "lived out their lives." },
    ],
  },
  {
    id: "p2",
    lines: [
      { text: "The aggregate of our joy and suffering," },
      { text: "thousands of confident religions, ideologies, and economic doctrines," },
      { text: "every hunter and forager," },
      { text: "every hero and coward," },
      { text: "every creator and destroyer of civilization," },
      { text: "every king and peasant," },
      { text: "every young couple in love," },
      { text: "every mother and father," },
      { text: "hopeful child, inventor and explorer," },
      { text: "every teacher of morals," },
      { text: "every corrupt politician," },
      { text: 'every "superstar," every "supreme leader,"' },
      { text: "every saint and sinner in the history of our species lived there –" },
      { text: "on a mote of dust suspended in a sunbeam." },
    ],
  },
  {
    id: "p3",
    lines: [
      { text: "The Earth is a very small stage in a vast cosmic arena." },
      { text: "Think of the rivers of blood spilled by all those generals and emperors" },
      { text: "so that, in glory and triumph," },
      { text: "they could become the momentary masters of a fraction of a dot." },
      { text: "Think of the endless cruelties visited by the inhabitants" },
      { text: "of one corner of this pixel" },
      { text: "on the scarcely distinguishable inhabitants of some other corner," },
      { text: "how frequent their misunderstandings," },
      { text: "how eager they are to kill one another," },
      { text: "how fervent their hatreds." },
    ],
  },
  {
    id: "p4",
    lines: [
      { text: "Our posturings, our imagined self-importance," },
      { text: "the delusion that we have some privileged position in the Universe," },
      { text: "are challenged by this point of pale light." },
      { text: "Our planet is a lonely speck in the great enveloping cosmic dark." },
      { text: "In our obscurity, in all this vastness," },
      { text: "there is no hint that help will come from elsewhere" },
      { text: "to save us from ourselves." },
    ],
  },
  {
    id: "p5",
    lines: [
      { text: "The Earth is the only world known so far to harbor life." },
      { text: "There is nowhere else, at least in the near future," },
      { text: "to which our species could migrate." },
      { text: "Visit, yes." },
      { text: "Settle, not yet." },
      { text: "Like it or not, for the moment" },
      { text: "the Earth is where we make our stand." },
    ],
  },
  {
    id: "p6",
    lines: [
      { text: "It has been said that astronomy is a humbling and character-building experience." },
      { text: "There is perhaps no better demonstration of the folly of human conceits" },
      { text: "than this distant image of our tiny world." },
      { text: "To me, it underscores our responsibility" },
      { text: "to deal more kindly with one another," },
      { text: "and to preserve and cherish the pale blue dot," },
      { text: "the only home we've ever known." },
    ],
  },
];

/**
 * Waktu mulai hasil PENYELARASAN ke audio, bukan tebakan. Dihasilkan oleh
 * `tools/align.mjs`; jalankan ulang skrip itu bila `script` di atas disunting.
 *
 * Cara kerjanya, dan kenapa begini:
 *
 * Audio ditranskripsi lebih dulu dengan Whisper (`tools/transcribe.mjs`,
 * transformers.js/ONNX — tanpa Python, tanpa layanan luar), menghasilkan
 * potongan teks bertimestamp untuk apa yang BENAR-BENAR terdengar. Naskah di
 * atas lalu ditambatkan ke transkrip itu memakai penjajaran barisan
 * Needleman-Wunsch pada tingkat kata: 380 kata naskah melawan 408 kata
 * transkrip, 370 di antaranya berpasangan persis (97%).
 *
 * Transkrip Whisper TIDAK dipakai sebagai teks takarir — ia hanya penunjuk
 * waktu. Naskahnya sudah benar dan tidak boleh disentuh; Whisper sendiri salah
 * dengar di beberapa tempat ("posturens", "the mode of dust").
 *
 * Whisper juga berhalusinasi mengulang frasa di batas jendela 30 detik (di
 * berkas ini sekitar detik 44 dan 164). Karena itu jangkar tidak ditelan
 * mentah-mentah: cue yang menuntut laju di luar batas manusia (>22 atau
 * <2,2 karakter/detik) dinyatakan tidak tepercaya dan waktunya dihitung ulang
 * proporsional di antara dua jangkar tepercaya terdekat. Pada jalankan terakhir
 * hanya 2 dari 57 cue yang perlu diperbaiki begitu.
 *
 * Empat percobaan sebelumnya gagal, dicatat agar tidak diulang:
 *   v1  Pasangan cue-ke-rentang-bicara satu-lawan-satu. r = 0,06 — jumlah yang
 *       kebetulan sama (57 = 57) bukan bukti pasangannya benar.
 *   v2  Sebaran proporsional di garis waktu bersuara. r = 0,70.
 *   v3  DP dengan rentang dari ambang -48 dBFS. r = 0,19 — ambangnya terlalu
 *       longgar untuk stem vokal; muncul "rentang bicara" 14,64 detik tanpa
 *       jeda, yang mustahil untuk pidato.
 *   v4  DP dengan rentang bersih (-36 dBFS). r = 0,82, statistiknya rapi,
 *       tetapi tetap meleset di telinga. Sebabnya sama untuk v1-v4: semuanya
 *       menebak dari SENYAP, tanpa tahu kata apa yang sedang diucapkan.
 *
 * Satu jebakan lagi yang sempat menggigit: Whisper tidak memberi waktu akhir
 * untuk potongan TERAKHIR. Memakai durasi berkas (210,86 dtk) sebagai gantinya
 * keliru, karena ada 7,96 detik senyap di ekor rekaman — potongan penutup jadi
 * terbentang 14,58 detik dan kata-katanya tersebar melewati batas suara,
 * sehingga "the only home we've ever known." jatuh di 204,50 dtk alias 1,60
 * detik SESUDAH Sagan berhenti bicara. Batas yang benar adalah akhir rentang
 * bicara terakhir hasil VAD (202,90 dtk); baris itu kini mulai di 199,93 dtk.
 * Perbaikan ini hanya menggeser cue penutup — 56 lainnya tidak berubah.
 *
 * Mutu versi ini: 97% kata tertambat, korelasi r = 0,838, laju median 10,6
 * karakter/detik, penyimpangan terburuk 20,9 c/s (sebelumnya 60,3). Sisa
 * penyimpangan jatuh pada baris yang Sagan memang tahan ("Settle, not yet.")
 * — itu retorika, bukan salah pasang.
 *
 * BATAS YANG HARUS DIKETAHUI: ini selaras dengan JEDA nyata di rekaman dan
 * dengan laju bicara yang masuk akal, tetapi BELUM diverifikasi kata-per-kata —
 * tidak ada speech-to-text yang dipakai. Kalau satu baris terasa meleset saat
 * didengar, ubah saja angkanya di sini; array ini memang untuk disetel tangan.
 */
const MEASURED_STARTS: readonly number[] = [
  0.00, 2.18, 7.05, 10.09, 12.88, 14.22,
  15.56, 17.37, 19.64, 21.37, 23.85, 25.85,
  28.28, 32.12, 37.40, 39.21, 41.46, 45.95,
  47.05, 49.15, 51.07, 54.73, 56.81, 59.09,
  62.46, 67.86, 73.33, 81.65, 87.92, 90.68,
  97.19, 101.33, 103.27, 108.23, 111.20, 114.00,
  116.45, 121.33, 126.57, 131.97, 140.17, 144.01,
  148.89, 152.17, 156.53, 160.12, 163.95, 165.15,
  168.65, 171.50, 174.93, 180.77, 185.19, 189.69,
  192.96, 195.85, 199.93,
];

function buildCues(): Cue[] {
  const flat = script.flatMap((paragraph, paragraphIndex) =>
    paragraph.lines.map((line, lineIndex) => ({
      id: `${paragraph.id}-${String(lineIndex + 1).padStart(2, "0")}`,
      line,
      weight: line.text.length + CUE_BASE_WEIGHT,
      // Napas ekstra hanya di batas antar-paragraf, bukan di ujung narasi.
      breathAfter:
        lineIndex === paragraph.lines.length - 1 && paragraphIndex < script.length - 1
          ? PARAGRAPH_PAUSE
          : 0,
    })),
  );

  // Jalur utama: pakai waktu terukur bila jumlahnya cocok dengan jumlah cue.
  // Kalau naskah disunting sehingga jumlahnya berubah, diam-diam jatuh kembali
  // ke perhitungan proporsional di bawah supaya modul tidak pernah rusak.
  if (MEASURED_STARTS.length === flat.length) {
    let previous = Number.NEGATIVE_INFINITY;
    return flat.map((cue, index) => {
      const at = Math.max(
        previous,
        Math.round((MEASURED_STARTS[index] + NARRATION_OFFSET) * 100) / 100,
      );
      previous = at;
      return { id: cue.id, index, at, text: cue.line.text };
    });
  }

  const totalWeight = flat.reduce((sum, cue) => sum + cue.weight, 0);
  const totalBreath = flat.reduce((sum, cue) => sum + cue.breathAfter, 0);
  const secondsPerWeight = (NARRATION_DURATION - LEAD_IN - totalBreath) / totalWeight;

  let cursor = LEAD_IN;
  let previousAt = Number.NEGATIVE_INFINITY;

  return flat.map((cue, index) => {
    const anchor = cue.line.at ?? cursor;
    // Math.max menjaga urutan tetap menaik meski ada pin manual yang keliru;
    // `cueAt` mengandalkan invariant itu untuk binary search.
    const at = Math.max(previousAt, Math.round((anchor + NARRATION_OFFSET) * 100) / 100);
    previousAt = at;
    cursor = anchor + cue.weight * secondsPerWeight + cue.breathAfter;
    return { id: cue.id, index, at, text: cue.line.text };
  });
}

/** Terurut menaik berdasarkan `at`. Dibangun sekali saat modul dimuat. */
export const cues: Cue[] = buildCues();

/**
 * Cue yang sedang aktif pada detik `time` (waktu audio, bukan waktu wall-clock):
 * cue terakhir dengan `at <= time`, atau `null` sebelum cue pertama muncul.
 * Binary search — aman dipanggil tiap frame.
 */
export function cueAt(time: number): Cue | null {
  if (!Number.isFinite(time)) return null;

  let low = 0;
  let high = cues.length - 1;
  let found = -1;

  while (low <= high) {
    const mid = (low + high) >> 1;
    if (cues[mid].at <= time) {
      found = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return found === -1 ? null : cues[found];
}
