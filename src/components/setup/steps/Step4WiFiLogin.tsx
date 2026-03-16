import { useState, useEffect } from 'react'
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { MONITORING } from '../../../config/acdwKnowledge'

interface Step4WiFiLoginProps {
  onComplete: (data: {
    wifiConnected: boolean
    loggedIn: boolean
    deviceRegistration: {
      deviceName: string
      location: string
      customerName: string
      isNewCustomer: boolean
      alerts: {
        email: boolean
        sms: boolean
        dailyReport: boolean
      }
    }
  }) => void
}

export function Step4WiFiLogin({ onComplete }: Step4WiFiLoginProps) {
  const [step1Complete, setStep1Complete] = useState(false)
  const [step2Complete, setStep2Complete] = useState(false)
  const [step3Complete, setStep3Complete] = useState(false)
  const [step4Complete, setStep4Complete] = useState(false)

  const allStepsComplete = step1Complete && step2Complete && step3Complete && step4Complete

  // Update parent when all steps complete
  useEffect(() => {
    if (allStepsComplete) {
      // Mock device registration data - in real app, this would come from the phone's captive portal
      onComplete({
        wifiConnected: true,
        loggedIn: true,
        deviceRegistration: {
          deviceName: 'Sensor Device',
          location: 'Installation Location',
          customerName: 'Customer Name',
          isNewCustomer: false,
          alerts: {
            email: true,
            sms: true,
            dailyReport: true
          }
        }
      })
    }
  }, [allStepsComplete, onComplete])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect to Wi-Fi & Login</h2>
        <p className="text-gray-600">
          Follow these steps on your device to connect the sensor to the homeowner's Wi-Fi network and log in to your account.
        </p>
      </div>

      {/* Sub-step 4.1: Connect to Sensor */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-semibold
              ${step1Complete
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
              }
            `}>
              {step1Complete ? <CheckCircleIcon className="h-6 w-6" /> : '1'}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect to Sensor Wi-Fi</h3>
            
            <div className="mb-4">
              <p className="text-gray-700 mb-3">
                On your device, go to Wi-Fi settings and look for a network named:
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <p className="font-mono text-lg font-semibold text-gray-900">ACDW Sensor (ID)</p>
                <p className="text-sm text-gray-600 mt-1">This is the sensor's pairing network</p>
              </div>
              
              {/* Image placeholder - replace with actual screenshot */}
              <div className="w-full bg-gray-100 rounded-lg mb-4 flex items-center justify-center" style={{ minHeight: '300px' }}>
                <div className="text-center">
                  <p className="text-gray-400 mb-2">[Image: Device Wi-Fi Settings Screen]</p>
                  <p className="text-xs text-gray-500">Shows Wi-Fi settings with "ACDW Sensor (ID)" network visible</p>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-1">Troubleshooting</p>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Can't see the network? Make sure LED is blinking red</li>
                      <li>• Connection keeps dropping? Move closer to the sensor</li>
                      <li>• Once connected, you'll be redirected automatically</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep1Complete(!step1Complete)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${step1Complete
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }
              `}
            >
              <CheckCircleIcon className={`h-5 w-5 ${step1Complete ? 'text-green-600' : 'text-gray-400'}`} />
              <span>{step1Complete ? 'Step completed' : 'I\'ve connected to the sensor Wi-Fi'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-step 4.2: Select Home Wi-Fi */}
      {step1Complete && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold
                ${step2Complete
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                {step2Complete ? <CheckCircleIcon className="h-6 w-6" /> : '2'}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Home Wi-Fi Network</h3>
              
              <div className="mb-4">
                <p className="text-gray-700 mb-3">
                  After connecting to the sensor, you'll be redirected to a setup page. Select the homeowner's Wi-Fi network from the list and enter the password.
                </p>
                
                {/* Image placeholder - replace with actual screenshot */}
                <div className="w-full bg-gray-100 rounded-lg mb-4 flex items-center justify-center" style={{ minHeight: '300px' }}>
                  <div className="text-center">
                    <p className="text-gray-400 mb-2">[Image: Captive Portal Wi-Fi Selection Screen]</p>
                    <p className="text-xs text-gray-500">Shows network list with signal strength and password input field</p>
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> Make sure you have the homeowner's Wi-Fi password ready. The sensor will connect to this network automatically after you enter the password.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setStep2Complete(!step2Complete)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${step2Complete
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }
                `}
              >
                <CheckCircleIcon className={`h-5 w-5 ${step2Complete ? 'text-green-600' : 'text-gray-400'}`} />
                <span>{step2Complete ? 'Step completed' : 'I\'ve selected the Wi-Fi network and entered the password'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-step 4.3: Login */}
      {step2Complete && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold
                ${step3Complete
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                {step3Complete ? <CheckCircleIcon className="h-6 w-6" /> : '3'}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Login to ACDW Sensor Admin</h3>
              
              <div className="mb-4">
                <p className="text-gray-700 mb-3">
                  After the sensor connects to the home Wi-Fi, you'll see a login screen. Enter your ACDW Monitor account credentials.
                </p>
                
                {/* Image placeholder - replace with actual screenshot */}
                <div className="w-full bg-gray-100 rounded-lg mb-4 flex items-center justify-center" style={{ minHeight: '300px' }}>
                  <div className="text-center">
                    <p className="text-gray-400 mb-2">[Image: ACDW Monitor Login Screen]</p>
                    <p className="text-xs text-gray-500">Shows email and password fields with login button</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>What happens next:</strong> Once you log in successfully, the sensor will automatically register to your contractor account.
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-900 mb-1">Don't have an account?</p>
                      <p className="text-sm text-amber-800">
                        <a
                          href={MONITORING.signUpUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-700 hover:text-amber-900 underline"
                        >
                          Sign up at monitor.acdrainwiz.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep3Complete(!step3Complete)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${step3Complete
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }
                `}
              >
                <CheckCircleIcon className={`h-5 w-5 ${step3Complete ? 'text-green-600' : 'text-gray-400'}`} />
                <span>{step3Complete ? 'Step completed' : 'I\'ve logged in successfully'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-step 4.4: Device Registration */}
      {step3Complete && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold
                ${step4Complete
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                {step4Complete ? <CheckCircleIcon className="h-6 w-6" /> : '4'}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Register Device</h3>
              
              <div className="mb-4">
                <p className="text-gray-700 mb-3">
                  After logging in, you'll see a device registration screen. Enter the device name, location, and assign it to a customer.
                </p>
                
                {/* Image placeholder - replace with actual screenshot */}
                <div className="w-full bg-gray-100 rounded-lg mb-4 flex items-center justify-center" style={{ minHeight: '300px' }}>
                  <div className="text-center">
                    <p className="text-gray-400 mb-2">[Image: Device Registration Screen]</p>
                    <p className="text-xs text-gray-500">Shows device name, location, customer selection, and alert preferences</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>What to enter:</strong>
                  </p>
                  <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
                    <li>Device name (e.g., "Main Floor AC Unit")</li>
                    <li>Location/address</li>
                    <li>Customer/homeowner name (select existing or create new)</li>
                    <li>Alert preferences (Email, SMS, Daily reports)</li>
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> Alerts will be sent to your contractor account. You can share them with customers to schedule preventive visits.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setStep4Complete(!step4Complete)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${step4Complete
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }
                `}
              >
                <CheckCircleIcon className={`h-5 w-5 ${step4Complete ? 'text-green-600' : 'text-gray-400'}`} />
                <span>{step4Complete ? 'Step completed' : 'I\'ve registered the device'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completion Status */}
      {allStepsComplete && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-5 w-5 text-green-600" />
            <p className="text-sm font-medium text-green-800">
              Wi-Fi connection, login, and device registration complete! The sensor is now set up and ready.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
