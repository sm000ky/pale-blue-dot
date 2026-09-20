'use client'

/**
 * The first screen: which language the subtitles answer in.
 *
 * It is a title card, not a settings dialog. The dot is already on screen behind
 * it — the scene renders from the moment the page loads — so this only dims the
 * sky enough to read against and puts the choice in front of it. English is not
 * one of the things being chosen: it is the script that is actually spoken, and it
 * stays on screen whatever happens here. What the reader picks is the line that
 * sits *underneath* it, which is why the panel ends in a live sample of the pair
 * rather than in a confirmation button.
 *
 * Built on a native <dialog> opened with showModal(), the same as CreditsPanel:
 * focus trapping, Escape, and inertness of the chrome behind it are the platform's
 * job. Arrow keys move between the rows, Enter (or a click) takes the choice and
 * hands over to the play gate.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import {
  subtitleLocales,
  localeByCode,
  translationFor,
  DEFAULT_LOCALE,
  type LocaleCode,
} from '@/lib/locales'
import { strings } from '@/lib/ui-strings'
import { cues } from '@/lib/narration'

type LanguageGateProps = {
  open: boolean
  /** The locale currently in force — the row that reads as chosen. */
  locale: LocaleCode
  /** A row was activated: take the locale and close. */
  onSelect: (code: LocaleCode) => void
  /** Escape, or any other way out that leaves the current locale standing. */
  onDismiss: () => void
  reducedMotion: boolean
}

/**
 * The line the sample is drawn from. Index 3 is "Consider again that dot." —
 * short enough to set twice at this size, present in every translation table, and
 * pointing at the very thing still visible behind the panel. Read out of `cues`
 * rather than typed here so the sample can never quote a line the piece does not
 * actually say.
 */
const PREVIEW_INDEX = 3
const PREVIEW_TEXT = cues[PREVIEW_INDEX]?.text ?? ''

const MOVE_KEYS: ReadonlySet<string> = new Set(['ArrowDown', 'ArrowUp', 'Home', 'End'])

