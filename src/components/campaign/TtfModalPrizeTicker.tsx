import { useReducedMotion } from 'framer-motion'
import { TRASH_THE_FLOAT } from '@/config/trashTheFloatCopy'
import type { CampaignPrizeTickerItem } from '@/config/trashTheFloatCopy'
import { cn } from '@/lib/utils'

function TickerSet({ items, setKey }: { items: CampaignPrizeTickerItem[]; setKey: string }) {
  return (
    <ul className="ttf-modal-prize-ticker-set" aria-hidden={setKey === 'b' ? true : undefined}>
      {items.map((item, idx) => (
        <li key={`${setKey}-${item.label}-${idx}`} className="ttf-modal-prize-ticker-phrase">
          <span className="ttf-modal-prize-ticker-label">{item.label}</span>
          <span className="ttf-modal-prize-ticker-sep" aria-hidden>
            ·
          </span>
          <span className="ttf-modal-prize-ticker-detail">{item.detail}</span>
        </li>
      ))}
    </ul>
  )
}

/** Seamless right-to-left prize feature ticker for the homepage modal. */
export function TtfModalPrizeTicker() {
  const reduceMotion = useReducedMotion()
  const items = TRASH_THE_FLOAT.overlay.prizeCallout.ticker

  return (
    <div className="ttf-modal-prize-ticker ttf-modal-prize-ticker--ribbon" role="region" aria-label="Prize details">
      <div
        className={cn(
          'ttf-modal-prize-ticker-track',
          reduceMotion && 'ttf-modal-prize-ticker-track--static',
        )}
      >
        <TickerSet items={items} setKey="a" />
        <TickerSet items={items} setKey="b" />
      </div>
    </div>
  )
}
