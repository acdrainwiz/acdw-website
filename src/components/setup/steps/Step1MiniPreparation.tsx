import { useState } from 'react'
import {
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  ScissorsIcon,
  CubeIcon,
  BeakerIcon,
  HandRaisedIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline'

const tools = [
  {
    icon: ScissorsIcon,
    title: 'PVC Pipe Cutter or Fine-Tooth Saw',
    description: 'A dedicated pipe cutter produces the cleanest cut. A fine-tooth saw is acceptable if a cutter is unavailable.',
  },
  {
    icon: WrenchScrewdriverIcon,
    title: 'Deburring Tool or Utility Knife',
    description: 'Used to remove plastic burrs from inside and outside the pipe end after cutting.',
  },
  {
    icon: WrenchScrewdriverIcon,
    title: 'Chamfering Tool or File',
    description: 'Bevels the outside edge of the pipe at 10–15° to prevent cement from being scraped off during insertion.',
  },
  {
    icon: BeakerIcon,
    title: 'Oatey All-Purpose PVC Cement & Primer',
    description:
      'Primer softens PVC bonding surfaces for a true chemical weld. Apply only to the two cut drain pipe ends and the inner walls of the horizontal sockets—do not apply to the vertical bayonet port or inside the manifold beyond those joints.',
  },
  {
    icon: CubeIcon,
    title: 'AC Drain Wiz Mini Unit',
    description: 'The T-Manifold assembly including the bi-directional valve, standard cap, and storage cap.',
  },
  {
    icon: WrenchScrewdriverIcon,
    title: 'Measuring Tape or Calipers',
    description: 'For an accurate measurement of the Mini unit width before cutting the drain line.',
  },
  {
    icon: HandRaisedIcon,
    title: 'Safety Glasses & Gloves',
    description: 'Required when cutting PVC and applying solvent cement. Solvent cement contains strong chemicals — always work in a ventilated area.',
  },
  {
    icon: WrenchScrewdriverIcon,
    title: 'Clean Rags or Shop Cloth',
    description: 'For cleaning pipe ends and wiping excess cement after joining.',
  },
]

const measureStepsMini = [
  {
    number: 1,
    title: 'Measure the Mini T-Manifold Width',
    description: 'Hold the AC Drain Wiz Mini alongside the drain line and measure the full width of the T-Manifold from socket opening to socket opening. Both pipe ends will slide into these sockets, so you must account for the socket depth on each side when determining your cut length.',
    image: '/images/mini-setup/step1-measure-manifold.jpg',
    alt: 'Measuring the AC Drain Wiz Mini T-Manifold width against the drain line',
  },
  {
    number: 2,
    title: 'Mark the Cut Points on the Drain Line',
    description: 'Using a pencil or marker, clearly mark both cut points on the white PVC drain line. Double-check your measurements before cutting — over-cutting leaves a gap that cement cannot bridge, and under-cutting prevents the T-Manifold from seating flush.',
    image: '/images/mini-setup/step1-mark-cut-points.jpg',
    alt: 'Marking cut points on the PVC drain line',
  },
  {
    number: 3,
    title: 'Cut the Drain Line',
    description: 'Cut cleanly and squarely at both marked points. A pipe cutter is the preferred tool as it produces a straight, burr-free cut in a single pass. If using a saw, use smooth, controlled strokes and keep the blade perpendicular to the pipe. A square cut maximizes the bonding surface area for a stronger weld.',
    image: '/images/mini-setup/step1-cut-drain-line.jpg',
    alt: 'Cutting the PVC drain line at the marked points',
  },
]

const measureStepsSensor = measureStepsMini.map((step) =>
  step.number === 1
    ? {
        ...step,
        title: 'Measure the T-Manifold width',
        description:
          'Hold the Transparent T manifold (included with your Sensor) alongside the drain line and measure the full width from socket opening to socket opening. Both pipe ends will slide into these sockets, so you must account for the socket depth on each side when determining your cut length.',
      }
    : step
)

const toolsSensor = tools.map((tool) =>
  tool.title === 'AC Drain Wiz Mini Unit'
    ? {
        ...tool,
        title: 'Transparent T manifold',
        description:
          'Included with the Standard Sensor Switch; same T fitting geometry as the AC Drain Wiz Mini assembly (bayonet port faces up for the sensor).',
      }
    : tool
)

const SENSOR_UNBOX_COPY_STANDARD =
  'Remove the sensor from its packaging. Verify the 24V cable and Transparent T manifold are included before you measure and cut the drain line.'

const SENSOR_UNBOX_COPY_WIFI =
  'Remove the sensor from its packaging. Check that all components are included (24V cable; WiFi model also includes backup battery).'

export interface Step1MiniPreparationProps {
  /** Sensor Standard guide: same steps, copy references included T manifold instead of Mini SKU */
  variant?: 'mini' | 'sensorStandard'
  /**
   * Standard Sensor combined manifold step: parent coordinates one open drawer across Part A + B.
   * When set, `measureCutExpanded` / `onMeasureCutToggle` control the Measure & Cut accordion.
   */
  measureCutExpanded?: boolean
  onMeasureCutToggle?: () => void
  /** Standard Sensor: pulse when this drawer is the next linear step and collapsed. */
  measureShouldPulse?: boolean
  /** Sensor Standard: wizard step number in the hero badge (e.g. WiFi measure = 2). */
  wizardHeroStepNumber?: 1 | 2 | 3 | 4 | 5
  /** Sensor Standard: which unbox copy to use (WiFi mentions backup battery). */
  sensorUnboxCopy?: 'standard' | 'wifi'
}

export function Step1MiniPreparation({
  variant = 'mini',
  measureCutExpanded,
  onMeasureCutToggle,
  measureShouldPulse = false,
  wizardHeroStepNumber = 1,
  sensorUnboxCopy = 'standard',
}: Step1MiniPreparationProps) {
  const isSensor = variant === 'sensorStandard'
  const measureSteps = isSensor ? measureStepsSensor : measureStepsMini
  const toolsList = isSensor ? toolsSensor : tools
  /** Measure & Cut: local state (Mini step 1), or parent-controlled (Standard Sensor manifold page). */
  const isMeasureControlled = onMeasureCutToggle != null
  const [internalMeasureOpen, setInternalMeasureOpen] = useState(true)
  const measureCutOpen = isMeasureControlled ? Boolean(measureCutExpanded) : internalMeasureOpen

  const handleMeasureToggle = () => {
    if (isMeasureControlled) onMeasureCutToggle()
    else setInternalMeasureOpen((open) => !open)
  }

  const unboxDescription =
    sensorUnboxCopy === 'wifi' ? SENSOR_UNBOX_COPY_WIFI : SENSOR_UNBOX_COPY_STANDARD
  /** Placed after What You'll Need (same order for Standard and WiFi manifold measure steps). */
  const showUnboxAfterTools = isSensor
  const heroStepNumber = isSensor ? wizardHeroStepNumber : 1

  const unboxCallout = (
    <div className="sensor-setup-unbox-callout">
      <h3 className="sensor-setup-unbox-callout-title">Unbox Sensor</h3>
      <p className="sensor-setup-unbox-callout-description">{unboxDescription}</p>
      <div className="sensor-setup-unbox-callout-image-wrapper">
        <img
          src="/images/setup/step2-1-unbox.png"
          alt="Unboxing the sensor"
          className="sensor-setup-unbox-callout-image"
        />
      </div>
    </div>
  )

  return (
    <div className="mini-setup-step-container">
      {/* Step Number Badge + title — same structure for Mini and Standard Sensor (manifold step 1). */}
      <div className="mini-setup-step-badge-wrapper">
        <div className="mini-setup-step-badge">
          <span className="mini-setup-step-badge-number">{heroStepNumber}</span>
        </div>
      </div>
      <div className="mini-setup-step-title-section">
        <h2 className="mini-setup-step-title">Prepare &amp; Measure</h2>
        <p className="mini-setup-step-subtitle">
          {isSensor
            ? 'Gather your tools, measure accurately, and cut the primary drain line to receive the Transparent T manifold.'
            : 'Gather your tools, measure accurately, and cut the primary drain line to receive the Mini T-Manifold'}
        </p>
      </div>

      {/* Important Notice */}
      <div className="mini-setup-notice-callout">
        <div className="mini-setup-notice-callout-content">
          <ExclamationTriangleIcon className="mini-setup-notice-callout-icon" />
          <div className="mini-setup-notice-callout-text">
            <p className="mini-setup-notice-callout-title">Before You Begin</p>
            <p className="mini-setup-notice-callout-description">
              {isSensor ? (
                <>
                  Install on the <strong>primary condensate drain port</strong> of the AC unit. Confirm the drain line is white PVC. Turn off the AC at the thermostat and at the breaker before cutting.
                </>
              ) : (
                <>
                  The AC Drain Wiz Mini is installed on the <strong>primary drain port</strong> of the AC unit. Confirm the drain line is white PVC before proceeding. Turn off the AC unit at the thermostat and at the breaker before cutting the drain line.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* What You'll Need */}
      <div className="mini-setup-what-you-need">
        <h3 className="mini-setup-what-you-need-title">What You'll Need</h3>
        <div className="mini-setup-what-you-need-grid">
          {toolsList.map((tool, index) => (
            <div key={index} className="mini-setup-what-you-need-item">
              <div className="mini-setup-what-you-need-item-icon-wrapper">
                <tool.icon className="mini-setup-what-you-need-item-icon" />
              </div>
              <div className="mini-setup-what-you-need-item-content">
                <p className="mini-setup-what-you-need-item-title">{tool.title}</p>
                <p className="mini-setup-what-you-need-item-description">{tool.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unbox Sensor — after What You'll Need (Standard manifold step 1 & WiFi manifold step 2) */}
      {showUnboxAfterTools && <div className="mt-8">{unboxCallout}</div>}

      {/* Measure & Cut — collapsible (same drawer pattern as Prep & Bond / Cure in Step 2); open by default */}
      <div
        className={`mini-setup-accordion-section ${
          measureCutOpen ? 'mini-setup-accordion-section-expanded' : 'mini-setup-accordion-section-collapsed'
        } ${isSensor && measureShouldPulse ? 'mini-setup-accordion-section-pulsating' : ''}`}
      >
        <button
          type="button"
          className="mini-setup-accordion-header"
          onClick={handleMeasureToggle}
          aria-expanded={measureCutOpen}
        >
          <div className="mini-setup-accordion-header-content">
            <div className="mini-setup-accordion-header-left">
              <div className="mini-setup-accordion-wizard-step-badge" aria-hidden>
                <span className="mini-setup-accordion-wizard-step-badge-number">1</span>
              </div>
              <span className="mini-setup-accordion-title">Measure &amp; Cut</span>
            </div>
            <div className="mini-setup-accordion-header-right">
              <span className="mini-setup-accordion-badge mini-setup-accordion-badge-ready">
                {measureSteps.length} Steps
              </span>
              {measureCutOpen ? (
                <ChevronUpIcon className="mini-setup-accordion-chevron" aria-hidden />
              ) : (
                <ChevronDownIcon className="mini-setup-accordion-chevron" aria-hidden />
              )}
            </div>
          </div>
        </button>

        {measureCutOpen && (
          <div className="mini-setup-accordion-content">
            <div className="sensor-setup-installation-steps mini-setup-accordion-sensor-steps">
              {measureSteps.map((step) => (
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
                        <img src={step.image} alt={step.alt} className="sensor-setup-installation-step-image" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mini-setup-tip-callout mt-4">
              <div className="mini-setup-tip-callout-content">
                <p className="mini-setup-tip-callout-text">
                  <strong>Accuracy matters here.</strong>{' '}
                  {isSensor
                    ? 'Dry-fit the T manifold against the cut section before applying any cement. Primer and cement go only on the two cut pipe ends and horizontal socket walls—not the vertical bayonet port. The bayonet port should point straight upward at a clean 90° angle for the sensor and drainage.'
                    : 'Dry-fit the Mini against the cut section before applying any cement. Primer and cement go only on the two cut pipe ends and horizontal socket walls—not the vertical port (cap or valve area). The T-Manifold cap opening should point straight upward at a clean 90° angle for drainage and future servicing.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
