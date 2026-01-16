import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  WrenchScrewdriverIcon, 
  HomeIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BeakerIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  WrenchIcon,
  LockClosedIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

export function HomeownerHomePage() {
  const navigate = useNavigate();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Testimonials from acdrainwiz.bwpsites.com
  const testimonials = [
    {
      name: 'Joey',
      role: 'AC Technician',
      text: 'I love the AC DRAIN WIZ! After installing it and using it in one of my customers homes and seeing how much sludge came out after I did my service the normal way I was shocked! I would recommend the AC DRAIN to every homeowner out there!',
      rating: 5,
      image: '/images/testimonials/joey-testimonial.jpg'
    },
    {
      name: 'Charles C.',
      role: 'Homeowner',
      text: 'I highly recommend AC Drain Wiz. It is such an amazing product. I\'m surprised no one thought of it before. Thank you, AC Drain Wiz. It is comforting not to have sleepless, hot nights anymore.',
      rating: 5,
      image: '/images/testimonials/charles-testimonial.jpg'
    },
    {
      name: 'Jaclyn S.',
      role: 'Homeowner',
      text: 'The AC DRAIN WIZ is an amazing addition to my AC unit and has completely changed the unit which was becoming backed up almost every 3 months! The AC DRAIN WIZ really transformed the unit and it\'s now functioning better than ever! I\'m no longer looking forward to the summer in stifling south Florida with dread knowing that this device will allow prompt and effective resolution to any issue! Great product!!!',
      rating: 5,
      image: '/images/testimonials/jaclyn-s-testimonial.jpg'
    },
    {
      name: 'Jeff B.',
      role: 'FL General Contractor & Homeowner',
      text: 'I have a newer home that we have been living in for about 10 years. The only issue we have ever experienced has been a recurring problem with the condensate line backing up. I had no way of vacuuming it out without taking apart a big section of the pvc, and I never would dare to try to flush it out with a water hose. Now, with AC Drain Wiz, I can quickly and easily hook up a hose and flush out the whole line. It has been great to be able to do this as preventative maintenance, rather than waiting for the AC to stop running and having a big mess and headache. AC Drain Wiz is an easy, affordable necessity. As a contractor, I plan on using it on all my projects.',
      rating: 5,
      image: '/images/testimonials/jeff-b-testimonial.jpg'
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
      <div className="homeowner-hero-container">
        <div className="homeowner-hero-content">
          <div className="homeowner-hero-header">
            <h1 className="homeowner-hero-headline">
              DIY AC Drain Protection <span className="homeowner-hero-highlight">Made Simple</span>
            </h1>
            
            <p className="homeowner-hero-subheadline">
              Installs in 5 minutes or less. Designed for confident DIYers with optional pro backup.
            </p>

            <div className="homeowner-hero-badge-row">
              <span className="homeowner-hero-badge">Professional-Grade Quality</span>
              <span className="homeowner-hero-badge">30-Day Money-Back Guarantee</span>
            </div>

            <div className="homeowner-hero-ctas">
              <button 
                onClick={() => navigate('/products?product=mini')}
                className="homeowner-hero-cta-primary"
              >
                Shop ACDW Mini
              </button>
              <button 
                onClick={() => setIsVideoModalOpen(true)}
                className="homeowner-hero-cta-secondary"
              >
                Watch Installation Video
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="homeowner-features-section">
        <div className="homeowner-features-content">
          <div className="homeowner-features-grid">
            {/* Card 1: Easy DIY Installation */}
            <div className="homeowner-feature-card homeowner-feature-card-1">
              <div className="homeowner-feature-card-background homeowner-feature-card-bg-1"></div>
              <div className="homeowner-feature-card-overlay"></div>
              <div className="homeowner-feature-card-content">
                <div className="homeowner-feature-card-badge">DIY Installation</div>
                <h3 className="homeowner-feature-card-title">Installs in 5 Minutes or Less</h3>
                <p className="homeowner-feature-card-description">
                  No plumber needed. Simple step-by-step guide included.
                </p>
                <button 
                  onClick={() => setIsVideoModalOpen(true)}
                  className="homeowner-feature-card-cta"
                >
                  View Installation Video
                </button>
              </div>
            </div>
            
            {/* Card 2: Clear Inspection Window */}
            <div className="homeowner-feature-card homeowner-feature-card-2">
              <div className="homeowner-feature-card-background homeowner-feature-card-bg-2"></div>
              <div className="homeowner-feature-card-content homeowner-feature-card-content-light">
                <div className="homeowner-feature-card-badge homeowner-feature-card-badge-light">Visual Monitoring</div>
                <h3 className="homeowner-feature-card-title homeowner-feature-card-title-light">Clear Inspection Window</h3>
                <p className="homeowner-feature-card-description homeowner-feature-card-description-light">
                  See water flowing freely. Know your system is working.
                </p>
              </div>
            </div>
            
            {/* Card 3: Cost Savings */}
            <div className="homeowner-feature-card homeowner-feature-card-3">
              <div className="homeowner-feature-card-background homeowner-feature-card-bg-3"></div>
              <div className="homeowner-feature-card-overlay"></div>
              <div className="homeowner-feature-card-content">
                <div className="homeowner-feature-card-badge">Prevent Damage</div>
                <h3 className="homeowner-feature-card-title">Save Thousands in Repairs</h3>
                <p className="homeowner-feature-card-description">
                  Protect your home from $2,000-10,000+ in water damage costs.
                </p>
                <button 
                  onClick={() => navigate('/products?product=mini')}
                  className="homeowner-feature-card-cta homeowner-feature-card-cta-primary"
                >
                  Buy Now - $99.99
                </button>
              </div>
            </div>
          </div>
          
          {/* Trust Badges */}
          <div className="homeowner-features-trust-badges">
            <div className="homeowner-trust-badge-item">
              <CheckCircleIcon className="homeowner-trust-icon" />
              <span className="homeowner-trust-text">30-Day Money Back</span>
            </div>
            <div className="homeowner-trust-badge-item">
              <CheckCircleIcon className="homeowner-trust-icon" />
              <span className="homeowner-trust-text">Free Shipping</span>
            </div>
            <div className="homeowner-trust-badge-item">
              <CheckCircleIcon className="homeowner-trust-icon" />
              <span className="homeowner-trust-text">Made in USA</span>
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
          <h2 className="homeowner-problem-headline">Why Drain Line Clogs Cost Homeowners Thousands</h2>
          <p className="homeowner-problem-subheadline">
            AC condensate backups can damage drywall, trigger mold, and lead to emergency service calls. One proactive install keeps your system dry and safe.
          </p>
          
          <div className="homeowner-problem-stats">
            <div className="homeowner-stat">
              <div className="homeowner-stat-icon-wrapper">
                <ExclamationTriangleIcon className="homeowner-stat-icon" />
              </div>
              <div className="homeowner-stat-number">$12,514</div>
              <div className="homeowner-stat-label">Average water damage repair cost</div>
            </div>
            
            <div className="homeowner-stat">
              <div className="homeowner-stat-icon-wrapper">
                <BeakerIcon className="homeowner-stat-icon" />
              </div>
              <div className="homeowner-stat-number">$7,500+</div>
              <div className="homeowner-stat-label">Mold remediation can add thousands more</div>
            </div>
            
            <div className="homeowner-stat">
              <div className="homeowner-stat-icon-wrapper">
                <BuildingOfficeIcon className="homeowner-stat-icon" />
              </div>
              <div className="homeowner-stat-number">9 in 10</div>
              <div className="homeowner-stat-label">Homes with AC experience drain clogs</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="homeowner-how-it-works-container">
        <div className="homeowner-how-it-works-header">
          <h2 className="homeowner-how-it-works-title">Install Protection in 3 Easy Steps</h2>
          <p className="homeowner-how-it-works-subtitle">
            No plumber needed. No special tools required. Just 5 minutes to peace of mind.
          </p>
        </div>
        
        <div className="homeowner-how-it-works-steps">
          <div className="homeowner-step">
            <div className="homeowner-step-icon">
              <WrenchScrewdriverIcon className="homeowner-icon" />
            </div>
            <div className="homeowner-step-number">Step 1</div>
            <h3 className="homeowner-step-title">Installs in 5 Minutes or Less</h3>
            <p className="homeowner-step-description">
              Simple DIY installation. Cut your existing drain line (PVC cutter or hacksaw) and attach with Oatey PVC cement. Detailed instructions and video guide included.
            </p>
          </div>
          
          <div className="homeowner-step">
            <div className="homeowner-step-icon">
              <ShieldCheckIcon className="homeowner-icon" />
            </div>
            <div className="homeowner-step-number">Step 2</div>
            <h3 className="homeowner-step-title">Automatic Protection</h3>
            <p className="homeowner-step-description">
              AC Drain Wiz gives you a clear window into your drain line so you can spot buildup early. Patented clear-view technology lets you flush the line before biofilm turns into a clog.
            </p>
          </div>
          
          <div className="homeowner-step">
            <div className="homeowner-step-icon">
              <HomeIcon className="homeowner-icon" />
            </div>
            <div className="homeowner-step-number">Step 3</div>
            <h3 className="homeowner-step-title">Peace of Mind</h3>
            <p className="homeowner-step-description">
              Sleep better knowing your home is protected from water damage. Saves thousands in potential repairs and eliminates AC breakdowns from clogged drains.
            </p>
          </div>
        </div>
        
        <div className="homeowner-how-it-works-cta">
          <button 
            onClick={() => setIsVideoModalOpen(true)}
            className="homeowner-cta-watch-video"
          >
            Watch Full Installation Video
          </button>
        </div>
      </div>

      {/* Supporting Tools Section */}
      <div className="homeowner-supporting-tools-container">
        <div className="homeowner-supporting-tools-content">
          <div className="homeowner-supporting-tools-header">
            <h2 className="homeowner-supporting-tools-title">Clean Like a Pro: Our Recommended Transfer Pump</h2>
            <p className="homeowner-supporting-tools-subtitle">
              Pair your AC Drain Wiz Mini with proven accessories that simplify maintenance—especially when a garden hose isn’t within reach.
            </p>
          </div>

          <div className="homeowner-supporting-tools-grid">
            <div className="homeowner-supporting-tool-card">
              <div className="homeowner-supporting-tool-info">
                <div className="homeowner-supporting-tool-tag">Recommended Tool</div>
                <h3 className="homeowner-supporting-tool-name">Milwaukee M18 Transfer Pump</h3>
                <p className="homeowner-supporting-tool-description">
                  Compact, battery-powered pump that delivers up to 8 gallons per minute and 18 feet of lift. Draws clean water from a bucket and pushes it through your drain line when hose hookups are inaccessible.
                </p>
                <ul className="homeowner-supporting-tool-features">
                  <li>Runs on standard Milwaukee® M18 batteries—no cords required</li>
                  <li>Stainless steel construction built for job-site durability</li>
                  <li>Self-priming design keeps water moving fast with minimal setup</li>
                </ul>
                <button
                  className="homeowner-supporting-tool-cta"
                  onClick={() => window.open('https://www.amazon.com/DXYLYX-Milwaukee-Stainless-Electric-Portable/dp/B0BX2TVH7M/ref=sr_1_7?crid=312STP0O2ASP9&dib=eyJ2IjoiMSJ9.6QqovlXkbtC9nC4KH-E0HtJWpOH5TaTPi0vBEfk3T_POn_gzttZg-faLj0AR9s3xTOk1F8Ig4ab24lMJB9uNBdG5kNp7o41UrNAetN9BiJdyCPEIQpIbC151MVrLtH-swIfZyds1fql9vmsWZt9D5hmw17Z6NaaeKwWSaK5tZHoTP4_wjaNFZ5npTBHnPlbn7VIUpMf5JrzN6G2PdGWmq9TgFkvoOlSDQ6aTJaGp963vlt_ArzOK3ZL-SkxafEJoGIVVMyPCSegaOGBvLVWdWofg0b6m-WSkb0YMDXONsRY.eOBnmAqTtc9iOl8jVYmFDXMuXmGGN1X3ubZiFj07pgk&dib_tag=se&keywords=cordless+electric+water+transfer+pump+red&qid=1762802915&sprefix=cordless+electric+water+transfer+pump+red%2Caps%2C175&sr=8-7', '_blank', 'noopener,noreferrer')}
                >
                  Shop on Amazon
                </button>
                <p className="homeowner-supporting-tool-disclaimer">
                  AC Drain Wiz is not affiliated with Milwaukee®. We recommend this tool because it meets the performance standards our contractors rely on for fast, reliable drain flushes.
                </p>
              </div>
              <div className="homeowner-supporting-tool-media">
                <img
                  src="/images/Transfer_Pump.png"
                  alt="Milwaukee M18 Transfer Pump front view"
                  className="homeowner-supporting-tool-image homeowner-supporting-tool-image-main"
                />
                <div className="homeowner-supporting-tool-thumbs">
                  <img
                    src="/images/Transfer_Pump2.png"
                    alt="Milwaukee M18 Transfer Pump hose attachment view"
                    className="homeowner-supporting-tool-thumb"
                  />
                  <img
                    src="/images/Transfer_Pump3.png"
                    alt="Milwaukee M18 Transfer Pump in use"
                    className="homeowner-supporting-tool-thumb"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="homeowner-benefits-container">
        <h2 className="homeowner-benefits-title">Why Homeowners Choose AC Drain Wiz</h2>
        
        <div className="homeowner-benefits-grid">
          <div className="homeowner-benefit-card">
            <div className="homeowner-benefit-icon-wrapper">
              <CurrencyDollarIcon className="homeowner-benefit-icon" />
            </div>
            <h3 className="homeowner-benefit-title">Save Thousands</h3>
            <p className="homeowner-benefit-description">
              One $99.99 installation can prevent $2,000-10,000+ in water damage repairs, mold remediation, and ceiling/wall replacement.
            </p>
          </div>
          
          <div className="homeowner-benefit-card">
            <div className="homeowner-benefit-icon-wrapper">
              <WrenchIcon className="homeowner-benefit-icon" />
            </div>
            <h3 className="homeowner-benefit-title">DIY-Friendly</h3>
            <p className="homeowner-benefit-description">
              No plumber needed! Installs in 5 minutes or less with basic tools. Step-by-step instructions and video guide included with every unit.
            </p>
          </div>
          
          <div className="homeowner-benefit-card">
            <div className="homeowner-benefit-icon-wrapper">
              <LockClosedIcon className="homeowner-benefit-icon" />
            </div>
            <h3 className="homeowner-benefit-title">Set and Forget</h3>
            <p className="homeowner-benefit-description">
              Install once and forget it. No maintenance, no chemicals, no filters to replace. Works automatically 24/7 for 5+ years.
            </p>
          </div>
        </div>
      </div>

      {/* Social Proof - Testimonials Carousel */}
      <section className="mini-product-testimonials">
        <div className="mini-product-testimonials-content">
          <h2 className="mini-product-section-title">What Homeowners Say</h2>
          <p className="homeowner-testimonials-subtitle">Join 10,000+ protected homes across America</p>
          
          {/* Testimonial Carousel */}
          <div className="mini-product-testimonials-carousel">
            <div className="mini-product-testimonials-carousel-container">
              {/* Previous Button */}
              <button
                onClick={handleTestimonialPrev}
                className="mini-product-testimonials-nav-button mini-product-testimonials-nav-button-prev"
                aria-label="Previous testimonial"
              >
                <ChevronLeftIcon className="mini-product-testimonials-nav-icon" />
              </button>

              {/* Testimonial Card */}
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
                          // Fallback to placeholder if image doesn't exist
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

              {/* Next Button */}
              <button
                onClick={handleTestimonialNext}
                className="mini-product-testimonials-nav-button mini-product-testimonials-nav-button-next"
                aria-label="Next testimonial"
              >
                <ChevronRightIcon className="mini-product-testimonials-nav-icon" />
              </button>
            </div>

            {/* Carousel Indicators */}
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
        <h2 className="homeowner-faq-title">Frequently Asked Questions</h2>
        
        <div className="homeowner-faq-list">
          <details className="homeowner-faq-item">
            <summary className="homeowner-faq-question">
              Is the AC Drain Wiz Mini compatible with my AC system?
            </summary>
            <div className="homeowner-faq-answer">
              <p>
                The AC Drain Wiz Mini works with most residential AC systems that use 3/4" PVC drain lines. This covers over 95% of home air conditioning systems in North America. If you're unsure about compatibility, feel free to contact our support team with your AC model information.
              </p>
            </div>
          </details>
          
          <details className="homeowner-faq-item">
            <summary className="homeowner-faq-question">
              Do I really not need a plumber to install this?
            </summary>
            <div className="homeowner-faq-answer">
              <p>
                Correct! The AC Drain Wiz Mini is designed for DIY installation. You'll need basic tools like a PVC cutter (or hacksaw) and Oatey PVC pipe cement to cut and secure your existing drain line. The included instructions and video guide make installation straightforward. Most homeowners complete installation in 30-45 minutes. Once installed, you'll never need to cut the line again for future maintenance. If you prefer professional installation, many HVAC contractors offer installation services.
              </p>
            </div>
          </details>
          
          <details className="homeowner-faq-item">
            <summary className="homeowner-faq-question">
              How long does the AC Drain Wiz last?
            </summary>
            <div className="homeowner-faq-answer">
              <p>
                The AC Drain Wiz Mini is designed to provide maintenance-free protection for 5+ years. Many of our customers report excellent performance well beyond this timeframe. There are no filters to replace, no chemicals to add, and no maintenance required. It simply works automatically to prevent drain clogs.
              </p>
            </div>
          </details>
          
          <details className="homeowner-faq-item">
            <summary className="homeowner-faq-question">
              What if it doesn't work for my system?
            </summary>
            <div className="homeowner-faq-answer">
              <p>
                We offer a 30-day money-back guarantee. If you're not completely satisfied with the AC Drain Wiz Mini for any reason, simply contact our customer support team and we'll provide a full refund. We stand behind our product because we know it works, but we want you to feel confident in your purchase.
              </p>
            </div>
          </details>
          
          <details className="homeowner-faq-item">
            <summary className="homeowner-faq-question">
              Will this void my AC warranty?
            </summary>
            <div className="homeowner-faq-answer">
              <p>
                No! The AC Drain Wiz Mini is installed in your drain line, which is not part of your AC unit's sealed refrigeration system. Adding a drain line accessory does not affect your manufacturer's warranty. In fact, preventing water damage from clogged drains can help protect your entire HVAC investment.
              </p>
            </div>
          </details>

          <details className="homeowner-faq-item">
            <summary className="homeowner-faq-question">
              Do I need any extra tools to flush the drain line?
            </summary>
            <div className="homeowner-faq-answer">
              <p>
                You'll need a PVC pipe cutter (or hacksaw) and Oatey PVC pipe cement for installation. For ongoing maintenance, we recommend a transfer pump like the Milwaukee M18 model to push clean water through the line when a hose spigot isn't handy. It delivers up to 8 GPM, runs on cordless M18 batteries, and makes attic or crawl-space flushes quick and mess-free.
              </p>
            </div>
          </details>
        </div>
      </div>

      {/* Final CTA */}
      <div className="homeowner-final-cta-container">
        <div className="homeowner-final-cta-content">
          <h2 className="homeowner-final-cta-title">Protect Your Home Today</h2>
          <p className="homeowner-final-cta-subtitle">
            One simple installation can save you thousands in potential water damage repairs
          </p>
          
          <div className="homeowner-final-cta-buttons">
            <button 
              onClick={() => navigate('/products?product=mini')}
              className="homeowner-final-cta-primary"
            >
              Shop Now - $99.99
            </button>
            <button 
              onClick={() => navigate('/contact')}
              className="homeowner-final-cta-secondary"
            >
              Contact Support
            </button>
          </div>
          
          <div className="homeowner-final-trust-badges">
            <span className="homeowner-final-badge">✓ 30-Day Money Back Guarantee</span>
            <span className="homeowner-final-badge">✓ Free Shipping</span>
            <span className="homeowner-final-badge">✓ Made in USA</span>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="video-modal-overlay" onClick={() => setIsVideoModalOpen(false)}>
          <div className="video-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={() => setIsVideoModalOpen(false)}>
              ×
            </button>
            <div className="video-modal-content">
              <iframe
                src="https://player.vimeo.com/video/904848822?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                className="video-modal-embed"
                title="AC Drain Wiz Installation Guide"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

