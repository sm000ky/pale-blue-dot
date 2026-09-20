/**
 * The spine of the exploration half: what beats exist, in what order, how long each
 * one holds the stage, and which archive plate — if any — it puts on screen.
 *
 * This file holds no prose and no language. A beat is a position in the sequence plus
 * the time it owns; the words that land there live in `copy.ts`, keyed by the same id. Splitting them is what lets the
 * structure be judged — pacing, rhythm, how long a claim is allowed to hold the
 * frame — without reading a word of it, and lets a second language be added without
 * touching the pacing.
 *
 * `seconds` is how long a beat owns the stage. NOTHING SCROLLS AND NOTHING IS
 * DRAGGED: the sequence plays itself, one beat dissolving into the next in the same
 * fixed rectangle, and this number is the only thing that decides the pace. The scale
 * used here:
 *
 *     ~ 6.5s   one line of a timeline, read once
 *     ~ 6.8s   a fact with two clauses
 *     ~ 7.1s   a chapter opening — a change of subject, not a longer read
 *     ~ 7.9s   a beat over a plate that is already on screen (chapters 03 and 06) —
 *              nothing is arriving, only a new region of it is being named
 *     ~ 9.6s   a plate arriving: a photograph has to be looked at before it is left
 *     ~10.0s   the one plate the script asks to be shown large
 *     ~11.0s   a group of the picture archive: four photographs and four credits,
 *              which is looking rather than reading and needs the extra time
 *
 * Below about six seconds a beat is gone before it has been read; past about fifteen
 * the reader has finished and is waiting, which on a sequence that cannot be scrubbed
 * is the worse failure of the two.
 *
 * Only 55% of a beat is the hold — the rest is the crossfade out of it and into the
 * next, which the renderer drives off the same number. See the fade envelope at the
 * top of ExplorationSequence.
 *
 * Total: 338s — five minutes thirty-eight — across 41 beats in eight chapters. It
 * runs under Aurora, which has 498s of its own left once the reading ends, so the
 * sequence finishes with the bed still playing and never reaches the encore's loop
 * point unless the reader lingers on the closing card.
 *
 * ── Plates and rights ──────────────────────────────────────────────────────────
 *
 * This file holds the piece's own plates — the photographs it puts on the stage. All
 * eight are NASA/JPL-Caltech, and every credit line was read on the publisher's own
 * page for that exact asset and quoted rather than paraphrased. Nothing enters on the
 * strength of a general belief about how NASA imagery is usually handled.
 *
 *   'nasa_public'
 *       The asset's own detail page credits NASA, JPL or NASA/JPL-Caltech, and the
 *       page carries no third-party copyright notice. That is every entry in
 *       `archiveImages` below, and the type is narrowed to the literal so nothing
 *       else can be added to it by mistake.
 *
 * The 115 pictures carried ON the record are a different matter, with a different and
 * much more complicated rights position, and they live in their own file —
 * `archive.ts`. That file opens with the whole of it: NASA's copyright notice quoted
 * in full, the thirty-two frames NASA credits to named third parties, and the record
 * of who decided to publish them and on what basis. Read it before touching anything
 * to do with chapter 05.
 *
 * The candidate and rejection tables that used to sit here are gone. They existed to
 * hold frames that were staged but not published; every one of them is now published,
 * with its credit printed, so a table describing them as pending would simply be
 * false. Their evidence was not discarded — it was folded into `archive.ts`, which is
 * now the single place the question is answered.
 *
 * Three 'nasa_public' assets are on disk but unused, rather than forced into a beat
 * the script does not have: the 1990 original of the Pale Blue Dot (PIA00452 —
 * superseded here by the reprocessed PIA23645, which is the same 1990 data at four
 * times the size), the 1977 clean-room photograph, whose subject is Voyager 2, and
 * a second 1977 record photograph.
 */

export type BeatKind =
  | "chapter"
  | "fact"
  | "media"
  | "archive"
  | "credit"
  | "reflection"
  | "ending";

