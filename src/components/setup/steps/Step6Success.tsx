import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { MONITORING, SENSOR_SETUP_MODEL_CHOICE_HREF } from '../../../config/acdwKnowledge'

interface Step6SuccessProps {
  deviceData: {
    deviceName: string
    location: string
    customerName: string
  }
}

export function Step6Success({ deviceData }: Step6SuccessProps) {
  const navigate = useNavigate()
  
  // Mock sensor status - in real app, this would come from API
  const sensorStatus = {
    led: 'green',
    online: true,
    reporting: true,
    lastReading: 12,
    readingStatus: 'Normal'
  }

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
          <CheckCircleIcon className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Success!</h2>
        <p className="text-lg text-gray-600">
          Your sensor is now set up and connected!
        </p>
      </div>

      {/* Verification Checklist */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Checklist</h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${sensorStatus.led === 'green' ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className="text-gray-700">LED Status: <span className="font-medium">Solid Green</span></span>
          </div>
          
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className={`h-5 w-5 ${sensorStatus.online ? 'text-green-500' : 'text-gray-300'}`} />
            <span className="text-gray-700">Online: <span className="font-medium">Connected</span></span>
          </div>
          
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className={`h-5 w-5 ${sensorStatus.reporting ? 'text-green-500' : 'text-gray-300'}`} />
            <span className="text-gray-700">Reporting: <span className="font-medium">Active</span></span>
          </div>
          
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
            <span className="text-gray-700">
              Last Reading: <span className="font-medium">{sensorStatus.lastReading}%</span> ({sensorStatus.readingStatus})
            </span>
          </div>
        </div>
      </div>

      {/* Device Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Details</h3>
        
        <dl className="space-y-3">
          <div>
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="text-base text-gray-900 mt-1">{deviceData.deviceName}</dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-500">Location</dt>
            <dd className="text-base text-gray-900 mt-1">{deviceData.location}</dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-500">Customer</dt>
            <dd className="text-base text-gray-900 mt-1">{deviceData.customerName}</dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="text-base text-gray-900 mt-1 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>Online</span>
            </dd>
          </div>
        </dl>
      </div>

      {/* Next Steps */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
        
        <ul className="space-y-3">
          <li className="flex items-start space-x-2">
            <ArrowRightIcon className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">View sensor in dashboard</span>
          </li>
          
          <li className="flex items-start space-x-2">
            <ArrowRightIcon className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">Set up additional sensors</span>
          </li>
          
          <li className="flex items-start space-x-2">
            <ArrowRightIcon className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">Configure alert thresholds</span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => window.open(MONITORING.portalUrl, '_blank')}
          className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-md font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
        >
          <span>View Dashboard</span>
          <ArrowRightIcon className="h-5 w-5" />
        </button>
        
        <button
          onClick={() => navigate(SENSOR_SETUP_MODEL_CHOICE_HREF)}
          className="flex-1 bg-white border-2 border-primary-600 text-primary-600 py-3 px-4 rounded-md font-medium hover:bg-primary-50 transition-colors"
        >
          Setup Another Sensor
        </button>
      </div>
    </div>
  )
}

