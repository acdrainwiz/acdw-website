import { Link } from 'react-router-dom'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon
} from '@heroicons/react/24/outline'
import { SUPPORT_CONTACT } from '../../config/acdwKnowledge'
import { MiamiHeatPartnershipLockup } from './MiamiHeatPartnershipLockup'

export function Footer() {
  return (
    <footer className="footer-container" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="footer-heading-sr-only">
        Footer
      </h2>
      <div className="footer-content">
        {/* Top Section: Brand and Links */}
        <div className="footer-top">
          {/* Company Info - Left Column */}
          <div className="footer-company-section">
            <div className="footer-brand">
              <div className="footer-brand-lockup">
                <Link to="/" className="footer-logo-link">
                  <img 
                    src="/images/ac-drain-wiz-logo.png" 
                    alt="AC Drain Wiz Logo" 
                    className="footer-logo-image"
                  />
                </Link>
                <MiamiHeatPartnershipLockup layout="footer" />
              </div>
            </div>
            <p className="footer-description">
              Professional-grade AC drain line maintenance solutions that prevent costly water damage 
              and streamline HVAC service operations.
            </p>
          </div>

          {/* Links Grid - Right Columns */}
          <div className="footer-links-grid">
            {/* Products */}
            <div className="footer-section">
              <h3 className="footer-section-title">
                Products
              </h3>
              <ul className="footer-link-list">
                <li><Link to="/products" className="footer-link">All Products</Link></li>
                <li><Link to="/products/mini" className="footer-link">AC Drain Wiz Mini</Link></li>
                <li><Link to="/products/sensor" className="footer-link">AC Drain Wiz Sensor</Link></li>
                <li><Link to="/products/combo" className="footer-link">Mini + Sensor Combo</Link></li>
                <li><Link to="/contact?type=demo-request" className="footer-link">Request Demo</Link></li>

              </ul>
            </div>

            {/* Company */}
            <div className="footer-section">
              <h3 className="footer-section-title">
                Company
              </h3>
              <ul className="footer-link-list">
                <li><Link to="/about" className="footer-link">About Us</Link></li>
                <li><Link to="/contact" className="footer-link">Contact</Link></li>
                <li><Link to="/contact?type=sales" className="footer-link">Contractor Inquiries</Link></li>
                <li><Link to="/compliance" className="footer-link">Compliance Resources</Link></li>

              </ul>
            </div>

            {/* Support */}
            <div className="footer-section">
              <h3 className="footer-section-title">
                Support
              </h3>
              <ul className="footer-link-list">
                <li><Link to="/support" className="footer-link">Support Center</Link></li>
                <li><Link to="/support/installation-setup" className="footer-link">Installation & Setup</Link></li>
                <li><Link to="/support/product-support" className="footer-link">Product Support</Link></li>
                <li><Link to="/support/warranty-returns" className="footer-link">Warranty & Returns</Link></li>
                <li><Link to="/contact?type=support" className="footer-link">Contact Support</Link></li>
              </ul>
            </div>

            {/* Customer Experiences */}
            {/*<div className="footer-section">*/}
            {/*  <h3 className="footer-section-title">*/}
            {/*    Customer Experiences*/}
            {/*  </h3>*/}
            {/*  <ul className="footer-link-list">*/}
            {/*    <li><Link to="/homeowner" className="footer-link">For Homeowners</Link></li>*/}
            {/*    <li><Link to="/hvac-pros" className="footer-link">For HVAC Pros</Link></li>*/}
            {/*    <li><Link to="/property-managers" className="footer-link">For Property Managers</Link></li>*/}
            {/*    <li><Link to="/code-officials" className="footer-link">For Code Officials</Link></li>*/}
            {/*  </ul>*/}
            {/*</div>*/}

            {/* Business */}
            {/*<div className="footer-section">*/}
            {/*  <h3 className="footer-section-title">*/}
            {/*    Business*/}
            {/*  </h3>*/}
            {/*  <ul className="footer-link-list">*/}
                {/*<li><Link to="/contact?type=sales" className="footer-link">Bulk Ordering</Link></li>*/}
                {/*<li><Link to="/contact?type=sales" className="footer-link">Partner Program</Link></li>*/}
                {/* Launch Button Redirect */}
            {/*  </ul>*/}
            {/*</div>*/}

            {/* Legal */}
            <div className="footer-section">
              <h3 className="footer-section-title">
                Legal
              </h3>
              <ul className="footer-link-list">
                <li><Link to="/privacy-policy" className="footer-link">Privacy Policy</Link></li>
                <li><Link to="/terms-of-use" className="footer-link">Terms of Use</Link></li>
                <li><Link to="/return-refund-policy" className="footer-link">Return & Refund</Link></li>
                <li><Link to="/shipping-policy" className="footer-link">Shipping Policy</Link></li>
                <li><Link to="/warranty-policy" className="footer-link">Warranty Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="footer-contact-section">
          <div className="footer-contact-info">
            <div className="footer-contact-item">
              <EnvelopeIcon className="footer-contact-icon" />
              <span>info@acdrainwiz.com</span>
            </div>
            <div className="footer-contact-item">
              <PhoneIcon className="footer-contact-icon" />
              <a href={SUPPORT_CONTACT.telHref} className="footer-contact-link">{SUPPORT_CONTACT.phoneDisplay}</a>
            </div>
            <div className="footer-contact-item items-start">
              <MapPinIcon className="footer-contact-icon mt-0.5" />
              <address className="not-italic leading-snug">
                240 W Palmetto Park Rd, Suite 110<br />
                Boca Raton, FL 33432
              </address>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              &copy; {new Date().getFullYear()} AC Drain Wiz. All rights reserved.
            </p>
            <p className="footer-badges">
              ICC Code Compliant • Professional Grade • Made in USA
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
