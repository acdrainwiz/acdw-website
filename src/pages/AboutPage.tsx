import { Link } from 'react-router-dom'
import { EnvelopeIcon, PhoneIcon, BuildingOfficeIcon, CheckCircleIcon, WrenchScrewdriverIcon, HomeIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline'
import { SUPPORT_CONTACT } from '../config/acdwKnowledge'
import type { PageSearchMeta } from '../config/siteSearchTypes'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'page-about',
  kind: 'site',
  title: 'About AC Drain Wiz',
  body:
    'Company story: mission to make AC maintenance easier, faster, more profitable with one-time installed condensate drain solutions. Alan Riddle founder story, attic flooding and condensate line service. What we deliver—easier, faster, more profitable maintenance. Who we serve: HVAC contractors, property managers, homeowners. ICC code compliant, professional grade, made in USA. Contact and leadership information.',
  tags: ['about', 'company', 'mission', 'founder', 'story'],
  href: '/about',
}

export function AboutPage() {

  return (
    <div className="about-page-container">

      {/* Hero Banner – single mission statement */}
      <div className="support-hero">
        <div className="support-hero-content">
          <div className="support-hero-header">
            <h1 className="support-hero-title">About AC Drain Wiz</h1>
            <p className="support-hero-subtitle">
              Making AC maintenance easier, faster, and more profitable with innovative
              one-time installed solutions that proactively keep condensate drain lines clear.
            </p>
            <div className="support-hero-badge-row">
              <span className="support-hero-badge">ICC Code Compliant</span>
              <span className="support-hero-badge">Professional Grade</span>
              <span className="support-hero-badge">Made in USA</span>
            </div>
          </div>
        </div>
      </div>

      <div className="about-page-content">
        {/* What we deliver – mission demonstrated by pillars, no duplicate sentence */}
        <div className="about-page-section">
          <h2 className="about-page-section-title">What We Deliver</h2>
          <div className="about-page-mission-content">
            <div className="about-page-mission-grid">
              <div className="about-page-mission-item">
                <div className="about-page-mission-icon about-page-mission-icon-easier">
                  <CheckCircleIcon className="about-page-mission-icon-svg" />
                </div>
                <h3 className="about-page-mission-item-title">Easier</h3>
                <p className="about-page-mission-item-description">One-time installation eliminates repeated cutting and reconnection. Clear view into the line to verify cleaning and spot issues.</p>
              </div>
              <div className="about-page-mission-item">
                <div className="about-page-mission-icon about-page-mission-icon-faster">
                  <CheckCircleIcon className="about-page-mission-icon-svg" />
                </div>
                <h3 className="about-page-mission-item-title">Faster</h3>
                <p className="about-page-mission-item-description">10X faster cleanouts with streamlined maintenance process. Visual verification that the line is clear—no guesswork.</p>
              </div>
              <div className="about-page-mission-item">
                <div className="about-page-mission-icon about-page-mission-icon-profitable">
                  <CheckCircleIcon className="about-page-mission-icon-svg" />
                </div>
                <h3 className="about-page-mission-item-title">More Profitable</h3>
                <p className="about-page-mission-item-description">Increased technician efficiency and upsell opportunities</p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="about-page-section">
          <h2 className="about-page-section-title">Our Story</h2>
          <div className="about-page-prose">
            <p className="about-page-prose-p">
              Alan Riddle, a father of four, had his AC back up twice—flooding his son’s bedroom ceiling and costing him thousands in repairs, lost time, and inconvenience. The unit was in the attic; the condensate line was hard to service and impossible to monitor. He couldn’t find anything that let him inspect and clear the line and verify that it was done properly, so he built a solution from parts at his local hardware store. That early prototype led to AC Drain Wiz 1.0 and resulted in the AC Drain Wiz Mini.
            </p>
            <p className="about-page-prose-p">
              He kept thinking: there has to be a better way to see inside the line, clean it with air and water, and vacuum toward the pan—then verify the clean condition of the condensate line. Years of research—into existing products, their successes and failures, and what it would take to solve it himself—turned that question into the Mini and the rest of our product line.
            </p>
            <p className="about-page-prose-p">
              That frustration in an attic led to the AC Drain Wiz Mini—our most compact, versatile, and complete drain line cleaning solution—and now a full line of drain maintenance and overflow monitoring and drain line protection products. We’re here because one homeowner refused to accept that there wasn’t a better way—and we’re still building for everyone who feels the same.
            </p>
          </div>
        </div>

        {/* Who We Serve */}
        <div className="about-page-section">
          <h2 className="about-page-section-title">Who We Serve</h2>
          <div className="about-page-audience-grid">
            <div className="about-page-audience-item">
              <WrenchScrewdriverIcon className="about-page-audience-icon" aria-hidden="true" />
              <h3 className="about-page-audience-title">HVAC Contractors</h3>
              <p className="about-page-audience-text">
                Faster cleanouts, no repeated cut-and-reattach, and upsell opportunities with one-time installed maintenance access and optional overflow protection.
              </p>
            </div>
            <div className="about-page-audience-item">
              <BuildingOffice2Icon className="about-page-audience-icon" aria-hidden="true" />
              <h3 className="about-page-audience-title">Property Managers</h3>
              <p className="about-page-audience-text">
                Predictive maintenance with WiFi sensor alerts, fewer emergency callbacks, and a streamlined process across multiple units.
              </p>
            </div>
            <div className="about-page-audience-item">
              <HomeIcon className="about-page-audience-icon" aria-hidden="true" />
              <h3 className="about-page-audience-title">Homeowners</h3>
              <p className="about-page-audience-text">
                Permanent service access for your condensate line and automatic overflow protection so you can avoid water damage and unexpected AC shutdowns.
              </p>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="about-page-section">
          <h2 className="about-page-section-title">Our Values</h2>
          <div className="about-page-values-list">
            <div className="about-page-value-item">
              <strong className="about-page-value-name">One-time installation.</strong>
              <span className="about-page-value-desc"> Our Mini is a permanent service port—you install once and never have to cut the line again for routine maintenance. The transparent design lets you see into the line to verify cleaning and spot issues early.</span>
            </div>
            <div className="about-page-value-item">
              <strong className="about-page-value-name">Contractor-first design.</strong>
              <span className="about-page-value-desc"> We build for the way technicians work: flush, air, and vacuum through one access point, with clear documentation and support.</span>
            </div>
            <div className="about-page-value-item">
              <strong className="about-page-value-name">Transparency.</strong>
              <span className="about-page-value-desc"> Clear specs, compatibility guidance, and direct support. No surprises—you know what you’re getting and how to get help.</span>
            </div>
            <div className="about-page-value-item">
              <strong className="about-page-value-name">Overflow protection that fits your setup.</strong>
              <span className="about-page-value-desc"> Our sensors provide automatic shutdown at 95% water level; the WiFi option adds remote monitoring and predictive alerts so you can schedule service before shutdown.</span>
            </div>
          </div>
        </div>

        {/* What Sets Us Apart (UVP) */}
        <div className="about-page-section">
          <h2 className="about-page-section-title">What Sets Us Apart</h2>
          <div className="about-page-prose">
            <p className="about-page-prose-p">
              AC Drain Wiz combines permanent drain line maintenance access with optional overflow protection. The Mini gives technicians a one-time installed port for flush, compressed air, and vacuum—no cutting PVC on every service. The clear body gives a direct view into the drain line so technicians can verify clean-out success and homeowners can spot high water or biofilm and call for service before a backup. Our Sensor Switches add automatic AC shutdown at 95% water level and, with the WiFi model, remote monitoring and configurable alerts so contractors can schedule preventative maintenance. We design for 3/4" condensate lines and work seamlessly with most residential AC units and common setups like transfer pumps. One-time installation, lifetime benefits, and a streamlined maintenance process are at the core of what we offer.
            </p>
          </div>
        </div>

        {/* Leadership */}
        <div className="about-page-section about-page-leadership">
          <h2 className="about-page-section-title">Leadership</h2>
          <div className="about-page-leadership-content">
            <div className="about-page-leadership-profile">
              <div className="about-page-leadership-avatar">
                <BuildingOfficeIcon className="about-page-leadership-avatar-icon" />
              </div>
              <div className="about-page-leadership-details">
                <h3 className="about-page-leadership-name">{SUPPORT_CONTACT.primaryContactName}</h3>
                <p className="about-page-leadership-role">{SUPPORT_CONTACT.title}</p>
                <p className="about-page-leadership-bio">
                  Leading the development of innovative AC drain line maintenance solutions
                  that revolutionize how HVAC professionals approach condensate line maintenance.
                </p>
                <div className="about-page-leadership-contact">
                  <a
                    href={`mailto:${SUPPORT_CONTACT.email}`}
                    className="about-page-leadership-contact-link"
                  >
                    <EnvelopeIcon className="about-page-leadership-contact-icon" />
                    <span className="about-page-leadership-contact-text">{SUPPORT_CONTACT.email}</span>
                  </a>
                  <a
                    href={SUPPORT_CONTACT.telHref}
                    className="about-page-leadership-contact-link"
                  >
                    <PhoneIcon className="about-page-leadership-contact-icon" />
                    <span className="about-page-leadership-contact-text">{SUPPORT_CONTACT.phoneDisplay}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="about-page-section about-page-social-proof">
          <h2 className="about-page-section-title">Trusted by the Industry</h2>
          <p className="about-page-social-proof-text">
            Our products are ICC code compliant, professional grade, and made in the USA. We are committed to quality and clarity in every product and support interaction.
          </p>
          <div className="about-page-social-proof-badges">
            <span className="about-page-social-proof-badge">ICC Code Compliant</span>
            <span className="about-page-social-proof-badge">Professional Grade</span>
            <span className="about-page-social-proof-badge">Made in USA</span>
          </div>
        </div>

        {/* CTA */}
        <div className="about-page-section about-page-cta-section">
          <p className="about-page-cta-text">Ready to simplify drain line maintenance and add overflow protection?</p>
          <div className="about-page-cta-buttons">
            <Link to="/products" className="about-page-cta-primary">
              View Products
            </Link>
            <Link to="/contact?type=demo-request" className="about-page-cta-secondary">
              Request Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
