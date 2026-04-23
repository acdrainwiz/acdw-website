import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Battery100Icon,
  BoltIcon,
  CpuChipIcon,
  DevicePhoneMobileIcon,
  WifiIcon,
  WrenchScrewdriverIcon,
  BeakerIcon
} from '@heroicons/react/24/outline'
import {
  SENSOR_STANDARD_DISPLAY,
  SENSOR_STANDARD_SHORT,
  SENSOR_WIFI_DISPLAY,
  SENSOR_WIFI_SHORT,
  SENSOR_WIFI_POWER_RECOMMENDATION,
  SENSOR_INSTALL_P_TRAP_AFTER_MINI_AIR_FLUSH,
} from '../../../config/acdwKnowledge'

interface Step2SensorSetupProps {
  onWifiInteraction?: () => void
  onPhysicalOpened?: () => void
  onModelSelect?: (model: 'nonwifi' | 'wifi') => void
  /** When set (e.g. from URL), pre-select WiFi vs Standard path */
  presetModel?: 'nonwifi' | 'wifi' | null
  /**
   * When true, the user arrived via a model-specific URL (`?model=`) — model is pre-selected.
   * (Previously showed a separate locked banner; the same model cards are always shown now.)
   */
  lockModelSelection?: boolean
  /** Wizard step index shown in the badge (e.g. 2 legacy WiFi; 4 unified WiFi install step). */
  wizardStepNumber?: 1 | 2 | 3 | 4 | 5
  /** Standard 3-step flow: T manifold was installed in wizard steps 1–2 */
  manifoldInstalledInPriorWizardStep?: boolean
  /** When embedded in a parent that already shows the wizard title (e.g. unified step 3). */
  omitWizardHeader?: boolean
  /** Hide the Standard vs WiFi model cards (e.g. Standard-only unified step; model is implicit). */
  hideModelSelector?: boolean
  /** When true, omit the Unbox callout (shown on Standard manifold step 1 instead). */
  hideUnboxCallout?: boolean
  /** Badge number on the Physical Setup drawer; defaults to `wizardStepNumber`. */
  physicalDrawerBadgeNumber?: 1 | 2 | 3 | 4 | 5
  /** Open Physical Setup on first paint (e.g. unified Standard step 3). */
  initialPhysicalExpanded?: boolean
  /**
   * When true, do not scroll the open Physical/WiFi accordion into view on expand (avoids jump on load when `initialPhysicalExpanded` is set—e.g. WiFi step 4).
   */
  suppressAccordionScrollIntoView?: boolean
}

export interface Step2SensorSetupHandle {
  handleContinueClick: () => boolean // Returns true if handled, false if should proceed normally
}

