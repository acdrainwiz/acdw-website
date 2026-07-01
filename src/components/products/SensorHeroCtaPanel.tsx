import { useNavigate } from 'react-router-dom'
import {
  BoltIcon,
  CheckIcon,
  PhoneIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { SUPPORT_CONTACT } from '../../config/acdwKnowledge'

export type SensorHeroCtaPanelProps = {
  isAuthenticated: boolean
  isHomeowner: boolean
  isHVACPro: boolean
  isPropertyManager: boolean
}

export function SensorHeroCtaPanel({
  isAuthenticated,
  isHomeowner,
  isHVACPro,
  isPropertyManager,
}: SensorHeroCtaPanelProps) {
  const navigate = useNavigate()
  const salesPhone = SUPPORT_CONTACT.telHref

  const message = !isAuthenticated
    ? 'Contractor pricing and purchase are available by request. Homeowners: Contact us and we\'ll connect you with a local HVAC professional for installation.'
    : isHomeowner
      ? 'Sensor requires professional installation. Find a certified HVAC professional in your area.'
      : isHVACPro
        ? 'Access bulk pricing, fleet management tools, and exclusive contractor features by request.'
        : isPropertyManager
          ? 'Bulk pricing available for multi-property deployments.'
          : null

  const secondaryLabel = isHomeowner ? 'Find a Local HVAC Pro' : 'Contact Sales'
  const secondaryHref = isHomeowner ? '/contact?type=installer' : '/contact?type=sales'

  if (!message) {
    return null
  }

  return (
    <div className="sensor-hero-v2-cta-panel">
      <p className="sensor-hero-v2-cta-message">{message}</p>

      <a
        href={salesPhone}
        className="sensor-hero-v2-cta-button-primary md:hidden"
      >
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
          <span>Professional Installation</span>
        </div>
        <div className="sensor-hero-v2-trust-badge">
          <CheckIcon className="sensor-hero-v2-trust-badge-icon" aria-hidden />
          <span>Standard &amp; WiFi models</span>
        </div>
        <div className="sensor-hero-v2-trust-badge">
          <BoltIcon className="sensor-hero-v2-trust-badge-icon" aria-hidden />
          <span>WiFi adds remote tools</span>
        </div>
      </div>
    </div>
  )
}
