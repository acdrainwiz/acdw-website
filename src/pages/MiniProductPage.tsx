/**
 * ACDW Mini Product Landing Page
 * 
 * Apple-inspired product showcase page with:
 * - Hero section with product imagery
 * - Feature highlights
 * - Image gallery
 * - Quantity selector (1-10)
 * - Stripe checkout integration
 */

import { useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from 'framer-motion'
import { MiniHeroV2MeshBackground } from '../components/layout/MiniHeroV2MeshBackground'
import { MiniFlowWaveBackdrop } from '../components/products/MiniFlowWaveBackdrop'
import { HeroTitleRotator } from '../components/products/HeroTitleRotator'
import { usePageHeroIntro } from '../hooks/usePageHeroIntro'
import {
    CheckIcon,
    ShieldCheckIcon,
    WrenchScrewdriverIcon,
    ClockIcon,
    ArrowLeftIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ArrowRightIcon,
    BookOpenIcon,
    PhoneIcon
} from '@heroicons/react/24/outline'
import {
  MINI_MANIFOLD_DIMENSIONS_LHD,
  MINI_MANIFOLD_HEIGHT_TO_PORT,
  MINI_MANIFOLD_LENGTH,
  PRODUCT_NAMES,
  SUPPORT_CONTACT,
} from '../config/acdwKnowledge'
import type { PageSearchMeta } from '../config/siteSearchTypes'
import { buildProductSupportHubHref } from '../utils/supportFaqSearch'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'product-mini',
  kind: 'product-info',
  title: PRODUCT_NAMES.mini,
  body:
    'Drain line maintenance access device. Permanent service port on 3/4 inch condensate drain for flush, compressed air, and vacuum. Transparent body, one-time PVC install, horizontal installation. Product overview and specifications.',
  tags: ['mini', 'product', 'drain', 'pvc', 'maintenance'],
  href: '/products/mini',
}

const MINI_HERO_HEADLINES = [
  'Stop Water Damage Before It Starts',
  'See the Line. Clear Clogs Fast.',
  'Install Once—Service Forever',
  'Flush, Air & Vacuum—On Your Terms',
]

