import type { Variants } from 'framer-motion'
import { useMiniPageScrollMotion } from '../../hooks/useMiniPageScrollMotion'

/** Homepage below-fold motion — same tokens as Mini/Sensor `whileInView`. */
export function useHomePageMotion() {
  const { reduceMotion, tr, viewport, ease } = useMiniPageScrollMotion()

  const header = {
    initial: reduceMotion ? (false as const) : { opacity: 0, y: 44 },
    whileInView: { opacity: 1, y: 0 },
    viewport,
    transition: tr(0.98),
  }

  const unit = {
    initial: reduceMotion ? (false as const) : { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport,
    transition: tr(0.75),
  }

  const cardUnit = {
    initial: reduceMotion ? (false as const) : { opacity: 0, y: 28, scale: 0.96 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport,
    transition: tr(0.78),
  }

  const purchaseBand = {
    initial: reduceMotion ? (false as const) : { opacity: 0, scale: 0.96 },
    whileInView: { opacity: 1, scale: 1 },
    viewport,
    transition: tr(1.05),
  }

  const purchaseBandFollow = {
    ...purchaseBand,
    transition: tr(1.05, 0.08),
  }

  const splitLeft = {
    initial: reduceMotion ? (false as const) : { opacity: 0, x: -32 },
    whileInView: { opacity: 1, x: 0 },
    viewport,
    transition: tr(0.9),
  }

  const splitRight = {
    initial: reduceMotion ? (false as const) : { opacity: 0, x: 32 },
    whileInView: { opacity: 1, x: 0 },
    viewport,
    transition: tr(0.9),
  }

  const heritageLeft = {
    initial: reduceMotion ? (false as const) : { opacity: 0, x: -48 },
    whileInView: { opacity: 1, x: 0 },
    viewport,
    transition: tr(0.98),
  }

  const heritageRight = {
    initial: reduceMotion ? (false as const) : { opacity: 0, x: 48 },
    whileInView: { opacity: 1, x: 0 },
    viewport,
    transition: tr(0.98),
  }

  const gridInView = {
    initial: 'hidden' as const,
    whileInView: 'visible' as const,
    viewport,
  }

  const gridContainer: Variants = reduceMotion
    ? {
        hidden: { opacity: 1 },
        visible: { opacity: 1, transition: { staggerChildren: 0, delayChildren: 0 } },
      }
    : {
        hidden: { opacity: 1 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.12, delayChildren: 0.05 },
        },
      }

  const gridItem: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 28 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.68, ease },
        },
      }

  const partnerGridContainer: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 1 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.08, delayChildren: 0.04 },
        },
      }

  const partnerGridItem: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease },
        },
      }

  const faqItem = (index: number) => ({
    initial: reduceMotion ? (false as const) : { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport,
    transition: tr(0.72, Math.min(index, 8) * 0.09),
  })

  return {
    reduceMotion,
    tr,
    viewport,
    header,
    unit,
    cardUnit,
    purchaseBand,
    purchaseBandFollow,
    splitLeft,
    splitRight,
    heritageLeft,
    heritageRight,
    gridInView,
    gridContainer,
    gridItem,
    partnerGridContainer,
    partnerGridItem,
    faqItem,
  }
}
