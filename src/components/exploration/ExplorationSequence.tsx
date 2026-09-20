'use client'

/**
 * ExplorationSequence — the second half of the piece, and it plays itself.
 *
 * NOTHING SCROLLS AND NOTHING IS DRAGGED. The reading ends, the Earth settles into
 * the composition it was moved to, and the story that follows arrives on its own: one
 * beat fades in, holds, and dissolves into the next, in the same fixed rectangle to
 * the left of the planet, for five and a half minutes. There is no scrollport, no
 * spacer, no wheel listener and nothing for a reader to do but watch.
 *
 * That is the third transport this half has had, and the reasons are worth keeping.
 * It began as a document that scrolled, which read as a web page. It became a fixed
 * stage driven by an invisible scroll timeline, which fixed the look but still asked
 * the reader to turn a crank to make a film play. Now the crank is gone too. What is
 * left is the thing it was always trying to be — a sequence, on a clock.
 *
 * ── The clock ──────────────────────────────────────────────────────────────────
 *
 * One requestAnimationFrame loop, in this file, running only while the sequence is
 * revealed and unfinished, and cancelling itself at the end. It counts real elapsed
 * time, so the pace of the piece does not depend on the frame rate of the machine
 * playing it; a hidden tab is handled where it happens, on visibilitychange, rather
 * than by clamping every frame. Every beat's duration is in content.ts, in seconds.
 *
 * ── The fade envelope ──────────────────────────────────────────────────────────
 *
 * Every beat owns a stretch of the clock. Normalise the position inside that stretch
 * to `u` in 0..1 and the beat's whole life is described by ONE ramp, run forwards for
 * the beat arriving and backwards for the beat leaving:
 *
 *     u  0.00 ── 0.50        held, fully opaque
 *        0.50 ── 0.94        crossfading out, while the next crossfades in
 *        0.94 ── 1.00        gone; the next beat is held
 *
 * Written as one continuous clock — `t = beatIndex + u` — the opacity of beat k is
 *
 *     appear(k) = smootherstep(k - 0.50, k - 0.06, t)
 *     vanish(k) = smootherstep(k + 0.50, k + 0.94, t)
 *     opacity   = appear × (1 − vanish)
 *
 * so nearly half of every beat is a crossfade, and across the whole of it the two
 * layers are exact complements summing to 1. That is not decoration: a pair of ramps
 * on merely overlapping windows leaves a hole in the middle of every transition where
 * neither layer is legible, which reads as a blink rather than as a dissolve.
 * Complements cannot have one. A transition into a chapter opening is given a wider
 * window still, so a change of subject breathes.
 *
 * The dominant impression is opacity. A beat enters 8px low and leaves 6px high, and
 * nothing else moves — never top, left, width, height, margin or padding, so a
 * transition costs a composite and never a layout. Under prefers-reduced-motion the
 * translate is dropped entirely.
 *
 * ── Where the numbers are written ──────────────────────────────────────────────
 *
 * Opacity and transform are written straight onto the DOM inside the frame loop.
 * React is told only which THREE beats to keep mounted, and that is a state change
 * once per beat — the other few hundred frames of a beat's life cost no renders.
 *
 * ── Two stacks ─────────────────────────────────────────────────────────────────
 *
 * The words of a beat and the plate it puts on screen are exchanged on different
 * clocks, so they are rendered as two stacks:
 *
 *     text stack    one layer per mounted beat
 *     plate stack   one layer per PLATE RUN — a stretch of consecutive beats sharing
 *                   one photograph
 *
 * Chapters 03 and 06 are the reason. Four dates share one picture of the spacecraft;
 * four instructions share one picture of the record cover. The plate has to hold
 * absolutely still through all four while the words change under it, so its opacity
 * is driven from the run's first and last beat rather than from any single one, and
 * because the run is one layer with one `key`, React keeps the same <img> mounted
 * across the whole run — nothing reloads, nothing re-fades, and only the marker drawn
 * over it is exchanged.
 *
 * The price is that the plate sits outside the layer the text is in, so the text
 * layer leaves a hole of exactly the right height where the plate will be. It does
 * that by rendering the same figure again as a ghost — same width, same aspect box,
 * same caption markup, `visibility: hidden` — rather than by reserving a guessed
 * number of pixels. The two cannot drift, because they are the same component with
 * the same box. Alignment above the plate is agreed rather than measured: the plate
 * layer opens with an invisible eyebrow line, so both stacks start their figure after
 * exactly one line of `hud-label`. A media beat with a heading would break it, which
 * is why the dev block at the foot of this file refuses one.
 */

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  allBeats,
  type Beat,
  type BeatMedia,
  type Hotspot,
} from '@/lib/exploration/content'
import { beatCopy, copy } from '@/lib/exploration/copy'
import { strings } from '@/lib/ui-strings'
import { archiveGroupById, type ArchiveEntry } from '@/lib/exploration/archive'
import { creditGroupById } from '@/lib/exploration/credits-sequence'
import { sourceDescription, sourceMarkers, type SourceMarker } from '@/lib/exploration/sources'
import type { LocaleCode } from '@/lib/locales'

/* ---------------------------------------------------------------- geometry */

/**
 * The stage. One rectangle, one position, for the whole of the piece.
 *
 * It does not move between beats, between kinds of beat, or between languages. The
 * previous build raised it for plates and dropped it back for text, which bought
 * bigger photographs at the cost of 126px of visible travel every time a picture
 * arrived — the exact thing the stage exists to prevent. The rectangle is now sized
 * once, for the largest thing that has to fit in it, and everything else is placed
 * inside it.
 *
 * `top-[14vh]` down to a rail clearance of 3.5rem gives 718px at 1440×900. A square
 * plate wants roughly 460 of them once its eyebrow, caption, credit line and two
 * lines of prose are counted, which is what set the number.
 *
 * `--plate-cap` travels with the stage because both stacks have to read the same
 * value: 46vw in landscape, where the Earth's left limb is at 60.9vw and a plate may
 * never reach it, and the full column in portrait, where the planet is at the bottom
 * of the frame instead and there is no limb to clear.
 *
 * The portrait value is written as the column's own expression rather than as `100%`.
 * It looks equivalent and is not: the cap is divided by the aspect ratio to get a
 * plate's HEIGHT for `blockMinHeight`, and a percentage in a `min-height` resolves
 * against the containing block's height, not its width. On a phone that silently
 * turned a 289px-wide cap into a 670px-tall one. A length has no axis to be wrong
 * about.
 */
const STAGE =
  'absolute left-[8vw] top-[14svh] w-[min(32rem,74vw)] [--plate-cap:46vw] portrait:[--plate-cap:min(32rem,74vw)]'
