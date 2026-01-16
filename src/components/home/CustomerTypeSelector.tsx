import { useNavigate } from 'react-router-dom'

// Define types locally to avoid import issues
type CustomerType = 'homeowner' | 'hvac-professional' | 'property-manager' | 'city-official'

interface CustomerTypeConfig {
  type: CustomerType
  title: string
  description: string
  features: string[]
  cta: string
  pricing: 'retail' | 'pro' | 'contact'
}
import { 
  HomeIcon, 
  WrenchScrewdriverIcon, 
  BuildingOfficeIcon 
} from '@heroicons/react/24/outline'

const customerTypes: CustomerTypeConfig[] = [
  {
    type: 'homeowner',
    title: 'Homeowners',
    description: 'Confident DIY homeowners can install the AC Drain Wiz Mini with our step-by-step guidance, while still having the option to partner with a pro if needed.',
    features: [
      'Designed for DIY installation',
      'Optional access to local pros',
      'Clear inspection window',
      'Protects against costly water damage',
      'Maintenance reminders and tips'
    ],
    cta: 'Shop ACDW Mini',
    pricing: 'retail'
  },
  {
    type: 'hvac-professional',
    title: 'Contractors and HVAC Pros',
    description: 'Boost efficiency and increase profitability with bulk pricing and professional tools. Access contractor pricing and bulk ordering.',
    features: [
      '10X faster cleanouts',
      'Bulk pricing (20-pack, 50-pack)',
      'Professional tools and support',
      'Upsell opportunities',
      'IMC code compliance'
    ],
    cta: 'Explore HVAC Pro Solutions',
    pricing: 'contact'
  },
  {
    type: 'property-manager',
    title: 'Property Managers',
    description: 'Protect your portfolio from costly water damage and reduce emergency maintenance calls. Bulk installation and remote monitoring solutions for multi-unit properties.',
    features: [
      'Prevent water damage across your portfolio',
      '24/7 remote monitoring with Sensor',
      'Bulk pricing for multi-unit installations',
      'Reduce emergency maintenance calls',
      'Professional installation support'
    ],
    cta: 'Explore Property Manager Solutions',
    pricing: 'contact'
  },
  {
    type: 'city-official',
    title: 'City & Code Officials',
    description: 'Ensure compliance and proper maintenance access with IMC-approved solutions. Access compliance documentation and demo scheduling.',
    features: [
      'IMC code compliance (307.2.5, 307.2.2, 307.2.1.1)',
      'Clear maintenance access documentation',
      'Approved disposal location references',
      'Non-contact water-level detection',
      'Demo scheduling available'
    ],
    cta: 'View Compliance Solutions',
    pricing: 'contact'
  }
]

const icons = {
  homeowner: HomeIcon,
  'hvac-professional': WrenchScrewdriverIcon,
  'property-manager': BuildingOfficeIcon,
  'city-official': BuildingOfficeIcon
}

export function CustomerTypeSelector() {
  const navigate = useNavigate()

  const handleSelect = (type: CustomerType) => {
    // Store selection in localStorage for session persistence
    localStorage.setItem('customerType', type)
    
    // Navigate based on customer type
    switch (type) {
      case 'homeowner':
        navigate('/homeowner')
        break
      case 'hvac-professional':
        navigate('/hvac-pros')
        break
      case 'property-manager':
        navigate('/property-managers')
        break
      case 'city-official':
        navigate('/code-officials')
        break
    }
  }

  return (
    <div className="customer-selector-main-container">
      <div className="customer-selector-content-wrapper">
        <div className="customer-selector-header">
          <h2 className="customer-selector-title">
            Choose Your Experience
          </h2>
          <p className="customer-selector-description">
            Get a personalized experience tailored to your specific needs. 
            Whether you're a homeowner, HVAC professional, property manager, or city official, 
            we have solutions designed for you.
          </p>
        </div>
        
        <div className="customer-selector-cards-grid">
          {customerTypes.map((config) => {
            const Icon = icons[config.type]
            
            return (
              <div
                key={config.type}
                className="customer-type-card"
              >
                <div className="customer-type-card-header">
                  <div className={`customer-type-icon-wrapper ${
                    config.type === 'homeowner' ? 'customer-type-icon-homeowner' :
                    config.type === 'hvac-professional' ? 'customer-type-icon-hvac' :
                    config.type === 'property-manager' ? 'customer-type-icon-property-manager' :
                    'customer-type-icon-city'
                  }`}>
                    <Icon className="customer-type-icon" />
                  </div>
                  <h3 className="customer-type-title">{config.title}</h3>
                </div>
                
                <p className="customer-type-description">{config.description}</p>
                
                <ul className="customer-type-features-list">
                  {config.features.map((feature, index) => (
                    <li key={index} className="customer-type-feature-item">
                      <svg className="customer-type-feature-checkmark" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleSelect(config.type)}
                  className={`customer-type-cta-button ${
                  config.pricing === 'retail' ? 'customer-type-cta-primary' :
                  config.pricing === 'pro' ? 'customer-type-cta-outline' :
                  'customer-type-cta-secondary'
                }`}
                >
                  {config.cta}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
