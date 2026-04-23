import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { 
  CheckIcon, 
  ClockIcon, 
  WrenchScrewdriverIcon, 
  BuildingOfficeIcon,
  HomeIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import {
  PRODUCT_NAMES,
  SENSOR_STANDARD_DISPLAY,
  SENSOR_WIFI_DISPLAY,
  SENSOR_STANDARD_SHORT,
  SENSOR_WIFI_SHORT,
  SUPPORT_CONTACT,
} from '../config/acdwKnowledge'
import type { PageSearchMeta } from '../config/siteSearchTypes'
import { ProductHotspots, type Hotspot } from '../components/products/ProductHotspots'
import { miniHotspots } from '../components/products/miniHotspots'
import { SensorWaterGaugeInline } from '../components/products/SensorWaterGauge'
import { ComboWorkflowShowcase } from '../components/products/ComboWorkflowShowcase'
import { ProductsLineupComparison } from '../components/products/ProductsLineupComparison'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'page-products',
  kind: 'site',
  title: 'Products — AC Drain Wiz lineup',
  body:
    'Products overview: AC Drain Wiz Mini compact maintenance manifold with bayonet port and bi-directional valve; flush, compressed air, vacuum on 3/4 inch PVC condensate lines. AC Drain Wiz Standard Sensor Switch (Non-WiFi) and WiFi Sensor Switch—capacitive overflow protection; WiFi adds remote monitoring and alerts on 2.4 GHz Wi-Fi. Mini plus Sensor bundle. Comparison: Standard vs WiFi Sensor vs Mini plus Sensor—Wi-Fi, alerts, install time, IMC examples. Specifications, contractor-focused catalog, FAQs.',
  tags: ['products', 'mini', 'sensor', 'combo', 'catalog', 'specs', 'IMC'],
  searchTerms: ['solutions', 'lineup', 'ACDW'],
  href: '/products',
}

/** Viewport: reveal once, trigger a bit before fully centered */
const lineupMotionViewport = { once: true, amount: 0.28, margin: '0px 0px -12% 0px' } as const

/** Below product showcases — sections animate in on scroll */
const lowerPageViewport = { once: true, amount: 0.22, margin: '0px 0px -10% 0px' } as const

/**
 * Dev-only: enable the hotspot calibration overlay when `?calibrate=hotspots`
 * is present in the URL AND we're running a dev build. Double-guarded so it
 * can't activate in production even if the query param leaks in.
 */
const useCalibrateHotspotsFlag = () => {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    if (!import.meta.env.DEV) return
    if (typeof window === 'undefined') return
    const read = () =>
      new URLSearchParams(window.location.search).get('calibrate') === 'hotspots'
    setEnabled(read())
    const onPopState = () => setEnabled(read())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])
  return enabled
}

