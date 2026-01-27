import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

export function WarrantyPolicyPage() {
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
              <ShieldCheckIcon className="h-16 w-16 text-orange-600" />
            </div>
            <h1 className="heading-1 mb-4">Warranty Policy</h1>
            <p className="text-large text-gray-600 mb-2">
              Our commitment to product quality and reliability
            </p>
            <p className="text-sm text-gray-500">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-gray-700 leading-relaxed">
              AC Drain Wiz stands behind the quality and reliability of our products. This Warranty Policy outlines 
              the warranty coverage, terms, and conditions for AC Drain Wiz products.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Please read this warranty policy carefully. By purchasing and using AC Drain Wiz products, you agree to 
              the terms and conditions outlined below.
            </p>
          </div>

          {/* Section 1: Warranty Period */}
          <div id="warranty-period" className="mb-12">
            <h2 className="legal-section-title">1. Warranty Period</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                AC Drain Wiz products are covered by the following warranty periods:
              </p>
              <div className="bg-gray-50 rounded-lg p-6 mb-4">
                <h3 className="font-semibold text-gray-900 mb-3">AC Drain Wiz Mini</h3>
                <p className="text-gray-700">
                  <strong>Warranty Period:</strong> <span className="text-orange-600 font-semibold">Lifetime</span> from the date of purchase
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 mb-4">
                <h3 className="font-semibold text-gray-900 mb-3">AC Drain Wiz Sensor</h3>
                <p className="text-gray-700">
                  <strong>Warranty Period:</strong> <span className="text-orange-600 font-semibold">Lifetime</span> from the date of purchase
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Mini + Sensor Bundle</h3>
                <p className="text-gray-700">
                  <strong>Warranty Period:</strong> Each component (Mini and Sensor) is covered by its respective lifetime warranty
                </p>
              </div>
              <p className="text-gray-700 mt-4">
                <strong>Lifetime Warranty:</strong> This warranty covers the product for the lifetime of the original purchaser, 
                as long as the product is used under normal conditions and maintained according to AC Drain Wiz guidelines.
              </p>
            </div>
          </div>

          {/* Section 2: What's Covered */}
          <div id="whats-covered" className="mb-12">
            <h2 className="legal-section-title">2. What's Covered</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                This warranty covers defects in materials and workmanship under normal use and service conditions. 
                Specifically covered:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Manufacturing Defects:</strong> Defects in materials or workmanship that existed at the time of purchase</li>
                <li><strong>Material Failure:</strong> Premature failure of materials under normal operating conditions</li>
                <li><strong>Component Failure:</strong> Failure of internal components due to manufacturing defects</li>
                <li><strong>Structural Issues:</strong> Cracking, warping, or structural failures not caused by misuse</li>
                <li><strong>Performance Issues:</strong> Products that fail to perform as specified due to manufacturing defects</li>
              </ul>
              <p className="text-gray-700 mt-4">
                <strong>Normal Use:</strong> Normal use includes proper installation according to AC Drain Wiz installation instructions, 
                regular maintenance, and operation within specified temperature and pressure ranges.
              </p>
            </div>
          </div>

          {/* Section 3: What's Not Covered */}
          <div id="whats-not-covered" className="mb-12">
            <h2 className="legal-section-title">3. What's Not Covered</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">This warranty does not cover:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  <strong>Improper Installation:</strong> Damage or failure resulting from incorrect installation, 
                  failure to follow installation instructions, or installation by unqualified personnel
                </li>
                <li>
                  <strong>Misuse or Abuse:</strong> Damage caused by misuse, abuse, neglect, or operation outside 
                  specified parameters
                </li>
                <li>
                  <strong>Normal Wear and Tear:</strong> Gradual deterioration or wear that occurs with normal use over time
                </li>
                <li>
                  <strong>Accidental Damage:</strong> Damage from accidents, impacts, or external forces
                </li>
                <li>
                  <strong>Modifications:</strong> Products that have been modified, altered, or repaired by unauthorized parties
                </li>
                <li>
                  <strong>Environmental Damage:</strong> Damage from extreme weather, natural disasters, or environmental conditions 
                  beyond normal operating parameters
                </li>
                <li>
                  <strong>Improper Maintenance:</strong> Failure to perform recommended maintenance or use of incompatible cleaning agents
                </li>
                <li>
                  <strong>Cosmetic Issues:</strong> Minor cosmetic imperfections that do not affect functionality
                </li>
                <li>
                  <strong>Third-Party Components:</strong> Damage to or failure of third-party components not manufactured by AC Drain Wiz
                </li>
                <li>
                  <strong>Consequential Damages:</strong> Indirect, incidental, or consequential damages, including but not limited to 
                  water damage, property damage, or lost profits
                </li>
              </ul>
            </div>
          </div>

          {/* Section 4: Warranty Claim Process */}
          <div id="warranty-claim" className="mb-12">
            <h2 className="legal-section-title">4. How to Make a Warranty Claim</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">To make a warranty claim, please follow these steps:</p>
              <ol className="list-decimal pl-6 space-y-3 text-gray-700">
                <li>
                  <strong>Contact Us:</strong> Email us at{' '}
                  <a href="mailto:support@acdrainwiz.com" className="text-orange-600 hover:text-orange-700">
                    support@acdrainwiz.com
                  </a>{' '}
                  or call us at <strong>(234) 23 DRAIN</strong> to initiate a warranty claim.
                </li>
                <li>
                  <strong>Provide Information:</strong> Include the following information:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Order number or proof of purchase</li>
                    <li>Product model and serial number (if applicable)</li>
                    <li>Date of purchase</li>
                    <li>Description of the defect or issue</li>
                    <li>Photos or videos showing the defect (if applicable)</li>
                    <li>Installation details and date</li>
                  </ul>
                </li>
                <li>
                  <strong>Evaluation:</strong> We will review your claim and may request additional information or photos.
                </li>
                <li>
                  <strong>Resolution:</strong> If your claim is approved, we will provide one of the following:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Replacement product (same or equivalent model)</li>
                    <li>Repair of the defective product</li>
                    <li>Refund of the purchase price (at our discretion)</li>
                  </ul>
                </li>
                <li>
                  <strong>Shipping & Handling:</strong> For warranty replacements, a shipping and handling fee of $10.99 applies. 
                  This fee will be collected before the replacement is shipped. Alternatively, you may take your defective unit 
                  to a local AC Drain Wiz distributor for replacement (see Section 5 for details).
                </li>
              </ol>
              <p className="text-gray-700 mt-4">
                <strong>Response Time:</strong> We will respond to warranty claims within 5-7 business days. 
                Resolution timeframes may vary depending on the nature of the claim and product availability.
              </p>
            </div>
          </div>

          {/* Section 5: Warranty Remedies */}
          <div id="warranty-remedies" className="mb-12">
            <h2 className="legal-section-title">5. Warranty Remedies</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                If a product is found to be defective and covered under this warranty, AC Drain Wiz will, at its sole discretion:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  <strong>Replace:</strong> Provide a replacement product of the same or equivalent model
                </li>
                <li>
                  <strong>Repair:</strong> Repair the defective product to restore it to working condition
                </li>
                <li>
                  <strong>Refund:</strong> Refund the original purchase price (if replacement or repair is not possible or practical)
                </li>
              </ul>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mt-6">
                <h3 className="font-semibold text-orange-900 mb-3">Shipping & Handling for Warranty Replacements</h3>
                <p className="text-gray-700 mb-2">
                  For warranty replacements, customers are responsible for shipping and handling costs:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    <strong>Shipping & Handling Fee:</strong> $10.99 per replacement unit
                  </li>
                  <li>
                    This fee covers the cost of shipping the replacement product to you
                  </li>
                  <li>
                    You are responsible for shipping the defective product back to AC Drain Wiz for evaluation
                  </li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-4">
                <h3 className="font-semibold text-blue-900 mb-3">Alternative: Local Distributor Replacement</h3>
                <p className="text-gray-700">
                  As an alternative to shipping, you may take your defective unit to your local AC Drain Wiz distributor 
                  and request a replacement. The distributor will provide you with a replacement unit, and we will handle 
                  the warranty claim internally with the distributor.
                </p>
                <p className="text-gray-700 mt-2 text-sm">
                  <strong>Note:</strong> Contact us at <a href="mailto:support@acdrainwiz.com" className="text-orange-600 hover:text-orange-700">support@acdrainwiz.com</a> or <strong>(234) 23 DRAIN</strong> 
                  to find a distributor near you.
                </p>
              </div>
            </div>
          </div>

          {/* Section 6: Limitation of Liability */}
          <div id="limitation-liability" className="mb-12">
            <h2 className="legal-section-title">6. Limitation of Liability</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                <strong>THIS WARRANTY IS THE SOLE AND EXCLUSIVE WARRANTY PROVIDED BY AC DRAIN WIZ.</strong>
              </p>
              <p className="text-gray-700 mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, AC DRAIN WIZ DISCLAIMS ALL OTHER WARRANTIES, 
                EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, 
                AND NON-INFRINGEMENT.
              </p>
              <p className="text-gray-700 mb-4">
                AC DRAIN WIZ'S LIABILITY UNDER THIS WARRANTY IS LIMITED TO THE REMEDIES DESCRIBED ABOVE. 
                IN NO EVENT SHALL AC DRAIN WIZ BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, 
                INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Water damage or property damage</li>
                <li>Loss of profits or business interruption</li>
                <li>Cost of substitute products or services</li>
                <li>Personal injury or death</li>
              </ul>
              <p className="text-gray-700 mt-4 text-sm">
                Some states or jurisdictions do not allow the exclusion or limitation of incidental or consequential damages, 
                so the above limitation may not apply to you. This warranty gives you specific legal rights, and you may also 
                have other rights which vary by state or jurisdiction.
              </p>
            </div>
          </div>

          {/* Section 7: Transferability */}
          <div id="transferability" className="mb-12">
            <h2 className="legal-section-title">7. Warranty Transferability</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700">
                This warranty is <strong>non-transferable</strong> and applies only to the original purchaser. 
                The warranty does not extend to subsequent owners or users of the product.
              </p>
              <p className="text-gray-700 mt-4">
                <strong>Note:</strong> If you want to make the warranty transferable (which can increase product value), 
                you would need to update this section accordingly.
              </p>
            </div>
          </div>

          {/* Section 8: Contact Information */}
          <div id="contact" className="mb-12">
            <h2 className="legal-section-title">8. Questions About Your Warranty?</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                If you have questions about this warranty policy or need to make a warranty claim, please contact us:
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
                We reserve the right to update this Warranty Policy at any time. 
                Changes will be posted on this page with an updated "Last Updated" date. 
                The warranty terms in effect at the time of purchase will apply to your product, 
                regardless of any subsequent policy updates.
              </p>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="border-t pt-8 mt-12">
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#warranty-period" className="text-orange-600 hover:text-orange-700 text-sm">
                Warranty Period
              </a>
              <a href="#whats-covered" className="text-orange-600 hover:text-orange-700 text-sm">
                What's Covered
              </a>
              <a href="#whats-not-covered" className="text-orange-600 hover:text-orange-700 text-sm">
                What's Not Covered
              </a>
              <a href="#warranty-claim" className="text-orange-600 hover:text-orange-700 text-sm">
                Make a Claim
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

