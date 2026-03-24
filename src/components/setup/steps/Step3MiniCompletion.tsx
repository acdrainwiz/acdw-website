import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const serviceSteps = [
  {
    number: 1,
    title: 'Insert Bi-Directional Valve — Outward Direction',
    description: 'Insert the bi-directional valve into the T-Manifold cap opening with the flow arrow pointing toward the exterior drain line exit. Using compressed air or water pressure, push air or water outward through the line. This clears any newly formed biofilm, algae, or debris that may have accumulated during installation toward the outside of the building. When using air, check for the presence of a P-trap in the condensate line; after the air flush is complete, refill the P-trap with water to reestablish the required water seal.',
    image: '/images/mini-setup/step3-valve-outward.jpg',
    alt: 'Inserting bi-directional valve in the outward-facing direction',
  },
  {
    number: 2,
    title: 'Reverse the Valve — Clear Toward the Pan',
    description: 'Remove the bi-directional valve, reverse it so the flow arrow points toward the condensate pan, and reinsert it. Attach a shop vac or similar vacuum tool to the opposite end and vacuum the line toward the pan side. This pulls any remaining loosened debris or biofilm away from the AC unit and out of the condensate drain system.',
    image: '/images/mini-setup/step3-valve-reverse.jpg',
    alt: 'Reversing the bi-directional valve and vacuuming toward the pan',
  },
  {
    number: 3,
    title: 'Remove Valve and Insert the Standard Cap',
    description: 'Remove the bi-directional valve from the T-Manifold and set it aside. Insert the standard cap firmly into the T-Manifold opening. The cap secures the line during normal operation, maintaining proper pressure and drainage flow. Confirm it seats securely with a gentle push.',
    image: '/images/mini-setup/step3-insert-cap.jpg',
    alt: 'Inserting the standard cap into the T-Manifold',
  },
  {
    number: 4,
    title: 'Store Accessories on the Cap',
    description: 'Place the bi-directional valve and any remaining service accessories into the storage cap as designed. Stack the storage cap on top of the standard cap. All service tools are now stored on-site, directly at the installation point, and will be ready for the next service visit without the technician needing to bring additional equipment.',
    image: '/images/mini-setup/step3-store-accessories.jpg',
    alt: 'Storing the bi-directional valve and accessories in the storage cap',
  },
]

