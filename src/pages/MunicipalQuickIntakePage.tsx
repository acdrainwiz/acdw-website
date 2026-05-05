import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IMaskInput } from 'react-imask'
import { UserPlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { validateEmail } from '../utils/emailValidation'
import { useRecaptcha } from '../hooks/useRecaptcha'
import type { PageSearchMeta } from '../config/siteSearchTypes'
import { PageHeroMeshBackdrop } from '../components/layout/PageHeroMeshBackdrop'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'municipal-quick-intake',
  kind: 'product-info',
  title: 'Quick Intake (Municipal)',
  body:
    'Lightweight municipal quick-intake form. Collects name, email, and full address; submissions land in the BOAA opportunity pipeline.',
  tags: ['municipal', 'intake', 'quick', 'BOAFCOAA'],
  href: '/municipal-quick-intake',
}

const US_STATES: readonly string[] = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  'DC',
]

const MOBILE_MAX_WIDTH_PX = 767

// Match GHL Contact Type custom field options exactly (round-trip safe).
const CONTACT_TYPE_OPTIONS = [
  'Building Inspector,',
  'Mechanical Inspector',
  'Plans Examiner',
  'Code Official',
  'Fire/Building Dept.',
  'Property Maintenance Official',
  'Other',
] as const

const SCROLL_ORDER: readonly string[] = [
  'firstName', 'lastName', 'email', 'phone', 'contactType',
  'street', 'city', 'state', 'zip', 'consent',
]

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  contactType: string
  company: string
  street: string
  city: string
  state: string
  zip: string
  consent: boolean
}

const INITIAL_FORM_DATA: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  contactType: '',
  company: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  consent: false,
}

