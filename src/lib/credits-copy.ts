/**
 * The attribution sheet's prose, in every language the piece speaks.
 *
 * The panel used to be written in Indonesian and shown to everyone, which was
 * defensible while the piece had one translation and untenable at seven: a reader who
 * chose 日本語 was handed a licence obligation in a language they had not asked for.
 * The words that describe a work now live here, per locale, and merge over English the
 * same way `beatCopy` does.
 *
 * ── What is NOT in this file ───────────────────────────────────────────────────
 *
 * Names. `credits.ts` keeps everything that is the same in every language and must
 * stay verbatim to satisfy the licence it belongs to:
 *
 *   - creator names — Scott Buckley, Bret Bernhoft, NASA/JPL-Caltech
 *   - licence names — CC BY 4.0, Pixabay Content License
 *   - the Pixabay attribution formula, which is a required form of words
 *   - "Aurora", and the archival identifiers PIA23645, PIA00451, PIA17049
 *   - the © lines inside the notice below
 *
 * Translating any of those would break the attribution rather than localise it.
 *
 * ── Two corrections made while translating ─────────────────────────────────────
 *
 * The Indonesian original credited things the build does not show, and translating a
 * false credit into six more languages would have multiplied the error:
 *
 *   - the reference photograph was listed as PIA00452, the 1990 original. The plate on
 *     screen in chapter 01 is PIA23645, NASA's 2020 reprocessing. PIA00452 is on disk
 *     and reaches no beat — `credits-sequence.ts` had already found this and fixed it
 *     in the cinematic credits; the panel had not caught up.
 *   - the archive line claimed eight plates. Five render: PIA23645, PIA00451, PIA17049
 *     and the Golden Record's front and cover. With the reference photograph credited
 *     on its own row, the archive row names the remaining four.
 */

import type { LocaleCode } from "@/lib/locales";
import type { UiStrings } from "@/lib/ui-strings";

/** A credit is described under the same key that labels its row. */
export type CreditCopyKey = keyof UiStrings["roles"];

export type CreditText = {
  /** The work, described. Absent where the title is a name — "Aurora". */
  title?: string;
  /**
   * The rights position in prose, for works whose status has no licence name.
   * `credits.ts` carries the licence name where there is one, and it wins.
   */
  rights?: string;
  /**
   * How the project is using the work, in its own words — printed on its own line
   * under the credit. It states conduct and nothing else: no locale here says
   * licensed, cleared, public domain or used with permission, because the project
   * holds no document that would support any of them.
   */
  usage?: string;
};

const en: Partial<Record<CreditCopyKey, CreditText>> = {
  narration: {
    title:
      "\"Pale Blue Dot\" (1994)\nfrom Pale Blue Dot: A Vision of the Human Future in Space",
    usage:
      "Used in the context of a non-commercial educational portfolio work. No affiliation or endorsement is implied.",
  },
  textures: {
    title:
      "Solar Textures — day map, night lights, clouds, specular map and normal map",
  },
  referencePhoto: {
    title:
      "Pale Blue Dot Revisited — PIA23645\nThe Voyager 1 frame of 14 February 1990, reprocessed by NASA in 2020. The original photograph was captured from roughly 6 billion kilometres from the Sun.",
    rights:
      "Used in accordance with NASA/JPL media usage guidelines",
  },
  archivePlates: {
    rights:
      "Used in accordance with NASA/JPL media usage guidelines",
  },
};

const id: Partial<Record<CreditCopyKey, CreditText>> = {
  narration: {
    title:
      "\"Pale Blue Dot\" (1994)\ndari Pale Blue Dot: A Vision of the Human Future in Space",
    usage:
      "Digunakan dalam konteks karya portofolio non-komersial dan edukatif. Tidak ada afiliasi atau dukungan yang tersirat.",
  },
  textures: {
    title:
      "Solar Textures — peta siang, lampu malam, awan, specular map, dan normal map",
  },
  referencePhoto: {
    title:
      "Pale Blue Dot Revisited — PIA23645\nCitra Voyager 1 tanggal 14 Februari 1990, diproses ulang oleh NASA pada 2020. Foto aslinya diambil dari jarak sekitar 6 miliar kilometer dari Matahari.",
    rights:
      "Digunakan sesuai pedoman penggunaan media NASA/JPL",
  },
  archivePlates: {
    rights:
      "Digunakan sesuai pedoman penggunaan media NASA/JPL",
  },
};

