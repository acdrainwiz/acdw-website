import { useState } from 'react'
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface Step1PrerequisitesProps {
  onComplete: (data: { miniInstalled: boolean; hasAccount: boolean }) => void
}

export function Step1Prerequisites({ onComplete }: Step1PrerequisitesProps) {
  const [miniInstalled, setMiniInstalled] = useState(false)
  const [hasAccount, setHasAccount] = useState(false)

  const handleCheckboxChange = (type: 'mini' | 'account', checked: boolean) => {
    if (type === 'mini') {
      setMiniInstalled(checked)
    } else {
      setHasAccount(checked)
    }

    // Notify parent of completion status
    onComplete({
      miniInstalled: type === 'mini' ? checked : miniInstalled,
      hasAccount: type === 'account' ? checked : hasAccount
    })
  }

  const isComplete = miniInstalled && hasAccount

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Prerequisites</h2>
        <p className="text-gray-600">
          Before setting up your sensor, please verify the following requirements are met.
        </p>
      </div>

      {/* Prerequisites Checklist */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Prerequisites Checklist</h3>
        
        {/* Mini Installed */}
        <div className="flex items-start space-x-3">
          <button
            onClick={() => handleCheckboxChange('mini', !miniInstalled)}
            className={`
              flex-shrink-0 mt-1 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors
              ${miniInstalled
                ? 'bg-primary-600 border-primary-600'
                : 'border-gray-300 hover:border-primary-400'
              }
            `}
          >
            {miniInstalled && <CheckCircleIcon className="h-5 w-5 text-white" />}
          </button>
          <div className="flex-1">
            <label className="text-base font-medium text-gray-900 cursor-pointer" onClick={() => handleCheckboxChange('mini', !miniInstalled)}>
              Transparent T-Manifold Installed
            </label>
            <p className="text-sm text-gray-600 mt-1">
              The Transparent T-Manifold must be installed by the AC technician before sensor setup.
            </p>
            {!miniInstalled && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex items-start space-x-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-amber-800">
                      The Transparent T-Manifold must be installed by the AC technician before sensor setup;{' '}
                      <a
                        href="/mini-setup"
                        className="text-sm text-amber-700 hover:text-amber-900 underline inline"
                      >
                        view installation steps in the Mini Setup Guide →
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Account Check */}
        <div className="flex items-start space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => handleCheckboxChange('account', !hasAccount)}
            className={`
              flex-shrink-0 mt-1 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors
              ${hasAccount
                ? 'bg-primary-600 border-primary-600'
                : 'border-gray-300 hover:border-primary-400'
              }
            `}
          >
            {hasAccount && <CheckCircleIcon className="h-5 w-5 text-white" />}
          </button>
          <div className="flex-1">
            <label className="text-base font-medium text-gray-900 cursor-pointer" onClick={() => handleCheckboxChange('account', !hasAccount)}>
              ACDW Sensor Admin Account
            </label>
            <p className="text-sm text-gray-600 mt-1">
              You need an active contractor account to register and manage sensors.
            </p>
            {!hasAccount && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-start space-x-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-800">
                      Don't have an account yet?
                    </p>
                    <a
                      href="https://monitor.acdrainwiz.com/sign-up"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-700 hover:text-blue-900 underline mt-1 inline-block"
                    >
                      Sign up at monitor.acdrainwiz.com →
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* What You'll Need */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">📦</span>
          What You'll Need
        </h3>
        <ul className="space-y-2">
          <li className="flex items-start space-x-2">
            <span className="text-primary-600 mt-1">•</span>
            <span className="text-gray-700">ACDW Sensor (unboxed)</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-primary-600 mt-1">•</span>
            <span className="text-gray-700">Battery (if using battery model)</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-primary-600 mt-1">•</span>
            <span className="text-gray-700">DC cable (if using DC model)</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-primary-600 mt-1">•</span>
            <span className="text-gray-700">Smartphone or tablet</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-primary-600 mt-1">•</span>
            <span className="text-gray-700">Homeowner Wi-Fi password</span>
          </li>
        </ul>
      </div>

      {/* Completion Status */}
      {isComplete && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-5 w-5 text-green-600" />
            <p className="text-sm font-medium text-green-800">
              All prerequisites met! You're ready to proceed.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

