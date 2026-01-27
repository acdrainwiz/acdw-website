import { EnvelopeIcon, PhoneIcon, BuildingOfficeIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export function AboutPage() {
  const markets = [
    'Residential HVAC',
    'Condominiums/Apartments', 
    'Light Commercial (select installs)'
  ]

  const audiences = [
    'Homeowners',
    'HVAC Contractors',
    'Property Managers',
    'City/Code Officials (AHJs)'
  ]

  return (
    <div className="about-page-container">
      <div className="about-page-content">
        {/* Header */}
        <div className="about-page-header">
          <h1 className="about-page-title">About AC Drain Wiz</h1>
          <p className="about-page-subtitle">
            Making AC maintenance easier, faster, and more profitable with innovative 
            one-time installed solutions that proactively keep condensate drain lines clear.
          </p>
        </div>

        {/* Mission Section */}
        <div className="about-page-section">
          <h2 className="about-page-section-title">Our Mission</h2>
          <div className="about-page-mission-content">
            <p className="about-page-mission-text">
              Make AC maintenance easier, faster, and more profitable with a one-time installed solution 
              that proactively keeps condensate drain lines clear.
            </p>
            <div className="about-page-mission-grid">
              <div className="about-page-mission-item">
                <div className="about-page-mission-icon about-page-mission-icon-easier">
                  <CheckCircleIcon className="about-page-mission-icon-svg" />
                </div>
                <h3 className="about-page-mission-item-title">Easier</h3>
                <p className="about-page-mission-item-description">One-time installation eliminates repeated cutting and reconnection</p>
              </div>
              <div className="about-page-mission-item">
                <div className="about-page-mission-icon about-page-mission-icon-faster">
                  <CheckCircleIcon className="about-page-mission-icon-svg" />
                </div>
                <h3 className="about-page-mission-item-title">Faster</h3>
                <p className="about-page-mission-item-description">10X faster cleanouts with streamlined maintenance process</p>
              </div>
              <div className="about-page-mission-item">
                <div className="about-page-mission-icon about-page-mission-icon-profitable">
                  <CheckCircleIcon className="about-page-mission-icon-svg" />
                </div>
                <h3 className="about-page-mission-item-title">More Profitable</h3>
                <p className="about-page-mission-item-description">Increased technician efficiency and upsell opportunities</p>
              </div>
            </div>
          </div>
        </div>

        {/* Markets & Audiences */}
        <div className="about-page-info-grid">
          <div className="about-page-info-card">
            <h2 className="about-page-info-card-title">Primary Markets</h2>
            <ul className="about-page-info-list">
              {markets.map((market, index) => (
                <li key={index} className="about-page-info-item">
                  <CheckCircleIcon className="about-page-info-icon about-page-info-icon-green" />
                  <span className="about-page-info-text">{market}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="about-page-info-card">
            <h2 className="about-page-info-card-title">Target Audiences</h2>
            <ul className="about-page-info-list">
              {audiences.map((audience, index) => (
                <li key={index} className="about-page-info-item">
                  <CheckCircleIcon className="about-page-info-icon about-page-info-icon-blue" />
                  <span className="about-page-info-text">{audience}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Leadership */}
        <div className="about-page-section about-page-leadership">
          <h2 className="about-page-section-title">Leadership</h2>
          <div className="about-page-leadership-content">
            <div className="about-page-leadership-profile">
              <div className="about-page-leadership-avatar">
                <BuildingOfficeIcon className="about-page-leadership-avatar-icon" />
              </div>
              <div className="about-page-leadership-details">
                <h3 className="about-page-leadership-name">Alan Riddle</h3>
                <p className="about-page-leadership-role">Founder & CEO</p>
                <p className="about-page-leadership-bio">
                  Leading the development of innovative AC drain line maintenance solutions 
                  that revolutionize how HVAC professionals approach condensate line maintenance.
                </p>
                <div className="about-page-leadership-contact">
                  <a 
                    href="mailto:ariddle@acdrainwiz.com" 
                    className="about-page-leadership-contact-link"
                  >
                    <EnvelopeIcon className="about-page-leadership-contact-icon" />
                    <span className="about-page-leadership-contact-text">ariddle@acdrainwiz.com</span>
                  </a>
                  <a 
                    href="tel:+12342237246" 
                    className="about-page-leadership-contact-link"
                  >
                    <PhoneIcon className="about-page-leadership-contact-icon" />
                    <span className="about-page-leadership-contact-text">(234) 23 DRAIN</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="about-page-section">
          <h2 className="about-page-section-title">Company Information</h2>
          <div className="about-page-company-content">
            <div className="about-page-company-grid">
              <div className="about-page-company-item">
                <h3 className="about-page-company-item-title">Brand</h3>
                <p className="about-page-company-item-text">AC Drain Wiz</p>
              </div>
              <div className="about-page-company-item">
                <h3 className="about-page-company-item-title">Catalog Version</h3>
                <p className="about-page-company-item-text">2025-10-22</p>
              </div>
              <div className="about-page-company-item">
                <h3 className="about-page-company-item-title">Product Status</h3>
                <div className="about-page-company-item-list">
                  <p className="about-page-company-item-text">• Mini: Available Now</p>
                  <p className="about-page-company-item-text">• Sensor: Available Now</p>
                  <p className="about-page-company-item-text">• Mini + Sensor: Available Now</p>
                  <p className="about-page-company-item-text about-page-company-item-text-deprecated">• Core 1.0: Deprecated (legacy product - full support for existing customers)</p>
                </div>
              </div>
              <div className="about-page-company-item">
                <h3 className="about-page-company-item-title">Compliance</h3>
                <div className="about-page-company-item-list">
                  <p className="about-page-company-item-text">• IMC 307.2.5</p>
                  <p className="about-page-company-item-text">• IMC 307.2.2</p>
                  <p className="about-page-company-item-text">• IMC 307.2.1.1</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
