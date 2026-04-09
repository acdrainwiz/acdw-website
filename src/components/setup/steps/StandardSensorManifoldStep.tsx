import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { Step1MiniPreparation } from './Step1MiniPreparation'
import { Step2MiniInstallation } from './Step2MiniInstallation'

export type StandardSensorManifoldPhase = 'measure' | 'prepCure'

/** `standard` = 3-step Standard Sensor wizard; `wifi` = WiFi wizard after account (manifold is steps 2–3). */
export type StandardSensorManifoldFlow = 'standard' | 'wifi'

interface StandardSensorManifoldStepProps {
  /** Part A (wizard step 1) = measure & cut only; Part B (wizard step 2) = prep/bond + cure/leak test — matches Mini setup split. */
  phase: StandardSensorManifoldPhase
  /** prepCure phase only: fires when user opens Cure & Leak Test (required before Continue). */
  onManifoldInstallReady?: () => void
  /** When `wifi`, manifold steps are wizard 2–3 (unbox at start of measure); default `standard` is wizard 1–2. */
  flow?: StandardSensorManifoldFlow
}

type MeasureDrawerId = 'measure' | null
type PrepCureDrawerId = 'prep' | 'cure' | null

/** Match `Step2MiniInstallation` — open Prep & Bond shortly after load (Mini standalone behavior). */
const DELAY_OPEN_PREP_MS = 2000

/**
 * Standard Sensor: install the Transparent T manifold using the same flow as the AC Drain Wiz Mini.
 * Split across two wizard steps (measure/cut → cement/cure) like `/mini-setup` steps 1–2.
 */
export function StandardSensorManifoldStep({
  phase,
  onManifoldInstallReady,
  flow = 'standard',
}: StandardSensorManifoldStepProps) {
  if (phase === 'measure') {
    return <StandardSensorManifoldMeasurePhase flow={flow} />
  }
  if (!onManifoldInstallReady) {
    throw new Error('StandardSensorManifoldStep: onManifoldInstallReady is required when phase is prepCure')
  }
  return <StandardSensorManifoldPrepCurePhase flow={flow} onManifoldInstallReady={onManifoldInstallReady} />
}

function StandardSensorManifoldMeasurePhase({ flow }: { flow: StandardSensorManifoldFlow }) {
  const [openDrawer, setOpenDrawer] = useState<MeasureDrawerId>('measure')
  const [measureOpenedEver, setMeasureOpenedEver] = useState(false)
  const prevOpenDrawerRef = useRef<MeasureDrawerId>(openDrawer)

  useEffect(() => {
    if (prevOpenDrawerRef.current === 'measure' && openDrawer === null) {
      setMeasureOpenedEver(true)
    }
    prevOpenDrawerRef.current = openDrawer
  }, [openDrawer])

  const toggleDrawer = () => {
    setOpenDrawer((prev) => (prev === 'measure' ? null : 'measure'))
  }

  const nextDrawer: 'measure' | null = !measureOpenedEver ? 'measure' : null
  const pulseMeasure = nextDrawer === 'measure' && openDrawer !== 'measure'

  const isWifi = flow === 'wifi'

  return (
    <div className="sensor-standard-manifold-wrapper">
      <Step1MiniPreparation
        variant="sensorStandard"
        measureCutExpanded={openDrawer === 'measure'}
        onMeasureCutToggle={toggleDrawer}
        measureShouldPulse={pulseMeasure}
        sensorUnboxCopy={isWifi ? 'wifi' : 'standard'}
        wizardHeroStepNumber={isWifi ? 2 : 1}
      />
    </div>
  )
}

function StandardSensorManifoldPrepCurePhase({
  flow,
  onManifoldInstallReady,
}: {
  flow: StandardSensorManifoldFlow
  onManifoldInstallReady: () => void
}) {
  const [openDrawer, setOpenDrawer] = useState<PrepCureDrawerId>(null)
  const [prepOpenedEver, setPrepOpenedEver] = useState(false)
  const [cureOpenedEver, setCureOpenedEver] = useState(false)
  const cureReadyNotifiedRef = useRef(false)

  // After load, open Prep & Bond after 2s (same as Mini setup step 2); viewport stays anchored — no scroll.
  useEffect(() => {
    let cancelled = false
    const t = setTimeout(() => {
      if (cancelled) return
      setOpenDrawer((prev) => {
        if (prev !== null) return prev
        return 'prep'
      })
    }, DELAY_OPEN_PREP_MS)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    if (openDrawer === 'prep') setPrepOpenedEver(true)
  }, [openDrawer])

  useEffect(() => {
    if (openDrawer === 'cure') {
      setPrepOpenedEver(true)
      setCureOpenedEver(true)
    }
  }, [openDrawer])

  const toggleDrawer = (id: 'prep' | 'cure') => {
    setOpenDrawer((prev) => {
      const next = prev === id ? null : id
      if (next === 'cure' && !cureReadyNotifiedRef.current) {
        cureReadyNotifiedRef.current = true
        onManifoldInstallReady()
      }
      return next
    })
  }

  const expandedPrepCure: 'prep' | 'cure' | null =
    openDrawer === 'prep' ? 'prep' : openDrawer === 'cure' ? 'cure' : null

  const nextDrawer: 'prep' | 'cure' | null = !prepOpenedEver ? 'prep' : !cureOpenedEver ? 'cure' : null
  const pulsePrep = nextDrawer === 'prep' && openDrawer !== 'prep'
  const pulseCure = nextDrawer === 'cure' && openDrawer !== 'cure'

  const isWifi = flow === 'wifi'
  const prepWizardStep = isWifi ? 3 : 2
  const prepBadgeClass =
    prepWizardStep === 3 ? 'sensor-setup-step-badge sensor-setup-step-badge-step3' : 'sensor-setup-step-badge sensor-setup-step-badge-step2'

  return (
    <div className="sensor-standard-manifold-wrapper">
      <div className="sensor-setup-step-container sensor-standard-manifold-intro">
        <div className="sensor-setup-step-badge-wrapper">
          <div className={prepBadgeClass}>
            <span className="sensor-setup-step-badge-number">{prepWizardStep}</span>
          </div>
        </div>
        <div className="sensor-setup-step-title-section">
          <h2 className="sensor-setup-step-title">Cement &amp; install the T manifold</h2>
          <p className="sensor-setup-step-subtitle">
            {isWifi ? (
              <>
                Step 3 of 5: prep pipe ends, solvent-weld only the horizontal drain joints on the Transparent T manifold, allow the cement to cure, and leak-test—same procedure as the AC Drain Wiz Mini setup guide (step 2).
              </>
            ) : (
              <>
                Step 2 of 2: prep pipe ends, solvent-weld only the horizontal drain joints on the Transparent T manifold, allow the cement to cure, and leak-test—same procedure as the AC Drain Wiz Mini setup guide (step 2).
              </>
            )}
          </p>
          <p className="sensor-standard-manifold-reference">
            <Link to="/mini-setup?step=2" className="sensor-standard-manifold-reference-link">
              <ArrowTopRightOnSquareIcon className="sensor-standard-manifold-reference-icon" aria-hidden />
              Open the full Mini installation guide (reference)
            </Link>
          </p>
        </div>
      </div>

      <Step2MiniInstallation
        variant="sensorStandard"
        expandedPrepCure={expandedPrepCure}
        onPrepCureToggle={(section) => toggleDrawer(section)}
        pulsePrep={pulsePrep}
        pulseCure={pulseCure}
        hideSensorPartHeading
      />
    </div>
  )
}
