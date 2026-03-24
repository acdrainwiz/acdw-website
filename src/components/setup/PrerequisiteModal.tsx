import { useEffect, useState } from 'react'
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { MONITORING } from '../../config/acdwKnowledge'

interface PrerequisiteModalProps {
  isOpen: boolean
  onClose: () => void
  /** WiFi: monitoring/dashboard emphasis. Standard: overflow protection, no Wi‑Fi pairing. */
  variant?: 'wifi' | 'standard'
}

export function PrerequisiteModal({ isOpen, onClose, variant = 'wifi' }: PrerequisiteModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [accountCreated, setAccountCreated] = useState(false)

  const handleUnderstand = () => {
    // Store in sessionStorage so it doesn't show again this session
    sessionStorage.setItem('sensor-setup-prerequisite-dismissed', 'true')
    if (accountCreated) {
      sessionStorage.setItem('sensor-setup-prerequisite-dismiss-reason', 'account-created')
    }
    onClose()
  }

  useEffect(() => {
    if (isOpen) {
      // Small delay for animation
      setTimeout(() => setIsVisible(true), 10)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    } else {
      setIsVisible(false)
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleUnderstand()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="sensor-setup-prerequisite-modal-overlay">
      <div 
        className={`sensor-setup-prerequisite-modal ${isVisible ? 'sensor-setup-prerequisite-modal-visible' : ''}`}
      >
        <div className="sensor-setup-prerequisite-modal-content">
          {/* Close button */}
          <button
            onClick={handleUnderstand}
            className="sensor-setup-prerequisite-modal-close"
            aria-label="Close"
          >
            <XMarkIcon className="sensor-setup-prerequisite-modal-close-icon" />
          </button>

          {/* Icon */}
          <div className="sensor-setup-prerequisite-modal-icon-wrapper">
            <ExclamationTriangleIcon className="sensor-setup-prerequisite-modal-icon" />
          </div>

          {/* Title */}
          <h2 className="sensor-setup-prerequisite-modal-title">
            {variant === 'standard'
              ? 'Important: Complete your contractor account first'
              : 'Important: Complete Account Setup First'}
          </h2>

          {/* Message */}
          <div className="sensor-setup-prerequisite-modal-message">
            <p className="sensor-setup-prerequisite-modal-text">
              {variant === 'standard'
                ? 'Before you install a Standard Sensor Switch (Non-WiFi), complete your contractor account in the ACDW portal. This model does not connect to Wi‑Fi; the account is used to register the install and assign the sensor to your customer in a later step.'
                : 'Before you visit a customer\'s home to install a WiFi Sensor Switch, you must complete your account setup for remote monitoring and alerts.'}
            </p>
            <p className="sensor-setup-prerequisite-modal-text">
              This includes:
            </p>
            <ul className="sensor-setup-prerequisite-modal-list">
              <li className="sensor-setup-prerequisite-modal-list-item">
                {variant === 'standard'
                  ? 'Creating your ACDW contractor account'
                  : 'Creating your Sensor Monitoring account'}
              </li>
              <li className="sensor-setup-prerequisite-modal-list-item">
                Verifying your email
              </li>
              <li className="sensor-setup-prerequisite-modal-list-item">
                Setting up your company profile
              </li>
              <li className="sensor-setup-prerequisite-modal-list-item">
                Creating a customer profile for the installation location
              </li>
            </ul>
            <p className="sensor-setup-prerequisite-modal-text sensor-setup-prerequisite-modal-text-emphasis">
              Having your account and customer profile ready will make the installation process much smoother and faster.
            </p>
            <div className="sensor-setup-prerequisite-modal-signup-link-wrapper">
              <a
                href={MONITORING.signUpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="sensor-setup-prerequisite-modal-signup-link"
              >
                {variant === 'standard' ? 'Open sign-up page →' : 'Create Sensor Monitoring account →'}
              </a>
            </div>
          </div>

          {/* Checkbox: set preference before dismissing */}
          <div className="sensor-setup-prerequisite-modal-checkbox-wrapper">
            <label className="sensor-setup-prerequisite-modal-checkbox-label">
              <input
                type="checkbox"
                checked={accountCreated}
                onChange={(e) => setAccountCreated(e.target.checked)}
                className="sensor-setup-prerequisite-modal-checkbox"
              />
              <span className="sensor-setup-prerequisite-modal-checkbox-text">
                I&apos;ve completed account setup and created a customer profile. Don&apos;t show this again.
              </span>
            </label>
          </div>

          {/* Action Button */}
          <div className="sensor-setup-prerequisite-modal-actions">
            <button
              onClick={handleUnderstand}
              className="sensor-setup-prerequisite-modal-button sensor-setup-prerequisite-modal-button-primary"
            >
              Ok I understand
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

