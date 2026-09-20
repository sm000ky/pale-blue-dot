/**
 * German — the exploration copy.
 *
 * Only the fields this language actually changes are here. Eyebrows, chapter
 * stamps, hotspot labels and plate captions are instrument markings and are the
 * same string in every locale by design, so they live in `en.ts` alone and
 * `beatCopy` merges this table over the English one field by field.
 *
 * Translated as editorial prose from the English source, then checked by a
 * separate reviewer against that source for facts, structure and tone. Numbers,
 * dates, units and identifiers carry through unchanged; only their notation is
 * localised where the language requires it.
 */

import type { BeatCopy } from "./types";

/* The five plate descriptions. Two of them are carried by four beats each — the
   spacecraft holds across the Voyager chapter and the cover across the four
   hotspot beats — so they are named once rather than repeated eight times. */
const PLATE_ALT =
  "Ein blassblau-graues Feld, durchzogen von einem diagonalen Band aus gestreutem Sonnenlicht. In diesem Band, etwas rechts der Mitte, ein einzelner weißer Fleck: die Erde.";

const PORTRAIT_ALT =
  "Sechzig Aufnahmen der Schmalwinkelkamera, auf Schwarz zu einem gebogenen Mosaik gelegt, mit sechs beschrifteten Ausschnitten: Jupiter, Earth, Venus, Saturn, Uranus und Neptune. In jedem Ausschnitt ist der Planet nur ein einzelner Lichtpunkt.";

const VOYAGER_ALT =
  "Eine künstlerische Darstellung einer Voyager-Sonde vor schwarzem Sternenfeld: eine weiße Parabolantenne, die vom Betrachter wegzeigt, der Instrumentenausleger und die Radioisotopengeneratoren an Gitterträgern auf einer Seite, und zwei lange Antennen, die aus dem Bild laufen.";

const DISC_ALT =
  "Die Platte selbst: eine spiegelnd glänzende goldene Scheibe, ihr Etikett eingraviert mit „The Sounds of Earth“, „United States of America, Planet Earth“.";

const COVER_ALT =
  "Die gravierte Hülle der Golden Record, vor Schwarz fotografiert. In die goldene Oberfläche sind vier Gruppen von Diagrammen geschnitten: die Platte mit ihrer Nadel oben links, eine Anleitung zum Dekodieren der Bilder oben rechts, eine strahlenförmige Pulsarkarte unten links, zwei Wasserstoffatome unten rechts.";

