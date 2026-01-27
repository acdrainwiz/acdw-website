import { Link } from 'react-router-dom'
import { 
  ShieldCheckIcon, 
  DocumentTextIcon, 
  BuildingOfficeIcon,
  CheckIcon,
  ArrowRightIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline'

export function CompliancePage() {
  return (
    <div className="compliance-page-container">
      <div className="container py-16">
        {/* Header */}
        <div className="compliance-page-header">
          <h1 className="heading-1 mb-6">Code Compliance & Certification</h1>
          <p className="text-large max-w-3xl mx-auto">
            AC Drain Wiz products meet International Mechanical Code (IMC) standards and are approved for use in municipalities nationwide.
          </p>
        </div>

        {/* Compliance Overview */}
        <div className="compliance-content-wrapper">
          <div className="compliance-overview-card">
            <div className="compliance-overview-header">
              <div className="compliance-overview-icon-wrapper">
                <ShieldCheckIcon className="compliance-overview-icon" />
              </div>
              <div>
                <h2 className="compliance-overview-title">IMC Code Compliant</h2>
                <p className="compliance-overview-description">
                  AC Drain Wiz products are designed and manufactured to meet International Mechanical Code (IMC) requirements, 
                  ensuring compliance with building codes across the United States.
                </p>
                <div className="compliance-highlight-box">
                  <div className="compliance-highlight-content">
                    <CheckIcon className="compliance-highlight-icon" />
                    <div>
                      <h3 className="compliance-highlight-title">Approved for Use Nationwide</h3>
                      <p className="compliance-highlight-text">
                        Our products have been reviewed and approved by building inspectors and code officials in municipalities 
                        across the country. We provide compliance documentation to support your installation projects.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* IMC Code References */}
          <div className="compliance-code-section">
            <h2 className="compliance-code-title">IMC Code References</h2>
            <div className="compliance-code-list">
              <div className="compliance-code-item">
                <h3 className="compliance-code-item-title">IMC 307.2.5 - Maintenance Access</h3>
                <p className="compliance-code-item-description">
                  AC Drain Wiz provides clear, unobstructed access to drain lines for maintenance and cleaning operations, 
                  meeting the requirement for maintenance access points.
                </p>
                <p className="compliance-code-item-note">
                  <strong>Compliance:</strong> The clear inspection window and bayonet port design ensure easy access for 
                  maintenance without requiring disassembly of the drain line system.
                </p>
              </div>

              <div className="compliance-code-item">
                <h3 className="compliance-code-item-title">IMC 307.2.2 - Approved Disposal Location</h3>
                <p className="compliance-code-item-description">
                  AC Drain Wiz facilitates proper disposal of condensate and cleaning solutions to approved locations, 
                  preventing improper discharge.
                </p>
                <p className="compliance-code-item-note">
                  <strong>Compliance:</strong> The design allows for controlled discharge during cleaning operations, 
                  ensuring all materials are directed to approved disposal locations.
                </p>
              </div>

              <div className="compliance-code-item">
                <h3 className="compliance-code-item-title">IMC 307.2.1.1 - Non-Contact Water Level Detection</h3>
                <p className="compliance-code-item-description">
                  AC Drain Wiz Sensor provides non-contact water level detection, meeting requirements for monitoring 
                  drain line conditions without physical contact.
                </p>
                <p className="compliance-code-item-note">
                  <strong>Compliance:</strong> The sensor uses non-contact technology to detect water levels and potential 
                  clogs, providing early warning without interfering with drain line operation.
                </p>
              </div>
            </div>
          </div>

          {/* Documentation & Resources */}
          <div className="compliance-documentation-section">
            <h2 className="compliance-documentation-title">Documentation & Resources</h2>
            <div className="compliance-documentation-grid">
              <div className="compliance-documentation-card">
                <DocumentTextIcon className="compliance-documentation-icon" />
                <h3 className="compliance-documentation-card-title">Compliance Certificate</h3>
                <p className="compliance-documentation-card-description">
                  Download our official compliance certificate for your records and building inspections.
                </p>
                <button className="compliance-documentation-link">
                  Download PDF →
                </button>
              </div>

              <div className="compliance-documentation-card">
                <BookOpenIcon className="compliance-documentation-icon" />
                <h3 className="compliance-documentation-card-title">Installation Guidelines</h3>
                <p className="compliance-documentation-card-description">
                  Detailed installation guidelines that ensure code compliance and proper system operation.
                </p>
                <Link to="/support#installation" className="compliance-documentation-link">
                  View Guidelines →
                </Link>
              </div>

              <div className="compliance-documentation-card">
                <DocumentTextIcon className="compliance-documentation-icon" />
                <h3 className="compliance-documentation-card-title">Technical Specifications</h3>
                <p className="compliance-documentation-card-description">
                  Complete technical specifications and material certifications for code officials and inspectors.
                </p>
                <Link to="/support#technical-resources" className="compliance-documentation-link">
                  View Specs →
                </Link>
              </div>

              <div className="compliance-documentation-card">
                <BuildingOfficeIcon className="compliance-documentation-icon" />
                <h3 className="compliance-documentation-card-title">For Code Officials</h3>
                <p className="compliance-documentation-card-description">
                  Request a demo or consultation to review compliance documentation and product specifications.
                </p>
                <Link to="/contact?type=demo-request" className="compliance-documentation-link">
                  Request Demo →
                </Link>
              </div>
            </div>
          </div>

          {/* Installation Guidelines */}
          <div className="compliance-guidelines-section">
            <h2 className="compliance-guidelines-title">Installation Guidelines for Code Compliance</h2>
            <div className="compliance-guidelines-list">
              <div className="compliance-guideline-item">
                <h3 className="compliance-guideline-title">Professional Installation Recommended</h3>
                <p className="compliance-guideline-text">
                  While AC Drain Wiz products are designed for easy installation, professional installation ensures full 
                  code compliance and proper system integration. Always consult with qualified HVAC professionals when 
                  modifying drain line systems.
                </p>
              </div>

              <div className="compliance-guideline-item">
                <h3 className="compliance-guideline-title">Local Code Variations</h3>
                <p className="compliance-guideline-text">
                  Always check with local building authorities for any additional requirements or variations from the IMC codes. 
                  Some jurisdictions may have specific requirements beyond the standard IMC codes.
                </p>
              </div>

              <div className="compliance-guideline-item">
                <h3 className="compliance-guideline-title">Permit Requirements</h3>
                <p className="compliance-guideline-text">
                  Some jurisdictions may require permits for HVAC system modifications. Check with your local building 
                  department before beginning installation to ensure compliance with all local regulations.
                </p>
              </div>

              <div className="compliance-guideline-item">
                <h3 className="compliance-guideline-title">Inspection</h3>
                <p className="compliance-guideline-text">
                  Consider scheduling an inspection to verify compliance with local codes. Our compliance documentation 
                  can be provided to inspectors to demonstrate code compliance.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="compliance-contact-section">
            <h2 className="compliance-contact-title">Questions About Compliance?</h2>
            <p className="compliance-contact-description">
              Our team is available to answer questions about code compliance, provide documentation for inspections, 
              and assist with compliance-related inquiries.
            </p>
            <div className="compliance-contact-buttons">
              <Link
                to="/contact?type=demo-request"
                className="compliance-contact-button-primary"
              >
                Request Compliance Documentation
                <ArrowRightIcon className="compliance-contact-icon" />
              </Link>
              <a
                href="tel:+12342237246"
                className="compliance-contact-button-secondary"
              >
                <div>
                  <div>Call (234) 23 DRAIN</div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.75, marginTop: '0.25rem' }}>(234) 223-7246</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

