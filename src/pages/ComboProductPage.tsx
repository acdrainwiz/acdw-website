/**
 * AC Drain Wiz Mini + Sensor Combo Product Page
 *
 * Aligned with Mini/Sensor product-page system: hero v2, narrative zones,
 * knowledge-safe copy. Contractor / property-manager focused (sales CTAs, not cart).
 */

import { useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from 'framer-motion'
import { MiniHeroV2MeshBackground } from '../components/layout/MiniHeroV2MeshBackground'
import { MiniFlowWaveBackdrop } from '../components/products/MiniFlowWaveBackdrop'
import { HeroTitleRotator } from '../components/products/HeroTitleRotator'
import { ComboHeroCtaPanel } from '../components/products/ComboHeroCtaPanel'
import { ComboWorkflowShowcase } from '../components/products/ComboWorkflowShowcase'
import { usePageHeroIntro } from '../hooks/usePageHeroIntro'
import { useAuth } from '../contexts/AuthContext'
import { buildProductSupportHubHref } from '../utils/supportFaqSearch'
import {
  COMBO_AUDIENCE_CARDS,
  COMBO_COMPARISON_ROWS,
  COMBO_FAQS,
  COMBO_FLEET_FEATURES,
  COMBO_HERO_HEADLINES,
  COMBO_MINI_SPECS,
  COMBO_NARRATIVE_ZONES,
  COMBO_PRODUCT_HERO,
  COMBO_SENSOR_SPECS,
  COMBO_TRUST_INDICATORS,
  type ComboCompareCell,
} from '../config/comboNarrative'
import { PRODUCT_NAMES, SUPPORT_CONTACT } from '../config/acdwKnowledge'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BellAlertIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  PhoneIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'

const COMBO_HERO_IMAGE = '/images/acdw-combo-hero2-product.png'
const COMBO_HERO_IMAGE_MOBILE = '/images/acdw-combo-hero2-product-mobile.png'

const FLEET_ICONS = [ChartBarIcon, BellAlertIcon, ClipboardDocumentListIcon, UserGroupIcon] as const

function renderCompareCell(
  value: ComboCompareCell,
  {
    checkClass,
    textAsStrong = false,
  }: { checkClass: string; textAsStrong?: boolean }
): ReactNode {
  if (typeof value === 'boolean') {
    return value ? (
      <CheckIcon className={checkClass} aria-hidden />
    ) : (
      <span className="combo-product-comparison-no">—</span>
    )
  }
  return textAsStrong ? <strong>{value}</strong> : value
}

export function ComboProductPage() {
  const navigate = useNavigate()
  const heroRef = useRef<HTMLElement>(null)
  const compareSectionRef = useRef<HTMLElement>(null)
  const workflowSectionRef = useRef<HTMLElement>(null)
  const audienceSectionRef = useRef<HTMLElement>(null)
  const fleetSectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { introStagger, fadeUp } = usePageHeroIntro()
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const productParallaxY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -100])
  const wordmarkParallaxY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 22])
  const { user, isAuthenticated } = useAuth()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const isHVACPro = isAuthenticated && user?.role === 'hvac_pro'
  const isPropertyManager = isAuthenticated && user?.role === 'property_manager'
  const isHomeowner = isAuthenticated && user?.role === 'homeowner'
  const salesPhone = SUPPORT_CONTACT.telHref

  const mhEase = [0.16, 1, 0.3, 1] as const
  const mhViewport = {
    once: true,
    amount: 0.2,
    margin: '-96px 0px -140px 0px',
  } as const
  const tr = (dur: number, delay = 0) =>
    reduceMotion ? ({ duration: 0.22 } as const) : ({ duration: dur, delay, ease: mhEase } as const)

  // Below-hero scroll choreography — mirrors Sensor/Mini product page cadence
  // (prefers-reduced-motion safe).
  const gridContainerVariants: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1, delayChildren: 0.04, when: 'beforeChildren' },
        },
      }
  const gridItemVariants: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.68, ease: mhEase } },
      }
  const listContainerVariants: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.06, delayChildren: 0.08 },
        },
      }
  const listItemVariants: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: mhEase } },
      }

  return (
    <div className="combo-product-page">
      {/* Back Navigation */}
      <div className="combo-product-back-nav">
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="combo-product-back-button"
        >
          <ArrowLeftIcon className="combo-product-back-icon" />
          Back to Products
        </button>
      </div>

      {/* Hero — mesh + floating product + rotating headline (aligned with Mini/Sensor) */}
      <section
        ref={heroRef}
        className="mini-hero-v2 combo-hero-v2"
        aria-labelledby="combo-hero-heading"
      >
        <MiniHeroV2MeshBackground />

        <div className="mini-hero-v2-inner">
          <div className="mini-hero-v2-product-col">
            <div className="mini-hero-v2-stage">
              <div className="combo-hero-v2-wordmark-anchor" aria-hidden>
                <motion.div
                  className="mini-hero-v2-wordmark"
                  style={{ y: wordmarkParallaxY }}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
                >
                  <span className="combo-hero-v2-wordmark-img" />
                </motion.div>
              </div>

              <motion.div
                className="mini-hero-v2-product-wrap"
                style={{ y: productParallaxY }}
                initial={reduceMotion ? false : { opacity: 0, y: 56 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
              >
                <span className="mini-hero-v2-product-glow" aria-hidden />
                <div className="mini-hero-v2-product-float">
                  <picture>
                    <source media="(max-width: 767px)" srcSet={COMBO_HERO_IMAGE_MOBILE} />
                    <img
                      src={COMBO_HERO_IMAGE}
                      alt={`${PRODUCT_NAMES.mini} and ${PRODUCT_NAMES.sensor} complete system`}
                      className="mini-hero-v2-product-img"
                      width={2752}
                      height={2000}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                    />
                  </picture>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div
            className="mini-hero-v2-content combo-hero-v2-content"
            variants={introStagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="mini-hero-v2-title" variants={fadeUp}>
              <HeroTitleRotator
                titles={[...COMBO_HERO_HEADLINES]}
                headingId="combo-hero-heading"
              />
            </motion.div>

            <motion.p className="mini-hero-v2-subtitle" variants={fadeUp}>
              {COMBO_PRODUCT_HERO.subtitle}
            </motion.p>

            <motion.div className="mini-hero-v2-trust" variants={fadeUp}>
              <span className="mini-hero-v2-trust-dot" aria-hidden />
              {COMBO_PRODUCT_HERO.trustLine}
            </motion.div>

            <motion.div className="sensor-hero-v2-cta-wrap" variants={fadeUp}>
              <ComboHeroCtaPanel
                isAuthenticated={isAuthenticated}
                isHomeowner={isHomeowner}
                isHVACPro={isHVACPro}
                isPropertyManager={isPropertyManager}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why the complete system — comparison */}
      <section
        ref={compareSectionRef}
        className="combo-product-why-combo sensor-wave-host"
        aria-labelledby="combo-compare-heading"
      >
        <MiniFlowWaveBackdrop sectionRef={compareSectionRef} />
        <div className="combo-product-why-combo-content">
          <motion.header
            className="mini-section-header"
            initial={reduceMotion ? false : { opacity: 0, y: 44 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(0.9)}
          >
            <p className="mini-section-eyebrow">{COMBO_NARRATIVE_ZONES.compare.eyebrow}</p>
            <h2
              id="combo-compare-heading"
              className="product-section-title mini-section-title-promote"
            >
              {COMBO_NARRATIVE_ZONES.compare.title}
            </h2>
            <p className="mini-section-dek">{COMBO_NARRATIVE_ZONES.compare.dek}</p>
          </motion.header>

          <motion.div
            className="combo-product-comparison-table-wrapper"
            initial={reduceMotion ? false : { opacity: 0, y: 36, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={mhViewport}
            transition={tr(0.85, 0.06)}
          >
            <table className="combo-product-comparison-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Mini only</th>
                  <th>Sensor only</th>
                  <th className="combo-product-comparison-highlight">Mini + Sensor</th>
                </tr>
              </thead>
              <tbody>
                {COMBO_COMPARISON_ROWS.map((item) => (
                  <tr key={item.feature}>
                    <td className="combo-product-comparison-feature">{item.feature}</td>
                    <td className="combo-product-comparison-value">
                      {renderCompareCell(item.mini, {
                        checkClass: 'combo-product-comparison-check',
                      })}
                    </td>
                    <td className="combo-product-comparison-value">
                      {renderCompareCell(item.sensor, {
                        checkClass: 'combo-product-comparison-check',
                      })}
                    </td>
                    <td className="combo-product-comparison-value combo-product-comparison-highlight">
                      {renderCompareCell(item.combo, {
                        checkClass: 'combo-product-comparison-check-highlight',
                        textAsStrong: true,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <motion.div
            className="combo-product-comparison-cards"
            variants={gridContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={mhViewport}
          >
            {(
              [
                { key: 'mini', title: 'Mini only', field: 'mini' as const, highlight: false },
                { key: 'sensor', title: 'Sensor only', field: 'sensor' as const, highlight: false },
                {
                  key: 'combo',
                  title: 'Mini + Sensor',
                  field: 'combo' as const,
                  highlight: true,
                },
              ] as const
            ).map((card) => (
              <motion.div
                key={card.key}
                className={
                  card.highlight
                    ? 'combo-product-comparison-card combo-product-comparison-card-highlight'
                    : 'combo-product-comparison-card'
                }
                variants={gridItemVariants}
              >
                <div className="combo-product-comparison-card-header">
                  <h3 className="combo-product-comparison-card-title">{card.title}</h3>
                  {card.highlight ? (
                    <span className="combo-product-comparison-card-badge">Complete system</span>
                  ) : null}
                </div>
                <motion.div
                  className="combo-product-comparison-card-features"
                  variants={listContainerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={mhViewport}
                >
                  {COMBO_COMPARISON_ROWS.map((item) => (
                    <motion.div
                      key={item.feature}
                      className="combo-product-comparison-card-feature"
                      variants={listItemVariants}
                    >
                      <span className="combo-product-comparison-card-feature-name">
                        {item.feature}
                      </span>
                      <span className="combo-product-comparison-card-feature-value">
                        {typeof item[card.field] === 'boolean' ? (
                          item[card.field] ? (
                            <CheckIcon
                              className={
                                card.highlight
                                  ? 'combo-product-comparison-card-check-highlight'
                                  : 'combo-product-comparison-card-check'
                              }
                              aria-hidden
                            />
                          ) : (
                            <span className="combo-product-comparison-card-no">—</span>
                          )
                        ) : (
                          <span
                            className={
                              card.highlight
                                ? 'combo-product-comparison-card-text font-semibold'
                                : 'combo-product-comparison-card-text'
                            }
                          >
                            {item[card.field]}
                          </span>
                        )}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How they work together */}
      <section
        ref={workflowSectionRef}
        className="combo-product-workflow"
        aria-labelledby="combo-workflow-heading"
      >
        <div className="combo-product-workflow-mesh" aria-hidden>
          <div className="combo-product-workflow-mesh-blob combo-product-workflow-mesh-blob--a" />
          <div className="combo-product-workflow-mesh-blob combo-product-workflow-mesh-blob--b" />
          <div className="combo-product-workflow-mesh-blob combo-product-workflow-mesh-blob--c" />
          <div className="combo-product-workflow-mesh-grid" />
        </div>
        <div className="combo-product-workflow-content">
          <motion.header
            className="mini-section-header"
            initial={reduceMotion ? false : { opacity: 0, y: 44 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(0.9)}
          >
            <p className="mini-section-eyebrow mini-section-eyebrow--dark">
              {COMBO_NARRATIVE_ZONES.workflow.eyebrow}
            </p>
            <h2
              id="combo-workflow-heading"
              className="product-section-title mini-section-title-promote mini-section-title-promote--dark"
            >
              {COMBO_NARRATIVE_ZONES.workflow.title}
            </h2>
            <p className="mini-section-dek mini-section-dek--dark">
              {COMBO_NARRATIVE_ZONES.workflow.dek}
            </p>
          </motion.header>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={mhViewport}
            transition={tr(0.9, 0.06)}
          >
            <ComboWorkflowShowcase
              heroImage={{
                src: COMBO_HERO_IMAGE,
                alt: `${PRODUCT_NAMES.mini} and ${PRODUCT_NAMES.sensor} bundle`,
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* Who it’s for */}
      <section
        ref={audienceSectionRef}
        className="combo-product-audience sensor-wave-host"
        aria-labelledby="combo-audience-heading"
      >
        <MiniFlowWaveBackdrop sectionRef={audienceSectionRef} />
        <div className="combo-product-audience-content">
          <motion.header
            className="mini-section-header"
            initial={reduceMotion ? false : { opacity: 0, y: 44 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(0.9)}
          >
            <p className="mini-section-eyebrow">{COMBO_NARRATIVE_ZONES.audience.eyebrow}</p>
            <h2
              id="combo-audience-heading"
              className="product-section-title mini-section-title-promote"
            >
              {COMBO_NARRATIVE_ZONES.audience.title}
            </h2>
            <p className="mini-section-dek">{COMBO_NARRATIVE_ZONES.audience.dek}</p>
          </motion.header>

          <div className="combo-product-audience-grid">
            {COMBO_AUDIENCE_CARDS.map((card, cardIndex) => {
              const Icon = card.id === 'contractor' ? WrenchScrewdriverIcon : BuildingOfficeIcon
              return (
                <motion.article
                  key={card.id}
                  className="combo-product-audience-card"
                  initial={
                    reduceMotion
                      ? false
                      : { opacity: 0, x: cardIndex === 0 ? -48 : 48, y: 24 }
                  }
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={mhViewport}
                  transition={tr(0.78, cardIndex * 0.1)}
                >
                  <Icon className="combo-product-audience-icon" aria-hidden />
                  <h3 className="combo-product-audience-title">{card.title}</h3>
                  <p className="combo-product-audience-description">{card.description}</p>
                  <motion.ul
                    className="combo-product-audience-points"
                    variants={listContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={mhViewport}
                  >
                    {card.points.map((point) => (
                      <motion.li
                        key={point}
                        className="combo-product-audience-point"
                        variants={listItemVariants}
                      >
                        <CheckIcon className="combo-product-audience-point-icon" aria-hidden />
                        <span>{point}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.article>
              )
            })}
          </div>

          <motion.div
            className="combo-product-section-cta"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(0.65, 0.12)}
          >
            <a href={salesPhone} className="combo-product-cta-primary md:hidden">
              Call {SUPPORT_CONTACT.phoneDisplay}
            </a>
            <div className="combo-product-phone-badge hidden md:flex">
              <PhoneIcon className="combo-product-phone-badge-icon" aria-hidden />
              <div className="combo-product-phone-badge-text">
                <div className="combo-product-phone-vanity">{SUPPORT_CONTACT.phoneDisplay}</div>
                <div className="combo-product-phone-numeric">{SUPPORT_CONTACT.phoneNumeric}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/contact?type=sales')}
              className="combo-product-cta-secondary"
            >
              Contact Sales
            </button>
          </motion.div>
        </div>
      </section>

      {/* Fleet / dashboard — dark mesh mid-page band */}
      <section
        ref={fleetSectionRef}
        className="combo-product-fleet sensor-product-fleet"
        aria-labelledby="combo-fleet-heading"
      >
        <div className="sensor-fleet-mesh" aria-hidden>
          <div className="sensor-fleet-mesh-blob sensor-fleet-mesh-blob--a" />
          <div className="sensor-fleet-mesh-blob sensor-fleet-mesh-blob--b" />
          <div className="sensor-fleet-mesh-blob sensor-fleet-mesh-blob--c" />
          <div className="sensor-fleet-mesh-grid" />
        </div>
        <div className="sensor-product-fleet-content">
          <motion.header
            className="mini-section-header"
            initial={reduceMotion ? false : { opacity: 0, y: 44 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(0.9)}
          >
            <p className="mini-section-eyebrow mini-section-eyebrow--dark">
              {COMBO_NARRATIVE_ZONES.fleet.eyebrow}
            </p>
            <h2
              id="combo-fleet-heading"
              className="product-section-title mini-section-title-promote mini-section-title-promote--dark"
            >
              {COMBO_NARRATIVE_ZONES.fleet.title}
            </h2>
            <p className="mini-section-dek mini-section-dek--dark">
              {COMBO_NARRATIVE_ZONES.fleet.dek}
            </p>
          </motion.header>

          <motion.div
            className="sensor-product-fleet-grid"
            variants={gridContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={mhViewport}
          >
            {COMBO_FLEET_FEATURES.map((feature, index) => {
              const Icon = FLEET_ICONS[index] ?? ChartBarIcon
              return (
                <motion.div
                  key={feature.id}
                  className="sensor-product-fleet-card sensor-card"
                  variants={gridItemVariants}
                >
                  <Icon className="sensor-product-fleet-icon" aria-hidden />
                  <h3 className="sensor-product-fleet-title">{feature.title}</h3>
                  <p className="sensor-product-fleet-description">{feature.description}</p>
                </motion.div>
              )
            })}
          </motion.div>

          <motion.p
            className="combo-product-fleet-bridge"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(0.65, 0.15)}
          >
            <Link to="/products/sensor" className="combo-product-fleet-bridge-link">
              Explore Standard vs WiFi Sensor details
              <ArrowRightIcon className="combo-product-fleet-bridge-icon" aria-hidden />
            </Link>
          </motion.p>
        </div>
      </section>

      {/* Ready to install */}
      <section className="combo-product-installation" aria-labelledby="combo-install-heading">
        <div className="combo-product-installation-content">
          <motion.header
            className="mini-section-header"
            initial={reduceMotion ? false : { opacity: 0, y: 44 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(0.9)}
          >
            <p className="mini-section-eyebrow">{COMBO_NARRATIVE_ZONES.install.eyebrow}</p>
            <h2
              id="combo-install-heading"
              className="product-section-title mini-section-title-promote"
            >
              {COMBO_NARRATIVE_ZONES.install.title}
            </h2>
            <p className="mini-section-dek">{COMBO_NARRATIVE_ZONES.install.dek}</p>
          </motion.header>

          <motion.div
            className="combo-product-installation-actions"
            initial={reduceMotion ? false : { opacity: 0, y: 32, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={mhViewport}
            transition={tr(0.78, 0.08)}
          >
            <WrenchScrewdriverIcon className="combo-product-installation-link-icon" aria-hidden />
            <button
              type="button"
              onClick={() => navigate('/support/installation-setup')}
              className="combo-product-installation-link-btn"
            >
              View Installation &amp; Setup Guide
              <ArrowRightIcon className="combo-product-installation-link-btn-icon" aria-hidden />
            </button>
            <p className="combo-product-installation-scenarios-note">
              Dual drain-line unit? See which port gets the Mini, Standard Sensor, or WiFi Sensor
              before you start.
            </p>
            <Link
              to="/support/installation-scenarios"
              className="combo-product-installation-scenarios-link"
            >
              Compare Good, Better &amp; Best setups
              <ArrowRightIcon className="combo-product-installation-link-btn-icon" aria-hidden />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Specs */}
      <section className="combo-product-specs" aria-labelledby="combo-specs-heading">
        <div className="combo-product-specs-content">
          <motion.header
            className="mini-section-header"
            initial={reduceMotion ? false : { opacity: 0, y: 44 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(0.9)}
          >
            <p className="mini-section-eyebrow">{COMBO_NARRATIVE_ZONES.specs.eyebrow}</p>
            <h2
              id="combo-specs-heading"
              className="product-section-title mini-section-title-promote"
            >
              {COMBO_NARRATIVE_ZONES.specs.title}
            </h2>
            <p className="mini-section-dek">{COMBO_NARRATIVE_ZONES.specs.dek}</p>
          </motion.header>

          <div className="combo-product-specs-grid">
            <motion.div
              className="combo-product-specs-panel"
              initial={reduceMotion ? false : { opacity: 0, x: -48, y: 24 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={mhViewport}
              transition={tr(0.78)}
            >
              <h3 className="combo-product-specs-panel-title">{PRODUCT_NAMES.mini}</h3>
              <motion.dl
                className="combo-product-specs-dl"
                variants={listContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={mhViewport}
              >
                {COMBO_MINI_SPECS.map((spec) => (
                  <motion.div
                    key={spec.label}
                    className="combo-product-specs-row"
                    variants={listItemVariants}
                  >
                    <dt>{spec.label}</dt>
                    <dd>{spec.value}</dd>
                  </motion.div>
                ))}
              </motion.dl>
              <Link to="/products/mini" className="combo-product-specs-bridge-link">
                Full Mini product page
                <ArrowRightIcon className="combo-product-specs-bridge-icon" aria-hidden />
              </Link>
            </motion.div>

            <motion.div
              className="combo-product-specs-panel"
              initial={reduceMotion ? false : { opacity: 0, x: 48, y: 24 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={mhViewport}
              transition={tr(0.78, 0.1)}
            >
              <h3 className="combo-product-specs-panel-title">{PRODUCT_NAMES.sensor}</h3>
              <motion.dl
                className="combo-product-specs-dl"
                variants={listContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={mhViewport}
              >
                {COMBO_SENSOR_SPECS.map((spec) => (
                  <motion.div
                    key={spec.label}
                    className="combo-product-specs-row"
                    variants={listItemVariants}
                  >
                    <dt>{spec.label}</dt>
                    <dd>{spec.value}</dd>
                  </motion.div>
                ))}
              </motion.dl>
              <Link to="/products/sensor#sensor-specs-heading" className="combo-product-specs-bridge-link">
                Standard vs WiFi specs
                <ArrowRightIcon className="combo-product-specs-bridge-icon" aria-hidden />
              </Link>
            </motion.div>
          </div>

          <motion.div
            className="combo-product-specs-total"
            initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={mhViewport}
            transition={tr(0.7, 0.12)}
          >
            <ClockIcon className="combo-product-specs-total-icon" aria-hidden />
            <div className="combo-product-specs-total-info">
              <span className="combo-product-specs-total-label">Typical combined install:</span>
              <span className="combo-product-specs-total-value">~25–45 minutes</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="product-faq" className="product-faq combo-product-faq">
        <div className="product-faq-content">
          <motion.header
            className="mini-section-header"
            initial={reduceMotion ? false : { opacity: 0, y: 44 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(0.9)}
          >
            <p className="mini-section-eyebrow">{COMBO_NARRATIVE_ZONES.faq.eyebrow}</p>
            <h2 className="product-section-title mini-section-title-promote">
              {COMBO_NARRATIVE_ZONES.faq.title}
            </h2>
            <p className="mini-section-dek">{COMBO_NARRATIVE_ZONES.faq.dek}</p>
          </motion.header>
          <div className="product-faq-list">
            {COMBO_FAQS.map((faq, index) => (
              <motion.div
                key={faq.question}
                className="product-faq-item"
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={mhViewport}
                transition={tr(0.68, Math.min(index, 8) * 0.06)}
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
                {openFaq === index ? (
                  <div className="product-faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                ) : null}
              </motion.div>
            ))}
          </div>
          <p className="product-faq-subtitle">
            Looking for Sensor LED or model-specific answers?{' '}
            <Link to="/products/sensor#product-faq" className="product-faq-contact-link">
              See the Sensor FAQ
            </Link>
            . Still stuck?{' '}
            <Link to={buildProductSupportHubHref('sensor')} className="product-faq-contact-link">
              Browse Product Support FAQs
            </Link>
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="combo-product-final-cta" aria-labelledby="combo-final-cta-heading">
        <div className="combo-product-final-cta-content">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(0.85)}
          >
            <h2 id="combo-final-cta-heading" className="combo-product-final-cta-title">
              {COMBO_NARRATIVE_ZONES.finalCta.title}
            </h2>
            <p className="combo-product-final-cta-subtitle">{COMBO_NARRATIVE_ZONES.finalCta.dek}</p>
          </motion.div>

          <motion.div
            className="combo-product-final-cta-buttons"
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={mhViewport}
            transition={tr(0.72, 0.1)}
          >
            <a href={salesPhone} className="combo-product-cta-primary md:hidden">
              Call {SUPPORT_CONTACT.phoneDisplay}
            </a>
            <div className="combo-product-phone-badge combo-product-phone-badge--on-dark hidden md:flex">
              <PhoneIcon className="combo-product-phone-badge-icon" aria-hidden />
              <div className="combo-product-phone-badge-text">
                <div className="combo-product-phone-vanity">{SUPPORT_CONTACT.phoneDisplay}</div>
                <div className="combo-product-phone-numeric">{SUPPORT_CONTACT.phoneNumeric}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/contact?type=sales')}
              className="btn-inverse-outline combo-product-final-cta-secondary"
            >
              Contact Sales
            </button>
          </motion.div>

          <motion.div
            className="combo-product-trust-indicators"
            variants={listContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={mhViewport}
          >
            {COMBO_TRUST_INDICATORS.map((label) => (
              <motion.div
                key={label}
                className="combo-product-trust-indicator"
                variants={listItemVariants}
              >
                <CheckIcon className="combo-product-trust-icon" aria-hidden />
                <span>{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
