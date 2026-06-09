import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  CheckIcon,
  HomeIcon,
  WrenchScrewdriverIcon,
  SignalIcon,
} from '@heroicons/react/24/outline'
import {
  PRODUCT_NAMES,
  SENSOR_SETUP_MODEL_CHOICE_HREF,
  SENSOR_STANDARD_DISPLAY,
  SENSOR_WIFI_DISPLAY,
} from '../config/acdwKnowledge'
import { PageHeroMeshBackdrop } from '../components/layout/PageHeroMeshBackdrop'
import { MiniFlowWaveBackdrop } from '../components/products/MiniFlowWaveBackdrop'

const SCENARIO_IMAGES = {
  good: '/images/installation/scenario-1-good.png',
  better: '/images/installation/scenario-2-better.png',
  best: '/images/installation/scenario-3-best.png',
} as const

type ScenarioVariant = 'good' | 'better' | 'best'

type ScenarioConfig = {
  id: string
  num: number
  tier: string
  title: string
  eyebrow: string
  image: string
  imageAlt: string
  caption: string
  checklist: string[]
  whyTitle: string
  whyText: string
  variant: ScenarioVariant
  imageFirst: boolean
  dark?: boolean
}

const SCENARIOS: ScenarioConfig[] = [
  {
    id: 'scenario-good',
    num: 1,
    tier: 'Good',
    eyebrow: 'Scenario 1',
    title: 'Baseline Protection',
    image: SCENARIO_IMAGES.good,
    imageAlt: `Good setup: ${SENSOR_STANDARD_DISPLAY} on the main drain line with the secondary line capped off`,
    caption: `${SENSOR_STANDARD_DISPLAY} on the main line · secondary capped`,
    checklist: [
      `${SENSOR_STANDARD_DISPLAY} installed on the main drain line`,
      'Secondary drain line capped off',
      'One protection point on the primary condensate path',
    ],
    whyTitle: 'When this is enough',
    whyText:
      'This setup provides automatic overflow protection on the main line and is acceptable for lower-risk installations—but it does not add maintenance access or dual-line coverage.',
    variant: 'good',
    imageFirst: true,
  },
  {
    id: 'scenario-better',
    num: 2,
    tier: 'Better',
    eyebrow: 'Scenario 2',
    title: 'Protection + Maintenance Access',
    image: SCENARIO_IMAGES.better,
    imageAlt: `Better setup: ${SENSOR_STANDARD_DISPLAY} on the capped secondary line and ${PRODUCT_NAMES.mini} on the main line`,
    caption: `Standard Sensor on secondary (capped) · ${PRODUCT_NAMES.mini} on main`,
    checklist: [
      `${SENSOR_STANDARD_DISPLAY} installed on the secondary drain line (capped)`,
      `${PRODUCT_NAMES.mini} installed on the main drain line for permanent maintenance access`,
      'Flush, air, and vacuum service on the main line without cutting PVC',
    ],
    whyTitle: 'Why this is better',
    whyText:
      'You gain a second detection point on the secondary port while keeping a permanent service port on the main line. Contractors can clean the primary drain faster and more reliably, with overflow shutdown still handled by the Standard Sensor on the secondary line.',
    variant: 'better',
    imageFirst: false,
  },
  {
    id: 'scenario-best',
    num: 3,
    tier: 'Best',
    eyebrow: 'Scenario 3',
    title: 'Dual-Line + Remote Monitoring',
    image: SCENARIO_IMAGES.best,
    imageAlt: `Best setup: ${SENSOR_STANDARD_DISPLAY} on the secondary line and ${SENSOR_WIFI_DISPLAY} on the main line`,
    caption: `Standard Sensor on secondary · ${SENSOR_WIFI_DISPLAY} on main`,
    checklist: [
      `${SENSOR_STANDARD_DISPLAY} installed on the secondary drain line`,
      `${SENSOR_WIFI_DISPLAY} installed on the main drain line`,
      'Protection on both ports plus remote monitoring, alerts, and service notifications on the main line',
    ],
    whyTitle: 'Why this is best',
    whyText:
      'Both drain ports are actively protected. The WiFi Sensor on the main line adds predictive maintenance alerts between 50–79% fill and connects to the monitoring platform—ideal when water damage risk is high or when you want visibility before a shutdown at ~80% water level.',
    variant: 'best',
    imageFirst: true,
    dark: true,
  },
]

