import { useNavigate } from 'react-router-dom'
import {
  CheckIcon,
  PhoneIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'
import { PRODUCT_NAMES, SUPPORT_CONTACT } from '../../config/acdwKnowledge'

export type ComboHeroCtaPanelProps = {
  isAuthenticated: boolean
  isHomeowner: boolean
  isHVACPro: boolean
  isPropertyManager: boolean
}

export function ComboHeroCtaPanel({
  isAuthenticated,
  isHomeowner,
  isHVACPro,
  isPropertyManager,
}: ComboHeroCtaPanelProps) {
  const navigate = useNavigate()
  const salesPhone = SUPPORT_CONTACT.telHref

  const message = !isAuthenticated
    ? `${PRODUCT_NAMES.bundle} pricing is available by request. Homeowners: we’ll connect you with a local HVAC professional for installation.`
    : isHomeowner
      ? 'The Mini + Sensor bundle requires professional installation. Find a certified HVAC professional in your area.'
      : isHVACPro
        ? 'Access contractor pricing, fleet tools, and bundle availability by request.'
        : isPropertyManager
          ? 'Bulk pricing available for multi-property deployments with your HVAC partner.'
          : null

  const secondaryLabel = isHomeowner ? 'Find a Local HVAC Pro' : 'Contact Sales'
  const secondaryHref = isHomeowner ? '/contact?type=installer' : '/contact?type=sales'

  if (!message) {
    return null
  }

  return (
    <div className="sensor-hero-v2-cta-panel">
      <p className="sensor-hero-v2-cta-message">{message}</p>

      <a href={salesPhone} className="sensor-hero-v2-cta-button-primary md:hidden">
        Call {SUPPORT_CONTACT.phoneDisplay}
      </a>

      <div className="sensor-hero-v2-phone-badge">
        <PhoneIcon className="sensor-hero-v2-phone-badge-icon" aria-hidden />
        <div className="sensor-hero-v2-phone-badge-text">
          <div className="sensor-hero-v2-phone-vanity">{SUPPORT_CONTACT.phoneDisplay}</div>
          <div className="sensor-hero-v2-phone-numeric">{SUPPORT_CONTACT.phoneNumeric}</div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate(secondaryHref)}
        className="sensor-hero-v2-cta-button-secondary"
      >
        {secondaryLabel}
      </button>

      <div className="sensor-hero-v2-trust-badges">
        <div className="sensor-hero-v2-trust-badge">
          <ShieldCheckIcon className="sensor-hero-v2-trust-badge-icon" aria-hidden />
          <span>Professional installation</span>
        </div>
        <div className="sensor-hero-v2-trust-badge">
          <WrenchScrewdriverIcon className="sensor-hero-v2-trust-badge-icon" aria-hidden />
          <span>Access + overflow protection</span>
        </div>
        <div className="sensor-hero-v2-trust-badge">
          <CheckIcon className="sensor-hero-v2-trust-badge-icon" aria-hidden />
          <span>Standard &amp; WiFi Sensor options</span>
        </div>
      </div>
    </div>
  )
}
