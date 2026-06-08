import { useMemo, type ElementType, type ReactNode } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'

/** Trigger when ~40% of the block is visible and it has cleared the lower edge. */
export const TTF_REVEAL_VIEWPORT = {
  once: true,
  amount: 0.4,
  margin: '0px 0px -14% 0px',
} as const

/** Prize header — fire earlier so eyebrow + title appear before the iPad stage. */
export const TTF_PRIZE_HEADER_VIEWPORT = {
  once: true,
  amount: 0.12,
  margin: '0px 0px -6% 0px',
} as const

const EASE = [0.22, 1, 0.36, 1] as const

// Animation-variants hook co-located with its reveal components (Fast Refresh hint only).
// eslint-disable-next-line react-refresh/only-export-components
export function useTtfRevealVariants() {
  const reduceMotion = useReducedMotion()

  return useMemo(
    () => ({
      section: {
        hidden: { opacity: 0, y: reduceMotion ? 0 : 28 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: reduceMotion ? 0.15 : 0.52, ease: EASE },
        },
      },
      item: {
        hidden: { opacity: 0, y: reduceMotion ? 0 : 22 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: reduceMotion ? 0.15 : 0.46, ease: EASE },
        },
      },
      stagger: {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reduceMotion ? 0 : 0.09,
            delayChildren: reduceMotion ? 0 : 0.04,
          },
        },
      },
    }),
    [reduceMotion],
  )
}

type TtfRevealViewport = {
  once?: boolean
  amount?: number | 'some' | 'all'
  margin?: string
}

type TtfRevealProps = {
  children: ReactNode
  className?: string
  viewport?: TtfRevealViewport
  variants?: Variants
}

/** Single block — brings itself in when scrolled into view. */
export function TtfReveal({ children, className, viewport = TTF_REVEAL_VIEWPORT, variants }: TtfRevealProps) {
  const defaultVariants = useTtfRevealVariants()

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={variants ?? defaultVariants.section}
    >
      {children}
    </motion.div>
  )
}

type TtfRevealGroupProps = {
  children: ReactNode
  className?: string
  as?: 'div' | 'ol' | 'ul'
}

/** Stagger container — children should be TtfRevealItem. */
export function TtfRevealGroup({ children, className, as = 'div' }: TtfRevealGroupProps) {
  const variants = useTtfRevealVariants()
  const Component = motion[as] as ElementType

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={TTF_REVEAL_VIEWPORT}
      variants={variants.stagger}
    >
      {children}
    </Component>
  )
}

type TtfRevealItemProps = {
  children: ReactNode
  className?: string
  as?: 'div' | 'li' | 'article'
} & Omit<React.ComponentPropsWithoutRef<'div'>, 'children' | 'className'>

/** Stagger child — must sit inside TtfRevealGroup. */
export function TtfRevealItem({ children, className, as = 'div', ...rest }: TtfRevealItemProps) {
  const variants = useTtfRevealVariants()
  const Component = motion[as] as ElementType

  return (
    <Component className={className} variants={variants.item} {...rest}>
      {children}
    </Component>
  )
}
