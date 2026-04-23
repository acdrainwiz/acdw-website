import { useEffect, useRef } from 'react'
import type { ComponentType, SVGProps } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion'
import {
  EnvelopeIcon,
  PhoneIcon,
  WrenchScrewdriverIcon,
  HomeIcon,
  BuildingOffice2Icon,
  ArrowRightIcon,
  CubeIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { PRODUCT_NAMES, SUPPORT_CONTACT, SENSOR_STANDARD_SHORT } from '../config/acdwKnowledge'
import { MiamiHeatPartnershipLockup } from '../components/layout/MiamiHeatPartnershipLockup'
import type { PageSearchMeta } from '../config/siteSearchTypes'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'page-about',
  kind: 'site',
  title: 'About AC Drain Wiz',
  body: 'Built for the line and the people who service it. Permanent condensate drain access and overflow protection so technicians work faster and see what is happening in the line. Company story: one-time installed solutions, faster cleanouts with Mini, Mini plus Standard Sensor Switch combo, overflow protection with Sensor. Our Values: contractor-first, clarity, permanence in practice, readiness before emergencies. Alan Riddle founder story, attic flooding and condensate line service. Miami HEAT partnership. Who we serve: HVAC contractors, property managers, homeowners. ICC code compliant, professional grade, made in USA. Contact and leadership information.',
  tags: ['about', 'company', 'mission', 'founder', 'story', 'values', 'miami heat', 'partnership'],
  href: '/about',
}

// ─── Animation variants ──────────────────────────────────────────────────────

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}


const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

const slideFromLeft = {
  hidden: { opacity: 0, x: -22 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

const slideFromRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring' as const, stiffness: 70, damping: 18 },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 90, damping: 20 },
  },
}

const vp = { once: true, amount: 0.2 } as const

// ─── Animated counter ────────────────────────────────────────────────────────

function AnimatedStat({
  target,
  prefix = '',
  suffix = '',
}: {
  target: number
  prefix?: string
  suffix?: string
}) {
  const nodeRef = useRef<HTMLSpanElement>(null)
  const count = useMotionValue(0)
  const displayed = useTransform(count, (v) => `${prefix}${Math.round(v)}${suffix}`)
  const isInView = useInView(nodeRef, { once: true, amount: 0.5 })

  useEffect(() => {
    if (isInView) {
      animate(count, target, { duration: 1.4, ease: 'easeOut' })
    }
  }, [isInView, count, target])

  return <motion.span ref={nodeRef}>{displayed}</motion.span>
}

// ─── Static data ─────────────────────────────────────────────────────────────

/**
 * Unified "What We Deliver" stats — replaces both the old trust strip
 * and the separate pillar section. Card 1: faster cleanouts (Mini named in sub only).
 * Card 2: combo (Mini + Standard Sensor)—“2X” (two products, X-style like card 1). Card 3: Sensor overflow protection (80% =
 *   approved shutdown threshold—not a profit percentage).
 */
const stats = [
  {
    target: 10,
    prefix: '',
    suffix: 'X',
    label: 'Faster cleanouts',
    sub: `${PRODUCT_NAMES.mini} is permanent maintenance access on the condensate line: flush, air, and vacuum through one port, with a clear body for visual verification—no guesswork.`,
    accent: '#2563eb',
    href: '/products/mini',
  },
  {
    target: 2,
    prefix: '',
    suffix: 'X',
    label: 'Mini + Standard Sensor combo',
    sub: `AC Drain Wiz Mini plus ${SENSOR_STANDARD_SHORT} in one bundle: permanent drain line maintenance access and automatic overflow protection in a single install.`,
    accent: '#2eb4e8',
    href: '/products/combo',
  },
  {
    target: 80,
    prefix: '',
    suffix: '%',
    label: 'Overflow protection',
    sub: 'Automatic AC shutdown at 80% water level—no moving parts, fail-safe on power loss. WiFi Sensor adds configurable alerts from 50–79% so you can schedule service before shutdown.',
    accent: '#ea580c',
    href: '/products/sensor',
  },
]

