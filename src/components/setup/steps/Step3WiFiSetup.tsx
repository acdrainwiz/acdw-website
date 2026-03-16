import { MONITORING } from '../../../config/acdwKnowledge'

export function Step3WiFiSetup() {
  const steps = [
    {
      number: 1,
      title: 'Connect to Sensor Wi-Fi',
      description: 'On your phone or tablet, go to Wi-Fi settings and connect to the network named "ACDW Sensor (ID)". Once connected, you\'ll be redirected automatically.',
      image: '/images/setup/step3-1-wifi-settings.png',
      alt: 'Phone Wi-Fi settings showing ACDW Sensor network'
    },
    {
      number: 2,
      title: 'Select Home Wi-Fi Network',
      description: 'You\'ll see a setup page with available Wi-Fi networks. Select the homeowner\'s Wi-Fi network and enter the password.',
      image: '/images/setup/step3-2-network-selection.png',
      alt: 'Captive portal showing Wi-Fi network selection'
    },
    {
      number: 3,
      title: 'Login to ACDW Monitor',
      description: 'After the sensor connects to Wi-Fi, you\'ll see a login screen. Enter your ACDW Monitor account email and password.',
      image: '/images/setup/step3-3-login.png',
      alt: 'ACDW Monitor login screen'
    },
    {
      number: 4,
      title: 'Register Your Device',
      description: 'Enter the device name, location, and assign it to a customer. Set your alert preferences (Email, SMS, Daily reports).',
      image: '/images/setup/step3-4-registration.png',
      alt: 'Device registration screen'
    }
  ]

  return (
    <div className="sensor-setup-step-container">
      {/* Step Number Badge */}
      <div className="sensor-setup-step-badge-wrapper">
        <div className="sensor-setup-step-badge">
          <span className="sensor-setup-step-badge-number">3</span>
        </div>
      </div>

      {/* Step Title */}
      <div className="sensor-setup-step-title-section">
        <h2 className="sensor-setup-step-title">Wi-Fi & Account Setup</h2>
        <p className="sensor-setup-step-subtitle">
          Complete these steps on your phone or tablet
        </p>
      </div>

      {/* Step-by-Step Phone Screenshots */}
      <div className="sensor-setup-wifi-steps">
        {steps.map((step) => (
          <div key={step.number} className="sensor-setup-wifi-step-card">
            <div className="sensor-setup-wifi-step-content">
              {/* Step Number */}
              <div className="sensor-setup-wifi-step-number-wrapper">
                <div className="sensor-setup-wifi-step-number-badge">
                  <span className="sensor-setup-wifi-step-number">{step.number}</span>
                </div>
              </div>

              {/* Content */}
              <div className="sensor-setup-wifi-step-details">
                <h3 className="sensor-setup-wifi-step-title">{step.title}</h3>
                <p className="sensor-setup-wifi-step-description">{step.description}</p>
                
                {/* Phone Screenshot Image */}
                <div className="sensor-setup-wifi-step-image-wrapper">
                  <img
                    src={step.image}
                    alt={step.alt}
                    className="sensor-setup-wifi-step-image"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Helpful Notes */}
      <div className="sensor-setup-wifi-note sensor-setup-wifi-note-info">
        <p className="sensor-setup-wifi-note-text">
          <strong>What happens automatically:</strong>
        </p>
        <ul className="sensor-setup-wifi-note-list">
          <li>The sensor will connect to the home Wi-Fi network</li>
          <li>It will automatically register to your contractor account</li>
          <li>You'll be able to manage it from your dashboard</li>
        </ul>
      </div>

      <div className="sensor-setup-wifi-note sensor-setup-wifi-note-warning">
        <p className="sensor-setup-wifi-note-text">
          <strong>Don't have an account?</strong>{' '}
          <a
            href={MONITORING.signUpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="sensor-setup-wifi-note-link"
          >
            Sign up at monitor.acdrainwiz.com
          </a>
        </p>
      </div>
    </div>
  )
}
