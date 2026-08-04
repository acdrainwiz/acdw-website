import { useState } from 'react'

interface Step5DeviceRegistrationProps {
  onComplete: (data: {
    deviceName: string
    location: string
    customerName: string
    isNewCustomer: boolean
    alerts: {
      email: boolean
      sms: boolean
      dailyReport: boolean
    }
  }) => void
}

export function Step5DeviceRegistration({ onComplete }: Step5DeviceRegistrationProps) {
  const [deviceName, setDeviceName] = useState('')
  const [location, setLocation] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [isNewCustomer, setIsNewCustomer] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [alerts, setAlerts] = useState({
    email: true,
    sms: true,
    dailyReport: true
  })
  const [isRegistering, setIsRegistering] = useState(false)

  // Mock existing customers - in real app, this would come from API
  const existingCustomers = [
    'John Smith',
    'Jane Doe',
    'ABC Property Management',
    'XYZ Home Services'
  ]

  const handleAlertToggle = (type: 'email' | 'sms' | 'dailyReport') => {
    setAlerts(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!deviceName || !location || (!isNewCustomer && !selectedCustomer) || (isNewCustomer && !customerName)) {
      return
    }

    setIsRegistering(true)

    // Simulate registration - in real app, this would call API
    setTimeout(() => {
      onComplete({
        deviceName,
        location,
        customerName: isNewCustomer ? customerName : selectedCustomer,
        isNewCustomer,
        alerts
      })
      setIsRegistering(false)
    }, 2000)
  }

  const isFormValid = deviceName && location && (isNewCustomer ? customerName : selectedCustomer)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Register Your Sensor</h2>
        <p className="text-gray-600">
          Provide device information and assign it to a customer. The sensor has been automatically registered to your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Device Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Device Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                placeholder="e.g., Main Floor AC Unit"
                className="input w-full"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Give it a memorable name for easy identification</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location/Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="123 Main St, City, ST 12345"
                className="input w-full"
                required
              />
            </div>
          </div>
        </div>

        {/* Customer Assignment */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Assignment</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer/Homeowner Name <span className="text-red-500">*</span>
              </label>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="customerType"
                    checked={!isNewCustomer}
                    onChange={() => setIsNewCustomer(false)}
                    className="text-primary-600"
                  />
                  <span className="text-sm text-gray-700">Select existing customer</span>
                </label>
                
                {!isNewCustomer && (
                  <select
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    className="input w-full"
                    required={!isNewCustomer}
                  >
                    <option value="">Choose a customer...</option>
                    {existingCustomers.map((customer) => (
                      <option key={customer} value={customer}>
                        {customer}
                      </option>
                    ))}
                  </select>
                )}

                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="customerType"
                    checked={isNewCustomer}
                    onChange={() => setIsNewCustomer(true)}
                    className="text-primary-600"
                  />
                  <span className="text-sm text-gray-700">Create new customer</span>
                </label>
                
                {isNewCustomer && (
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    className="input w-full"
                    required={isNewCustomer}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Alert Preferences */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Preferences</h3>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={alerts.email}
                onChange={() => handleAlertToggle('email')}
                className="rounded border-gray-300 text-primary-600"
              />
              <span className="text-gray-700">Email alerts</span>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={alerts.sms}
                onChange={() => handleAlertToggle('sms')}
                className="rounded border-gray-300 text-primary-600"
              />
              <span className="text-gray-700">SMS alerts</span>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={alerts.dailyReport}
                onChange={() => handleAlertToggle('dailyReport')}
                className="rounded border-gray-300 text-primary-600"
              />
              <span className="text-gray-700">Daily reports</span>
            </label>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              Alerts will be sent to your contractor account. You can share them with customers to schedule preventive visits.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isRegistering}
          className={`
            w-full py-3 px-4 rounded-md font-medium transition-colors
            ${!isFormValid || isRegistering
              ? 'btn bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'btn-primary'
            }
          `}
        >
          {isRegistering ? 'Registering device...' : 'Register Device'}
        </button>
      </form>
    </div>
  )
}

