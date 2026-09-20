/**
 * Sources for the exploration half.
 *
 * The reading is Sagan's; everything after it is a claim about the world, so every
 * claim carries a marker. The marker is now visible in full — `NASA / JPL [01]` —
 * rather than a bare bracketed number with the attribution hidden in a screen
 * reader. A number alone asks the reader to take the citation on trust and go
 * looking for the table; the label answers the only question most readers actually
 * have, which is who says so.
 *
 * Every entry is a NASA page, and every one of them was fetched and read while the
 * copy was written — not cited from memory. Where two NASA pages disagree (they do,
 * about how many pixels wide Earth is), the beat that uses the number cites the page
 * the number is printed on, and says so in its note.
 *
 * Rules for whoever edits it:
 *   - `id` is a zero-padded two-digit string and is the printed marker.
 *   - `label` is what the reader sees in front of the number. Short enough to sit in
 *     a mono eyebrow beside a date without pushing it onto a second line: four or
 *     five characters and a slash, not an institution's full name. It is uppercased
 *     by the type it is set in.
 *   - `href` must be a stable primary source — the agency, the observatory, the
 *     journal — not an aggregator and not a press rewrite of one.
 *   - `title` stays in the publisher's own language. Titles are not translated.
 */

export type ExplorationSource = {
  id: string;
  /** Printed beside the number: 'NASA / JPL'. */
  label: string;
  publisher: string;
  title: string;
  href: string;
};

export const explorationSources: readonly ExplorationSource[] = [
  {
    id: "01",
    label: "NASA / JPL",
    publisher: "NASA Science",
    title: "Voyager 1's Pale Blue Dot",
    href: "https://science.nasa.gov/mission/voyager/voyager-1s-pale-blue-dot/",
  },
  {
    id: "02",
    label: "NASA / JPL",
    publisher: "NASA Science",
    title: "Voyager 1",
    href: "https://science.nasa.gov/mission/voyager/voyager-1/",
  },
  {
    id: "03",
    label: "NASA / JPL",
    publisher: "NASA Science",
    title: "Solar System Family Portrait",
    href: "https://science.nasa.gov/resource/solar-system-family-portrait/",
  },
  {
    id: "04",
    label: "NASA / JPL",
    publisher: "NASA Science",
    title: "Solar System Portrait - View of the Sun, Earth and Venus",
    href: "https://science.nasa.gov/resource/solar-system-portrait-view-of-the-sun-earth-and-venus/",
  },
  {
    id: "05",
    label: "NASA / JPL",
    publisher: "NASA Science",
    title: "Golden Record Overview",
    href: "https://science.nasa.gov/mission/voyager/voyager-golden-record-overview/",
  },
  {
    id: "06",
    label: "NASA / JPL",
    publisher: "NASA Science",
    title: "Golden Record Contents",
    href: "https://science.nasa.gov/mission/voyager/golden-record-contents/",
  },
  {
    id: "07",
    label: "NASA / JPL",
    publisher: "NASA Science",
    title: "Golden Record Images",
    href: "https://science.nasa.gov/mission/voyager/golden-record-contents/images/",
  },
  {
    id: "08",
    label: "NASA / JPL",
    publisher: "NASA Science",
    title: "Greetings to the Universe in 55 Different Languages",
    href: "https://science.nasa.gov/mission/voyager/golden-record-contents/greetings/",
  },
  {
    id: "09",
    label: "NASA / JPL",
    publisher: "NASA Science",
    title: "Golden Record Sounds and Music",
    href: "https://science.nasa.gov/mission/voyager/golden-record-contents/sounds/",
  },
  {
    id: "10",
    label: "NASA / JPL",
    publisher: "NASA Science",
    title: "The Golden Record Cover",
    href: "https://science.nasa.gov/mission/voyager/golden-record-cover/",
  },
];

/** `undefined` rather than a throw: a missing marker must never take the page down. */
export function sourceById(id: string): ExplorationSource | undefined {
  return explorationSources.find((source) => source.id === id);
}

/**
 * One printed marker: a label and the numbers that share it.
 *
 * Grouping matters because a beat citing two NASA pages would otherwise print
 * `NASA / JPL [01] NASA / JPL [04]`, which says the same thing twice and reads as
 * two publishers. Grouped, it is `NASA / JPL [01][04]` — one attribution, two
 * places to check it.
 */
export type SourceMarker = {
  label: string;
  ids: readonly string[];
  sources: readonly ExplorationSource[];
};

/**
 * The markers for one beat, in the order the beat lists them, collapsed by label.
 * An id with no entry in the table is dropped rather than printed as an orphan
 * bracket — the same reason `sourceById` returns undefined instead of throwing.
 */
export function sourceMarkers(ids?: readonly string[]): readonly SourceMarker[] {
  if (!ids || ids.length === 0) return [];

  const byLabel = new Map<string, { label: string; ids: string[]; sources: ExplorationSource[] }>();
  for (const id of ids) {
    const source = sourceById(id);
    if (!source) continue;
    const existing = byLabel.get(source.label);
    if (existing) {
      existing.ids.push(source.id);
      existing.sources.push(source);
    } else {
      byLabel.set(source.label, { label: source.label, ids: [source.id], sources: [source] });
    }
  }

  return [...byLabel.values()];
}

/**
 * The same marker as one string — `NASA / JPL [01][04]` — for a title attribute, an
 * aria-label, or anywhere the brackets cannot be separate elements.
 */
export function sourceMarkerText(marker: SourceMarker): string {
  return `${marker.label} ${marker.ids.map((id) => `[${id}]`).join("")}`;
}

/** 'NASA Science, Voyager 1's Pale Blue Dot' — the long form, for assistive text. */
export function sourceDescription(source: ExplorationSource): string {
  return `${source.publisher}, ${source.title}`;
}
