import {
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  ScissorsIcon,
  CubeIcon,
  BeakerIcon,
  HandRaisedIcon,
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
    description: 'Primer softens the PVC surface for a true chemical weld. Cement fuses pipe and fitting into a single watertight bond.',
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

const measureSteps = [
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

export function Step1MiniPreparation() {
  return (
    <div className="sensor-setup-step-container">
      {/* Step Number Badge */}
      <div className="sensor-setup-step-badge-wrapper">
        <div className="sensor-setup-step-badge">
          <span className="sensor-setup-step-badge-number">1</span>
        </div>
      </div>

      {/* Step Title */}
      <div className="sensor-setup-step-title-section">
        <h2 className="sensor-setup-step-title">Prepare & Measure</h2>
        <p className="sensor-setup-step-subtitle">
          Gather your tools, measure accurately, and cut the primary drain line to receive the Mini T-Manifold
        </p>
      </div>

      {/* Important Notice */}
      <div className="mini-setup-notice-callout">
        <div className="mini-setup-notice-callout-content">
          <ExclamationTriangleIcon className="mini-setup-notice-callout-icon" />
          <div className="mini-setup-notice-callout-text">
            <p className="mini-setup-notice-callout-title">Before You Begin</p>
            <p className="mini-setup-notice-callout-description">
              The AC Drain Wiz Mini is installed on the <strong>primary drain port</strong> of the AC unit. Confirm the drain line is white PVC before proceeding. Turn off the AC unit at the thermostat and at the breaker before cutting the drain line.
            </p>
          </div>
        </div>
      </div>

      {/* What You'll Need */}
      <div className="mini-setup-what-you-need">
        <h3 className="mini-setup-what-you-need-title">What You'll Need</h3>
        <div className="mini-setup-what-you-need-grid">
          {tools.map((tool, index) => (
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

      {/* Measure & Cut Steps */}
      <div className="mini-setup-section-divider">
        <span className="mini-setup-section-divider-title">Measure & Cut</span>
      </div>

      <div className="mini-setup-steps">
        {measureSteps.map((step) => (
          <div key={step.number} className="mini-setup-step-card">
            <div className="mini-setup-step-content">
              <div className="mini-setup-step-number-wrapper">
                <div className="mini-setup-step-number-badge">
                  <span className="mini-setup-step-number">{step.number}</span>
                </div>
              </div>
              <div className="mini-setup-step-details">
                <h3 className="mini-setup-step-title">{step.title}</h3>
                <p className="mini-setup-step-description">{step.description}</p>
                <div className="mini-setup-step-image-wrapper">
                  <img
                    src={step.image}
                    alt={step.alt}
                    className="mini-setup-step-image"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Accuracy reminder */}
      <div className="mini-setup-tip-callout">
        <div className="mini-setup-tip-callout-content">
          <p className="mini-setup-tip-callout-text">
            <strong>Accuracy matters here.</strong> Take a moment to dry-fit the Mini against the cut section before applying any cement. The T-Manifold cap opening should point straight upward at a clean 90° angle to allow for proper drainage and future servicing.
          </p>
        </div>
      </div>
    </div>
  )
}
