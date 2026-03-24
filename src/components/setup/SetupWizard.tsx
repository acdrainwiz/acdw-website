import { type ReactNode, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeftIcon, ChevronRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

interface SetupWizardProps {
  totalSteps: number
  currentStep: number
  onStepChange: (step: number) => void
  children: ReactNode
  continueLabel?: string
  backLabel?: string
  isContinueDisabled?: boolean
  onContinueClick?: () => boolean // Returns true if handled, false to proceed normally
  /** 'sensor' | 'mini' — controls shell class prefix and header title */
  variant?: 'sensor' | 'mini'
  /** When variant is sensor, overrides the default "Sensor Setup" title (e.g. Standard vs WiFi). */
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
  headerTitle
}: SetupWizardProps) {
  const prefix = variant === 'mini' ? 'mini-setup-wizard' : 'sensor-setup-wizard'
  const title =
    variant === 'mini' ? 'Mini Setup' : headerTitle?.trim() ? headerTitle.trim() : 'Sensor Setup'
  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
      <div className={`${prefix}-header`}>
        <div className={`${prefix}-header-content`}>
          {/* Back to Support Link */}
          <div className={`${prefix}-header-back-link`}>
            <Link to="/support" className={`${prefix}-header-back-link-content`}>
              <ArrowLeftIcon className={`${prefix}-header-back-link-icon`} />
              <span>Back to Support</span>
            </Link>
          </div>

          <div className={`${prefix}-header-top`}>
            <div className={`${prefix}-header-brand`}>
              <Link to="/" className={`${prefix}-header-logo-link`}>
                <img 
                  src="/images/ac-drain-wiz-logo.png" 
                  alt="AC Drain Wiz" 
                  className={`${prefix}-header-logo`}
                />
              </Link>
              <h1 className={`${prefix}-header-title`}>{title}</h1>
            </div>
            <div className={`${prefix}-header-step-indicator`}>
              Step {currentStep} of {totalSteps}
            </div>
          </div>
          
          {/* Progress bars — count matches totalSteps (e.g. 2 for Standard sensor, 3 for WiFi) */}
          <div className={`${prefix}-progress-bars-container`}>
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <div
                key={step}
                className={`${prefix}-progress-bar`}
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
        <div 
          key={currentStep}
          className={`${prefix}-content-inner`}
        >
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
