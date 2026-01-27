import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  WrenchScrewdriverIcon, 
  QuestionMarkCircleIcon, 
  ShieldCheckIcon, 
  BookOpenIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export function SupportPage() {
  const location = useLocation()
  const [openSection, setOpenSection] = useState<string | null>('installation')

  // Handle hash navigation on mount
  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.substring(1) // Remove the '#'
      if (['installation', 'product-support', 'warranty-returns', 'technical-resources', 'contact'].includes(sectionId)) {
        setOpenSection(sectionId)
        // Scroll to section after a brief delay to ensure it's rendered
        setTimeout(() => {
          const element = document.getElementById(sectionId)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
      }
    }
  }, [location.hash])

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <div className="support-page-container">
      <div className="container py-16">
        {/* Header */}
        <div className="support-page-header">
          <h1 className="heading-1 mb-6">Support Center</h1>
          <p className="text-large max-w-3xl mx-auto">
            Find answers to common questions, installation guides, warranty information, and get the help you need.
          </p>
        </div>

        {/* Quick Help Cards */}
        <div className="support-quick-help-cards">
          <button
            onClick={() => {
              setOpenSection('installation')
              document.getElementById('installation')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
            className="support-help-card"
          >
            <WrenchScrewdriverIcon className="support-help-card-icon" />
            <h3 className="support-help-card-title">Installation & Setup</h3>
            <p className="support-help-card-description">Step-by-step guides and video tutorials</p>
          </button>

          <button
            onClick={() => {
              setOpenSection('product-support')
              document.getElementById('product-support')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
            className="support-help-card"
          >
            <QuestionMarkCircleIcon className="support-help-card-icon" />
            <h3 className="support-help-card-title">Product Support</h3>
            <p className="support-help-card-description">Troubleshooting and technical help</p>
          </button>

          <button
            onClick={() => {
              setOpenSection('warranty-returns')
              document.getElementById('warranty-returns')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
            className="support-help-card"
          >
            <ShieldCheckIcon className="support-help-card-icon" />
            <h3 className="support-help-card-title">Warranty & Returns</h3>
            <p className="support-help-card-description">Warranty coverage and return policy</p>
          </button>
        </div>

        {/* Support Sections */}
        <div className="support-section-container">
          {/* Installation & Setup */}
          <div id="installation" className="support-accordion-section">
            <button
              onClick={() => toggleSection('installation')}
              className="support-accordion-button"
            >
              <div className="support-accordion-header">
                <WrenchScrewdriverIcon className="support-accordion-icon" />
                <h2 className="support-accordion-title">Installation & Setup</h2>
              </div>
              {openSection === 'installation' ? (
                <ChevronUpIcon className="support-accordion-chevron" />
              ) : (
                <ChevronDownIcon className="support-accordion-chevron" />
              )}
            </button>
            {openSection === 'installation' && (
              <div className="support-accordion-content">
                <div className="support-content-section">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Installation Guides</h3>
                    <p className="text-gray-600 mb-4">
                      AC Drain Wiz products are designed for easy installation. Most homeowners complete installation in 5 minutes or less using basic tools.
                    </p>
                    <div className="support-resource-grid">
                      <div className="support-resource-card">
                        <DocumentTextIcon className="support-resource-icon" />
                        <h4 className="support-resource-title">ACDW Mini Installation</h4>
                        <p className="support-resource-description">Step-by-step PDF guide for installing the Mini model</p>
                        <button className="support-resource-link">
                          Download PDF →
                        </button>
                      </div>
                      <div className="support-resource-card">
                        <VideoCameraIcon className="support-resource-icon" />
                        <h4 className="support-resource-title">Video Tutorial</h4>
                        <p className="support-resource-description">Watch our installation video walkthrough</p>
                        <button className="support-resource-link">
                          Watch Video →
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Installation Steps</h3>
                    <ol className="support-step-list">
                      <li className="support-step-item">
                        <span className="support-step-number">1</span>
                        <div>
                          <strong className="text-gray-900">Cut your existing drain line</strong>
                          <p className="text-sm text-gray-600">Measure and cut a section of your 3/4" PVC drain line to accommodate the AC Drain Wiz unit. Use a PVC pipe cutter or hacksaw for a clean cut.</p>
                        </div>
                      </li>
                      <li className="support-step-item">
                        <span className="support-step-number">2</span>
                        <div>
                          <strong className="text-gray-900">Solvent-weld in place with Oatey PVC cement</strong>
                          <p className="text-sm text-gray-600">Use PVC primer and cement to securely attach AC Drain Wiz to your drain line.</p>
                        </div>
                      </li>
                      <li className="support-step-item">
                        <span className="support-step-number">3</span>
                        <div>
                          <strong className="text-gray-900">Verify operation</strong>
                          <p className="text-sm text-gray-600">Turn on your AC unit and check for proper drainage. Monitor for 24 hours to ensure no leaks.</p>
                        </div>
                      </li>
                    </ol>
                  </div>

                  <div className="support-info-box">
                    <p className="support-info-text">
                      <strong>Need professional installation?</strong> Contact us at{' '}
                      <a href="tel:+12342237246" className="text-blue-600 hover:text-blue-700">(234) 23 DRAIN</a>{' '}
                      or{' '}
                      <Link to="/contact?type=installer" className="text-blue-600 hover:text-blue-700">
                        find a certified installer
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Product Support */}
          <div id="product-support" className="support-accordion-section">
            <button
              onClick={() => toggleSection('product-support')}
              className="support-accordion-button"
            >
              <div className="support-accordion-header">
                <QuestionMarkCircleIcon className="support-accordion-icon" />
                <h2 className="support-accordion-title">Product Support</h2>
              </div>
              {openSection === 'product-support' ? (
                <ChevronUpIcon className="support-accordion-chevron" />
              ) : (
                <ChevronDownIcon className="support-accordion-chevron" />
              )}
            </button>
            {openSection === 'product-support' && (
              <div className="support-accordion-content">
                <div className="support-content-section">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Common Questions</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Will AC Drain Wiz work with my existing AC system?</h4>
                        <p className="text-gray-600 text-sm">
                          AC Drain Wiz works with standard 3/4" PVC drain lines used in most residential and light commercial systems. 
                          If your system uses a different size, contact us for guidance.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">How often do I need to clean my drain line?</h4>
                        <p className="text-gray-600 text-sm">
                          We recommend checking your drain line every 3-6 months. If you have the Sensor, it will alert you when maintenance is needed.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">What's the difference between Mini, Sensor, and Core 1.0?</h4>
                        <p className="text-gray-600 text-sm">
                          Mini is our compact flagship for space-constrained areas. Sensor adds smart monitoring and alerts. 
                          Core 1.0 is the proven foundation model. See our{' '}
                          <Link to="/products" className="text-blue-600 hover:text-blue-700">product comparison</Link> for details.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Troubleshooting</h3>
                    <div className="space-y-3">
                      <div className="support-troubleshooting-item support-troubleshooting-item-warning">
                        <h4 className="support-troubleshooting-title">Water not draining properly</h4>
                        <ul className="support-troubleshooting-list">
                          <li>Check for kinks in the drain line</li>
                          <li>Ensure proper slope (minimum 1/4" per foot)</li>
                          <li>Verify the unit is properly seated and sealed</li>
                          <li>Check for clogs downstream from the unit</li>
                        </ul>
                      </div>
                      <div className="support-troubleshooting-item support-troubleshooting-item-error">
                        <h4 className="support-troubleshooting-title">Leaks at connections</h4>
                        <ul className="support-troubleshooting-list">
                          <li>Tighten connections and check for proper seating</li>
                          <li>Verify solvent-weld joints are fully cured (24 hours)</li>
                          <li>Check for cracks or damage to PVC fittings</li>
                        </ul>
                      </div>
                      <div className="support-troubleshooting-item support-troubleshooting-item-info">
                        <h4 className="support-troubleshooting-title">Sensor not connecting</h4>
                        <ul className="support-troubleshooting-list">
                          <li>Check power connection and LED indicators</li>
                          <li>Verify Wi-Fi credentials are correct</li>
                          <li>Ensure sensor is within range of your router</li>
                          <li>Try resetting the sensor and re-pairing</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 mb-3">
                      <strong>Still need help?</strong> Our technical support team is available to assist you.
                    </p>
                    <div className="support-action-buttons">
                      <a 
                        href="tel:+12342237246" 
                        className="support-action-button-primary"
                      >
                        <PhoneIcon className="support-action-icon" />
                        Call (234) 23 DRAIN
                      </a>
                      <Link
                        to="/contact?type=support"
                        className="support-action-button-secondary"
                      >
                        <EnvelopeIcon className="support-action-icon" />
                        Email Support
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Warranty & Returns */}
          <div id="warranty-returns" className="support-accordion-section">
            <button
              onClick={() => toggleSection('warranty-returns')}
              className="support-accordion-button"
            >
              <div className="support-accordion-header">
                <ShieldCheckIcon className="support-accordion-icon" />
                <h2 className="support-accordion-title">Warranty & Returns</h2>
              </div>
              {openSection === 'warranty-returns' ? (
                <ChevronUpIcon className="support-accordion-chevron" />
              ) : (
                <ChevronDownIcon className="support-accordion-chevron" />
              )}
            </button>
            {openSection === 'warranty-returns' && (
              <div className="support-accordion-content">
                <div className="support-content-section">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Warranty Coverage</h3>
                    <p className="text-gray-600 mb-4">
                      All AC Drain Wiz products come with our satisfaction guarantee and industry-leading warranty.
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Limited Lifetime Warranty</h4>
                          <p className="text-sm text-gray-700">
                            AC Drain Wiz products are covered by a limited lifetime warranty against defects in materials and workmanship. 
                            This warranty covers the original purchaser and is non-transferable.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>What's Covered:</strong></p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Defects in materials and workmanship</li>
                        <li>Premature wear under normal use conditions</li>
                        <li>Manufacturing defects</li>
                      </ul>
                      <p className="mt-3"><strong>What's Not Covered:</strong></p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Damage from improper installation</li>
                        <li>Damage from misuse or abuse</li>
                        <li>Normal wear and tear</li>
                        <li>Damage from external causes (fire, flood, etc.)</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Return Policy</h3>
                    <div className="space-y-3">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">30-Day Money-Back Guarantee</h4>
                        <p className="text-sm text-gray-600">
                          If you're not completely satisfied with your purchase, you can return it within 30 days of delivery 
                          for a full refund (minus shipping costs).
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Return Process</h4>
                        <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                          <li>Contact us at <a href="mailto:info@acdrainwiz.com" className="text-blue-600">info@acdrainwiz.com</a> or call (234) 23 DRAIN</li>
                          <li>Provide your order number and reason for return</li>
                          <li>We'll send you a return authorization and shipping label</li>
                          <li>Package the item securely and ship it back</li>
                          <li>Once received, we'll process your refund within 5-7 business days</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      <strong>Questions about warranty or returns?</strong> Contact us at{' '}
                      <a href="tel:+12342237246" className="text-blue-600 hover:text-blue-700">(234) 23 DRAIN</a>{' '}
                      or{' '}
                      <Link to="/contact?type=support" className="text-blue-600 hover:text-blue-700">
                        submit a support request
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Technical Resources */}
          <div id="technical-resources" className="support-accordion-section">
            <button
              onClick={() => toggleSection('technical-resources')}
              className="support-accordion-button"
            >
              <div className="support-accordion-header">
                <BookOpenIcon className="support-accordion-icon" />
                <h2 className="support-accordion-title">Technical Resources</h2>
              </div>
              {openSection === 'technical-resources' ? (
                <ChevronUpIcon className="support-accordion-chevron" />
              ) : (
                <ChevronDownIcon className="support-accordion-chevron" />
              )}
            </button>
            {openSection === 'technical-resources' && (
              <div className="support-accordion-content">
                <div className="support-content-section">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Documentation</h3>
                    <div className="support-resource-grid">
                      <div className="support-resource-card">
                        <DocumentTextIcon className="support-resource-icon" />
                        <h4 className="support-resource-title">Product Specifications</h4>
                        <p className="support-resource-description">Detailed technical specifications for all products</p>
                        <button className="support-resource-link">
                          Download PDF →
                        </button>
                      </div>
                      <div className="support-resource-card">
                        <DocumentTextIcon className="support-resource-icon" />
                        <h4 className="support-resource-title">Compliance Documentation</h4>
                        <p className="support-resource-description">IMC code compliance and certification documents</p>
                        <Link to="/compliance" className="support-resource-link">
                          View Compliance →
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Resources</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <CheckIcon className="h-5 w-5 text-green-600 mr-3" />
                        <Link to="/products" className="text-gray-700 hover:text-blue-600">
                          Product Comparison Guide
                        </Link>
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="h-5 w-5 text-green-600 mr-3" />
                        <Link to="/compliance" className="text-gray-700 hover:text-blue-600">
                          Code Compliance Information
                        </Link>
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="h-5 w-5 text-green-600 mr-3" />
                        <a href="https://monitor.acdrainwiz.com/login" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600">
                          Sensor Monitoring Portal
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contact Support */}
          <div id="contact" className="support-accordion-section">
            <button
              onClick={() => toggleSection('contact')}
              className="support-accordion-button"
            >
              <div className="support-accordion-header">
                <EnvelopeIcon className="support-accordion-icon" />
                <h2 className="support-accordion-title">Contact Support</h2>
              </div>
              {openSection === 'contact' ? (
                <ChevronUpIcon className="support-accordion-chevron" />
              ) : (
                <ChevronDownIcon className="support-accordion-chevron" />
              )}
            </button>
            {openSection === 'contact' && (
              <div className="support-accordion-content">
                <div className="support-content-section">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Get in Touch</h3>
                    <p className="text-gray-600 mb-4">
                      Our support team is here to help with any questions or issues you may have.
                    </p>
                    <div className="support-contact-grid">
                      <div className="support-contact-card">
                        <PhoneIcon className="support-contact-icon" />
                        <h4 className="support-contact-title">Phone Support</h4>
                        <p className="support-contact-details">Monday - Friday, 8 AM - 5 PM EST</p>
                        <a href="tel:+12342237246" className="support-contact-link">
                          (234) 23 DRAIN
                        </a>
                      </div>
                      <div className="support-contact-card">
                        <EnvelopeIcon className="support-contact-icon" />
                        <h4 className="support-contact-title">Email Support</h4>
                        <p className="support-contact-details">We respond within 24 hours</p>
                        <a href="mailto:info@acdrainwiz.com" className="support-contact-link">
                          info@acdrainwiz.com
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="support-info-box">
                    <p className="support-info-text mb-3">
                      <strong>Prefer to submit a support request?</strong> Use our contact form to get detailed help.
                    </p>
                    <Link
                      to="/contact?type=support"
                      className="support-action-button-primary"
                    >
                      Submit Support Request
                      <ArrowRightIcon className="support-action-icon ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

