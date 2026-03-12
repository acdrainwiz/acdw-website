import { Link } from 'react-router-dom'
import { 
  ArrowLeftIcon,
  QuestionMarkCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  WrenchScrewdriverIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline'

export function ProductSupportPage() {
  return (
    <div className="support-section-container">
      <div className="container py-16">
        {/* Breadcrumb */}
        <div className="support-section-breadcrumb">
          <Link to="/support" className="support-section-breadcrumb-link">
            Support Center
          </Link>
          <span className="support-section-breadcrumb-separator">/</span>
          <span className="support-section-breadcrumb-current">Product Support</span>
        </div>

        {/* Header */}
        <div className="support-section-header">
          <Link 
            to="/support" 
            className="support-section-back-link"
          >
            <ArrowLeftIcon className="support-section-back-icon" />
            <span>Back to Support</span>
          </Link>
          <div className="support-section-header-content">
            <QuestionMarkCircleIcon className="support-section-header-icon" />
            <div>
              <h1 className="support-section-title">Product Support</h1>
              <p className="support-section-subtitle">
                Troubleshooting guides, FAQs, and technical help for your AC Drain Wiz products.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="support-section-content">

          {/* Common Questions */}
          <div className="support-section-faq">
            <h2 className="support-section-section-title">Common Questions</h2>
            <div className="support-section-faq-list">

              <div className="support-section-faq-item">
                <h3 className="support-section-faq-question">Will AC Drain Wiz work with my existing AC system?</h3>
                <p className="support-section-faq-answer">
                  The AC Drain Wiz Mini works with standard 3/4" PVC drain lines used in most residential and light 
                  commercial systems. The Sensor pairs exclusively with the Mini via a snap-to-lock bayonet mount and 
                  requires a Wi-Fi connection (2.4 GHz) for the monitoring dashboard. If your drain line uses a 
                  non-standard size, contact us for guidance.
                </p>
              </div>

              <div className="support-section-faq-item">
                <h3 className="support-section-faq-question">How often do I need to clean my drain line?</h3>
                <p className="support-section-faq-answer">
                  We recommend checking your drain line every 3–6 months. If you have the Sensor, it monitors the 
                  line continuously and will send an alert when maintenance is needed — so you don't have to guess 
                  or schedule blind.
                </p>
              </div>

              <div className="support-section-faq-item">
                <h3 className="support-section-faq-question">What's the difference between the Mini and the Sensor?</h3>
                <p className="support-section-faq-answer">
                  The Mini is the core drain line maintenance device — it clears clogs and prevents backups. The 
                  Sensor attaches to the Mini and adds real-time monitoring, smart alerts, and cloud dashboard 
                  visibility so you always know the status of your drain line. See our{' '}
                  <Link to="/products" className="support-section-link">product comparison</Link> for full details.
                </p>
              </div>

              <div className="support-section-faq-item">
                <h3 className="support-section-faq-question">Can the Sensor work without Wi-Fi?</h3>
                <p className="support-section-faq-answer">
                  Yes. The Sensor is available in both a Wi-Fi model and a Non-Wi-Fi model. The Wi-Fi model connects 
                  to your network and syncs data to the cloud monitoring dashboard. The Non-Wi-Fi model pairs locally 
                  via Bluetooth and works without a network connection, though real-time remote monitoring and push 
                  alerts require the Wi-Fi model.
                </p>
              </div>

              <div className="support-section-faq-item">
                <h3 className="support-section-faq-question">What do the Sensor LED indicator lights mean?</h3>
                <p className="support-section-faq-answer">
                  The LED gives you at-a-glance status directly at the device:
                </p>
                <div className="support-led-table">
                  <div className="support-led-row">
                    <span className="support-led-indicator support-led-green" />
                    <div>
                      <span className="support-led-label">Solid Green — </span>
                      <span className="support-led-desc">Normal. System operating correctly, no issues detected.</span>
                    </div>
                  </div>
                  <div className="support-led-row">
                    <span className="support-led-indicator support-led-yellow" />
                    <div>
                      <span className="support-led-label">Blinking Yellow — </span>
                      <span className="support-led-desc">Warning. Early signs of slowed flow or a developing clog. Schedule maintenance soon.</span>
                    </div>
                  </div>
                  <div className="support-led-row">
                    <span className="support-led-indicator support-led-red" />
                    <div>
                      <span className="support-led-label">Solid / Blinking Red — </span>
                      <span className="support-led-desc">Critical. Overflow risk detected. Immediate attention required.</span>
                    </div>
                  </div>
                  <div className="support-led-row">
                    <span className="support-led-indicator support-led-blue" />
                    <div>
                      <span className="support-led-label">Blinking Blue — </span>
                      <span className="support-led-desc">Pairing mode. Sensor is ready to connect to Wi-Fi or pair via Bluetooth.</span>
                    </div>
                  </div>
                  <div className="support-led-row">
                    <span className="support-led-indicator support-led-off" />
                    <div>
                      <span className="support-led-label">No Light — </span>
                      <span className="support-led-desc">No power. Check the battery charge or DC power connection.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="support-section-faq-item">
                <h3 className="support-section-faq-question">Why am I not receiving Sensor alert notifications?</h3>
                <p className="support-section-faq-answer">
                  First, verify that notifications are enabled in your device's settings for the monitoring app or 
                  browser. Then confirm your alert preferences (SMS, email, push) are configured in the dashboard 
                  under account settings. If your Sensor shows as offline, alerts cannot be delivered — resolve 
                  connectivity first.
                </p>
              </div>

              <div className="support-section-faq-item">
                <h3 className="support-section-faq-question">Where do I access the Sensor monitoring portal?</h3>
                <p className="support-section-faq-answer">
                  The monitoring portal is available at{' '}
                  <a 
                    href="https://monitor.acdrainwiz.com/login" 
                    className="support-section-link" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    monitor.acdrainwiz.com
                  </a>. Log in with the credentials created during Sensor setup. If you haven't set up an account 
                  yet, start with the{' '}
                  <Link to="/sensor-setup" className="support-section-link">Sensor Setup Guide</Link>.
                </p>
              </div>

            </div>
          </div>

          {/* Troubleshooting */}
          <div className="support-section-troubleshooting">
            <h2 className="support-section-section-title">Troubleshooting</h2>

            {/* AC Drain Wiz Mini */}
            <div className="support-product-group">
              <div className="support-product-group-header">
                <WrenchScrewdriverIcon className="support-product-group-icon" />
                <h3 className="support-product-group-title">AC Drain Wiz Mini</h3>
              </div>
              <div className="support-section-troubleshooting-list">
                <div className="support-troubleshooting-item support-troubleshooting-item-warning">
                  <h4 className="support-troubleshooting-title">Water not draining properly</h4>
                  <ul className="support-troubleshooting-list">
                    <li>Check for kinks in the drain line</li>
                    <li>Ensure proper slope (minimum 1/4" per foot)</li>
                    <li>Verify the unit is properly seated and sealed</li>
                    <li>Check for clogs downstream from the unit</li>
                    <li>Use the maintenance flush port to clear any blockage at the unit</li>
                    <li>When clearing the line with air: check for a P-trap in the system. After the air flush, refill the P-trap with water to restore the water seal.</li>
                  </ul>
                </div>

                <div className="support-troubleshooting-item support-troubleshooting-item-error">
                  <h4 className="support-troubleshooting-title">Leaks at connections</h4>
                  <ul className="support-troubleshooting-list">
                    <li>Tighten connections and check for proper seating</li>
                    <li>Verify solvent-weld joints are fully cured (24 hours)</li>
                    <li>Check for cracks or damage to PVC fittings</li>
                    <li>Confirm the unit was installed with the correct pipe orientation</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* AC Drain Wiz Sensor */}
            <div className="support-product-group support-product-group-sensor">
              <div className="support-product-group-header">
                <BellAlertIcon className="support-product-group-icon" />
                <h3 className="support-product-group-title">AC Drain Wiz Sensor</h3>
              </div>
              <div className="support-section-troubleshooting-list">

                <div className="support-troubleshooting-item support-troubleshooting-item-info">
                  <h4 className="support-troubleshooting-title">Sensor offline or not appearing on dashboard</h4>
                  <ul className="support-troubleshooting-list">
                    <li>Check the LED — no light may indicate a power issue; see the LED guide in Common Questions above</li>
                    <li>Confirm the Sensor is physically seated on the Mini's bayonet mount</li>
                    <li>Verify the Sensor is within range of your Wi-Fi router</li>
                    <li>Confirm you're logged into the correct account at the{' '}
                      <a href="https://monitor.acdrainwiz.com/login" className="support-section-link" target="_blank" rel="noopener noreferrer">monitoring portal</a>
                    </li>
                    <li>Try resetting the Sensor and re-pairing via the{' '}
                      <Link to="/sensor-setup" className="support-section-link">Sensor Setup Guide</Link>
                    </li>
                  </ul>
                </div>

                <div className="support-troubleshooting-item support-troubleshooting-item-info">
                  <h4 className="support-troubleshooting-title">Sensor not connecting to Wi-Fi (Wi-Fi model)</h4>
                  <ul className="support-troubleshooting-list">
                    <li>Ensure you are connecting to a 2.4 GHz network — 5 GHz is not supported</li>
                    <li>Double-check your Wi-Fi password — it is case-sensitive</li>
                    <li>Move the Sensor closer to your router during initial setup</li>
                    <li>Restart your router and attempt pairing again</li>
                    <li>If all else fails, factory reset the Sensor and restart setup from the beginning</li>
                  </ul>
                </div>

                <div className="support-troubleshooting-item support-troubleshooting-item-info">
                  <h4 className="support-troubleshooting-title">Reconnecting after a Wi-Fi network change</h4>
                  <ul className="support-troubleshooting-list">
                    <li>Hold the reset button for 5 seconds until the LED blinks blue — this puts the Sensor into pairing mode</li>
                    <li>Open the <a href="https://monitor.acdrainwiz.com/login" className="support-section-link" target="_blank" rel="noopener noreferrer">monitoring portal</a> and navigate to your Sensor settings</li>
                    <li>Select "Update Wi-Fi" and follow the prompts to enter your new network credentials</li>
                    <li>Once reconnected, the LED will return to solid green</li>
                  </ul>
                </div>

                <div className="support-troubleshooting-item support-troubleshooting-item-warning">
                  <h4 className="support-troubleshooting-title">Not receiving alert notifications</h4>
                  <ul className="support-troubleshooting-list">
                    <li>Confirm alert channels (SMS, email, push) are enabled in your dashboard account settings</li>
                    <li>Check your phone's notification permissions for the monitoring app or browser</li>
                    <li>Verify the Sensor is online — alerts cannot be delivered from an offline device</li>
                    <li>Check spam or junk folders for email alerts</li>
                    <li>Confirm the correct phone number and email address are saved in your profile</li>
                  </ul>
                </div>

                <div className="support-troubleshooting-item support-troubleshooting-item-warning">
                  <h4 className="support-troubleshooting-title">Low battery or battery replacement</h4>
                  <ul className="support-troubleshooting-list">
                    <li>The Sensor battery is rated for approximately 2 years under normal use</li>
                    <li>A low battery warning will appear on the dashboard and trigger a notification before shutdown</li>
                    <li>To replace: remove the Sensor from the bayonet mount, open the battery compartment, and swap in the specified battery type</li>
                    <li>DC-powered models with a backup battery do not require routine replacement — check the DC connection if the unit loses power</li>
                  </ul>
                </div>

                <div className="support-troubleshooting-item support-troubleshooting-item-info">
                  <h4 className="support-troubleshooting-title">Bluetooth pairing issues (Non-Wi-Fi model)</h4>
                  <ul className="support-troubleshooting-list">
                    <li>Ensure Bluetooth is enabled on your device and the Sensor is in pairing mode (blinking blue LED)</li>
                    <li>Stay within 30 feet of the Sensor during initial pairing</li>
                    <li>Remove any previously saved entries for this Sensor from your device's Bluetooth settings before retrying</li>
                    <li>If pairing fails repeatedly, reset the Sensor and try again from the beginning</li>
                  </ul>
                </div>

              </div>
            </div>
          </div>

          {/* Sensor Resources */}
          <div className="support-section-related">
            <h2 className="support-section-section-title">Sensor Resources</h2>
            <p className="support-section-section-description">Essential guides and tools for your AC Drain Wiz Sensor.</p>
            <div className="support-section-related-links">
              <Link to="/sensor-setup" className="support-section-related-link">
                Sensor Setup Guide →
              </Link>
              <a 
                href="https://monitor.acdrainwiz.com/login"
                className="support-section-related-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sensor Monitoring Portal ↗
              </a>
              <Link to="/support/installation-scenarios" className="support-section-related-link">
                Installation Scenarios →
              </Link>
            </div>
          </div>

          {/* Contact Support CTA */}
          <div className="support-section-cta-box">
            <p className="support-section-cta-text">
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
                to="/support/contact"
                className="support-action-button-secondary"
              >
                <EnvelopeIcon className="support-action-icon" />
                Email Support
              </Link>
            </div>
          </div>

          {/* Related Resources */}
          <div className="support-section-related">
            <h2 className="support-section-section-title">Related Resources</h2>
            <div className="support-section-related-links">
              <Link to="/support/installation-setup" className="support-section-related-link">
                Installation Guides →
              </Link>
              <Link to="/support/warranty-returns" className="support-section-related-link">
                Warranty Information →
              </Link>
              <Link to="/support/contact" className="support-section-related-link">
                Contact Support →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
