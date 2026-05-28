import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { TtfConfettiRain } from '@/components/campaign/TtfConfettiRain'
import { TtfHashLink } from '@/components/campaign/TtfHashLink'
import { TtfOfficialRulesLink } from '@/components/campaign/TtfOfficialRulesLink'
import { TRASH_THE_FLOAT } from '@/config/trashTheFloatCopy'
import { cn } from '@/lib/utils'

type TtfSubmissionSuccessPanelProps = {
  onAnotherStory: () => void
  className?: string
}

export function TtfSubmissionSuccessPanel({ onAnotherStory, className }: TtfSubmissionSuccessPanelProps) {
  const { sectionSuccess } = TRASH_THE_FLOAT.landing
  const { instagram } = TRASH_THE_FLOAT

  return (
    <div className={cn('ttf-form-card ttf-form-card--success ttf-submission-success', className)}>
        <TtfConfettiRain
          className="ttf-submission-success-confetti"
          animBaseVar="--ttf-submission-success-anim-base"
          options={{
            count: 36,
            prizeStartS: 0,
            spawnWindowS: 2.5,
            seedOffset: 2400,
            durationMinS: 4,
            durationMaxS: 6.5,
          }}
        />

        <div className="ttf-submission-success-sparkles" aria-hidden>
          <span className="ttf-page-prize-sparkle ttf-page-prize-sparkle--1" />
          <span className="ttf-page-prize-sparkle ttf-page-prize-sparkle--3" />
          <span className="ttf-page-prize-sparkle ttf-page-prize-sparkle--5" />
        </div>

        <div className="ttf-submission-success-panel">
          <div className="ttf-submission-success-badge" aria-hidden>
            <CheckCircleIcon className="ttf-submission-success-badge-icon" />
          </div>

          <div className="ttf-submission-success-checklist">
            <div className="ttf-submission-success-checklist-item ttf-submission-success-checklist-item--done">
              <CheckCircleIcon className="ttf-submission-success-checklist-icon" aria-hidden />
              <div>
                <p className="ttf-submission-success-checklist-label">{sectionSuccess.checklist.submittedLabel}</p>
              </div>
            </div>
            <div className="ttf-submission-success-checklist-item ttf-submission-success-checklist-item--action">
              <span className="ttf-submission-success-checklist-marker" aria-hidden />
              <div>
                <p className="ttf-submission-success-checklist-label">{sectionSuccess.checklist.followLabel}</p>
                <p className="ttf-submission-success-checklist-hint">{sectionSuccess.checklist.followHint}</p>
              </div>
            </div>
          </div>

          <div className="ttf-submission-success-next">
            <h3 className="ttf-submission-success-next-title">{sectionSuccess.nextStepsTitle}</h3>
            <ol className="ttf-submission-success-steps">
              {sectionSuccess.nextSteps.map((step, index) => (
                <li key={step.title} className="ttf-submission-success-step">
                  <span className="ttf-submission-success-step-num" aria-hidden>
                    {index + 1}
                  </span>
                  <div>
                    <p className="ttf-submission-success-step-title">{step.title}</p>
                    <p className="ttf-submission-success-step-body">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="ttf-submission-success-actions">
            <a
              href={instagram.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="campaign-cta-primary ttf-submission-success-primary-cta"
            >
              {sectionSuccess.primaryCtaLabel}
            </a>

            <div className="ttf-submission-success-secondary-links">
              <TtfOfficialRulesLink className="ttf-submission-success-secondary-link" />
              <span className="ttf-submission-success-secondary-sep" aria-hidden>
                ·
              </span>
              <TtfHashLink hash="#story-spotlight" className="ttf-submission-success-secondary-link">
                {sectionSuccess.hallOfFameLink}
              </TtfHashLink>
            </div>

            <button
              type="button"
              onClick={onAnotherStory}
              className="ttf-submission-success-another-link"
            >
              {sectionSuccess.anotherStoryLink}
            </button>
        </div>
      </div>
    </div>
  )
}

type TtfSubmissionReentryModalProps = {
  open: boolean
  onContinue: () => void
  onCancel: () => void
}

export function TtfSubmissionReentryModal({ open, onContinue, onCancel }: TtfSubmissionReentryModalProps) {
  const { sectionSuccess } = TRASH_THE_FLOAT.landing
  const { reentryGate } = sectionSuccess

  return (
    <Dialog open={open} onClose={onCancel} className="relative z-[120]">
      <DialogBackdrop
        transition
        className="ttf-modal-backdrop transition data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="ttf-modal-positioner">
        <DialogPanel
          transition
          className="ttf-reentry-modal-panel transition data-[closed]:opacity-0 data-[closed]:translate-y-4 data-[closed]:scale-[0.97] data-[enter]:duration-300 data-[enter]:ease-out data-[leave]:duration-200 data-[leave]:ease-in motion-reduce:data-[closed]:translate-y-0 motion-reduce:data-[closed]:scale-100"
        >
          <div className="ttf-reentry-modal-accent" aria-hidden />

          <button
            type="button"
            onClick={onCancel}
            className="ttf-reentry-modal-close"
            aria-label="Close"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden />
          </button>

          <div className="ttf-reentry-modal-body">
            <p className="ttf-reentry-modal-eyebrow">{reentryGate.eyebrow}</p>
            <DialogTitle className="ttf-reentry-modal-title">{reentryGate.title}</DialogTitle>
            <p className="ttf-reentry-modal-lead">{reentryGate.lead}</p>

            <ul className="ttf-reentry-modal-list">
              {reentryGate.bullets.map((bullet) => (
                <li key={bullet} className="ttf-reentry-modal-list-item">
                  <span className="ttf-reentry-modal-list-marker" aria-hidden />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <p className="ttf-reentry-modal-rules">
              Questions about eligibility?{' '}
              <TtfOfficialRulesLink className="ttf-reentry-modal-rules-link" />
            </p>

            <div className="ttf-reentry-modal-actions">
              <button
                type="button"
                onClick={onContinue}
                className="campaign-cta-primary ttf-reentry-modal-continue"
              >
                {reentryGate.continueLabel}
              </button>
              <button type="button" onClick={onCancel} className="ttf-reentry-modal-cancel">
                {reentryGate.cancelLabel}
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
