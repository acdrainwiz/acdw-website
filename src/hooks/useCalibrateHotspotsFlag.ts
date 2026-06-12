import { useEffect, useState } from 'react'

/**
 * Dev-only: true when `?calibrate=hotspots` is in the URL.
 * Never activates in production builds.
 */
export function useCalibrateHotspotsFlag() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!import.meta.env.DEV) return
    if (typeof window === 'undefined') return

    const read = () =>
      new URLSearchParams(window.location.search).get('calibrate') === 'hotspots'

    setEnabled(read())

    const onPopState = () => setEnabled(read())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  return enabled
}

/** Remove calibrate query param and exit calibration mode. */
export function exitHotspotCalibrateMode() {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  url.searchParams.delete('calibrate')
  window.history.replaceState({}, '', url.toString())
  window.dispatchEvent(new PopStateEvent('popstate'))
}
