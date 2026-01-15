import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { IMaskInput } from 'react-imask'
import { ArrowRightIcon, ChevronDownIcon, ChevronUpIcon, GiftIcon, CheckIcon, StarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../contexts/AuthContext'
import { VideoModal } from './VideoModal'
import { CustomerTypeSelector } from './CustomerTypeSelector'
import { isValidEmail } from '../../utils/emailValidation'
import { useRecaptcha } from '../../hooks/useRecaptcha'

export function Hero() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { getRecaptchaToken } = useRecaptcha()
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
  const [photoFileError, setPhotoFileError] = useState<string>('')
  const [toastMessage, setToastMessage] = useState<string>('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isUpgradeFormSubmitted, setIsUpgradeFormSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  
  // Check if user is a contractor
  const isContractor = isAuthenticated && user?.role === 'hvac_pro'

  // Testimonials from Mini Product Page
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

  const handleTestimonialPrev = () => {
    setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  const handleTestimonialNext = () => {
    setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  const handleTestimonialSelect = (index: number) => {
    setCurrentTestimonial(index)
  }

  // Toast notification function
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToastMessage('')
    }, 5000)
  }
  
  // Refs for sections that should change background on scroll
  const howItWorksRef = useRef<HTMLDivElement>(null)
  const productShowcaseRef = useRef<HTMLDivElement>(null)
  const benefitsRef = useRef<HTMLDivElement>(null)
  const comparisonRef = useRef<HTMLDivElement>(null)
  const proofStackRef = useRef<HTMLDivElement>(null)
  const techSpecsRef = useRef<HTMLDivElement>(null)
  const riskReversalRef = useRef<HTMLDivElement>(null)
  const socialProofRef = useRef<HTMLDivElement>(null)
  const faqRef = useRef<HTMLDivElement>(null)
  const ctaBandsRef = useRef<HTMLDivElement>(null)
  const heritageRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for scroll-based background changes
  // Similar to Google Home's approach: sections change background when prominently in viewport
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px', // Activate when section is in center 60% of viewport
      threshold: [0, 0.25, 0.5, 0.75, 1.0] // Multiple thresholds for smoother transitions
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        // Add active class when section is prominently in viewport (at least 25% visible in center)
        // This mimics Google Home's smooth background transitions
        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
          entry.target.classList.add('section-active')
        } else {
          entry.target.classList.remove('section-active')
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    const sections = [
      howItWorksRef.current,
      productShowcaseRef.current,
      benefitsRef.current,
      comparisonRef.current,
      proofStackRef.current,
      techSpecsRef.current,
      riskReversalRef.current,
      socialProofRef.current,
      faqRef.current,
      ctaBandsRef.current,
      heritageRef.current
    ].filter(Boolean) as HTMLDivElement[]

    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [])

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqs = [
    {
      question: "What causes AC drain line clogs?",
      answer: "The most common causes include algae growth, dirt and debris, mold buildup, and mineral deposits from hard water. AC Drain Wiz prevents these clogs through proactive cleaning before they become blockages."
    },
    {
      question: "Can I install AC Drain Wiz myself?",
      answer: "Yes! Most homeowners complete installation in 5 minutes or less using basic tools. We provide step-by-step guides, installation videos, and free support if you get stuck."
    },
    {
      question: "Will AC Drain Wiz work with my existing AC system?",
      answer: "AC Drain Wiz works with standard 3/4\" PVC drain lines used in most residential and light commercial systems. If your system uses a different size, contact us for guidance."
    },
    {
      question: "What's the difference between Mini and Sensor?",
      answer: "Mini is our flagship compact solution for proactive drain line cleaning—available for direct purchase by homeowners. Sensor adds smart monitoring and 24/7 alerts, but is available through authorized HVAC contractors only. See our product comparison table above for details."
    },
    {
      question: "Can homeowners purchase the Sensor?",
      // Launch Button Redirect
      answer: "The Sensor is available through authorized HVAC contractors only. If you're interested in Sensor installation, contact us and we'll connect you with a local HVAC professional. Contractors can contact us for pricing and purchasing details."
    },
    {
      question: "Do I need both Mini and Sensor, or can I use them separately?",
      answer: "Each product works independently, but they're designed to work together for maximum protection. Mini handles proactive cleaning; Sensor adds 24/7 monitoring. You can start with Mini and add Sensor later through an authorized contractor."
    },
    {
      question: "How often do I need to clean my drain line with AC Drain Wiz?",
      answer: "We recommend checking your drain line every 3-6 months. If you have the Sensor, it will alert you when maintenance is needed. The Mini's bayonet port makes cleaning quick and mess-free."
    },
    {
      question: "What kind of warranty do you offer?",
      answer: "All AC Drain Wiz products come with our satisfaction guarantee and industry-leading warranty. See our warranty section above for full details."
    },
    {
      question: "Do you offer professional contractor pricing?",
      // Launch Button Redirect
      answer: "Yes! HVAC professionals and contractors qualify for special bulk pricing and support. Contact us at (561) 654-5237 or use our contact form to request contractor pricing."
    },
    {
      question: "Is AC Drain Wiz approved by building inspectors and code officials?",
      answer: "AC Drain Wiz meets International Mechanical Code (IMC) standards and is approved for use in municipalities nationwide. We provide compliance documentation for inspectors."
    },
    {
      question: "What happened to Core 1.0?",
      answer: "Core 1.0 was our foundation product that pioneered the AC drain line maintenance category. It's now deprecated in favor of the more compact and versatile Mini. Existing Core 1.0 customers continue to receive full support. Contact us if you need replacement parts or have questions about your Core 1.0 installation."
    },
    {
      question: "What if I'm not satisfied with my purchase?",
      answer: "We offer a 60-day satisfaction guarantee with full refund, no questions asked. See our return policy section above for details."
    }
  ]

  return (
    <>
      {/* Promo Banner - Special offer for homeowners */}
      <div className="homeowner-banner">
        <div className="homeowner-banner-content">
          <span className="homeowner-banner-text">
            <strong>Limited Time:</strong> Join Our Email List and Get <strong>Up To 50% Off</strong> Your First AC Drain Wiz Mini Purchase
          </span>
          <button 
            onClick={() => navigate('/promo')}
            className="homeowner-banner-cta"
          >
            Get Discount Code
            <ArrowRightIcon className="homeowner-banner-icon" />
          </button>
        </div>
      </div>

      {/* Hero Section - Mini Focus */}
      <div className="hero-main-container">
        {/* Background Image for Mini */}
        <div className="hero-background-image">
          {/* Product image will be added as background */}
        </div>
        
        <div className="hero-content-wrapper">
          {/* Hero Header */}
          <div className="hero-header-section">
            <h1 className="hero-main-heading">
              Prevent AC Drain Line Clogs And{' '}
              <span className="hero-brand-highlight">Expensive Water Damage</span>
            </h1>
            
            <h2 className="hero-subtitle">
              STAY COOL WHEN <br className="hero-subtitle-mobile-break" /><em>THE <strong style={{ color: 'red' }}>HEAT</strong> IS ON!</em>
            </h2>
            
            <div className="hero-cta-buttons">
              <button 
                onClick={() => navigate('/products/mini')}
                className="hero-primary-button"
              >
                Product Details
                <ArrowRightIcon className="hero-button-icon" />
              </button>
              
              <button 
                disabled
                className="hero-secondary-button hero-secondary-button-disabled"
              >
                <span className="hero-secondary-button-badge">Video Coming Soon</span>
              </button>
            </div>
            
            <p className="hero-description-text">
              Keep your AC running smoothly with the AC Drain Wiz™ Mini
            </p>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="trust-section-container">
        <div className="trust-section-content">
          <div className="trust-badge">
            <img 
              src="/images/100-seal-595x554.png" 
              alt="100% Customer Satisfaction Guaranteed" 
              className="trust-badge-image"
            />
          </div>
          
          <div className="trust-main-text">
            <h2 className="trust-title">Trusted By Homeowners & AC Contractors Nationwide</h2>
          </div>
          
          <div className="trust-badge">
            <img 
              src="/images/Made-in-USA-logo-transparent.png" 
              alt="Made in USA" 
              className="trust-badge-image"
            />
          </div>
        </div>
      </div>

      {/* Customer Type Selector */}
      <CustomerTypeSelector />

      {/* Product Showcase Section */}
      <div ref={productShowcaseRef} className="product-showcase-container">
        <div className="product-showcase-header">
          <h2 className="product-showcase-title">Code Mandated Float Switch Replacement</h2>
          <p className="product-showcase-subtitle">
            Smart monitoring and complete protection systems designed for HVAC professionals. Boost efficiency and deliver premium service to your customers.
          </p>
        </div>
      </div>

      {/* Sensor Card - Full Width, Contractor Only */}
      <div className="product-showcase-card product-showcase-card-sensor product-showcase-card-full-width">
        <div className="product-showcase-card-background">
          {/* Sensor product image background */}
        </div>
        
        <div className="product-showcase-card-content">
          <div className="product-showcase-card-header">
            <h3 className="product-showcase-card-title">ACDW Sensor</h3>
            <span className="product-showcase-card-status available">Contractor Only</span>
          </div>
          
          <h4 className="product-showcase-card-headline">Smart. Monitoring.</h4>
          
          <p className="product-showcase-card-description">
            Revolutionary no-contact sensing technology that prevents problems before they happen. Get 24/7 alerts before overflow starts. Available exclusively to HVAC contractors—help your customers protect their homes while growing your service offerings.
          </p>
          
          <div className="product-showcase-card-ctas">
            {isContractor ? (
              <>
                {/* Launch Button Redirect */}
                <button 
                  onClick={() => navigate('/products/sensor')}
                  className="product-showcase-card-cta-primary"
                >
                  Learn More
                </button>
                {/* Launch Button Redirect */}
                <a 
                  href="tel:+15616545237"
                  className="product-showcase-card-cta-secondary"
                >
                  Call (561) 654-5237
                </a>
              </>
            ) : (
              <>
                {/* Non-contractors: Information-first approach - learn about product first */}
                <button 
                  onClick={() => navigate('/products/sensor')}
                  className="product-showcase-card-cta-primary"
                >
                  Learn More
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Separator Between Cards */}
      <div className="product-showcase-separator">
        <div className="product-showcase-separator-content">
          <h3 className="product-showcase-separator-title">Complete Protection System</h3>
          <p className="product-showcase-separator-subtitle">
            Combine both products for maximum customer satisfaction and increased service value
          </p>
        </div>
      </div>

      {/* Mini + Sensor Combined Card - Full Width */}
      <div className="product-showcase-card product-showcase-card-mini product-showcase-card-full-width">
        <div className="product-showcase-card-background">
          {/* HVAC tech with Mini and Sensor products */}
        </div>
        
        <div className="product-showcase-card-content">
          <div className="product-showcase-card-header">
            <h3 className="product-showcase-card-title">Maximum Protection</h3>
            <span className="product-showcase-card-status">Mini + Sensor</span>
          </div>
          
          <h4 className="product-showcase-card-headline">Complete AC Protection System</h4>
          
          <p className="product-showcase-card-description">
            Combine the Mini's proactive cleaning with the Sensor's smart monitoring for maximum protection. The ultimate solution for HVAC contractors looking to offer premium maintenance packages. Reduce callbacks, increase customer satisfaction, and differentiate your services.
          </p>
          
          <div className="product-showcase-card-ctas">
            {isContractor ? (
              <>
                {/* Launch Button Redirect */}
                <button 
                  onClick={() => navigate('/products/combo')}
                  className="product-showcase-card-cta-primary"
                >
                  View Complete System
                </button>
                {/* Launch Button Redirect */}
                <a 
                  href="tel:+15616545237"
                  className="product-showcase-card-cta-secondary"
                >
                  Call (561) 654-5237
                </a>
              </>
            ) : (
              <>
                {/* Non-contractors: Information-first approach - learn about complete system first */}
                <button 
                  onClick={() => navigate('/products/combo')}
                  className="product-showcase-card-cta-primary"
                >
                  View Complete System
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div ref={howItWorksRef} className="how-it-works-container">
        <div className="how-it-works-content">
          <div className="how-it-works-header">
            <h2 className="how-it-works-title">Install Once, Clean Anytime</h2>
            <p className="how-it-works-subtitle">Three simple steps to worry-free AC maintenance</p>
          </div>
          
          <div className="how-it-works-steps">
            <div className="how-it-works-step">
              <div className="how-it-works-step-icon">
                <svg className="how-it-works-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="how-it-works-step-title">Install</h3>
              <p className="how-it-works-step-description">
                Cut your existing drain line, solvent-weld AC Drain Wiz in place (5 minutes or less). Works with 3/4" PVC drain lines.
              </p>
            </div>
            
            <div className="how-it-works-step">
              <div className="how-it-works-step-icon">
                <svg className="how-it-works-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="how-it-works-step-title">Clean</h3>
              <p className="how-it-works-step-description">
                When it's time for maintenance, snap in your preferred attachment: air, water, or vacuum. Bayonet mount ensures perfect seal every time.
              </p>
            </div>
            
            <div className="how-it-works-step">
              <div className="how-it-works-step-icon">
                <svg className="how-it-works-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="how-it-works-step-title">Monitor</h3>
              <p className="how-it-works-step-description">
                Add AC Drain Wiz Sensor for 24/7 monitoring and automated alerts. Get SMS/email alerts before overflow happens.
              </p>
            </div>
          </div>
          
          <div className="how-it-works-ctas">
            <button 
              onClick={() => setIsVideoModalOpen(true)}
              className="how-it-works-cta-primary"
            >
              Watch Installation Video
            </button>
            <button 
              onClick={() => navigate('/products')}
              className="how-it-works-cta-secondary"
            >
              Download Guide
            </button>
          </div>
        </div>
      </div>

          {/* Why Choose AC Drain Wiz Section */}
      <div ref={benefitsRef} className="benefits-section-container">
        <div className="benefits-section-content">
          <h2 className="benefits-section-title">Why Choose AC Drain Wiz</h2>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="benefit-title">IMC Code Compliant</h3>
              <p className="benefit-description">Professional-grade solution meeting International Mechanical Code standards for reliable, safe operation.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="benefit-title">5-Minute Installation</h3>
              <p className="benefit-description">Get up and running fast with our simple installation process that takes 5 minutes or less to complete.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="benefit-title">Prevent Water Damage</h3>
              <p className="benefit-description">Protect your home from costly water damage by keeping your AC drain lines clean and clog-free year-round.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="benefit-title">Made in USA</h3>
              <p className="benefit-description">Quality you can trust with products manufactured right here in the United States using premium materials.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Comparison Section */}
      <div ref={comparisonRef} className="product-comparison-container">
        <div className="product-comparison-content">
          <div className="product-comparison-header">
            <h2 className="product-comparison-title">Find Your Perfect AC Drain Solution</h2>
            <p className="product-comparison-subtitle">Compare features, prices, and use cases</p>
          </div>

          {/* Desktop Table */}
          <div className="product-comparison-table-wrapper hidden md:block">
            <table className="product-comparison-table">
              <thead>
                <tr>
                  <th className="product-comparison-th sticky left-0 z-10">Feature</th>
                  <th className="product-comparison-th">
                    <div className="product-comparison-product-header">
                      <div className="font-bold text-lg">Mini</div>
                      <div className="text-sm text-blue-600">Most Popular</div>
                    </div>
                  </th>
                  <th className="product-comparison-th">
                    <div className="product-comparison-product-header">
                      <div className="font-bold text-lg">Sensor</div>
                      <div className="text-sm text-orange-600 font-semibold">Contractor Only</div>
                    </div>
                  </th>
                  <th className="product-comparison-th">
                    <div className="product-comparison-product-header">
                      <div className="font-bold text-lg">Mini + Sensor</div>
                      <div className="text-sm text-purple-600 font-semibold">Complete System</div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="product-comparison-td sticky left-0 bg-white">Status</td>
                  <td className="product-comparison-td"><span className="text-green-600 font-semibold">Available Now</span></td>
                  <td className="product-comparison-td">
                    <span className="text-green-600 font-semibold">Available Now</span>
                    <span className="ml-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">Contractor Only</span>
                  </td>
                  <td className="product-comparison-td">
                    <span className="text-green-600 font-semibold">Available Now</span>
                    <span className="ml-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">Contractor Only</span>
                  </td>
                </tr>
                <tr>
                  <td className="product-comparison-td sticky left-0 bg-white">Best For</td>
                  <td className="product-comparison-td">Space-constrained, all-in-one</td>
                  <td className="product-comparison-td">Early warning, existing setups</td>
                  <td className="product-comparison-td">Maximum protection & monitoring</td>
                </tr>
                <tr>
                  <td className="product-comparison-td sticky left-0 bg-white">Size</td>
                  <td className="product-comparison-td">5" × 3" × 2"</td>
                  <td className="product-comparison-td">2" × 3" × 1.5"</td>
                  <td className="product-comparison-td">5" × 3" × 2" (Mini) + Sensor</td>
                </tr>
                <tr>
                  <td className="product-comparison-td sticky left-0 bg-white">Installation</td>
                  <td className="product-comparison-td">5 min</td>
                  <td className="product-comparison-td">15 min</td>
                  <td className="product-comparison-td">45 min total</td>
                </tr>
                <tr>
                  <td className="product-comparison-td sticky left-0 bg-white">Key Benefit</td>
                  <td className="product-comparison-td">Compact versatility</td>
                  <td className="product-comparison-td">Smart monitoring</td>
                  <td className="product-comparison-td">Complete protection system</td>
                </tr>
                <tr>
                  <td className="product-comparison-td sticky left-0 bg-white">Price (MSRP)</td>
                  <td className="product-comparison-td font-bold text-lg">$99.99</td>
                  {/* Launch Button Redirect */}
                  <td className="product-comparison-td text-sm text-gray-600 italic">Contact us for pricing</td>
                  {/* Launch Button Redirect */}
                  <td className="product-comparison-td text-sm text-gray-600 italic">Contact us for pricing</td>
                </tr>
                <tr>
                  <td className="product-comparison-td sticky left-0 bg-white">Monitoring</td>
                  <td className="product-comparison-td">Manual inspection</td>
                  <td className="product-comparison-td">24/7 smart alerts</td>
                  <td className="product-comparison-td">24/7 smart alerts + manual access</td>
                </tr>
                <tr>
                  <td className="product-comparison-td sticky left-0 bg-white">Compatibility</td>
                  <td className="product-comparison-td">3/4" PVC</td>
                  <td className="product-comparison-td">Bayonet mount accessory</td>
                  <td className="product-comparison-td">3/4" PVC + Mini integration</td>
                </tr>
                <tr className="product-comparison-action-row">
                  <td className="product-comparison-td sticky left-0 bg-white"></td>
                  <td className="product-comparison-td">
                    <button onClick={() => navigate('/products/mini')} className="product-comparison-btn-primary">
                      Learn More
                    </button>
                  </td>
                  <td className="product-comparison-td">
                    <button onClick={() => navigate('/products/sensor')} className="product-comparison-btn-primary">
                      Learn More
                    </button>
                  </td>
                  <td className="product-comparison-td">
                    <button onClick={() => navigate('/products/combo')} className="product-comparison-btn-primary">
                      Learn More
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="product-comparison-mobile md:hidden">
            {/* Mini Card */}
            <div className="product-comparison-mobile-card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Mini</h3>
                  <span className="text-sm text-blue-600">Most Popular</span>
                </div>
                <button onClick={() => navigate('/products/mini')} className="product-comparison-btn-primary">
                  Learn More
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="font-medium">Status:</span> <span className="text-green-600">Available Now</span></div>
                <div className="flex justify-between"><span className="font-medium">Price:</span> <span className="font-bold">$99.99</span></div>
                <div className="flex justify-between"><span className="font-medium">Size:</span> <span>5" × 3" × 2"</span></div>
                <div className="flex justify-between"><span className="font-medium">Best For:</span> <span className="text-right">Space-constrained</span></div>
              </div>
            </div>

            {/* Sensor Card */}
            <div className="product-comparison-mobile-card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Sensor</h3>
                  <span className="text-sm text-orange-600 font-semibold">Contractor Only</span>
                </div>
                <button onClick={() => navigate('/products/sensor')} className="product-comparison-btn-primary">
                  Learn More
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="font-medium">Status:</span> <span className="text-green-600">Available Now</span></div>
                {/* Launch Button Redirect */}
                <div className="flex justify-between"><span className="font-medium">Price:</span> <span className="text-gray-600 italic">Contact us for pricing</span></div>
                <div className="flex justify-between"><span className="font-medium">Size:</span> <span>2" × 3" × 1.5"</span></div>
                <div className="flex justify-between"><span className="font-medium">Best For:</span> <span className="text-right">Early warning</span></div>
              </div>
            </div>

            {/* Mini + Sensor Combo Card */}
            <div className="product-comparison-mobile-card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Mini + Sensor</h3>
                  <span className="text-sm text-purple-600 font-semibold">Complete System</span>
                </div>
                <button onClick={() => navigate('/products/combo')} className="product-comparison-btn-primary">
                  Learn More
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="font-medium">Status:</span> <span className="text-green-600">Available Now</span></div>
                {/* Launch Button Redirect */}
                <div className="flex justify-between"><span className="font-medium">Price:</span> <span className="text-gray-600 italic text-xs">Contact us for pricing</span></div>
                <div className="flex justify-between"><span className="font-medium">Size:</span> <span>5" × 3" × 2" + Sensor</span></div>
                <div className="flex justify-between"><span className="font-medium">Best For:</span> <span className="text-right">Maximum protection</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proof Stack Section - Testimonials */}
      <div ref={proofStackRef} className="proof-stack-container">
        <div className="proof-stack-content">
          <div className="proof-stack-header">
            <h2 className="proof-stack-title">Trusted by the Pros, Designed for Everyone</h2>
          </div>

          {/* Testimonials Carousel */}
          <div className="proof-stack-testimonials">
            <h3 className="proof-stack-testimonials-title">What Our Customers Say</h3>
            
            {/* Testimonial Carousel */}
            <div className="proof-stack-testimonials-carousel">
              <div className="proof-stack-testimonials-carousel-container">
                {/* Previous Button */}
                <button
                  onClick={handleTestimonialPrev}
                  className="proof-stack-testimonials-nav-button proof-stack-testimonials-nav-button-prev"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeftIcon className="proof-stack-testimonials-nav-icon" />
                </button>

                {/* Testimonial Card */}
                <div className="proof-stack-testimonials-carousel-card-wrapper">
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={index}
                      className={`proof-stack-testimonial-card ${
                        index === currentTestimonial ? 'proof-stack-testimonial-card-active' : 'proof-stack-testimonial-card-hidden'
                      }`}
                    >
                      <div className="proof-stack-testimonial-image-wrapper">
                        <img
                          src={testimonial.image}
                          alt={`${testimonial.name}, ${testimonial.role}`}
                          className="proof-stack-testimonial-image"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = '/images/testimonials/placeholder.jpg'
                          }}
                        />
                      </div>
                      <div className="proof-stack-testimonial-content">
                        <div className="proof-stack-testimonial-rating">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <StarIcon key={i} className="proof-stack-testimonial-star" />
                          ))}
                        </div>
                        <p className="proof-stack-testimonial-text">"{testimonial.text}"</p>
                        <div className="proof-stack-testimonial-author">
                          <span className="proof-stack-testimonial-name">{testimonial.name}</span>
                          <span className="proof-stack-testimonial-role">{testimonial.role}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleTestimonialNext}
                  className="proof-stack-testimonials-nav-button proof-stack-testimonials-nav-button-next"
                  aria-label="Next testimonial"
                >
                  <ChevronRightIcon className="proof-stack-testimonials-nav-icon" />
                </button>
              </div>

              {/* Carousel Indicators */}
              <div className="proof-stack-testimonials-indicators">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleTestimonialSelect(index)}
                    className={`proof-stack-testimonials-indicator ${
                      index === currentTestimonial ? 'proof-stack-testimonials-indicator-active' : ''
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Specs / Compatibility Strip */}
      <div ref={techSpecsRef} className="tech-specs-container">
        <div className="tech-specs-content">
          <div className="tech-specs-header">
            <h2 className="tech-specs-title">Compatibility & Technical Specifications</h2>
          </div>
          
          <div className="tech-specs-grid">
            <div className="tech-spec-item">
              <svg className="tech-spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="tech-spec-text">Fits standard 3/4" PVC drain lines</span>
            </div>
            
            <div className="tech-spec-item">
              <svg className="tech-spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="tech-spec-text">Works with residential and commercial systems</span>
            </div>
            
            <div className="tech-spec-item">
              <svg className="tech-spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="tech-spec-text">Compatible with transfer pumps</span>
            </div>
            
            <div className="tech-spec-item">
              <svg className="tech-spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="tech-spec-text">Operating range: -40°F to 200°F</span>
            </div>
            
            <div className="tech-spec-item">
              <svg className="tech-spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="tech-spec-text">Pressure rated to 100 PSI</span>
            </div>
            
            <div className="tech-spec-item">
              <svg className="tech-spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="tech-spec-text">No electrical connection required</span>
            </div>
          </div>
          
          <div className="tech-specs-footer">
            <p className="tech-specs-footer-text">
              Not sure if it works with your system? 
              <button onClick={() => navigate('/contact')} className="tech-specs-footer-link">
                See full specifications →
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Risk-Reversal Section */}
      <div ref={riskReversalRef} className="risk-reversal-container">
        <div className="risk-reversal-content">
          <div className="risk-reversal-header">
            <h2 className="risk-reversal-title">We Stand Behind Every Product</h2>
          </div>

          <div className="risk-reversal-grid">
            {/* Warranty Card */}
            <div className="risk-reversal-card">
              <div className="risk-reversal-card-icon">
                <svg className="risk-reversal-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="risk-reversal-card-title">100% Satisfaction Guaranteed</h3>
              <p className="risk-reversal-card-description">
                If you're not satisfied with your AC Drain Wiz within 60 days, we'll refund your full purchase price—no questions asked. Plus, all products come with our industry-leading warranty.
              </p>
              <button onClick={() => navigate('/support#warranty-returns')} className="risk-reversal-card-link">
                See full warranty terms →
              </button>
            </div>

            {/* Support Card */}
            <div className="risk-reversal-card">
              <div className="risk-reversal-card-icon">
                <svg className="risk-reversal-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="risk-reversal-card-title">Expert Installation Support</h3>
              <p className="risk-reversal-card-description">
                Not a DIYer? We offer free installation guidance via phone, email, and live chat. Our team helps thousands of homeowners every year. Average response time: under 2 hours.
              </p>
              <button onClick={() => navigate('/support#contact')} className="risk-reversal-card-link">
                View support hours →
              </button>
            </div>

            {/* Returns Card */}
            <div className="risk-reversal-card">
              <div className="risk-reversal-card-icon">
                <svg className="risk-reversal-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="risk-reversal-card-title">Hassle-Free Returns</h3>
              <p className="risk-reversal-card-description">
                Changed your mind? Return any unused product within 60 days for a full refund. We'll even cover return shipping within the continental US.
              </p>
              <button onClick={() => navigate('/support#warranty-returns')} className="risk-reversal-card-link">
                View return policy →
              </button>
            </div>
          </div>

          <div className="risk-reversal-footer">
            <p className="risk-reversal-footer-text">
              Still have questions? Call us at <a href="tel:+15616545237" className="risk-reversal-footer-link">(561) 654-5237</a> or chat live with our team.
            </p>
          </div>
        </div>
      </div>

      {/* Social Proof Section - Trusted Partners */}
      <div ref={socialProofRef} className="social-proof-container">
        <div className="social-proof-content">
          <div className="social-proof-header">
            <h2 className="social-proof-title">Trusted Partners & Press Coverage</h2>
          </div>

          <div className="social-proof-grid">
            {/* Partner Placeholder */}
            <div className="social-proof-logo">
              <div className="social-proof-placeholder-logo">
                <svg className="social-proof-placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="social-proof-placeholder-text">Johnson Supply</p>
              </div>
            </div>

            {/* Partner Placeholder */}
            <div className="social-proof-logo">
              <div className="social-proof-placeholder-logo">
                <svg className="social-proof-placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="social-proof-placeholder-text">Ferguson Enterprises</p>
              </div>
            </div>

            {/* Partner Placeholder */}
            <div className="social-proof-logo">
              <div className="social-proof-placeholder-logo">
                <svg className="social-proof-placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="social-proof-placeholder-text">M&A Supply Co.</p>
              </div>
            </div>
          </div>

          <div className="social-proof-footer">
            <p className="social-proof-footer-text">
              Featured in leading HVAC trade publications and recommended by inspectors nationwide.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div ref={faqRef} className="faq-container">
        <div className="faq-content">
          <div className="faq-header">
            <h2 className="faq-title">Frequently Asked Questions</h2>
            <p className="faq-subtitle">Get answers to the most common questions about AC Drain Wiz</p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button
                  onClick={() => toggleFaq(index)}
                  className="faq-question"
                >
                  <span className="faq-question-text">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUpIcon className="faq-chevron" />
                  ) : (
                    <ChevronDownIcon className="faq-chevron" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="faq-footer">
            <p className="faq-footer-text">
              Still have questions? 
              <button onClick={() => navigate('/contact')} className="faq-footer-link">
                Contact Support →
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Secondary CTA Bands */}
      <div ref={ctaBandsRef} className="cta-bands-container">
        {/* Talk to Sales CTA - For Pros */}
        <div className="cta-band-sales">
          <div className="cta-band-content">
            <div className="cta-band-text">
              <h3 className="cta-band-title">Looking for Bulk Pricing or Professional Support?</h3>
              <p className="cta-band-description">
                Get custom pricing for your business, access technical resources, and join our contractor partner program. Schedule a 15-minute call with our team.
              </p>
            </div>
            <div className="cta-band-buttons">
              {/* Launch Button Redirect */}
              <button onClick={() => navigate('/contact?type=sales')} className="cta-band-btn-primary">
                Schedule Sales Call
              </button>
              {/* Launch Button Redirect */}
              <a href="tel:+15616545237" className="cta-band-btn-secondary">
                Call (561) 654-5237
              </a>
            </div>
          </div>
        </div>

        {/* Find a Contractor CTA - For Homeowners */}
        <div className="cta-band-contractor">
          <div className="cta-band-content">
            <div className="cta-band-text">
              <h3 className="cta-band-title">Prefer Professional Installation?</h3>
              <p className="cta-band-description">
                We'll connect you with certified HVAC contractors in your area who are trained in AC Drain Wiz installation.
              </p>
            </div>
            <div className="cta-band-buttons">
              <button onClick={() => navigate('/contact?type=installer')} className="cta-band-btn-primary">
                Find an Installer Near Me
              </button>
              <button onClick={() => navigate('/products')} className="cta-band-btn-secondary">
                Learn About DIY Installation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Heritage Section - Core 1.0 Historical Reference */}
      <div ref={heritageRef} className="heritage-section-container">
        {/* Top Section - Full Width Hero with Background Image */}
        <div className="heritage-hero-section">
          <div className="heritage-hero-content">
            {/* Top Section - Header */}
            <div className="heritage-hero-top">
              <h2 className="heritage-hero-title">Where It Started</h2>
              <p className="heritage-hero-subtitle">Our foundation that led to the Mini</p>
            </div>
            
            {/* Bottom Section - Product Info */}
            <div className="heritage-hero-bottom">
              <h3 className="heritage-hero-product-title">AC Drain Wiz Core 1.0</h3>
              <p className="heritage-hero-description">
                The proven foundation solution that started it all. Our Core 1.0 system pioneered the AC drain line maintenance category, establishing the clear PVC design and maintenance access principles that evolved into our flagship Mini. While Core 1.0 is now deprecated in favor of the more compact and versatile Mini, it remains a testament to our commitment to innovation and reliability.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section - Two Column Layout */}
        <div className="heritage-bottom-section">
          <div className="heritage-bottom-container">
            {/* Left Column - Upgrade Offer */}
            <div className="heritage-upgrade-column">
              <h3 className="heritage-upgrade-title">Free Upgrade to AC Drain Wiz Mini</h3>
              <p className="heritage-upgrade-subtitle">Exclusive loyalty offer for Core 1.0 customers</p>
              <div className="heritage-upgrade-badge">
                <GiftIcon className="heritage-upgrade-badge-icon" />
                Exclusive Loyalty Offer
              </div>
              <p className="heritage-upgrade-description">
                Thank you for being an early adopter! As a Core 1.0 customer, you're eligible for a <strong>FREE upgrade to the new Mini</strong>. Submit your request below with a photo of your installed Core 1.0 unit as proof of purchase. We'll review your submission and email you a secure payment link for $10.99 shipping. Once payment is received, we'll ship your new Mini within 7-10 business days.
              </p>
              <button 
                onClick={() => setIsUpgradeModalOpen(true)}
                className="heritage-upgrade-cta"
              >
                Claim Your Free Upgrade
              </button>
            </div>

            {/* Right Column - Support Information */}
            <div className="heritage-support-column">
              <h3 className="heritage-support-title">Core 1.0 Support</h3>
              <p className="heritage-support-subtitle">Full support continues for your Core 1.0 system</p>
              <div className="heritage-support-badge">
                <CheckIcon className="heritage-support-badge-icon" />
                Fully Supported
              </div>
              <p className="heritage-support-description">
                <strong>Need support?</strong> Your Core 1.0 system continues to be fully supported. If you need replacement parts or have questions, please contact our support team.
              </p>
              <button 
                onClick={() => navigate('/support#product-support')}
                className="heritage-support-cta"
              >
                Contact Support for Core 1.0
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
      />
      
      {/* Core 1.0 Upgrade Modal */}
      {isUpgradeModalOpen && (
        <div className="upgrade-modal-overlay" onClick={() => {
          setIsUpgradeModalOpen(false)
          setPhotoFileError('')
          setFieldErrors({})
          setIsUpgradeFormSubmitted(false)
        }}>
          <div className="upgrade-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="upgrade-modal-close" onClick={() => {
              setIsUpgradeModalOpen(false)
              setPhotoFileError('')
              setFieldErrors({})
              setIsUpgradeFormSubmitted(false)
            }}>
              ×
            </button>
            
            <div className="upgrade-modal-content">
              {isUpgradeFormSubmitted ? (
                /* Success Message */
                <div className="upgrade-form-success">
                  <div className="upgrade-form-success-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="upgrade-form-success-title">Request Submitted Successfully!</h3>
                  <p className="upgrade-form-success-message">
                    Thank you! Your upgrade request has been submitted. We'll review your submission and email you within 24-48 hours with a secure payment link for $10.99 shipping.
                  </p>
                  <div className="upgrade-form-success-next-steps">
                    <p className="upgrade-form-success-next-steps-title">What's Next?</p>
                    <ol className="upgrade-form-success-next-steps-list">
                      <li>Check your email (including spam folder) for our response</li>
                      <li>Click the secure payment link in the email</li>
                      <li>Complete the $10.99 shipping payment</li>
                      <li>Your new Mini will ship within 7-10 business days</li>
                    </ol>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsUpgradeModalOpen(false)
                      setPhotoFileError('')
                      setFieldErrors({})
                      setIsUpgradeFormSubmitted(false)
                    }} 
                    className="upgrade-form-success-close"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="upgrade-modal-header">
                    <h3 className="upgrade-modal-title">Request Your Free Core 1.0 to Mini Upgrade</h3>
                    <p className="upgrade-modal-subtitle">
                      This is a registration form, not a payment form. Submit your information and photo below to get started.
                    </p>
                  </div>

                  {/* Process Steps */}
                  <div className="upgrade-process-steps">
                    <h4 className="upgrade-process-steps-title">How It Works:</h4>
                    <ol className="upgrade-process-steps-list">
                      <li>Submit this form with your Core 1.0 photo</li>
                      <li>We'll review and email you a secure payment link ($10.99 shipping)</li>
                      <li>Complete payment and your Mini ships within 7-10 business days</li>
                    </ol>
                  </div>
                  
                  <form 
                className="upgrade-modal-form" 
                name="core-upgrade"
                data-netlify-honeypot="bot-field"
                encType="multipart/form-data"
                noValidate
                onSubmit={async (e) => {
                  e.preventDefault()
                  setIsSubmitting(true)
                  
                  const form = e.target as HTMLFormElement
                  const formData = new FormData(form)
                  const errors: Record<string, string> = {}
                  
                  // Validate required fields
                  const firstName = formData.get('firstName') as string
                  const lastName = formData.get('lastName') as string
                  const email = formData.get('email') as string
                  const phone = formData.get('phone') as string
                  const street = formData.get('street') as string
                  const city = formData.get('city') as string
                  const state = formData.get('state') as string
                  const zip = formData.get('zip') as string
                  const consent = formData.get('consent')
                  const photoInput = form.querySelector('#upgrade-photo') as HTMLInputElement
                  
                  // Validate firstName
                  if (!firstName || firstName.trim().length === 0) {
                    errors.firstName = 'First name is required'
                  }
                  
                  // Validate lastName
                  if (!lastName || lastName.trim().length === 0) {
                    errors.lastName = 'Last name is required'
                  }
                  
                  // Validate email
                  if (!email || email.trim().length === 0) {
                    errors.email = 'Email address is required'
                  } else if (!isValidEmail(email)) {
                    errors.email = 'Please enter a valid email address'
                  }
                  
                  // Validate phone
                  if (!phone || phone.trim().length === 0) {
                    errors.phone = 'Phone number is required'
                  } else if (phone.replace(/\D/g, '').length < 10) {
                    errors.phone = 'Please enter a valid phone number'
                  }
                  
                  // Validate photo
                  if (!photoInput?.files || !photoInput.files[0]) {
                    errors.photo = 'Photo is required'
                  } else {
                    const fileSize = photoInput.files[0].size
                    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
                    if (fileSize > maxSize) {
                      errors.photo = 'File size must be 5MB or less. Please compress your image and try again.'
                      setPhotoFileError(errors.photo)
                    }
                  }
                  
                  // Validate street
                  if (!street || street.trim().length === 0) {
                    errors.street = 'Street address is required'
                  }
                  
                  // Validate city
                  if (!city || city.trim().length === 0) {
                    errors.city = 'City is required'
                  }
                  
                  // Validate state
                  if (!state || state.trim().length === 0) {
                    errors.state = 'State is required'
                  }
                  
                  // Validate zip
                  if (!zip || zip.trim().length === 0) {
                    errors.zip = 'ZIP code is required'
                  } else if (!/^\d{5}$/.test(zip)) {
                    errors.zip = 'ZIP code must be 5 digits'
                  }
                  
                  // Validate consent
                  if (!consent) {
                    errors.consent = 'You must acknowledge the terms to continue'
                  }
                  
                  // If there are validation errors, stop submission
                  if (Object.keys(errors).length > 0) {
                    setFieldErrors(errors)
                    if (errors.photo) {
                      setPhotoFileError(errors.photo)
                    }
                    showToast('Please fill in all required fields correctly.', 'error')
                    setIsSubmitting(false)
                    return
                  }
                  
                  // Check honeypot fields - if filled, it's likely a bot
                  const botField = (document.querySelector('input[name="bot-field"]') as HTMLInputElement)?.value
                  const honeypot1 = (document.querySelector('input[name="honeypot-1"]') as HTMLInputElement)?.value
                  const honeypot2 = (document.querySelector('input[name="honeypot-2"]') as HTMLInputElement)?.value
                  
                  if (botField || honeypot1 || honeypot2) {
                    // Honeypot fields were filled - likely a bot, silently reject
                    console.warn('Bot detected: honeypot fields were filled')
                    showToast('Invalid submission detected.', 'error')
                    setIsSubmitting(false)
                    return
                  }
                  
                    const recaptchaResult = await getRecaptchaToken('upgrade')
                    if (!recaptchaResult.success) {
                        showToast(recaptchaResult.error, 'error')
                        setIsSubmitting(false)
                        return
                    }                  
                  // Clear any previous errors
                  setFieldErrors({})
                  setPhotoFileError('')
                  
                  // Check if we're in development mode
                  const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost'
                  
                  try {
                    let photoUrl = ''
                    
                    // Step 1: Convert photo file to base64 data URL on client side (if provided)
                    if (photoInput?.files && photoInput.files[0]) {
                      const file = photoInput.files[0]
                      
                      // Validate file size (5MB limit)
                      const maxSize = 5 * 1024 * 1024 // 5MB
                      if (file.size > maxSize) {
                        setPhotoFileError('File size exceeds 5MB limit')
                        showToast('File size exceeds 5MB limit. Please choose a smaller file.', 'error')
                        setIsSubmitting(false)
                        return
                      }
                      
                      // Validate file type (images only)
                      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
                      if (!allowedTypes.includes(file.type)) {
                        setPhotoFileError('Invalid file type. Only images are allowed.')
                        showToast('Invalid file type. Please upload an image file (JPEG, PNG, GIF, or WebP).', 'error')
                        setIsSubmitting(false)
                        return
                      }
                      
                      if (isDevelopment) {
                        // In development, simulate file conversion
                        console.log('📸 [DEV MODE] File conversion simulated:', {
                          filename: file.name,
                          size: file.size,
                          type: file.type
                        })
                        photoUrl = 'https://via.placeholder.com/800x600.jpg?text=Dev+Mode+Image'
                      } else {
                        // Step 1: Convert file to base64 data URL
                        const base64DataUrl = await new Promise<string>((resolve, reject) => {
                          const reader = new FileReader()
                          reader.onload = () => {
                            resolve(reader.result as string)
                          }
                          reader.onerror = () => {
                            reject(new Error('Failed to read file'))
                          }
                          reader.readAsDataURL(file)
                        })
                        
                        // Step 2: Upload to Cloudinary and get permanent URL
                        try {
                          const uploadResponse = await fetch('/.netlify/functions/upload-image', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              imageData: base64DataUrl
                              // Folder is handled by Cloudinary upload preset
                            })
                          })
                          
                          const uploadData = await uploadResponse.json()
                          
                          if (!uploadResponse.ok || !uploadData.success) {
                            const errorMessage = uploadData.error || uploadData.message || 'Failed to upload image. Please try again.'
                            setPhotoFileError(errorMessage)
                            showToast(errorMessage, 'error')
                            setIsSubmitting(false)
                            return
                          }
                          
                          photoUrl = uploadData.imageUrl // Use the permanent Cloudinary URL
                        } catch (uploadError) {
                          console.error('Image upload error:', uploadError)
                          setPhotoFileError('Network error during image upload. Please try again.')
                          showToast('Network error during image upload. Please try again.', 'error')
                          setIsSubmitting(false)
                          return
                        }
                      }
                    }
                    
                    // Step 2: Submit form data with photo URL (standard form data, no multipart)
                    const formDataToSubmit = new URLSearchParams()
                    formDataToSubmit.append('form-name', 'core-upgrade')
                    formDataToSubmit.append('form-type', 'upgrade')
                    formDataToSubmit.append('firstName', formData.get('firstName') as string || '')
                    formDataToSubmit.append('lastName', formData.get('lastName') as string || '')
                    formDataToSubmit.append('email', formData.get('email') as string || '')
                    formDataToSubmit.append('phone', formData.get('phone') as string || '')
                    formDataToSubmit.append('street', formData.get('street') as string || '')
                    formDataToSubmit.append('unit', formData.get('unit') as string || '')
                    formDataToSubmit.append('city', formData.get('city') as string || '')
                    formDataToSubmit.append('state', formData.get('state') as string || '')
                    formDataToSubmit.append('zip', formData.get('zip') as string || '')
                    formDataToSubmit.append('consent', formData.get('consent') ? 'yes' : 'no')
                    formDataToSubmit.append('photoUrl', photoUrl) // Add photo URL instead of file
                    
                      formDataToSubmit.append('recaptcha-token', recaptchaResult.token)
                      
                    let response: Response
                    
                    if (isDevelopment) {
                      // In development, simulate a successful submission
                      console.log('📝 [DEV MODE] Core upgrade request simulated:', {
                        formName: 'core-upgrade',
                        formType: 'upgrade',
                        firstName: formData.get('firstName'),
                        lastName: formData.get('lastName'),
                        email: formData.get('email'),
                        phone: formData.get('phone'),
                        photoUrl: photoUrl ? 'Uploaded' : 'No file',
                        street: formData.get('street'),
                        city: formData.get('city'),
                        state: formData.get('state'),
                        zip: formData.get('zip'),
                        consent: formData.get('consent') ? 'yes' : 'no',
                          hasRecaptcha: recaptchaResult.success
                      })
                      // Simulate network delay
                      await new Promise(resolve => setTimeout(resolve, 1000))
                      // Create a mock successful response
                      response = new Response(null, { status: 200, statusText: 'OK' })
                    } else {
                      // In production, submit through validation function
                      // The validation function handles forwarding to Netlify Forms automatically
                      response = await fetch('/.netlify/functions/validate-form-submission', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: formDataToSubmit.toString()
                      })
                      
                      const responseData = await response.json()
                      
                      if (!response.ok || !responseData.success) {
                        // Handle error response from validation function
                        const errorMessage = responseData.message || responseData.error || 'Failed to submit form. Please try again.'
                        showToast(errorMessage, 'error')
                        setIsSubmitting(false)
                        return
                      }
                      // Success - validation function already forwarded to Netlify Forms
                    }
                    
                    if (response.ok) {
                      setIsUpgradeFormSubmitted(true)
                      setPhotoFileError('')
                      setFieldErrors({})
                    } else {
                      showToast('Something went wrong. Please try again or email us directly at support@acdrainwiz.com', 'error')
                    }
                  } catch (error) {
                    console.error('Form submission error:', error)
                    showToast('Network error. Please try again or email us at support@acdrainwiz.com', 'error')
                  } finally {
                    setIsSubmitting(false)
                  }
                }}
              >
                {/* Hidden Fields for Netlify */}
                <input type="hidden" name="form-name" value="core-upgrade" />
                <input type="hidden" name="form-type" value="upgrade" />
                
                {/* Honeypot fields for spam protection */}
                <div style={{ display: 'none' }}>
                  <label>
                    Don't fill this out if you're human: <input name="bot-field" />
                  </label>
                  <label>
                    <input name="honeypot-1" tabIndex={-1} autoComplete="off" />
                  </label>
                  <label>
                    <input name="honeypot-2" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>
                <div className="upgrade-form-group">
                  <label className="upgrade-form-label" htmlFor="upgrade-firstName">First Name *</label>
                  <input 
                    type="text" 
                    id="upgrade-firstName" 
                    name="firstName"
                    className={`upgrade-form-input ${fieldErrors.firstName ? 'upgrade-form-input-error' : ''}`}
                    required 
                    placeholder="John"
                    onChange={() => {
                      if (fieldErrors.firstName) {
                        setFieldErrors(prev => {
                          const newErrors = { ...prev }
                          delete newErrors.firstName
                          return newErrors
                        })
                      }
                    }}
                  />
                  {fieldErrors.firstName && (
                    <p className="upgrade-form-field-error">{fieldErrors.firstName}</p>
                  )}
                </div>

                <div className="upgrade-form-group">
                  <label className="upgrade-form-label" htmlFor="upgrade-lastName">Last Name *</label>
                  <input 
                    type="text" 
                    id="upgrade-lastName" 
                    name="lastName"
                    className={`upgrade-form-input ${fieldErrors.lastName ? 'upgrade-form-input-error' : ''}`}
                    required 
                    placeholder="Smith"
                    onChange={() => {
                      if (fieldErrors.lastName) {
                        setFieldErrors(prev => {
                          const newErrors = { ...prev }
                          delete newErrors.lastName
                          return newErrors
                        })
                      }
                    }}
                  />
                  {fieldErrors.lastName && (
                    <p className="upgrade-form-field-error">{fieldErrors.lastName}</p>
                  )}
                </div>
                
                <div className="upgrade-form-group">
                  <label className="upgrade-form-label" htmlFor="upgrade-email">Email Address *</label>
                  <input 
                    type="email" 
                    id="upgrade-email" 
                    name="email"
                    className={`upgrade-form-input ${fieldErrors.email ? 'upgrade-form-input-error' : ''}`}
                    required 
                    placeholder="john@example.com"
                    onChange={() => {
                      if (fieldErrors.email) {
                        setFieldErrors(prev => {
                          const newErrors = { ...prev }
                          delete newErrors.email
                          return newErrors
                        })
                      }
                    }}
                  />
                  {fieldErrors.email && (
                    <p className="upgrade-form-field-error">{fieldErrors.email}</p>
                  )}
                </div>
                
                <div className="upgrade-form-group">
                  <label className="upgrade-form-label" htmlFor="upgrade-phone">Phone Number *</label>
                  <IMaskInput
                    mask="(000) 000-0000"
                    type="tel" 
                    id="upgrade-phone" 
                    name="phone"
                    className={`upgrade-form-input ${fieldErrors.phone ? 'upgrade-form-input-error' : ''}`}
                    required 
                    placeholder="(555) 123-4567"
                    unmask={false}
                    onAccept={() => {
                      if (fieldErrors.phone) {
                        setFieldErrors(prev => {
                          const newErrors = { ...prev }
                          delete newErrors.phone
                          return newErrors
                        })
                      }
                    }}
                  />
                  {fieldErrors.phone && (
                    <p className="upgrade-form-field-error">{fieldErrors.phone}</p>
                  )}
                </div>
                
                <div className="upgrade-form-group">
                  <label className="upgrade-form-label" htmlFor="upgrade-photo">Photo of Installed Core 1.0 (Proof of Purchase) *</label>
                  <p className="upgrade-form-helper">
                    Please upload a clear photo showing your Core 1.0 unit installed on your AC drain line. This photo serves as proof of purchase and is required to process your upgrade request. Maximum file size: 5MB.
                  </p>
                  <input 
                    type="file" 
                    id="upgrade-photo" 
                    name="photo"
                    className={`upgrade-form-file ${photoFileError || fieldErrors.photo ? 'upgrade-form-file-error' : ''}`}
                    accept="image/*"
                    required
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const maxSize = 5 * 1024 * 1024 // 5MB in bytes
                        if (file.size > maxSize) {
                          setPhotoFileError('File size must be 5MB or less. Please compress your image and try again.')
                          setFieldErrors(prev => ({ ...prev, photo: 'File size must be 5MB or less. Please compress your image and try again.' }))
                          e.target.value = '' // Clear the file input
                        } else {
                          setPhotoFileError('')
                          setFieldErrors(prev => {
                            const newErrors = { ...prev }
                            delete newErrors.photo
                            return newErrors
                          })
                        }
                      } else {
                        setPhotoFileError('')
                        setFieldErrors(prev => {
                          const newErrors = { ...prev }
                          delete newErrors.photo
                          return newErrors
                        })
                      }
                    }}
                  />
                  {(photoFileError || fieldErrors.photo) && (
                    <p className="upgrade-form-error-message">{photoFileError || fieldErrors.photo}</p>
                  )}
                </div>
                
                <div className="upgrade-form-group">
                  <label className="upgrade-form-label" htmlFor="upgrade-street">Street Address *</label>
                  <input 
                    type="text" 
                    id="upgrade-street" 
                    name="street"
                    className={`upgrade-form-input ${fieldErrors.street ? 'upgrade-form-input-error' : ''}`}
                    required 
                    placeholder="123 Main Street"
                    onChange={() => {
                      if (fieldErrors.street) {
                        setFieldErrors(prev => {
                          const newErrors = { ...prev }
                          delete newErrors.street
                          return newErrors
                        })
                      }
                    }}
                  />
                  {fieldErrors.street && (
                    <p className="upgrade-form-field-error">{fieldErrors.street}</p>
                  )}
                </div>
                
                <div className="upgrade-form-group">
                  <label className="upgrade-form-label" htmlFor="upgrade-unit">Apartment/Unit (Optional)</label>
                  <input 
                    type="text" 
                    id="upgrade-unit" 
                    name="unit"
                    className="upgrade-form-input" 
                    placeholder="Apt 4B"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="upgrade-form-group">
                    <label className="upgrade-form-label" htmlFor="upgrade-city">City *</label>
                    <input 
                      type="text" 
                      id="upgrade-city" 
                      name="city"
                      className={`upgrade-form-input ${fieldErrors.city ? 'upgrade-form-input-error' : ''}`}
                      required 
                      placeholder="Miami"
                      onChange={() => {
                        if (fieldErrors.city) {
                          setFieldErrors(prev => {
                            const newErrors = { ...prev }
                            delete newErrors.city
                            return newErrors
                          })
                        }
                      }}
                    />
                    {fieldErrors.city && (
                      <p className="upgrade-form-field-error">{fieldErrors.city}</p>
                    )}
                  </div>
                  
                  <div className="upgrade-form-group">
                    <label className="upgrade-form-label" htmlFor="upgrade-state">State *</label>
                    <select 
                      id="upgrade-state" 
                      name="state"
                      className={`upgrade-form-input ${fieldErrors.state ? 'upgrade-form-input-error' : ''}`}
                      required
                      onChange={() => {
                        if (fieldErrors.state) {
                          setFieldErrors(prev => {
                            const newErrors = { ...prev }
                            delete newErrors.state
                            return newErrors
                          })
                        }
                      }}
                    >
                      <option value="">Select state</option>
                      <option value="AL">Alabama</option>
                      <option value="AK">Alaska</option>
                      <option value="AZ">Arizona</option>
                      <option value="AR">Arkansas</option>
                      <option value="CA">California</option>
                      <option value="CO">Colorado</option>
                      <option value="CT">Connecticut</option>
                      <option value="DE">Delaware</option>
                      <option value="FL">Florida</option>
                      <option value="GA">Georgia</option>
                      <option value="HI">Hawaii</option>
                      <option value="ID">Idaho</option>
                      <option value="IL">Illinois</option>
                      <option value="IN">Indiana</option>
                      <option value="IA">Iowa</option>
                      <option value="KS">Kansas</option>
                      <option value="KY">Kentucky</option>
                      <option value="LA">Louisiana</option>
                      <option value="ME">Maine</option>
                      <option value="MD">Maryland</option>
                      <option value="MA">Massachusetts</option>
                      <option value="MI">Michigan</option>
                      <option value="MN">Minnesota</option>
                      <option value="MS">Mississippi</option>
                      <option value="MO">Missouri</option>
                      <option value="MT">Montana</option>
                      <option value="NE">Nebraska</option>
                      <option value="NV">Nevada</option>
                      <option value="NH">New Hampshire</option>
                      <option value="NJ">New Jersey</option>
                      <option value="NM">New Mexico</option>
                      <option value="NY">New York</option>
                      <option value="NC">North Carolina</option>
                      <option value="ND">North Dakota</option>
                      <option value="OH">Ohio</option>
                      <option value="OK">Oklahoma</option>
                      <option value="OR">Oregon</option>
                      <option value="PA">Pennsylvania</option>
                      <option value="RI">Rhode Island</option>
                      <option value="SC">South Carolina</option>
                      <option value="SD">South Dakota</option>
                      <option value="TN">Tennessee</option>
                      <option value="TX">Texas</option>
                      <option value="UT">Utah</option>
                      <option value="VT">Vermont</option>
                      <option value="VA">Virginia</option>
                      <option value="WA">Washington</option>
                      <option value="WV">West Virginia</option>
                      <option value="WI">Wisconsin</option>
                      <option value="WY">Wyoming</option>
                    </select>
                    {fieldErrors.state && (
                      <p className="upgrade-form-field-error">{fieldErrors.state}</p>
                    )}
                  </div>
                </div>
                
                <div className="upgrade-form-group">
                  <label className="upgrade-form-label" htmlFor="upgrade-zip">ZIP Code *</label>
                  <input 
                    type="text" 
                    id="upgrade-zip" 
                    name="zip"
                    className={`upgrade-form-input ${fieldErrors.zip ? 'upgrade-form-input-error' : ''}`}
                    required 
                    pattern="[0-9]{5}"
                    placeholder="12345"
                    maxLength={5}
                    onChange={() => {
                      if (fieldErrors.zip) {
                        setFieldErrors(prev => {
                          const newErrors = { ...prev }
                          delete newErrors.zip
                          return newErrors
                        })
                      }
                    }}
                  />
                  {fieldErrors.zip && (
                    <p className="upgrade-form-field-error">{fieldErrors.zip}</p>
                  )}
                </div>
                
                <div className="upgrade-form-acknowledgment">
                  <label className={`upgrade-form-checkbox-label ${fieldErrors.consent ? 'upgrade-form-checkbox-label-error' : ''}`}>
                    <input 
                      type="checkbox" 
                      name="consent"
                      className={`upgrade-form-checkbox ${fieldErrors.consent ? 'upgrade-form-checkbox-error' : ''}`}
                      required 
                      onChange={() => {
                        if (fieldErrors.consent) {
                          setFieldErrors(prev => {
                            const newErrors = { ...prev }
                            delete newErrors.consent
                            return newErrors
                          })
                        }
                      }}
                    />
                    <span>I understand that after my submission is reviewed and approved, I will receive an email with a secure payment link for $10.99 shipping. My new Mini will ship within 7-10 business days after I complete the payment.</span>
                  </label>
                  {fieldErrors.consent && (
                    <p className="upgrade-form-field-error">{fieldErrors.consent}</p>
                  )}
                </div>
                
                <div className="upgrade-form-actions">
                  <button type="button" onClick={() => {
                    setIsUpgradeModalOpen(false)
                    setPhotoFileError('')
                    setFieldErrors({})
                    setIsUpgradeFormSubmitted(false)
                  }} className="upgrade-form-cancel">
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="upgrade-form-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Request (No Payment Required)'}
                  </button>
                </div>
              </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`toast-notification toast-${toastType}`}>
          <div className="toast-content">
            {toastType === 'success' ? (
              <svg className="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <p className="toast-message">{toastMessage}</p>
          </div>
          <button 
            className="toast-close"
            onClick={() => setToastMessage('')}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}
    </>
  )
}
