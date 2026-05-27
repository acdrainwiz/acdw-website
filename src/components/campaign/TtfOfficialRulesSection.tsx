import { Link } from 'react-router-dom'
import { TtfHashLink } from '@/components/campaign/TtfHashLink'
import { TRASH_THE_FLOAT_OFFICIAL_RULES } from '@/config/trashTheFloatOfficialRules'

/**
 * Full Official Rules block for the Trash the Float landing page (#official-rules).
 * Content lives in trashTheFloatOfficialRules.ts.
 *
 * Intentionally no scroll-reveal wrapper — the block is taller than the viewport,
 * so a single TtfReveal never hits its visibility threshold and stays opacity: 0.
 */
export function TtfOfficialRulesSection() {
  const rules = TRASH_THE_FLOAT_OFFICIAL_RULES

  return (
    <section
      id="official-rules"
      className="ttf-page-section ttf-page-section--rules ttf-page-section--atmo-rules scroll-mt-24"
      aria-labelledby="ttf-official-rules-heading"
    >
      <div className="ttf-page-section-inner ttf-page-section-inner--narrow">
          <header className="ttf-page-rules-header">
            <p className="ttf-page-eyebrow">Legal</p>
            <h2 id="ttf-official-rules-heading" className="ttf-page-rules-heading">
              {rules.title}
            </h2>
            <p className="ttf-page-rules-subtitle">{rules.subtitle}</p>
            <p className="ttf-page-rules-meta">
              {rules.effectiveDateLabel}
              <span aria-hidden> · </span>
              {rules.lastUpdatedLabel}
            </p>
          </header>

          <div className="ttf-page-rules-sponsor">
            <p className="ttf-page-rules-sponsor-name">{rules.sponsor.name}</p>
            <address className="ttf-page-rules-sponsor-address not-italic">
              {rules.sponsor.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <p className="ttf-page-rules-sponsor-contact">
              <a href={`mailto:${rules.sponsor.email}`} className="ttf-page-rules-link">
                {rules.sponsor.email}
              </a>
              <span aria-hidden> · </span>
              <a href={rules.sponsor.telHref} className="ttf-page-rules-link">
                {rules.sponsor.phoneDisplay}
              </a>
            </p>
          </div>

          <div className="ttf-page-rules-intro">
            {rules.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="ttf-page-rules-intro-line">
                {paragraph}
              </p>
            ))}
          </div>

          <nav className="ttf-page-rules-nav" aria-label="Official Rules sections">
            <p className="ttf-page-rules-nav-label">Quick navigation</p>
            <ul className="ttf-page-rules-nav-list">
              {rules.quickNav.map((item) => (
                <li key={item.id}>
                  <TtfHashLink hash={`#${item.id}`} className="ttf-page-rules-nav-link">
                    {item.label}
                  </TtfHashLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ttf-page-rules-body">
            {rules.sections.map((section) => (
              <article key={section.id} id={section.id} className="ttf-page-rules-article scroll-mt-28">
                <h3 className="ttf-page-rules-article-title">{section.title}</h3>
                <div className="ttf-page-rules-article-content">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 48)} className="ttf-page-rules-paragraph">
                      {paragraph}
                    </p>
                  ))}
                  {section.bullets?.length ? (
                    <ul className="ttf-page-rules-list">
                      {section.bullets.map((bullet) => (
                        <li key={bullet.slice(0, 48)} className="ttf-page-rules-list-item">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </article>
            ))}
          </div>

          <footer className="ttf-page-rules-footer">
            <p className="ttf-page-rules-footer-note">{rules.footerNote}</p>
            <p className="ttf-page-rules-footer-links">
              See also{' '}
              <Link to="/privacy-policy" className="ttf-page-rules-link">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link to="/terms-of-use" className="ttf-page-rules-link">
                Site Terms of Use
              </Link>
              .
            </p>
          </footer>
      </div>
    </section>
  )
}
