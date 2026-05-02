import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { 
  PhoneIcon,
  EnvelopeIcon,
  WrenchScrewdriverIcon,
  BellAlertIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import {
  SENSOR_LED_STANDARD,
  SENSOR_LED_WIFI,
  SENSOR_LED_WIFI_BATTERY_ONLY,
  SENSOR_LED_ANSWER,
  SENSOR_STANDARD_DISPLAY,
  SENSOR_WIFI_SHORT,
  SENSOR_WIFI_POWER_RECOMMENDATION,
  SENSOR_SETUP_MODEL_CHOICE_HREF,
  SUPPORT_CONTACT,
  MONITORING,
  FAQ,
  type ProductSupportTab,
  type SensorVariantFilter,
} from '../config/acdwKnowledge'
import { parseProductSupportUrl } from '../utils/supportFaqSearch'
import type { PageSearchMeta } from '../config/siteSearchTypes'
import { PageHeroMeshBackdrop } from '../components/layout/PageHeroMeshBackdrop'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'page-product-support',
  kind: 'product-info',
  title: 'Product Support — FAQs and troubleshooting',
  body:
    'Product Support hub: common questions, troubleshooting, LED guides for Standard and WiFi Sensor, Mini FAQs, and technical help for AC Drain Wiz products.',
  tags: ['faq', 'troubleshooting', 'help', 'sensor', 'mini', 'led'],
  href: '/support/product-support',
}

/** Maps `SENSOR_LED_STANDARD` / `SENSOR_LED_WIFI` entry keys to indicator styles (solid vs flashing). */
function supportLedIndicatorClassName(key: string): string {
  const base = 'support-led-indicator'
  switch (key) {
    case 'noLight':
      return `${base} support-led-off`
    case 'green':
    case 'solidGreen':
      return `${base} support-led-green`
    case 'solidRed':
    case 'solidRedTest':
    case 'solidRedShutdown':
      return `${base} support-led-red`
    case 'flashingRed':
      return `${base} support-led-red support-led-flash`
    case 'flashingGreen':
      return `${base} support-led-green support-led-flash`
    case 'startupGreen':
      return `${base} support-led-green`
    default:
      return `${base} support-led-off`
  }
}

// FAQPage schema for SEO (same source as visible FAQs)
const faqPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}

const PICKER_OPTIONS: { id: ProductSupportTab; label: string; description: string; image?: string; imageAlt?: string; Icon?: typeof WrenchScrewdriverIcon }[] = [
  { id: 'mini', label: 'AC Drain Wiz Mini', description: 'FAQs and troubleshooting for the drain line maintenance manifold.', image: '/images/acdw-mini-hero-background.png', imageAlt: 'AC Drain Wiz Mini' },
  { id: 'sensor', label: 'Sensor Switch', description: 'LED guides, WiFi setup, alerts, and Sensor troubleshooting.', image: '/images/acdw-sensor-showcase-background.png', imageAlt: 'AC Drain Wiz Sensor Switch' },
]

const SENSOR_VARIANT_OPTIONS: { id: SensorVariantFilter; label: string }[] = [
  { id: 'all', label: 'All Sensors' },
  { id: 'wifi', label: 'WiFi Sensor Switch' },
  { id: 'standard', label: 'Standard Sensor Switch (Non-WiFi)' },
]

const ACTIVE_TAB_LABEL: Record<ProductSupportTab, string> = {
  mini: 'AC Drain Wiz Mini',
  sensor: 'Sensor Switch',
}

