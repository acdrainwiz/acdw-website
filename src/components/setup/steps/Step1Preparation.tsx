import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { SENSOR_STANDARD_DISPLAY, SENSOR_STANDARD_SHORT, SENSOR_WIFI_DISPLAY, SENSOR_WIFI_SHORT, MONITORING } from '../../../config/acdwKnowledge'

export function Step1Preparation() {
  return (
    <div className="sensor-setup-step-container">
      {/* Step Number Badge */}
      <div className="sensor-setup-step-badge-wrapper">
        <div className="sensor-setup-step-badge">
          <span className="sensor-setup-step-badge-number">1</span>
        </div>
      </div>

      {/* Hero Image */}
      <div className="sensor-setup-step-hero-image-wrapper">
        <img
          src="/images/setup/step1-hero.png"
          alt="ACDW Sensor and Mini together"
          className="sensor-setup-step-hero-image"
        />
      </div>

      {/* Step Title */}
      <div className="sensor-setup-step-title-section">
        <h2 className="sensor-setup-step-title">Preparation</h2>
        <p className="sensor-setup-step-subtitle">
          Before you begin, make sure you have everything you need
        </p>
      </div>

      {/* Prerequisites Callout */}
      <div className="sensor-setup-prerequisites-callout">
        <div className="sensor-setup-prerequisites-callout-content">
          <ExclamationTriangleIcon className="sensor-setup-prerequisites-callout-icon" />
          <div className="sensor-setup-prerequisites-callout-text">
            <h3 className="sensor-setup-prerequisites-callout-title">Prerequisites</h3>
            <div className="sensor-setup-prerequisites-callout-items">
              <div className="sensor-setup-prerequisites-callout-item">
                <CheckCircleIcon className="sensor-setup-prerequisites-callout-item-icon" />
                <div className="sensor-setup-prerequisites-callout-item-content">
                  <p className="sensor-setup-prerequisites-callout-item-title">Transparent T-Manifold Installed</p>
                  <p className="sensor-setup-prerequisites-callout-item-description">
                    The Transparent T-Manifold must be installed by the AC technician before sensor setup;{' '}
                    <a
                      href="/mini-setup"
                      className="sensor-setup-prerequisites-callout-item-link"
                    >
                      view installation steps in the Mini Setup Guide →
                    </a>
                  </p>
                </div>
              </div>
              <div className="sensor-setup-prerequisites-callout-item">
                <CheckCircleIcon className="sensor-setup-prerequisites-callout-item-icon" />
                <div className="sensor-setup-prerequisites-callout-item-content">
                  <p className="sensor-setup-prerequisites-callout-item-title">ACDW Sensor Admin Account</p>
                  <p className="sensor-setup-prerequisites-callout-item-description">You need an active contractor account to register and manage sensors.</p>
                  <a
                    href={MONITORING.signUpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sensor-setup-prerequisites-callout-item-link"
                  >
                    Sign up at monitor.acdrainwiz.com →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Identification */}
      <div className="sensor-setup-model-identification">
        <h3 className="sensor-setup-model-identification-title">Identify Your Sensor Model</h3>
        <p className="sensor-setup-model-identification-description">
          Both models include a cable for the 24V air-handler connection. The {SENSOR_STANDARD_SHORT} does not require WiFi setup; the {SENSOR_WIFI_SHORT} does. Choose your model to follow the right steps in the next screen.
        </p>
        
        <div className="sensor-setup-model-comparison">
          {/* Standard Sensor Switch (Non-WiFi) */}
          <div className="sensor-setup-model-card">
            <div className="sensor-setup-model-card-image-wrapper">
              <img
                src="/images/setup/model-non-wifi.png"
                alt={SENSOR_STANDARD_DISPLAY}
                className="sensor-setup-model-card-image"
              />
            </div>
            <h4 className="sensor-setup-model-card-title">{SENSOR_STANDARD_SHORT}</h4>
            <p className="sensor-setup-model-card-description">
              Power from 24V cable. Stops AC at critical water level. No WiFi setup.
            </p>
          </div>

          {/* WiFi Sensor Switch */}
          <div className="sensor-setup-model-card">
            <div className="sensor-setup-model-card-image-wrapper">
              <img
                src="/images/setup/model-wifi.png"
                alt={SENSOR_WIFI_DISPLAY}
                className="sensor-setup-model-card-image"
              />
            </div>
            <h4 className="sensor-setup-model-card-title">{SENSOR_WIFI_SHORT}</h4>
            <p className="sensor-setup-model-card-description">
              Same as {SENSOR_STANDARD_SHORT} plus remote monitoring. 24V or battery. WiFi setup required.
            </p>
          </div>
        </div>
      </div>

      {/* What You'll Need */}
      <div className="sensor-setup-what-you-need">
        <h3 className="sensor-setup-what-you-need-title">
          <span className="sensor-setup-what-you-need-icon">📦</span>
          What You'll Need
        </h3>
        <div className="sensor-setup-what-you-need-grid">
          <div className="sensor-setup-what-you-need-item">
            <div className="sensor-setup-what-you-need-item-icon-wrapper">
              <span className="sensor-setup-what-you-need-item-icon">🔋</span>
            </div>
            <div className="sensor-setup-what-you-need-item-content">
              <p className="sensor-setup-what-you-need-item-title">ACDW Sensor</p>
              <p className="sensor-setup-what-you-need-item-description">Unboxed</p>
            </div>
          </div>
          <div className="sensor-setup-what-you-need-item">
            <div className="sensor-setup-what-you-need-item-icon-wrapper">
              <span className="sensor-setup-what-you-need-item-icon">🔌</span>
            </div>
            <div className="sensor-setup-what-you-need-item-content">
              <p className="sensor-setup-what-you-need-item-title">24V Cable</p>
              <p className="sensor-setup-what-you-need-item-description">Included with both models; connects to air handler 24V</p>
            </div>
          </div>
          <div className="sensor-setup-what-you-need-item">
            <div className="sensor-setup-what-you-need-item-icon-wrapper">
              <span className="sensor-setup-what-you-need-item-icon">🔋</span>
            </div>
            <div className="sensor-setup-what-you-need-item-content">
              <p className="sensor-setup-what-you-need-item-title">Battery</p>
              <p className="sensor-setup-what-you-need-item-description">WiFi model only; backup power</p>
            </div>
          </div>
          <div className="sensor-setup-what-you-need-item">
            <div className="sensor-setup-what-you-need-item-icon-wrapper">
              <span className="sensor-setup-what-you-need-item-icon">📱</span>
            </div>
            <div className="sensor-setup-what-you-need-item-content">
              <p className="sensor-setup-what-you-need-item-title">Smartphone/Tablet</p>
              <p className="sensor-setup-what-you-need-item-description">For setup</p>
            </div>
          </div>
          <div className="sensor-setup-what-you-need-item">
            <div className="sensor-setup-what-you-need-item-icon-wrapper">
              <span className="sensor-setup-what-you-need-item-icon">📶</span>
            </div>
            <div className="sensor-setup-what-you-need-item-content">
              <p className="sensor-setup-what-you-need-item-title">Wi-Fi Password</p>
              <p className="sensor-setup-what-you-need-item-description">Homeowner's network (WiFi model only)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
