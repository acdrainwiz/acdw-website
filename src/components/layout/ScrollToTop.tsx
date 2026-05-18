import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function scrollToHashTarget(id: string): boolean {
  const el = document.getElementById(id)
  if (!el) return false
  el.scrollIntoView({ behavior: 'instant', block: 'start', inline: 'nearest' })
  return true
}

export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      return
    }

    const id = hash.slice(1)
    if (!id) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      return
    }

    let cancelled = false
    const attempt = () => {
      if (cancelled) return
      scrollToHashTarget(id)
    }

    requestAnimationFrame(() => {
      attempt()
      requestAnimationFrame(attempt)
    })

    const timeoutIds = [0, 100, 300, 600, 1000].map((ms) =>
      window.setTimeout(attempt, ms),
    )

    window.addEventListener('load', attempt)

    const giveUpId = window.setTimeout(() => {
      if (cancelled) return
      if (!document.getElementById(id)) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      }
    }, 2000)

    return () => {
      cancelled = true
      timeoutIds.forEach(clearTimeout)
      clearTimeout(giveUpId)
      window.removeEventListener('load', attempt)
    }
  }, [pathname, hash])

  return null
}