function scrollMobileToFirstError(form: HTMLFormElement, errors: Record<string, string>) {
  if (typeof window === 'undefined') return
  if (!window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH_PX}px)`).matches) return

  const fieldKey =
    SCROLL_ORDER.find((k) => errors[k]) ?? Object.keys(errors).find((k) => errors[k])
  if (!fieldKey) return

  const el = form.querySelector(`[name="${CSS.escape(fieldKey)}"]`) as HTMLElement | null
  if (!el) return

  window.requestAnimationFrame(() => {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    if (
      el instanceof HTMLInputElement ||
      el instanceof HTMLSelectElement ||
      el instanceof HTMLTextAreaElement
    ) {
      el.focus({ preventScroll: true })
    }
  })
}

export function MunicipalQuickIntakePage() {
  const navigate = useNavigate()
  const { getRecaptchaToken } = useRecaptcha()

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [formLoadTime] = useState<number>(Date.now())

  useEffect(() => {
    document.title = 'Quick Intake | AC Drain Wiz'
  }, [])

  const validateField = (name: string, value: string | boolean): string => {
    const isEmptyString = typeof value === 'string' && value.trim().length === 0

    switch (name) {
      case 'firstName':
        if (!value || isEmptyString) return 'Please enter your first name'
        break
      case 'lastName':
        if (!value || isEmptyString) return 'Please enter your last name'
        break
      case 'email':
        if (!value || isEmptyString) return 'Please enter an email address'
        if (typeof value === 'string') {
          const err = validateEmail(value)
          if (err) return err
        }
        break
      case 'phone':
        if (!value || isEmptyString) return 'Please enter a phone number'
        if (typeof value === 'string' && value.replace(/\D/g, '').length < 10) {
          return 'Please enter a valid phone number'
        }
        break
      case 'contactType':
        if (!value || isEmptyString) return 'Please select a contact type'
        if (typeof value === 'string' && !CONTACT_TYPE_OPTIONS.includes(value as typeof CONTACT_TYPE_OPTIONS[number])) {
          return 'Please select a valid contact type'
        }
        break
      case 'street':
        if (!value || isEmptyString) return 'Please enter your street address'
        break
      case 'city':
        if (!value || isEmptyString) return 'Please enter your city'
        break
      case 'state':
        if (!value || isEmptyString) return 'Please select a state'
        break
      case 'zip':
        if (!value || isEmptyString) return 'Please enter a ZIP code'
        if (typeof value === 'string' && !/^\d{5}$/.test(value.trim())) {
          return 'ZIP code must be 5 digits'
        }
        break
      case 'consent':
        if (!value) return 'Please confirm you agree to the Privacy Policy to continue'
        break
    }
    return ''
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
      if (touchedFields[name]) {
        const error = validateField(name, checked)
        setFieldErrors((prev) => ({ ...prev, [name]: error }))
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
      if (fieldErrors[name]) {
        setFieldErrors((prev) => {
          const next = { ...prev }
          delete next[name]
          return next
        })
      }
    }
  }

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setTouchedFields((prev) => ({ ...prev, [name]: true }))
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    const error = validateField(name, fieldValue)
    setFieldErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')

    const errors: Record<string, string> = {}
    const required = [
      'firstName', 'lastName', 'email', 'phone', 'contactType',
      'street', 'city', 'state', 'zip', 'consent',
    ] as const

    required.forEach((name) => {
      const value = formData[name as keyof FormData] as string | boolean
      const err = validateField(name, value)
      if (err) {
        errors[name] = err
        setTouchedFields((prev) => ({ ...prev, [name]: true }))
      }
    })

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setIsSubmitting(false)
      scrollMobileToFirstError(e.currentTarget, errors)
      return
    }

    const botField = (document.querySelector('input[name="bot-field"]') as HTMLInputElement)?.value
    const hp1 = (document.querySelector('input[name="honeypot-1"]') as HTMLInputElement)?.value
    const hp2 = (document.querySelector('input[name="honeypot-2"]') as HTMLInputElement)?.value
    if (botField || hp1 || hp2) {
      console.warn('Bot detected: honeypot fields were filled')
      setSubmitError('Invalid submission detected.')
      setIsSubmitting(false)
      return
    }

    const recaptchaResult = await getRecaptchaToken('municipal_quick_intake')
    if (!recaptchaResult.success) {
      setSubmitError(recaptchaResult.error)
      setIsSubmitting(false)
      return
    }

    const submissionData: Record<string, string> = {
      'form-name': 'municipal-quick-intake',
      'form-type': 'municipal-quick-intake',
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      contactType: formData.contactType,
      company: formData.company,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      consent: formData.consent ? 'yes' : 'no',
      'form-load-time': formLoadTime.toString(),
      'recaptcha-token': recaptchaResult.token,
    }

    const isDevelopment =
      import.meta.env.DEV ||
      import.meta.env.MODE === 'development' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.port === '5173'

    if (isDevelopment) {
      console.log('[DEV MODE] Quick intake submission simulated:', submissionData)
      await new Promise((r) => setTimeout(r, 800))
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setSubmitSuccess(true)
      setFormData(INITIAL_FORM_DATA)
      setFieldErrors({})
      setTouchedFields({})
      setTimeout(() => setSubmitSuccess(false), 5000)
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/.netlify/functions/validate-form-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(submissionData).toString(),
      })

      const responseData = await response.json()

      if (response.ok && responseData.success) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setSubmitSuccess(true)
        setFormData(INITIAL_FORM_DATA)
        setFieldErrors({})
        setTouchedFields({})
        setTimeout(() => setSubmitSuccess(false), 5000)
      } else {
        const errorMessage =
          responseData.message || responseData.error || 'Failed to submit form. Please try again.'
        setSubmitError(errorMessage)
        console.error('Quick intake submission error:', {
          status: response.status,
          errors: responseData.errors,
          fullResponse: responseData,
        })
      }
    } catch (error) {
      console.error('Quick intake submission error:', error)
      setSubmitError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="contact-page-container">
      <div className="support-hero">
        <PageHeroMeshBackdrop />
        <div className="support-hero-content">
          <div className="support-hero-header">
            <h1 className="support-hero-title">Get Started</h1>
            <p className="support-hero-subtitle">
              Tell us a little about yourself and we'll be in touch shortly. Just need your name,
              email, and address to get the conversation started.
            </p>
            <div className="support-hero-badge-row">
              <span className="support-hero-badge">Quick Signup</span>
              <span className="support-hero-badge">No Phone Required</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="contact-form-card">
            <div className="contact-form-header">
              <div className="contact-form-icon-wrapper">
                <UserPlusIcon className="contact-form-icon" />
              </div>
              <div className="contact-form-title-section">
                <h2 className="contact-form-title">Contact Information</h2>
                <p className="contact-form-description">
                  We'll use this to reach out and follow up on next steps.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-8"
              name="municipal-quick-intake"
              data-netlify-honeypot="bot-field"
              noValidate
              aria-describedby="quick-required-legend"
            >
              <input type="hidden" name="form-name" value="municipal-quick-intake" />
              <input type="hidden" name="form-type" value="municipal-quick-intake" />

              {/* Honeypot fields */}
              <div style={{ display: 'none' }} aria-hidden="true">
                <input type="text" name="bot-field" tabIndex={-1} autoComplete="off" />
                <input type="text" name="honeypot-1" tabIndex={-1} autoComplete="off" />
                <input type="text" name="honeypot-2" tabIndex={-1} autoComplete="off" />
              </div>

              <p id="quick-required-legend" className="text-xs text-gray-500 -mb-2">
                Fields marked with * are required.
              </p>

              {/* Name */}
              <section className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Your Name
                </h3>
                <div className="contact-form-grid">
                  <div>
                    <label htmlFor="firstName" className="contact-form-label">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      autoComplete="given-name"
                      className={`input ${fieldErrors.firstName ? 'input-error' : ''}`}
                      placeholder="First name"
                    />
                    {fieldErrors.firstName && (
                      <p className="field-error-message">{fieldErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="contact-form-label">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      autoComplete="family-name"
                      className={`input ${fieldErrors.lastName ? 'input-error' : ''}`}
                      placeholder="Last name"
                    />
                    {fieldErrors.lastName && (
                      <p className="field-error-message">{fieldErrors.lastName}</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Email + Phone */}
              <section className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Contact Info
                </h3>
                <div className="contact-form-grid">
                  <div>
                    <label htmlFor="email" className="contact-form-label">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      autoComplete="email"
                      className={`input ${fieldErrors.email ? 'input-error' : ''}`}
                      placeholder="your.email@example.com"
                    />
                    {fieldErrors.email && (
                      <p className="field-error-message">{fieldErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className="contact-form-label">
                      Phone Number *
                    </label>
                    <IMaskInput
                      mask="(000) 000-0000"
                      type="tel"
                      id="phone"
                      name="phone"
                      autoComplete="tel"
                      value={formData.phone}
                      onAccept={(value) => {
                        const event = {
                          target: { name: 'phone', value, type: 'tel' },
                        } as React.ChangeEvent<HTMLInputElement>
                        handleInputChange(event)
                      }}
                      onBlur={() => {
                        const event = {
                          target: { name: 'phone', value: formData.phone, type: 'tel' },
                        } as React.FocusEvent<HTMLInputElement>
                        handleBlur(event)
                      }}
                      className={`input ${fieldErrors.phone ? 'input-error' : ''}`}
                      placeholder="(555) 123-4567"
                      unmask={false}
                    />
                    {fieldErrors.phone && (
                      <p className="field-error-message">{fieldErrors.phone}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="contactType" className="contact-form-label">
                    Contact Type *
                  </label>
                  <select
                    id="contactType"
                    name="contactType"
                    value={formData.contactType}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    className={`input ${fieldErrors.contactType ? 'input-error' : ''}`}
                  >
                    <option value="">Select One</option>
                    {CONTACT_TYPE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.contactType && (
                    <p className="field-error-message">{fieldErrors.contactType}</p>
                  )}
                </div>
              </section>

              {/* Business (optional) */}
              <section className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Business
                </h3>
                <div>
                  <label htmlFor="company" className="contact-form-label">
                    Business Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    autoComplete="organization"
                    className="input"
                    placeholder="Optional"
                  />
                </div>
              </section>

              {/* Address */}
              <section className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Address
                </h3>
                <div>
                  <label htmlFor="street" className="contact-form-label">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    autoComplete="street-address"
                    className={`input ${fieldErrors.street ? 'input-error' : ''}`}
                    placeholder="123 Main St, Apt 4B"
                  />
                  {fieldErrors.street && (
                    <p className="field-error-message">{fieldErrors.street}</p>
                  )}
                </div>
                <div className="contact-form-grid">
                  <div>
                    <label htmlFor="city" className="contact-form-label">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      autoComplete="address-level2"
                      className={`input ${fieldErrors.city ? 'input-error' : ''}`}
                      placeholder="City"
                    />
                    {fieldErrors.city && (
                      <p className="field-error-message">{fieldErrors.city}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="state" className="contact-form-label">
                      State *
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      autoComplete="address-level1"
                      className={`input ${fieldErrors.state ? 'input-error' : ''}`}
                    >
                      <option value="">Select State</option>
                      {US_STATES.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.state && (
                      <p className="field-error-message">{fieldErrors.state}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="zip" className="contact-form-label">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    id="zip"
                    name="zip"
                    inputMode="numeric"
                    pattern="\d{5}"
                    maxLength={5}
                    value={formData.zip}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    autoComplete="postal-code"
                    className={`input ${fieldErrors.zip ? 'input-error' : ''}`}
                    placeholder="12345"
                  />
                  {fieldErrors.zip && (
                    <p className="field-error-message">{fieldErrors.zip}</p>
                  )}
                </div>
              </section>

              {/* Privacy Consent */}
              <div>
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    className={`mt-1 h-4 w-4 shrink-0 text-primary-600 focus:ring-primary-500 border-gray-300 rounded ${
                      fieldErrors.consent ? 'border-red-500' : ''
                    }`}
                  />
                  <span className="text-sm text-gray-600 leading-snug">
                    I have read and agree to the{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/privacy-policy')}
                      className="text-primary-600 hover:text-primary-700 underline"
                    >
                      Privacy Policy
                    </button>
                    . *
                  </span>
                </label>
                {fieldErrors.consent && (
                  <p className="field-error-message ml-1">{fieldErrors.consent}</p>
                )}
              </div>

              {/* Success Modal */}
              {submitSuccess && (
                <div className="contact-success-modal-overlay">
                  <div className="contact-success-modal">
                    <div className="contact-success-modal-icon-wrapper">
                      <svg
                        className="contact-success-modal-icon"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <circle cx="12" cy="12" r="10" className="contact-success-modal-circle" />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4"
                          className="contact-success-modal-checkmark"
                        />
                      </svg>
                    </div>
                    <h3 className="contact-success-modal-title">Thanks — we got it!</h3>
                    <p className="contact-success-modal-message">
                      We've received your information and will reach out shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitSuccess(false)}
                      className="contact-success-modal-close"
                      aria-label="Close success message"
                    >
                      <XMarkIcon className="contact-success-modal-close-icon" />
                    </button>
                  </div>
                </div>
              )}

              {submitError && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-700">{submitError}</div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="contact-form-submit-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
