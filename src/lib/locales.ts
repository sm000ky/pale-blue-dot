/**
 * Takarir dwibahasa.
 *
 * Bahasa Inggris adalah naskah asli yang benar-benar terdengar di rekaman, jadi
 * ia selalu tampil di atas dan tidak pernah bisa dimatikan. Bahasa pilihan
 * tampil di bawahnya, lebih kecil dan lebih redup — pendamping, bukan pengganti.
 *
 * Menambah bahasa: tambahkan satu entri di `locales` dan satu array di
 * `translations` yang panjangnya SAMA PERSIS dengan `cues` di `narration.ts`
 * (57 baris) dan urutannya sejajar indeks. Tidak ada yang lain perlu diubah;
 * pemeriksaan pengembangan di kaki berkas ini menolak tabel yang tidak sejajar,
 * dan `translationFor()` menjaga agar kegagalan tetap tidak mematikan render.
 *
 * ── Enam terjemahan, satu pendekatan ───────────────────────────────────────────
 *
 * Semuanya mengutamakan irama dan bobot kalimat, bukan kesetiaan kata per kata,
 * dan semuanya menghormati satu aturan yang menentukan: BARIS ADALAH PENGGALAN.
 * Sebagian besar cue adalah potongan kalimat yang bersambung ke cue berikutnya,
 * jadi baris yang menutup kalimat lebih awal akan merusak seluruh rangkaian
 * napasnya, bukan cuma dirinya sendiri.
 *
 * Beberapa keputusan yang disengaja dan berlaku lintas bahasa:
 *   - "that's here, that's home, that's us" tetap tiga hentakan pendek yang
 *     bunyinya menaik, bukan satu kalimat panjang.
 *   - "a mote of dust suspended in a sunbeam" adalah debu yang MELAYANG di
 *     berkas cahaya — bukan tergantung, bukan digantung.
 *   - "make our stand" adalah idiom militer: bertahan di posisi terakhir. Karena
 *     itu "bertahan", "resistimos", "tenons bon", "standhalten", "踏ん張る" —
 *     bukan "mengambil sikap".
 *   - "pale blue dot" pada cue 55 adalah prosa Sagan, bukan judul, jadi ia
 *     diterjemahkan. Nama karyanya di tempat lain tidak.
 *   - Jepang berpredikat di akhir, jadi daftar panjang cue 12–23 disusun sebagai
 *     rangkaian frasa benda dan kata kerjanya jatuh di cue 24, persis di tempat
 *     bahasa Inggris meletakkannya. Indeksnya tetap sejajar.
 *
 * Naskah asli: Carl Sagan, "Pale Blue Dot" (1994).
 * Hak cipta: © 1994 Carl Sagan, © 2006 Democritus Properties, LLC.
 * Terjemahan ditampilkan sebagai pendamping kutipan, untuk keperluan edukatif
 * non-komersial; naskah Inggrisnya tidak pernah diganti atau disembunyikan.
 */

import { cues } from "@/lib/narration";

export type LocaleCode =
  | "en"
  | "id"
  | "es"
  | "fr"
  | "de"
  | "pt-BR"
  | "ja"
  | "zh-CN"
  | "ko";

export type Locale = {
  code: LocaleCode;
  /** Nama negara, dipakai di layar pemilihan. */
  country: string;
  /** Nama bahasa dalam bahasa itu sendiri. */
  language: string;
  /** Kode ISO 3166-1 alpha-2, untuk label mono di layar pemilihan. */
  region: string;
  /** Arah tulisan; disiapkan untuk bahasa RTL di kemudian hari. */
  direction: "ltr" | "rtl";
};

/**
 * `region` is the two-letter stamp the bottom rail prints, and it is deliberately not
 * always the locale code: `pt-BR` prints as PT because the rail has room for two
 * characters and a reader who chose Português does not need to be told which
 * Português they are in every time they glance at the corner. The code stays `pt-BR`
 * everywhere it matters — storage, the `lang` attribute, the copy tables.
 *
 * `language` is the name of the language IN that language. Nobody looking for French
 * is looking for the word "French".
 */