const STAGE_HEIGHT = 'calc(86svh - 3.5rem)'

/**
 * Prose sits in its own box inside the stage, and plates get the whole of it.
 *
 * Both boxes are fixed and neither is ever animated. That is the point: the two kinds
 * of beat sit at two settled positions and CROSSFADE between them, rather than one
 * shared container sliding from one position to the other while the reader watches.
 * A dissolve between two things at different heights reads as an exchange; the same
 * two things joined by a moving container reads as the page lurching.
 *
 * The prose box is inset from the stage so a two-line fact is not stranded against
 * the ceiling of a box sized for a 480px photograph, and so that every text beat —
 * whatever its length — is centred on the same axis as every other one.
 */
const TEXT_BOX = 'absolute inset-x-0 top-[16%] bottom-[8%]'

/**
 * Where a beat sits inside that rectangle: centred, all of them, always.
 *
 * The first attempt pinned plate beats to the top so a run's photograph could not
 * drift, and centred everything else. It worked and it looked wrong — the Family
 * Portrait is 494×148, so its block ended 400px above the bottom of the stage and the
 * beat read as a caption stranded at the ceiling.
 *
 * Centring everything needs one guarantee: that every beat of a plate RUN has the
 * same block height, or the picture would rise and fall as the sentence under it got
 * longer. `blockMinHeight` on the box is that guarantee — one height per run, derived
 * from the run's most constrained beat, applied to both stacks. A tall plate's block
 * fills the stage exactly and centring degrades to top-alignment on its own; a short
 * one sits in the middle where it belongs.
 *
 * The picture index is the exception, and for the same reason in reverse. Its six
 * beats all print the identical line SELECTED IMAGE ARCHIVE and then a list of a
 * different length; centred, that shared line would land at six different heights and
 * dissolving one into the next would look exactly like the label jumping, which is the
 * one thing a fixed stage must never do. They are anchored to the top instead, so the
 * label holds still and only the list beneath it changes — which is also how the
 * script draws that section.
 */
const ALIGN = 'items-center'
const ALIGN_ARCHIVE = 'items-start'

/**
 * How far apart the lines of a list arrive.
 *
 * 55ms, so four lines finish inside 165ms and the six of the longest credit card
 * inside 275ms — under the 300–400ms the brief allows for a whole list. Slower than
 * that and it stops reading as information resolving and starts reading as a UI
 * animation, which is the thing it must not look like.
 */
const CREDIT_STAGGER_MS = 55

/**
 * What the rest of a media beat costs, so the plate can be given what is left.
 *
 * These are reserves, not measurements: each one is the height of a block that may
 * or may not be present, rounded up to the next comfortable step so that a body
 * running one line longer in Indonesian than in English cannot push the caption under
 * the rail. They are only ever subtracted — a plate is never made bigger by a beat
 * carrying less text than its reserve.
 */
const EYEBROW_REM = 2.375 /* one 10px eyebrow line + mt-7.  Measured: 2.375 */
const CAPTION_REM = 4.25 /*  mt-3 + three mono lines.       Measured: 3.875 */
const MARKER_REM = 2.25 /*   mt-6 + one mono line.          Measured: 2.125 */
const NOTE_REM = 6 /*        mt-8 + rule + mt-4 + two mono lines. Measured: 5.5 */

/**
 * The body is the one block whose height genuinely varies, and a flat worst-case
 * reserve for it was the single biggest reason the plates used to come out at 224px.
 * So it is counted instead of guessed.
 *
 * The wrap point is stable enough to count against: the paragraph is capped at
 * `max-w-[calc(30ch*var(--measure-scale))]` and `ch` scales with the font, so the number of characters on a line
 * is very nearly the same at 390px as at 1440px even though the type is not. 38 was
 * read off the rendered column at 1440 — three paragraphs, three exact line counts —
 * and the safety term covers a long word breaking a line early.
 *
 * Under-reserving costs more than over-reserving: the stage cannot scroll, so a
 * caption pushed past the rail is a caption nobody can read. Round up, always.
 */
const BODY_LEAD_REM = 1.5
const BODY_LINE_REM = 1.95
const BODY_GAP_REM = 0.75
const BODY_SAFETY_REM = 0.6
const BODY_CHARS_PER_LINE = 38

function bodyRem(body: string): number {
  const paragraphs = body.split('\n\n')
  let lines = 0
  for (const paragraph of paragraphs) {
    lines += Math.max(1, Math.ceil(paragraph.length / BODY_CHARS_PER_LINE))
  }
  return (
    BODY_LEAD_REM +
    lines * BODY_LINE_REM +
    (paragraphs.length - 1) * BODY_GAP_REM +
    BODY_SAFETY_REM
  )
}

/** Everything above and below the plate, in rem, for one beat. */
function furnitureRem(beat: Beat, locale: LocaleCode): number {
  const { body, note } = beatCopy(beat.id, locale)
  let total = EYEBROW_REM + CAPTION_REM
  if (beat.sourceIds && beat.sourceIds.length > 0) total += MARKER_REM
  if (body) total += bodyRem(body)
  if (note) total += NOTE_REM
  return total
}

/**
 * The widest a plate may be.
 *
 * `priority` marks the plates the script names by title — the Pale Blue Dot, the
 * Family Portrait, Voyager, the record and its cover. They get the wide cap; anything
 * added later that is not one of them keeps the narrow one, so "make the important
 * pictures bigger" does not quietly become "make everything the same size".
 */
const PLATE_WIDTH_PRIORITY = 'min(31rem, var(--plate-cap))'
const PLATE_WIDTH = 'min(27rem, 42vw)'

type PlateBox = {
  width: string
  aspectRatio: string
  /**
   * The height every beat of this run reserves for its whole block, plate and text
   * together. Both stacks are given it as a `min-height`, which is what lets the
   * stage centre a beat without the picture moving between one beat of a run and the
   * next: the block is the same size under all of them, so its centre is too.
   *
   * Derived, not measured — `height = width / ratio`, and `min(a, b) / r` is
   * `min(a/r, b/r)`, so the plate's rendered height is expressible in CSS without
   * asking the browser anything.
   */
  blockMinHeight: string
}

/**
 * One box per plate RUN, not per beat.
 *
 * Per beat, the box changed size in the middle of a run — chapter 06's four
 * instructions have bodies of different lengths, so the cover was 424px under one of
 * them and 381px under the next, and the picture the reader was told to hold still
 * quietly resized under their eyes. The run is measured by its most constrained beat
 * and every beat in it is given that answer.
 */