export function ProductsPage() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const reduceMotion = useReducedMotion()
  const calibrateHotspots = useCalibrateHotspotsFlag()

  const introStagger = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: { staggerChildren: reduceMotion ? 0 : 0.11, delayChildren: reduceMotion ? 0 : 0.06 },
      },
    }),
    [reduceMotion]
  )

  const fadeUpLineup = useMemo(
    () => ({
      hidden: { opacity: 0, y: reduceMotion ? 0 : 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: reduceMotion ? 0.2 : 0.48,
          ease: [0.25, 0.46, 0.45, 0.94] as const,
        },
      },
    }),
    [reduceMotion]
  )

  const subheadTitle = useMemo(
    () => ({
      hidden: { opacity: 0, y: reduceMotion ? 0 : 14, scale: reduceMotion ? 1 : 0.98 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: reduceMotion ? 0.2 : 0.42, ease: [0.22, 1, 0.36, 1] as const },
      },
    }),
    [reduceMotion]
  )

  const subheadDesc = useMemo(
    () => ({
      hidden: { opacity: 0, y: reduceMotion ? 0 : 10 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: reduceMotion ? 0.2 : 0.4, delay: reduceMotion ? 0 : 0.06 },
      },
    }),
    [reduceMotion]
  )

  const slideInLeft = useMemo(
    () => ({
      hidden: { opacity: 0, x: reduceMotion ? 0 : -40 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration: reduceMotion ? 0.2 : 0.58, ease: [0.22, 1, 0.36, 1] as const },
      },
    }),
    [reduceMotion]
  )

  const slideInRight = useMemo(
    () => ({
      hidden: { opacity: 0, x: reduceMotion ? 0 : 40 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration: reduceMotion ? 0.2 : 0.58, ease: [0.22, 1, 0.36, 1] as const },
      },
    }),
    [reduceMotion]
  )

  const showcaseBleedReveal = useMemo(
    () => ({
      hidden: { opacity: 0, y: reduceMotion ? 0 : 12 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: reduceMotion ? 0.2 : 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
      },
    }),
    [reduceMotion]
  )

  const benefitStagger = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: {
          staggerChildren: reduceMotion ? 0 : 0.055,
          delayChildren: reduceMotion ? 0 : 0.08,
        },
      },
    }),
    [reduceMotion]
  )

  const benefitItem = useMemo(
    () => ({
      hidden: { opacity: 0, x: reduceMotion ? 0 : -8 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration: reduceMotion ? 0.15 : 0.34, ease: [0.25, 0.46, 0.45, 0.94] as const },
      },
    }),
    [reduceMotion]
  )

  const lowerCardsStagger = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: {
          staggerChildren: reduceMotion ? 0 : 0.1,
          delayChildren: reduceMotion ? 0 : 0.04,
        },
      },
    }),
    [reduceMotion]
  )

  const lowerStepsStagger = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: {
          staggerChildren: reduceMotion ? 0 : 0.12,
          delayChildren: reduceMotion ? 0 : 0.06,
        },
      },
    }),
    [reduceMotion]
  )

  const lowerCardReveal = useMemo(
    () => ({
      hidden: { opacity: 0, y: reduceMotion ? 0 : 32, scale: reduceMotion ? 1 : 0.96 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: reduceMotion ? 0.2 : 0.52,
          ease: [0.22, 1, 0.36, 1] as const,
        },
      },
    }),
    [reduceMotion]
  )

  const lowerStepReveal = useMemo(
    () => ({
      hidden: { opacity: 0, y: reduceMotion ? 0 : 24, scale: reduceMotion ? 1 : 0.94 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: reduceMotion ? 0.2 : 0.48, ease: [0.22, 1, 0.36, 1] as const },
      },
    }),
    [reduceMotion]
  )

  const lowerFaqItem = useMemo(
    () => ({
      hidden: { opacity: 0, y: reduceMotion ? 0 : 12 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: reduceMotion ? 0.18 : 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
      },
    }),
    [reduceMotion]
  )

  const products = [
    {
      id: 'mini',
      name: 'ACDW Mini',
      status: 'GA',
      statusText: 'Available Now',
      statusColorClass: 'products-card-status-available',
      description: 'Our flagship compact maintenance manifold (~5" length) with a single snap-to-lock bayonet port and a bi-directional valve.',
      keyBenefits: [
        'Flagship product with versatile attachment system',
        'One port for all services (flush, air, vacuum, sensor)',
        'Bi-directional valve supports outward flush or inward vacuum',
        'Clear body for fast visual checks',
        'Supports code-compliant maintenance access'
      ],
      compatibility: '3/4" PVC (most residential condensate lines)',
      installationTime: '5 minutes or less',
      size: '5" × 3" × 2"',
      pricing: {
        msrp: 'Contact us for pricing',
        contractor: 'Contact us for pricing',
        'property-manager': 'Contact for pricing'
      },
      compliance: ['IMC 307.2.5', 'IMC 307.2.2', 'IMC 307.2.1.1'],
      contractorOnly: true
    },
    {
      id: 'sensor',
      name: 'ACDW Sensor',
      status: 'GA',
      statusText: 'Available Now',
      statusColorClass: 'products-card-status-available',
      contractorOnly: true,
      description:
        'Capacitive water-level Sensor Switch in two models: Standard (Non-WiFi) for automatic overflow protection, or WiFi for remote monitoring and alerts. Each includes a Transparent T Manifold and can install standalone—the Mini is not required.',
      keyBenefits: [
        'Standard (Non-WiFi): local overflow protection; WiFi model: remote monitoring, email/SMS alerts on 2.4 GHz Wi‑Fi (5 GHz not supported)',
        'No moving parts; no direct water contact; automatic AC shutoff at high water (~80%)',
        'Transparent T Manifold included; also fits the Mini bayonet when paired',
        'WiFi model: contractor app and service alerts between about 50–79% fill; shutdown at ~80%',
      ],
      compatibility: 'T Manifold (included); optional Mini bayonet',
      installationTime: '15 minutes',
      size: '2" × 3" × 1.5"',
      pricing: {
        // Launch Button Redirect
        msrp: 'Contact us for pricing',
        contractor: 'Contact us for pricing',
        'property-manager': 'Contact for pricing'
      },
      compliance: ['IMC 307.2.3']
    },
    {
      id: 'mini-sensor',
      name: 'Mini + Sensor',
      status: 'GA',
      statusText: 'Available Now',
      statusColorClass: 'products-card-status-available',
      contractorOnly: true,
      description:
        'Complete protection combining the Mini\'s proactive cleaning with a Sensor Switch—overflow protection on the bayonet port, and with the WiFi Sensor Switch, remote monitoring and alerts.',
      keyBenefits: [
        'Maximum protection with proactive cleaning plus overflow protection (WiFi model adds remote alerts)',
        'WiFi bundle path: remote alerts and dashboard; Standard Sensor: local shutoff without Wi‑Fi',
        'Complete solution for HVAC contractors',
        'Reduce callbacks and increase customer satisfaction',
        'Differentiate your services with premium maintenance packages'
      ],
      compatibility: '3/4" PVC + Mini integration',
      installationTime: '45 minutes total',
      size: '5" × 3" × 2" (Mini) + Sensor',
      pricing: {
        // Launch Button Redirect
        msrp: 'Contact us for pricing',
        contractor: 'Contact us for pricing',
        'property-manager': 'Contact for pricing'
      },
      compliance: ['IMC 307.2.5', 'IMC 307.2.2', 'IMC 307.2.1.1', 'IMC 307.2.3']
    }
  ]

  const solutions = [
    {
      id: 'residential',
      accent: '#2563eb',
      title: 'Residential HVAC',
      description: 'Perfect for single-family homes, condominiums, and apartments with 3/4" condensate lines.',
      icon: HomeIcon,
      features: [
        'One-time installation eliminates repeated cutting',
        'Clear visual inspection of drain lines',
        'Installs in 5 minutes or less',
        'Prevents costly water damage',
        'Increases home value and peace of mind'
      ],
      benefits: [
        'Reduced maintenance costs',
        'Improved system efficiency',
        'Professional installation support',
        'IMC code compliance'
      ],
      pricing: 'Volume Pricing Available',
      status: 'Available Now'
    },
    {
      id: 'commercial',
      accent: '#2eb4e8',
      title: 'Light Commercial',
      description: 'Scalable solutions for select commercial installations including small offices and retail spaces.',
      icon: BuildingOfficeIcon,
      features: [
        'Scalable installation across multiple units',
        'Bulk pricing for commercial projects',
        'Professional contractor support',
        'Compliance documentation',
        'Custom installation planning'
      ],
      benefits: [
        'Reduced maintenance overhead',
        'Improved tenant satisfaction',
        'Professional project management',
        'Bulk purchasing discounts'
      ],
      pricing: 'Volume pricing available',
      status: 'Available Now'
    },
    {
      id: 'municipal',
      accent: '#ea580c',
      title: 'Municipal & Code Compliance',
      description: 'Comprehensive solutions for city officials and code compliance with proper documentation and approvals.',
      icon: ShieldCheckIcon,
      features: [
        'IMC code compliance (307.2.5, 307.2.2, 307.2.1.1)',
        'Approved disposal location references',
        'Maintenance access documentation',
        'Code official training materials',
        'Compliance reporting tools'
      ],
      benefits: [
        'Streamlined permit approval',
        'Reduced compliance issues',
        'Professional documentation',
        'Training and support programs'
      ],
      pricing: 'Contact for municipal pricing',
      status: 'Available Now'
    }
  ]

  const compatibilityGroups = [
    {
      eyebrow: 'Fit & installation',
      items: [
        'Fits standard 3/4" PVC drain lines',
        'Works with residential and commercial systems',
      ],
    },
    {
      eyebrow: 'Performance & environment',
      items: [
        'Typical residential HVAC condensate environments',
        'Pressure rated to 100 PSI',
      ],
    },
    {
      eyebrow: 'Sensor switches',
      items: [
        'Standard (Non-WiFi): local overflow protection; no Wi‑Fi required',
        'WiFi model: remote monitoring on 2.4 GHz Wi‑Fi only (5 GHz not supported); 24V HVAC power strongly recommended',
      ],
    },
    {
      eyebrow: 'System integration',
      items: [
        'Compatible with transfer pumps',
        'Mini maintenance access does not require an electrical connection',
      ],
    },
  ] as const

  const faqs = [
    {
      question: "What products does AC Drain Wiz offer?",
      answer:
        "We offer the AC Drain Wiz Mini, two Sensor Switch models—the Standard (Non-WiFi) Sensor Switch and the WiFi Sensor Switch—and the Mini + Sensor bundle. All are sold through authorized distributors and HVAC contractors for different needs and use cases.",
    },
    {
      question: "Can homeowners purchase the Sensor?",
      // Launch Button Redirect
      answer:
        "Sensor Switches are available through authorized HVAC contractors only. If you're interested in installation, contact us and we'll connect you with a local HVAC professional. Contractors can contact us for pricing and purchasing details.",
    },
    {
      question: "What's the difference between Mini and Sensor?",
      answer:
        "Mini is our compact solution for proactive drain line maintenance access—sold through authorized distributors and HVAC contractors. Sensor Switches add capacitive overflow protection with automatic AC shutoff at high water. The WiFi Sensor Switch adds remote monitoring, email/SMS alerts, and the contractor monitoring experience on 2.4 GHz Wi‑Fi; the Standard (Non-WiFi) model provides local protection without Wi‑Fi. See the product sections above for details.",
    },
    {
      question: "Do I need both Mini and Sensor, or can I use them separately?",
      answer:
        "They work independently but are designed to work together. Mini handles proactive cleaning access; a Sensor Switch adds overflow protection on the line (WiFi model: remote alerts and dashboard). You can start with Mini and add a Sensor later, install a Sensor Switch with its included manifold without Mini first, or choose the bundle—through an authorized contractor.",
    },
    {
      question: "Will AC Drain Wiz work with my existing AC system?",
      answer: "AC Drain Wiz works with standard 3/4\" PVC drain lines used in most residential and light commercial systems. If your system uses a different size, contact us for guidance."
    },
    {
      question: "What kind of warranty do you offer?",
      answer: "All AC Drain Wiz products come with our industry-leading manufacturer warranty. See our warranty section for full details."
    },
    {
      question: "Do you offer professional contractor pricing?",
      // Launch Button Redirect
      answer: `Yes! HVAC professionals and contractors qualify for special bulk pricing and support. Contact us at ${SUPPORT_CONTACT.phoneDisplay} [${SUPPORT_CONTACT.phoneNumeric}] or use our contact form to request contractor pricing.`
    },
    {
      question: "Is AC Drain Wiz approved by building inspectors and code officials?",
      answer: "AC Drain Wiz meets International Mechanical Code (IMC) standards and is approved for use in municipalities nationwide. We provide compliance documentation for inspectors."
    }
  ]

  const handleProductCTA = (productId: string) => {
    // All products navigate to their detail pages
    if (productId === 'mini') {
      navigate('/products/mini')
    } else if (productId === 'sensor') {
      navigate('/products/sensor')
    } else if (productId === 'mini-sensor') {
      // Navigate to dedicated combo product page
      navigate('/products/combo')
    }
  }

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const miniProduct = products.find((p) => p.id === 'mini')
  const sensorProduct = products.find((p) => p.id === 'sensor')
  const comboProduct = products.find((p) => p.id === 'mini-sensor')

  type LineupProduct = (typeof products)[number]

  const showcaseArticleStagger = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: {
          staggerChildren: reduceMotion ? 0 : 0.14,
          delayChildren: reduceMotion ? 0 : 0.04,
        },
      },
    }),
    [reduceMotion]
  )

  const renderProductShowcase = (
    product: LineupProduct,
    options: {
      titleId: string
      eyebrow: string
      heading: string
      /** Shown under the main heading (e.g. two formal product names). */
      headingSubtitle?: string
      imageSrc: string
      imageAlt: string
      /** `true` = copy left, image right (Sensor). `false` = image left, copy right (Mini, Combo). */
      mediaRight: boolean
      /** When provided, renders an interactive hotspot overlay on the image instead of a click-through. */
      hotspots?: Hotspot[]
      /** Dev-only: enables drag-to-position calibration for the hotspot overlay. */
      calibrateHotspots?: boolean
      /** When provided, replaces the `<img>` with arbitrary JSX (e.g. an interactive demo). */
      customMedia?: ReactNode
    }
  ) => {
    const {
      titleId,
      eyebrow,
      heading,
      headingSubtitle,
      imageSrc,
      imageAlt,
      mediaRight,
      hotspots,
      calibrateHotspots: calibrate,
      customMedia,
    } = options
    const splitClass = mediaRight
      ? 'products-showcase-split products-showcase-split--media-right'
      : 'products-showcase-split'

    const mediaMotion = mediaRight ? slideInRight : slideInLeft
    const bodyMotion = mediaRight ? slideInLeft : slideInRight
    const hasHotspots = Boolean(hotspots && hotspots.length > 0)
    const hasCustomMedia = Boolean(customMedia)
    const isInteractiveMedia = hasHotspots || hasCustomMedia
    const imageLoading = product.id === 'mini' ? 'eager' : 'lazy'

    const interactiveMediaProps = isInteractiveMedia
      ? {}
      : {
          onClick: () => handleProductCTA(product.id),
          onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleProductCTA(product.id)
            }
          },
          role: 'button' as const,
          tabIndex: 0,
          'aria-label': headingSubtitle
            ? `View details for ${heading}. ${headingSubtitle}`
            : `View details for ${heading}`,
          whileHover: reduceMotion ? undefined : { scale: 1.02 },
          whileTap: reduceMotion ? undefined : { scale: 0.99 },
          transition: { type: 'spring' as const, stiffness: 420, damping: 28 },
        }

    return (
      <section className="products-showcase-bleed" aria-labelledby={titleId}>
        <motion.div
          className="products-showcase-bleed-inner"
          initial="hidden"
          whileInView="visible"
          viewport={lineupMotionViewport}
          variants={showcaseBleedReveal}
        >
          <motion.article
            className={splitClass}
            initial="hidden"
            whileInView="visible"
            viewport={lineupMotionViewport}
            variants={showcaseArticleStagger}
          >
            <motion.div
              className={`products-showcase-media${isInteractiveMedia ? ' products-showcase-media--hotspots' : ''}`}
              variants={mediaMotion}
              {...interactiveMediaProps}
            >
              {hasHotspots ? (
                <ProductHotspots
                  imageSrc={imageSrc}
                  imageAlt={imageAlt}
                  hotspots={hotspots!}
                  imgClassName="products-showcase-img"
                  loading={imageLoading}
                  calibrate={calibrate}
                />
              ) : hasCustomMedia ? (
                customMedia
              ) : (
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="products-showcase-img"
                  loading={imageLoading}
                  decoding="async"
                />
              )}
            </motion.div>
            <motion.div className="products-showcase-body" variants={bodyMotion}>
              <span className="products-showcase-eyebrow">{eyebrow}</span>
              {headingSubtitle ? (
                <div className="products-showcase-heading-stack">
                  <h3 id={titleId} className="products-showcase-title">
                    {heading}
                  </h3>
                  <p className="products-showcase-title-sub">{headingSubtitle}</p>
                </div>
              ) : (
                <h3 id={titleId} className="products-showcase-title">
                  {heading}
                </h3>
              )}
              <div className="products-showcase-badges">
                <span className={`unified-product-card-status ${product.statusColorClass}`}>
                  {product.statusText}
                </span>
                {product.contractorOnly ? (
                  <span className="unified-product-card-badge-contractor">Contractor Only</span>
                ) : null}
              </div>
              <p className="products-showcase-desc">{product.description}</p>
              <motion.ul
                className="products-showcase-benefits"
                variants={benefitStagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
              >
                {product.keyBenefits.slice(0, 4).map((benefit, index) => (
                  <motion.li
                    key={index}
                    className="products-showcase-benefit-item"
                    variants={benefitItem}
                  >
                    <CheckIcon className="products-showcase-benefit-icon" aria-hidden />
                    <span>{benefit}</span>
                  </motion.li>
                ))}
              </motion.ul>
              <div className="products-showcase-specs">
                <div className="products-showcase-spec">
                  <ClockIcon className="products-showcase-spec-icon" aria-hidden />
                  <span>{product.installationTime}</span>
                </div>
                <div className="products-showcase-spec">
                  <WrenchScrewdriverIcon className="products-showcase-spec-icon" aria-hidden />
                  <span>{product.compatibility}</span>
                </div>
              </div>
              <div className="products-showcase-cta">
                <motion.button
                  type="button"
                  onClick={() => handleProductCTA(product.id)}
                  className="products-showcase-cta-button"
                  whileHover={reduceMotion ? undefined : { scale: 1.03, y: -1 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                >
                  View details
                  <ArrowRightIcon className="products-showcase-cta-icon" aria-hidden />
                </motion.button>
              </div>
            </motion.div>
          </motion.article>
        </motion.div>
      </section>
    )
  }

  return (
    <div className="unified-products-page">
      {/* Hero — same pattern as About: stagger + fade-up on mount (not scroll) */}
      <div className="unified-products-hero">
        <div className="unified-products-hero-content">
          <motion.div
            variants={introStagger}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            <motion.h1 className="unified-products-hero-title" variants={fadeUpLineup}>
              A smarter AC maintenance starts with AC Drain Wiz
            </motion.h1>
            <motion.p className="unified-products-hero-subtitle" variants={fadeUpLineup}>
              Professional-grade solutions that prevent costly water damage and streamline HVAC service
              operations—from maintenance access to overflow protection and optional Wi‑Fi monitoring.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Products — intro (staggered title + subtitle; flows into Mini showcase) */}
      <section
        className="unified-products-section unified-products-section--products-intro"
        aria-labelledby="products-lineup-heading"
      >
        <div className="unified-products-content">
          <motion.div
            className="unified-section-header"
            variants={introStagger}
            initial="hidden"
            whileInView="visible"
            viewport={lineupMotionViewport}
          >
            <motion.h2
              id="products-lineup-heading"
              className="unified-section-title"
              variants={fadeUpLineup}
            >
              Our Products
            </motion.h2>
            <motion.p className="unified-section-subtitle" variants={fadeUpLineup}>
              Everything you need to keep your AC drain lines clean and your systems running smoothly
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* AC Drain Wiz Mini — image left, copy right */}
      {miniProduct
        ? renderProductShowcase(miniProduct, {
            titleId: 'product-mini-showcase-title',
            eyebrow: 'Flagship access',
            heading: PRODUCT_NAMES.mini,
            imageSrc: '/images/acdw-mini-product-parts.png',
            imageAlt: 'AC Drain Wiz Mini with labeled parts on a condensate drain line',
            mediaRight: false,
            hotspots: miniHotspots,
            calibrateHotspots: calibrateHotspots,
          })
        : null}

      {/* Sensor — subhead + black showcase (copy left, image right) */}
      <motion.section
        className="products-showcase-subhead"
        aria-labelledby="products-subhead-sensor-heading"
        initial="hidden"
        whileInView="visible"
        viewport={lineupMotionViewport}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: reduceMotion ? 0 : 0.12, delayChildren: reduceMotion ? 0 : 0.04 },
          },
        }}
      >
        <div className="products-showcase-subhead-inner">
          <motion.h2
            id="products-subhead-sensor-heading"
            className="products-showcase-subhead-title"
            variants={subheadTitle}
          >
            Sensor: overflow protection and monitoring
          </motion.h2>
          <motion.p className="products-showcase-subhead-desc" variants={subheadDesc}>
            Choose a {SENSOR_STANDARD_SHORT} or {SENSOR_WIFI_SHORT}—capacitive sensing, automatic AC
            shutoff at high water, and optional WiFi alerts on 2.4 GHz Wi‑Fi (5 GHz not supported).
            Includes its own Transparent T Manifold; the Mini is not required to install.
          </motion.p>
        </div>
      </motion.section>
      {sensorProduct
        ? renderProductShowcase(sensorProduct, {
            titleId: 'product-sensor-showcase-title',
            eyebrow: 'Smart protection',
            heading: PRODUCT_NAMES.sensor,
            headingSubtitle: `${SENSOR_STANDARD_DISPLAY} · ${SENSOR_WIFI_DISPLAY}`,
            imageSrc: '/images/acdw-sensor-hero2-background.png',
            imageAlt:
              'AC Drain Wiz Standard Sensor Switch (Non-WiFi) and WiFi Sensor Switch—overflow protection on a condensate drain line',
            mediaRight: true,
          })
        : null}

      {/* Sensor — inline live demo (Standard / WiFi toggle) */}
      <section
        className="products-showcase-bleed products-sensor-demo-section"
        aria-labelledby="products-sensor-demo-heading"
      >
        <div className="products-showcase-bleed-inner products-sensor-demo-inner">
          <h2
            id="products-sensor-demo-heading"
            className="products-sensor-demo-title"
          >
            See it in action
          </h2>
          <p className="products-sensor-demo-desc">
            Watch the Sensor react as water rises in the drain line—WiFi shows
            contractor alerts from about 50–79% fill; both models protective AC
            shutoff at ~80%. Water in the demo never rises above shutoff. Toggle
            between Standard and WiFi to compare what each model does on site.
          </p>
          <SensorWaterGaugeInline />
        </div>
      </section>

      {/* Mini + Sensor bundle — subhead + black showcase (image left, copy right) */}
      <motion.section
        className="products-showcase-subhead"
        aria-labelledby="products-subhead-combo-heading"
        initial="hidden"
        whileInView="visible"
        viewport={lineupMotionViewport}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: reduceMotion ? 0 : 0.12, delayChildren: reduceMotion ? 0 : 0.04 },
          },
        }}
      >
        <div className="products-showcase-subhead-inner">
          <motion.h2
            id="products-subhead-combo-heading"
            className="products-showcase-subhead-title"
            variants={subheadTitle}
          >
            One port for service and protection
          </motion.h2>
          <motion.p className="products-showcase-subhead-desc" variants={subheadDesc}>
            Pair permanent drain access with overflow protection—one coordinated install for contractors
            who want the full bayonet workflow: service through the Mini, monitoring with the Sensor.
          </motion.p>
        </div>
      </motion.section>
      {comboProduct
        ? renderProductShowcase(comboProduct, {
            titleId: 'product-combo-showcase-title',
            eyebrow: 'Complete workflow',
            heading: 'AC Drain Wiz Mini + Sensor Combo',
            imageSrc: '/images/hvac-combo-mini-sensor-product-hero.png',
            imageAlt: 'AC Drain Wiz Mini and Sensor bundle',
            mediaRight: false,
            customMedia: (
              <ComboWorkflowShowcase
                heroImage={{
                  src: '/images/hvac-combo-mini-sensor-product-hero.png',
                  alt: 'AC Drain Wiz Mini and Sensor bundle',
                }}
              />
            ),
          })
        : null}

      {/* Standard vs WiFi vs bundle — comparison */}
      <section
        id="products-lineup-comparison"
        className="unified-lineup-comparison-section products-lower-band--lineup-comparison"
        aria-labelledby="products-lineup-comparison-heading"
      >
        <div className="unified-products-content">
          <motion.div
            className="unified-section-header"
            variants={fadeUpLineup}
            initial="hidden"
            whileInView="visible"
            viewport={lowerPageViewport}
          >
            <h2 id="products-lineup-comparison-heading" className="unified-section-title">
              Which one do I need?
            </h2>
            <p className="unified-section-subtitle">
              Standard and WiFi Sensor models share the same ~80% protective shutdown; WiFi adds contractor tools and
              alerts on 2.4 GHz Wi‑Fi only. Add the Mini when you want permanent flush, air, and vacuum access on the
              same bayonet workflow—the bundle packages both.
            </p>
          </motion.div>
          <motion.div
            variants={fadeUpLineup}
            initial="hidden"
            whileInView="visible"
            viewport={lowerPageViewport}
          >
            <ProductsLineupComparison />
          </motion.div>
        </div>
      </section>

      {/* Solutions by Use Case */}
      <div className="unified-solutions-section products-lower-band--solutions">
        <div className="unified-products-content">
          <motion.div
            className="unified-section-header"
            variants={fadeUpLineup}
            initial="hidden"
            whileInView="visible"
            viewport={lowerPageViewport}
          >
            <h2 className="unified-section-title">Solutions for Every Need</h2>
            <p className="unified-section-subtitle">
              From residential homes to commercial buildings and municipal systems
            </p>
          </motion.div>

          <motion.div
            className="unified-solutions-grid"
            variants={lowerCardsStagger}
            initial="hidden"
            whileInView="visible"
            viewport={lowerPageViewport}
          >
            {solutions.map((solution) => {
              const waveGradId = `unified-solution-wave-grad-${solution.id}`
              return (
                <motion.div
                  key={solution.id}
                  className="unified-solution-card"
                  style={{ '--solution-accent': solution.accent } as CSSProperties}
                  variants={lowerCardReveal}
                >
                  <div className="unified-solution-card-body">
                    <div className="unified-solution-card-icon-wrapper">
                      <solution.icon className="unified-solution-card-icon" />
                    </div>
                    <h3 className="unified-solution-card-title">{solution.title}</h3>
                    <p className="unified-solution-card-description">{solution.description}</p>

                    <div className="unified-solution-card-features">
                      <h4 className="unified-solution-card-features-title">Key Features</h4>
                      <ul className="unified-solution-card-features-list">
                        {solution.features.map((feature, index) => (
                          <li key={index} className="unified-solution-card-feature-item">
                            <CheckIcon className="unified-solution-card-feature-icon" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="unified-solution-card-benefits">
                      <h4 className="unified-solution-card-benefits-title">Benefits</h4>
                      <ul className="unified-solution-card-benefits-list">
                        {solution.benefits.map((benefit, index) => (
                          <li key={index} className="unified-solution-card-benefit-item">
                            <CheckIcon className="unified-solution-card-benefit-icon" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="unified-solution-card-footer">
                      <div className="unified-solution-card-pricing">
                        <strong>Pricing:</strong> {solution.pricing}
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate(`/contact?type=${solution.id}`)}
                        className="unified-solution-card-cta"
                      >
                        Learn More
                        <ArrowRightIcon className="unified-solution-card-cta-icon" />
                      </button>
                    </div>
                  </div>
                  <div className="unified-solution-card-fill" aria-hidden="true" />
                  <svg
                    className="unified-solution-card-wave"
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
      </div>

      {/* How It Works */}
      <div className="unified-how-it-works-section products-lower-band--workflow">
        <div className="unified-products-content">
          <motion.div
            className="unified-section-header"
            variants={fadeUpLineup}
            initial="hidden"
            whileInView="visible"
            viewport={lowerPageViewport}
          >
            <h2 className="unified-section-title">Install Once, Clean Anytime</h2>
            <p className="unified-section-subtitle">
              Three simple steps to worry-free AC maintenance
            </p>
          </motion.div>

          <motion.div
            className="unified-how-it-works-steps"
            variants={lowerStepsStagger}
            initial="hidden"
            whileInView="visible"
            viewport={lowerPageViewport}
          >
            <motion.div className="unified-how-it-works-step" variants={lowerStepReveal}>
              <div className="unified-how-it-works-step-icon">
                <WrenchScrewdriverIcon className="unified-how-it-works-icon" />
              </div>
              <h3 className="unified-how-it-works-step-title">Install</h3>
              <p className="unified-how-it-works-step-description">
                Cut your existing drain line, solvent-weld AC Drain Wiz in place (5 minutes or less).
                Works with 3/4&quot; PVC drain lines.
              </p>
            </motion.div>

            <motion.div className="unified-how-it-works-step" variants={lowerStepReveal}>
              <div className="unified-how-it-works-step-icon">
                <svg className="unified-how-it-works-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <h3 className="unified-how-it-works-step-title">Clean</h3>
              <p className="unified-how-it-works-step-description">
                When it&apos;s time for maintenance, snap in your preferred attachment: air, water, or
                vacuum. When using air, check for a P-trap in the system and refill it with water after the
                flush to reestablish the water seal. Bayonet mount ensures perfect seal every time.
              </p>
            </motion.div>

            <motion.div className="unified-how-it-works-step" variants={lowerStepReveal}>
              <div className="unified-how-it-works-step-icon">
                <ShieldCheckIcon className="unified-how-it-works-icon" />
              </div>
              <h3 className="unified-how-it-works-step-title">Monitor</h3>
              <p className="unified-how-it-works-step-description">
                Add an AC Drain Wiz Sensor Switch for overflow protection—automatic AC shutoff when water
                is high. Choose the WiFi Sensor Switch for remote monitoring, email/SMS alerts, and the
                contractor app on 2.4 GHz Wi‑Fi (5 GHz not supported). The Standard (Non-WiFi) model
                provides local protection without Wi‑Fi.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Compatibility & Technical Specs */}
      <div className="unified-compatibility-section products-lower-band--compat">
        <div className="unified-products-content">
          <motion.div
            className="unified-section-header"
            variants={fadeUpLineup}
            initial="hidden"
            whileInView="visible"
            viewport={lowerPageViewport}
          >
            <h2 className="unified-section-title">Compatibility & Technical Specifications</h2>
            <p className="unified-section-subtitle">Works seamlessly with your existing systems</p>
          </motion.div>

          <motion.div
            className="unified-compatibility-groups"
            variants={lowerCardsStagger}
            initial="hidden"
            whileInView="visible"
            viewport={lowerPageViewport}
          >
            {compatibilityGroups.map((group) => (
              <motion.div
                key={group.eyebrow}
                className="unified-compatibility-group"
                variants={lowerCardReveal}
              >
                <h3 className="unified-compatibility-group-eyebrow">{group.eyebrow}</h3>
                <ul className="unified-compatibility-group-list">
                  {group.items.map((label) => (
                    <li key={label} className="unified-compatibility-item">
                      <CheckIcon className="unified-compatibility-icon" aria-hidden />
                      <span>{label}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="unified-compatibility-footer"
            variants={fadeUpLineup}
            initial="hidden"
            whileInView="visible"
            viewport={lowerPageViewport}
          >
            <p>
              Not sure if it works with your system?{' '}
              <button type="button" onClick={() => navigate('/contact')} className="unified-compatibility-link">
                See full specifications →
              </button>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Why Choose AC Drain Wiz */}
      <div className="unified-why-choose-section products-lower-band--why">
        <div className="unified-products-content">
          <motion.div
            className="unified-section-header"
            variants={fadeUpLineup}
            initial="hidden"
            whileInView="visible"
            viewport={lowerPageViewport}
          >
            <h2 className="unified-section-title">Why Choose AC Drain Wiz</h2>
          </motion.div>

          <motion.div
            className="unified-why-choose-grid"
            variants={lowerCardsStagger}
            initial="hidden"
            whileInView="visible"
            viewport={lowerPageViewport}
          >
            {(
              [
                {
                  Icon: ShieldCheckIcon,
                  title: 'IMC Code Compliant',
                  desc: 'Professional-grade solution meeting International Mechanical Code standards for reliable, safe operation.',
                },
                {
                  Icon: ClockIcon,
                  title: '5-Minute Installation',
                  desc: 'Get up and running fast with our simple installation process that takes 5 minutes or less to complete.',
                },
                {
                  Icon: HomeIcon,
                  title: 'Prevent Water Damage',
                  desc: 'Protect your home from costly water damage by keeping your AC drain lines clean and clog-free year-round.',
                },
                {
                  Icon: WrenchScrewdriverIcon,
                  title: 'Made in USA',
                  desc: 'Quality you can trust with products manufactured right here in the United States using premium materials.',
                },
              ] as const
            ).map(({ Icon, title, desc }) => (
              <motion.div key={title} className="unified-why-choose-card" variants={lowerCardReveal}>
                <div className="unified-why-choose-icon">
                  <Icon className="unified-why-choose-icon-svg" />
                </div>
                <h3 className="unified-why-choose-title">{title}</h3>
                <p className="unified-why-choose-description">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="unified-faq-section products-lower-band--faq">
        <div className="unified-products-content">
          <motion.div
            className="unified-section-header"
            variants={fadeUpLineup}
            initial="hidden"
            whileInView="visible"
            viewport={lowerPageViewport}
          >
            <h2 className="unified-section-title">Frequently Asked Questions</h2>
            <p className="unified-section-subtitle">
              Get answers to the most common questions about AC Drain Wiz
            </p>
          </motion.div>

          <motion.div
            className="unified-faq-list"
            variants={lowerCardsStagger}
            initial="hidden"
            whileInView="visible"
            viewport={lowerPageViewport}
          >
            {faqs.map((faq, index) => (
              <motion.div key={faq.question} className="unified-faq-item" variants={lowerFaqItem}>
                <button type="button" onClick={() => toggleFaq(index)} className="unified-faq-question">
                  <span className="unified-faq-question-text">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUpIcon className="unified-faq-chevron" />
                  ) : (
                    <ChevronDownIcon className="unified-faq-chevron" />
                  )}
                </button>
                {openFaq === index ? (
                  <div className="unified-faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                ) : null}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="unified-faq-footer"
            variants={fadeUpLineup}
            initial="hidden"
            whileInView="visible"
            viewport={lowerPageViewport}
          >
            <p>
              Still have questions?{' '}
              <button type="button" onClick={() => navigate('/contact')} className="unified-faq-link">
                Contact Support →
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
