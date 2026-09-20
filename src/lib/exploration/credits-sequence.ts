/**
 * The credits, as the sequence shows them.
 *
 * Every line here was derived from the production build rather than written from
 * memory, and the audit is worth recording because the obvious way to write a credit
 * list — from what is in the repository — produces a list that is wrong:
 *
 *   - `public/archive/` holds eight NASA plates. Five are rendered. The 1990 original
 *     of the Pale Blue Dot (PIA00452), the 1977 clean-room photograph and the second
 *     1977 record photograph are on disk and reach no beat, so they are not credited.
 *     Crediting an asset nobody sees is not generosity, it is inaccuracy.
 *   - `credits.ts` still carried PIA00452 as the reference photograph. It is not the
 *     one on screen; PIA23645 is.
 *   - The Earth textures are five specific files, and the renderer names them:
 *     day, night, clouds, specular, normal.
 *   - The runtime dependencies are what `package.json` lists under `dependencies`,
 *     not what a project of this kind usually uses.
 *
 * ── What is deliberately NOT in the cinematic groups ───────────────────────────
 *
 * The forty Golden Record frames are not listed one by one. Each one already
 * prints its own rights holder underneath it, on its own beat, where the reader is
 * actually looking at it — which is a stronger attribution than a name in a list at
 * the end. The credits carry the summary and the notice instead.
 *
 * ── Wording ────────────────────────────────────────────────────────────────────
 *
 * `status` is quoted from what the project already documents. Nothing here says
 * licensed, cleared, approved or used with permission unless the project holds
 * evidence of it, and for the narration and the Golden Record frames it does not.
 */

import type { UiStrings } from "@/lib/ui-strings";

/**
 * The six chrome strings that can title a credit card. Narrowed to exactly these
 * rather than to `keyof UiStrings`, because that wider key also reaches `roles` and
 * `carterTranslation`, and neither of those is a string a card can print.
 */
type CreditLabelKey = Extract<
  keyof UiStrings,
  | "creditNarration"
  | "creditMusic"
  | "creditVisual"
  | "creditRecord"
  | "creditResearch"
  | "creditSoftware"
>;

export type CreditLine = {
  /** Who is being credited. */
  name: string;
  /** Which of their works, and any archival identifier. */
  work?: string;
  /** Licence or rights status, in the project's own words. */
  status?: string;
};

export type CreditGroup = {
  id: string;
  /**
   * Which string in the UI table titles this card — `CREDITS / MUSIC` and its six
   * translations. A key rather than an inline record: with seven languages the label
   * belongs with the other chrome, not scattered through the data.
   */
  labelKey: CreditLabelKey;
  lines: readonly CreditLine[];
};

export const creditGroups: readonly CreditGroup[] = [
  {
    id: "narration",
    labelKey: "creditNarration",
    lines: [
      {
        name: "Carl Sagan",
        work: "Pale Blue Dot (1994)",
        // The canonical wording from credits.ts and COPYRIGHT_NOTE. Not replaced with
        // the shorter "© Democritus Properties": the longer line is the one the
        // project already stands behind, and it names both holders and both years.
        status: "© 1994 Carl Sagan · © 2006 Democritus Properties, LLC",
      },
    ],
  },
  {
    id: "music",
    labelKey: "creditMusic",
    lines: [
      {
        // scottbuckley.com.au asks for: '"Aurora" by Scott Buckley - released under
        // CC-BY 4.0. www.scottbuckley.com.au'. Every element of that is on screen
        // across these three fields, which is what the licence requires.
        name: "Scott Buckley",
        work: "Aurora",
        status: "CC BY 4.0 · scottbuckley.com.au",
      },
      {
        // The encore, which picks up when Aurora ends. It was briefly left off this
        // card because its licence could not be established — the file carries no ID3
        // tag at all — but the source was supplied afterwards, so it is credited in
        // the form Pixabay asks for. A track that plays in the build belongs on the
        // card that says what plays in the build.
        name: "Bret Bernhoft",
        work: "Sound Effect from Pixabay",
        status: "Pixabay Content License · pixabay.com",
      },
    ],
  },
  {
    id: "visual",
    labelKey: "creditVisual",
    lines: [
      { name: "NASA / JPL-Caltech", work: "Pale Blue Dot Revisited · PIA23645" },
      { name: "NASA / JPL-Caltech", work: "Solar System Portrait · PIA00451" },
      { name: "NASA / JPL-Caltech", work: "Voyager in Space, artist's concept · PIA17049" },
      { name: "NASA / JPL-Caltech", work: "Voyager Golden Record — front" },
      { name: "NASA / JPL-Caltech", work: "Voyager Golden Record — cover" },
      {
        // Solar System Scope made the texture maps. They did not make the NASA
        // imagery, and the two are kept on separate lines so the credit cannot be
        // read as claiming otherwise.
        name: "Solar System Scope (INOVE)",
        work: "Earth textures — day, night, clouds, specular, normal",
        status: "CC BY 4.0",
      },
    ],
  },
  {
    id: "record",
    labelKey: "creditRecord",
    lines: [
      { name: "Jon Lomberg", work: "11 frames" },
      { name: "UN/DPI Photo", work: "8 frames" },
      { name: "Frank Drake", work: "7 frames" },
      { name: "NASA", work: "7 frames" },
      { name: "National Astronomy and Ionosphere Center", work: "5 frames" },
      { name: "History of the Olympics, Picturepoint, London", work: "1 frame" },
    ],
  },
  {
    id: "research",
    labelKey: "creditResearch",
    lines: [
      { name: "NASA Science" },
      { name: "NASA Jet Propulsion Laboratory" },
      { name: "The Voyager Mission" },
    ],
  },
  {
    id: "software",
    labelKey: "creditSoftware",
    lines: [
      { name: "Next.js", work: "16.3.4", status: "MIT" },
      { name: "React", work: "19.2.8", status: "MIT" },
      { name: "Three.js", work: "0.185.1", status: "MIT" },
      { name: "GSAP", work: "3.15.0", status: "GreenSock standard licence" },
    ],
  },
];

/** The group a beat names, or undefined — a missing group must not take the page down. */
export function creditGroupById(id: string): CreditGroup | undefined {
  return creditGroups.find((group) => group.id === id);
}

/**
 * The Golden Record rights notice and the label on the way into the full attribution
 * sheet both live in `ui-strings.ts` now, with the rest of the chrome. They were
 * inline two-locale records here; at seven languages that is a table, and a table
 * belongs in one place.
 */
