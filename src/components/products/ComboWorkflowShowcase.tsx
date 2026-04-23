import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowPathIcon, LinkIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import {
  PRODUCT_NAMES,
  SENSOR_STANDARD_SHORT,
  SENSOR_WIFI_SHORT,
} from '@/config/acdwKnowledge'

export type ComboWorkflowShowcaseHero = {
  src: string
  alt: string
}

export type ComboWorkflowShowcaseProps = {
  heroImage: ComboWorkflowShowcaseHero
  className?: string
}

/**
 * Stable classes + `data-combo-workflow` for overrides and QA.
 */
export const comboWorkflowShowcaseTargets = {
  mark: (section: string) =>
    ({ 'data-combo-workflow': section }) as Record<string, string>,
  classNames: {
    root: 'combo-workflow-showcase-root',
    heroFigure: 'combo-workflow-showcase-hero-figure',
    heroImage: 'combo-workflow-showcase-hero-image',
    steps: 'combo-workflow-showcase-steps',
    step: 'combo-workflow-showcase-step',
    stepIconWrap: 'combo-workflow-showcase-step-icon',
    stepTitle: 'combo-workflow-showcase-step-title',
    stepBody: 'combo-workflow-showcase-step-body',
  },
} as const

/**
 * Phase C — Mini + Sensor combo: hero shot plus scannable install/service/protection workflow.
 * Copy aligns with acdwKnowledge + acdw-knowledge rule (no new specs).
 */
export function ComboWorkflowShowcase({ heroImage, className }: ComboWorkflowShowcaseProps) {
  const reduceMotion = useReducedMotion()

  const steps = useMemo(
    () =>
      [
        {
          Icon: LinkIcon,
          title: 'Shared bayonet port',
          body: `${PRODUCT_NAMES.mini} stays on the line. ${PRODUCT_NAMES.sensor} installs in the same snap‑to‑lock bayonet port as the Mini valve when you are not servicing.`,
        },
        {
          Icon: ArrowPathIcon,
          title: 'Field service rhythm',
          body: `Remove the Sensor, install the Mini valve for flush, compressed air, or vacuum, then reinstall the Sensor when the line is ready.`,
        },
        {
          Icon: ShieldCheckIcon,
          title: 'Protection + optional Wi‑Fi',
          body: `Automatic AC shutoff at ~80% water. ${SENSOR_WIFI_SHORT} adds contractor alerts between ~50–79% on 2.4 GHz Wi‑Fi (5 GHz not supported). ${SENSOR_STANDARD_SHORT} protects locally without Wi‑Fi.`,
        },
      ] as const,
    []
  )

  const stepStagger = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: {
          staggerChildren: reduceMotion ? 0 : 0.07,
          delayChildren: reduceMotion ? 0 : 0.03,
        },
      },
    }),
    [reduceMotion]
  )

  const stepReveal = useMemo(
    () => ({
      hidden: { opacity: 0, y: reduceMotion ? 0 : 8 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: reduceMotion ? 0.15 : 0.34, ease: [0.25, 0.46, 0.45, 0.94] as const },
      },
    }),
    [reduceMotion]
  )

  return (
    <div
      {...comboWorkflowShowcaseTargets.mark('root')}
      className={cn(
        comboWorkflowShowcaseTargets.classNames.root,
        'flex h-full min-h-[300px] w-full max-w-none flex-col gap-4 self-stretch sm:min-h-[380px] lg:min-h-[440px]',
        className
      )}
      role="region"
      aria-label={`${PRODUCT_NAMES.mini} and ${PRODUCT_NAMES.sensor} combo overview and workflow.`}
    >
      <div
        {...comboWorkflowShowcaseTargets.mark('hero')}
        className={cn(
          comboWorkflowShowcaseTargets.classNames.heroFigure,
          'flex min-h-0 w-full flex-1 flex-col items-stretch justify-center'
        )}
      >
        <img
          src={heroImage.src}
          alt={heroImage.alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          className={cn(
            comboWorkflowShowcaseTargets.classNames.heroImage,
            'block h-full max-h-[min(64vh,520px)] w-full min-h-[200px] flex-1 select-none object-contain object-center'
          )}
        />
      </div>

      <motion.div
        {...comboWorkflowShowcaseTargets.mark('steps')}
        className={cn(
          comboWorkflowShowcaseTargets.classNames.steps,
          'grid grid-cols-1 gap-2.5 rounded-xl border border-white/10 bg-slate-950/45 p-3 ring-1 ring-white/5 sm:grid-cols-3 sm:gap-3 sm:p-4'
        )}
        variants={stepStagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {steps.map(({ Icon, title, body }, i) => (
          <motion.div
            key={title}
            {...comboWorkflowShowcaseTargets.mark(`step-${i}`)}
            className={cn(
              comboWorkflowShowcaseTargets.classNames.step,
              'flex min-w-0 gap-3 rounded-lg bg-slate-900/50 px-3 py-3 sm:flex-col sm:px-3.5 sm:py-3.5'
            )}
            variants={stepReveal}
          >
            <div
              className={cn(
                comboWorkflowShowcaseTargets.classNames.stepIconWrap,
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/25 sm:h-11 sm:w-11'
              )}
            >
              <Icon className="h-5 w-5 sm:h-5 sm:w-5" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <h4
                className={cn(
                  comboWorkflowShowcaseTargets.classNames.stepTitle,
                  'text-xs font-semibold uppercase tracking-wide text-slate-200'
                )}
              >
                {title}
              </h4>
              <p
                className={cn(
                  comboWorkflowShowcaseTargets.classNames.stepBody,
                  'mt-1.5 text-left text-[11px] leading-snug text-slate-400 sm:text-xs'
                )}
              >
                {body}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default ComboWorkflowShowcase
