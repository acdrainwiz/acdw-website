import { useState, useEffect } from 'react'
import { PrerequisiteModal } from '../PrerequisiteModal'
import { MONITORING } from '../../../config/acdwKnowledge'

export function Step1CreateAccount() {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Check if user has dismissed the modal for this session
    const dismissed = sessionStorage.getItem('sensor-setup-prerequisite-dismissed')
    if (!dismissed) {
      // Small delay to ensure smooth modal appearance
      const timer = setTimeout(() => {
        setShowModal(true)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [])
  const substeps = [
    {
      number: 1,
      title: 'Create User Account',
      description: (
        <>
          Go to the{' '}
          <a
            href={MONITORING.signUpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="sensor-setup-account-step-link"
          >
            sign up page
          </a>
          {' '}and fill out the registration form with your first name, last name, email, and password to get started.
        </>
      ),
      image: '/images/setup/step1-1-signup.png',
      alt: 'ACDW Monitor sign-up form'
    },
    {
      number: 2,
      title: 'Verify Your Email',
      description: 'Check your email inbox for an email verification code from AC Drain Wiz. Copy and paste the code into the verification screen input to verify your email address and activate your account.',
      image: '/images/setup/step1-2-verify-email.png',
      alt: 'Email verification message'
    },
    {
      number: 3,
      title: 'Create Company Profile',
      description: 'After email verification, you\'ll be prompted to create your company profile. Enter your contracting company details.',
      image: '/images/setup/step1-3-company-profile.png',
      alt: 'Company profile creation form'
    },
    {
      number: 4,
      title: 'Create Client',
      description: 'Create a profile for the customer where you\'ll be installing one or more AC Drain Wiz Sensors. Enter their name and contact information. Note: If your customer has more than one address where you will be installing the AC Drain Wiz Sensor, you will have the ability to add multiple addresses which will be associated to your customer.',
      image: '/images/setup/step1-4-create-client.png',
      alt: 'Client creation form'
    }
  ]

  return (
    <>
      {/* Prerequisite Modal */}
      <PrerequisiteModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

      <div className="sensor-setup-step-container">
        {/* Step Number Badge */}
      <div className="sensor-setup-step-badge-wrapper">
        <div className="sensor-setup-step-badge">
          <span className="sensor-setup-step-badge-number">1</span>
        </div>
      </div>

      {/* Step Title */}
      <div className="sensor-setup-step-title-section">
        <h2 className="sensor-setup-step-title">Create Account</h2>
        <p className="sensor-setup-step-subtitle">
          Set up your account before installing your first AC Drain Wiz Sensor at a customer's home
        </p>
      </div>

      {/* Account Setup Steps */}
      <div className="sensor-setup-account-steps">
        {substeps.map((substep) => (
          <div key={substep.number} className="sensor-setup-account-step-card">
            <div className="sensor-setup-account-step-content">
              {/* Step Number */}
              <div className="sensor-setup-account-step-number-wrapper">
                <div className="sensor-setup-account-step-number-badge">
                  <span className="sensor-setup-account-step-number">{substep.number}</span>
                </div>
              </div>

              {/* Content */}
              <div className="sensor-setup-account-step-details">
                <h3 className="sensor-setup-account-step-title">{substep.title}</h3>
                <p className="sensor-setup-account-step-description">
                  {substep.description}
                </p>
                
                {/* Screenshot Image */}
                <div className="sensor-setup-account-step-image-wrapper">
                  <img
                    src={substep.image}
                    alt={substep.alt}
                    className="sensor-setup-account-step-image"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  )
}

