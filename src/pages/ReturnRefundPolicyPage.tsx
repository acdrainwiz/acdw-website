import { SUPPORT_CONTACT } from '../config/acdwKnowledge'
import { PageHeroMeshBackdrop } from '../components/layout/PageHeroMeshBackdrop'

export function ReturnRefundPolicyPage() {

  return (
    <div className="legal-page-container">

      {/* Hero Banner */}
      <div className="support-hero">
        <PageHeroMeshBackdrop />
        <div className="support-hero-content">
          <div className="support-hero-header">
            <h1 className="support-hero-title">Return & Refund Policy</h1>
            <p className="support-hero-subtitle">
              Our commitment to your satisfaction
            </p>
            <div className="support-hero-badge-row">
              <span className="support-hero-badge">Returns</span>
              <span className="support-hero-badge">Refunds</span>
              <span className="support-hero-badge">Return Policy</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-gray-700 leading-relaxed">
              How returns and refunds are handled depends on where you purchased your product.
              The AC Drain Wiz Mini may be purchased directly on acdrainwiz.com; Sensor Switches,
              bundles, and many contractor orders are sold through authorized distributors and resellers.
            </p>
          </div>

          {/* Section 1: Web orders */}
          <div id="web-orders" className="mb-12">
            <h2 className="legal-section-title">1. Orders Placed on acdrainwiz.com (Mini)</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                If you purchased the AC Drain Wiz Mini on acdrainwiz.com, contact our support team
                with your order number for return or refund assistance. Our team will guide you through
                eligibility, return instructions, and any applicable refund processing.
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
                    <strong>Phone:</strong>{' '}
                    <a href={SUPPORT_CONTACT.telHref} className="text-orange-600 hover:text-orange-700">
                      {SUPPORT_CONTACT.phoneDisplay}
                    </a>
                  </li>
                </ul>
              </div>
              <p className="text-gray-700 mt-4 text-sm italic">
                Return windows and conditions for web orders are subject to update; contact support for the current policy.
              </p>
            </div>
          </div>

          {/* Section 2: Distributor purchases */}
          <div id="return-window" className="mb-12">
            <h2 className="legal-section-title">2. Purchases Through Distributors &amp; Resellers</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700">
                If you purchased through an authorized distributor, wholesaler, or HVAC contractor,
                returns and refunds are handled by that seller. Please contact your point of purchase
                directly for their return window, conditions, and process.
              </p>
            </div>
          </div>

          {/* Section 3: Warranty (Manufacturer) */}
          <div id="return-conditions" className="mb-12">
            <h2 className="legal-section-title">3. Manufacturer Warranty</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                AC Drain Wiz products are covered by our manufacturer warranty against defects in materials and workmanship. 
                For warranty claims related to product defects, you may contact us or your point of purchase. 
                See our <a href="/warranty-policy" className="text-orange-600 hover:text-orange-700">Warranty Policy</a> for full details.
              </p>
            </div>
          </div>

          {/* Section 4: Contact for Questions */}
          <div id="return-process" className="mb-12">
            <h2 className="legal-section-title">4. Questions About Returns or Refunds?</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                If you need help identifying your point of purchase or have a warranty-related concern, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>Email:</strong>{' '}
                    <a href={`mailto:${SUPPORT_CONTACT.supportEmail}`} className="text-orange-600 hover:text-orange-700">
                      {SUPPORT_CONTACT.supportEmail}
                    </a>
                  </li>
                  <li>
                    <strong>Phone:</strong> <a href={SUPPORT_CONTACT.telHref} className="text-orange-600 hover:text-orange-700">{SUPPORT_CONTACT.phoneDisplay}</a>
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

        </div>
      </div>
    </div>
  )
}
