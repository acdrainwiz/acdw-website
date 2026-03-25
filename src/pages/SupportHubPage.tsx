import { useCallback, useEffect, useMemo, useState, type KeyboardEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  WrenchScrewdriverIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  BookOpenIcon,
  DocumentTextIcon,
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

const MIN_QUERY_LEN = 2
const SEARCH_ANALYTICS_DEBOUNCE_MS = 600
const LISTBOX_ID = 'support-hub-search-listbox'
const INPUT_ID = 'support-hub-search-input'

export function SupportHubPage() {
  const navigate = useNavigate()
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
      {/* Hero Banner */}
      <div className="support-hero">
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

      <div className="container py-12">
        {(results.length > 0 || showNoResults) && (
          <section className="support-hub-search-results mb-12">
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
                <h2 className="support-hub-search-results-heading">No matches for &ldquo;{trimmed}&rdquo;</h2>
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
          </section>
        )}
        {/* Main Navigation Cards */}
        <div className="support-hub-cards">
          <Link to="/support/installation-setup" className="support-hub-card support-hub-card-primary">
            <div className="support-hub-card-icon-wrapper">
              <WrenchScrewdriverIcon className="support-hub-card-icon" />
            </div>
            <h2 className="support-hub-card-title">Installation & Setup</h2>
            <p className="support-hub-card-description">
              Step-by-step guides, video tutorials, and installation scenarios for AC Drain Wiz products.
            </p>
            <div className="support-hub-card-link">
              <span>View Guides</span>
              <ArrowRightIcon className="support-hub-card-arrow" />
            </div>
          </Link>

          <Link to="/support/product-support" className="support-hub-card support-hub-card-primary">
            <div className="support-hub-card-icon-wrapper">
              <QuestionMarkCircleIcon className="support-hub-card-icon" />
            </div>
            <h2 className="support-hub-card-title">Product Support</h2>
            <p className="support-hub-card-description">
              Troubleshooting guides, FAQs, and technical help for your AC Drain Wiz products.
            </p>
            <div className="support-hub-card-link">
              <span>Get Help</span>
              <ArrowRightIcon className="support-hub-card-arrow" />
            </div>
          </Link>

          <Link to="/support/warranty-returns" className="support-hub-card support-hub-card-primary">
            <div className="support-hub-card-icon-wrapper">
              <ShieldCheckIcon className="support-hub-card-icon" />
            </div>
            <h2 className="support-hub-card-title">Warranty & Returns</h2>
            <p className="support-hub-card-description">
              Warranty coverage details, return policy, and how to file a claim.
            </p>
            <div className="support-hub-card-link">
              <span>Learn More</span>
              <ArrowRightIcon className="support-hub-card-arrow" />
            </div>
          </Link>

          <Link to="/contact?type=support" className="support-hub-card support-hub-card-primary">
            <div className="support-hub-card-icon-wrapper">
              <EnvelopeIcon className="support-hub-card-icon" />
            </div>
            <h2 className="support-hub-card-title">Contact Support</h2>
            <p className="support-hub-card-description">
              Get in touch with our support team via phone, email, or support form.
            </p>
            <div className="support-hub-card-link">
              <span>Contact Us</span>
              <ArrowRightIcon className="support-hub-card-arrow" />
            </div>
          </Link>
        </div>

        {/* Quick Links Section */}
        <div className="support-hub-quick-links">
          <h2 className="support-hub-quick-links-title">Quick Links</h2>
          <div className="support-hub-quick-links-grid">
            <Link to={SENSOR_SETUP_MODEL_CHOICE_HREF} className="support-hub-quick-link">
              <DocumentTextIcon className="support-hub-quick-link-icon" />
              <span>Sensor Setup Guide</span>
            </Link>
            <Link to="/support/installation-scenarios" className="support-hub-quick-link">
              <BookOpenIcon className="support-hub-quick-link-icon" />
              <span>Installation Scenarios</span>
            </Link>
            <a href={MONITORING.portalUrl} target="_blank" rel="noopener noreferrer" className="support-hub-quick-link">
              <DocumentTextIcon className="support-hub-quick-link-icon" />
              <span>Sensor Monitoring Portal</span>
            </a>
            <Link to="/compliance" className="support-hub-quick-link">
              <DocumentTextIcon className="support-hub-quick-link-icon" />
              <span>Compliance Resources</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
