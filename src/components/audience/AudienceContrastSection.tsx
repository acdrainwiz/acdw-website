import { useRef } from 'react'
import { motion } from 'framer-motion'
import { MiniFlowWaveBackdrop } from '../products/MiniFlowWaveBackdrop'
import { useAudienceLandingMotion } from './audienceLandingMotion'

type AudienceContrastCopy = {
  eyebrow: string
  title: string
  withoutLabel: string
  without: readonly string[]
  withLabel: string
  with: readonly string[]
}

type AudienceContrastSectionProps = {
  headingId: string
  copy: AudienceContrastCopy
}

export function AudienceContrastSection({ headingId, copy }: AudienceContrastSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const { reduceMotion, tr, mhViewport } = useAudienceLandingMotion()

  return (
    <section ref={sectionRef} className="mini-vs-old" aria-labelledby={headingId}>
      <MiniFlowWaveBackdrop sectionRef={sectionRef} />
      <div className="mini-vs-old-inner">
        <motion.header
          className="mini-section-header"
          initial={reduceMotion ? false : { opacity: 0, y: 44 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={mhViewport}
          transition={tr(0.98)}
        >
          <p className="mini-section-eyebrow">{copy.eyebrow}</p>
          <h2 id={headingId} className="product-section-title mini-section-title-promote">
            {copy.title}
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
            <p className="mini-vs-old-col-label">{copy.withoutLabel}</p>
            <ul className="mini-vs-old-list">
              {copy.without.map((item) => (
                <li key={item}>{item}</li>
              ))}
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
            <p className="mini-vs-old-col-label">{copy.withLabel}</p>
            <ul className="mini-vs-old-list">
              {copy.with.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