/**
 * An archive plate, stored whole rather than as a bare `src`.
 *
 * The point is that a file path alone cannot be audited. Anyone who later asks
 * where a picture came from, who is owed the credit, or on what grounds it was
 * published, gets the answer from the same object the renderer reads — not from a
 * spreadsheet that has since drifted from the code.
 *
 * `width` and `height` are the intrinsic pixel dimensions of the file on disk. They
 * are here so the frame can be reserved before the bytes arrive; a plate that
 * changes the height of the column after it decodes would shove the caption around
 * on a pinned stage that is supposed to be still.
 */
export type ArchiveImage = {
  /**
   * Always 'nasa_public' here — the type is narrowed to the literal so that an asset
   * with a third-party rights holder cannot be added to `archiveImages` by mistake.
   * The record's own 115 frames are not plates and never pass through here — they
   * are the archive, they carry other people's credits, and they live in archive.ts.
   */
  rights: "nasa_public";
  /** Public path, already converted to webp under `public/archive/`. */
  src: string;
  /** The publisher's page for this exact asset — where the credit line was read. */
  sourcePage: string;
  /** The publisher's own title for the asset. Not translated, not tidied. */
  title: string;
  /** Printed credit, exactly as the source page words it. */
  credit: string;
  /** English alternative text. `copy.ts` may override it per language. */
  alt: string;
  /** What the source page said about rights, in full. */
  rightsNote: string;
  width: number;
  height: number;
};

