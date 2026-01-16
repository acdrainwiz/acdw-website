import { Link } from 'react-router-dom'
import { 
  ArrowLeftIcon,
  ShieldCheckIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

export function WarrantyReturnsPage() {
  return (
    <div className="support-section-container">
      <div className="container py-16">
        {/* Breadcrumb */}
        <div className="support-section-breadcrumb">
          <Link to="/support" className="support-section-breadcrumb-link">
            Support Center
          </Link>
          <span className="support-section-breadcrumb-separator">/</span>
          <span className="support-section-breadcrumb-current">Warranty & Returns</span>
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
            <ShieldCheckIcon className="support-section-header-icon" />
            <div>
              <h1 className="support-section-title">Warranty & Returns</h1>
              <p className="support-section-subtitle">
                Warranty coverage details, return policy, and how to file a claim.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="support-section-content">
          {/* Warranty Coverage */}
          <div className="support-section-warranty">
            <h2 className="support-section-section-title">Warranty Coverage</h2>
            <p className="support-section-section-description">
              All AC Drain Wiz products come with our satisfaction guarantee and industry-leading warranty.
            </p>

            <div className="support-section-warranty-highlight">
              <CheckIcon className="support-section-warranty-highlight-icon" />
              <div>
                <h3 className="support-section-warranty-highlight-title">Limited Lifetime Warranty</h3>
                <p className="support-section-warranty-highlight-text">
                  AC Drain Wiz products are covered by a limited lifetime warranty against defects in materials and workmanship. 
                  This warranty covers the original purchaser and is non-transferable.
                </p>
              </div>
            </div>

            <div className="support-section-warranty-details">
              <div className="support-section-warranty-details-section">
                <h3 className="support-section-warranty-details-title">What's Covered:</h3>
                <ul className="support-section-warranty-details-list">
                  <li>Defects in materials and workmanship</li>
                  <li>Premature wear under normal use conditions</li>
                  <li>Manufacturing defects</li>
                </ul>
              </div>

              <div className="support-section-warranty-details-section">
                <h3 className="support-section-warranty-details-title">What's Not Covered:</h3>
                <ul className="support-section-warranty-details-list">
                  <li>Damage from improper installation</li>
                  <li>Damage from misuse or abuse</li>
                  <li>Normal wear and tear</li>
                  <li>Damage from external causes (fire, flood, etc.)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Return Policy */}
          <div className="support-section-returns">
            <h2 className="support-section-section-title">Return Policy</h2>

            <div className="support-section-returns-card">
              <h3 className="support-section-returns-card-title">30-Day Money-Back Guarantee</h3>
              <p className="support-section-returns-card-text">
                If you're not completely satisfied with your purchase, you can return it within 30 days of delivery 
                for a full refund (minus shipping costs).
              </p>
            </div>

            <div className="support-section-returns-process">
              <h3 className="support-section-returns-process-title">Return Process</h3>
              <ol className="support-section-returns-process-list">
                <li>Contact us at <a href="mailto:info@acdrainwiz.com" className="support-section-link">info@acdrainwiz.com</a> or call (234) AC DRAIN</li>
                <li>Provide your order number and reason for return</li>
                <li>We'll send you a return authorization and shipping label</li>
                <li>Package the item securely and ship it back</li>
                <li>Once received, we'll process your refund within 5-7 business days</li>
              </ol>
            </div>
          </div>

          {/* Contact for Warranty/Returns */}
          <div className="support-section-info-box">
            <div className="support-section-info-box-content">
              <ShieldCheckIcon className="support-section-info-box-icon" />
              <div>
                <h3 className="support-section-info-box-title">Questions about warranty or returns?</h3>
                <p className="support-section-info-box-text">
                  Contact us at{' '}
                  <a href="tel:+12342237246" className="support-section-info-box-link">(234) AC DRAIN</a>{' '}
                  or{' '}
                  <Link to="/support/contact" className="support-section-info-box-link">
                    submit a support request
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
              <Link to="/support/installation-setup" className="support-section-related-link">
                Installation Guides →
              </Link>
              <Link to="/support/product-support" className="support-section-related-link">
                Product Support →
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

