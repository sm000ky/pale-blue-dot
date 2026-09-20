export interface SubtitleCue {
  id: string;
  start: number; // seconds
  end: number;   // seconds
  en: string;
  id_lang: string; // Bahasa Indonesia
  ja: string;      // Japanese
  chapter?: string;
  distanceKm: number; // Simulated distance from Earth for the HUD (6 billion km -> 12,000 km)
}

export const SUBTITLES: SubtitleCue[] = [
  {
    id: 'c1',
    start: 0.5,
    end: 9.8,
    en: 'From this distant vantage point, the Earth might not seem of any particular interest.',
    id_lang: 'Dari sudut pandang yang begitu jauh ini, Bumi mungkin tampak tidak memiliki keistimewaan apa pun.',
    ja: 'このはるかな遠方から見れば、地球は何の変哲もない場所に見えるかもしれない。',
    chapter: 'VANTAGE POINT',
    distanceKm: 6060000000
  },
  {
    id: 'c2',
    start: 10.2,
    end: 15.8,
    en: "But for us, it's different.",
    id_lang: 'Namun bagi kita, maknanya sungguh berbeda.',
    ja: 'だが、私たちにとっては違う。',
    distanceKm: 5800000000
  },
  {
    id: 'c3',
    start: 16.2,
    end: 23.4,
    en: 'Consider again that dot.',
    id_lang: 'Pandanglah kembali titik kecil itu.',
    ja: 'もう一度、あの点を見つめてごらん。',
    chapter: "THAT'S HOME",
    distanceKm: 5200000000
  },
  {
    id: 'c4',
    start: 24.0,
    end: 32.2,
    en: "That's here. That's home. That's us.",
    id_lang: 'Itulah di sini. Itulah rumah kita. Itulah kita.',
    ja: 'あれがここだ。あれが私たちの家だ。あれが私たち自身だ。',
    distanceKm: 4500000000
  },
  {
    id: 'c5',
    start: 32.8,
    end: 48.5,
    en: 'On it everyone you love, everyone you know, everyone you ever heard of, every human being who ever was, lived out their lives.',
    id_lang: 'Di sanalah setiap orang yang kau cintai, semua orang yang kau kenal, setiap insan yang pernah kau dengar namanya, setiap manusia yang pernah ada—menghabiskan seluruh lembar hidup mereka.',
    ja: 'あなたの愛するすべての人、知っているすべての人、かつて耳にしたことのあるすべての人、存在したすべての人間が、そこで一生を過ごしたのだ。',
    distanceKm: 3600000000
  },
  {
    id: 'c6',
    start: 49.0,
    end: 64.5,
    en: 'The aggregate of our joy and suffering, thousands of confident religions, ideologies, and economic doctrines, every hunter and forager, every hero and coward, every creator and destroyer of civilization...',
    id_lang: 'Kumpulan segenap suka dan duka kita, ribuan agama, ideologi, dan doktrin ekonomi yang penuh keyakinan; setiap pemburu dan peramu, setiap pahlawan dan pengecut, setiap pembangun dan penghancur peradaban...',
    ja: '私たちの喜びと苦しみのすべて、確信に満ちた無数の宗教、思想、経済理論、すべての狩人と採集民、すべての英雄と臆病者、文明の創造者と破壊者...',
    distanceKm: 2500000000
  },
  {
    id: 'c7',
    start: 65.0,
    end: 80.5,
    en: "every king and peasant, every young couple in love, every mother and father, hopeful child, inventor and explorer, every teacher of morals, every corrupt politician, every 'superstar', every 'supreme leader'...",
    id_lang: 'setiap raja dan rakyat jelata, setiap pasangan muda yang dimabuk asmara, setiap ayah dan ibu, anak yang penuh harapan, penemu dan penjelajah, guru moral, politisi korup, sang bintang, pemimpin agung...',
    ja: 'すべての王と農民、恋に落ちた若き恋人たち、すべての母と父、希望に満ちた子ども、発明家と探検家、道徳の教師、腐敗した政治家、スーパースター、最高指導者...',
    distanceKm: 1400000000
  },
  {
    id: 'c8',
    start: 81.0,
    end: 98.2,
    en: 'every saint and sinner in the history of our species lived there—on a mote of dust suspended in a sunbeam.',
    id_lang: 'setiap orang suci dan pendosa dalam sejarah peradaban spesies kita—semuanya hidup di sana, di atas sebutir debu yang melayang di seberkas sinar mentari.',
    ja: '人類の歴史におけるすべての聖者と罪人が、そこに生きた――太陽の光の中に漂う、一粒の塵の上で。',
    chapter: 'A MOTE OF DUST',
    distanceKm: 700000000
  },
  {
    id: 'c9',
    start: 98.8,
    end: 114.2,
    en: 'The Earth is a very small stage in a vast cosmic arena.',
    id_lang: 'Bumi hanyalah panggung teramat kecil di tengah megahnya gelanggang kosmik yang mahaluas.',
    ja: '地球は、広大無辺な宇宙の劇場における、ほんの小さな舞台にすぎない。',
    distanceKm: 300000000
  },
  {
    id: 'c10',
    start: 114.8,
    end: 133.5,
    en: 'Think of the rivers of blood spilled by all those generals and emperors so that, in glory and triumph, they could become the momentary masters of a fraction of a dot.',
    id_lang: 'Bayangkan sungai-sungai darah yang ditumpahkan oleh para jenderal dan kaisar, hanya demi mengecap sejenak kejayaan semu sebagai penguasa sesaat dari secuil pecahan titik itu.',
    ja: 'あの将軍や皇帝たちが流した血の河を思え。栄光と勝利のうちに、あの点のごく一部の刹那の支配者になるために流された血を。',
    chapter: 'RIVERS OF BLOOD',
    distanceKm: 120000000
  },
  {
    id: 'c11',
    start: 134.0,
    end: 153.2,
    en: 'Think of the endless cruelties visited by the inhabitants of one corner of this pixel on the scarcely distinguishable inhabitants of some other corner, how frequent their misunderstandings, how eager they are to kill one another, how fervent their hatreds.',
    id_lang: 'Renungkan kekejaman tanpa akhir yang dilakukan penghuni di satu sudut piksel ini kepada sesamanya di sudut lain yang nyaris tiada beda; betapa seringnya kesalahpahaman, betapa bernafsunya saling membunuh, betapa membara kebencian mereka.',
    ja: 'このピクセルの一隅の住人が、見分けもつかない別の隅の住人に加えた果てしない残酷さを思え。誤解の多さ、殺し合おうとする熱意、燃え盛る憎悪を。',
    distanceKm: 45000000
  },
  {
    id: 'c12',
    start: 153.8,
    end: 172.5,
    en: 'Our posturings, our imagined self-importance, the delusion that we have some privileged position in the Universe, are challenged by this point of pale light.',
    id_lang: 'Sikap congkak kita, delusi tentang kebesaran diri, anggapan bahwa kita memiliki kedudukan istimewa di alam semesta—semuanya runtuh tak berdaya di hadapan setitik cahaya pucat ini.',
    ja: '私たちの気取り、思い上がった自惚れ、自分たちが宇宙で特権的な地位にあるという妄想は、この淡い光の点によって根底から覆される。',
    chapter: 'DELUSION OF PRIVILEGE',
    distanceKm: 15000000
  },
  {
    id: 'c13',
    start: 173.0,
    end: 188.5,
    en: 'Our planet is a lonely speck in the great enveloping cosmic dark.',
    id_lang: 'Planet kita hanyalah sebutir titik sunyi di tengah pekatnya kegelapan semesta yang menyelimuti.',
    ja: '私たちの惑星は、包み込むような大いなる宇宙の暗闇にぽつんと浮かぶ、孤独な点だ。',
    distanceKm: 3000000
  },
  {
    id: 'c14',
    start: 189.0,
    end: 204.5,
    en: 'In our obscurity, in all this vastness, there is no hint that help will come from elsewhere to save us from ourselves.',
    id_lang: 'Dalam kesendirian kita yang kelam ini, di tengah keluasan tiada tara, tiada secuil pun pertanda bahwa bantuan akan datang dari tempat lain untuk menyelamatkan kita dari diri kita sendiri.',
    ja: 'この広大な静寂の中で、私たち自身の手から私たちを救うために、どこか別の場所から助けが来るという兆しはどこにもない。',
    chapter: 'THE LONELY SPECK',
    distanceKm: 450000
  },
  {
    id: 'c15',
    start: 205.0,
    end: 221.5,
    en: 'The Earth is the only world known so far to harbor life. There is nowhere else, at least in the near future, to which our species could migrate.',
    id_lang: 'Bumi adalah satu-satunya dunia yang sejauh ini diketahui menopang kehidupan. Tiada tempat lain, setidaknya dalam waktu dekat, ke mana spesies kita dapat berpindah.',
    ja: '地球は、現在知られている限り、生命を宿す唯一の天体だ。少なくとも近い将来、私たちの種族が移住できる場所など、どこにもない。',
    distanceKm: 120000
  },
  {
    id: 'c16',
    start: 222.0,
    end: 236.8,
    en: 'Visit, yes. Settle, not yet. Like it or not, for the moment the Earth is where we make our stand.',
    id_lang: 'Berkunjung, mungkin saja. Menetap, belum waktunya. Suka atau tidak, untuk saat ini di Bumilah kita bertahan.',
    ja: '訪れることはできても、住み着くことはまだできない。好むと好まざるとにかかわらず、今この瞬間、私たちが踏みとどまるべき場所は地球しかないのだ。',
    distanceKm: 35786 // Geostationary Orbit
  },
  {
    id: 'c17',
    start: 237.2,
    end: 255.5,
    en: 'It has been said that astronomy is a humbling and character-building experience. There is perhaps no better demonstration of the folly of human conceits than this distant image of our tiny world.',
    id_lang: 'Pernah dikatakan bahwa astronomi adalah pengalaman yang mengajarkan kerendahan hati dan menempa budi pekerti. Barangkali tiada pembuktian yang lebih nyata atas keangkuhan manusia selain potret kejauhan dunia mungil kita ini.',
    ja: '天文学は人を謙虚にし、人格を育む経験だと言われてきた。人類のうぬぼれの愚かさを、はるか彼方から捉えたこの小さな世界の姿ほど見事に示すものは他にないだろう。',
    chapter: 'THE ONLY HOME',
    distanceKm: 6371 // Low Earth Orbit
  },
  {
    id: 'c18',
    start: 256.0,
    end: 270.5,
    en: "To me, it underscores our responsibility to deal more kindly with one another, and to preserve and cherish the pale blue dot, the only home we've ever known.",
    id_lang: 'Bagiku, potret ini menegaskan tanggung jawab kita untuk memperlakukan sesama dengan penuh kasih sayang, serta menjaga dan menyayangi titik biru pucat ini—satu-satunya rumah yang pernah kita kenal.',
    ja: '私にとって、それは互いにより親切に接し、私たちがこれまで知る唯一の家である「ペイル・ブルー・ドット（淡い青い点）」を慈しみ、守り続ける責任を強く自覚させるものなのだ。',
    distanceKm: 400 // ISS Orbit
  }
];