const WHEN_TO_RECOMMEND = [
  {
    tier: 'Good',
    variant: 'good' as const,
    icon: HomeIcon,
    subtitle: 'Recommend when basic overflow protection is the priority:',
    bullets: [
      'Ground-level or main-floor installations',
      'Low water-damage risk (tile floors, garages, mechanical rooms)',
      'Sensor-only install without maintenance port requirements',
    ],
  },
  {
    tier: 'Better',
    variant: 'better' as const,
    icon: WrenchScrewdriverIcon,
    subtitle: 'Recommend when contractors need streamlined clean-out on the main line:',
    bullets: [
      'Recurring maintenance visits and flush/air service',
      'Dual-line units where a second detection point adds value',
      'Customers who want Mini lifetime benefits without WiFi monitoring',
    ],
  },
  {
    tier: 'Best',
    variant: 'best' as const,
    icon: SignalIcon,
    subtitle: 'Recommend for high-value protection and proactive monitoring:',
    bullets: [
      'Attic units, second-floor installs, or severe water-damage risk',
      'Property managers and homeowners who want email/SMS alerts',
      'Contractors offering predictive maintenance through the monitoring platform',
    ],
  },
] as const

const mhEase = [0.16, 1, 0.3, 1] as const
const mhViewport = {
  once: true,
  amount: 0.22,
  margin: '-96px 0px -148px 0px',
} as const

