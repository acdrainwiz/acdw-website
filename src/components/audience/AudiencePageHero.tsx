import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { PageHeroMeshBackdrop } from '../layout/PageHeroMeshBackdrop'
import { usePageHeroIntro } from '../../hooks/usePageHeroIntro'

export type AudienceHeroTone = 'home' | 'trade' | 'portfolio' | 'spec'

type AudiencePageHeroProps = {
  tone: AudienceHeroTone
  eyebrow: string
  title: string
  dek: string
  imageSrc: string
  imageAlt: string
  primary: ReactNode
  secondary?: ReactNode
}

/**
 * Shared hero chrome only. Tone, crop, and CTA slots stay page-specific
 * so the four landings do not read as one template.
 */
export function AudiencePageHero({
  tone,
  eyebrow,
  title,
  dek,
  imageSrc,
  imageAlt,
  primary,
  secondary,
}: AudiencePageHeroProps) {
  const { introStagger, fadeUp } = usePageHeroIntro()
  const reduceMotion = useReducedMotion()

  return (
    <section className={`audience-hero audience-hero-${tone}`} aria-labelledby="audience-hero-heading">
      <PageHeroMeshBackdrop />
      <div className="audience-hero-inner">
        <motion.div
          className="audience-hero-copy"
          initial="hidden"
          animate="visible"
          variants={introStagger}
        >
          <motion.p
            className="mini-section-eyebrow mini-section-eyebrow--dark"
            variants={fadeUp}
          >
            {eyebrow}
          </motion.p>
          <motion.h1 id="audience-hero-heading" className="audience-hero-title" variants={fadeUp}>
            {title}
          </motion.h1>
          <motion.p className="audience-hero-dek" variants={fadeUp}>
            {dek}
          </motion.p>
          <motion.div className="audience-hero-actions" variants={fadeUp}>
            {primary}
            {secondary}
          </motion.div>
        </motion.div>
        <motion.div
          className="audience-hero-stage"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: reduceMotion ? 0.2 : 0.7,
            ease: [0.22, 1, 0.36, 1],
            delay: reduceMotion ? 0 : 0.12,
          }}
        >
          <img
            src={imageSrc}
            alt={imageAlt}
            className="audience-hero-image"
            width={1600}
            height={1200}
            fetchPriority="high"
          />
        </motion.div>
      </div>
    </section>
  )
}
