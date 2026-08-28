import { CustomerTypeSelector } from '../components/home/CustomerTypeSelector'
import { AUDIENCE_SELECTOR } from '../config/audienceCopy'

export function CustomerSelectionPage() {
  return (
    <div className="audience-page audience-page-select">
      <header className="audience-select-header">
        <p className="mini-section-eyebrow">{AUDIENCE_SELECTOR.eyebrow}</p>
        <h1 className="audience-who-title">{AUDIENCE_SELECTOR.title}</h1>
        <p className="audience-who-dek">{AUDIENCE_SELECTOR.dek}</p>
      </header>
      <CustomerTypeSelector showHeader={false} />
    </div>
  )
}
