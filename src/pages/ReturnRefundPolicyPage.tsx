import { SUPPORT_CONTACT } from '../config/acdwKnowledge'

export function ReturnRefundPolicyPage() {

  return (
    <div className="legal-page-container">

      {/* Hero Banner */}
      <div className="support-hero">
        <div className="support-hero-content">
          <div className="support-hero-header">
            <h1 className="support-hero-title">Return & Refund Policy</h1>
            <p className="support-hero-subtitle">
              Our commitment to your satisfaction
            </p>
            <div className="support-hero-badge-row">
              <span className="support-hero-badge">Returns</span>
              <span className="support-hero-badge">Refunds</span>
              <span className="support-hero-badge">Distributor Policy</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-gray-700 leading-relaxed">
              AC Drain Wiz products are sold exclusively through authorized distributors and resellers. 
              We do not sell products directly through this website and are not the seller of record for transactions.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Returns and refunds are handled by the authorized distributor or retailer where you purchased your product. 
              Please contact your point of purchase directly for their return policy, return window, conditions, and process.
            </p>
          </div>

          {/* Section 1: Distribution Model */}
          <div id="return-window" className="mb-12">
            <h2 className="legal-section-title">1. Where to Address Returns & Refunds</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700">
                Because AC Drain Wiz products are sold through authorized distributors and resellers, all return and refund requests must be directed to the distributor or retailer from whom you made your purchase. They will have their own return window, conditions, and process.
              </p>
            </div>
          </div>

          {/* Section 2: Warranty (Manufacturer) */}
          <div id="return-conditions" className="mb-12">
            <h2 className="legal-section-title">2. Manufacturer Warranty</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                AC Drain Wiz products are covered by our manufacturer warranty against defects in materials and workmanship. 
                For warranty claims related to product defects, you may contact us or your point of purchase. 
                See our <a href="/warranty-policy" className="text-orange-600 hover:text-orange-700">Warranty Policy</a> for full details.
              </p>
            </div>
          </div>

          {/* Section 3: Contact for Questions */}
          <div id="return-process" className="mb-12">
            <h2 className="legal-section-title">3. Questions About Returns or Refunds?</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                If you have questions about returns or refunds and need help identifying your point of purchase, or if you have a warranty-related concern, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>Email:</strong>{' '}
                    <a href="mailto:info@acdrainwiz.com" className="text-orange-600 hover:text-orange-700">
                      info@acdrainwiz.com
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

          {/* Section 4: Policy Updates */}
          <div id="policy-updates" className="mb-12">
            <h2 className="legal-section-title">4. Policy Updates</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700">
                We reserve the right to update this Return & Refund Policy at any time. 
                Changes will be posted on this page with an updated "Last Updated" date.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

