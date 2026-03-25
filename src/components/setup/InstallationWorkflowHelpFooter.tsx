import { Link } from 'react-router-dom'
import { BookOpenIcon, PhoneIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline'
import { SUPPORT_CONTACT } from '../../config/acdwKnowledge'
import { buildProductSupportHubHref } from '../../utils/supportFaqSearch'

export type InstallationWorkflowProduct = 'mini' | 'sensor-standard' | 'sensor-wifi'

function productSupportHref(product: InstallationWorkflowProduct): string {
  switch (product) {
    case 'mini':
      return buildProductSupportHubHref('mini', 'all')
    case 'sensor-standard':
      return buildProductSupportHubHref('sensor', 'standard')
    case 'sensor-wifi':
      return buildProductSupportHubHref('sensor', 'wifi')
  }
}

const DEFAULT_TITLE = 'Need help after installation?'
const DEFAULT_INTRO =
  "If something isn't working as expected, try troubleshooting and FAQs first—then call us if you still need support on site."
const INTRO_NO_PHONE =
  'Most questions are covered in Product Support and installation guides. Use Contact Support below if you still need help on site.'

export function InstallationWorkflowHelpFooter({
  product,
  className = '',
  showPhone = true,
  title,
  intro,
}: {
  product: InstallationWorkflowProduct
  /** Optional wrapper class (e.g. spacing). */
  className?: string
  /** When false, omits the phone row (e.g. when Contact Support is shown nearby). */
  showPhone?: boolean
  /** Overrides default section heading. */
  title?: string
  /** Overrides default intro paragraph. */
  intro?: string
}) {
  const faqHref = productSupportHref(product)
  const heading = title ?? DEFAULT_TITLE
  const introText =
    intro ?? (showPhone ? DEFAULT_INTRO : INTRO_NO_PHONE)

  return (
    <div className={`install-workflow-help-footer ${className}`.trim()}>
      <h3 className="install-workflow-help-footer-title">{heading}</h3>
      <p className="install-workflow-help-footer-intro">{introText}</p>
      <ul className="install-workflow-help-footer-links">
        <li>
          <Link to={faqHref} className="install-workflow-help-footer-link">
            <WrenchScrewdriverIcon className="install-workflow-help-footer-icon" aria-hidden />
            <span>Troubleshooting &amp; FAQs</span>
          </Link>
        </li>
        <li>
          <Link to="/support/installation-setup" className="install-workflow-help-footer-link">
            <BookOpenIcon className="install-workflow-help-footer-icon" aria-hidden />
            <span>Installation &amp; Setup</span>
          </Link>
        </li>
        {showPhone && (
          <li>
            <a href={SUPPORT_CONTACT.telHref} className="install-workflow-help-footer-link">
              <PhoneIcon className="install-workflow-help-footer-icon" aria-hidden />
              <span>Call {SUPPORT_CONTACT.phoneDisplay}</span>
            </a>
          </li>
        )}
      </ul>
    </div>
  )
}
