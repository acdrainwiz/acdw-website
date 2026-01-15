/**
 * ACDW Sensor Product Landing Page
 * 
 * Product showcase page for the AC Drain Wiz Sensor:
 * - Hero section with value proposition
 * - Customer type-specific value propositions (Homeowners, HVAC Pros, Property Managers)
 * - Real-time monitoring features
 * - Smart alerts & notifications
 * - Fleet monitoring for contractors
 * - Service call creation & alerts management
 * - Maintenance optimization
 * - How It Works
 * - FAQ
 * - CTAs based on user type (no direct purchase for homeowners)
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
  BellAlertIcon,
  ChartBarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  HomeIcon,
  DevicePhoneMobileIcon,
  BoltIcon,
  EyeIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  PlayIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'

export function SensorProductPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Determine user type for CTAs
  const isHVACPro = isAuthenticated && user?.role === 'hvac_pro'
  const isPropertyManager = isAuthenticated && user?.role === 'property_manager'
  const isHomeowner = isAuthenticated && user?.role === 'homeowner'

  // Customer type value propositions
  const customerValueProps = [
    {
      type: 'homeowner',
      icon: HomeIcon,
      title: 'Peace of Mind, 24/7',
      description: 'Early warning alerts before backups occur. No need to check drain lines manually.',
      benefits: [
        'Early warning alerts before backups',
        'No manual drain line checking needed',
        'Professional installation and support',
        'Prevents costly water damage'
      ],
      cta: 'Find a Local HVAC Pro',
      ctaLink: '/contact?type=installer',
      visual: 'homeowner-dashboard'
    },
    {
      type: 'hvac_pro',
      icon: WrenchScrewdriverIcon,
      title: 'Fleet Management & Recurring Revenue',
      description: 'Monitor all installations from one dashboard. 35% faster service calls with pre-visit diagnostics.',
      benefits: [
        'Monitor all installations from one dashboard',
        '35% faster service calls with pre-visit diagnostics',
        'Service scheduling prompts based on real-time alerts',
        'Customer and employee management tools',
        'Upsell opportunities identified automatically'
      ],
      // Launch Button Redirect
      cta: 'Contact Sales',
      ctaLink: '/contact?type=sales',
      visual: 'contractor-dashboard'
    },
    {
      type: 'property_manager',
      icon: BuildingOfficeIcon,
      title: 'Multi-Property Monitoring',
      description: 'Monitor multiple properties from one dashboard. Reduced maintenance overhead and automated alerts.',
      benefits: [
        'Monitor multiple properties from one dashboard',
        'Reduced maintenance overhead',
        'Automated alerts reduce emergency calls',
        'Professional contractor network access',
        'Bulk pricing for large deployments'
      ],
      cta: 'Contact for Bulk Pricing',
      ctaLink: '/contact?type=sales',
      visual: 'property-manager-dashboard'
    }
  ]

  // Real-time visibility features
  const visibilityFeatures = [
    {
      icon: EyeIcon,
      title: 'Sensor Status Readout',
      description: 'Dashboard reflects sensor state (normal, warning, critical) in real-time'
    },
    {
      icon: ChartBarIcon,
      title: 'Visual Monitoring',
      description: 'Water levels and blockages are visually confirmed, enabling better diagnostics without guesswork'
    },
    {
      icon: ClipboardDocumentListIcon,
      title: 'Historical Logs',
      description: 'Tracks recent blockage events, clean-outs, and water flow history to help spot recurring issues'
    },
    {
      icon: WrenchScrewdriverIcon,
      title: 'Better Diagnostics',
      description: 'No guesswork, no cutting pipes to check status—everything visible in the dashboard'
    }
  ]

  // Alert types
  const alertTypes = [
    {
      icon: BellAlertIcon,
      title: 'Overflow Warnings',
      description: 'Alerts when drain line is nearing overflow risk'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Clog Detection',
      description: 'Detects slowed flow or obstructions before backup occurs'
    },
    {
      icon: DevicePhoneMobileIcon,
      title: 'Mobile Notifications',
      description: 'Push/SMS/Email alerts for remote awareness—critical for contractors managing multiple installs'
    },
    {
      icon: ClockIcon,
      title: 'Proactive Cleaning',
      description: 'System flags when maintenance is needed, eliminating blockages before they cause overflows'
    }
  ]

  // Fleet monitoring features
  const fleetFeatures = [
    {
      icon: ChartBarIcon,
      title: 'Multi-Unit Dashboard View',
      description: 'Track all active AC Drain Wiz sensors by location or customer. Group by customer, property, or service area.'
    },
    {
      icon: BellAlertIcon,
      title: 'Service Scheduling Triggers',
      description: 'Manual scheduling prompts when maintenance is needed. Trending alerts for units approaching failure.'
    },
    {
      icon: BoltIcon,
      title: 'Upsell Insights',
      description: 'Dashboard flags opportunities for UV air purification and preventive upgrade recommendations.'
    },
    {
      icon: UserGroupIcon,
      title: 'Customer Management',
      description: 'Store customer contact information, service history, multiple addresses per customer, and communication tools.'
    },
    {
      icon: Cog6ToothIcon,
      title: 'Employee Management',
      description: 'Assign technicians to service calls, track completion, performance metrics, and schedule optimization.'
    }
  ]

  // How It Works steps
  const howItWorksSteps = [
    {
      number: 1,
      title: 'Professional Installation',
      description: 'HVAC Pro installs AC Drain Wiz Mini + Sensor. Sensor pairs automatically with dashboard. No calibration needed.',
      icon: WrenchScrewdriverIcon
    },
    {
      number: 2,
      title: 'Real-Time Monitoring',
      description: 'Sensor continuously monitors drain line. Data syncs to cloud dashboard. Status visible 24/7.',
      icon: EyeIcon
    },
    {
      number: 3,
      title: 'Smart Alerts',
      description: 'System detects issues early. Alerts sent to contractor and homeowner. Actionable notifications with clear next steps.',
      icon: BellAlertIcon
    },
    {
      number: 4,
      title: 'Proactive Service',
      description: 'Contractor receives maintenance alerts and creates service calls manually. Assign technicians to specific locations for faster, more controlled service delivery.',
      icon: ClockIcon
    }
  ]

  // FAQ data
  const faqs = [
    {
      question: 'Can I purchase the Sensor directly?',
      answer: 'The Sensor requires professional installation and is available through authorized HVAC contractors. Homeowners should contact a local HVAC professional for installation. Contractors can create an account to access pricing and purchase directly.'
    },
    {
      question: 'How do I find an installer?',
      answer: 'Use our contractor finder to locate a certified HVAC professional in your area. You can also contact our support team for assistance finding an installer near you.'
    },
    {
      question: 'What does professional installation involve?',
      answer: 'Professional installation includes mounting the Sensor to your AC Drain Wiz Mini, connecting to your Wi-Fi network, and pairing with the monitoring dashboard. The entire process typically takes 15-20 minutes.'
    },
    {
      question: 'How do I get pricing as a contractor?',
      answer: 'HVAC professionals can create an account to access contractor pricing and bulk discounts. Sign up with your business information and HVAC license number to get started.'
    },
    {
      question: 'What dashboard features are included?',
      answer: 'The dashboard includes real-time monitoring, smart alerts, customer management, employee management, service call creation, alerts management, and historical data tracking. All features are included with your Sensor purchase.'
    },
    {
      question: 'Can I manage multiple customers?',
      answer: 'Yes! The dashboard is designed for contractors managing multiple installations. You can organize sensors by customer, property, or service area, and track all installations from one central dashboard.'
    },
    {
      question: 'How do service calls work?',
      answer: 'Service calls are not automated. Contractors create service calls manually in the dashboard and assign technicians to specific customer locations. This keeps you in full control of scheduling and ensures your team provides maintenance when and where it’s needed.'
    },
    {
      question: 'Do you offer bulk pricing?',
      answer: 'Yes! Property managers and contractors can access bulk pricing for large deployments. Contact our sales team for custom pricing based on your volume needs.'
    },
    {
      question: 'Can I monitor multiple properties?',
      answer: 'Absolutely. Property managers can monitor all properties from one dashboard, set up automated alerts, and manage service calls across multiple locations.'
    },
    {
      question: 'What training is available?',
      answer: 'We provide comprehensive training materials, video tutorials, and support for contractors. Contact our support team to learn about available training resources.'
    }
  ]

  // Specifications
  const specifications = [
    { label: 'Dimensions', value: '2" × 3" × 1.5"' },
    { label: 'Power', value: 'Battery (2-year life) or DC + backup battery' },
    { label: 'Connectivity', value: 'Wi-Fi' },
    { label: 'Integration', value: 'Snap-to-lock bayonet (ACDW Mini)' },
    { label: 'Installation Time', value: '15 minutes (with Mini)' },
    { label: 'Compliance', value: 'IMC 307.2.3' }
  ]

  // Launch Button Redirect: pause pro/pm account creation during launch
  const salesPhone = 'tel:+15616545237'

  return (
    <div className="sensor-product-page">
      {/* Back Navigation */}
      <div className="sensor-product-back-nav">
        <button
          onClick={() => navigate('/products')}
          className="sensor-product-back-button"
        >
          <ArrowLeftIcon className="sensor-product-back-icon" />
          Back to Products
        </button>
      </div>

      {/* Hero Section */}
      <section className="sensor-product-hero-fullwidth">
        <div className="sensor-product-hero-image-container">
          <img
            src="/images/acdw-sensor-hero1-background.png"
            alt="AC Drain Wiz Sensor"
            className="sensor-product-hero-image"
          />
        </div>
        
        <div className="sensor-product-hero-overlay">
          <div className="sensor-product-hero-content-wrapper">
            <div className="sensor-product-hero-info">
              <h1 className="sensor-product-hero-title">
                Know Before It Clogs. Monitor Your AC Drain Line in Real Time
              </h1>
              <p className="sensor-product-hero-subtitle">
                Real-time drain line monitoring with smart alerts, fleet management, and seamless integration. 
                Professional installation required—contact us to connect with a local HVAC Pro or request contractor pricing.
              </p>
            </div>

            {/* Purchase Card - Different CTAs based on user type */}
            <div className="sensor-product-purchase-card-hero">
              <div className="sensor-product-purchase-card-content">
                <h2 className="sensor-product-purchase-title">Get Started</h2>
                
                {!isAuthenticated ? (
                  <div className="sensor-product-purchase-cta-section">
                    <p className="sensor-product-purchase-message">
                      Contractor pricing and purchase are available by request. Homeowners: Contact us and we'll connect you with a local HVAC professional for installation.
                    </p>
                    {/* Launch Button Redirect */}
                    {/* Mobile: Clickable phone button */}
                    <a
                      href={salesPhone}
                      className="sensor-product-purchase-button-primary md:hidden"
                    >
                      Call (561) 654-5237
                    </a>
                    {/* Desktop: Phone badge (non-clickable) */}
                    <div className="sensor-product-phone-badge hidden md:flex">
                      <PhoneIcon className="sensor-product-phone-badge-icon" />
                      (561) 654-5237
                    </div>
                    {/* Launch Button Redirect */}
                    <button
                      onClick={() => navigate('/contact?type=sales')}
                      className="sensor-product-purchase-button-secondary"
                    >
                      Contact Sales
                    </button>
                  </div>
                ) : isHomeowner ? (
                  <div className="sensor-product-purchase-cta-section">
                    <p className="sensor-product-purchase-message">
                      Sensor requires professional installation. Find a certified HVAC professional in your area.
                    </p>
                    {/* Launch Button Redirect */}
                    {/* Mobile: Clickable phone button */}
                    <a
                      href={salesPhone}
                      className="sensor-product-purchase-button-primary md:hidden"
                    >
                      Call (561) 654-5237
                    </a>
                    {/* Desktop: Phone badge (non-clickable) */}
                    <div className="sensor-product-phone-badge hidden md:flex">
                      <PhoneIcon className="sensor-product-phone-badge-icon" />
                      (561) 654-5237
                    </div>
                    {/* Launch Button Redirect */}
                    <button
                      onClick={() => navigate('/contact?type=sales')}
                      className="sensor-product-purchase-button-secondary"
                    >
                      Contact Sales
                    </button>
                  </div>
                ) : isHVACPro ? (
                  <div className="sensor-product-purchase-cta-section">
                    <p className="sensor-product-purchase-message">
                      Access bulk pricing, fleet management tools, and exclusive contractor features by request.
                    </p>
                    {/* Launch Button Redirect */}
                    {/* Mobile: Clickable phone button */}
                    <a
                      href={salesPhone}
                      className="sensor-product-purchase-button-primary md:hidden"
                    >
                      Call (561) 654-5237
                    </a>
                    {/* Desktop: Phone badge (non-clickable) */}
                    <div className="sensor-product-phone-badge hidden md:flex">
                      <PhoneIcon className="sensor-product-phone-badge-icon" />
                      (561) 654-5237
                    </div>
                    {/* Launch Button Redirect */}
                    <button
                      onClick={() => navigate('/contact?type=sales')}
                      className="sensor-product-purchase-button-secondary"
                    >
                      Contact Sales
                    </button>
                  </div>
                ) : isPropertyManager ? (
                  <div className="sensor-product-purchase-cta-section">
                    <p className="sensor-product-purchase-message">
                      Bulk pricing available for multi-property deployments.
                    </p>
                    {/* Launch Button Redirect */}
                    {/* Mobile: Clickable phone button */}
                    <a
                      href={salesPhone}
                      className="sensor-product-purchase-button-primary md:hidden"
                    >
                      Call (561) 654-5237
                    </a>
                    {/* Desktop: Phone badge (non-clickable) */}
                    <div className="sensor-product-phone-badge hidden md:flex">
                      <PhoneIcon className="sensor-product-phone-badge-icon" />
                      (561) 654-5237
                    </div>
                    {/* Launch Button Redirect */}
                    <button
                      onClick={() => navigate('/contact?type=sales')}
                      className="sensor-product-purchase-button-secondary"
                    >
                      Contact Sales
                    </button>
                  </div>
                ) : null}

                <div className="sensor-product-trust-section-inline">
                  <div className="sensor-product-trust-badge">
                    <ShieldCheckIcon className="sensor-product-trust-icon" />
                    <span>Professional Installation</span>
                  </div>
                  <div className="sensor-product-trust-badge">
                    <CheckIcon className="sensor-product-trust-icon" />
                    <span>24/7 Monitoring</span>
                  </div>
                  <div className="sensor-product-trust-badge">
                    <BoltIcon className="sensor-product-trust-icon" />
                    <span>Smart Alerts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition by Customer Type */}
      <section className="sensor-product-value-props">
        <div className="sensor-product-value-props-content">
          <h2 className="sensor-product-section-title">Built for Everyone</h2>
          <p className="sensor-product-section-subtitle">
            Whether you're a homeowner, HVAC professional, or property manager, the Sensor delivers value tailored to your needs.
          </p>
          
          <div className="sensor-product-value-props-grid">
            {customerValueProps.map((prop, index) => (
              <div key={index} className="sensor-product-value-prop-card">
                <div className="sensor-product-value-prop-icon-wrapper">
                  <prop.icon className="sensor-product-value-prop-icon" />
                </div>
                <h3 className="sensor-product-value-prop-title">{prop.title}</h3>
                <p className="sensor-product-value-prop-description">{prop.description}</p>
                <ul className="sensor-product-value-prop-benefits">
                  {prop.benefits.map((benefit, i) => (
                    <li key={i} className="sensor-product-value-prop-benefit">
                      <CheckIcon className="sensor-product-value-prop-check" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate(prop.ctaLink)}
                  className="sensor-product-value-prop-cta"
                >
                  {prop.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-Time System Visibility */}
      <section className="sensor-product-visibility">
        <div className="sensor-product-visibility-content">
          <h2 className="sensor-product-section-title">See What's Happening, When It's Happening</h2>
          <p className="sensor-product-section-subtitle">
            Real-time monitoring gives you instant visibility into your drain line status without opening the unit or cutting pipes.
          </p>
          
          <div className="sensor-product-visibility-grid">
            {visibilityFeatures.map((feature, index) => (
              <div key={index} className="sensor-product-visibility-card">
                <feature.icon className="sensor-product-visibility-icon" />
                <h3 className="sensor-product-visibility-title">{feature.title}</h3>
                <p className="sensor-product-visibility-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Alerts & Notifications */}
      <section className="sensor-product-alerts">
        <div className="sensor-product-alerts-content">
          <h2 className="sensor-product-section-title">Stop Problems Before They Start</h2>
          <p className="sensor-product-section-subtitle">
            Proactive cleaning eliminates blockages before they cause overflows—saving time, money, and preventing emergency service calls.
          </p>
          
          <div className="sensor-product-alerts-grid">
            {alertTypes.map((alert, index) => (
              <div key={index} className="sensor-product-alert-card">
                <alert.icon className="sensor-product-alert-icon" />
                <h3 className="sensor-product-alert-title">{alert.title}</h3>
                <p className="sensor-product-alert-description">{alert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Monitoring for Contractors */}
      <section className="sensor-product-fleet">
        <div className="sensor-product-fleet-content">
          <h2 className="sensor-product-section-title">Manage Every Installation From One Dashboard</h2>
          <p className="sensor-product-section-subtitle">
            Turn every sensor into a recurring touchpoint. Monitor all installations, schedule service, and identify upsell opportunities.
          </p>
          
          <div className="sensor-product-fleet-grid">
            {fleetFeatures.map((feature, index) => (
              <div key={index} className="sensor-product-fleet-card">
                <feature.icon className="sensor-product-fleet-icon" />
                <h3 className="sensor-product-fleet-title">{feature.title}</h3>
                <p className="sensor-product-fleet-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Call Creation & Alerts Management */}
      <section className="sensor-product-service">
        <div className="sensor-product-service-content">
          <h2 className="sensor-product-section-title">Streamline Your Service Operations</h2>
          <div className="sensor-product-service-grid">
            <div className="sensor-product-service-card">
              <ClipboardDocumentListIcon className="sensor-product-service-icon" />
              <h3 className="sensor-product-service-title">Service Call Creation</h3>
              <ul className="sensor-product-service-list">
                <li>Automated creation from alerts</li>
                <li>Manual creation for scheduled maintenance</li>
                <li>Assign calls to specific technicians</li>
                <li>Track service call progress and completion</li>
                <li>Automated customer notifications</li>
              </ul>
            </div>
            <div className="sensor-product-service-card">
              <BellAlertIcon className="sensor-product-service-icon" />
              <h3 className="sensor-product-service-title">Alerts Management</h3>
              <ul className="sensor-product-service-list">
                <li>Multiple alert types (overflow, clog, maintenance)</li>
                <li>Route alerts to appropriate technicians</li>
                <li>Track all alerts and responses</li>
                <li>Custom thresholds per customer</li>
                <li>Configure SMS, email, push notifications</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Maintenance Optimization */}
      <section className="sensor-product-maintenance">
        <div className="sensor-product-maintenance-content">
          <h2 className="sensor-product-section-title">35% Faster Service Calls</h2>
          <p className="sensor-product-section-subtitle">
            Pre-visit diagnostics and visual confirmation tools reduce service time and improve efficiency.
          </p>
          
          <div className="sensor-product-maintenance-features">
            <div className="sensor-product-maintenance-feature">
              <CheckIcon className="sensor-product-maintenance-check" />
              <span>Pre-visit diagnostics: Know exact status before arriving</span>
            </div>
            <div className="sensor-product-maintenance-feature">
              <CheckIcon className="sensor-product-maintenance-check" />
              <span>Visual confirmation: Dashboard shows water level and flow status</span>
            </div>
            <div className="sensor-product-maintenance-feature">
              <CheckIcon className="sensor-product-maintenance-check" />
              <span>No tools re-entry: No need to cut or reattach drain lines</span>
            </div>
            <div className="sensor-product-maintenance-feature">
              <CheckIcon className="sensor-product-maintenance-check" />
              <span>Faster clean-outs: Exact problem identification reduces service time</span>
            </div>
            <div className="sensor-product-maintenance-feature">
              <CheckIcon className="sensor-product-maintenance-check" />
              <span>Predictive maintenance: System flags issues before they become emergencies</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="sensor-product-how-it-works">
        <div className="sensor-product-how-it-works-content">
          <h2 className="sensor-product-section-title">How It Works</h2>
          <p className="sensor-product-section-subtitle">
            From installation to proactive service, the Sensor integrates seamlessly into your workflow.
          </p>
          
          <div className="sensor-product-how-it-works-steps">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="sensor-product-how-it-works-step">
                <div className="sensor-product-how-it-works-step-number">
                  {step.number}
                </div>
                <div className="sensor-product-how-it-works-step-content">
                  <step.icon className="sensor-product-how-it-works-step-icon" />
                  <h3 className="sensor-product-how-it-works-step-title">{step.title}</h3>
                  <p className="sensor-product-how-it-works-step-description">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Installation Video Placeholder */}
          <div className="sensor-product-installation-video">
            <div className="sensor-product-installation-video-placeholder">
              <div className="sensor-product-installation-video-placeholder-content">
                <PlayIcon className="sensor-product-installation-video-play-icon" />
                <h3 className="sensor-product-installation-video-title">Watch Installation Video</h3>
                <p className="sensor-product-installation-video-description">
                  See how easy it is to install and set up the AC Drain Wiz Sensor
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="sensor-product-specs">
        <div className="sensor-product-specs-content">
          <h2 className="sensor-product-section-title">Specifications</h2>
          <div className="sensor-product-specs-grid">
            {specifications.map((spec, index) => (
              <div key={index} className="sensor-product-spec-item">
                <span className="sensor-product-spec-label">{spec.label}</span>
                <span className="sensor-product-spec-value">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="sensor-product-faq">
        <div className="sensor-product-faq-content">
          <h2 className="sensor-product-section-title">Frequently Asked Questions</h2>
          <p className="sensor-product-faq-subtitle">
            Have questions? We've got answers. Can't find what you're looking for?{' '}
            <button
              onClick={() => navigate('/contact?type=support')}
              className="sensor-product-faq-contact-link"
            >
              Contact our support team
            </button>
          </p>
          <div className="sensor-product-faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="sensor-product-faq-item">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="sensor-product-faq-question"
                  aria-expanded={openFaq === index}
                >
                  <span>{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUpIcon className="sensor-product-faq-icon" />
                  ) : (
                    <ChevronDownIcon className="sensor-product-faq-icon" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="sensor-product-faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}


