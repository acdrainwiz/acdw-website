import { EnvelopeIcon, PhoneIcon, BuildingOfficeIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export function AboutPage() {

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


      </div>
    </div>
  )
}
