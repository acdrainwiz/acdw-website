import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { TtfOfficialRulesLink } from '@/components/campaign/TtfOfficialRulesLink'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { TRASH_THE_FLOAT } from '@/config/trashTheFloatCopy'
import { TrashCanIcon } from '@/components/campaign/TrashCanIcon'
import { TtfStoryPhotoExamples } from '@/components/campaign/TtfStoryPhotoExamples'
import { TtfConfettiRain } from '@/components/campaign/TtfConfettiRain'
import { TtfModalPrizeTicker } from '@/components/campaign/TtfModalPrizeTicker'
import { TtfPageMeshBackdrop } from '@/components/campaign/TtfPageMeshBackdrop'

/**
 * Homepage onload campaign overlay — contest poster (hook → story context → prize → CTAs).
 * Product comparison lives on /trash-the-float#comparison, not in this modal.
 * Primary CTA → landing hero (contest page); no secondary skip-to-form link.
 */
export function TrashTheFloatOverlay() {
  const [isOpen, setIsOpen] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const [ipadImageFailed, setIpadImageFailed] = useState(false)

  const showStoryCounter =
    TRASH_THE_FLOAT.storiesCount >= TRASH_THE_FLOAT.storiesCountMinDisplay

  const { overlay } = TRASH_THE_FLOAT

  const dontShowAgainRef = useRef(false)
  useEffect(() => {
    dontShowAgainRef.current = dontShowAgain
  }, [dontShowAgain])

  useEffect(() => {
    if (typeof window === 'undefined') return

    let dismissed = false
    try {
      dismissed = window.localStorage.getItem(TRASH_THE_FLOAT.storageKey) === '1'
    } catch {
      // Storage unavailable; show overlay.
    }
    if (dismissed) return

    const timeout = window.setTimeout(() => {
      setIsOpen(true)
    }, TRASH_THE_FLOAT.showDelayMs)

    return () => window.clearTimeout(timeout)
  }, [])

  const persistDismissal = () => {
    try {
      window.localStorage.setItem(TRASH_THE_FLOAT.storageKey, '1')
    } catch {
      // Storage unavailable; swallow.
    }
  }

  const handleClose = () => {
    if (dontShowAgainRef.current) persistDismissal()
    setIsOpen(false)
  }

  const handleCtaClick = () => {
    if (dontShowAgainRef.current) persistDismissal()
    setIsOpen(false)
  }

  const modalActionsClassName = 'ttf-modal-cta-row ttf-modal-reveal ttf-modal-reveal--7'

  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-[120]">
      <DialogBackdrop
        transition
        className="ttf-modal-backdrop transition data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="ttf-modal-positioner">
        <DialogPanel
          transition
          className="ttf-modal-panel ttf-modal-panel--poster transition data-[closed]:opacity-0 data-[closed]:translate-y-4 data-[closed]:scale-[0.97] data-[enter]:duration-350 data-[enter]:ease-out data-[leave]:duration-200 data-[leave]:ease-in motion-reduce:data-[closed]:translate-y-0 motion-reduce:data-[closed]:scale-100"
        >
          <TtfPageMeshBackdrop variant="hero" />
          <div aria-hidden className="ttf-modal-top-wash" />
          <div aria-hidden className="ttf-modal-grain" />
          <div aria-hidden className="ttf-page-hero-accent-rule" />

          <div className="ttf-modal-body">
            <div className="ttf-modal-hero">
              <div className="ttf-modal-poster-main">
                <p className="ttf-modal-reveal ttf-modal-reveal--1">
                  <span className="campaign-eyebrow">{TRASH_THE_FLOAT.campaignKicker}</span>
                </p>

                <DialogTitle className="ttf-modal-headline">
                  <span className="ttf-modal-headline-lead ttf-modal-reveal ttf-modal-reveal--2">
                    {overlay.headlineLeadBefore}
                    <span className="ttf-modal-headline-float-word">{overlay.headlineLeadFloat}</span>
                    {overlay.headlineLeadAfter}
                    <TrashCanIcon className="ttf-modal-trash-can" />
                  </span>
                  <span className="ttf-modal-headline-punch ttf-modal-reveal ttf-modal-reveal--3">
                    {overlay.headlinePunchBefore}
                    <span className="ttf-modal-goat campaign-highlight">{overlay.headlinePunchHighlight}</span>
                  </span>
                </DialogTitle>

                <div className="ttf-modal-subhead ttf-modal-reveal ttf-modal-reveal--4">
                  <p className="ttf-modal-subhead-line">{overlay.offerLine}</p>
                  <p className="ttf-modal-subhead-line">
                    {overlay.prizeCallout.headlineBefore}
                    <span className="ttf-modal-subhead-highlight campaign-highlight">
                      {overlay.prizeCallout.headlineHighlight}
                    </span>
                  </p>
                </div>

                <figure className="ttf-modal-prize-figure ttf-modal-reveal ttf-modal-reveal--5">
                  <div className="ttf-modal-prize-frame">
                    <TtfConfettiRain
                      className="ttf-modal-prize-confetti"
                      continuous
                      options={{
                        count: 52,
                        prizeStartS: 0,
                        spawnWindowS: 12,
                        seedOffset: 1200,
                        durationMinS: 5,
                        durationMaxS: 8.5,
                      }}
                    />
                    <Link
                      to={TRASH_THE_FLOAT.cta.primary.href}
                      onClick={handleCtaClick}
                      className="ttf-modal-prize-link"
                      aria-label={TRASH_THE_FLOAT.cta.primary.label}
                    >
                      {!ipadImageFailed ? (
                        <img
                          src={TRASH_THE_FLOAT.images.ipadPrize}
                          alt=""
                          className="ttf-modal-prize-img"
                          onError={() => setIpadImageFailed(true)}
                        />
                      ) : (
                        <div className="ttf-modal-prize-placeholder" aria-hidden>
                          <span className="ttf-modal-prize-placeholder-label">{overlay.prizeLabel}</span>
                          <span className="ttf-modal-prize-placeholder-hint">Prize photo</span>
                        </div>
                      )}
                    </Link>
                  </div>
                  <figcaption className="ttf-modal-prize-caption">
                    <TtfModalPrizeTicker />
                  </figcaption>
                </figure>

                <StoryContextStrip className="ttf-modal-reveal ttf-modal-reveal--6" />

                <ModalActions
                  className={`${modalActionsClassName} ttf-modal-cta-row--inline`}
                  onCtaClick={handleCtaClick}
                  onClose={handleClose}
                />
              </div>
            </div>

            <div
              className={
                showStoryCounter
                  ? 'ttf-modal-footer'
                  : 'ttf-modal-footer ttf-modal-footer--dismiss-only'
              }
            >
              {showStoryCounter ? (
                <span
                  className="ttf-modal-counter"
                  aria-live="polite"
                  data-testid="trash-the-float-counter"
                >
                  <span className="ttf-modal-pulse" />
                  <span>
                    <span className="font-semibold text-slate-900">
                      {TRASH_THE_FLOAT.storiesCount.toLocaleString()}
                    </span>{' '}
                    stories submitted
                  </span>
                </span>
              ) : null}

              <label className="ttf-modal-dismiss-label">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="ttf-modal-dismiss-checkbox"
                />
                Don't show again
              </label>
            </div>

            <p className="ttf-modal-disclaimer">
              Stories are reviewed before publication. No purchase necessary where applicable. See{' '}
              <TtfOfficialRulesLink className="ttf-modal-disclaimer-link" />.
            </p>
          </div>

          <div className="ttf-modal-sticky-actions" aria-label="Campaign actions">
            <ModalActions
              className="ttf-modal-cta-row"
              onCtaClick={handleCtaClick}
              onClose={handleClose}
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

type StoryContextStripProps = {
  className?: string
}

type ModalActionsProps = {
  className?: string
  onCtaClick: () => void
  onClose: () => void
}

function ModalActions({ className, onCtaClick, onClose }: ModalActionsProps) {
  const { overlay } = TRASH_THE_FLOAT

  return (
    <div className={className}>
      <Link
        to={TRASH_THE_FLOAT.cta.primary.href}
        onClick={onCtaClick}
        className="campaign-cta-primary ttf-modal-cta-primary gap-2 rounded-xl px-6 py-3 text-sm sm:text-base"
      >
        {TRASH_THE_FLOAT.cta.primary.label}
      </Link>
      <button type="button" onClick={onClose} className="ttf-modal-dismiss-link">
        {overlay.closeLabel}
      </button>
    </div>
  )
}

/**
 * Two thumbnail “story context” photos between the offer line and the iPad prize.
 * Narrative: problem (damage) → reward (iPad) → CTAs.
 */
function StoryContextStrip({ className }: StoryContextStripProps) {
  const { storyContext } = TRASH_THE_FLOAT.overlay

  return (
    <TtfStoryPhotoExamples
      className={className}
      variant="modal"
      headingId="ttf-modal-story-heading"
      kicker={storyContext.kicker}
      body={storyContext.body}
      photos={storyContext.photos}
      caption={storyContext.caption}
    />
  )
}
