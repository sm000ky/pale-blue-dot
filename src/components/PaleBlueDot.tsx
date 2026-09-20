'use client'

/**
 * PaleBlueDot — the whole piece.
 *
 * The journey runs one way: HOME. It opens at Voyager 1's vantage of 14 February
 * 1990 — Earth a pale blue mote inside a band of scattered sunlight — closes in
 * until the planet fills the frame, and then stops. Nothing shrinks, ever; past the
 * arrival the only motion left in the piece is the spin.
 *
 * One screen, one clock. `narration.currentTime` is the only timeline: a single
 * requestAnimationFrame loop reads it every frame and derives everything else from
 * it — the approach (`scene.setJourney`), the active caption (`cueAt`), the distance
 * countdown and the progress rule. Nothing else counts time, so nothing can drift
 * out of sync with Sagan's voice, and a pause freezes all of it together.
 *
 * Layout is instrument chrome pinned to the four edges over a full-bleed canvas,
 * not cards in the middle of the page. Two typefaces carry the whole hierarchy:
 * Newsreader for the text, JetBrains Mono for every readout.
 *
 * Three screens, in order: the language of the subtitles, the play gate, the
 * reading. The first is asked once and then remembered (see LanguageGate); the
 * answer only ever adds a second caption line — English is the script that is
 * actually spoken and stays on screen whatever is chosen.
 */

import { Fragment, useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { gsap } from 'gsap'
import CreditsPanel from '@/components/CreditsPanel'
import ExplorationSequence from '@/components/exploration/ExplorationSequence'
import LanguageGate from '@/components/LanguageGate'
import {
  DEFAULT_LOCALE,
  isLocaleCode,
  localeByCode,
  translationFor,
  type LocaleCode,
} from '@/lib/locales'
import { strings } from '@/lib/ui-strings'
import { NARRATION_DURATION, cueAt, type Cue } from '@/lib/narration'
import { EarthScene } from '@/lib/three/earth-scene'

/**
 * The reading and everything after it, in one machine.
 *
 * `exploring` sits between the last line and the closing card: the narration is
 * over, the Earth is held at its arrival, and the music plays on, but the piece
 * has not finished. `ended` is now reached only from there, which is what keeps
 * the closing card and its Replay as the single exit.
 *
 * It is one machine on purpose. Every phase is written through `updatePhase`,
 * which keeps `phase` (for render) and `phaseRef` (for the rAF loop) in step; a
 * second machine for the post-narration half would be a second source of truth
 * for questions like "is the journey pinned" that both halves have to answer.
 */
type Phase = 'idle' | 'loading' | 'playing' | 'paused' | 'exploring' | 'ended'

/**
 * Phases in which the reading is finished and the camera is held at the arrival.
 * The narration clock is no longer authoritative for the journey here: it has
 * stopped, and a future control that rewinds it must not be able to send the
 * camera back out.
 */
function isAfterNarration(phase: Phase): boolean {
  return phase === 'exploring' || phase === 'ended'
}

/**
 * The closing card.
 *
 * It used to end on a line of Sagan's and a byline — “the only home we've ever
 * known”, Carl Sagan · 1994 — which put his words in the last position twice: once
 * read aloud, and again as a caption on the piece that had just finished quoting him.
 * The card is not his; it is the thing the piece says after he has stopped talking.
 * So it says that instead, and it says it about the transmission the whole second
 * half has been about.
 *
 * Seven languages now, so the two strings live in the central table with the rest of
 * the chrome rather than in a record here. Each translation chose its own break, and
 * the break matters: the card is set at display size, so a line that reflows does not
 * look like prose finding its width, it looks like the last frame of the piece
 * breaking.
 */
function endingCard(locale: LocaleCode): { eyebrow: string; line: string } {
  const s = strings(locale)
  return { eyebrow: s.endingEyebrow, line: s.endingLine }
}

/* ==================================================================================
 * SUBTITLE LANGUAGE — asked once, remembered, changeable.
 * ================================================================================== */

const LOCALE_STORAGE_KEY = 'pale-blue-dot:subtitle-locale'

/**
 * The remembered locale as an external store, read the same way as the motion
 * preference: `undefined` while the answer is still unknown (the prerender, and
 * the hydration render that has to match it), `null` once we know nothing is
 * remembered, a code once we know what is. Those three states are what keeps the
 * language screen from flashing in front of a returning reader before an effect
 * could take it away again.
 */
type RememberedLocale = LocaleCode | null | undefined

/**
 * Another tab is the only thing that can change this behind our back — a write
 * from this document does not raise `storage` here, and does not need to: the
 * choice is held in state as well.
 */
function subscribeToStoredLocale(onChange: () => void): () => void {
  window.addEventListener('storage', onChange)
  return () => window.removeEventListener('storage', onChange)
}

/**
 * Private mode throws on the first touch of localStorage in some browsers, and a
 * stored value is untrusted input — anything that is not a locale we ship reads
 * as a fresh visit rather than as an error.
 */
function readStoredLocale(): LocaleCode | null {
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    return stored !== null && isLocaleCode(stored) ? stored : null
  } catch {
    return null
  }
}

/** There is no localStorage during a prerender, so the answer is not known yet. */
function localeUnresolved(): undefined {
  return undefined
}

/** Best effort: failing to remember a preference must never break the piece. */
function storeLocale(code: LocaleCode): void {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, code)
  } catch {
    // Private mode, or storage disabled. The choice still holds for this visit.
  }
}

/** A bed, not a duet: loud enough to hold the room, quiet enough to lose to speech. */
const MUSIC_VOLUME = 0.28
const MUSIC_FADE_IN = 2.5
/**
 * "Aurora" runs 8m19s against a 3m31s narration, so the track outlives the reading by
 * nearly five minutes. It is allowed to: the piece does not end when Sagan stops
 * talking, it ends on a turning Earth, and cutting the music at 3:37 cut the ending
 * off with it. Once the voice is gone there is nothing left to duck under, so the bed
 * comes up to a level that can carry the room on its own.
 */
const MUSIC_VOLUME_ALONE = 0.5
const MUSIC_SWELL = 4
/**
 * The only fade-out left, and it is measured against the music's own duration rather
 * than the narration's: the last stretch of the track, so "Aurora" lands instead of
 * stopping. Driven from timeupdate, which only fires while the element is playing —
 * a gsap tween would keep running through a pause and empty the volume behind it.
 */
const MUSIC_TAIL_FADE = 15

/**
 * The encore.
 *
 * Aurora runs for nearly five minutes past the last line of the reading and then
 * fades itself out over its final fifteen seconds. What used to follow was silence —
 * a deliberate choice at the time, and one the piece has now been asked to reverse:
 * a second track picks up the moment the first ends, so the exploration is never
 * read without something under it.
 *
 * It is chained on the bed's own `ended` event rather than crossfaded into its tail,
 * because the tail is part of Aurora and is approved as it stands. Aurora finishes
 * its decrescendo, ends, and this begins — joined, not overlapped. Three seconds of
 * fade-in so it arrives rather than starts, and it loops, because the exploration has
 * no duration: a reader can sit on one beat for as long as they like and the piece
 * should not run out of music underneath them.
 */
const MUSIC_ENCORE_FADE_IN = 3

/* ==================================================================================
 * RECOMPOSITION — the move that hands the screen over.
 *
 * The reading ends on a full-frame Earth. What follows needs the room, so the
 * planet withdraws to the lower right and gives up two thirds of the frame,
 * without ever cutting, fading out, or rebuilding the scene.
 *
 * Timed in wall-clock milliseconds rather than narration seconds, because the
 * narration clock has stopped by now — it is frozen at the end of the reading and
 * can no longer drive anything. The elapsed time is read from a ref inside the
 * existing rAF loop; there is no second loop and no timer.
 * ================================================================================== */

/**
 * The second, in narration time, at which the reading is over.
 *
 * Not the length of the file. `sagan-vocals.mp3` runs 210.86s and the voice stops at
 * 202.91 — measured off the decoded waveform rather than estimated: RMS in 50ms
 * windows falls from 0.515 of peak at 201s to 0.006 from 202s onward, and thresholds
 * of 2%, 5% and 10% of peak all agree to within a twentieth of a second.
 *
 * Handing over on the element's `ended` event therefore held the last line — "the
 * only home we've ever known." — on a motionless frame for eleven seconds, eight of
 * them silent. Long enough to read as a page that has broken rather than as a pause,
 * and long enough for a reader to leave before the second half exists. The handover
 * now runs when the voice stops; the extra third of a second is there so the final
 * word has air, and RECOMPOSE_HOLD_MS adds its own half-second of stillness after it.
 *
 * If the audio file is ever replaced, this number is measured again — it belongs to
 * the recording, not to the design.
 */
const NARRATION_SPEECH_END = 203.2

/**
 * Milliseconds of stillness after the last line before anything happens.
 *
 * The closing caption owns roughly the first half-second of this as it fades, so
 * without the pause the frame would start changing underneath a line still on
 * screen. 550ms lets the words land, then leaves a beat that reads as deliberate.
 */
const RECOMPOSE_HOLD_MS = 550

/**
 * Milliseconds to take the scene down to black, and to bring it back.
 *
 * The reframing is a CUT, not a move. Carrying the planet across the screen means
 * carrying it off-axis, and perspective stretches a sphere into an ellipse as it
 * goes — measured at 1.32 against 1.00 for the frame it starts from. No easing
 * hides that; the only way to avoid showing a deforming planet is not to show the
 * journey at all. So the scene fades out, the frustum is shifted while nothing is
 * visible, and it fades back in already composed.
 *
 * In is longer than out on purpose: leaving is quick, arriving is given time.
 */
const RECOMPOSE_FADE_OUT_MS = 700
const RECOMPOSE_FADE_IN_MS = 1000

/**
 * How far behind the planet the first chapter follows it in, in milliseconds.
 *
 * Not simultaneous: letting the Earth establish itself for a beat before the words
 * arrive is what makes the two read as one continuous scene rather than as two
 * layers switched on together.
 */
const CHAPTER_DELAY_MS = 220
const CHAPTER_REVEAL_MS = 900

/** Reduced motion: the same three beats, short enough not to be a wait. */
const RECOMPOSE_HOLD_REDUCED_MS = 120
const RECOMPOSE_FADE_OUT_REDUCED_MS = 160
const RECOMPOSE_FADE_IN_REDUCED_MS = 220

/**
 * Symmetric ease-in-out, no overshoot. The same shape the journey uses, so the
 * two belong to one instrument.
 */
function easeRecompose(t: number): number {
  const x = t < 0 ? 0 : t > 1 ? 1 : t
  return x * x * x * (x * (x * 6 - 15) + 10)
}

/* ==================================================================================
 * ARRIVAL CHOREOGRAPHY — the two numbers that shape the approach.
 *
 * Both are seconds of `narration.currentTime`, never of a clock of their own: a
 * separate timer would keep running through a pause and leave the camera ahead of
 * the voice. Everything else about the approach lives in earth-scene.ts.
 * ================================================================================== */

