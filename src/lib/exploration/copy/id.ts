/**
 * Indonesian — the first translation, and the one written before the localisation
 * architecture existed.
 *
 * It therefore carries its eyebrows and its `mediaAlt` strings in full, where the
 * five locales added later carry only what they change. Both work: `beatCopy` merges
 * over English either way. It is left as it is because the eyebrows here are
 * identical to the English ones and rewriting a verified table to prove a point is
 * not a change worth the risk.
 *
 * The six planets keep their Indonesian names. They are the one list in the piece
 * that is prose rather than instrument marking — a reader is naming worlds, not
 * reading a panel — and 'Bumi' is what those worlds are called in the language the
 * rest of the sentence is in.
 */

import type { BeatCopy } from "./types";

const COVER_ALT_ID =
  "Sampul Golden Record yang digores, difoto di atas latar hitam. Ada empat kelompok diagram pada permukaan emasnya: piringan beserta jarumnya di kiri atas, cara membaca gambar di kanan atas, peta pulsar yang memancar di kiri bawah, dan dua atom hidrogen di kanan bawah.";

const VOYAGER_ALT_ID =
  "Gambaran seniman tentang wahana Voyager di depan latar bintang hitam: piringan antena putih menghadap menjauh, batang instrumen dan generator radioisotop terpasang pada rangka di satu sisi, dan dua antena panjang menjulur keluar bingkai.";

