import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { EnvelopeIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { isValidEmail, validateEmail } from '../utils/emailValidation'
import type { PageSearchMeta } from '../config/siteSearchTypes'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'page-unsubscribe',
  kind: 'site',
  title: 'Unsubscribe',
  body:
    'Unsubscribe from AC Drain Wiz marketing and notification emails. Confirm email address and submit request.',
  tags: ['unsubscribe', 'email', 'opt out', 'marketing'],
  href: '/unsubscribe',
}

export function UnsubscribePage() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get email from URL parameter if provided
  const searchParams = new URLSearchParams(location.search)
  const emailParam = searchParams.get('email') || ''
  
  const [email, setEmail] = useState(emailParam)
  const [emailError, setEmailError] = useState<string | null>(null)
  
  // Load reCAPTCHA script if site key is configured
  useEffect(() => {
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY
    if (siteKey && siteKey !== 'RECAPTCHA_SITE_KEY' && typeof window.grecaptcha === 'undefined') {
      // Load reCAPTCHA script dynamically
      const script = document.createElement('script')
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
      script.async = true
      script.defer = true
      document.head.appendChild(script)
      console.log('reCAPTCHA script loaded')
    }
  }, [])
  
  
  // Update email when URL parameter changes
  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam)
      // Validate pre-filled email
      const error = validateEmail(emailParam)
      setEmailError(error)
    }
  }, [emailParam])

  // Handle email input change with real-time validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    
    // Clear error if field is empty (don't show error until user interacts)
    if (!newEmail.trim()) {
      setEmailError(null)
      return
    }
    
    // Validate in real-time
    const error = validateEmail(newEmail)
    setEmailError(error)
  }

  // Handle email input blur (when field loses focus)
  const handleEmailBlur = () => {
    if (!email.trim()) {
      setEmailError('Please enter an email address')
    } else {
      const error = validateEmail(email)
      setEmailError(error)
    }
  }
  const [reason, setReason] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  
  const [formLoadTime] = useState(Date.now()) // Track when form was loaded

  const handleConfirmUnsubscribe = () => {
    // Rate limiting: prevent more than 3 submissions per 5 minutes
    const lastSubmission = localStorage.getItem('unsubscribe_last_submission')
    const attempts = parseInt(localStorage.getItem('unsubscribe_attempts') || '0')
    const now = Date.now()
    
    if (lastSubmission) {
      const timeSinceLastSubmission = now - parseInt(lastSubmission)
      // Reset attempts after 5 minutes
      if (timeSinceLastSubmission > 5 * 60 * 1000) {
        localStorage.setItem('unsubscribe_attempts', '0')
      } else if (attempts >= 3) {
        setSubmitError('Too many unsubscribe attempts. Please wait a few minutes and try again, or contact support.')
        return
      }
    }
    
    // Show confirmation step
    setShowConfirmation(true)
  }

  const handleCancelUnsubscribe = () => {
    setShowConfirmation(false)
  }

  // Get reCAPTCHA site key from environment or use placeholder
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || 'RECAPTCHA_SITE_KEY'

  // Function to get reCAPTCHA token
  const getRecaptchaToken = async (): Promise<string | null> => {
    return new Promise((resolve) => {
      // Check if reCAPTCHA is loaded
      if (typeof window.grecaptcha === 'undefined') {
        console.warn('reCAPTCHA not loaded - may be disabled or site key not configured')
        // If reCAPTCHA is not configured, allow submission (graceful degradation)
        resolve(null)
        return
      }

      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(RECAPTCHA_SITE_KEY, { action: 'unsubscribe' })
          .then((token: string) => {
            resolve(token)
          })
          .catch((error: any) => {
            console.error('reCAPTCHA error:', error)
            // On error, allow submission (graceful degradation)
            resolve(null)
          })
      })
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Final validation before submitting - use the same validation utility
    const trimmedEmail = email.trim()
    const emailValidationError = validateEmail(trimmedEmail)
    
    if (emailValidationError) {
      setEmailError(emailValidationError)
      setSubmitError(emailValidationError)
      return
    }
    
    // Clear any previous email errors if validation passes
    setEmailError(null)
    
    setIsSubmitting(true)
    setSubmitError('')
    
    // Track submission attempt
    const attempts = parseInt(localStorage.getItem('unsubscribe_attempts') || '0')
    localStorage.setItem('unsubscribe_attempts', String(attempts + 1))
    localStorage.setItem('unsubscribe_last_submission', String(Date.now()))
    
    // Build submission data object
    // Validate honeypot fields - if filled, it's likely a bot
    const botField = (document.querySelector('input[name="bot-field"]') as HTMLInputElement)?.value
    const websiteField = (document.querySelector('input[name="website"]') as HTMLInputElement)?.value
    const urlField = (document.querySelector('input[name="url"]') as HTMLInputElement)?.value
    
    if (botField || websiteField || urlField) {
      // Honeypot fields were filled - likely a bot, silently reject
      console.warn('Bot detected: honeypot fields were filled')
      setSubmitError('Invalid submission detected.')
      setIsSubmitting(false)
      return
    }
    
    // Get reCAPTCHA token before submitting
    const recaptchaToken = await getRecaptchaToken()
    if (!recaptchaToken && RECAPTCHA_SITE_KEY !== 'RECAPTCHA_SITE_KEY') {
      // Only require token if reCAPTCHA is configured
      setSubmitError('Security verification failed. Please refresh and try again.')
      setIsSubmitting(false)
      return
    }
    
    const submissionData: Record<string, string> = {
      'form-name': 'unsubscribe',
      email: email.trim(), // Trim whitespace
      reason: reason,
      feedback: feedback || '',
      'form-load-time': formLoadTime.toString(), // Include form load time for behavioral analysis
      ...(recaptchaToken && { 'recaptcha-token': recaptchaToken }), // Add token if available
    }
    
    // Check if we're in development mode
    const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost'
    
    try {
      let response: Response
      
      if (isDevelopment) {
        // In development, simulate a successful submission
        console.log('📝 [DEV MODE] Unsubscribe request simulated:', {
          email,
          reason,
          data: submissionData
        })
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        // Create a mock successful response
        response = new Response(null, { status: 200, statusText: 'OK' })
      } else {
        // In production, submit through validation function first
        // This prevents bots from bypassing client-side validation
        const submitUrl = window.location.origin + '/.netlify/functions/validate-unsubscribe'
        response = await fetch(submitUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(submissionData).toString()
        })
      }
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Scroll to top to show success message
          window.scrollTo({ top: 0, behavior: 'smooth' })
          
          setSubmitSuccess(true)
        } else {
          // Handle validation errors from server
          const errorMessage = result.errors 
            ? result.errors.join(', ')
            : result.message || 'Something went wrong. Please try again.'
          setSubmitError(errorMessage)
          // If it's an email validation error, also set emailError
          if (errorMessage.toLowerCase().includes('email') || errorMessage.toLowerCase().includes('valid')) {
            setEmailError(errorMessage)
          }
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.errors 
          ? errorData.errors.join(', ')
          : errorData.message || 'Something went wrong. Please try again or email us at support@acdrainwiz.com'
        setSubmitError(errorMessage)
        // If it's an email validation error, also set emailError
        if (errorMessage.toLowerCase().includes('email') || errorMessage.toLowerCase().includes('valid')) {
          setEmailError(errorMessage)
        }
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="unsubscribe-container">
        <div className="unsubscribe-wrapper">
          <div className="unsubscribe-content">
            <div className="unsubscribe-success-card">
              <div className="unsubscribe-success-icon-wrapper">
                <CheckCircleIcon className="unsubscribe-success-icon" />
              </div>
              <h1 className="unsubscribe-success-title">You've Been Unsubscribed</h1>
              <p className="unsubscribe-success-message">
                You will no longer receive marketing emails from AC Drain Wiz.
              </p>
              <p className="unsubscribe-success-note">
                We're sorry to see you go! You'll still receive important emails about your orders and account.
              </p>
              
              <div className="unsubscribe-success-actions">
                <button
                  onClick={() => navigate('/email-preferences')}
                  className="unsubscribe-button unsubscribe-button-primary"
                >
                  Manage Email Preferences
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="unsubscribe-button unsubscribe-button-secondary"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="unsubscribe-container">
      <div className="unsubscribe-wrapper">
        <div className="unsubscribe-content">
          {/* Header Section */}
          <div className="unsubscribe-header">
            <div className="unsubscribe-icon-wrapper">
              <EnvelopeIcon className="unsubscribe-icon" />
            </div>
            <h1 className="unsubscribe-title">Unsubscribe from Our Emails</h1>
            <p className="unsubscribe-subtitle">
              We're sorry to see you go. Let us know why you're leaving.
            </p>
          </div>

          {/* Alternative Option Card */}
          <div className="unsubscribe-alternative-card">
            <h3 className="unsubscribe-alternative-title">
              Don't want to unsubscribe from everything?
            </h3>
            <p className="unsubscribe-alternative-description">
              You can manage your email preferences and choose which types of emails you want to receive.
            </p>
            <button
              onClick={() => navigate('/email-preferences')}
              className="unsubscribe-button unsubscribe-button-secondary"
            >
              Manage Preferences Instead
            </button>
          </div>

          {/* Unsubscribe Form */}
          <div className="unsubscribe-form-container">
            <form 
              onSubmit={handleSubmit}
              name="unsubscribe"
              data-netlify-honeypot="bot-field"
              noValidate
            >
              {/* Hidden Fields for Netlify */}
              <input type="hidden" name="form-name" value="unsubscribe" />
              <input type="hidden" name="form-type" value="unsubscribe" />
              
              {/* Honeypot fields - multiple fields to catch bots */}
              <div style={{ display: 'none' }}>
                <label>
                  Don't fill this out if you're human: <input name="bot-field" tabIndex={-1} autoComplete="off" />
                </label>
                <label>
                  Leave this empty: <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
                <label>
                  Do not fill: <input name="url" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              {/* Email Input Field */}
              <div className="unsubscribe-email-field">
                <label htmlFor="unsubscribe-email" className="unsubscribe-email-label">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="unsubscribe-email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  required
                  className={`unsubscribe-email-input ${emailParam ? 'unsubscribe-email-prefilled-input' : ''} ${emailError ? 'input-error' : ''}`}
                  placeholder="your.email@example.com"
                />
                {emailParam && !emailError && (
                  <p className="unsubscribe-email-prefilled">
                    ✓ Email pre-filled from your preferences. You can edit it if needed.
                  </p>
                )}
                {emailError && (
                  <p className="field-error-message">{emailError}</p>
                )}
              </div>

              {/* Unsubscribe Reason Field */}
              <div className="unsubscribe-reason-field">
                <label htmlFor="unsubscribe-reason" className="unsubscribe-reason-label">
                  Why are you unsubscribing? (Optional)
                </label>
                <select
                  id="unsubscribe-reason"
                  name="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="unsubscribe-reason-select"
                >
                  <option value="">Select a reason</option>
                  <option value="too-many-emails">Too many emails</option>
                  <option value="not-relevant">Content not relevant</option>
                  <option value="never-signed-up">I never signed up</option>
                  <option value="spam">Emails look like spam</option>
                  <option value="privacy-concerns">Privacy concerns</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Feedback Field */}
              <div className="unsubscribe-feedback-field">
                <label htmlFor="unsubscribe-feedback" className="unsubscribe-feedback-label">
                  Additional Feedback (Optional)
                </label>
                <textarea
                  id="unsubscribe-feedback"
                  name="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  className="unsubscribe-feedback-textarea"
                  placeholder="Help us improve by sharing your thoughts..."
                />
                <p className="unsubscribe-feedback-help">
                  Your feedback helps us serve our customers better
                </p>
              </div>

              {/* Error Message */}
              {submitError && (
                <div className="unsubscribe-message unsubscribe-message-error">
                  <XCircleIcon className="unsubscribe-message-icon" />
                  <p className="unsubscribe-message-text">{submitError}</p>
                </div>
              )}

              {/* Confirmation Step */}
              {showConfirmation && (
                <div className="unsubscribe-confirmation">
                  <div className="unsubscribe-confirmation-content">
                    <h3 className="unsubscribe-confirmation-title">Are You Sure?</h3>
                    <p className="unsubscribe-confirmation-message">
                      You're about to unsubscribe <strong>{email}</strong> from all marketing emails.
                    </p>
                    <p className="unsubscribe-confirmation-note">
                      You'll still receive important emails about your orders and account, but you won't receive:
                    </p>
                    <ul className="unsubscribe-confirmation-list">
                      <li>Product updates and announcements</li>
                      <li>Promotions and special offers</li>
                      <li>Newsletters and industry news</li>
                    </ul>
                    <p className="unsubscribe-confirmation-question">
                      Are you sure you want to continue?
                    </p>
                    <div className="unsubscribe-confirmation-actions">
                      <button
                        type="button"
                        onClick={handleCancelUnsubscribe}
                        className="unsubscribe-button unsubscribe-button-secondary"
                      >
                        Cancel - Keep My Preferences
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="unsubscribe-button unsubscribe-button-destructive"
                      >
                        {isSubmitting ? 'Unsubscribing...' : 'Yes, Unsubscribe Me'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button (only show if not in confirmation) */}
              {!showConfirmation && (
                <>
                  <button
                    type="button"
                    onClick={handleConfirmUnsubscribe}
                    disabled={!email || !isValidEmail(email.trim())}
                    className="unsubscribe-button unsubscribe-button-submit"
                  >
                    Unsubscribe from All Marketing Emails
                  </button>
                  <p className="unsubscribe-form-note">
                    You'll still receive important emails about your orders and account
                  </p>
                </>
              )}
            </form>
          </div>

          {/* Support Link */}
          <div className="unsubscribe-support">
            <p className="unsubscribe-support-text">
              Having trouble? <button onClick={() => navigate('/contact')} className="unsubscribe-support-link">Contact Support</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

