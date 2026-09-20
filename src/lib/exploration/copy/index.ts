/**
 * The words of the exploration half, in every language the piece speaks.
 *
 * One file per locale, assembled here. The import path is unchanged from when this
 * was a single module — "@/lib/exploration/copy" now resolves to this index — so
 * nothing downstream had to move.
 *
 * ── The merge is the whole design ──────────────────────────────────────────────
 *
 * `beatCopy` layers a locale's table OVER the English one, field by field, rather
 * than choosing between them. That is what lets a translation carry only the fields
 * it actually changes: the eyebrows, the chapter stamps and the plate captions are
 * instrument markings that are identical in every language, so they are written once
 * in `en.ts` and inherited everywhere.
 *
 * It also means a half-finished translation degrades honestly. A beat whose body has
 * been translated but whose note has not shows a translated body and an English note,
 * which is a mixed page — but a mixed page is readable, and a page with a hole in it
 * is not.
 */

import type { LocaleCode } from "@/lib/locales";
import type { BeatCopy } from "./types";
import { en } from "./en";
import { id } from "./id";
import { es } from "./es";
import { fr } from "./fr";
import { de } from "./de";
import { ptBR } from "./pt-BR";
import { ja } from "./ja";
import { zhCN } from "./zh-CN";
import { ko } from "./ko";

export type { BeatCopy } from "./types";

export const copy: Record<LocaleCode, Record<string, BeatCopy>> = {
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
 * The words for one beat in one language, English underneath.
 *
 * An unknown id resolves to an empty block rather than to a throw, for the same
 * reason the subtitles work that way: a beat that arrives with one line missing is
 * still a piece you can read, and a render that fails is not.
 */
export function beatCopy(beatId: string, locale: LocaleCode): BeatCopy {
  const base = en[beatId];
  const localised = copy[locale]?.[beatId];
  if (!base && !localised) return {};
  return { ...base, ...localised };
}
