/**
 * The Golden Record picture archive.
 *
 * Chapter 05 says the record carries 115 images. This is the part of them that can
 * be shown: the forty frames NASA itself displays, each with the credit NASA prints
 * for it and a link back to NASA's page for that frame.
 *
 * ── What this is, exactly ──────────────────────────────────────────────────────
 *
 * NASA publishes a gallery of the record's pictures and describes it, in its own
 * words, as:
 *
 *     "The following is a partial listing of pictures electronically placed on the
 *      golden records which are carried onboard the Voyager 1 and 2 spacecraft."
 *      — science.nasa.gov/gallery/images-on-the-golden-record/
 *
 * Partial. Forty frames of a hundred and fifteen. That is why the section is headed
 * SELECTED IMAGE ARCHIVE / SEBAGIAN ARSIP GAMBAR and never "all 115": the archive is
 * complete with respect to what NASA displays, and the piece says which of those two
 * completenesses it means.
 *
 * ── Rights: what is known, and who decided ─────────────────────────────────────
 *
 * READ THIS BEFORE CHANGING ANYTHING IN THIS FILE.
 *
 * The gallery page above carries no rights statement of any kind — checked against
 * its markup: zero occurrences of "copyright", "rights" or "Reproduction". A second
 * NASA page showing the same set does carry one, printed below the gallery:
 *
 *     "Due to copyright restrictions, only a subset of the images on the Golden
 *      Record are displayed above. All of these images are copyright protected.
 *      Reproduction without permission of the copyright holder is prohibited."
 *      — science.nasa.gov/mission/voyager/golden-record-contents/images/
 *
 * The per-frame credits agree with that notice rather than with the silence. Of the
 * forty, NASA credits seven to itself and thirty-two to someone else by name — Jon
 * Lomberg (11), UN/DPI Photo (8), Frank Drake (7), the National Astronomy and
 * Ionosphere Center (5), and one to "History of the Olympics, Picturepoint, London".
 * The remaining frame has no detail page and so no readable credit at all.
 *
 * The decision to publish all forty was taken by the owner of this project, for a
 * non-commercial educational portfolio, with that notice and those credits in front
 * of them. It is recorded here because a decision that is not written down becomes,
 * a year later, an assumption nobody remembers making.
 *
 * What this file therefore does NOT say, anywhere, and must not be edited to say:
 * that these frames are licensed, cleared, approved, public domain, or used with
 * permission; or that any legal defence has been established for using them. None of
 * that has been obtained. What IS true is printed on screen under every frame: whose
 * picture it is, and where NASA publishes it.
 *
 * `rights` describes the credit line, not a licence finding:
 *
 *   'third_party'    the credit names someone other than NASA.
 *   'nasa_credited'  the credit reads exactly "NASA". These seven also carry a NASA
 *                    stripe burned into the left edge of the scan, checked frame by
 *                    frame — no third-party stripe appears on any of them.
 *   'unestablished'  no credit could be read, because NASA publishes no detail page
 *                    for the frame. Nothing is inferred to fill the gap.
 *
 * ── Titles are quoted, not tidied ──────────────────────────────────────────────
 *
 * Every `title` is the H1 of that frame's own NASA image-detail page, read from the
 * page and reproduced character for character. Three look like mistakes and are kept
 * anyway, because correcting a source is a way of misquoting it:
 *
 *   - "Egypt, Red Sea, Sinal Peninsula and the Nile" — NASA's spelling of Sinai.
 *   - "Solar system parameter" and "Solar system parameters" — two separate frames,
 *     two separate pages, one of them singular.
 *   - "UN Building Night" — title case where all its neighbours are sentence case.
 *
 * Several scans carry the rights holder's name burned into the left edge. That stripe
 * is part of the picture and is never cropped away: cropping it would remove the
 * credit from the one place that cannot drift from the file.
 *
 * ── The groups are ours ────────────────────────────────────────────────────────
 *
 * NASA publishes the frames in one flat sequence with no taxonomy. The ten headings
 * below are editorial — an argument about what the 1977 committee was trying to
 * cover, made by putting the frames in an order NASA did not. They are labelled as
 * ours on screen for that reason. The frames inside each group are NASA's, verbatim.
 *
 * Four to a group, because four is what fits the stage at a size worth looking at:
 * two columns of roughly 248px on a 512px column, which is a picture rather than a
 * thumbnail, with room for its credit underneath.
 */

