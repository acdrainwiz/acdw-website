import { Link } from 'react-router-dom'
import { 
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export function ContactSupportPage() {
  return (
    <div className="support-section-container">
      <div className="container py-16">
        {/* Breadcrumb */}
        <div className="support-section-breadcrumb">
          <Link to="/support" className="support-section-breadcrumb-link">
            Support Center
          </Link>
          <span className="support-section-breadcrumb-separator">/</span>
          <span className="support-section-breadcrumb-current">Contact Support</span>
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
            <EnvelopeIcon className="support-section-header-icon" />
            <div>
              <h1 className="support-section-title">Contact Support</h1>
              <p className="support-section-subtitle">
                Get in touch with our support team via phone, email, or support form.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="support-section-content">
          {/* Contact Methods */}
          <div className="support-section-contact-methods">
            <div className="support-section-contact-grid">
              <div className="support-contact-card">
                <PhoneIcon className="support-contact-icon" />
                <h3 className="support-contact-title">Phone Support</h3>
                <p className="support-contact-details">Monday - Friday, 8 AM - 5 PM EST</p>
                <a href="tel:+12342237246" className="support-contact-link">
                  (234) AC DRAIN
                </a>
              </div>

              <div className="support-contact-card">
                <EnvelopeIcon className="support-contact-icon" />
                <h3 className="support-contact-title">Email Support</h3>
                <p className="support-contact-details">We respond within 24 hours</p>
                <a href="mailto:info@acdrainwiz.com" className="support-contact-link">
                  info@acdrainwiz.com
                </a>
              </div>
            </div>
          </div>

          {/* Support Form CTA */}
          <div className="support-section-form-cta">
            <div className="support-section-form-cta-content">
              <h2 className="support-section-form-cta-title">Prefer to submit a support request?</h2>
              <p className="support-section-form-cta-text">
                Use our contact form to get detailed help with your specific question or issue.
              </p>
              <Link
                to="/contact?type=support"
                className="support-action-button-primary support-action-button-large"
              >
                Submit Support Request
                <ArrowRightIcon className="support-action-icon ml-2" />
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
              <Link to="/support/product-support" className="support-section-related-link">
                Product Support →
              </Link>
              <Link to="/support/warranty-returns" className="support-section-related-link">
                Warranty Information →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

