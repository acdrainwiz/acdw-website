import { useState } from 'react'
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom'
import {
  buildSensorSetupHref,
  PRODUCT_NAMES,
  SENSOR_SETUP_MODEL_CHOICE_HREF,
  type SensorSetupModelSlug,
} from '../../../config/acdwKnowledge'
import { InstallationWorkflowHelpFooter } from '../InstallationWorkflowHelpFooter'
import type { InstallationWorkflowProduct } from '../InstallationWorkflowHelpFooter'

interface Step3AssignCustomerProps {
  /** Matches URL `model` for copy and restart link */
  setupModel?: SensorSetupModelSlug | null
  /** Wizard step index in the badge (e.g. 5 for WiFi five-step flow) */
  wizardStepNumber?: 2 | 3 | 4 | 5
}

function assignCustomerBadgeClass(step: number): string {
  const base = 'sensor-setup-step-badge'
  if (step === 2) return `${base} sensor-setup-step-badge-step2`
  if (step === 3) return `${base} sensor-setup-step-badge-step3`
  if (step === 4) return `${base} sensor-setup-step-badge-step4`
  if (step === 5) return `${base} sensor-setup-step-badge-step5`
  return base
}

export function Step3AssignCustomer({ setupModel = null, wizardStepNumber = 3 }: Step3AssignCustomerProps) {
  const navigate = useNavigate()
  const installationHelpProduct: InstallationWorkflowProduct =
    setupModel === 'wifi' ? 'sensor-wifi' : 'sensor-standard'
  const isWifiFinalStep = setupModel === 'wifi' && wizardStepNumber === 5
  const [assignmentDrawerExpanded, setAssignmentDrawerExpanded] = useState(true)

  const substeps = [
    {
      number: 1,
      title: 'View Customer List',
      description:
        'After logging in, you\'ll be presented with a list of your existing customers. This list includes all clients you\'ve created in your account.',
      image: '/images/setup/step3-1-customer-list.png',
      alt: 'Customer list screen',
    },
    {
      number: 2,
      title: 'Select Customer',
      description:
        'Tap on the customer name where you\'re installing the sensor. This will open the customer details page.',
      image: '/images/setup/step3-2-select-customer.png',
      alt: 'Selecting a customer from the list',
    },
    {
      number: 3,
      title: 'Select Address (if multiple)',
      description:
        'If the customer has multiple addresses on file, you\'ll be asked to select which address this sensor will be assigned to. Choose the correct location.',
      image: '/images/setup/step3-3-select-address.png',
      alt: 'Address selection screen',
    },
    {
      number: 4,
      title: 'Sensor Assigned',
      description:
        'The sensor will be automatically assigned to your selected customer. You\'ll see a confirmation message when the assignment is complete.',
      image: '/images/setup/step3-4-complete.png',
      alt: 'Assignment complete confirmation',
    },
  ]

  const assignmentStepCards = substeps.map((substep) => (
    <div key={substep.number} className="sensor-setup-assignment-step-card">
      <div className="sensor-setup-assignment-step-content">
        <div className="sensor-setup-assignment-step-number-wrapper">
          <div className="sensor-setup-assignment-step-number-badge">
            <span className="sensor-setup-assignment-step-number">{substep.number}</span>
          </div>
        </div>

        <div className="sensor-setup-assignment-step-details">
          <h3 className="sensor-setup-assignment-step-title">{substep.title}</h3>
          <p className="sensor-setup-assignment-step-description">{substep.description}</p>

          <div className="sensor-setup-assignment-step-image-wrapper">
            <img src={substep.image} alt={substep.alt} className="sensor-setup-assignment-step-image" />
          </div>
        </div>
      </div>
    </div>
  ))

  return (
    <div className="sensor-setup-step-container">
      {/* Step Number Badge */}
      <div className="sensor-setup-step-badge-wrapper">
        <div className={assignCustomerBadgeClass(wizardStepNumber)}>
          <span className="sensor-setup-step-badge-number">{wizardStepNumber}</span>
        </div>
      </div>

      {/* Step Title */}
      <div className="sensor-setup-step-title-section">
        <h2 className="sensor-setup-step-title">Assign Sensor to Customer</h2>
        <p className="sensor-setup-step-subtitle">
          {setupModel === 'standard'
            ? 'Link the installed Standard Sensor to your customer in the portal so the install is on record.'
            : 'Link the WiFi Sensor to your customer account for remote monitoring and alerts.'}
        </p>
      </div>

      {isWifiFinalStep ? (
        <div
          className={`mini-setup-accordion-section ${
            assignmentDrawerExpanded ? 'mini-setup-accordion-section-expanded' : 'mini-setup-accordion-section-collapsed'
          }`}
        >
          <button
            type="button"
            onClick={() => setAssignmentDrawerExpanded((open) => !open)}
            className="mini-setup-accordion-header"
            aria-expanded={assignmentDrawerExpanded}
          >
            <div className="mini-setup-accordion-header-content">
              <div className="mini-setup-accordion-header-left">
                <div className="mini-setup-accordion-wizard-step-badge" aria-hidden>
                  <span className="mini-setup-accordion-wizard-step-badge-number">1</span>
                </div>
                <span className="mini-setup-accordion-title">Portal assignment</span>
              </div>
              <div className="mini-setup-accordion-header-right">
                <span className="mini-setup-accordion-badge mini-setup-accordion-badge-ready">
                  {substeps.length} Steps
                </span>
                {assignmentDrawerExpanded ? (
                  <ChevronUpIcon className="mini-setup-accordion-chevron" aria-hidden />
                ) : (
                  <ChevronDownIcon className="mini-setup-accordion-chevron" aria-hidden />
                )}
              </div>
            </div>
          </button>

          {assignmentDrawerExpanded && (
            <div className="mini-setup-accordion-content">
              <div className="sensor-setup-assignment-steps sensor-setup-assignment-steps-in-drawer">
                {assignmentStepCards}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="sensor-setup-assignment-steps">{assignmentStepCards}</div>
      )}

      {/* Success Message — before drain-line / Mini sections on WiFi final step */}
      <div className="sensor-setup-assignment-success">
        <div className="sensor-setup-assignment-success-icon-wrapper">
          <CheckCircleIcon className="sensor-setup-assignment-success-icon" />
        </div>
        <h3 className="sensor-setup-assignment-success-title">Installation and Setup Complete!</h3>
        <p className="sensor-setup-assignment-success-message">
          {setupModel === 'standard'
            ? 'Your Standard Sensor is installed and assigned to your customer. This model provides local overflow protection and automatic AC shutdown at 95% water level—no Wi‑Fi connection required.'
            : 'Your WiFi Sensor is installed, connected, and assigned to your customer. You can monitor it from your dashboard and configure email, SMS, and service alerts as needed.'}
        </p>
      </div>

      {isWifiFinalStep ? (
        <>
          <InstallationWorkflowHelpFooter
            product="sensor-wifi"
            showPhone={false}
            title="Troubleshooting"
            intro="Most LED, Wi‑Fi, and install questions are answered in these guides."
            className="install-workflow-help-footer--troubleshooting-hero"
          />

          <div className="sensor-setup-assignment-actions-wrapper sensor-setup-wifi-assignment-actions">
            <h3 className="sensor-setup-assignment-actions-heading">What&apos;s next?</h3>
            <div className="sensor-setup-assignment-actions">
              <button
                type="button"
                onClick={() => navigate('/contact?type=support')}
                className="sensor-setup-assignment-button sensor-setup-assignment-button-primary"
              >
                Contact Support
              </button>

              <button
                type="button"
                onClick={() => {
                  sessionStorage.removeItem('sensor-setup-prerequisite-dismissed')
                  sessionStorage.removeItem('sensor-setup-prerequisite-dismiss-reason')
                  window.location.href = buildSensorSetupHref({ model: 'wifi', step: 1 })
                }}
                className="sensor-setup-assignment-button sensor-setup-assignment-button-secondary"
              >
                Setup Another Sensor
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="sensor-setup-assignment-button sensor-setup-assignment-button-tertiary"
              >
                Back to Home
              </button>
            </div>
          </div>

          <details className="sensor-setup-maintenance-details">
            <summary className="sensor-setup-maintenance-details-summary list-none">
              <div className="sensor-setup-maintenance-details-summary-row">
                <div className="sensor-setup-maintenance-details-summary-text">
                  <span className="sensor-setup-maintenance-details-summary-eyebrow">Maintenance</span>
                  <span className="sensor-setup-maintenance-details-summary-headline">
                    Condensate line service &amp; adding the Mini
                  </span>
                  <span className="sensor-setup-maintenance-details-summary-sub">
                    When to service the drain line and how the Mini pairs with your sensor setup
                  </span>
                </div>
                <ChevronDownIcon className="sensor-setup-maintenance-details-summary-chevron" aria-hidden />
              </div>
            </summary>
            <div className="sensor-setup-maintenance-details-body">
              <div className="sensor-setup-standard-maintenance-callout sensor-setup-maintenance-details-callout">
                <h3 className="sensor-setup-standard-maintenance-title">When to service the drain line</h3>
                <p className="sensor-setup-standard-maintenance-text">
                  If the sensor shuts down the AC at high water level, or a visual check through the manifold shows
                  biofilm, algae, or water not draining normally, the condensate line needs cleaning—not just the
                  sensor. Clearing the line prevents repeat trips and water damage.
                </p>
              </div>

              <div className="sensor-setup-mini-upsell sensor-setup-maintenance-details-mini">
                <div className="sensor-setup-mini-upsell-header">
                  <WrenchScrewdriverIcon className="sensor-setup-mini-upsell-wrench" aria-hidden />
                  <span className="sensor-setup-mini-upsell-eyebrow">Add maintenance access</span>
                  <h3 className="sensor-setup-mini-upsell-title">{PRODUCT_NAMES.mini}</h3>
                </div>
                <p className="sensor-setup-mini-upsell-description">
                  The Mini adds a permanent service port on the 3/4&quot; drain line for flush, compressed air, and
                  vacuum—so technicians can clear sludge without cutting PVC. For service, the Sensor can be removed and
                  the Mini valve used in the same bayonet port, then the Sensor reinstalled.
                </p>
                <div className="sensor-setup-mini-upsell-actions">
                  <Link to="/products/mini" className="sensor-setup-mini-upsell-link sensor-setup-mini-upsell-link-primary">
                    View {PRODUCT_NAMES.mini}
                    <ArrowRightIcon className="sensor-setup-mini-upsell-link-icon" aria-hidden />
                  </Link>
                  <Link to="/mini-setup" className="sensor-setup-mini-upsell-link sensor-setup-mini-upsell-link-secondary">
                    Mini installation guide
                    <ArrowRightIcon className="sensor-setup-mini-upsell-link-icon" aria-hidden />
                  </Link>
                </div>
              </div>
            </div>
          </details>
        </>
      ) : (
        <>
          <div className="sensor-setup-assignment-actions-wrapper">
            <h3 className="sensor-setup-assignment-actions-heading">What&apos;s Next?</h3>
            <div className="sensor-setup-assignment-actions">
              <button
                type="button"
                onClick={() => navigate('/contact?type=support')}
                className="sensor-setup-assignment-button sensor-setup-assignment-button-primary"
              >
                Contact Support
              </button>

              <button
                type="button"
                onClick={() => {
                  sessionStorage.removeItem('sensor-setup-prerequisite-dismissed')
                  sessionStorage.removeItem('sensor-setup-prerequisite-dismiss-reason')
                  window.location.href =
                    setupModel === 'standard' || setupModel === 'wifi'
                      ? buildSensorSetupHref({ model: setupModel, step: 1 })
                      : SENSOR_SETUP_MODEL_CHOICE_HREF
                }}
                className="sensor-setup-assignment-button sensor-setup-assignment-button-secondary"
              >
                Setup Another Sensor
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="sensor-setup-assignment-button sensor-setup-assignment-button-tertiary"
              >
                Back to Home
              </button>
            </div>
          </div>

          <InstallationWorkflowHelpFooter product={installationHelpProduct} />
        </>
      )}
    </div>
  )
}