export const archiveImages = {
  paleBlueDot: {
    rights: "nasa_public",
    src: "/archive/pale-blue-dot-revisited.webp",
    sourcePage: "https://science.nasa.gov/photojournal/pale-blue-dot-revisited/",
    title: "Pale Blue Dot Revisited (PIA23645)",
    credit: "NASA/JPL-Caltech",
    alt: "A pale field of blue and grey crossed by a diagonal band of scattered sunlight. Inside the band, a little right of centre, a single white speck: Earth.",
    rightsNote:
      "PIA23645 detail page credits exactly “NASA/JPL-Caltech”, with no copyright statement and no third party on the credit line. The page describes a 2020 reprocessing of the 14 February 1990 data by Kevin M. Gill, Candy Hansen and William Kosmann — all NASA/JPL personnel, and NASA still publishes it under the single agency credit.",
    width: 1400,
    height: 1385,
  },
  voyagerSpacecraft: {
    rights: "nasa_public",
    src: "/archive/voyager-spacecraft.webp",
    sourcePage: "https://science.nasa.gov/photojournal/voyager-in-space-artist-concept/",
    title: "Voyager in Space (Artist Concept) (PIA17049)",
    credit: "NASA/JPL-Caltech",
    alt: "An artist's rendering of a Voyager spacecraft against a black star field: a white parabolic dish facing away, the instrument boom and the radioisotope generators carried on trusses to one side, and two long antennae running off the frame.",
    rightsNote:
      "PIA17049 detail page credits exactly “NASA/JPL-Caltech” and carries no copyright statement. It is a rendering, not a photograph — the caption says so — and the beat's own caption prints ARTIST'S CONCEPT for the same reason: Voyager 1 has never been photographed in flight, and nothing in this piece may imply otherwise. Chosen over the 2025 concept PIA26353, which is the same subject on a violet nebula, because this one is on black and does not bring a second palette into the piece.",
    width: 1280,
    height: 720,
  },
  familyPortrait: {
    rights: "nasa_public",
    src: "/archive/solar-system-family-portrait.webp",
    sourcePage: "https://science.nasa.gov/photojournal/solar-system-portrait-60-frame-mosaic/",
    title: "Solar System Portrait — 60 Frame Mosaic (PIA00451)",
    credit: "NASA/JPL-Caltech",
    alt: "Sixty narrow-angle frames laid out as a curved mosaic on black, with six insets labelled Jupiter, Earth, Venus, Saturn, Uranus and Neptune. In every inset the planet is a single point of light.",
    rightsNote:
      "PIA00451 detail page credits exactly “NASA/JPL-Caltech”, with no other rights holder named. A 60-frame Voyager 1 mosaic: mission product throughout.",
    width: 1400,
    height: 420,
  },
  recordCover: {
    rights: "nasa_public",
    src: "/archive/golden-record-cover.webp",
    sourcePage: "https://science.nasa.gov/image-detail/voyager-record-cover-446eb9/",
    title: "The Golden Record Cover",
    credit: "NASA/JPL-Caltech",
    alt: "The engraved cover of the Golden Record, photographed against black. Four groups of diagrams are cut into the gold surface: the record and its stylus at upper left, a picture-decoding scheme at upper right, a radiating pulsar map at lower left, two hydrogen atoms at lower right.",
    rightsNote:
      "Detail page credits exactly “NASA/JPL-Caltech”, caption “The Golden Record Cover”, no copyright statement. This is the engraved cover made for NASA/JPL — not the record's image gallery, whose contents carry third-party rights.",
    width: 1400,
    height: 1400,
  },
  recordFront: {
    rights: "nasa_public",
    src: "/archive/golden-record-front.webp",
    sourcePage: "https://science.nasa.gov/image-detail/voyager-gold-record-front/",
    title: "Voyager Golden Record — Front",
    credit: "NASA/JPL-Caltech",
    alt: "The record itself: a mirror-bright gold disc, its label engraved “The Sounds of Earth”, “United States of America, Planet Earth”.",
    rightsNote:
      "Detail page credits exactly “NASA/JPL-Caltech”, no copyright statement. A NASA-owned artefact photographed by NASA/JPL.",
    width: 1400,
    height: 1397,
  },

  // The three below are on disk and carry no beat. They are listed anyway: the point
  // of this table is that it accounts for every file in public/archive/, so that
  // "what is this picture and may we use it" is answerable without a download log.
  paleBlueDot1990: {
    rights: "nasa_public",
    src: "/archive/pale-blue-dot-1990.webp",
    sourcePage: "https://science.nasa.gov/photojournal/solar-system-portrait-earth-as-pale-blue-dot",
    title: "Solar System Portrait — Earth as 'Pale Blue Dot' (PIA00452)",
    credit: "NASA/JPL-Caltech",
    alt: "The 1990 original: a narrow band of scattered sunlight on a dark field, with Earth a single bright speck inside it.",
    rightsNote:
      "PIA00452 detail page prints “Credits: NASA/JPL-Caltech” and no copyright statement. The 1990 release of the same data that PIA23645 reprocesses; superseded here only on resolution, not on rights.",
    width: 453,
    height: 614,
  },
  recordMounting: {
    rights: "nasa_public",
    src: "/archive/golden-record-mounting-1977.webp",
    sourcePage: "https://science.nasa.gov/image-detail/the-golden-record-30269492703-o/",
    title: "The Voyager Golden Record",
    credit: "NASA/JPL-Caltech",
    alt: "A gloved technician in a clean-room smock stands over a white table. On it, the gold record and its gold cover lie face up on tissue; behind, three more figures in smocks wait by a wall.",
    rightsNote:
      "Detail page credits exactly “NASA/JPL-Caltech”, caption “Mounting of the Voyager Golden Record in 1977.”, no copyright statement anywhere on the page. Matched to the file by its native 1280×1296 — the separate page titled “Voyager Golden Record - Mounting” is a different 1280×1015 frame, so the local filename is misleading and the sourcePage here is the authority.",
    width: 1280,
    height: 1296,
  },
  recordCleanRoom: {
    rights: "nasa_public",
    src: "/archive/golden-record-clean-room-1977.webp",
    sourcePage: "https://science.nasa.gov/image-detail/john-casani-8-4-77-30584323590-o/",
    title: "Voyager Golden Record — Clean Room",
    credit: "NASA/JPL-Caltech",
    alt: "John Casani holds a small folded American flag in a clean room at Cape Canaveral. On the table below him lie the Golden Record and its cover; behind him stands Voyager 2, wrapped and scaffolded, before launch.",
    rightsNote:
      "Detail page credits exactly “NASA/JPL-Caltech”, no copyright statement. Caption names John Casani, Voyager project manager, Cape Canaveral, 4 August 1977, with Voyager 2 in the background — which is why it is unused: this half of the piece follows Voyager 1.",
    width: 1400,
    height: 1820,
  },
} as const satisfies Record<string, ArchiveImage>;

