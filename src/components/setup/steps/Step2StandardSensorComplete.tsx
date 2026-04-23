import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'
import {
  PRODUCT_NAMES,
  SENSOR_INSTALL_P_TRAP_AFTER_MINI_AIR_FLUSH,
  SENSOR_SETUP_MODEL_CHOICE_HREF,
} from '../../../config/acdwKnowledge'
import { InstallationWorkflowHelpFooter } from '../InstallationWorkflowHelpFooter'

const FINAL_MOUNT_STEPS = [
  {
    number: 1,
    title: 'Align',
    description:
      'Line up the sensor with the bayonet port on the Transparent T manifold (same style connection as when using an AC Drain Wiz Mini).',
  },
  {
    number: 2,
    title: 'Insert',
    description:
      'Insert the sensor straight into the port, then twist in the direction indicated on the housing until it seats and locks—no play, no cross-threading.',
  },
  {
    number: 3,
    title: 'Confirm',
    description:
      'Confirm the sensor is fully seated in its service position for ongoing monitoring and overflow protection.',
  },
] as const

interface Step2StandardSensorCompleteProps {
  /** When embedded in a parent that already shows the wizard title (e.g. unified step 3). */
  omitWizardHeader?: boolean
  /**
   * Badge on the Mount & lock drawer: unified flow uses 2 (after Physical Setup drawer 1);
   * standalone step 3 uses 1.
   */
  mountDrawerBadgeNumber?: 1 | 2 | 3
}

/**
 * Final step for Standard (Non-WiFi) sensor setup: mount in T manifold after successful test,
 * success state, troubleshooting, actions, and optional maintenance / Mini content.
 */
export function Step2StandardSensorComplete({
  omitWizardHeader = false,
  mountDrawerBadgeNumber: mountDrawerBadgeNumberProp,
}: Step2StandardSensorCompleteProps) {
  const navigate = useNavigate()
  const mountDrawerBadgeNumber = mountDrawerBadgeNumberProp ?? (omitWizardHeader ? 2 : 1)
  const [mountExpanded, setMountExpanded] = useState(!omitWizardHeader)

  const runSetupAnotherSensor = () => {
    sessionStorage.removeItem('sensor-setup-prerequisite-dismissed')
    sessionStorage.removeItem('sensor-setup-prerequisite-dismiss-reason')
    window.location.href = SENSOR_SETUP_MODEL_CHOICE_HREF
  }

  return (
    <div className={`sensor-setup-step-container ${omitWizardHeader ? 'mt-6' : ''}`}>
      {!omitWizardHeader && (
        <>
          <div className="sensor-setup-step-badge-wrapper">
            <div className="sensor-setup-step-badge sensor-setup-step-badge-step3">
              <span className="sensor-setup-step-badge-number">3</span>
            </div>
          </div>

          <div className="sensor-setup-step-title-section">
            <h2 className="sensor-setup-step-title">Mount &amp; lock the sensor</h2>
            <p className="sensor-setup-step-subtitle">
              After power-up and the touch test pass (LED turns solid red and the AC shuts off as expected), install the
              sensor in its final position on the Transparent T manifold.
            </p>
          </div>
        </>
      )}

      <div className="sensor-setup-wps-callout">
        <h4 className="sensor-setup-wps-callout-title">If you cleared the line with compressed air</h4>
        <p className="sensor-setup-wps-callout-intro">{SENSOR_INSTALL_P_TRAP_AFTER_MINI_AIR_FLUSH}</p>
      </div>

      <div
        className={`mini-setup-accordion-section ${
          mountExpanded ? 'mini-setup-accordion-section-expanded' : 'mini-setup-accordion-section-collapsed'
        }`}
      >
        <button
          type="button"
          onClick={() => setMountExpanded((open) => !open)}
          className="mini-setup-accordion-header"
          aria-expanded={mountExpanded}
        >
          <div className="mini-setup-accordion-header-content">
            <div className="mini-setup-accordion-header-left">
              <div className="mini-setup-accordion-wizard-step-badge" aria-hidden>
                <span className="mini-setup-accordion-wizard-step-badge-number">{mountDrawerBadgeNumber}</span>
              </div>
              <span className="mini-setup-accordion-title">Mount &amp; lock the sensor</span>
            </div>
            <div className="mini-setup-accordion-header-right">
              <span className="mini-setup-accordion-badge mini-setup-accordion-badge-ready">
                {FINAL_MOUNT_STEPS.length} Steps
              </span>
              {mountExpanded ? (
                <ChevronUpIcon className="mini-setup-accordion-chevron" aria-hidden />
              ) : (
                <ChevronDownIcon className="mini-setup-accordion-chevron" aria-hidden />
              )}
            </div>
          </div>
        </button>

        {mountExpanded && (
          <div className="mini-setup-accordion-content">
            <div className="sensor-setup-installation-steps mini-setup-accordion-sensor-steps sensor-setup-standard-final-mount-steps">
              {FINAL_MOUNT_STEPS.map((step) => (
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="sensor-setup-assignment-success">
        <div className="sensor-setup-assignment-success-icon-wrapper">
          <CheckCircleIcon className="sensor-setup-assignment-success-icon" />
        </div>
        <h3 className="sensor-setup-assignment-success-title">Installation and setup complete</h3>
        <p className="sensor-setup-assignment-success-message">
          Your Standard Sensor Switch is mounted on the Transparent T manifold and ready for overflow protection. This
          model provides automatic AC shutdown at 80% water level—no Wi‑Fi connection or monitoring account required.
        </p>
      </div>

      <InstallationWorkflowHelpFooter
        product="sensor-standard"
        showPhone={false}
        title="Troubleshooting"
        intro="Most LED, mounting, and install questions are answered in these guides."
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
            onClick={runSetupAnotherSensor}
            className="sensor-setup-assignment-button sensor-setup-assignment-button-secondary"
          >
            Setup another sensor
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
              biofilm, algae, or water not draining normally, the condensate line needs cleaning—not just the sensor.
              Clearing the line prevents repeat trips and water damage.
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
              vacuum—so technicians can clear sludge without cutting PVC. For service, the Sensor can be removed and the
              Mini valve used in the same bayonet port, then the Sensor reinstalled.
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
    </div>
  )
}
