import { useNavigate } from 'react-router-dom'
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import { SUPPORT_CONTACT } from '../config/acdwKnowledge'
import type { PageSearchMeta } from '../config/siteSearchTypes'
import { PageHeroMeshBackdrop } from '../components/layout/PageHeroMeshBackdrop'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'page-terms-of-use',
  kind: 'site',
  title: 'Site Terms of Use',
  body:
    'Terms of use for ACDrainWiz.com: user conduct, intellectual property, liability, agreement with Privacy Policy, company legal entity 50 50 Holdings Inc.',
  tags: ['terms', 'legal', 'conditions', 'use'],
  href: '/terms-of-use',
}

export function TermsOfUsePage() {
  const navigate = useNavigate()

  return (
    <div className="terms-of-use-page">

      {/* Hero Banner */}
      <div className="support-hero">
        <PageHeroMeshBackdrop />
        <div className="support-hero-content">
          <div className="support-hero-header">
            <h1 className="support-hero-title">Site Terms of Use</h1>
            <p className="support-hero-subtitle">
              ACDrainWiz.com — Effective January 1, 2026
            </p>
            <div className="support-hero-badge-row">
              <span className="support-hero-badge">User Conduct</span>
              <span className="support-hero-badge">Intellectual Property</span>
              <span className="support-hero-badge">Liability</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to ACDrainWiz.com. These terms and conditions (&quot;Terms&quot;) apply to the ACDrainWiz.com website and all other sites, services, and items where these Terms appear or are linked (the &quot;Site&quot;).
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              By visiting or using the Site, you agree to accept and be bound by these Terms and our Privacy Policy. Please read them carefully.
            </p>
            <p className="text-gray-700 leading-relaxed">
              These Terms constitute a legally enforceable contract between you (&quot;you&quot;) and 50 50 Holdings, Inc., including its subsidiaries and affiliates (collectively, &quot;AC DRAIN WIZ&quot; or the &quot;Company&quot;).
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="bg-gray-50 rounded-lg p-6 mb-12">
            <h2 className="font-semibold text-gray-900 mb-4">Quick Navigation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <a href="#website-purpose" className="text-primary-600 hover:text-primary-700">→ 1. Website Purpose</a>
              <a href="#intended-audience" className="text-primary-600 hover:text-primary-700">→ 2. Intended Audience</a>
              <a href="#installation" className="text-primary-600 hover:text-primary-700">→ 3. Installation and Maintenance</a>
              <a href="#product-disclaimer" className="text-primary-600 hover:text-primary-700">→ 4. Product Use Disclaimer</a>
              <a href="#reviews" className="text-primary-600 hover:text-primary-700">→ 5. Reviews and Legacy Products</a>
              <a href="#user-conduct" className="text-primary-600 hover:text-primary-700">→ 6. User Conduct</a>
              <a href="#ip" className="text-primary-600 hover:text-primary-700">→ 7. Intellectual Property</a>
              <a href="#sms-program" className="text-primary-600 hover:text-primary-700">→ 20. SMS / Text Messaging Program</a>
              <a href="#contact" className="text-primary-600 hover:text-primary-700">→ 21. Contact Information</a>
            </div>
          </div>

          {/* Section 1 */}
          <div id="website-purpose" className="mb-12">
            <h2 className="heading-2 mb-4">1. Website Purpose and Distribution Model</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                The Site provides information about AC Drain Wiz products and related services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                AC Drain Wiz products are sold exclusively through authorized independent distributors.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The Company does not sell products directly through this Site, does not process payments, and is not the seller of record for transactions between distributors and contractors or other purchasers.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Any disputes regarding pricing, payment terms, delivery, or installation services must be directed to the applicable distributor or contractor.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div id="intended-audience" className="mb-12">
            <h2 className="heading-2 mb-4">2. Intended Audience</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                The Site is intended primarily for:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>HVAC distributors</li>
                <li>HVAC contractors and professional installers</li>
                <li>Other commercial partners</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Homeowners or end users may view the Site for informational purposes only.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div id="installation" className="mb-12">
            <h2 className="heading-2 mb-4">3. Installation and Maintenance Guidance</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                You agree to review and follow all installation and maintenance guidance provided by the Company for the proper use of AC Drain Wiz products.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Improper installation or misuse may result in system malfunction, water damage, or loss of manufacturer warranty coverage previously provided by HVAC vendors or installers.
              </p>
              <p className="text-gray-700 leading-relaxed">
                If you have questions regarding installation or maintenance, contact:
              </p>
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
                <p className="text-gray-700">
                  <PhoneIcon className="h-5 w-5 inline-block mr-2 text-primary-600" />
                  Phone: <a href={SUPPORT_CONTACT.telHref} className="text-primary-600 hover:text-primary-700 underline">{SUPPORT_CONTACT.phoneDisplay}</a>
                </p>
                <p className="text-gray-700 mt-2">
                  <EnvelopeIcon className="h-5 w-5 inline-block mr-2 text-primary-600" />
                  Email: <a href="mailto:info@acdrainwiz.com" className="text-primary-600 hover:text-primary-700 underline">info@acdrainwiz.com</a>
                </p>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div id="product-disclaimer" className="mb-12">
            <h2 className="heading-2 mb-4">4. Product Use Disclaimer</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                AC Drain Wiz products are intended for HVAC condensate drain maintenance.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The Company does not guarantee compatibility with every HVAC system or installation environment. Users are responsible for ensuring compliance with:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Manufacturer instructions</li>
                <li>Applicable HVAC standards</li>
                <li>Local, state, and federal regulations</li>
              </ul>
            </div>
          </div>

          {/* Section 5 */}
          <div id="reviews" className="mb-12">
            <h2 className="heading-2 mb-4">5. Reviews and Legacy Product References</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                The Site may display customer ratings, testimonials, or reviews.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Some reviews may refer to discontinued or legacy products (such as AC Drain Wiz 1.0) and may not reflect the features or performance of current models, including the ACDW Mini.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Reviews represent the opinions of individual users and do not constitute guarantees of performance.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The Company reserves the right to remove or refuse to publish reviews that violate these Terms or applicable law.
              </p>
            </div>
          </div>

          {/* Section 6 */}
          <div id="user-conduct" className="mb-12">
            <h2 className="heading-2 mb-4">6. User Conduct</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                In using the Site, you agree not to transmit, upload, distribute, or otherwise make available any content that:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Is fraudulent, false, misleading, or deceptive</li>
                <li>Is vulgar, abusive, threatening, harassing, hateful, or defamatory</li>
                <li>Contains unsolicited advertising or spam</li>
                <li>Violates any law or regulation</li>
                <li>Contains malware, viruses, or harmful code</li>
                <li>Restricts or inhibits others from using the Site</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                The Company may remove or disable access to content or services as needed for compliance, security, or operational reasons.
              </p>
            </div>
          </div>

          {/* Section 7 */}
          <div id="ip" className="mb-12">
            <h2 className="heading-2 mb-4">7. Intellectual Property</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                All content on the Site, including text, graphics, logos, product designs, images, and proprietary materials, is owned by or licensed to 50 50 Holdings, Inc.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The Company&apos;s trademarks, trade names, logos, and trade dress (&quot;Marks&quot;) may not be used without prior written consent.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Unauthorized use is strictly prohibited.
              </p>
            </div>
          </div>

          {/* Section 8 */}
          <div className="mb-12">
            <h2 className="heading-2 mb-4">8. License Restrictions</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                You may not:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Copy, reproduce, distribute, or exploit Site content for commercial purposes</li>
                <li>Use data mining, robots, scraping, or extraction tools</li>
                <li>Reverse engineer or attempt to derive proprietary designs</li>
                <li>Frame or link the Site in a misleading manner</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Any unauthorized use terminates your limited license to use the Site.
              </p>
            </div>
          </div>

          {/* Section 9 */}
          <div className="mb-12">
            <h2 className="heading-2 mb-4">9. Disclaimer of Warranties</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed font-semibold mb-4">
                ALL SERVICES AND SITE CONTENT ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE.&quot;
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE COMPANY DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The Company does not guarantee that the Site will be error-free, uninterrupted, secure, or compatible with all systems.
              </p>
            </div>
          </div>

          {/* Section 10 */}
          <div className="mb-12">
            <h2 className="heading-2 mb-4">10. Limitation of Liability</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT SHALL THE COMPANY OR ITS AFFILIATES, LICENSORS, OR SERVICE PROVIDERS BE LIABLE FOR:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
                <li>Personal injury or property damage</li>
                <li>Lost profits or business interruption</li>
                <li>Loss of data or goodwill</li>
                <li>Indirect, incidental, consequential, punitive, or exemplary damages</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID (IF ANY) BY YOU FOR PRODUCTS GIVING RISE TO THE CLAIM IN THE TWELVE (12) MONTHS PRECEDING THE EVENT.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Some jurisdictions do not allow certain limitations, so some provisions may not apply.
              </p>
            </div>
          </div>

          {/* Section 11 */}
          <div className="mb-12">
            <h2 className="heading-2 mb-4">11. Indemnification</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                You agree to indemnify, defend, and hold harmless the Company and its officers, directors, employees, affiliates, licensors, and agents from any claims, damages, or liabilities arising from:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Misuse of the Site or products</li>
                <li>Improper installation</li>
                <li>Violation of these Terms</li>
                <li>Violation of law</li>
              </ul>
            </div>
          </div>

          {/* Section 12 */}
          <div className="mb-12">
            <h2 className="heading-2 mb-4">12. Binding Arbitration</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Any dispute arising out of or relating to these Terms or the Site shall be resolved by binding arbitration, conducted in the State of Florida under applicable commercial arbitration rules.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The arbitration decision shall be final and binding.
              </p>
            </div>
          </div>

          {/* Section 13 */}
          <div className="mb-12">
            <h2 className="heading-2 mb-4">13. Class Action Waiver</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                All disputes must be brought on an individual basis only.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You waive any right to participate in a class action, collective action, or representative proceeding.
              </p>
            </div>
          </div>

          {/* Section 14 */}
          <div className="mb-12">
            <h2 className="heading-2 mb-4">14. Governing Law and Venue</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                These Terms are governed by the laws of the State of Florida.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Any legal action not subject to arbitration shall be brought exclusively in the state or federal courts located in Florida.
              </p>
            </div>
          </div>

          {/* Section 15 */}
          <div className="mb-12">
            <h2 className="heading-2 mb-4">15. DMCA Copyright Infringement Claims</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                If you believe content on the Site infringes your copyright, you may submit a notice under the Digital Millennium Copyright Act (DMCA) to:
              </p>
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
                <p className="text-gray-700">
                  <EnvelopeIcon className="h-5 w-5 inline-block mr-2 text-primary-600" />
                  <a href="mailto:info@acdrainwiz.com" className="text-primary-600 hover:text-primary-700 underline">info@acdrainwiz.com</a>
                </p>
                <p className="text-gray-700 mt-2">
                  <PhoneIcon className="h-5 w-5 inline-block mr-2 text-primary-600" />
                  <a href={SUPPORT_CONTACT.telHref} className="text-primary-600 hover:text-primary-700 underline">{SUPPORT_CONTACT.phoneDisplay}</a>
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed">
                The Company may terminate repeat infringers&apos; access.
              </p>
            </div>
          </div>

          {/* Section 16 */}
          <div className="mb-12">
            <h2 className="heading-2 mb-4">16. Export Regulation</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                You may not export or re-export Site content or services in violation of U.S. export laws.
              </p>
            </div>
          </div>

          {/* Section 17 */}
          <div className="mb-12">
            <h2 className="heading-2 mb-4">17. Termination</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                The Company may terminate or restrict access to the Site at any time for violation of these Terms or for operational or legal reasons.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Sections that by their nature should survive termination shall survive.
              </p>
            </div>
          </div>

          {/* Section 18 */}
          <div className="mb-12">
            <h2 className="heading-2 mb-4">18. New Jersey Legal Notice</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Under the New Jersey Truth-in-Consumer Contract, Warranty and Notice Act (TCCWNA), certain limitations or exclusions in these Terms may not apply to New Jersey residents, including limitations related to punitive damages or negligence.
              </p>
            </div>
          </div>

          {/* Section 19 */}
          <div className="mb-12">
            <h2 className="heading-2 mb-4">19. Changes to Terms</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                The Company reserves the right to modify these Terms at any time. Changes become effective immediately upon posting.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Continued use of the Site constitutes acceptance of the revised Terms.
              </p>
            </div>
          </div>

          {/* Section 20 - SMS/Text Messaging Program */}
          <div id="sms-program" className="mb-12">
            <div className="flex items-center mb-4">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-primary-600 mr-3" />
              <h2 className="heading-2">20. SMS / Text Messaging Program</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">SMS Consent Is Separate and Optional</h3>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Acceptance of these Terms — whether by accessing the Site, submitting a form, or otherwise — does not by itself constitute consent to receive SMS messages.</strong> SMS consent requires the separate, affirmative actions described below (typically a dedicated SMS consent checkbox next to your phone number on a form), and SMS opt-in is never required to use the Site or our products and services. You may decline SMS messaging at any time and continue to use our services; we will simply contact you by email or voice call instead.
                </p>
              </div>

              <p className="text-gray-700 leading-relaxed">
                By providing your mobile phone number and affirmatively opting in (for example, by checking an SMS consent box on a form on the Site), you agree to receive text messages from AC Drain Wiz on the terms set forth in this Section and our Privacy Policy.
              </p>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">20.1 Program Description and Use Cases</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  The AC Drain Wiz SMS program sends two categories of messages, each requiring its own separate consent:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    <strong>Transactional / Service Messages.</strong> Replies to inquiries you submit; scheduling and appointment coordination; order confirmations and shipping or delivery updates; account and authentication notifications; installer dispatch and service follow-ups; support alerts; and other communications directly tied to a request you initiated.
                  </li>
                  <li>
                    <strong>Promotional Messages (optional).</strong> Product announcements, company updates, news, and special offers. You will receive these only if you separately check the optional promotional-messages box; promotional consent is never required to purchase or use our products or services.
                  </li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  Message frequency varies based on your inquiry and account activity. You will not receive more messages than reasonably necessary for the purpose you consented to.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">20.2 Opt-Out Instructions</h3>
                <p className="text-gray-700 leading-relaxed">
                  <strong>To stop receiving messages, reply STOP to any text message.</strong> You will receive one final confirmation message and no further texts from the applicable program. To re-subscribe, opt in again through our forms or contact us. For help at any time, reply <strong>HELP</strong> or email <a href="mailto:privacy@acdrainwiz.com" className="text-primary-600 hover:text-primary-700 underline">privacy@acdrainwiz.com</a>.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">20.3 Message and Data Rates</h3>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Message and data rates may apply. Check with your carrier for details.</strong> AC Drain Wiz does not charge for text messages, but your mobile carrier may charge you for each message sent or received depending on your plan.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">20.4 Carrier Liability Disclaimer</h3>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Carriers are not liable for delayed or undelivered messages.</strong> Delivery of text messages is subject to the effective transmission by your wireless carrier and is not guaranteed. AC Drain Wiz is not responsible for messages that are delayed, undelivered, misdirected, or intercepted due to factors outside our reasonable control.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">20.5 Age Restriction</h3>
                <p className="text-gray-700 leading-relaxed">
                  <strong>You must be 18 years of age or older to use this SMS service.</strong> By opting in, you represent and warrant that you are at least 18 years old and that the mobile number you provided belongs to you or that you have authority to consent to receive text messages at that number.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">20.6 Supported Carriers and Changes</h3>
                <p className="text-gray-700 leading-relaxed">
                  The program is available through major U.S. wireless carriers. Carriers are not liable for delayed or undelivered messages. AC Drain Wiz may modify, suspend, or terminate the SMS program or any individual message category at any time, without prior notice, and without liability. Continued participation after changes constitutes acceptance of the updated terms.
                </p>
              </div>

              <p className="text-gray-700 leading-relaxed">
                For a full description of how your mobile information is collected, used, and protected — including our commitment that no mobile information will be shared with third parties or affiliates for marketing or promotional purposes — please review our <button onClick={() => navigate('/privacy-policy')} className="text-primary-600 hover:text-primary-700 underline">Privacy Policy</button>.
              </p>
            </div>
          </div>

          {/* Section 21 - Contact */}
          <div id="contact" className="mb-12">
            <div className="flex items-center mb-4">
              <EnvelopeIcon className="h-8 w-8 text-primary-600 mr-3" />
              <h2 className="heading-2">21. Contact Information</h2>
            </div>
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
              <div className="space-y-2 text-gray-700">
                <p><strong>AC Drain Wiz</strong></p>
                <p className="flex items-start">
                  <MapPinIcon className="h-5 w-5 inline-block mr-2 mt-0.5 flex-shrink-0 text-primary-600" />
                  <address className="not-italic leading-snug">
                    240 W Palmetto Park Rd, Suite 110<br />
                    Boca Raton, FL 33432
                  </address>
                </p>
                <p><PhoneIcon className="h-5 w-5 inline-block mr-2 text-primary-600" />Phone: <a href={SUPPORT_CONTACT.telHref} className="text-primary-600 hover:text-primary-700 underline">{SUPPORT_CONTACT.phoneDisplay}</a></p>
                <p><EnvelopeIcon className="h-5 w-5 inline-block mr-2 text-primary-600" />Email: <a href="mailto:info@acdrainwiz.com" className="text-primary-600 hover:text-primary-700 underline">info@acdrainwiz.com</a></p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/contact')}
                className="btn-secondary w-full"
              >
                Contact Us
              </button>
              <button
                onClick={() => window.print()}
                className="btn-secondary w-full"
              >
                Print These Terms
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