/**
 * Seconds held at Voyager's distance before the camera moves at all. The reading
 * opens on "From this distant vantage point…" — the dot has to be a dot while that
 * sentence is still describing one. 18s carries the hold through "Consider again
 * that dot" (0:10) and the three beats that answer it, "That's here, that's home,
 * that's us" (0:12–0:15), and releases exactly as the litany starts at "On it
 * everyone you love" (0:17).
 */
const ARRIVAL_HOLD = 18
/**
 * Seconds spent closing in. Chosen against the narration, not rounded: the approach
 * runs the whole length of the litany and lands at 0:71, which is where the reading
 * reaches "on a mote of dust suspended in a sunbeam" (measured at 71.2s in
 * narration.ts). The frame therefore fills with Earth on the exact word that calls
 * it dust. An earlier 26s put the arrival at 0:40, mid-list, which read as rushed
 * and meant nothing.
 */
const ARRIVAL_TRAVEL = 53

/**
 * Position along the way home for a given moment of the narration: 0 at the dot,
 * 1 at the arrival. Monotonic and clamped — it never runs backwards, which is the
 * whole point of this build.
 */
function arrivalAt(time: number): number {
  if (!Number.isFinite(time)) return 0
  return Math.min(Math.max((time - ARRIVAL_HOLD) / ARRIVAL_TRAVEL, 0), 1)
}

/**
 * Where Voyager 1 was when it took the photograph, as the project's own canonical
 * source states it.
 *
 * https://science.nasa.gov/mission/voyager/voyager-1s-pale-blue-dot/ — source [01]
 * in exploration/sources.ts — says it twice, in these words:
 *
 *   "about 3.7 billion miles (6 billion kilometers) from the Sun"
 *   "at a distance of 3.7 billion miles (6 billion kilometers) from the Sun"
 *
 * Both figures below are quoted from that page. Two things it does NOT contain, and
 * which the readout therefore no longer claims:
 *
 *   - any figure in astronomical units. The HUD used to print "40.5 AU" counting down
 *     to one decimal place; no source record in this project supports that value, in
 *     that precision or at all.
 *   - any distance measured from Earth. The readout was labelled "Distance to Earth"
 *     while counting down from a distance measured from the SUN — two different
 *     quantities under one label.
 *
 * The countdown itself is gone with them. It ticked 6,060,000,000 km down to zero in
 * thousand-kilometre steps, which read as measured telemetry and was arithmetic
 * performed on a number nobody had sourced. What is on screen now is what NASA
 * published, marked approximate, and it holds still until the arrival replaces it.
 */
const DISTANCE_FROM_SUN_KM = '~6 billion km'
const DISTANCE_FROM_SUN_MILES = '~3.7 billion miles'
/** Mean radius. The readout the distance hands over to once the Earth arrives. */
const EARTH_RADIUS_KM = 6371

/* ==================================================================================
 * THE ANNOTATION — the hairline, the ring and the word that name the dot.
 *
 * It no longer sits at a fixed percentage of the viewport: earth-scene both closes in
 * and swings its aim point back to centre, so a hard-coded position is only true at
 * journey 0. The ring follows scene.getDotScreenPosition() every frame instead, and
 * retires on a schedule of its own once the planet can speak for itself.
 * ================================================================================== */

/** Journey position up to which the annotation is held at full strength. */
const ANNOTATION_FULL_UNTIL = 0.25
/**
 * Where the label and its leader finish fading. The brief was "not before 20%", and
 * 0.25 honours it with room to spare — at t = 0.3 Earth is still only 8.8px across on
 * a 900px screen, which is a speck you would not read as a planet without being told.
 */
const ANNOTATION_LABEL_GONE = 0.38
/**
 * Where the ring follows. Deliberately later than the label: at t = 0.52 Earth is
 * ~40px and unmistakably a sphere, so the word has stopped earning its place — but
 * losing all three marks on the same frame reads as a switch being thrown. The ring
 * outliving the text by fourteen hundredths of the journey makes it a withdrawal.
 */
const ANNOTATION_RING_GONE = 0.52

/**
 * Ring radius in CSS pixels: always clear of the planet, never touching it. 2.2x the
 * apparent radius keeps a visible gap the whole way in, and the 14px floor covers the
 * far end, where Earth is a single pixel of radius and a proportional ring would be
 * smaller than the dot it is supposed to point out.
 */
function annotationRingRadius(earthRadiusPx: number): number {
  return Math.max(14, earthRadiusPx * 2.2)
}

/** Leader geometry, in CSS pixels, measured out from the ring's edge. */
const LEADER_GAP = 7
const LEADER_RISE = 44
const LEADER_RUN = 52
const LEADER_LABEL_GAP = 9
/** Half the annotation SVG's box: it is centred on the dot and drawn in its own space. */
const ANNOTATION_BOX = 160

/** How long the chrome stays lit after the last sign of a pointer or a key. */
const CHROME_IDLE_DELAY = 2800

/** Head start given to the outgoing caption before the next one begins to arrive. */
const CAPTION_HANDOVER = 0.16

/** Circumference of the r=49.5 progress ring in the play button's SVG. */
const RING_CIRCUMFERENCE = 2 * Math.PI * 49.5

const CANVAS_LABEL =
  'Earth seen from an approaching spacecraft: a single point of pale blue light caught inside a band of scattered sunlight six billion kilometres away, growing across the frame until the planet fills it and turns slowly in place.'

/**
 * Lines that Sagan leans on. They get a larger size and a slower entrance so the
 * page does not race past them. Matched on the verbatim text from narration.ts —
 * including its punctuation and its lower-case continuations, since an equality
 * test against a tidied-up copy would silently match nothing.
 */
const WEIGHTED_LINES: ReadonlySet<string> = new Set([
  "That's here,",
  "that's home,",
  "that's us.",
  'on a mote of dust suspended in a sunbeam.',
  "the only home we've ever known.",
])

/** Fixed locale: the readout must group digits identically on every machine. */
const KM_FORMAT = new Intl.NumberFormat('en-US')

const EARTH_RADIUS_LABEL = `${KM_FORMAT.format(EARTH_RADIUS_KM)} km mean radius`

