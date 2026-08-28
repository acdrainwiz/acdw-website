import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import {
  AUDIENCE_MH_EASE,
  AUDIENCE_MH_VIEWPORT,
} from '../audience/audienceLandingMotion'
import { AUDIENCE_SELECTOR } from '../../config/audienceCopy'

type CustomerTypeSelectorProps = {
  showHeader?: boolean
}

type AudienceTile =
  (typeof AUDIENCE_SELECTOR)['homeowner' | 'hvac' | 'property' | 'code']

const MotionLink = motion.create(Link)

function AudienceTileCard({
  path,
  variant,
  variants,
}: {
  path: AudienceTile
  variant: 'full' | 'half'
  variants: Variants
}) {
  return (
    <MotionLink
      to={path.href}
      className={`audience-who-tile audience-who-tile-${variant}`}
      variants={variants}
    >
      <img
        src={path.imageSrc}
        alt={path.imageAlt}
        className="audience-who-tile-image"
        width={variant === 'full' ? 1600 : 1200}
        height={variant === 'full' ? 900 : 900}
      />
      <div className="audience-who-tile-veil" aria-hidden />
      <div className="audience-who-tile-copy">
        <p className="audience-who-tile-line">{path.headline}</p>
        <h3 className="audience-who-tile-title">{path.kicker}</h3>
        <span className="btn-inverse btn-md audience-who-tile-cta">{path.go}</span>
      </div>
    </MotionLink>
  )
}

export const CustomerTypeSelector = forwardRef<HTMLElement, CustomerTypeSelectorProps>(
  function CustomerTypeSelector({ showHeader = true }, ref) {
    const { homeowner, hvac, property, code } = AUDIENCE_SELECTOR
    const reduceMotion = useReducedMotion()

    const headerTransition = reduceMotion
      ? ({ duration: 0.22 } as const)
      : ({ duration: 0.98, ease: AUDIENCE_MH_EASE } as const)

    const gridVariants: Variants = reduceMotion
      ? {
          hidden: { opacity: 1 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0, delayChildren: 0 },
          },
        }
      : {
          hidden: { opacity: 1 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.12,
              delayChildren: 0.05,
            },
          },
        }

    const tileVariants: Variants = reduceMotion
      ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
      : {
          hidden: { opacity: 0, y: 36 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.75, ease: AUDIENCE_MH_EASE },
          },
        }

    return (
      <section
        ref={ref}
        className="audience-who"
        aria-labelledby={showHeader ? 'audience-who-heading' : undefined}
        aria-label={showHeader ? undefined : AUDIENCE_SELECTOR.title}
      >
        <div className="audience-who-inner">
          {showHeader ? (
            <motion.header
              className="audience-who-header"
              initial={reduceMotion ? false : { opacity: 0, y: 44 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={AUDIENCE_MH_VIEWPORT}
              transition={headerTransition}
            >
              <p className="mini-section-eyebrow">{AUDIENCE_SELECTOR.eyebrow}</p>
              <h2 id="audience-who-heading" className="audience-who-title">
                {AUDIENCE_SELECTOR.title}
              </h2>
              <p className="audience-who-dek">{AUDIENCE_SELECTOR.dek}</p>
            </motion.header>
          ) : null}

          <motion.div
            className="audience-who-grid"
            initial="hidden"
            whileInView="visible"
            viewport={AUDIENCE_MH_VIEWPORT}
            variants={gridVariants}
          >
            <AudienceTileCard path={homeowner} variant="full" variants={tileVariants} />
            <AudienceTileCard path={hvac} variant="full" variants={tileVariants} />
            <AudienceTileCard path={property} variant="half" variants={tileVariants} />
            <AudienceTileCard path={code} variant="half" variants={tileVariants} />
          </motion.div>
        </div>
      </section>
    )
  }
)
