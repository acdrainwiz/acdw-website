/**
 * ACDW Mini Product Landing Page
 * 
 * Apple-inspired product showcase page with:
 * - Hero section with product imagery
 * - Feature highlights
 * - Image gallery
 * - Quantity selector (1-10)
 * - Stripe checkout integration
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    CheckIcon,
    ShieldCheckIcon,
    WrenchScrewdriverIcon,
    ClockIcon,
    ArrowLeftIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    PlayIcon,
    StarIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    PhoneIcon
} from '@heroicons/react/24/outline'
import { VideoModal } from '../components/home/VideoModal'
import { SUPPORT_CONTACT } from '../config/acdwKnowledge'

export function MiniProductPage() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  // Product images for gallery (placeholder paths - update with actual images)
  //const productImages = [
  //  '/images/ACDW-Mini-Cap-blk.png', // Main product image
  //  '/images/acdw-mini-hero-background.png', // Alternative angle
  //  '/images/ACDW-Mini-Cap-blk.png', // Detail shot (placeholder)
  //]

  // Product features
  const features = [
    {
      icon: WrenchScrewdriverIcon,
      title: '5-Minute Installation',
      description: 'Quick installation with basic tools (PVC cutter or hacksaw, Oatey PVC cement). Cut once during installation, then never cut again for maintenance.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Prevents Water Damage',
      description: 'Proactive clog clearing before backups cause costly damage'
    },
    {
      icon: CheckIcon,
      title: 'Clear Visual Monitoring',
      description: 'See water flow and detect issues at a glance'
    },
    {
      icon: ClockIcon,
      title: 'Code Compliant',
      description: 'Meets IMC standards for maintenance access requirements'
    }
  ]

  // Key specifications
  const specifications = [
    { label: 'Dimensions', value: '5" × 3" × 2"' },
    { label: 'Connection Size', value: '3/4" PVC' },
    { label: 'Installation Time', value: '5 minutes or less' },
    { label: 'Material', value: 'UV-resistant clear PVC' },
    { label: 'Compatibility', value: 'Most residential AC systems' }
  ]

  // Compliance badges
  const complianceCodes = [
    'IMC 307.2.5',
    'IMC 307.2.2',
    'IMC 307.2.1.1'
  ]

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
  ]

  const handleTestimonialNext = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const handleTestimonialPrev = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleTestimonialSelect = (index: number) => {
    setCurrentTestimonial(index)
  }

  // How It Works steps
  const howItWorksSteps = [
    {
      number: 1,
      title: 'Install in 5 Minutes',
      description: 'One-time installation takes just 5 minutes. You\'ll need a PVC cutter (or hacksaw) and Oatey PVC pipe cement. Cut your drain line once during installation—then never cut again for maintenance.',
      icon: WrenchScrewdriverIcon
    },
    {
      number: 2,
      title: 'Monitor Water Flow',
      description: 'Clear body design lets you visually inspect water flow and detect issues at a glance.',
      icon: CheckIcon
    },
    {
      number: 3,
      title: 'Clear Clogs Instantly',
      description: 'When needed, access your drain line instantly—no cutting, no emergency calls.',
      icon: ClockIcon
    },
    {
      number: 4,
      title: 'Prevent Water Damage',
      description: 'Proactive maintenance prevents costly water damage and keeps your AC running smoothly.',
      icon: ShieldCheckIcon
    }
  ]

  // FAQ data
  const faqs = [
    {
      question: 'Do I need a professional to install it?',
      answer: 'No! The AC Drain Wiz Mini was designed for easy DIY installation. Most homeowners can install it themselves in just 5 minutes with standard tools. However, if you prefer professional installation, many HVAC contractors are familiar with the product.'
    },
    {
      question: 'What tools do I need for installation?',
      answer: 'You\'ll need a PVC pipe cutter (or hacksaw) to cut your existing drain line, and Oatey PVC pipe cement to secure the connections. These are standard tools available at any hardware store. Once installed, you\'ll never need to cut the line again for future maintenance.'
    },
    {
      question: 'Will this work with my AC system?',
      answer: 'The Mini is compatible with most residential AC systems that use 3/4" PVC drain lines, which is the standard size for most residential condensate lines. If you\'re unsure about your drain line size, check with your HVAC contractor or measure your existing drain line.'
    },
    {
      question: 'What if my drain line is a different size?',
      answer: 'The Mini is designed for 3/4" PVC drain lines, which covers the vast majority of residential AC systems. If your system uses a different size, please contact our support team to discuss options.'
    },
    {
      question: 'How often do I need to clean it?',
      answer: 'The frequency depends on your specific conditions, but the Mini makes maintenance so easy that many homeowners check and clean it during regular AC maintenance (typically every 3-6 months). The clear body design lets you see when cleaning is needed.'
    },
    {
      question: 'What maintenance is required?',
      answer: 'The Mini requires minimal maintenance. Simply use the access port to flush or vacuum the drain line when needed. When flushing the drain line with air, check for the presence of a P-trap in the system; after the air flush is complete, refill the P-trap with water to reestablish the required water seal. The clear body design makes it easy to see when maintenance is required, and the one-time installation means you never need to cut the line again.'
    },
    {
      question: 'What\'s the warranty?',
      answer: 'AC Drain Wiz Mini comes with a comprehensive warranty. Please check our warranty policy page for full details, or contact our support team for specific warranty information.'
    },
    {
      question: 'Can I return it if it doesn\'t fit?',
      answer: 'Yes! We offer a return policy for products that don\'t fit your specific installation. Please review our return policy or contact our support team for assistance with returns or exchanges.'
    },
    {
      question: 'Do you offer bulk pricing?',
      // Launch Button Redirect
      answer: 'Yes! We offer bulk pricing for contractors and property managers. Contact our sales team for contractor and property manager pricing.'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Most orders ship within 1–2 business days. Transit time varies by location and carrier. You\'ll receive a tracking number as soon as your order ships.'
    }
  ]


  return (
    <div className="mini-product-page">
      {/* Back Navigation */}
      <div className="mini-product-back-nav">
        <button
          onClick={() => navigate('/products')}
          className="mini-product-back-button"
        >
          <ArrowLeftIcon className="mini-product-back-icon" />
          Back to Products
        </button>
      </div>

      {/* Hero Section - Option 1: Split Layout with Full-Width Background */}
      <section className="mini-product-hero-fullwidth">
        {/* Inline Hero Image */}
        <div className="mini-product-hero-image-container">
          <img
            src="/images/acdw-mini-hero1-background.png"
            alt="AC Drain Wiz Mini"
            className="mini-product-hero-image"
          />
        </div>
        
        {/* Content Overlay */}
        <div className="mini-product-hero-overlay">
          <div className="mini-product-hero-content-wrapper">
            {/* Left Side - Product Info */}
            <div className="mini-product-hero-info">
              <h1 className="mini-product-hero-title">
                Stop Water Damage Before It Starts
              </h1>
              <p className="mini-product-hero-subtitle">
                AC drain clogs cause thousands in water damage. The Mini gives you instant access to clear blockages in 5 minutes—no cutting required for maintenance, no mess, no emergency calls.
              </p>
              <div className="mini-product-hero-trust-metric">
                <span className="mini-product-hero-trust-text">Trusted by homeowners & AC contractors nationwide</span>
              </div>
            </div>

                      {/* Right Side - Purchase Card */}
                      <div className="mini-product-purchase-card-hero">
                          <div className="mini-product-purchase-card-content">
                              <h2 className="sensor-product-purchase-title">Get Started</h2>

                              <div className="sensor-product-purchase-cta-section">
                                  <p className="sensor-product-purchase-message">
                                      Contact us for pricing and availability. Professional contractors receive special bulk pricing.
                                  </p>

                                  {/* Mobile: Clickable phone button */}
                                  <a href={SUPPORT_CONTACT.telHref} className="sensor-product-purchase-button-primary md:hidden">

                                  Call {SUPPORT_CONTACT.phoneDisplay}
                              </a>

                              {/* Desktop: Phone badge (non-clickable) */}
                              <div className="sensor-product-phone-badge hidden md:flex">
                                  <PhoneIcon className="sensor-product-phone-badge-icon" />
                                  <div className="sensor-product-phone-badge-text">
                                      <div className="sensor-product-phone-vanity">{SUPPORT_CONTACT.phoneDisplay}</div>
                                      <div className="sensor-product-phone-numeric">{SUPPORT_CONTACT.phoneNumeric}</div>
                                  </div>
                              </div>

                              {/* Contact Sales Button */}
                              <button
                                  onClick={() => navigate('/contact?type=sales')}
                                  className="sensor-product-purchase-button-secondary"
                              >
                                  Contact Sales
                              </button>
                          </div>

                          {/* Trust Badges */}
                          <div className="sensor-product-trust-section-inline">
                              <div className="sensor-product-trust-badge">
                                  <ShieldCheckIcon className="sensor-product-trust-icon" />
                                  <span>2-year warranty</span>
                              </div>
                              <div className="sensor-product-trust-badge">
                                  <CheckIcon className="sensor-product-trust-icon" />
                                  <span>Fast shipping</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="product-how-it-works">
        <div className="product-how-it-works-content">
          <h2 className="product-section-title">How It Works</h2>
          <p className="product-how-it-works-subtitle">
            Get instant access to your AC drain line in four simple steps
          </p>
          
          <div className="mini-product-how-it-works-steps">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="mini-product-how-it-works-step">
                <div className="mini-product-how-it-works-step-number">
                  {step.number}
                </div>
                <div className="mini-product-how-it-works-step-content">
                  <step.icon className="product-how-it-works-step-icon" />
                  <h3 className="product-how-it-works-step-title">{step.title}</h3>
                  <p className="product-how-it-works-step-description">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Installation Video Placeholder */}
                  <div className="product-installation-video">
                      <div
                          className="product-installation-video-placeholder"
                          onClick={() => setIsVideoModalOpen(true)}
                      >
                          <div className="product-installation-video-placeholder-content">
                              <PlayIcon className="product-installation-video-play-icon" />
                              <h3 className="product-installation-video-title">Watch Installation Video</h3>
                              <p className="product-installation-video-description">
                                  See how easy it is to install the AC Drain Wiz Mini in just 5 minutes
                              </p>
                          </div>
                      </div>
                  </div>        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mini-product-testimonials">
        <div className="mini-product-testimonials-content">
          <h2 className="product-section-title">Customers Love the AC Drain Wiz Mini</h2>
          
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
                          const target = e.target as HTMLImageElement
                          target.src = '/images/testimonials/placeholder.jpg'
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

      {/* Quick Features Section */}
      <section className="mini-product-features">
        <div className="mini-product-features-content">
          <h2 className="product-section-title">Why Choose AC Drain Wiz Mini</h2>
          <div className="mini-product-features-grid">
            {features.map((feature, index) => (
              <div key={index} className="mini-product-feature-card">
                <feature.icon className="mini-product-feature-icon" />
                <h3 className="mini-product-feature-title">{feature.title}</h3>
                <p className="mini-product-feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Specifications Section */}
      <section className="product-specs">
        <div className="product-specs-content">
          <h2 className="product-section-title">Specifications</h2>
          <div className="product-specs-grid">
            {specifications.map((spec, index) => (
              <div key={index} className="product-spec-item">
                <span className="product-spec-label">{spec.label}</span>
                <span className="product-spec-value">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="product-compliance">
        <div className="product-compliance-content">
          <h2 className="product-section-title">Code Compliant</h2>
          <p className="product-compliance-description">
            AC Drain Wiz Mini meets International Mechanical Code (IMC) standards and is approved 
            for use in municipalities nationwide.
          </p>
          <div className="product-compliance-badges">
            {complianceCodes.map((code, index) => (
              <div key={index} className="product-compliance-badge">
                {code}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="product-faq">
        <div className="product-faq-content">
          <h2 className="product-section-title">Frequently Asked Questions</h2>
          <div className="product-faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="product-faq-item">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="product-faq-question"
                  aria-expanded={openFaq === index}
                >
                  <span>{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUpIcon className="product-faq-icon" />
                  ) : (
                    <ChevronDownIcon className="product-faq-icon" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="product-faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="product-faq-subtitle">
            Have questions? We've got answers. Can't find what you're looking for?{' '}
            <button
              onClick={() => navigate('/contact?type=support')}
              className="product-faq-contact-link"
            >
              Contact our support team
            </button>
          </p>
        </div>
          </section>



      {/* Image Gallery Section */}
          {/* <section className="mini-product-gallery">
        <div className="mini-product-gallery-content">
          <h2 className="product-section-title">See It In Action</h2>
          <div className="mini-product-gallery-grid">
            {productImages.map((image, index) => (
              <div
                key={index}
                className="mini-product-gallery-item"
              >
                <img
                  src={image}
                  alt={`AC Drain Wiz Mini - View ${index + 1}`}
                  className="mini-product-gallery-image"
                />
              </div>
            ))}
          </div>
        </div>
      </section> */}

          {/* Video Modal */}
          <VideoModal
              isOpen={isVideoModalOpen}
              onClose={() => setIsVideoModalOpen(false)}
          />
    </div>
  )
}

