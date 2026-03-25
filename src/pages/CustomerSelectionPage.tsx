import { CustomerTypeSelector } from '../components/home/CustomerTypeSelector'
import type { PageSearchMeta } from '../config/siteSearchTypes'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'page-customer-selection',
  kind: 'site',
  title: 'Choose your experience',
  body:
    'Choose your experience: personalized paths for homeowners, HVAC professionals, property managers, and city or code officials. Customer type selector and tailored AC Drain Wiz content.',
  tags: ['homeowner', 'HVAC', 'property manager', 'code official', 'path'],
  href: '/customer-selection',
}

export function CustomerSelectionPage() {
  return (
    <div>
      {/* Hero Banner */}
      <div className="support-hero">
        <div className="support-hero-content">
          <div className="support-hero-header">
            <h1 className="support-hero-title">Choose Your Experience</h1>
            <p className="support-hero-subtitle">
              Get a personalized experience tailored to your specific needs. 
              Whether you're a homeowner, HVAC professional, or city official, 
              we have solutions designed for you.
            </p>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <CustomerTypeSelector />
        </div>
      </div>
    </div>
  )
}