export function Step3MiniCompletion() {
  const navigate = useNavigate()

  return (
    <div className="mini-setup-step-container">
      {/* Step Number Badge */}
      <div className="mini-setup-step-badge-wrapper">
        <div className="mini-setup-step-badge mini-setup-step-badge-step3">
          <span className="mini-setup-step-badge-number">3</span>
        </div>
      </div>

      {/* Step Title */}
      <div className="mini-setup-step-title-section">
        <h2 className="mini-setup-step-title">First Service &amp; Completion</h2>
        <p className="mini-setup-step-subtitle">
          Perform the initial line clear, install the cap, store your tools, and set your customer up for long-term protection
        </p>
      </div>

      {/* Service Steps */}
      <div className="mini-setup-steps">
        {serviceSteps.map((step) => (
          <div key={step.number} className="mini-setup-step-card">
            <div className="mini-setup-step-content">
              <div className="mini-setup-step-number-wrapper">
                <div className="mini-setup-step-number-badge">
                  <span className="mini-setup-step-number">{step.number}</span>
                </div>
              </div>
              <div className="mini-setup-step-details">
                <h3 className="mini-setup-step-card-title">{step.title}</h3>
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

      {/* Success Block */}
      <div className="mini-setup-assignment-success">
        <div className="mini-setup-assignment-success-icon-wrapper">
          <CheckCircleIcon className="mini-setup-assignment-success-icon" />
        </div>
        <h3 className="mini-setup-assignment-success-title">Installation Complete!</h3>
        <p className="mini-setup-assignment-success-message">
          The AC Drain Wiz Mini T-Manifold is permanently bonded, the line has been cleared, and all accessories are stored on-site. Your customer is now protected against condensate drain backups.
        </p>
      </div>

      {/* Monthly Maintenance Callout */}
      <div className="mini-setup-maintenance-callout">
        <div className="mini-setup-maintenance-callout-header">
          <CheckCircleIcon className="mini-setup-maintenance-callout-icon" />
          <h3 className="mini-setup-maintenance-callout-title">Monthly Visual Inspection</h3>
        </div>
        <p className="mini-setup-maintenance-callout-intro">
          The single most important thing a property owner can do after installation is perform a brief monthly visual check of the T-Manifold and condensate drain line.
        </p>
        <div className="mini-setup-maintenance-callout-checks">
          <div className="mini-setup-maintenance-check-item mini-setup-maintenance-check-item-good">
            <span className="mini-setup-maintenance-check-label">Healthy signs</span>
            <p className="mini-setup-maintenance-check-description">Normal water levels in the pan, clear drainage, no visible biofilm or algae growth at or near the T-Manifold.</p>
          </div>
          <div className="mini-setup-maintenance-check-item mini-setup-maintenance-check-item-action">
            <span className="mini-setup-maintenance-check-label">Time to service</span>
            <p className="mini-setup-maintenance-check-description">Water levels above what is normal, visible algae or biofilm buildup, or slow drainage. Any of these signals a developing blockage — service the line with the bi-directional valve before a full backup can form.</p>
          </div>
        </div>
        <p className="mini-setup-maintenance-callout-footer">
          Early servicing prevents emergency calls, protects the property, and creates consistent recurring service opportunities for your business. Homeowners can call their AC technician to clean the line before a full backup forms.
        </p>

        {/* Sensor Upsell */}
        <div className="mini-setup-sensor-upsell">
          <div className="mini-setup-sensor-upsell-header">
            <span className="mini-setup-sensor-upsell-eyebrow">Upgrade for Automatic Protection</span>
            <h4 className="mini-setup-sensor-upsell-title">Managing Multiple Properties or Away for the Season?</h4>
          </div>
          <p className="mini-setup-sensor-upsell-description">
            Property owners with Airbnbs, rental portfolios, or seasonal residences can add the <strong>AC Drain Wiz Sensor</strong> for fully automatic water level monitoring. When drain water levels reach 95% capacity, the Sensor automatically shuts down the AC unit and instantly notifies the property owner <em>and</em> their HVAC technician via email and text — so the right person can schedule a service visit before any damage occurs, with no one needing to be on-site.
          </p>
          <div className="mini-setup-sensor-upsell-actions">
            <Link
              to="/products/sensor"
              className="mini-setup-sensor-upsell-link"
            >
              Learn about the AC Drain Wiz Sensor
              <ArrowRightIcon className="mini-setup-sensor-upsell-link-icon" />
            </Link>
            <Link
              to="/sensor-setup"
              className="mini-setup-sensor-upsell-link mini-setup-sensor-upsell-link-secondary"
            >
              View Sensor Installation Guide
              <ArrowRightIcon className="mini-setup-sensor-upsell-link-icon" />
            </Link>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mini-setup-assignment-actions-wrapper">
        <h3 className="mini-setup-assignment-actions-heading">What's Next?</h3>
        <div className="mini-setup-assignment-actions">
          <button
            onClick={() => navigate('/contact?type=support')}
            className="mini-setup-assignment-button mini-setup-assignment-button-primary"
          >
            Contact Support
          </button>
          <button
            onClick={() => { window.location.href = '/mini-setup' }}
            className="mini-setup-assignment-button mini-setup-assignment-button-secondary"
          >
            Install Another Mini
          </button>
          <button
            onClick={() => navigate('/support')}
            className="mini-setup-assignment-button mini-setup-assignment-button-tertiary"
          >
            Back to Support
          </button>
        </div>
      </div>
    </div>
  )
}
