import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

declare global {
    interface Window {
        gtag?: (
            command: 'config' | 'event' | 'js' | 'set',
            targetId: string,
            config?: Record<string, unknown>
        ) => void
        dataLayer?: unknown[]
    }
}

export function usePageTracking() {
    const location = useLocation()

    useEffect(() => {

        if (typeof window.gtag === 'function') {
            window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
                page_path: location.pathname + location.search,
            })
        }
    }, [location])
}
export function trackEvent(
    eventName: string,
    eventParams?: Record<string, unknown>
) {
    if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, eventParams)
    }
}