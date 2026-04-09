import { useState, useRef, useEffect, useCallback } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { SetupWizard } from '../components/setup/SetupWizard'
import { Step1CreateAccount } from '../components/setup/steps/Step1CreateAccount'
import { type Step2SensorSetupHandle } from '../components/setup/steps/Step2SensorSetup'
import { Step3AssignCustomer } from '../components/setup/steps/Step3AssignCustomer'
import { Step3StandardSensorUnified } from '../components/setup/steps/Step3StandardSensorUnified'
import { Step4WifiSensorUnified } from '../components/setup/steps/Step4WifiSensorUnified'
import { StandardSensorManifoldStep } from '../components/setup/steps/StandardSensorManifoldStep'
import {
  parseSensorSetupModelParam,
  type SensorSetupModelSlug,
  SENSOR_SETUP_MODEL_CHOICE_HREF,
  SENSOR_STANDARD_SHORT,
  SENSOR_WIFI_SHORT,
  PRODUCT_NAMES,
  buildSensorSetupHref,
} from '../config/acdwKnowledge'
import {
  mergeSearchTermLists,
  SENSOR_STANDARD_SETUP_SEARCH_TERMS,
  SENSOR_WIFI_SETUP_SEARCH_TERMS,
} from '../config/installationSearchTerms'
import type { PageSearchMeta } from '../config/siteSearchTypes'

function totalStepsForModel(model: SensorSetupModelSlug | null): number {
  if (model === 'standard') return 3
  if (model === 'wifi') return 5
  return 3
}

/** Wizard step index where on-site sensor install + Wi‑Fi UI lives (power, pairing, etc.). */
function physicalInstallStepIndex(model: SensorSetupModelSlug | null): number {
  if (model === 'standard') return 3
  if (model === 'wifi') return 4
  return 2
}

