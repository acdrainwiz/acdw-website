import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { MONITORING } from '../../../config/acdwKnowledge'

interface Step4SuccessProps {
  deviceData?: {
    deviceName: string
    location: string
    customerName: string
  }
}

export function Step4Success({ deviceData }: Step4SuccessProps) {
  const navigate = useNavigate()
  
  // Mock sensor status - in real app, this would come from API
  const sensorStatus = {
    online: true,
    reporting: true,
    lastReading: 12,
    readingStatus: 'Normal'
  }

  return (
    <div className="sensor-setup-success-container">
      {/* Step Number Badge */}
      <div className="sensor-setup-step-badge-wrapper">
        <div className="sensor-setup-step-badge sensor-setup-step-badge-complete">
          <CheckCircleIcon className="sensor-setup-step-badge-icon" />
        </div>
      </div>

      {/* Success Hero */}
      <div className="sensor-setup-success-hero">
        <div className="sensor-setup-success-icon-wrapper">
          <CheckCircleIcon className="sensor-setup-success-icon" />
        </div>
        <h2 className="sensor-setup-success-title">Setup Complete!</h2>
        <p className="sensor-setup-success-subtitle">
          Your sensor is now set up and connected
        </p>
      </div>

      {/* Success Image */}
      <div className="sensor-setup-success-image-wrapper">
        <img
          src="/images/setup/step4-success.png"
          alt="Setup complete"
          className="sensor-setup-success-image"
        />
      </div>

      {/* Verification Checklist */}
      <div className="sensor-setup-success-checklist">
        <h3 className="sensor-setup-success-checklist-title">Verification Checklist</h3>
        
        <div className="sensor-setup-success-checklist-items">
          <div className="sensor-setup-success-checklist-item">
            <CheckCircleIcon className={`sensor-setup-success-checklist-icon ${sensorStatus.online ? 'sensor-setup-success-checklist-icon-active' : ''}`} />
            <span className="sensor-setup-success-checklist-text">
              Online: <span className="sensor-setup-success-checklist-text-bold">Connected</span>
            </span>
          </div>
          
          <div className="sensor-setup-success-checklist-item">
            <CheckCircleIcon className={`sensor-setup-success-checklist-icon ${sensorStatus.reporting ? 'sensor-setup-success-checklist-icon-active' : ''}`} />
            <span className="sensor-setup-success-checklist-text">
              Reporting: <span className="sensor-setup-success-checklist-text-bold">Active</span>
            </span>
          </div>
          
          <div className="sensor-setup-success-checklist-item">
            <CheckCircleIcon className="sensor-setup-success-checklist-icon sensor-setup-success-checklist-icon-active" />
            <span className="sensor-setup-success-checklist-text">
              Last Reading: <span className="sensor-setup-success-checklist-text-bold">{sensorStatus.lastReading}%</span> ({sensorStatus.readingStatus})
            </span>
          </div>
        </div>
      </div>

      {/* Device Details (if available) */}
      {deviceData && (
        <div className="sensor-setup-success-device-details">
          <h3 className="sensor-setup-success-device-details-title">Device Details</h3>
          
          <dl className="sensor-setup-success-device-details-list">
            <div className="sensor-setup-success-device-details-item">
              <dt className="sensor-setup-success-device-details-label">Name</dt>
              <dd className="sensor-setup-success-device-details-value">{deviceData.deviceName}</dd>
            </div>
            
            <div className="sensor-setup-success-device-details-item">
              <dt className="sensor-setup-success-device-details-label">Location</dt>
              <dd className="sensor-setup-success-device-details-value">{deviceData.location}</dd>
            </div>
            
            <div className="sensor-setup-success-device-details-item">
              <dt className="sensor-setup-success-device-details-label">Customer</dt>
              <dd className="sensor-setup-success-device-details-value">{deviceData.customerName}</dd>
            </div>
            
            <div className="sensor-setup-success-device-details-item">
              <dt className="sensor-setup-success-device-details-label">Status</dt>
              <dd className="sensor-setup-success-device-details-value">
                <span className="sensor-setup-success-status-indicator"></span>
                <span>Online</span>
              </dd>
            </div>
          </dl>
        </div>
      )}

      {/* Next Steps */}
      <div className="sensor-setup-success-next-steps">
        <h3 className="sensor-setup-success-next-steps-title">Next Steps</h3>
        
        <ul className="sensor-setup-success-next-steps-list">
          <li className="sensor-setup-success-next-steps-item">
            <ArrowRightIcon className="sensor-setup-success-next-steps-icon" />
            <span className="sensor-setup-success-next-steps-text">View sensor in dashboard</span>
          </li>
          
          <li className="sensor-setup-success-next-steps-item">
            <ArrowRightIcon className="sensor-setup-success-next-steps-icon" />
            <span className="sensor-setup-success-next-steps-text">Set up additional sensors</span>
          </li>
          
          <li className="sensor-setup-success-next-steps-item">
            <ArrowRightIcon className="sensor-setup-success-next-steps-icon" />
            <span className="sensor-setup-success-next-steps-text">Configure alert thresholds</span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="sensor-setup-success-actions">
        <button
          onClick={() => window.open(MONITORING.portalUrl, '_blank')}
          className="sensor-setup-success-button sensor-setup-success-button-primary"
        >
          <span>View Dashboard</span>
          <ArrowRightIcon className="sensor-setup-success-button-icon" />
        </button>
        
        <button
          onClick={() => navigate('/sensor-setup')}
          className="sensor-setup-success-button sensor-setup-success-button-secondary"
        >
          Setup Another Sensor
        </button>
      </div>
    </div>
  )
}
