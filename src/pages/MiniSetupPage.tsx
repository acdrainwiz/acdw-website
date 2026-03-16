import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SetupWizard } from '../components/setup/SetupWizard'
import { Step1MiniPreparation } from '../components/setup/steps/Step1MiniPreparation'
import { Step2MiniInstallation } from '../components/setup/steps/Step2MiniInstallation'
import { Step3MiniCompletion } from '../components/setup/steps/Step3MiniCompletion'

const TOTAL_STEPS = 3

export function MiniSetupPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)

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
      setCurrentStep(step)
      setSearchParams({ step: step.toString() }, { replace: false })
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1MiniPreparation />
      case 2:
        return <Step2MiniInstallation />
      case 3:
        return <Step3MiniCompletion />
      default:
        return null
    }
  }

  return (
    <SetupWizard
      totalSteps={TOTAL_STEPS}
      currentStep={currentStep}
      onStepChange={handleStepChange}
      continueLabel={currentStep === TOTAL_STEPS ? 'Finish' : 'Continue'}
    >
      {renderStep()}
    </SetupWizard>
  )
}
