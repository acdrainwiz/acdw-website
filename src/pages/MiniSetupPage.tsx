import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SetupWizard } from '../components/setup/SetupWizard'
import { Step1MiniPreparation } from '../components/setup/steps/Step1MiniPreparation'
import { Step2MiniInstallation } from '../components/setup/steps/Step2MiniInstallation'
import { Step3MiniCompletion } from '../components/setup/steps/Step3MiniCompletion'
import { PRODUCT_NAMES } from '../config/acdwKnowledge'
import { MINI_SETUP_SEARCH_TERMS } from '../config/installationSearchTerms'
import type { PageSearchMeta } from '../config/siteSearchTypes'

const TOTAL_STEPS = 3

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'guide-mini-setup',
  kind: 'how-to',
  title: 'Mini installation guide (step-by-step)',
  body: `How to install the ${PRODUCT_NAMES.mini}. Permanent service port on a 3/4 inch PVC condensate drain line. PVC solvent weld on horizontal drain joints only—primer and cement on cut pipe ends and socket walls, not the vertical port. Measure, cure, leak test. Flush, compressed air, vacuum cleaning without cutting pipe. Preparation, installation, completion.`,
  tags: ['mini', 'install', 'installation', 'pvc', 'drain', 'how to', 'setup', 'guide', 'solvent weld'],
  searchTerms: MINI_SETUP_SEARCH_TERMS,
  href: '/mini-setup',
}

export function MiniSetupPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  /** Step 2: Continue is disabled until the user has opened the second accordion (Cure & Leak Test). */
  const [step2SecondAccordionOpened, setStep2SecondAccordionOpened] = useState(false)

  useEffect(() => {
    const stepParam = searchParams.get('step')
    if (stepParam) {
      const step = parseInt(stepParam, 10)
      if (step >= 1 && step <= TOTAL_STEPS) {
        setCurrentStep(step)
      } else {
        setSearchParams({ step: '1' }, { replace: true })
        setCurrentStep(1)
      }
    } else {
      setSearchParams({ step: '1' }, { replace: true })
      setCurrentStep(1)
    }
  }, [searchParams, setSearchParams])

  const handleStepChange = (step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      if (currentStep === 2 && step !== 2) {
        setStep2SecondAccordionOpened(false)
      }
      setCurrentStep(step)
      setSearchParams({ step: step.toString() }, { replace: false })
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1MiniPreparation />
      case 2:
        return (
          <Step2MiniInstallation
            onSecondAccordionOpened={() => setStep2SecondAccordionOpened(true)}
          />
        )
      case 3:
        return <Step3MiniCompletion />
      default:
        return null
    }
  }

  return (
    <SetupWizard
      variant="mini"
      totalSteps={TOTAL_STEPS}
      currentStep={currentStep}
      onStepChange={handleStepChange}
      continueLabel={currentStep === TOTAL_STEPS ? 'Finish' : 'Continue'}
      isContinueDisabled={currentStep === 2 && !step2SecondAccordionOpened}
    >
      {renderStep()}
    </SetupWizard>
  )
}
