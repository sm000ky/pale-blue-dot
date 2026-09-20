/**
 * Simplified Chinese — the exploration copy.
 *
 * Only the fields this language actually changes are here. Eyebrows, chapter stamps,
 * hotspot labels and plate captions are instrument markings and are the same string
 * in every locale by design, so they live in `en.ts` alone and `beatCopy` merges
 * this table over the English one field by field.
 *
 * Translated as editorial prose from the English source, then reviewed twice against
 * it — once for facts and identifiers, once for register and Chinese typography —
 * and edited by a third pass that was free to reject either reviewer.
 *
 * Numbers, dates, units and identifiers carry through unchanged. `Pale Blue Dot`
 * and `Golden Record` stay in Latin: they name a photograph and an object, and a
 * reader has to be able to match them to what NASA publishes.
 */

import type { BeatCopy } from "./types";

/* The plate descriptions. Two of them are carried by four beats each — the
   spacecraft holds across the Voyager chapter and the cover across the four hotspot
   beats — so they are named once rather than repeated eight times. */
const PLATE_ALT =
  "一片淡蓝与灰的画面，被一道斜向的散射阳光带横穿而过。光带之中，略偏中心右侧，是一个白色的小点：地球。";

const PORTRAIT_ALT =
  "60帧窄角相机画面在黑底上拼成一道弧形的镶嵌图，其中六个放大框分别标注 Jupiter、Earth、Venus、Saturn、Uranus 和 Neptune。每一个放大框里，行星都只是一个光点。";

const VOYAGER_ALT =
  "黑色星空背景下 Voyager 探测器的艺术家想象图：白色抛物面天线朝向另一侧，仪器悬臂与放射性同位素电源装在一侧的桁架上，两根长天线伸出画面之外。";

const DISC_ALT =
  "唱片本身：一张亮如镜面的金色圆盘，标签上刻着“The Sounds of Earth”、“United States of America, Planet Earth”。";

const COVER_ALT =
  "Golden Record 刻有图案的封套，在黑色背景下拍摄。金色表面上刻着四组图示：左上是唱片与唱针，右上是图像的解码方法，左下是放射状的脉冲星地图，右下是两个氢原子。";

export const zhCN: Record<string, BeatCopy> = {
  "photo-intro": {
    heading:
      "THE PALE\nBLUE DOT",
    body:
      "1990年2月14日，Voyager 1 回望它留在身后的那个世界。",
  },
  "photo-distance": {
    body:
      "在距太阳约60亿公里之外，地球只剩下一个光点。",
    note:
      "距离以太阳为基准。NASA 的档案图注还给出了从地球算起的斜距，超过40亿英里——同一张照片，只是从另一处算起。",
  },
  "photo-pixel": {
    body:
      "在 Voyager 的窄角相机里，地球的宽度只有约0.12像素。",
    note:
      "窄角相机，1500 mm。NASA 后来的页面把这个数字取整为约1像素。",
  },
  "photo-plate": {
    mediaAlt: PLATE_ALT,
    note:
      "1990年的数据，由 NASA/JPL 在2020年重新处理。",
  },
  "lastlook-frames": {
    body:
      "Pale Blue Dot 不是一张孤立的照片。\n\n它属于最后一组连续拍摄，那组照片拼成了太阳系的肖像。",
  },
  "lastlook-worlds": {
    heading:
      "金星\n地球\n木星\n土星\n天王星\n海王星",
    body:
      "六颗行星，都缩成了光点。",
  },
  "lastlook-plate": {
    mediaAlt: PORTRAIT_ALT,
  },
  "lastlook-cameras": {
    body:
      "那组拍摄之后，Voyager 1 的相机被关闭了。\n\n旅程还在继续。相机没有。",
  },
  "voyager-intro": {
    heading:
      "一直走下去的\n机器",
  },
  "voyager-1977": {
    mediaAlt: VOYAGER_ALT,
    body:
      "Voyager 1 离开地球，驶向外行星。",
  },
  "voyager-1979": {
    mediaAlt: VOYAGER_ALT,
    body:
      "不到两年后，它掠过木星。",
  },
  "voyager-1980": {
    mediaAlt: VOYAGER_ALT,
    body:
      "过了土星，轨道把它带向更外侧。",
  },
  "voyager-2012": {
    mediaAlt: VOYAGER_ALT,
    body:
      "发射35年后，Voyager 1 进入星际空间。",
  },
  "message-intro": {
    heading:
      "Voyager 还带着\n另一样东西",
    body:
      "Voyager 带上路的不只是科学仪器。\n\n它的侧面装着一张关于地球的唱片。",
  },
  "message-disc": {
    mediaAlt: DISC_ALT,
  },
  "message-object": {
    body:
      "一张镀金的铜制唱片，直径30厘米。",
  },
  "sent-intro": {
    heading:
      "如果只有\n一张唱片",
    body:
      "如果只能由一件东西承载地球的样子，我们会往里面放些什么？",
  },
  "sent-images": {
    heading:
      "身体\n食物\n建筑\n科学\n自然\n家庭\n这颗行星本身",
    body:
      "115张图像，以模拟信号的形式编码。",
  },
  "sent-languages": {
    body:
      "55种语言，向任何可能在听的人问好。",
  },
  "sent-sounds": {
    heading:
      "海浪\n风\n雷\n鸟\n鲸\n人的生活",
  },
  "sent-music": {
    body:
      "约90分钟的音乐，选自不同的文化与年代。",
  },
  "instructions-intro": {
    heading:
      "没有共通的\n语言",
    body:
      "这张唱片假定，它的接收者不懂任何一种人类语言。\n\n它的说明是用物理写成的。",
  },
  "cover-rotation": {
    mediaAlt: COVER_ALT,
    body:
      "第一幅图说明唱片该如何转动，以及转一圈需要多久。",
  },
  "cover-lines": {
    mediaAlt: COVER_ALT,
    body:
      "另一幅图说明如何把记录下来的信号还原成图像。",
  },
  "cover-pulsars": {
    mediaAlt: COVER_ALT,
    body:
      "一张脉冲星地图指向太阳系。\n\n不是我们家园的名字。是它的坐标。",
  },
  "cover-hydrogen": {
    mediaAlt: COVER_ALT,
    body:
      "氢原子的一次跃迁，给出了各幅图示共用的时间单位。",
  },
  "travel-address": {
    body:
      "Golden Record 并没有寄往任何特定的地址。\n\n它只是跟着 Voyager 一起走。",
  },
  "travel-40000": {
    body:
      "NASA 指出，Voyager 要再过大约4万年才会接近另一个行星系。",
  },
  "end-reflection": {
    body:
      "我们从很远的地方，拍下了自己的家园。",
  },
  "end-carried": {
    body:
      "然后把它的一小部分，带到了更远的地方。",
  },
  "ack-intro": {
    body:
      "这件作品建立在许多人的工作之上：科学家、工程师、艺术家、音乐家、摄影师、档案工作者，以及讲故事的人。他们帮助我们从远处望见地球。\n\n他们创造并保存下来的东西，让后来的世代不只继承一份关于我们从何而来的记录——也继承一份关于我们曾经如何看待自己的记录。",
  },
  "end-dedication": {
    body:
      "献给那些望得更远、记录得更仔细、并把发现的东西保存下来的人——\n\n好让尚未出生的某个人，仍然能够看见。",
  },
  "end-quote": {
    heading:
      "“We are attempting to survive our time\nso we may live into yours.”",
    note:
      "Jimmy Carter · 随 Voyager Golden Record 一同送出的讯息 · 1977",
  },
};
