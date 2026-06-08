import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  ClipboardDocumentCheckIcon,
  GiftIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import { HeroFloatTrashDunk } from '@/components/campaign/HeroFloatTrashDunk'
import { StorySubmissionForm } from '@/components/campaign/StorySubmissionForm'
import {
  TtfSubmissionReentryModal,
  TtfSubmissionSuccessPanel,
} from '@/components/campaign/TtfSubmissionPostEntry'
import { TtfConfettiRain } from '@/components/campaign/TtfConfettiRain'
import { TtfPageMeshBackdrop } from '@/components/campaign/TtfPageMeshBackdrop'
import {
  TtfReveal,
  TtfRevealGroup,
  TtfRevealItem,
  TTF_PRIZE_HEADER_VIEWPORT,
} from '@/components/campaign/TtfScrollReveal'
import { TtfOfficialRulesSection } from '@/components/campaign/TtfOfficialRulesSection'
import { TtfStickyMobileCta } from '@/components/campaign/TtfStickyMobileCta'
import { TtfStorySpotlightCard } from '@/components/campaign/TtfStorySpotlightCard'
import { useCountUp } from '@/components/campaign/useCountUp'
import { SUPPORT_CONTACT } from '@/config/acdwKnowledge'
import { TtfHashLink } from '@/components/campaign/TtfHashLink'
import { TtfOfficialRulesLink } from '@/components/campaign/TtfOfficialRulesLink'
import { TRASH_THE_FLOAT } from '@/config/trashTheFloatCopy'
import { scrollToHashTargetWithRetries } from '@/utils/scrollToHashTarget'
import { cn } from '@/lib/utils'

/**
 * Campaign landing page: /trash-the-float
 *
 * Backend integrations (partial — see submitTrashTheFloatStory + trashTheFloatCampaignApi):
 *  - Story submission → validate-form-submission (GHL mapping TODO)
 *  - Live submission count (counter strip) — API stub
 *  - Approved story gallery (Hall of Fame) — API stub
 *  - Monthly winner videos — API stub
 */
