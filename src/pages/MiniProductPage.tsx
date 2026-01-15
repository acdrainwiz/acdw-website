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

import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import {
  CheckIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
  ArrowLeftIcon,
  SparklesIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlayIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline'

export function MiniProductPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { addItem, items, getCartCount } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [showAddedMessage, setShowAddedMessage] = useState(false)
  const [cartError, setCartError] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  // Check for quantity in URL params (from redirect after login)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const qtyParam = params.get('qty')
    if (qtyParam) {
      const qty = parseInt(qtyParam, 10)
      if (qty >= 1 && qty <= 10) {
        setQuantity(qty)
        // Clean up URL
        window.history.replaceState({}, '', '/products/mini')
      }
    }
  }, [])

  // Product images for gallery (placeholder paths - update with actual images)
  const productImages = [
    '/images/ACDW-Mini-Cap-blk.png', // Main product image
    '/images/acdw-mini-hero-background.png', // Alternative angle
    '/images/ACDW-Mini-Cap-blk.png', // Detail shot (placeholder)
  ]

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
      answer: 'The Mini requires minimal maintenance. Simply use the access port to flush or vacuum the drain line when needed. The clear body design makes it easy to see when maintenance is required, and the one-time installation means you never need to cut the line again.'
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

  const price = 99.99
  const totalPrice = price * quantity

  // Calculate how many Mini units are already in cart (memoized to prevent initialization errors)
  const currentMiniInCart = useMemo(() => {
    return items
      .filter(item => item.productId === 'mini')
      .reduce((total, item) => total + item.quantity, 0)
  }, [items])

  // Calculate max quantity user can add (10 total limit)
  const maxAvailable = useMemo(() => {
    return Math.max(0, 10 - currentMiniInCart)
  }, [currentMiniInCart])
  
  // Is cart already at max?
  const cartAtMax = useMemo(() => {
    return currentMiniInCart >= 10
  }, [currentMiniInCart])

  // Adjust quantity when cart changes to respect max available
  useEffect(() => {
    if (maxAvailable > 0 && quantity > maxAvailable) {
      setQuantity(Math.min(quantity, maxAvailable))
    }
    if (cartAtMax && quantity > 0) {
      setQuantity(0)
    }
  }, [maxAvailable, cartAtMax, quantity])

  const handleQuantityChange = (newQuantity: number) => {
    // Limit to available quantity
    const limitedQuantity = Math.min(newQuantity, maxAvailable)
    if (limitedQuantity >= 1 && limitedQuantity <= maxAvailable) {
      setQuantity(limitedQuantity)
    }
  }

  const handleAddToCart = () => {
    // This should never happen due to button being disabled, but double-check
    if (cartAtMax) {
      setCartError('You already have the maximum (10) AC Drain Wiz Mini units in your cart.')
      setTimeout(() => setCartError(null), 5000)
      return
    }

    // Check if adding this quantity would exceed the max
    const newTotal = currentMiniInCart + quantity
    
    if (newTotal > 10) {
      setCartError(
        `You can only add ${maxAvailable} more unit${maxAvailable === 1 ? '' : 's'}. Maximum 10 AC Drain Wiz Mini units per order.`
      )
      setTimeout(() => setCartError(null), 5000)
      return
    }

    // Clear any previous errors
    setCartError(null)

    // Add to cart
    addItem({
      id: `mini-${Date.now()}`, // Unique ID for each cart item
      productId: 'mini',
      name: 'AC Drain Wiz Mini',
      price: price,
      quantity: quantity,
      image: '/images/acdw-mini-hero1-background.png',
      maxQuantity: 10
    })

    // Show success message
    setShowAddedMessage(true)
    
    // Hide message after 3 seconds
    setTimeout(() => {
      setShowAddedMessage(false)
    }, 3000)

    // Reset quantity to 1
    setQuantity(1)
  }

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
                {/* Option A: Horizontal Flow Layout */}
                {/* Row 1: Price (left) + Quantity (right) */}
                <div className="mini-product-purchase-row-1">
                  {/* Price Section */}
                  <div className="mini-product-purchase-price-section">
                    <h2 className="mini-product-purchase-title">Order Now</h2>
                    <div className="mini-product-purchase-price">
                      <span className="mini-product-purchase-price-amount">${price.toFixed(2)}</span>
                      <span className="mini-product-purchase-price-label">per unit</span>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="mini-product-quantity-section-inline">
                    <label className="mini-product-quantity-label">
                      Quantity
                      {currentMiniInCart > 0 && (
                        <span className="mini-product-quantity-hint">
                          ({currentMiniInCart} in cart, {maxAvailable} available)
                        </span>
                      )}
                    </label>
                    <div className="mini-product-quantity-controls">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1 || cartAtMax}
                        className="mini-product-quantity-button"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={maxAvailable}
                        value={cartAtMax ? 0 : quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1
                          handleQuantityChange(Math.max(1, Math.min(maxAvailable, val)))
                        }}
                        className="mini-product-quantity-input"
                        disabled={cartAtMax}
                      />
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= maxAvailable || cartAtMax}
                        className="mini-product-quantity-button"
                        aria-label="Increase quantity"
                        title={cartAtMax ? 'Cart limit reached (10 units max)' : quantity >= maxAvailable ? `Only ${maxAvailable} available` : ''}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Row 2: Checkout Button with Total */}
                <div className="mini-product-purchase-row-2">
                  {/* Checkout Button with Total */}
                  <div className="mini-product-checkout-section-inline">
                  {!isAuthenticated || user?.role === 'homeowner' ? (
                    <div className="mini-product-checkout-section">
                      {/* Success Message */}
                      {showAddedMessage && (
                        <div className="mini-product-added-message">
                          <CheckIcon className="mini-product-added-icon" />
                          <span>Added to cart!</span>
                        </div>
                      )}

                      {/* Cart Limit Message */}
                      {cartAtMax && (
                        <div className="mini-product-cart-limit-message">
                          <CheckIcon className="mini-product-cart-limit-icon" />
                          <span>You have the maximum (10) AC Drain Wiz Mini units in your cart.</span>
                        </div>
                      )}

                      {/* Error Message */}
                      {cartError && !cartAtMax && (
                        <div className="mini-product-cart-error">
                          <span>{cartError}</span>
                        </div>
                      )}

                      {/* Add to Cart Button */}
                      <button
                        onClick={handleAddToCart}
                        disabled={cartAtMax}
                        className="mini-product-add-to-cart-button"
                        title={cartAtMax ? 'Cart limit reached - maximum 10 units' : ''}
                      >
                        <ShoppingCartIcon className="mini-product-cart-icon" />
                        {cartAtMax ? 'Cart Limit Reached' : 'Add to Cart'}
                        {!cartAtMax && (
                          <span className="mini-product-add-to-cart-total">
                            ${totalPrice.toFixed(2)}
                          </span>
                        )}
                      </button>

                      {/* View Cart Link */}
                      {getCartCount() > 0 && (
                        <button
                          onClick={() => navigate('/cart')}
                          className={cartAtMax ? 'mini-product-view-cart-primary' : 'mini-product-view-cart-link'}
                        >
                          <ShoppingCartIcon className="mini-product-view-cart-icon" />
                          View Cart ({getCartCount()} {getCartCount() === 1 ? 'item' : 'items'})
                        </button>
                      )}

                      {!isAuthenticated && (
                        <p className="mini-product-checkout-guest-help">
                          <button
                            onClick={() => navigate('/auth/signin')}
                            className="mini-product-checkout-guest-link"
                          >
                            Sign in
                          </button>
                          {' '}for faster checkout and order tracking
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="mini-product-checkout-role-message">
                      <p>
                        {user?.role === 'hvac_pro' 
                          ? 'Contact us for contractor pricing'
                          : 'Contact us for pricing options'}
                      </p>
                      {/* Launch Button Redirect */}
                      <button
                        onClick={() => navigate('/contact?type=sales')}
                        className="mini-product-checkout-role-button"
                      >
                        Contact Sales
                      </button>
                    </div>
                  )}
                  </div>
                </div>

                {/* Trust Indicators - Integrated as badges */}
                <div className="mini-product-trust-section-inline">
                  <div className="mini-product-trust-badge">
                    <ShieldCheckIcon className="mini-product-trust-icon" />
                    <span>100% Satisfaction</span>
                  </div>
                  <div className="mini-product-trust-badge">
                    <CheckIcon className="mini-product-trust-icon" />
                    <span>Fast Shipping</span>
                  </div>
                  <div className="mini-product-trust-badge">
                    <SparklesIcon className="mini-product-trust-icon" />
                    <span>Made in USA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mini-product-how-it-works">
        <div className="mini-product-how-it-works-content">
          <h2 className="mini-product-section-title">How It Works</h2>
          <p className="mini-product-how-it-works-subtitle">
            Get instant access to your AC drain line in four simple steps
          </p>
          
          <div className="mini-product-how-it-works-steps">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="mini-product-how-it-works-step">
                <div className="mini-product-how-it-works-step-number">
                  {step.number}
                </div>
                <div className="mini-product-how-it-works-step-content">
                  <step.icon className="mini-product-how-it-works-step-icon" />
                  <h3 className="mini-product-how-it-works-step-title">{step.title}</h3>
                  <p className="mini-product-how-it-works-step-description">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Installation Video Placeholder */}
          <div className="mini-product-installation-video">
            <div className="mini-product-installation-video-placeholder">
              <div className="mini-product-installation-video-placeholder-content">
                <PlayIcon className="mini-product-installation-video-play-icon" />
                <h3 className="mini-product-installation-video-title">Watch Installation Video</h3>
                <p className="mini-product-installation-video-description">
                  See how easy it is to install the AC Drain Wiz Mini in just 5 minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mini-product-testimonials">
        <div className="mini-product-testimonials-content">
          <h2 className="mini-product-section-title">Customers Love the AC Drain Wiz Mini</h2>
          
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
          <h2 className="mini-product-section-title">Why Choose AC Drain Wiz Mini</h2>
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
      <section className="mini-product-specs">
        <div className="mini-product-specs-content">
          <h2 className="mini-product-section-title">Specifications</h2>
          <div className="mini-product-specs-grid">
            {specifications.map((spec, index) => (
              <div key={index} className="mini-product-spec-item">
                <span className="mini-product-spec-label">{spec.label}</span>
                <span className="mini-product-spec-value">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="mini-product-compliance">
        <div className="mini-product-compliance-content">
          <h2 className="mini-product-section-title">Code Compliant</h2>
          <p className="mini-product-compliance-description">
            AC Drain Wiz Mini meets International Mechanical Code (IMC) standards and is approved 
            for use in municipalities nationwide.
          </p>
          <div className="mini-product-compliance-badges">
            {complianceCodes.map((code, index) => (
              <div key={index} className="mini-product-compliance-badge">
                {code}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mini-product-faq">
        <div className="mini-product-faq-content">
          <h2 className="mini-product-section-title">Frequently Asked Questions</h2>
          <p className="mini-product-faq-subtitle">
            Have questions? We've got answers. Can't find what you're looking for?{' '}
            <button
              onClick={() => navigate('/contact?type=support')}
              className="mini-product-faq-contact-link"
            >
              Contact our support team
            </button>
          </p>
          <div className="mini-product-faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="mini-product-faq-item">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="mini-product-faq-question"
                  aria-expanded={openFaq === index}
                >
                  <span>{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUpIcon className="mini-product-faq-icon" />
                  ) : (
                    <ChevronDownIcon className="mini-product-faq-icon" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="mini-product-faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="mini-product-gallery">
        <div className="mini-product-gallery-content">
          <h2 className="mini-product-section-title">See It In Action</h2>
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
      </section>
    </div>
  )
}

