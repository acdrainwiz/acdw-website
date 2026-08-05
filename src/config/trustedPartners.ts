/**
 * Home-page trusted partners (distributor social proof).
 * Add logoSrc when an asset is available under /images/partner-logos/.
 */

export interface TrustedPartner {
  id: string
  name: string
  /** Public path under /images/partner-logos/; omit for text-only until logo is ready */
  logoSrc?: string
  logoWidth?: number
  logoHeight?: number
}

export const TRUSTED_PARTNERS: TrustedPartner[] = [
  {
    id: 'johnstone-supply',
    name: 'Johnstone Supply',
    logoSrc: '/images/partner-logos/johnstone-supply-logo.svg',
    logoWidth: 280,
    logoHeight: 50,
  },
  {
    id: 'economic-electric-motors',
    name: 'Economic Electric Motors',
    logoSrc: '/images/partner-logos/economic-electric-motors-logo.webp',
    logoWidth: 280,
    logoHeight: 80,
  },
]

export const TRUSTED_PARTNERS_TITLE = 'Trusted Partners' as const

export const TRUSTED_PARTNERS_FOOTER =
  'Available through authorized HVAC distributors.' as const