export const locales: readonly Locale[] = [
  { code: "en", country: "Original", language: "English", region: "EN", direction: "ltr" },
  { code: "id", country: "Indonesia", language: "Bahasa Indonesia", region: "ID", direction: "ltr" },
  { code: "es", country: "Español", language: "Español", region: "ES", direction: "ltr" },
  { code: "fr", country: "Français", language: "Français", region: "FR", direction: "ltr" },
  { code: "de", country: "Deutsch", language: "Deutsch", region: "DE", direction: "ltr" },
  { code: "pt-BR", country: "Brasil", language: "Português", region: "PT", direction: "ltr" },
  { code: "ja", country: "日本", language: "日本語", region: "JA", direction: "ltr" },
  { code: "zh-CN", country: "中国", language: "简体中文", region: "ZH", direction: "ltr" },
  { code: "ko", country: "한국", language: "한국어", region: "KO", direction: "ltr" },
];

export const DEFAULT_LOCALE: LocaleCode = "en";

/**
 * Lokal yang benar-benar menambah baris kedua — yaitu semua yang punya tabel di
 * `translations`. Inilah yang ditawarkan layar pemilih.
 *
 * `en` sengaja tidak masuk. Bahasa Inggris adalah yang diucapkan Sagan dan selalu
 * tampil di baris atas apa pun pilihannya, jadi menaruhnya sebagai baris pilihan
 * berarti menawarkan sesuatu yang sudah pasti didapat. Memilih "tanpa terjemahan"
 * tetap mungkin, tetapi lewat jalan keluar yang jelas berbeda derajatnya dari
 * memilih bahasa — bukan baris yang setara di daftar yang sama.
 *
 * `locales` yang penuh tetap dipertahankan: `localeByCode('en')` masih dibutuhkan
 * untuk label rail dan untuk memulihkan nilai lama dari localStorage.
 */
export const subtitleLocales: readonly Locale[] = locales.filter(
  (locale) => locale.code !== DEFAULT_LOCALE,
);

export function isLocaleCode(value: string): value is LocaleCode {
  return locales.some((locale) => locale.code === value);
}

export function localeByCode(code: LocaleCode): Locale {
  return locales.find((locale) => locale.code === code) ?? locales[0];
}

/**
 * Sejajar indeks dengan `cues` di `narration.ts`. `en` sengaja tidak ada di
 * sini: naskah aslinya sudah jadi baris atas, jadi menyalinnya hanya akan
 * menampilkan kalimat yang sama dua kali.
 */
