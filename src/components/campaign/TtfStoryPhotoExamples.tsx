import { useState } from 'react'
import { TRASH_THE_FLOAT } from '@/config/trashTheFloatCopy'
import { cn } from '@/lib/utils'

type StoryPhoto = (typeof TRASH_THE_FLOAT.overlay.storyContext.photos)[number]

type TtfStoryPhotoExamplesProps = {
  photos: readonly StoryPhoto[]
  caption: string
  variant: 'modal' | 'form'
  /** Modal only — kicker + body above the grid */
  kicker?: string
  body?: string
  /** Form only — compact title + hint above the grid */
  title?: string
  hint?: string
  className?: string
  headingId?: string
}

/**
 * Shared damage-photo examples (ceiling stain, drain pan backup).
 * Used in the homepage modal and the story submission form upload block.
 */
export function TtfStoryPhotoExamples({
  photos,
  caption,
  variant,
  kicker,
  body,
  title,
  hint,
  className,
  headingId,
}: TtfStoryPhotoExamplesProps) {
  const [failed, setFailed] = useState<Record<number, boolean>>({})
  const isModal = variant === 'modal'

  const grid = (
    <ul
      className={cn(
        isModal ? 'ttf-modal-story-grid' : 'ttf-form-upload-examples-grid',
      )}
    >
      {photos.map((photo, index) => {
        const src = TRASH_THE_FLOAT.images[photo.srcKey]
        const showPlaceholder = failed[index]

        return (
          <li
            key={photo.srcKey}
            className={isModal ? 'ttf-modal-story-item' : 'ttf-form-upload-examples-item'}
          >
            <figure
              className={cn(
                isModal ? 'ttf-modal-story-thumb' : 'ttf-form-upload-examples-thumb',
              )}
            >
              {showPlaceholder ? (
                <div
                  className={cn(
                    isModal
                      ? 'ttf-modal-story-thumb-placeholder'
                      : 'ttf-form-upload-examples-thumb-placeholder',
                  )}
                  aria-hidden
                >
                  <span>{photo.label}</span>
                </div>
              ) : (
                <img
                  src={src}
                  alt={photo.alt}
                  className={cn(
                    isModal
                      ? 'ttf-modal-story-thumb-img'
                      : 'ttf-form-upload-examples-thumb-img',
                  )}
                  loading="lazy"
                  decoding="async"
                  onError={() => setFailed((prev) => ({ ...prev, [index]: true }))}
                />
              )}
              <figcaption
                className={cn(
                  isModal
                    ? 'ttf-modal-story-thumb-label'
                    : 'ttf-form-upload-examples-thumb-label',
                )}
              >
                {photo.label}
              </figcaption>
            </figure>
          </li>
        )
      })}
    </ul>
  )

  if (isModal) {
    return (
      <section
        className={cn('ttf-modal-story-context', className)}
        aria-labelledby={headingId}
      >
        {kicker ? (
          <h2 id={headingId} className="ttf-modal-story-kicker">
            {kicker}
          </h2>
        ) : null}
        {body ? <p className="ttf-modal-story-body">{body}</p> : null}
        {grid}
        <p className="ttf-modal-story-caption">{caption}</p>
      </section>
    )
  }

  return (
    <div
      className={cn('ttf-form-upload-examples', className)}
      role="group"
      aria-label="Example photos for optional upload"
    >
      {title ? <p className="ttf-form-upload-examples-title">{title}</p> : null}
      {hint ? <p className="ttf-form-upload-examples-hint">{hint}</p> : null}
      {grid}
      <p className="ttf-form-upload-examples-caption">{caption}</p>
    </div>
  )
}