export function MiniProductPage() {
  const navigate = useNavigate()
  const heroRef = useRef<HTMLElement>(null)
  const miniHowWorksSectionRef = useRef<HTMLElement>(null)
  const miniVsOldSectionRef = useRef<HTMLElement>(null)
  const miniPurchaseCtaSectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { introStagger, fadeUp } = usePageHeroIntro()
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  // SCROLL-UP MANIFOLD (2026-04-30): negative target so the manifold rises on
  // scroll down (and returns to place on scroll up — useTransform is bidirectional).
  // Amplitude bumped to -100 for a clearly visible movement vs. the prior +44.
  const productParallaxY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -100])
  const wordmarkParallaxY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 22])

  // Pre-open Q1 by default (Tier 1 content pass: surfaces the most-asked install
  // question without requiring a click; users can still close it).
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Key specifications
  const specifications = [
    { label: 'Dimensions', value: MINI_MANIFOLD_DIMENSIONS_LHD },
    { label: 'Connection Size', value: '3/4" PVC' },
    { label: 'Installation Time', value: '5 minutes or less' },
    { label: 'Material', value: 'UV-resistant clear PVC' },
    { label: 'Compatibility', value: 'Most residential AC systems' }
  ]

  // Compliance badges
  const complianceCodes = [
    'IMC 307.2.5',
    'IMC 307.2.2',
    'IMC 307.2.1.1'
  ]

  // Testimonials from acdrainwiz.bwpsites.com
  // Step 2 visual redesign (2026-05-01):
  //   - Re-ordered to put contractor quotes (Joey, Jeff) in row 1 of the 2x2
  //     grid so the distributor/contractor audience reads them first.
  //   - Added `initials` and `roleType` fields powering the new initials-circle
  //     avatar (no headshot dependency). roleType drives a subtle background
  //     tint: contractor = primary blue, homeowner = neutral gray.
  //   - Jeff's quote trimmed with a leading ellipsis from the original 122
  //     words to ~73 to balance the top row visually with Joey's 51-word quote.
  //     Trim is verbatim (no rewriting); only the autobiographical lead-in
  //     and one mid-sentence have been removed. Full quote preserved at
  //     acdrainwiz.bwpsites.com if needed.
  //   - `image` and `rating` fields preserved in the data (not rendered) for
  //     easy revert and for any future treatment that wants them back.
  const testimonials = [
    {
      name: 'Joey',
      role: 'AC Technician',
      initials: 'Jo',
      roleType: 'contractor' as const,
      text: 'I love the AC DRAIN WIZ! After installing it and using it in one of my customers homes and seeing how much sludge came out after I did my service the normal way I was shocked! I would recommend the AC DRAIN to every homeowner out there!',
      rating: 5,
      image: '/images/testimonials/joey-testimonial.jpg'
    },
    {
      name: 'Jeff B.',
      role: 'FL General Contractor & Homeowner',
      initials: 'JB',
      roleType: 'contractor' as const,
      text: '…The only issue we have ever experienced has been a recurring problem with the condensate line backing up. I had no way of vacuuming it out without taking apart a big section of the PVC. Now, with AC Drain Wiz, I can quickly and easily hook up a hose and flush out the whole line. AC Drain Wiz is an easy, affordable necessity. As a contractor, I plan on using it on all my projects.',
      rating: 5,
      image: '/images/testimonials/jeff-b-testimonial.jpg'
    },
    {
      name: 'Charles C.',
      role: 'Homeowner',
      initials: 'CC',
      roleType: 'homeowner' as const,
      text: 'I highly recommend AC Drain Wiz. It is such an amazing product. I\'m surprised no one thought of it before. Thank you, AC Drain Wiz. It is comforting not to have sleepless, hot nights anymore.',
      rating: 5,
      image: '/images/testimonials/charles-testimonial.jpg'
    },
    {
      name: 'Jaclyn S.',
      role: 'Homeowner',
      initials: 'JS',
      roleType: 'homeowner' as const,
      text: 'The AC DRAIN WIZ is an amazing addition to my AC unit and has completely changed the unit which was becoming backed up almost every 3 months! The AC DRAIN WIZ really transformed the unit and it\'s now functioning better than ever! I\'m no longer looking forward to the summer in stifling south Florida with dread knowing that this device will allow prompt and effective resolution to any issue! Great product!!!',
      rating: 5,
      image: '/images/testimonials/jaclyn-s-testimonial.jpg'
    }
  ]

  // How It Works steps — Tier 1 content pass (2026-05-01):
  // Trimmed from 4 to 3 strictly action-oriented steps. The original 4-step list
  // padded with two outcomes ("Monitor Water Flow", "Prevent Water Damage") that
  // duplicated content already implied by Inspect/Clean. Three steps reads as a
  // real install/use loop and keeps the section tight.
  const howItWorksSteps = [
    {
      number: 1,
      title: 'Install in 5 minutes',
      description: 'Solvent-weld the Mini into your 3/4" PVC condensate line. PVC cutter, Oatey primer + cement, done. Cut once at install — never cut for maintenance again.',
      icon: WrenchScrewdriverIcon
    },
    {
      number: 2,
      title: 'Inspect anytime',
      description: 'The clear body gives a direct line of sight into the drain. Verify a clean was successful, or spot rising water and biofilm before they become a backup.',
      icon: CheckIcon
    },
    {
      number: 3,
      title: 'Clean when needed',
      description: 'Snap on the bayonet attachment to flush, blow, or vacuum the line in seconds. No cutting, no PVC repair, no emergency call.',
      icon: ClockIcon
    }
  ]

  // FAQ data — Tier 1 content pass (2026-05-01):
  // Trimmed from 10 → 5 questions, re-keyed for the distributor / contractor
  // primary audience (homeowners are secondary). Policy and logistics questions
  // moved out: warranty/returns now route via the support page link below;
  // bulk pricing is surfaced inside the Talk-to-our-team CTA above.
  // Voice: friendly-neutral, matches the rest of the site.
  const faqs = [
    {
      question: 'Will this fit standard 3/4" PVC condensate lines?',
      answer:
        'Yes. The Mini\'s horizontal openings are sized for standard 3/4" nominal PVC condensate drain line — the size used in the vast majority of residential and light commercial AC systems. Solvent-weld with Oatey primer + cement applied to the cut ends of the condensate line only, then fit them into the manifold\'s horizontal openings. Don\'t apply primer or cement to the manifold openings or the vertical port. If you\'re working with a non-3/4" line, contact us and we\'ll point you to the right configuration.'
    },
    {
      question: 'How long does install take, and what tools do I need?',
      answer:
        '5 minutes or less per install with standard tools — a PVC pipe cutter (or hacksaw), Oatey PVC primer, and Oatey all-purpose cement. Cut the existing line, prime and cement the cut ends, fit them into the manifold\'s horizontal openings, and let the joint cure per the cement manufacturer\'s spec. Cut once at install — never cut for service again. After install, all maintenance happens through the bayonet port.'
    },
    {
      question: 'How often will my customers need service after install?',
      answer:
        'Service intervals depend on the system and environment, but most installs follow the standard residential AC maintenance cadence of every 3 to 6 months. The Mini\'s clear body lets you verify the line is clear after a flush, or spot rising water and biofilm before they cause a backup. When you flush with compressed air on systems that have a P-trap, refill the trap with water after the flush to reestablish the seal.'
    },
    {
      question: 'Do you offer bulk pricing for contractors and distributors?',
      answer:
        'Yes — contractors, distributors, and property managers qualify for volume pricing. Online sales aren\'t open yet, so pricing and availability are handled directly by our sales team. Use the contact form or call us and we\'ll send a current quote and ship-date estimate.'
    },
    {
      question: 'How is warranty handled for stocked inventory?',
      answer:
        'AC Drain Wiz Mini ships with our standard manufacturer warranty against defects in materials and workmanship. For distributor stock and contractor accounts, returns and warranty replacements are coordinated through your purchase channel. Contact our team for account-specific handling, or see our warranty policy page for full terms.'
    }
  ]


  /** Below hero: shared scroll choreography for `/products/mini` (easier tuning + consistent feel). */
  const mhEase = [0.16, 1, 0.3, 1] as const
  const mhViewport = {
    once: true,
    amount: 0.22,
    margin: '-96px 0px -148px 0px',
  } as const

  const tr = (dur: number, delay = 0) =>
    reduceMotion ? ({ duration: 0.22 } as const) : ({ duration: dur, delay, ease: mhEase } as const)

  /** Mini How It Works — step cards: staggered viewport reveal + sequential pulse row. */
  const miniHowStepsContainerVariants: Variants = reduceMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { staggerChildren: 0, delayChildren: 0 },
        },
      }
    : {
        hidden: { opacity: 0, y: 36 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.75,
            ease: mhEase,
            staggerChildren: 0.12,
            delayChildren: 0.05,
            when: 'beforeChildren',
          },
        },
      }

  const miniHowStepBadgeVariants: Variants = reduceMotion
    ? { hidden: { opacity: 1, scale: 1 }, visible: { opacity: 1, scale: 1 } }
    : {
        hidden: { opacity: 0, scale: 0.45 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            type: 'spring',
            stiffness: 400,
            damping: 26,
          },
        },
      }

  const miniHowStepIconStageVariants: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0, rotate: 0 }, visible: { opacity: 1, y: 0, rotate: 0 } }
    : {
        hidden: { opacity: 0, y: 22, rotate: -8 },
        visible: {
          opacity: 1,
          y: 0,
          rotate: 0,
          transition: { duration: 0.78, ease: mhEase },
        },
      }

  const miniHowStepCopyVariants: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.62, ease: mhEase },
        },
      }

  /** Sequential spotlight: Install → Inspect → Clean → repeat (`prefers-reduced-motion`: off). */
  const howStepPulseCount = howItWorksSteps.length
  const [miniHowPulse, setMiniHowPulse] = useState(0)

  useEffect(() => {
    if (reduceMotion || howStepPulseCount <= 1) return undefined
    let intervalId: ReturnType<typeof setInterval> | undefined

    const start = () => {
      intervalId = setInterval(() => {
        setMiniHowPulse((i) => (i + 1) % howStepPulseCount)
      }, 3600)
    }

    start()

    const onVis = () => {
      if (intervalId) clearInterval(intervalId)
      intervalId = undefined
      if (!document.hidden) start()
    }

    document.addEventListener('visibilitychange', onVis)
    return () => {
      if (intervalId) clearInterval(intervalId)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [reduceMotion, howStepPulseCount])

  return (
    <div className="mini-product-page">
      {/* Back Navigation */}
      <div className="mini-product-back-nav">
        <button
          onClick={() => navigate('/products')}
          className="mini-product-back-button"
        >
          <ArrowLeftIcon className="mini-product-back-icon" />
          Back to Products
        </button>
      </div>

      {/* Hero — Phase 1 v2: mesh + floating product + rotating headline */}
      <section
        ref={heroRef}
        className="mini-hero-v2"
        aria-labelledby="mini-hero-heading"
      >
        <MiniHeroV2MeshBackground />

        <div className="mini-hero-v2-inner">
          <div className="mini-hero-v2-product-col">
            <div className="mini-hero-v2-stage">
              <div className="mini-hero-v2-wordmark-anchor" aria-hidden>
                <motion.div
                  className="mini-hero-v2-wordmark"
                  style={{ y: wordmarkParallaxY }}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
                >
                  <span className="mini-hero-v2-wordmark-img" />
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
                    <source media="(max-width: 767px)" srcSet="/images/acdw-mini-hero2-product-mobile.png" />
                    <img
                      src="/images/acdw-mini-hero2-product.png"
                      alt="AC Drain Wiz Mini clear T-manifold on condensate drain line"
                      className="mini-hero-v2-product-img"
                      width={1600}
                      height={1200}
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
            className="mini-hero-v2-content"
            variants={introStagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="mini-hero-v2-title" variants={fadeUp}>
              <HeroTitleRotator titles={MINI_HERO_HEADLINES} headingId="mini-hero-heading" />
            </motion.div>

            <motion.p className="mini-hero-v2-subtitle" variants={fadeUp}>
              AC drain clogs cause thousands in water damage. The Mini gives you instant access to clear
              blockages in about five minutes—no cutting required for maintenance, no mess, no emergency calls.
            </motion.p>

            <motion.div className="mini-hero-v2-trust" variants={fadeUp}>
              <span className="mini-hero-v2-trust-dot" aria-hidden />
              Trusted by homeowners &amp; AC contractors nationwide
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section
          Tier 1 content pass (2026-05-01): subtitle changed from "four" → "three"
          to match the trimmed howItWorksSteps array.
          Step 5 title promote (2026-05-01): added .mini-product-how-it-works
          wrapper class + replaced the generic centered "How It Works" H2 with
          the eyebrow + promoted-title pattern (matches the Specs section
          voice). The legacy `.product-how-it-works-subtitle` is hidden via
          CSS on the Mini page only — its content was promoted to be the H2. */}
      <section ref={miniHowWorksSectionRef} className="product-how-it-works mini-product-how-it-works">
        <MiniFlowWaveBackdrop sectionRef={miniHowWorksSectionRef} />
        <div className="product-how-it-works-content">
          <motion.header
            className="mini-section-header"
            initial={reduceMotion ? false : { opacity: 0, y: 52 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(1.02)}
          >
            <p className="mini-section-eyebrow">How it installs</p>
            <h2 className="product-section-title mini-section-title-promote">
              Install once. Inspect anytime. Clean in seconds.
            </h2>
            <p className="mini-section-dek">
              No cutting required for maintenance — ever.
            </p>
          </motion.header>
          <p className="product-how-it-works-subtitle">
            Install once. Inspect anytime. Clean in seconds — no cutting required.
          </p>

          <div className="mini-product-how-it-works-steps mini-how-steps-pulse-grid">
            {howItWorksSteps.map((step, index) => {
              const pulseOffset =
                reduceMotion || howStepPulseCount <= 1
                  ? undefined
                  : (index - miniHowPulse + howStepPulseCount) % howStepPulseCount

              return (
              // Staggered viewport reveal + sequential spotlight (pulseOffset 0 = “current” beat).
              <motion.div
                key={step.title}
                className="mini-product-how-it-works-step mini-how-step-slot mini-how-step-card"
                data-mini-how-step-pulse={pulseOffset}
                initial="hidden"
                whileInView="visible"
                viewport={mhViewport}
                variants={miniHowStepsContainerVariants}
              >
                <div className="mini-how-step-num-anchor">
                  <motion.div
                    className="mini-how-step-num-disk"
                    variants={miniHowStepBadgeVariants}
                  >
                    {step.number}
                  </motion.div>
                </div>
                <motion.div className="mini-how-step-icon-holder" variants={miniHowStepIconStageVariants}>
                  <step.icon className="product-how-it-works-step-icon mini-how-step-icon-svg" />
                </motion.div>
                <motion.h3
                  className="product-how-it-works-step-title"
                  variants={miniHowStepCopyVariants}
                >
                  {step.title}
                </motion.h3>
                <motion.p
                  className="product-how-it-works-step-description"
                  variants={miniHowStepCopyVariants}
                >
                  {step.description}
                </motion.p>
              </motion.div>
              )
            })}
          </div>

          {/* Written install guide — scroll reveal tuned to match topic cards */}
          <motion.div
            className="product-installation-video product-installation-video--guide-only"
            initial={reduceMotion ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(0.92, 0.12)}
          >
            <div className="product-installation-video-guide product-installation-video-guide--standalone">
              <p className="product-installation-video-guide-eyebrow">
                Installation resources
              </p>
              <p className="product-installation-video-guide-label">
                Open the full guide with photos and checkpoints for each stage.
              </p>
              <Link
                to="/mini-setup?step=1"
                className="product-installation-video-guide-link"
              >
                <BookOpenIcon className="product-installation-video-guide-link-lead-icon" aria-hidden />
                <span>Step-by-step installation guide</span>
                <ArrowRightIcon className="product-installation-video-guide-link-trail-icon" aria-hidden />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Step 8 — "Why the Mini" comparison strip (2026-05-01).
          Sits between How It Works and Specs as a small typographic comparison
          that names the alternative ("the old way") and the upgrade in plain
          contractor language. No imagery — purely typographic. The comparison
          format makes the value prop unmissable without adding a marketing
          tone (no superlatives, no exclamations, just "before vs after").

          Audience: contractor reading the page on behalf of their distributor
          channel. Each before/after row is a real moment in their workflow,
          not a feature bullet.

          To revert: delete this entire <section> block and the
          BEGIN/END MINI VS OLD block in src/index.css. */}
      <section ref={miniVsOldSectionRef} className="mini-vs-old" aria-labelledby="mini-vs-old-heading">
        <MiniFlowWaveBackdrop sectionRef={miniVsOldSectionRef} />
        <div className="mini-vs-old-inner">
          <motion.header
            className="mini-section-header"
            initial={reduceMotion ? false : { opacity: 0, y: 44 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(0.98)}
          >
            <p className="mini-section-eyebrow">Why the Mini</p>
            <h2
              id="mini-vs-old-heading"
              className="product-section-title mini-section-title-promote"
            >
              The old way vs. the Mini
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
              <p className="mini-vs-old-col-label">Without it</p>
              <ul className="mini-vs-old-list">
                <li>Cut and patch PVC like it&apos;s part of the tune-up</li>
                <li>Cure time is the hidden line item on the ticket</li>
                <li>Damage shows up before you get a fair shot at the clog</li>
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
              <p className="mini-vs-old-col-label">With the Mini</p>
              <ul className="mini-vs-old-list">
                <li>Service through the port—not through new joints</li>
                <li>Cut once at install. After that, you&apos;re just clearing.</li>
                <li>See level and buildup early; clear it on your terms</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================
          Specs + Compliance — combined section (Tier 1 content pass,
          2026-05-01). Merges what used to be two adjacent sections
          (Specifications + Code Compliant) into a single dark, hero-
          adjacent scene. The product photo lives on the left with
          length/height measurement callouts; specs + compliance data
          live on the right.

          Background uses the same blob palette as the hero, but with
          a flat (non-radial) base so there's no "center highlight" —
          per design direction.

          To revert this section back to two separate sections, restore
          MiniProductPage.tsx from
            .backups/tier1-content-<TIMESTAMP>/MiniProductPage.tsx.pre-tier1-content
          and remove the BEGIN/END SPECS+COMPLIANCE block in src/index.css.
          ============================================================ */}
      <section className="mini-specs-compliance" aria-labelledby="mini-specs-heading">
        {/* Mesh background — borrows hero's blob palette without the radial highlight */}
        <div className="mini-specs-compliance-mesh" aria-hidden>
          <div className="mini-specs-compliance-mesh-blob mini-specs-compliance-mesh-blob--a" />
          <div className="mini-specs-compliance-mesh-blob mini-specs-compliance-mesh-blob--b" />
          <div className="mini-specs-compliance-mesh-blob mini-specs-compliance-mesh-blob--c" />
          <div className="mini-specs-compliance-mesh-blob mini-specs-compliance-mesh-blob--d" />
          <div className="mini-specs-compliance-mesh-grid" />
        </div>

        <div className="mini-specs-compliance-inner">
          <motion.div
            className="mini-specs-compliance-header"
            initial={reduceMotion ? false : { opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(1)}
          >
            <p className="mini-specs-compliance-eyebrow">Specs &amp; compliance</p>
            <h2 id="mini-specs-heading" className="mini-specs-compliance-title">
              Built compact. Built to code.
            </h2>
            <p className="mini-specs-compliance-lede">
              Engineered to fit standard 3/4&quot; PVC condensate lines and to meet
              International Mechanical Code requirements for maintenance access.
            </p>
          </motion.div>

          <div className="mini-specs-compliance-grid">
            {/* Step 7 motion variation (2026-05-01): Specs columns now slide
                from opposite sides (image from left, data from right) instead
                of both fade-up. Reads as the spec sheet being laid out in
                front of you and gives Specs its own motion signature. */}
            <motion.div
              className="mini-specs-compliance-visual"
              initial={reduceMotion ? false : { opacity: 0, x: -56 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={mhViewport}
              transition={tr(1.12)}
            >
              <div className="mini-specs-compliance-image-wrap">
                <div className="mini-specs-compliance-image-frame">
                  <picture>
                    <img
                      src="/images/acdw-mini-hero-product-mobile.png"
                      alt={`AC Drain Wiz Mini T-manifold on 3/4 inch PVC condensate line; callouts show length ${MINI_MANIFOLD_LENGTH.replace(/"/g, '')} inches and height ${MINI_MANIFOLD_HEIGHT_TO_PORT.replace(/"/g, '')} inches to the top of the vertical port opening`}
                      className="mini-specs-compliance-image"
                      width={1200}
                      height={1200}
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>

                  {/* Height: spans clear T only — top tick at vertical port rim; orange valve sits above (excluded). */}
                  <div
                    className="mini-specs-compliance-measurement mini-specs-compliance-measurement--height"
                    aria-hidden
                  >
                    <span className="mini-specs-compliance-measurement-tick mini-specs-compliance-measurement-tick--start" />
                    <span className="mini-specs-compliance-measurement-line" />
                    <span className="mini-specs-compliance-measurement-tick mini-specs-compliance-measurement-tick--end" />
                    <span className="mini-specs-compliance-measurement-label">
                      <span className="mini-specs-compliance-measurement-label-key">Height</span>
                      <span className="mini-specs-compliance-measurement-label-value">{MINI_MANIFOLD_HEIGHT_TO_PORT}</span>
                    </span>
                  </div>
                </div>

                {/* Length measurement (horizontal) */}
                <div
                  className="mini-specs-compliance-measurement mini-specs-compliance-measurement--length"
                  aria-hidden
                >
                  <span className="mini-specs-compliance-measurement-tick mini-specs-compliance-measurement-tick--start" />
                  <span className="mini-specs-compliance-measurement-line" />
                  <span className="mini-specs-compliance-measurement-tick mini-specs-compliance-measurement-tick--end" />
                  <span className="mini-specs-compliance-measurement-label">
                    <span className="mini-specs-compliance-measurement-label-key">Length</span>
                    <span className="mini-specs-compliance-measurement-label-value">{MINI_MANIFOLD_LENGTH}</span>
                  </span>
                </div>
              </div>
              <p className="mini-specs-compliance-visual-caption">
                Length {MINI_MANIFOLD_LENGTH}. Height {MINI_MANIFOLD_HEIGHT_TO_PORT} to the top of the T-manifold vertical port opening.
                Approximate for reference. Fits standard 3/4&quot; PVC drain lines.
              </p>
            </motion.div>

            <motion.div
              className="mini-specs-compliance-data"
              initial={reduceMotion ? false : { opacity: 0, x: 56 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={mhViewport}
              transition={tr(1.12, 0.12)}
            >
              <h3 className="mini-specs-compliance-block-title">Specifications</h3>
              <dl className="mini-specs-compliance-specs">
                {specifications.map((spec, index) => (
                  <div key={index} className="mini-specs-compliance-spec-row">
                    <dt className="mini-specs-compliance-spec-label">{spec.label}</dt>
                    <dd className="mini-specs-compliance-spec-value">{spec.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mini-specs-compliance-divider" aria-hidden />

              <h3 className="mini-specs-compliance-block-title">Code compliance</h3>
              <p className="mini-specs-compliance-codes-lede">
                Meets International Mechanical Code (IMC) standards and is approved for use
                in municipalities nationwide.
              </p>
              <div className="mini-specs-compliance-codes">
                {complianceCodes.map((code, index) => (
                  <div key={index} className="mini-specs-compliance-code-badge">
                    <ShieldCheckIcon className="mini-specs-compliance-code-badge-icon" aria-hidden />
                    <span>{code}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section
          Tier 1 content pass (2026-05-01): converted from a single-card carousel
          to a 2-up grid that shows all four testimonials at once. Removes
          previous/next buttons, indicator dots, and the currentTestimonial state.
          Step 2 visual redesign (2026-05-01): replaced the carousel-era card
          chrome (shadow-lg / primary left border / centered headshot / 5-star
          strip) with an editorial pull-quote layout — large quote-mark glyph,
          heavier non-italic body, initials-circle avatar in the byline, role
          tint (contractor = primary blue, homeowner = neutral). The wrapper
          class flipped from `--grid` to `--editorial`; corresponding CSS lives
          in src/index.css under "BEGIN MINI TESTIMONIALS EDITORIAL". */}
      <section className="mini-product-testimonials">
        <div className="mini-product-testimonials-content">
          <motion.header
            className="mini-section-header"
            initial={reduceMotion ? false : { opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(1)}
          >
            <p className="mini-section-eyebrow">From the field</p>
            <h2 className="product-section-title mini-section-title-promote">
              Real installs. Real results.
            </h2>
          </motion.header>

          <div className="mini-product-testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="mini-product-testimonial-card mini-product-testimonial-card--editorial"
                initial={reduceMotion ? false : { opacity: 0, x: index % 2 === 0 ? -42 : 42, y: 28 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={mhViewport}
                transition={tr(1.02, (index >> 1) * 0.18)}
              >
                <span className="mini-product-testimonial-quote-mark" aria-hidden>“</span>
                <p className="mini-product-testimonial-text">{testimonial.text}</p>
                <div className="mini-product-testimonial-author">
                  <span
                    className={`mini-product-testimonial-avatar mini-product-testimonial-avatar--${testimonial.roleType}`}
                    aria-hidden
                  >
                    {testimonial.initials}
                  </span>
                  <span className="mini-product-testimonial-author-meta">
                    <span className="mini-product-testimonial-name">{testimonial.name}</span>
                    <span className="mini-product-testimonial-role">{testimonial.role}</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section
          Tier 1 content pass (2026-05-01): added .mini-product-faq wrapper
          class to scope a tighter, chromeless accordion treatment to the
          Mini page only. The Sensor and Combo product pages keep the
          original card-style FAQ via the shared .product-faq-* classes.
          See "BEGIN MINI FAQ" block in src/index.css. */}
      <section className="product-faq mini-product-faq">
        <div className="product-faq-content">
          <motion.header
            className="mini-section-header"
            initial={reduceMotion ? false : { opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(1)}
          >
            <p className="mini-section-eyebrow">Need-to-know</p>
            <h2 className="product-section-title mini-section-title-promote">
              Questions contractors ask first
            </h2>
          </motion.header>
          <div className="product-faq-list">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="product-faq-item"
                initial={reduceMotion ? false : { opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={mhViewport}
                transition={tr(0.72, Math.min(index, 8) * 0.09)}
              >
                <button
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
            <Link
              to={buildProductSupportHubHref('mini')}
              className="product-faq-contact-link"
            >
              Browse Product Support FAQs
            </Link>
          </p>
        </div>
      </section>

      {/* Purchase / CTA — relocated to bottom (Tier 1 content pass, 2026-05-01).
          Previously sat directly under the hero, which buried How It Works and
          Specs deeper than they should be. Now serves as the closing call-to-
          action after the user has seen the product, the install flow, the
          specs, social proof, and FAQ.

          Copy tightened: H2 "Get started" → "Talk to our team" (more decisive
          and accurate to the contact-driven sales mechanic).

          Step 6 CTA-hierarchy fix (2026-05-01):
          - Kicker "Pricing & availability" → "How to buy". The old kicker
            promised something the section can't deliver (no online checkout,
            no public price), and the new FAQ entry #4 explicitly says so.
            "How to buy" is honest and matches the body.
          - Desktop phone badge converted from a passive <div> to an <a
            href="tel:...">, styled via the new
            .sensor-product-phone-badge--clickable modifier so it's a real
            primary CTA on every viewport (was: clickable on mobile, passive
            info on desktop — broken hierarchy).
          - Body copy mentions distributors explicitly (audience pivot
            confirmed by the user — primary buyer is the distributor and the
            contractor they sell to).
          - Trust badges tightened: "2-year warranty" → "Manufacturer
            warranty" (we don't claim a specific term on this page); "Fast
            shipping" → "Ships in 1–2 days" (matches the FAQ language). */}
      <section ref={miniPurchaseCtaSectionRef} className="mini-purchase-cta-band" aria-labelledby="mini-purchase-heading">
        <MiniFlowWaveBackdrop sectionRef={miniPurchaseCtaSectionRef} />
        <div className="mini-purchase-cta-inner">
          <motion.div
            className="mini-purchase-cta-reveal"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 32 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={mhViewport}
            transition={tr(1.05)}
          >
            <p className="mini-purchase-cta-kicker">How to buy</p>
            <div className="mini-purchase-cta-card">
              <div className="mini-product-purchase-card-content">
                <h2 id="mini-purchase-heading" className="sensor-product-purchase-title">
                  Talk to our team
                </h2>

                <div className="sensor-product-purchase-cta-section">
                  <p className="sensor-product-purchase-message">
                    Distributors, contractors, and property managers — talk to sales for
                    current pricing, availability, ship dates, and volume terms.
                  </p>

                  <a
                    href={SUPPORT_CONTACT.telHref}
                    className="sensor-product-purchase-button-primary md:hidden"
                  >
                    Call {SUPPORT_CONTACT.phoneDisplay}
                  </a>

                  <a
                    href={SUPPORT_CONTACT.telHref}
                    className="sensor-product-phone-badge sensor-product-phone-badge--clickable hidden md:flex"
                    aria-label={`Call sales at ${SUPPORT_CONTACT.phoneDisplay}`}
                  >
                    <PhoneIcon className="sensor-product-phone-badge-icon" aria-hidden />
                    <div className="sensor-product-phone-badge-text">
                      <div className="sensor-product-phone-vanity">{SUPPORT_CONTACT.phoneDisplay}</div>
                      <div className="sensor-product-phone-numeric">{SUPPORT_CONTACT.phoneNumeric}</div>
                    </div>
                  </a>

                  <button
                    type="button"
                    onClick={() => navigate('/contact?type=sales')}
                    className="sensor-product-purchase-button-secondary"
                  >
                    Contact sales
                  </button>
                </div>

                <div className="sensor-product-trust-section-inline">
                  <div className="sensor-product-trust-badge">
                    <ShieldCheckIcon className="sensor-product-trust-icon" aria-hidden />
                    <span>Manufacturer warranty</span>
                  </div>
                  <div className="sensor-product-trust-badge">
                    <CheckIcon className="sensor-product-trust-icon" aria-hidden />
                    <span>Ships in 1–2 days</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Image Gallery Section */}
          {/* <section className="mini-product-gallery">
        <div className="mini-product-gallery-content">
          <h2 className="product-section-title">See It In Action</h2>
          <div className="mini-product-gallery-grid">
            {productImages.map((image, index) => (
              <div
                key={index}
                className="mini-product-gallery-item"
              >
                <img
                  src={image}
                  alt={`AC Drain Wiz Mini - View ${index + 1}`}
                  className="mini-product-gallery-image"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </section> */}

    </div>
  )
}