export default function LanguageGate({
  open,
  locale,
  onSelect,
  onDismiss,
  reducedMotion,
}: LanguageGateProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])

  /** Roving tabindex: one stop for the whole list, the arrows move it. */
  const [activeIndex, setActiveIndex] = useState(0)
  /** Which locale the sample is showing — follows focus and the pointer. */
  const [preview, setPreview] = useState<LocaleCode>(locale)

  /**
   * Whether the dialog is currently shown. The effect below runs on every render
   * that touches its dependencies, but opening, focusing and animating must happen
   * once per transition — not again because `locale` changed underneath it.
   */
  const shownRef = useRef(false)

  useEffect(() => {
    const dialog = dialogRef.current
    const panel = panelRef.current
    if (!dialog || !panel) return

    if (open) {
      // `dialog.open` as well as the flag: a cleanup — Strict Mode's, or an unmount
      // that never happened — can close the element while the parent still believes
      // the screen is up, and the flag alone would leave it closed for good.
      if (shownRef.current && dialog.open) return
      shownRef.current = true

      if (!dialog.open) dialog.showModal()

      // Start on the locale in force rather than at the top of the list: reopening
      // this screen should show where you are before it offers to move you. When the
      // locale in force is English it appears nowhere in the list, so this falls to
      // the first translation instead.
      const index = Math.max(
        0,
        subtitleLocales.findIndex((option) => option.code === locale),
      )
      setActiveIndex(index)
      // Preview follows the focused row, not the locale in force. On a first visit
      // those differ — nothing is chosen yet, so the row under focus is the first
      // translation while the locale is still English — and previewing English
      // there would show a single line, quietly demonstrating the opposite of what
      // the screen is offering.
      setPreview(subtitleLocales[index].code)
      optionRefs.current[index]?.focus()

      gsap.killTweensOf(panel)
      gsap.fromTo(
        panel,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: reducedMotion ? 0.001 : 0.6,
          ease: 'power2.out',
        },
      )
      return
    }

    if (!shownRef.current) return
    shownRef.current = false

    // The parent owns `open`, so the exit has to finish before close() drops the
    // element out of the top layer — otherwise the screen is simply gone.
    gsap.killTweensOf(panel)
    gsap.to(panel, {
      opacity: 0,
      y: -10,
      duration: reducedMotion ? 0.001 : 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        if (dialog.open) dialog.close()
      },
    })
  }, [open, locale, reducedMotion])

  useEffect(() => {
    const dialog = dialogRef.current
    const panel = panelRef.current
    return () => {
      if (panel) gsap.killTweensOf(panel)
      if (dialog?.open) dialog.close()
    }
  }, [])

  const handleCancel = useCallback(
    (event: React.SyntheticEvent<HTMLDialogElement>) => {
      // Escape leaves the current locale standing rather than trapping the reader
      // in a choice; the parent still records that the question has been asked.
      event.preventDefault()
      onDismiss()
    },
    [onDismiss],
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!MOVE_KEYS.has(event.key)) return
      event.preventDefault()

      const last = subtitleLocales.length - 1
      let next: number
      switch (event.key) {
        case 'ArrowDown':
          next = activeIndex >= last ? 0 : activeIndex + 1
          break
        case 'ArrowUp':
          next = activeIndex <= 0 ? last : activeIndex - 1
          break
        case 'Home':
          next = 0
          break
        default:
          next = last
      }

      setActiveIndex(next)
      setPreview(subtitleLocales[next].code)
      optionRefs.current[next]?.focus()
    },
    [activeIndex],
  )

  const previewTranslation = translationFor(PREVIEW_INDEX, preview)
  const previewLocale = localeByCode(preview)

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="language-gate-heading"
      onCancel={handleCancel}
      className="fixed inset-0 m-0 h-full max-h-full w-full max-w-full overflow-hidden bg-transparent p-0 text-paper backdrop:bg-[#05070c]/55"
    >
      {/* A pool of shade under the panel and nothing more — the dot has to stay
          visible behind this screen, so the backdrop above is deliberately thin
          and the local contrast is bought here instead. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(46% 44% at 50% 50%, rgba(5,7,12,0.86) 0%, rgba(5,7,12,0.68) 46%, rgba(5,7,12,0.22) 78%, rgba(5,7,12,0) 100%)',
        }}
      />

      {/* Scroll container outside the centring flex: on a short viewport the panel
          has to be reachable from the top, not cropped at both ends. */}
      <div ref={panelRef} className="relative h-full w-full overflow-y-auto opacity-0">
        <div className="flex min-h-full items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-[30rem]">
            {/* --- title card ------------------------------------------------ */}
            <p className="font-serif text-[clamp(1.55rem,5.4vw,2.25rem)] font-light leading-none tracking-[0.01em] text-paper">
              Pale Blue Dot
            </p>
            <p className="hud-label mt-3">Voyager 1 · 14 Feb 1990</p>

            <div className="mt-9 h-px w-full bg-rule" />

            {/* --- the question ---------------------------------------------- */}
            {/* "Select language", not "Select subtitle language". The choice made
                here governs the whole interface — the subtitles under the reading,
                the eight chapters after it, the credits panel and the closing card —
                and a heading that names only the subtitles describes about a fifth
                of what the row actually does.

                The sentence underneath says what each row covers. It is one clause
                longer than it was and nothing else has been added: the screen is a
                title card, and an availability table would make it a settings
                dialog. */}
            <h2 id="language-gate-heading" className="hud-key mt-7">
              Select language
            </h2>
            <p className="mt-3.5 max-w-[calc(42ch*var(--measure-scale))] font-mono text-[length:var(--micro-md)] leading-[1.75] tracking-[0.04em] text-paper-dim">
              English is what Sagan speaks, and it stays on screen throughout. Your language
              sits beneath it during the reading, and carries everything after it.
            </p>

            {/* --- the way past it --------------------------------------------- */}
            {/* Not a row. English is already guaranteed — it is the voice — so
                offering it as a peer of the translations would be offering something
                already given. It is an action, not a state, and it is also what
                Escape does.

                It sits above the manifest rather than below it: a reader who wants no
                translation should not have to read eight rows of translations first
                to find that out. Still plain type, still the quietest step of the
                palette — offered, not advertised. */}
            <button
              type="button"
              onClick={() => onSelect(DEFAULT_LOCALE)}
              onFocus={() => setPreview(DEFAULT_LOCALE)}
              onPointerEnter={() => setPreview(DEFAULT_LOCALE)}
              // Deliberately never marked as current, even when English is the
              // locale in force. English IS the resting state, so lighting it up on
              // a first visit would advertise the way out above the thing offered.
              className="mt-5 cursor-pointer border-b border-transparent pb-1 font-mono text-[length:var(--micro-sm)] font-medium uppercase leading-none tracking-[var(--chrome-track)] text-paper-faint transition-colors duration-200 hover:border-pale-blue hover:text-pale-blue focus-visible:border-pale-blue focus-visible:text-pale-blue"
            >
              {strings(DEFAULT_LOCALE).gateContinue}
            </button>

            {/* --- the list --------------------------------------------------- */}
            {/* A manifest, not a dropdown: three columns under a rule, one row per
                locale, the row itself the control. */}
            <div
              role="group"
              aria-labelledby="language-gate-heading"
              onKeyDown={handleKeyDown}
              className="mt-6 border-t border-rule"
            >
              {subtitleLocales.map((option, index) => {
                const chosen = option.code === locale
                return (
                  <button
                    key={option.code}
                    ref={(node) => {
                      optionRefs.current[index] = node
                    }}
                    type="button"
                    tabIndex={index === activeIndex ? 0 : -1}
                    aria-current={chosen ? 'true' : undefined}
                    onClick={() => onSelect(option.code)}
                    onFocus={() => {
                      setActiveIndex(index)
                      setPreview(option.code)
                    }}
                    onPointerEnter={() => setPreview(option.code)}
                    className="group relative grid min-h-11 w-full cursor-pointer grid-cols-[2.25rem_5.25rem_1fr] items-baseline gap-x-3 border-b border-rule py-4 text-left transition-colors duration-200 hover:bg-pale-blue/[0.06] sm:grid-cols-[3rem_8rem_1fr] sm:gap-x-5"
                  >
                    {/* The lit edge of a panel row: the whole indicator for the
                        chosen locale, and what hover promises to move. */}
                    <span
                      aria-hidden="true"
                      className={`absolute bottom-0 left-0 top-0 w-px transition-colors duration-200 ${
                        chosen ? 'bg-pale-blue' : 'bg-transparent group-hover:bg-paper-faint'
                      }`}
                    />
                    <span
                      className={`font-mono text-[length:var(--micro-base)] font-medium leading-none tracking-[0.14em] transition-colors duration-200 ${
                        chosen ? 'text-pale-blue' : 'text-pale-blue/55 group-hover:text-pale-blue'
                      }`}
                    >
                      {option.region}
                    </span>
                    <span lang={option.code} className="hud-label chrome-cap">{option.country}</span>
                    <span
                      lang={option.code}
                      dir={option.direction}
                      className={`font-serif text-[1.0625rem] font-light leading-[1.35] transition-colors duration-200 ${
                        chosen ? 'text-paper' : 'text-paper-dim group-hover:text-paper'
                      }`}
                    >
                      {option.language}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* --- the sample -------------------------------------------------- */}
            {/* Set exactly the way the captions are: one em for the script, 0.62em
                for the translation, --paper over --paper-dim. English alone when
                the highlighted locale has no second line — including the missing
                gap, so nothing promises a row that will never arrive.
                aria-hidden: the sentence above already says this in words, and a
                screen reader reading the same line twice in two languages would
                only be noise. */}
            <div aria-hidden="true" className="mt-7">
              <p className="hud-label">Caption sample</p>
              {/* The height of the pair is held whether or not there is a second
                  line, so moving between the rows does not shuffle the panel. */}
              <div className="mt-4 min-h-[3.6rem] text-[1.25rem]">
                <p lang="en" className="font-serif text-[1em] font-light leading-[1.45] text-paper">
                  {PREVIEW_TEXT}
                </p>
                {previewTranslation ? (
                  <p
                    lang={previewLocale.code}
                    dir={previewLocale.direction}
                    className="mt-[0.6em] font-serif text-[0.62em] font-light leading-[1.5] text-paper-dim"
                  >
                    {previewTranslation}
                  </p>
                ) : null}
              </div>
            </div>

            <p className="hud-label mt-8 hidden sm:block">
              ↑ ↓ to move · Enter to continue
            </p>
          </div>
        </div>
      </div>
    </dialog>
  )
}
