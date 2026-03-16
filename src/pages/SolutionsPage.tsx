import { CheckIcon, ClockIcon, WrenchScrewdriverIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'

export function SolutionsPage() {
  const solutions = [
    {
      id: 'residential',
      title: 'Residential HVAC',
      description: 'Perfect for single-family homes, condominiums, and apartments with 3/4" condensate lines.',
      icon: BuildingOfficeIcon,
      features: [
        'One-time installation eliminates repeated cutting',
        'Clear visual inspection of drain lines',
        'Installs in 5 minutes or less',
        'Prevents costly water damage',
        'Increases home value and peace of mind'
      ],
      benefits: [
        'Reduced maintenance costs',
        'Improved system efficiency',
        'Professional installation support',
        'IMC code compliance'
      ],
      pricing: 'Starting at $59.99 MSRP',
      status: 'Available Now'
    },
    {
      id: 'commercial',
      title: 'Light Commercial',
      description: 'Scalable solutions for select commercial installations including small offices and retail spaces.',
      icon: BuildingOfficeIcon,
      features: [
        'Scalable installation across multiple units',
        'Bulk pricing for commercial projects',
        'Professional contractor support',
        'Compliance documentation',
        'Custom installation planning'
      ],
      benefits: [
        'Reduced maintenance overhead',
        'Improved tenant satisfaction',
        'Professional project management',
        'Bulk purchasing discounts'
      ],
      pricing: 'Volume pricing available',
      status: 'Available Now'
    },
    {
      id: 'municipal',
      title: 'Municipal & Code Compliance',
      description: 'Comprehensive solutions for city officials and code compliance with proper documentation and approvals.',
      icon: CheckIcon,
      features: [
        'IMC code compliance (307.2.5, 307.2.2, 307.2.1.1)',
        'Approved disposal location references',
        'Maintenance access documentation',
        'Code official training materials',
        'Compliance reporting tools'
      ],
      benefits: [
        'Streamlined permit approval',
        'Reduced compliance issues',
        'Professional documentation',
        'Training and support programs'
      ],
      pricing: 'Contact for municipal pricing',
      status: 'Available Now'
    }
  ]

  const productEvolution = [
    {
      stage: 'Core 1.0',
      status: 'Available Now',
      description: 'Basic maintenance access with clear visual inspection',
      features: ['One-time installation', 'Clear body design', '3/4" compatibility']
    },
    {
      stage: 'Mini',
      status: 'Coming Soon',
      description: 'Compact design with attachment system for all services',
      features: ['Bayonet port system', 'Bi-directional valve', 'Attachment compatibility']
    },
    {
      stage: 'Sensor',
      status: 'Coming Soon',
      description: 'Smart monitoring with Wi-Fi alerts and daily reporting',
      features: ['No-contact sensing', 'Wi-Fi connectivity', 'AC shutoff capability']
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Banner */}
      <div className="support-hero">
        <div className="support-hero-content">
          <div className="support-hero-header">
            <h1 className="support-hero-title">AC Drain Wiz Solutions</h1>
            <p className="support-hero-subtitle">
              Comprehensive AC drain line maintenance solutions designed for different markets and applications. 
              From residential homes to commercial buildings and municipal systems.
            </p>
            <div className="support-hero-badge-row">
              <span className="support-hero-badge">Residential</span>
              <span className="support-hero-badge">Light Commercial</span>
              <span className="support-hero-badge">Municipal</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Solutions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {solutions.map((solution) => (
            <div key={solution.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Solution Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <solution.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{solution.title}</h3>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {solution.status}
                  </span>
                </div>
                <p className="text-gray-600">{solution.description}</p>
              </div>

              {/* Features */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                <ul className="space-y-2">
                  {solution.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <h4 className="font-semibold text-gray-900 mb-3">Benefits</h4>
                <ul className="space-y-2">
                  {solution.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing & CTA */}
              <div className="p-6 border-t border-gray-200">
                <div className="mb-4">
                  <h5 className="font-semibold text-gray-900 mb-1">Pricing</h5>
                  <p className="text-sm text-gray-600">{solution.pricing}</p>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Product Evolution */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="heading-2 mb-8 text-center">Product Evolution & Roadmap</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {productEvolution.map((product) => (
              <div key={product.stage} className="text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  product.status === 'Available Now' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {product.status === 'Available Now' ? (
                    <CheckIcon className="h-10 w-10 text-green-600" />
                  ) : (
                    <ClockIcon className="h-10 w-10 text-blue-600" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.stage}</h3>
                <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                <div className="space-y-2">
                  {product.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="text-sm text-gray-500">
                      • {feature}
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    product.status === 'Available Now' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {product.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose AC Drain Wiz */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="heading-2 mb-8 text-center">Why Choose AC Drain Wiz?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <WrenchScrewdriverIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Professional Grade</h3>
              <p className="text-sm text-gray-600">
                Built for HVAC professionals with industry-standard materials and construction
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Code Compliant</h3>
              <p className="text-sm text-gray-600">
                Meets IMC code requirements for maintenance access and approved disposal locations
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Time Saving</h3>
              <p className="text-sm text-gray-600">
                35% faster cleanouts with streamlined maintenance process and clear visual inspection
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
