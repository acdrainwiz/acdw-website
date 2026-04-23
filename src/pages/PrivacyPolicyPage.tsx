import { useNavigate } from 'react-router-dom'
import {
  ShieldCheckIcon,
  EnvelopeIcon,
  EyeIcon,
  LockClosedIcon,
  UserGroupIcon,
  GlobeAltIcon,
  EnvelopeOpenIcon,
  ChatBubbleLeftRightIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline'
import { SUPPORT_CONTACT } from '../config/acdwKnowledge'
import type { PageSearchMeta } from '../config/siteSearchTypes'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'page-privacy-policy',
  kind: 'site',
  title: 'Privacy Policy',
  body:
    'Privacy policy: how AC Drain Wiz collects, uses, and protects personal information. Data protection, your rights, cookies, contact for privacy questions, California and regional disclosures where applicable.',
  tags: ['privacy', 'data', 'cookies', 'rights'],
  href: '/privacy-policy',
}

export function PrivacyPolicyPage() {
  const navigate = useNavigate()

  return (
    <div className="privacy-policy-page">

      {/* Hero Banner */}
      <div className="support-hero">
        <div className="support-hero-content">
          <div className="support-hero-header">
            <h1 className="support-hero-title">Privacy Policy</h1>
            <p className="support-hero-subtitle">
              Your privacy is important to us
            </p>
            <div className="support-hero-badge-row">
              <span className="support-hero-badge">Data Protection</span>
              <span className="support-hero-badge">Your Rights</span>
              <span className="support-hero-badge">Cookie Policy</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Quick Links */}
          <div className="bg-gray-50 rounded-lg p-6 mb-12">
            <h2 className="font-semibold text-gray-900 mb-4">Quick Navigation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <a href="#information-we-collect" className="text-primary-600 hover:text-primary-700">→ Information We Collect</a>
              <a href="#how-we-use" className="text-primary-600 hover:text-primary-700">→ How We Use Your Information</a>
              <a href="#sharing" className="text-primary-600 hover:text-primary-700">→ Information Sharing</a>
              <a href="#sms-text-messages" className="text-primary-600 hover:text-primary-700">→ SMS & Text Messages</a>
              <a href="#your-rights" className="text-primary-600 hover:text-primary-700">→ Your Privacy Rights</a>
              <a href="#security" className="text-primary-600 hover:text-primary-700">→ Data Security</a>
              <a href="#contact" className="text-primary-600 hover:text-primary-700">→ Contact Us</a>
            </div>
          </div>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-gray-700 leading-relaxed">
              AC Drain Wiz ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <strong>acdrainwiz.com</strong>, use our products, or interact with our services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.
            </p>
          </div>

          {/* Section 1: Information We Collect */}
          <div id="information-we-collect" className="mb-12">
            <div className="flex items-center mb-4">
              <EyeIcon className="h-8 w-8 text-primary-600 mr-3" />
              <h2 className="heading-2">1. Information We Collect</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Personal Information You Provide</h3>
                <p className="text-gray-700 mb-3">
                  We collect information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Register for an account</li>
                  <li>Make a purchase</li>
                  <li>Submit a contact form or request support</li>
                  <li>Sign up for our newsletter or promotional emails</li>
                  <li>Participate in surveys or promotions</li>
                  <li>Request a product demo</li>
                </ul>
                <p className="text-gray-700 mt-3">
                  This information may include:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Name and contact information (email, phone number, address)</li>
                  <li>Company name and role</li>
                  <li>Account credentials (username, password)</li>
                  <li>Payment information (processed securely through third-party payment processors)</li>
                  <li>Customer type (homeowner, HVAC professional, property manager, etc.)</li>
                  <li>Product preferences and purchase history</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Automatically Collected Information</h3>
                <p className="text-gray-700 mb-3">
                  When you visit our website, we automatically collect certain information about your device, including:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>IP address and geolocation data</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Referring website</li>
                  <li>Pages viewed and time spent on pages</li>
                  <li>Clickstream data</li>
                </ul>
                <p className="text-gray-700 mt-3 text-sm">
                  This information is collected through cookies, web beacons, and similar technologies.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: How We Use Your Information */}
          <div id="how-we-use" className="mb-12">
            <div className="flex items-center mb-4">
              <GlobeAltIcon className="h-8 w-8 text-primary-600 mr-3" />
              <h2 className="heading-2">2. How We Use Your Information</h2>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                We use the information we collect for the following purposes:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-primary-600 font-bold mr-2">•</span>
                  <span className="text-gray-700"><strong>Order Processing:</strong> To process and fulfill your orders, including shipping and payment processing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 font-bold mr-2">•</span>
                  <span className="text-gray-700"><strong>Customer Support:</strong> To respond to your inquiries and provide technical support</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 font-bold mr-2">•</span>
                  <span className="text-gray-700"><strong>Account Management:</strong> To create and manage your account, including authentication</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 font-bold mr-2">•</span>
                  <span className="text-gray-700"><strong>Marketing Communications:</strong> To send you promotional emails, newsletters, and product updates (with your consent)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 font-bold mr-2">•</span>
                  <span className="text-gray-700"><strong>Product Improvement:</strong> To analyze usage patterns and improve our products and services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 font-bold mr-2">•</span>
                  <span className="text-gray-700"><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms of service</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 font-bold mr-2">•</span>
                  <span className="text-gray-700"><strong>Security:</strong> To detect, prevent, and respond to fraud, security incidents, and other malicious activities</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3: Information Sharing */}
          <div id="sharing" className="mb-12">
            <div className="flex items-center mb-4">
              <UserGroupIcon className="h-8 w-8 text-primary-600 mr-3" />
              <h2 className="heading-2">3. How We Share Your Information</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                We do not sell your personal information. We may share your information with third parties only in the following circumstances:
              </p>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Service Providers</h3>
                <p className="text-gray-700">
                  We share information with trusted third-party service providers who assist us with:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 mt-2">
                  <li>Payment processing (Stripe, PayPal)</li>
                  <li>Email delivery (Pipedrive, Zapier)</li>
                  <li>Website hosting (Netlify)</li>
                  <li>Analytics (Google Analytics)</li>
                  <li>Customer relationship management (Pipedrive)</li>
                </ul>
                <p className="text-gray-700 text-sm mt-3">
                  These providers are contractually obligated to protect your information and use it only for the services they provide to us.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Business Transfers</h3>
                <p className="text-gray-700">
                  If AC Drain Wiz is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. You will be notified of any such change.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Legal Requirements</h3>
                <p className="text-gray-700">
                  We may disclose your information if required by law or in response to valid requests by public authorities (e.g., court orders, subpoenas).
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: SMS / Text Message Communications */}
          <div id="sms-text-messages" className="mb-12">
            <div className="flex items-center mb-4">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-primary-600 mr-3" />
              <h2 className="heading-2">4. SMS / Text Message Communications</h2>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700">
                AC Drain Wiz operates an SMS/text messaging program for customers and prospects who provide their mobile phone number and affirmatively consent to receive text messages. This section explains how you opt in, what you'll receive, how often, and how your mobile information is handled.
              </p>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">How You Opt In</h3>
                <p className="text-gray-700 mb-3">
                  You may opt in to receive text messages from AC Drain Wiz only through affirmative, express consent. Opt-in methods include:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Checking the SMS consent box next to your phone number when you submit a contact, sales, demo, or installer form on our website</li>
                  <li>Checking an optional promotional-messages checkbox where offered</li>
                  <li>Providing express written consent through another AC Drain Wiz channel (such as a signed order or account form) that clearly references text-message consent</li>
                </ul>
                <p className="text-gray-700 mt-3 text-sm">
                  SMS consent is never a condition of purchase. If you provide a phone number without opting in, we will contact you only by email or voice call regarding your inquiry.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Types of Messages and Frequency</h3>
                <p className="text-gray-700 mb-3">
                  Our SMS program includes two separate categories of messages, each with its own consent:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Transactional / Service Messages:</strong> Replies to your inquiry, scheduling and appointment coordination, order and shipping updates, account notifications, support follow-ups, and other service communications tied to your request.</li>
                  <li><strong>Promotional Messages (optional):</strong> Product announcements, company updates, and special offers — sent only if you separately opt in to marketing texts.</li>
                </ul>
                <p className="text-gray-700 mt-3">
                  Message frequency varies based on your inquiry and account activity. You will not receive more messages than reasonably necessary for the purpose you consented to.
                </p>
              </div>

              <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">No Sharing of Mobile Information</h3>
                <p className="text-gray-700 leading-relaxed">
                  <strong>No mobile information will be shared with third parties or affiliates for marketing or promotional purposes.</strong> Information sharing to subcontractors in support services, such as customer service, message-delivery platforms, and CRM providers, is permitted solely to operate the SMS program on our behalf. These subcontractors are bound by confidentiality obligations and may not use your mobile information for their own marketing.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Opting Out and Getting Help</h3>
                <p className="text-gray-700 mb-3">
                  You may stop receiving text messages from AC Drain Wiz at any time by replying <strong>STOP</strong> to any message you receive from us. For assistance, reply <strong>HELP</strong> or contact us at <a href="mailto:privacy@acdrainwiz.com" className="text-primary-600 hover:text-primary-700 underline">privacy@acdrainwiz.com</a>.
                </p>
                <p className="text-gray-700 text-sm">
                  Message and data rates may apply; check with your mobile carrier for details. Carriers are not liable for delayed or undelivered messages. You must be 18 years of age or older to opt in to our SMS program.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Your Privacy Rights */}
          <div id="your-rights" className="mb-12">
            <div className="flex items-center mb-4">
              <ShieldCheckIcon className="h-8 w-8 text-primary-600 mr-3" />
              <h2 className="heading-2">5. Your Privacy Rights</h2>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-primary-600 font-bold mr-2">•</span>
                  <span className="text-gray-700"><strong>Access:</strong> Request a copy of the personal information we hold about you</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 font-bold mr-2">•</span>
                  <span className="text-gray-700"><strong>Correction:</strong> Request correction of inaccurate or incomplete information</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 font-bold mr-2">•</span>
                  <span className="text-gray-700"><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 font-bold mr-2">•</span>
                  <span className="text-gray-700"><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 font-bold mr-2">•</span>
                  <span className="text-gray-700"><strong>Data Portability:</strong> Request a copy of your data in a machine-readable format</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 font-bold mr-2">•</span>
                  <span className="text-gray-700"><strong>Object:</strong> Object to certain processing activities</span>
                </li>
              </ul>
              
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>To exercise your rights:</strong> Email us at <a href="mailto:privacy@acdrainwiz.com" className="text-primary-600 hover:text-primary-700 underline">privacy@acdrainwiz.com</a> or use our <button onClick={() => navigate('/email-preferences')} className="text-primary-600 hover:text-primary-700 underline">Email Preferences Center</button>.
                </p>
              </div>
            </div>
          </div>

          {/* Section 6: Data Security */}
          <div id="security" className="mb-12">
            <div className="flex items-center mb-4">
              <LockClosedIcon className="h-8 w-8 text-primary-600 mr-3" />
              <h2 className="heading-2">6. Data Security</h2>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>SSL/TLS encryption for data transmission</li>
                <li>Secure password hashing and storage</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication requirements</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="text-gray-700 mt-4 text-sm">
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </div>
          </div>

          {/* Section 7: Cookies and Tracking */}
          <div id="cookies" className="mb-12">
            <h2 className="heading-2 mb-4">7. Cookies and Tracking Technologies</h2>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                We use cookies and similar tracking technologies to enhance your experience. You can control cookie preferences through your browser settings.
              </p>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900">Essential Cookies</h4>
                  <p className="text-sm text-gray-600">Required for website functionality and security</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Analytics Cookies</h4>
                  <p className="text-sm text-gray-600">Help us understand how visitors use our website</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Marketing Cookies</h4>
                  <p className="text-sm text-gray-600">Used to deliver relevant advertisements</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 8: Children's Privacy */}
          <div className="mb-12">
            <h2 className="heading-2 mb-4">8. Children's Privacy</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700">
                Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </div>
          </div>

          {/* Section 9: International Data Transfers */}
          <div className="mb-12">
            <h2 className="heading-2 mb-4">9. International Data Transfers</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700">
                Your information may be transferred to and processed in the United States or other countries where our service providers operate. By using our services, you consent to these transfers. We ensure appropriate safeguards are in place to protect your information.
              </p>
            </div>
          </div>

          {/* Section 10: Data Retention */}
          <div className="mb-12">
            <h2 className="heading-2 mb-4">10. Data Retention</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
              </p>
            </div>
          </div>

          {/* Section 11: Changes to Privacy Policy */}
          <div className="mb-12">
            <h2 className="heading-2 mb-4">11. Changes to This Privacy Policy</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div id="contact" className="mb-12">
            <div className="flex items-center mb-4">
              <EnvelopeIcon className="h-8 w-8 text-primary-600 mr-3" />
              <h2 className="heading-2">12. Contact Us</h2>
            </div>
            
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> <a href="mailto:privacy@acdrainwiz.com" className="text-primary-600 hover:text-primary-700 underline">privacy@acdrainwiz.com</a></p>
                <p><strong>Phone:</strong> <a href={SUPPORT_CONTACT.telHref} className="text-primary-600 hover:text-primary-700 underline">{SUPPORT_CONTACT.phoneDisplay}</a></p>
                <p><strong>Mail:</strong> AC Drain Wiz Privacy Team<br />
                240 W Palmetto Park Rd, Suite 110<br />
                Boca Raton, FL 33432</p>
              </div>
            </div>
          </div>

          {/* Quick Actions — match support hub CTA styling (Product Support, etc.) */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="support-section-cta-box">
              <p className="support-section-cta-text">
                <strong>Quick actions</strong> — manage preferences, reach our privacy team, or print this policy.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/email-preferences')}
                  className="support-action-button-primary support-action-button-large w-full justify-center"
                >
                  <EnvelopeOpenIcon className="support-action-icon" aria-hidden />
                  Manage email preferences
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/contact')}
                  className="support-action-button-secondary support-action-button-large w-full justify-center"
                >
                  <ChatBubbleLeftRightIcon className="support-action-icon" aria-hidden />
                  Contact privacy team
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="support-action-button-secondary support-action-button-large w-full justify-center"
                >
                  <PrinterIcon className="support-action-icon" aria-hidden />
                  Print this policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

