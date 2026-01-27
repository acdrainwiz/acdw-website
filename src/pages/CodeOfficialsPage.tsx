import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheckIcon,
  DocumentCheckIcon,
  EyeIcon,
  ClipboardDocumentCheckIcon,
  HomeModernIcon,
  CheckCircleIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

export function CodeOfficialsPage() {
  const navigate = useNavigate();

  return (
    <div className="homeowner-page">
      {/* Hero Section */}
      <div className="homeowner-hero-container" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)' }}>
        <div className="homeowner-hero-content">
          <div className="homeowner-hero-header">
            <h1 className="homeowner-hero-headline">
              Compliant. Safe. <span className="homeowner-hero-highlight">Standardized.</span>
            </h1>
            
            <p className="homeowner-hero-subheadline">
              A professional drain line solution that meets IMC requirements and simplifies inspection verification.
            </p>

            <div className="homeowner-hero-badge-row">
              <span className="homeowner-hero-badge">IMC 307.2.x Compliant</span>
              <span className="homeowner-hero-badge">Easy to Inspect</span>
            </div>

            <div className="homeowner-hero-ctas">
              <button 
                onClick={() => navigate('/compliance')}
                className="homeowner-hero-cta-primary"
              >
                View Compliance Documentation
              </button>
              <a 
                href="tel:+12342237246"
                className="homeowner-hero-cta-secondary"
              >
                Call (234) 23 DRAIN
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="homeowner-problem-section">
        <div className="homeowner-problem-background">
          {/* Background intentionally removed */}
        </div>
        
        <div className="homeowner-problem-overlay"></div>
        
        <div className="homeowner-problem-content">
          <h2 className="homeowner-problem-headline">The Drain Line Compliance Challenge</h2>
          <p className="homeowner-problem-subheadline">
            IMC 307.2.3 requires ready access to condensate drain systems for maintenance and cleaning. 
            Many installations fail to meet this standard, creating inspection issues and public health concerns.
          </p>
          
          <div className="homeowner-problem-stats">
            <div className="homeowner-stat">
              <div className="homeowner-stat-icon-wrapper">
                <DocumentCheckIcon className="homeowner-stat-icon" />
              </div>
              <div className="homeowner-stat-number">IMC 307.2.3</div>
              <div className="homeowner-stat-label">Code requirement</div>
            </div>
            <div className="homeowner-stat">
              <div className="homeowner-stat-icon-wrapper">
                <ExclamationTriangleIcon className="homeowner-stat-icon" />
              </div>
              <div className="homeowner-stat-number">40%</div>
              <div className="homeowner-stat-label">Non-compliant installs</div>
            </div>
            <div className="homeowner-stat">
              <div className="homeowner-stat-icon-wrapper">
                <CurrencyDollarIcon className="homeowner-stat-icon" />
              </div>
              <div className="homeowner-stat-number">$8K+</div>
              <div className="homeowner-stat-label">Avg water damage</div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="homeowner-benefits-container">
        <h2 className="homeowner-benefits-title">Why AC Drain Wiz Meets the Standard</h2>
        <div className="homeowner-benefits-grid">
          <div className="homeowner-benefit-card">
            <div className="homeowner-benefit-icon-wrapper" style={{ background: '#ede9fe' }}>
              <DocumentCheckIcon className="homeowner-benefit-icon" style={{ color: '#7c3aed' }} />
            </div>
            <h3 className="homeowner-benefit-title">Code Compliant</h3>
            <p className="homeowner-benefit-description">
              Designed to meet IMC 307.2.3 requirements for ready access to condensate drain systems. Clear documentation available for approval processes.
            </p>
          </div>

          <div className="homeowner-benefit-card">
            <div className="homeowner-benefit-icon-wrapper" style={{ background: '#dbeafe' }}>
              <EyeIcon className="homeowner-benefit-icon" style={{ color: '#1e40af' }} />
            </div>
            <h3 className="homeowner-benefit-title">Easy to Inspect</h3>
            <p className="homeowner-benefit-description">
              Visual verification is straightforward. Clear access port, professional installation, and obvious functionality simplify inspection approval.
            </p>
          </div>

          <div className="homeowner-benefit-card">
            <div className="homeowner-benefit-icon-wrapper" style={{ background: '#dcfce7' }}>
              <ShieldCheckIcon className="homeowner-benefit-icon" style={{ color: '#16a34a' }} />
            </div>
            <h3 className="homeowner-benefit-title">Protects Public Health</h3>
            <p className="homeowner-benefit-description">
              Prevents standing water and mold growth. Reduces water damage claims and insurance issues. Supports public health and safety objectives.
            </p>
          </div>

          <div className="homeowner-benefit-card">
            <div className="homeowner-benefit-icon-wrapper" style={{ background: '#fef3c7' }}>
              <HomeModernIcon className="homeowner-benefit-icon" style={{ color: '#d97706' }} />
            </div>
            <h3 className="homeowner-benefit-title">Standardizes Solutions</h3>
            <p className="homeowner-benefit-description">
              Professional-grade product that contractors trust. Establishes a consistent, reliable standard across your jurisdiction.
            </p>
          </div>
        </div>
      </div>

      {/* Code Compliance Section */}
      <div className="homeowner-products-container" style={{ background: '#f8fafc' }}>
        <div className="homeowner-products-content">
          <h2 className="homeowner-products-title">IMC Code Compliance</h2>
          <p className="homeowner-products-subtitle">
            AC Drain Wiz meets International Mechanical Code requirements
          </p>

          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="homeowner-benefit-card" style={{ textAlign: 'left', padding: '2.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1e293b' }}>
                <ClipboardDocumentCheckIcon style={{ width: '32px', height: '32px', display: 'inline', marginRight: '12px', color: '#7c3aed' }} />
                IMC Section 307.2.3
              </h3>
              <p style={{ fontSize: '1.125rem', lineHeight: '1.75', color: '#475569', marginBottom: '1.5rem' }}>
                "Condensate drain systems shall be provided with <strong>ready access for maintenance and cleaning</strong>."
              </p>
              
              <div style={{ background: '#f1f5f9', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1e293b' }}>
                  How AC Drain Wiz Complies:
                </h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#16a34a', marginRight: '12px', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ color: '#475569' }}>Provides permanent, ready access point for drain line maintenance</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#16a34a', marginRight: '12px', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ color: '#475569' }}>Allows cleaning without system disassembly</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#16a34a', marginRight: '12px', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ color: '#475569' }}>Professional-grade construction meets mechanical code standards</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#16a34a', marginRight: '12px', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ color: '#475569' }}>Clear visual identification during inspections</span>
                  </li>
                </ul>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button 
                  onClick={() => navigate('/compliance')}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1.5rem',
                    background: '#7c3aed',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  View Full Compliance Details
                </button>
                <button 
                  onClick={() => navigate('/contact?type=sales')}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1.5rem',
                    background: 'white',
                    color: '#7c3aed',
                    border: '2px solid #7c3aed',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Request Spec Sheets
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="homeowner-faq-container">
        <h2 className="homeowner-faq-title">Code Official FAQs</h2>
        <div className="homeowner-faq-list">
          <div className="homeowner-faq-item">
            <h3 className="homeowner-faq-question">What documentation is available for approval?</h3>
            <p className="homeowner-faq-answer">
              We provide complete technical specifications, installation instructions, and IMC compliance documentation. Contact us at (234) 23 DRAIN for approval packets.
            </p>
          </div>

          <div className="homeowner-faq-item">
            <h3 className="homeowner-faq-question">How does this meet IMC 307.2.3?</h3>
            <p className="homeowner-faq-answer">
              AC Drain Wiz provides permanent, ready access for condensate drain maintenance and cleaning without requiring system disassembly—exactly what the code requires.
            </p>
          </div>

          <div className="homeowner-faq-item">
            <h3 className="homeowner-faq-question">Is this approved in other jurisdictions?</h3>
            <p className="homeowner-faq-answer">
              Yes, AC Drain Wiz is approved and in use across numerous municipalities nationwide. We can provide reference letters from other jurisdictions upon request.
            </p>
          </div>

          <div className="homeowner-faq-item">
            <h3 className="homeowner-faq-question">Can we specify this for new construction?</h3>
            <p className="homeowner-faq-answer">
              Absolutely. Many jurisdictions recommend or require AC Drain Wiz for new construction and major renovations. We support municipal specification programs and contractor education.
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="homeowner-final-cta-container" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)' }}>
        <div className="homeowner-final-cta-content">
          <h2 className="homeowner-final-cta-title">Ready to Learn More?</h2>
          <p className="homeowner-final-cta-subtitle">
            Get compliance documentation and technical specifications for your jurisdiction.
          </p>
          <div className="homeowner-final-cta-buttons">
            <button 
              onClick={() => navigate('/compliance')}
              className="homeowner-hero-cta-primary"
            >
              View Compliance Page
            </button>
            <a 
              href="tel:+12342237246"
              className="homeowner-hero-cta-secondary"
            >
              <PhoneIcon style={{ width: '20px', height: '20px', marginRight: '8px' }} />
              (234) 23 DRAIN
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