/**
 * A point on the plate, in percent of the image's own box, with the name of what is
 * there. Percent rather than pixels because the plate is fluid: the frame is a share
 * of a column that is itself `min(32rem, 74vw)`, so there is no pixel grid to aim at.
 *
 * Chapter 06 is what this exists for. Four beats share one photograph of the record
 * cover and each names a different quarter of it, so the plate must stay put while
 * the marker moves — the reader is being shown where to look, and a plate that
 * re-enters between beats would take the region they had just found away from them.
 * Coordinates were measured against the file, not guessed from the layout.
 *
 * `label` is a stamp in the same register as an eyebrow, not a sentence: it stays in
 * one form in both languages, like `0.12 PIXEL` and `60 FRAMES` do.
 */
export type Hotspot = {
  xPct: number;
  yPct: number;
  label: string;
};

export type BeatMedia = {
  /**
   * `ArchiveImage` and nothing else, so the only pictures that can become a plate
   * are the eight the piece owns outright. The record's own 115 frames are not
   * plates: they are the archive, they carry other people's credits, and they are
   * rendered by their own component from their own file. Keeping the two apart in the
   * type is what stops one from quietly acquiring the other's rights position.
   */
  image: ArchiveImage;
  /**
   * The caption under the frame. Not localised — it is a title, a designation and a
   * credit, and all three belong to the publisher. The sentence that carries meaning
   * is the beat's `body`, which is localised.
   */
  note: string;
  /**
   * A plate the script names as one of the piece's principal images, and the flag the
   * sizing reads: a priority plate is given the wide cap and the taller column, so it
   * lands at roughly 420–500px on a desktop column rather than the ~224px it got when
   * every plate shared one conservative reserve. Not every visual gets it — that is
   * the point of it being a flag.
   */
  priority?: true;
  /** The script asks for one plate to be shown large. This is that flag. */
  large?: true;
  /**
   * True when the previous beat was already showing this same plate. The frame is
   * continuing, not arriving: it should not re-enter, and only the marker over it
   * changes. Chapter 06 is four of these in a row.
   */
  persists?: true;
};

export type Beat = {
  /** Globally unique across every chapter — it is the React key and the copy key. */
  id: string;
  kind: BeatKind;
  /** How long this beat holds the stage, in seconds, before the crossfade out. */
  seconds: number;
  /** Markers printed beside the eyebrow, resolved through `sources.ts`. */
  sourceIds?: readonly string[];
  /** Only for kind 'media'. */
  media?: BeatMedia;
  /** A point on that plate the beat is about. Meaningless without `media`. */
  hotspot?: Hotspot;
  /**
   * Only for kind 'archive': which group of the Golden Record picture index this
   * beat prints. The names themselves live in `archive.ts`, because they are read
   * off NASA's pages rather than written here, and because a list of forty titles
   * inside the pacing table would bury the pacing.
   */
  archiveGroupId?: string;
  /**
   * Only for kind 'credit': which group of the closing credits this beat prints.
   * The names live in `credits-sequence.ts`, because they are the result of an audit
   * of the build rather than something written here.
   */
  creditGroupId?: string;
};

export type Chapter = {
  id: string;
  /** Printed, not computed: '01'. */
  index: string;
  /**
   * The chapter's name, printed as part of its stamp: `01 / THE PHOTOGRAPH`. English
   * in both languages, like every other stamp in the instrument.
   *
   * Where the script left a chapter's opening beat without an eyebrow of its own,
   * that beat's eyebrow *is* this stamp, so the reader sees it even though nothing
   * else in the page prints chapter titles yet. Two chapters — 02 and 07 — open on
   * an eyebrow the script does specify, and their stamp lives here only.
   */
  title: string;
  beats: readonly Beat[];
};

