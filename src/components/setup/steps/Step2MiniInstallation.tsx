import { useState, useRef, useEffect } from 'react'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

const prepSteps = [
  {
    number: 1,
    title: 'Deburr Both Pipe Ends',
    description: 'Using a deburring tool or utility knife, remove all plastic burrs and shavings from the inside and outside of both cut pipe ends. Burrs left inside the pipe can break free over time and cause blockages downstream.',
    image: '/images/mini-setup/step2-deburr.jpg',
    alt: 'Deburring the cut PVC pipe end',
  },
  {
    number: 2,
    title: 'Chamfer the Outside Edge',
    description: 'Apply a 10–15° bevel to the outside edge of each pipe end using a chamfering tool or file. This prevents the sharp edge from scraping cement off the fitting socket walls during insertion, which is a leading cause of weak joints and leaks.',
    image: '/images/mini-setup/step2-chamfer.jpg',
    alt: 'Chamfering the outside edge of the PVC pipe',
  },
  {
    number: 3,
    title: 'Dry-Fit First',
    description: 'Before applying any chemicals, slide each pipe end into the corresponding socket of the Mini T-Manifold. The pipe should insert approximately one-third to two-thirds of the way into the socket — this is the correct interference fit. Confirm the T-Manifold cap opening points straight upward at a 90° angle. Address any alignment issues now — repositioning after cementing is not possible.',
    image: '/images/mini-setup/step2-dry-fit.jpg',
    alt: 'Dry-fitting the PVC pipe into the Mini T-Manifold sockets',
  },
  {
    number: 4,
    title: 'Clean Pipe Ends & Fitting Sockets',
    description: 'Wipe both pipe ends and the inside of both fitting sockets with a clean rag to remove any dirt, dust, oil, or moisture. Contamination on the bonding surface weakens the chemical weld.',
    image: '/images/mini-setup/step2-clean.jpg',
    alt: 'Cleaning the pipe ends and fitting sockets',
  },
  {
    number: 5,
    title: 'Apply Primer',
    description: 'Apply PVC primer to the inside of each fitting socket first, then to each pipe end, then back to each fitting socket once more. Primer is not optional — it chemically softens the PVC surface so the cement can create a true molecular weld rather than a surface bond. Work both sides in sequence and move to cementing while the primer is still wet (within 5 minutes).',
    image: '/images/mini-setup/step2-primer.jpg',
    alt: 'Applying PVC primer to fitting sockets and pipe ends',
  },
  {
    number: 6,
    title: 'Apply Oatey All-Purpose Cement',
    description: 'While primer is still wet, apply a liberal, even coat of Oatey All-Purpose Cement to each pipe end first, then to each fitting socket, then one final coat back onto each pipe end. Avoid puddling — excess cement pooled inside the socket can weaken the joint.',
    image: '/images/mini-setup/step2-cement.jpg',
    alt: 'Applying Oatey cement to the pipe ends and sockets',
  },
  {
    number: 7,
    title: 'Join & Hold',
    description: 'Working quickly and with confidence, slide both pipe ends simultaneously into their respective T-Manifold sockets, giving each a firm quarter-turn as it seats. Hold each joint under steady pressure for 30 seconds. Do not twist or adjust after that point — the bond has begun forming. Immediately wipe away any excess cement that squeezes out at the joint.',
    image: '/images/mini-setup/step2-join-hold.jpg',
    alt: 'Joining the PVC pipe to the Mini T-Manifold with a quarter-turn',
  },
  {
    number: 8,
    title: 'Verify Orientation',
    description: 'Before the cement sets, visually confirm that the T-Manifold cap opening points straight upward — perpendicular to the drain line — and that the assembly sits level. This ensures proper gravity drainage when the line is in service and clean access for future servicing.',
    image: '/images/mini-setup/step2-verify-orientation.jpg',
    alt: 'Verifying the T-Manifold is upright at 90 degrees',
  },
]

