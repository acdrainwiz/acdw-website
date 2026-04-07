import { Link } from 'react-router-dom'
import { MIAMI_HEAT_PARTNERSHIP } from '../../config/acdwKnowledge'

export type MiamiHeatPartnershipLayout = 'header' | 'footer' | 'about' | 'drawer'

type Props = {
  layout: MiamiHeatPartnershipLayout
  /** e.g. close mobile menu when the partnership link is activated */
  onLinkClick?: () => void
}

/**
 * Miami HEAT co-brand lockup: badge + two-line tagline (“Proud partner” / “of the Miami HEAT”).
 * Header, footer, and mobile nav drawer wrap in a Link to the About partnership anchor; About uses a static block.
 */
export function MiamiHeatPartnershipLockup({ layout, onLinkClick }: Props) {
  const heatStyle = { color: MIAMI_HEAT_PARTNERSHIP.officialRed }

  const tagline = (
    <>
      <span className="miami-heat-partnership-tagline-line">Proud partner</span>
      <span className="miami-heat-partnership-tagline-line">
        of the Miami{' '}
        <span className="miami-heat-partnership-heat-word" style={heatStyle}>
          HEAT
        </span>
      </span>
    </>
  )

  if (layout === 'about') {
    return (
      <div className="about-page-partnership-lockup">
        <img
          src={MIAMI_HEAT_PARTNERSHIP.signatureBadgePath}
          alt=""
          width={56}
          height={57}
          className="about-page-partnership-badge-image"
          aria-hidden
        />
        <div className="about-miami-heat-partnership-tagline">{tagline}</div>
      </div>
    )
  }

  if (layout === 'drawer') {
    return (
      <Link
        to={MIAMI_HEAT_PARTNERSHIP.aboutPartnershipHref}
        className="header-mobile-drawer-partnership"
        aria-label="Proud partner of the Miami HEAT — learn more on our About page"
        onClick={onLinkClick}
      >
        <img
          src={MIAMI_HEAT_PARTNERSHIP.signatureBadgePath}
          alt=""
          width={36}
          height={37}
          className="header-mobile-drawer-partnership-badge-image"
          aria-hidden
        />
        <div className="header-mobile-drawer-partnership-tagline">{tagline}</div>
      </Link>
    )
  }

  const imgClass =
    layout === 'header'
      ? 'header-miami-heat-partnership-badge-image'
      : 'footer-miami-heat-partnership-badge-image'
  const taglineClass =
    layout === 'header'
      ? 'header-miami-heat-partnership-tagline'
      : 'footer-miami-heat-partnership-tagline'

  const badgeSrc =
    layout === 'footer'
      ? MIAMI_HEAT_PARTNERSHIP.signatureBadgeBwPath
      : MIAMI_HEAT_PARTNERSHIP.signatureBadgePath

  const inner = (
    <>
      <img
        src={badgeSrc}
        alt=""
        width={layout === 'header' ? 40 : 36}
        height={layout === 'header' ? 41 : 37}
        className={imgClass}
        aria-hidden
      />
      <div className={taglineClass}>{tagline}</div>
    </>
  )

  return (
    <Link
      to={MIAMI_HEAT_PARTNERSHIP.aboutPartnershipHref}
      className={
        layout === 'header' ? 'header-miami-heat-partnership' : 'footer-miami-heat-partnership'
      }
      aria-label="Proud partner of the Miami HEAT — learn more on our About page"
      onClick={onLinkClick}
    >
      {inner}
    </Link>
  )
}
