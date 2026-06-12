import { motion, type Variants } from 'framer-motion'
import { ProductHotspots } from './ProductHotspots'
import { miniFullStackHotspots } from './miniFullStackHotspots'
import { MiniHeroV2MeshBackground } from '../layout/MiniHeroV2MeshBackground'
import { MINI_ANATOMY } from '../../config/miniConfigSlides'
import { MINI_ANATOMY_INTRO } from '../../config/miniAnatomyStory'
import {
  getMiniAnatomyBeats,
  getMiniAnatomyBridge,
  getMiniAnatomyHeadingId,
  getMiniAnatomyHotspotsId,
  type MiniPageContext,
} from '../../config/miniNarrative'
import { useMiniPageScrollMotion } from '../../hooks/useMiniPageScrollMotion'

export type MiniAnatomyBandProps = {
  context?: MiniPageContext
  calibrateHotspots?: boolean
}

export function MiniAnatomyBand({
  context = 'home',
  calibrateHotspots = false,
}: MiniAnatomyBandProps) {
  const headingId = getMiniAnatomyHeadingId(context)
  const hotspotsId = getMiniAnatomyHotspotsId(context)
  const beats = getMiniAnatomyBeats(context)
  const bridge = getMiniAnatomyBridge(context)
  const animateOnScroll = context === 'product'
  const { reduceMotion, tr, viewport, ease } = useMiniPageScrollMotion()

  const storyListVariants: Variants =
    !animateOnScroll || reduceMotion
      ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
      : {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.07,
              delayChildren: 0.12,
            },
          },
        }

  const storyItemVariants: Variants =
    !animateOnScroll || reduceMotion
      ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
      : {
          hidden: { opacity: 0, y: 14 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.58, ease },
          },
        }

  const headerScroll =
    animateOnScroll && !reduceMotion
      ? {
          initial: { opacity: 0, y: 48 },
          whileInView: { opacity: 1, y: 0 },
          viewport,
          transition: tr(1.02),
        }
      : {}

  const panelScroll =
    animateOnScroll && !reduceMotion
      ? {
          initial: { opacity: 0, x: -48, y: 32 },
          whileInView: { opacity: 1, x: 0, y: 0 },
          viewport,
          transition: tr(1.02),
        }
      : {}

  const stageScroll =
    animateOnScroll && !reduceMotion
      ? {
          initial: { opacity: 0, x: 48, y: 24, scale: 0.96 },
          whileInView: { opacity: 1, x: 0, y: 0, scale: 1 },
          viewport,
          transition: tr(1.05, 0.1),
        }
      : {}

  const bridgeScroll =
    animateOnScroll && !reduceMotion
      ? {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport,
          transition: tr(0.72, 0.22),
        }
      : {}

  return (
    <section
      className={`mini-hotspot-band mini-hotspot-band--home-full${context === 'product' ? ' mini-hotspot-band--product' : ''}`}
      aria-labelledby={headingId}
    >
      <MiniHeroV2MeshBackground />

      <div className="mini-hotspot-band-home-shell">
        <motion.header className="mini-hotspot-band-header" {...headerScroll}>
          <span className="mini-hotspot-band-eyebrow">{MINI_ANATOMY_INTRO.eyebrow}</span>
          <h2 id={headingId} className="mini-hotspot-band-title">
            {MINI_ANATOMY_INTRO.title}
          </h2>
          <p className="mini-hotspot-band-desc">{MINI_ANATOMY_INTRO.description}</p>
        </motion.header>

        <div className="mini-hotspot-band-story-layout">
          <motion.div className="mini-hotspot-band-story-panel" {...panelScroll}>
            <div className="mini-hotspot-band-texture" aria-hidden />
            <motion.ol
              className="mini-hotspot-band-story"
              aria-label="Mini feature story"
              variants={storyListVariants}
              initial={animateOnScroll && !reduceMotion ? 'hidden' : false}
              whileInView={animateOnScroll && !reduceMotion ? 'visible' : undefined}
              viewport={viewport}
            >
              {beats.map((beat, index) => (
                <motion.li
                  key={beat.id}
                  className="mini-hotspot-band-story-item"
                  variants={storyItemVariants}
                >
                  <span className="mini-hotspot-band-story-step" aria-hidden>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="mini-hotspot-band-story-body">
                    <h3 className="mini-hotspot-band-story-title">{beat.title}</h3>
                    <p className="mini-hotspot-band-story-desc">{beat.description}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>
          </motion.div>

          <motion.div
            id={hotspotsId}
            className="mini-hotspot-band-stage mini-hotspot-band-stage--home-bare"
            {...stageScroll}
          >
            <p className="mini-hotspot-band-stage-label">Interactive assembly</p>
            <div className="mini-hotspot-band-hotspot-stage products-showcase-media--hotspots">
              <ProductHotspots
                imageSrc={MINI_ANATOMY.src}
                imageAlt={MINI_ANATOMY.alt}
                hotspots={miniFullStackHotspots}
                className="mini-hotspot-band-product-figure"
                imgClassName="mini-hotspot-band-img"
                loading="lazy"
                calibrate={calibrateHotspots}
                calibrateExportFile="miniFullStackHotspots.ts"
              />
            </div>
          </motion.div>
        </div>

        <motion.p className="mini-hotspot-band-bridge" {...bridgeScroll}>
          {bridge}
        </motion.p>
      </div>
    </section>
  )
}
