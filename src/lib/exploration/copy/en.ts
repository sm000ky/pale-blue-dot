/**
 * English — the source of record.
 *
 * Every other locale is translated from this file and merged over it field by field,
 * so anything absent from a translation falls back to the English here rather than
 * disappearing. That is why the EYEBROWS live only in this table: they are instrument
 * markings — '0.12 PIXEL', '60 FRAMES', '5 SEP 1977 · LAUNCH' — read the same way off
 * a panel in any language, and duplicating them into six more files would be six more
 * places for a number to drift.
 *
 * ── Lists ──────────────────────────────────────────────────────────────────────
 *
 * Three beats are lists — six planets, seven kinds of picture, six sounds. They are
 * set as headings rather than bodies because the heading is the only slot that
 * honours '\n', and a list that reflows into a paragraph stops being a list.
 *
 * ── Rules for whoever edits this ───────────────────────────────────────────────
 *
 *   - Notes carry the disagreement between sources rather than letting the body pick
 *     a winner. Two places that matters: the distance is measured from the Sun and
 *     NASA's archive captions also publish a larger slant range from Earth; and Earth
 *     is 0.12 pixel wide in the caption that figure comes from, while newer NASA
 *     pages round it to about a pixel.
 *   - Nothing goes in that a source does not carry. The count of years and of
 *     requests it supposedly took to get the photograph approved is not in here, and
 *     should not come back.
 *   - Changing a number here changes it in seven languages. The translations were
 *     checked against these values; if you edit one, the check is stale.
 */

import type { BeatCopy } from "./types";