const es: Partial<Record<CreditCopyKey, CreditText>> = {
  narration: {
    title:
      "\"Pale Blue Dot\" (1994)\nde Pale Blue Dot: A Vision of the Human Future in Space",
    usage:
      "Utilizado en el contexto de un trabajo de portafolio educativo y sin fines comerciales. No se implica afiliación ni respaldo alguno.",
  },
  textures: {
    title:
      "Solar Textures — mapa diurno, luces nocturnas, nubes, mapa especular y mapa de normales",
  },
  referencePhoto: {
    title:
      "Pale Blue Dot Revisited — PIA23645\nLa toma de Voyager 1 del 14 de febrero de 1990, reprocesada por la NASA en 2020. La fotografía original se captó a unos 6.000 millones de kilómetros del Sol.",
    rights:
      "Utilizado conforme a las directrices de uso de medios de la NASA/JPL",
  },
  archivePlates: {
    rights:
      "Utilizado conforme a las directrices de uso de medios de la NASA/JPL",
  },
};

const fr: Partial<Record<CreditCopyKey, CreditText>> = {
  narration: {
    title:
      "\"Pale Blue Dot\" (1994)\nextrait de Pale Blue Dot: A Vision of the Human Future in Space",
    usage:
      "Utilisé dans le cadre d’un travail de portfolio éducatif et non commercial. Aucune affiliation ni approbation n’est sous-entendue.",
  },
  textures: {
    title:
      "Solar Textures — carte de jour, lumières nocturnes, nuages, carte spéculaire et carte de normales",
  },
  referencePhoto: {
    title:
      "Pale Blue Dot Revisited — PIA23645\nLa vue de Voyager 1 du 14 février 1990, retraitée par la NASA en 2020. La photographie d’origine a été prise à environ 6 milliards de kilomètres du Soleil.",
    rights:
      "Utilisé conformément aux directives d’utilisation des médias de la NASA/JPL",
  },
  archivePlates: {
    rights:
      "Utilisé conformément aux directives d’utilisation des médias de la NASA/JPL",
  },
};

const de: Partial<Record<CreditCopyKey, CreditText>> = {
  narration: {
    title:
      "\"Pale Blue Dot\" (1994)\naus Pale Blue Dot: A Vision of the Human Future in Space",
    usage:
      "Verwendet im Rahmen einer nicht kommerziellen, edukativen Portfolioarbeit. Eine Verbindung oder Befürwortung wird nicht impliziert.",
  },
  textures: {
    title:
      "Solar Textures — Tagkarte, Nachtlichter, Wolken, Specular-Map und Normal-Map",
  },
  referencePhoto: {
    title:
      "Pale Blue Dot Revisited — PIA23645\nDie Voyager-1-Aufnahme vom 14. Februar 1990, 2020 von der NASA neu bearbeitet. Das Originalfoto entstand aus rund 6 Milliarden Kilometern Entfernung von der Sonne.",
    rights:
      "Verwendet gemäß den Nutzungsrichtlinien der NASA/JPL für Medien",
  },
  archivePlates: {
    rights:
      "Verwendet gemäß den Nutzungsrichtlinien der NASA/JPL für Medien",
  },
};

const ptBR: Partial<Record<CreditCopyKey, CreditText>> = {
  narration: {
    title:
      "\"Pale Blue Dot\" (1994)\nde Pale Blue Dot: A Vision of the Human Future in Space",
    usage:
      "Utilizado no contexto de um trabalho de portfólio educativo e sem fins comerciais. Não se subentende vínculo nem endosso.",
  },
  textures: {
    title:
      "Solar Textures — mapa diurno, luzes noturnas, nuvens, mapa especular e mapa de normais",
  },
  referencePhoto: {
    title:
      "Pale Blue Dot Revisited — PIA23645\nO quadro da Voyager 1 de 14 de fevereiro de 1990, reprocessado pela NASA em 2020. A fotografia original foi feita a cerca de 6 bilhões de quilômetros do Sol.",
    rights:
      "Utilizado de acordo com as diretrizes de uso de mídia da NASA/JPL",
  },
  archivePlates: {
    rights:
      "Utilizado de acordo com as diretrizes de uso de mídia da NASA/JPL",
  },
};

