/**
 * Japanese — the exploration copy.
 *
 * Only the fields this language actually changes are here. Eyebrows, chapter
 * stamps, hotspot labels and plate captions are instrument markings and are the
 * same string in every locale by design, so they live in `en.ts` alone and
 * `beatCopy` merges this table over the English one field by field.
 *
 * Translated as editorial prose from the English source, then checked by a
 * separate reviewer against that source for facts, structure and tone. Numbers,
 * dates, units and identifiers carry through unchanged; only their notation is
 * localised where the language requires it.
 */

import type { BeatCopy } from "./types";

/* The five plate descriptions. Two of them are carried by four beats each — the
   spacecraft holds across the Voyager chapter and the cover across the four
   hotspot beats — so they are named once rather than repeated eight times. */
const PLATE_ALT =
  "淡い青と灰色の面を、散乱した太陽光の帯が斜めに横切っている。その帯の中、中央よりやや右に、白い点がひとつ。地球である。";

const PORTRAIT_ALT =
  "狭角カメラの60コマを黒地に湾曲したモザイクとして並べたもの。Jupiter、Earth、Venus、Saturn、Uranus、Neptuneとラベルの付いた6つの拡大図があり、どの拡大図でも惑星は光の点ひとつにすぎない。";

const VOYAGER_ALT =
  "黒い星野を背にしたVoyager探査機の想像図。白いパラボラアンテナは向こう側を向き、観測機器のブームと放射性同位体電源が片側のトラスに取り付けられ、2本の長いアンテナが画面の外へ伸びている。";

const DISC_ALT =
  "レコードそのもの。鏡のように輝く金色の円盤で、ラベルには「The Sounds of Earth」「United States of America, Planet Earth」と刻まれている。";

const COVER_ALT =
  "黒を背景に撮影されたGolden Recordの刻印入りカバー。金色の表面には4組の図が刻まれている。左上にレコードと針、右上に画像の復号方法、左下に放射状のパルサー地図、右下に2個の水素原子。";

