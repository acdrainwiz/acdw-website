import { exitHotspotCalibrateMode } from '../../hooks/useCalibrateHotspotsFlag'

export type HotspotCalibrateDevBannerProps = {
  /** e.g. "miniFullStackHotspots.ts" */
  exportFile: string
  /** Element id to scroll to (without #) */
  scrollTargetId: string
  imageLabel?: string
}

/**
 * Fixed dev-only instructions while `?calibrate=hotspots` is active.
 */
export function HotspotCalibrateDevBanner({
  exportFile,
  scrollTargetId,
  imageLabel = 'hotspot diagram',
}: HotspotCalibrateDevBannerProps) {
  if (!import.meta.env.DEV) return null

  const scrollToTarget = () => {
    document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div
      className="hotspot-calibrate-dev-banner"
      role="status"
      aria-live="polite"
    >
      <div className="hotspot-calibrate-dev-banner-inner">
        <span className="hotspot-calibrate-dev-banner-badge">Dev · Calibrate</span>
        <p className="hotspot-calibrate-dev-banner-text">
          Drag the <strong>fuchsia dots</strong> on the {imageLabel}. Use{' '}
          <strong>Copy JSON</strong> on the diagram toolbar, then paste coordinates into{' '}
          <code className="hotspot-calibrate-dev-banner-code">{exportFile}</code>.
        </p>
        <div className="hotspot-calibrate-dev-banner-actions">
          <button type="button" className="hotspot-calibrate-dev-banner-btn" onClick={scrollToTarget}>
            Jump to diagram
          </button>
          <button
            type="button"
            className="hotspot-calibrate-dev-banner-btn hotspot-calibrate-dev-banner-btn--ghost"
            onClick={exitHotspotCalibrateMode}
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  )
}