const ja: Partial<Record<CreditCopyKey, CreditText>> = {
  narration: {
    title:
      "\"Pale Blue Dot\"（1994年）\n著書 Pale Blue Dot: A Vision of the Human Future in Space より",
    usage:
      "非営利・教育目的のポートフォリオ作品の文脈で使用している。提携や推奨を示すものではない。",
  },
  textures: {
    title:
      "Solar Textures — 昼面マップ、夜間の灯り、雲、スペキュラマップ、ノーマルマップ",
  },
  referencePhoto: {
    title:
      "Pale Blue Dot Revisited（PIA23645）\n1990年2月14日のVoyager 1のコマを、2020年にNASAが再処理したもの。元の写真は太陽から約60億キロメートルの距離で撮影された。",
    rights:
      "NASA/JPLのメディア利用ガイドラインに従って使用",
  },
  archivePlates: {
    rights:
      "NASA/JPLのメディア利用ガイドラインに従って使用",
  },
};

const zhCN: Partial<Record<CreditCopyKey, CreditText>> = {
  narration: {
    title:
      "\"Pale Blue Dot\"（1994年）\n出自 Pale Blue Dot: A Vision of the Human Future in Space",
    usage:
      "在非营利、教育目的的作品集作品的语境中使用。不表示任何隶属关系或认可。",
  },
  textures: {
    title:
      "Solar Textures — 昼面贴图、夜间灯光、云层、高光贴图与法线贴图",
  },
  referencePhoto: {
    title:
      "Pale Blue Dot Revisited（PIA23645）\nVoyager 1 于1990年2月14日拍下的一帧，NASA 于2020年重新处理。原始照片摄于距太阳约60亿公里处。",
    rights:
      "依据 NASA/JPL 媒体使用指南使用",
  },
  archivePlates: {
    rights:
      "依据 NASA/JPL 媒体使用指南使用",
  },
};

const ko: Partial<Record<CreditCopyKey, CreditText>> = {
  narration: {
    title:
      "\"Pale Blue Dot\"(1994)\n『Pale Blue Dot: A Vision of the Human Future in Space』 수록",
    usage:
      "비영리 교육 목적의 포트폴리오 작업이라는 맥락에서 사용한다. 제휴나 보증을 뜻하지 않는다.",
  },
  textures: {
    title:
      "Solar Textures — 주간 맵, 야간 불빛, 구름, 스페큘러 맵, 노멀 맵",
  },
  referencePhoto: {
    title:
      "Pale Blue Dot Revisited(PIA23645)\n1990년 2월 14일 Voyager 1이 찍은 프레임을 NASA가 2020년에 재처리한 것. 원본 사진은 태양에서 약 60억 킬로미터 떨어진 거리에서 촬영되었다.",
    rights:
      "NASA/JPL 미디어 이용 지침에 따라 사용",
  },
  archivePlates: {
    rights:
      "NASA/JPL 미디어 이용 지침에 따라 사용",
  },
};

const table: Record<LocaleCode, Partial<Record<CreditCopyKey, CreditText>>> = {
  en,
  id,
  es,
  fr,
  de,
  "pt-BR": ptBR,
  ja,
  "zh-CN": zhCN,
  ko,
};

/**
 * One credit's words in one language, English underneath.
 *
 * Merged field by field for the same reason `beatCopy` is: a half-finished translation
 * should show an English sentence rather than an empty row, because an empty row in an
 * attribution sheet is a missing credit and a missing credit is a licence breach.
 */
export function creditText(key: CreditCopyKey, locale: LocaleCode): CreditText {
  return { ...en[key], ...table[locale]?.[key] };
}

