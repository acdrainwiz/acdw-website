import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRightIcon,
  BookOpenIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  EyeIcon,
  ShieldCheckIcon,
  UserIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'
import { AudiencePageHero } from '../components/audience/AudiencePageHero'
import {
  useAudienceLandingMotion,
  useMiniHowStepPulse,
} from '../components/audience/audienceLandingMotion'
import { MiniDiscoveryCTA } from '../components/products/MiniDiscoveryCTA'
import { MiniFlowWaveBackdrop } from '../components/products/MiniFlowWaveBackdrop'
import { AUDIENCE_HOMEOWNER } from '../config/audienceCopy'
import { buildProductSupportHubHref } from '../utils/supportFaqSearch'

const AFTER_ICONS = [EyeIcon, WrenchScrewdriverIcon, ShieldCheckIcon] as const

export function HomeownerHomePage() {
  const copy = AUDIENCE_HOMEOWNER
  const contrastRef = useRef<HTMLElement>(null)
  const pathRef = useRef<HTMLElement>(null)
  const afterRef = useRef<HTMLElement>(null)
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
  const pathPulse = useMiniHowStepPulse(2)
  const afterPulse = useMiniHowStepPulse(3)

  return (
    <div className="mini-product-page audience-page audience-page-home">
      <AudiencePageHero
        tone="home"
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        dek={copy.hero.dek}
        imageSrc={copy.hero.imageSrc}
        imageAlt={copy.hero.imageAlt}
        primary={<MiniDiscoveryCTA className="btn-inverse btn-lg" />}
        secondary={
          <Link to={copy.finalCta.installerHref} className="btn-inverse-outline btn-lg">
            {copy.finalCta.installerCta}
          </Link>
        }
      />

      <section
        ref={contrastRef}
        className="mini-vs-old"
        aria-labelledby="homeowner-contrast-heading"
      >
        <MiniFlowWaveBackdrop sectionRef={contrastRef} />
        <div className="mini-vs-old-inner">
          <motion.header
            className="mini-section-header"
            initial={reduceMotion ? false : { opacity: 0, y: 44 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(0.98)}
          >
            <p className="mini-section-eyebrow">{copy.contrast.eyebrow}</p>
            <h2
              id="homeowner-contrast-heading"
              className="product-section-title mini-section-title-promote"
            >
              {copy.contrast.title}
            </h2>
          </motion.header>

          <div className="mini-vs-old-grid">
            <motion.div
              className="mini-vs-old-col mini-vs-old-col--before"
              initial={reduceMotion ? false : { opacity: 0, x: -48, y: 32 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={mhViewport}
              transition={tr(1.02)}
            >
              <p className="mini-vs-old-col-label">{copy.contrast.withoutLabel}</p>
              <ul className="mini-vs-old-list">
                {copy.contrast.without.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.div>

            <span className="mini-vs-old-divider" aria-hidden />

            <motion.div
              className="mini-vs-old-col mini-vs-old-col--after"
              initial={reduceMotion ? false : { opacity: 0, x: 48, y: 32 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={mhViewport}
              transition={tr(1.02, 0.14)}
            >
              <p className="mini-vs-old-col-label">{copy.contrast.withLabel}</p>
              <ul className="mini-vs-old-list">
                {copy.contrast.with.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section
        ref={pathRef}
        className="product-how-it-works mini-product-how-it-works"
        aria-labelledby="homeowner-path-heading"
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
            <p className="mini-section-eyebrow">{copy.diyVsPro.eyebrow}</p>
            <h2
              id="homeowner-path-heading"
              className="product-section-title mini-section-title-promote"
            >
              {copy.diyVsPro.title}
            </h2>
            <p className="mini-section-dek">{copy.diyVsPro.dek}</p>
          </motion.header>

          <div className="mini-product-how-it-works-steps mini-how-steps-pulse-grid homeowner-path-steps">
            {([copy.diyVsPro.diy, copy.diyVsPro.pro] as const).map((path, index) => {
              const LeadIcon = index === 0 ? BookOpenIcon : UserIcon
              return (
              <motion.div
                key={path.kicker}
                className="mini-product-how-it-works-step mini-how-step-slot mini-how-step-card"
                data-mini-how-step-pulse={pathPulse(index)}
                initial="hidden"
                whileInView="visible"
                viewport={mhViewport}
                variants={stepContainer}
              >
                <p className="audience-kicker homeowner-path-kicker">{path.kicker}</p>
                <motion.h3 className="product-how-it-works-step-title" variants={stepChild}>
                  {path.title}
                </motion.h3>
                <motion.p className="product-how-it-works-step-description" variants={stepChild}>
                  {path.body}
                </motion.p>
                <motion.div className="homeowner-path-cta" variants={stepChild}>
                  <Link to={path.href} className="product-installation-video-guide-link">
                    <LeadIcon
                      className="product-installation-video-guide-link-lead-icon"
                      aria-hidden
                    />
                    <span>{path.cta}</span>
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
        </div>
      </section>

      <section
        ref={afterRef}
        className="product-how-it-works mini-product-how-it-works homeowner-after-band"
        aria-labelledby="homeowner-after-heading"
      >
        <MiniFlowWaveBackdrop sectionRef={afterRef} />
        <div className="product-how-it-works-content">
          <motion.header
            className="mini-section-header"
            initial={reduceMotion ? false : { opacity: 0, y: 52 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(1.02)}
          >
            <p className="mini-section-eyebrow">{copy.afterInstall.eyebrow}</p>
            <h2
              id="homeowner-after-heading"
              className="product-section-title mini-section-title-promote"
            >
              {copy.afterInstall.title}
            </h2>
            <p className="mini-section-dek">{copy.afterInstall.dek}</p>
          </motion.header>

          <div className="mini-product-how-it-works-steps mini-how-steps-pulse-grid">
            {copy.afterInstall.steps.map((step, index) => {
              const Icon = AFTER_ICONS[index] ?? ClockIcon
              return (
                <motion.div
                  key={step.title}
                  className="mini-product-how-it-works-step mini-how-step-slot mini-how-step-card"
                  data-mini-how-step-pulse={afterPulse(index)}
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
                The Mini product page covers the hardware. Setup covers hose reach, transfer pumps, and the joint sequence.
              </p>
              <Link to={copy.afterInstall.productHref} className="product-installation-video-guide-link">
                <BookOpenIcon
                  className="product-installation-video-guide-link-lead-icon"
                  aria-hidden
                />
                <span>{copy.afterInstall.productCta}</span>
                <ArrowRightIcon
                  className="product-installation-video-guide-link-trail-icon"
                  aria-hidden
                />
              </Link>
              <Link
                to={copy.afterInstall.pumpHref}
                className="product-installation-video-guide-link product-installation-video-guide-link--secondary"
              >
                <BookOpenIcon
                  className="product-installation-video-guide-link-lead-icon"
                  aria-hidden
                />
                <span>{copy.afterInstall.pumpCta}</span>
                <ArrowRightIcon
                  className="product-installation-video-guide-link-trail-icon"
                  aria-hidden
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mini-product-testimonials" aria-labelledby="homeowner-quotes-heading">
        <div className="mini-product-testimonials-content">
          <motion.header
            className="mini-section-header"
            initial={reduceMotion ? false : { opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(1)}
          >
            <p className="mini-section-eyebrow">{copy.quotes.eyebrow}</p>
            <h2
              id="homeowner-quotes-heading"
              className="product-section-title mini-section-title-promote"
            >
              {copy.quotes.title}
            </h2>
          </motion.header>

          <div className="mini-product-testimonials-grid">
            {copy.quotes.items.map((quote, index) => (
              <motion.div
                key={quote.name}
                className="mini-product-testimonial-card mini-product-testimonial-card--editorial"
                initial={reduceMotion ? false : { opacity: 0, x: index % 2 === 0 ? -42 : 42, y: 28 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={mhViewport}
                transition={tr(1.02, (index >> 1) * 0.18)}
              >
                <span className="mini-product-testimonial-quote-mark" aria-hidden>
                  “
                </span>
                <p className="mini-product-testimonial-text">{quote.text}</p>
                <div className="mini-product-testimonial-author">
                  <span
                    className="mini-product-testimonial-avatar mini-product-testimonial-avatar--homeowner"
                    aria-hidden
                  >
                    {quote.initials}
                  </span>
                  <span className="mini-product-testimonial-author-meta">
                    <span className="mini-product-testimonial-name">{quote.name}</span>
                    <span className="mini-product-testimonial-role">{quote.role}</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="product-faq mini-product-faq" aria-labelledby="homeowner-faq-heading">
        <div className="product-faq-content">
          <motion.header
            className="mini-section-header"
            initial={reduceMotion ? false : { opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(1)}
          >
            <p className="mini-section-eyebrow">Need-to-know</p>
            <h2
              id="homeowner-faq-heading"
              className="product-section-title mini-section-title-promote"
            >
              Questions homeowners ask first
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
            Have a question we didn&apos;t cover?{' '}
            <Link to={buildProductSupportHubHref('mini')} className="product-faq-contact-link">
              Browse Product Support FAQs
            </Link>
          </p>
        </div>
      </section>

      <section
        id="shop-mini"
        ref={closeRef}
        className="mini-purchase-cta-band"
        aria-labelledby="homeowner-close-heading"
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
                <h2 id="homeowner-close-heading" className="sensor-product-purchase-title">
                  {copy.finalCta.title}
                </h2>
                <p className="sensor-product-purchase-message">{copy.finalCta.dek}</p>
                <div className="mini-buy-actions homeowner-close-actions">
                  <MiniDiscoveryCTA className="btn-primary btn-lg" />
                  <Link to={copy.finalCta.installerHref} className="btn-secondary btn-lg">
                    {copy.finalCta.installerCta}
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