/**
 * The eight chapters, and the sentence that gets you from each one to the next.
 *
 * The order is an argument, not a table of contents, and it is written here so that
 * a reader who asks "why am I seeing this next?" has an answer at every join:
 *
 *   01 THE PHOTOGRAPH    Here is the picture.
 *        ↓ and a picture was taken by something, from somewhere, for a reason
 *   02 THE LAST LOOK     It was one of sixty, and the last the cameras ever made.
 *        ↓ if that was the last thing it did with a camera, what was doing the looking
 *   03 VOYAGER 1         This is the machine, and it is still going.
 *        ↓ a machine that outlives its mission is carrying something onward
 *   04 THE MESSAGE       It carries something its mission never needed.
 *        ↓ so what is on it
 *   05 WHAT WE SENT      A hundred and fifteen pictures, and here are their names.
 *        ↓ pictures are useless to someone who cannot work out how to read them
 *   06 THE INSTRUCTIONS  The cover explains itself in physics.
 *        ↓ all of that is still in flight
 *   07 STILL TRAVELLING  Addressed to nobody, forty thousand years from anywhere.
 *        ↓ and that is the whole of it
 *   08 END               We photographed home, then carried a piece of it further.
 *
 * Two joins were rebuilt to make that hold. The Family Portrait now lands BEFORE the
 * cameras are switched off, so "its photography did not continue" is the last thing
 * chapter 02 says and reads as the doorway into chapter 03 rather than as a footnote
 * under a picture. And the record itself now arrives in chapter 04 without its
 * measurements attached — the object first, the specification a beat later — because
 * a reader who has just been told what a thing is will not take in how wide it is in
 * the same breath.
 */