export function SensorSetupPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [wifiInteracted, setWifiInteracted] = useState(false)
  const [physicalOpened, setPhysicalOpened] = useState(false)
  const [step2Model, setStep2Model] = useState<'nonwifi' | 'wifi' | null>(null)
  /** Manifold prep/cure: Standard wizard step 2 or WiFi wizard step 3 — Continue disabled until Cure & Leak Test opened. */
  const [manifoldPrepCureReady, setManifoldPrepCureReady] = useState(false)
  const step2Ref = useRef<Step2SensorSetupHandle>(null)

  const urlModel = parseSensorSetupModelParam(searchParams.get('model'))
  const totalSteps = totalStepsForModel(urlModel)
  const physicalStep = physicalInstallStepIndex(urlModel)

  const mergeParams = useCallback(
    (
      updates: { step?: number; model?: SensorSetupModelSlug | null },
      replaceHistory = false
    ) => {
      const next = new URLSearchParams(searchParams)
      if (updates.step !== undefined) {
        next.set('step', String(updates.step))
      }
      if (updates.model !== undefined) {
        if (updates.model === null) {
          next.delete('model')
        } else {
          next.set('model', updates.model)
        }
      }
      setSearchParams(next, { replace: replaceHistory })
    },
    [searchParams, setSearchParams]
  )

  // Sync step + model from URL
  useEffect(() => {
    const stepParam = searchParams.get('step')
    if (!urlModel) {
      setCurrentStep(1)
      setWifiInteracted(false)
      setPhysicalOpened(false)
      setStep2Model(null)
      setManifoldPrepCureReady(false)
      return
    }

    const maxStep = totalStepsForModel(urlModel)

    if (stepParam) {
      const step = parseInt(stepParam, 10)
      if (step >= 1 && step <= maxStep) {
        setCurrentStep(step)
        if (urlModel === 'standard' && step === 1) {
          setManifoldPrepCureReady(false)
        }
        if (urlModel === 'wifi' && step === 2) {
          setManifoldPrepCureReady(false)
        }
        const phys = physicalInstallStepIndex(urlModel)
        if (step !== phys) {
          setWifiInteracted(false)
          setPhysicalOpened(false)
          setStep2Model(null)
        }
      } else {
        mergeParams({ step: 1 }, true)
        setCurrentStep(1)
        if (urlModel === 'standard') setManifoldPrepCureReady(false)
        if (urlModel === 'wifi') setManifoldPrepCureReady(false)
      }
    } else {
      mergeParams({ step: 1 }, true)
      setCurrentStep(1)
      if (urlModel === 'standard') setManifoldPrepCureReady(false)
      if (urlModel === 'wifi') setManifoldPrepCureReady(false)
    }
  }, [searchParams, urlModel, mergeParams])

  /** Going back to the measure manifold step resets the prep/cure gate. */
  useEffect(() => {
    if (urlModel === 'standard' && currentStep === 1) {
      setManifoldPrepCureReady(false)
    }
    if (urlModel === 'wifi' && currentStep === 2) {
      setManifoldPrepCureReady(false)
    }
  }, [urlModel, currentStep])

  const handleStepChange = (step: number) => {
    if (!urlModel) return
    const maxStep = totalStepsForModel(urlModel)
    if (step >= 1 && step <= maxStep) {
      if (urlModel === 'standard' && step === 1) {
        setManifoldPrepCureReady(false)
      }
      if (urlModel === 'wifi' && step === 2) {
        setManifoldPrepCureReady(false)
      }
      setCurrentStep(step)
      mergeParams({ step })
      const phys = physicalInstallStepIndex(urlModel)
      if (step !== phys) {
        setWifiInteracted(false)
        setPhysicalOpened(false)
        setStep2Model(null)
      }
    }
  }

  const handleWifiInteraction = () => {
    setWifiInteracted(true)
  }

  const handleContinueClick = (): boolean => {
    if (!urlModel) return false
    if (currentStep === physicalStep && step2Ref.current) {
      return step2Ref.current.handleContinueClick()
    }
    return false
  }

  const renderStep = () => {
    if (!urlModel) return null

    if (urlModel === 'standard') {
      switch (currentStep) {
        case 1:
          return <StandardSensorManifoldStep key="standard-manifold-measure" phase="measure" />
        case 2:
          return (
            <StandardSensorManifoldStep
              key="standard-manifold-prep-cure"
              phase="prepCure"
              onManifoldInstallReady={() => setManifoldPrepCureReady(true)}
            />
          )
        case 3:
          return (
            <Step3StandardSensorUnified
              ref={step2Ref}
              key="step-standard-unified"
              onWifiInteraction={handleWifiInteraction}
              onPhysicalOpened={() => setPhysicalOpened(true)}
              onModelSelect={setStep2Model}
            />
          )
        default:
          return null
      }
    }

    // WiFi — 5 steps: account → manifold (measure → prep/cure) → install/Wi‑Fi → assign
    switch (currentStep) {
      case 1:
        return <Step1CreateAccount />
      case 2:
        return <StandardSensorManifoldStep key="wifi-manifold-measure" phase="measure" flow="wifi" />
      case 3:
        return (
          <StandardSensorManifoldStep
            key="wifi-manifold-prep-cure"
            phase="prepCure"
            flow="wifi"
            onManifoldInstallReady={() => setManifoldPrepCureReady(true)}
          />
        )
      case 4:
        return (
          <Step4WifiSensorUnified
            ref={step2Ref}
            key="step-wifi-install-unified"
            onWifiInteraction={handleWifiInteraction}
            onPhysicalOpened={() => setPhysicalOpened(true)}
            onModelSelect={setStep2Model}
          />
        )
      case 5:
        return <Step3AssignCustomer setupModel="wifi" wizardStepNumber={5} />
      default:
        return null
    }
  }

  const isContinueDisabled =
    (urlModel === 'standard' && currentStep === 2 && !manifoldPrepCureReady) ||
    (urlModel === 'wifi' && currentStep === 3 && !manifoldPrepCureReady) ||
    (currentStep === physicalStep &&
      (step2Model === null ||
        (step2Model === 'nonwifi' && !physicalOpened) ||
        (step2Model === 'wifi' && !wifiInteracted)))

  if (!urlModel) {
    return <Navigate to={SENSOR_SETUP_MODEL_CHOICE_HREF} replace />
  }

  const wizardHeaderTitle =
    urlModel === 'standard'
      ? `${SENSOR_STANDARD_SHORT} Setup`
      : `${SENSOR_WIFI_SHORT} Setup`

  return (
    <SetupWizard
      totalSteps={totalSteps}
      currentStep={currentStep}
      onStepChange={handleStepChange}
      continueLabel={currentStep === totalSteps ? 'Finish' : 'Continue'}
      isContinueDisabled={isContinueDisabled}
      onContinueClick={handleContinueClick}
      headerTitle={wizardHeaderTitle}
    >
      {renderStep()}
    </SetupWizard>
  )
}

