import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { TRASH_THE_FLOAT, type CampaignCard } from '@/config/trashTheFloatCopy'

type Variant = 'overlay' | 'page' | 'modal'
type Surface = 'dark' | 'light'

interface ComparisonCardsProps {
  variant?: Variant
  surface?: Surface
  className?: string
}

export function ComparisonCards({
  variant = 'overlay',
  surface = 'dark',
  className,
}: ComparisonCardsProps) {
  const compact = variant === 'overlay'

  return (
    <div
      className={cn(
        'ttf-compare-grid',
        variant === 'overlay' && 'ttf-compare-grid--overlay',
        variant === 'page' && 'ttf-compare-grid--page',
        variant === 'modal' && 'ttf-compare-grid--modal',
        className,
      )}
    >
      <ComparisonCard
        card={TRASH_THE_FLOAT.leftCard}
        imageSrc={TRASH_THE_FLOAT.images.floatOld}
        imageAlt="Legacy mechanical float switch"
        tone="reactive"
        compact={compact}
        surface={surface}
      />
      <ComparisonCard
        card={TRASH_THE_FLOAT.rightCard}
        imageSrc={TRASH_THE_FLOAT.images.sensorStandard}
        imageAlt="AC Drain Wiz Standard Sensor Switch"
        tone="smart"
        compact={compact}
        surface={surface}
      />
    </div>
  )
}

interface ComparisonCardProps {
  card: CampaignCard
  imageSrc: string
  imageAlt: string
  tone: 'reactive' | 'smart'
  compact: boolean
  surface: Surface
}

function ComparisonCard({
  card,
  imageSrc,
  imageAlt,
  tone,
  compact,
  surface,
}: ComparisonCardProps) {
  const isSmart = tone === 'smart'
  const isLight = surface === 'light'

  const cardBase = isLight ? 'campaign-card-light' : 'campaign-card'
  const cardSmart = isSmart ? 'campaign-card-smart' : ''

  return (
    <article
      className={cn(
        'transition',
        cardBase,
        cardSmart,
        compact ? 'ttf-compare-card-compact' : 'ttf-compare-card-page',
        isSmart && !isLight && 'ttf-compare-smart-gradient',
      )}
    >
      {/* Ambient glow behind the smart card image */}
      {isSmart ? (
        <div
          aria-hidden
          className={cn(
            'ttf-compare-smart-glow',
            isLight && 'ttf-compare-smart-glow--light',
          )}
        />
      ) : null}

      <div className="relative flex items-start">
        {isSmart ? (
          <span className="campaign-eyebrow">{card.badge}</span>
        ) : (
          <span
            className={cn(
              isLight
                ? 'ttf-compare-badge-reactive--light'
                : 'ttf-compare-badge-reactive--dark',
            )}
          >
            {card.badge}
          </span>
        )}
      </div>

      <div
        className={cn(
          'ttf-compare-image-plate',
          compact ? 'ttf-compare-image-plate--compact' : 'ttf-compare-image-plate--page',
          isLight
            ? isSmart
              ? 'ttf-compare-image-plate--light-smart'
              : 'ttf-compare-image-plate--light-react'
            : isSmart
              ? 'ttf-compare-image-plate--dark-smart'
              : 'ttf-compare-image-plate--dark-react',
        )}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          loading="lazy"
          className={cn(
            'ttf-compare-img',
            compact ? 'ttf-compare-img--compact' : 'ttf-compare-img--page',
            isSmart && 'ttf-compare-img--smart',
            !isSmart && !isLight && 'ttf-compare-img--react-dark',
          )}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>

      <h3
        className={cn(
          'ttf-compare-title',
          compact ? 'ttf-compare-title--compact' : 'ttf-compare-title--page',
          isLight ? 'ttf-compare-title--light' : 'ttf-compare-title--dark',
        )}
      >
        {card.title}
      </h3>

      <ul className="ttf-compare-bullets">
        {(compact ? card.bullets.slice(0, 2) : card.bullets).map((bullet) => (
          <li
            key={bullet.text}
            className={cn(
              'ttf-compare-bullet',
              !compact && 'ttf-compare-bullet--page',
              isLight
                ? isSmart
                  ? 'ttf-compare-bullet--smart-light'
                  : 'ttf-compare-bullet--react-light'
                : isSmart
                  ? 'ttf-compare-bullet--smart-dark'
                  : 'ttf-compare-bullet--react-dark',
            )}
          >
            {isSmart ? (
              <CheckCircleIcon
                aria-hidden
                className={cn('ttf-compare-bullet-icon', 'ttf-compare-bullet-icon--smart')}
              />
            ) : (
              <XCircleIcon
                aria-hidden
                className={cn(
                  'ttf-compare-bullet-icon',
                  isLight
                    ? 'ttf-compare-bullet-icon--react-light'
                    : 'ttf-compare-bullet-icon--react-dark',
                )}
              />
            )}
            <span>{bullet.text}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}
