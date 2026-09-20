'use client'

/**
 * Attribution sheet.
 *
 * Three of the four sources are CC BY 4.0, which makes this panel a licence
 * obligation rather than a footnote: title, author, licence and a link to the
 * source all have to be on screen. Built on a native <dialog> opened with
 * showModal(), so focus trapping, inertness of the page behind it and the
 * Escape key come from the platform instead of from hand-written key handlers.
 *
 * The whole panel now speaks the reader's language — labels, descriptions and the
 * rights notice — so there is no language boundary inside it to mark, and the root's
 * `lang` covers it. What stays fixed is what has to: creator names, licence names,
 * the Pixabay attribution formula, the archival identifiers and the © lines. Those
 * are names, and a translated name credits nobody.
 */

import { Fragment, useCallback, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { credits } from '@/lib/credits'
import { copyrightNote, creditText } from '@/lib/credits-copy'
import { strings } from '@/lib/ui-strings'
import type { LocaleCode } from '@/lib/locales'

type CreditsPanelProps = {
  open: boolean
  onClose: () => void
  reducedMotion: boolean
  /** Chrome, descriptions and notice all follow it; names never do. */
  locale: LocaleCode
}

/** `https://www.planetary.org/worlds/pale-blue-dot/` -> `planetary.org/worlds/pale-blue-dot` */
function displayUrl(href: string): string {
  try {
    const url = new URL(href)
    return `${url.hostname.replace(/^www\./, '')}${url.pathname.replace(/\/+$/, '')}`
  } catch {
    return href
  }
}

export default function CreditsPanel({ open, onClose, reducedMotion, locale }: CreditsPanelProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    const panel = panelRef.current
    if (!dialog || !panel) return

    gsap.killTweensOf(panel)

    if (open) {
      if (!dialog.open) dialog.showModal()
      gsap.fromTo(
        panel,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: reducedMotion ? 0.001 : 0.42, ease: 'power2.out' },
      )
      return
    }

    // Closing is driven from the parent's state, so the exit animation has to run
    // before dialog.close() removes the element from the top layer.
    if (!dialog.open) return
    gsap.to(panel, {
      opacity: 0,
      y: 10,
      duration: reducedMotion ? 0.001 : 0.22,
      ease: 'power2.in',
      onComplete: () => dialog.close(),
    })
  }, [open, reducedMotion])

  useEffect(() => {
    const dialog = dialogRef.current
    const panel = panelRef.current
    return () => {
      if (panel) gsap.killTweensOf(panel)
      if (dialog?.open) dialog.close()
    }
  }, [])

  // Escape fires `cancel`; let the parent own the state so the exit tween still runs.
  const handleCancel = useCallback(
    (event: React.SyntheticEvent<HTMLDialogElement>) => {
      event.preventDefault()
      onClose()
    },
    [onClose],
  )

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="credits-title"
      onCancel={handleCancel}
      className="fixed inset-0 m-0 h-full max-h-full w-full max-w-full overflow-hidden bg-transparent p-0 text-paper backdrop:bg-[#05070c]/88"
    >
      <div
        ref={panelRef}
        className="absolute inset-x-0 bottom-0 max-h-[82svh] overflow-y-auto border-t border-rule bg-void-lift opacity-0 [scrollbar-color:var(--paper-faint)_transparent] [scrollbar-width:thin] sm:inset-x-auto sm:bottom-14 sm:left-8 sm:w-[min(44rem,calc(100vw-4rem))] sm:border [&::-webkit-scrollbar-thumb]:bg-paper-faint [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-[3px]"
      >
        <div className="flex items-start justify-between gap-6 border-b border-rule px-5 py-4 sm:px-7">
          {/* Explicit utilities rather than `hud-label`: the shared utility hard-codes
              --paper-faint, and stacking a colour utility on top of it would leave the
              winner up to stylesheet order. */}
          <h2
            id="credits-title"
            className="pt-1 font-mono text-[length:var(--micro-sm)] font-medium uppercase leading-none tracking-[var(--chrome-track)] text-paper-dim"
          >
            {strings(locale).creditsPanelTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="-mr-1 -mt-1 cursor-pointer p-1 font-mono text-[length:var(--micro-sm)] font-medium uppercase leading-none tracking-[var(--chrome-track)] text-paper-faint transition-colors duration-200 hover:text-pale-blue focus-visible:text-pale-blue"
          >
            {strings(locale).close}
          </button>
        </div>

        <dl className="px-5 sm:px-7">
          {credits.map((credit) => {
            const text = creditText(credit.roleKey, locale)
            // The licence name wins where there is one: "CC BY 4.0" is both shorter
            // and more precise than any sentence describing it. The prose status is
            // for the works that have no licence to name — a quotation, and NASA
            // material released under usage guidelines rather than a licence.
            const status = credit.license ?? text.rights
            return (
            <div
              key={credit.roleKey}
              className="grid grid-cols-1 gap-x-6 gap-y-2 border-b border-rule py-4 sm:grid-cols-[8rem_1fr]"
            >
              <dt className="hud-label chrome-cap pt-[0.4rem]">{strings(locale).roles[credit.roleKey]}</dt>
              <dd className="min-w-0">
                {/* '\n' is a hard break the copy chose: the archive row names four
                    separate works, and the narration row separates the passage from
                    the book it is in. Same element, same type, same spacing — the
                    lines are content, not layout. */}
                <p className="font-serif text-[1.0625rem] font-light leading-[1.45] text-paper">
                  {(credit.title ?? text.title ?? '').split('\n').map((line, index) => (
                    <Fragment key={index}>
                      {index > 0 ? <br /> : null}
                      {line}
                    </Fragment>
                  ))}
                </p>
                <p className="mt-2 font-mono text-[length:var(--micro-md)] leading-[1.6] tracking-[0.04em] text-paper-dim">
                  {credit.author}
                  {status ? <span className="text-paper-faint"> · {status}</span> : null}
                </p>
                {/* Either a required form of words (Pixabay's, printed verbatim) or
                    the project's own statement of how it is using the work. Never
                    both: no row has occasion for the two at once. */}
                {credit.attribution ?? text.usage ? (
                  <p className="mt-2 font-mono text-[length:var(--micro-md)] leading-[1.6] tracking-[0.04em] text-paper-faint">
                    {credit.attribution ?? text.usage}
                  </p>
                ) : null}
                {credit.href ? (
                  <a
                    href={credit.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block break-all font-mono text-[length:var(--micro-md)] leading-[1.6] tracking-[0.04em] text-pale-blue underline decoration-pale-blue/30 underline-offset-4 transition-colors duration-200 hover:decoration-pale-blue focus-visible:decoration-pale-blue"
                  >
                    {displayUrl(credit.href)}
                    <span aria-hidden="true"> ↗</span>
                  </a>
                ) : null}
              </dd>
            </div>
            )
          })}
        </dl>

        <p className="px-5 py-6 font-mono text-[length:var(--micro-md)] leading-[1.75] tracking-[0.02em] text-paper-faint sm:px-7">
          {copyrightNote[locale] ?? copyrightNote.en}
        </p>
      </div>
    </dialog>
  )
}
