import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export function ReturnRefundPolicyPage() {
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
              <ExclamationTriangleIcon className="h-16 w-16 text-orange-600" />
            </div>
            <h1 className="heading-1 mb-4">Return & Refund Policy</h1>
            <p className="text-large text-gray-600 mb-2">
              Our commitment to your satisfaction
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
                  This return and refund policy is a template and needs to be reviewed and customized for your specific business needs. 
                  Please review all sections and update with your actual return window, conditions, and processes before going live.
                </p>
              </div>
            </div>
          </div>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-gray-700 leading-relaxed">
              At AC Drain Wiz, we stand behind the quality of our products and want you to be completely satisfied with your purchase. 
              This Return & Refund Policy outlines the terms and conditions for returning products and receiving refunds.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Please read this policy carefully before making a purchase. By purchasing from AC Drain Wiz, you agree to the terms outlined below.
            </p>
          </div>

          {/* Section 1: Return Window */}
          <div id="return-window" className="mb-12">
            <h2 className="legal-section-title">1. Return Window</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700">
                You have <strong>30 days</strong> from the date of delivery to initiate a return. 
                Returns must be initiated within this timeframe to be eligible for a refund.
              </p>
              <p className="text-gray-700">
                <strong>Note:</strong> This timeframe may need to be adjusted based on your business needs. 
                Common return windows are 14, 30, 60, or 90 days.
              </p>
            </div>
          </div>

          {/* Section 2: Return Conditions */}
          <div id="return-conditions" className="mb-12">
            <h2 className="legal-section-title">2. Return Conditions</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">To be eligible for a return, items must meet the following conditions:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Items must be in original, unopened packaging</li>
                <li>Items must be unused and in original condition</li>
                <li>All original accessories, documentation, and packaging materials must be included</li>
                <li>Items must not show signs of wear, damage, or installation attempts</li>
                <li>Proof of purchase (order number or receipt) must be provided</li>
              </ul>
              <p className="text-gray-700 mt-4">
                <strong>Non-Returnable Items:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Items that have been installed or used</li>
                <li>Items damaged due to misuse or improper installation</li>
                <li>Items returned after the return window has expired</li>
                <li>Custom or personalized items (if applicable)</li>
              </ul>
            </div>
          </div>

          {/* Section 3: Return Process */}
          <div id="return-process" className="mb-12">
            <h2 className="legal-section-title">3. How to Initiate a Return</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">To initiate a return, please follow these steps:</p>
              <ol className="list-decimal pl-6 space-y-3 text-gray-700">
                <li>
                  <strong>Contact Us:</strong> Email us at{' '}
                  <a href="mailto:support@acdrainwiz.com" className="text-orange-600 hover:text-orange-700">
                    support@acdrainwiz.com
                  </a>{' '}
                  or call us at <strong>(234) 23 DRAIN</strong> within the return window.
                </li>
                <li>
                  <strong>Provide Information:</strong> Include your order number, reason for return, and photos if the item is damaged.
                </li>
                <li>
                  <strong>Receive Authorization:</strong> We will provide a Return Authorization (RA) number and return shipping address.
                </li>
                <li>
                  <strong>Ship the Item:</strong> Package the item securely in its original packaging and ship to the provided address.
                </li>
                <li>
                  <strong>Track Your Return:</strong> Use the tracking number to monitor your return shipment.
                </li>
              </ol>
              <p className="text-gray-700 mt-4">
                <strong>Note:</strong> Returns sent without a Return Authorization number may be refused or delayed.
              </p>
            </div>
          </div>

          {/* Section 4: Return Shipping */}
          <div id="return-shipping" className="mb-12">
            <h2 className="legal-section-title">4. Return Shipping</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                <strong>Return Shipping Responsibility:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  <strong>Defective or Damaged Items:</strong> We will provide a prepaid return shipping label at no cost to you.
                </li>
                <li>
                  <strong>Customer-Initiated Returns:</strong> Return shipping costs are the responsibility of the customer, 
                  unless the return is due to our error (wrong item shipped, defective product, etc.).
                </li>
                <li>
                  <strong>Free Return Shipping:</strong> [TO BE DETERMINED - Consider offering free returns for customer satisfaction]
                </li>
              </ul>
              <p className="text-gray-700 mt-4">
                We recommend using a trackable shipping method and purchasing shipping insurance for returns, 
                as we are not responsible for items lost or damaged in return transit.
              </p>
            </div>
          </div>

          {/* Section 5: Refund Process */}
          <div id="refund-process" className="mb-12">
            <h2 className="legal-section-title">5. Refund Process</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">Once we receive and inspect your returned item:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  <strong>Inspection:</strong> We will inspect the returned item within 3-5 business days of receipt.
                </li>
                <li>
                  <strong>Refund Approval:</strong> If the item meets return conditions, we will approve your refund.
                </li>
                <li>
                  <strong>Refund Processing:</strong> Refunds will be processed to the original payment method within 5-10 business days 
                  after approval.
                </li>
                <li>
                  <strong>Refund Amount:</strong> You will receive a refund for the product price. 
                  Original shipping costs are non-refundable unless the return is due to our error.
                </li>
              </ul>
              <p className="text-gray-700 mt-4">
                <strong>Refund Timeline:</strong> Please allow 10-15 business days from the time we receive your return 
                for the refund to appear in your account. Processing times may vary depending on your payment method and bank.
              </p>
            </div>
          </div>

          {/* Section 6: Exchanges */}
          <div id="exchanges" className="mb-12">
            <h2 className="legal-section-title">6. Exchanges</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700">
                We currently do not offer direct exchanges. If you need a different product, size, or model, 
                please return the original item for a refund and place a new order for the item you need.
              </p>
              <p className="text-gray-700">
                <strong>Note:</strong> Consider whether you want to offer exchanges in the future. 
                This can improve customer satisfaction but adds complexity to fulfillment.
              </p>
            </div>
          </div>

          {/* Section 7: Damaged or Defective Items */}
          <div id="damaged-items" className="mb-12">
            <h2 className="legal-section-title">7. Damaged or Defective Items</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                If you receive a damaged or defective item, please contact us immediately:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Email: <a href="mailto:support@acdrainwiz.com" className="text-orange-600 hover:text-orange-700">support@acdrainwiz.com</a></li>
                <li>Phone: <strong>(234) 23 DRAIN</strong></li>
                <li>Include photos of the damage or defect</li>
                <li>Provide your order number</li>
              </ul>
              <p className="text-gray-700 mt-4">
                We will arrange for a replacement or full refund, including return shipping costs, at no charge to you.
              </p>
            </div>
          </div>

          {/* Section 8: Contact Information */}
          <div id="contact" className="mb-12">
            <h2 className="legal-section-title">8. Questions About Returns or Refunds?</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                If you have questions about our return and refund policy, please contact us:
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
                    <strong>Phone:</strong> (234) 23 DRAIN
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

          {/* Section 9: Policy Updates */}
          <div id="policy-updates" className="mb-12">
            <h2 className="legal-section-title">9. Policy Updates</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700">
                We reserve the right to update this Return & Refund Policy at any time. 
                Changes will be posted on this page with an updated "Last Updated" date. 
                Your continued use of our website and services after changes are posted constitutes acceptance of the updated policy.
              </p>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="border-t pt-8 mt-12">
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#return-window" className="text-orange-600 hover:text-orange-700 text-sm">
                Return Window
              </a>
              <a href="#return-conditions" className="text-orange-600 hover:text-orange-700 text-sm">
                Return Conditions
              </a>
              <a href="#return-process" className="text-orange-600 hover:text-orange-700 text-sm">
                Return Process
              </a>
              <a href="#refund-process" className="text-orange-600 hover:text-orange-700 text-sm">
                Refund Process
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

