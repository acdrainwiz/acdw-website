/**
 * AC Drain Wiz Mini + Sensor Combo Product Page
 * 
 * Professional complete protection system for HVAC contractors and property managers.
 * Positions the combo as a service differentiation tool for building customer relationships.
 * 
 * Target Audience: HVAC Contractors (primary), Property Managers (secondary)
 * NOT targeting homeowners - they are beneficiaries, not buyers
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  ArrowLeftIcon,
  CheckIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
  BellAlertIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  DevicePhoneMobileIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  WifiIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline'

export function ComboProductPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Launch Button Redirect: pause pro/pm account creation during launch
  // const isHVACPro = isAuthenticated && user?.role === 'hvac_pro'
  // const isPropertyManager = isAuthenticated && user?.role === 'property_manager'
  const salesPhone = 'tel:+15616545237'

  // Comparison features
  const comparisonFeatures = [
    { feature: 'Professional Installation', mini: true, sensor: 'Requires Mini', combo: true },
    { feature: 'Proactive Access', mini: true, sensor: false, combo: true },
    { feature: 'Visual Inspection', mini: true, sensor: false, combo: true },
    { feature: '24/7 Monitoring', mini: false, sensor: true, combo: true },
    { feature: 'Early Warning Alerts', mini: false, sensor: true, combo: true },
    { feature: 'Fleet Dashboard', mini: false, sensor: true, combo: true },
    { feature: 'Manual Service Call Management', mini: false, sensor: true, combo: true },
    { feature: 'Customer Relationship Tool', mini: 'Limited', sensor: true, combo: 'Best' },
    { feature: 'Service Contract Value', mini: 'Good', sensor: 'Better', combo: 'Premium' },
    { feature: 'Complete Protection', mini: false, sensor: false, combo: true },
  ]

  // Contractor benefits
  const contractorBenefits = [
    {
      icon: UserGroupIcon,
      title: 'Build Long-Term Service Relationships',
      description: 'Position yourself as a technology-forward contractor. Offer premium monitoring as part of service contracts and stay connected to customers year-round.',
      points: [
        'Create touchpoints beyond seasonal tune-ups',
        'Position as premium service provider',
        'Improve customer retention rates',
        'Technology creates customer "stickiness"'
      ]
    },
    {
      icon: BellAlertIcon,
      title: 'Proactive Service Opportunities',
      description: 'Dashboard alerts notify you of potential issues. You control all customer communication and scheduling.',
      points: [
        'You contact customers before problems escalate',
        'You schedule maintenance visits based on actual need',
        'You assign technicians efficiently',
        'Position as problem preventer, not just fixer'
      ]
    },
    {
      icon: ClockIcon,
      title: 'Service Efficiency & Customer Experience',
      description: 'Know system status before arriving on-site for faster, more professional service.',
      points: [
        'Pre-visit diagnostics save time',
        'Bring the right tools and parts',
        'Show customers real-time data',
        'Complete visits faster and more professionally'
      ]
    },
    {
      icon: ChartBarIcon,
      title: 'Fleet Monitoring Dashboard',
      description: 'Monitor all your installations from one centralized dashboard.',
      points: [
        'Organize by customer, property, or service route',
        'Review alert history and system performance',
        'Manage technician assignments',
        'Track service call completion'
      ]
    }
  ]

  // Property manager benefits
  const propertyManagerBenefits = [
    {
      icon: BuildingOfficeIcon,
      title: 'Multi-Property Monitoring',
      description: 'Work with your HVAC contractor to monitor all properties from one dashboard.',
      points: [
        'Contractor receives alerts and schedules service',
        'Reduce emergency calls with proactive maintenance',
        'Digital documentation of system health',
        'Professional contractor relationship with full visibility'
      ]
    },
    {
      icon: ShieldCheckIcon,
      title: 'Peace of Mind',
      description: 'Early warnings prevent costly water damage and tenant disruptions.',
      points: [
        'Proactive maintenance reduces tenant complaints',
        'Better budgeting with scheduled (not emergency) maintenance',
        'Professional contractor handles all service coordination',
        'Digital records for property management reporting'
      ]
    }
  ]

  // Installation phases
  const installationPhases = [
    {
      phase: 1,
      title: 'Install AC Drain Wiz Mini',
      duration: '5-10 minutes',
      icon: WrenchScrewdriverIcon,
      steps: [
        'Locate optimal install point on drain line',
        'Measure and mark cut points',
        'Cut drain line with PVC cutter (or hacksaw)',
        'Clean and prep pipe ends',
        'Apply Oatey PVC cement',
        'Install Mini with proper alignment',
        'Allow cure time per cement instructions',
        'Test water flow and verify visibility'
      ]
    },
    {
      phase: 2,
      title: 'Install & Mount Sensor',
      duration: '10-15 minutes',
      icon: CpuChipIcon,
      steps: [
        'Insert battery into sensor (battery model) or connect DC power',
        'Power on and verify LED indicators (LED should blink RED)',
        'Snap sensor onto Mini\'s bayonet port (snap-to-lock)',
        'Verify secure connection'
      ]
    },
    {
      phase: 3,
      title: 'Connect to Wi-Fi & Dashboard',
      duration: '5-10 minutes',
      icon: WifiIcon,
      steps: [
        'Connect phone/tablet to sensor\'s Wi-Fi network ("ACDW Sensor ID")',
        'Automatic redirect to setup page',
        'Select customer\'s home Wi-Fi network',
        'Enter Wi-Fi password',
        'Login to ACDW Monitor dashboard with contractor credentials',
        'Sensor pairs to your dashboard automatically'
      ]
    },
    {
      phase: 4,
      title: 'Assign Sensor to Customer',
      duration: '5-10 minutes',
      icon: ClipboardDocumentListIcon,
      steps: [
        'View customer list in your dashboard',
        'Select the customer for this installation',
        'Select address (if customer has multiple properties)',
        'Confirm sensor assignment',
        'Monitoring begins immediately'
      ]
    }
  ]

  // Dashboard features
  const dashboardFeatures = [
    {
      title: 'Fleet Overview',
      description: 'Real-time status of all installations with color-coded indicators. Filter by customer, property, or service area.',
      icon: ChartBarIcon
    },
    {
      title: 'Alert Management',
      description: 'View active alerts, history, and trends. Configure who receives notifications. Annotate alerts with service notes.',
      icon: BellAlertIcon
    },
    {
      title: 'Service Call Workflow',
      description: 'Manually create service calls from alerts. Contact customers to schedule. Assign technicians. Track completion.',
      icon: ClipboardDocumentListIcon
    },
    {
      title: 'Customer Management',
      description: 'Store contact information, service history, and multiple properties per customer. Track maintenance schedules.',
      icon: UserGroupIcon
    }
  ]

  // Technical specifications
  const miniSpecs = [
    { label: 'Dimensions', value: '5" × 3" × 2"' },
    { label: 'Material', value: 'UV-resistant clear PVC' },
    { label: 'Connection', value: '3/4" PVC drain line' },
    { label: 'Bayonet Port', value: 'Single snap-to-lock' },
    { label: 'Installation Time', value: '5-10 minutes' },
    { label: 'Compliance', value: 'IMC 307.2.5, 307.2.2, 307.2.1.1' }
  ]

  const sensorSpecs = [
    { label: 'Dimensions', value: '2" × 3" × 1.5"' },
    { label: 'Technology', value: 'Capacitive water-level detection' },
    { label: 'Power', value: 'Battery (2-year) or DC + backup' },
    { label: 'Connectivity', value: 'Wi-Fi (2.4 GHz)' },
    { label: 'Alerts', value: 'SMS, Email, Push notifications' },
    { label: 'Installation Time', value: '10-15 minutes' },
    { label: 'Compliance', value: 'IMC 307.2.3' }
  ]

  // FAQ data
  const faqs = [
    {
      question: 'Do service calls get created automatically?',
      answer: 'No. You control all customer communication. When an alert occurs, you receive a notification in your dashboard. You then contact your customer to schedule a service visit and assign a technician. You maintain complete control of the relationship.'
    },
    {
      question: 'Can I install just the Mini now and add the Sensor later?',
      answer: 'Absolutely! The Mini is a standalone product. The Sensor can be added anytime by inserting the battery, verifying LED status, and snapping it onto the Mini\'s bayonet port. Many contractors start with the Mini and upsell monitoring services later.'
    },
    {
      question: 'How do I position this to my customers?',
      answer: 'Position it as a premium service offering: "I\'m installing a monitoring system that lets me keep an eye on your drain line 24/7. If I see any issues developing, I\'ll contact you to schedule maintenance before it becomes a problem." Homeowners love proactive care.'
    },
    {
      question: 'Can property managers access the dashboard?',
      answer: 'You control dashboard access. You can provide property managers view-only access to their properties if desired, but you maintain the contractor relationship and handle all service scheduling and customer communication.'
    },
    {
      question: 'What if the customer doesn\'t have Wi-Fi?',
      answer: 'The Mini works perfectly standalone. For customers without Wi-Fi, install just the Mini. They still get all the benefits of easy drain line maintenance—just without remote monitoring.'
    },
    {
      question: 'How long does the battery last?',
      answer: 'Battery-powered sensors last approximately 2 years under normal use. The dashboard will alert you when battery replacement is needed, giving you another customer touchpoint. DC-powered models have battery backup for uninterrupted monitoring.'
    },
    {
      question: 'Can I include this in my service contracts?',
      answer: 'Yes! Many contractors include monitoring as part of premium service contracts. You can position it as "24/7 drain line protection" or similar. This differentiates your service offerings and justifies premium contract pricing.'
    },
    {
      question: 'What training is provided?',
      answer: 'We provide complete installation videos, customer training guides, and marketing materials. We\'re available for phone support during your first installations. For larger contractors, we can arrange custom training sessions.'
    },
    {
      question: 'Can customers see their own dashboard?',
      answer: 'You decide. You can provide customers view-only access if you want, but it\'s optional. Most contractors prefer to maintain the monitoring relationship themselves and communicate directly with customers when service is needed.'
    },
    {
      question: 'What happens if I get an alert while I\'m on another job?',
      answer: 'Alerts remain in your dashboard until addressed. You can prioritize alerts based on severity and schedule service visits accordingly. Most alerts indicate slow drainage developing, not immediate emergencies, giving you time to schedule appropriately.'
    }
  ]

  return (
    <div className="combo-product-page">
      {/* Back Navigation */}
      <div className="combo-product-back-nav">
        <button
          onClick={() => navigate('/products')}
          className="combo-product-back-button"
        >
          <ArrowLeftIcon className="combo-product-back-icon" />
          Back to Products
        </button>
      </div>

      {/* Hero Section - Full-Width Layout with Image */}
      <section className="combo-product-hero-fullwidth">
        {/* Inline Hero Image */}
        <div className="combo-product-hero-image-container">
          <img
            src="/images/hvac-tech-mini-sensor-product-hero.png"
            alt="AC Drain Wiz Mini + Sensor Complete System"
            className="combo-product-hero-image"
          />
        </div>
        
        {/* Content Overlay */}
        <div className="combo-product-hero-overlay">
          <div className="combo-product-hero-content-wrapper">
            <div className="combo-product-hero-info">
              <h1 className="combo-product-hero-title">
                The Professional's Complete AC Drain Line Protection System
              </h1>
              <p className="combo-product-hero-subtitle">
                Install the best. Monitor everything. Build lasting customer relationships with proactive maintenance they can see working.
              </p>

              {/* Value Props */}
              <div className="combo-product-hero-value-props">
                <div className="combo-product-hero-value-prop">
                  <CheckIcon className="combo-product-hero-value-icon" />
                  <span>Professional-grade installation creates immediate value</span>
                </div>
                <div className="combo-product-hero-value-prop">
                  <CheckIcon className="combo-product-hero-value-icon" />
                  <span>24/7 monitoring shows continuous protection</span>
                </div>
                <div className="combo-product-hero-value-prop">
                  <CheckIcon className="combo-product-hero-value-icon" />
                  <span>Transform one-time service into ongoing relationships</span>
                </div>
                <div className="combo-product-hero-value-prop">
                  <CheckIcon className="combo-product-hero-value-icon" />
                  <span>Differentiate your business with smart home technology</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="combo-product-hero-ctas">
                {/* Launch Button Redirect */}
                <a
                  href={salesPhone}
                  className="combo-product-cta-primary"
                >
                  Call (561) 654-5237
                </a>
                {/* Launch Button Redirect */}
                <button
                  onClick={() => navigate('/contact?type=sales')}
                  className="combo-product-cta-secondary"
                >
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Combo Section */}
      <section className="combo-product-why-combo">
        <div className="combo-product-why-combo-content">
          <h2 className="combo-product-section-title">Why Choose the Complete System?</h2>
          <p className="combo-product-section-subtitle">
            The Mini gives your customers instant access. The Sensor gives you visibility into their system health. 
            Together, they position you as their trusted HVAC technology partner.
          </p>

          {/* Comparison - Desktop Table / Mobile Cards */}
          {/* Desktop Table */}
          <div className="combo-product-comparison-table-wrapper">
            <table className="combo-product-comparison-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Mini Only</th>
                  <th>Sensor Only</th>
                  <th className="combo-product-comparison-highlight">Mini + Sensor</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((item, index) => (
                  <tr key={index}>
                    <td className="combo-product-comparison-feature">{item.feature}</td>
                    <td className="combo-product-comparison-value">
                      {typeof item.mini === 'boolean' ? (
                        item.mini ? <CheckIcon className="combo-product-comparison-check" /> : <span className="combo-product-comparison-no">—</span>
                      ) : (
                        item.mini
                      )}
                    </td>
                    <td className="combo-product-comparison-value">
                      {typeof item.sensor === 'boolean' ? (
                        item.sensor ? <CheckIcon className="combo-product-comparison-check" /> : <span className="combo-product-comparison-no">—</span>
                      ) : (
                        item.sensor
                      )}
                    </td>
                    <td className="combo-product-comparison-value combo-product-comparison-highlight">
                      {typeof item.combo === 'boolean' ? (
                        item.combo ? <CheckIcon className="combo-product-comparison-check-highlight" /> : <span className="combo-product-comparison-no">—</span>
                      ) : (
                        <strong>{item.combo}</strong>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="combo-product-comparison-cards">
            {/* Mini Only Card */}
            <div className="combo-product-comparison-card">
              <div className="combo-product-comparison-card-header">
                <h3 className="combo-product-comparison-card-title">Mini Only</h3>
              </div>
              <div className="combo-product-comparison-card-features">
                {comparisonFeatures.map((item, index) => (
                  <div key={index} className="combo-product-comparison-card-feature">
                    <span className="combo-product-comparison-card-feature-name">{item.feature}</span>
                    <span className="combo-product-comparison-card-feature-value">
                      {typeof item.mini === 'boolean' ? (
                        item.mini ? <CheckIcon className="combo-product-comparison-card-check" /> : <span className="combo-product-comparison-card-no">—</span>
                      ) : (
                        <span className="combo-product-comparison-card-text">{item.mini}</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sensor Only Card */}
            <div className="combo-product-comparison-card">
              <div className="combo-product-comparison-card-header">
                <h3 className="combo-product-comparison-card-title">Sensor Only</h3>
              </div>
              <div className="combo-product-comparison-card-features">
                {comparisonFeatures.map((item, index) => (
                  <div key={index} className="combo-product-comparison-card-feature">
                    <span className="combo-product-comparison-card-feature-name">{item.feature}</span>
                    <span className="combo-product-comparison-card-feature-value">
                      {typeof item.sensor === 'boolean' ? (
                        item.sensor ? <CheckIcon className="combo-product-comparison-card-check" /> : <span className="combo-product-comparison-card-no">—</span>
                      ) : (
                        <span className="combo-product-comparison-card-text">{item.sensor}</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Combo Card - Highlighted */}
            <div className="combo-product-comparison-card combo-product-comparison-card-highlight">
              <div className="combo-product-comparison-card-header">
                <h3 className="combo-product-comparison-card-title">Mini + Sensor</h3>
                <span className="combo-product-comparison-card-badge">Complete System</span>
              </div>
              <div className="combo-product-comparison-card-features">
                {comparisonFeatures.map((item, index) => (
                  <div key={index} className="combo-product-comparison-card-feature">
                    <span className="combo-product-comparison-card-feature-name">{item.feature}</span>
                    <span className="combo-product-comparison-card-feature-value">
                      {typeof item.combo === 'boolean' ? (
                        item.combo ? <CheckIcon className="combo-product-comparison-card-check-highlight" /> : <span className="combo-product-comparison-card-no">—</span>
                      ) : (
                        <strong className="combo-product-comparison-card-text">{item.combo}</strong>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For HVAC Contractors */}
      <section className="combo-product-contractors">
        <div className="combo-product-contractors-content">
          <h2 className="combo-product-section-title">For HVAC Contractors - Your Service Differentiation Tool</h2>
          <p className="combo-product-section-subtitle">
            Position yourself as a technology leader and build lasting customer relationships
          </p>

          <div className="combo-product-benefits-grid">
            {contractorBenefits.map((benefit, index) => (
              <div key={index} className="combo-product-benefit-card">
                <benefit.icon className="combo-product-benefit-icon" />
                <h3 className="combo-product-benefit-title">{benefit.title}</h3>
                <p className="combo-product-benefit-description">{benefit.description}</p>
                <ul className="combo-product-benefit-points">
                  {benefit.points.map((point, i) => (
                    <li key={i} className="combo-product-benefit-point">
                      <CheckIcon className="combo-product-benefit-point-icon" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="combo-product-section-cta">
            {/* Launch Button Redirect */}
            <a
              href={salesPhone}
              className="combo-product-cta-primary"
            >
              Call (561) 654-5237
            </a>
            {/* Launch Button Redirect */}
            <button
              onClick={() => navigate('/contact?type=sales')}
              className="combo-product-cta-secondary"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* For Property Managers */}
      <section className="combo-product-property-managers">
        <div className="combo-product-property-managers-content">
          <h2 className="combo-product-section-title">For Property Managers - Professional Contractor Partnership</h2>
          <p className="combo-product-section-subtitle">
            Work with your trusted HVAC contractor to protect all your properties
          </p>

          <div className="combo-product-pm-benefits-grid">
            {propertyManagerBenefits.map((benefit, index) => (
              <div key={index} className="combo-product-pm-benefit-card">
                <benefit.icon className="combo-product-pm-benefit-icon" />
                <h3 className="combo-product-pm-benefit-title">{benefit.title}</h3>
                <p className="combo-product-pm-benefit-description">{benefit.description}</p>
                <ul className="combo-product-pm-benefit-points">
                  {benefit.points.map((point, i) => (
                    <li key={i} className="combo-product-pm-benefit-point">
                      <CheckIcon className="combo-product-pm-benefit-point-icon" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="combo-product-section-cta">
            {/* Launch Button Redirect */}
            <a
              href={salesPhone}
              className="combo-product-cta-primary"
            >
              Call (561) 654-5237
            </a>
            {/* Launch Button Redirect */}
            <button
              onClick={() => navigate('/contact?type=sales')}
              className="combo-product-cta-secondary"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Installation Process */}
      <section className="combo-product-installation">
        <div className="combo-product-installation-content">
          <h2 className="combo-product-section-title">Professional Installation Process</h2>
          <p className="combo-product-section-subtitle">
            Complete installation in 25-45 minutes with our step-by-step process
          </p>

          <div className="combo-product-installation-phases">
            {installationPhases.map((phase) => (
              <div key={phase.phase} className="combo-product-installation-phase">
                <div className="combo-product-installation-phase-header">
                  <div className="combo-product-installation-phase-number">
                    Phase {phase.phase}
                  </div>
                  <phase.icon className="combo-product-installation-phase-icon" />
                  <div className="combo-product-installation-phase-info">
                    <h3 className="combo-product-installation-phase-title">{phase.title}</h3>
                    <span className="combo-product-installation-phase-duration">{phase.duration}</span>
                  </div>
                </div>
                <ol className="combo-product-installation-phase-steps">
                  {phase.steps.map((step, index) => (
                    <li key={index} className="combo-product-installation-phase-step">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          {/* Monitoring Workflow */}
          <div className="combo-product-monitoring-workflow">
            <h3 className="combo-product-monitoring-workflow-title">Monitoring Workflow - You Control the Relationship</h3>
            <div className="combo-product-monitoring-workflow-steps">
              <div className="combo-product-monitoring-workflow-step">
                <ChartBarIcon className="combo-product-monitoring-workflow-icon" />
                <span>Daily Monitoring</span>
              </div>
              <div className="combo-product-monitoring-workflow-arrow">→</div>
              <div className="combo-product-monitoring-workflow-step">
                <BellAlertIcon className="combo-product-monitoring-workflow-icon" />
                <span>Alert Detected</span>
              </div>
              <div className="combo-product-monitoring-workflow-arrow">→</div>
              <div className="combo-product-monitoring-workflow-step">
                <DevicePhoneMobileIcon className="combo-product-monitoring-workflow-icon" />
                <span>You Contact Customer</span>
              </div>
              <div className="combo-product-monitoring-workflow-arrow">→</div>
              <div className="combo-product-monitoring-workflow-step">
                <ClipboardDocumentListIcon className="combo-product-monitoring-workflow-icon" />
                <span>You Schedule Service</span>
              </div>
              <div className="combo-product-monitoring-workflow-arrow">→</div>
              <div className="combo-product-monitoring-workflow-step">
                <CheckIcon className="combo-product-monitoring-workflow-icon" />
                <span>Problem Resolved</span>
              </div>
            </div>
            <p className="combo-product-monitoring-workflow-note">
              <strong>Important:</strong> Service calls are NOT automated. You maintain full control of customer communication and scheduling.
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Features */}
      <section className="combo-product-dashboard">
        <div className="combo-product-dashboard-content">
          <h2 className="combo-product-section-title">Dashboard & Service Call Management</h2>
          <p className="combo-product-section-subtitle">
            Powerful tools to manage your entire customer base from one centralized dashboard
          </p>

          <div className="combo-product-dashboard-features-grid">
            {dashboardFeatures.map((feature, index) => (
              <div key={index} className="combo-product-dashboard-feature">
                <feature.icon className="combo-product-dashboard-feature-icon" />
                <h3 className="combo-product-dashboard-feature-title">{feature.title}</h3>
                <p className="combo-product-dashboard-feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="combo-product-specs">
        <div className="combo-product-specs-content">
          <h2 className="combo-product-section-title">Technical Specifications</h2>
          
          <div className="combo-product-specs-grid">
            {/* Mini Specs */}
            <div className="combo-product-specs-card">
              <h3 className="combo-product-specs-card-title">AC Drain Wiz Mini</h3>
              <div className="combo-product-specs-list">
                {miniSpecs.map((spec, index) => (
                  <div key={index} className="combo-product-spec-item">
                    <span className="combo-product-spec-label">{spec.label}</span>
                    <span className="combo-product-spec-value">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sensor Specs */}
            <div className="combo-product-specs-card">
              <h3 className="combo-product-specs-card-title">AC Drain Wiz Sensor</h3>
              <div className="combo-product-specs-list">
                {sensorSpecs.map((spec, index) => (
                  <div key={index} className="combo-product-spec-item">
                    <span className="combo-product-spec-label">{spec.label}</span>
                    <span className="combo-product-spec-value">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Total Installation Time */}
          <div className="combo-product-specs-total">
            <ClockIcon className="combo-product-specs-total-icon" />
            <div className="combo-product-specs-total-info">
              <span className="combo-product-specs-total-label">Total Installation Time:</span>
              <span className="combo-product-specs-total-value">25-45 minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="combo-product-faq">
        <div className="combo-product-faq-content">
          <h2 className="combo-product-section-title">Frequently Asked Questions</h2>
          <p className="combo-product-faq-subtitle">
            Have questions? We've got answers. Can't find what you're looking for?{' '}
            <button
              onClick={() => navigate('/contact?type=support')}
              className="combo-product-faq-contact-link"
            >
              Contact our support team
            </button>
          </p>
          <div className="combo-product-faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="combo-product-faq-item">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="combo-product-faq-question"
                  aria-expanded={openFaq === index}
                >
                  <span>{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUpIcon className="combo-product-faq-icon" />
                  ) : (
                    <ChevronDownIcon className="combo-product-faq-icon" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="combo-product-faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="combo-product-final-cta">
        <div className="combo-product-final-cta-content">
          <h2 className="combo-product-final-cta-title">
            Ready to Differentiate Your HVAC Business?
          </h2>
          <p className="combo-product-final-cta-subtitle">
            Join contractors nationwide who are building lasting customer relationships with the AC Drain Wiz Complete Protection System.
          </p>
          
          {/* CTAs */}
          <div className="combo-product-final-cta-buttons">
            {/* Launch Button Redirect */}
            <a
              href={salesPhone}
              className="combo-product-cta-primary"
            >
              Call (561) 654-5237
            </a>
            {/* Launch Button Redirect */}
            <button
              onClick={() => navigate('/contact?type=sales')}
              className="combo-product-cta-secondary"
            >
              Contact Sales
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="combo-product-trust-indicators">
            <div className="combo-product-trust-indicator">
              <CheckIcon className="combo-product-trust-icon" />
              <span>IMC Code Compliant</span>
            </div>
            <div className="combo-product-trust-indicator">
              <CheckIcon className="combo-product-trust-icon" />
              <span>Made in USA</span>
            </div>
            <div className="combo-product-trust-indicator">
              <CheckIcon className="combo-product-trust-icon" />
              <span>2-Year Warranty</span>
            </div>
            <div className="combo-product-trust-indicator">
              <CheckIcon className="combo-product-trust-icon" />
              <span>Professional Support</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


