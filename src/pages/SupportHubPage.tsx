import { useCallback, useEffect, useMemo, useState, type KeyboardEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  WrenchScrewdriverIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  BookOpenIcon,
  DocumentTextIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline'
import { MONITORING, SENSOR_SETUP_MODEL_CHOICE_HREF, SUPPORT_CONTACT } from '../config/acdwKnowledge'
import { SUPPORT_SEARCH_KIND_LABEL } from '../config/supportSearchIndex'
import { trackEvent } from '../hooks/useAnalytics'
import { highlightSearchTerms } from '../utils/supportSearchHighlight'
import {
  searchSupport,
  buildSupportSearchHref,
  getHighlightTermsForQuery,
} from '../utils/supportFaqSearch'
import { PageHeroMeshBackdrop } from '../components/layout/PageHeroMeshBackdrop'

const MIN_QUERY_LEN = 2
const SEARCH_ANALYTICS_DEBOUNCE_MS = 600
const LISTBOX_ID = 'support-hub-search-listbox'
const INPUT_ID = 'support-hub-search-input'

/** Below-hero hub content — animate into view once */
const hubScrollViewport = { once: true, amount: 0.2, margin: '0px 0px -10% 0px' } as const

export function SupportHubPage() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()

  const searchPanelEase = useMemo(() => [0.22, 1, 0.36, 1] as const, [])

  const hubStagger = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: {
          staggerChildren: reduceMotion ? 0 : 0.1,
          delayChildren: reduceMotion ? 0 : 0.05,
        },
      },
    }),
    [reduceMotion],
  )

  const hubFadeUp = useMemo(
    () =>
      reduceMotion
        ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.25 } } }
        : {
            hidden: { opacity: 0, y: 22 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.52, ease: searchPanelEase },
            },
          },
    [reduceMotion, searchPanelEase],
  )

  const hubFadeUpSnap = useMemo(
    () =>
      reduceMotion
        ? hubFadeUp
        : {
            hidden: { opacity: 0, y: 16 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.42, ease: searchPanelEase },
            },
          },
    [reduceMotion, hubFadeUp, searchPanelEase],
  )

  const searchPanelReveal = useMemo(
    () =>
      reduceMotion
        ? {
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.22 } },
            exit: { opacity: 0, transition: { duration: 0.15 } },
          }
        : {
            hidden: { opacity: 0, y: 14 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.38, ease: searchPanelEase },
            },
            exit: { opacity: 0, y: -8, transition: { duration: 0.24, ease: searchPanelEase } },
          },
    [reduceMotion, searchPanelEase],
  )

  const [query, setQuery] = useState('')
  const [activeResultIndex, setActiveResultIndex] = useState(-1)

  const trimmed = query.trim()
  const results = useMemo(() => {
    if (trimmed.length < MIN_QUERY_LEN) return []
    return searchSupport(trimmed)
  }, [trimmed])

  const showNoResults = trimmed.length >= MIN_QUERY_LEN && results.length === 0

  const highlightTerms = useMemo(
    () => (trimmed.length >= MIN_QUERY_LEN ? getHighlightTermsForQuery(trimmed) : []),
    [trimmed],
  )

  const hasResultList = results.length > 0 && trimmed.length >= MIN_QUERY_LEN

  useEffect(() => {
    setActiveResultIndex(-1)
  }, [trimmed])

  useEffect(() => {
    if (activeResultIndex < 0) return
    const el = document.getElementById(`support-search-option-${activeResultIndex}`)
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [activeResultIndex])

  useEffect(() => {
    if (trimmed.length < MIN_QUERY_LEN) return
    const timer = window.setTimeout(() => {
      trackEvent('support_search', {
        search_term: trimmed,
        result_count: results.length,
      })
    }, SEARCH_ANALYTICS_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [trimmed, results.length])

  const openResult = useCallback(
    (index: number) => {
      const hit = results[index]
      if (!hit) return
      const href = buildSupportSearchHref(hit.entry)
      if (href.startsWith('http://') || href.startsWith('https://')) {
        window.open(href, '_blank', 'noopener,noreferrer')
      } else {
        navigate(href)
      }
    },
    [navigate, results],
  )

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!hasResultList) return
    const n = results.length
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveResultIndex((i) => (i + 1) % n)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveResultIndex((i) => (i <= 0 ? n - 1 : i - 1))
    } else if (e.key === 'Escape') {
      setActiveResultIndex(-1)
    } else if (e.key === 'Enter' && activeResultIndex >= 0) {
      e.preventDefault()
      openResult(activeResultIndex)
    }
  }

  const statusMessage = useMemo(() => {
    if (trimmed.length < MIN_QUERY_LEN) return ''
    if (results.length === 0) return 'No results found.'
    return `${results.length} result${results.length === 1 ? '' : 's'} found.`
  }, [trimmed.length, results.length])

  return (
    <div className="support-hub-container">
      {/* Hero Banner — unchanged shared pattern with other hub pages */}
      <div className="support-hero">
        <PageHeroMeshBackdrop />
        <div className="support-hero-content">
          <div className="support-hero-header">
            <h1 className="support-hero-title">Support Center</h1>
            <p className="support-hero-subtitle">
              Find answers to common questions, installation guides, warranty information, and get the help you need.
            </p>
            <div className="support-hero-search" role="search">
              <p id="support-hub-search-desc" className="support-hero-search-scope">
                Search FAQs, guides, product pages, and other site pages. Use arrow keys to move results,
                Enter to open, Escape to clear highlight.
              </p>
              <div className="support-hero-search-wrapper">
                <MagnifyingGlassIcon className="support-hero-search-icon" aria-hidden />
                <input
                  id={INPUT_ID}
                  type="search"
                  name="support-faq-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search for help..."
                  className="support-hero-search-input"
                  aria-label="Search support center"
                  aria-describedby="support-hub-search-desc"
                  aria-autocomplete="list"
                  aria-controls={hasResultList ? LISTBOX_ID : undefined}
                  aria-expanded={hasResultList}
                  aria-activedescendant={
                    activeResultIndex >= 0 ? `support-search-option-${activeResultIndex}` : undefined
                  }
                  role="combobox"
                  autoComplete="off"
                />
              </div>
              <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                {statusMessage}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="support-hub-main container pb-16 pt-12 md:pb-24 md:pt-14">
        <AnimatePresence mode="sync">
          {(results.length > 0 || showNoResults) && (
            <motion.section
              key="support-hub-search-panel"
              className="support-hub-search-results mb-12 md:mb-16"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={searchPanelReveal}
            >
              {results.length > 0 && (
                <>
                  <h2 className="support-hub-search-results-heading" id={`${LISTBOX_ID}-label`}>
                    {results.length} result{results.length === 1 ? '' : 's'} for &ldquo;{trimmed}&rdquo;
                  </h2>
                  <ul
                    role="listbox"
                    id={LISTBOX_ID}
                    className="support-hub-search-results-list"
                    aria-labelledby={`${LISTBOX_ID}-label`}
                  >
                    {results.map(({ entry, snippet }, index) => {
                      const href = buildSupportSearchHref(entry)
                    const kindClass =
                      entry.kind === 'faq'
                        ? 'support-hub-search-result-kind support-hub-search-result-kind--faq'
                        : entry.kind === 'how-to'
                          ? 'support-hub-search-result-kind support-hub-search-result-kind--how-to'
                          : entry.kind === 'site'
                            ? 'support-hub-search-result-kind support-hub-search-result-kind--site'
                            : 'support-hub-search-result-kind support-hub-search-result-kind--product'
                    const external = href.startsWith('http://') || href.startsWith('https://')
                    const isActive = activeResultIndex === index
                    const cardClass = `support-hub-search-result-card${isActive ? ' support-hub-search-result-card--active' : ''}`

                    const cardInner = (
                      <>
                        <span className={kindClass}>{SUPPORT_SEARCH_KIND_LABEL[entry.kind]}</span>
                        <span className="support-hub-search-result-title">
                          {highlightSearchTerms(entry.title, highlightTerms)}
                        </span>
                        <span className="support-hub-search-result-snippet">
                          {highlightSearchTerms(snippet, highlightTerms)}
                        </span>
                      </>
                    )
                    return (
                      <li
                        key={entry.id}
                        role="option"
                        id={`support-search-option-${index}`}
                        aria-selected={isActive}
                      >
                        {external ? (
                          <a
                            href={href}
                            className={cardClass}
                            target="_blank"
                            rel="noopener noreferrer"
                            tabIndex={-1}
                          >
                            {cardInner}
                          </a>
                        ) : (
                          <Link to={href} className={cardClass} tabIndex={-1}>
                            {cardInner}
                          </Link>
                        )}
                      </li>
                    )
                  })}
                  </ul>
                </>
              )}
              {showNoResults && (
                <div className="support-hub-search-empty">
                  <h2 className="support-hub-search-results-heading">
                    No matches for &ldquo;{trimmed}&rdquo;
                  </h2>
                  <p className="support-hub-search-empty-text">
                    Try different keywords, browse the sections below, or reach out—we&apos;re happy to help.
                  </p>
                  <ul className="support-hub-search-empty-actions">
                    <li>
                      <a href={SUPPORT_CONTACT.telHref} className="support-hub-search-empty-link">
                        {SUPPORT_CONTACT.phoneDisplay}
                      </a>
                    </li>
                    <li>
                      <a href={`mailto:${SUPPORT_CONTACT.supportEmail}`} className="support-hub-search-empty-link">
                        {SUPPORT_CONTACT.supportEmail}
                      </a>
                    </li>
                    <li>
                      <Link to="/contact?type=support" className="support-hub-search-empty-link">
                        Contact form
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        <motion.section
          className="support-hub-cards-section"
          initial="hidden"
          whileInView="visible"
          viewport={hubScrollViewport}
          variants={hubStagger}
        >
          <motion.p className="support-hub-section-kicker" variants={hubFadeUpSnap}>
            Browse by topic
          </motion.p>
          <motion.h2 className="support-hub-section-heading" variants={hubFadeUp}>
            Guides, troubleshooting &amp; claims
          </motion.h2>
          <motion.div className="support-hub-cards" variants={hubStagger}>
            <motion.div variants={hubFadeUp} className="support-hub-card-reveal min-h-[14rem] min-w-0 sm:min-h-0">
              <Link
                to="/support/installation-setup"
                className="support-hub-card support-hub-card-primary support-hub-card--accent-sky focus-visible:focus-ring-support-hub group"
              >
                <div className="support-hub-card-icon-wrapper">
                  <WrenchScrewdriverIcon className="support-hub-card-icon" aria-hidden />
                </div>
                <h3 className="support-hub-card-title">Installation &amp; Setup</h3>
                <p className="support-hub-card-description">
                  Step-by-step guides, video tutorials, and installation scenarios for AC Drain Wiz products.
                </p>
                <div className="support-hub-card-link">
                  <span>View Guides</span>
                  <ArrowRightIcon className="support-hub-card-arrow" aria-hidden />
                </div>
              </Link>
            </motion.div>

            <motion.div variants={hubFadeUp} className="support-hub-card-reveal min-h-[14rem] min-w-0 sm:min-h-0">
              <Link
                to="/support/product-support"
                className="support-hub-card support-hub-card-primary support-hub-card--accent-indigo focus-visible:focus-ring-support-hub group"
              >
                <div className="support-hub-card-icon-wrapper">
                  <QuestionMarkCircleIcon className="support-hub-card-icon" aria-hidden />
                </div>
                <h3 className="support-hub-card-title">Product Support</h3>
                <p className="support-hub-card-description">
                  Troubleshooting guides, FAQs, and technical help for your AC Drain Wiz products.
                </p>
                <div className="support-hub-card-link">
                  <span>Get Help</span>
                  <ArrowRightIcon className="support-hub-card-arrow" aria-hidden />
                </div>
              </Link>
            </motion.div>

            <motion.div variants={hubFadeUp} className="support-hub-card-reveal min-h-[14rem] min-w-0 sm:min-h-0">
              <Link
                to="/support/warranty-returns"
                className="support-hub-card support-hub-card-primary support-hub-card--accent-emerald focus-visible:focus-ring-support-hub group"
              >
                <div className="support-hub-card-icon-wrapper">
                  <ShieldCheckIcon className="support-hub-card-icon" aria-hidden />
                </div>
                <h3 className="support-hub-card-title">Warranty &amp; Returns</h3>
                <p className="support-hub-card-description">
                  Warranty coverage details, return policy, and how to file a claim.
                </p>
                <div className="support-hub-card-link">
                  <span>Learn More</span>
                  <ArrowRightIcon className="support-hub-card-arrow" aria-hidden />
                </div>
              </Link>
            </motion.div>

            <motion.div variants={hubFadeUp} className="support-hub-card-reveal min-h-[14rem] min-w-0 sm:min-h-0">
              <Link
                to="/contact?type=support"
                className="support-hub-card support-hub-card-primary support-hub-card--accent-amber focus-visible:focus-ring-support-hub group"
              >
                <div className="support-hub-card-icon-wrapper">
                  <EnvelopeIcon className="support-hub-card-icon" aria-hidden />
                </div>
                <h3 className="support-hub-card-title">Contact Support</h3>
                <p className="support-hub-card-description">
                  Get in touch with our support team via phone, email, or support form.
                </p>
                <div className="support-hub-card-link">
                  <span>Contact Us</span>
                  <ArrowRightIcon className="support-hub-card-arrow" aria-hidden />
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </motion.section>

        <motion.section
          className="support-hub-quick-links-wrap"
          initial="hidden"
          whileInView="visible"
          viewport={hubScrollViewport}
          variants={hubStagger}
        >
          <motion.div variants={hubStagger} className="support-hub-quick-links">
            <motion.h2 className="support-hub-quick-links-title" variants={hubFadeUp}>
              Quick links
            </motion.h2>
            <motion.div variants={hubStagger} className="support-hub-quick-links-grid">
              <motion.div variants={hubFadeUp} className="support-hub-quick-link-shell min-h-[3.5rem]">
                <Link
                  to={SENSOR_SETUP_MODEL_CHOICE_HREF}
                  className="support-hub-quick-link focus-visible:focus-ring-support-hub group"
                >
                  <DocumentTextIcon className="support-hub-quick-link-icon" aria-hidden />
                  <span className="support-hub-quick-link-label">Sensor Setup Guide</span>
                  <ArrowRightIcon className="support-hub-quick-link-chevron" aria-hidden />
                </Link>
              </motion.div>
              <motion.div variants={hubFadeUp} className="support-hub-quick-link-shell min-h-[3.5rem]">
                <Link
                  to="/support/installation-scenarios"
                  className="support-hub-quick-link focus-visible:focus-ring-support-hub group"
                >
                  <BookOpenIcon className="support-hub-quick-link-icon" aria-hidden />
                  <span className="support-hub-quick-link-label">Installation Scenarios</span>
                  <ArrowRightIcon className="support-hub-quick-link-chevron" aria-hidden />
                </Link>
              </motion.div>
              <motion.div variants={hubFadeUp} className="support-hub-quick-link-shell min-h-[3.5rem]">
                <a
                  href={MONITORING.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="support-hub-quick-link support-hub-quick-link--external focus-visible:focus-ring-support-hub group"
                >
                  <DocumentTextIcon className="support-hub-quick-link-icon" aria-hidden />
                  <span className="support-hub-quick-link-label">Sensor Monitoring Portal</span>
                  <ArrowTopRightOnSquareIcon className="support-hub-quick-link-external" aria-hidden />
                </a>
              </motion.div>
              <motion.div variants={hubFadeUp} className="support-hub-quick-link-shell min-h-[3.5rem]">
                <Link to="/compliance" className="support-hub-quick-link focus-visible:focus-ring-support-hub group">
                  <DocumentTextIcon className="support-hub-quick-link-icon" aria-hidden />
                  <span className="support-hub-quick-link-label">Compliance Resources</span>
                  <ArrowRightIcon className="support-hub-quick-link-chevron" aria-hidden />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.section>
      </div>
    </div>
  )
}