const cureSteps = [
  {
    number: 1,
    title: 'Allow the Joint to Cure',
    description: 'Do not disturb the assembly. At temperatures above 60°F (16°C), the cement reaches handling strength in approximately 15–30 minutes. However, for a non-pressure drain line installation, allow a minimum of 2 hours before introducing water. The professional standard — and what we recommend — is to wait 24 hours before placing the line into full service. Cold or humid conditions extend cure time.',
    image: '/images/mini-setup/step2-cure-wait.jpg',
    alt: 'Allowing the PVC cement joint to cure',
    note: 'Minimum 2 hours at >60°F for drain lines. 24 hours recommended for full cure.',
    isWarning: false,
    isCure: true,
  },
  {
    number: 2,
    title: 'Test for Leaks',
    description: 'After the required cure time, restore power to the AC unit and allow condensate to flow through the drain line naturally, or introduce a small amount of water slowly from the pan side. Observe both joints closely for 60 seconds for any seepage, drips, or moisture at the connection points.',
    image: '/images/mini-setup/step2-leak-test.jpg',
    alt: 'Testing the drain line joints for leaks after cure',
  },
  {
    number: 3,
    title: 'If a Leak Is Present',
    description: 'Do not attempt to re-cement over an existing joint. PVC solvent cement creates a permanent chemical bond — if leakage is visible, the joint must be cut out and the installation must be repeated with a new section of pipe and fresh cement. Contact AC Drain Wiz support if you need assistance.',
    image: '/images/mini-setup/step2-no-leaks.jpg',
    alt: 'Confirming no leaks at the T-Manifold joints',
    isWarning: true,
  },
]

export interface Step2MiniInstallationProps {
  /** Called once when the user opens the second accordion (Cure & Leak Test). Used to enable the Continue button. */
  onSecondAccordionOpened?: () => void
  /** Sensor Standard guide: hide duplicate wizard badge; copy references T manifold from Sensor package */
  variant?: 'mini' | 'sensorStandard'
  /**
   * Standard Sensor manifold step: parent coordinates one open drawer with Part A (Measure & Cut).
   * When `onPrepCureToggle` is set, expanded state is controlled; omit for Mini setup.
   */
  expandedPrepCure?: 'prep' | 'cure' | null
  onPrepCureToggle?: (section: 'prep' | 'cure') => void
  /** Standard Sensor manifold: parent controls which drawer pulses (next linear step, collapsed). */
  pulsePrep?: boolean
  pulseCure?: boolean
  /** When parent renders the full wizard hero (e.g. split manifold steps), hide duplicate Part B heading. */
  hideSensorPartHeading?: boolean
}

function adaptMiniStepsForSensor<T extends { title: string; description: string }>(steps: T[]): T[] {
  return steps.map((step) => ({
    ...step,
    title: step.title.replace(/Mini T-Manifold/g, 'T-Manifold'),
    description: step.description
      .replace(/Mini T-Manifold/g, 'T-Manifold')
      .replace(/the Mini T-Manifold sockets/g, 'the T-Manifold sockets')
      .replace(/of the Mini T-Manifold/g, 'of the T-Manifold'),
  }))
}

const DELAY_OPEN_PREP_MS = 2000

