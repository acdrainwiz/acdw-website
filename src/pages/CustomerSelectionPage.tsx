import { CustomerTypeSelector } from '../components/home/CustomerTypeSelector'

export function CustomerSelectionPage() {
  return (
    <div>
      {/* Hero Banner */}
      <div className="support-hero">
        <div className="support-hero-content">
          <div className="support-hero-header">
            <h1 className="support-hero-title">Choose Your Experience</h1>
            <p className="support-hero-subtitle">
              Get a personalized experience tailored to your specific needs. 
              Whether you're a homeowner, HVAC professional, or city official, 
              we have solutions designed for you.
            </p>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <CustomerTypeSelector />
        </div>
      </div>
    </div>
  )
}
