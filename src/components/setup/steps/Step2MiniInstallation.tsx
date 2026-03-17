import { useState, useRef, useEffect } from 'react'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
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

interface Step2MiniInstallationProps {
  /** Called once when the user opens the second accordion (Cure & Leak Test). Used to enable the Continue button. */
  onSecondAccordionOpened?: () => void
}

const DELAY_OPEN_PREP_MS = 2000

export function Step2MiniInstallation({ onSecondAccordionOpened }: Step2MiniInstallationProps) {
  const [expandedSection, setExpandedSection] = useState<'prep' | 'cure' | null>(null)
  const [prepOpened, setPrepOpened] = useState(false)
  const [cureHasBeenOpened, setCureHasBeenOpened] = useState(false)
  const [isCureSectionInView, setIsCureSectionInView] = useState(false)
  const secondAccordionNotifiedRef = useRef(false)
  const skipPrepScrollRef = useRef(false)
  const prepContentRef = useRef<HTMLDivElement>(null)
  const cureContentRef = useRef<HTMLDivElement>(null)
  const cureSectionRef = useRef<HTMLDivElement>(null)

  // After page load, open the first drawer in place after 2s — no scroll or focus change.
  useEffect(() => {
    const t = setTimeout(() => {
      skipPrepScrollRef.current = true
      setExpandedSection('prep')
      setPrepOpened(true)
    }, DELAY_OPEN_PREP_MS)
    return () => clearTimeout(t)
  }, [])

  // Pulse the second accordion when it scrolls into view (until the user opens it).
  useEffect(() => {
    const el = cureSectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setIsCureSectionInView(entry.isIntersecting),
      { threshold: 0.2, rootMargin: '0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const toggleSection = (section: 'prep' | 'cure') => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
      if (section === 'prep' && !prepOpened) {
        setPrepOpened(true)
      }
      if (section === 'cure') {
        setCureHasBeenOpened(true)
        if (!secondAccordionNotifiedRef.current && onSecondAccordionOpened) {
          secondAccordionNotifiedRef.current = true
          onSecondAccordionOpened()
        }
      }
    }
  }

  useEffect(() => {
    if (expandedSection === 'prep') {
      if (skipPrepScrollRef.current) {
        skipPrepScrollRef.current = false
        return
      }
      if (prepContentRef.current) {
        setTimeout(() => {
          prepContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    }
    if (expandedSection === 'cure' && cureContentRef.current) {
      setTimeout(() => {
        cureContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [expandedSection])

  return (
    <div className="mini-setup-step-container">
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
        className={`mini-setup-accordion-section ${expandedSection === 'prep' ? 'mini-setup-accordion-section-expanded' : 'mini-setup-accordion-section-collapsed'} ${!prepOpened ? 'mini-setup-accordion-section-pulsating' : ''}`}
      >
        <button
          className="mini-setup-accordion-header"
          onClick={() => toggleSection('prep')}
          aria-expanded={expandedSection === 'prep'}
        >
          <div className="mini-setup-accordion-header-content">
            <div className="mini-setup-accordion-header-left">
              {prepOpened ? (
                <CheckCircleIcon className="mini-setup-accordion-status-icon mini-setup-accordion-status-icon-complete" />
              ) : (
                <div className="mini-setup-accordion-status-icon mini-setup-accordion-status-icon-pending" />
              )}
              <span className="mini-setup-accordion-title">Prep &amp; Bond</span>
            </div>
            <div className="mini-setup-accordion-header-right">
              <span className={`mini-setup-accordion-badge ${prepOpened ? 'mini-setup-accordion-badge-complete' : 'mini-setup-accordion-badge-ready'}`}>
                {prepOpened ? 'Complete' : '8 Steps'}
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
          <div className="mini-setup-accordion-content" ref={prepContentRef}>
            <div className="mini-setup-installation-steps">
              {prepSteps.map((step) => (
                <div key={step.number} className="mini-setup-installation-step-card">
                  <div className="mini-setup-installation-step-content">
                    <div className="mini-setup-installation-step-number-wrapper">
                      <div className="mini-setup-installation-step-number-badge">
                        <span className="mini-setup-installation-step-number">{step.number}</span>
                      </div>
                    </div>
                    <div className="mini-setup-installation-step-details">
                      <h3 className="mini-setup-installation-step-title">{step.title}</h3>
                      <p className="mini-setup-installation-step-description">{step.description}</p>
                      <div className="mini-setup-installation-step-image-wrapper">
                        <img
                          src={step.image}
                          alt={step.alt}
                          className="mini-setup-installation-step-image"
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
        ref={cureSectionRef}
        className={`mini-setup-accordion-section ${expandedSection === 'cure' ? 'mini-setup-accordion-section-expanded' : 'mini-setup-accordion-section-collapsed'} ${isCureSectionInView && !cureHasBeenOpened ? 'mini-setup-accordion-section-pulsating' : ''}`}
      >
        <button
          className="mini-setup-accordion-header"
          onClick={() => toggleSection('cure')}
          aria-expanded={expandedSection === 'cure'}
        >
          <div className="mini-setup-accordion-header-content">
            <div className="mini-setup-accordion-header-left">
              <div className="mini-setup-accordion-status-icon mini-setup-accordion-status-icon-pending" />
              <span className="mini-setup-accordion-title">Cure &amp; Leak Test</span>
            </div>
            <div className="mini-setup-accordion-header-right">
              <span className="mini-setup-accordion-badge mini-setup-accordion-badge-ready">
                3 Steps
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
          <div className="mini-setup-accordion-content" ref={cureContentRef}>
            <div className="mini-setup-installation-steps">
              {cureSteps.map((step) => (
                <div key={step.number} className={`mini-setup-installation-step-card ${step.isWarning ? 'mini-setup-installation-step-card-warning' : ''}`}>
                  <div className="mini-setup-installation-step-content">
                    <div className="mini-setup-installation-step-number-wrapper">
                      <div className={`mini-setup-installation-step-number-badge ${step.isWarning ? 'mini-setup-installation-step-number-badge-warning' : ''}`}>
                        {step.isWarning ? (
                          <ExclamationTriangleIcon className="mini-setup-installation-step-warning-icon" />
                        ) : (
                          <span className="mini-setup-installation-step-number">{step.number}</span>
                        )}
                      </div>
                    </div>
                    <div className="mini-setup-installation-step-details">
                      <h3 className={`mini-setup-installation-step-title ${step.isWarning ? 'mini-setup-installation-step-title-warning' : ''}`}>{step.title}</h3>
                      <p className="mini-setup-installation-step-description">{step.description}</p>
                      {step.isCure && (
                        <div className="mini-setup-cure-time-badge">
                          <ClockIcon className="mini-setup-cure-time-badge-icon" />
                          <span>Minimum 2 hrs (drain line) — 24 hrs recommended for full cure</span>
                        </div>
                      )}
                      <div className="mini-setup-installation-step-image-wrapper">
                        <img
                          src={step.image}
                          alt={step.alt}
                          className="mini-setup-installation-step-image"
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
