import { TRASH_THE_FLOAT } from '@/config/trashTheFloatCopy'
import type { CampaignHallOfFamePreviewStory } from '@/config/trashTheFloatCopy'

type TtfStorySpotlightCardProps = {
  story: CampaignHallOfFamePreviewStory
  comingSoonLabel: string
}

/**
 * Hall of Fame preview card — shows the expected story layout before approved
 * submissions are wired from the campaign API.
 */
export function TtfStorySpotlightCard({ story, comingSoonLabel }: TtfStorySpotlightCardProps) {
  const { images } = TRASH_THE_FLOAT
  const imageSrc = images[story.imageKey]

  return (
    <article
      className="ttf-page-story-card ttf-page-story-card--preview campaign-card-light"
      aria-label={`${story.layoutNote}: ${story.storyTitle}`}
    >
      <span className="ttf-page-shame-badge ttf-page-story-card-badge">{comingSoonLabel}</span>

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
        <p className="ttf-page-story-card-note">{story.layoutNote}</p>
      </div>
    </article>
  )
}
