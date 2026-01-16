import { useNavigate } from 'react-router-dom';
import { 
  WrenchScrewdriverIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  PhoneIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export function HVACProsPage() {
  const navigate = useNavigate();

  return (
    <div className="homeowner-page">
      {/* Hero Section */}
      <div className="homeowner-hero-container" style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)' }}>
        <div className="homeowner-hero-content">
          <div className="homeowner-hero-header">
            <h1 className="homeowner-hero-headline">
              Turn Drain Calls Into <span className="homeowner-hero-highlight">Revenue</span>
            </h1>
            
            <p className="homeowner-hero-subheadline">
              Eliminate callbacks, increase efficiency, and create recurring revenue with AC Drain Wiz professional solutions.
            </p>

            <div className="homeowner-hero-badge-row">
              <span className="homeowner-hero-badge">5-Minute Installation</span>
              <span className="homeowner-hero-badge">Bulk Contractor Pricing</span>
            </div>

            <div className="homeowner-hero-ctas">
              <button 
                onClick={() => navigate('/products/combo')}
                className="homeowner-hero-cta-primary"
              >
                View Complete System
              </button>
              <a 
                href="tel:+12342237246"
                className="homeowner-hero-cta-secondary"
              >
                Call (234) AC DRAIN
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
          <h2 className="homeowner-problem-headline">The Drain Line Callback Problem</h2>
          <p className="homeowner-problem-subheadline">
            Every HVAC pro knows the frustration: you clear a clogged drain line, complete the service call, 
            and within weeks the customer calls back with the same issue. Lost time, unhappy customers, and revenue drain.
          </p>
          
          <div className="homeowner-problem-stats">
            <div className="homeowner-stat">
              <div className="homeowner-stat-icon-wrapper">
                <ExclamationTriangleIcon className="homeowner-stat-icon" />
              </div>
              <div className="homeowner-stat-number">$150-300</div>
              <div className="homeowner-stat-label">Lost per callback</div>
            </div>
            <div className="homeowner-stat">
              <div className="homeowner-stat-icon-wrapper">
                <ClockIcon className="homeowner-stat-icon" />
              </div>
              <div className="homeowner-stat-number">2-4 hrs</div>
              <div className="homeowner-stat-label">Wasted time</div>
            </div>
            <div className="homeowner-stat">
              <div className="homeowner-stat-icon-wrapper">
                <UserGroupIcon className="homeowner-stat-icon" />
              </div>
              <div className="homeowner-stat-number">60%</div>
              <div className="homeowner-stat-label">Customer churn rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="homeowner-benefits-container">
        <h2 className="homeowner-benefits-title">How AC Drain Wiz Transforms Your Business</h2>
        <div className="homeowner-benefits-grid">
          <div className="homeowner-benefit-card">
            <div className="homeowner-benefit-icon-wrapper" style={{ background: '#dbeafe' }}>
              <ClockIcon className="homeowner-benefit-icon" style={{ color: '#1e40af' }} />
            </div>
            <h3 className="homeowner-benefit-title">Eliminate Callbacks</h3>
            <p className="homeowner-benefit-description">
              Mini installs in 5 minutes during any service call. Give customers permanent access to their drain line—no more repeat visits for the same clog.
            </p>
          </div>

          <div className="homeowner-benefit-card">
            <div className="homeowner-benefit-icon-wrapper" style={{ background: '#dcfce7' }}>
              <CurrencyDollarIcon className="homeowner-benefit-icon" style={{ color: '#16a34a' }} />
            </div>
            <h3 className="homeowner-benefit-title">Create Recurring Revenue</h3>
            <p className="homeowner-benefit-description">
              Upsell sensor monitoring subscriptions. Track multiple customer systems from one dashboard and generate consistent monthly income.
            </p>
          </div>

          <div className="homeowner-benefit-card">
            <div className="homeowner-benefit-icon-wrapper" style={{ background: '#fef3c7' }}>
              <UserGroupIcon className="homeowner-benefit-icon" style={{ color: '#d97706' }} />
            </div>
            <h3 className="homeowner-benefit-title">Build Customer Loyalty</h3>
            <p className="homeowner-benefit-description">
              Position yourself as a technology leader. Customers see you as innovative and proactive—leading to referrals and long-term relationships.
            </p>
          </div>

          <div className="homeowner-benefit-card">
            <div className="homeowner-benefit-icon-wrapper" style={{ background: '#e0e7ff' }}>
              <ShieldCheckIcon className="homeowner-benefit-icon" style={{ color: '#4f46e5' }} />
            </div>
            <h3 className="homeowner-benefit-title">Code Compliant</h3>
            <p className="homeowner-benefit-description">
              Meets IMC 307.2.x requirements. Professional-grade solution that inspectors approve and customers trust.
            </p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="homeowner-products-container" style={{ background: '#f8fafc' }}>
        <div className="homeowner-products-content">
          <h2 className="homeowner-products-title">Professional Solutions</h2>
          <p className="homeowner-products-subtitle">
            Choose the right solution for your customers
          </p>

          <div className="homeowner-products-grid hvac-products-grid">
            {/* AC Drain Wiz Mini */}
            <div className="hvac-product-card">
              <div className="homeowner-product-image-wrapper">
                <img 
                  src="/images/ACDW-Mini-Cap-blk.png" 
                  alt="AC Drain Wiz Mini"
                  className="homeowner-product-image"
                />
              </div>
              <h3 className="homeowner-product-name">AC Drain Wiz Mini</h3>
              <p className="homeowner-product-price">Bulk pricing available</p>
              <ul className="homeowner-product-features">
                <li><CheckCircleIcon className="homeowner-product-feature-icon" /> 5-minute installation</li>
                <li><CheckCircleIcon className="homeowner-product-feature-icon" /> One-time customer solution</li>
                <li><CheckCircleIcon className="homeowner-product-feature-icon" /> Professional-grade quality</li>
                <li><CheckCircleIcon className="homeowner-product-feature-icon" /> IMC code compliant</li>
              </ul>
              <button 
                onClick={() => navigate('/products/mini')}
                className="hvac-product-cta"
              >
                Learn More
              </button>
            </div>

            {/* Mini + Sensor Combo */}
            <div className="hvac-product-card hvac-product-card-featured">
              <div className="homeowner-product-badge">Most Popular</div>
              <div className="homeowner-product-image-wrapper">
                <img 
                  src="/images/hvac-tech-mini-sensor-product-hero.png" 
                  alt="Mini + Sensor Combo"
                  className="homeowner-product-image"
                />
              </div>
              <h3 className="homeowner-product-name">Mini + Sensor Combo</h3>
              <p className="homeowner-product-price">Contact for fleet pricing</p>
              <ul className="homeowner-product-features">
                <li><CheckCircleIcon className="homeowner-product-feature-icon" /> Complete protection system</li>
                <li><CheckCircleIcon className="homeowner-product-feature-icon" /> 24/7 remote monitoring</li>
                <li><CheckCircleIcon className="homeowner-product-feature-icon" /> Recurring revenue opportunity</li>
                <li><CheckCircleIcon className="homeowner-product-feature-icon" /> Fleet management dashboard</li>
              </ul>
              <button 
                onClick={() => navigate('/products/combo')}
                className="hvac-product-cta"
              >
                View Complete System
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="homeowner-faq-container">
        <h2 className="homeowner-faq-title">Contractor FAQs</h2>
        <div className="homeowner-faq-list">
          <div className="homeowner-faq-item">
            <h3 className="homeowner-faq-question">What's the bulk pricing for contractors?</h3>
            <p className="homeowner-faq-answer">
              We offer tiered pricing based on volume. Contact our sales team at (234) AC DRAIN for custom quotes and contractor program details.
            </p>
          </div>

          <div className="homeowner-faq-item">
            <h3 className="homeowner-faq-question">How long does installation take?</h3>
            <p className="homeowner-faq-answer">
              The Mini installs in 5 minutes during any service call. The Sensor adds another 10-15 minutes for complete system installation.
            </p>
          </div>

          <div className="homeowner-faq-item">
            <h3 className="homeowner-faq-question">Can I manage multiple customer systems?</h3>
            <p className="homeowner-faq-answer">
              Yes! Our contractor dashboard lets you monitor all your customer sensors in one place. Track system health, receive alerts, and manage service schedules remotely.
            </p>
          </div>

          <div className="homeowner-faq-item">
            <h3 className="homeowner-faq-question">Is this code compliant?</h3>
            <p className="homeowner-faq-answer">
              Absolutely. AC Drain Wiz products meet IMC 307.2.x requirements and are approved for use in municipalities nationwide. We provide compliance documentation for inspections.
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="homeowner-final-cta-container" style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)' }}>
        <div className="homeowner-final-cta-content">
          <h2 className="homeowner-final-cta-title">Ready to Transform Your Service Business?</h2>
          <p className="homeowner-final-cta-subtitle">
            Join thousands of HVAC pros who've eliminated callbacks and created recurring revenue streams.
          </p>
          <div className="homeowner-final-cta-buttons">
            <button 
              onClick={() => navigate('/contact?type=sales')}
              className="homeowner-hero-cta-primary"
            >
              Contact Sales
            </button>
            <a 
              href="tel:+12342237246"
              className="homeowner-hero-cta-secondary"
            >
              <PhoneIcon style={{ width: '20px', height: '20px', marginRight: '8px' }} />
              (234) AC DRAIN
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