export function TrashTheFloatPage() {
  const { hash } = useLocation()

  // Scroll to an in-page anchor when the hash changes (including same-page hash links).
  useEffect(() => {
    if (!hash) return
    const id = hash.replace(/^#/, '')
    if (!id) return
    scrollToHashTargetWithRetries(id)
  }, [hash])

  return (
    <div className="ttf-page">
      <Hero />
      <CounterStrip />
      <PrizeSection />
      <HowItWorksSection />
      <SubmissionSection />
      <FaqSection />
      <HallOfShameSection />
      <WinnersSection />
      <TtfOfficialRulesSection />
      <LegalSection />
      <TtfStickyMobileCta />
    </div>
  )
}

function Hero() {
  const { overlay, landing, leftCard, rightCard } = TRASH_THE_FLOAT
  const { floatSwitchTrans, sensorOnManifold, ipadPrize, instagramIcon } = TRASH_THE_FLOAT.images
  const { floatSwitchAlt, sensorOnManifoldAlt, versusAriaLabel } = landing.heroVisuals

  return (
    <section className="ttf-page-hero ttf-page-hero--load" aria-labelledby="ttf-page-hero-heading">
      <TtfPageMeshBackdrop variant="hero" />
      <div aria-hidden className="ttf-page-grain" />
      <div aria-hidden className="ttf-page-hero-accent-rule" />

      <div className="ttf-page-hero-content">
        <div className="ttf-page-hero-flair" aria-hidden="true">
          <div className="ttf-page-hero-flair-accent-col ttf-page-hero-flair-accent-col--drawings">
            <div className="ttf-page-hero-flair-accent-float ttf-page-hero-flair-accent-float--drawings">
              <img
                src={instagramIcon}
                alt=""
                className="ttf-page-hero-flair-instagram"
                width={128}
                height={128}
                decoding="async"
                draggable={false}
              />
              <span className="ttf-page-hero-flair-pill ttf-page-hero-flair-pill--left">
                {landing.heroFlair.monthlyDrawingsPill}
              </span>
            </div>
          </div>
          <div className="ttf-page-hero-flair-accent-col ttf-page-hero-flair-accent-col--prize">
            <div className="ttf-page-hero-flair-spotlight" aria-hidden />
            <div className="ttf-page-hero-flair-accent-float ttf-page-hero-flair-accent-float--prize">
              <img
                src={ipadPrize}
                alt=""
                className="ttf-page-hero-flair-ipad"
                width={192}
                height={192}
                decoding="async"
                draggable={false}
              />
              <span className="ttf-page-hero-flair-pill ttf-page-hero-flair-pill--right">
                {landing.heroFlair.monthlyIpadsPill}
              </span>
            </div>
          </div>
        </div>

        <p className="ttf-page-hero-reveal ttf-page-hero-reveal--1">
          <span className="campaign-eyebrow">{landing.heroEyebrow}</span>
        </p>

        <h1 id="ttf-page-hero-heading" className="ttf-page-hero-headline">
          <span className="ttf-page-hero-headline-lead ttf-page-hero-reveal ttf-page-hero-reveal--2">
            {overlay.headlineLeadBefore}
            <span className="ttf-page-hero-float-word">{overlay.headlineLeadFloat}</span>
            {overlay.headlineLeadAfter}
          </span>
          <span className="ttf-page-hero-headline-punch ttf-page-hero-reveal ttf-page-hero-reveal--3">
            {overlay.headlinePunchBefore}
            <span className="campaign-highlight ttf-page-hero-goat">{overlay.headlinePunchHighlight}</span>
          </span>
        </h1>

        <div
          className="ttf-page-hero-versus ttf-page-hero-reveal ttf-page-hero-reveal--4"
          role="group"
          aria-label={versusAriaLabel}
        >
          <div className="ttf-page-hero-sensor-glow" aria-hidden />
          <div className="ttf-page-hero-sensor-podium">
            <img
              src={sensorOnManifold}
              alt={sensorOnManifoldAlt}
              className="ttf-page-hero-sensor-img"
              width={672}
              height={672}
              decoding="async"
              draggable={false}
            />
            <div className="ttf-page-hero-sensor-labels">
              <span className="ttf-page-hero-versus-badge ttf-page-hero-versus-badge--smart">
                {rightCard.badge}
              </span>
              <p className="ttf-page-hero-versus-caption ttf-page-hero-versus-caption--smart">
                {rightCard.title}
              </p>
            </div>
          </div>

          <div className="ttf-page-hero-versus-foreground">
            <div className="ttf-page-hero-versus-side ttf-page-hero-versus-side--old">
              <HeroFloatTrashDunk floatSrc={floatSwitchTrans} floatAlt={floatSwitchAlt} />
              <p className="ttf-page-hero-versus-caption">{leftCard.title}</p>
            </div>

            <div className="ttf-page-hero-versus-arrow" aria-hidden>
              <ArrowRightIcon className="ttf-page-hero-versus-arrow-icon" />
            </div>
          </div>
        </div>

        <p className="ttf-page-hero-sub ttf-page-hero-reveal ttf-page-hero-reveal--6">
          {landing.heroSub}
        </p>

        <div
          id="ttf-hero-cta-sentinel"
          className="ttf-page-hero-cta-row ttf-page-hero-reveal ttf-page-hero-reveal--7"
        >
          <a
            href={landing.heroCtaPrimary.href}
            className="campaign-cta-primary gap-2 rounded-xl px-6 py-3 text-sm sm:text-base"
          >
            {landing.heroCtaPrimary.label}
            <ArrowRightIcon className="h-4 w-4" aria-hidden />
          </a>
        </div>

        <div
          id="comparison"
          className="ttf-page-hero-versus-table-wrap ttf-page-hero-reveal ttf-page-hero-reveal--5 scroll-mt-24"
        >
          <p className="ttf-page-hero-versus-label">
            {landing.comparisonIntro.eyebrow}
          </p>
          <div className="ttf-page-hero-versus-table">
            <div className="ttf-page-hero-versus-col ttf-page-hero-versus-col--old">
              <h3 className="ttf-page-hero-versus-col-title">{leftCard.title}</h3>
              <ul className="ttf-page-hero-versus-col-bullets">
                {leftCard.bullets.map((bullet) => (
                  <li key={bullet.text} className="ttf-page-hero-versus-col-bullet">
                    <XCircleIcon
                      aria-hidden
                      className="ttf-page-hero-versus-col-icon ttf-page-hero-versus-col-icon--old"
                    />
                    <span>{bullet.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="ttf-page-hero-versus-col ttf-page-hero-versus-col--smart">
              <h3 className="ttf-page-hero-versus-col-title">{rightCard.title}</h3>
              <ul className="ttf-page-hero-versus-col-bullets">
                {rightCard.bullets.map((bullet) => (
                  <li key={bullet.text} className="ttf-page-hero-versus-col-bullet">
                    <CheckCircleIcon
                      aria-hidden
                      className="ttf-page-hero-versus-col-icon ttf-page-hero-versus-col-icon--smart"
                    />
                    <span>{bullet.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CounterStrip() {
  // TODO: replace TRASH_THE_FLOAT.storiesCount with a live count once the API is available.
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const showCount =
    TRASH_THE_FLOAT.storiesCount >= TRASH_THE_FLOAT.storiesCountMinDisplay
  const animatedCount = useCountUp(TRASH_THE_FLOAT.storiesCount, inView && showCount)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setInView(true)
      },
      { threshold: 0.35 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="Campaign status"
      className="ttf-page-counter-strip"
    >
      <TtfReveal>
        <div className="ttf-page-counter-inner">
          <span className="ttf-page-counter-live">
            <span className="ttf-page-pulse" />
            Campaign live
          </span>
          {showCount ? (
            <>
              <span className="ttf-page-counter-divider hidden sm:inline" aria-hidden>
                •
              </span>
              <span className="ttf-page-counter-stat" aria-live="polite">
                <span className="ttf-page-counter-number">{animatedCount.toLocaleString()}</span>
                <span className="ttf-page-counter-suffix">
                  {TRASH_THE_FLOAT.landing.counterLabelSuffix}
                </span>
              </span>
            </>
          ) : null}
        </div>
      </TtfReveal>
    </section>
  )
}

function PrizeSection() {
  const { prize } = TRASH_THE_FLOAT.landing
  const ipadPrize = TRASH_THE_FLOAT.images.ipadPrize
  const ipadPrizeAlt = TRASH_THE_FLOAT.overlay.ipadPrizeAlt
  const stageRef = useRef<HTMLDivElement>(null)
  const ipadRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const prizeShowcaseReveal = useMemo(
    () => ({
      hidden: { opacity: 0, y: reduceMotion ? 0 : 22 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: reduceMotion ? 0.15 : 0.52,
          ease: [0.22, 1, 0.36, 1] as const,
          delay: reduceMotion ? 0 : 0.42,
        },
      },
    }),
    [reduceMotion],
  )

  // Cursor-tracked 3D tilt (skipped under prefers-reduced-motion via media query check below)
  useEffect(() => {
    const stage = stageRef.current
    const ipad = ipadRef.current
    if (!stage || !ipad) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const onMove = (e: MouseEvent) => {
      const rect = stage.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / (rect.width / 2)
      const dy = (e.clientY - cy) / (rect.height / 2)
      const maxTilt = 6
      ipad.style.setProperty('--ttf-tilt-x', `${(-dy * maxTilt).toFixed(2)}deg`)
      ipad.style.setProperty('--ttf-tilt-y', `${(dx * maxTilt).toFixed(2)}deg`)
    }
    const onLeave = () => {
      ipad.style.setProperty('--ttf-tilt-x', '0deg')
      ipad.style.setProperty('--ttf-tilt-y', '0deg')
    }
    stage.addEventListener('mousemove', onMove)
    stage.addEventListener('mouseleave', onLeave)
    return () => {
      stage.removeEventListener('mousemove', onMove)
      stage.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <section
      id="prize"
      aria-labelledby="ttf-prize-heading"
      className="ttf-page-section ttf-page-section--prize scroll-mt-24"
    >
      <TtfPageMeshBackdrop variant="prize" />
      <TtfConfettiRain
        className="ttf-page-prize-confetti"
        animBaseVar="--ttf-prize-anim-base"
        continuous
        options={{
          count: 52,
          prizeStartS: 0,
          spawnWindowS: 12,
          seedOffset: 1200,
          durationMinS: 5,
          durationMaxS: 8.5,
        }}
      />

      <div className="ttf-page-section-inner ttf-page-section-inner--center">
        <TtfReveal viewport={TTF_PRIZE_HEADER_VIEWPORT}>
          <p className="ttf-page-eyebrow ttf-page-eyebrow--light">{prize.eyebrow}</p>
          <h2
            id="ttf-prize-heading"
            className="ttf-page-section-heading ttf-page-section-heading--light ttf-page-prize-heading"
          >
            {prize.title}
          </h2>
        </TtfReveal>

        <TtfReveal viewport={TTF_PRIZE_HEADER_VIEWPORT} variants={prizeShowcaseReveal}>
          <div className="ttf-page-prize-showcase">
            <div ref={stageRef} className="ttf-page-prize-stage" aria-hidden={false}>
              <div className="ttf-page-prize-spotlight" aria-hidden />
              <div className="ttf-page-prize-sparkles" aria-hidden>
                <span className="ttf-page-prize-sparkle ttf-page-prize-sparkle--1" />
                <span className="ttf-page-prize-sparkle ttf-page-prize-sparkle--2" />
                <span className="ttf-page-prize-sparkle ttf-page-prize-sparkle--3" />
                <span className="ttf-page-prize-sparkle ttf-page-prize-sparkle--4" />
                <span className="ttf-page-prize-sparkle ttf-page-prize-sparkle--5" />
              </div>

              <div ref={ipadRef} className="ttf-page-prize-ipad-wrap">
                <img
                  src={ipadPrize}
                  alt={ipadPrizeAlt}
                  className="ttf-page-prize-ipad"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </div>
            </div>

            <ul className="ttf-page-prize-chips" aria-label="Prize details">
              {prize.chips.map((chip, idx) => (
                <li
                  key={chip.label}
                  className={`ttf-page-prize-chip ttf-page-prize-chip--${idx + 1}`}
                >
                  <span className="ttf-page-prize-chip-label">{chip.label}</span>
                  <span className="ttf-page-prize-chip-detail">{chip.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </TtfReveal>

        <TtfReveal>
          <p className="ttf-page-prize-body">{prize.body}</p>
          <p className="ttf-page-prize-legal">
            No purchase necessary where applicable. See{' '}
            <TtfOfficialRulesLink className="ttf-page-legal-link" /> for eligibility.
          </p>

          <div className="ttf-page-prize-cta-row">
            <a
              href={prize.ctaHref}
              className="campaign-cta-primary gap-2 rounded-xl px-6 py-3 text-sm sm:text-base"
            >
              {prize.ctaLabel}
              <ArrowRightIcon className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </TtfReveal>
      </div>
    </section>
  )
}

const HOW_IT_WORKS_STEP_ICONS = [
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
  GiftIcon,
] as const

/** Shared mesh + grain for lower-page sections (below prize). */
function TtfSectionAtmosphere({ tone }: { tone: 'how' | 'submit' | 'faq' | 'gallery' | 'winners' | 'legal' }) {
  return (
    <>
      <TtfPageMeshBackdrop variant="section" className={`ttf-page-mesh--atmo-${tone}`} />
      <div aria-hidden className="ttf-page-section-grain" />
    </>
  )
}

function HowItWorksSection() {
  const { howItWorks } = TRASH_THE_FLOAT.landing
  const { eyebrow, title, body, steps, cta } = howItWorks

  return (
    <section
      id="how-it-works"
      aria-labelledby="ttf-how-it-works-heading"
      className="ttf-page-section ttf-page-section--band ttf-page-section--atmo-how scroll-mt-24"
    >
      <TtfSectionAtmosphere tone="how" />
      <div className="ttf-page-section-inner">
        <TtfReveal>
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            body={body}
            tone="light"
            headingId="ttf-how-it-works-heading"
          />
        </TtfReveal>

        <TtfRevealGroup as="ol" className="ttf-page-how-steps">
          {steps.flatMap((step, idx) => {
            const Icon = HOW_IT_WORKS_STEP_ICONS[idx] ?? ChatBubbleLeftRightIcon
            const stepNum = String(idx + 1).padStart(2, '0')

            const stepItem = (
              <TtfRevealItem as="li" key={step.title} className="ttf-page-how-step">
                <div className="ttf-page-how-step-card campaign-card-light">
                  <div className="ttf-page-how-step-top">
                    <span className="ttf-page-how-step-num" aria-hidden>
                      {stepNum}
                    </span>
                    <span className="ttf-page-how-step-icon-wrap" aria-hidden>
                      <Icon className="ttf-page-how-step-icon" />
                    </span>
                  </div>
                  <h3 className="ttf-page-how-step-title">{step.title}</h3>
                  <p className="ttf-page-how-step-body">{step.body}</p>
                </div>
              </TtfRevealItem>
            )

            if (idx >= steps.length - 1) return [stepItem]

            return [
              stepItem,
              <li key={`${step.title}-connector`} className="ttf-page-how-step-connector" aria-hidden>
                <ArrowRightIcon className="ttf-page-how-step-connector-icon" />
              </li>,
            ]
          })}
        </TtfRevealGroup>

        <TtfReveal>
          <div className="ttf-page-how-cta-row">
            <a
              href={cta.href}
              className="campaign-cta-primary gap-2 rounded-xl px-6 py-3 text-sm sm:text-base"
            >
              {cta.label}
              <ArrowRightIcon className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </TtfReveal>
      </div>
    </section>
  )
}

function FaqSection() {
  const { faq } = TRASH_THE_FLOAT.landing
  const { eyebrow, title, body, eligibilityTitle, eligibilityItems, items, footerNote } = faq

  return (
    <section
      id="faq"
      aria-labelledby="ttf-faq-heading"
      className="ttf-page-section ttf-page-section--tint ttf-page-section--atmo-faq scroll-mt-24"
    >
      <TtfSectionAtmosphere tone="faq" />
      <div className="ttf-page-section-inner ttf-page-section-inner--narrow">
        <TtfReveal>
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            body={body}
            tone="light"
            headingId="ttf-faq-heading"
          />
        </TtfReveal>

        <TtfReveal>
          <div className="ttf-page-faq-eligibility campaign-card-light">
            <h3 className="ttf-page-faq-eligibility-title">{eligibilityTitle}</h3>
            <ul className="ttf-page-faq-eligibility-list">
              {eligibilityItems.map((item) => (
                <li key={item.label} className="ttf-page-faq-eligibility-item">
                  <span className="ttf-page-faq-eligibility-label">{item.label}</span>
                  <span className="ttf-page-faq-eligibility-detail">{item.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </TtfReveal>

        <TtfRevealGroup className="ttf-page-faq-list">
          {items.map((item) => (
            <TtfRevealItem key={item.question}>
              <details className="ttf-page-faq-item campaign-card-light">
                <summary className="ttf-page-faq-question">
                  <span className="ttf-page-faq-question-text">{item.question}</span>
                  <ChevronDownIcon className="ttf-page-faq-chevron" aria-hidden />
                </summary>
                <div className="ttf-page-faq-answer">
                  <p>{item.answer}</p>
                </div>
              </details>
            </TtfRevealItem>
          ))}
        </TtfRevealGroup>

        <TtfReveal>
          <p className="ttf-page-faq-footer">
            {footerNote}{' '}
            <a href={`mailto:${SUPPORT_CONTACT.supportEmail}`} className="ttf-page-faq-footer-link">
              {SUPPORT_CONTACT.supportEmail}
            </a>
            . See also{' '}
            <TtfOfficialRulesLink className="ttf-page-faq-footer-link" />
            ,{' '}
            <Link to="/privacy-policy" className="ttf-page-faq-footer-link">
              Privacy Policy
            </Link>
            , and{' '}
            <TtfHashLink hash="#legal" className="ttf-page-faq-footer-link">
              important notes
            </TtfHashLink>{' '}
            below.
          </p>
        </TtfReveal>
      </div>
    </section>
  )
}

function SectionHeader({
  eyebrow,
  title,
  body,
  tone = 'dark',
  headingId,
}: {
  eyebrow: string
  title: string
  body?: string
  tone?: 'dark' | 'light'
  headingId?: string
}) {
  return (
    <header className="ttf-page-section-header">
      <p className={tone === 'light' ? 'ttf-page-eyebrow ttf-page-eyebrow--light' : 'ttf-page-eyebrow'}>
        {eyebrow}
      </p>
      <h2
        id={headingId}
        className={
          tone === 'light' ? 'ttf-page-section-heading ttf-page-section-heading--light' : 'ttf-page-section-heading'
        }
      >
        {title}
      </h2>
      {body ? (
        <p
          className={
            tone === 'light' ? 'ttf-page-section-body ttf-page-section-body--light' : 'ttf-page-section-body'
          }
        >
          {body}
        </p>
      ) : null}
    </header>
  )
}

function SubmissionSection() {
  type SubmissionPhase = 'entry' | 'success'

  const {
    sectionEyebrows,
    submissionTitle,
    submissionIntro,
    submissionReassurance,
    moderationNote,
    sectionSuccess,
  } = TRASH_THE_FLOAT.landing

  const [phase, setPhase] = useState<SubmissionPhase>('entry')
  const [reentryModalOpen, setReentryModalOpen] = useState(false)
  const [usedInstagramHandles, setUsedInstagramHandles] = useState<string[]>([])
  const successRegionRef = useRef<HTMLDivElement>(null)
  const entryRegionRef = useRef<HTMLDivElement>(null)

  const isFormReentry = usedInstagramHandles.length > 0

  useEffect(() => {
    if (phase !== 'success') return

    const el = successRegionRef.current
    if (!el) return

    window.requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      el.focus({ preventScroll: true })
    })
  }, [phase])

  const handleSubmitSuccess = (instagramHandle: string) => {
    setUsedInstagramHandles((current) =>
      current.includes(instagramHandle) ? current : [...current, instagramHandle],
    )
    setPhase('success')
  }

  const handleReentryContinue = () => {
    setReentryModalOpen(false)
    setPhase('entry')
    window.requestAnimationFrame(() => {
      entryRegionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      entryRegionRef.current?.focus({ preventScroll: true })
    })
  }

  const entryHeader = (
    <>
      <SectionHeader
        eyebrow={sectionEyebrows.submission}
        title={submissionTitle}
        body={submissionIntro}
        tone="light"
        headingId={isFormReentry ? 'ttf-submit-reentry-heading' : undefined}
      />
      <p className="ttf-page-submission-reassurance">{submissionReassurance}</p>
    </>
  )

  return (
    <section
      id="submit-story"
      className={cn(
        'ttf-page-section ttf-page-section--submission ttf-page-section--atmo-submit scroll-mt-24',
        phase === 'success' && 'ttf-page-section--submission-success',
      )}
    >
      <TtfSectionAtmosphere tone="submit" />
      <div className="ttf-page-section-inner ttf-page-section-inner--narrow">
        {phase === 'entry' ? (
          <div
            ref={entryRegionRef}
            className="ttf-submission-entry-region scroll-mt-24"
            tabIndex={-1}
          >
            {isFormReentry ? entryHeader : <TtfReveal>{entryHeader}</TtfReveal>}

            <div className="mt-8">
              <StorySubmissionForm
                theme="light"
                usedInstagramHandles={usedInstagramHandles}
                showInstagramReuseHint={isFormReentry}
                onSuccess={handleSubmitSuccess}
              />
            </div>

            {isFormReentry ? (
              <p className="ttf-page-moderation-note">{moderationNote}</p>
            ) : (
              <TtfReveal>
                <p className="ttf-page-moderation-note">{moderationNote}</p>
              </TtfReveal>
            )}
          </div>
        ) : null}

        {phase === 'success' ? (
          <div
            ref={successRegionRef}
            className="ttf-submission-success-region scroll-mt-24"
            tabIndex={-1}
            role="status"
            aria-live="polite"
          >
            <SectionHeader
              eyebrow={sectionSuccess.eyebrow}
              title={sectionSuccess.title}
              body={sectionSuccess.lead}
              tone="light"
              headingId="ttf-submit-success-heading"
            />
            <div className="mt-8">
              <TtfSubmissionSuccessPanel onAnotherStory={() => setReentryModalOpen(true)} />
            </div>
          </div>
        ) : null}
      </div>

      <TtfSubmissionReentryModal
        open={reentryModalOpen}
        onContinue={handleReentryContinue}
        onCancel={() => setReentryModalOpen(false)}
      />
    </section>
  )
}

function HallOfShameSection() {
  const { sectionEyebrows, hallOfShame } = TRASH_THE_FLOAT.landing
  const { title, intro, previewStories } = hallOfShame

  return (
    <section id="story-spotlight" className="ttf-page-section ttf-page-section--surface ttf-page-section--atmo-gallery scroll-mt-24">
      <TtfSectionAtmosphere tone="gallery" />
      <div className="ttf-page-section-inner">
        <TtfReveal>
          <SectionHeader
            eyebrow={sectionEyebrows.hallOfShame}
            title={title}
            body={intro}
            tone="light"
          />
        </TtfReveal>

        <TtfRevealGroup className="ttf-page-shame-grid">
          {previewStories.map((story) => (
            <TtfRevealItem key={story.id} as="div">
              <TtfStorySpotlightCard story={story} />
            </TtfRevealItem>
          ))}
        </TtfRevealGroup>
      </div>
    </section>
  )
}

function WinnersSection() {
  const { sectionEyebrows, winners } = TRASH_THE_FLOAT.landing
  const { title, body, comingSoonLabel } = winners

  return (
    <section className="ttf-page-section ttf-page-section--tint ttf-page-section--atmo-winners scroll-mt-24">
      <TtfSectionAtmosphere tone="winners" />
      <div className="ttf-page-section-inner ttf-page-section-inner--narrow ttf-page-section-inner--center">
        <TtfReveal>
          <SectionHeader eyebrow={sectionEyebrows.winners} title={title} body={body} tone="light" />
        </TtfReveal>

        <TtfReveal>
          <div className="mx-auto mt-8 grid w-full max-w-md gap-3">
            <div className="ttf-page-winners-placeholder">{comingSoonLabel}</div>
          </div>
        </TtfReveal>
      </div>
    </section>
  )
}

function LegalSection() {
  const { title, productDisclaimer, contestNoteBefore, contestNoteAfter } = TRASH_THE_FLOAT.landing.legal
  return (
    <section id="legal" className="ttf-page-section ttf-page-section--legal ttf-page-section--atmo-legal scroll-mt-24">
      <TtfSectionAtmosphere tone="legal" />
      <TtfReveal>
        <div className="ttf-page-section-inner ttf-page-section-inner--narrow">
          <h2 className="ttf-page-legal-heading">{title}</h2>
          <p className="ttf-page-legal-line mt-3">{productDisclaimer}</p>
          <p className="ttf-page-legal-line mt-3">
            {contestNoteBefore}
            <TtfOfficialRulesLink className="ttf-page-legal-link" />
            {contestNoteAfter}
          </p>
          <p className="ttf-page-legal-links mt-4">
            <TtfOfficialRulesLink className="ttf-page-legal-link" />
            <span aria-hidden className="ttf-page-legal-links-sep">
              {' '}
              ·{' '}
            </span>
            <Link to="/privacy-policy" className="ttf-page-legal-link">
              Privacy Policy
            </Link>
            <span aria-hidden className="ttf-page-legal-links-sep">
              {' '}
              ·{' '}
            </span>
            <Link to="/terms-of-use" className="ttf-page-legal-link">
              Site Terms of Use
            </Link>
          </p>
        </div>
      </TtfReveal>
    </section>
  )
}