function runPlateBoxes(runs: RunTable, locale: LocaleCode): Map<string, PlateBox> {
  const boxes = new Map<string, PlateBox>()

  for (const run of runs.list) {
    let worst = 0
    for (let index = run.first; index <= run.last; index += 1) {
      worst = Math.max(worst, furnitureRem(allBeats[index], locale))
    }
    const media = allBeats[run.first].media
    if (!media) continue

    const maxHeight = `calc(${STAGE_HEIGHT} - ${worst.toFixed(3)}rem)`
    const ratio = media.image.width / media.image.height
    const cap = media.priority || media.large ? PLATE_WIDTH_PRIORITY : PLATE_WIDTH
    const plateHeight = `min(calc(${cap} / ${ratio.toFixed(4)}), ${maxHeight})`

    boxes.set(run.id, {
      width: `min(${cap}, calc(${maxHeight} * ${ratio.toFixed(4)}))`,
      aspectRatio: `${media.image.width} / ${media.image.height}`,
      blockMinHeight: `calc(${plateHeight} + ${worst.toFixed(3)}rem)`,
    })
  }

  return boxes
}

/* ------------------------------------------------------------------- time */

/**
 * Where each beat starts on the clock, in seconds, and how long it holds.
 *
 * Absolute seconds rather than fractions of a whole: the sequence is not a position
 * on a track any more, it is a duration, and a beat's length must not change because
 * some other chapter got longer.
 */
type Timeline = { starts: readonly number[]; spans: readonly number[]; total: number }

function timeline(): Timeline {
  const starts: number[] = []
  const spans: number[] = []
  let elapsed = 0
  for (const beat of allBeats) {
    starts.push(elapsed)
    spans.push(beat.seconds)
    elapsed += beat.seconds
  }
  return { starts, spans, total: elapsed }
}

/** Last index whose start is at or below `seconds`. Binary; the piece can grow. */
function indexAt(starts: readonly number[], seconds: number): number {
  let low = 0
  let high = starts.length - 1
  while (low < high) {
    const mid = (low + high + 1) >> 1
    if (starts[mid] <= seconds) low = mid
    else high = mid - 1
  }
  return low
}

/** The continuous clock: whole part is the beat, fraction is the way through it. */
function beatTime(t: Timeline, seconds: number): number {
  const index = indexAt(t.starts, seconds)
  const span = t.spans[index]
  const local = span > 0 ? (seconds - t.starts[index]) / span : 0
  return index + Math.min(1, Math.max(0, local))
}

/* ----------------------------------------------------------------- fading */

/**
 * ONE ramp per transition, shared by the beat leaving and the beat arriving.
 *
 * An earlier version ran two ramps on merely overlapping windows — out over
 * 0.55…0.80, in over 0.65…0.90 — and that shape has a hole in the middle of it. At
 * u = 0.725 the outgoing beat has fallen to 21.6% and the incoming one has only
 * reached 21.6%, so for a moment the brightest thing on the stage is a fifth of an
 * opacity: text at 1.37:1 against the void, which is not a crossfade, it is a blink.
 *
 * So the two ramps are complements rather than neighbours. `x` is how far through the
 * exchange the sequence is; the outgoing beat sits at `1 − x`, the incoming at `x`,
 * and they sum to exactly 1 at every instant. There is a period where both coexist —
 * that period is nearly half of every beat — and there is no instant at which the
 * stage is blank between them. The dip cannot exist by construction.
 *
 * Easing is smootherstep, `t³(t(6t − 15) + 10)`, not the smoothstep it replaced.
 * Its first AND second derivatives are zero at both ends, so a fade neither starts
 * nor stops with a detectable edge; smoothstep only flattens the first, which is
 * enough to see on a slow dissolve against black.
 *
 * A transition into a chapter opening is given a wider window than the rest. A change
 * of subject should breathe, and the extra 0.06 of a beat at each end is the
 * difference between a cut and a paragraph break.
 */
const XFADE = { start: 0.5, end: 0.94 } as const
const XFADE_CHAPTER = { start: 0.44, end: 0.96 } as const

/**
 * One credit card dissolving into the next is the single case where the long
 * crossfade hurts. Two dense lists at half opacity are not one image resolving into
 * another, they are six names printed on top of six other names, and for a second and
 * a half neither is readable. So the exchange between two credit cards is tightened:
 * each card holds longer, and the overlap is short enough to read as a change of card
 * rather than as a collision. Everything else keeps the slow dissolve.
 */
const XFADE_CREDIT = { start: 0.66, end: 0.93 } as const

/** How far past the last beat's hold the closing card is handed over. */
const END_TRIGGER = XFADE.start

/**
 * Entering from 8px below, leaving 6px above, and nothing else moves.
 *
 * Only `opacity` and `transform` are ever written — never top, left, width, height,
 * margin or padding — so a transition costs a composite and never a layout. The
 * translate is deliberately small enough to read as a direction rather than as
 * travel: opacity is doing the work, and movement that competes with it turns a
 * dissolve into a slide.
 */
const ENTER_PX = 8
const EXIT_PX = 6

/** Smootherstep: flat in both the slope and the curvature at each end. */
function ease(edge0: number, edge1: number, x: number): number {
  if (edge1 <= edge0) return x < edge0 ? 0 : 1
  const u = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return u * u * u * (u * (u * 6 - 15) + 10)
}

/**
 * The window belongs to the TRANSITION, not to either beat, which is what keeps the
 * two ramps exact complements: the beat leaving and the beat arriving must be read
 * off the same numbers or their sum drifts away from 1.
 *
 * Indexed by the outgoing beat, and widened when the beat arriving opens a chapter.
 */
function xfadeAfter(index: number): { start: number; end: number } {
  const from = allBeats[index]?.kind
  const to = allBeats[index + 1]?.kind
  if (from === 'credit' && to === 'credit') return XFADE_CREDIT
  return to === 'chapter' ? XFADE_CHAPTER : XFADE
}

/**
 * 0 → 1 as beat `index` arrives — the same ramp its predecessor is leaving on,
 * shifted back by one beat. Already 1 for the first beat at rest: `ease` clamps, and
 * t = 0 is well past the end of a window that opened below zero.
 */
function appearAt(index: number, t: number): number {
  const window = xfadeAfter(index - 1)
  return ease(index - (1 - window.start), index - (1 - window.end), t)
}

/** 0 → 1 as beat `index` leaves. Pinned to 0 for the last beat of the piece. */
function vanishAt(index: number, t: number, last: number): number {
  if (index >= last) return 0
  const window = xfadeAfter(index)
  return ease(index + window.start, index + window.end, t)
}

/* -------------------------------------------------------------- plate runs */

type Run = { id: string; first: number; last: number }
type RunTable = { list: readonly Run[]; byBeat: readonly (string | null)[] }

