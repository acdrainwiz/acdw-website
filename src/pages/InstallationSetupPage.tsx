import { Link } from 'react-router-dom'
import { SUPPORT_CONTACT } from '../config/acdwKnowledge'
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
  SwatchIcon,
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
        {/* ─── Product Picker ─── */}
        <div className="install-picker-grid">

          {/* ── AC Drain Wiz Mini ── */}
          <div className="install-product-card">

            {/* Image area */}
            <div className="install-product-image-area">
              <img
                src="/images/acdw-mini-hero-background.png"
                alt="AC Drain Wiz Mini"
                className="install-product-image"
              />
            </div>

            {/* Card body */}
            <div className="install-product-card-body">
              <span className="install-product-badge install-product-badge-physical">
                Physical Installation
              </span>
              <h2 className="install-product-name">AC Drain Wiz Mini</h2>
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

          {/* ── AC Drain Wiz Sensor Switch ── */}
          <div className="install-product-card">

            {/* Image area */}
            <div className="install-product-image-area">
              <img
                src="/images/acdw-sensor-showcase-background.png"
                alt="AC Drain Wiz Sensor Switch"
                className="install-product-image"
              />
            </div>

            {/* Card body */}
            <div className="install-product-card-body">
              <span className="install-product-badge install-product-badge-smart">
                Smart Monitoring Setup
              </span>
              <h2 className="install-product-name">AC Drain Wiz Sensor Switch</h2>
              <p className="install-product-description">
                The no-contact capacitive water-level sensor that detects drain clogs and sends real-time alerts before water damage occurs.
              </p>

              <ul className="install-product-checklist">
                <li className="install-product-checklist-item">
                  <CheckIcon className="install-checklist-icon" />
                  Free monitoring account required (set up first)
                </li>
                <li className="install-product-checklist-item">
                  <CheckIcon className="install-checklist-icon" />
                  WiFi connection needed for smart alerts
                </li>
                <li className="install-product-checklist-item">
                  <CheckIcon className="install-checklist-icon" />
                  Assign sensor to a customer/property profile
                </li>
                <li className="install-product-checklist-item">
                  <CheckIcon className="install-checklist-icon" />
                  Supports both the AC Drain Wiz WiFi Sensor Switch and the AC Drain Wiz Standard Sensor Switch (Non-WiFi)
                </li>
              </ul>

              <div className="install-product-meta">
                <span className="install-product-meta-item">
                  <ClockIcon className="install-meta-icon" />
                  ~15 minutes
                </span>
                <span className="install-product-meta-item">
                  <WifiIcon className="install-meta-icon" />
                  WiFi + account
                </span>
              </div>

              <div className="install-product-actions">
                <Link to="/sensor-setup" className="install-product-cta install-product-cta-primary">
                  Start Sensor Setup Guide
                  <ArrowRightIcon className="install-cta-arrow" />
                </Link>
                <p className="install-product-account-note">
                  <UserCircleIcon className="install-account-note-icon" />
                  You'll need a free monitoring account before starting
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Have Both? Bundle Callout ─── */}
        <div className="install-bundle-callout">
          <SwatchIcon className="install-bundle-icon" />
          <div className="install-bundle-content">
            <p className="install-bundle-text">
              <strong>Have both products?</strong> Installing the Mini and Sensor Switch together? Start with the Mini physical installation, then proceed to the Sensor Setup Guide.
            </p>
            <Link to="/support/installation-scenarios" className="install-bundle-link">
              View recommended installation scenarios →
            </Link>
          </div>
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
