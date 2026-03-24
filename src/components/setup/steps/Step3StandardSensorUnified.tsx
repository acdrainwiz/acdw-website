import { forwardRef } from 'react'
import { Step2SensorSetup, type Step2SensorSetupHandle } from './Step2SensorSetup'
import { Step2StandardSensorComplete } from './Step2StandardSensorComplete'

export interface Step3StandardSensorUnifiedProps {
  onWifiInteraction?: () => void
  onPhysicalOpened?: () => void
  onModelSelect?: (model: 'nonwifi' | 'wifi') => void
}

/**
 * Standard (Non-WiFi) sensor wizard step 3: power/test/mount combined (former steps 2 + 3).
 */
export const Step3StandardSensorUnified = forwardRef<Step2SensorSetupHandle, Step3StandardSensorUnifiedProps>(
  function Step3StandardSensorUnified({ onWifiInteraction, onPhysicalOpened, onModelSelect }, ref) {
    return (
      <>
        <div className="sensor-setup-step-container">
          <div className="sensor-setup-step-badge-wrapper">
            <div className="sensor-setup-step-badge sensor-setup-step-badge-step3">
              <span className="sensor-setup-step-badge-number">3</span>
            </div>
          </div>
          <div className="sensor-setup-step-title-section">
            <h2 className="sensor-setup-step-title">Set up and mount the sensor</h2>
            <p className="sensor-setup-step-subtitle">
              Power and test the sensor, then mount it on the Transparent T manifold. Follow the sections below in order.
            </p>
          </div>
        </div>

        <Step2SensorSetup
          ref={ref}
          omitWizardHeader
          hideModelSelector
          hideUnboxCallout
          presetModel="nonwifi"
          lockModelSelection
          wizardStepNumber={3}
          physicalDrawerBadgeNumber={1}
          initialPhysicalExpanded
          manifoldInstalledInPriorWizardStep
          onWifiInteraction={onWifiInteraction}
          onPhysicalOpened={onPhysicalOpened}
          onModelSelect={onModelSelect}
        />

        <Step2StandardSensorComplete omitWizardHeader />
      </>
    )
  }
)

Step3StandardSensorUnified.displayName = 'Step3StandardSensorUnified'