export const SENSOR_SETUP_SEARCH_ENTRIES: PageSearchMeta[] = [
  {
    id: 'guide-sensor-setup',
    kind: 'how-to',
    title: 'Sensor setup guide',
    body: `How to install the ${PRODUCT_NAMES.sensor}, ${SENSOR_STANDARD_SHORT}, and ${SENSOR_WIFI_SHORT}. Start from Installation & Setup to choose your model, then open the step-by-step wizard. Transparent T manifold, bayonet port. ${SENSOR_WIFI_SHORT} includes a backup battery in the box; the guided steps cover battery door, polarity, 24V cable, and power before Wi‑Fi pairing. WiFi Sensor uses the monitoring dashboard; Wi-Fi requires a 2.4 GHz network. Create account, assign customer, on-site install steps.`,
    tags: [
      'sensor',
      'install',
      'installation',
      'wifi',
      'wi-fi',
      'setup',
      'how to',
      'pairing',
      'monitoring',
      'manifold',
      'battery',
      'backup battery',
      'power',
    ],
    searchTerms: mergeSearchTermLists(SENSOR_STANDARD_SETUP_SEARCH_TERMS, SENSOR_WIFI_SETUP_SEARCH_TERMS),
    href: SENSOR_SETUP_MODEL_CHOICE_HREF,
  },
  {
    id: 'guide-wifi-sensor-setup',
    kind: 'how-to',
    title: `${SENSOR_WIFI_SHORT} — setup guide`,
    body: `${SENSOR_WIFI_SHORT} installation wizard: unboxing (24V cable, backup battery), lithium-ion backup ~2 years with low-battery warning in the monitoring platform, battery door and polarity, 24V or battery power, LED when awaiting Wi‑Fi, WPS or manual pairing, 2.4 GHz Wi‑Fi only, contractor account, dashboard, assign sensor to customer.`,
    tags: [
      'battery',
      'backup battery',
      'wifi',
      'wi-fi',
      'sensor',
      'install',
      'pairing',
      'portal',
      'monitoring',
    ],
    searchTerms: SENSOR_WIFI_SETUP_SEARCH_TERMS,
    href: buildSensorSetupHref({ model: 'wifi', step: 1 }),
  },
  {
    id: 'guide-standard-sensor-setup',
    kind: 'how-to',
    title: `${SENSOR_STANDARD_SHORT} — setup guide`,
    body: `${SENSOR_STANDARD_SHORT} wizard: Transparent T manifold measure, primer and cement on cut pipe ends and horizontal sockets only, cure, leak test, sensor power and LED check, mount and lock sensor—no home Wi‑Fi step in this guide.`,
    tags: ['sensor', 'standard', 'non-wifi', 'install', 'manifold'],
    searchTerms: SENSOR_STANDARD_SETUP_SEARCH_TERMS,
    href: buildSensorSetupHref({ model: 'standard', step: 1 }),
  },
]
