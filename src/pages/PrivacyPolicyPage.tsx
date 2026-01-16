import { useNavigate } from 'react-router-dom'
import { ShieldCheckIcon, EnvelopeIcon, EyeIcon, LockClosedIcon, UserGroupIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

export function PrivacyPolicyPage() {
  const navigate = useNavigate()

  return (
    <div className="privacy-policy-page">
      <div className="container py-16">
        {/* Header */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <ShieldCheckIcon className="h-16 w-16 text-primary-600" />
            </div>
            <h1 className="heading-1 mb-4">Privacy Policy</h1>
            <p className="text-large text-gray-600 mb-2">
              Your privacy is important to us
            </p>
            <p className="text-sm text-gray-500">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Quick Links */}
          <div className="bg-gray-50 rounded-lg p-6 mb-12">
            <h2 className="font-semibold text-gray-900 mb-4">Quick Navigation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <a href="#information-we-collect" className="text-primary-600 hover:text-primary-700">→ Information We Collect</a>
              <a href="#how-we-use" className="text-primary-600 hover:text-primary-700">→ How We Use Your Information</a>
              <a href="#sharing" className="text-primary-600 hover:text-primary-700">→ Information Sharing</a>
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

          {/* Section 4: Your Privacy Rights */}
          <div id="your-rights" className="mb-12">
            <div className="flex items-center mb-4">
              <ShieldCheckIcon className="h-8 w-8 text-primary-600 mr-3" />
              <h2 className="heading-2">4. Your Privacy Rights</h2>
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

          {/* Section 5: Data Security */}
          <div id="security" className="mb-12">
            <div className="flex items-center mb-4">
              <LockClosedIcon className="h-8 w-8 text-primary-600 mr-3" />
              <h2 className="heading-2">5. Data Security</h2>
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

          {/* Section 6: Cookies and Tracking */}
          <div id="cookies" className="mb-12">
            <h2 className="heading-2 mb-4">6. Cookies and Tracking Technologies</h2>
            
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

          {/* Section 7: Children's Privacy */}
          <div className="mb-12">
            <h2 className="heading-2 mb-4">7. Children's Privacy</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700">
                Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </div>
          </div>

          {/* Section 8: International Data Transfers */}
          <div className="mb-12">
            <h2 className="heading-2 mb-4">8. International Data Transfers</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700">
                Your information may be transferred to and processed in the United States or other countries where our service providers operate. By using our services, you consent to these transfers. We ensure appropriate safeguards are in place to protect your information.
              </p>
            </div>
          </div>

          {/* Section 9: Data Retention */}
          <div className="mb-12">
            <h2 className="heading-2 mb-4">9. Data Retention</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
              </p>
            </div>
          </div>

          {/* Section 10: Changes to Privacy Policy */}
          <div className="mb-12">
            <h2 className="heading-2 mb-4">10. Changes to This Privacy Policy</h2>
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
              <h2 className="heading-2">11. Contact Us</h2>
            </div>
            
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> <a href="mailto:privacy@acdrainwiz.com" className="text-primary-600 hover:text-primary-700 underline">privacy@acdrainwiz.com</a></p>
                <p><strong>Phone:</strong> <a href="tel:+12342237246" className="text-primary-600 hover:text-primary-700 underline">(234) AC DRAIN</a></p>
                <p><strong>Mail:</strong> AC Drain Wiz Privacy Team<br />
                [Address to be provided]</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/email-preferences')}
                className="btn-secondary w-full"
              >
                Manage Email Preferences
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="btn-secondary w-full"
              >
                Contact Privacy Team
              </button>
              <button
                onClick={() => window.print()}
                className="btn-secondary w-full"
              >
                Print This Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

