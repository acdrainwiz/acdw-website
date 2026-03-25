import { forwardRef } from 'react'
import { Step2SensorSetup, type Step2SensorSetupHandle } from './Step2SensorSetup'
import { InstallationWorkflowHelpFooter } from '../InstallationWorkflowHelpFooter'

export interface Step4WifiSensorUnifiedProps {
  onWifiInteraction?: () => void
  onPhysicalOpened?: () => void
  onModelSelect?: (model: 'nonwifi' | 'wifi') => void
}

/**
 * WiFi Sensor wizard step 4: power, physical install, Wi‑Fi pairing, and dashboard login—after manifold steps 2–3.
 * Unbox appears on wizard step 2 (manifold measure) after “What You’ll Need,” same as the Standard guide.
 */
export const Step4WifiSensorUnified = forwardRef<Step2SensorSetupHandle, Step4WifiSensorUnifiedProps>(
  function Step4WifiSensorUnified({ onWifiInteraction, onPhysicalOpened, onModelSelect }, ref) {
    return (
      <>
        <div className="sensor-setup-step-container">
          <div className="sensor-setup-step-badge-wrapper">
            <div className="sensor-setup-step-badge sensor-setup-step-badge-step4">
              <span className="sensor-setup-step-badge-number">4</span>
            </div>
          </div>
          <div className="sensor-setup-step-title-section">
            <h2 className="sensor-setup-step-title">Install sensor and connect Wi‑Fi</h2>
            <p className="sensor-setup-step-subtitle sensor-setup-step-subtitle-wifi-step4">
              Power the sensor, complete physical install, pair to the home 2.4 GHz network, then sign in to the monitoring portal. Follow the sections below in order.
            </p>
          </div>
        </div>

        <Step2SensorSetup
          ref={ref}
          omitWizardHeader
          hideModelSelector
          hideUnboxCallout
          presetModel="wifi"
          lockModelSelection
          wizardStepNumber={4}
          physicalDrawerBadgeNumber={1}
          initialPhysicalExpanded
          suppressAccordionScrollIntoView
          manifoldInstalledInPriorWizardStep
          onWifiInteraction={onWifiInteraction}
          onPhysicalOpened={onPhysicalOpened}
          onModelSelect={onModelSelect}
        />

        <InstallationWorkflowHelpFooter product="sensor-wifi" />
      </>
    )
  }
)

Step4WifiSensorUnified.displayName = 'Step4WifiSensorUnified'
