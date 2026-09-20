# Pale Blue Dot

An interactive reading of Carl Sagan's *Pale Blue Dot*, built around the photograph
Voyager 1 took on 14 February 1990 from about six billion kilometres away.

The piece has two halves. In the first, Sagan's recorded voice plays over a WebGL Earth
while the camera closes the distance from a single point of light to a turning planet;
bilingual captions sit under the reading. In the second, the reading gives way to an
eight-chapter factual sequence that plays itself — no scrolling — covering the
photograph, the Voyager mission, the Golden Record, and what was sent with it.

It is a **non-commercial, educational portfolio work**. It is not affiliated with, and
not endorsed by, any of the rights holders credited below.

---

## Table of contents

- [What it does](#what-it-does)
- [Technology](#technology)
- [Requirements](#requirements)
- [Installation](#installation)
- [Development](#development)
- [Production build](#production-build)
- [Deployment](#deployment)
- [Project structure](#project-structure)
- [How the piece is built](#how-the-piece-is-built)
- [Localisation](#localisation)
- [Accessibility](#accessibility)
- [Content and rights](#content-and-rights)
- [Credits](#credits)
- [Licence](#licence)

---

## What it does

| | |
|---|---|
| Narration | 3 min 31 s, Carl Sagan reading *Pale Blue Dot* (1994) |
| Captions | English always on screen, with the reader's language beneath it |
| Exploration | 52 beats across 8 chapters, 459 s, plays itself on a clock |
| Languages | 9 — English, Indonesian, Spanish, French, German, Brazilian Portuguese, Japanese, Simplified Chinese, Korean |
| Earth | Real-time WebGL sphere: day map, night lights, clouds, specular and normal maps |
| Archive | 40 Golden Record frames, each with the credit NASA prints for it |
| Credits | A full attribution sheet, and a cinematic credit roll inside the ending |

Keyboard: <kbd>Space</kbd> or <kbd>K</kbd> play/pause · <kbd>M</kbd> mute ·
<kbd>C</kbd> credits · <kbd>↑</kbd><kbd>↓</kbd> move in the language screen.

---

## Technology

| | |
|---|---|
| Framework | Next.js 16.3.4 (App Router, Turbopack) |
| UI | React 19.2.8, TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 (CSS-first configuration) |
| 3D | three.js 0.185.1 |
| Animation | GSAP 3.15.0 |
| Type | Newsreader (serif) and JetBrains Mono, via `next/font` |
| Images | Pre-converted WebP; `sharp` is used offline, not at runtime |

The app is a **single static route**. There is no database, no API, no authentication
and no server-side state — `next build` prerenders `/` and everything after that is
client-side.

---

## Requirements

- **Node.js 20 or newer.** Next 16 will not run on older releases. Node 22 LTS is what
  this project is developed and deployed against.
- npm 10+ (or any package manager; the lockfile is npm's).
- A browser with **WebGL 2**. Without it the piece degrades to audio and captions and
  says so on screen rather than failing silently.

---

## Installation

```bash
git clone <repository-url> pale-blue-dot
cd pale-blue-dot
npm install
```

`npm install` pulls `sharp`, which downloads a platform-specific binary. On a machine
without network access to that binary, install with `--ignore-scripts` — nothing at
runtime needs it.

### Media assets

`public/` carries about 34 MB that the repository ships with the code:

```
public/audio/      sagan-vocals.mp3, aurora.mp3, earth-bretbernhoft.mp3   (~29 MB)
public/textures/   the five Earth maps                                    (~2.3 MB)
public/archive/    5 rendered NASA plates + 40 Golden Record frames        (~2.9 MB)
public/models/     scene geometry                                         (~188 KB)
```

If the clone arrives without them the app still builds and runs; the reading plays with
no audio and the plates render as empty frames. There is no CDN fallback.

---

## Development

```bash
npm run dev        # http://localhost:3000
npm run lint       # eslint
npm run typecheck  # next typegen && tsc --noEmit
```

Development builds run a set of **assertions over the content tables** that production
skips. They throw on: a duplicate beat id, a hotspot outside its plate, a beat carrying
an image that is not filed `nasa_public`, a subtitle table whose length does not match
the narration cue list, a published archive frame with no credit line. They exist
because every one of those failures is invisible on screen — a subtitle table one row
short does not look broken, it just quietly captions the wrong line for the rest of the
reading.

---

## Production build

```bash
npx tsc --noEmit
npx eslint src --max-warnings=0
npm run build
npm run start          # serves the production build
```

`next.config.ts` sets `output: "standalone"`, so the build emits a self-contained
server under `.next/standalone` with only the dependencies the server actually loads.
Two directories are **not** traced into it and must be copied alongside:

```
.next/standalone/          server.js + traced node_modules
.next/standalone/.next/static/   <- copy from .next/static
.next/standalone/public/         <- copy from public
```

Getting that wrong produces a server that starts cleanly and then 404s every asset.

---

## Deployment

Any host that can run Node 20+ will serve it. The reference deployment is a small VPS
running the standalone build in a container behind a reverse proxy:

```
internet :80/:443  ->  Caddy  ->  Node (127.0.0.1:3000, never published)
```

Points worth carrying over to any other host:

- **Do not publish the Node port.** Put the proxy and the app on a private network and
  let only the proxy listen on a public interface.
- **Range requests matter.** The narration is a 5.8 MB MP3 that the browser seeks
  within; the proxy must pass `206 Partial Content` through.
- **Old distributions need a container.** Ubuntu 18.04 ships glibc 2.27 and Node 20+
  will not start on it. Running `node:22-alpine` avoids touching the host at all.
- **Staging should be closed.** The reference staging deployment sits behind HTTP Basic
  Auth and sends `X-Robots-Tag: noindex, nofollow, noarchive`.

---

## Project structure

```
src/
  app/
    layout.tsx              fonts, metadata, the html shell
    page.tsx                the single route
    globals.css             design tokens, type scale, per-script typography
  components/
    PaleBlueDot.tsx         the reading: audio clock, captions, HUD, scene handover
    LanguageGate.tsx        the language screen
    CreditsPanel.tsx        the attribution sheet
    exploration/
      ExplorationSequence.tsx   the self-playing second half
  lib/
    narration.ts            the script and its measured cue timings
    locales.ts              the nine locales and their subtitle tables
    ui-strings.ts           every string the interface says, in nine languages
    credits.ts              attribution that never changes language
    credits-copy.ts         attribution prose that does
    three/earth-scene.ts    the WebGL scene
    exploration/
      content.ts            52 beats, 8 chapters, their durations and media
      archive.ts            the 40 Golden Record frames and their rights records
      copy/                 beat text, one module per language
      credits-sequence.ts   the credit roll inside the ending
      sources.ts            every source the piece cites
```

---

## How the piece is built

A few decisions explain most of the code.

**The narration is the clock.** The audio element's `currentTime` drives the captions,
the camera and the transport. Cue times in `narration.ts` were measured off the
waveform, not estimated. The handover to the second half fires when Sagan stops
speaking at 202.9 s — measured the same way — rather than when the file ends at
210.9 s, because the last eight seconds are silence.

**The second half plays itself.** No scrolling. One `requestAnimationFrame` loop
accumulates real elapsed time and paints opacity straight onto the DOM; React is told
only which three beats to keep mounted. Beats crossfade on complementary ramps that sum
to exactly 1, so no frame of a transition is dimmer than either beat.

**Nothing moves during a transition.** A beat enters 8 px low and leaves 6 px high and
that is all — never width, height, margin or padding. A photograph held across several
beats lives in its own layer keyed to the run, so the same `<img>` stays mounted and
never reloads.

**Typography is measured, not guessed.** Type sizes are fluid `clamp()` lines
calibrated at two viewport widths. CJK scripts get their own letter-spacing, line
height, measure and display scale, because a `ch` unit sized on the Latin "0" holds
about half as many full-width glyphs.

---

## Localisation

Nine languages. Every one covers the whole piece: the subtitles under the reading, all
eight chapters after it, the credits panel and the closing card.

- **English is the source of record.** Every other table is merged *over* it field by
  field, so a missing string degrades to English rather than to a hole.
- **Instrument markings stay English** in every language — the HUD readouts and the
  beat eyebrows (`0.12 PIXEL`, `60 FRAMES`, `01 / THE PHOTOGRAPH`) are read off a panel,
  not spoken.
- **Subtitle tables are index-aligned** with the 57 narration cues and checked on every
  development build.
- **Names are never translated:** creator names, licence names, copyright lines,
  `NASA/JPL-Caltech`, PIA identifiers, URLs, and the project titles *Pale Blue Dot* and
  *Golden Record*.
- **CJK gets system fonts.** The Latin faces carry no kana, hanzi or hangul, so
  `:lang(ja)`, `:lang(zh-CN)` and `:lang(ko)` append platform serif stacks — Mincho,
  Songti, Myeongjo — with the Latin family still first so `Voyager 1` and `PIA17049`
  keep the project's own type. No CJK webfont is downloaded.

Adding a language means: one entry in `locales.ts`, one subtitle array of exactly 57
rows, one module in `exploration/copy/`, one block in `ui-strings.ts` and one in
`credits-copy.ts`. Miss any of them and the build fails with a type error.

---

## Accessibility

- Prefers-reduced-motion is honoured throughout: translations are dropped, durations
  collapse, and staggered reveals lose their delays.
- The colour palette clears WCAG AA at 10 px on the background, and
  `prefers-contrast: more` lifts the quietest step.
- Plates are described to screen readers in the reader's own language; the decorative
  layers are `aria-hidden`, and the described copy lives in the layer that is read.
- The language screen and credits panel are native `<dialog>` elements, so focus
  trapping, inertness and <kbd>Esc</kbd> come from the platform.
- Every element that changes language carries a matching `lang` attribute, so a screen
  reader switches voice at the right boundary. The English narration line keeps
  `lang="en"` inside a translated page.

---

## Content and rights

This section is the honest version. Read it before deploying this anywhere public.

**Narration.** *Pale Blue Dot* (1994) by Carl Sagan,
© 1994 Carl Sagan · © 2006 Democritus Properties, LLC. Used in the context of a
non-commercial educational portfolio work. **This repository holds no licence,
permission or release for the recorded narration audio**, and nothing in the project
claims one. The copyright line covers the printed text; it settles nothing about the
recording, and the two are deliberately not conflated anywhere in the interface.

**NASA/JPL imagery.** Five plates render in the exploration section — PIA23645,
PIA00451, PIA17049 and the Golden Record's front and cover. They are used in accordance
with NASA/JPL media usage guidelines. The project does not describe them as public
domain, copyright-free or licensed, because it holds no document that would support it.

**Golden Record frames.** The build reproduces **40** frames from NASA's Golden Record
gallery. NASA's own contents page states, verbatim:

> Due to copyright restrictions, only a subset of the images on the Golden Record are
> displayed above. All of these images are copyright protected. Reproduction without
> permission of the copyright holder is prohibited.

Of the 40: **0** are covered by documented permission, **39** are reproduced with the
credit NASA prints for them and nothing more, and **1** has no readable credit at all
because NASA publishes no detail page for it. The decision to publish was taken by the
project owner and is recorded in the header of `src/lib/exploration/archive.ts`. **NASA
hosting an image is not NASA licensing it**, and this project does not treat it as
though it were.

Each frame carries a `published` flag that the renderer honours, so withdrawing one is
a one-line change.

**Music and audio** are properly licensed and are the only material here that is:
Scott Buckley's *Aurora* under CC BY 4.0, and Bret Bernhoft's *Warbling 28* under the
Pixabay Content License.

**If you fork this**, the code is yours to use under the licence below. The audio, the
narration and the imagery in `public/` are **not** — they belong to the people credited
below, and their inclusion here is a decision this project made for itself, not a
permission it can pass on.

---

## Credits

| Role | Work | Holder | Standing |
|---|---|---|---|
| Narration | *Pale Blue Dot* (1994) | Carl Sagan | © 1994 Carl Sagan · © 2006 Democritus Properties, LLC |
| Music | *Aurora* | [Scott Buckley](https://www.scottbuckley.com.au/library/aurora/) | CC BY 4.0 |
| Closing audio | *Warbling 28* — Sound Effect by Bret Bernhoft from Pixabay | [Bret Bernhoft](https://pixabay.com/sound-effects/warbling-28-456902/) | Pixabay Content License |
| Earth textures | Solar Textures — day, night, clouds, specular, normal | [Solar System Scope (INOVE)](https://www.solarsystemscope.com/textures/) | CC BY 4.0 |
| Reference image | [Pale Blue Dot Revisited — PIA23645](https://science.nasa.gov/photojournal/pale-blue-dot-revisited/) | NASA/JPL-Caltech | Used per NASA/JPL media usage guidelines |
| Archive images | Solar System Family Portrait (PIA00451), Voyager in Space (PIA17049), Golden Record front and cover | NASA/JPL-Caltech | Used per NASA/JPL media usage guidelines |
| Golden Record frames | 40 frames | Jon Lomberg, Frank Drake, UN/DPI Photo, NASA, NAIC, and others as NASA credits them | Attribution only — see above |

Research draws on [NASA Science](https://science.nasa.gov/mission/voyager/) and the
NASA Jet Propulsion Laboratory. Every claim the piece makes on screen carries a source
marker keyed to `src/lib/exploration/sources.ts`.

For attribution, rights, or removal requests, please contact the repository owner.

---

## Licence

The **source code** in `src/`, the build configuration and this documentation are
released under the MIT Licence.

The **contents of `public/`** — audio, imagery and textures — are excluded. They remain
the property of the rights holders credited above and are not relicensed by this
repository under any terms.