const translations: Partial<Record<LocaleCode, readonly string[]>> = {
  id: [
    // p1
    "Dari titik pandang yang jauh ini,",
    "Bumi mungkin tampak tak istimewa.",
    "Tetapi bagi kita, ia berbeda.",
    "Tengoklah kembali titik itu.",
    "Di situlah kita berada,",
    "itulah rumah kita,",
    "itulah kita.",
    "Di atasnya semua orang yang kau cintai,",
    "semua orang yang kau kenal,",
    "semua orang yang pernah kau dengar namanya,",
    "setiap manusia yang pernah ada,",
    "menjalani hidup mereka.",
    // p2
    "Segenap suka dan derita kita,",
    "ribuan agama, ideologi, dan doktrin ekonomi yang penuh keyakinan,",
    "setiap pemburu dan peramu,",
    "setiap pahlawan dan pengecut,",
    "setiap pencipta dan penghancur peradaban,",
    "setiap raja dan petani,",
    "setiap sepasang muda yang jatuh cinta,",
    "setiap ibu dan ayah,",
    "anak yang penuh harap, penemu dan penjelajah,",
    "setiap guru moral,",
    "setiap politikus korup,",
    'setiap "bintang besar," setiap "pemimpin agung,"',
    "setiap orang suci dan pendosa dalam sejarah spesies kita, hidup di sana –",
    "di sebutir debu yang melayang dalam seberkas cahaya matahari.",
    // p3
    "Bumi adalah panggung amat kecil di arena kosmos yang mahaluas.",
    "Bayangkan sungai darah yang ditumpahkan para jenderal dan kaisar",
    "agar, dalam kemuliaan dan kemenangan,",
    "mereka sejenak menguasai secuil dari sebuah titik.",
    "Bayangkan kekejaman tiada henti yang ditimpakan penghuni",
    "satu sudut piksel ini",
    "kepada penghuni sudut lain yang nyaris tak terbedakan,",
    "betapa sering mereka salah paham,",
    "betapa bernafsu mereka saling membunuh,",
    "betapa berkobar kebencian mereka.",
    // p4
    "Segala lagak kita, rasa penting diri yang kita khayalkan,",
    "khayalan bahwa kita punya kedudukan istimewa di Alam Semesta,",
    "digugat oleh setitik cahaya pucat ini.",
    "Planet kita hanyalah bintik sunyi dalam gelap kosmos yang menyelimuti.",
    "Dalam ketaktampakan kita, dalam kemahaluasan ini,",
    "tak ada isyarat bahwa pertolongan akan datang dari tempat lain",
    "untuk menyelamatkan kita dari diri kita sendiri.",
    // p5
    "Sejauh ini Bumi satu-satunya dunia yang diketahui memelihara kehidupan.",
    "Tak ada tempat lain, setidaknya dalam waktu dekat,",
    "yang bisa dituju spesies kita untuk pindah.",
    "Singgah, bisa.",
    "Menetap, belum.",
    "Suka atau tidak, untuk saat ini",
    "di Bumilah kita bertahan.",
    // p6
    "Ada yang bilang, astronomi adalah pengalaman yang merendahkan hati dan membentuk watak.",
    "Barangkali tak ada bukti yang lebih baik tentang kesia-siaan kesombongan manusia",
    "selain citra jauh dunia mungil kita ini.",
    "Bagiku, ia menegaskan tanggung jawab kita",
    "untuk bersikap lebih baik satu sama lain,",
    "serta menjaga dan merawat titik biru pucat itu,",
    "satu-satunya rumah yang pernah kita kenal.",
  ],
  es: [
    // p1
    "Desde este lejano punto de observación,",
    "la Tierra quizá no parezca de particular interés.",
    "Pero para nosotros, es distinta.",
    "Considera de nuevo ese punto.",
    "Eso es aquí,",
    "eso es nuestro hogar,",
    "eso somos nosotros.",
    "En él, todos los que amas,",
    "todos los que conoces,",
    "todos los que has oído nombrar,",
    "todo ser humano que alguna vez existió,",
    "vivieron sus vidas.",
    // p2
    "La suma de nuestra alegría y sufrimiento,",
    "miles de religiones, ideologías y doctrinas económicas, seguras de sí mismas,",
    "cada cazador y recolector,",
    "cada héroe y cobarde,",
    "cada creador y destructor de la civilización,",
    "cada rey y campesino,",
    "cada joven pareja enamorada,",
    "cada madre y padre,",
    "niño esperanzado, inventor y explorador,",
    "cada maestro de moral,",
    "cada político corrupto,",
    "cada “superestrella”, cada “líder supremo”,",
    "cada santo y pecador de la historia de nuestra especie vivió allí –",
    "en una mota de polvo suspendida en un rayo de sol.",
    // p3
    "La Tierra es un escenario muy pequeño en una vasta arena cósmica.",
    "Piensa en los ríos de sangre vertidos por todos esos generales y emperadores",
    "para que, con gloria y triunfo,",
    "pudieran convertirse en amos momentáneos de una fracción de un punto.",
    "Piensa en las crueldades sin fin infligidas por los habitantes",
    "de un rincón de este píxel",
    "a los apenas distinguibles habitantes de algún otro rincón,",
    "qué frecuentes sus malentendidos,",
    "qué ansiosos están por matarse entre sí,",
    "qué fervientes sus odios.",
    // p4
    "Nuestras poses, la importancia que nos imaginamos,",
    "la falsa creencia de que ocupamos una posición privilegiada en el Universo,",
    "son desafiadas por este punto de luz pálida.",
    "Nuestro planeta es una mota solitaria en la gran oscuridad cósmica envolvente.",
    "En nuestra oscuridad, en toda esta inmensidad,",
    "no hay indicio de que vaya a llegar ayuda de otra parte",
    "para salvarnos de nosotros mismos.",
    // p5
    "La Tierra es el único mundo conocido hasta ahora que alberga vida.",
    "No hay otro lugar, al menos en un futuro cercano,",
    "al que nuestra especie pueda emigrar.",
    "Visitar, sí.",
    "Asentarse, aún no.",
    "Nos guste o no, por ahora",
    "la Tierra es donde resistimos.",
    // p6
    "Se ha dicho que la astronomía nos hace humildes y forja el carácter.",
    "Quizá no haya mejor demostración de la insensatez de las vanidades humanas",
    "que esta imagen lejana de nuestro mundo diminuto.",
    "Para mí, subraya nuestra responsabilidad",
    "de tratarnos con más bondad,",
    "y de preservar y atesorar el punto azul pálido,",
    "el único hogar que hemos conocido.",
  ],
  fr: [
    // p1
    "De ce lointain point d'observation,",
    "la Terre pourrait sembler sans grand intérêt.",
    "Mais pour nous, c'est différent.",
    "Considérez à nouveau ce point.",
    "C'est ici,",
    "c'est chez nous,",
    "c'est nous.",
    "C'est là que tous ceux que vous aimez,",
    "tous ceux que vous connaissez,",
    "tous ceux dont vous avez entendu parler,",
    "tout être humain qui ait jamais existé,",
    "ont vécu leur vie.",
    // p2
    "La somme de notre joie et de notre souffrance,",
    "des milliers de religions, d'idéologies et de doctrines économiques sûres d'elles,",
    "chaque chasseur et cueilleur,",
    "chaque héros et chaque lâche,",
    "chaque créateur et chaque destructeur de civilisation,",
    "chaque roi et chaque paysan,",
    "chaque jeune couple amoureux,",
    "chaque mère et chaque père,",
    "enfant plein d'espoir, inventeur et explorateur,",
    "chaque professeur de morale,",
    "chaque politicien corrompu,",
    "chaque « superstar », chaque « chef suprême »,",
    "chaque saint et chaque pécheur de l'histoire de notre espèce y ont vécu –",
    "sur un grain de poussière flottant dans un rayon de soleil.",
    // p3
    "La Terre est une toute petite scène dans une vaste arène cosmique.",
    "Pensez aux fleuves de sang versés par tous ces généraux et empereurs",
    "pour que, dans la gloire et le triomphe,",
    "ils deviennent un instant les maîtres d'une fraction d'un point.",
    "Pensez aux cruautés sans fin infligées par les habitants",
    "d'un coin de ce pixel",
    "aux habitants à peine discernables d'un autre coin,",
    "combien fréquents leurs malentendus,",
    "combien ils sont avides de s'entretuer,",
    "combien ardentes leurs haines.",
    // p4
    "Nos poses, l'importance que nous nous imaginons,",
    "l'illusion d'occuper une place privilégiée dans l'Univers,",
    "sont remises en cause par ce point de lumière pâle.",
    "Notre planète est un grain solitaire dans l'immense noir cosmique.",
    "Dans notre insignifiance, dans toute cette immensité,",
    "rien n'indique que de l'aide viendra d'ailleurs",
    "pour nous sauver de nous-mêmes.",
    // p5
    "À ce jour, la Terre est le seul monde connu à abriter la vie.",
    "Il n'y a nulle part ailleurs, du moins dans un proche avenir,",
    "où notre espèce pourrait émigrer.",
    "Visiter, oui.",
    "S'installer, pas encore.",
    "Qu'on le veuille ou non, pour l'instant",
    "c'est sur Terre que nous tenons bon.",
    // p6
    "On a dit que l'astronomie est une expérience qui rend humble et forge le caractère.",
    "Il n'y a peut-être pas de meilleure démonstration de la folie des vanités humaines",
    "que cette image lointaine de notre monde minuscule.",
    "Pour moi, elle souligne notre responsabilité",
    "de nous traiter les uns les autres avec plus de bonté,",
    "et de préserver et de chérir le point bleu pâle,",
    "le seul foyer que nous ayons jamais connu.",
  ],
  de: [
    // p1
    "Von diesem fernen Aussichtspunkt aus",
    "mag die Erde nicht besonders interessant erscheinen.",
    "Doch für uns ist sie anders.",
    "Betrachte noch einmal diesen Punkt.",
    "Das ist hier,",
    "das ist unser Zuhause,",
    "das sind wir.",
    "Auf ihm haben alle, die du liebst,",
    "alle, die du kennst,",
    "alle, von denen du je gehört hast,",
    "jeder Mensch, den es je gab,",
    "ihr Leben verbracht.",
    // p2
    "Die Summe unserer Freude und unseres Leids,",
    "Tausende selbstgewisser Religionen, Ideologien und Wirtschaftsdoktrinen,",
    "jeder Jäger und Sammler,",
    "jeder Held und Feigling,",
    "jeder Schöpfer und Zerstörer der Zivilisation,",
    "jeder König und Bauer,",
    "jedes junge verliebte Paar,",
    "jede Mutter und jeder Vater,",
    "Kind voller Hoffnung, Erfinder und Entdecker,",
    "jeder Lehrer der Moral,",
    "jeder korrupte Politiker,",
    "jeder „Superstar“, jeder „oberste Führer“,",
    "jeder Heilige und Sünder in der Geschichte unserer Art lebten dort –",
    "auf einem Staubkorn, schwebend in einem Sonnenstrahl.",
    // p3
    "Die Erde ist eine sehr kleine Bühne in einer gewaltigen kosmischen Arena.",
    "Denk an die Ströme von Blut, die all diese Generäle und Kaiser vergossen,",
    "damit sie, in Ruhm und Triumph,",
    "für einen Moment die Herren eines Bruchteils eines Punktes werden konnten.",
    "Denk an die endlosen Grausamkeiten, die die Bewohner",
    "einer Ecke dieses Pixels",
    "an den kaum unterscheidbaren Bewohnern einer anderen Ecke verübten,",
    "wie häufig ihre Missverständnisse,",
    "wie begierig sie darauf sind, einander zu töten,",
    "wie glühend ihr Hass.",
    // p4
    "Unser Gehabe, unsere eingebildete Wichtigkeit,",
    "der Wahn, wir hätten einen bevorzugten Platz im Universum,",
    "werden von diesem Punkt blassen Lichts in Frage gestellt.",
    "Unser Planet ist ein einsames Fleckchen im großen umhüllenden Dunkel des Alls.",
    "In unserer Verborgenheit, in all dieser Weite,",
    "gibt es kein Anzeichen, dass Hilfe von anderswo kommt,",
    "um uns vor uns selbst zu retten.",
    // p5
    "Die Erde ist bislang die einzige bekannte Welt, die Leben beherbergt.",
    "Es gibt keinen anderen Ort, zumindest in naher Zukunft,",
    "wohin unsere Art auswandern könnte.",
    "Besuchen, ja.",
    "Siedeln, noch nicht.",
    "Ob wir wollen oder nicht, vorerst",
    "ist die Erde der Ort, an dem wir standhalten.",
    // p6
    "Es heißt, Astronomie sei eine Erfahrung, die demütig macht und den Charakter formt.",
    "Es gibt vielleicht keinen besseren Beleg für die Torheit menschlicher Anmaßung",
    "als dieses ferne Bild unserer winzigen Welt.",
    "Für mich unterstreicht es unsere Verantwortung,",
    "freundlicher miteinander umzugehen,",
    "und den blassen blauen Punkt zu bewahren und zu hegen,",
    "das einzige Zuhause, das wir je kannten.",
  ],
  "pt-BR": [
    // p1
    "Deste ponto de observação distante,",
    "a Terra pode não parecer de especial interesse.",
    "Mas para nós, é diferente.",
    "Considere novamente aquele ponto.",
    "É aqui,",
    "é nosso lar,",
    "somos nós.",
    "Nele todos que você ama,",
    "todos que você conhece,",
    "todos de quem você já ouviu falar,",
    "todo ser humano que já existiu,",
    "viveram suas vidas.",
    // p2
    "A soma de nossa alegria e sofrimento,",
    "milhares de convictas religiões, ideologias e doutrinas econômicas,",
    "cada caçador e coletor,",
    "cada herói e covarde,",
    "cada criador e destruidor de civilização,",
    "cada rei e camponês,",
    "cada jovem casal apaixonado,",
    "cada mãe e pai,",
    "criança esperançosa, inventor e explorador,",
    "cada professor de moral,",
    "cada político corrupto,",
    "cada “superestrela”, cada “líder supremo”,",
    "cada santo e pecador na história da nossa espécie viveu ali –",
    "num grão de poeira suspenso num raio de sol.",
    // p3
    "A Terra é um palco muito pequeno numa vasta arena cósmica.",
    "Pense nos rios de sangue derramados por todos esses generais e imperadores",
    "para que, em glória e triunfo,",
    "pudessem se tornar senhores momentâneos de uma fração de um ponto.",
    "Pense nas crueldades sem fim infligidas pelos habitantes",
    "de um canto deste pixel",
    "aos habitantes quase indistinguíveis de algum outro canto,",
    "como são frequentes seus mal-entendidos,",
    "como são ávidos por matar uns aos outros,",
    "como são fervorosos seus ódios.",
    // p4
    "Nossas poses, a importância que imaginamos ter,",
    "a ilusão de que temos alguma posição privilegiada no Universo,",
    "são desafiadas por este ponto de luz pálida.",
    "Nosso planeta é um grão solitário na escuridão cósmica que nos envolve.",
    "Em nossa obscuridade, em toda esta imensidão,",
    "não há indício de que virá ajuda de outro lugar",
    "para nos salvar de nós mesmos.",
    // p5
    "A Terra é, até onde se sabe, o único mundo a abrigar vida.",
    "Não há outro lugar, ao menos num futuro próximo,",
    "para onde nossa espécie possa migrar.",
    "Visitar, sim.",
    "Estabelecer-se, ainda não.",
    "Queira ou não, por enquanto",
    "é na Terra que resistimos.",
    // p6
    "Já disseram que a astronomia é uma experiência de humildade e formação do caráter.",
    "Talvez não haja melhor demonstração da tolice das presunções humanas",
    "do que esta imagem distante do nosso mundo minúsculo.",
    "Para mim, isso ressalta nossa responsabilidade",
    "de tratar uns aos outros com mais bondade,",
    "e de preservar e amar o pálido ponto azul,",
    "o único lar que já conhecemos.",
  ],
  ja: [
    // p1
    "この遠く離れた地点から、",
    "地球は特に興味深くは見えないかもしれない。",
    "だが私たちにとっては、話は別だ。",
    "もう一度あの点を考えてみてほしい。",
    "あれがここ、",
    "あれが故郷、",
    "あれが私たちだ。",
    "あの点の上で、愛するすべての人、",
    "知っているすべての人、",
    "名前を聞いたことのあるすべての人、",
    "かつて存在したすべての人間が、",
    "その生涯を生きた。",
    // p2
    "私たちの喜びと苦しみの総体、",
    "確信に満ちた何千もの宗教、イデオロギー、経済の教義、",
    "あらゆる狩人と採集者、",
    "あらゆる英雄と臆病者、",
    "あらゆる文明の創造者と破壊者、",
    "あらゆる王と農民、",
    "あらゆる若い恋人たち、",
    "あらゆる母と父、",
    "希望に満ちた子ども、発明家、探検家、",
    "あらゆる道徳の教師、",
    "あらゆる腐敗した政治家、",
    "あらゆる「スーパースター」、あらゆる「最高指導者」、",
    "私たちの種の歴史のあらゆる聖者と罪人が、そこに生きた——",
    "一筋の日の光の中に浮かぶ一粒の塵の上で。",
    // p3
    "地球は広大な宇宙という闘技場のごく小さな舞台だ。",
    "あの将軍や皇帝たちが流した血の川を思ってほしい",
    "栄光と勝利のうちに、",
    "一つの点のひとかけらの、つかのまの支配者となるために。",
    "果てしない残虐行為の数々を思ってほしい",
    "このピクセルの一隅の住人が",
    "ほとんど見分けのつかない別の隅の住人にしてきたことを、",
    "どれほど頻繁に誤解し合うか、",
    "どれほど殺し合いたがるか、",
    "どれほど憎しみを燃やすかを、思ってほしい。",
    // p4
    "私たちの気取り、自分は重要だという思い込み、",
    "私たちが宇宙で特権的な地位にいるという幻想、",
    "この淡い光の一点に問い直される。",
    "私たちの惑星は、大いなる宇宙の闇に包まれた孤独な一粒だ。",
    "知られることもなく、この果てしない広がりのなかで、",
    "ほかのどこかから助けが来る兆しはない",
    "私たち自身から私たちを救うために。",
    // p5
    "地球は、今のところ生命を宿すと知られている唯一の世界だ。",
    "ほかにどこにもない、少なくとも近い将来は、",
    "私たちの種が移り住める先は。",
    "訪れるのは、いい。",
    "住みつくのは、まだだ。",
    "いやでも応でも、今のところ",
    "地球こそ、私たちが踏ん張る場所だ。",
    // p6
    "天文学は人を謙虚にし、人格を育てる経験だと言われてきた。",
    "おそらく、人間のうぬぼれの愚かさを示すものはない",
    "遠くからとらえたこの小さな世界の画像ほどには。",
    "私にとって、それは私たちの責任を際立たせる",
    "たがいにもっとやさしく接すること、",
    "そしてあの淡く青い点を守り慈しむこと、",
    "これまで私たちが知ってきたただ一つの故郷。",
  ],
  "zh-CN": [
    // p1
    "从这个遥远的观测点望去，",
    "地球或许显得没什么特别。",
    "但对我们而言，并非如此。",
    "再想一想那个点。",
    "那就是这里，",
    "那就是家园，",
    "那就是我们。",
    "在那上面，你爱的每一个人，",
    "你认识的每一个人，",
    "你听说过的每一个人，",
    "曾经存在过的每一个人，",
    "都度过了自己的一生。",
    // p2
    "我们欢乐与苦难的总和，",
    "数千种笃信不疑的宗教、意识形态与经济学说，",
    "每一个猎人与采集者，",
    "每一个英雄与懦夫，",
    "每一个文明的创造者与毁灭者，",
    "每一个国王与农民，",
    "每一对相爱的年轻人，",
    "每一个母亲与父亲，",
    "满怀希望的孩子、发明家与探险家，",
    "每一个道德导师，",
    "每一个腐败的政客，",
    "每一个“超级明星”、每一个“最高领袖”，",
    "我们这个物种历史上的每一个圣徒与罪人，都生活在那里——",
    "就在一束阳光中悬浮的一粒微尘上。",
    // p3
    "地球是浩瀚宇宙竞技场上一个很小的舞台。",
    "想想那些将军与帝王让鲜血流淌成河",
    "只为在荣耀与凯旋之中，",
    "短暂地成为一个点上某一小块的主人。",
    "想想那无穷无尽的暴行",
    "由这个像素某一角的居民",
    "施加给另一角几乎无从分辨的居民，",
    "他们的误解何其频繁，",
    "他们何其急于互相残杀，",
    "他们的仇恨何其炽烈。",
    // p4
    "我们的装腔作势，我们臆想出来的自命不凡，",
    "以为我们在宇宙中占有某种特殊地位的错觉，",
    "都被这一点苍白的光所质疑。",
    "我们的行星，是笼罩四周的宇宙黑暗中一粒孤独的微尘。",
    "在我们的默默无闻中，在这无边的浩瀚里，",
    "没有任何迹象表明会有援手从别处到来",
    "把我们从自己手中拯救出来。",
    // p5
    "地球是迄今已知唯一孕育生命的世界。",
    "再没有别的地方，至少在不远的将来，",
    "可供我们这个物种迁居。",
    "造访，可以。",
    "定居，还不行。",
    "无论喜不喜欢，眼下",
    "地球就是我们据守的地方。",
    // p6
    "有人说，天文学是一种让人谦卑、也塑造品格的经历。",
    "要说明人类自负的愚蠢，也许再没有什么",
    "比得上这张我们小小世界的远方影像。",
    "对我来说，它凸显了我们的责任",
    "要更善意地彼此相待，",
    "也要守护和珍惜那个暗淡的蓝点，",
    "我们所知的唯一家园。",
  ],
  "ko": [
    // p1
    "이 멀리 떨어진 지점에서 보면,",
    "지구는 별로 흥미로워 보이지 않을지도 모른다.",
    "그러나 우리에게는 다르다.",
    "저 점을 다시 생각해 보라.",
    "저것이 여기이고,",
    "저것이 고향이고,",
    "저것이 우리다.",
    "그 위에서, 당신이 사랑하는 모든 사람,",
    "아는 모든 사람,",
    "이름을 들어본 모든 사람,",
    "일찍이 존재한 모든 인간이,",
    "저마다의 삶을 살았다.",
    // p2
    "우리의 기쁨과 고통의 총합,",
    "확신에 찬 수천 가지 종교와 이념과 경제 교리,",
    "모든 사냥꾼과 채집꾼,",
    "모든 영웅과 겁쟁이,",
    "문명의 모든 창조자와 파괴자,",
    "모든 왕과 농민,",
    "사랑에 빠진 모든 젊은 연인,",
    "모든 어머니와 아버지,",
    "희망에 찬 아이, 발명가와 탐험가,",
    "도덕을 가르친 모든 이,",
    "모든 부패한 정치인,",
    "모든 “슈퍼스타”, 모든 “최고 지도자”,",
    "우리 종의 역사 속 모든 성자와 죄인이 거기서 살았다 –",
    "한 줄기 햇빛 속에 떠 있는 티끌 하나 위에서.",
    // p3
    "지구는 광대한 우주 경기장의 아주 작은 무대다.",
    "저 숱한 장군과 황제들이 흘린 피의 강을 생각해 보라",
    "영광과 승리 속에서,",
    "점 하나의 한 조각을 잠시 지배하는 자가 되려고.",
    "끝없이 이어진 잔혹 행위를 생각해 보라",
    "이 픽셀 한 귀퉁이의 주민들이",
    "거의 구별되지 않는 다른 귀퉁이 주민들에게 저지른 짓을,",
    "얼마나 자주 오해하는지,",
    "얼마나 기꺼이 서로를 죽이려 드는지,",
    "얼마나 뜨겁게 증오하는지 생각해 보라.",
    // p4
    "우리의 허세, 스스로 대단하다는 착각,",
    "우주에서 우리가 특별한 자리를 차지한다는 망상을,",
    "이 창백한 빛의 점 하나가 흔든다.",
    "우리 행성은 광막한 우주의 어둠에 둘러싸인 외로운 티끌이다.",
    "알려지지 않은 채, 이 광막함 속에서,",
    "다른 어딘가에서 도움이 오리라는 기미는 없다",
    "우리를 우리 자신에게서 구하기 위해.",
    // p5
    "지구는 지금까지 알려진 한, 생명을 품은 유일한 세계다.",
    "적어도 가까운 미래에는, 달리 갈 곳이 없다",
    "우리 종이 옮겨 갈 수 있는 곳은.",
    "방문은, 가능하다.",
    "정착은, 아직이다.",
    "좋든 싫든, 지금으로서는",
    "우리가 버티고 설 자리는 지구다.",
    // p6
    "천문학은 겸손을 가르치고 인격을 기르는 경험이라고들 한다.",
    "인간의 자만이 얼마나 어리석은지 보여 주는 것은 아마 없을 것이다",
    "멀리서 찍은 우리 작은 세계의 사진만큼.",
    "내게 그것은 우리의 책임을 일깨운다",
    "서로를 좀 더 다정하게 대하는 일,",
    "그리고 저 창백한 푸른 점을 지키고 아끼는 일,",
    "우리가 지금껏 알아 온 유일한 고향을.",
  ],
};