export const Step2SensorSetup = forwardRef<Step2SensorSetupHandle, Step2SensorSetupProps>(
  (
    {
      onWifiInteraction,
      onPhysicalOpened,
      onModelSelect,
      presetModel = null,
      lockModelSelection = false,
      wizardStepNumber = 2,
      manifoldInstalledInPriorWizardStep = false,
      omitWizardHeader = false,
      hideModelSelector = false,
      hideUnboxCallout = false,
      physicalDrawerBadgeNumber,
      initialPhysicalExpanded = false,
      suppressAccordionScrollIntoView = false,
    },
    ref
  ) => {
  const [selectedModel, setSelectedModel] = useState<'nonwifi' | 'wifi' | null>(presetModel ?? null)

  useEffect(() => {
    if (presetModel) {
      setSelectedModel(presetModel)
      onModelSelect?.(presetModel)
    }
  }, [presetModel, onModelSelect])

  useEffect(() => {
    if (initialPhysicalExpanded) {
      onPhysicalOpened?.()
    }
    // Mount only: parent tracks physicalOpened for Continue; inline callbacks would retrigger deps every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [expandedSection, setExpandedSection] = useState<'physical' | 'wifi' | null>(
    initialPhysicalExpanded ? 'physical' : null
  )
  const [physicalHasBeenOpened, setPhysicalHasBeenOpened] = useState(initialPhysicalExpanded)
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

  // Scroll to accordion content when it opens (optional; disabled on WiFi unified step 4 to avoid jump on load)
  useEffect(() => {
    if (suppressAccordionScrollIntoView) return
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
  }, [expandedSection, suppressAccordionScrollIntoView])

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
      description: 'With the LED solid green, the sensor is powered and ready. To verify it is working correctly: place your index finger and thumb on the green PCB board that extends out of the sensor. If the sensor is working correctly, this will turn the LED solid red and the AC will shut off—mimicking the behavior of the sensor detecting ~80% water levels in the drain line.',
      image: '/images/setup/step2-4-led.png',
      alt: 'LED solid green; testing sensor with touch on PCB'
    }
  ]

  // WiFi: physical then WiFi (Unbox is above; these are the steps after model selection)
  const physicalStepsWifi = [
    {
      number: 1,
      title: 'Power Up the Sensor',
      description:
        '24V HVAC power is strongly recommended for reliable operation and consistent LED feedback. Connect the included 24V cable to the air handler (same style connection as a float switch). Confirm a solid connection at the terminals before continuing. You may use the included battery for backup alongside 24V, or run battery-only if the site requires it—battery-only limits LED visibility (the light may go off after startup while monitoring continues), and a fully depleted battery may trigger protective HVAC shutdown. When there is power, the LED will typically begin to blink red: powered up but not yet connected to a valid Wi‑Fi network. Complete the WiFi Connection steps below.',
      image: '/images/setup/step2-3-power.png',
      alt: 'Connecting 24V power cable at the air handler'
    },
    {
      number: 2,
      title: 'Verify LED Status',
      description:
        'While the LED is flashing red, the sensor is ready for WiFi setup. During setup you may see flashing green when a mobile device is connected; when the sensor connects to the ACDW Sensor Servers over the network, the LED turns solid green. On battery-only power after setup, you may see little or no LED while the sensor remains online—see Product Support for the WiFi battery-only LED guide.',
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
      {!omitWizardHeader && (
        <>
          <div className="sensor-setup-step-badge-wrapper">
            <div
              className={
                wizardStepNumber === 2
                  ? 'sensor-setup-step-badge sensor-setup-step-badge-step2'
                  : wizardStepNumber === 3
                    ? 'sensor-setup-step-badge sensor-setup-step-badge-step3'
                    : wizardStepNumber === 4
                      ? 'sensor-setup-step-badge sensor-setup-step-badge-step4'
                      : wizardStepNumber === 5
                        ? 'sensor-setup-step-badge sensor-setup-step-badge-step5'
                        : 'sensor-setup-step-badge'
              }
            >
              <span className="sensor-setup-step-badge-number">{wizardStepNumber}</span>
            </div>
          </div>

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
        </>
      )}

      {/* Prerequisites — or confirmation when manifold was completed in this guide (Standard steps 1–2) */}
      {manifoldInstalledInPriorWizardStep ? (
        <div className="sensor-setup-prerequisites-callout sensor-setup-prerequisites-callout-done">
          <div className="sensor-setup-prerequisites-callout-content">
            <CheckCircleIcon className="sensor-setup-prerequisites-callout-icon sensor-setup-prerequisites-callout-icon-done" />
            <div className="sensor-setup-prerequisites-callout-text">
              <h3 className="sensor-setup-prerequisites-callout-title">T manifold installed</h3>
              <p className="sensor-setup-prerequisites-callout-item-description">
                You completed the solvent-weld install in steps 1 and 2. Continue below with sensor power, testing, and bayonet mounting. If the manifold was installed earlier outside this guide, confirm joints are cured and leak-free before proceeding.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="sensor-setup-prerequisites-callout">
          <div className="sensor-setup-prerequisites-callout-content">
            <ExclamationTriangleIcon className="sensor-setup-prerequisites-callout-icon" />
            <div className="sensor-setup-prerequisites-callout-text">
              <h3 className="sensor-setup-prerequisites-callout-title">Prerequisite</h3>
              <p className="sensor-setup-prerequisites-callout-item-description">
                The Transparent T-Manifold must be installed by the AC technician before sensor setup;{' '}
                <a href="/mini-setup" className="sensor-setup-prerequisites-callout-item-link">
                  view installation steps in the Mini Setup Guide →
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* What You'll Need — WiFi only on this step; Standard guide lists manifold/PVC tools in step 1 + Unbox below */}
      {selectedModel !== 'nonwifi' && (
        <div className="sensor-setup-what-you-need">
          <h3 className="sensor-setup-what-you-need-title">What You&apos;ll Need</h3>
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
                <p className="sensor-setup-what-you-need-item-description">Included; connects to air handler 24V</p>
              </div>
            </div>

            {selectedModel === 'wifi' ? (
              <>
                <div className="sensor-setup-what-you-need-item">
                  <div className="sensor-setup-what-you-need-item-icon-wrapper">
                    <Battery100Icon className="sensor-setup-what-you-need-item-icon" />
                  </div>
                  <div className="sensor-setup-what-you-need-item-content">
                    <p className="sensor-setup-what-you-need-item-title">Battery</p>
                    <p className="sensor-setup-what-you-need-item-description">WiFi model; backup power (~2 years)</p>
                  </div>
                </div>
                <div className="sensor-setup-what-you-need-item">
                  <div className="sensor-setup-what-you-need-item-icon-wrapper">
                    <DevicePhoneMobileIcon className="sensor-setup-what-you-need-item-icon" />
                  </div>
                  <div className="sensor-setup-what-you-need-item-content">
                    <p className="sensor-setup-what-you-need-item-title">Smartphone / tablet</p>
                    <p className="sensor-setup-what-you-need-item-description">Wi‑Fi pairing and captive portal</p>
                  </div>
                </div>
                <div className="sensor-setup-what-you-need-item">
                  <div className="sensor-setup-what-you-need-item-icon-wrapper">
                    <WifiIcon className="sensor-setup-what-you-need-item-icon" />
                  </div>
                  <div className="sensor-setup-what-you-need-item-content">
                    <p className="sensor-setup-what-you-need-item-title">Wi‑Fi password</p>
                    <p className="sensor-setup-what-you-need-item-description">Homeowner&apos;s 2.4 GHz network</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="sensor-setup-what-you-need-item">
                  <div className="sensor-setup-what-you-need-item-icon-wrapper">
                    <WrenchScrewdriverIcon className="sensor-setup-what-you-need-item-icon" />
                  </div>
                  <div className="sensor-setup-what-you-need-item-content">
                    <p className="sensor-setup-what-you-need-item-title">PVC cutter or hacksaw</p>
                    <p className="sensor-setup-what-you-need-item-description">Cut 3/4&quot; drain line for Transparent T manifold</p>
                  </div>
                </div>
                <div className="sensor-setup-what-you-need-item">
                  <div className="sensor-setup-what-you-need-item-icon-wrapper">
                    <BeakerIcon className="sensor-setup-what-you-need-item-icon" />
                  </div>
                  <div className="sensor-setup-what-you-need-item-content">
                    <p className="sensor-setup-what-you-need-item-title">PVC primer &amp; cement</p>
                    <p className="sensor-setup-what-you-need-item-description">
                      e.g. Oatey all-purpose—primer and cement only on the condensate line, then fit into the T manifold horizontal openings
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
          {selectedModel === null && (
            <p className="sensor-setup-what-you-need-model-hint">
              Select a model above: Standard shows tools for manifold and drain line; WiFi adds phone, battery, and network for pairing.
            </p>
          )}
        </div>
      )}

      {/* Unbox Sensor — WiFi flow here; Standard (Non-WiFi) wizard shows this on manifold step 1 */}
      {!hideUnboxCallout && (
      <div className="sensor-setup-unbox-callout">
        <h3 className="sensor-setup-unbox-callout-title">Unbox Sensor</h3>
        <p className="sensor-setup-unbox-callout-description">Remove the sensor from its packaging. Check that all components are included (24V cable; WiFi model also includes backup battery).</p>
        <div className="sensor-setup-unbox-callout-image-wrapper">
          <img src="/images/setup/step2-1-unbox.png" alt="Unboxing the sensor" className="sensor-setup-unbox-callout-image" />
        </div>
      </div>
      )}

      {/* Model selection (same UI whether user picked a model on the picker page or via ?model= URL) */}
      {!hideModelSelector && (
      <div
        className="sensor-setup-model-selector"
        data-sensor-setup-from-model-link={lockModelSelection ? true : undefined}
      >
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
      )}

      {selectedModel === 'wifi' && (
        <div className="sensor-setup-wps-callout">
          <h4 className="sensor-setup-wps-callout-title">Power options (WiFi)</h4>
          <p className="sensor-setup-wps-callout-intro">{SENSOR_WIFI_POWER_RECOMMENDATION}</p>
        </div>
      )}

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

      {/* Physical Setup — same drawer chrome as Mini / Standard manifold step (mini-setup-accordion-*) */}
      {selectedModel !== null && (
      <div
        className={`mini-setup-accordion-section ${
          expandedSection === 'physical' ? 'mini-setup-accordion-section-expanded' : 'mini-setup-accordion-section-collapsed'
        } ${!physicalHasBeenOpened ? 'mini-setup-accordion-section-pulsating' : ''}`}
      >
        <button
          type="button"
          onClick={() => toggleSection('physical')}
          className="mini-setup-accordion-header"
          aria-expanded={expandedSection === 'physical'}
        >
          <div className="mini-setup-accordion-header-content">
            <div className="mini-setup-accordion-header-left">
              <div className="mini-setup-accordion-wizard-step-badge" aria-hidden>
                <span className="mini-setup-accordion-wizard-step-badge-number">
                  {physicalDrawerBadgeNumber ?? wizardStepNumber}
                </span>
              </div>
              <span className="mini-setup-accordion-title">Physical Setup</span>
            </div>
            <div className="mini-setup-accordion-header-right">
              <span className="mini-setup-accordion-badge mini-setup-accordion-badge-ready">
                {physicalSteps.length} Steps
              </span>
              {expandedSection === 'physical' ? (
                <ChevronUpIcon className="mini-setup-accordion-chevron" aria-hidden />
              ) : (
                <ChevronDownIcon className="mini-setup-accordion-chevron" aria-hidden />
              )}
            </div>
          </div>
        </button>

        {expandedSection === 'physical' && (
          <div ref={physicalAccordionContentRef} className="mini-setup-accordion-content">
            <div className="sensor-setup-installation-steps mini-setup-accordion-sensor-steps">
              {physicalSteps.map((step) => (
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
              {selectedModel === 'wifi' && (
                <div className="sensor-setup-wps-callout mt-4">
                  <h4 className="sensor-setup-wps-callout-title">If you cleared the line with compressed air</h4>
                  <p className="sensor-setup-wps-callout-intro">{SENSOR_INSTALL_P_TRAP_AFTER_MINI_AIR_FLUSH}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      )}

      {/* WiFi Connection — same drawer chrome as Physical Setup (mini-setup-accordion-*) */}
      {selectedModel === 'wifi' && (
      <div
        className={`mini-setup-accordion-section ${
          expandedSection === 'wifi' ? 'mini-setup-accordion-section-expanded' : 'mini-setup-accordion-section-collapsed'
        } ${physicalHasBeenOpened && !wifiHasBeenOpened ? 'mini-setup-accordion-section-pulsating' : ''}`}
      >
        <button
          type="button"
          onClick={() => toggleSection('wifi')}
          className="mini-setup-accordion-header"
          aria-expanded={expandedSection === 'wifi'}
        >
          <div className="mini-setup-accordion-header-content">
            <div className="mini-setup-accordion-header-left">
              <div className="mini-setup-accordion-wizard-step-badge" aria-hidden>
                <span className="mini-setup-accordion-wizard-step-badge-number">2</span>
              </div>
              <span className="mini-setup-accordion-title">WiFi Connection</span>
              {physicalHasBeenOpened && !wifiHasBeenOpened && (
                <span className="sensor-setup-accordion-badge sensor-setup-accordion-badge-next-step">Next Step</span>
              )}
            </div>
            <div className="mini-setup-accordion-header-right">
              <span className="mini-setup-accordion-badge mini-setup-accordion-badge-ready">
                {wifiSteps.length} Steps
              </span>
              {expandedSection === 'wifi' ? (
                <ChevronUpIcon className="mini-setup-accordion-chevron" aria-hidden />
              ) : (
                <ChevronDownIcon className="mini-setup-accordion-chevron" aria-hidden />
              )}
            </div>
          </div>
        </button>

        {expandedSection === 'wifi' && (
          <div ref={wifiAccordionContentRef} className="mini-setup-accordion-content">
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
      </div>
      )}
    </div>
  )
})

Step2SensorSetup.displayName = 'Step2SensorSetup'