export function ProductSupportPage() {
  const [searchParams] = useSearchParams()
  const urlParsed = useMemo(() => parseProductSupportUrl(searchParams), [searchParams])

  const [activeTab, setActiveTab] = useState<ProductSupportTab>(() => urlParsed.tab ?? 'mini')
  const [sensorVariant, setSensorVariant] = useState<SensorVariantFilter>(() => urlParsed.variant ?? 'all')
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false)

  useEffect(() => {
    const p = parseProductSupportUrl(searchParams)
    if (p.tab) setActiveTab(p.tab)
    if (p.variant !== null) setSensorVariant(p.variant)
  }, [searchParams])

  useEffect(() => {
    const faqId = urlParsed.faqId
    if (!faqId) return
    const frame = requestAnimationFrame(() => {
      document.getElementById(`support-faq-${faqId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    return () => cancelAnimationFrame(frame)
  }, [urlParsed.faqId])

  const faqsForTab = FAQ.filter((item) => {
    if (!(item.tabs as readonly ProductSupportTab[]).includes(activeTab)) return false
    if (activeTab !== 'sensor') return true
    const variant = (item as { sensorVariant?: 'wifi' | 'standard' }).sensorVariant
    if (sensorVariant === 'all') return true
    if (sensorVariant === 'wifi') return variant !== 'standard'
    return variant !== 'wifi' // standard: hide wifi-only
  })

  const setActiveTabAndResetSensorVariant = (tab: ProductSupportTab) => {
    setActiveTab(tab)
    if (tab !== 'sensor') setSensorVariant('all')
  }

  const handleMobileProductSelect = (tab: ProductSupportTab) => {
    setActiveTabAndResetSensorVariant(tab)
    setMobileSheetOpen(false)
  }

  useEffect(() => {
    if (mobileSheetOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileSheetOpen])

  useEffect(() => {
    if (!mobileSheetOpen) return
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileSheetOpen(false)
    }
    document.addEventListener('keydown', onEscape)
    return () => document.removeEventListener('keydown', onEscape)
  }, [mobileSheetOpen])

  const sensorTypeLabel = activeTab === 'sensor'
    ? sensorVariant === 'all'
      ? ' — All Sensors'
      : sensorVariant === 'wifi'
        ? ' — WiFi Sensor Switch'
        : ' — Standard Sensor Switch (Non-WiFi)'
    : ''

  const sectionContextLabel = activeTab === 'mini'
    ? ' — AC Drain Wiz Mini'
    : activeTab === 'sensor'
      ? sensorTypeLabel
      : ''

  return (
    <div className="support-section-container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }} />

      {/* Hero Banner */}
      <div className="support-hero">
        <PageHeroMeshBackdrop />
        <div className="support-hero-content">
          <div className="support-hero-header">
            <div className="support-hero-breadcrumb">
              <Link to="/support" className="support-hero-breadcrumb-link">
                Support Center
              </Link>
              <span className="support-hero-breadcrumb-separator">/</span>
              <span className="support-hero-breadcrumb-current">Product Support</span>
            </div>
            <h1 className="support-hero-title">Product Support</h1>
            <p className="support-hero-subtitle">
              Troubleshooting guides, FAQs, and technical help for your AC Drain Wiz products.
            </p>
            <div className="support-hero-badge-row">
              <span className="support-hero-badge">FAQs</span>
              <span className="support-hero-badge">Troubleshooting</span>
              <span className="support-hero-badge">LED Guides</span>
            </div>
          </div>
        </div>
      </div>

      {/* Page Body */}
      <div className="container py-12">
        {/* Desktop: Product Picker (cards + sensor pills) */}
        <div className="hidden md:block support-section-content mb-12">
          <h2 className="support-section-section-title">Select your product for FAQs and troubleshooting</h2>
          <div className="support-picker-grid" role="tablist" aria-label="Product support options">
            {PICKER_OPTIONS.map((option) => {
              const isActive = activeTab === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`support-picker-card ${isActive ? 'support-picker-card-active' : ''}`}
                  onClick={() => setActiveTabAndResetSensorVariant(option.id)}
                >
                  {option.image ? (
                    <div className="support-picker-image-area">
                      <img src={option.image} alt={option.imageAlt ?? ''} className="support-picker-image" />
                    </div>
                  ) : (
                    <div className="support-picker-icon-area">
                      {option.Icon && <option.Icon className="support-picker-icon" />}
                    </div>
                  )}
                  <div className="support-picker-card-body">
                    <h3 className="support-picker-title">{option.label}</h3>
                    <p className="support-picker-description">{option.description}</p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Sensor variant sub-pills (only when Sensor is selected) */}
          {activeTab === 'sensor' && (
            <div className="support-sensor-variant-row" role="tablist" aria-label="Sensor type">
              {SENSOR_VARIANT_OPTIONS.map((opt) => {
                const isActive = sensorVariant === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`support-sensor-variant-pill ${isActive ? 'support-sensor-variant-pill-active' : ''}`}
                    onClick={() => setSensorVariant(opt.id)}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Mobile: "Change product" bar + sensor pills — content-first, open sheet to switch */}
        <div className="md:hidden support-section-content mb-6">
          <button
            type="button"
            onClick={() => setMobileSheetOpen(true)}
            className="support-mobile-product-bar"
            aria-expanded={mobileSheetOpen}
            aria-haspopup="dialog"
            aria-label="Change product for support content"
          >
            <span className="support-mobile-product-bar-label">{ACTIVE_TAB_LABEL[activeTab]}</span>
            <ChevronDownIcon className="support-mobile-product-bar-icon" aria-hidden />
          </button>
          {activeTab === 'sensor' && (
            <div className="support-sensor-variant-row mt-4" role="tablist" aria-label="Sensor type">
              {SENSOR_VARIANT_OPTIONS.map((opt) => {
                const isActive = sensorVariant === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`support-sensor-variant-pill ${isActive ? 'support-sensor-variant-pill-active' : ''}`}
                    onClick={() => setSensorVariant(opt.id)}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="support-section-content">

          {/* Common Questions (filtered by tab and sensor variant) */}
          <div className="support-section-faq">
            <h2 className="support-section-section-title">Common Questions{sectionContextLabel}</h2>
            <div className="support-section-faq-list">
              {faqsForTab.map((item) => (
                <div
                  key={item.id}
                  id={`support-faq-${item.id}`}
                  className="support-section-faq-item scroll-mt-28"
                >
                  <h3 className="support-section-faq-question">{item.question}</h3>
                  {item.id === 'portal_login' ? (
                    <p className="support-section-faq-answer">
                      The monitoring portal is available at{' '}
                      <a href={MONITORING.portalUrl} className="support-section-link" target="_blank" rel="noopener noreferrer">
                        monitor.acdrainwiz.com
                      </a>
                      . Log in with the credentials created during Sensor setup. If you haven&apos;t set up an account yet, start with the{' '}
                      <Link to={SENSOR_SETUP_MODEL_CHOICE_HREF} className="support-section-link">Sensor Setup Guide</Link>.
                    </p>
                  ) : item.id === 'sensor_leds' ? (
                    <p className="support-section-faq-answer">{SENSOR_LED_ANSWER[sensorVariant]}</p>
                  ) : (
                    <p className="support-section-faq-answer">{item.answer}</p>
                  )}
                  {item.id === 'sensor_leds' && (
                    <>
                      {/* Show only the selected sensor model's LED guide; when "All Sensors", show both. */}
                      {(sensorVariant === 'all' || sensorVariant === 'standard') && (
                        <>
                          <p className="support-section-faq-answer font-medium mt-2">{SENSOR_STANDARD_DISPLAY}</p>
                          <div className="support-led-table">
                            {Object.entries(SENSOR_LED_STANDARD).map(([key, { label, description }]) => (
                              <div key={key} className="support-led-row">
                                <span className={supportLedIndicatorClassName(key)} aria-hidden />
                                <div>
                                  <span className="support-led-label">{label} — </span>
                                  <span className="support-led-desc">{description}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                      {(sensorVariant === 'all' || sensorVariant === 'wifi') && (
                        <>
                          <p className="support-section-faq-answer font-medium mt-4">
                            {SENSOR_WIFI_SHORT} — 24V powered (recommended)
                          </p>
                          <p className="support-section-faq-answer text-sm text-gray-600 mt-1">
                            {SENSOR_WIFI_POWER_RECOMMENDATION}
                          </p>
                          <div className="support-led-table">
                            {Object.entries(SENSOR_LED_WIFI).map(([key, { label, description }]) => (
                              <div key={key} className="support-led-row">
                                <span className={supportLedIndicatorClassName(key)} aria-hidden />
                                <div>
                                  <span className="support-led-label">{label} — </span>
                                  <span className="support-led-desc">{description}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="support-section-faq-answer font-medium mt-4">
                            {SENSOR_WIFI_SHORT} — battery-only mode
                          </p>
                          <p className="support-section-faq-answer text-sm text-gray-600 mt-1">
                            Monitoring can remain active with limited or no LED. When the LED is on, solid red still indicates high
                            water and protective shutdown—the same meaning as the 24V table above. Use 24V power when possible for
                            clearer status at the unit.
                          </p>
                          <div className="support-led-table">
                            {Object.entries(SENSOR_LED_WIFI_BATTERY_ONLY).map(([key, { label, description }]) => (
                              <div key={key} className="support-led-row">
                                <span className={supportLedIndicatorClassName(key)} aria-hidden />
                                <div>
                                  <span className="support-led-label">{label} — </span>
                                  <span className="support-led-desc">{description}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Troubleshooting (by tab) */}
          <div className="support-section-troubleshooting">
            <h2 className="support-section-section-title">Troubleshooting{sectionContextLabel}</h2>

            {activeTab === 'mini' && (
              <div className="support-product-group">
                <div className="support-product-group-header">
                  <WrenchScrewdriverIcon className="support-product-group-icon" />
                  <h3 className="support-product-group-title">AC Drain Wiz Mini</h3>
                </div>
                <div className="support-section-troubleshooting-list">
                  <div className="support-troubleshooting-item support-troubleshooting-item-warning">
                    <h4 className="support-troubleshooting-title">Water not draining properly</h4>
                    <ul className="support-troubleshooting-list">
                      <li>Check for kinks in the drain line</li>
                      <li>Ensure proper slope (minimum 1/4" per foot)</li>
                      <li>Verify the unit is properly seated and sealed</li>
                      <li>Check for clogs downstream from the unit</li>
                      <li>Use the maintenance flush port to clear any blockage at the unit</li>
                      <li>When clearing the line with air: check for a P-trap in the system. After the air flush, refill the P-trap with water to restore the water seal.</li>
                    </ul>
                  </div>

                  <div className="support-troubleshooting-item support-troubleshooting-item-error">
                    <h4 className="support-troubleshooting-title">Leaks at connections</h4>
                    <ul className="support-troubleshooting-list">
                      <li>Tighten connections and check for proper seating</li>
                      <li>Verify solvent-weld joints are fully cured (24 hours)</li>
                      <li>Check for cracks or damage to PVC fittings</li>
                      <li>Confirm the unit was installed with the correct pipe orientation</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sensor' && (
              <div className="support-product-group support-product-group-sensor">
                <div className="support-product-group-header">
                  <BellAlertIcon className="support-product-group-icon" />
                  <h3 className="support-product-group-title">AC Drain Wiz Sensor</h3>
                </div>
                <div className="support-section-troubleshooting-list">

                  <div className="support-troubleshooting-item support-troubleshooting-item-info">
                    <h4 className="support-troubleshooting-title">
                      {sensorVariant === 'standard'
                        ? 'No LED or sensor not responding'
                        : 'Sensor offline or not appearing on dashboard'}
                    </h4>
                    <ul className="support-troubleshooting-list">
                      <li>
                        Check the LED — on 24V, no light usually means a power issue (see the LED guide above).
                        {sensorVariant !== 'standard' && (
                          <> On battery-only WiFi installs, no light after startup can be normal while the sensor is still monitoring.</>
                        )}
                      </li>
                      <li>Confirm the Sensor is physically seated on the manifold's bayonet mount</li>
                      {sensorVariant !== 'standard' && (
                        <li>Verify the Sensor is within range of your Wi-Fi router</li>
                      )}
                      {sensorVariant !== 'standard' && (
                      <li>Confirm you're logged into the correct account at the{' '}
                        <a href={MONITORING.portalUrl} className="support-section-link" target="_blank" rel="noopener noreferrer">monitoring portal</a>
                      </li>
                      )}
                      {sensorVariant !== 'standard' ? (
                        <li>
                          Try resetting the Sensor and re-pairing via the{' '}
                          <Link to={SENSOR_SETUP_MODEL_CHOICE_HREF} className="support-section-link">Sensor Setup Guide</Link>
                        </li>
                      ) : (
                        <li>
                          Walk through power and LED checks in the{' '}
                          <Link to={SENSOR_SETUP_MODEL_CHOICE_HREF} className="support-section-link">Sensor Setup Guide</Link>
                        </li>
                      )}
                    </ul>
                  </div>

                  {sensorVariant !== 'standard' && (
                  <div className="support-troubleshooting-item support-troubleshooting-item-info">
                    <h4 className="support-troubleshooting-title">
                      Sensor not connecting to Wi-Fi (Wi-Fi model)
                      {sensorVariant === 'all' && <span className="text-gray-500 font-normal text-sm ml-1">(WiFi only)</span>}
                    </h4>
                    <ul className="support-troubleshooting-list">
                      <li>Ensure you are connecting to a 2.4 GHz network — 5 GHz is not supported</li>
                      <li>Double-check your Wi-Fi password — it is case-sensitive</li>
                      <li>Move the Sensor closer to your router during initial setup</li>
                      <li>Restart your router and attempt pairing again</li>
                      <li>If all else fails, factory reset the Sensor and restart setup from the beginning</li>
                    </ul>
                  </div>
                  )}

                  {sensorVariant !== 'standard' && (
                  <div className="support-troubleshooting-item support-troubleshooting-item-info">
                    <h4 className="support-troubleshooting-title">
                      Reconnecting after a Wi-Fi network change
                      {sensorVariant === 'all' && <span className="text-gray-500 font-normal text-sm ml-1">(WiFi only)</span>}
                    </h4>
                    <ul className="support-troubleshooting-list">
                      <li>Hold the reset button for 5 seconds until the LED flashes red — this puts the Sensor into pairing mode</li>
                      <li>Open the <a href={MONITORING.portalUrl} className="support-section-link" target="_blank" rel="noopener noreferrer">monitoring portal</a> and navigate to your Sensor settings</li>
                      <li>Select "Update Wi-Fi" and follow the prompts to enter your new network credentials</li>
                      <li>Once reconnected, the LED will return to solid green</li>
                    </ul>
                  </div>
                  )}

                  {sensorVariant !== 'standard' && (
                  <>
                  <div className="support-troubleshooting-item support-troubleshooting-item-warning">
                    <h4 className="support-troubleshooting-title">
                      Not receiving alert notifications
                      {sensorVariant === 'all' && <span className="text-gray-500 font-normal text-sm ml-1">(WiFi only)</span>}
                    </h4>
                    <ul className="support-troubleshooting-list">
                      <li>
                        In the monitoring web application (browser—there is no separate mobile app), open account settings and confirm
                        SMS and email alerts are enabled and your phone number and email address are correct
                      </li>
                      <li>
                        If the sensor appears offline on the monitoring site, alerts cannot be delivered—verify the Wi‑Fi sensor on
                        site: power, 2.4 GHz network, signal at the unit, and Wi‑Fi pairing or connectivity
                      </li>
                      <li>Check spam or junk folders for email alerts</li>
                    </ul>
                  </div>

                  <div className="support-troubleshooting-item support-troubleshooting-item-warning">
                    <h4 className="support-troubleshooting-title">Power and battery</h4>
                    <ul className="support-troubleshooting-list">
                      <li>
                        <strong>24V HVAC power (recommended):</strong> continuous operation, consistent LED visibility, and no reliance
                        on battery life for primary power
                      </li>
                      <li>
                        <strong>Battery-only:</strong> supported; LED visibility is limited and power-saving behavior may turn the
                        light off after startup while monitoring continues. A fully depleted battery may trigger HVAC shutdown as a
                        safety measure—use 24V to avoid interruptions from battery depletion
                      </li>
                      <li>The backup battery is rated for approximately 2 years under normal use when used as backup alongside 24V</li>
                      <li>
                        A low battery warning can appear on the dashboard for the WiFi model. If the sensor is wired to 24V with a
                        backup battery, a dead backup alone does not necessarily mean the HVAC will shut off—verify 24V is connected
                      </li>
                      <li>To replace the battery: remove the Sensor from the bayonet mount, open the battery compartment, and swap in the specified battery type</li>
                    </ul>
                  </div>
                  </>
                  )}

                </div>
              </div>
            )}

          </div>

          {/* Sensor Resources (Sensor tab only) */}
          {activeTab === 'sensor' && (
            <div className="support-section-related">
              <h2 className="support-section-section-title">Sensor Resources{sensorTypeLabel}</h2>
              <p className="support-section-section-description">Essential guides and tools for your AC Drain Wiz Sensor.</p>
              <div className="support-section-related-links">
                <Link to={SENSOR_SETUP_MODEL_CHOICE_HREF} className="support-section-related-link">
                  Sensor Setup Guide →
                </Link>
                {sensorVariant !== 'standard' && (
                <a 
                  href={MONITORING.portalUrl}
                  className="support-section-related-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sensor Monitoring Portal ↗
                </a>
                )}
                <Link to="/support/installation-scenarios" className="support-section-related-link">
                  Installation Scenarios →
                </Link>
              </div>
            </div>
          )}

          {/* Contact Support CTA */}
          <div className="support-section-cta-box">
            <p className="support-section-cta-text">
              <strong>Still need help?</strong> Our technical support team is available to assist you.
            </p>
            <div className="support-action-buttons">
              <a 
                href={SUPPORT_CONTACT.telHref} 
                className="support-action-button-primary"
              >
                <PhoneIcon className="support-action-icon" />
                Call {SUPPORT_CONTACT.phoneDisplay}
              </a>
              <Link
                to="/contact?type=support"
                className="support-action-button-secondary"
              >
                <EnvelopeIcon className="support-action-icon" />
                Email Support
              </Link>
            </div>
          </div>

          {/* Related Resources */}
          <div className="support-section-related">
            <h2 className="support-section-section-title">Related Resources</h2>
            <div className="support-section-related-links">
              <Link to="/support/installation-setup" className="support-section-related-link">
                Installation Guides →
              </Link>
              <Link to="/support/warranty-returns" className="support-section-related-link">
                Warranty Information →
              </Link>
              <Link to="/contact?type=support" className="support-section-related-link">
                Contact Support →
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile bottom sheet: choose product (Option C) */}
      {mobileSheetOpen && (
        <div
          className="support-product-sheet-overlay"
          onClick={() => setMobileSheetOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setMobileSheetOpen(false)}
          role="presentation"
        >
          <div
            className="support-product-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Select product for support"
          >
            <div className="support-product-sheet-handle" aria-hidden />
            <div className="support-product-sheet-header">
              <h2 className="support-product-sheet-title">Select product</h2>
            </div>
            <div className="support-product-sheet-list" role="list">
              {PICKER_OPTIONS.map((option) => {
                const isActive = activeTab === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`support-product-sheet-item ${isActive ? 'support-product-sheet-item-active' : ''}`}
                    onClick={() => handleMobileProductSelect(option.id)}
                    role="listitem"
                  >
                    {option.image ? (
                      <img src={option.image} alt="" className="support-product-sheet-item-img" />
                    ) : (
                      <span className="support-product-sheet-item-icon">
                        {option.Icon && <option.Icon className="support-product-sheet-icon" />}
                      </span>
                    )}
                    <div className="support-product-sheet-item-text">
                      <span className="support-product-sheet-item-label">{option.label}</span>
                      <span className="support-product-sheet-item-desc">{option.description}</span>
                    </div>
                    {isActive && (
                      <span className="support-product-sheet-item-check" aria-hidden>✓</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