export type ArchiveRights = "third_party" | "nasa_credited" | "unestablished";

export type ArchiveEntry = {
  /** NASA's own title, verbatim — spelling, casing and parentheses as printed. */
  title: string;
  /** Converted to WebP under `public/archive/record/`, uncropped. */
  src: string;
  width: number;
  height: number;
  /** NASA's own alt text for the frame, from the gallery markup. */
  alt: string;
  /** Where the reader is sent: the frame's detail page, or the gallery holding it. */
  href: string;
  hrefKind: "detail" | "gallery";
  /** The credit line verbatim, or the sentinel NOT_PRINTED where there is none. */
  credit: string;
  rights: ArchiveRights;
  /**
   * Whether the frame itself is shown. True for all forty, by the decision recorded
   * at the top of this file. The field stays because it is the switch a future
   * decision would flip, and because a frame added later must state its own answer
   * rather than inherit one.
   */
  published: boolean;
};

export type ArchiveGroup = {
  id: string;
  /** Our heading, not NASA's. Printed under a label that says so. */
  title: string;
  entries: readonly ArchiveEntry[];
};

export const archiveGroups: readonly ArchiveGroup[] = [
  {
    id: "measuring",
    title: "MEASURING REALITY",
    entries: [
      {
        title: "Calibration circle",
        src: "/archive/record/gr-calibration-circle.webp",
        width: 640,
        height: 480,
        alt: "A black line art circle on a white background",
        href: "https://science.nasa.gov/image-detail/calibration-circle-31325346536-o/",
        hrefKind: "detail",
        credit: "Image Credit: Jon Lomberg",
        rights: "third_party",
        published: true,
      },
      {
        title: "Physical unit definitions",
        src: "/archive/record/gr-physical-unit-definitions.webp",
        width: 640,
        height: 480,
        alt: "Printed symbols and equations depicting conversions and measurements of time, mass, and distance based on a hydrogen atom",
        href: "https://science.nasa.gov/image-detail/physical-unit-definitions-30554003853-o/",
        hrefKind: "detail",
        credit: "Image Credit: Frank Drake",
        rights: "third_party",
        published: true,
      },
      {
        title: "Mathematical definitions",
        src: "/archive/record/gr-mathematical-definitions.webp",
        width: 640,
        height: 480,
        alt: "Printed mathematical symbols and equations depicting numerals, counting, binary notation, addition, fractions, and multiplication",
        href: "https://science.nasa.gov/image-detail/mathematical-definitions-30539954574-o/",
        hrefKind: "detail",
        credit: "Image Credit: Frank Drake",
        rights: "third_party",
        published: true,
      },
      {
        title: "Chemical definitions",
        src: "/archive/record/gr-chemical-definitions.webp",
        width: 640,
        height: 480,
        alt: "Printed diagrams for atomic weights for hydrogen, carbon, nitrogen, oxygen, and sulfur, and molecular structures",
        href: "https://science.nasa.gov/image-detail/chemical-definitions-31218371762-o/",
        hrefKind: "detail",
        credit: "Image Credit: Frank Drake",
        rights: "third_party",
        published: true,
      },
    ],
  },
  {
    id: "where",
    title: "WHERE WE ARE",
    entries: [
      {
        title: "Solar location map",
        src: "/archive/record/gr-solar-location-map.webp",
        width: 640,
        height: 480,
        alt: "A line diagram indicating various distances from the Sun with pulsars, with one beam pointing to a photo of the Andromeda galaxy",
        href: "https://science.nasa.gov/image-detail/solar-location-map-30992503150-o/",
        hrefKind: "detail",
        credit: "Image Credit: Frank Drake",
        rights: "third_party",
        published: true,
      },
      {
        title: "Solar system parameters",
        src: "/archive/record/gr-solar-system-parameters.webp",
        width: 640,
        height: 480,
        alt: "Printed chart depicting Jupiter, Saturn, Uranus, Neptune, and Pluto with distance, diameter, mass, and time references",
        href: "https://science.nasa.gov/image-detail/solar-system-parameters-30992729550-o/",
        hrefKind: "detail",
        credit: "Image Credit: Frank Drake",
        rights: "third_party",
        published: true,
      },
      {
        title: "Solar system parameter",
        src: "/archive/record/gr-solar-system-parameters-2.webp",
        width: 640,
        height: 480,
        alt: "Printed chart depicting the Sun, Mercury, Venus, Earth, and Mars with distance, diameter, mass, and time reference",
        href: "https://science.nasa.gov/image-detail/solar-system-parameters-30554017073-o/",
        hrefKind: "detail",
        credit: "Image Credit: Frank Drake",
        rights: "third_party",
        published: true,
      },
      {
        title: "Solar spectrum",
        src: "/archive/record/gr-solar-spectrum.webp",
        width: 640,
        height: 480,
        alt: "A blue, green, and red gradient indicating the electromagnetic spectrum",
        href: "https://science.nasa.gov/image-detail/solar-spectrum-30992778240-o/",
        hrefKind: "detail",
        credit: "Image Credit: National Astronomy and Ionosphere Center, Cornell University (NAIC)",
        rights: "third_party",
        published: true,
      },
    ],
  },
  {
    id: "planets",
    title: "THE PLANETS",
    entries: [
      {
        title: "Mercury",
        src: "/archive/record/gr-mercury.webp",
        width: 512,
        height: 384,
        alt: "The surface of planet Mercury",
        href: "https://science.nasa.gov/image-detail/mercury-31246953391-o/",
        hrefKind: "detail",
        credit: "Image Credit: NASA",
        rights: "nasa_credited",
        published: true,
      },
      {
        title: "Mars",
        src: "/archive/record/gr-mars.webp",
        width: 640,
        height: 480,
        alt: "The surface of Mars, labeled 6787 km",
        href: "https://science.nasa.gov/image-detail/mars-30992814480-o/",
        hrefKind: "detail",
        credit: "Image Credit: NASA",
        rights: "nasa_credited",
        published: true,
      },
      {
        title: "Jupiter",
        src: "/archive/record/gr-jupiter.webp",
        width: 640,
        height: 480,
        alt: "A photo of Jupiter, labeled 142,800 km and 318e",
        href: "https://science.nasa.gov/image-detail/jupiter-31325748356-o/",
        hrefKind: "detail",
        credit: "Image Credit: NASA",
        rights: "nasa_credited",
        published: true,
      },
      {
        title: "Earth",
        src: "/archive/record/gr-earth.webp",
        width: 640,
        height: 480,
        alt: "A photo of Earth from space, labeled 12,756 km and 1e",
        href: "https://science.nasa.gov/image-detail/earth-31326146966-o/",
        hrefKind: "detail",
        credit: "Image Credit: NASA",
        rights: "nasa_credited",
        published: true,
      },
    ],
  },
  {
    id: "planet",
    title: "THIS PLANET",
    entries: [
      {
        title: "Structure of Earth",
        src: "/archive/record/gr-structure-of-earth.webp",
        width: 640,
        height: 480,
        alt: "Line diagram of Earth&#039;s layers with percentages of elements that make up the planet, diameter, and mass",
        href: "https://science.nasa.gov/image-detail/structure-of-earth-31247834881-o/",
        hrefKind: "detail",
        credit: "Image Credit: Jon Lomberg",
        rights: "third_party",
        published: true,
      },
      {
        title: "Diagram of continental drift",
        src: "/archive/record/gr-diagram-of-continental-drift.webp",
        width: 640,
        height: 480,
        alt: "Line diagram of three versions of Earth over millions of years to illustrate continental drift",
        href: "https://science.nasa.gov/image-detail/diagram-of-continental-drift-31247808951-o/",
        hrefKind: "detail",
        credit: "Image Credit: Jon Lomberg",
        rights: "third_party",
        published: true,
      },
      {
        title: "Egypt, Red Sea, Sinal Peninsula and the Nile",
        src: "/archive/record/gr-egypt-red-sea-sinal-peninsula-and-the-nile.webp",
        width: 640,
        height: 480,
        alt: "View from space of Egypt, Red Sea, Sinal Peninsula and the Nile with distance measurements labeled",
        href: "https://science.nasa.gov/image-detail/egypt-red-sea-sinal-peninsula-and-the-nile-30993198280-o/",
        hrefKind: "detail",
        credit: "Image Credit: NASA",
        rights: "nasa_credited",
        published: true,
      },
      {
        title: "Heron Island (Great Barrier Reef of Australia)",
        src: "/archive/record/gr-heron-island-great-barrier-reef-of-australia.webp",
        width: 1204,
        height: 823,
        alt: "Aerial view of Heron Island in Great Barrier Reef of Australia",
        href: "https://science.nasa.gov/gallery/images-on-the-golden-record/",
        hrefKind: "gallery",
        credit: "NOT_PRINTED",
        rights: "unestablished",
        // WITHDRAWN. The only frame in the gallery for which NASA publishes no detail
        // page, so no credit could be read and the holder is simply unknown. Every
        // other frame here is reproduced with the name NASA prints beside it; this one
        // could only be reproduced anonymously, which is the one thing a picture whose
        // owner is unidentified must not be.
        //
        // It stayed published while the deployment was behind a password. It comes out
        // now that the URL is open. Setting this back to `true` needs the holder
        // identified first — see .raw/rights-report.md.
        published: false,
      },
    ],
  },
  {
    id: "life",
    title: "WHAT LIFE IS",
    entries: [
      {
        title: "DNA structure",
        src: "/archive/record/gr-dna-structure.webp",
        width: 640,
        height: 480,
        alt: "Diagrams of molecular structure and physical structure of DNA",
        href: "https://science.nasa.gov/image-detail/dna-structure-31362211895-o/",
        hrefKind: "detail",
        credit: "Image Credit: Jon Lomberg",
        rights: "third_party",
        published: true,
      },
      {
        title: "DNA structure magnified, light hit",
        src: "/archive/record/gr-dna-structure-magnified-light-hit.webp",
        width: 640,
        height: 480,
        alt: "A large diagram of a DNA helix splitting, labeled 34 angstroms",
        href: "https://science.nasa.gov/image-detail/dna-structure-magnified-light-hit-31362224015-o/",
        hrefKind: "detail",
        credit: "Image Credit: Jon Lomberg",
        rights: "third_party",
        published: true,
      },
      {
        title: "Diagram of vertebrate evolution",
        src: "/archive/record/gr-diagram-of-vertebrate-evolution.webp",
        width: 640,
        height: 480,
        alt: "Drawings of various vertebrate species, arranged vertically by complexity of evolution, including humans, mammals, birds, reptiles, and fish",
        href: "https://science.nasa.gov/image-detail/diagram-of-vertebrate-evolution-30993842550-o/",
        hrefKind: "detail",
        credit: "Image Credit: Jon Lomberg",
        rights: "third_party",
        published: true,
      },
      {
        title: "Diagram of family ages",
        src: "/archive/record/gr-diagram-of-family-ages.webp",
        width: 640,
        height: 480,
        alt: "Silhouette of four human forms illustrating size and mass at various ages: 4y, 12y, 30y, 80y",
        href: "https://science.nasa.gov/image-detail/diagram-of-family-ages-31326608936-o/",
        hrefKind: "detail",
        credit: "Image Credit: Jon Lomberg",
        rights: "third_party",
        published: true,
      },
    ],
  },
  {
    id: "begins",
    title: "HOW LIFE BEGINS",
    entries: [
      {
        title: "Diagram of conception",
        src: "/archive/record/gr-diagram-of-conception.webp",
        width: 640,
        height: 480,
        alt: "Line diagram depicting human egg fertilization, with 1/150 cm labeled to measure the male reproductive cell",
        href: "https://science.nasa.gov/image-detail/diagram-of-conception-31218656712-o/",
        hrefKind: "detail",
        credit: "Image Credit: Jon Lomberg",
        rights: "third_party",
        published: true,
      },
      {
        title: "Fetus diagram",
        src: "/archive/record/gr-fetus-diagram.webp",
        width: 640,
        height: 480,
        alt: "Silhouette diagram of a human fetus in two stages, with length and time measurements",
        href: "https://science.nasa.gov/image-detail/fetus-diagram-30540929914-o/",
        hrefKind: "detail",
        credit: "Image Credit: Jon Lomberg",
        rights: "third_party",
        published: true,
      },
      {
        title: "Diagram of male and female",
        src: "/archive/record/gr-diagram-of-male-and-female.webp",
        width: 640,
        height: 480,
        alt: "Silhouette diagram of the male and pregnant female human bodies, with age and height measurements",
        href: "https://science.nasa.gov/image-detail/diagram-of-male-and-female-31326553496-o/",
        hrefKind: "detail",
        credit: "Image Credit: Jon Lomberg",
        rights: "third_party",
        published: true,
      },
      {
        title: "Nursing mother",
        src: "/archive/record/gr-nursing-mother.webp",
        width: 640,
        height: 480,
        alt: "A woman holding and nursing an infant",
        href: "https://science.nasa.gov/image-detail/nursing-mother-31362634275-o/",
        hrefKind: "detail",
        credit: "Image Credit: UN/DPI Photo",
        rights: "third_party",
        published: true,
      },
    ],
  },
  {
    id: "food",
    title: "FOOD AND SHELTER",
    entries: [
      {
        title: "Demonstration of licking, eating and drinking",
        src: "/archive/record/gr-demonstration-of-licking-eating-and-drinking.webp",
        width: 640,
        height: 480,
        alt: "A woman licks an ice cream cone next to a man biting a sandwich, while a third person pours water from a glass pitcher into their mouth",
        href: "https://science.nasa.gov/image-detail/demonstration-of-licking-eating-and-drinking-30542224004-o/",
        hrefKind: "detail",
        credit: "Image Credit: National Astronomy and Ionosphere Center (NAIC)",
        rights: "third_party",
        published: true,
      },
      {
        title: "Supermarket",
        src: "/archive/record/gr-supermarket.webp",
        width: 640,
        height: 480,
        alt: "A woman stands with a cart at a supermarket, eating from a bag of green grapes she holds in her hand",
        href: "https://science.nasa.gov/image-detail/supermarket-30555896943-o/",
        hrefKind: "detail",
        credit: "Image Credit: National Astronomy and Ionosphere Center (NAIC)",
        rights: "third_party",
        published: true,
      },
      {
        title: "Fishing boat with nets",
        src: "/archive/record/gr-fishing-boat-with-nets.webp",
        width: 640,
        height: 480,
        alt: "Five men stand on a small boat, pulling a fishing net from the water near the coast",
        href: "https://science.nasa.gov/image-detail/fishing-boat-with-nets-30542208064-o/",
        hrefKind: "detail",
        credit: "Image Credit: UN/DPI Photo",
        rights: "third_party",
        published: true,
      },
      {
        title: "House construction (African)",
        src: "/archive/record/gr-house-construction-african.webp",
        width: 640,
        height: 480,
        alt: "Four men work to lay bricks to build a small structure next to a second building that has a grass roof",
        href: "https://science.nasa.gov/image-detail/house-construction-african-30542255034-o/",
        hrefKind: "detail",
        credit: "Image Credit: UN/DPI Photo",
        rights: "third_party",
        published: true,
      },
    ],
  },
  {
    id: "living",
    title: "WHERE WE LIVE",
    entries: [
      {
        title: "House (Africa)",
        src: "/archive/record/gr-house-africa.webp",
        width: 640,
        height: 480,
        alt: "A small house with a grass roof and a fence made of sticks, located in a desert area with three people sitting near the front door",
        href: "https://science.nasa.gov/image-detail/house-africa-30994933500-o/",
        hrefKind: "detail",
        credit: "Image Credit: UN/DPI Photo",
        rights: "third_party",
        published: true,
      },
      {
        title: "Modern house (Cloudcroft, New Mexico)",
        src: "/archive/record/gr-modern-house-cloudcroft-new-mexico.webp",
        width: 640,
        height: 480,
        alt: "A mid-20th-century ranch-style single-story house in a desert grasslands area, positioned in front of a large hill",
        href: "https://science.nasa.gov/image-detail/modern-house-cloudcroft-new-mexico-30556337973-o/",
        hrefKind: "detail",
        credit: "Image Credit: Frank Drake",
        rights: "third_party",
        published: true,
      },
      {
        title: "Schoolroom",
        src: "/archive/record/gr-schoolroom.webp",
        width: 640,
        height: 480,
        alt: "A teacher leans over his student&#039;s desk to help the child with writing on paper in a classroom",
        href: "https://science.nasa.gov/image-detail/schoolroom-30994523250-o/",
        hrefKind: "detail",
        credit: "Image Credit: UN/DPI Photo",
        rights: "third_party",
        published: true,
      },
      {
        title: "UN Building Night",
        src: "/archive/record/gr-un-building-night.webp",
        width: 640,
        height: 480,
        alt: "The United Nations building, a tall structure, photographed at night with lights illuminating its windows",
        href: "https://science.nasa.gov/image-detail/un-building-night-30556368033-o/",
        hrefKind: "detail",
        credit: "Image Credit: UN/DPI Photo",
        rights: "third_party",
        published: true,
      },
    ],
  },
  {
    id: "people",
    title: "PEOPLE",
    entries: [
      {
        title: "Children with globe",
        src: "/archive/record/gr-children-with-globe.webp",
        width: 640,
        height: 480,
        alt: "Seven children of diverse ethnicities stand circled around a globe as they point at different countries",
        href: "https://science.nasa.gov/image-detail/children-with-globe-30541853554-o/",
        hrefKind: "detail",
        credit: "Image Credit: UN/DPI Photo",
        rights: "third_party",
        published: true,
      },
      {
        title: "Man from Guatemala",
        src: "/archive/record/gr-man-from-guatemala.webp",
        width: 640,
        height: 480,
        alt: "Portrait of a smiling man holding tools over his shoulders",
        href: "https://science.nasa.gov/image-detail/man-from-guatemala-30541182514-o/",
        hrefKind: "detail",
        credit: "Image Credit: UN/DPI Photo",
        rights: "third_party",
        published: true,
      },
      {
        title: "Sketch of bushmen",
        src: "/archive/record/gr-sketch-of-bushmen.webp",
        width: 640,
        height: 480,
        alt: "Silhouettes of figures depicting two humans, one with a stick-like weapon in hand, hunting a four-legged mammal from a distance",
        href: "https://science.nasa.gov/image-detail/sketch-of-bushmen-30541167404-o/",
        hrefKind: "detail",
        credit: "Image Credit: Jon Lomberg",
        rights: "third_party",
        published: true,
      },
      {
        title: "Sprinters (Valeri Borzov of the U.S.S.R. in lead)",
        src: "/archive/record/gr-sprinters-valeri-borzov-of-the-ussr-in-lead-history-of-the-olympics.webp",
        width: 700,
        height: 570,
        alt: "Four men in shorts running around a track in front of an audience at a competitive event",
        href: "https://science.nasa.gov/image-detail/sprinters-valeri-borzov-of-the-ussr-in-lead-history-of-the-olympics-31363259165-o/",
        hrefKind: "detail",
        credit: "Image Credit: History of the Olympics, Picturepoint, London",
        rights: "third_party",
        published: true,
      },
    ],
  },
  {
    id: "made",
    title: "WHAT WE MADE",
    entries: [
      {
        title: "Violin with music score (Cavatina)",
        src: "/archive/record/gr-violin-with-music-score-cavatina.webp",
        width: 640,
        height: 480,
        alt: "A violin positioned above a page of printed sheet music",
        href: "https://science.nasa.gov/image-detail/violin-with-music-score-cavatina-31072637180-o/",
        hrefKind: "detail",
        credit: "Image Credit: National Astronomy and Ionosphere Center, Cornell University (NAIC)",
        rights: "third_party",
        published: true,
      },
      {
        title: "Page of book (Newton, System of the World)",
        src: "/archive/record/gr-page-of-book-newton-system-of-the-world.webp",
        width: 640,
        height: 480,
        alt: "An open book with text and a diagram of a planet printed on its pages",
        href: "https://science.nasa.gov/image-detail/page-of-book-newton-system-of-the-world-31297500982-o/",
        hrefKind: "detail",
        credit: "Image Credit: National Astronomy and Ionosphere Center, Cornell University (NAIC)",
        rights: "third_party",
        published: true,
      },
      {
        title: "Titan Centaur launch",
        src: "/archive/record/gr-titan-centaur-launch.webp",
        width: 640,
        height: 480,
        alt: "A space shuttle launching into the sky above a cloud of smoke",
        href: "https://science.nasa.gov/image-detail/titan-centaur-launch-31297529782-o/",
        hrefKind: "detail",
        credit: "Image Credit: NASA",
        rights: "nasa_credited",
        published: true,
      },
      {
        title: "Astronaut in space",
        src: "/archive/record/gr-astronaut-in-space.webp",
        width: 640,
        height: 480,
        alt: "An astronaut floating above the Earth in space",
        href: "https://science.nasa.gov/image-detail/astronaut-in-space-30620956564-o/",
        hrefKind: "detail",
        credit: "Image Credit: NASA",
        rights: "nasa_credited",
        published: true,
      },
    ],
  },
];