/**
 * A run is identified by the id of the beat that opened it, and a beat joins the open
 * run only if it says so — `persists` — and is showing the same file. That is
 * deliberately stricter than "same image": if the same photograph returned later in
 * the piece it would be a second arrival, not one plate held across a chapter of
 * text in between.
 */
function plateRuns(): RunTable {
  const list: Run[] = []
  const byBeat: (string | null)[] = []
  let open: Run | null = null
  let openSrc: string | null = null

  allBeats.forEach((beat, index) => {
    const src = beat.media?.image.src ?? null
    if (src === null) {
      open = null
      openSrc = null
    } else if (beat.media?.persists === true && open !== null && openSrc === src) {
      open.last = index
    } else {
      open = { id: beat.id, first: index, last: index }
      openSrc = src
      list.push(open)
    }
    byBeat.push(open?.id ?? null)
  })

  return { list, byBeat }
}

/* -------------------------------------------------------------- text stack */

function BeatBody({
  beat,
  locale,
  box,
  onOpenCredits,
}: {
  beat: Beat
  locale: LocaleCode
  box: PlateBox | null
  onOpenCredits?: () => void
}) {
  const { eyebrow, heading, body, note } = beatCopy(beat.id, locale)
  const display = beat.kind === 'chapter' || beat.kind === 'ending'
  const markers = sourceMarkers(beat.sourceIds)

  if (beat.kind === 'archive') return <ArchiveBody beat={beat} locale={locale} markers={markers} />
  if (beat.kind === 'credit')
    return <CreditBody beat={beat} locale={locale} onOpenCredits={onOpenCredits} />

  return (
    <div style={box ? { minHeight: box.blockMinHeight } : undefined}>
      {/* A media beat always prints this line even if its copy has no eyebrow: it
          is what the plate stack aligns its own figure against, and a missing line
          would drop the plate 10px onto the words. */}
      {eyebrow || box ? <p className="hud-label">{eyebrow ? eyebrow : <>&nbsp;</>}</p> : null}

      {heading ? (
        <h2
          className={`mt-5 font-serif font-light tracking-[-0.015em] text-paper ${
            display
              ? 'text-[calc(clamp(2.1rem,4.4vw,3.4rem)*var(--display-scale))] leading-[1.06]'
              : 'text-[clamp(1.45rem,2.6vw,2.05rem)] leading-[1.18]'
          }`}
        >
          {heading.split('\n').map((line, index) => (
            <Fragment key={index}>
              {index > 0 ? <br /> : null}
              {line}
            </Fragment>
          ))}
        </h2>
      ) : null}

      {/* The hole the plate stack draws into, and — because that hole is
          `visibility: hidden` and the plate itself lives in an `aria-hidden` layer —
          the only route the photograph has to a screen reader. Without this block a
          reader using assistive technology would be told a beat consists of an
          eyebrow and a caveat, and never that there is a picture on it at all. */}
      {beat.media && box ? (
        <>
          <PlateFigure media={beat.media} box={box} ghost />
          <p className="sr-only">
            {beatCopy(beat.id, locale).mediaAlt ?? beat.media.image.alt} {beat.media.image.title}.{' '}
            {strings(locale).creditPrefix}: {beat.media.image.credit}.
          </p>
        </>
      ) : null}

      {body
        ? body.split('\n\n').map((paragraph, index) => (
            <p
              key={index}
              className={`${
                index === 0 ? 'mt-6' : 'mt-3'
              } max-w-[calc(30ch*var(--measure-scale))] font-serif text-[clamp(1.05rem,1.5vw,1.3rem)] font-light leading-[1.5] text-paper-dim`}
            >
              {paragraph}
            </p>
          ))
        : null}

      {beat.id === CARTER_BEAT ? <CarterTranslation locale={locale} /> : null}

      {note ? (
        <>
          <div className="mt-8 h-px w-24 bg-rule" />
          <p className="mt-4 max-w-[calc(34ch*var(--measure-scale))] font-mono text-[length:var(--micro-md)] leading-[1.8] tracking-[0.02em] text-paper-faint">
            {note}
          </p>
        </>
      ) : null}

      {markers.length > 0 ? <SourceLine markers={markers} /> : null}
    </div>
  )
}

/**
 * The one beat in the piece whose heading is a quotation, and therefore the one beat
 * that is not translated in place.
 */
const CARTER_BEAT = 'end-quote'

/**
 * Jimmy Carter's line, given to the reader in their own language.
 *
 * The quotation above it stays in the English he wrote it in — a translated quotation
 * set in quotation marks is no longer a quotation, it is a paraphrase wearing one.
 * So the translation arrives underneath instead, behind its own label, unquoted, in a
 * dimmer and slightly smaller setting, off a rule: three signals that it is the piece
 * speaking about the words rather than Carter speaking them.
 *
 * English renders nothing here. `carterTranslation` is null for `en`, and a
 * translation of English into English is not a thing a reader needs.
 */
function CarterTranslation({ locale }: { locale: LocaleCode }) {
  const { carterTranslation, carterTranslationLabel } = strings(locale)
  if (!carterTranslation) return null

  return (
    <div className="mt-7 max-w-[calc(32ch*var(--measure-scale))] border-l border-rule pl-4">
      <p className="hud-label chrome-cap">{carterTranslationLabel}</p>
      {/* No quotation marks. The original above already carries them, and a second
          pair would put two sets around one sentence — and would have to guess
          between “ ” and 「 」 depending on the language. */}
      <p className="mt-3 font-serif text-[clamp(0.98rem,1.35vw,1.16rem)] font-light leading-[1.55] text-paper-dim">
        {carterTranslation}
      </p>
    </div>
  )
}

/**
 * Who says so, printed: `NASA / JPL [01][04]`.
 *
 * The bare `[01]` this replaced was a citation the reader could not read — the
 * publisher and the title were in a screen-reader-only span, so a sighted reader was
 * asked to take the claim on trust and go looking for a table that is not on screen.
 * The label answers the question most readers actually have, and the number stays for
 * anyone who wants the exact page.
 */
function SourceLine({ markers }: { markers: readonly SourceMarker[] }) {
  return (
    <p className="hud-label mt-6">
      {markers.map((marker, index) => (
        <span key={marker.label} className={index > 0 ? 'ml-3' : undefined}>
          {marker.label} {marker.ids.map((id) => `[${id}]`).join('')}
          <span className="sr-only normal-case">
            {' — '}
            {marker.sources.map(sourceDescription).join('; ')}.
          </span>
        </span>
      ))}
    </p>
  )
}

/* ------------------------------------------------------------ archive index */