function formatClock(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds))
  const minutes = Math.floor(total / 60)
  return `${String(minutes).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

const TOTAL_CLOCK = formatClock(NARRATION_DURATION)

/** Visual tweens collapse to a single frame when the OS asks for less motion. */
function motionSeconds(seconds: number, reduced: boolean): number {
  return reduced ? 0.001 : seconds
}

/** Hermite ramp: 0 at or below `from`, 1 at or above `to`, eased in between. */
function smoothstep(from: number, to: number, x: number): number {
  if (to <= from) return x < to ? 0 : 1
  const t = Math.min(Math.max((x - from) / (to - from), 0), 1)
  return t * t * (3 - 2 * t)
}

/**
 * Opacity of one annotation mark at a given point of the journey. Eased, not switched:
 * a mark that blinks off draws more attention leaving than it ever did standing still.
 * The curve is the same under prefers-reduced-motion — the request is about things
 * that move, and a cross-fade is what that setting asks motion to be replaced with.
 */
function annotationFade(journey: number, fullUntil: number, gone: number): number {
  return 1 - smoothstep(fullUntil, gone, journey)
}

/**
 * A playback failure, stored as what went wrong rather than as a sentence about it.
 *
 * Keeping the key instead of the finished string is what lets `play` stay out of the
 * locale's way: it is a `useCallback` several effects depend on, and putting `locale`
 * in its dependency list would rebuild it — and re-run those effects — every time a
 * reader changed language. It also means a banner already on screen re-reads itself in
 * the new language instead of sitting there in the old one.
 */
type AudioFault =
  | { key: 'errorBlocked' | 'errorUnsupported' | 'errorAborted' | 'errorUnknown' | 'errorNarrationLoad' }
  | { key: 'errorFailed'; message: string }

function describeAudioError(error: unknown): AudioFault {
  if (error instanceof DOMException) {
    if (error.name === 'NotAllowedError') return { key: 'errorBlocked' }
    if (error.name === 'NotSupportedError') return { key: 'errorUnsupported' }
    if (error.name === 'AbortError') return { key: 'errorAborted' }
  }
  if (error instanceof Error) return { key: 'errorFailed', message: error.message }
  return { key: 'errorUnknown' }
}

/**
 * The fault, said out loud. The browser's own message is quoted verbatim inside it and
 * stays in whatever language the browser reports it in: it is a quotation from another
 * program, and paraphrasing it would make it harder to search for.
 */
function faultMessage(fault: AudioFault, locale: LocaleCode): string {
  const text = strings(locale)[fault.key]
  return fault.key === 'errorFailed' ? text.replace('{message}', fault.message) : text
}

/* ------------------------------------------------ prefers-reduced-motion store */

const MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function subscribeToMotionPreference(onChange: () => void): () => void {
  const query = window.matchMedia(MOTION_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function readMotionPreference(): boolean {
  return window.matchMedia(MOTION_QUERY).matches
}

/** Prerender assumes full motion; useSyncExternalStore corrects it on hydration. */
function assumeFullMotion(): boolean {
  return false
}

/**
 * The size of the pair, carried by the block rather than by the line, so the
 * translation can be stated as a fraction of the script it sits under (0.62em)
 * and stay that fraction at every viewport width.
 */
function captionScaleClass(cue: Cue): string {
  return WEIGHTED_LINES.has(cue.text)
    ? 'text-[clamp(1.3rem,3.4vw,2.75rem)]'
    : 'text-[clamp(1rem,2.22vw,2rem)]'
}

/**
 * `caption-legible` is not decoration: from the arrival onward the lines sit on lit
 * cloud and ice, where --paper alone measures 1.5:1 and 1.3:1. The vignette below
 * does the coarse work, the shadow cuts the letterforms out of whatever is left.
 */
function captionClass(cue: Cue): string {
  return WEIGHTED_LINES.has(cue.text)
    ? 'caption-legible text-balance text-center font-serif text-[1em] font-light leading-[1.3] tracking-[-0.012em] text-paper'
    : 'caption-legible text-balance text-center font-serif text-[1em] font-light leading-[1.5] text-paper'
}

/**
 * One caption, in one language or two.
 *
 * English is the script that is actually being spoken, so it is always the top
 * line and there is no setting that removes it. The chosen language follows
 * underneath at 0.62em and one step down the palette — a gloss on the line above,
 * not a second voice competing with it. `translationFor` returns null for English
 * and for any locale without a table, and that null is the whole condition: no
 * second line, and no gap held open for one.
 *
 * Both lines live inside the layer the caption effects tween, so the pair enters
 * and leaves as a single block.
 */
function CaptionBlock({ cue, locale }: { cue: Cue; locale: LocaleCode }) {
  const translation = translationFor(cue.index, locale)

  return (
    <div className={captionScaleClass(cue)}>
      <p lang="en" className={captionClass(cue)}>
        {cue.text}
      </p>
      {translation ? (
        <p
          lang={locale}
          dir={localeByCode(locale).direction}
          className="caption-legible mt-[0.6em] text-balance text-center font-serif text-[0.62em] font-light leading-[1.45] text-paper-dim"
        >
          {translation}
        </p>
      ) : null}
    </div>
  )
}

export default function PaleBlueDot() {
  const canvasHostRef = useRef<HTMLDivElement>(null)
  const narrationRef = useRef<HTMLAudioElement>(null)
  const musicRef = useRef<HTMLAudioElement>(null)
  const encoreRef = useRef<HTMLAudioElement>(null)
  const sceneRef = useRef<EarthScene | null>(null)

  const captionCurrentRef = useRef<HTMLDivElement>(null)
  const captionPreviousRef = useRef<HTMLDivElement>(null)
  const endingRef = useRef<HTMLDivElement>(null)
  const gateRef = useRef<HTMLDivElement>(null)

  const clockRef = useRef<HTMLSpanElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const distanceLayerRef = useRef<HTMLDivElement>(null)
  const identityLayerRef = useRef<HTMLDivElement>(null)

  // The annotation is driven entirely from the frame loop — the ring has to sit on the
  // planet at every distance, and no state update can be allowed to run at 60Hz.
  const annotationRef = useRef<HTMLDivElement>(null)
  const annotationAnchorRef = useRef<HTMLDivElement>(null)
  const annotationRingRef = useRef<SVGCircleElement>(null)
  const annotationLeaderRef = useRef<SVGGElement>(null)
  const annotationLabelRef = useRef<HTMLSpanElement>(null)
  const annotationPlateNoteRef = useRef<HTMLSpanElement>(null)

  const [phase, setPhase] = useState<Phase>('idle')
  // Mirror of `phase` for the rAF loop and window listeners, which must not be
  // re-subscribed on every state change just to read it.
  const phaseRef = useRef<Phase>('idle')

  const [loadFraction, setLoadFraction] = useState(0)
  const [sceneReady, setSceneReady] = useState(false)
  const sceneReadyRef = useRef(false)
  const [sceneFailed, setSceneFailed] = useState(false)

  const [audioError, setAudioError] = useState<AudioFault | null>(null)
  const [musicUnavailable, setMusicUnavailable] = useState(false)
  const musicFailedRef = useRef(false)

  const [muted, setMuted] = useState(false)
  // True from the moment the approach completes. Swaps the top-right readout from a
  // countdown to the planet's own identity; mirrored in a ref so the frame loop can
  // flip it without re-rendering sixty times a second.
  const [arrived, setArrived] = useState(false)
  const arrivedRef = useRef(false)
  /**
   * Flips once, past ANNOTATION_RING_GONE, and unmounts the annotation outright rather
   * than leaving it at opacity 0: an invisible overlay across the frame is still an
   * overlay, and this one is wide enough to sit over the reticle.
   */
  const [annotationRetired, setAnnotationRetired] = useState(false)
  const annotationRetiredRef = useRef(false)
  /**
   * True for the window inside a replay where the narration has already been rewound
   * but the phase has not caught up yet.
   *
   * `play('start')` sets currentTime to 0 synchronously, then awaits the play promise
   * before flipping the phase to 'playing'. Across that await `phaseRef` still reads
   * 'ended', and the frame loop pins the arrival to 1 for a phase of 'ended' — so it
   * would keep painting a full-frame Earth over a narration that is back at zero,
   * for however many frames the seek takes. The flag lets the loop know the pin no
   * longer applies without having to widen the phase machine for one transient.
   */
  const restartingRef = useRef(false)
  /**
   * When the recomposition may begin, as a `performance.now()` stamp — or null
   * whenever the planet belongs to the reading.
   *
   * A ref, not state: this is read once per frame by the rAF loop and written to
   * the renderer imperatively, so putting it in state would re-render the whole
   * component sixty times a second to change nothing in the DOM.
   */
  const recomposeFromRef = useRef<number | null>(null)
  /** Last value handed to the scene, so a settled composition stops writing. */
  const compositionRef = useRef(0)
  /** Last canvas opacity written, so the style is not touched every frame. */
  const sceneOpacityRef = useRef(1)
  /** Last chapter reveal progress written. */
  const chapterRevealRef = useRef(-1)
  /**
   * True from the instant the page begins to open beside the planet.
   *
   * The reveal ramp above still runs per frame — it drives the readout's fade on
   * the same curve — but the exploration itself only needs to be told once that
   * it may appear, and runs its own entrance from there. This is that one flip:
   * a single render per reading, not one per frame, and never one per scrolled
   * pixel. The ref is what the frame loop compares against, for the same reason
   * `arrivedRef` and `annotationRetiredRef` exist.
   */
  const [explorationRevealed, setExplorationRevealed] = useState(false)
  const explorationRevealedRef = useRef(false)
  /**
   * The top-right readout, as a layer of its own so two opacities can multiply
   * instead of fighting: the chrome's, which `chromeClass` owns on the element
   * above (the language screen, the idle dimmer), and the reveal ramp's, written
   * here straight from the frame loop. Inline style beats a class, so writing the
   * fade onto the chrome element itself would take the dimmer away with it.
   */
  const hudReadoutRef = useRef<HTMLDivElement>(null)
  /** Read by the rAF loop, which cannot see the reduced-motion state directly. */
  const reducedMotionRef = useRef(false)
  const [creditsOpen, setCreditsOpen] = useState(false)
  const [chromeAwake, setChromeAwake] = useState(true)

  /**
   * The subtitle language: what a previous visit remembered, and what this one has
   * decided since. The choice made here outranks the stored one — writing to
   * localStorage does not notify this document, and should not have to.
   */
  const rememberedLocale: RememberedLocale = useSyncExternalStore(
    subscribeToStoredLocale,
    readStoredLocale,
    localeUnresolved,
  )
  const [chosenLocale, setChosenLocale] = useState<LocaleCode | null>(null)
  /** True once the question has been answered — or waved away — in this session. */
  const [languageAnswered, setLanguageAnswered] = useState(false)
  /** True while the screen has been reopened deliberately from the rail. */
  const [languageReopened, setLanguageReopened] = useState(false)
  /** Set when the language screen interrupted a reading that was under way. */
  const resumeAfterLanguageRef = useRef(false)

  const locale: LocaleCode = chosenLocale ?? rememberedLocale ?? DEFAULT_LOCALE
  const localeResolved = rememberedLocale !== undefined
  /** Asked once when nothing is remembered, and any time it is asked for again. */
  const languageOpen =
    languageReopened || (localeResolved && rememberedLocale === null && !languageAnswered)
  const reducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    readMotionPreference,
    assumeFullMotion,
  )
  // Mirrored into a ref because the rAF loop is mounted once, with an empty
  // dependency list, and must not be torn down and rebuilt when the preference
  // changes. The mirror lives in an effect rather than in render: refs are not
  // render output, and writing one during render is exactly the pattern that
  // breaks under concurrent rendering.
  useEffect(() => {
    reducedMotionRef.current = reducedMotion
  }, [reducedMotion])

  const [caption, setCaption] = useState<{ current: Cue | null; previous: Cue | null }>({
    current: null,
    previous: null,
  })
  const cueIdRef = useRef<string | null>(null)

  /**
   * The handover, reachable from the frame loop.
   *
   * The loop is mounted once with an empty dependency list — that is the whole point
   * of it — so it cannot close over a callback that is rebuilt on render. The ref is
   * refreshed below each time the callback changes, which keeps the loop reading the
   * current one without ever being torn down and restarted.
   */
  const endNarrationRef = useRef<() => void>(() => {})

  /** Set when the user presses play before the textures have finished loading. */
  const pendingStartRef = useRef(false)
  /**
   * Generation token for primeAudio's silent unlock. Bumped by every real start, so a
   * settle() that resolves late can tell that playback has moved on without it and
   * keep its hands off the element. See primeAudio.
   */
  const audioPrimeRef = useRef(0)
  /** True while the closing fade owns music.volume, so nothing else writes to it. */
  const musicTailRef = useRef(false)
  /** Level the tail fade starts from — whatever the bed had reached by then. */
  const musicTailPeakRef = useRef(MUSIC_VOLUME_ALONE)

  const updatePhase = useCallback((next: Phase) => {
    phaseRef.current = next
    setPhase(next)
  }, [])

  /* ------------------------------------------------------------------- scene */

  useEffect(() => {
    const host = canvasHostRef.current
    if (!host) return

    // The canvas is created per mount instead of living in JSX. EarthScene.dispose()
    // ends with forceContextLoss(), and a canvas whose context has been force-lost
    // will never hand out another one — so reusing the same element across React's
    // Strict Mode mount/unmount/mount leaves the second scene with a null context.
    const canvas = document.createElement('canvas')
    canvas.setAttribute('role', 'img')
    canvas.setAttribute('aria-label', CANVAS_LABEL)
    canvas.style.display = 'block'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    host.appendChild(canvas)

    let cancelled = false
    const scene = new EarthScene({
      canvas,
      onLoadProgress: (fraction) => {
        if (!cancelled) setLoadFraction(fraction)
      },
      onReady: () => {
        if (cancelled) return
        sceneReadyRef.current = true
        setSceneReady(true)
      },
    })
    sceneRef.current = scene

    scene.init().catch((error: unknown) => {
      if (cancelled) return
      console.error('[pale-blue-dot] WebGL scene failed to start', error)
      setSceneFailed(true)
      // The reading is the point; without a picture it still has to be playable.
      sceneReadyRef.current = true
      setSceneReady(true)
    })

    return () => {
      cancelled = true
      sceneRef.current = null
      scene.dispose()
      canvas.remove()
    }
  }, [])

  /* ------------------------------------------------------------------- audio */

  useEffect(() => {
    const narration = narrationRef.current
    const music = musicRef.current
    const encore = encoreRef.current
    if (narration) narration.muted = muted
    if (music) music.muted = muted
    if (encore) encore.muted = muted
  }, [muted])

  // Capture the elements while they are still mounted: by the time an unmount
  // cleanup runs, React has already detached the refs.
  useEffect(() => {
    const narration = narrationRef.current
    const music = musicRef.current
    const encore = encoreRef.current
    return () => {
      narration?.pause()
      for (const element of [music, encore]) {
        if (!element) continue
        gsap.killTweensOf(element)
        element.pause()
      }
    }
  }, [])

  const play = useCallback(
    async (mode: 'start' | 'resume'): Promise<void> => {
      const narration = narrationRef.current
      if (!narration) return
      const music = musicRef.current
      setAudioError(null)

      // Take the elements back from primeAudio: any settle() still in flight would
      // pause and rewind what we are about to start. Its volume restore goes with it,
      // so the levels have to be set here rather than left to that callback.
      audioPrimeRef.current += 1
      narration.volume = 1

      if (mode === 'start') {
        cueIdRef.current = null
        setCaption({ current: null, previous: null })
        narration.currentTime = 0
        // Back to the far end with the audio, in the same breath. The frame loop
        // would derive the same thing a tick later; doing it here means a replay
        // never paints one frame of a full Earth over a rewound narration.
        sceneRef.current?.setJourney(0)
        // ...and the loop has to be told, or it will undo that on its very next tick:
        // the phase is still 'ended' until the play promise below resolves.
        restartingRef.current = true
        // The framing goes back with it. Both the stamp and the written value are
        // cleared here, in the same synchronous block as the seek, so a replay can
        // never open on a planet still parked in the lower right and then snap.
        recomposeFromRef.current = null
        compositionRef.current = 0
        sceneRef.current?.setComposition(0)
        sceneOpacityRef.current = 1
        if (canvasHostRef.current) canvasHostRef.current.style.opacity = '1'
        chapterRevealRef.current = -1
        // The page closes with it. Dropping `revealed` here rather than waiting
        // for the phase to flip means the exploration is already on its way out
        // by the time it unmounts, and comes back to a fresh scroll — scrollTop
        // 0, first beat active — because a remount is the reset.
        explorationRevealedRef.current = false
        setExplorationRevealed(false)
        // The readout was faded out by the reveal ramp, which will not run again
        // until the next reading ends. Hand it back the way the canvas is handed
        // back, in the same synchronous block as the seek.
        if (hudReadoutRef.current) hudReadoutRef.current.style.opacity = '1'
        if (music) {
          // Replay can land on a bed that is still playing — mid fade-in, held at the
          // solo level, or inside its own closing fade. Every one of those is a tween
          // or a hand-off that would go on writing volume underneath the new one.
          gsap.killTweensOf(music)
          musicTailRef.current = false
          music.currentTime = 0
          music.volume = 0
        }
        // The encore goes back with the bed. A replay landing on top of a looping
        // second track would play the reading against the wrong music and never
        // stop, because nothing else in the piece ever pauses it.
        const encore = encoreRef.current
        if (encore) {
          gsap.killTweensOf(encore)
          encore.pause()
          encore.currentTime = 0
          encore.volume = 0
        }
      }

      // Both play() calls are issued synchronously so they share one user gesture;
      // awaiting the first would spend the activation before the second is made.
      const narrationStarted = narration.play()
      const musicStarted = music && !musicFailedRef.current ? music.play() : null

      try {
        await narrationStarted
      } catch (error) {
        music?.pause()
        restartingRef.current = false
        updatePhase(mode === 'resume' ? 'paused' : 'idle')
        setAudioError(describeAudioError(error))
        return
      }

      updatePhase('playing')
      restartingRef.current = false

      if (music && musicStarted) {
        musicStarted
          .then(() => {
            gsap.killTweensOf(music)
            // Audio fades ignore prefers-reduced-motion: that setting is about
            // movement on screen, and a hard cut in the ears is worse, not kinder.
            gsap.to(music, {
              volume: MUSIC_VOLUME,
              duration: MUSIC_FADE_IN,
              ease: 'sine.out',
              overwrite: 'auto',
            })
          })
          .catch((error: unknown) => {
            console.warn('[pale-blue-dot] music track unavailable', error)
            musicFailedRef.current = true
            setMusicUnavailable(true)
          })
      }
    },
    [updatePhase],
  )

  const pausePlayback = useCallback(() => {
    narrationRef.current?.pause()
    musicRef.current?.pause()
    updatePhase('paused')
  }, [updatePhase])

  /**
   * Safari only honours play() from inside the gesture handler. When the textures
   * are still loading we cannot start yet, so both elements are unlocked silently
   * within the click and started for real once the scene is ready.
   */
  const primeAudio = useCallback(() => {
    // One token for this unlock. play() bumps the counter when it takes the elements
    // over, which is the whole guard: the textures can finish loading inside the same
    // tick that the silent play() resolves, and a settle() that ran afterwards used to
    // pause the narration and rewind it to zero one frame after the reading began.
    const token = (audioPrimeRef.current += 1)
    const superseded = () => audioPrimeRef.current !== token

    for (const element of [narrationRef.current, musicRef.current]) {
      if (!element) continue
      const volume = element.volume
      element.volume = 0
      const started = element.play()
      const settle = () => {
        if (superseded()) return
        element.pause()
        element.currentTime = 0
        element.volume = volume
      }
      if (started) {
        started.then(settle, () => {
          if (superseded()) return
          element.volume = volume
        })
      } else {
        settle()
      }
    }
  }, [])

  const handleStart = useCallback(() => {
    if (phaseRef.current !== 'idle') return
    setAudioError(null)
    if (sceneReadyRef.current) {
      void play('start')
      return
    }
    primeAudio()
    pendingStartRef.current = true
    updatePhase('loading')
  }, [play, primeAudio, updatePhase])

  useEffect(() => {
    if (!sceneReady || !pendingStartRef.current) return
    pendingStartRef.current = false
    void play('start')
  }, [sceneReady, play])

  const togglePlayback = useCallback(() => {
    switch (phaseRef.current) {
      case 'idle':
        handleStart()
        return
      case 'playing':
        pausePlayback()
        return
      case 'paused':
      case 'ended':
        void play(phaseRef.current === 'ended' ? 'start' : 'resume')
        return
      default:
    }
  }, [handleStart, pausePlayback, play])

  const handleNarrationEnded = useCallback(() => {
    // Reachable from two places now — the frame loop, when the voice stops at
    // NARRATION_SPEECH_END, and the element's own `ended` if that path ever fails —
    // so it has to be safe to call twice. Without this guard the second call would
    // stamp `recomposeFromRef` again and replay the whole fade-out-and-back eight
    // seconds into a scene that had already settled.
    if (isAfterNarration(phaseRef.current)) return

    // The reading ends into exploration, not into the closing card. Everything
    // else in this handler is unchanged: the arrival is still pinned, the caption
    // is still handed to the fading layer, and the bed still swells.
    updatePhase('exploring')

    // Stop the element rather than letting its remaining silence run out. Paused
    // AFTER the phase change on purpose: `handleNarrationPause` only acts while the
    // phase is 'playing', so by this point it correctly ignores us.
    narrationRef.current?.pause()
    // Start the clock the recomposition runs on. Only a stamp is set here; the
    // move itself is driven by the frame loop, which is the only loop there is.
    recomposeFromRef.current = performance.now()
    // The arrival is permanent. The reading finishes on a full-frame Earth that goes
    // on turning; this pins it there rather than letting the closing frame reopen a
    // journey the piece has already made.
    sceneRef.current?.setJourney(1)
    cueIdRef.current = null
    // Hand the last line over to the previous layer so it fades out rather than
    // vanishing under the closing composition.
    setCaption((prev) => ({ current: null, previous: prev.current }))

    // The music is NOT stopped here. It was ducked to sit under a voice; with the
    // voice gone it comes up instead and plays the rest of "Aurora" over the turning
    // Earth. Only the track's own last seconds fade it out — see handleMusicTimeUpdate.
    const music = musicRef.current
    if (!music || musicFailedRef.current || musicTailRef.current) return
    const remaining = music.duration - music.currentTime
    // Nothing to swell into if the bed is already inside its closing fade.
    if (Number.isFinite(remaining) && remaining <= MUSIC_TAIL_FADE) return
    gsap.killTweensOf(music)
    gsap.to(music, {
      volume: MUSIC_VOLUME_ALONE,
      duration: MUSIC_SWELL,
      ease: 'sine.inOut',
      overwrite: 'auto',
    })
  }, [updatePhase])

  // Keep the frame loop's handle on the handover current without remounting it.
  useEffect(() => {
    endNarrationRef.current = handleNarrationEnded
  }, [handleNarrationEnded])

  /**
   * The last beat of the exploration has come up, so the piece has run out of
   * page: the closing card and its Replay are what follows, exactly as they did
   * when the reading used to end straight into them.
   *
   * Guarded on the phase because this is the one transition into 'ended' and it
   * arrives from a scroll listener, which cannot be allowed to reach a reading
   * that has since been replayed.
   */
  const handleExplorationEnd = useCallback(() => {
    if (phaseRef.current !== 'exploring') return
    updatePhase('ended')
  }, [updatePhase])

  /**
   * The only fade-out in the piece, run off the music's own clock. timeupdate fires
   * roughly four times a second and only while the element is playing, which is what
   * makes it safe: a pause inside the last fifteen seconds simply stops the fade where
   * it stands instead of draining the volume in the background like a tween would.
   */
  const handleMusicTimeUpdate = useCallback(() => {
    const music = musicRef.current
    if (!music) return
    const { duration, currentTime } = music
    if (!Number.isFinite(duration) || duration <= 0) return

    const remaining = duration - currentTime
    if (remaining > MUSIC_TAIL_FADE) {
      // Seeked back out of the tail — a replay, most likely. Hand the volume back.
      musicTailRef.current = false
      return
    }

    if (!musicTailRef.current) {
      musicTailRef.current = true
      musicTailPeakRef.current = music.volume
      // From here the fade owns the level; a swell still running would fight it.
      gsap.killTweensOf(music)
    }

    const t = Math.min(Math.max(remaining / MUSIC_TAIL_FADE, 0), 1)
    music.volume = Math.min(Math.max(musicTailPeakRef.current * t * t * (3 - 2 * t), 0), 1)
  }, [])

  /**
   * Aurora has finished. Pick the room up again.
   *
   * Chained on `ended` rather than started on a timer, so it cannot begin early on a
   * slow decode or late on a stalled buffer — whatever the bed's real duration turns
   * out to be, this is the instant after it. The element carries `loop`, so the only
   * thing that ever stops it is a replay or leaving the page.
   *
   * Volume starts at 0 and is tweened up: the bed ended at silence after its own
   * fifteen-second fade, and cutting straight to half volume would land as a jolt in
   * a piece that has just spent five minutes getting quiet.
   */
  const handleMusicEnded = useCallback(() => {
    const encore = encoreRef.current
    if (!encore) return
    if (!isAfterNarration(phaseRef.current) && phaseRef.current !== 'playing') return

    gsap.killTweensOf(encore)
    encore.currentTime = 0
    encore.volume = 0
    // `muted` is not read here on purpose: the element is mounted for the whole
    // session, so the effect above has already written the current state onto it and
    // will keep doing so. Setting it again from a stale closure could unmute it.
    void encore
      .play()
      .then(() => {
        gsap.to(encore, { volume: MUSIC_VOLUME_ALONE, duration: MUSIC_ENCORE_FADE_IN, ease: 'sine.out' })
      })
      .catch(() => undefined)
  }, [])

  // Hardware media keys and OS controls can pause the narration behind our back.
  const handleNarrationPause = useCallback(() => {
    const narration = narrationRef.current
    if (!narration || narration.ended) return
    if (phaseRef.current !== 'playing') return
    musicRef.current?.pause()
    updatePhase('paused')
  }, [updatePhase])

  const handleNarrationPlay = useCallback(() => {
    if (phaseRef.current !== 'paused') return
    const music = musicRef.current
    if (music && !musicFailedRef.current) void music.play().catch(() => undefined)
    updatePhase('playing')
  }, [updatePhase])

  const handleNarrationError = useCallback(() => {
    setAudioError({ key: 'errorNarrationLoad' })
    if (phaseRef.current === 'loading') {
      pendingStartRef.current = false
      updatePhase('idle')
    }
  }, [updatePhase])

  /* --------------------------------------------------------------- language */

  /**
   * Reopening the screen mid-reading pauses first. The panel sits over the frame
   * for as long as it takes to choose, and lines heard behind it would be lines
   * missed; the reading picks up where it stopped as soon as the screen is gone.
   */
  const openLanguage = useCallback(() => {
    if (phaseRef.current === 'playing') {
      pausePlayback()
      resumeAfterLanguageRef.current = true
    }
    setLanguageReopened(true)
  }, [pausePlayback])

  const closeLanguage = useCallback(() => {
    setLanguageReopened(false)
    setLanguageAnswered(true)
    if (!resumeAfterLanguageRef.current) return
    resumeAfterLanguageRef.current = false
    void play('resume')
  }, [play])

  const handleLocaleSelect = useCallback(
    (code: LocaleCode) => {
      // Applied before the screen has finished leaving, so a caption already on
      // screen behind the panel changes language as the choice is made.
      setChosenLocale(code)
      storeLocale(code)
      closeLanguage()
    },
    [closeLanguage],
  )

  /** Before the reading has started — the transport has nothing to control yet. */
  const beforePlayback = phase === 'idle' || phase === 'loading'
  /**
   * The play gate waits its turn: the language screen comes first, and for the one
   * commit before localStorage has been read there is no screen at all rather than
   * the wrong one.
   */
  const gateOpen = beforePlayback && localeResolved && !languageOpen

  /**
   * The gate arrives as the language screen leaves — the two overlap for the length
   * of one fade, so the handover reads as a dissolve rather than as a swap. It is
   * mounted at opacity 0 in the markup, not only by the tween, so the first frame
   * cannot slip through at full strength.
   */
  useEffect(() => {
    const element = gateRef.current
    if (!element) return
    gsap.fromTo(
      element,
      { opacity: 0 },
      { opacity: 1, duration: motionSeconds(0.6, reducedMotion), ease: 'sine.out' },
    )
    return () => {
      gsap.killTweensOf(element)
    }
  }, [gateOpen, reducedMotion])

  /* ------------------------------------------------- the clock, once per frame */

  useEffect(() => {
    const telemetry = { clock: '00:00', progress: -1 }
    // Last values written to the annotation, so the loop only touches the DOM when
    // something has actually moved. -1 is "nothing written yet" for all of them.
    const annotation = { x: -1, y: -1, radius: -1, ring: -1, label: -1, plateNote: -1, visible: -1 }

    const tick = () => {
      frame = window.requestAnimationFrame(tick)

      const narration = narrationRef.current
      if (!narration) return

      const active = phaseRef.current
      const time = narration.currentTime

      // The approach, read off the narration's own clock. At rest that is time 0, so
      // the idle poster is the Voyager frame without anything having to arrange it.
      // Once the reading is over the arrival is pinned instead — through exploration
      // and the closing card alike — so the piece never travels back out, and no
      // later control that touches currentTime can send the camera backwards. The
      // one exception is a replay's rewind, where the phase is stale by a few frames
      // and the pin would fight the seek that already happened.
      const arrival =
        isAfterNarration(active) && !restartingRef.current ? 1 : arrivalAt(time)
      sceneRef.current?.setJourney(arrival)

      // The recomposition, on its own wall clock. The journey is finished and its
      // clock has stopped, so this cannot be derived from narration.currentTime —
      // but it still belongs in this loop rather than a second one. Nothing runs
      // at all while the stamp is null, which is every frame of the reading.
      //
      // Three beats: hold, fade to black, fade back in. The frustum is shifted at
      // the bottom of the fade, where there is nothing on screen to see it happen.
      const recomposeFrom = recomposeFromRef.current
      if (recomposeFrom !== null) {
        const reduced = reducedMotionRef.current
        const hold = reduced ? RECOMPOSE_HOLD_REDUCED_MS : RECOMPOSE_HOLD_MS
        const out = reduced ? RECOMPOSE_FADE_OUT_REDUCED_MS : RECOMPOSE_FADE_OUT_MS
        const back = reduced ? RECOMPOSE_FADE_IN_REDUCED_MS : RECOMPOSE_FADE_IN_MS
        const elapsed = performance.now() - recomposeFrom

        let opacity: number
        let composed: boolean
        if (elapsed < hold) {
          opacity = 1
          composed = false
        } else if (elapsed < hold + out) {
          opacity = 1 - easeRecompose((elapsed - hold) / out)
          composed = false
        } else {
          // Past the bottom of the fade the new framing is already in place, so
          // the scene comes back composed rather than moving into position.
          opacity = easeRecompose((elapsed - hold - out) / back)
          composed = true
        }

        const composition = composed ? 1 : 0
        if (composition !== compositionRef.current) {
          compositionRef.current = composition
          sceneRef.current?.setComposition(composition)
        }

        const rounded = Math.round(opacity * 1000) / 1000
        if (rounded !== sceneOpacityRef.current) {
          sceneOpacityRef.current = rounded
          if (canvasHostRef.current) canvasHostRef.current.style.opacity = String(rounded)
        }

        // The chapter follows the planet in, a beat behind it. The ramp itself is
        // unchanged; what it drives is not. The page runs its own entrance off a
        // single flip (see `explorationRevealed`), and the ramp is left holding
        // the other half of the same moment: the readout going out as the words
        // come in, on one curve, from one clock.
        const revealFrom = hold + out + (reduced ? 0 : CHAPTER_DELAY_MS)
        const revealSpan = reduced ? RECOMPOSE_FADE_IN_REDUCED_MS : CHAPTER_REVEAL_MS
        const reveal = elapsed < revealFrom ? 0 : easeRecompose((elapsed - revealFrom) / revealSpan)
        const revealRounded = Math.round(reveal * 1000) / 1000
        if (revealRounded !== chapterRevealRef.current) {
          chapterRevealRef.current = revealRounded

          // The countdown, the identity and the clock were the instrument of the
          // reading, and the reading is over — they now sit on a lit planet with
          // nothing left to report. Faded, never moved, and never given a shadow
          // to survive the light: it is leaving, not being made to work harder.
          const readout = hudReadoutRef.current
          if (readout) readout.style.opacity = String(1 - revealRounded)

          const revealed = revealRounded > 0
          if (revealed !== explorationRevealedRef.current) {
            explorationRevealedRef.current = revealed
            setExplorationRevealed(revealed)
          }
        }

        // Settled: stop the clock so the branch costs nothing for the rest of the
        // visit, and so the final values are written exactly once.
        if (elapsed >= revealFrom + revealSpan && elapsed >= hold + out + back) {
          recomposeFromRef.current = null
        }
      }

      const hasArrived = arrival >= 1
      if (hasArrived !== arrivedRef.current) {
        arrivedRef.current = hasArrived
        setArrived(hasArrived)
      }

      // The annotation rides the planet: ring on the dot, leader and label hung off it,
      // all three written straight to the DOM. The only state it costs is the single
      // flip that unmounts it once the journey is past it — and the flip back, so a
      // replay gets the mark that made the dot findable in the first place.
      const retired = arrival > ANNOTATION_RING_GONE
      if (retired !== annotationRetiredRef.current) {
        annotationRetiredRef.current = retired
        setAnnotationRetired(retired)
        // Coming back from a replay the elements are new ones, holding their JSX
        // defaults; the cache has to forget what it wrote to the old ones or the
        // first frames would be skipped as "unchanged".
        annotation.x = -1
        annotation.y = -1
        annotation.radius = -1
        annotation.ring = -1
        annotation.label = -1
        annotation.plateNote = -1
        annotation.visible = -1
      }
      if (!retired) {
        const anchor = annotationAnchorRef.current
        const dot = anchor ? (sceneRef.current?.getDotScreenPosition() ?? null) : null
        if (anchor) {
          if (!dot || !dot.onScreen) {
            // No render yet, or Earth outside the frustum: nothing to point at.
            if (annotation.visible !== 0) {
              annotation.visible = 0
              anchor.style.opacity = '0'
            }
          } else {
            if (annotation.visible !== 1) {
              annotation.visible = 1
              anchor.style.opacity = '1'
            }

            const x = Math.round(dot.x * 10) / 10
            const y = Math.round(dot.y * 10) / 10
            if (x !== annotation.x || y !== annotation.y) {
              annotation.x = x
              annotation.y = y
              anchor.style.transform = `translate3d(${x}px, ${y}px, 0)`
            }

            const radius = Math.round(annotationRingRadius(dot.radiusPx) * 10) / 10
            if (radius !== annotation.radius) {
              annotation.radius = radius
              annotationRingRef.current?.setAttribute('r', String(radius))
              // One attribute moves the whole elbow: the leader is drawn from the top
              // of a ring at the origin and translated out to the ring's real edge.
              annotationLeaderRef.current?.setAttribute('transform', `translate(0 ${-radius})`)
              const label = annotationLabelRef.current
              if (label) {
                label.style.transform = `translate3d(${-LEADER_RUN}px, ${-(
                  radius +
                  LEADER_GAP +
                  LEADER_RISE +
                  LEADER_LABEL_GAP
                )}px, 0)`
              }
            }

            const labelOpacity =
              Math.round(annotationFade(arrival, ANNOTATION_FULL_UNTIL, ANNOTATION_LABEL_GONE) * 100) /
              100
            if (labelOpacity !== annotation.label) {
              annotation.label = labelOpacity
              const opacity = String(labelOpacity)
              annotationLeaderRef.current?.setAttribute('opacity', opacity)
              if (annotationLabelRef.current) annotationLabelRef.current.style.opacity = opacity
            }

            const ringOpacity =
              Math.round(annotationFade(arrival, ANNOTATION_FULL_UNTIL, ANNOTATION_RING_GONE) * 100) /
              100
            if (ringOpacity !== annotation.ring) {
              annotation.ring = ringOpacity
              annotationRingRef.current?.setAttribute('opacity', String(ringOpacity))
            }

            // "0.12 px" is the measurement of the 1990 plate, not of this render. It
            // stands while the camera is still at Voyager's distance and goes the
            // moment the approach begins, rather than sitting next to a growing disc
            // insisting it is a tenth of a pixel wide.
            const plateNote = arrival > 0 ? 0 : 1
            if (plateNote !== annotation.plateNote && annotationPlateNoteRef.current) {
              annotation.plateNote = plateNote
              annotationPlateNoteRef.current.style.opacity = String(plateNote)
            }
          }
        }
      }

      // No countdown here any more. It used to run 6,060,000,000 km down to zero in
      // thousand-kilometre steps, and every one of those frames was arithmetic on a
      // figure the project had never sourced. The distance is now a fixed, quoted
      // fact — see DISTANCE_FROM_SUN_KM — and the arrival is still signalled, by the
      // identity layer cross-fading over it. The journey itself is untouched:
      // `arrival` still drives the camera exactly as before.

      // The transport still measures the reading itself, start to finish: the rule
      // and the clock are about Sagan's voice, not about the camera. The encoded
      // file is a fraction of a second shorter than NARRATION_DURATION, so a
      // finished reading is pinned to 1 rather than stopping at 0.9993 — and it
      // stays pinned through exploration, where the reading is equally over.
      const progress = isAfterNarration(active)
        ? 1
        : Math.min(Math.max(time / NARRATION_DURATION, 0), 1)

      const clock = formatClock(
        isAfterNarration(active) ? NARRATION_DURATION : Math.min(time, NARRATION_DURATION),
      )
      if (clock !== telemetry.clock && clockRef.current) {
        telemetry.clock = clock
        clockRef.current.textContent = clock
      }

      if (Math.abs(progress - telemetry.progress) > 0.0002 && progressRef.current) {
        telemetry.progress = progress
        progressRef.current.style.transform = `scaleX(${progress.toFixed(5)})`
      }

      // The reading is over when the voice stops, not when the file does. See
      // NARRATION_SPEECH_END: the last eight seconds of the recording are silence,
      // and waiting them out left the closing line stranded on a still frame.
      if (active === 'playing' && time >= NARRATION_SPEECH_END) {
        endNarrationRef.current()
      } else if (active === 'playing' || active === 'paused') {
        const cue = cueAt(time)
        const id = cue?.id ?? null
        if (id !== cueIdRef.current) {
          cueIdRef.current = id
          setCaption((prev) => ({ current: cue, previous: prev.current }))
        }
      }
    }

    let frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [])

  /* ------------------------------------------------------- arrival handover */

  /**
   * The distance readout hands over to the planet's identity when the countdown
   * runs out — a gauge stuck on zero for the last three minutes would read as a
   * dead instrument. Both layers are always mounted and cross-faded, so the swap
   * happens without a reflow and reverses on replay.
   */
  useEffect(() => {
    const distance = distanceLayerRef.current
    const identity = identityLayerRef.current
    if (!distance || !identity) return

    const duration = motionSeconds(0.9, reducedMotion)
    gsap.killTweensOf([distance, identity])
    gsap.to(distance, { opacity: arrived ? 0 : 1, duration, ease: 'sine.inOut' })
    gsap.to(identity, { opacity: arrived ? 1 : 0, duration, ease: 'sine.inOut' })

    return () => {
      gsap.killTweensOf([distance, identity])
    }
  }, [arrived, reducedMotion])

  /**
   * The annotation belongs to the journey, not to the poster. Nothing marks the dot
   * on the language screen or the play gate: the Voyager plate carries no annotation
   * either, and a viewer who has not chosen to leave yet is owed the photograph as it
   * was taken. The mark arrives with the departure — from the moment play is pressed
   * through the hold and most of the approach, which is exactly when someone who has
   * never seen this image needs it, the subject being two pixels wide and the camera
   * already moving toward it.
   *
   * `beforePlayback` covers both 'idle' and 'loading', so the mark also stays away
   * while textures are still resolving — it should land on a moving frame, not a
   * waiting one. The fade-in below runs on this flag, so it eases in rather than pops.
   *
   * Mounting also waits on the scene so it can fade in over a rendered frame rather
   * than a black one, and there is nothing to point at when WebGL is unavailable.
   */
  const showAnnotation = sceneReady && !sceneFailed && !annotationRetired && !beforePlayback

  useEffect(() => {
    const element = annotationRef.current
    if (!showAnnotation || !element) return
    gsap.fromTo(
      element,
      { opacity: 0 },
      {
        opacity: 1,
        duration: motionSeconds(1.2, reducedMotion),
        delay: reducedMotion ? 0 : 0.4,
        ease: 'sine.out',
      },
    )
    return () => {
      gsap.killTweensOf(element)
    }
  }, [showAnnotation, reducedMotion])

  /* --------------------------------------------------------------- captions */

  const currentCue = caption.current
  const previousCue = caption.previous

  useEffect(() => {
    const element = captionCurrentRef.current
    if (!element) return
    gsap.killTweensOf(element)
    if (!currentCue) {
      gsap.set(element, { opacity: 0, y: 0 })
      return
    }
    const weighted = WEIGHTED_LINES.has(currentCue.text)
    gsap.fromTo(
      element,
      { opacity: 0, y: 8 },
      {
        opacity: 1,
        y: 0,
        duration: motionSeconds(weighted ? 1.05 : 0.7, reducedMotion),
        // Let the outgoing line get most of the way out first. Both layers sit in the
        // same box, and two serif lines crossing at half opacity read as a printing
        // error rather than as a dissolve. Cue times are approximate to begin with,
        // so a sixth of a second costs nothing in sync.
        delay: reducedMotion ? 0 : CAPTION_HANDOVER,
        ease: 'power2.out',
      },
    )
    return () => {
      gsap.killTweensOf(element)
    }
  }, [currentCue, reducedMotion])

  useEffect(() => {
    const element = captionPreviousRef.current
    if (!element || !previousCue) return
    gsap.killTweensOf(element)
    gsap.fromTo(
      element,
      { opacity: 1, y: 0 },
      {
        opacity: 0,
        y: -8,
        duration: motionSeconds(0.34, reducedMotion),
        ease: 'power2.in',
        onComplete: () => {
          setCaption((prev) => (prev.previous === previousCue ? { ...prev, previous: null } : prev))
        },
      },
    )
    return () => {
      gsap.killTweensOf(element)
    }
  }, [previousCue, reducedMotion])

  useEffect(() => {
    if (phase !== 'ended') return
    const element = endingRef.current
    if (!element) return
    gsap.fromTo(
      element,
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        duration: motionSeconds(1.1, reducedMotion),
        delay: reducedMotion ? 0 : 0.5,
        ease: 'power2.out',
      },
    )
    return () => {
      gsap.killTweensOf(element)
    }
  }, [phase, reducedMotion])

  /* ------------------------------------------------------- chrome & keyboard */

  const chromeAwakeRef = useRef(true)

  useEffect(() => {
    let timer: number | undefined

    const wake = () => {
      if (!chromeAwakeRef.current) {
        chromeAwakeRef.current = true
        setChromeAwake(true)
      }
      if (timer !== undefined) window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        chromeAwakeRef.current = false
        setChromeAwake(false)
      }, CHROME_IDLE_DELAY)
    }

    wake()
    window.addEventListener('pointermove', wake, { passive: true })
    window.addEventListener('pointerdown', wake, { passive: true })
    window.addEventListener('keydown', wake)
    window.addEventListener('focusin', wake)

    return () => {
      if (timer !== undefined) window.clearTimeout(timer)
      window.removeEventListener('pointermove', wake)
      window.removeEventListener('pointerdown', wake)
      window.removeEventListener('keydown', wake)
      window.removeEventListener('focusin', wake)
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return
      // Never shadow a control that already has focus, or typing inside a field.
      const target = event.target
      if (
        target instanceof Element &&
        target.closest('button, a, input, textarea, select, [contenteditable="true"]')
      ) {
        return
      }

      // Nothing on this handler may fire behind a modal: the language screen owns
      // its own keys, and Escape inside either sheet is the dialog's own.
      if (languageOpen) return

      if (event.code === 'KeyC') {
        event.preventDefault()
        setCreditsOpen((open) => !open)
        return
      }
      if (creditsOpen) return

      if (event.code === 'Space' || event.code === 'KeyK') {
        event.preventDefault()
        togglePlayback()
        return
      }
      if (event.code === 'KeyM') {
        event.preventDefault()
        setMuted((value) => !value)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [creditsOpen, languageOpen, togglePlayback])

  const closeCredits = useCallback(() => setCreditsOpen(false), [])

  /* -------------------------------------------------------------------- view */

  const dimChrome = phase === 'playing' && !chromeAwake && !creditsOpen
  // The language screen carries its own wordmark and dateline, so the instrument
  // chrome steps out from under it entirely instead of printing them twice.
  const chromeClass = `transition-opacity duration-[900ms] ease-out ${
    languageOpen ? 'opacity-0' : dimChrome ? 'opacity-20' : 'opacity-100'
  }`
  const loadPercent = Math.round(loadFraction * 100)
  const activeLocale = localeByCode(locale)

  return (
    // `lang` on the root, not just on the stage: the chrome speaks the reader's
    // language too — Kredit, Ton aus, もう一度 — and :lang(ja) in globals.css is what
    // hands Japanese its font stack and its tighter stencil tracking. Set here it
    // reaches the rail, the ending card and the credits panel as well. The narration
    // caption keeps its own lang="en", because Sagan is speaking English underneath.
    <div lang={locale} className="fixed inset-0 overflow-hidden bg-void">
      {/* Host for the WebGL canvas; see the scene effect for why it is not JSX. */}
      <div ref={canvasHostRef} className="fixed inset-0 z-0" />

      {/* Narration is the clock; the music is a bed underneath it. */}
      <audio
        ref={narrationRef}
        src="/audio/sagan-vocals.mp3"
        preload="auto"
        onEnded={handleNarrationEnded}
        onPause={handleNarrationPause}
        onPlay={handleNarrationPlay}
        onError={handleNarrationError}
      />
      {/* The bed outlives the reading by nearly five minutes and is allowed to; the
          only thing that ends it is its own last fifteen seconds. */}
      <audio
        ref={musicRef}
        src="/audio/aurora.mp3"
        preload="none"
        onTimeUpdate={handleMusicTimeUpdate}
        onEnded={handleMusicEnded}
      />
      {/* The encore. Loops, because the exploration has no duration — a reader may
          hold one beat for as long as they like. `preload="none"` keeps 3.7 MB off
          the wire until the bed has actually run its five minutes. */}
      <audio ref={encoreRef} src="/audio/earth-bretbernhoft.mp3" preload="none" loop />

      <p className="sr-only">{strings(locale).pageDescription}</p>

      {/* --- top left: wordmark ------------------------------------------- */}
      <div
        className={`pointer-events-none fixed left-5 top-5 z-20 sm:left-8 sm:top-7 ${chromeClass}`}
      >
        <h1 className="font-serif text-[clamp(1.05rem,1.6vw,1.5rem)] font-light leading-none tracking-[0.01em] text-paper">
          Pale Blue Dot
        </h1>
        <p className="hud-label mt-2.5">Voyager 1 · 14 Feb 1990</p>
      </div>

      {/* --- top right: telemetry ----------------------------------------- */}
      <div
        className={`pointer-events-none fixed right-5 top-5 z-20 text-right sm:right-8 sm:top-7 ${chromeClass}`}
      >
        {/* The readout is an instrument of the reading, and it is retired by the
            frame loop when the reading hands over — see the reveal ramp. It gets a
            layer to be retired ON, so the fade multiplies with the chrome opacity
            above rather than replacing it: an inline opacity written onto the
            element that carries `chromeClass` would outrank the class and take the
            language screen's step-out and the idle dimmer down with it.

            Nothing here moves and nothing here is given a shadow. The block is in
            the same place, at the same size, printing the same lines, for the whole
            of the reading; the only thing that ever changes about it is whether it
            is still there afterwards. */}
        <div ref={hudReadoutRef}>
          {/* Two readouts in one box: the distance still to close, and — once there is
              none — the thing we came back to. Same three lines in the same sizes on
              both layers, so the block keeps its height across the cross-fade and the
              clock underneath never jumps. */}
          <div className="relative">
            {/* Three lines, as before — the identity layer that cross-fades in over
                this one has three of its own, and the box has to keep its height or
                the clock below it jumps at the swap. The line that used to carry AU
                now carries the same distance in miles, because that is the other half
                of the sentence NASA actually publishes: "3.7 billion miles (6 billion
                kilometers) from the Sun". A sourced figure in the slot an unsourced
                one used to occupy. */}
            <div ref={distanceLayerRef} aria-hidden={arrived}>
              <p className="hud-label">Distance from the Sun</p>
              <p className="mt-2.5 font-mono text-[clamp(0.8rem,1.35vw,1rem)] leading-none tracking-[0.04em] text-paper-dim tabular-nums">
                {DISTANCE_FROM_SUN_KM}
              </p>
              <p className="hud-value mt-2 tabular-nums">{DISTANCE_FROM_SUN_MILES}</p>
            </div>
            {/* Anchored to the right edge and free to size itself: the box is only as
                wide as the countdown, which collapses to "0 km" at exactly the moment
                this layer appears. Pinned to both edges instead, the identity would
                wrap onto a fourth line and push down through the clock below it. */}
            <div
              ref={identityLayerRef}
              aria-hidden={!arrived}
              className="absolute right-0 top-0 whitespace-nowrap opacity-0"
            >
              <p className="hud-label">Arrived</p>
              <p className="mt-2.5 font-mono text-[clamp(0.8rem,1.35vw,1rem)] uppercase leading-none tracking-[0.2em] text-paper">
                Earth
              </p>
              <p className="hud-value mt-2 tabular-nums">{EARTH_RADIUS_LABEL}</p>
            </div>
          </div>
          <p className="hud-label mt-3.5 tabular-nums">
            T+ <span ref={clockRef}>00:00</span> / {TOTAL_CLOCK}
          </p>
          {sceneFailed ? (
            <p className="mt-3 font-mono text-[length:var(--micro-sm)] uppercase leading-none tracking-[var(--chrome-track)] text-sunbeam">
              {strings(locale).webglUnavailable}
            </p>
          ) : null}
          {musicUnavailable ? (
            <p className="mt-3 font-mono text-[length:var(--micro-sm)] uppercase leading-none tracking-[var(--chrome-track)] text-sunbeam">
              {strings(locale).musicUnavailable}
            </p>
          ) : null}
        </div>
      </div>

      {/* --- captions ------------------------------------------------------ */}
      {/* From the arrival onward Sagan's words land on a lit ocean, and stay there for
          the rest of the reading. The old vignette was too shallow and too thin for
          that: --paper measured 1.5:1 over the cloud deck and 1.3:1 over ice, which is
          not reading, it is guessing. Taller (the caption box tops out near 40vh, so
          56vh clears the whole of it) and denser at the foot, while still reaching zero
          at its own top edge — a gradient that ends in a visible step would draw a
          horizon line across the planet. The rest of the work is done by the text
          shadow in `caption-legible`; a scrim heavy enough to do it alone would be a
          caption box, and the words would stop being in the sky. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-10 h-[56vh]"
        style={{
          background:
            'linear-gradient(to top, rgba(5,7,12,0.90) 0%, rgba(5,7,12,0.82) 28%, rgba(5,7,12,0.70) 76%, rgba(5,7,12,0) 100%)',
        }}
      />
      {/* The language screen stands in front of the caption box, so the reading
          steps back while it is up — a live line under the panel would collide with
          the sample the panel is showing. The tweened layers are inside this one,
          which nothing else writes to, so the two opacities simply multiply. */}
      <div
        className={`pointer-events-none fixed inset-x-0 bottom-[6.75rem] z-20 flex justify-center px-6 transition-opacity duration-500 ease-out sm:bottom-[7.5rem] sm:px-10 ${
          languageOpen ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Measure, not `ch`. The old `min(62ch,100%)` looked like a reading measure
            but `ch` scales with the font, so at 1440px it held 62 characters of
            37px type inside 507px — a narrow column of very large text. Measured
            across all 57 cues in both languages, that put 32 of them over two
            lines and the longest onto five. A width in rem breaks that coupling:
            the column widens with the viewport while the type is governed on its
            own, and every cue lands on one line per language from 768px up. */}
        <div className="relative h-[9rem] w-[min(70rem,92vw)] sm:h-[10.5rem]">
          <div
            ref={captionPreviousRef}
            aria-hidden="true"
            className="absolute inset-0 flex items-end justify-center opacity-0"
          >
            {previousCue ? <CaptionBlock cue={previousCue} locale={locale} /> : null}
          </div>
          {/* One live region around the pair, so a screen reader announces the line
              once — script then gloss, each under its own lang — instead of racing
              two languages against each other. */}
          <div
            ref={captionCurrentRef}
            aria-live="polite"
            className="absolute inset-0 flex items-end justify-center opacity-0"
          >
            {currentCue ? <CaptionBlock cue={currentCue} locale={locale} /> : null}
          </div>
        </div>
      </div>

      {/* --- the exploration -------------------------------------------------- */}
      {/* The reading does not hand over to a menu. When the planet comes back
          composed, the page it was always leading to is already there beside it —
          no label for the mode, no button to press, nothing announcing a change of
          gear. Set as an editorial column rather than a centred card: the whole
          point of moving the Earth was to open this side of the frame.

          Mounted through 'ended' as well, because unmounting it the moment the last
          beat came up would take the reader's page away from under them on the
          frame the closing card arrives. `revealed` is what actually ends it: the
          column fades as the card fades in, and the two exchange the screen the way
          every other pair in the piece does.

          Unmounting is, on the other hand, exactly how a replay resets it. A fresh
          mount is a fresh scrollport — scrollTop 0, first beat active, the end not
          yet reached — so there is no reset code here to fall out of step with the
          component's own state. */}
      {isAfterNarration(phase) ? (
        <ExplorationSequence
          locale={locale}
          revealed={phase === 'exploring' && explorationRevealed}
          onReachEnd={handleExplorationEnd}
          onOpenCredits={() => setCreditsOpen(true)}
        />
      ) : null}

      {/* --- closing frame -------------------------------------------------- */}
      {phase === 'ended' ? (
        <div
          ref={endingRef}
          className="pointer-events-none fixed inset-x-0 bottom-0 z-20 px-5 pb-[5.5rem] opacity-0 sm:px-8 sm:pb-24"
        >
          {/* Same hand-off as the captions: the closing card is inside the element
              the entrance tween owns, so it can be faded out from underneath the
              language screen without the two fighting over one opacity. */}
          <div
            // 34ch used to cap this, and it read as 272px because `ch` resolves
            // against this element's own 16px, not against the display type inside it
            // — which is why the two lines the card is written as came out as four.
            // A rem cap sized to the display line replaces it; 86vw keeps it honest on
            // a phone, where the type has clamped down but the frame has not.
            className={`max-w-[min(34rem,86vw)] transition-opacity duration-500 ease-out ${
              languageOpen ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <p className="hud-label chrome-cap">{endingCard(locale).eyebrow}</p>
            <p className="mt-5 font-serif text-[calc(clamp(1.75rem,4.4vw,3.1rem)*var(--display-scale))] font-light leading-[1.22] tracking-[-0.012em] text-paper">
              {endingCard(locale).line.split('\n').map((line, index) => (
                <Fragment key={index}>
                  {index > 0 ? <br /> : null}
                  {line}
                </Fragment>
              ))}
            </p>
            <button
              type="button"
              onClick={() => void play('start')}
              className="pointer-events-auto mt-7 cursor-pointer border-b border-paper-faint/50 pb-1.5 font-mono text-[length:var(--micro-md)] font-medium uppercase leading-none tracking-[var(--chrome-track-wide)] text-paper transition-colors duration-200 hover:border-pale-blue hover:text-pale-blue focus-visible:border-pale-blue focus-visible:text-pale-blue"
            >
              {strings(locale).replay}
            </button>
          </div>
        </div>
      ) : null}

      {/* --- bottom rail: credits, transport, progress ---------------------- */}
      <div className={`pointer-events-none fixed inset-x-0 bottom-0 z-20 ${chromeClass}`}>
        {/* The rail sits on the edge of the screen, which on a phone is not the edge
            of the safe area: a home indicator or a rounded corner will happily take a
            10px control with it. The padding is the larger of the design value and
            whatever the device reserves, so nothing moves on hardware that reserves
            nothing. */}
        <div className="flex items-end justify-between gap-4 px-[max(1.25rem,env(safe-area-inset-left))] pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-[max(2rem,env(safe-area-inset-left))] sm:pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => setCreditsOpen(true)}
            className="pointer-events-auto cursor-pointer border-b border-transparent pb-1 font-mono text-[length:var(--micro-sm)] font-medium uppercase leading-none tracking-[var(--chrome-track)] text-paper-faint transition-colors duration-200 hover:border-pale-blue hover:text-pale-blue focus-visible:text-pale-blue"
          >
            {strings(locale).credits}
          </button>

          <div className="flex items-end gap-5 sm:gap-7">
            {/* The way back to the language screen. It prints the locale it is
                holding, which is also the only place the choice is visible once the
                reading is under way. */}
            <button
              type="button"
              onClick={openLanguage}
              aria-haspopup="dialog"
              aria-label={strings(locale).ariaLanguage.replace('{language}', activeLocale.language)}
              className="pointer-events-auto cursor-pointer border-b border-transparent pb-1 font-mono text-[length:var(--micro-sm)] font-medium uppercase leading-none tracking-[var(--chrome-track)] text-paper-faint transition-colors duration-200 hover:border-pale-blue hover:text-pale-blue focus-visible:text-pale-blue"
            >
              <span aria-hidden="true" className="hidden sm:inline">
                {strings(locale).subtitles} ·{' '}
              </span>
              <span aria-hidden="true">{activeLocale.region}</span>
            </button>

            {/* No transport before the reading starts — the gate is the only control —
                and none during exploration either: the reading is over, so there is
                nothing to pause, and replay is deliberately held back for the closing
                card so the second half stays one-way. Without this the button would
                fall through to "Resume" and do nothing, since `togglePlayback` has no
                case for the phase. Mute still covers the music, which plays on. */}
            {beforePlayback || phase === 'exploring' ? null : (
              <button
                type="button"
                onClick={togglePlayback}
                aria-label={
                  phase === 'playing'
                    ? strings(locale).ariaPause
                    : phase === 'ended'
                      ? strings(locale).ariaReplayReading
                      : strings(locale).ariaResume
                }
                className="pointer-events-auto cursor-pointer border-b border-transparent pb-1 font-mono text-[length:var(--micro-sm)] font-medium uppercase leading-none tracking-[var(--chrome-track)] text-paper-faint transition-colors duration-200 hover:border-pale-blue hover:text-pale-blue focus-visible:text-pale-blue"
              >
                {phase === 'playing'
                  ? strings(locale).pause
                  : phase === 'ended'
                    ? strings(locale).replay
                    : strings(locale).resume}
              </button>
            )}
            <button
              type="button"
              onClick={() => setMuted((value) => !value)}
              aria-pressed={muted}
              className="pointer-events-auto cursor-pointer border-b border-transparent pb-1 font-mono text-[length:var(--micro-sm)] font-medium uppercase leading-none tracking-[var(--chrome-track)] text-paper-faint transition-colors duration-200 hover:border-pale-blue hover:text-pale-blue focus-visible:text-pale-blue"
            >
              {muted ? strings(locale).unmute : strings(locale).mute}
            </button>
          </div>
        </div>

        {/* A single hairline across the foot of the screen — the whole transport. */}
        <div className="h-px w-full bg-rule">
          <div
            ref={progressRef}
            className="h-px w-full origin-left bg-pale-blue"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </div>

      {/* --- the gate ------------------------------------------------------- */}
      {gateOpen ? (
        <div
          ref={gateRef}
          className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center px-6 opacity-0"
        >
          {/* A tight pool of shade under the reticle, and nothing more. The opening
              frame is nearly black now, so the wide scrim this used to carry — sized
              for a daylit Earth — would have swallowed the very dot the frame is
              about. At the dot's position it lands under a tenth of an alpha; what it
              still does is keep the control legible where the light band crosses it. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(30% 26% at 50% 50%, rgba(5,7,12,0.78) 0%, rgba(5,7,12,0.55) 42%, rgba(5,7,12,0.18) 74%, rgba(5,7,12,0) 100%)',
            }}
          />

          <div className="relative flex flex-col items-center">
            <button
              type="button"
              onClick={handleStart}
              disabled={phase === 'loading'}
              aria-label={strings(locale).ariaPlayNarration}
              className="group pointer-events-auto flex cursor-pointer flex-col items-center outline-offset-[12px] disabled:cursor-wait"
            >
              <span className="relative grid size-[clamp(6.5rem,15vw,9.5rem)] place-items-center">
                {/* Outer reticle: a second hairline and four ticks, like an aiming ring. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-[14%] rounded-full border border-rule"
                />
                <svg
                  aria-hidden="true"
                  viewBox="0 0 100 100"
                  className="pointer-events-none absolute -inset-[14%]"
                >
                  <g style={{ stroke: 'var(--paper-faint)', strokeWidth: 0.6 }}>
                    <line x1="50" y1="0" x2="50" y2="5" />
                    <line x1="50" y1="95" x2="50" y2="100" />
                    <line x1="0" y1="50" x2="5" y2="50" />
                    <line x1="95" y1="50" x2="100" y2="50" />
                  </g>
                </svg>

                <span className="absolute inset-0 rounded-full border border-paper-dim/45 transition-[border-color,box-shadow] duration-300 group-hover:border-pale-blue group-hover:shadow-[inset_0_0_0_1px_var(--pale-blue)] group-focus-visible:border-pale-blue" />

                {phase === 'loading' ? (
                  <>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 100 100"
                      className="absolute inset-0 h-full w-full -rotate-90"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="49.5"
                        fill="none"
                        style={{
                          stroke: 'var(--pale-blue)',
                          strokeWidth: 1.2,
                          strokeDasharray: RING_CIRCUMFERENCE,
                          strokeDashoffset: RING_CIRCUMFERENCE * (1 - loadFraction),
                          transition: 'stroke-dashoffset 320ms linear',
                        }}
                      />
                    </svg>
                    <span className="font-mono text-[length:var(--micro-lg)] leading-none tracking-[0.12em] text-paper tabular-nums">
                      {loadPercent}%
                    </span>
                  </>
                ) : (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="size-[clamp(1.15rem,2.4vw,1.6rem)] translate-x-[8%] text-paper-dim transition-colors duration-300 group-hover:text-paper"
                  >
                    <path d="M4 2.2 L20 12 L4 21.8 Z" fill="currentColor" />
                  </svg>
                )}
              </span>

              <span className="mt-7 block font-mono text-[length:var(--micro-md)] font-medium uppercase leading-none tracking-[var(--chrome-track-wide)] text-paper transition-colors duration-300 group-hover:text-pale-blue">
                {phase === 'loading' ? strings(locale).loadingMaps : strings(locale).playNarration}
              </span>
              <span className="hud-label mt-3 block">Carl Sagan — 3:31</span>
            </button>

            {/* A suggestion, and set like one.
                The piece is a voice and a music bed, and both carry detail a laptop
                speaker loses — so the line is worth having. But it is not a
                requirement and nothing breaks without it, which is why it is the
                quietest step of the palette at 55% and carries no border, no rule,
                no colour and no exclamation. The icon is drawn rather than imported:
                one more dependency for two arcs and two rectangles would be a poor
                trade, and this way it inherits `currentColor` and fades with the
                text instead of sitting at its own opacity. */}
            <p className="mt-5 flex items-center justify-center gap-2 font-mono text-[length:var(--micro-xs)] leading-none tracking-[0.06em] text-paper-faint/55">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                className="size-[1.05em] shrink-0"
              >
                {/* The headband, then a cup on each side. */}
                <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
                <rect x="1.6" y="13.4" width="4.4" height="7" rx="2.2" />
                <rect x="18" y="13.4" width="4.4" height="7" rx="2.2" />
              </svg>
              {strings(locale).headphones}
            </p>

            {phase === 'idle' && !sceneReady && !sceneFailed ? (
              <p className="hud-label chrome-cap mt-6 tabular-nums">
                {strings(locale).surfaceMaps} · {loadPercent}%
              </p>
            ) : null}

            {audioError ? (
              <p
                role="alert"
                className="mt-6 max-w-[calc(34ch*var(--measure-scale))] text-center font-mono text-[length:var(--micro-md)] leading-[1.7] tracking-[0.02em] text-sunbeam"
              >
                {faultMessage(audioError, locale)}
              </p>
            ) : null}
          </div>

          {/* Attribution has to be on the first screen, not buried one click away — so
              it also has to be readable, and where it used to sit it was the worst type
              in the piece: the quietest step of the palette, stranded past the radial
              shade's fall-off, over bare sky. Moved off that gradient's edge and down
              onto the caption vignette, which is opaque enough at this height to hold
              anything, and raised a step to --paper-dim. The full licence text still
              lives in the credits sheet. */}
          <p className="absolute inset-x-0 bottom-[4.75rem] mx-auto max-w-[46rem] text-balance px-6 text-center font-mono text-[length:var(--micro-sm)] leading-[1.9] tracking-[0.02em] text-paper-dim">
            {/* The licence name is glued together here rather than written with
                non-breaking spaces in the string table: that would ask seven
                translations each to carry an invisible character correctly, and one
                of them would not have. "CC BY 4.0" split over a line break reads as
                two facts. */}
            {strings(locale).attribution.replace(/CC BY 4\.0/g, 'CC BY 4.0')}
          </p>
        </div>
      ) : null}

      {/* --- the annotation ------------------------------------------------- */}
      {/* Archival mark-up: a ring around the mote, an elbow leader off it, and a
          stencilled name — the way a plate of the era would have been marked by hand.
          It follows the planet from the frame loop, which is why the wrapper is the
          whole viewport and everything inside it is placed from the dot outward.
          Drawn after the gate so it sits over the shade rather than under it, and
          pointer-transparent throughout so it can never take a click off the reticle. */}
      {showAnnotation ? (
        <div
          ref={annotationRef}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-30 opacity-0"
        >
          {/* The mark steps back behind the language screen and comes up again with
              the play gate — at narrow widths the leader and its label cross the
              panel. A layer of its own, because the wrapper's opacity belongs to the
              entrance tween and the anchor's is written by the frame loop; this one
              is touched by nothing else, and the three simply multiply. */}
          <div
            className={`absolute inset-0 transition-opacity duration-500 ease-out ${
              languageOpen ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <div
              ref={annotationAnchorRef}
              className="absolute left-0 top-0 h-0 w-0 opacity-0 will-change-transform"
            >
              {/* Centred on the dot: the box is offset by half its size, so everything
                  inside is drawn around an origin that is the planet's own centre. */}
              <svg
                width={ANNOTATION_BOX * 2}
                height={ANNOTATION_BOX * 2}
                viewBox={`${-ANNOTATION_BOX} ${-ANNOTATION_BOX} ${ANNOTATION_BOX * 2} ${ANNOTATION_BOX * 2}`}
                className="absolute"
                style={{ left: -ANNOTATION_BOX, top: -ANNOTATION_BOX }}
                fill="none"
              >
                <defs>
                  {/* Strongest where it leaves the ring, fading as it climbs away: the
                      leader belongs to the dot, not to the label at its far end. */}
                  <linearGradient id="pbd-annotation-leader" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--paper-faint)" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="var(--paper-faint)" stopOpacity="0.85" />
                  </linearGradient>
                </defs>

                {/* Never touches the planet: annotationRingRadius keeps it outside the
                    disc at every distance, and at the far end it is the 14px floor
                    around a mote one pixel wide. */}
                <circle
                  ref={annotationRingRef}
                  cx="0"
                  cy="0"
                  r={annotationRingRadius(1)}
                  stroke="var(--paper-faint)"
                  strokeWidth="1"
                  strokeOpacity="0.6"
                />
                {/* Drawn from a ring at the origin; the loop translates the group out to
                    wherever the ring's edge currently is. */}
                <g ref={annotationLeaderRef} transform={`translate(0 ${-annotationRingRadius(1)})`}>
                  <path
                    d={`M 0 ${-LEADER_GAP} V ${-(LEADER_GAP + LEADER_RISE)} H ${-LEADER_RUN}`}
                    stroke="url(#pbd-annotation-leader)"
                    strokeWidth="1"
                  />
                </g>
              </svg>

              {/* Sits on the elbow's far end, left-aligned to it — the label reads off
                  the horizontal like a title over a rule. Running left rather than right
                  keeps it on screen: the dot opens at 73% of the width. */}
              <span
                ref={annotationLabelRef}
                className="hud-label absolute bottom-0 left-0 block whitespace-nowrap will-change-transform"
                style={{
                  transform: `translate3d(${-LEADER_RUN}px, ${-(
                    annotationRingRadius(1) +
                    LEADER_GAP +
                    LEADER_RISE +
                    LEADER_LABEL_GAP
                  )}px, 0)`,
                }}
              >
                Earth
                <span
                  ref={annotationPlateNoteRef}
                  className="transition-opacity duration-700 ease-out"
                >
                  {' · 0.12 px'}
                </span>
              </span>
            </div>
          </div>
        </div>
      ) : null}

      {/* The first screen, and the only way back to it. Always mounted: a closed
          <dialog> is inert and display:none, and keeping it in the tree lets it own
          its own entrance and exit the way the credits sheet does. */}
      <LanguageGate
        open={languageOpen}
        locale={locale}
        onSelect={handleLocaleSelect}
        onDismiss={closeLanguage}
        reducedMotion={reducedMotion}
      />

      <CreditsPanel
        open={creditsOpen}
        onClose={closeCredits}
        reducedMotion={reducedMotion}
        locale={locale}
      />
    </div>
  )
}