export const id: Record<string, BeatCopy> = {
  /* --------------------------------------------------------- 01 photograph */

  "photo-intro": {
    eyebrow: "01 / THE PHOTOGRAPH",
    heading: "THE PALE\nBLUE DOT",
    body: "Pada 14 Februari 1990, Voyager 1 menoleh kembali ke arah dunia yang telah ditinggalkannya.",
  },
  "photo-distance": {
    eyebrow: "~6 BILLION KM",
    body: "Dari jarak sekitar enam miliar kilometer dari Matahari, Bumi hanya menjadi titik cahaya.",
    note: "Dihitung dari Matahari. Keterangan arsip NASA juga menyebut jarak miring dari Bumi lebih dari empat miliar mil — foto yang sama, titik acuan yang berbeda.",
  },
  "photo-pixel": {
    eyebrow: "0.12 PIXEL",
    body: "Di kamera sudut-sempit Voyager, Bumi hanya sekitar 0,12 piksel.",
    note: "Kamera sudut-sempit 1500 mm. Halaman NASA yang lebih baru membulatkannya menjadi sekitar satu piksel.",
  },
  "photo-plate": {
    eyebrow: "14 FEB 1990",
    note: "Data 1990, diolah ulang oleh NASA/JPL pada 2020.",
    mediaAlt:
      "Bidang biru keabu-abuan pucat dilintasi pita cahaya matahari yang berhambur. Di dalam pita itu, sedikit di kanan tengah, ada satu bintik putih: Bumi.",
  },

  /* ---------------------------------------------------------- 02 last look */

  "lastlook-frames": {
    eyebrow: "60 FRAMES",
    body: "Pale Blue Dot bukan foto yang berdiri sendiri.\n\nIa adalah bagian dari rangkaian terakhir yang membentuk potret Tata Surya.",
  },
  "lastlook-worlds": {
    eyebrow: "SIX PLANETS",
    heading: "Venus\nBumi\nJupiter\nSaturnus\nUranus\nNeptunus",
    body: "Enam planet terlihat sebagai titik-titik cahaya.",
  },
  "lastlook-plate": {
    eyebrow: "FAMILY PORTRAIT",
    mediaAlt:
      "Enam puluh bingkai kamera sudut-sempit disusun jadi mosaik melengkung di atas latar hitam, dengan enam sisipan berlabel Jupiter, Earth, Venus, Saturn, Uranus, dan Neptune. Di setiap sisipan, planetnya hanya berupa satu titik cahaya.",
  },
  "lastlook-cameras": {
    eyebrow: "THE LAST LOOK",
    body: "Setelah rangkaian itu, kamera Voyager 1 dimatikan.\n\nPerjalanannya berlanjut. Kameranya tidak.",
  },

  /* ----------------------------------------------------------- 03 voyager 1 */

  "voyager-intro": {
    eyebrow: "03 / VOYAGER 1",
    heading: "THE MACHINE\nTHAT KEPT GOING",
  },
  "voyager-1977": {
    eyebrow: "5 SEP 1977 · LAUNCH",
    body: "Voyager 1 meninggalkan Bumi dengan tujuan menuju planet-planet luar.",
    mediaAlt: VOYAGER_ALT_ID,
  },
  "voyager-1979": {
    eyebrow: "5 MAR 1979 · JUPITER",
    body: "Kurang dari dua tahun kemudian, ia melintas dekat Jupiter.",
    mediaAlt: VOYAGER_ALT_ID,
  },
  "voyager-1980": {
    eyebrow: "12 NOV 1980 · SATURN",
    body: "Setelah Saturnus, lintasannya membawanya terus keluar.",
    mediaAlt: VOYAGER_ALT_ID,
  },
  "voyager-2012": {
    eyebrow: "25 AUG 2012 · INTERSTELLAR SPACE",
    body: "Tiga puluh lima tahun setelah diluncurkan, Voyager 1 memasuki ruang antarbintang.",
    mediaAlt: VOYAGER_ALT_ID,
  },

  /* ----------------------------------------------------------- 04 message */

  "message-intro": {
    eyebrow: "04 / THE MESSAGE",
    heading: "VOYAGER\nCARRIES SOMETHING ELSE",
    body: "Voyager tidak hanya membawa instrumen ilmiah.\n\nDi sisinya terpasang sebuah rekaman tentang Bumi.",
  },
  "message-disc": {
    eyebrow: "GOLDEN RECORD",
    mediaAlt:
      "Piringannya sendiri: cakram emas yang memantul terang, labelnya digores “The Sounds of Earth”, “United States of America, Planet Earth”.",
  },
  "message-object": {
    eyebrow: "12 INCHES / 30 CM",
    body: "Sebuah piringan tembaga berlapis emas, berdiameter tiga puluh sentimeter.",
  },

  /* ------------------------------------------------------ 05 what we sent */

  "sent-intro": {
    eyebrow: "05 / WHAT WE SENT",
    heading: "IF YOU HAD\nONE RECORD",
    body: "Jika hanya satu benda yang bisa membawa kesan tentang Bumi, apa yang akan kita masukkan ke dalamnya?",
  },
  "sent-images": {
    eyebrow: "115 IMAGES",
    heading: "Tubuh.\nMakanan.\nBangunan.\nSains.\nAlam.\nKeluarga.\nPlanet tempat kita hidup.",
    body: "115 gambar dikodekan secara analog.",
  },

  "archive-measuring": {},
  "archive-where": {},
  "archive-planets": {},
  "archive-planet": {},
  "archive-life": {},
  "archive-begins": {},
  "archive-food": {},
  "archive-living": {},
  "archive-people": {},
  "archive-made": {},

  "sent-languages": {
    eyebrow: "55 LANGUAGES",
    body: "Lima puluh lima bahasa mengucapkan salam kepada siapa pun yang mungkin mendengar.",
  },
  "sent-sounds": {
    eyebrow: "SOUNDS OF EARTH",
    heading: "Ombak.\nAngin.\nGuntur.\nBurung.\nPaus.\nSuara kehidupan manusia.",
  },
  "sent-music": {
    eyebrow: "~90 MINUTES OF MUSIC",
    body: "Sekitar sembilan puluh menit musik, dipilih dari berbagai budaya dan zaman.",
  },

  /* ------------------------------------------------------ 06 instructions */

  "instructions-intro": {
    eyebrow: "06 / THE INSTRUCTIONS",
    heading: "NO SHARED\nLANGUAGE",
    body: "Piringan itu tidak menganggap penerimanya memahami bahasa manusia.\n\nInstruksinya ditulis dengan fisika.",
  },
  "cover-rotation": {
    eyebrow: "3.6 SECONDS",
    body: "Diagram pertama menjelaskan cara memutar piringan dan lama satu putaran.",
    mediaAlt: COVER_ALT_ID,
  },
  "cover-lines": {
    eyebrow: "512 LINES",
    body: "Diagram lain menjelaskan cara mengubah sinyal kembali menjadi gambar.",
    mediaAlt: COVER_ALT_ID,
  },
  "cover-pulsars": {
    eyebrow: "14 PULSARS",
    body: "Sebuah peta pulsar menunjukkan lokasi Tata Surya.\n\nBukan nama rumah kita. Koordinatnya.",
    mediaAlt: COVER_ALT_ID,
  },
  "cover-hydrogen": {
    eyebrow: "HYDROGEN",
    body: "Transisi atom hidrogen menjadi satuan waktu yang digunakan pada diagram.",
    mediaAlt: COVER_ALT_ID,
  },

  /* --------------------------------------------------- 07 still travelling */

  "travel-address": {
    eyebrow: "NO DESTINATION",
    body: "Golden Record tidak dikirim ke alamat tertentu.\n\nIa hanya ikut pergi bersama Voyager.",
  },
  "travel-40000": {
    eyebrow: "40,000 YEARS",
    body: "NASA mencatat bahwa sekitar empat puluh ribu tahun akan berlalu sebelum Voyager mendekati sistem planet lain.",
  },

  /* ---------------------------------------------------------------- 08 end */

  "end-reflection": {
    eyebrow: "08 / END",
    body: "Kita memotret rumah kita dari kejauhan.",
  },
  "end-carried": {
    body: "Lalu membawa sebagian kecil darinya lebih jauh lagi.",
  },

  "ack-intro": {
    eyebrow: "ACKNOWLEDGEMENTS",
    body: "Karya ini berdiri di atas pekerjaan para ilmuwan, insinyur, seniman, musisi, fotografer, arsiparis, dan pencerita yang membantu kita melihat Bumi dari kejauhan.\n\nApa yang mereka buat dan pelihara memungkinkan generasi setelah kita untuk tidak hanya mengetahui dari mana kita berasal — tetapi juga bagaimana kita pernah memandang diri kita sendiri.",
  },

  "end-dedication": {
    eyebrow: "DEDICATION",
    body: "Untuk mereka yang melihat lebih jauh, merekam dengan teliti, dan menyimpan apa yang mereka temukan —\n\nagar seseorang yang belum lahir masih dapat melihatnya.",
  },
  "end-quote": {
    // The quotation itself stays in the English Carter wrote it in — inherited from
    // `en`, not repeated here. The Indonesian rendering of it is NOT in this table:
    // it lives in `ui-strings.ts` as `carterTranslation`, with the six other
    // languages, and the sequence prints it underneath the original behind a
    // "Terjemahan" label. One code path for seven languages, instead of one locale
    // smuggling its translation through the body slot.
    note: "Jimmy Carter · Pesan yang disertakan pada Voyager Golden Record · 1977",
  },
};
