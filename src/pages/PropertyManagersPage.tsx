import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  BellAlertIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

export function PropertyManagersPage() {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Property Manager testimonials
  const testimonials = [
    {
      name: 'Maria Gonzalez',
      role: 'Portfolio Manager, 45 Properties',
      text: 'Since installing sensors across our portfolio, water damage claims dropped 92%. The dashboard lets me see every property at a glance. Best ROI of any preventive maintenance investment we\'ve made.',
      rating: 5,
      image: '/images/testimonials/placeholder.jpg'
    },
    {
      name: 'David Chen',
      role: 'Senior Property Manager',
      text: 'Tenant complaints about AC issues dropped significantly. The automated alerts mean we catch problems before they become emergencies. Our maintenance costs are down 40%.',
      rating: 5,
      image: '/images/testimonials/placeholder.jpg'
    },
    {
      name: 'Sarah Mitchell',
      role: 'Regional Property Director',
      text: 'Managing 80+ units across three states, the centralized monitoring is invaluable. We identify trends, schedule preventive maintenance, and keep all properties running smoothly.',
      rating: 5,
      image: '/images/testimonials/placeholder.jpg'
    }
  ];

  const handleTestimonialNext = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const handleTestimonialPrev = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleTestimonialSelect = (index: number) => {
    setCurrentTestimonial(index);
  };

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
                Call (234) AC DRAIN
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="homeowner-problem-container">
        <div className="homeowner-problem-content">
          <h2 className="homeowner-problem-title">The Hidden Cost of AC Drain Issues</h2>
          <p className="homeowner-problem-description">
            A single water damage incident from a clogged AC drain can cost thousands in repairs, lost rent, 
            and tenant dissatisfaction. Multiply that across your portfolio and it's a significant financial risk.
          </p>
          
          <div className="homeowner-problem-stats">
            <div className="homeowner-problem-stat">
              <div className="homeowner-problem-stat-number">$8,000+</div>
              <div className="homeowner-problem-stat-label">Avg water damage cost</div>
            </div>
            <div className="homeowner-problem-stat">
              <div className="homeowner-problem-stat-number">30-60</div>
              <div className="homeowner-problem-stat-label">Days lost rent</div>
            </div>
            <div className="homeowner-problem-stat">
              <div className="homeowner-problem-stat-number">45%</div>
              <div className="homeowner-problem-stat-label">Tenant turnover increase</div>
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

          <div className="homeowner-products-grid">
            {/* Sensor System */}
            <div className="homeowner-product-card homeowner-product-card-featured">
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
                className="homeowner-product-cta"
              >
                Learn More
              </button>
            </div>

            {/* Complete Protection */}
            <div className="homeowner-product-card">
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
                className="homeowner-product-cta"
              >
                View Complete System
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Carousel */}
      <section className="mini-product-testimonials">
        <div className="mini-product-testimonials-content">
          <h2 className="mini-product-section-title">What Property Managers Say</h2>
          <p className="homeowner-testimonials-subtitle">Trusted by property managers nationwide</p>
          
          <div className="mini-product-testimonials-carousel">
            <div className="mini-product-testimonials-carousel-container">
              <button
                onClick={handleTestimonialPrev}
                className="mini-product-testimonials-nav-button mini-product-testimonials-nav-button-prev"
                aria-label="Previous testimonial"
              >
                <ChevronLeftIcon className="mini-product-testimonials-nav-icon" />
              </button>

              <div className="mini-product-testimonials-carousel-card-wrapper">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className={`mini-product-testimonial-card ${
                      index === currentTestimonial ? 'mini-product-testimonial-card-active' : 'mini-product-testimonial-card-hidden'
                    }`}
                  >
                    <div className="mini-product-testimonial-image-wrapper">
                      <img
                        src={testimonial.image}
                        alt={`${testimonial.name}, ${testimonial.role}`}
                        className="mini-product-testimonial-image"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/testimonials/placeholder.jpg';
                        }}
                      />
                    </div>
                    <div className="mini-product-testimonial-content">
                      <div className="mini-product-testimonial-rating">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <StarIcon key={i} className="mini-product-testimonial-star" />
                        ))}
                      </div>
                      <p className="mini-product-testimonial-text">"{testimonial.text}"</p>
                      <div className="mini-product-testimonial-author">
                        <span className="mini-product-testimonial-name">{testimonial.name}</span>
                        <span className="mini-product-testimonial-role">{testimonial.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleTestimonialNext}
                className="mini-product-testimonials-nav-button mini-product-testimonials-nav-button-next"
                aria-label="Next testimonial"
              >
                <ChevronRightIcon className="mini-product-testimonials-nav-icon" />
              </button>
            </div>

            <div className="mini-product-testimonials-indicators">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleTestimonialSelect(index)}
                  className={`mini-product-testimonials-indicator ${
                    index === currentTestimonial ? 'mini-product-testimonials-indicator-active' : ''
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <div className="homeowner-faq-container">
        <h2 className="homeowner-faq-title">Property Manager FAQs</h2>
        <div className="homeowner-faq-list">
          <div className="homeowner-faq-item">
            <h3 className="homeowner-faq-question">What's the cost for multiple properties?</h3>
            <p className="homeowner-faq-answer">
              We offer volume pricing for property portfolios. Contact us at (234) AC DRAIN to discuss your specific needs and get a custom quote.
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
              (234) AC DRAIN
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

