/**
 * The shape of one beat's words.
 *
 * Five slots, and a beat uses only the ones it needs. They are a hierarchy, not a
 * template: an eyebrow can stand alone, a heading can stand without a body, and a
 * beat that fills all of them is a beat that is doing too much.
 *
 *     eyebrow   mono, small, uppercase — the stamp. '01 / THE PHOTOGRAPH', '0.12 PIXEL'
 *     heading   serif, large — the one thing the beat is about. '\n' is a hard break
 *               the writer chose, so the line lands where it was meant to
 *     body      serif, mid — the claim itself, in prose
 *     note      mono, small — the caveat, the unit, the thing the instrument prints
 *     mediaAlt  the plate's alternative text in this language
 *
 * A beat may also have NO entry at all. The negative-space beats are exactly that,
 * and it is deliberate: the column goes empty and the reader is left with the planet.
 */
export type BeatCopy = {
  eyebrow?: string;
  /** '\n' renders as a hard line break. */
  heading?: string;
  /** '\n\n' is a paragraph break. */
  body?: string;
  note?: string;
  /**
   * Overrides `beat.media.image.alt` for this language. Only the non-English tables
   * need it: the alt text stored with the asset is already the English one.
   */
  mediaAlt?: string;
};