/**
 * The rights notice under the sheet.
 *
 * The © lines, the company name and "CC BY 4.0" are identical in all seven: they name
 * parties and a licence. Everything around them is the project speaking, and it speaks
 * to the reader in the language they chose.
 */
export const copyrightNote: Record<LocaleCode, string> = {
  en:
    "The \"Pale Blue Dot\" passage © 1994 Carl Sagan · © 2006 Democritus Properties, LLC. All rights reserved by the rights holders. " +
    "This project is a non-commercial, educational portfolio work and is not affiliated with or endorsed by Democritus Properties, LLC, The Planetary Society, NASA, JPL, Caltech, Scott Buckley, Solar System Scope, or Pixabay. " +
    "Golden Record image titles and historical references are drawn from NASA's archive. NASA states that these images are copyright protected. Any reproduced material is shown with the available source credit, without claiming license or permission unless explicitly documented. " +
    "For attribution, rights, or removal requests, please contact the site owner.",
  id:
    "Kutipan \"Pale Blue Dot\" © 1994 Carl Sagan · © 2006 Democritus Properties, LLC. Seluruh hak dilindungi oleh pemegang hak. " +
    "Proyek ini adalah karya portofolio non-komersial dan edukatif, dan tidak berafiliasi dengan atau didukung oleh Democritus Properties, LLC, The Planetary Society, NASA, JPL, Caltech, Scott Buckley, Solar System Scope, maupun Pixabay. " +
    "Judul gambar dan referensi sejarah Golden Record bersumber dari arsip NASA. NASA menyatakan gambar-gambar tersebut dilindungi hak cipta. Setiap materi yang direproduksi ditampilkan dengan kredit sumber yang tersedia, tanpa klaim lisensi atau izin kecuali dinyatakan secara eksplisit. " +
    "Untuk pertanyaan mengenai atribusi, hak, atau permintaan penghapusan materi, silakan hubungi pengelola situs.",
  es:
    "El pasaje \"Pale Blue Dot\" © 1994 Carl Sagan · © 2006 Democritus Properties, LLC. Todos los derechos reservados por sus titulares. " +
    "Este proyecto es un trabajo de portafolio educativo y sin fines comerciales, y no está afiliado ni respaldado por Democritus Properties, LLC, The Planetary Society, NASA, JPL, Caltech, Scott Buckley, Solar System Scope ni Pixabay. " +
    "Los títulos de las imágenes del Golden Record y las referencias históricas proceden del archivo de la NASA. La NASA declara que estas imágenes están protegidas por derechos de autor. Todo material reproducido se muestra con el crédito de origen disponible, sin reclamar licencia ni permiso salvo que esté documentado de forma explícita. " +
    "Para consultas sobre atribución, derechos o solicitudes de retirada, escriba al responsable del sitio.",
  fr:
    "Le passage \"Pale Blue Dot\" © 1994 Carl Sagan · © 2006 Democritus Properties, LLC. Tous droits réservés par les ayants droit. " +
    "Ce projet est un travail de portfolio éducatif et non commercial, sans lien avec Democritus Properties, LLC, The Planetary Society, la NASA, le JPL, Caltech, Scott Buckley, Solar System Scope ou Pixabay, et sans leur approbation. " +
    "Les titres des images du Golden Record et les références historiques proviennent des archives de la NASA. La NASA indique que ces images sont protégées par le droit d’auteur. Tout élément reproduit est présenté avec le crédit d’origine disponible, sans revendiquer de licence ni d’autorisation, sauf mention explicitement documentée. " +
    "Pour toute question d’attribution, de droits ou toute demande de retrait, veuillez contacter le responsable du site.",
  de:
    "Die Passage \"Pale Blue Dot\" © 1994 Carl Sagan · © 2006 Democritus Properties, LLC. Alle Rechte liegen bei den Rechteinhabern. " +
    "Dieses Projekt ist eine nicht kommerzielle, edukative Portfolioarbeit und steht in keiner Verbindung zu Democritus Properties, LLC, The Planetary Society, NASA, JPL, Caltech, Scott Buckley, Solar System Scope oder Pixabay und wird von ihnen nicht unterstützt. " +
    "Die Bildtitel und historischen Angaben zur Golden Record stammen aus dem Archiv der NASA. Die NASA weist darauf hin, dass diese Bilder urheberrechtlich geschützt sind. Reproduziertes Material wird mit dem verfügbaren Quellennachweis gezeigt, ohne Lizenz oder Genehmigung zu beanspruchen, sofern nicht ausdrücklich dokumentiert. " +
    "Für Fragen zu Nachweisen und Rechten oder für Anfragen zur Entfernung wenden Sie sich bitte an den Betreiber der Seite.",
  "pt-BR":
    "O trecho \"Pale Blue Dot\" © 1994 Carl Sagan · © 2006 Democritus Properties, LLC. Todos os direitos reservados aos titulares. " +
    "Este projeto é um trabalho de portfólio educativo e sem fins comerciais, e não tem vínculo com nem endosso de Democritus Properties, LLC, The Planetary Society, NASA, JPL, Caltech, Scott Buckley, Solar System Scope ou Pixabay. " +
    "Os títulos das imagens do Golden Record e as referências históricas vêm do arquivo da NASA. A NASA declara que essas imagens são protegidas por direitos autorais. Todo material reproduzido é exibido com o crédito de origem disponível, sem reivindicar licença ou permissão salvo quando explicitamente documentado. " +
    "Para questões de atribuição, direitos ou pedidos de remoção, entre em contato com o responsável pelo site.",
  ja:
    "\"Pale Blue Dot\" の一節 © 1994 Carl Sagan · © 2006 Democritus Properties, LLC。権利はすべて権利者に帰属する。 " +
    "このプロジェクトは非営利・教育目的のポートフォリオ作品であり、Democritus Properties, LLC、The Planetary Society、NASA、JPL、Caltech、Scott Buckley、Solar System Scope、Pixabayのいずれとも関係がなく、これらの承認を受けたものでもない。 " +
    "Golden Recordの画像タイトルと歴史的な記述は、NASAのアーカイブによる。NASAはこれらの画像が著作権で保護されていると明記している。転載した素材には入手できる出典クレジットを添えており、明示的に文書化されている場合を除き、ライセンスや許諾を主張するものではない。 " +
    "クレジット、権利、または掲載の取り下げに関するお問い合わせは、サイト管理者までご連絡ください。",
  "zh-CN":
    "\"Pale Blue Dot\" 选段 © 1994 Carl Sagan · © 2006 Democritus Properties, LLC。全部权利归权利人所有。 " +
    "本项目是非营利、教育目的的作品集作品，与 Democritus Properties, LLC、The Planetary Society、NASA、JPL、Caltech、Scott Buckley、Solar System Scope、Pixabay 均无隶属关系，也未获得其认可。 " +
    "Golden Record 的图像标题与历史资料出自 NASA 的档案。NASA 声明这些图像受著作权保护。凡经转载的材料，均附上可获得的来源署名；除非另有明确记录，本站不主张任何授权或许可。 " +
    "如对署名、权利有疑问，或需要申请撤下材料，请联系本站管理者。",
  ko:
    "\"Pale Blue Dot\" 발췌 © 1994 Carl Sagan · © 2006 Democritus Properties, LLC. 모든 권리는 권리자에게 있다. " +
    "이 프로젝트는 비영리 교육 목적의 포트폴리오 작업이며, Democritus Properties, LLC, The Planetary Society, NASA, JPL, Caltech, Scott Buckley, Solar System Scope, Pixabay 어느 곳과도 제휴 관계가 없고 이들의 보증을 받지도 않았다. " +
    "Golden Record의 이미지 제목과 역사적 서술은 NASA의 아카이브에서 가져왔다. NASA는 이 이미지들이 저작권으로 보호된다고 밝히고 있다. 재수록한 자료에는 확인 가능한 출처 크레딧을 함께 표시하며, 명시적으로 문서화된 경우가 아니면 라이선스나 허가를 주장하지 않는다. " +
    "크레딧이나 권리에 관한 문의, 또는 자료 삭제 요청은 사이트 운영자에게 연락해 주기 바란다.",
};