/** The group a beat names, or undefined — a missing group must not take the page down. */
export function archiveGroupById(id: string): ArchiveGroup | undefined {
  return archiveGroups.find((group) => group.id === id);
}

/** Every frame in the archive, in group order. */
export const archiveEntryCount: number = archiveGroups.reduce(
  (sum, group) => sum + group.entries.length,
  0,
);

/**
 * The listing is NASA's and the count has to match it. If a frame is added to a group
 * without being read off a NASA page, or dropped from one, this is where it shows —
 * cheaper to fail at startup than to notice a missing frame on screen. The credit
 * check is the one that matters most: a published frame with no attribution is the
 * single thing this file exists to prevent.
 * Development only; none of it ships.
 */
if (process.env.NODE_ENV !== "production") {
  const NASA_PARTIAL_LISTING_SIZE = 40;
  if (archiveEntryCount !== NASA_PARTIAL_LISTING_SIZE) {
    throw new Error(
      `Archive holds ${archiveEntryCount} frames; NASA's partial listing has ${NASA_PARTIAL_LISTING_SIZE}`,
    );
  }
  const seen = new Set<string>();
  for (const group of archiveGroups) {
    for (const entry of group.entries) {
      if (entry.published && !entry.credit) {
        throw new Error(`Archive frame "${entry.title}" is published with no credit line`);
      }
      if (entry.published && !entry.src) {
        throw new Error(`Archive frame "${entry.title}" is published with no file`);
      }
      if (seen.has(entry.src)) {
        throw new Error(`Archive frame "${entry.title}" repeats a file`);
      }
      seen.add(entry.src);
    }
  }
}