export const chapters: readonly Chapter[] = [
  {
    id: "photograph",
    index: "01",
    title: "THE PHOTOGRAPH",
    beats: [
      { id: "photo-intro", kind: "chapter", seconds: 7.1, sourceIds: ["01"] },
      { id: "photo-distance", kind: "fact", seconds: 6.5, sourceIds: ["01", "04"] },
      { id: "photo-pixel", kind: "fact", seconds: 6.5, sourceIds: ["04", "01"] },
      // The chapter's full stop: three claims about how small, then the thing itself.
      {
        id: "photo-plate",
        kind: "media",
        seconds: 9.6,
        sourceIds: ["01"],
        media: {
          image: archiveImages.paleBlueDot,
          note: "PALE BLUE DOT / VOYAGER 1 · 14 FEB 1990 / NASA/JPL-Caltech",
          priority: true,
        },
        // Measured off the file: the brightest pixel against its own local
        // background, which is the crescent itself. Without a marker the reader is
        // being asked to find 0.12 of a pixel by eye, and will not.
        hotspot: { xPct: 59.4, yPct: 51.9, label: "EARTH" },
      },
    ],
  },
  {
    id: "last-look",
    index: "02",
    title: "THE LAST LOOK",
    beats: [
      { id: "lastlook-frames", kind: "chapter", seconds: 7.1, sourceIds: ["03", "01"] },
      { id: "lastlook-worlds", kind: "fact", seconds: 6.8, sourceIds: ["03"] },
      {
        id: "lastlook-plate",
        kind: "media",
        seconds: 9.6,
        sourceIds: ["03"],
        media: {
          image: archiveImages.familyPortrait,
          note: "THE FAMILY PORTRAIT / 60 FRAMES · 6 PLANETS · 14 FEB 1990 / NASA/JPL-Caltech",
          priority: true,
        },
      },
      // Moved to the end of the chapter: this is the hinge into Voyager 1, and it
      // only works there. Said before the portrait it is a caption; said after it,
      // with the sixty frames still on screen behind the reader's eye, it is the
      // moment the mission stops being about pictures.
      { id: "lastlook-cameras", kind: "fact", seconds: 6.8, sourceIds: ["01", "02"] },
    ],
  },
  {
    id: "voyager",
    index: "03",
    title: "VOYAGER 1",
    beats: [
      { id: "voyager-intro", kind: "chapter", seconds: 6.8 },

      // One spacecraft, held still under all four dates. The plate arrives with the
      // launch and `persists` through Jupiter, Saturn and interstellar space, so the
      // reader watches one object stay on screen while thirty-five years pass beside
      // it. Four pictures of Voyager would say the opposite of what one picture,
      // unmoved, says here.
      {
        id: "voyager-1977",
        kind: "media",
        seconds: 7.3,
        sourceIds: ["02"],
        media: {
          image: archiveImages.voyagerSpacecraft,
          note: "VOYAGER / ARTIST'S CONCEPT · PIA17049 / NASA/JPL-Caltech",
          priority: true,
        },
      },
      {
        id: "voyager-1979",
        kind: "media",
        seconds: 6.8,
        sourceIds: ["02"],
        media: {
          image: archiveImages.voyagerSpacecraft,
          note: "VOYAGER / ARTIST'S CONCEPT · PIA17049 / NASA/JPL-Caltech",
          priority: true,
          persists: true,
        },
      },
      {
        id: "voyager-1980",
        kind: "media",
        seconds: 6.8,
        sourceIds: ["02"],
        media: {
          image: archiveImages.voyagerSpacecraft,
          note: "VOYAGER / ARTIST'S CONCEPT · PIA17049 / NASA/JPL-Caltech",
          priority: true,
          persists: true,
        },
      },
      {
        id: "voyager-2012",
        kind: "media",
        seconds: 7.3,
        sourceIds: ["02"],
        media: {
          image: archiveImages.voyagerSpacecraft,
          note: "VOYAGER / ARTIST'S CONCEPT · PIA17049 / NASA/JPL-Caltech",
          priority: true,
          persists: true,
        },
      },
    ],
  },
  {
    id: "message",
    index: "04",
    title: "THE MESSAGE",
    beats: [
      { id: "message-intro", kind: "chapter", seconds: 7.5, sourceIds: ["05"] },
      // The object, alone, with nothing measured about it. The caption under the
      // frame carries the material and the diameter for anyone who looks down; the
      // beat itself does not, because "what is this" and "how big is it" are two
      // different questions and the second one is not interesting yet.
      {
        id: "message-disc",
        kind: "media",
        seconds: 10,
        sourceIds: ["05", "06"],
        media: {
          image: archiveImages.recordFront,
          note: "GOLDEN RECORD / 30 CM · GOLD-PLATED COPPER / NASA/JPL-Caltech",
          priority: true,
          large: true,
        },
      },
      { id: "message-object", kind: "fact", seconds: 6.7, sourceIds: ["05", "06"] },
    ],
  },
  {
    id: "what-we-sent",
    index: "05",
    title: "WHAT WE SENT",
    beats: [
      { id: "sent-intro", kind: "chapter", seconds: 7.1 },
      { id: "sent-images", kind: "fact", seconds: 6.7, sourceIds: ["06", "07"] },

      // The index. Six beats, one group each, and the reason the chapter is longer
      // than the others: "115 images" is a number a reader nods at and forgets, and
      // forty of the actual names is the same claim made unforgettable. No picture is
      // reproduced here — every line is a title and a link to NASA's own page.
      // The archive. Ten beats, one group of four frames each, and the reason chapter
      // 05 is the longest in the piece: "115 images" is a number a reader nods at and
      // forgets, and forty of the actual pictures — with the name of whoever owns each
      // one printed underneath it — is the same claim made unforgettable. The rights
      // position behind those credits is set out in full at the top of archive.ts.
      {
        id: "archive-measuring",
        kind: "archive",
        seconds: 11,
        sourceIds: ["07"],
        archiveGroupId: "measuring",
      },
      {
        id: "archive-where",
        kind: "archive",
        seconds: 11,
        sourceIds: ["07"],
        archiveGroupId: "where",
      },
      {
        id: "archive-planets",
        kind: "archive",
        seconds: 11,
        sourceIds: ["07"],
        archiveGroupId: "planets",
      },
      {
        id: "archive-planet",
        kind: "archive",
        seconds: 11,
        sourceIds: ["07"],
        archiveGroupId: "planet",
      },
      {
        id: "archive-life",
        kind: "archive",
        seconds: 11,
        sourceIds: ["07"],
        archiveGroupId: "life",
      },
      {
        id: "archive-begins",
        kind: "archive",
        seconds: 11,
        sourceIds: ["07"],
        archiveGroupId: "begins",
      },
      {
        id: "archive-food",
        kind: "archive",
        seconds: 11,
        sourceIds: ["07"],
        archiveGroupId: "food",
      },
      {
        id: "archive-living",
        kind: "archive",
        seconds: 11,
        sourceIds: ["07"],
        archiveGroupId: "living",
      },
      {
        id: "archive-people",
        kind: "archive",
        seconds: 11,
        sourceIds: ["07"],
        archiveGroupId: "people",
      },
      {
        id: "archive-made",
        kind: "archive",
        seconds: 11,
        sourceIds: ["07"],
        archiveGroupId: "made",
      },

      { id: "sent-languages", kind: "fact", seconds: 6.5, sourceIds: ["08"] },
      { id: "sent-sounds", kind: "fact", seconds: 6.8, sourceIds: ["06", "09"] },
      { id: "sent-music", kind: "fact", seconds: 6.5, sourceIds: ["06", "09"] },
    ],
  },
  {
    id: "instructions",
    index: "06",
    title: "THE INSTRUCTIONS",
    beats: [
      { id: "instructions-intro", kind: "chapter", seconds: 7.1, sourceIds: ["10"] },
      // One plate, four regions. It arrives here and stays until the chapter ends.
      {
        id: "cover-rotation",
        kind: "media",
        seconds: 7.9,
        sourceIds: ["10"],
        media: {
          image: archiveImages.recordCover,
          note: "GOLDEN RECORD COVER / VOYAGER · 1977 / NASA/JPL-Caltech",
          priority: true,
        },
        hotspot: { xPct: 30, yPct: 30, label: "3.6 S" },
      },
      {
        id: "cover-lines",
        kind: "media",
        seconds: 7.9,
        sourceIds: ["10"],
        media: {
          image: archiveImages.recordCover,
          note: "GOLDEN RECORD COVER / VOYAGER · 1977 / NASA/JPL-Caltech",
          priority: true,
          persists: true,
        },
        hotspot: { xPct: 65.7, yPct: 47.1, label: "512" },
      },
      {
        id: "cover-pulsars",
        kind: "media",
        seconds: 8.3,
        sourceIds: ["10"],
        media: {
          image: archiveImages.recordCover,
          note: "GOLDEN RECORD COVER / VOYAGER · 1977 / NASA/JPL-Caltech",
          priority: true,
          persists: true,
        },
        hotspot: { xPct: 32, yPct: 72, label: "14" },
      },
      {
        id: "cover-hydrogen",
        kind: "media",
        seconds: 7.9,
        sourceIds: ["10"],
        media: {
          image: archiveImages.recordCover,
          note: "GOLDEN RECORD COVER / VOYAGER · 1977 / NASA/JPL-Caltech",
          priority: true,
          persists: true,
        },
        hotspot: { xPct: 66.4, yPct: 81.6, label: "H" },
      },
    ],
  },
  {
    id: "still-travelling",
    index: "07",
    title: "STILL TRAVELLING",
    beats: [
      { id: "travel-address", kind: "fact", seconds: 6.5, sourceIds: ["05"] },
      { id: "travel-40000", kind: "fact", seconds: 6.8, sourceIds: ["05", "02"] },
    ],
  },
  {
    id: "end",
    index: "08",
    title: "END",
    beats: [
      // Two sentences, one per beat, because they are the two halves of the piece and
      // putting them in one block lets the reader take them as a single thought.
      { id: "end-reflection", kind: "reflection", seconds: 7.5 },
      { id: "end-carried", kind: "reflection", seconds: 7.5 },

      // Substantial negative space before the credits begin. Nothing is on the stage
      // and only the planet is lit — the reflection is allowed to finish landing
      // before anything else is asked of the reader.
      { id: "end-space", kind: "ending", seconds: 5 },

      // The acknowledgement holds longer than any other beat of prose in the piece.
      // It is eight lines and it is the one place the work speaks about itself.
      { id: "ack-intro", kind: "reflection", seconds: 17 },

      // Five credit cards, each with room to be read rather than glimpsed. The label
      // is the eyebrow, the names are the content; the data comes from an audit of
      // what this build actually loads, not from what is in the repository.
      { id: "credit-narration", kind: "credit", seconds: 9, creditGroupId: "narration" },
      { id: "credit-music", kind: "credit", seconds: 9, creditGroupId: "music" },
      { id: "credit-visual", kind: "credit", seconds: 13, creditGroupId: "visual" },
      // Carries the rights notice as well as the tally, which is why it holds longer
      // than its six lines would otherwise need.
      { id: "credit-record", kind: "credit", seconds: 13, creditGroupId: "record" },
      { id: "credit-research", kind: "credit", seconds: 8.5, creditGroupId: "research" },
      // The last card, and the one carrying the way into the full attribution sheet.
      { id: "credit-software", kind: "credit", seconds: 10, creditGroupId: "software" },

      // A dedication holds longer than a credit: it is the only thing in the piece
      // addressed to anyone.
      { id: "end-dedication", kind: "reflection", seconds: 15 },

      // Carter, 1977. Very long and very quiet — it is the last thing anyone said.
      { id: "end-quote", kind: "reflection", seconds: 19 },

      // A brief blank, so the quote is not still on screen when the card arrives.
      { id: "end-blank", kind: "ending", seconds: 4.5 },

      // Nothing renders here. Reaching the far end of it is what hands over to the
      // closing card, and nothing appears after that card.
      { id: "end-void", kind: "ending", seconds: 6 },
    ],
  },
];

