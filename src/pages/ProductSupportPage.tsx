import { Link } from 'react-router-dom'
import { 
  ArrowLeftIcon,
  QuestionMarkCircleIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'

export function ProductSupportPage() {
  return (
    <div className="support-section-container">
      <div className="container py-16">
        {/* Breadcrumb */}
        <div className="support-section-breadcrumb">
          <Link to="/support" className="support-section-breadcrumb-link">
            Support Center
          </Link>
          <span className="support-section-breadcrumb-separator">/</span>
          <span className="support-section-breadcrumb-current">Product Support</span>
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
            <QuestionMarkCircleIcon className="support-section-header-icon" />
            <div>
              <h1 className="support-section-title">Product Support</h1>
              <p className="support-section-subtitle">
                Troubleshooting guides, FAQs, and technical help for your AC Drain Wiz products.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="support-section-content">
          {/* Common Questions */}
          <div className="support-section-faq">
            <h2 className="support-section-section-title">Common Questions</h2>
            <div className="support-section-faq-list">
              <div className="support-section-faq-item">
                <h3 className="support-section-faq-question">Will AC Drain Wiz work with my existing AC system?</h3>
                <p className="support-section-faq-answer">
                  AC Drain Wiz works with standard 3/4" PVC drain lines used in most residential and light commercial systems. 
                  If your system uses a different size, contact us for guidance.
                </p>
              </div>

              <div className="support-section-faq-item">
                <h3 className="support-section-faq-question">How often do I need to clean my drain line?</h3>
                <p className="support-section-faq-answer">
                  We recommend checking your drain line every 3-6 months. If you have the Sensor, it will alert you when maintenance is needed.
                </p>
              </div>

              <div className="support-section-faq-item">
                <h3 className="support-section-faq-question">What's the difference between Mini, Sensor, and Core 1.0?</h3>
                <p className="support-section-faq-answer">
                  Mini is our compact flagship for space-constrained areas. Sensor adds smart monitoring and alerts. 
                  Core 1.0 is the proven foundation model. See our{' '}
                  <Link to="/products" className="support-section-link">product comparison</Link> for details.
                </p>
              </div>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="support-section-troubleshooting">
            <h2 className="support-section-section-title">Troubleshooting</h2>
            <div className="support-section-troubleshooting-list">
              <div className="support-troubleshooting-item support-troubleshooting-item-warning">
                <h4 className="support-troubleshooting-title">Water not draining properly</h4>
                <ul className="support-troubleshooting-list">
                  <li>Check for kinks in the drain line</li>
                  <li>Ensure proper slope (minimum 1/4" per foot)</li>
                  <li>Verify the unit is properly seated and sealed</li>
                  <li>Check for clogs downstream from the unit</li>
                </ul>
              </div>

              <div className="support-troubleshooting-item support-troubleshooting-item-error">
                <h4 className="support-troubleshooting-title">Leaks at connections</h4>
                <ul className="support-troubleshooting-list">
                  <li>Tighten connections and check for proper seating</li>
                  <li>Verify solvent-weld joints are fully cured (24 hours)</li>
                  <li>Check for cracks or damage to PVC fittings</li>
                </ul>
              </div>

              <div className="support-troubleshooting-item support-troubleshooting-item-info">
                <h4 className="support-troubleshooting-title">Sensor not connecting</h4>
                <ul className="support-troubleshooting-list">
                  <li>Check power connection and LED indicators</li>
                  <li>Verify Wi-Fi credentials are correct</li>
                  <li>Ensure sensor is within range of your router</li>
                  <li>Try resetting the sensor and re-pairing</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Support CTA */}
          <div className="support-section-cta-box">
            <p className="support-section-cta-text">
              <strong>Still need help?</strong> Our technical support team is available to assist you.
            </p>
            <div className="support-action-buttons">
              <a 
                href="tel:+12342237246" 
                className="support-action-button-primary"
              >
                <PhoneIcon className="support-action-icon" />
                Call (234) 23 DRAIN
              </a>
              <Link
                to="/support/contact"
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

