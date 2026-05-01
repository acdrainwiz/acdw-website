import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { SUPPORT_CONTACT } from '../config/acdwKnowledge'
import type { PageSearchMeta } from '../config/siteSearchTypes'
import { PageHeroMeshBackdrop } from '../components/layout/PageHeroMeshBackdrop'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'page-shipping-policy',
  kind: 'site',
  title: 'Shipping Policy',
  body:
    'Shipping and delivery: distributor sales model, contact sales for methods and timeframes, tracking, no direct end-customer online shipping from this site.',
  tags: ['shipping', 'delivery', 'distributor', 'tracking'],
  href: '/shipping-policy',
}

export function ShippingPolicyPage() {

  return (
    <div className="legal-page-container">

      {/* Hero Banner */}
      <div className="support-hero">
        <PageHeroMeshBackdrop />
        <div className="support-hero-content">
          <div className="support-hero-header">
            <h1 className="support-hero-title">Shipping Policy</h1>
            <p className="support-hero-subtitle">
              Delivery information and shipping terms
            </p>
            <div className="support-hero-badge-row">
              <span className="support-hero-badge">Delivery Times</span>
              <span className="support-hero-badge">Contact for Pricing</span>
              <span className="support-hero-badge">Tracking</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Important Notice */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-12">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-6 w-6 text-orange-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-900 mb-2">Shipping details</h3>
                <p className="text-sm text-orange-800">
                  AC Drain Wiz sells through distributors and does not currently ship to end customers online. For shipping methods, timeframes, and pricing, contact our sales team at <strong>{SUPPORT_CONTACT.phoneDisplay}</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-gray-700 leading-relaxed">
              This Shipping Policy outlines our shipping methods, delivery timeframes, and terms for orders through our distribution channel. 
              We sell directly to distributors rather than to end customers online. For shipping and pricing information, please contact our sales team at <strong>{SUPPORT_CONTACT.phoneDisplay}</strong>.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Orders are processed and shipped from our fulfillment center. We strive to ship orders quickly 
              and deliver them safely.
            </p>
          </div>

          {/* Section 1: Processing Time */}
          <div id="processing-time" className="mb-12">
            <h2 className="legal-section-title">1. Order Processing</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                Orders are typically processed within <strong>1-2 business days</strong> after payment confirmation.
              </p>
              <p className="text-gray-700">
                <strong>Note:</strong> Processing times may be longer during peak seasons, holidays, or promotional periods. 
                You will receive an email confirmation with tracking information once your order ships.
              </p>
              <p className="text-gray-700 mt-4">
                <strong>Business Days:</strong> We process orders Monday through Friday, excluding federal holidays.
              </p>
            </div>
          </div>

          {/* Section 2: Shipping Methods */}
          <div id="shipping-methods" className="mb-12">
            <h2 className="legal-section-title">2. Shipping Methods & Service</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">
                We ship via <strong>UPS or FedEx Ground Service</strong> for all orders. The carrier is automatically 
                selected based on the best rate and service for your location.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Standard Ground Shipping</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Service Level:</strong> Standard Ground (no expedited options available)</li>
                  <li><strong>Carrier:</strong> UPS or FedEx (automatically selected)</li>
                  <li><strong>Origin:</strong> Ships from Boca Raton, Florida (ZIP 33486)</li>
                  <li><strong>Tracking:</strong> Included - tracking number provided via email</li>
                  <li><strong>Insurance:</strong> All shipments are insured</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-3">💡 Shipping &amp; pricing</h3>
                <p className="text-gray-700 text-sm">
                  For shipping costs and pricing, contact our sales team at <strong>{SUPPORT_CONTACT.phoneDisplay}</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Shipping Costs & Pricing */}
          <div id="shipping-costs" className="mb-12">
            <h2 className="legal-section-title">3. Shipping Costs &amp; Pricing</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                AC Drain Wiz does not currently ship to end customers online; we sell directly to distributors. 
                For shipping costs, pricing, and availability, please contact our sales team.
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-0">
                  <strong>Sales &amp; shipping inquiries:</strong> Call our customer support line at <strong>{SUPPORT_CONTACT.phoneDisplay}</strong> for pricing and shipping information.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Shipping Destinations */}
          <div id="shipping-destinations" className="mb-12">
            <h2 className="legal-section-title">4. Shipping Destinations</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                We ship to distributors in the <strong>United States</strong> (all 50 states, including Alaska and Hawaii) and <strong>Canada</strong> (all provinces and territories). 
                For pricing and shipping to your location, contact our sales team at <strong>{SUPPORT_CONTACT.phoneDisplay}</strong>.
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-gray-700">
                  <strong>International shipping:</strong> We currently ship to the United States and Canada. 
                  For international or other shipping questions, contact us at{' '}
                  <a href="mailto:support@acdrainwiz.com" className="text-orange-600 hover:text-orange-700">support@acdrainwiz.com</a> or <strong>{SUPPORT_CONTACT.phoneDisplay}</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Tracking Information */}
          <div id="tracking" className="mb-12">
            <h2 className="legal-section-title">5. Order Tracking</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                Once your order ships, you will receive an email with:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Tracking number</li>
                <li>Carrier information</li>
                <li>Link to track your package</li>
                <li>Estimated delivery date</li>
              </ul>
              <p className="text-gray-700 mt-4">
                You can also track your order by logging into your account and viewing your order history.
              </p>
            </div>
          </div>

          {/* Section 6: Delivery Issues */}
          <div id="delivery-issues" className="mb-12">
            <h2 className="legal-section-title">6. Delivery Issues</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                If you experience any of the following delivery issues, please contact us immediately:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Delayed Delivery:</strong> If your order hasn't arrived within the estimated delivery timeframe</li>
                <li><strong>Lost Package:</strong> If tracking shows delivered but you haven't received it</li>
                <li><strong>Damaged Package:</strong> If your order arrives damaged</li>
                <li><strong>Wrong Address:</strong> If you need to update your shipping address</li>
                <li><strong>Missing Items:</strong> If your order is incomplete</li>
              </ul>
              <p className="text-gray-700 mt-4">
                <strong>Contact Us:</strong>
              </p>
              <ul className="list-none space-y-2 text-gray-700">
                <li>Email: <a href="mailto:support@acdrainwiz.com" className="text-orange-600 hover:text-orange-700">support@acdrainwiz.com</a></li>
                <li>Phone: <strong>{SUPPORT_CONTACT.phoneDisplay}</strong></li>
                <li>Please include your order number and tracking information</li>
              </ul>
            </div>
          </div>

          {/* Section 7: International Shipping */}
          <div id="international-shipping" className="mb-12">
            <h2 className="legal-section-title">7. International Shipping (If Applicable)</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                <strong>Note:</strong> International shipping may be available. For international shipping and pricing, contact our sales team at <strong>{SUPPORT_CONTACT.phoneDisplay}</strong>.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Customs duties and taxes are the responsibility of the customer</li>
                <li>Delivery times may vary significantly</li>
                <li>Some products may not be available for international shipping</li>
                <li>Additional shipping fees may apply</li>
                <li>International returns may have different terms (see Return Policy)</li>
              </ul>
            </div>
          </div>

          {/* Section 8: Address Accuracy */}
          <div id="address-accuracy" className="mb-12">
            <h2 className="legal-section-title">8. Shipping Address Accuracy</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                Please ensure your shipping address is correct when placing an order. We are not responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Orders shipped to incorrect addresses provided by the customer</li>
                <li>Delays or failed deliveries due to incorrect address information</li>
                <li>Additional shipping costs for address corrections or re-shipments</li>
              </ul>
              <p className="text-gray-700 mt-4">
                If you need to change your shipping address after placing an order, contact us immediately. 
                We can only modify addresses before the order ships.
              </p>
            </div>
          </div>

          {/* Section 9: Contact Information */}
          <div id="contact" className="mb-12">
            <h2 className="legal-section-title">9. Questions About Shipping?</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                For shipping and pricing information, contact our sales team via our customer support line at <strong>{SUPPORT_CONTACT.phoneDisplay}</strong>. 
                For other questions about our shipping policy:
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>Email:</strong>{' '}
                    <a href="mailto:support@acdrainwiz.com" className="text-orange-600 hover:text-orange-700">
                      support@acdrainwiz.com
                    </a>
                  </li>
                  <li>
                    <strong>Phone:</strong> {SUPPORT_CONTACT.phoneDisplay}
                  </li>
                  <li>
                    <strong>Business Hours:</strong> 9:00 AM to 5:00 PM Eastern Standard Time, Monday through Friday
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 10: Policy Updates */}
          <div id="policy-updates" className="mb-12">
            <h2 className="legal-section-title">10. Policy Updates</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700">
                We reserve the right to update this Shipping Policy at any time. 
                Changes will be posted on this page with an updated "Last Updated" date. 
                Shipping terms for orders placed before policy updates will be honored as stated at the time of purchase.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