/** Flat and in reading order — the scroll only ever knows this list. */
export const allBeats: readonly Beat[] = chapters.flatMap((chapter) => chapter.beats);

/** How long the whole sequence runs, in seconds. */
export const totalSeconds: number = allBeats.reduce((sum, beat) => sum + beat.seconds, 0);

const chapterByBeatId = new Map<string, Chapter>(
  chapters.flatMap((chapter) => chapter.beats.map((beat) => [beat.id, chapter] as const)),
);

/**
 * The chapter a beat belongs to. The scroll reads `allBeats` flat and would
 * otherwise have no way back to the stamp — `01 / THE PHOTOGRAPH` — that the beat
 * sits under.
 */
export function chapterForBeat(beatId: string): Chapter | undefined {
  return chapterByBeatId.get(beatId);
}

/** `01 / THE PHOTOGRAPH`, ready to print. */
export function chapterStamp(chapter: Chapter): string {
  return `${chapter.index} / ${chapter.title}`;
}

/**
 * Ids are keys twice over — React's, and `copy.ts`'s — so a duplicate is a silent
 * bug in both places at once: one beat's prose on another beat's scroll, and a stuck
 * transition where the key never changes. The other two checks are cheaper to fail
 * here than to notice on screen: a hotspot that has drifted outside its own plate
 * points at nothing, and a hotspot with no plate under it cannot be drawn at all.
 * Development only; none of it ships.
 */
