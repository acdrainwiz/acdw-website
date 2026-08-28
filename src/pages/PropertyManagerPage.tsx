import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRightIcon,
  BuildingOffice2Icon,
  ClipboardDocumentListIcon,
  ClockIcon,
  EyeIcon,
  HomeIcon,
  ShieldCheckIcon,
  SignalIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'
import { AudienceContrastSection } from '../components/audience/AudienceContrastSection'
import { AudiencePageHero } from '../components/audience/AudiencePageHero'
import { useAudienceLandingMotion, useMiniHowStepPulse } from '../components/audience/audienceLandingMotion'
import { MiniFlowWaveBackdrop } from '../components/products/MiniFlowWaveBackdrop'
import { AUDIENCE_PROPERTY } from '../config/audienceCopy'

const STORY_ICONS = [HomeIcon, BuildingOffice2Icon, ClipboardDocumentListIcon] as const
const PATH_ICONS = [ShieldCheckIcon, SignalIcon] as const
const ROLLOUT_ICONS = [ClipboardDocumentListIcon, WrenchScrewdriverIcon, EyeIcon] as const

export function PropertyManagerPage() {
  const copy = AUDIENCE_PROPERTY
  const storyRef = useRef<HTMLElement>(null)
  const pathRef = useRef<HTMLElement>(null)
  const rolloutRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLElement>(null)
  const {
    reduceMotion,
    tr,
    stepContainer,
    stepBadgeVariants,
    stepIconVariants,
    stepChild,
    mhViewport,
  } = useAudienceLandingMotion()
  const storyPulse = useMiniHowStepPulse(3)
  const pathPulse = useMiniHowStepPulse(2)
  const rolloutPulse = useMiniHowStepPulse(3)

  return (
    <div className="mini-product-page audience-page audience-page-portfolio">
      <AudiencePageHero
        tone="portfolio"
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        dek={copy.hero.dek}
        imageSrc={copy.hero.imageSrc}
        imageAlt={copy.hero.imageAlt}
        primary={
          <Link to={copy.finalCta.salesHref} className="btn-inverse btn-lg">
            {copy.finalCta.salesCta}
          </Link>
        }
        secondary={
          <Link to={copy.path.standard.href} className="btn-inverse-outline btn-lg">
            See Sensor
          </Link>
        }
      />

      <section
        ref={storyRef}
        className="product-how-it-works mini-product-how-it-works homeowner-after-band"
        aria-labelledby="property-story-heading"
      >
        <MiniFlowWaveBackdrop sectionRef={storyRef} />
        <div className="product-how-it-works-content">
          <motion.header
            className="mini-section-header"
            initial={reduceMotion ? false : { opacity: 0, y: 52 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(1.02)}
          >
            <p className="mini-section-eyebrow">{copy.story.eyebrow}</p>
            <h2
              id="property-story-heading"
              className="product-section-title mini-section-title-promote"
            >
              {copy.story.title}
            </h2>
            <p className="mini-section-dek">{copy.story.dek}</p>
          </motion.header>

          <div className="mini-product-how-it-works-steps mini-how-steps-pulse-grid">
            {copy.story.cards.map((card, index) => {
              const Icon = STORY_ICONS[index] ?? HomeIcon
              return (
                <motion.div
                  key={card.title}
                  className="mini-product-how-it-works-step mini-how-step-slot mini-how-step-card"
                  data-mini-how-step-pulse={storyPulse(index)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={mhViewport}
                  variants={stepContainer}
                >
                  <div className="mini-how-step-num-anchor">
                    <motion.div className="mini-how-step-num-disk" variants={stepBadgeVariants}>
                      {card.number}
                    </motion.div>
                  </div>
                  <motion.div className="mini-how-step-icon-holder" variants={stepIconVariants}>
                    <Icon className="product-how-it-works-step-icon mini-how-step-icon-svg" />
                  </motion.div>
                  <motion.h3 className="product-how-it-works-step-title" variants={stepChild}>
                    {card.title}
                  </motion.h3>
                  <motion.p className="product-how-it-works-step-description" variants={stepChild}>
                    {card.description}
                  </motion.p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <AudienceContrastSection headingId="property-contrast-heading" copy={copy.contrast} />

      <section
        ref={pathRef}
        className="product-how-it-works mini-product-how-it-works"
        aria-labelledby="property-path-heading"
      >
        <MiniFlowWaveBackdrop sectionRef={pathRef} />
        <div className="product-how-it-works-content">
          <motion.header
            className="mini-section-header"
            initial={reduceMotion ? false : { opacity: 0, y: 52 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(1.02)}
          >
            <p className="mini-section-eyebrow">{copy.path.eyebrow}</p>
            <h2
              id="property-path-heading"
              className="product-section-title mini-section-title-promote"
            >
              {copy.path.title}
            </h2>
            <p className="mini-section-dek">{copy.path.dek}</p>
          </motion.header>

          <div className="mini-product-how-it-works-steps mini-how-steps-pulse-grid audience-path-steps">
            {([copy.path.standard, copy.path.wifi] as const).map((item, index) => {
              const LeadIcon = PATH_ICONS[index] ?? ShieldCheckIcon
              return (
                <motion.div
                  key={item.kicker}
                  className="mini-product-how-it-works-step mini-how-step-slot mini-how-step-card"
                  data-mini-how-step-pulse={pathPulse(index)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={mhViewport}
                  variants={stepContainer}
                >
                  <p className="audience-kicker homeowner-path-kicker">{item.kicker}</p>
                  <motion.h3 className="product-how-it-works-step-title" variants={stepChild}>
                    {item.title}
                  </motion.h3>
                  <motion.p className="product-how-it-works-step-description" variants={stepChild}>
                    {item.body}
                  </motion.p>
                  <motion.div className="homeowner-path-cta" variants={stepChild}>
                    <Link to={item.href} className="product-installation-video-guide-link">
                      <LeadIcon
                        className="product-installation-video-guide-link-lead-icon"
                        aria-hidden
                      />
                      <span>{item.cta}</span>
                      <ArrowRightIcon
                        className="product-installation-video-guide-link-trail-icon"
                        aria-hidden
                      />
                    </Link>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            className="product-installation-video product-installation-video--guide-only"
            initial={reduceMotion ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(0.92, 0.12)}
          >
            <div className="product-installation-video-guide product-installation-video-guide--standalone">
              <p className="product-installation-video-guide-eyebrow">On site</p>
              <p className="product-installation-video-guide-label">{copy.path.onSite}</p>
              <Link to={copy.path.miniHref} className="product-installation-video-guide-link">
                <WrenchScrewdriverIcon
                  className="product-installation-video-guide-link-lead-icon"
                  aria-hidden
                />
                <span>Mini for service access</span>
                <ArrowRightIcon
                  className="product-installation-video-guide-link-trail-icon"
                  aria-hidden
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        ref={rolloutRef}
        className="product-how-it-works mini-product-how-it-works"
        aria-labelledby="property-rollout-heading"
      >
        <MiniFlowWaveBackdrop sectionRef={rolloutRef} />
        <div className="product-how-it-works-content">
          <motion.header
            className="mini-section-header"
            initial={reduceMotion ? false : { opacity: 0, y: 52 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(1.02)}
          >
            <p className="mini-section-eyebrow">{copy.rollout.eyebrow}</p>
            <h2
              id="property-rollout-heading"
              className="product-section-title mini-section-title-promote"
            >
              {copy.rollout.title}
            </h2>
          </motion.header>

          <div className="mini-product-how-it-works-steps mini-how-steps-pulse-grid">
            {copy.rollout.steps.map((step, index) => {
              const Icon = ROLLOUT_ICONS[index] ?? ClockIcon
              return (
                <motion.div
                  key={step.title}
                  className="mini-product-how-it-works-step mini-how-step-slot mini-how-step-card"
                  data-mini-how-step-pulse={rolloutPulse(index)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={mhViewport}
                  variants={stepContainer}
                >
                  <div className="mini-how-step-num-anchor">
                    <motion.div className="mini-how-step-num-disk" variants={stepBadgeVariants}>
                      {step.number}
                    </motion.div>
                  </div>
                  <motion.div className="mini-how-step-icon-holder" variants={stepIconVariants}>
                    <Icon className="product-how-it-works-step-icon mini-how-step-icon-svg" />
                  </motion.div>
                  <motion.h3 className="product-how-it-works-step-title" variants={stepChild}>
                    {step.title}
                  </motion.h3>
                  <motion.p className="product-how-it-works-step-description" variants={stepChild}>
                    {step.description}
                  </motion.p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section
        ref={closeRef}
        className="mini-purchase-cta-band"
        aria-labelledby="property-close-heading"
      >
        <MiniFlowWaveBackdrop sectionRef={closeRef} />
        <div className="mini-purchase-cta-inner">
          <motion.div
            className="mini-purchase-cta-reveal"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 32 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(1.05)}
          >
            <p className="mini-purchase-cta-kicker">{copy.finalCta.kicker}</p>
            <div className="mini-purchase-cta-card">
              <div className="mini-product-purchase-card-content mini-buy-card">
                <h2 id="property-close-heading" className="sensor-product-purchase-title">
                  {copy.finalCta.title}
                </h2>
                <p className="sensor-product-purchase-message">{copy.finalCta.dek}</p>
                <div className="mini-buy-actions homeowner-close-actions">
                  <Link to={copy.finalCta.salesHref} className="btn-primary btn-lg">
                    {copy.finalCta.salesCta}
                  </Link>
                  <a href={copy.finalCta.callHref} className="btn-secondary btn-lg">
                    {copy.finalCta.callCta}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
