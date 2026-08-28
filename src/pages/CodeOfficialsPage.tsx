import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRightIcon,
  BellAlertIcon,
  BookOpenIcon,
  BuildingOffice2Icon,
  CheckBadgeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  EyeIcon,
  ShieldCheckIcon,
  SignalIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'
import { AudienceContrastSection } from '../components/audience/AudienceContrastSection'
import { AudiencePageHero } from '../components/audience/AudiencePageHero'
import { useAudienceLandingMotion, useMiniHowStepPulse } from '../components/audience/audienceLandingMotion'
import { MiniFlowWaveBackdrop } from '../components/products/MiniFlowWaveBackdrop'
import { AUDIENCE_CODE } from '../config/audienceCopy'

const CITY_ICONS = [BuildingOffice2Icon, WrenchScrewdriverIcon, BellAlertIcon] as const
const STATUS_ICONS = [EyeIcon, SignalIcon] as const
const SPECIFY_ICONS = [CheckBadgeIcon, ShieldCheckIcon] as const

export function CodeOfficialsPage() {
  const copy = AUDIENCE_CODE
  const inspectRef = useRef<HTMLElement>(null)
  const cityRef = useRef<HTMLElement>(null)
  const specifyRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLElement>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const {
    reduceMotion,
    tr,
    stepContainer,
    stepBadgeVariants,
    stepIconVariants,
    stepChild,
    mhViewport,
  } = useAudienceLandingMotion()
  const inspectPulse = useMiniHowStepPulse(2)
  const cityPulse = useMiniHowStepPulse(3)
  const statusPulse = useMiniHowStepPulse(2)
  const specifyPulse = useMiniHowStepPulse(2)

  return (
    <div className="mini-product-page audience-page audience-page-spec">
      <AudiencePageHero
        tone="spec"
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        dek={copy.hero.dek}
        imageSrc={copy.hero.imageSrc}
        imageAlt={copy.hero.imageAlt}
        primary={
          <Link to={copy.finalCta.complianceHref} className="btn-inverse btn-lg">
            View compliance documentation
          </Link>
        }
        secondary={
          <Link to={copy.finalCta.municipalHref} className="btn-inverse-outline btn-lg">
            {copy.finalCta.municipalCta}
          </Link>
        }
      />

      <AudienceContrastSection headingId="code-contrast-heading" copy={copy.contrast} />

      <section
        ref={inspectRef}
        className="product-how-it-works mini-product-how-it-works"
        aria-labelledby="code-inspect-heading"
      >
        <MiniFlowWaveBackdrop sectionRef={inspectRef} />
        <div className="product-how-it-works-content">
          <motion.header
            className="mini-section-header"
            initial={reduceMotion ? false : { opacity: 0, y: 52 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(1.02)}
          >
            <p className="mini-section-eyebrow">{copy.inspect.eyebrow}</p>
            <h2
              id="code-inspect-heading"
              className="product-section-title mini-section-title-promote"
            >
              {copy.inspect.title}
            </h2>
            <p className="mini-section-dek">{copy.inspect.dek}</p>
          </motion.header>

          <div className="mini-product-how-it-works-steps mini-how-steps-pulse-grid audience-path-steps">
            {([copy.inspect.inspector, copy.inspect.contractor] as const).map((item, index) => {
              const LeadIcon = index === 0 ? EyeIcon : WrenchScrewdriverIcon
              return (
                <motion.div
                  key={item.kicker}
                  className="mini-product-how-it-works-step mini-how-step-slot mini-how-step-card"
                  data-mini-how-step-pulse={inspectPulse(index)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={mhViewport}
                  variants={stepContainer}
                >
                  <p className="audience-kicker homeowner-path-kicker">{item.kicker}</p>
                  <motion.div className="mini-how-step-icon-holder" variants={stepIconVariants}>
                    <LeadIcon className="product-how-it-works-step-icon mini-how-step-icon-svg" />
                  </motion.div>
                  <motion.h3 className="product-how-it-works-step-title" variants={stepChild}>
                    {item.title}
                  </motion.h3>
                  <motion.p className="product-how-it-works-step-description" variants={stepChild}>
                    {item.body}
                  </motion.p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section
        ref={cityRef}
        className="product-how-it-works mini-product-how-it-works homeowner-after-band"
        aria-labelledby="code-city-heading"
      >
        <MiniFlowWaveBackdrop sectionRef={cityRef} />
        <div className="product-how-it-works-content">
          <motion.header
            className="mini-section-header"
            initial={reduceMotion ? false : { opacity: 0, y: 52 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(1.02)}
          >
            <p className="mini-section-eyebrow">{copy.city.eyebrow}</p>
            <h2
              id="code-city-heading"
              className="product-section-title mini-section-title-promote"
            >
              {copy.city.title}
            </h2>
            <p className="mini-section-dek">{copy.city.dek}</p>
          </motion.header>

          <div className="mini-product-how-it-works-steps mini-how-steps-pulse-grid">
            {copy.city.cards.map((card, index) => {
              const Icon = CITY_ICONS[index] ?? BuildingOffice2Icon
              return (
                <motion.div
                  key={card.title}
                  className="mini-product-how-it-works-step mini-how-step-slot mini-how-step-card"
                  data-mini-how-step-pulse={cityPulse(index)}
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

          <motion.header
            className="mini-section-header"
            initial={reduceMotion ? false : { opacity: 0, y: 52 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(1.02)}
          >
            <p className="mini-section-eyebrow">{copy.city.status.eyebrow}</p>
            <h2
              id="code-city-status-heading"
              className="product-section-title mini-section-title-promote"
            >
              {copy.city.status.title}
            </h2>
            <p className="mini-section-dek">{copy.city.status.dek}</p>
          </motion.header>

          <div className="mini-product-how-it-works-steps mini-how-steps-pulse-grid audience-path-steps">
            {([copy.city.status.walkthrough, copy.city.status.campus] as const).map((item, index) => {
              const LeadIcon = STATUS_ICONS[index] ?? EyeIcon
              return (
                <motion.div
                  key={item.kicker}
                  className="mini-product-how-it-works-step mini-how-step-slot mini-how-step-card"
                  data-mini-how-step-pulse={statusPulse(index)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={mhViewport}
                  variants={stepContainer}
                >
                  <p className="audience-kicker homeowner-path-kicker">{item.kicker}</p>
                  <motion.div className="mini-how-step-icon-holder" variants={stepIconVariants}>
                    <LeadIcon className="product-how-it-works-step-icon mini-how-step-icon-svg" />
                  </motion.div>
                  <motion.h3 className="product-how-it-works-step-title" variants={stepChild}>
                    {item.title}
                  </motion.h3>
                  <motion.p className="product-how-it-works-step-description" variants={stepChild}>
                    {item.body}
                  </motion.p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section
        ref={specifyRef}
        className="product-how-it-works mini-product-how-it-works"
        aria-labelledby="code-specify-heading"
      >
        <MiniFlowWaveBackdrop sectionRef={specifyRef} />
        <div className="product-how-it-works-content">
          <motion.header
            className="mini-section-header"
            initial={reduceMotion ? false : { opacity: 0, y: 52 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(1.02)}
          >
            <p className="mini-section-eyebrow">{copy.specify.eyebrow}</p>
            <h2
              id="code-specify-heading"
              className="product-section-title mini-section-title-promote"
            >
              {copy.specify.title}
            </h2>
            <p className="mini-section-dek">{copy.specify.dek}</p>
          </motion.header>

          <div className="mini-product-how-it-works-steps mini-how-steps-pulse-grid audience-path-steps">
            {copy.specify.items.map((item, index) => {
              const Icon = SPECIFY_ICONS[index] ?? ClockIcon
              return (
                <motion.div
                  key={item.title}
                  className="mini-product-how-it-works-step mini-how-step-slot mini-how-step-card"
                  data-mini-how-step-pulse={specifyPulse(index)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={mhViewport}
                  variants={stepContainer}
                >
                  <div className="mini-how-step-num-anchor">
                    <motion.div className="mini-how-step-num-disk" variants={stepBadgeVariants}>
                      {item.number}
                    </motion.div>
                  </div>
                  <motion.div className="mini-how-step-icon-holder" variants={stepIconVariants}>
                    <Icon className="product-how-it-works-step-icon mini-how-step-icon-svg" />
                  </motion.div>
                  <motion.h3 className="product-how-it-works-step-title" variants={stepChild}>
                    {item.title}
                  </motion.h3>
                  <motion.p className="product-how-it-works-step-description" variants={stepChild}>
                    {item.description}
                  </motion.p>
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
              <p className="product-installation-video-guide-eyebrow">Citation notes</p>
              <p className="product-installation-video-guide-label">{copy.specify.disclaimer}</p>
              <Link to={copy.specify.complianceHref} className="product-installation-video-guide-link">
                <BookOpenIcon
                  className="product-installation-video-guide-link-lead-icon"
                  aria-hidden
                />
                <span>{copy.specify.complianceCta}</span>
                <ArrowRightIcon
                  className="product-installation-video-guide-link-trail-icon"
                  aria-hidden
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="product-faq mini-product-faq" aria-labelledby="code-faq-heading">
        <div className="product-faq-content">
          <motion.header
            className="mini-section-header"
            initial={reduceMotion ? false : { opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(1)}
          >
            <p className="mini-section-eyebrow">Need-to-know</p>
            <h2 id="code-faq-heading" className="product-section-title mini-section-title-promote">
              {copy.faqTitle}
            </h2>
          </motion.header>
          <div className="product-faq-list">
            {copy.faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                className="product-faq-item"
                initial={reduceMotion ? false : { opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={mhViewport}
                transition={tr(0.72, Math.min(index, 8) * 0.09)}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="product-faq-question"
                  aria-expanded={openFaq === index}
                >
                  <span>{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUpIcon className="product-faq-icon" />
                  ) : (
                    <ChevronDownIcon className="product-faq-icon" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="product-faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          <p className="product-faq-subtitle">
            Full citation notes stay on the{' '}
            <Link to="/compliance" className="product-faq-contact-link">
              compliance page
            </Link>
            .
          </p>
        </div>
      </section>

      <section
        ref={closeRef}
        className="mini-purchase-cta-band"
        aria-labelledby="code-close-heading"
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
                <h2 id="code-close-heading" className="sensor-product-purchase-title">
                  {copy.finalCta.title}
                </h2>
                <p className="sensor-product-purchase-message">{copy.finalCta.dek}</p>
                <div className="mini-buy-actions homeowner-close-actions">
                  <Link to={copy.finalCta.complianceHref} className="btn-primary btn-lg">
                    {copy.finalCta.complianceCta}
                  </Link>
                  <Link to={copy.finalCta.municipalHref} className="btn-secondary btn-lg">
                    {copy.finalCta.municipalCta}
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