export function RecommendedInstallationScenariosPage() {
  const reduceMotion = useReducedMotion()
  const goodSectionRef = useRef<HTMLElement>(null)
  const betterSectionRef = useRef<HTMLElement>(null)
  const whenSectionRef = useRef<HTMLElement>(null)

  const tr = (dur: number, delay = 0) =>
    reduceMotion ? ({ duration: 0.22 } as const) : ({ duration: dur, delay, ease: mhEase } as const)

  return (
    <div className="support-section-container">

      {/* Hero Banner */}
      <div className="support-hero">
        <PageHeroMeshBackdrop />
        <div className="support-hero-content">
          <div className="support-hero-header">
            <div className="support-hero-breadcrumb">
              <Link to="/support" className="support-hero-breadcrumb-link">
                Support Center
              </Link>
              <span className="support-hero-breadcrumb-separator">/</span>
              <span className="support-hero-breadcrumb-current">Installation Scenarios</span>
            </div>
            <h1 className="support-hero-title">Recommended Installation Scenarios</h1>
            <p className="support-hero-subtitle">
              Compare Good, Better, and Best configurations for dual drain-line AC units—and choose the
              setup that matches your protection, maintenance, and monitoring needs.
            </p>
            <div className="support-hero-badge-row">
              <span className="support-hero-badge">Good</span>
              <span className="support-hero-badge">Better</span>
              <span className="support-hero-badge">Best</span>
            </div>
          </div>
        </div>
      </div>

      <div className="install-scenarios-main">
        {/* Intro */}
        <header className="mini-section-header install-scenarios-intro">
          <p className="mini-section-eyebrow">Dual drain-line AC units</p>
          <h2 className="product-section-title mini-section-title-promote">Three setups. One decision.</h2>
          <p className="mini-section-dek">
            Most AC units have two side drain ports—a main (primary) condensate line and a secondary line.
            How you equip each port determines your level of overflow protection, maintenance access, and
            remote monitoring. Use the scenarios below to recommend the right combination of{' '}
            {SENSOR_STANDARD_DISPLAY}, {PRODUCT_NAMES.mini}, and {SENSOR_WIFI_DISPLAY}.
          </p>
          <div className="install-scenarios-port-callout" aria-label="Drain port labels">
            <span className="install-scenarios-port-label install-scenarios-port-label--main">Main line</span>
            <span className="install-scenarios-port-divider" aria-hidden />
            <span className="install-scenarios-port-label install-scenarios-port-label--secondary">Secondary line</span>
          </div>
        </header>

        {/* Scenario panels */}
        {SCENARIOS.map((scenario) => {
          const sectionRef =
            scenario.variant === 'good'
              ? goodSectionRef
              : scenario.variant === 'better'
                ? betterSectionRef
                : undefined

          return (
            <section
              key={scenario.id}
              id={scenario.id}
              ref={sectionRef}
              className={`install-scenarios-tier install-scenarios-tier--${scenario.variant}${
                scenario.dark ? ' install-scenarios-tier--dark' : ' install-scenarios-tier--light'
              }`}
              aria-labelledby={`${scenario.id}-heading`}
            >
              {!scenario.dark && sectionRef && (
                <MiniFlowWaveBackdrop sectionRef={sectionRef} />
              )}
              {scenario.dark && (
                <div className="install-scenarios-tier-mesh" aria-hidden>
                  <div className="install-scenarios-tier-mesh-blob install-scenarios-tier-mesh-blob--a" />
                  <div className="install-scenarios-tier-mesh-blob install-scenarios-tier-mesh-blob--b" />
                  <div className="install-scenarios-tier-mesh-blob install-scenarios-tier-mesh-blob--c" />
                  <div className="install-scenarios-tier-mesh-blob install-scenarios-tier-mesh-blob--d" />
                  <div className="install-scenarios-tier-mesh-grid" />
                </div>
              )}

              <div className="install-scenarios-tier-inner">
                <motion.header
                  className="install-scenarios-tier-header"
                  initial={reduceMotion ? false : { opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={mhViewport}
                  transition={tr(0.9)}
                >
                  <div
                    className={`install-scenarios-tier-num install-scenarios-tier-num--${scenario.variant}`}
                    aria-hidden
                  >
                    {scenario.num}
                  </div>
                  <p
                    className={`mini-section-eyebrow${
                      scenario.dark ? ' mini-section-eyebrow--dark' : ''
                    }`}
                  >
                    {scenario.eyebrow} · {scenario.tier}
                  </p>
                  <h2
                    id={`${scenario.id}-heading`}
                    className={`product-section-title mini-section-title-promote${
                      scenario.dark ? ' mini-section-title-promote--dark' : ''
                    } install-scenarios-tier-title`}
                  >
                    {scenario.title}
                  </h2>
                </motion.header>

                <div
                  className={`install-scenarios-tier-grid${
                    scenario.imageFirst ? '' : ' install-scenarios-tier-grid--reverse'
                  }`}
                >
                  <motion.div
                    className="install-scenarios-visual"
                    initial={reduceMotion ? false : { opacity: 0, x: scenario.imageFirst ? -48 : 48 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={mhViewport}
                    transition={tr(1, 0.08)}
                  >
                    <div
                      className={`install-scenarios-visual-glow install-scenarios-visual-glow--${scenario.variant}`}
                      aria-hidden
                    />
                    <div className="install-scenarios-visual-frame">
                      <img
                        src={scenario.image}
                        alt={scenario.imageAlt}
                        className="install-scenarios-visual-img"
                        loading={scenario.num === 1 ? 'eager' : 'lazy'}
                        decoding="async"
                      />
                    </div>
                    <p className="install-scenarios-visual-caption">{scenario.caption}</p>
                  </motion.div>

                  <motion.div
                    className="install-scenarios-tier-content"
                    initial={reduceMotion ? false : { opacity: 0, x: scenario.imageFirst ? 48 : -48 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={mhViewport}
                    transition={tr(1, 0.14)}
                  >
                    <h3 className="install-scenarios-content-label">Installation details</h3>
                    <ul className="install-product-checklist install-scenarios-checklist">
                      {scenario.checklist.map((item) => (
                        <li key={item} className="install-product-checklist-item">
                          <CheckIcon className="install-checklist-icon" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div
                      className={`install-scenarios-callout install-scenarios-callout--${scenario.variant}`}
                    >
                      <h4 className="install-scenarios-callout-title">{scenario.whyTitle}</h4>
                      <p className="install-scenarios-callout-text">{scenario.whyText}</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>
          )
        })}

        {/* When to recommend */}
        <section
          ref={whenSectionRef}
          className="install-scenarios-when"
          aria-labelledby="install-scenarios-when-heading"
        >
          <MiniFlowWaveBackdrop sectionRef={whenSectionRef} />
          <div className="install-scenarios-when-inner">
            <motion.header
              className="mini-section-header"
              initial={reduceMotion ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={mhViewport}
              transition={tr(0.9)}
            >
              <p className="mini-section-eyebrow">When to recommend</p>
              <h2
                id="install-scenarios-when-heading"
                className="product-section-title mini-section-title-promote"
              >
                Match the setup to the job
              </h2>
            </motion.header>

            <motion.div
              className="install-scenarios-compare"
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={mhViewport}
              transition={tr(0.85, 0.1)}
              aria-label="Tier comparison"
            >
              <div className="install-scenarios-compare-col install-scenarios-compare-col--good">
                <p className="install-scenarios-compare-label">Good</p>
                <p className="install-scenarios-compare-value">Overflow protection</p>
              </div>
              <span className="install-scenarios-compare-arrow" aria-hidden>→</span>
              <div className="install-scenarios-compare-col install-scenarios-compare-col--better">
                <p className="install-scenarios-compare-label">Better</p>
                <p className="install-scenarios-compare-value">+ Mini maintenance access</p>
              </div>
              <span className="install-scenarios-compare-arrow" aria-hidden>→</span>
              <div className="install-scenarios-compare-col install-scenarios-compare-col--best">
                <p className="install-scenarios-compare-label">Best</p>
                <p className="install-scenarios-compare-value">+ WiFi monitoring</p>
              </div>
            </motion.div>

            <div className="install-scenarios-when-grid">
              {WHEN_TO_RECOMMEND.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.article
                    key={item.tier}
                    className={`install-scenarios-when-tile install-scenarios-when-tile--${item.variant}`}
                    initial={reduceMotion ? false : { opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={mhViewport}
                    transition={tr(0.85, index * 0.1)}
                  >
                    <div className="install-scenarios-when-tile-header">
                      <Icon
                        className={`install-scenarios-when-tile-icon install-scenarios-when-tile-icon--${item.variant}`}
                        aria-hidden
                      />
                      <h3 className="install-scenarios-when-tile-title">{item.tier}</h3>
                    </div>
                    <p className="install-scenarios-when-tile-subtitle">{item.subtitle}</p>
                    <ul className="install-product-checklist install-scenarios-when-checklist">
                      {item.bullets.map((bullet) => (
                        <li key={bullet} className="install-product-checklist-item">
                          <CheckIcon className="install-checklist-icon" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </motion.article>
                )
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Resources CTA band */}
      <section className="install-scenarios-cta" aria-labelledby="install-scenarios-cta-heading">
        <div className="install-scenarios-cta-mesh" aria-hidden>
          <div className="install-scenarios-cta-mesh-blob install-scenarios-cta-mesh-blob--a" />
          <div className="install-scenarios-cta-mesh-blob install-scenarios-cta-mesh-blob--b" />
          <div className="install-scenarios-cta-mesh-blob install-scenarios-cta-mesh-blob--c" />
          <div className="install-scenarios-cta-mesh-grid" />
        </div>
        <div className="install-scenarios-cta-inner">
          <motion.header
            className="install-scenarios-cta-header"
            initial={reduceMotion ? false : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(0.9)}
          >
            <p className="mini-section-eyebrow mini-section-eyebrow--dark">Next steps</p>
            <h2 id="install-scenarios-cta-heading" className="install-scenarios-cta-title">
              Ready to install?
            </h2>
          </motion.header>
          <motion.div
            className="install-scenarios-cta-links"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(0.8, 0.12)}
          >
            <Link to={SENSOR_SETUP_MODEL_CHOICE_HREF} className="install-scenarios-cta-chip">
              Sensor Setup Guide
            </Link>
            <Link to="/support" className="install-scenarios-cta-chip">
              Support Center
            </Link>
            <Link to="/contact?type=support" className="install-scenarios-cta-chip">
              Contact Support
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
