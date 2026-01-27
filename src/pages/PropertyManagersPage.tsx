import { useNavigate } from 'react-router-dom';
import { 
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  PhoneIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export function PropertyManagersPage() {
  const navigate = useNavigate();

  return (
    <div className="homeowner-page">
      {/* Hero Section */}
      <div className="homeowner-hero-container" style={{ background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)' }}>
        <div className="homeowner-hero-content">
          <div className="homeowner-hero-header">
            <h1 className="homeowner-hero-headline">
              Protect Every Property. <span className="homeowner-hero-highlight">One Solution.</span>
            </h1>
            
            <p className="homeowner-hero-subheadline">
              Reduce maintenance costs, prevent water damage, and keep tenants happy with centralized AC drain line monitoring.
            </p>

            <div className="homeowner-hero-badge-row">
              <span className="homeowner-hero-badge">Multi-Property Dashboard</span>
              <span className="homeowner-hero-badge">24/7 Monitoring & Alerts</span>
            </div>

            <div className="homeowner-hero-ctas">
              <button 
                onClick={() => navigate('/products/sensor')}
                className="homeowner-hero-cta-primary"
              >
                View Fleet Solution
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
          <h2 className="homeowner-problem-headline">The Hidden Cost of AC Drain Issues</h2>
          <p className="homeowner-problem-subheadline">
            A single water damage incident from a clogged AC drain can cost thousands in repairs, lost rent, 
            and tenant dissatisfaction. Multiply that across your portfolio and it's a significant financial risk.
          </p>
          
          <div className="homeowner-problem-stats">
            <div className="homeowner-stat">
              <div className="homeowner-stat-icon-wrapper">
                <CurrencyDollarIcon className="homeowner-stat-icon" />
              </div>
              <div className="homeowner-stat-number">$8,000+</div>
              <div className="homeowner-stat-label">Avg water damage cost</div>
            </div>
            <div className="homeowner-stat">
              <div className="homeowner-stat-icon-wrapper">
                <ClockIcon className="homeowner-stat-icon" />
              </div>
              <div className="homeowner-stat-number">30-60</div>
              <div className="homeowner-stat-label">Days lost rent</div>
            </div>
            <div className="homeowner-stat">
              <div className="homeowner-stat-icon-wrapper">
                <UserGroupIcon className="homeowner-stat-icon" />
              </div>
              <div className="homeowner-stat-number">45%</div>
              <div className="homeowner-stat-label">Tenant turnover increase</div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="homeowner-benefits-container">
        <h2 className="homeowner-benefits-title">Comprehensive Protection for Your Portfolio</h2>
        <div className="homeowner-benefits-grid">
          <div className="homeowner-benefit-card">
            <div className="homeowner-benefit-icon-wrapper" style={{ background: '#ccfbf1' }}>
              <ShieldCheckIcon className="homeowner-benefit-icon" style={{ color: '#0f766e' }} />
            </div>
            <h3 className="homeowner-benefit-title">Prevent Costly Damage</h3>
            <p className="homeowner-benefit-description">
              24/7 monitoring detects clogs before they cause water damage. Automated alerts let you address issues proactively, protecting your investment.
            </p>
          </div>

          <div className="homeowner-benefit-card">
            <div className="homeowner-benefit-icon-wrapper" style={{ background: '#fef3c7' }}>
              <CurrencyDollarIcon className="homeowner-benefit-icon" style={{ color: '#d97706' }} />
            </div>
            <h3 className="homeowner-benefit-title">Reduce Maintenance Costs</h3>
            <p className="homeowner-benefit-description">
              Schedule preventive maintenance instead of emergency calls. Lower insurance claims, reduced water bills, and predictable budgets.
            </p>
          </div>

          <div className="homeowner-benefit-card">
            <div className="homeowner-benefit-icon-wrapper" style={{ background: '#dbeafe' }}>
              <UserGroupIcon className="homeowner-benefit-icon" style={{ color: '#1e40af' }} />
            </div>
            <h3 className="homeowner-benefit-title">Improve Tenant Satisfaction</h3>
            <p className="homeowner-benefit-description">
              Fewer AC failures means happier tenants. Proactive maintenance shows you care about their comfort, leading to longer leases and better reviews.
            </p>
          </div>

          <div className="homeowner-benefit-card">
            <div className="homeowner-benefit-icon-wrapper" style={{ background: '#e0e7ff' }}>
              <ChartBarIcon className="homeowner-benefit-icon" style={{ color: '#4f46e5' }} />
            </div>
            <h3 className="homeowner-benefit-title">Centralized Management</h3>
            <p className="homeowner-benefit-description">
              Monitor all properties from one dashboard. Track trends, identify problem units, and manage maintenance schedules across your entire portfolio.
            </p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="homeowner-products-container" style={{ background: '#f8fafc' }}>
        <div className="homeowner-products-content">
          <h2 className="homeowner-products-title">Property Management Solutions</h2>
          <p className="homeowner-products-subtitle">
            Scalable protection for portfolios of any size
          </p>

          <div className="homeowner-products-grid property-manager-products-grid">
            {/* Sensor System */}
            <div className="property-manager-product-card property-manager-product-card-featured">
              <div className="homeowner-product-badge">Recommended</div>
              <div className="homeowner-product-image-wrapper">
                <img 
                  src="/images/acdw-sensor-hero-background.png" 
                  alt="AC Drain Wiz Sensor"
                  className="homeowner-product-image"
                />
              </div>
              <h3 className="homeowner-product-name">Sensor Monitoring System</h3>
              <p className="homeowner-product-price">Fleet pricing available</p>
              <ul className="homeowner-product-features">
                <li><CheckCircleIcon className="homeowner-product-feature-icon" /> 24/7 remote monitoring</li>
                <li><CheckCircleIcon className="homeowner-product-feature-icon" /> Automated alerts</li>
                <li><CheckCircleIcon className="homeowner-product-feature-icon" /> Multi-property dashboard</li>
                <li><CheckCircleIcon className="homeowner-product-feature-icon" /> Maintenance tracking</li>
              </ul>
              <button 
                onClick={() => navigate('/products/sensor')}
                className="property-manager-product-cta"
              >
                Learn More
              </button>
            </div>

            {/* Complete Protection */}
            <div className="property-manager-product-card">
              <div className="homeowner-product-image-wrapper">
                <img 
                  src="/images/hvac-tech-mini-sensor-product-hero.png" 
                  alt="Complete Protection System"
                  className="homeowner-product-image"
                />
              </div>
              <h3 className="homeowner-product-name">Complete Protection System</h3>
              <p className="homeowner-product-price">Contact for portfolio pricing</p>
              <ul className="homeowner-product-features">
                <li><CheckCircleIcon className="homeowner-product-feature-icon" /> Mini + Sensor combo</li>
                <li><CheckCircleIcon className="homeowner-product-feature-icon" /> Maximum protection</li>
                <li><CheckCircleIcon className="homeowner-product-feature-icon" /> Professional installation</li>
                <li><CheckCircleIcon className="homeowner-product-feature-icon" /> Volume discounts</li>
              </ul>
              <button 
                onClick={() => navigate('/products/combo')}
                className="property-manager-product-cta"
              >
                View Complete System
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="homeowner-faq-container">
        <h2 className="homeowner-faq-title">Property Manager FAQs</h2>
        <div className="homeowner-faq-list">
          <div className="homeowner-faq-item">
            <h3 className="homeowner-faq-question">What's the cost for multiple properties?</h3>
            <p className="homeowner-faq-answer">
              We offer volume pricing for property portfolios. Contact us at (234) 23 DRAIN to discuss your specific needs and get a custom quote.
            </p>
          </div>

          <div className="homeowner-faq-item">
            <h3 className="homeowner-faq-question">How do I monitor all my properties?</h3>
            <p className="homeowner-faq-answer">
              Our centralized dashboard lets you see all your properties in one place. View system status, receive alerts, track maintenance history, and generate reports across your entire portfolio.
            </p>
          </div>

          <div className="homeowner-faq-item">
            <h3 className="homeowner-faq-question">What happens when a sensor detects a problem?</h3>
            <p className="homeowner-faq-answer">
              You'll receive an immediate alert via email and SMS. The dashboard shows which property needs attention, allowing you to schedule maintenance before water damage occurs.
            </p>
          </div>

          <div className="homeowner-faq-item">
            <h3 className="homeowner-faq-question">Is professional installation required?</h3>
            <p className="homeowner-faq-answer">
              Yes, we recommend working with your HVAC contractor for sensor installation. The process takes 15-20 minutes per unit and we can connect you with certified installers in your area.
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="homeowner-final-cta-container" style={{ background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)' }}>
        <div className="homeowner-final-cta-content">
          <h2 className="homeowner-final-cta-title">Protect Your Portfolio Today</h2>
          <p className="homeowner-final-cta-subtitle">
            Join property managers who've reduced water damage claims and maintenance costs.
          </p>
          <div className="homeowner-final-cta-buttons">
            <button 
              onClick={() => navigate('/contact?type=sales')}
              className="homeowner-hero-cta-primary"
            >
              Request Portfolio Assessment
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