export const de: Record<string, BeatCopy> = {
  "photo-intro": {
    heading: "THE PALE\nBLUE DOT",
    body: "Am 14. Februar 1990 blickte Voyager 1 zurück auf die Welt, die sie hinter sich gelassen hatte.",
  },
  "photo-distance": {
    body: "Aus rund sechs Milliarden Kilometern Entfernung von der Sonne war die Erde nur noch ein Lichtpunkt.",
    note: "Gemessen von der Sonne aus. Die Bildunterschriften im NASA-Archiv nennen außerdem eine Schrägentfernung zur Erde von mehr als vier Milliarden Meilen — dieselbe Aufnahme, von einem anderen Punkt aus gerechnet.",
  },
  "photo-pixel": {
    body: "In der Schmalwinkelkamera von Voyager war die Erde nur etwa 0,12 Pixel breit.",
    note: "Schmalwinkelkamera, 1500 mm. Spätere NASA-Seiten runden den Wert auf etwa ein Pixel.",
  },
  "photo-plate": {
    mediaAlt: PLATE_ALT,
    note: "Die Daten von 1990, im Jahr 2020 von NASA/JPL neu aufbereitet.",
  },
  "lastlook-frames": {
    body: "Pale Blue Dot war kein Foto, das für sich allein stand.\n\nEs war Teil der letzten Aufnahmefolge, die ein Porträt des Sonnensystems ergab.",
  },
  "lastlook-worlds": {
    heading: "Venus\nErde\nJupiter\nSaturn\nUranus\nNeptun",
    body: "Sechs Planeten, auf Lichtpunkte reduziert.",
  },
  "lastlook-plate": {
    mediaAlt: PORTRAIT_ALT,
  },
  "lastlook-cameras": {
    body: "Nach dieser Aufnahmefolge wurden die Kameras von Voyager 1 abgeschaltet.\n\nIhre Reise ging weiter. Ihre Kameras nicht.",
  },
  "voyager-intro": {
    heading: "DIE MASCHINE,\nDIE WEITERFLOG",
  },
  "voyager-1977": {
    mediaAlt: VOYAGER_ALT,
    body: "Voyager 1 verließ die Erde mit Kurs auf die äußeren Planeten.",
  },
  "voyager-1979": {
    mediaAlt: VOYAGER_ALT,
    body: "Weniger als zwei Jahre später passierte sie Jupiter.",
  },
  "voyager-1980": {
    mediaAlt: VOYAGER_ALT,
    body: "Nach Saturn trug ihre Bahn sie weiter nach außen.",
  },
  "voyager-2012": {
    mediaAlt: VOYAGER_ALT,
    body: "Fünfunddreißig Jahre nach dem Start trat Voyager 1 in den interstellaren Raum ein.",
  },
  "message-intro": {
    heading: "VOYAGER TRÄGT\nNOCH ETWAS ANDERES",
    body: "Voyager trug nicht nur wissenschaftliche Instrumente.\n\nAn ihrer Seite ist eine Schallplatte über die Erde befestigt.",
  },
  "message-disc": {
    mediaAlt: DISC_ALT,
  },
  "message-object": {
    body: "Eine vergoldete Schallplatte aus Kupfer, dreißig Zentimeter im Durchmesser.",
  },
  "sent-intro": {
    heading: "WENN MAN NUR EINE\nSCHALLPLATTE HÄTTE",
    body: "Wenn ein einziges Objekt einen Eindruck von der Erde tragen müsste, was würden wir hineinlegen?",
  },
  "sent-images": {
    heading: "Körper.\nNahrung.\nBauwerke.\nWissenschaft.\nNatur.\nFamilien.\nDer Planet selbst.",
    body: "115 Bilder, in analoger Form codiert.",
  },
  "sent-languages": {
    body: "Fünfundfünfzig Sprachen richten Grüße an alle, die vielleicht zuhören.",
  },
  "sent-sounds": {
    heading: "Brandung.\nWind.\nDonner.\nVögel.\nWale.\nMenschliches Leben.",
  },
  "sent-music": {
    body: "Rund neunzig Minuten Musik, ausgewählt quer durch Kulturen und Epochen.",
  },
  "instructions-intro": {
    heading: "KEINE GEMEINSAME\nSPRACHE",
    body: "Die Platte setzt voraus, dass ihr Empfänger keine menschliche Sprache versteht.\n\nIhre Anleitung ist in Physik geschrieben.",
  },
  "cover-rotation": {
    mediaAlt: COVER_ALT,
    body: "Das erste Diagramm erklärt, wie sich die Platte drehen soll und wie lange eine Umdrehung dauert.",
  },
  "cover-lines": {
    mediaAlt: COVER_ALT,
    body: "Ein weiteres Diagramm erklärt, wie sich aus dem aufgezeichneten Signal wieder ein Bild zusammensetzen lässt.",
  },
  "cover-pulsars": {
    mediaAlt: COVER_ALT,
    body: "Eine Pulsarkarte weist zum Sonnensystem.\n\nNicht der Name unserer Heimat. Ihre Koordinaten.",
  },
  "cover-hydrogen": {
    mediaAlt: COVER_ALT,
    body: "Ein Übergang des Wasserstoffatoms liefert die Zeiteinheit, die in allen Diagrammen gilt.",
  },
  "travel-address": {
    body: "Die Golden Record wurde an keine bestimmte Adresse geschickt.\n\nSie reist einfach mit Voyager.",
  },
  "travel-40000": {
    body: "Die NASA hält fest, dass rund vierzigtausend Jahre vergehen werden, bis Voyager einem anderen Planetensystem nahekommt.",
  },
  "end-reflection": {
    body: "Wir haben unsere Heimat aus großer Ferne fotografiert.",
  },
  "end-carried": {
    body: "Dann einen kleinen Teil von ihr noch weiter hinausgetragen.",
  },
  "ack-intro": {
    body: "Diese Arbeit beruht auf der Arbeit von Wissenschaftlern, Ingenieuren, Künstlern, Musikern, Fotografen, Archivaren und Erzählern, die uns geholfen haben, die Erde aus der Ferne zu sehen.\n\nWas sie geschaffen und bewahrt haben, lässt die Generationen nach uns nicht nur ein Zeugnis davon erben, woher wir kamen — sondern auch eines davon, wie wir uns selbst einmal gesehen haben.",
  },
  "end-dedication": {
    body: "Für alle, die weiter geblickt, sorgfältig aufgezeichnet und bewahrt haben, was sie fanden —\n\ndamit jemand, der noch nicht geboren ist, es noch sehen kann.",
  },
  "end-quote": {
    heading: "“We are attempting to survive our time\nso we may live into yours.”",
    note: "Jimmy Carter · Botschaft an Bord der Voyager Golden Record · 1977",
  },
};
