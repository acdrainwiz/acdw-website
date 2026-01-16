import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, TruckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export function ShippingPolicyPage() {
  const navigate = useNavigate()

  return (
    <div className="legal-page-container">
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="legal-page-back-button"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Back
            </button>
          </div>

          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <TruckIcon className="h-16 w-16 text-orange-600" />
            </div>
            <h1 className="heading-1 mb-4">Shipping Policy</h1>
            <p className="text-large text-gray-600 mb-2">
              Delivery information and shipping terms
            </p>
            <p className="text-sm text-gray-500">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Important Notice */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-12">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-6 w-6 text-orange-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-900 mb-2">⚠️ This is a Temporary Policy</h3>
                <p className="text-sm text-orange-800">
                  This shipping policy is a template based on your current shipping configuration. 
                  Please review all sections and update with your actual shipping methods, costs, and delivery timeframes before going live.
                </p>
              </div>
            </div>
          </div>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-gray-700 leading-relaxed">
              This Shipping Policy outlines our shipping methods, delivery timeframes, costs, and terms. 
              Please review this information carefully before placing an order.
            </p>
            <p className="text-gray-700 leading-relaxed">
              All orders are processed and shipped from our fulfillment center. We strive to ship orders quickly 
              and deliver them safely to your door.
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
                <h3 className="font-semibold text-blue-900 mb-3">💡 Shipping Cost Calculation</h3>
                <p className="text-gray-700 mb-3">
                  Shipping costs are calculated based on <strong>package weight</strong> and <strong>shipping distance</strong> 
                  from our Boca Raton, Florida facility to your delivery address.
                </p>
                <p className="text-gray-700 text-sm">
                  Exact shipping costs are displayed during checkout based on your shipping address. 
                  See Section 3 below for detailed zone-based pricing.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Shipping Costs */}
          <div id="shipping-costs" className="mb-12">
            <h2 className="legal-section-title">3. Shipping Costs & Zones</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">
                Shipping costs are calculated based on <strong>shipping distance (zones)</strong> from our 
                Boca Raton, Florida facility (ZIP 33486) and <strong>package weight</strong>.
              </p>

              {/* Zone-Based Pricing Table */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
                <div className="bg-orange-600 px-6 py-3">
                  <h3 className="font-semibold text-white text-lg">Zone-Based Shipping Rates</h3>
                </div>
                <div className="p-6">
                  {/* Zone 1-2 */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Zone 1-2: Local/Regional ($9-$19)</h4>
                    <p className="text-sm text-gray-600 mb-2"><strong>States:</strong> Florida, Georgia, South Carolina, Alabama</p>
                    <p className="text-sm text-gray-600 mb-2"><strong>Delivery:</strong> 3-5 business days</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 1-2 units: <strong>$9.00</strong></li>
                      <li>• 3-4 units: <strong>$13.00</strong></li>
                      <li>• 5-6 units: <strong>$15.00</strong></li>
                      <li>• 7-8 units: <strong>$17.00</strong></li>
                      <li>• 9-10 units: <strong>$19.00</strong></li>
                    </ul>
                  </div>

                  <div className="border-t border-gray-200 my-4"></div>

                  {/* Zone 3-4 */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Zone 3-4: Mid-Range ($11-$22.50)</h4>
                    <p className="text-sm text-gray-600 mb-2"><strong>States:</strong> North Carolina, Tennessee, Mississippi, Louisiana, Texas, Arkansas, Oklahoma</p>
                    <p className="text-sm text-gray-600 mb-2"><strong>Delivery:</strong> 4-6 business days</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 1-2 units: <strong>$11.00</strong></li>
                      <li>• 3-4 units: <strong>$15.00</strong></li>
                      <li>• 5-6 units: <strong>$17.50</strong></li>
                      <li>• 7-8 units: <strong>$20.00</strong></li>
                      <li>• 9-10 units: <strong>$22.50</strong></li>
                    </ul>
                  </div>

                  <div className="border-t border-gray-200 my-4"></div>

                  {/* Zone 5-6 */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Zone 5-6: Long Distance ($13.50-$26.50)</h4>
                    <p className="text-sm text-gray-600 mb-2"><strong>States:</strong> Mid-Atlantic, Midwest (VA, WV, KY, MO, KS, NE, IA, IL, IN, OH, MI, WI, MN, ND, SD)</p>
                    <p className="text-sm text-gray-600 mb-2"><strong>Delivery:</strong> 5-7 business days</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 1-2 units: <strong>$13.50</strong></li>
                      <li>• 3-4 units: <strong>$17.50</strong></li>
                      <li>• 5-6 units: <strong>$20.50</strong></li>
                      <li>• 7-8 units: <strong>$23.50</strong></li>
                      <li>• 9-10 units: <strong>$26.50</strong></li>
                    </ul>
                  </div>

                  <div className="border-t border-gray-200 my-4"></div>

                  {/* Zone 7-8 */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Zone 7-8: Cross-Country ($16.50-$31)</h4>
                    <p className="text-sm text-gray-600 mb-2"><strong>States:</strong> West Coast, Pacific Northwest, Northeast (WA, OR, CA, NV, AZ, UT, ID, MT, WY, CO, NM, ME, NH, VT, MA, RI, CT, NY, PA, NJ, DE, MD, DC, AK, HI)</p>
                    <p className="text-sm text-gray-600 mb-2"><strong>Delivery:</strong> 5-7 business days (7-10 for AK/HI)</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 1-2 units: <strong>$16.50</strong></li>
                      <li>• 3-4 units: <strong>$20.50</strong></li>
                      <li>• 5-6 units: <strong>$24.00</strong></li>
                      <li>• 7-8 units: <strong>$27.50</strong></li>
                      <li>• 9-10 units: <strong>$31.00</strong></li>
                    </ul>
                  </div>

                  <div className="border-t border-gray-200 my-4"></div>

                  {/* Canada */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Canada: All Provinces ($20-$46)</h4>
                    <p className="text-sm text-gray-600 mb-2"><strong>Delivery:</strong> 7-14 business days</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 1-2 units: <strong>$20.00</strong></li>
                      <li>• 3-4 units: <strong>$28.00</strong></li>
                      <li>• 5-6 units: <strong>$34.00</strong></li>
                      <li>• 7-8 units: <strong>$40.00</strong></li>
                      <li>• 9-10 units: <strong>$46.00</strong></li>
                    </ul>
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Note:</strong> Additional customs duties and taxes may apply (customer responsibility)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>📦 Product Weights:</strong> AC Drain Wiz Mini (~1.6 lbs with packaging) | AC Drain Wiz Sensor (~1.6 lbs with packaging)
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  <strong>💡 Note:</strong> Exact shipping cost is calculated and displayed during checkout based on your delivery address.
                  Actual costs may vary slightly (+/- $1-2) based on precise destination and current carrier rates.
                </p>
              </div>

              <p className="text-gray-700 mt-6">
                <strong>No Additional Fees:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Same shipping rate for residential and commercial addresses</li>
                <li>No quantity-based shipping discounts</li>
                <li>No free shipping thresholds</li>
              </ul>
            </div>
          </div>

          {/* Section 4: Shipping Destinations */}
          <div id="shipping-destinations" className="mb-12">
            <h2 className="legal-section-title">4. Shipping Destinations</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">We currently ship to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>United States:</strong> All 50 states, including Alaska and Hawaii</li>
                <li><strong>Canada:</strong> All provinces and territories</li>
              </ul>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-gray-700">
                  <strong>International Shipping:</strong> We currently only ship to the United States and Canada. 
                  If you're interested in international shipping, please contact us at{' '}
                  <a href="mailto:support@acdrainwiz.com" className="text-orange-600 hover:text-orange-700">support@acdrainwiz.com</a>.
                </p>
              </div>
              <p className="text-gray-700 mt-4">
                <strong>Note:</strong> Some remote locations (Alaska, Hawaii, Northern Canada) may have extended delivery times. 
                Contact us at <a href="mailto:support@acdrainwiz.com" className="text-orange-600 hover:text-orange-700">support@acdrainwiz.com</a> if you have questions about shipping to your location.
              </p>
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
                <li>Phone: <strong>(234) AC DRAIN</strong></li>
                <li>Please include your order number and tracking information</li>
              </ul>
            </div>
          </div>

          {/* Section 7: International Shipping */}
          <div id="international-shipping" className="mb-12">
            <h2 className="legal-section-title">7. International Shipping (If Applicable)</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                <strong>Note:</strong> Update this section if you ship internationally beyond US and Canada.
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
                Please ensure your shipping address is correct at checkout. We are not responsible for:
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
                If you have questions about our shipping policy, please contact us:
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
                    <strong>Phone:</strong> (234) AC DRAIN
                  </li>
                  <li>
                    <strong>Business Hours:</strong> [TO BE DETERMINED - Add your business hours]
                  </li>
                  <li>
                    <strong>Website:</strong>{' '}
                    <a href="https://www.acdrainwiz.com" className="text-orange-600 hover:text-orange-700">
                      www.acdrainwiz.com
                    </a>
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

          {/* Footer Navigation */}
          <div className="border-t pt-8 mt-12">
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#processing-time" className="text-orange-600 hover:text-orange-700 text-sm">
                Processing Time
              </a>
              <a href="#shipping-methods" className="text-orange-600 hover:text-orange-700 text-sm">
                Shipping Methods
              </a>
              <a href="#shipping-costs" className="text-orange-600 hover:text-orange-700 text-sm">
                Shipping Costs
              </a>
              <a href="#tracking" className="text-orange-600 hover:text-orange-700 text-sm">
                Tracking
              </a>
              <a href="#contact" className="text-orange-600 hover:text-orange-700 text-sm">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

