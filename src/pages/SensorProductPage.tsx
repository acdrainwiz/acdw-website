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
import { Link, useNavigate } from 'react-router-dom'
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
  //PlayIcon,
  PhoneIcon,
  BookOpenIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import {
  SUPPORT_CONTACT,
  SENSOR_STANDARD_SHORT,
  SENSOR_WIFI_SHORT,
  SENSOR_STANDARD_DISPLAY,
  SENSOR_WIFI_DISPLAY,
  WIFI_REQUIREMENT,
  buildSensorSetupHref,
  PRODUCT_NAMES,
} from '../config/acdwKnowledge'
import type { PageSearchMeta } from '../config/siteSearchTypes'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'product-sensor',
  kind: 'product-info',
  title: PRODUCT_NAMES.sensor,
  body:
    'Overflow protection and WiFi monitoring options. Standard Sensor Switch non-WiFi and WiFi Sensor Switch. Capacitive sensing, automatic AC shutdown at 95%, monitoring portal and alerts for WiFi model. WiFi Sensor Switch includes lithium-ion backup battery (~2 years) with low-battery warning in the platform. Product overview.',
  tags: ['sensor', 'product', 'wifi', 'overflow', 'monitoring', 'battery', 'backup battery', 'power'],
  href: '/products/sensor',
}

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
      title: 'Professional installation',
      description:
        'The sensor installs in the bayonet port on the included Transparent T Manifold—you do not need the AC Drain Wiz Mini first. WiFi model: connect to 2.4 GHz Wi‑Fi and your contractor account. Standard model: 24V power and on-site LED checks only—no Wi‑Fi pairing.',
      icon: WrenchScrewdriverIcon
    },
    {
      number: 2,
      title: 'Drain line monitoring',
      description:
        'WiFi Sensor Switch: water level and status sync to the monitoring dashboard. Standard Sensor Switch (Non-WiFi): capacitive sensing with automatic AC shutdown at 95%—no cloud connection.',
      icon: EyeIcon
    },
    {
      number: 3,
      title: 'Alerts & shutdown',
      description:
        'Both models shut down the AC at 95% water level. WiFi adds email/SMS and service alerts between 50–90% before shutdown.',
      icon: BellAlertIcon
    },
    {
      number: 4,
      title: 'Proactive service',
      description:
        'WiFi: contractors use dashboard insights and create service calls manually. Standard: reliable overflow protection for jobs where remote monitoring is not required.',
      icon: ClockIcon
    }
  ]

  // FAQ data
  const faqs = [
    {
      question: 'What is the difference between the Standard and WiFi Sensor Switch?',
      answer:
        'The AC Drain Wiz Standard Sensor Switch (Non-WiFi) provides capacitive water sensing, automatic AC shutdown at 95% water level, no moving parts, and fail-safe shutdown if power is lost. The AC Drain Wiz WiFi Sensor Switch adds remote water-level monitoring, contractor account monitoring, email notifications, SMS notifications, and configurable service alerts from 50% to 90% water level so contractors can schedule preventative maintenance before shutdown occurs.'
    },
    {
      question: 'Why did my AC shut off?',
      answer:
        'The sensor detected high water in the condensate drain line and shut down the HVAC system to help prevent overflow. This is protective operation. For LED meanings and troubleshooting, use Product Support (Sensor tab).'
    },
    {
      question: 'There is no light—is the sensor broken?',
      answer:
        'With 24V power, no light usually means no power—check wiring. On a WiFi model running on battery only, no light after startup can be normal while the sensor is still monitoring. Full LED tables for Standard, WiFi 24V, and WiFi battery-only are on Product Support.'
    },
    {
      question: 'Does the sensor prevent all drain backups?',
      answer:
        'No. The sensor helps monitor high water and can shut down the HVAC at high levels, but it does not replace routine HVAC maintenance or guarantee prevention of all drain line issues.'
    },
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
      answer: `${SENSOR_STANDARD_DISPLAY}: the guide starts with solvent-weld install of the Transparent T manifold on the 3/4" drain line (primer and cement only on the condensate line, then into the horizontal openings—not on the manifold or bayonet port), then power and touch testing, then final bayonet mounting and maintenance tips—no portal assignment step. ${SENSOR_WIFI_DISPLAY}: create your monitoring account first, then physical install and ${WIFI_REQUIREMENT} Wi‑Fi pairing, then assign the sensor in the portal. Typical on-site time is about 25–40 minutes for the Standard model and about 15–20 minutes for the WiFi model depending on site conditions.`
    },
    {
      question: 'How do I get pricing as a contractor?',
      answer: 'HVAC professionals can create an account to access contractor pricing and bulk discounts. Sign up with your business information and HVAC license number to get started.'
    },
    {
      question: 'What dashboard features are included?',
      answer: `WiFi Sensor Switch: the monitoring application includes real-time status, smart alerts, customer and property records, service call workflows, and historical data—aligned with your contractor account. The Standard Sensor Switch (Non-WiFi) does not connect to the remote dashboard; it provides local overflow protection and automatic shutdown at 95% water level.`
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
      answer: 'With the WiFi Sensor Switch, property managers and contractors can monitor multiple properties from the dashboard, configure alerts, and manage service workflows across locations. The Standard Sensor Switch (Non-WiFi) does not provide remote multi-property monitoring.'
    },
    {
      question: 'What training is available?',
      answer: 'We provide comprehensive training materials, video tutorials, and support for contractors. Contact our support team to learn about available training resources.'
    }
  ]

  const specificationCompareRows = [
    { label: 'Dimensions', standard: '2" × 3" × 1.5"', wifi: '2" × 3" × 1.5"' },
    { label: 'Power', standard: '24V from air handler', wifi: '24V recommended; Li-ion backup (~2 years) or battery-only supported' },
    { label: 'Connectivity', standard: 'None (local shutdown only)', wifi: `Wi‑Fi (${WIFI_REQUIREMENT} only)` },
    {
      label: 'Integration',
      standard: 'Snap-to-lock bayonet (included T manifold)',
      wifi: 'Snap-to-lock bayonet (included T manifold)'
    },
    { label: 'Typical install time', standard: '~15 minutes', wifi: '~15–20 minutes' },
    { label: 'Compliance', standard: 'IMC 307.2.3', wifi: 'IMC 307.2.3' }
  ]

  // Launch Button Redirect: pause pro/pm account creation during launch
  const salesPhone = SUPPORT_CONTACT.telHref

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
            src="/images/acdw-sensor-hero2-background.png"
            alt="AC Drain Wiz Sensor"
            className="sensor-product-hero-image"
          />
        </div>
        
        <div className="sensor-product-hero-overlay">
          <div className="sensor-product-hero-content-wrapper">
            <div className="sensor-product-hero-info">
              <h1 className="sensor-product-hero-title">
                Stop Overflows: Standard or WiFi Sensor Switch
              </h1>
              <p className="sensor-product-hero-subtitle">
                Two sensor models share the same capacitive overflow protection—automatic AC shutdown at 95% water level. The WiFi Sensor Switch adds remote monitoring, alerts, and contractor dashboard tools on a {WIFI_REQUIREMENT} network. Professional installation required—contact us for a local HVAC Pro or contractor pricing.
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
                    <span>Standard &amp; WiFi models</span>
                  </div>
                  <div className="sensor-product-trust-badge">
                    <BoltIcon className="sensor-product-trust-icon" />
                    <span>WiFi adds remote tools</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Standard vs WiFi — comparison */}
      <section className="sensor-product-variant-compare">
        <div className="sensor-product-variant-compare-inner">
          <h2 className="product-section-title">Choose your Sensor model</h2>
          <p className="sensor-product-section-subtitle sensor-product-variant-compare-intro">
            Both include a Transparent T Manifold for install—you do not need the AC Drain Wiz Mini first. Pick the model that matches how you want to service and monitor the home.
          </p>
          <div className="sensor-product-variant-compare-grid">
            <div className="sensor-product-variant-card">
              <h3 className="sensor-product-variant-card-title">{SENSOR_STANDARD_SHORT}</h3>
              <p className="sensor-product-variant-card-desc">
                Local overflow protection: capacitive sensing, automatic AC shutdown at 95%, no moving parts, fail-safe on power loss. No Wi‑Fi setup and no remote dashboard requirement.
              </p>
              <ul className="sensor-product-variant-card-list">
                <li>
                  <CheckIcon className="sensor-product-variant-card-check" />
                  Ideal when remote monitoring is not required
                </li>
                <li>
                  <CheckIcon className="sensor-product-variant-card-check" />
                  LED: green = active; solid red = touch test or ~95% shutdown
                </li>
              </ul>
            </div>
            <div className="sensor-product-variant-card sensor-product-variant-card-wifi">
              <h3 className="sensor-product-variant-card-title">{SENSOR_WIFI_SHORT}</h3>
              <p className="sensor-product-variant-card-desc">
                Everything the Standard model does on site, plus remote water-level monitoring, email/SMS alerts, contractor app, and service alerts between 50–90% (shutdown still at 95%). 24V HVAC power is strongly recommended; Li-ion backup (~2 years) or battery-only operation is supported with different LED behavior.
              </p>
              <ul className="sensor-product-variant-card-list">
                <li>
                  <CheckIcon className="sensor-product-variant-card-check" />
                  Requires {WIFI_REQUIREMENT} Wi‑Fi for the monitoring dashboard (5 GHz not supported)
                </li>
                <li>
                  <CheckIcon className="sensor-product-variant-card-check" />
                  LED (24V): flashing red = pairing; flashing green = setup; solid green = connected; solid red = high water shutdown —
                  battery-only mode limits LED visibility (see Product Support)
                </li>
                <li>
                  <CheckIcon className="sensor-product-variant-card-check" />
                  Connectivity is Wi‑Fi only—no Bluetooth pairing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition by Customer Type */}
      <section className="sensor-product-value-props">
        <div className="sensor-product-value-props-content">
          <h2 className="product-section-title">Built for Everyone</h2>
          <p className="sensor-product-section-subtitle">
            Whether you're a homeowner, HVAC professional, or property manager, the Sensor family delivers overflow protection—with optional remote monitoring and fleet tools on the WiFi Sensor Switch.
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
          <h2 className="product-section-title">See What's Happening, When It's Happening</h2>
          <p className="sensor-product-section-subtitle">
            With the WiFi Sensor Switch, the monitoring dashboard reflects sensor state in real time. The Standard Sensor Switch (Non-WiFi) focuses on reliable on-site shutdown protection without remote connectivity.
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
          <h2 className="product-section-title">Stop Problems Before They Start</h2>
          <p className="sensor-product-section-subtitle">
            On the WiFi Sensor Switch, proactive service alerts and notifications help you schedule maintenance before shutdown. Both models protect against overflow with automatic AC shutdown at 95% water level.
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
          <h2 className="product-section-title">Manage Every Installation From One Dashboard</h2>
          <p className="sensor-product-section-subtitle">
            WiFi Sensor Switch: turn every install into a recurring touchpoint—monitor sites, schedule service, and review alerts from one dashboard. Standard Sensor Switch installs remain ideal when remote monitoring is not required.
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
          <h2 className="product-section-title">Streamline Your Service Operations</h2>
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
                <li>Configure SMS and email notifications</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Maintenance Optimization */}
      <section className="sensor-product-maintenance">
        <div className="sensor-product-maintenance-content">
          <h2 className="product-section-title">35% Faster Service Calls</h2>
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
      <section className="product-how-it-works">
        <div className="product-how-it-works-content">
          <h2 className="product-section-title">How It Works</h2>
          <p className="sensor-product-section-subtitle">
            From installation to proactive service, the Sensor integrates seamlessly into your workflow.
          </p>
          
          <div className="product-how-it-works-steps">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="sensor-product-how-it-works-step">
                <div className="sensor-product-how-it-works-step-number">
                  {step.number}
                </div>
                <div className="sensor-product-how-it-works-step-content">
                  <step.icon className="product-how-it-works-step-icon" />
                  <h3 className="product-how-it-works-step-title">{step.title}</h3>
                  <p className="product-how-it-works-step-description">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="sensor-product-install-guides">
            <p className="sensor-product-install-guides-eyebrow">Installation resources</p>
            <p className="sensor-product-install-guides-intro">
              Step-by-step contractor guides with screenshots. Standard: T manifold install, then power and test, then final bayonet mount and maintenance tips (includes Mini cross-sell). WiFi: monitoring account, physical install, Wi‑Fi pairing, then customer assignment.
            </p>
            <div className="sensor-product-install-guides-buttons">
              <Link
                to={buildSensorSetupHref({ model: 'standard', step: 1 })}
                className="sensor-product-install-guide-button"
              >
                <BookOpenIcon className="sensor-product-install-guide-button-icon" aria-hidden />
                <span>{SENSOR_STANDARD_SHORT} guide</span>
                <ArrowRightIcon className="sensor-product-install-guide-button-arrow" aria-hidden />
              </Link>
              <Link
                to={buildSensorSetupHref({ model: 'wifi', step: 1 })}
                className="sensor-product-install-guide-button"
              >
                <BookOpenIcon className="sensor-product-install-guide-button-icon" aria-hidden />
                <span>{SENSOR_WIFI_SHORT} guide</span>
                <ArrowRightIcon className="sensor-product-install-guide-button-arrow" aria-hidden />
              </Link>
            </div>
          </div>

          {/* Installation Video Placeholder */}
        {/*  <div className="product-installation-video">*/}
        {/*    <div className="product-installation-video-placeholder">*/}
        {/*      <div className="product-installation-video-placeholder-content">*/}
        {/*        <PlayIcon className="product-installation-video-play-icon" />*/}
        {/*        <h3 className="product-installation-video-title">Watch Installation Video</h3>*/}
        {/*        <p className="product-installation-video-description">*/}
        {/*          See how easy it is to install and set up the AC Drain Wiz Sensor*/}
        {/*        </p>*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        </div>
      </section>

      {/* Specifications */}
      <section className="product-specs">
        <div className="product-specs-content">
          <h2 className="product-section-title">Specifications</h2>
          <p className="sensor-product-spec-compare-lead">
            Side-by-side reference for {SENSOR_STANDARD_SHORT} and {SENSOR_WIFI_SHORT}.
          </p>
          <div className="sensor-product-spec-compare" role="table" aria-label="Sensor specifications by model">
            <div className="sensor-product-spec-compare-row sensor-product-spec-compare-row-head" role="row">
              <div className="sensor-product-spec-compare-cell" role="columnheader">
                {' '}
              </div>
              <div className="sensor-product-spec-compare-cell" role="columnheader">
                {SENSOR_STANDARD_SHORT}
              </div>
              <div className="sensor-product-spec-compare-cell" role="columnheader">
                {SENSOR_WIFI_SHORT}
              </div>
            </div>
            {specificationCompareRows.map((row) => (
              <div key={row.label} className="sensor-product-spec-compare-row" role="row">
                <div className="sensor-product-spec-compare-cell sensor-product-spec-compare-label" role="rowheader">
                  {row.label}
                </div>
                <div className="sensor-product-spec-compare-cell" role="cell">
                  {row.standard}
                </div>
                <div className="sensor-product-spec-compare-cell" role="cell">
                  {row.wifi}
                </div>
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
    </div>
  )
}


