import { TRASH_THE_FLOAT } from '@/config/trashTheFloatCopy'
import type {
  CampaignHallOfFamePreviewStory,
  HallOfFameStoryBadgeKind,
} from '@/config/trashTheFloatCopy'
import { cn } from '@/lib/utils'

type TtfStorySpotlightCardProps = {
  story: CampaignHallOfFamePreviewStory
}

const BADGE_LABELS = TRASH_THE_FLOAT.landing.hallOfShame.badges

function hallOfFameBadgeLabel(kind: HallOfFameStoryBadgeKind): string {
  switch (kind) {
    case 'monthly-winner':
      return BADGE_LABELS.monthlyWinner
    case 'featured-story':
      return BADGE_LABELS.featuredStory
    case 'sample-story':
      return BADGE_LABELS.sampleStory
  }
}

/**
 * Hall of Fame preview card — shows the expected story layout before approved
 * submissions are wired from the campaign API.
 */
export function TtfStorySpotlightCard({ story }: TtfStorySpotlightCardProps) {
  const { images } = TRASH_THE_FLOAT
  const imageSrc = images[story.imageKey]
  const badgeLabel = hallOfFameBadgeLabel(story.badgeKind)

  return (
    <article
      className={cn(
        'ttf-page-story-card ttf-page-story-card--preview campaign-card-light',
        story.badgeKind === 'monthly-winner' && 'ttf-page-story-card--winner',
        story.badgeKind === 'featured-story' && 'ttf-page-story-card--featured',
        story.badgeKind === 'sample-story' && 'ttf-page-story-card--sample',
      )}
      aria-label={`${badgeLabel}: ${story.storyTitle}`}
    >
      <span
        className={cn(
          'ttf-page-shame-badge ttf-page-story-card-badge',
          story.badgeKind === 'monthly-winner' && 'ttf-page-story-card-badge--winner',
          story.badgeKind === 'featured-story' && 'ttf-page-story-card-badge--featured',
        )}
      >
        {badgeLabel}
      </span>

      <div className="ttf-page-story-card-media">
        <img
          src={imageSrc}
          alt={story.imageAlt}
          className="ttf-page-story-card-img"
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      </div>

      <div className="ttf-page-story-card-body">
        <div className="ttf-page-story-card-meta">
          <p className="ttf-page-story-card-meta-line">
            <span>{story.firstName}</span>
            <span aria-hidden> · </span>
            <span>{story.audience}</span>
          </p>
          <p className="ttf-page-story-card-meta-line">{story.region}</p>
        </div>
        <p className="ttf-page-story-card-instagram">
          <img
            src={images.instagramIcon}
            alt=""
            className="ttf-page-story-card-instagram-icon"
            width={16}
            height={16}
            decoding="async"
            draggable={false}
            aria-hidden
          />
          <span className="ttf-page-story-card-instagram-handle">{story.instagramHandle}</span>
        </p>
        <h3 className="ttf-page-story-card-title">{story.storyTitle}</h3>
        <p className="ttf-page-story-card-excerpt">{story.excerpt}</p>
        <p className="ttf-page-story-card-note">{story.footerNote}</p>
      </div>
    </article>
  )
}
