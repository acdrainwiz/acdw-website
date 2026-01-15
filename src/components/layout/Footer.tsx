import { Link } from 'react-router-dom'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon
} from '@heroicons/react/24/outline'

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
              <Link to="/" className="footer-logo-link">
                <img 
                  src="/images/ac-drain-wiz-logo.png" 
                  alt="AC Drain Wiz Logo" 
                  className="footer-logo-image"
                />
              </Link>
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
                <li><Link to="/products?product=mini" className="footer-link">AC Drain Wiz Mini</Link></li>
                <li><Link to="/products?product=sensor" className="footer-link">AC Drain Wiz Sensor</Link></li>
                <li><Link to="/products?product=mini&product=sensor" className="footer-link">Mini + Sensor</Link></li>
                <li><Link to="/homeowner" className="footer-link">For Homeowners</Link></li>
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
                <li><Link to="/promo" className="footer-link">Special Offers</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div className="footer-section">
              <h3 className="footer-section-title">
                Support
              </h3>
              <ul className="footer-link-list">
                <li><Link to="/support" className="footer-link">Get Help</Link></li>
                <li><Link to="/support/installation-scenarios" className="footer-link">Recommended Installation Scenarios</Link></li>
                <li><Link to="/sensor-setup" className="footer-link">Sensor Setup Guide</Link></li>
                <li><a href="https://monitor.acdrainwiz.com/login" className="footer-link" target="_blank" rel="noopener noreferrer">Sensor Monitoring</a></li>
              </ul>
            </div>

            {/* Business */}
            <div className="footer-section">
              <h3 className="footer-section-title">
                Business
              </h3>
              <ul className="footer-link-list">
                <li><Link to="/contact?type=sales" className="footer-link">Bulk Ordering</Link></li>
                <li><Link to="/contact?type=sales" className="footer-link">Partner Program</Link></li>
                <li><Link to="/contact?type=demo-request" className="footer-link">Request Demo</Link></li>
                {/* Launch Button Redirect */}
                <li><Link to="/contact?type=sales" className="footer-link">Contractor Inquiries</Link></li>
                <li><Link to="/compliance" className="footer-link">Compliance Resources</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="footer-section">
              <h3 className="footer-section-title">
                Legal
              </h3>
              <ul className="footer-link-list">
                <li><Link to="/privacy-policy" className="footer-link">Privacy Policy</Link></li>
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
              <span>1-800-AC-DRAIN</span>
            </div>
            <div className="footer-contact-item">
              <MapPinIcon className="footer-contact-icon" />
              <span>United States</span>
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
