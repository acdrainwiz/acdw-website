import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
  BellAlertIcon,
  BookOpenIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  ComputerDesktopIcon,
  CubeIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'
import { AudienceContrastSection } from '../components/audience/AudienceContrastSection'
import { AudiencePageHero } from '../components/audience/AudiencePageHero'
import { useAudienceLandingMotion, useMiniHowStepPulse } from '../components/audience/audienceLandingMotion'
import { MiniFlowWaveBackdrop } from '../components/products/MiniFlowWaveBackdrop'
import { AUDIENCE_HVAC } from '../config/audienceCopy'
import { buildProductSupportHubHref } from '../utils/supportFaqSearch'

const STOCK_ICONS = [WrenchScrewdriverIcon, CubeIcon] as const
const DASH_ICONS = [BellAlertIcon, ComputerDesktopIcon, ClockIcon] as const

export function HVACProsPage() {
  const copy = AUDIENCE_HVAC
  const stockRef = useRef<HTMLElement>(null)
  const dashRef = useRef<HTMLElement>(null)
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
  const stockPulse = useMiniHowStepPulse(2)
  const dashPulse = useMiniHowStepPulse(3)

  return (
    <div className="mini-product-page audience-page audience-page-trade">
      <AudiencePageHero
        tone="trade"
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        dek={copy.hero.dek}
        imageSrc={copy.hero.imageSrc}
        imageAlt={copy.hero.imageAlt}
        primary={
          <Link to={copy.finalCta.salesHref} className="btn-inverse btn-lg">
            Contact sales for contractor pricing
          </Link>
        }
        secondary={
          <Link to="/products/combo" className="btn-inverse-outline btn-lg">
            View complete system
          </Link>
        }
      />

      <AudienceContrastSection headingId="hvac-contrast-heading" copy={copy.contrast} />

      <section
        ref={stockRef}
        className="product-how-it-works mini-product-how-it-works"
        aria-labelledby="hvac-stock-heading"
      >
        <MiniFlowWaveBackdrop sectionRef={stockRef} />
        <div className="product-how-it-works-content">
          <motion.header
            className="mini-section-header"
            initial={reduceMotion ? false : { opacity: 0, y: 52 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(1.02)}
          >
            <p className="mini-section-eyebrow">{copy.offer.eyebrow}</p>
            <h2 id="hvac-stock-heading" className="product-section-title mini-section-title-promote">
              {copy.offer.title}
            </h2>
            <p className="mini-section-dek">{copy.offer.dek}</p>
          </motion.header>

          <div className="mini-product-how-it-works-steps mini-how-steps-pulse-grid audience-path-steps">
            {([copy.offer.mini, copy.offer.combo] as const).map((item, index) => {
              const LeadIcon = STOCK_ICONS[index] ?? WrenchScrewdriverIcon
              return (
                <motion.div
                  key={item.kicker}
                  className="mini-product-how-it-works-step mini-how-step-slot mini-how-step-card"
                  data-mini-how-step-pulse={stockPulse(index)}
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
              <p className="product-installation-video-guide-eyebrow">Keep going</p>
              <p className="product-installation-video-guide-label">
                Horizontal 3/4&quot; PVC, transfer pumps, and other layouts live on the scenarios page.
              </p>
              <Link to={copy.offer.scenariosHref} className="product-installation-video-guide-link">
                <BookOpenIcon
                  className="product-installation-video-guide-link-lead-icon"
                  aria-hidden
                />
                <span>{copy.offer.scenariosCta}</span>
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
        ref={dashRef}
        className="product-how-it-works mini-product-how-it-works homeowner-after-band"
        aria-labelledby="hvac-dash-heading"
      >
        <MiniFlowWaveBackdrop sectionRef={dashRef} />
        <div className="product-how-it-works-content">
          <motion.header
            className="mini-section-header"
            initial={reduceMotion ? false : { opacity: 0, y: 52 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(1.02)}
          >
            <p className="mini-section-eyebrow">{copy.dashboard.eyebrow}</p>
            <h2 id="hvac-dash-heading" className="product-section-title mini-section-title-promote">
              {copy.dashboard.title}
            </h2>
            <p className="mini-section-dek">{copy.dashboard.dek}</p>
          </motion.header>

          <div className="mini-product-how-it-works-steps mini-how-steps-pulse-grid">
            {copy.dashboard.steps.map((step, index) => {
              const Icon = DASH_ICONS[index] ?? ClockIcon
              return (
                <motion.div
                  key={step.title}
                  className="mini-product-how-it-works-step mini-how-step-slot mini-how-step-card"
                  data-mini-how-step-pulse={dashPulse(index)}
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

          <motion.div
            className="product-installation-video product-installation-video--guide-only"
            initial={reduceMotion ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(0.92, 0.12)}
          >
            <div className="product-installation-video-guide product-installation-video-guide--standalone">
              <p className="product-installation-video-guide-eyebrow">Keep going</p>
              <p className="product-installation-video-guide-label">
                Contractor login is on the monitoring portal. Model differences live on the Sensor page.
              </p>
              <Link
                to={copy.dashboard.sensorHref}
                className="product-installation-video-guide-link"
              >
                <BookOpenIcon
                  className="product-installation-video-guide-link-lead-icon"
                  aria-hidden
                />
                <span>{copy.dashboard.sensorCta}</span>
                <ArrowRightIcon
                  className="product-installation-video-guide-link-trail-icon"
                  aria-hidden
                />
              </Link>
              <a
                href={copy.dashboard.portalUrl}
                className="product-installation-video-guide-link product-installation-video-guide-link--secondary"
                rel="noopener noreferrer"
              >
                <ArrowTopRightOnSquareIcon
                  className="product-installation-video-guide-link-lead-icon"
                  aria-hidden
                />
                <span>{copy.dashboard.portalCta}</span>
                <ArrowRightIcon
                  className="product-installation-video-guide-link-trail-icon"
                  aria-hidden
                />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mini-product-testimonials" aria-labelledby="hvac-quotes-heading">
        <div className="mini-product-testimonials-content">
          <motion.header
            className="mini-section-header"
            initial={reduceMotion ? false : { opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(1)}
          >
            <p className="mini-section-eyebrow">{copy.joey.eyebrow}</p>
            <h2 id="hvac-quotes-heading" className="product-section-title mini-section-title-promote">
              {copy.joey.title}
            </h2>
          </motion.header>

          <div className="mini-product-testimonials-grid audience-quote-single">
            <motion.div
              className="mini-product-testimonial-card mini-product-testimonial-card--editorial"
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={mhViewport}
              transition={tr(1.02)}
            >
              <span className="mini-product-testimonial-quote-mark" aria-hidden>
                “
              </span>
              <p className="mini-product-testimonial-text">{copy.joey.text}</p>
              <div className="mini-product-testimonial-author">
                <span className="mini-product-testimonial-avatar mini-product-testimonial-avatar--photo" aria-hidden>
                  <img src={copy.joey.image} alt="" width={44} height={44} />
                </span>
                <span className="mini-product-testimonial-author-meta">
                  <span className="mini-product-testimonial-name">{copy.joey.name}</span>
                  <span className="mini-product-testimonial-role">{copy.joey.role}</span>
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="product-faq mini-product-faq" aria-labelledby="hvac-faq-heading">
        <div className="product-faq-content">
          <motion.header
            className="mini-section-header"
            initial={reduceMotion ? false : { opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(1)}
          >
            <p className="mini-section-eyebrow">Need-to-know</p>
            <h2 id="hvac-faq-heading" className="product-section-title mini-section-title-promote">
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
            IMC notes for 307.2.5, 307.2.2, and 307.2.1.1 are on the{' '}
            <Link to="/compliance" className="product-faq-contact-link">
              compliance page
            </Link>
            . More product questions:{' '}
            <Link to={buildProductSupportHubHref('mini')} className="product-faq-contact-link">
              Product Support FAQs
            </Link>
            .
          </p>
        </div>
      </section>

      <section
        ref={closeRef}
        className="mini-purchase-cta-band"
        aria-labelledby="hvac-close-heading"
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
                <h2 id="hvac-close-heading" className="sensor-product-purchase-title">
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