export const ja: Record<string, BeatCopy> = {
  "photo-intro": {
    heading: "THE PALE\nBLUE DOT",
    body: "1990年2月14日、Voyager 1は、後にしてきた世界を振り返った。",
  },
  "photo-distance": {
    body: "太陽から約60億キロメートルの距離では、地球はひとつの光の点にすぎなくなった。",
    note: "太陽を基準にした距離。NASAのアーカイブの説明文は、地球からの斜距離として40億マイル以上という値も挙げている。同じ写真を、別の場所から測ったものだ。",
  },
  "photo-pixel": {
    body: "Voyagerの狭角カメラでは、地球の幅はわずか約0.12ピクセルだった。",
    note: "狭角カメラ、1500 mm。のちのNASAのページは、この値を約1ピクセルに丸めている。",
  },
  "photo-plate": {
    mediaAlt: PLATE_ALT,
    note: "1990年のデータを、2020年にNASA/JPLが再処理したもの。",
  },
  "lastlook-frames": {
    body: "Pale Blue Dotは、一枚きりで撮られた写真ではない。\n\n太陽系の肖像を形づくった、最後の連続撮影の一部だった。",
  },
  "lastlook-worlds": {
    heading: "金星\n地球\n木星\n土星\n天王星\n海王星",
    body: "6つの惑星が、いずれもただの光の点になっていた。",
  },
  "lastlook-plate": {
    mediaAlt: PORTRAIT_ALT,
  },
  "lastlook-cameras": {
    body: "その連続撮影のあと、Voyager 1のカメラは電源を切られた。\n\n旅は続いた。カメラは続かなかった。",
  },
  "voyager-intro": {
    heading: "進み続けた\n機械",
  },
  "voyager-1977": {
    mediaAlt: VOYAGER_ALT,
    body: "Voyager 1は、外惑星をめざして地球を離れた。",
  },
  "voyager-1979": {
    mediaAlt: VOYAGER_ALT,
    body: "2年とたたないうちに、木星を通過した。",
  },
  "voyager-1980": {
    mediaAlt: VOYAGER_ALT,
    body: "土星を過ぎると、その軌道は探査機をさらに外側へと運んでいった。",
  },
  "voyager-2012": {
    mediaAlt: VOYAGER_ALT,
    body: "打ち上げから35年後、Voyager 1は星間空間に入った。",
  },
  "message-intro": {
    heading: "Voyagerが運ぶ\nもう一つのもの",
    body: "Voyagerが積んでいたのは、科学観測機器だけではない。\n\nその側面には、地球を記録した一枚のレコードが取り付けられている。",
  },
  "message-disc": {
    mediaAlt: DISC_ALT,
  },
  "message-object": {
    body: "金めっきを施した銅のレコード、直径30センチメートル。",
  },
  "sent-intro": {
    heading: "レコードが\n一枚だけだとしたら",
    body: "たった一つのものに地球の姿を託すとしたら、私たちはそこに何を収めるだろうか。",
  },
  "sent-images": {
    heading: "からだ\n食べもの\n建物\n科学\n自然\n家族\n惑星そのもの",
    body: "アナログの形式で符号化された、115枚の画像。",
  },
  "sent-languages": {
    body: "55の言語が、耳を傾けているかもしれない誰かに挨拶を送っている。",
  },
  "sent-sounds": {
    heading: "波\n風\n雷\n鳥\nクジラ\n人の暮らし",
  },
  "sent-music": {
    body: "文化と時代を越えて選ばれた、約90分の音楽。",
  },
  "instructions-intro": {
    heading: "共通の\n言語はない",
    body: "このレコードは、受け取る者が人間の言語をひとつも解さないことを前提にしている。\n\nその説明は物理学で書かれている。",
  },
  "cover-rotation": {
    mediaAlt: COVER_ALT,
    body: "最初の図は、レコードの回し方と、一回転にかかる時間を示している。",
  },
  "cover-lines": {
    mediaAlt: COVER_ALT,
    body: "別の図は、記録された信号を画像へ組み立て直す方法を示している。",
  },
  "cover-pulsars": {
    mediaAlt: COVER_ALT,
    body: "パルサーの地図が、太陽系の位置を指し示している。\n\n私たちの故郷の名ではない。その座標だ。",
  },
  "cover-hydrogen": {
    mediaAlt: COVER_ALT,
    body: "水素原子の遷移が、どの図にも共通して使われる時間の単位を与えている。",
  },
  "travel-address": {
    body: "Golden Recordは、特定の宛先に送られたわけではない。\n\nただVoyagerとともに旅を続けている。",
  },
  "travel-40000": {
    body: "Voyagerが別の惑星系に近づくまでには約4万年が過ぎると、NASAは記している。",
  },
  "end-reflection": {
    body: "私たちは自分たちの故郷を、遠くから撮影した。",
  },
  "end-carried": {
    body: "そして、そのほんの一部をさらに遠くへ運んだ。",
  },
  "ack-intro": {
    body: "この作品は、地球を遠くから見ることを可能にしてくれた科学者、技術者、芸術家、音楽家、写真家、アーキビスト、そして語り手たちの仕事の上に成り立っている。\n\n彼らが生み出し、守り伝えてきたものによって、後の世代は、私たちがどこから来たのかという記録だけでなく、かつて私たちが自分自身をどう見ていたかという記録も受け継ぐことができる。",
  },
  "end-dedication": {
    body: "より遠くを見つめ、注意深く記録し、見つけたものを守り伝えた人たちへ。\n\nまだ生まれていない誰かが、いつかそれを見られるように。",
  },
  "end-quote": {
    heading: "“We are attempting to survive our time\nso we may live into yours.”",
    note: "Jimmy Carter · Voyager Golden Recordに搭載されたメッセージ · 1977",
  },
};
