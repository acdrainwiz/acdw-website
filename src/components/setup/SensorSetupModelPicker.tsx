import { Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import {
  SENSOR_STANDARD_DISPLAY,
  SENSOR_STANDARD_SHORT,
  SENSOR_WIFI_DISPLAY,
  SENSOR_WIFI_SHORT,
  buildSensorSetupHref,
} from '../../config/acdwKnowledge'

export function SensorSetupModelPicker() {
  return (
    <div className="sensor-setup-wizard-container">
      <div className="sensor-setup-wizard-header">
        <div className="sensor-setup-wizard-header-content">
          <div className="sensor-setup-wizard-header-back-link">
            <Link to="/support/installation-setup" className="sensor-setup-wizard-header-back-link-content">
              <ArrowLeftIcon className="sensor-setup-wizard-header-back-link-icon" />
              <span>Installation &amp; Setup</span>
            </Link>
          </div>
          <div className="sensor-setup-wizard-header-top">
            <div className="sensor-setup-wizard-header-brand">
              <Link to="/" className="sensor-setup-wizard-header-logo-link">
                <img src="/images/ac-drain-wiz-logo.png" alt="AC Drain Wiz" className="sensor-setup-wizard-header-logo" />
              </Link>
              <h1 className="sensor-setup-wizard-header-title">Sensor Setup</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="sensor-setup-model-picker-content">
        <h2 className="sensor-setup-model-picker-title">Which sensor are you installing?</h2>
        <p className="sensor-setup-model-picker-subtitle">
          Choose the model you have. The Standard guide begins with physical installation; the WiFi guide starts with your monitoring account, then install and network setup.
        </p>
        <div className="sensor-setup-model-picker-grid">
          <Link to={buildSensorSetupHref({ model: 'standard', step: 1 })} className="sensor-setup-model-picker-card">
            <div className="sensor-setup-model-picker-card-image-wrap">
              <img
                src="/images/setup/model-non-wifi.png"
                alt={SENSOR_STANDARD_DISPLAY}
                className="sensor-setup-model-picker-card-image"
              />
            </div>
            <h3 className="sensor-setup-model-picker-card-title">{SENSOR_STANDARD_SHORT}</h3>
            <p className="sensor-setup-model-picker-card-desc">
              Overflow protection with automatic AC shutdown at 95% water level. No Wi‑Fi setup.
            </p>
            <span className="sensor-setup-model-picker-card-cta">Start Standard guide →</span>
          </Link>
          <Link to={buildSensorSetupHref({ model: 'wifi', step: 1 })} className="sensor-setup-model-picker-card">
            <div className="sensor-setup-model-picker-card-image-wrap">
              <img
                src="/images/setup/model-wifi.png"
                alt={SENSOR_WIFI_DISPLAY}
                className="sensor-setup-model-picker-card-image"
              />
            </div>
            <h3 className="sensor-setup-model-picker-card-title">{SENSOR_WIFI_SHORT}</h3>
            <p className="sensor-setup-model-picker-card-desc">
              Adds remote monitoring, email/SMS alerts, and service alerts (50–90%). Requires 2.4 GHz Wi‑Fi.
            </p>
            <span className="sensor-setup-model-picker-card-cta">Start WiFi guide →</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
