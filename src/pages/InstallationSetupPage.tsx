import { Link } from 'react-router-dom'
import { 
  ArrowLeftIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

export function InstallationSetupPage() {
  return (
    <div className="support-section-container">
      <div className="container py-16">
        {/* Breadcrumb */}
        <div className="support-section-breadcrumb">
          <Link to="/support" className="support-section-breadcrumb-link">
            Support Center
          </Link>
          <span className="support-section-breadcrumb-separator">/</span>
          <span className="support-section-breadcrumb-current">Installation & Setup</span>
        </div>

        {/* Header */}
        <div className="support-section-header">
          <Link 
            to="/support" 
            className="support-section-back-link"
          >
            <ArrowLeftIcon className="support-section-back-icon" />
            <span>Back to Support</span>
          </Link>
          <div className="support-section-header-content">
            <WrenchScrewdriverIcon className="support-section-header-icon" />
            <div>
              <h1 className="support-section-title">Installation & Setup</h1>
              <p className="support-section-subtitle">
                Step-by-step guides, video tutorials, and installation scenarios for AC Drain Wiz products.
              </p>
            </div>
          </div>
        </div>

        {/* Main Guides Section */}
        <div className="support-section-content">
          <div className="support-section-main-guides">
            <h2 className="support-section-section-title">Installation Guides</h2>
            <p className="support-section-section-description">
              AC Drain Wiz products are designed for easy installation. Most homeowners complete installation in 5 minutes or less using basic tools.
            </p>

            <div className="support-section-resource-grid">
              {/* Sensor Setup Guide */}
              <Link 
                to="/sensor-setup" 
                className="support-section-resource-card support-section-resource-card-featured"
              >
                <div className="support-section-resource-card-header">
                  <DocumentTextIcon className="support-section-resource-icon" />
                  <span className="support-section-resource-badge">Featured</span>
                </div>
                <h3 className="support-section-resource-title">ACDW Sensor Setup Guide</h3>
                <p className="support-section-resource-description">
                  Complete step-by-step guide for setting up your AC Drain Wiz Sensor, including account creation, WiFi setup, and customer assignment.
                </p>
                <div className="support-section-resource-link">
                  View Setup Guide →
                </div>
              </Link>

              {/* Installation Scenarios */}
              <Link 
                to="/support/installation-scenarios" 
                className="support-section-resource-card support-section-resource-card-featured"
              >
                <div className="support-section-resource-card-header">
                  <DocumentTextIcon className="support-section-resource-icon" />
                  <span className="support-section-resource-badge">Recommended</span>
                </div>
                <h3 className="support-section-resource-title">Recommended Installation Scenarios</h3>
                <p className="support-section-resource-description">
                  Learn about different installation configurations and when to use standard vs. best-practice setups for optimal protection.
                </p>
                <div className="support-section-resource-link">
                  View Scenarios →
                </div>
              </Link>

              {/* Mini Installation */}
              <div className="support-section-resource-card">
                <DocumentTextIcon className="support-section-resource-icon" />
                <h3 className="support-section-resource-title">ACDW Mini Installation</h3>
                <p className="support-section-resource-description">Step-by-step PDF guide for installing the Mini model</p>
                <button className="support-section-resource-button">
                  Download PDF →
                </button>
              </div>

              {/* Video Tutorial */}
              <div className="support-section-resource-card">
                <VideoCameraIcon className="support-section-resource-icon" />
                <h3 className="support-section-resource-title">Video Tutorial</h3>
                <p className="support-section-resource-description">Watch our installation video walkthrough</p>
                <button className="support-section-resource-button">
                  Watch Video →
                </button>
              </div>
            </div>
          </div>

          {/* Installation Steps */}
          <div className="support-section-installation-steps">
            <h2 className="support-section-section-title">Quick Installation Steps</h2>
            <ol className="support-section-step-list">
              <li className="support-section-step-item">
                <span className="support-section-step-number">1</span>
                <div>
                  <strong className="support-section-step-title">Cut your existing drain line</strong>
                  <p className="support-section-step-description">Measure and cut a section of your 3/4" PVC drain line to accommodate the AC Drain Wiz unit. Use a PVC pipe cutter or hacksaw for a clean cut.</p>
                </div>
              </li>
              <li className="support-section-step-item">
                <span className="support-section-step-number">2</span>
                <div>
                  <strong className="support-section-step-title">Solvent-weld in place with Oatey PVC cement</strong>
                  <p className="support-section-step-description">Use PVC primer and cement to securely attach AC Drain Wiz to your drain line.</p>
                </div>
              </li>
              <li className="support-section-step-item">
                <span className="support-section-step-number">3</span>
                <div>
                  <strong className="support-section-step-title">Verify operation</strong>
                  <p className="support-section-step-description">Turn on your AC unit and check for proper drainage. Monitor for 24 hours to ensure no leaks.</p>
                </div>
              </li>
            </ol>
          </div>

          {/* Professional Installation */}
          <div className="support-section-info-box">
            <div className="support-section-info-box-content">
              <CheckCircleIcon className="support-section-info-box-icon" />
              <div>
                <h3 className="support-section-info-box-title">Need professional installation?</h3>
                <p className="support-section-info-box-text">
                  Contact us at{' '}
                  <a href="tel:+12342237246" className="support-section-info-box-link">(234) AC DRAIN</a>{' '}
                  or{' '}
                  <Link to="/contact?type=installer" className="support-section-info-box-link">
                    find a certified installer
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Related Resources */}
          <div className="support-section-related">
            <h2 className="support-section-section-title">Related Resources</h2>
            <div className="support-section-related-links">
              <Link to="/support/product-support" className="support-section-related-link">
                Product Support →
              </Link>
              <Link to="/support/warranty-returns" className="support-section-related-link">
                Warranty Information →
              </Link>
              <Link to="/support/contact" className="support-section-related-link">
                Contact Support →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

