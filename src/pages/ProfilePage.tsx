/**
 * Profile Page
 * 
 * Allows users to edit their profile information.
 * 
 * Best Practices:
 * - Name, Company, Phone: Editable by user
 * - Email: Editable but requires verification
 * - Password: Separate section with security best practices
 * - Role: Read-only (admin-only changes)
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { 
  UserIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  LockClosedIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  MapPinIcon,
  EyeIcon,
  EyeSlashIcon,
  SparklesIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import { useAuth } from '../contexts/AuthContext'

function ProfileContent() {
  const { user: authUser } = useAuth()
  const { user: clerkUser } = useUser()
  const navigate = useNavigate()
  
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Get address from metadata
  const addressMetadata = (clerkUser?.unsafeMetadata?.address || clerkUser?.publicMetadata?.address) as {
    street1?: string
    street2?: string
    city?: string
    state?: string
    zip?: string
    country?: string
  } | undefined

  const [formData, setFormData] = useState({
    firstName: clerkUser?.firstName || '',
    lastName: clerkUser?.lastName || '',
    email: clerkUser?.primaryEmailAddress?.emailAddress || '',
    company: (clerkUser?.unsafeMetadata?.company || clerkUser?.publicMetadata?.company) as string || '',
    phone: clerkUser?.primaryPhoneNumber?.phoneNumber || '',
    street1: addressMetadata?.street1 || '',
    street2: addressMetadata?.street2 || '',
    city: addressMetadata?.city || '',
    state: addressMetadata?.state || '',
    zip: addressMetadata?.zip || '',
    country: addressMetadata?.country || 'US',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setSuccessMessage('')
    setErrorMessage('')
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
    setSuccessMessage('')
    setErrorMessage('')
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      if (!clerkUser) {
        throw new Error('User not found')
      }

      // Validate passwords match
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('New passwords do not match')
      }

      // Validate password strength (basic check)
      if (passwordData.newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters long')
      }

      // Update password using Clerk
      await clerkUser.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })

      setSuccessMessage('Password changed successfully!')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowPasswordSection(false)
      
      setTimeout(() => {
        setSuccessMessage('')
      }, 3000)
    } catch (error) {
      console.error('Password change error:', error)
      const e = error as { errors?: Array<{ message?: string }>; message?: string }
      setErrorMessage(e.errors?.[0]?.message || e.message || 'Failed to change password. Please check your current password and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      if (!clerkUser) {
        throw new Error('User not found')
      }

      // Update name
      await clerkUser.update({
        firstName: formData.firstName,
        lastName: formData.lastName,
      })

      // Update company in metadata
      await clerkUser.update({
        unsafeMetadata: {
          ...clerkUser.unsafeMetadata,
          company: formData.company || undefined,
          address: {
            street1: formData.street1 || undefined,
            street2: formData.street2 || undefined,
            city: formData.city || undefined,
            state: formData.state || undefined,
            zip: formData.zip || undefined,
            country: formData.country || 'US',
          },
        },
      })

      // Update phone if provided
      if (formData.phone) {
        // Note: Phone updates may require verification in Clerk
        // This is a simplified version - you may need to handle phone verification
      }

      setSuccessMessage('Profile updated successfully!')
      
      // Refresh user data
      await clerkUser.reload()
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('')
        navigate('/dashboard')
      }, 2000)
    } catch (error) {
      console.error('Profile update error:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="profile-page-container">
      <div className="profile-page-wrapper">
        <div className="profile-page-content">
          {/* Header */}
          <div className="profile-page-header">
            <button
              onClick={() => navigate('/dashboard')}
              className="profile-page-back-button"
            >
              <ArrowLeftIcon className="profile-page-back-icon" />
              Back to Dashboard
            </button>
            <h1 className="profile-page-title">Edit Profile</h1>
            <p className="profile-page-subtitle">
              Update your account information and preferences
            </p>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="profile-page-message profile-page-message-success">
              <CheckCircleIcon className="profile-page-message-icon" />
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="profile-page-message profile-page-message-error">
              <XCircleIcon className="profile-page-message-icon" />
              {errorMessage}
            </div>
          )}

          {/* Profile Completion Incentive */}
          {(!formData.phone || !formData.street1 || !formData.city) && (
            <div className="profile-page-incentive-banner">
              <div className="profile-page-incentive-content">
                <div className="profile-page-incentive-icon-wrapper">
                  <SparklesIcon className="profile-page-incentive-icon" />
                </div>
                <div className="profile-page-incentive-text">
                  <h3 className="profile-page-incentive-title">Complete Your Profile for Faster Checkout</h3>
                  <p className="profile-page-incentive-description">
                    Save your phone number and {authUser?.role === 'homeowner' ? 'home address' : 'business address'} now to skip data entry during checkout. 
                    Your information will be pre-filled automatically, making future purchases quick and easy.
                  </p>
                  <div className="profile-page-incentive-benefits">
                    <div className="profile-page-incentive-benefit">
                      <ClockIcon className="profile-page-incentive-benefit-icon" />
                      <span>Faster checkout process</span>
                    </div>
                    <div className="profile-page-incentive-benefit">
                      <CheckCircleIcon className="profile-page-incentive-benefit-icon" />
                      <span>Pre-filled shipping information</span>
                    </div>
                    <div className="profile-page-incentive-benefit">
                      <CheckCircleIcon className="profile-page-incentive-benefit-icon" />
                      <span>Order updates via phone/SMS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Form - Two Column Layout */}
          <form onSubmit={handleSubmit} className="profile-page-form">
            <div className="profile-page-form-layout">
              {/* Left Column - Primary Information */}
              <div className="profile-page-form-column profile-page-form-column-primary">
                {/* Personal Information Section */}
                <div className="profile-page-section">
                  <h2 className="profile-page-section-title">Personal Information</h2>
                  
                  <div className="profile-page-form-grid">
                    <div className="profile-page-form-field">
                      <label htmlFor="firstName" className="profile-page-form-label">
                        <UserIcon className="profile-page-form-label-icon" />
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="profile-page-form-input"
                        placeholder="John"
                      />
                    </div>

                    <div className="profile-page-form-field">
                      <label htmlFor="lastName" className="profile-page-form-label">
                        <UserIcon className="profile-page-form-label-icon" />
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="profile-page-form-input"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="profile-page-section">
                  <h2 className="profile-page-section-title">Contact Information</h2>
                  
                  <div className="profile-page-form-field">
                    <label htmlFor="email" className="profile-page-form-label">
                      <EnvelopeIcon className="profile-page-form-label-icon" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="profile-page-form-input profile-page-form-input-disabled"
                    />
                    <p className="profile-page-form-help">
                      Email changes require verification. Contact support to change your email.
                    </p>
                  </div>

                  <div className="profile-page-form-field">
                    <label htmlFor="phone" className="profile-page-form-label">
                      <PhoneIcon className="profile-page-form-label-icon" />
                      Phone Number
                      {!formData.phone && (
                        <span className="profile-page-form-label-badge">Recommended</span>
                      )}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="profile-page-form-input"
                      placeholder="+1 (555) 123-4567"
                    />
                    {!formData.phone && (
                      <p className="profile-page-form-help">
                        <ClockIcon className="profile-page-form-help-icon" />
                        Save time during checkout - your phone will be pre-filled automatically
                      </p>
                    )}
                  </div>
                </div>

                {/* Business Information Section */}
                {(authUser?.role === 'hvac_pro' || authUser?.role === 'property_manager') && (
                  <div className="profile-page-section">
                    <h2 className="profile-page-section-title">Business Information</h2>
                    
                    <div className="profile-page-form-field">
                      <label htmlFor="company" className="profile-page-form-label">
                        <BuildingOfficeIcon className="profile-page-form-label-icon" />
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="profile-page-form-input"
                        placeholder="Your Company Name"
                      />
                    </div>
                  </div>
                )}

                {/* Address Information Section */}
                <div className="profile-page-section">
                  <div className="profile-page-section-header">
                    <div>
                      <h2 className="profile-page-section-title">
                        {authUser?.role === 'homeowner' ? 'Home Address' : 'Address Information'}
                      </h2>
                      {(!formData.street1 || !formData.city) && (
                        <p className="profile-page-section-subtitle">
                          Complete your {authUser?.role === 'homeowner' ? 'home address' : 'address'} to enable faster checkout with pre-filled shipping information
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="profile-page-form-field">
                    <label htmlFor="street1" className="profile-page-form-label">
                      <MapPinIcon className="profile-page-form-label-icon" />
                      Street Address
                      {!formData.street1 && (
                        <span className="profile-page-form-label-badge">Recommended</span>
                      )}
                    </label>
                    <input
                      type="text"
                      id="street1"
                      name="street1"
                      value={formData.street1}
                      onChange={handleInputChange}
                      className="profile-page-form-input"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="profile-page-form-field">
                    <label htmlFor="street2" className="profile-page-form-label">
                      <MapPinIcon className="profile-page-form-label-icon" />
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      id="street2"
                      name="street2"
                      value={formData.street2}
                      onChange={handleInputChange}
                      className="profile-page-form-input"
                      placeholder="Apt, Suite, Unit, etc."
                    />
                  </div>

                  <div className="profile-page-form-grid">
                    <div className="profile-page-form-field">
                      <label htmlFor="city" className="profile-page-form-label">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="profile-page-form-input"
                        placeholder="City"
                      />
                    </div>

                    <div className="profile-page-form-field">
                      <label htmlFor="state" className="profile-page-form-label">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="profile-page-form-input"
                        placeholder="State"
                        maxLength={2}
                      />
                      <p className="profile-page-form-help">2-letter state code (e.g., CA, NY, TX)</p>
                    </div>

                    <div className="profile-page-form-field">
                      <label htmlFor="zip" className="profile-page-form-label">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        id="zip"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        className="profile-page-form-input"
                        placeholder="12345"
                        maxLength={10}
                      />
                    </div>

                    <div className="profile-page-form-field">
                      <label htmlFor="country" className="profile-page-form-label">
                        Country
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="profile-page-form-input"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="MX">Mexico</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Form Actions - Mobile/Tablet */}
                <div className="profile-page-actions profile-page-actions-mobile">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="profile-page-button-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="profile-page-button-primary"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>

              {/* Right Column - Secondary Information (Security & Account) */}
              <div className="profile-page-form-column profile-page-form-column-secondary">
                {/* Security Section */}
                <div className="profile-page-section profile-page-section-sidebar">
                  <div className="profile-page-section-header">
                    <h2 className="profile-page-section-title">Security</h2>
                  </div>
                  
                  {!showPasswordSection ? (
                    <div className="profile-page-security-summary">
                      <p className="profile-page-security-description">
                        Change your password to keep your account secure
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowPasswordSection(true)}
                        className="profile-page-button-secondary profile-page-button-small"
                      >
                        Change Password
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handlePasswordSubmit} className="profile-page-password-form">
                      <div className="profile-page-form-field">
                        <label htmlFor="currentPassword" className="profile-page-form-label">
                          <LockClosedIcon className="profile-page-form-label-icon" />
                          Current Password
                        </label>
                        <div className="profile-page-form-password-wrapper">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            id="currentPassword"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="profile-page-form-input"
                            placeholder="Enter your current password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="profile-page-form-password-toggle"
                          >
                            {showCurrentPassword ? (
                              <EyeSlashIcon className="profile-page-form-password-toggle-icon" />
                            ) : (
                              <EyeIcon className="profile-page-form-password-toggle-icon" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="profile-page-form-field">
                        <label htmlFor="newPassword" className="profile-page-form-label">
                          <LockClosedIcon className="profile-page-form-label-icon" />
                          New Password
                        </label>
                        <div className="profile-page-form-password-wrapper">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            id="newPassword"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="profile-page-form-input"
                            placeholder="Enter your new password"
                            required
                            minLength={8}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="profile-page-form-password-toggle"
                          >
                            {showNewPassword ? (
                              <EyeSlashIcon className="profile-page-form-password-toggle-icon" />
                            ) : (
                              <EyeIcon className="profile-page-form-password-toggle-icon" />
                            )}
                          </button>
                        </div>
                        <p className="profile-page-form-help">Must be at least 8 characters long</p>
                      </div>

                      <div className="profile-page-form-field">
                        <label htmlFor="confirmPassword" className="profile-page-form-label">
                          <LockClosedIcon className="profile-page-form-label-icon" />
                          Confirm New Password
                        </label>
                        <div className="profile-page-form-password-wrapper">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="profile-page-form-input"
                            placeholder="Confirm your new password"
                            required
                            minLength={8}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="profile-page-form-password-toggle"
                          >
                            {showConfirmPassword ? (
                              <EyeSlashIcon className="profile-page-form-password-toggle-icon" />
                            ) : (
                              <EyeIcon className="profile-page-form-password-toggle-icon" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="profile-page-password-actions">
                        <button
                          type="button"
                          onClick={() => {
                            setShowPasswordSection(false)
                            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                            setErrorMessage('')
                          }}
                          className="profile-page-button-secondary profile-page-button-small"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="profile-page-button-primary profile-page-button-small"
                        >
                          {isLoading ? 'Updating...' : 'Update Password'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Account Information Section */}
                <div className="profile-page-section profile-page-section-sidebar">
                  <h2 className="profile-page-section-title">Account Information</h2>
                  
                  <div className="profile-page-form-field">
                    <label className="profile-page-form-label">
                      <LockClosedIcon className="profile-page-form-label-icon" />
                      Account Role
                    </label>
                    <div className="profile-page-form-readonly">
                      {authUser?.role.replace('_', ' ')}
                    </div>
                    <p className="profile-page-form-help">
                      Role cannot be changed. Contact support if you need to update your account type.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions - Desktop */}
            <div className="profile-page-actions profile-page-actions-desktop">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="profile-page-button-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="profile-page-button-primary"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}

