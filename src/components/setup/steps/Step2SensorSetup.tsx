import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { 
  ExclamationTriangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Battery100Icon,
  BoltIcon,
  CpuChipIcon,
  DevicePhoneMobileIcon,
  WifiIcon
} from '@heroicons/react/24/outline'
import { SENSOR_STANDARD_DISPLAY, SENSOR_STANDARD_SHORT, SENSOR_WIFI_DISPLAY, SENSOR_WIFI_SHORT } from '../../../config/acdwKnowledge'

interface Step2SensorSetupProps {
  onWifiInteraction?: () => void
  onPhysicalOpened?: () => void
  onModelSelect?: (model: 'nonwifi' | 'wifi') => void
}

export interface Step2SensorSetupHandle {
  handleContinueClick: () => boolean // Returns true if handled, false if should proceed normally
}

export const Step2SensorSetup = forwardRef<Step2SensorSetupHandle, Step2SensorSetupProps>(
  ({ onWifiInteraction, onPhysicalOpened, onModelSelect }, ref) => {
  const [selectedModel, setSelectedModel] = useState<'nonwifi' | 'wifi' | null>(null)
  const [expandedSection, setExpandedSection] = useState<'physical' | 'wifi' | null>(null)
  const [physicalHasBeenOpened, setPhysicalHasBeenOpened] = useState(false)
  const [wifiHasBeenOpened, setWifiHasBeenOpened] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const physicalAccordionContentRef = useRef<HTMLDivElement>(null)
  const wifiAccordionContentRef = useRef<HTMLDivElement>(null)

  // Expose handleContinueClick method to parent
  useImperativeHandle(ref, () => ({
    handleContinueClick: () => {
      // WiFi path only: if Physical is open, open WiFi and scroll to it (don't advance step yet)
      if (selectedModel === 'wifi' && expandedSection === 'physical') {
        setExpandedSection('wifi')
        setPhysicalHasBeenOpened(true)
        onPhysicalOpened?.()
        if (!wifiHasBeenOpened) {
          setWifiHasBeenOpened(true)
          if (onWifiInteraction) onWifiInteraction()
        }
        setTimeout(() => {
          if (wifiAccordionContentRef.current) {
            wifiAccordionContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 150)
        return true
      }
      return false
    }
  }))

  const toggleSection = (section: 'physical' | 'wifi') => {
    // Prevent WiFi from opening if Physical hasn't been opened first
    if (section === 'wifi' && !physicalHasBeenOpened) {
      // Open Physical Setup accordion
      setExpandedSection('physical')
      setPhysicalHasBeenOpened(true)
      // Show notification message
      setShowNotification(true)
      // Hide notification after 5 seconds
      setTimeout(() => {
        setShowNotification(false)
      }, 5000)
      
      // Scroll to notification message instead of top
      setTimeout(() => {
        if (notificationRef.current) {
          notificationRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
      return
    }

    // Normal accordion behavior: clicking the same section toggles it
    // If clicking a different section, expand it (and collapse the current one)
    if (expandedSection === section) {
      // Toggle: if clicking the expanded section, collapse it
      setExpandedSection(null)
    } else {
      // Expand the clicked section (other will automatically collapse)
      setExpandedSection(section)
    }

    // Track when Physical section is opened for the first time
    if (section === 'physical' && !physicalHasBeenOpened) {
      setPhysicalHasBeenOpened(true)
      onPhysicalOpened?.()
    }

    // Track when WiFi section is opened for the first time
    if (section === 'wifi' && !wifiHasBeenOpened) {
      setWifiHasBeenOpened(true)
      if (onWifiInteraction) {
        onWifiInteraction()
      }
    }
  }

  // Also trigger when WiFi section becomes expanded (in case it's opened programmatically)
  useEffect(() => {
    if (expandedSection === 'wifi' && !wifiHasBeenOpened) {
      setWifiHasBeenOpened(true)
      if (onWifiInteraction) {
        onWifiInteraction()
      }
    }
  }, [expandedSection, wifiHasBeenOpened, onWifiInteraction])

  // Scroll to accordion content when it opens
  useEffect(() => {
    if (expandedSection === 'physical' && physicalAccordionContentRef.current) {
      // Small delay to allow DOM to update
      setTimeout(() => {
        if (physicalAccordionContentRef.current) {
          physicalAccordionContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 150)
    } else if (expandedSection === 'wifi' && wifiAccordionContentRef.current) {
      // Small delay to allow DOM to update
      setTimeout(() => {
        if (wifiAccordionContentRef.current) {
          wifiAccordionContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 150)
    }
  }, [expandedSection])

  // Non-WiFi: physical-only flow (Unbox is above; these are the steps after model selection)
  const physicalStepsNonWifi = [
    {
      number: 1,
      title: 'Power Up the Sensor',
      description: 'Connect the included 24V cable to the air handler (same style connection as a float switch). This is the only power source for the Non‑WiFi model. When there is power, the LED status light will go from red to green and stay a solid green.',
      image: '/images/setup/step2-3-power.png',
      alt: 'Powering up the sensor'
    },
    {
      number: 2,
      title: 'Verify LED Status & Test the Sensor',
      description: 'With the LED solid green, the sensor is powered and ready. To verify it is working correctly: place your index finger and thumb on the green PCB board that extends out of the sensor. If the sensor is working correctly, this will trigger the LED to flash red and the AC to shut off—mimicking the behavior of the sensor detecting 95% water levels in the drain line.',
      image: '/images/setup/step2-4-led.png',
      alt: 'LED solid green; testing sensor with touch on PCB'
    }
  ]

  // WiFi: physical then WiFi (Unbox is above; these are the steps after model selection)
  const physicalStepsWifi = [
    {
      number: 1,
      title: 'Power Up the Sensor',
      description: 'Connect the 24V cable to the air handler and/or insert the backup battery. When there is power, the LED status light will begin to blink red. This means the unit is powered up but has not yet connected to a valid Wi‑Fi network. Complete the WiFi Connection steps below.',
      image: '/images/setup/step2-3-power.png',
      alt: 'Powering up the sensor'
    },
    {
      number: 2,
      title: 'Verify LED Status',
      description: 'While the LED is blinking red, the sensor is ready for WiFi setup. Once you complete the following steps and the sensor connects to the ACDW Sensor Servers over the network, the LED status light will switch to a constant green.',
      image: '/images/setup/step2-4-led.png',
      alt: 'LED blinking red (awaiting WiFi); solid green when connected'
    }
  ]

  const physicalSteps = selectedModel === 'wifi' ? physicalStepsWifi : physicalStepsNonWifi

  const handleModelSelect = (model: 'nonwifi' | 'wifi') => {
    setSelectedModel(model)
    onModelSelect?.(model)
  }

  const wifiSteps = [
    {
      number: 5,
      title: 'Connect to Sensor Wi-Fi (if WPS is not available)',
      description: 'On your phone or tablet, go to Wi-Fi settings and connect to the network named "ACDW Sensor (ID)" or "Sensor (ID)". Once connected, you\'ll be redirected automatically.',
      image: '/images/setup/step2-5-wifi-settings.png',
      alt: 'Phone Wi-Fi settings showing ACDW Sensor network'
    },
    {
      number: 6,
      title: 'Select Home Wi-Fi Network',
      description: 'You\'ll see a setup page with available Wi-Fi networks. Select the homeowner\'s Wi-Fi network and enter the password.',
      image: '/images/setup/step2-6-network-selection.png',
      alt: 'Captive portal showing Wi-Fi network selection'
    },
    {
      number: 7,
      title: 'Login to ACDW Monitor',
      description: 'After the sensor connects to Wi-Fi, you\'ll see a login screen. Enter your ACDW Monitor account email and password.',
      image: '/images/setup/step2-7-login.png',
      alt: 'ACDW Monitor login screen'
    }
  ]

  return (
    <div className="sensor-setup-step-container">
      {/* Step Number Badge */}
      <div className="sensor-setup-step-badge-wrapper">
        <div className="sensor-setup-step-badge sensor-setup-step-badge-step2">
          <span className="sensor-setup-step-badge-number">2</span>
        </div>
      </div>

      {/* Step Title */}
      <div className="sensor-setup-step-title-section">
        <h2 className="sensor-setup-step-title">
          {selectedModel === 'nonwifi' ? 'Set up Sensor (Non‑WiFi)' : selectedModel === 'wifi' ? 'Set up Sensor and Connect to WiFi' : 'Set up Sensor'}
        </h2>
        <p className="sensor-setup-step-subtitle">
          {selectedModel === 'nonwifi'
            ? 'Physical installation only—no WiFi setup required.'
            : selectedModel === 'wifi'
              ? 'Physical installation and WiFi connection.'
              : 'Select your model below, then follow the steps for your installation.'}
        </p>
      </div>

      {/* Prerequisites Callout */}
      <div className="sensor-setup-prerequisites-callout">
        <div className="sensor-setup-prerequisites-callout-content">
          <ExclamationTriangleIcon className="sensor-setup-prerequisites-callout-icon" />
          <div className="sensor-setup-prerequisites-callout-text">
            <h3 className="sensor-setup-prerequisites-callout-title">Prerequisite</h3>
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
      </div>

      {/* What You'll Need */}
      <div className="sensor-setup-what-you-need">
        <h3 className="sensor-setup-what-you-need-title">What You'll Need</h3>
        <div className="sensor-setup-what-you-need-grid">
          <div className="sensor-setup-what-you-need-item">
            <div className="sensor-setup-what-you-need-item-icon-wrapper">
              <CpuChipIcon className="sensor-setup-what-you-need-item-icon" />
            </div>
            <div className="sensor-setup-what-you-need-item-content">
              <p className="sensor-setup-what-you-need-item-title">ACDW Sensor</p>
              <p className="sensor-setup-what-you-need-item-description">Unboxed</p>
            </div>
          </div>
<div className="sensor-setup-what-you-need-item">
            <div className="sensor-setup-what-you-need-item-icon-wrapper">
              <BoltIcon className="sensor-setup-what-you-need-item-icon" />
            </div>
            <div className="sensor-setup-what-you-need-item-content">
              <p className="sensor-setup-what-you-need-item-title">24V Cable</p>
              <p className="sensor-setup-what-you-need-item-description">Included with both models; connects to air handler 24V</p>
            </div>
          </div>
          <div className="sensor-setup-what-you-need-item">
            <div className="sensor-setup-what-you-need-item-icon-wrapper">
              <Battery100Icon className="sensor-setup-what-you-need-item-icon" />
            </div>
            <div className="sensor-setup-what-you-need-item-content">
              <p className="sensor-setup-what-you-need-item-title">Battery</p>
              <p className="sensor-setup-what-you-need-item-description">WiFi model only; backup power</p>
            </div>
          </div>
          <div className="sensor-setup-what-you-need-item">
            <div className="sensor-setup-what-you-need-item-icon-wrapper">
              <DevicePhoneMobileIcon className="sensor-setup-what-you-need-item-icon" />
            </div>
            <div className="sensor-setup-what-you-need-item-content">
              <p className="sensor-setup-what-you-need-item-title">Smartphone / Tablet</p>
              <p className="sensor-setup-what-you-need-item-description">For setup</p>
            </div>
          </div>
          <div className="sensor-setup-what-you-need-item">
            <div className="sensor-setup-what-you-need-item-icon-wrapper">
              <WifiIcon className="sensor-setup-what-you-need-item-icon" />
            </div>
            <div className="sensor-setup-what-you-need-item-content">
              <p className="sensor-setup-what-you-need-item-title">Wi-Fi Password</p>
              <p className="sensor-setup-what-you-need-item-description">Homeowner's network (WiFi model only)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Unbox Sensor - before model selection (not a numbered step) */}
      <div className="sensor-setup-unbox-callout">
        <h3 className="sensor-setup-unbox-callout-title">Unbox Sensor</h3>
        <p className="sensor-setup-unbox-callout-description">Remove the sensor from its packaging. Check that all components are included (24V cable; WiFi model also includes backup battery).</p>
        <div className="sensor-setup-unbox-callout-image-wrapper">
          <img src="/images/setup/step2-1-unbox.png" alt="Unboxing the sensor" className="sensor-setup-unbox-callout-image" />
        </div>
      </div>

      {/* Model selection - required before showing steps */}
      <div className="sensor-setup-model-selector">
        <h3 className="sensor-setup-model-selector-title">Which model are you installing?</h3>
        <p className="sensor-setup-model-selector-description">Select one to see the correct installation steps.</p>
        <div className="sensor-setup-model-selector-cards">
          <button
            type="button"
            onClick={() => handleModelSelect('nonwifi')}
            className={`sensor-setup-model-selector-card ${selectedModel === 'nonwifi' ? 'sensor-setup-model-selector-card-selected' : ''}`}
          >
            <div className="sensor-setup-model-selector-card-image-wrapper">
              <img src="/images/setup/model-non-wifi.png" alt={SENSOR_STANDARD_DISPLAY} className="sensor-setup-model-selector-card-image" />
            </div>
            <h4 className="sensor-setup-model-selector-card-title">{SENSOR_STANDARD_SHORT}</h4>
            <p className="sensor-setup-model-selector-card-description">Power from 24V cable only. Stops AC at critical water level. No WiFi setup.</p>
          </button>
          <button
            type="button"
            onClick={() => handleModelSelect('wifi')}
            className={`sensor-setup-model-selector-card ${selectedModel === 'wifi' ? 'sensor-setup-model-selector-card-selected' : ''}`}
          >
            <div className="sensor-setup-model-selector-card-image-wrapper">
              <img src="/images/setup/model-wifi.png" alt={SENSOR_WIFI_DISPLAY} className="sensor-setup-model-selector-card-image" />
            </div>
            <h4 className="sensor-setup-model-selector-card-title">{SENSOR_WIFI_SHORT}</h4>
            <p className="sensor-setup-model-selector-card-description">Same as Non‑WiFi plus remote monitoring. 24V or battery. WiFi setup required.</p>
          </button>
        </div>
      </div>

      {/* Notification Message */}
      {showNotification && (
        <div ref={notificationRef} className="sensor-setup-notification">
          <div className="sensor-setup-notification-content">
            <ExclamationTriangleIcon className="sensor-setup-notification-icon" />
            <p className="sensor-setup-notification-message">
              Complete the Physical Setup steps first, then open WiFi Connection.
            </p>
          </div>
        </div>
      )}

      {/* Physical Setup Accordion Section - only after model selected */}
      {selectedModel !== null && (
      <div className={`sensor-setup-accordion-section ${expandedSection === 'physical' ? 'sensor-setup-accordion-section-expanded' : 'sensor-setup-accordion-section-collapsed'} ${!physicalHasBeenOpened ? 'sensor-setup-accordion-section-pulsating' : ''}`}>
        <button
          onClick={() => toggleSection('physical')}
          className="sensor-setup-accordion-header"
        >
          <div className="sensor-setup-accordion-header-content">
            <div className="sensor-setup-accordion-header-left">
              <div className="sensor-setup-accordion-status-icon sensor-setup-accordion-status-icon-pending" />
              <h3 className="sensor-setup-accordion-title">Physical Setup</h3>
              {!physicalHasBeenOpened && (
                <span className="sensor-setup-accordion-badge sensor-setup-accordion-badge-next-step">Next Step</span>
              )}
            </div>
            <div className="sensor-setup-accordion-header-right">
              {expandedSection === 'physical' ? (
                <ChevronUpIcon className="sensor-setup-accordion-chevron" />
              ) : (
                <ChevronDownIcon className="sensor-setup-accordion-chevron" />
              )}
            </div>
          </div>
        </button>

        {expandedSection === 'physical' && (
          <div ref={physicalAccordionContentRef} className="sensor-setup-accordion-content">
            <div className="sensor-setup-installation-steps">
              {physicalSteps.map((step) => (
                <div key={step.number} className="sensor-setup-installation-step-card">
                  <div className="sensor-setup-installation-step-content">
                    {/* Step Number */}
                    <div className="sensor-setup-installation-step-number-wrapper">
                      <div className="sensor-setup-installation-step-number-badge">
                        <span className="sensor-setup-installation-step-number">{step.number}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="sensor-setup-installation-step-details">
                      <h3 className="sensor-setup-installation-step-title">{step.title}</h3>
                      <p className="sensor-setup-installation-step-description">{step.description}</p>
                      <div className="sensor-setup-installation-step-image-wrapper">
                        <img
                          src={step.image}
                          alt={step.alt}
                          className="sensor-setup-installation-step-image"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {expandedSection !== 'physical' && (
          <div className="sensor-setup-accordion-preview">
            <p className="sensor-setup-accordion-preview-text">
              {physicalSteps.length} steps to complete
            </p>
          </div>
        )}
      </div>
      )}

      {/* WiFi Connection Accordion Section - WiFi model only */}
      {selectedModel === 'wifi' && (
      <div className={`sensor-setup-accordion-section ${expandedSection === 'wifi' ? 'sensor-setup-accordion-section-expanded' : 'sensor-setup-accordion-section-collapsed'} ${physicalHasBeenOpened && !wifiHasBeenOpened ? 'sensor-setup-accordion-section-pulsating' : ''}`}>
        <button
          onClick={() => toggleSection('wifi')}
          className="sensor-setup-accordion-header"
        >
          <div className="sensor-setup-accordion-header-content">
            <div className="sensor-setup-accordion-header-left">
              <div className="sensor-setup-accordion-status-icon sensor-setup-accordion-status-icon-pending" />
              <h3 className="sensor-setup-accordion-title">WiFi Connection</h3>
              <span className="sensor-setup-accordion-badge sensor-setup-accordion-badge-wifi-only">WiFi model only</span>
              {physicalHasBeenOpened && !wifiHasBeenOpened && (
                <span className="sensor-setup-accordion-badge sensor-setup-accordion-badge-next-step">Next Step</span>
              )}
            </div>
            <div className="sensor-setup-accordion-header-right">
              {expandedSection === 'wifi' ? (
                <ChevronUpIcon className="sensor-setup-accordion-chevron" />
              ) : (
                <ChevronDownIcon className="sensor-setup-accordion-chevron" />
              )}
            </div>
          </div>
        </button>

        {expandedSection === 'wifi' && (
          <div ref={wifiAccordionContentRef} className="sensor-setup-accordion-content">
            {/* Optional WPS path */}
            <div className="sensor-setup-wps-callout">
              <h4 className="sensor-setup-wps-callout-title">Before you connect</h4>
              <p className="sensor-setup-wps-callout-intro">The sensor should already have power (24V cable or battery). If the LED is still blinking red, place the sensor into the T manifold and twist it into place. Then use either the optional WPS method or the steps below to connect to Wi‑Fi.</p>
              <h4 className="sensor-setup-wps-callout-title">Optional: Connect via WPS (faster)</h4>
              <p className="sensor-setup-wps-callout-intro">If your homeowner's router supports Wi‑Fi Protected Setup (WPS), you can connect without entering the network password:</p>
              <ol className="sensor-setup-wps-callout-steps">
                <li>Confirm the router has WPS enabled (check router settings or label).</li>
                <li>Within about 2 minutes, press and hold the <strong>WPS button</strong> on the router (usually on the back or side) until the WPS light flashes.</li>
                <li>If the sensor successfully connects via the WPS process, the LED light should turn a solid green and the installer can move on to the login and registration step.</li>
              </ol>
              <p className="sensor-setup-wps-callout-note">
                <strong>Note:</strong> Not all routers support WPS. iOS devices cannot use WPS to join a network—use the standard steps below instead.
              </p>
            </div>
            <div className="sensor-setup-wifi-steps">
              {wifiSteps.map((step) => (
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
          </div>
        )}

        {expandedSection !== 'wifi' && (
          <div className="sensor-setup-accordion-preview">
            <p className="sensor-setup-accordion-preview-text">
              {wifiSteps.length} steps to connect your sensor to WiFi
            </p>
          </div>
        )}
      </div>
      )}
    </div>
  )
})

Step2SensorSetup.displayName = 'Step2SensorSetup'