const audiences = [
  {
    Icon: WrenchScrewdriverIcon,
    title: 'HVAC Contractors',
    text: 'Faster cleanouts, no repeated cut-and-reattach, and upsell opportunities with one-time installed maintenance access and optional overflow protection.',
  },
  {
    Icon: BuildingOffice2Icon,
    title: 'Property Managers',
    text: 'Predictive maintenance with WiFi sensor alerts, fewer emergency callbacks, and a streamlined process across multiple units.',
  },
  {
    Icon: HomeIcon,
    title: 'Homeowners',
    text: 'Permanent service access for your condensate line and automatic overflow protection so you can avoid water damage and unexpected AC shutdowns.',
  },
]

type AboutValueIcon = ComponentType<SVGProps<SVGSVGElement>>

/** Path C (hybrid): two belief-led cards + two “in practice” cards with outcome framing (not spec lists). */
const aboutValuesItems: {
  Icon: AboutValueIcon
  kind: 'value' | 'practice'
  name: string
  desc: string
}[] = [
  {
    Icon: WrenchScrewdriverIcon,
    kind: 'value',
    name: 'Contractor-first',
    desc: 'We prioritize how technicians work on the job—documentation and support that match the field, not a slide deck.',
  },
  {
    Icon: DocumentTextIcon,
    kind: 'value',
    name: 'Clarity you can count on',
    desc: 'Straight specs, compatibility guidance, and direct support. No surprises—you know what you are getting and how to get help.',
  },
  {
    Icon: CubeIcon,
    kind: 'practice',
    name: 'Permanence that pays off',
    desc: 'One-time installed access gives you a repeatable story on the condensate line: verify service when it matters and skip needless cut-and-reattach for routine maintenance.',
  },
  {
    Icon: ShieldCheckIcon,
    kind: 'practice',
    name: 'Readiness before emergencies',
    desc: 'Overflow protection and optional WiFi monitoring help you see trouble coming—so you can plan service on your terms instead of reacting after the fact.',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AboutPage() {
  return (
    <div className="about-page-container">

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <div className="about-hero">
        <div className="about-section-inner">
          <motion.div
            className="about-hero-text"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 className="about-hero-title" variants={fadeUp}>
              Built for the Line—and the People Who Service It
            </motion.h1>
            <motion.p className="about-hero-subtitle" variants={fadeUp}>
              We design permanent condensate drain access and overflow protection so technicians can
              work faster, see what&apos;s happening in the line, and leave installs that are easier to
              maintain season after season.
            </motion.p>
            <motion.div className="about-hero-badges" variants={stagger}>
              {['ICC Code Compliant', 'Professional Grade', 'Made in USA'].map((badge) => (
                <motion.span key={badge} className="about-hero-badge" variants={scaleIn}>
                  {badge}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── 2. STATS SECTION ────────────────────────────────────────────────── */}
      <section className="about-stats-section" aria-labelledby="about-stats-heading">
        <div className="about-section-inner">
          <motion.div
            className="about-stats-header"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            <motion.h2
              id="about-stats-heading"
              className="about-stats-heading"
              variants={fadeUp}
            >
              What we deliver
            </motion.h2>
            <motion.p className="about-stats-subhead" variants={fadeUp}>
              Faster cleanouts, a complete Mini + Standard Sensor bundle, and overflow
              protection—so every install supports better service and stronger customer
              relationships.
            </motion.p>
          </motion.div>
          <motion.div
            className="about-stats-grid"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            {stats.map(({ target, prefix, suffix, label, sub, accent, href }, index) => {
              const waveGradId = `about-stat-wave-grad-${index}`
              return (
              <motion.div
                key={label}
                className="about-stat-card"
                style={{ '--stat-accent': accent } as React.CSSProperties}
                variants={scaleIn}
              >
                <div className="about-stat-content">
                  <div className="about-stat-number">
                    <AnimatedStat target={target} prefix={prefix} suffix={suffix} />
                  </div>
                  <div className="about-stat-label">{label}</div>
                  <div className="about-stat-sub">{sub}</div>
                </div>
                <Link to={href} className="about-stat-link">
                  Learn more
                  <ArrowRightIcon className="about-stat-link-icon" aria-hidden="true" />
                </Link>
                {/* Gradient fill — rises from bottom behind the wave waterline */}
                <div className="about-stat-fill" aria-hidden="true" />
                {/* Wave SVG — gradient waterline; moves with fill on hover */}
                <svg
                  className="about-stat-wave"
                  viewBox="0 0 400 88"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient
                      id={waveGradId}
                      x1="0%"
                      y1="100%"
                      x2="100%"
                      y2="0%"
                      gradientUnits="objectBoundingBox"
                    >
                      <stop offset="0%" style={{ stopColor: 'var(--wave-stop-0)' }} />
                      <stop offset="48%" style={{ stopColor: 'var(--wave-stop-1)' }} />
                      <stop offset="100%" style={{ stopColor: 'var(--wave-stop-2)' }} />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,72 C60,56 130,80 200,60 C270,40 330,22 400,14 L400,88 L0,88 Z"
                    fill={`url(#${waveGradId})`}
                  />
                </svg>
              </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ── 4. OUR STORY ────────────────────────────────────────────────────── */}
      <section className="about-story-band">
        <div className="about-section-inner">
          <motion.h2
            className="about-section-heading"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            Our Story
          </motion.h2>
          <motion.div
            className="about-story-prose"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            <motion.p className="about-prose-p" variants={fadeUp}>
              Alan Riddle, a father of four, had his AC back up twice—flooding his son's bedroom
              ceiling and costing him thousands in repairs, lost time, and inconvenience. The unit
              was in the attic; the condensate line was hard to service and impossible to monitor.
            </motion.p>
            <div
              className="about-story-quote-bleed"
              role="region"
              aria-labelledby="about-pull-quote-eyebrow"
            >
              <div className="about-story-quote-bleed-inner">
                <div className="about-pull-quote-split">
                  <div className="about-pull-quote-column">
                    <p className="about-pull-quote-eyebrow" id="about-pull-quote-eyebrow">
                      The turning point
                    </p>
                    <div
                      className="about-pull-quote-wrap"
                      role="group"
                      aria-labelledby="about-pull-quote-eyebrow"
                    >
                      <blockquote className="about-pull-quote">
                        "He couldn't find anything that let him inspect and clear the line and verify it was
                        done properly—so he built one."
                      </blockquote>
                    </div>
                  </div>
                  <div className="about-pull-quote-visual">
                    <img
                      src="/images/acdw-mini-hero2-background.png"
                      alt="AC Drain Wiz Mini on a condensate drain line, permanent maintenance access without cutting PVC."
                      className="about-pull-quote-img"
                      loading="lazy"
                      decoding="async"
                      width={2752}
                      height={2000}
                    />
                  </div>
                </div>
              </div>
            </div>
            <motion.p className="about-prose-p" variants={fadeUp}>
              He kept thinking: there has to be a better way to see inside the line, clean it with
              air and water, and vacuum toward the pan—then verify the clean condition of the
              condensate line. Years of research into existing products, their successes and
              failures, and what it would take to solve it himself turned that question into the
              Mini and the rest of our product line.
            </motion.p>
            <motion.p className="about-prose-p" variants={fadeUp}>
              That frustration in an attic led to the AC Drain Wiz Mini—our most compact,
              versatile, and complete drain line cleaning solution—and now a full line of drain
              maintenance and overflow monitoring products. We're here because one homeowner
              refused to accept that there wasn't a better way—and we're still building for
              everyone who feels the same.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── 5. LEADERSHIP ───────────────────────────────────────────────────── */}
      <section className="about-section-flush" aria-labelledby="about-leader-heading">
        <div className="about-section-inner">
          <motion.div
            className="about-leader-split"
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            variants={stagger}
          >
            <motion.div className="about-leader-context" variants={fadeUp}>
              <span className="about-leader-eyebrow">Leadership</span>
              <h2 id="about-leader-heading" className="about-leader-heading">
                Built by someone who lived the problem
              </h2>
              <p className="about-leader-blurb">
                Alan Riddle founded AC Drain Wiz after living the frustration of a hard-to-service
                condensate line—and the cost of getting it wrong. What began as a hardware-store
                prototype in his attic is now a professional-grade line built for how technicians
                work in the field.
              </p>
            </motion.div>
            <motion.figure className="about-leader-figure" variants={slideFromRight}>
              <div className="about-leader-photo-frame">
                <img
                  src="/images/CEO_Alan_Riddle.png"
                  alt={`${SUPPORT_CONTACT.primaryContactName}, ${SUPPORT_CONTACT.title} of AC Drain Wiz`}
                  className="about-leader-photo"
                  loading="lazy"
                  decoding="async"
                  width={1024}
                  height={1024}
                />
              </div>
              <figcaption className="about-leader-caption">
                <span className="about-leader-name">{SUPPORT_CONTACT.primaryContactName}</span>
                <span className="about-leader-role">{SUPPORT_CONTACT.title}</span>
              </figcaption>
            </motion.figure>
          </motion.div>
          <motion.div
            className="about-leader-support"
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            variants={fadeUp}
          >
            <p className="about-leader-support-label">Direct contact</p>
            <div className="about-leader-contacts">
              <a href={`mailto:${SUPPORT_CONTACT.email}`} className="about-leader-contact-link">
                <EnvelopeIcon className="about-leader-contact-icon" aria-hidden="true" />
                <span>{SUPPORT_CONTACT.email}</span>
              </a>
              <a href={SUPPORT_CONTACT.telHref} className="about-leader-contact-link">
                <PhoneIcon className="about-leader-contact-icon" aria-hidden="true" />
                <span>{SUPPORT_CONTACT.phoneDisplay}</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 6. WHO WE SERVE ─────────────────────────────────────────────────── */}
      <section className="about-serve-band">
        <div className="about-section-inner">
          <motion.h2
            className="about-section-heading"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            Who We Serve
          </motion.h2>
          <motion.div
            className="about-serve-list"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            {audiences.map(({ Icon, title, text }) => (
              <motion.div key={title} className="about-serve-item" variants={slideFromLeft}>
                <div className="about-serve-icon-wrap">
                  <Icon className="about-serve-icon" aria-hidden="true" />
                </div>
                <div className="about-serve-content">
                  <h3 className="about-serve-title">{title}</h3>
                  <p className="about-serve-text">{text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 7. MIAMI HEAT PARTNERSHIP ────────────────────────────────────────── */}
      <section
        id="miami-heat-partnership"
        className="about-partnership-band"
        aria-labelledby="about-partnership-heading"
      >
        <div className="about-section-inner">
          <motion.div
            className="about-partnership-content"
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            variants={stagger}
          >
            <motion.div className="about-partnership-lockup-wrap" variants={scaleIn}>
              <MiamiHeatPartnershipLockup layout="about" />
            </motion.div>
            <motion.div className="about-partnership-text" variants={fadeUp}>
              <h2 id="about-partnership-heading" className="about-partnership-heading">
                Miami HEAT Partnership
              </h2>
              <p className="about-partnership-prose">
                AC Drain Wiz is proud to partner with the Miami HEAT. This collaboration
                reflects our shared focus on performance and community—on and off the court.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 8. OUR VALUES (hybrid: beliefs + in practice) ───────────────────── */}
      <section
        className="about-section-flush about-values-section"
        aria-labelledby="about-values-heading"
      >
        <div className="about-section-inner">
          <motion.h2
            id="about-values-heading"
            className="about-section-heading"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            Our Values
          </motion.h2>
          <motion.p
            className="about-values-subhead"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            What we stand for—and how that shows up in every product.
          </motion.p>
          <motion.div
            className="about-values-grid"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            {aboutValuesItems.map(({ Icon, kind, name, desc }) => (
              <motion.div
                key={name}
                className={
                  kind === 'practice'
                    ? 'about-value-card about-value-card--practice'
                    : 'about-value-card'
                }
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className="about-value-accent-bar" aria-hidden="true" />
                <div className="about-value-card-top">
                  <div className="about-value-icon-wrap">
                    <Icon className="about-value-icon" aria-hidden="true" />
                  </div>
                  <div className="about-value-card-heading">
                    <span className="about-value-eyebrow">
                      {kind === 'value' ? 'Value' : 'In practice'}
                    </span>
                    <strong className="about-value-name">{name}</strong>
                  </div>
                </div>
                <p className="about-value-desc">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 9. CTA BAND ─────────────────────────────────────────────────────── */}
      <section className="about-cta-band">
        <div className="about-section-inner">
          <motion.div
            className="about-cta-inner"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            <motion.p className="about-cta-text" variants={fadeUp}>
              Ready to simplify drain line maintenance and add overflow protection?
            </motion.p>
            <motion.div className="about-cta-buttons" variants={stagger}>
              <motion.div
                variants={fadeUp}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link to="/products" className="about-cta-primary">
                  View Products
                </Link>
              </motion.div>
              <motion.div
                variants={fadeUp}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link to="/contact?type=demo-request" className="about-cta-secondary">
                  Request Demo
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
