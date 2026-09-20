/**
 * Korean — the exploration copy.
 *
 * Only the fields this language actually changes are here. Eyebrows, chapter stamps,
 * hotspot labels and plate captions are instrument markings and are the same string
 * in every locale by design, so they live in `en.ts` alone and `beatCopy` merges
 * this table over the English one field by field.
 *
 * Translated as editorial prose from the English source, then reviewed twice against
 * it — once for facts and identifiers, once for register and Korean typography —
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
  "푸른빛과 잿빛이 옅게 깔린 화면을 산란된 햇빛의 띠가 비스듬히 가로지른다. 그 띠 안, 가운데에서 조금 오른쪽에 흰 점이 하나 있다. 지구다.";

const PORTRAIT_ALT =
  "협각 카메라로 찍은 60개의 프레임을 검은 바탕 위에 휘어진 모자이크로 늘어놓았다. 확대 그림 여섯 개에 Jupiter, Earth, Venus, Saturn, Uranus, Neptune의 이름이 각각 적혀 있고, 어느 그림에서도 행성은 빛의 점 하나일 뿐이다.";

const VOYAGER_ALT =
  "검은 별밭을 배경으로 한 Voyager 탐사선의 상상도. 흰 접시 안테나는 반대편을 향해 있고, 관측 기기를 단 지지대와 방사성 동위원소 발전기가 한쪽 트러스에 실려 있으며, 긴 안테나 두 개가 화면 밖으로 뻗어 나간다.";

const DISC_ALT =
  "레코드 그 자체. 거울처럼 빛나는 금빛 원반이고, 라벨에는 “The Sounds of Earth”, “United States of America, Planet Earth”라고 새겨져 있다.";

const COVER_ALT =
  "검은 바탕에 놓고 찍은 Golden Record의 커버. 금빛 표면에 네 묶음의 그림이 새겨져 있다. 왼쪽 위에는 레코드와 바늘, 오른쪽 위에는 이미지를 복원하는 방법, 왼쪽 아래에는 사방으로 뻗은 펄서 지도, 오른쪽 아래에는 수소 원자 두 개.";

export const ko: Record<string, BeatCopy> = {
  "photo-intro": {
    heading:
      "THE PALE\nBLUE DOT",
    body:
      "1990년 2월 14일, Voyager 1은 자신이 떠나온 세계를 돌아보았다.",
  },
  "photo-distance": {
    body:
      "태양에서 약 60억 킬로미터 떨어진 곳에서, 지구는 빛의 점 하나에 지나지 않게 되었다.",
    note:
      "태양을 기준으로 측정한 값이다. NASA 아카이브의 설명문은 지구에서 잰 경사 거리로 40억 마일이 넘는 값도 함께 싣고 있다. 같은 사진을, 다른 지점에서 잰 것이다.",
  },
  "photo-pixel": {
    body:
      "Voyager의 협각 카메라에서 지구는 너비가 약 0.12픽셀에 불과했다.",
    note:
      "협각 카메라, 1500 mm. 나중에 나온 NASA 페이지는 이 값을 약 1픽셀로 반올림한다.",
  },
  "photo-plate": {
    mediaAlt: PLATE_ALT,
    note:
      "1990년의 데이터를 2020년에 NASA/JPL이 재처리한 것이다.",
  },
  "lastlook-frames": {
    body:
      "Pale Blue Dot은 한 장만 따로 찍힌 사진이 아니었다.\n\n태양계의 초상을 이룬 마지막 연속 촬영의 일부였다.",
  },
  "lastlook-worlds": {
    heading:
      "금성\n지구\n목성\n토성\n천왕성\n해왕성",
    body:
      "여섯 개의 행성이 모두 빛의 점으로 줄어들었다.",
  },
  "lastlook-plate": {
    mediaAlt: PORTRAIT_ALT,
  },
  "lastlook-cameras": {
    body:
      "그 연속 촬영을 끝으로 Voyager 1의 카메라는 꺼졌다.\n\n여정은 이어졌다. 카메라는 이어지지 않았다.",
  },
  "voyager-intro": {
    heading:
      "계속 나아간\n기계",
  },
  "voyager-1977": {
    mediaAlt: VOYAGER_ALT,
    body:
      "Voyager 1은 외행성을 향해 지구를 떠났다.",
  },
  "voyager-1979": {
    mediaAlt: VOYAGER_ALT,
    body:
      "2년이 채 되지 않아 목성을 지나갔다.",
  },
  "voyager-1980": {
    mediaAlt: VOYAGER_ALT,
    body:
      "토성을 지난 뒤, 탐사선은 그 궤적을 따라 더 바깥으로 나아갔다.",
  },
  "voyager-2012": {
    mediaAlt: VOYAGER_ALT,
    body:
      "발사로부터 35년 뒤, Voyager 1은 성간 공간에 들어섰다.",
  },
  "message-intro": {
    heading:
      "Voyager가 싣고 있는\n또 하나의 것",
    body:
      "Voyager가 실은 것은 과학 관측 기기만이 아니었다.\n\n그 옆면에는 지구를 기록한 레코드 한 장이 붙어 있다.",
  },
  "message-disc": {
    mediaAlt: DISC_ALT,
  },
  "message-object": {
    body:
      "금을 입힌 구리 레코드, 지름 30센티미터.",
  },
  "sent-intro": {
    heading:
      "레코드가\n단 한 장뿐이라면",
    body:
      "지구가 어떤 곳인지를 단 하나의 물건에 담아야 한다면, 우리는 그 안에 무엇을 넣을까?",
  },
  "sent-images": {
    heading:
      "몸\n음식\n건물\n과학\n자연\n가족\n행성 그 자체",
    body:
      "아날로그 형식으로 부호화된 115장의 이미지.",
  },
  "sent-languages": {
    body:
      "55개의 언어가 듣고 있을지 모를 누군가에게 인사를 건넨다.",
  },
  "sent-sounds": {
    heading:
      "파도\n바람\n천둥\n새\n고래\n사람의 삶",
  },
  "sent-music": {
    body:
      "여러 문화와 시대에서 고른 약 90분의 음악.",
  },
  "instructions-intro": {
    heading:
      "공통의\n언어는 없다",
    body:
      "이 레코드는 받는 이가 인간의 언어를 하나도 모른다고 전제한다.\n\n그 설명은 물리학으로 쓰여 있다.",
  },
  "cover-rotation": {
    mediaAlt: COVER_ALT,
    body:
      "첫 번째 그림은 레코드를 돌리는 방법과 한 바퀴 도는 데 걸리는 시간을 알려 준다.",
  },
  "cover-lines": {
    mediaAlt: COVER_ALT,
    body:
      "또 다른 그림은 기록된 신호를 다시 이미지로 되돌리는 방법을 보여 준다.",
  },
  "cover-pulsars": {
    mediaAlt: COVER_ALT,
    body:
      "펄서 지도가 태양계가 있는 쪽을 가리킨다.\n\n우리 고향의 이름이 아니다. 그 좌표다.",
  },
  "cover-hydrogen": {
    mediaAlt: COVER_ALT,
    body:
      "수소 원자의 전이에서 이 그림들에 공통으로 쓰이는 시간 단위가 나온다.",
  },
  "travel-address": {
    body:
      "Golden Record는 특정한 주소로 부쳐진 것이 아니다.\n\n그저 Voyager와 함께 여행하고 있을 뿐이다.",
  },
  "travel-40000": {
    body:
      "Voyager가 다른 행성계에 다가가기까지 약 4만 년이 지날 것이라고 NASA는 적고 있다.",
  },
  "end-reflection": {
    body:
      "우리는 우리 고향을 먼 곳에서 사진에 담았다.",
  },
  "end-carried": {
    body:
      "그리고 그 작은 일부를 더 멀리까지 실어 보냈다.",
  },
  "ack-intro": {
    body:
      "이 작업은 우리가 지구를 멀리서 볼 수 있게 해 준 과학자, 공학자, 예술가, 음악가, 사진가, 기록 보존가, 이야기꾼들이 해 온 일 위에 서 있다.\n\n그들이 만들고 지켜 온 것들 덕분에, 우리 뒤에 올 세대는 우리가 어디에서 왔는지에 대한 기록만이 아니라 우리가 한때 스스로를 어떻게 보았는지에 대한 기록까지 물려받을 수 있다.",
  },
  "end-dedication": {
    body:
      "더 멀리 바라보고, 꼼꼼히 기록하고, 찾아낸 것을 지켜 온 이들에게.\n\n아직 태어나지 않은 누군가가 언젠가 그것을 볼 수 있도록.",
  },
  "end-quote": {
    heading:
      "“We are attempting to survive our time\nso we may live into yours.”",
    note:
      "Jimmy Carter · Voyager Golden Record에 실린 메시지 · 1977",
  },
};
