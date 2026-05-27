import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { TRASH_THE_FLOAT } from '@/config/trashTheFloatCopy'

const MOBILE_MQ = '(max-width: 767px)'

type TtfStickyMobileCtaProps = {
  /** Element that must leave the viewport before the bar appears (hero CTA row). */
  showAfterId?: string
  /** Hide the bar while this section is on screen (story form). */
  hideWhenInViewId?: string
}

/**
 * Mobile-only sticky “Submit Your Story” bar — appears after the hero CTA
 * scrolls away and hides again at #submit-story.
 */
export function TtfStickyMobileCta({
  showAfterId = 'ttf-hero-cta-sentinel',
  hideWhenInViewId = 'submit-story',
}: TtfStickyMobileCtaProps) {
  const reduceMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)
  const [pastHeroCta, setPastHeroCta] = useState(false)
  const [atForm, setAtForm] = useState(false)

  const { label, href } = TRASH_THE_FLOAT.landing.heroCtaPrimary
  const visible = isMobile && pastHeroCta && !atForm

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mq = window.matchMedia(MOBILE_MQ)
    const syncMobile = () => setIsMobile(mq.matches)
    syncMobile()
    mq.addEventListener('change', syncMobile)
    return () => mq.removeEventListener('change', syncMobile)
  }, [])

  useEffect(() => {
    if (!isMobile) {
      setPastHeroCta(false)
      setAtForm(false)
      return
    }

    const sentinel = document.getElementById(showAfterId)
    const formSection = document.getElementById(hideWhenInViewId)
    if (!sentinel) return

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        setPastHeroCta(!entry.isIntersecting)
      },
      { threshold: 0, rootMargin: '-8% 0px 0px 0px' },
    )
    heroObserver.observe(sentinel)

    let formObserver: IntersectionObserver | undefined
    if (formSection) {
      formObserver = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return
          setAtForm(entry.isIntersecting)
        },
        { threshold: 0.12, rootMargin: '0px 0px -12% 0px' },
      )
      formObserver.observe(formSection)
    }

    return () => {
      heroObserver.disconnect()
      formObserver?.disconnect()
    }
  }, [isMobile, showAfterId, hideWhenInViewId])

  if (!isMobile) return null

  return (
    <div
      className="ttf-sticky-mobile-cta"
      aria-hidden={!visible}
      data-visible={visible ? 'true' : 'false'}
    >
      <AnimatePresence>
        {visible ? (
          <motion.div
            key="ttf-sticky-mobile-cta-bar"
            role="region"
            aria-label="Quick submit story"
            initial={reduceMotion ? false : { y: '100%', opacity: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { y: '100%', opacity: 0 }}
            transition={
              reduceMotion
                ? { duration: 0.15 }
                : { type: 'spring', stiffness: 420, damping: 34 }
            }
            className="ttf-sticky-mobile-cta-bar"
          >
            <a
              href={href}
              className="campaign-cta-primary ttf-sticky-mobile-cta-link gap-2 rounded-xl px-5 py-3 text-sm"
            >
              {label}
              <ArrowRightIcon className="h-4 w-4 shrink-0" aria-hidden />
            </a>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
