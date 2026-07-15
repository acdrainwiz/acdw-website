import { type ReactNode, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { PRODUCT_NAMES } from '../../config/acdwKnowledge'

const MOBILE_COMPACT_MQ = '(max-width: 767px)'
const COMPACT_SCROLL_THRESHOLD_PX = 20

interface SetupWizardProps {
  totalSteps: number
  currentStep: number
  onStepChange: (step: number) => void
  children: ReactNode
  continueLabel?: string
  backLabel?: string
  isContinueDisabled?: boolean
  onContinueClick?: () => boolean // Returns true if handled, false to proceed normally
  /** 'sensor' | 'mini' — controls shell class prefix */
  variant?: 'sensor' | 'mini'
  /** Final non-linked breadcrumb crumb (e.g. "Mini Installation"). */
  breadcrumbGuideLabel: string
  /** Subtitle under the H1 — current wizard step name. */
  currentStepLabel: string
  /** Primary H1 for mini variant; defaults to PRODUCT_NAMES.mini. */
  productTitle?: string
  /** Primary H1 for sensor variant (e.g. Standard vs WiFi setup title). */
  headerTitle?: string
}

export function SetupWizard({
  totalSteps,
  currentStep,
  onStepChange,
  children,
  continueLabel = 'Continue',
  backLabel = 'Back',
  isContinueDisabled = false,
  onContinueClick,
  variant = 'sensor',
  breadcrumbGuideLabel,
  currentStepLabel,
  productTitle,
  headerTitle,
}: SetupWizardProps) {
  const prefix = variant === 'mini' ? 'mini-setup-wizard' : 'sensor-setup-wizard'
  const primaryTitle =
    variant === 'mini'
      ? productTitle?.trim() || PRODUCT_NAMES.mini
      : headerTitle?.trim() || 'Sensor Setup'

  const [isCompact, setIsCompact] = useState(false)

  // Jump to top on step change (instant — avoids fighting html { scroll-behavior: smooth }
  // and delayed compact while a long scroll-up animation holds the header expanded).
  useEffect(() => {
    setIsCompact(false)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [currentStep])

  // Mobile-only: full header at page top, compact once scrolled away
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_COMPACT_MQ)

    const updateCompact = () => {
      if (!mq.matches) {
        setIsCompact(false)
        return
      }
      setIsCompact(window.scrollY > COMPACT_SCROLL_THRESHOLD_PX)
    }

    updateCompact()
    window.addEventListener('scroll', updateCompact, { passive: true })
    mq.addEventListener('change', updateCompact)
    return () => {
      window.removeEventListener('scroll', updateCompact)
      mq.removeEventListener('change', updateCompact)
    }
  }, [currentStep])

  // Get color for each progress bar based on step (works for 2- or 3-step flows)
  const getStepColor = (step: number) => {
    if (step <= currentStep) {
      if (step === 1) return '#2563eb'
      if (step === 2) return '#5b21b6'
      return '#6b21a8'
    }
    return '#e5e7eb'
  }

  const handleBack = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1)
    }
  }

  const handleContinue = () => {
    // Check if there's a custom Continue handler (e.g., for Step 2)
    if (onContinueClick && onContinueClick()) {
      // Handler took care of it, don't proceed to next step
      return
    }

    // Normal behavior: proceed to next step
    if (currentStep < totalSteps) {
      onStepChange(currentStep + 1)
    }
  }

  return (
    <div className={`${prefix}-container`}>
      {/* Header */}
      <div
        className={`${prefix}-header setup-wizard-header${isCompact ? ' setup-wizard-header--compact' : ''}`}
      >
        <div className={`${prefix}-header-content setup-wizard-header-content`}>
          <nav className="setup-wizard-breadcrumb" aria-label="Breadcrumb">
            <Link to="/support" className="setup-wizard-breadcrumb-link">
              Support Center
            </Link>
            <span className="setup-wizard-breadcrumb-separator" aria-hidden="true">
              /
            </span>
            <Link to="/support/installation-setup" className="setup-wizard-breadcrumb-link">
              Installation &amp; Setup
            </Link>
            <span className="setup-wizard-breadcrumb-tail">
              <span className="setup-wizard-breadcrumb-separator" aria-hidden="true">
                /
              </span>
              <span className="setup-wizard-breadcrumb-current">{breadcrumbGuideLabel}</span>
            </span>
          </nav>

          <div className="setup-wizard-header-top">
            <Link to="/" className="setup-wizard-logo-link setup-wizard-logo-slot">
              <img
                src="/images/ac-drain-wiz-logo.png"
                alt="AC Drain Wiz"
                className="setup-wizard-logo"
              />
            </Link>
            <h1 className="setup-wizard-primary-title setup-wizard-title-slot">{primaryTitle}</h1>
            <div className="setup-wizard-step-indicator setup-wizard-step-slot">
              Step {currentStep} of {totalSteps}
            </div>
            <p className="setup-wizard-step-label setup-wizard-subtitle-slot">{currentStepLabel}</p>
          </div>

          {/* Progress bars — count matches totalSteps (e.g. 2 for Standard sensor, 3 for WiFi) */}
          <div className={`${prefix}-progress-bars-container setup-wizard-progress-bars`}>
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <div
                key={step}
                className={`${prefix}-progress-bar setup-wizard-progress-bar`}
                style={{
                  backgroundColor: getStepColor(step),
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content with Fade Transition */}
      <div className={`${prefix}-content`}>
        <div key={currentStep} className={`${prefix}-content-inner`}>
          {children}
        </div>
      </div>

      {/* Navigation - Show on all steps, but only back button on final step */}
      <div className={`${prefix}-navigation`}>
        <div className={`${prefix}-navigation-content`}>
          <div className={`${prefix}-navigation-buttons`}>
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`${prefix}-navigation-button ${prefix}-navigation-button-back ${currentStep > 1 ? `${prefix}-navigation-button-enabled` : `${prefix}-navigation-button-disabled`}`}
            >
              <ChevronLeftIcon className={`${prefix}-navigation-button-icon`} />
              <span>{backLabel}</span>
            </button>

            {/* Only show continue button if not on final step */}
            {currentStep < totalSteps && (
              <button
                onClick={handleContinue}
                disabled={isContinueDisabled}
                className={`${prefix}-navigation-button ${prefix}-navigation-button-continue ${isContinueDisabled ? `${prefix}-navigation-button-disabled` : `${prefix}-navigation-button-enabled`}`}
              >
                <span>{continueLabel}</span>
                <ChevronRightIcon className={`${prefix}-navigation-button-icon`} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
