import { Link } from 'react-router-dom'
import { 
  ShieldCheckIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import { SUPPORT_CONTACT } from '../config/acdwKnowledge'
import type { PageSearchMeta } from '../config/siteSearchTypes'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'page-warranty-returns',
  kind: 'product-info',
  title: 'Warranty & returns',
  body:
    'Warranty coverage details, return policy, how to file a claim, and manufacturer warranty information for AC Drain Wiz products.',
  tags: ['warranty', 'return', 'claim', 'policy'],
  href: '/support/warranty-returns',
}

export function WarrantyReturnsPage() {
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
              <span className="support-hero-breadcrumb-current">Warranty & Returns</span>
            </div>
            <h1 className="support-hero-title">Warranty & Returns</h1>
            <p className="support-hero-subtitle">
              Warranty coverage details, return policy, and how to file a claim.
            </p>
            <div className="support-hero-badge-row">
              <span className="support-hero-badge">Lifetime Warranty</span>
              <span className="support-hero-badge">Return Policy</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        {/* Content */}
        <div className="support-section-content">
          {/* Warranty Coverage */}
          <div className="support-section-warranty">
            <h2 className="support-section-section-title">Warranty Coverage</h2>
            <p className="support-section-section-description">
              All AC Drain Wiz products come with our industry-leading manufacturer warranty.
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
              <h3 className="support-section-returns-card-title">Returns & Refunds</h3>
              <p className="support-section-returns-card-text">
                AC Drain Wiz products are sold through authorized distributors and resellers. Returns and refunds are handled by the distributor or retailer where you purchased the product. Please contact your point of purchase directly for their return policy and process.
              </p>
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
                  <a href={SUPPORT_CONTACT.telHref} className="support-section-info-box-link">{SUPPORT_CONTACT.phoneDisplay}</a>{' '}
                  or{' '}
                  <Link to="/contact?type=support" className="support-section-info-box-link">
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
              <Link to="/contact?type=support" className="support-section-related-link">
                Contact Support →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

