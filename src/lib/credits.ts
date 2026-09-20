/**
 * Atribusi — bagian yang tidak diterjemahkan.
 *
 * Semua tautan diverifikasi ulang pada September 2026.
 *
 * Tiga dari sumber di bawah berlisensi CC BY 4.0, yang mewajibkan penyebutan judul,
 * pencipta, lisensi, dan tautan sumber — karena itu keempat unsur tersebut harus
 * benar-benar tampil di UI, bukan sekadar disimpan di sini.
 *
 * Yang tersisa di berkas ini hanyalah hal yang sama di semua bahasa dan harus tampil
 * apa adanya: nama pencipta, nama lisensi, judul yang berupa nama, dan tautan sumber.
 * Deskripsi karya serta pernyataan status hak dalam bentuk prosa pindah ke
 * `credits-copy.ts`, yang menyediakannya dalam tujuh bahasa.
 */

import type { CreditCopyKey } from "@/lib/credits-copy";

export type Credit = {
  /**
   * Which row label in the UI table names this credit, and which entry in
   * `credits-copy.ts` describes it. The label and the description are translated;
   * everything else on this record is not.
   */
  roleKey: CreditCopyKey;
  /**
   * The work's own name, where its title is a name rather than a description —
   * "Aurora", or a form of words a platform requires. Left off where the title is
   * prose, and `credits-copy.ts` supplies it per locale.
   */
  title?: string;
  author: string;
  /**
   * The licence's own name, or the rights line the holder states. Never translated,
   * and it wins over the prose rights status in `credits-copy.ts`: "CC BY 4.0" says
   * more, and says it precisely.
   */
  license?: string;
  /**
   * A required form of words, printed verbatim on its own line.
   *
   * Pixabay asks for "Sound Effect by <creator> from Pixabay". That is a condition
   * of use, not a sentence about the work, so it is neither translated nor
   * paraphrased — and it is kept apart from `title` so the track can be named by
   * its actual name.
   */
  attribution?: string;
  href?: string;
};

export const credits: Credit[] = [
  {
    // The copyright line is the attribution, and it is not shortened: it names both
    // holders and both years, which "© Democritus Properties" would not. It sits in
    // `license` because it is the rights statement for this work and must appear
    // verbatim in every language.
    //
    // What is deliberately NOT asserted anywhere near it: that holding the printed
    // text's copyright line settles the rights in the RECORDING. Those are two
    // different works, the project holds no document about the second, and a rights
    // sheet that quietly implies otherwise is worse than one that says less.
    roleKey: "narration",
    author: "Carl Sagan",
    license: "© 1994 Carl Sagan · © 2006 Democritus Properties, LLC",
    href: "https://www.planetary.org/worlds/pale-blue-dot",
  },
  {
    // scottbuckley.com.au meminta atribusi berbunyi:
    // '"Aurora" by Scott Buckley - released under CC-BY 4.0. www.scottbuckley.com.au'
    // Baris ini memuat seluruh unsurnya: judul, pencipta, lisensi, dan tautan.
    roleKey: "music",
    title: '"Aurora"',
    author: "Scott Buckley",
    license: "CC BY 4.0",
    href: "https://www.scottbuckley.com.au/library/aurora/",
  },
  {
    // Berkasnya tidak memuat tag ID3 apa pun, jadi sumbernya sempat tidak dapat
    // ditelusuri dan kolom ini pernah berbunyi "lisensi belum diverifikasi". Sumber
    // dan bentuk atribusinya kemudian disediakan pemilik proyek.
    //
    // Judulnya kini nama treknya sendiri — "Warbling 28" — dan susunan yang diminta
    // Pixabay pindah ke `attribution`, tercetak apa adanya. Sebelumnya susunan itu
    // menempati kolom judul, sehingga treknya tidak pernah benar-benar disebut
    // namanya. Peran barisnya juga bukan lagi "musik penutup": di sumbernya ini
    // terdaftar sebagai efek suara, dan Pixabay menyajikannya dari /sound-effects/.
    // Terpasang di build: <audio ref={encoreRef} src="/audio/earth-bretbernhoft.mp3">
    // dan diputar oleh handleMusicEnded ketika "Aurora" selesai.
    roleKey: "encore",
    title: '"Warbling 28"',
    author: "Bret Bernhoft",
    license: "Pixabay Content License",
    attribution: "Sound Effect by Bret Bernhoft from Pixabay",
    href: "https://pixabay.com/sound-effects/warbling-28-456902/",
  },
  {
    roleKey: "textures",
    author: "Solar System Scope (INOVE)",
    license: "CC BY 4.0",
    href: "https://www.solarsystemscope.com/textures/",
  },
  {
    // Sebelumnya baris ini menyebut PIA00452, foto 1990 yang asli. Yang tampil di bab
    // 01 adalah PIA23645, hasil pemrosesan ulang NASA pada 2020; PIA00452 ada di disk
    // dan tidak dipakai beat mana pun. `credits-sequence.ts` sudah menemukan hal ini
    // lebih dulu — panel ini yang tertinggal.
    roleKey: "referencePhoto",
    author: "NASA/JPL-Caltech",
    href: "https://science.nasa.gov/photojournal/pale-blue-dot-revisited/",
  },
  {
    // Disebut satu per satu, bukan diringkas jadi "empat citra lain". Ringkasan itu
    // memaksa pembaca memercayai hitungan yang tidak bisa ia periksa; daftar ini
    // bisa dicocokkan langsung dengan apa yang muncul di layar.
    //
    // Keempatnya diturunkan dari pemakaian nyata di runtime — `archiveImages.*` yang
    // benar-benar dirujuk beat di content.ts. Tiga berkas lain ada di public/archive/
    // dan tidak pernah dirender (PIA00452, dua foto 1977), jadi tiga-tiganya TIDAK
    // dikreditkan di sini. Mengkreditkan berkas yang tak pernah tampil bukan kemurahan
    // hati, melainkan keterangan yang keliru.
    //
    // Judulnya sama persis di sembilan bahasa: ini nama yang diterbitkan NASA.
    roleKey: "archivePlates",
    title:
      "Solar System Family Portrait — PIA00451\n" +
      "Voyager in Space — Artist's Concept, PIA17049\n" +
      "Voyager Golden Record — Front\n" +
      "Voyager Golden Record — Cover",
    author: "NASA/JPL-Caltech",
    href: "https://science.nasa.gov/mission/voyager/",
  },
];