export function Step2MiniInstallation({
  onSecondAccordionOpened,
  variant = 'mini',
  expandedPrepCure,
  onPrepCureToggle,
  pulsePrep: pulsePrepFromParent,
  pulseCure: pulseCureFromParent,
  hideSensorPartHeading = false,
}: Step2MiniInstallationProps) {
  const isSensor = variant === 'sensorStandard'
  /** Linear substeps for install: Measure & Cut = 1 (step 1 page), Prep = 2, Cure = 3 — same for Mini and Standard Sensor manifold. */
  const prepDrawerBadgeNumber = 2
  const cureDrawerBadgeNumber = 3
  const isPrepCureControlled = Boolean(onPrepCureToggle)
  const prepStepsDisplay = isSensor ? adaptMiniStepsForSensor(prepSteps) : prepSteps
  const cureStepsDisplay = isSensor ? adaptMiniStepsForSensor(cureSteps) : cureSteps
  const [internalExpandedSection, setInternalExpandedSection] = useState<'prep' | 'cure' | null>(null)
  const expandedSection = isPrepCureControlled ? (expandedPrepCure ?? null) : internalExpandedSection
  const [internalPrepOpened, setInternalPrepOpened] = useState(false)
  const [internalCureHasBeenOpened, setInternalCureHasBeenOpened] = useState(false)
  const secondAccordionNotifiedRef = useRef(false)

  /** Pulse: parent drives Standard Sensor; Mini uses linear prep → cure when uncontrolled. */
  const pulsePrepEffective =
    isSensor && isPrepCureControlled
      ? Boolean(pulsePrepFromParent)
      : !isPrepCureControlled && !internalPrepOpened && expandedSection !== 'prep'
  const pulseCureEffective =
    isSensor && isPrepCureControlled
      ? Boolean(pulseCureFromParent)
      : !isPrepCureControlled && internalPrepOpened && !internalCureHasBeenOpened && expandedSection !== 'cure'

  // After page load, open Prep & Bond after 2s without scrolling the page (drawer expands below; viewport stays anchored).
  useEffect(() => {
    if (isSensor || isPrepCureControlled) return
    const t = setTimeout(() => {
      setInternalExpandedSection('prep')
      setInternalPrepOpened(true)
    }, DELAY_OPEN_PREP_MS)
    return () => clearTimeout(t)
  }, [isSensor, isPrepCureControlled])

  const toggleSection = (section: 'prep' | 'cure') => {
    if (isPrepCureControlled) {
      onPrepCureToggle!(section)
      return
    }
    if (internalExpandedSection === section) {
      setInternalExpandedSection(null)
    } else {
      setInternalExpandedSection(section)
      if (section === 'prep' && !internalPrepOpened) {
        setInternalPrepOpened(true)
      }
      if (section === 'cure') {
        setInternalCureHasBeenOpened(true)
        if (!secondAccordionNotifiedRef.current && onSecondAccordionOpened) {
          secondAccordionNotifiedRef.current = true
          onSecondAccordionOpened()
        }
      }
    }
  }

  return (
    <div className="mini-setup-step-container">
      {!isSensor && (
        <>
          {/* Step Number Badge */}
          <div className="mini-setup-step-badge-wrapper">
            <div className="mini-setup-step-badge mini-setup-step-badge-step2">
              <span className="mini-setup-step-badge-number">2</span>
            </div>
          </div>

          {/* Step Title */}
          <div className="mini-setup-step-title-section">
            <h2 className="mini-setup-step-title">Cement & Install</h2>
            <p className="mini-setup-step-subtitle">
              Prep the pipe ends, bond the T-Manifold permanently, allow the cement to cure, and verify a leak-free installation
            </p>
          </div>
        </>
      )}

      {isSensor && !hideSensorPartHeading && (
        <div className="mini-setup-step-title-section mini-setup-step-title-section-sensor-part">
          <h3 className="text-lg font-semibold text-gray-900">Part B — Cement &amp; install</h3>
          <p className="mini-setup-step-subtitle mt-1">
            Prep pipe ends, solvent-weld the T manifold, cure, and leak-test—same procedure as the AC Drain Wiz Mini.
          </p>
        </div>
      )}

      {/* Safety reminder */}
      <div className="mini-setup-notice-callout">
        <div className="mini-setup-notice-callout-content">
          <ExclamationTriangleIcon className="mini-setup-notice-callout-icon" />
          <div className="mini-setup-notice-callout-text">
            <p className="mini-setup-notice-callout-title">Work in a Ventilated Area</p>
            <p className="mini-setup-notice-callout-description">
              Solvent cement and primer contain strong chemicals. Wear safety glasses and gloves, and ensure adequate airflow before opening either product. Keep lids sealed when not actively applying.
            </p>
          </div>
        </div>
      </div>

      {/* Accordion 1: Prep & Bond */}
      <div
        className={`mini-setup-accordion-section ${expandedSection === 'prep' ? 'mini-setup-accordion-section-expanded' : 'mini-setup-accordion-section-collapsed'} ${pulsePrepEffective ? 'mini-setup-accordion-section-pulsating' : ''}`}
      >
        <button
          className="mini-setup-accordion-header"
          onClick={() => toggleSection('prep')}
          aria-expanded={expandedSection === 'prep'}
        >
          <div className="mini-setup-accordion-header-content">
            <div className="mini-setup-accordion-header-left">
              <div className="mini-setup-accordion-wizard-step-badge" aria-hidden>
                <span className="mini-setup-accordion-wizard-step-badge-number">{prepDrawerBadgeNumber}</span>
              </div>
              <span className="mini-setup-accordion-title">Prep &amp; Bond</span>
            </div>
            <div className="mini-setup-accordion-header-right">
              <span className="mini-setup-accordion-badge mini-setup-accordion-badge-ready">
                {prepStepsDisplay.length} Steps
              </span>
              {expandedSection === 'prep' ? (
                <ChevronUpIcon className="mini-setup-accordion-chevron" />
              ) : (
                <ChevronDownIcon className="mini-setup-accordion-chevron" />
              )}
            </div>
          </div>
        </button>

        {expandedSection === 'prep' && (
          <div className="mini-setup-accordion-content">
            <div className="sensor-setup-installation-steps mini-setup-accordion-sensor-steps">
              {prepStepsDisplay.map((step) => (
                <div key={step.number} className="sensor-setup-installation-step-card">
                  <div className="sensor-setup-installation-step-content">
                    <div className="sensor-setup-installation-step-number-wrapper">
                      <div className="sensor-setup-installation-step-number-badge">
                        <span className="sensor-setup-installation-step-number">{step.number}</span>
                      </div>
                    </div>
                    <div className="sensor-setup-installation-step-details">
                      <h3 className="sensor-setup-installation-step-title">{step.title}</h3>
                      <p className="sensor-setup-installation-step-description">{step.description}</p>
                      <div className="sensor-setup-installation-step-image-wrapper">
                        <img
                          src={step.image}
                          alt={step.alt}
                          className="sensor-setup-installation-step-image"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Accordion 2: Cure & Leak Test */}
      <div
        className={`mini-setup-accordion-section ${expandedSection === 'cure' ? 'mini-setup-accordion-section-expanded' : 'mini-setup-accordion-section-collapsed'} ${pulseCureEffective ? 'mini-setup-accordion-section-pulsating' : ''}`}
      >
        <button
          className="mini-setup-accordion-header"
          onClick={() => toggleSection('cure')}
          aria-expanded={expandedSection === 'cure'}
        >
          <div className="mini-setup-accordion-header-content">
            <div className="mini-setup-accordion-header-left">
              <div className="mini-setup-accordion-wizard-step-badge" aria-hidden>
                <span className="mini-setup-accordion-wizard-step-badge-number">{cureDrawerBadgeNumber}</span>
              </div>
              <span className="mini-setup-accordion-title">Cure &amp; Leak Test</span>
            </div>
            <div className="mini-setup-accordion-header-right">
              <span className="mini-setup-accordion-badge mini-setup-accordion-badge-ready">
                {cureStepsDisplay.length} Steps
              </span>
              {expandedSection === 'cure' ? (
                <ChevronUpIcon className="mini-setup-accordion-chevron" />
              ) : (
                <ChevronDownIcon className="mini-setup-accordion-chevron" />
              )}
            </div>
          </div>
        </button>

        {expandedSection === 'cure' && (
          <div className="mini-setup-accordion-content">
            <div className="sensor-setup-installation-steps mini-setup-accordion-sensor-steps">
              {cureStepsDisplay.map((step) => (
                <div
                  key={step.number}
                  className={`sensor-setup-installation-step-card ${
                    step.isWarning ? 'mini-setup-installation-step-card-warning' : ''
                  }`}
                >
                  <div className="sensor-setup-installation-step-content">
                    <div className="sensor-setup-installation-step-number-wrapper">
                      <div
                        className={`sensor-setup-installation-step-number-badge ${
                          step.isWarning ? 'mini-setup-installation-step-number-badge-warning' : ''
                        }`}
                      >
                        {step.isWarning ? (
                          <ExclamationTriangleIcon className="mini-setup-installation-step-warning-icon" />
                        ) : (
                          <span className="sensor-setup-installation-step-number">{step.number}</span>
                        )}
                      </div>
                    </div>
                    <div className="sensor-setup-installation-step-details">
                      <h3
                        className={`sensor-setup-installation-step-title ${
                          step.isWarning ? 'mini-setup-installation-step-title-warning' : ''
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="sensor-setup-installation-step-description">{step.description}</p>
                      {step.isCure && (
                        <div className="mini-setup-cure-time-badge">
                          <ClockIcon className="mini-setup-cure-time-badge-icon" />
                          <span>Minimum 2 hrs (drain line) — 24 hrs recommended for full cure</span>
                        </div>
                      )}
                      <div className="sensor-setup-installation-step-image-wrapper">
                        <img
                          src={step.image}
                          alt={step.alt}
                          className="sensor-setup-installation-step-image"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