if (process.env.NODE_ENV !== "production") {
  const seen = new Set<string>();
  for (const beat of allBeats) {
    if (seen.has(beat.id)) {
      throw new Error(`Duplicate beat id "${beat.id}" in exploration/content.ts`);
    }
    seen.add(beat.id);

    if (beat.hotspot) {
      if (!beat.media) {
        throw new Error(`Beat "${beat.id}" has a hotspot but no plate to put it on`);
      }
      const { xPct, yPct } = beat.hotspot;
      if (xPct < 0 || xPct > 100 || yPct < 0 || yPct > 100) {
        throw new Error(`Hotspot on "${beat.id}" is outside the plate: ${xPct}%, ${yPct}%`);
      }
    }

    if (beat.media && beat.kind !== "media") {
      throw new Error(`Beat "${beat.id}" carries a plate but is kind "${beat.kind}"`);
    }

    // The type already says `image` is an `ArchiveImage` and `note` is required, so a
    // third-party frame cannot reach a beat and a plate cannot lose its caption. This
    // is the belt to that brace, and the message names the actual rule rather than the
    // symptom: an asset with any other rights state has no route onto the screen.
    if (beat.media && beat.media.image.rights !== "nasa_public") {
      throw new Error(
        `Beat "${beat.id}" carries a plate that is not filed 'nasa_public'. Editorial candidates are recorded, not published.`,
      );
    }
  }
}