/**
 * Terjemahan untuk cue ke-`index`, atau null bila lokal itu tidak punya
 * terjemahan (mis. `en`) atau panjang arraynya tidak sejajar dengan `cues`.
 * Sengaja mengembalikan null alih-alih melempar: takarir yang kehilangan baris
 * bawah masih tetap bisa ditonton, sedangkan render yang gagal tidak.
 */
export function translationFor(index: number, locale: LocaleCode): string | null {
  const table = translations[locale];
  if (!table) return null;
  return table[index] ?? null;
}

/** Panjang tabel tiap lokal — dipakai uji kesejajaran terhadap `cues`. */
export function translationLengths(): Record<string, number> {
  return Object.fromEntries(
    Object.entries(translations).map(([code, table]) => [code, table?.length ?? 0]),
  );
}

/**
 * Satu-satunya hal yang membuat takarir dua baris ini benar adalah kesejajaran
 * indeks: baris ke-i sebuah tabel HARUS menerjemahkan cue ke-i, bukan yang lain.
 * Salah satu baris hilang di tengah tabel tidak akan terlihat sebagai kesalahan —
 * ia hanya menggeser sisa naskah satu langkah dan menempelkan kalimat yang keliru
 * ke setiap napas sesudahnya, sampai akhir pembacaan.
 *
 * `translationFor()` sengaja mengembalikan null dan tidak melempar, karena satu
 * baris yang hilang saat menonton lebih baik daripada layar yang gagal render.
 * Pemeriksaan di bawah ini adalah pasangannya: kesalahan yang sama harus berisik
 * saat pengembangan, dan setiap lokal yang ditawarkan layar pemilih wajib punya
 * tabelnya — kalau tidak, layar itu menjanjikan baris kedua yang tak pernah ada.
 */
if (process.env.NODE_ENV !== "production") {
  for (const locale of subtitleLocales) {
    const table = translations[locale.code];
    if (!table) {
      throw new Error(
        `Locale "${locale.code}" is offered on the language screen but has no subtitle table in locales.ts`,
      );
    }
    if (table.length !== cues.length) {
      throw new Error(
        `Subtitle table "${locale.code}" has ${table.length} rows; \`cues\` has ${cues.length}. The tables are index-aligned, so a mismatch mislabels every line after the gap.`,
      );
    }
    const blank = table.findIndex((line) => line.trim() === "");
    if (blank !== -1) {
      throw new Error(`Subtitle table "${locale.code}" has an empty line at index ${blank}`);
    }
  }
}