export const en: Record<string, BeatCopy> = {
  /* --------------------------------------------------------- 01 photograph */

  "photo-intro": {
    eyebrow: "01 / THE PHOTOGRAPH",
    heading: "THE PALE\nBLUE DOT",
    body: "On February 14, 1990, Voyager 1 looked back toward the world it had left behind.",
  },
  "photo-distance": {
    eyebrow: "~6 BILLION KM",
    body: "From about six billion kilometres from the Sun, Earth became only a point of light.",
    note: "Measured from the Sun. NASA's archive captions also give a slant range from Earth of more than four billion miles — the same photograph, counted from somewhere else.",
  },
  "photo-pixel": {
    eyebrow: "0.12 PIXEL",
    body: "In Voyager's narrow-angle camera, Earth was only about 0.12 pixel across.",
    note: "Narrow-angle camera, 1500 mm. Later NASA pages round the figure to about one pixel.",
  },
  "photo-plate": {
    eyebrow: "14 FEB 1990",
    note: "The 1990 data, reprocessed by NASA/JPL in 2020.",
  },

  /* ---------------------------------------------------------- 02 last look */

  "lastlook-frames": {
    eyebrow: "60 FRAMES",
    body: "Pale Blue Dot was not a photograph in isolation.\n\nIt was part of the last sequence, the one that formed a portrait of the Solar System.",
  },
  "lastlook-worlds": {
    eyebrow: "SIX PLANETS",
    heading: "Venus\nEarth\nJupiter\nSaturn\nUranus\nNeptune",
    body: "Six planets, reduced to points of light.",
  },
  "lastlook-plate": {
    eyebrow: "FAMILY PORTRAIT",
  },
  "lastlook-cameras": {
    eyebrow: "THE LAST LOOK",
    body: "After that sequence, Voyager 1's cameras were switched off.\n\nIts journey continued. Its cameras did not.",
  },

  /* ----------------------------------------------------------- 03 voyager 1 */

  "voyager-intro": {
    eyebrow: "03 / VOYAGER 1",
    heading: "THE MACHINE\nTHAT KEPT GOING",
  },
  "voyager-1977": {
    eyebrow: "5 SEP 1977 · LAUNCH",
    body: "Voyager 1 left Earth bound for the outer planets.",
  },
  "voyager-1979": {
    eyebrow: "5 MAR 1979 · JUPITER",
    body: "Less than two years later, it passed Jupiter.",
  },
  "voyager-1980": {
    eyebrow: "12 NOV 1980 · SATURN",
    body: "After Saturn, its trajectory carried it outward.",
  },
  "voyager-2012": {
    eyebrow: "25 AUG 2012 · INTERSTELLAR SPACE",
    body: "Thirty-five years after launch, Voyager 1 entered interstellar space.",
  },

  /* ----------------------------------------------------------- 04 message */

  "message-intro": {
    eyebrow: "04 / THE MESSAGE",
    heading: "VOYAGER\nCARRIES SOMETHING ELSE",
    body: "Voyager did not only carry scientific instruments.\n\nMounted to its side is a record about Earth.",
  },
  "message-disc": {
    eyebrow: "GOLDEN RECORD",
  },
  "message-object": {
    eyebrow: "12 INCHES / 30 CM",
    body: "A gold-plated copper record, thirty centimetres across.",
  },

  /* ------------------------------------------------------ 05 what we sent */

  "sent-intro": {
    eyebrow: "05 / WHAT WE SENT",
    heading: "IF YOU HAD\nONE RECORD",
    body: "If one object had to carry an impression of Earth, what would we put inside it?",
  },
  "sent-images": {
    eyebrow: "115 IMAGES",
    heading: "Bodies.\nFood.\nBuildings.\nScience.\nNature.\nFamilies.\nThe planet itself.",
    body: "115 images, encoded in analog form.",
  },

  // The six index beats carry no words of their own beyond the section label; the
  // names are NASA's and come from archive.ts.
  "archive-measuring": {},
  "archive-where": {},
  "archive-planets": {},
  "archive-planet": {},
  "archive-life": {},
  "archive-begins": {},
  "archive-food": {},
  "archive-living": {},
  "archive-people": {},
  "archive-made": {},

  "sent-languages": {
    eyebrow: "55 LANGUAGES",
    body: "Fifty-five languages offer greetings to whoever might be listening.",
  },
  "sent-sounds": {
    eyebrow: "SOUNDS OF EARTH",
    heading: "Surf.\nWind.\nThunder.\nBirds.\nWhales.\nHuman life.",
  },
  "sent-music": {
    eyebrow: "~90 MINUTES OF MUSIC",
    body: "About ninety minutes of music, selected across cultures and eras.",
  },

  /* ------------------------------------------------------ 06 instructions */

  "instructions-intro": {
    eyebrow: "06 / THE INSTRUCTIONS",
    heading: "NO SHARED\nLANGUAGE",
    body: "The record assumes its recipient understands no human language.\n\nIts instructions are written in physics.",
  },
  "cover-rotation": {
    eyebrow: "3.6 SECONDS",
    body: "The first diagram explains how the record should turn and the duration of one rotation.",
  },
  "cover-lines": {
    eyebrow: "512 LINES",
    body: "Another diagram explains how the recorded signal can be reconstructed into an image.",
  },
  "cover-pulsars": {
    eyebrow: "14 PULSARS",
    body: "A pulsar map points toward the Solar System.\n\nNot the name of our home. Its coordinates.",
  },
  "cover-hydrogen": {
    eyebrow: "HYDROGEN",
    body: "A transition of the hydrogen atom provides the time unit used across the diagrams.",
  },

  /* --------------------------------------------------- 07 still travelling */

  "travel-address": {
    eyebrow: "NO DESTINATION",
    body: "The Golden Record was sent to no particular address.\n\nIt simply travels with Voyager.",
  },
  "travel-40000": {
    eyebrow: "40,000 YEARS",
    body: "NASA notes that roughly forty thousand years will pass before Voyager approaches another planetary system.",
  },

  /* ---------------------------------------------------------------- 08 end */

  "end-reflection": {
    eyebrow: "08 / END",
    body: "We photographed our home from far away.",
  },
  "end-carried": {
    body: "Then carried a small part of it farther still.",
  },

  "ack-intro": {
    eyebrow: "ACKNOWLEDGEMENTS",
    body: "This work stands on the work of scientists, engineers, artists, musicians, photographers, archivists, and storytellers who helped us see Earth from afar.\n\nWhat they created and preserved allows generations after us to inherit not only a record of where we came from — but also a record of how we once saw ourselves.",
  },

  // The five credit cards carry no copy: their label and their names come from
  // credits-sequence.ts, which is derived from an audit of the build.

  "end-dedication": {
    eyebrow: "DEDICATION",
    body: "For those who looked farther, recorded carefully, and preserved what they found —\n\nso that someone not yet born might still be able to see it.",
  },
  "end-quote": {
    heading: "“We are attempting to survive our time\nso we may live into yours.”",
    note: "Jimmy Carter · Message placed aboard the Voyager Golden Record · 1977",
  },
  // 'end-void' is intentionally absent. See the header.
};
