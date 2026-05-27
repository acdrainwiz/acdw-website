import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { motion, useReducedMotion } from 'framer-motion'
import { TRASH_THE_FLOAT } from '@/config/trashTheFloatCopy'

/**
 * Homepage section that teases the "Trash the Float" campaign.
 * Renders below the hero in HomePage.tsx.
 * Background uses var(--acdw-navy) to match the existing dark section treatment.
 */
export function CampaignTeaser() {
  const reduceMotion = useReducedMotion()

  const fadeIn = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.55, ease: [0.22, 0.61, 0.36, 1] as const },
      }

  return (
    <section
      aria-labelledby="campaign-teaser-heading"
      className="relative overflow-hidden py-16 sm:py-20"
      style={{ backgroundColor: 'var(--acdw-navy)' }}
    >
      {/* Decorative ambient glows — brand orange only, matches .hero-accent-cta hue */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-[var(--acdw-orange)]/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[var(--acdw-orange)]/8 blur-3xl"
      />

      <motion.div
        {...fadeIn}
        className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 sm:px-6 md:grid-cols-2 md:gap-12 lg:gap-16"
      >
        {/* Copy column */}
        <div>
          <span className="campaign-eyebrow">{TRASH_THE_FLOAT.campaignKicker}</span>

          <h2
            id="campaign-teaser-heading"
            className="mt-4 text-balance text-3xl font-bold leading-tight text-white sm:text-4xl md:text-[40px]"
          >
            {TRASH_THE_FLOAT.teaser.title}
          </h2>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            {TRASH_THE_FLOAT.teaser.body}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to={TRASH_THE_FLOAT.teaser.ctaPrimary.href}
              className="campaign-cta-primary gap-2 rounded-xl px-5 py-3 text-sm"
            >
              {TRASH_THE_FLOAT.teaser.ctaPrimary.label}
              <ArrowRightIcon className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              to={TRASH_THE_FLOAT.teaser.ctaSecondary.href}
              className="campaign-cta-secondary rounded-xl px-5 py-3 text-sm"
            >
              {TRASH_THE_FLOAT.teaser.ctaSecondary.label}
            </Link>
          </div>
        </div>

        {/* Visual comparison column */}
        <div className="relative">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5">
            <TeaserThumb
              src={TRASH_THE_FLOAT.images.floatOld}
              alt="Legacy float switch"
              label="Reactive"
              tone="dim"
            />
            <span
              aria-hidden
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-xs font-bold uppercase tracking-wider text-white/70 sm:h-12 sm:w-12 sm:text-sm"
            >
              vs
            </span>
            <TeaserThumb
              src={TRASH_THE_FLOAT.images.sensorStandard}
              alt="AC Drain Wiz Standard Sensor Switch"
              label="Smart"
              tone="smart"
            />
          </div>
          <p className="mt-4 text-center text-xs text-white/50">
            Old way vs. AC Drain Wiz Standard Sensor Switch
          </p>
        </div>
      </motion.div>
    </section>
  )
}

interface TeaserThumbProps {
  src: string
  alt: string
  label: string
  tone: 'dim' | 'smart'
}

function TeaserThumb({ src, alt, label, tone }: TeaserThumbProps) {
  const isSmart = tone === 'smart'
  return (
    <figure className={isSmart ? 'campaign-card campaign-card-smart p-3 sm:p-4' : 'campaign-card p-3 sm:p-4'}>
      <div className="flex h-28 items-center justify-center sm:h-36">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={
            isSmart
              ? 'h-full w-full object-contain drop-shadow-[0_10px_25px_rgba(255,78,0,0.25)]'
              : 'h-full w-full object-contain opacity-85'
          }
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>
      <figcaption
        className={
          isSmart
            ? 'mt-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--acdw-orange)]'
            : 'mt-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55'
        }
      >
        {label}
      </figcaption>
    </figure>
  )
}