/** 'Image Credit: Jon Lomberg' → 'JON LOMBERG'. The full line stays for the reader. */
function creditStamp(entry: ArchiveEntry, locale: LocaleCode): string {
  if (entry.credit === 'NOT_PRINTED') {
    return strings(locale).creditNotPrinted
  }
  return entry.credit.replace(/^Image Credit:\s*/i, '')
}

/**
 * One group of the Golden Record picture index.
 *
 * Set as an index rather than as a gallery, because that is what it honestly is: no
 * frame in it is reproduced. NASA's title on the left, the credit NASA prints on the
 * right, and the whole row is a link to NASA's own page for that frame. A reader who
 * wants the picture is one click from the publisher, which is the opposite of taking
 * it — and there is no empty image box standing in for a file that was never fetched.
 *
 * The names arrive one after another rather than as a block. `data-cascade` is set by
 * the scroll handler the moment this layer becomes visible, and globals.css runs the
 * rows in on a 45ms stagger from there; under prefers-reduced-motion the same rule is
 * clamped to nothing and forty names simply appear.
 */
function ArchiveBody({
  beat,
  locale,
  markers,
}: {
  beat: Beat
  locale: LocaleCode
  markers: readonly SourceMarker[]
}) {
  const group = archiveGroupById(beat.archiveGroupId ?? '')
  if (!group) return null

  return (
    <div>
      <p className="hud-label chrome-cap">{strings(locale).archiveLabel}</p>

      <h2 className="mt-4 font-serif text-[clamp(1.35rem,2.4vw,1.9rem)] font-light leading-[1.15] tracking-[-0.015em] text-paper">
        {group.title}
      </h2>

      {/* Two columns of four. The frames are 4:3 and the column is 512px, so each one
          lands at about 248px — a picture rather than a thumbnail, with room under it
          for NASA's title and for the name of whoever owns it.

          `published` is a filter, not a note. It was declared on every entry and read
          only by the dev-time assertions at the foot of archive.ts, which meant a
          frame could be marked unpublished and still be reproduced — the one state a
          rights flag must never be able to reach. Withdrawing a frame is now the
          one-line data edit the deployment report says it is. */}
      <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
        {group.entries.filter((entry) => entry.published).map((entry, index) => (
          <li
            key={entry.src}
            className="archive-row"
            style={{ transitionDelay: `${index * CREDIT_STAGGER_MS}ms` }}
          >
            <a
              href={entry.href}
              target="_blank"
              rel="noreferrer noopener"
              className="group/frame pointer-events-auto block outline-offset-4"
            >
              <div className="border border-rule bg-void-lift/40">
                {/* Not next/image: already converted, already at the size it is shown
                    at, served from /public. Intrinsic width and height so the frame is
                    reserved before the bytes land; lazy so a chapter away is never
                    fetched. The scan is never cropped — several of these carry the
                    rights holder's name burned into the left edge, and that stripe is
                    the credit. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={entry.src}
                  alt={entry.alt || entry.title}
                  width={entry.width}
                  height={entry.height}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full opacity-90 transition-opacity duration-300 group-hover/frame:opacity-100"
                />
              </div>

              <span className="mt-2 block font-serif text-[0.88rem] leading-[1.3] text-paper-dim transition-colors duration-200 group-hover/frame:text-pale-blue group-focus-visible/frame:text-pale-blue">
                {entry.title}
              </span>

              {/* The credit, printed under every frame without exception. Not
                  abbreviated to fit: shortening an attribution to make a layout work
                  is editing an attribution. */}
              <span className="mt-1 block font-mono text-[length:var(--micro-2xs)] uppercase leading-[1.6] tracking-[0.1em] text-paper-faint">
                {creditStamp(entry, locale)}
                <span aria-hidden="true"> ↗</span>
              </span>

              <span className="sr-only normal-case">
                {' — '}
                {strings(locale).archiveLinkLabel}
                {entry.credit === 'NOT_PRINTED' ? '' : `. ${entry.credit}`}.
              </span>
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-4 max-w-[calc(38ch*var(--measure-scale))] font-mono text-[length:var(--micro-xs)] leading-[1.6] tracking-[0.02em] text-paper-faint">
        {strings(locale).archiveNote}
      </p>

      {markers.length > 0 ? <SourceLine markers={markers} /> : null}
    </div>
  )
}

/**
 * One credit card.
 *
 * Set as a list of names rather than as prose, and restrained on purpose: a credit
 * that is styled becomes a design, and the only thing being asked of the reader here
 * is to read a name. No vertical roll, no scale, no wall of licence text — the wall
 * exists, and it is one click away in the attribution sheet, which is where a wall
 * belongs.
 *
 * The last card carries the way into that sheet. It reuses the panel the bottom rail
 * has always opened, so there is one detailed view rather than two that can drift.
 */
function CreditBody({
  beat,
  locale,
  onOpenCredits,
}: {
  beat: Beat
  locale: LocaleCode
  onOpenCredits?: () => void
}) {
  const group = creditGroupById(beat.creditGroupId ?? '')
  if (!group) return null

  const isRecord = group.id === 'record'
  const isLast = group.id === 'software'

  return (
    <div>
      <p className="hud-label chrome-cap">{strings(locale)[group.labelKey]}</p>

      <ul className="mt-6 space-y-4">
        {group.lines.map((line, index) => (
          <li
            key={`${line.name}-${index}`}
            className="archive-row"
            style={{ transitionDelay: `${index * CREDIT_STAGGER_MS}ms` }}
          >
            <p className="font-serif text-[clamp(1.05rem,1.6vw,1.35rem)] font-light leading-[1.3] text-paper">
              {line.name}
            </p>
            {line.work ? (
              <p className="mt-1 font-mono text-[length:var(--micro-sm)] uppercase leading-[1.6] tracking-[0.1em] text-paper-dim">
                {line.work}
              </p>
            ) : null}
            {line.status ? (
              <p className="mt-0.5 font-mono text-[length:var(--micro-sm)] uppercase leading-[1.6] tracking-[0.1em] text-paper-faint">
                {line.status}
              </p>
            ) : null}
          </li>
        ))}
      </ul>

      {isRecord ? (
        <p className="mt-6 max-w-[calc(40ch*var(--measure-scale))] font-mono text-[length:var(--micro-xs)] leading-[1.7] tracking-[0.02em] text-paper-faint">
          {strings(locale).recordNotice}
        </p>
      ) : null}

      {isLast && onOpenCredits ? (
        <button
          type="button"
          onClick={onOpenCredits}
          className="pointer-events-auto mt-7 cursor-pointer border-b border-paper-faint/40 pb-1 font-mono text-[length:var(--micro-sm)] font-medium uppercase leading-none tracking-[0.2em] text-paper-faint transition-colors duration-200 hover:border-pale-blue hover:text-pale-blue focus-visible:border-pale-blue focus-visible:text-pale-blue"
        >
          {strings(locale).fullCredits}
          <span aria-hidden="true"> ↗</span>
        </button>
      ) : null}
    </div>
  )
}

/* ------------------------------------------------------------- plate stack */

type Mark = { beatIndex: number; hotspot: Hotspot }

type PlateFigureProps = {
  media: BeatMedia
  box: PlateBox
  alt?: string
  marks?: readonly Mark[]
  registerMark?: (index: number, node: SVGSVGElement | null) => void
  /** Rendered for its height only, inside the text layer. Draws nothing. */
  ghost?: true
}

/**
 * The plate itself, and the only place its box is decided — the ghost the text layer
 * reserves space with is this same component, so the hole and the thing that fills it
 * cannot disagree.
 *
 * The hairline frame is not decoration: `loading="lazy"` means the file is requested
 * when the beat arrives, so for one moment there is a correctly sized empty box on
 * screen. A framed empty box reads as a plate that has not been mounted yet; an
 * unframed one reads as a bug.
 */
function PlateFigure({ media, box, alt, marks, registerMark, ghost }: PlateFigureProps) {
  return (
    <figure aria-hidden={ghost} className={`mt-7 ${ghost ? 'invisible' : ''}`}>
      {/* The width is on the frame, not on the figure: a caption set to the width of
          a small plate is a caption three characters wide. */}
      <div className="relative border border-rule bg-void-lift/40" style={{ width: box.width }}>
        {ghost ? (
          <div style={{ aspectRatio: box.aspectRatio }} />
        ) : (
          <>
            {/* Not next/image: these plates are already converted, already at the
                size they are shown at, and served from /public — an optimiser pass
                would re-encode a 25 KB webp into another 25 KB webp. What the
                component is used for is here by hand: intrinsic width and height so
                the frame is reserved before the bytes land, lazy so a plate eight
                chapters away is never fetched, async so decoding cannot block the
                beat it belongs to. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={media.image.src}
              alt={alt ?? media.image.alt}
              width={media.image.width}
              height={media.image.height}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full"
            />
            {marks?.map((mark) => (
              <HotspotMark
                key={mark.beatIndex}
                hotspot={mark.hotspot}
                register={(node) => registerMark?.(mark.beatIndex, node)}
              />
            ))}
          </>
        )}
      </div>
      <PlateCaption media={media} />
    </figure>
  )
}

/**
 * Title, designation, credit — three lines, because the caption of an archive plate
 * is three separate facts and setting them as one wrapped sentence makes the credit
 * look like part of the title.
 */
function PlateCaption({ media }: { media: BeatMedia }) {
  const [title, ...rest] = media.note.split(' / ').map((part) => part.trim())

  return (
    <figcaption className="mt-3 max-w-[calc(34ch*var(--measure-scale))]">
      <span className="hud-key block">{title}</span>
      {rest.map((line, index) => (
        <span
          key={index}
          className="mt-1 block font-mono text-[length:var(--micro-sm)] uppercase leading-[1.5] tracking-[0.1em] text-paper-faint"
        >
          {line}
        </span>
      ))}
      <span className="sr-only normal-case">
        {media.image.title}. Credit: {media.image.credit}.
      </span>
    </figcaption>
  )
}

/* ---------------------------------------------------------------- hotspots */

/**
 * One marker on one plate: a ring around the point, a short rule out of it, and a
 * micro label at the end of the rule.
 *
 * A ring rather than a dot because on the Pale Blue Dot the point being marked IS the
 * subject — 0.12 pixel of Earth — and anything filled would cover the thing the
 * reader came to see. The rule is a stub, not a leader running to the edge of the
 * frame: a line drawn across a photograph to reach a label in the margin annotates
 * the photograph, and the brief for these beats is to point at the cover, not to
 * redraw it.
 *
 * Geometry is in CSS pixels, positioned by percentages of the plate's own box, so
 * nothing here scales with the plate — the ring stays a ring and the label stays 9px
 * on a plate of any size. Both are drawn twice, void underneath and pale blue on top,
 * so the marker reads over gold as well as over black.
 */
const HOTSPOT_RADIUS = 6
const HOTSPOT_STUB = 22
const HOTSPOT_GAP = 3
const HOTSPOT_LABEL_GAP = 7
/** Past this, the marker reaches back into the plate instead of on across it. */
const HOTSPOT_FLIP_PCT = 60
const HOTSPOT_HALF_W = 90
const HOTSPOT_HALF_H = 20
const HOTSPOT_HALO = 'rgba(5, 7, 12, 0.85)'

function HotspotMark({
  hotspot,
  register,
}: {
  hotspot: Hotspot
  register: (node: SVGSVGElement | null) => void
}) {
  const toLeft = hotspot.xPct > HOTSPOT_FLIP_PCT
  const direction = toLeft ? -1 : 1

  const stubNear = direction * (HOTSPOT_RADIUS + HOTSPOT_GAP)
  const stubFar = direction * (HOTSPOT_RADIUS + HOTSPOT_GAP + HOTSPOT_STUB)
  const labelX = stubFar + direction * HOTSPOT_LABEL_GAP

  return (
    <svg
      ref={register}
      aria-hidden="true"
      width={HOTSPOT_HALF_W * 2}
      height={HOTSPOT_HALF_H * 2}
      viewBox={`${-HOTSPOT_HALF_W} ${-HOTSPOT_HALF_H} ${HOTSPOT_HALF_W * 2} ${HOTSPOT_HALF_H * 2}`}
      className="pointer-events-none absolute"
      style={{
        left: `calc(${hotspot.xPct}% - ${HOTSPOT_HALF_W}px)`,
        top: `calc(${hotspot.yPct}% - ${HOTSPOT_HALF_H}px)`,
        overflow: 'visible',
        opacity: 0,
      }}
    >
      <circle r={HOTSPOT_RADIUS} fill="none" stroke={HOTSPOT_HALO} strokeWidth={3} />
      <line x1={stubNear} y1={0} x2={stubFar} y2={0} stroke={HOTSPOT_HALO} strokeWidth={3} />
      <circle r={HOTSPOT_RADIUS} fill="none" stroke="var(--pale-blue)" strokeWidth={1} />
      <line x1={stubNear} y1={0} x2={stubFar} y2={0} stroke="var(--pale-blue)" strokeWidth={1} />
      <text
        x={labelX}
        y={0}
        dy="0.32em"
        textAnchor={toLeft ? 'end' : 'start'}
        fill="var(--paper)"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          fontWeight: 500,
          letterSpacing: '0.18em',
          paintOrder: 'stroke',
          stroke: HOTSPOT_HALO,
          strokeWidth: 3,
          strokeLinejoin: 'round',
        }}
      >
        {hotspot.label}
      </text>
    </svg>
  )
}

/* ------------------------------------------------------------------ scroll */

export type ExplorationSequenceProps = {
  locale: LocaleCode
  /** Fired once, when the sequence runs past the end of its last beat. */
  onReachEnd?: () => void
  /** The parent's cue that the Earth has arrived and the sequence may begin. */
  revealed: boolean
  /** Opens the full attribution sheet — the same one the bottom rail opens. */
  onOpenCredits?: () => void
}

export default function ExplorationSequence({
  locale,
  onReachEnd,
  revealed,
  onOpenCredits,
}: ExplorationSequenceProps) {
  /**
   * `active` is the only thing React renders off. It is `floor(t)`, so it changes
   * once per beat — three layers are mounted around it, and every opacity between
   * those changes is written straight to the DOM.
   */
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)

  /** Seconds of sequence played. Accumulated from frame deltas, never from a clock. */
  const elapsedRef = useRef(0)
  const finishedRef = useRef(false)

  const onReachEndRef = useRef(onReachEnd)
  useEffect(() => {
    onReachEndRef.current = onReachEnd
  }, [onReachEnd])

  const time = useMemo(() => timeline(), [])
  const runs = useMemo(() => plateRuns(), [])
  const boxes = useMemo(() => runPlateBoxes(runs, locale), [runs, locale])

  /** Live registries the frame writer walks. Refs, so React never re-renders for them. */
  const textNodes = useRef(new Map<number, HTMLDivElement>())
  const plateNodes = useRef(new Map<string, HTMLDivElement>())
  const markNodes = useRef(new Map<number, SVGSVGElement>())
  const ariaState = useRef(new Map<Element, boolean>())

  /**
   * A style written by hand is not CSS, so the `!important` clamp in globals.css
   * cannot reach an inline transform. The preference is read here and the translate
   * is simply not applied.
   */
  const reducedRef = useRef(false)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedRef.current = query.matches
    const onChange = () => {
      reducedRef.current = query.matches
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const lastIndex = allBeats.length - 1

  /**
   * The frame writer. Everything visible is decided here, from one number: how many
   * seconds of the sequence have played.
   */
  const paint = useCallback(
    (seconds: number) => {
      const t = beatTime(time, seconds)
      const reduced = reducedRef.current

      for (const [index, node] of textNodes.current) {
        const appear = appearAt(index, t)
        const vanish = vanishAt(index, t, lastIndex)
        const opacity = appear * (1 - vanish)
        node.style.opacity = opacity.toFixed(4)
        node.style.visibility = opacity < 0.002 ? 'hidden' : 'visible'
        node.style.transform = reduced
          ? 'none'
          : `translate3d(0, ${((1 - appear) * ENTER_PX - vanish * EXIT_PX).toFixed(2)}px, 0)`

        // The cascade in the picture archive starts when the layer is actually seen,
        // not when React mounted it most of a beat earlier.
        const shown = opacity > 0.02
        if ((node.dataset.cascade === 'on') !== shown) {
          node.dataset.cascade = shown ? 'on' : 'off'
        }

        // Promote only what is mid-transition. A layer that is fully in or fully out
        // is a static element and does not need a compositor layer of its own; three
        // dozen permanently promoted layers is how a piece like this runs out of
        // texture memory on a phone.
        const moving = opacity > 0.002 && opacity < 0.998
        const willChange = moving ? 'opacity, transform' : 'auto'
        if (node.style.willChange !== willChange) node.style.willChange = willChange

        // One layer at a time is the one being read. Announcing two half-faded beats
        // to a screen reader would be worse than announcing none.
        const hidden = opacity < 0.5
        if (ariaState.current.get(node) !== hidden) {
          ariaState.current.set(node, hidden)
          node.setAttribute('aria-hidden', hidden ? 'true' : 'false')
        }
      }

      for (const [runId, node] of plateNodes.current) {
        const run = runs.list.find((candidate) => candidate.id === runId)
        if (!run) continue
        const opacity = appearAt(run.first, t) * (1 - vanishAt(run.last, t, lastIndex))
        node.style.opacity = opacity.toFixed(4)
        node.style.visibility = opacity < 0.002 ? 'hidden' : 'visible'
      }

      // A marker belongs to one beat inside a run, so it rides that beat's own curve —
      // which is what exchanges the four regions of the record cover without the plate
      // underneath them moving at all.
      for (const [index, node] of markNodes.current) {
        const opacity = appearAt(index, t) * (1 - vanishAt(index, t, lastIndex))
        node.style.opacity = opacity.toFixed(4)
      }

      const next = Math.min(lastIndex, Math.floor(t))
      if (next !== activeRef.current) {
        activeRef.current = next
        setActive(next)
      }

      if (!finishedRef.current && t >= lastIndex + END_TRIGGER) {
        finishedRef.current = true
        onReachEndRef.current?.()
      }
    },
    [lastIndex, runs, time],
  )

  /**
   * The clock.
   *
   * Real elapsed time, accumulated from frame timestamps. The distinction matters
   * more than it looks: an earlier version clamped every delta to 100ms so that a
   * backgrounded tab could not skip ahead, which quietly tied the pace of the whole
   * piece to the frame rate. On a machine rendering the Earth at 1.3fps that made
   * 1.3 × 0.1 = 0.13 seconds of story per second of real time, and a five-minute
   * sequence became forty. A film does not run slower on a slower projector.
   *
   * So the delta is counted honestly, and the two things the clamp was really for are
   * handled where they actually happen:
   *
   *   - A hidden tab gets no frames at all, and `visibilitychange` resets the mark so
   *     the first frame back counts nothing rather than the whole absence.
   *   - A pathological stall — a long GC, a laptop lid — is bounded at two seconds,
   *     which is one beat's crossfade and no more.
   *
   * It stops itself at the end rather than idling for as long as the closing card is
   * up.
   */
  useEffect(() => {
    if (!revealed) return
    let frame = 0
    let previous = 0

    const onVisibility = () => {
      if (document.hidden) previous = 0
    }
    document.addEventListener('visibilitychange', onVisibility)

    const step = (now: number) => {
      const delta = previous === 0 ? 0 : Math.min(2, (now - previous) / 1000)
      previous = now
      if (!finishedRef.current) elapsedRef.current += delta
      paint(elapsedRef.current)
      if (!finishedRef.current) frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [revealed, paint])

  // Layers arrive and leave as `active` moves; paint them before the browser does, so
  // a newly mounted layer is never seen at the opacity its markup was born with.
  useEffect(() => {
    paint(elapsedRef.current)
  }, [active, paint])

  /**
   * Decode what is about to be needed, and nothing else.
   *
   * `loading="lazy"` fetches a plate when its beat mounts, which is most of a beat
   * before it is seen — but the DECODE still happens on the first frame it is painted,
   * and a 480px WebP decoded inside a frame is a visible hitch at exactly the moment
   * the crossfade is supposed to be smoothest. Decoding it in advance moves that cost
   * off the transition.
   *
   * Two beats ahead, no further. This component only exists after the narration has
   * finished, so nothing here competes with the reading or the Earth for bandwidth,
   * and the forty archive frames are never fetched as a set — only the group that is
   * next.
   */
  const decoded = useRef(new Set<string>())
  useEffect(() => {
    const wanted: string[] = []
    for (let index = active; index <= Math.min(lastIndex, active + 2); index += 1) {
      const beat = allBeats[index]
      if (beat.media) wanted.push(beat.media.image.src)
      if (beat.kind === 'archive' && beat.archiveGroupId) {
        const group = archiveGroupById(beat.archiveGroupId)
        for (const entry of group?.entries ?? []) wanted.push(entry.src)
      }
    }
    for (const src of wanted) {
      if (decoded.current.has(src)) continue
      decoded.current.add(src)
      const image = new Image()
      image.src = src
      // Failure here is not an error worth surfacing: the <img> will fetch it again.
      void image.decode?.().catch(() => undefined)
    }
  }, [active, lastIndex])

  if (allBeats.length === 0) return null

  /**
   * Three beats, always. A beat is visible for t ∈ (k − 0.45, k + 0.90), so at any
   * moment the only ones that can be on screen are `active − 1`, `active` and
   * `active + 1`. Mounting the other thirty-eight costs nothing and buys nothing.
   */
  const mounted: number[] = []
  for (let index = active - 1; index <= active + 1; index += 1) {
    if (index >= 0 && index <= lastIndex) mounted.push(index)
  }

  /** A run is on screen if any part of it overlaps the mounted window. */
  const mountedRuns = runs.list.filter((run) => run.first <= active + 1 && run.last >= active - 1)

  return (
    // Nothing here takes a pointer except the archive's links, which opt back in.
    // There is no scrollport any more, so there is nothing to focus and nothing to
    // drag; `inert` keeps the links out of the tab order until the sequence opens.
    <div className="pointer-events-none fixed inset-0 z-10" inert={!revealed}>
      {/* `lang` because the prose inside is whatever the reader chose while the
          document is English. Without it a screen reader pronounces "menoleh
          kembali" with English phonology, and "私たちは" not at all. It is also what
          :lang(ja) in globals.css hangs the Japanese font stack off. */}
      <div
        aria-live="polite"
        lang={locale}
        className={`${STAGE} transition-opacity duration-[1200ms] ease-out ${
          revealed ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ height: STAGE_HEIGHT }}
      >
        {/* The plate stack, under the words, in its own box so its layers reconcile
            against each other and never against the text. Keyed by run: that is the
            whole mechanism by which one photograph holds still across four beats. */}
        {mountedRuns.map((run) => {
          const opener = allBeats[run.first]
          const box = boxes.get(run.id)
          if (!opener.media || !box) return null

          const marks: Mark[] = []
          for (let index = run.first; index <= run.last; index += 1) {
            const hotspot = allBeats[index].hotspot
            if (hotspot) marks.push({ beatIndex: index, hotspot })
          }

          return (
            <div
              key={run.id}
              ref={(node) => {
                if (node) plateNodes.current.set(run.id, node)
                else plateNodes.current.delete(run.id)
              }}
              aria-hidden="true"
              className={`absolute inset-0 z-0 flex ${ALIGN}`}
              style={{ opacity: 0, visibility: 'hidden' }}
            >
              <div style={{ minHeight: box.blockMinHeight }}>
                {/* The eyebrow the text layer is printing at this moment, kept as an
                    empty line so both stacks start their figure at the same y. */}
                <p aria-hidden="true" className="hud-label invisible">
                  &nbsp;
                </p>
                <PlateFigure
                  media={opener.media}
                  box={box}
                  alt={beatCopy(opener.id, locale).mediaAlt ?? opener.media.image.alt}
                  marks={marks}
                  registerMark={(index, node) => {
                    if (node) markNodes.current.set(index, node)
                    else markNodes.current.delete(index)
                  }}
                />
              </div>
            </div>
          )
        })}

        {/* The text stack. */}
        {mounted.map((index) => {
          const beat = allBeats[index]
          const runId = runs.byBeat[index]
          const box = runId ? (boxes.get(runId) ?? null) : null

          return (
            <div
              key={beat.id}
              ref={(node) => {
                if (node) {
                  textNodes.current.set(index, node)
                  return
                }
                // React calls this with null on unmount, so the node has to be
                // recovered from the registry before it is dropped — deleting by
                // `null` would leave every detached layer in `ariaState` forever.
                const previous = textNodes.current.get(index)
                if (previous) ariaState.current.delete(previous)
                textNodes.current.delete(index)
              }}
              className={`z-10 flex ${
                beat.media
                  ? `absolute inset-0 ${ALIGN}`
                  : beat.kind === 'archive'
                    ? `absolute inset-0 ${ALIGN_ARCHIVE}`
                    : `${TEXT_BOX} ${ALIGN}`
              }`}
              style={{ opacity: 0, visibility: 'hidden' }}
            >
              <BeatBody beat={beat} locale={locale} box={box} onOpenCredits={onOpenCredits} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * The plate stack aligns itself to the text stack by agreement rather than by
 * measurement — one eyebrow line, then the figure — so a media beat that acquired a
 * heading in one language would put its plate 60px below its own hole, in that
 * language only. An archive beat that acquired a plate would have the same problem
 * from the other side. Cheaper to fail here than to find in a screenshot.
 * Development only; none of it ships.
 */
if (process.env.NODE_ENV !== 'production') {
  for (const beat of allBeats) {
    if (beat.media) {
      for (const table of Object.values(copy)) {
        if (table[beat.id]?.heading) {
          throw new Error(
            `Beat "${beat.id}" carries a plate and a heading; the plate stack can only align under a single eyebrow line.`,
          )
        }
      }
    }
    if (beat.kind === 'archive') {
      if (!beat.archiveGroupId) {
        throw new Error(`Archive beat "${beat.id}" names no group`)
      }
      if (!archiveGroupById(beat.archiveGroupId)) {
        throw new Error(`Archive beat "${beat.id}" names group "${beat.archiveGroupId}", which does not exist`)
      }
      if (beat.media) {
        throw new Error(`Archive beat "${beat.id}" carries a plate; the index publishes names, not pictures.`)
      }
    }
  }
}
