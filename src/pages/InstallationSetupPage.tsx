import { Link } from 'react-router-dom'
import {
  PRODUCT_NAMES,
  SUPPORT_CONTACT,
  SENSOR_STANDARD_SHORT,
  SENSOR_WIFI_SHORT,
  buildSensorSetupHref,
} from '../config/acdwKnowledge'
import {
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  ClockIcon,
  WifiIcon,
  UserCircleIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  PhoneIcon,
  CheckIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'

export function InstallationSetupPage() {
  return (
    <div className="support-section-container">

      {/* Hero Banner */}
      <div className="support-hero">
        <div className="support-hero-content">
          <div className="support-hero-header">
            <div className="support-hero-breadcrumb">
              <Link to="/support" className="support-hero-breadcrumb-link">
                Support Center
              </Link>
              <span className="support-hero-breadcrumb-separator">/</span>
              <span className="support-hero-breadcrumb-current">Installation & Setup</span>
            </div>
            <h1 className="support-hero-title">Installation & Setup</h1>
            <p className="support-hero-subtitle">
              Let's get you set up. Which product are you installing?
            </p>
            <div className="support-hero-badge-row">
              <span className="support-hero-badge">Step-by-Step Guides</span>
              <span className="support-hero-badge">Video Tutorials</span>
              <span className="support-hero-badge">Installation Scenarios</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        {/* ─── Mini (single card; sensor models are below) ─── */}
        <div className="install-mini-family">
          <h2 className="install-sensor-family-title">Drain line maintenance access</h2>
          <p className="install-sensor-family-subtitle">
            {PRODUCT_NAMES.mini} adds a permanent service port on the 3/4&quot; PVC condensate drain line for flush, compressed air, and vacuum—no app, Wi‑Fi, or monitoring account. Use the guided steps for measure, solvent weld, cure, and leak check before moving on to sensor setup below.
          </p>
          <div className="install-picker-grid install-picker-grid-mini-only">

          {/* ── AC Drain Wiz Mini ── */}
          <div className="install-product-card">

            {/* Image area — links to same destination as primary CTA */}
            <Link
              to="/mini-setup"
              className="install-product-image-area"
              aria-label="Start Mini Installation Guide"
            >
              <img
                src="/images/acdw-mini-hero-background.png"
                alt=""
                className="install-product-image"
              />
            </Link>

            {/* Card body */}
            <div className="install-product-card-body">
              <span className="install-product-badge install-product-badge-physical">
                Physical Installation
              </span>
              <h2 className="install-product-name">{PRODUCT_NAMES.mini}</h2>
              <p className="install-product-description">
                The compact maintenance manifold that installs directly into your existing 3/4" PVC condensate drain line. No app or WiFi required.
              </p>

              <ul className="install-product-checklist">
                <li className="install-product-checklist-item">
                  <CheckIcon className="install-checklist-icon" />
                  No app, WiFi, or account needed
                </li>
                <li className="install-product-checklist-item">
                  <CheckIcon className="install-checklist-icon" />
                  Fits standard 3/4" PVC condensate drain line
                </li>
                <li className="install-product-checklist-item">
                  <CheckIcon className="install-checklist-icon" />
                  Tools required: PVC cutter + PVC cement
                </li>
                <li className="install-product-checklist-item">
                  <CheckIcon className="install-checklist-icon" />
                  Cut once during install — easy access for maintenance after
                </li>
                <li className="install-product-checklist-item">
                  <CheckIcon className="install-checklist-icon" />
                  Clear view into the drain line to verify cleaning and spot biofilm or high water
                </li>
              </ul>

              <div className="install-product-meta">
                <span className="install-product-meta-item">
                  <ClockIcon className="install-meta-icon" />
                  ~5 minutes
                </span>
                <span className="install-product-meta-item">
                  <WrenchScrewdriverIcon className="install-meta-icon" />
                  Basic tools
                </span>
              </div>

              <div className="install-product-actions">
                <Link to="/mini-setup" className="install-product-cta install-product-cta-primary">
                  Start Mini Installation Guide
                  <ArrowRightIcon className="install-cta-arrow" />
                </Link>
              </div>
            </div>
          </div>

          </div>
        </div>

        {/* Sensor family — two models */}
        <div className="install-sensor-family">
          <h2 className="install-sensor-family-title">Choose your sensor model</h2>
          <p className="install-sensor-family-subtitle">
            The Standard and WiFi Sensor Switches use different setup steps. The Standard guide has three steps: manifold install, then sensor power and testing, then final mounting. The WiFi guide adds a monitoring account first, mirrors the same manifold steps (measure through cure), then on-site sensor install and Wi‑Fi pairing, and ends with assigning the sensor in the portal.
          </p>
          <div className="install-sensor-model-grid">
            <div className="install-product-card install-product-card-sensor-standard">
              <Link
                to={buildSensorSetupHref({ model: 'standard', step: 1 })}
                className="install-product-image-area"
                aria-label={`Start ${SENSOR_STANDARD_SHORT} setup guide`}
              >
                <img
                  src="/images/setup/model-non-wifi.png"
                  alt=""
                  className="install-product-image install-product-image-contain"
                />
              </Link>
              <div className="install-product-card-body">
                <span className="install-product-badge install-product-badge-physical">Overflow protection</span>
                <h2 className="install-product-name">{SENSOR_STANDARD_SHORT}</h2>
                <p className="install-product-description">
                  Non-WiFi capacitive sensing with automatic AC shutdown at 95% water level. Includes a Transparent T Manifold—no Mini required for install.
                </p>
                <ul className="install-product-checklist">
                  <li className="install-product-checklist-item">
                    <CheckIcon className="install-checklist-icon" />
                    Step 1: install the Transparent T manifold on the 3/4&quot; line (primer, cement, cure, leak test)—no contractor account step in this guide
                  </li>
                  <li className="install-product-checklist-item">
                    <CheckIcon className="install-checklist-icon" />
                    Step 2: power, test, and verify LED behavior—no home Wi‑Fi or captive portal setup
                  </li>
                  <li className="install-product-checklist-item">
                    <CheckIcon className="install-checklist-icon" />
                    Step 3: lock the sensor into the manifold, plus maintenance tips and optional AC Drain Wiz Mini for line clean-out access
                  </li>
                </ul>
                <div className="install-product-meta">
                  <span className="install-product-meta-item">
                    <ClockIcon className="install-meta-icon" />
                    ~25–35 minutes
                  </span>
                  <span className="install-product-meta-item">
                    <WrenchScrewdriverIcon className="install-meta-icon" />
                    No Wi‑Fi setup
                  </span>
                </div>
                <div className="install-product-actions">
                  <Link
                    to={buildSensorSetupHref({ model: 'standard', step: 1 })}
                    className="install-product-cta install-product-cta-primary"
                  >
                    Start {SENSOR_STANDARD_SHORT}
                    <ArrowRightIcon className="install-cta-arrow" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="install-product-card">
              <Link
                to={buildSensorSetupHref({ model: 'wifi', step: 1 })}
                className="install-product-image-area"
                aria-label={`Start ${SENSOR_WIFI_SHORT} setup guide`}
              >
                <img
                  src="/images/setup/model-wifi.png"
                  alt=""
                  className="install-product-image install-product-image-contain"
                />
              </Link>
              <div className="install-product-card-body">
                <span className="install-product-badge install-product-badge-smart">Remote monitoring</span>
                <h2 className="install-product-name">{SENSOR_WIFI_SHORT}</h2>
                <p className="install-product-description">
                  Everything the Standard model offers, plus remote monitoring, email/SMS alerts, and service alerts between 50–90% (shutdown still at 95%).
                </p>
                <ul className="install-product-checklist">
                  <li className="install-product-checklist-item">
                    <CheckIcon className="install-checklist-icon" />
                    Step 1: monitoring account and customer profile (complete before install)
                  </li>
                  <li className="install-product-checklist-item">
                    <CheckIcon className="install-checklist-icon" />
                    Steps 2–3: Transparent T manifold on the 3/4&quot; line (unbox after the tools list, then measure, cement, cure, leak test)—same as the Standard guide
                  </li>
                  <li className="install-product-checklist-item">
                    <CheckIcon className="install-checklist-icon" />
                    Step 4: power, physical install, 2.4 GHz Wi‑Fi pairing, and portal login (5 GHz not supported)
                  </li>
                  <li className="install-product-checklist-item">
                    <CheckIcon className="install-checklist-icon" />
                    Step 5: assign the sensor to your customer in the dashboard
                  </li>
                </ul>
                <div className="install-product-meta">
                  <span className="install-product-meta-item">
                    <ClockIcon className="install-meta-icon" />
                    ~35–50 minutes
                  </span>
                  <span className="install-product-meta-item">
                    <WifiIcon className="install-meta-icon" />
                    Wi‑Fi + account
                  </span>
                </div>
                <div className="install-product-actions">
                  <Link
                    to={buildSensorSetupHref({ model: 'wifi', step: 1 })}
                    className="install-product-cta install-product-cta-primary"
                  >
                    Start {SENSOR_WIFI_SHORT}
                    <ArrowRightIcon className="install-cta-arrow" />
                  </Link>
                  <p className="install-product-account-note">
                    <UserCircleIcon className="install-account-note-icon" />
                    Use the same sign-up flow as in step 1 of this guide before you arrive on site.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <p className="install-sensor-family-cross">
            Not sure which you have?{' '}
            <Link to="/products/sensor" className="install-sensor-family-cross-link">
              Compare models on the Sensor product page
            </Link>
            {' · '}
            <Link to="/sensor-setup" className="install-sensor-family-cross-link">
              Open the model chooser
            </Link>
          </p>
        </div>

        {/* ─── Also Available ─── */}
        <div className="install-also-section">
          <h2 className="install-also-title">Additional Resources</h2>
          <div className="install-also-grid">
            <Link to="/support/installation-scenarios" className="install-also-card">
              <DocumentTextIcon className="install-also-icon" />
              <div>
                <h3 className="install-also-card-title">Recommended Installation Scenarios</h3>
                <p className="install-also-card-desc">Standard vs. best-practice configurations and when to use them.</p>
              </div>
              <ArrowRightIcon className="install-also-arrow" />
            </Link>
            <div className="install-also-card install-also-card-disabled">
              <VideoCameraIcon className="install-also-icon" />
              <div>
                <h3 className="install-also-card-title">Video Tutorial</h3>
                <p className="install-also-card-desc">Watch a full installation walkthrough video.</p>
              </div>
              <span className="install-also-coming-soon">Coming Soon</span>
            </div>
          </div>
        </div>

        {/* ─── Professional Installation CTA ─── */}
        <div className="support-section-info-box">
          <div className="support-section-info-box-content">
            <CheckCircleIcon className="support-section-info-box-icon" />
            <div>
              <h3 className="support-section-info-box-title">Not the DIY type? We've got you covered.</h3>
              <p className="support-section-info-box-text">
                Contact us at{' '}
                <a href={SUPPORT_CONTACT.telHref} className="support-section-info-box-link">{SUPPORT_CONTACT.phoneDisplay}</a>
                {' '}or{' '}
                <Link to="/contact?type=installer" className="support-section-info-box-link">
                  find a certified installer
                </Link>
                {' '}near you.
              </p>
            </div>
          </div>
        </div>

        {/* ─── Related Resources ─── */}
        <div className="support-section-related">
          <h2 className="support-section-section-title">Related Support</h2>
          <div className="support-section-related-links">
            <Link to="/support/product-support" className="support-section-related-link">
              Product Support →
            </Link>
            <Link to="/support/warranty-returns" className="support-section-related-link">
              Warranty Information →
            </Link>
            <Link to="/contact?type=support" className="support-section-related-link">
              <PhoneIcon className="inline h-4 w-4 mr-1" />
              Contact Support →
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
