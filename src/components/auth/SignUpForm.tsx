import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSignUp } from '@clerk/clerk-react'
import { 
  EyeIcon, 
  EyeSlashIcon, 
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  LockClosedIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  IdentificationIcon,
  DocumentTextIcon,
  HomeIcon
} from '@heroicons/react/24/outline'
import type { UserRole } from '../../types/auth'
import { US_STATES } from '../../config/usStates'
import { validateLicenseFormat } from '../../config/licenseFormats'
import { validateEIN } from '../../utils/verification'
import { validateEmail } from '../../utils/emailValidation'

interface FieldError {
  [key: string]: string
}

interface PasswordStrength {
  score: number
  feedback: string
  color: string
}

export function SignUpForm() {
  const location = useLocation()
  const navigate = useNavigate()
  const { signUp, setActive } = useSignUp()
  
  // Get role and redirect from URL parameters
  const searchParams = new URLSearchParams(location.search)
  const emailParam = searchParams.get('email')
  const redirectParam = searchParams.get('redirect') || '/dashboard'
  
  // Launch Button Redirect: lock account type to homeowner during launch pause
  const initialRole = 'homeowner' as UserRole
  
  const [formData, setFormData] = useState({
    name: '',
    email: emailParam || '',
    password: '',
    confirmPassword: '',
    role: initialRole,
    company: '',
    // HVAC Pro verification fields
    state: '',
    licenseNumber: '',
    // Property Manager verification fields
    businessTaxId: '',
    acceptTerms: false
  })
  
  const [fieldErrors, setFieldErrors] = useState<FieldError>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [pendingVerification, setPendingVerification] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({ score: 0, feedback: '', color: '' })

  // Role descriptions and benefits
  const roleInfo: Record<UserRole, { title: string; description: string; benefits: string[] }> = {
    homeowner: {
      title: 'Homeowner',
      description: 'Perfect for homeowners looking to protect their AC system',
      benefits: [
        'MSRP pricing on AC Drain Wiz Mini',
        'Easy 5-minute installation',
        'Protect your home from water damage',
        '24/7 monitoring and alerts'
      ]
    },
    hvac_pro: {
      title: 'HVAC Professional',
      description: 'Exclusive contractor pricing and professional resources',
      benefits: [
        'Tiered pricing with volume discounts',
        'Bulk ordering savings',
        'Priority technical support',
        'Marketing materials and co-branding',
        'Access to professional catalog'
      ]
    },
    property_manager: {
      description: 'Special pricing for property management companies',
      title: 'Property Manager',
      benefits: [
        'Best-in-class pricing for property managers',
        'Volume discounts for large orders',
        'Centralized dashboard for multiple properties',
        'Dedicated account management',
        'Custom pricing quotes available'
      ]
    }
  }

  // Calculate password strength
  useEffect(() => {
    if (formData.password.length === 0) {
      setPasswordStrength({ score: 0, feedback: '', color: '' })
      return
    }

    let score = 0
    let feedback = ''

    if (formData.password.length >= 8) score++
    else feedback = 'At least 8 characters'

    if (/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password)) score++
    else if (feedback === '') feedback = 'Mix of uppercase and lowercase'

    if (/\d/.test(formData.password)) score++
    else if (feedback === '') feedback = 'Include numbers'

    if (/[^a-zA-Z0-9]/.test(formData.password)) score++
    else if (feedback === '') feedback = 'Include special characters'

    const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600']
    
    setPasswordStrength({
      score,
      feedback: feedback || strengthLabels[score - 1] || '',
      color: colors[score - 1] || 'bg-gray-300'
    })
  }, [formData.password])

  // Real-time field validation
  const validateField = (name: string, value: string) => {
    const errors: FieldError = { ...fieldErrors }

    switch (name) {
      case 'name':
        if (value.trim().length < 2) {
          errors.name = 'Name must be at least 2 characters'
        } else if (!/^[a-zA-Z\s'-]+$/.test(value)) {
          errors.name = 'Name can only contain letters, spaces, hyphens, and apostrophes'
        } else {
          delete errors.name
        }
        break

      case 'email':
        const emailError = validateEmail(value)
        if (emailError) {
          errors.email = emailError
        } else {
          delete errors.email
        }
        break

      case 'password':
        if (value.length < 8) {
          errors.password = 'Password must be at least 8 characters'
        } else {
          delete errors.password
        }
        break

      case 'confirmPassword':
        if (value !== formData.password) {
          errors.confirmPassword = 'Passwords do not match'
        } else {
          delete errors.confirmPassword
        }
        break

      case 'company':
        if ((formData.role === 'hvac_pro' || formData.role === 'property_manager') && value.trim().length < 2) {
          errors.company = 'Company name is required'
        } else {
          delete errors.company
        }
        break

      case 'state':
        if (formData.role === 'hvac_pro' && !value) {
          errors.state = 'State is required for license verification'
        } else {
          delete errors.state
        }
        break

      case 'licenseNumber':
        if (formData.role === 'hvac_pro') {
          if (!value.trim()) {
            errors.licenseNumber = 'License number is required'
          } else if (formData.state) {
            const validation = validateLicenseFormat(formData.state, value)
            if (!validation.valid) {
              errors.licenseNumber = validation.error || 'Invalid license number format'
            } else {
              delete errors.licenseNumber
            }
          }
        } else {
          delete errors.licenseNumber
        }
        break

      case 'businessTaxId':
        if (formData.role === 'property_manager') {
          const validation = validateEIN(value)
          if (!validation.valid) {
            errors.businessTaxId = validation.error || 'Invalid Business Tax ID format'
          } else {
            delete errors.businessTaxId
          }
        } else {
          delete errors.businessTaxId
        }
        break
    }

    setFieldErrors(errors)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    let processedValue: string | boolean = type === 'checkbox' ? checked : value

    // Auto-format EIN as user types
    if (name === 'businessTaxId' && type !== 'checkbox') {
      let cleaned = value.replace(/\D/g, '')
      if (cleaned.length > 2) {
        cleaned = cleaned.slice(0, 2) + '-' + cleaned.slice(2, 9)
      }
      processedValue = cleaned
    }

    setFormData({
      ...formData,
      [name]: processedValue
    })

    // Real-time validation
    if (type !== 'checkbox') {
      validateField(name, processedValue as string)
    }

    // Re-validate license number when state changes
    if (name === 'state' && formData.licenseNumber) {
      validateField('licenseNumber', formData.licenseNumber)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    const errors: FieldError = {}
    if (!formData.name.trim()) errors.name = 'Name is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    if (!formData.password) errors.password = 'Password is required'
    if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password'
    if ((formData.role === 'hvac_pro' || formData.role === 'property_manager') && !formData.company.trim()) {
      errors.company = 'Company name is required'
    }
    
    // HVAC Pro verification requirements
    if (formData.role === 'hvac_pro') {
      if (!formData.state) {
        errors.state = 'State is required'
      }
      if (!formData.licenseNumber.trim()) {
        errors.licenseNumber = 'License number is required'
      } else if (formData.state) {
        const licenseValidation = validateLicenseFormat(formData.state, formData.licenseNumber)
        if (!licenseValidation.valid) {
          errors.licenseNumber = licenseValidation.error || 'Invalid license number format'
        }
      }
    }
    
    // Property Manager verification requirements
    if (formData.role === 'property_manager') {
      if (!formData.businessTaxId.trim()) {
        errors.businessTaxId = 'Business Tax ID (EIN) is required'
      } else {
        const einValidation = validateEIN(formData.businessTaxId)
        if (!einValidation.valid) {
          errors.businessTaxId = einValidation.error || 'Invalid Business Tax ID format'
        }
      }
    }
    
    if (!formData.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms and conditions'
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setIsLoading(true)

    try {
      if (!signUp) {
        throw new Error('Sign up not available')
      }

      // Create user account
      await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        firstName: formData.name.split(' ')[0],
        lastName: formData.name.split(' ').slice(1).join(' ') || '',
      })

      // Prepare verification data
      const verificationData: any = {
        status: 'pending_verification',
        submittedAt: new Date().toISOString(),
      }

      if (formData.role === 'hvac_pro') {
        verificationData.state = formData.state
        verificationData.licenseNumber = formData.licenseNumber.trim()
      } else if (formData.role === 'property_manager') {
        verificationData.businessTaxId = formData.businessTaxId.trim().replace(/\s/g, '')
      }

      // Set public metadata (role, company, and verification data)
      await signUp.update({
        unsafeMetadata: {
          role: formData.role,
          company: formData.company || undefined,
          verification: verificationData,
        },
      })

      // Send verification email
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      
      setPendingVerification(true)
    } catch (err: any) {
      setFieldErrors({ 
        submit: err.errors?.[0]?.message || 'Registration failed. Please try again.' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})
    setIsLoading(true)

    try {
      if (!signUp) {
        throw new Error('Sign up not available')
      }

      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        navigate(redirectParam)
      } else {
        setFieldErrors({ code: 'Verification incomplete. Please try again.' })
      }
    } catch (err: any) {
      setFieldErrors({ 
        code: err.errors?.[0]?.message || 'Invalid verification code' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (pendingVerification) {
    return (
      <div className="signup-form-verification-container">
        <div className="signup-form-verification-card">
          <div className="signup-form-verification-header">
            <div className="signup-form-verification-icon-wrapper">
              <CheckCircleIcon className="signup-form-success-icon" />
            </div>
            <h2 className="signup-form-verification-title">
              Verify your email
            </h2>
            <p className="signup-form-verification-subtitle">
              We sent a verification code to
            </p>
            <p className="signup-form-verification-email">
              {formData.email}
            </p>
          </div>
          
          <form className="signup-form-verification-form" onSubmit={handleVerification} noValidate>
            <div className="signup-form-verification-field">
              <label htmlFor="code" className="signup-form-verification-label">
                Verification Code
              </label>
              <input
                id="code"
                name="code"
                type="text"
                required
                maxLength={6}
                className={`signup-form-verification-input ${
                  fieldErrors.code ? 'input-error' : ''
                }`}
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                  setFieldErrors({})
                }}
              />
              {fieldErrors.code && (
                <p className="field-error-message">{fieldErrors.code}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || verificationCode.length !== 6}
              className="signup-form-verification-submit-button"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Verify Email'
              )}
            </button>
          </form>
        </div>
      </div>
    )
  }

  const currentRoleInfo = roleInfo[formData.role]

  return (
    <div className="signup-form-page-container">
      <div className="signup-form-page-wrapper">
        <div className="signup-form-card">
          <div className="signup-form-layout">
            {/* Left Side - Form */}
            <div className="signup-form-section">
              <div className="signup-form-header-section">
                <div className="signup-form-title-wrapper">
                  <ShieldCheckIcon className="signup-form-header-icon" />
                  <h1 className="signup-form-title">
                    Create Your Account
                  </h1>
                </div>
                <p className="signup-form-subtitle">
                  Join thousands of professionals protecting properties with AC Drain Wiz
                </p>
              </div>
              
              {/* Account Type Selection - Accordion Style */}
              <div className="signup-account-type-section">
                <label className="signup-account-type-label">
                  Account Type <span className="text-red-500">*</span>
                </label>
                {/* Launch Button Redirect: homeowner-only account type during launch pause */}
                <div className="signup-account-type-accordion">
                  <div
                    className={`signup-account-type-accordion-item signup-account-type-accordion-expanded signup-account-type-accordion-selected`}
                    aria-disabled="true"
                  >
                    <div className="signup-account-type-accordion-header">
                      <div className="signup-account-type-accordion-left">
                        <div className="signup-account-type-icon-wrapper signup-account-type-icon-homeowner">
                          <HomeIcon className="signup-account-type-icon" />
                        </div>
                        <h3 className="signup-account-type-accordion-title">Homeowner</h3>
                      </div>
                      <div className="signup-account-type-accordion-right">
                        <CheckCircleIcon className="signup-account-type-accordion-checkmark" />
                      </div>
                    </div>
                    <div className="signup-account-type-accordion-content">
                      <p className="signup-account-type-accordion-description">
                        Perfect for protecting your home
                      </p>
                    </div>
                  </div>
                </div>
                {fieldErrors.role && (
                  <p className="field-error-message">{fieldErrors.role}</p>
                )}
              </div>

              <form className="signup-form" onSubmit={handleSubmit} noValidate>
                {/* Full Name */}
                <div className="signup-form-field">
                  <label htmlFor="name" className="signup-form-field-label">
                    <div className="signup-form-label-content">
                      <UserIcon className="signup-form-label-icon" />
                      Full Name
                    </div>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className={`signup-form-input ${
                      fieldErrors.name ? 'input-error' : ''
                    }`}
                    placeholder="John Smith"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={(e) => validateField('name', e.target.value)}
                  />
                  {fieldErrors.name && (
                    <p className="field-error-message">{fieldErrors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="signup-form-field">
                  <label htmlFor="email" className="signup-form-field-label">
                    <div className="signup-form-label-content">
                      <EnvelopeIcon className="signup-form-label-icon" />
                      Email Address
                    </div>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`signup-form-input ${
                      fieldErrors.email ? 'input-error' : ''
                    }`}
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={(e) => validateField('email', e.target.value)}
                  />
                  {fieldErrors.email && (
                    <p className="field-error-message">{fieldErrors.email}</p>
                  )}
                </div>

                {/* Company (conditional) */}
                {(formData.role === 'hvac_pro' || formData.role === 'property_manager') && (
                  <div className="signup-form-field">
                    <label htmlFor="company" className="signup-form-field-label">
                      <div className="signup-form-label-content">
                        <BuildingOfficeIcon className="signup-form-label-icon" />
                        Company Name
                      </div>
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      required
                      className={`signup-form-input ${
                        fieldErrors.company ? 'input-error' : ''
                      }`}
                      placeholder="ABC HVAC Services"
                      value={formData.company}
                      onChange={handleChange}
                      onBlur={(e) => validateField('company', e.target.value)}
                    />
                    {fieldErrors.company && (
                      <p className="field-error-message">{fieldErrors.company}</p>
                    )}
                  </div>
                )}

                {/* Professional Verification Section */}
                {formData.role === 'hvac_pro' && (
                  <div className="signup-form-verification-section">
                    <div className="signup-form-professional-verification-header">
                      <ShieldCheckIcon className="signup-form-professional-verification-icon" />
                      <div>
                        <h3 className="signup-form-professional-verification-title">Professional Verification</h3>
                        <p className="signup-form-professional-verification-description">
                          We verify your professional credentials to ensure you receive contractor pricing.
                        </p>
                      </div>
                    </div>

                    {/* State */}
                    <div className="signup-form-field">
                      <label htmlFor="state" className="signup-form-field-label">
                        <div className="signup-form-label-content">
                          <IdentificationIcon className="signup-form-label-icon" />
                          State <span className="text-red-500">*</span>
                        </div>
                      </label>
                      <select
                        id="state"
                        name="state"
                        required
                        className={`signup-form-select ${
                          fieldErrors.state ? 'input-error' : ''
                        }`}
                        value={formData.state}
                        onChange={handleChange}
                        onBlur={(e) => validateField('state', e.target.value)}
                      >
                        <option value="">Select your state</option>
                        {US_STATES.map((state) => (
                          <option key={state.code} value={state.code}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                      {fieldErrors.state && (
                        <p className="field-error-message">{fieldErrors.state}</p>
                      )}
                    </div>

                    {/* License Number */}
                    <div className="signup-form-field">
                      <label htmlFor="licenseNumber" className="signup-form-field-label">
                        <div className="signup-form-label-content">
                          <DocumentTextIcon className="signup-form-label-icon" />
                          HVAC License Number <span className="text-red-500">*</span>
                        </div>
                      </label>
                      <input
                        id="licenseNumber"
                        name="licenseNumber"
                        type="text"
                        required
                        className={`signup-form-input ${
                          fieldErrors.licenseNumber ? 'input-error' : ''
                        }`}
                        placeholder={formData.state ? `Enter your ${US_STATES.find(s => s.code === formData.state)?.name || formData.state} license number` : 'Enter your license number'}
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        onBlur={(e) => validateField('licenseNumber', e.target.value)}
                      />
                      {fieldErrors.licenseNumber && (
                        <p className="field-error-message">{fieldErrors.licenseNumber}</p>
                      )}
                      <p className="signup-form-field-help">
                        Your license number helps us verify your professional status and ensure you receive contractor pricing.
                      </p>
                    </div>
                  </div>
                )}

                {/* Property Manager Verification Section */}
                {formData.role === 'property_manager' && (
                  <div className="signup-form-verification-section">
                    <div className="signup-form-professional-verification-header">
                      <ShieldCheckIcon className="signup-form-professional-verification-icon" />
                      <div>
                        <h3 className="signup-form-professional-verification-title">Business Verification</h3>
                        <p className="signup-form-professional-verification-description">
                          We verify your business credentials to ensure you receive property manager pricing.
                        </p>
                      </div>
                    </div>

                    {/* Business Tax ID (EIN) */}
                    <div className="signup-form-field">
                      <label htmlFor="businessTaxId" className="signup-form-field-label">
                        <div className="signup-form-label-content">
                          <IdentificationIcon className="signup-form-label-icon" />
                          Business Tax ID (EIN) <span className="text-red-500">*</span>
                        </div>
                      </label>
                      <input
                        id="businessTaxId"
                        name="businessTaxId"
                        type="text"
                        required
                        className={`signup-form-input ${
                          fieldErrors.businessTaxId ? 'input-error' : ''
                        }`}
                        placeholder="XX-XXXXXXX"
                        value={formData.businessTaxId}
                        onChange={handleChange}
                        onBlur={(e) => validateField('businessTaxId', e.target.value)}
                        maxLength={10}
                      />
                      {fieldErrors.businessTaxId && (
                        <p className="field-error-message">{fieldErrors.businessTaxId}</p>
                      )}
                      <p className="signup-form-field-help">
                        Your Employer Identification Number (EIN) helps us verify your business status. Format: XX-XXXXXXX
                      </p>
                    </div>
                  </div>
                )}

                {/* Password */}
                <div className="signup-form-field">
                  <label htmlFor="password" className="signup-form-field-label">
                    <div className="signup-form-label-content">
                      <LockClosedIcon className="signup-form-label-icon" />
                      Password
                    </div>
                  </label>
                  <div className="signup-form-password-wrapper">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      className={`signup-form-input signup-form-password-input ${
                        fieldErrors.password ? 'input-error' : ''
                      }`}
                      placeholder="Minimum 8 characters"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={(e) => validateField('password', e.target.value)}
                    />
                    <button
                      type="button"
                      className="signup-form-password-toggle-button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="signup-form-password-toggle-icon" />
                      ) : (
                        <EyeIcon className="signup-form-password-toggle-icon" />
                      )}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="signup-form-password-strength">
                      <div className="signup-form-password-strength-bar-wrapper">
                        <div className="signup-form-password-strength-bar">
                          <div
                            className={`signup-form-password-strength-bar-fill ${passwordStrength.color}`}
                            style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                          />
                        </div>
                        <span className={`signup-form-password-strength-label ${
                          passwordStrength.score >= 3 ? 'signup-form-password-strength-strong' : 
                          passwordStrength.score >= 2 ? 'signup-form-password-strength-medium' : 
                          'signup-form-password-strength-weak'
                        }`}>
                          {passwordStrength.score > 0 ? passwordStrength.feedback : ''}
                        </span>
                      </div>
                    </div>
                  )}
                  {fieldErrors.password && (
                    <p className="field-error-message">{fieldErrors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="signup-form-field">
                  <label htmlFor="confirmPassword" className="signup-form-field-label">
                    Confirm Password
                  </label>
                  <div className="signup-form-password-wrapper">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      className={`signup-form-input signup-form-password-input ${
                        fieldErrors.confirmPassword ? 'input-error' : 
                        formData.confirmPassword && formData.confirmPassword === formData.password ? 'signup-form-password-match' : ''
                      }`}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={(e) => validateField('confirmPassword', e.target.value)}
                    />
                    <button
                      type="button"
                      className="signup-form-password-toggle-button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="signup-form-password-toggle-icon" />
                      ) : (
                        <EyeIcon className="signup-form-password-toggle-icon" />
                      )}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.confirmPassword === formData.password && !fieldErrors.confirmPassword && (
                    <p className="signup-form-password-match-message">
                      <CheckCircleIcon className="signup-form-label-icon signup-form-password-match-icon" />
                      Passwords match
                    </p>
                  )}
                  {fieldErrors.confirmPassword && (
                    <p className="field-error-message">{fieldErrors.confirmPassword}</p>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="signup-form-field">
                  <div className="signup-form-checkbox-wrapper">
                    <input
                      id="acceptTerms"
                      name="acceptTerms"
                      type="checkbox"
                      className="signup-form-checkbox"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                    />
                    <label htmlFor="acceptTerms" className="signup-form-checkbox-label">
                      I agree to the{' '}
                      <a href="/privacy-policy" target="_blank" className="signup-form-link">
                        Terms and Conditions
                      </a>
                      {' '}and{' '}
                      <a href="/privacy-policy" target="_blank" className="signup-form-link">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  {fieldErrors.acceptTerms && (
                    <p className="field-error-message signup-form-checkbox-error">{fieldErrors.acceptTerms}</p>
                  )}
                </div>

                {/* Submit Error */}
                {fieldErrors.submit && (
                  <div className="signup-form-submit-error">
                    <p className="signup-form-submit-error-message">
                      <XCircleIcon className="signup-form-submit-error-icon" />
                      {fieldErrors.submit}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="signup-form-submit-button"
                >
                  {isLoading ? (
                    <div className="signup-form-submit-loading">
                      <div className="signup-form-submit-spinner"></div>
                      Creating account...
                    </div>
                  ) : (
                    <>
                      <CheckBadgeIcon className="signup-form-submit-icon" />
                      Create Account
                    </>
                  )}
                </button>

                {/* Sign In Link */}
                <div className="signup-form-signin-link">
                  <p className="signup-form-signin-link-text">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/auth/signin')}
                      className="signup-form-signin-link-button"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </form>
            </div>

            {/* Right Side - Benefits */}
            <div className="signup-form-benefits-section">
              <div className="signup-form-benefits-content">
                <div className="signup-form-benefits-header">
                  <h2 className="signup-form-benefits-title">{currentRoleInfo.title} Benefits</h2>
                  <p className="signup-form-benefits-description">{currentRoleInfo.description}</p>
                </div>
                
                <ul className="signup-form-benefits-list">
                  {currentRoleInfo.benefits.map((benefit, index) => (
                    <li key={index} className="signup-form-benefits-item">
                      <CheckCircleIcon className="signup-form-benefit-icon" />
                      <span className="signup-form-benefits-item-text">{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* Trust Indicators */}
                <div className="signup-form-trust-section">
                  <div className="signup-form-trust-list">
                    <div className="signup-form-trust-item">
                      <ShieldCheckIcon className="signup-form-trust-icon" />
                      <span className="signup-form-trust-text">Secure & Encrypted</span>
                    </div>
                    <div className="signup-form-trust-item">
                      <CheckBadgeIcon className="signup-form-trust-icon" />
                      <span className="signup-form-trust-text">Trusted by 1000+ Professionals</span>
                    </div>
                    <div className="signup-form-trust-item">
                      <LockClosedIcon className="signup-form-trust-icon" />
                      <span className="signup-form-trust-text">Your data is protected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
