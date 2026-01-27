import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  BuildingOfficeIcon, 
  ExclamationTriangleIcon,
  ChartBarIcon,
  BellIcon,
  WrenchScrewdriverIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export function PropertyManagerPage() {
  const navigate = useNavigate();

  const handleContactSales = () => {
    navigate('/contact?type=sales');
  };

  return (
    <div className="property-manager-page">
      {/* Hero Section */}
      <div className="property-manager-hero-container">
        <div className="property-manager-hero-content">
          <div className="property-manager-hero-header">
            <h1 className="property-manager-hero-headline">
              Protect Your Portfolio from <span className="property-manager-hero-highlight">Costly AC Drain Line Failures</span>
            </h1>
            
            <p className="property-manager-hero-subheadline">
              Professional-grade solutions for multi-unit properties. Bulk installation and 24/7 remote monitoring to prevent water damage and reduce emergency maintenance calls.
            </p>

            <div className="property-manager-hero-badge-row">
              <span className="property-manager-hero-badge">Bulk Pricing Available</span>
              <span className="property-manager-hero-badge">24/7 Remote Monitoring</span>
            </div>

            <div className="property-manager-hero-ctas">
              {/* Launch Button Redirect */}
              <a 
                href="tel:+12342237246"
                className="property-manager-hero-cta-primary"
              >
                Call (234) 23 DRAIN
              </a>
              <button 
                onClick={handleContactSales}
                className="property-manager-hero-cta-secondary"
              >
                Contact Sales Team
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="property-manager-problem-section">
        <div className="property-manager-problem-content">
          <h2 className="property-manager-problem-headline">The Hidden Cost of AC Drain Line Failures in Multi-Unit Properties</h2>
          <p className="property-manager-problem-subheadline">
            Water damage from AC drain line clogs can cost thousands per incident, create tenant complaints, increase insurance premiums, and lead to emergency maintenance calls that strain your budget and resources.
          </p>
          
          <div className="property-manager-problem-stats">
            <div className="property-manager-problem-stat">
              <ExclamationTriangleIcon className="property-manager-problem-stat-icon" />
              <div className="property-manager-problem-stat-content">
                <div className="property-manager-problem-stat-number">$15k - $50k</div>
                <div className="property-manager-problem-stat-label">Average water damage cost per incident</div>
              </div>
            </div>
            <div className="property-manager-problem-stat">
              <ClockIcon className="property-manager-problem-stat-icon" />
              <div className="property-manager-problem-stat-content">
                <div className="property-manager-problem-stat-number">48hrs</div>
                <div className="property-manager-problem-stat-label">Typical emergency response time</div>
              </div>
            </div>
            <div className="property-manager-problem-stat">
              <UserGroupIcon className="property-manager-problem-stat-icon" />
              <div className="property-manager-problem-stat-content">
                <div className="property-manager-problem-stat-number">85%</div>
                <div className="property-manager-problem-stat-label">Of property managers report drain line issues</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Solution Section */}
      <div className="property-manager-solution-section">
        <div className="property-manager-solution-content">
          <h2 className="property-manager-section-title">Complete Protection for Your Portfolio</h2>
          <p className="property-manager-section-subtitle">
            AC Drain Wiz Mini + Sensor provides proactive maintenance access and 24/7 remote monitoring to prevent costly failures before they happen.
          </p>

          <div className="property-manager-solution-grid">
            {/* ACDW Mini - Base Tier */}
            <div className="property-manager-solution-card property-manager-solution-card-mini">
              <div className="property-manager-solution-badge">Good</div>
              <div className="property-manager-solution-card-header">
                <div className="property-manager-solution-icon-wrapper">
                  <WrenchScrewdriverIcon className="property-manager-solution-icon" />
                </div>
                <h3 className="property-manager-solution-card-title">ACDW Mini</h3>
                <p className="property-manager-solution-card-description">
                  Proactive maintenance access for all units. Installs in 5 minutes or less per unit with professional support available.
                </p>
                <div className="property-manager-solution-pricing">
                  <span className="property-manager-solution-price">Starting at</span>
                  <span className="property-manager-solution-price-amount">$99.99</span>
                  <span className="property-manager-solution-price-unit">per unit</span>
                </div>
              </div>
              <ul className="property-manager-solution-features">
                <li className="property-manager-solution-feature-item">
                  <svg className="property-manager-solution-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Prevent clogs before they cause damage</span>
                </li>
                <li className="property-manager-solution-feature-item">
                  <svg className="property-manager-solution-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>10X faster maintenance cleanouts</span>
                </li>
                <li className="property-manager-solution-feature-item">
                  <svg className="property-manager-solution-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Clear visual inspection window</span>
                </li>
                <li className="property-manager-solution-feature-item">
                  <svg className="property-manager-solution-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Bulk installation pricing</span>
                </li>
                <li className="property-manager-solution-feature-item">
                  <svg className="property-manager-solution-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Professional installation support</span>
                </li>
              </ul>
              {/* Launch Button Redirect */}
              <button 
                onClick={handleContactSales}
                className="property-manager-solution-cta property-manager-solution-cta-secondary"
              >
                Contact Sales
              </button>
            </div>

            {/* ACDW Sensor - Middle Tier */}
            <div className="property-manager-solution-card property-manager-solution-card-sensor">
              <div className="property-manager-solution-badge">Better</div>
              <div className="property-manager-solution-card-header">
                <div className="property-manager-solution-icon-wrapper">
                  <BellIcon className="property-manager-solution-icon" />
                </div>
                <h3 className="property-manager-solution-card-title">ACDW Sensor</h3>
                <p className="property-manager-solution-card-description">
                  24/7 remote monitoring with instant alerts. Monitor all units from a centralized dashboard.
                </p>
                <div className="property-manager-solution-pricing">
                  <span className="property-manager-solution-price">Starting at</span>
                  <span className="property-manager-solution-price-amount">Contact</span>
                  <span className="property-manager-solution-price-unit">for pricing</span>
                </div>
              </div>
              <ul className="property-manager-solution-features">
                {/* All Mini features */}
                <li className="property-manager-solution-feature-item">
                  <svg className="property-manager-solution-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Prevent clogs before they cause damage</span>
                </li>
                <li className="property-manager-solution-feature-item">
                  <svg className="property-manager-solution-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>10X faster maintenance cleanouts</span>
                </li>
                <li className="property-manager-solution-feature-item">
                  <svg className="property-manager-solution-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Clear visual inspection window</span>
                </li>
                <li className="property-manager-solution-feature-item">
                  <svg className="property-manager-solution-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Bulk installation pricing</span>
                </li>
                <li className="property-manager-solution-feature-item">
                  <svg className="property-manager-solution-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Professional installation support</span>
                </li>
                {/* Sensor-specific features */}
                <li className="property-manager-solution-feature-item property-manager-solution-feature-new">
                  <svg className="property-manager-solution-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Real-time water level monitoring</span>
                </li>
                <li className="property-manager-solution-feature-item property-manager-solution-feature-new">
                  <svg className="property-manager-solution-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Email and SMS alerts before failures</span>
                </li>
                <li className="property-manager-solution-feature-item property-manager-solution-feature-new">
                  <svg className="property-manager-solution-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Centralized dashboard for all properties</span>
                </li>
                <li className="property-manager-solution-feature-item property-manager-solution-feature-new">
                  <svg className="property-manager-solution-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>No moving parts, reliable operation</span>
                </li>
              </ul>
              {/* Launch Button Redirect */}
              <button 
                onClick={handleContactSales}
                className="property-manager-solution-cta property-manager-solution-cta-secondary"
              >
                Contact Sales
              </button>
            </div>

            {/* Complete System - Premium Tier (Emphasized) */}
            <div className="property-manager-solution-card property-manager-solution-card-complete property-manager-solution-card-featured">
              <div className="property-manager-solution-badge">Most Popular</div>
              <div className="property-manager-solution-card-header">
                <div className="property-manager-solution-icon-wrapper">
                  <SparklesIcon className="property-manager-solution-icon" />
                </div>
                <h3 className="property-manager-solution-card-title">Complete System</h3>
                <p className="property-manager-solution-card-description">
                  Mini + Sensor combination provides maximum protection with proactive maintenance and smart monitoring.
                </p>
                <div className="property-manager-solution-pricing">
                  <span className="property-manager-solution-price">Starting at</span>
                  <span className="property-manager-solution-price-amount">Contact</span>
                  <span className="property-manager-solution-price-unit">for pricing</span>
                </div>
              </div>
              <ul className="property-manager-solution-features">
                {/* All Mini features */}
                <li className="property-manager-solution-feature-item">
                  <svg className="property-manager-solution-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Prevent clogs before they cause damage</span>
                </li>
                <li className="property-manager-solution-feature-item">
                  <svg className="property-manager-solution-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>10X faster maintenance cleanouts</span>
                </li>
                <li className="property-manager-solution-feature-item">
                  <svg className="property-manager-solution-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Clear visual inspection window</span>
                </li>
                <li className="property-manager-solution-feature-item">
                  <svg className="property-manager-solution-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Bulk installation pricing</span>
                </li>
                <li className="property-manager-solution-feature-item">
                  <svg className="property-manager-solution-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Professional installation support</span>
                </li>
                {/* All Sensor features */}
                <li className="property-manager-solution-feature-item property-manager-solution-feature-new">
                  <svg className="property-manager-solution-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Real-time water level monitoring</span>
                </li>
                <li className="property-manager-solution-feature-item property-manager-solution-feature-new">
                  <svg className="property-manager-solution-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Email and SMS alerts before failures</span>
                </li>
                <li className="property-manager-solution-feature-item property-manager-solution-feature-new">
                  <svg className="property-manager-solution-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Centralized dashboard for all properties</span>
                </li>
                <li className="property-manager-solution-feature-item property-manager-solution-feature-new">
                  <svg className="property-manager-solution-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>No moving parts, reliable operation</span>
                </li>
                {/* Complete System-specific features */}
                <li className="property-manager-solution-feature-item property-manager-solution-feature-premium">
                  <svg className="property-manager-solution-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Proactive cleaning + smart alerts</span>
                </li>
                <li className="property-manager-solution-feature-item property-manager-solution-feature-premium">
                  <svg className="property-manager-solution-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Reduce emergency calls by 85%</span>
                </li>
                <li className="property-manager-solution-feature-item property-manager-solution-feature-premium">
                  <svg className="property-manager-solution-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Portfolio-wide monitoring</span>
                </li>
                <li className="property-manager-solution-feature-item property-manager-solution-feature-premium">
                  <svg className="property-manager-solution-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Maximum ROI with combined protection</span>
                </li>
                <li className="property-manager-solution-feature-item property-manager-solution-feature-premium">
                  <svg className="property-manager-solution-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Priority installation and support</span>
                </li>
              </ul>
              {/* Launch Button Redirect */}
              <button 
                onClick={handleContactSales}
                className="property-manager-solution-cta property-manager-solution-cta-primary"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="property-manager-benefits-section">
        <div className="property-manager-benefits-content">
          <h2 className="property-manager-section-title">Why Property Managers Choose AC Drain Wiz</h2>
          
          <div className="property-manager-benefits-grid">
            <div className="property-manager-benefit-item">
              <CurrencyDollarIcon className="property-manager-benefit-icon" />
              <h3 className="property-manager-benefit-title">Reduce Costs</h3>
              <p className="property-manager-benefit-description">
                Prevent $5K-$20K water damage claims per incident. Lower insurance premiums with proactive maintenance.
              </p>
            </div>

            <div className="property-manager-benefit-item">
              <ClockIcon className="property-manager-benefit-icon" />
              <h3 className="property-manager-benefit-title">Fewer Emergency Calls</h3>
              <p className="property-manager-benefit-description">
                Reduce emergency AC service calls by up to 85%. Proactive maintenance prevents reactive repairs.
              </p>
            </div>

            <div className="property-manager-benefit-item">
              <ChartBarIcon className="property-manager-benefit-icon" />
              <h3 className="property-manager-benefit-title">Centralized Monitoring</h3>
              <p className="property-manager-benefit-description">
                Monitor all units from one dashboard. Get alerts before problems become emergencies.
              </p>
            </div>

            <div className="property-manager-benefit-item">
              <UserGroupIcon className="property-manager-benefit-icon" />
              <h3 className="property-manager-benefit-title">Improve Tenant Satisfaction</h3>
              <p className="property-manager-benefit-description">
                Prevent AC failures and water damage that create tenant complaints and turnover.
              </p>
            </div>

            <div className="property-manager-benefit-item">
              <ShieldCheckIcon className="property-manager-benefit-icon" />
              <h3 className="property-manager-benefit-title">Reduce Liability</h3>
              <p className="property-manager-benefit-description">
                IMC code compliant solutions with documentation for insurance and legal protection.
              </p>
            </div>

            <div className="property-manager-benefit-item">
              <BuildingOfficeIcon className="property-manager-benefit-icon" />
              <h3 className="property-manager-benefit-title">Bulk Installation</h3>
              <p className="property-manager-benefit-description">
                Professional installation support for portfolio-wide deployments with bulk pricing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ROI Section */}
      <div className="property-manager-roi-section">
        <div className="property-manager-roi-content">
          <h2 className="property-manager-section-title">Proven ROI for Property Managers</h2>
          <div className="property-manager-roi-grid">
            <div className="property-manager-roi-card">
              <h3 className="property-manager-roi-card-title">Cost Per Unit</h3>
              <div className="property-manager-roi-card-value">$99.99+</div>
              <p className="property-manager-roi-card-description">
                One-time installation cost per unit (Mini). Sensor available for enhanced monitoring.
              </p>
            </div>
            <div className="property-manager-roi-card">
              <h3 className="property-manager-roi-card-title">Potential Savings</h3>
              <div className="property-manager-roi-card-value">$15k - $50k</div>
              <p className="property-manager-roi-card-description">
                Prevented water damage cost per incident. One prevented incident pays for 100+ units.
              </p>
            </div>
            <div className="property-manager-roi-card">
              <h3 className="property-manager-roi-card-title">Emergency Call Reduction</h3>
              <div className="property-manager-roi-card-value">85%</div>
              <p className="property-manager-roi-card-description">
                Average reduction in emergency AC service calls with proactive maintenance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="property-manager-how-it-works-section">
        <div className="property-manager-how-it-works-content">
          <h2 className="property-manager-section-title">How It Works for Property Managers</h2>
          <div className="property-manager-steps">
            <div className="property-manager-step">
              <div className="property-manager-step-number">1</div>
              <h3 className="property-manager-step-title">Contact Us</h3>
              <p className="property-manager-step-description">
                Contact us to assess your portfolio and provide a customized installation plan.
              </p>
            </div>
            <div className="property-manager-step">
              <div className="property-manager-step-number">2</div>
              <h3 className="property-manager-step-title">Bulk Installation</h3>
              <p className="property-manager-step-description">
                Professional installation of ACDW Mini and Sensor across your properties with bulk pricing. Mini installation takes 5 minutes or less per unit, with Sensor setup adding less than 5 additional minutes for complete system deployment.
              </p>
            </div>
            <div className="property-manager-step">
              <div className="property-manager-step-number">3</div>
              <h3 className="property-manager-step-title">Monitor & Maintain</h3>
              <p className="property-manager-step-description">
                Access to a centralized dashboard for remote monitoring with the Sensor, while the Mini provides clear visual verification of drain line health. Together, they offer the best of both worlds: real-time alerts and visual confirmation, resulting in happy tenants and bottom lines.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="property-manager-cta-section">
        <div className="property-manager-cta-content">
          <h2 className="property-manager-cta-title">Ready to Protect Your Portfolio?</h2>
          <p className="property-manager-cta-subtitle">
            Join property managers nationwide who trust AC Drain Wiz to prevent costly water damage and reduce emergency maintenance calls.
          </p>
          <div className="property-manager-cta-buttons">
            {/* Launch Button Redirect */}
            <a 
              href="tel:+12342237246"
              className="property-manager-cta-button-primary"
            >
              Call (234) 23 DRAIN
            </a>
            <button 
              onClick={handleContactSales}
              className="property-manager-cta-button-secondary"
            >
              Contact Sales Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

