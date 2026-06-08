import { useState } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { useSignIn } from '@clerk/clerk-react'
import { 
  EyeIcon, 
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
  XCircleIcon,
  KeyIcon
} from '@heroicons/react/24/outline'

/** Minimal shape of the Clerk errors we read inside catch blocks. */
type ClerkLikeError = {
  message?: string
  code?: string
  status?: number
  errors?: Array<{ message: string }>
}

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [isSendingCode, setIsSendingCode] = useState(false)
  
  const { signIn, setActive } = useSignIn()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  
  // Get session expired message from location state (if redirected from ProtectedRoute)
  const sessionExpiredMessage = (location.state as { message?: string } | null)?.message || null

  // Get redirect URL from query params (for purchase intent preservation)
  const getRedirectPath = () => {
    // Priority 1: redirect query param (from purchase flow)
    const redirectParam = searchParams.get('redirect')
    if (redirectParam) {
      return decodeURIComponent(redirectParam)
    }
    // Priority 2: saved path from location state
    const savedPath = location.state?.from?.pathname
    if (savedPath) {
      return savedPath
    }
    // Priority 3: default dashboard
    return '/dashboard'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (!signIn) {
        throw new Error('Sign in not available')
      }

      const result = await signIn.create({
        identifier: email,
        password,
      })

      // Log the result for debugging (especially useful for Safari issues)
      console.log('Sign in result:', {
        status: result.status,
        createdSessionId: result.createdSessionId,
        supportedFirstFactors: result.supportedFirstFactors,
        supportedSecondFactors: result.supportedSecondFactors,
      })

      if (result.status === 'complete') {
        // Session created successfully
        if (result.createdSessionId) {
          try {
            await setActive({ session: result.createdSessionId })
            // Small delay to ensure session is fully set (helps with Safari cookie/storage issues)
            await new Promise(resolve => setTimeout(resolve, 500))
            // Redirect with smart redirect logic (preserves purchase intent)
            const redirectPath = getRedirectPath()
            navigate(redirectPath, { replace: true })
          } catch (setActiveErrorRaw) {
            const setActiveError = setActiveErrorRaw as ClerkLikeError
            console.error('Error setting active session:', setActiveError)
            // Safari-specific: Sometimes setActive fails due to cookie issues
            // Try to reload the page to let Clerk handle the session
            if (setActiveError.message?.includes('cookie') || 
                setActiveError.message?.includes('storage') ||
                setActiveError.message?.includes('session')) {
              // Safari workaround: Reload page to let Clerk handle session via cookies
              console.log('Attempting Safari workaround: reloading page')
              window.location.href = '/dashboard'
            } else {
              setError(setActiveError.message || 'Failed to activate session. Please try again.')
            }
          }
        } else {
          setError('Session ID missing. Please try again.')
        }
      } else if (result.status === 'needs_first_factor') {
        // MFA or other first factor required
        setError('Additional verification required. Please check your email or use your authenticator app.')
      } else if (result.status === 'needs_second_factor') {
        // Client Trust: Email verification required for new/untrusted devices
        const emailCodeStrategy = result.supportedSecondFactors?.find(
          (factor) => factor.strategy === 'email_code'
        )
        
        if (emailCodeStrategy) {
          // Prepare email code verification
          try {
            await signIn.prepareSecondFactor({
              strategy: 'email_code',
            })
            setNeedsEmailVerification(true)
            setError('')
            setIsLoading(false)
          } catch (prepareError) {
            console.error('Error preparing email verification:', prepareError)
            setError('Failed to send verification email. Please try again.')
            setIsLoading(false)
          }
        } else {
          setError('Email verification required. Please check your email for a verification code.')
        }
      } else if (result.status === 'needs_new_password') {
        // Password reset required
        setError('Password reset required. Please check your email for reset instructions.')
      } else {
        // Other statuses - provide more helpful error
        console.warn('Unexpected sign-in status:', result.status)
        setError(`Sign in incomplete (status: ${result.status}). Please try again or contact support if the issue persists.`)
      }
    } catch (errRaw) {
      const err = errRaw as ClerkLikeError
      console.error('Sign in error:', {
        message: err.message,
        errors: err.errors,
        status: err.status,
        code: err.code,
      })
      
      // Provide more specific error messages
      if (err.errors && err.errors.length > 0) {
        const errorMessage = err.errors[0].message
        // Check for Safari-specific issues
        if (errorMessage.includes('cookie') || errorMessage.includes('storage') || errorMessage.includes('session')) {
          setError('Browser storage issue detected. Please enable cookies and try again, or use a different browser.')
        } else {
          setError(errorMessage)
        }
      } else {
        setError(err.message || 'Invalid email or password. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (!signIn) {
        throw new Error('Sign in not available')
      }

      if (!verificationCode.trim()) {
        setError('Please enter the verification code')
        setIsLoading(false)
        return
      }

      // Attempt email code verification
      const result = await signIn.attemptSecondFactor({
        strategy: 'email_code',
        code: verificationCode,
      })

      console.log('Email verification result:', {
        status: result.status,
        createdSessionId: result.createdSessionId,
      })

      if (result.status === 'complete') {
        // Email verification successful
        if (result.createdSessionId) {
          try {
        await setActive({ session: result.createdSessionId })
            // Small delay to ensure session is fully set (helps with Safari)
            await new Promise(resolve => setTimeout(resolve, 500))
            // Redirect with smart redirect logic (preserves purchase intent)
            const redirectPath = getRedirectPath()
            navigate(redirectPath, { replace: true })
          } catch (setActiveErrorRaw) {
            const setActiveError = setActiveErrorRaw as ClerkLikeError
            console.error('Error setting active session:', setActiveError)
            if (setActiveError.message?.includes('cookie') ||
                setActiveError.message?.includes('storage') ||
                setActiveError.message?.includes('session')) {
              console.log('Attempting Safari workaround: reloading page')
              window.location.href = '/dashboard'
            } else {
              setError(setActiveError.message || 'Failed to activate session. Please try again.')
            }
          }
        } else {
          setError('Session ID missing. Please try again.')
        }
      } else {
        setError('Invalid verification code. Please check your email and try again.')
      }
    } catch (errRaw) {
      const err = errRaw as ClerkLikeError
      console.error('Email verification error:', {
        message: err.message,
        errors: err.errors,
      })
      setError(err.errors?.[0]?.message || err.message || 'Invalid verification code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setError('')
    setIsSendingCode(true)

    try {
      if (!signIn) {
        throw new Error('Sign in not available')
      }

      await signIn.prepareSecondFactor({
        strategy: 'email_code',
      })
      setError('')
      // Show success message briefly
      const successMsg = 'Verification code sent! Please check your email.'
      setError(successMsg)
      setTimeout(() => setError(''), 3000)
    } catch (errRaw) {
      const err = errRaw as ClerkLikeError
      console.error('Error resending code:', err)
      setError(err.errors?.[0]?.message || 'Failed to resend code. Please try again.')
    } finally {
      setIsSendingCode(false)
    }
  }

  const handleBackToPassword = () => {
    setNeedsEmailVerification(false)
    setVerificationCode('')
    setError('')
    setPassword('')
    // Clear form to start fresh
  }

  const benefits = [
    'Exclusive Contractor Pricing – Save on Mini, Sensor, and bundle purchases',
    'Bulk Ordering & Volume Discounts – Special pricing for larger orders',
    'Priority Support – Direct access to technical resources and expert assistance',
    'Contractor Partner Program – Access to marketing materials and co-branding opportunities'
  ]

  return (
    <div className="signin-form-page-container">
      <div className="signin-form-page-wrapper">
        <div className="signin-form-card">
          <div className="signin-form-layout">
            {/* Left Side - Form */}
            <div className="signin-form-section">
              <div className="signin-form-header-section">
                <div className="signin-form-title-wrapper">
                  <ShieldCheckIcon className="signin-form-header-icon" />
                  <h1 className="signin-form-title">
                    {needsEmailVerification ? 'Verify Your Email' : 'Sign In'}
                  </h1>
                </div>
                <p className="signin-form-subtitle">
                  {needsEmailVerification 
                    ? `We sent a verification code to ${email}. Please enter it below.`
                    : 'Access your contractor account and exclusive pricing'}
                </p>
              </div>
              
              {/* Session Expired Warning */}
              {sessionExpiredMessage && !needsEmailVerification && (
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <svg className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="text-yellow-800 font-semibold text-sm">Session Expired</p>
                      <p className="text-yellow-700 text-sm mt-1">{sessionExpiredMessage}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {needsEmailVerification ? (
                /* Email Verification Form */
                <form className="signin-form" onSubmit={handleEmailVerification} noValidate>
                  <div className="signin-form-field">
                    <label htmlFor="verificationCode" className="signin-form-field-label">
                      <div className="signin-form-label-content">
                        <KeyIcon className="signin-form-label-icon" />
                        Verification Code
                      </div>
                    </label>
                    <input
                      id="verificationCode"
                      name="verificationCode"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      required
                      maxLength={6}
                      className="signin-form-input"
                      placeholder="000000"
                      value={verificationCode}
                      onChange={(e) => {
                        // Only allow numbers, limit to 6 digits
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                        setVerificationCode(value)
                        setError('')
                      }}
                      autoFocus
                    />
                    <p className="signin-form-field-help">
                      Enter the 6-digit code sent to your email
                    </p>
                  </div>

                  {error && (
                    <div className={`signin-form-error ${error.includes('sent!') ? 'signin-form-success' : ''}`}>
                      <p className="signin-form-error-message">
                        {error.includes('sent!') ? (
                          <CheckCircleIcon className="signin-form-error-icon" />
                        ) : (
                          <XCircleIcon className="signin-form-error-icon" />
                        )}
                        {error}
                      </p>
                    </div>
                  )}

                  <div className="signin-form-actions">
                    <button
                      type="button"
                      onClick={handleBackToPassword}
                      className="signin-form-back-button"
                      disabled={isLoading}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || verificationCode.length !== 6}
                      className="signin-form-submit-button"
                    >
                      {isLoading ? (
                        <div className="signin-form-submit-loading">
                          <div className="signin-form-submit-spinner"></div>
                          Verifying...
                        </div>
                      ) : (
                        <>
                          <CheckBadgeIcon className="signin-form-submit-icon" />
                          Verify
                        </>
                      )}
                    </button>
                  </div>

                  <div className="signin-form-resend-section">
                    <p className="signin-form-resend-text">
                      Didn't receive the code?{' '}
                      <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={isSendingCode}
                        className="signin-form-resend-button"
                      >
                        {isSendingCode ? 'Sending...' : 'Resend Code'}
                      </button>
                    </p>
                  </div>
                </form>
              ) : (
                /* Password Form */
              <form className="signin-form" onSubmit={handleSubmit} noValidate>
                {/* Email */}
                <div className="signin-form-field">
                  <label htmlFor="email" className="signin-form-field-label">
                    <div className="signin-form-label-content">
                      <EnvelopeIcon className="signin-form-label-icon" />
                      Email Address
                    </div>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="signin-form-input"
                    placeholder="john@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Password */}
                <div className="signin-form-field">
                  <label htmlFor="password" className="signin-form-field-label">
                    <div className="signin-form-label-content">
                      <LockClosedIcon className="signin-form-label-icon" />
                      Password
                    </div>
                  </label>
                  <div className="signin-form-password-wrapper">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      className="signin-form-input signin-form-password-input"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="signin-form-password-toggle-button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="signin-form-password-toggle-icon" />
                      ) : (
                        <EyeIcon className="signin-form-password-toggle-icon" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="signin-form-error">
                    <p className="signin-form-error-message">
                      <XCircleIcon className="signin-form-error-icon" />
                      {error}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="signin-form-submit-button"
                >
                  {isLoading ? (
                    <div className="signin-form-submit-loading">
                      <div className="signin-form-submit-spinner"></div>
                      Signing in...
                    </div>
                  ) : (
                    <>
                      <CheckBadgeIcon className="signin-form-submit-icon" />
                      Sign In
                    </>
                  )}
                </button>

                {/* Sign Up Link */}
                <div className="signin-form-signup-link">
                  <p className="signin-form-signup-link-text">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/auth/signup')}
                      className="signin-form-signup-link-button"
                    >
                      Create one here
                    </button>
                  </p>
                </div>
              </form>
              )}
            </div>

            {/* Right Side - Benefits */}
            <div className="signin-form-benefits-section">
              <div className="signin-form-benefits-content">
                <div className="signin-form-benefits-header">
                  <h2 className="signin-form-benefits-title">Contractor Benefits</h2>
                  <p className="signin-form-benefits-description">
                    Access exclusive pricing and professional resources
                  </p>
                </div>
                
                <ul className="signin-form-benefits-list">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="signin-form-benefits-item">
                      <CheckCircleIcon className="signin-form-benefit-icon" />
                      <span className="signin-form-benefits-item-text">{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="signin-form-cta-section">
                  <button
                    type="button"
                    onClick={() => navigate('/auth/signup')}
                    className="signin-form-cta-button"
                  >
                    Create Your Account
                    <ArrowRightIcon className="signin-form-cta-icon" />
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="signin-form-trust-section">
                  <div className="signin-form-trust-list">
                    <div className="signin-form-trust-item">
                      <ShieldCheckIcon className="signin-form-trust-icon" />
                      <span className="signin-form-trust-text">Secure & Encrypted</span>
                    </div>
                    <div className="signin-form-trust-item">
                      <CheckBadgeIcon className="signin-form-trust-icon" />
                      <span className="signin-form-trust-text">Trusted by 1000+ Professionals</span>
                    </div>
                    <div className="signin-form-trust-item">
                      <LockClosedIcon className="signin-form-trust-icon" />
                      <span className="signin-form-trust-text">Your data is protected</span>
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
