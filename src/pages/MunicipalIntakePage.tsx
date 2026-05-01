import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IMaskInput } from 'react-imask'
import { BuildingOfficeIcon, SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { validateEmail } from '../utils/emailValidation'
import { useRecaptcha } from '../hooks/useRecaptcha'
import type { PageSearchMeta } from '../config/siteSearchTypes'
import { PageHeroMeshBackdrop } from '../components/layout/PageHeroMeshBackdrop'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'municipal-intake',
  kind: 'product-info',
  title: 'Municipal Intake Form (BOAFCOAA)',
  body:
    'Municipal intake form for BOAFCOAA participants and similar leads. Collects municipality information, primary and secondary contacts, infrastructure details, interest and participation, and program enrollment.',
  tags: ['municipal', 'intake', 'BOAFCOAA', 'government'],
  href: '/boafcoaa-muni-intake-form',
}

const MESSAGE_MAX_LENGTH = 2000
const SMS_TRANSACTIONAL_REQUIRED_MSG =
  'Check the checkbox above to consent to transactional SMS (service notifications). Required when you provide a phone number.'

// Defaults sent to GHL Opportunity custom fields on every submission (per spec).
const DEFAULT_ELIGIBLE_FREE_MONITORING = 'Yes - BOAFNCOAA Participant'
const DEFAULT_PROGRAM_STATUS = 'Lead'
const DEFAULT_UNITS_INSTALLED = '0'
const DEFAULT_MONITORING_ACTIVATED = 'No'

// Values must match GHL field options exactly (case-sensitive on round-trip).
const STATE_OPTIONS = ['FL', 'LA', 'AL', 'GA', 'MS', 'TX', 'Other'] as const

const FACILITY_TYPE_OPTIONS = [
  'Government Buildings',
  'Schools',
  'Utilities',
  'Public Works',
  'Parks / Recreation',
  'Municipal Offices',
  'Community Centers',
  'Emergency Services',
  'Other',
] as const

const TIMELINE_OPTIONS = [
  'Immediately',
  '1-30 Days',
  '31-60 Days',
  '61-90 Days',
  '90+ Days',
  'Not Sure Yet',
] as const

const ATTENDED_OPTIONS = ['Yes', 'No', 'Not Sure'] as const
const INTERESTED_OPTIONS = ['Yes', 'No', 'Maybe / Need More Information'] as const
const AGREES_OPTIONS = ['Yes', 'No', 'Pending Approval'] as const

const MOBILE_MAX_WIDTH_PX = 767

const SCROLL_ORDER: readonly string[] = [
  'municipalityName',
  'parishCounty',
  'state',
  'populationSize',
  'firstName',
  'lastName',
  'role',
  'email',
  'phone',
  'smsTransactional',
  'numberOfFacilities',
  'facilityTypes',
  'attendedEvent',
  'interestedInOffer',
  'unitsNeeded',
  'installationTimeline',
  'agreesToPurchase',
  'consent',
]

interface FormData {
  // Municipality Information
  municipalityName: string
  parishCounty: string
  state: string
  populationSize: string

  // Primary Contact
  firstName: string
  lastName: string
  role: string
  email: string
  phone: string

  // Secondary Contact (optional)
  secondaryName: string
  secondaryTitle: string
  secondaryEmail: string
  secondaryPhone: string

  // Infrastructure
  numberOfFacilities: string
  facilityTypes: string[]
  existingMonitoring: string

  // Interest & Participation
  attendedEvent: string
  interestedInOffer: string
  unitsNeeded: string
  installationTimeline: string

  // Program Enrollment
  agreesToPurchase: string

  // Notes
  message: string

  // Consents
  consent: boolean
  smsTransactional: boolean
}

const INITIAL_FORM_DATA: FormData = {
  municipalityName: '',
  parishCounty: '',
  state: '',
  populationSize: '',
  firstName: '',
  lastName: '',
  role: '',
  email: '',
  phone: '',
  secondaryName: '',
  secondaryTitle: '',
  secondaryEmail: '',
  secondaryPhone: '',
  numberOfFacilities: '',
  facilityTypes: [],
  existingMonitoring: '',
  attendedEvent: '',
  interestedInOffer: '',
  unitsNeeded: '',
  installationTimeline: '',
  agreesToPurchase: '',
  message: '',
  consent: false,
  smsTransactional: false,
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

export function MunicipalIntakePage() {
  const navigate = useNavigate()
  const { getRecaptchaToken } = useRecaptcha()

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})
  const [showSecondary, setShowSecondary] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [formLoadTime] = useState<number>(Date.now())

  const formDataRef = useRef(formData)
  formDataRef.current = formData

  useEffect(() => {
    document.title = 'Municipal Intake Form | AC Drain Wiz'
  }, [])

  const validateField = (name: string, value: string | boolean | string[]): string => {
    const isEmptyString = typeof value === 'string' && value.trim().length === 0
    const isEmptyArray = Array.isArray(value) && value.length === 0

    switch (name) {
      case 'municipalityName':
        if (!value || isEmptyString) return 'Please enter the municipality name'
        break
      case 'parishCounty':
        if (!value || isEmptyString) return 'Please enter the parish or county'
        break
      case 'state':
        if (!value || isEmptyString) return 'Please select a state'
        break
      case 'firstName':
        if (!value || isEmptyString) return 'Please enter the primary contact first name'
        break
      case 'lastName':
        if (!value || isEmptyString) return 'Please enter the primary contact last name'
        break
      case 'role':
        if (!value || isEmptyString) return 'Please enter the primary contact title or role'
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
      case 'numberOfFacilities':
        if (!value || isEmptyString) return 'Please enter the number of facilities'
        if (typeof value === 'string' && Number(value) < 1) {
          return 'Number of facilities must be at least 1'
        }
        break
      case 'facilityTypes':
        if (isEmptyArray) return 'Please select at least one facility type'
        break
      case 'attendedEvent':
        if (!value || isEmptyString) return 'Please select an option'
        break
      case 'interestedInOffer':
        if (!value || isEmptyString) return 'Please select an option'
        break
      case 'unitsNeeded':
        // Optional per GHL spec — only validate format if provided.
        if (typeof value === 'string' && value.length > 0 && Number(value) < 1) {
          return 'Units needed must be at least 1'
        }
        break
      case 'installationTimeline':
        if (!value || isEmptyString) return 'Please select a preferred installation timeline'
        break
      case 'agreesToPurchase':
        if (!value || isEmptyString) return 'Please select an option'
        break
      case 'consent':
        if (!value) return 'Please confirm you agree to the Privacy Policy to continue'
        break
      case 'smsTransactional': {
        const digits = formDataRef.current.phone.replace(/\D/g, '').length
        if (digits >= 10 && !value) return SMS_TRANSACTIONAL_REQUIRED_MSG
        break
      }
      case 'secondaryEmail':
        if (typeof value === 'string' && value.length > 0) {
          const err = validateEmail(value)
          if (err) return err
        }
        break
      case 'secondaryPhone':
        if (typeof value === 'string' && value.length > 0 && value.replace(/\D/g, '').length < 10) {
          return 'Please enter a valid phone number'
        }
        break
    }
    return ''
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target

    if (name === 'message' && value.length > MESSAGE_MAX_LENGTH) return

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
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setTouchedFields((prev) => ({ ...prev, [name]: true }))
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    const error = validateField(name, fieldValue)
    setFieldErrors((prev) => ({ ...prev, [name]: error }))
  }

  const toggleFacilityType = (val: string) => {
    setFormData((prev) => {
      const isSelected = prev.facilityTypes.includes(val)
      const next = isSelected
        ? prev.facilityTypes.filter((v) => v !== val)
        : [...prev.facilityTypes, val]
      return { ...prev, facilityTypes: next }
    })
    setFieldErrors((prev) => {
      if (!prev.facilityTypes) return prev
      const next = { ...prev }
      delete next.facilityTypes
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')

    const errors: Record<string, string> = {}
    const required = [
      'municipalityName',
      'parishCounty',
      'state',
      'firstName',
      'lastName',
      'role',
      'email',
      'phone',
      'numberOfFacilities',
      'attendedEvent',
      'interestedInOffer',
      'installationTimeline',
      'agreesToPurchase',
      'consent',
      'smsTransactional',
    ] as const

    required.forEach((name) => {
      const value = formData[name as keyof FormData] as string | boolean | string[]
      const err = validateField(name, value)
      if (err) {
        errors[name] = err
        setTouchedFields((prev) => ({ ...prev, [name]: true }))
      }
    })

    if (formData.facilityTypes.length === 0) {
      errors.facilityTypes = 'Please select at least one facility type'
      setTouchedFields((prev) => ({ ...prev, facilityTypes: true }))
    }

    // Optional fields — validate format only if provided
    if (formData.unitsNeeded) {
      const err = validateField('unitsNeeded', formData.unitsNeeded)
      if (err) errors.unitsNeeded = err
    }
    if (formData.secondaryEmail) {
      const err = validateField('secondaryEmail', formData.secondaryEmail)
      if (err) errors.secondaryEmail = err
    }
    if (formData.secondaryPhone) {
      const err = validateField('secondaryPhone', formData.secondaryPhone)
      if (err) errors.secondaryPhone = err
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setIsSubmitting(false)
      scrollMobileToFirstError(e.currentTarget, errors)
      return
    }

    // Honeypot check
    const botField = (document.querySelector('input[name="bot-field"]') as HTMLInputElement)?.value
    const hp1 = (document.querySelector('input[name="honeypot-1"]') as HTMLInputElement)?.value
    const hp2 = (document.querySelector('input[name="honeypot-2"]') as HTMLInputElement)?.value
    if (botField || hp1 || hp2) {
      console.warn('Bot detected: honeypot fields were filled')
      setSubmitError('Invalid submission detected.')
      setIsSubmitting(false)
      return
    }

    const recaptchaResult = await getRecaptchaToken('municipal_intake')
    if (!recaptchaResult.success) {
      setSubmitError(recaptchaResult.error)
      setIsSubmitting(false)
      return
    }

    const submissionData: Record<string, string> = {
      'form-name': 'municipal-intake',
      'form-type': 'municipal-intake',
      // Standard contact fields
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      // Opportunity custom fields (form keys match ghl-field-map.js opportunityCustomFields)
      municipalityName: formData.municipalityName,
      parishCounty: formData.parishCounty,
      state: formData.state,
      populationSize: formData.populationSize,
      role: formData.role,
      secondaryName: formData.secondaryName,
      secondaryTitle: formData.secondaryTitle,
      secondaryEmail: formData.secondaryEmail,
      secondaryPhone: formData.secondaryPhone,
      numberOfFacilities: formData.numberOfFacilities,
      facilityTypes: formData.facilityTypes.join(', '),
      existingMonitoring: formData.existingMonitoring,
      attendedEvent: formData.attendedEvent,
      interestedInOffer: formData.interestedInOffer,
      unitsNeeded: formData.unitsNeeded,
      installationTimeline: formData.installationTimeline,
      agreesToPurchase: formData.agreesToPurchase,
      // Always-set defaults (per spec)
      eligibleFreeMonitoring: DEFAULT_ELIGIBLE_FREE_MONITORING,
      municipalProgramStatus: DEFAULT_PROGRAM_STATUS,
      numberOfUnitsInstalled: DEFAULT_UNITS_INSTALLED,
      monitoringActivated: DEFAULT_MONITORING_ACTIVATED,
      // Notes (also written as a Note attached to the Contact for visibility)
      message: formData.message,
      // Consents
      consent: formData.consent ? 'yes' : 'no',
      smsTransactional: formData.smsTransactional ? 'yes' : 'no',
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
      console.log('[DEV MODE] Municipal intake submission simulated:', submissionData)
      await new Promise((r) => setTimeout(r, 800))
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setSubmitSuccess(true)
      setFormData(INITIAL_FORM_DATA)
      setFieldErrors({})
      setTouchedFields({})
      setShowSecondary(false)
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
        setShowSecondary(false)
        setTimeout(() => setSubmitSuccess(false), 5000)
      } else {
        const errorMessage =
          responseData.message || responseData.error || 'Failed to submit form. Please try again.'
        setSubmitError(errorMessage)
        console.error('Municipal intake submission error:', {
          status: response.status,
          errors: responseData.errors,
          fullResponse: responseData,
        })
      }
    } catch (error) {
      console.error('Municipal intake submission error:', error)
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
            <h1 className="support-hero-title">Municipal Intake Form</h1>
            <p className="support-hero-subtitle">
              For BOAFNCOAA participants and municipal partners. Complete this form to enroll in
              the AC Drain Wiz Sensor program. Required fields are marked with *.
            </p>
            <div className="support-hero-badge-row">
              <span className="support-hero-badge">BOAF &amp; COAA</span>
              <span className="support-hero-badge">Free Monitoring for Attendees</span>
              <span className="support-hero-badge">Municipal Program</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="contact-form-card">
            <div className="contact-form-header">
              <div className="contact-form-icon-wrapper">
                <BuildingOfficeIcon className="contact-form-icon" />
              </div>
              <div className="contact-form-title-section">
                <h2 className="contact-form-title">Municipality Enrollment</h2>
                <p className="contact-form-description">
                  Tell us about your municipality, contacts, and infrastructure. We'll be in
                  touch shortly to coordinate next steps.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-8"
              name="municipal-intake"
              data-netlify-honeypot="bot-field"
              noValidate
              aria-describedby="muni-required-legend"
            >
              <input type="hidden" name="form-name" value="municipal-intake" />
              <input type="hidden" name="form-type" value="municipal-intake" />

              {/* Honeypot fields */}
              <div style={{ display: 'none' }} aria-hidden="true">
                <input type="text" name="bot-field" tabIndex={-1} autoComplete="off" />
                <input type="text" name="honeypot-1" tabIndex={-1} autoComplete="off" />
                <input type="text" name="honeypot-2" tabIndex={-1} autoComplete="off" />
              </div>

              <p id="muni-required-legend" className="text-xs text-gray-500 -mb-2">
                Fields marked with * are required.
              </p>

              {/* Section 1: Municipality Information */}
              <section className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  1. Municipality Information
                </h3>
                <div>
                  <label htmlFor="municipalityName" className="contact-form-label">
                    Municipality Name *
                  </label>
                  <input
                    type="text"
                    id="municipalityName"
                    name="municipalityName"
                    value={formData.municipalityName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    className={`input ${fieldErrors.municipalityName ? 'input-error' : ''}`}
                    placeholder="Municipality Name"
                  />
                  {fieldErrors.municipalityName && (
                    <p className="field-error-message">{fieldErrors.municipalityName}</p>
                  )}
                </div>
                <div className="contact-form-grid">
                  <div>
                    <label htmlFor="parishCounty" className="contact-form-label">
                      Parish / County *
                    </label>
                    <input
                      type="text"
                      id="parishCounty"
                      name="parishCounty"
                      value={formData.parishCounty}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      className={`input ${fieldErrors.parishCounty ? 'input-error' : ''}`}
                      placeholder="Parish / County"
                    />
                    {fieldErrors.parishCounty && (
                      <p className="field-error-message">{fieldErrors.parishCounty}</p>
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
                      className={`input ${fieldErrors.state ? 'input-error' : ''}`}
                    >
                      <option value="">Select State</option>
                      {STATE_OPTIONS.map((opt) => (
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
                  <label htmlFor="populationSize" className="contact-form-label">
                    Population Size
                  </label>
                  <input
                    type="number"
                    id="populationSize"
                    name="populationSize"
                    min="0"
                    value={formData.populationSize}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="input"
                    placeholder="Optional"
                  />
                </div>
              </section>

              {/* Section 2: Primary Contact */}
              <section className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  2. Primary Contact
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
                      className={`input ${fieldErrors.lastName ? 'input-error' : ''}`}
                      placeholder="Last name"
                    />
                    {fieldErrors.lastName && (
                      <p className="field-error-message">{fieldErrors.lastName}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="role" className="contact-form-label">
                    Title / Role *
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    className={`input ${fieldErrors.role ? 'input-error' : ''}`}
                    placeholder="Public Works Director, Facilities Manager, Building Official, etc."
                  />
                  {fieldErrors.role && (
                    <p className="field-error-message">{fieldErrors.role}</p>
                  )}
                </div>
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
                      className={`input ${fieldErrors.email ? 'input-error' : ''}`}
                      placeholder="your.email@example.gov"
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
                      value={formData.phone}
                      onAccept={(value) => {
                        const event = {
                          target: { name: 'phone', value, type: 'tel' },
                        } as React.ChangeEvent<HTMLInputElement>
                        handleInputChange(event)
                        const digits = value.replace(/\D/g, '').length
                        if (digits < 10) {
                          setFieldErrors((prev) => {
                            if (!prev.smsTransactional) return prev
                            const next = { ...prev }
                            delete next.smsTransactional
                            return next
                          })
                        }
                      }}
                      onBlur={() => {
                        const event = {
                          target: { name: 'phone', value: formData.phone, type: 'tel' },
                        } as React.FocusEvent<HTMLInputElement>
                        handleBlur(event)
                        window.setTimeout(() => {
                          const fd = formDataRef.current
                          const digits = fd.phone.replace(/\D/g, '').length
                          if (digits >= 10) {
                            setTouchedFields((prev) => ({ ...prev, smsTransactional: true }))
                            setFieldErrors((prev) => {
                              const next = { ...prev }
                              if (!fd.smsTransactional) {
                                next.smsTransactional = SMS_TRANSACTIONAL_REQUIRED_MSG
                              } else {
                                delete next.smsTransactional
                              }
                              return next
                            })
                          }
                        }, 0)
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

                {/* SMS transactional consent */}
                <div
                  className={`flex flex-col rounded-lg transition-[box-shadow,background-color,border-color] ${
                    fieldErrors.smsTransactional
                      ? 'border-2 border-red-500 bg-red-50/50 p-3 shadow-sm ring-1 ring-red-500/30'
                      : ''
                  }`}
                >
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="smsTransactional"
                      checked={formData.smsTransactional}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className="mt-1 h-4 w-4 shrink-0 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600 leading-snug">
                      I agree to receive transactional SMS from AC Drain Wiz at the mobile number
                      provided — including service replies, scheduling, appointment coordination,
                      and order or support updates tied to my inquiry. Message frequency may
                      vary. Message and data rates may apply. Reply STOP to unsubscribe or HELP
                      for help. See our{' '}
                      <a
                        href="/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 underline"
                      >
                        Privacy Policy
                      </a>{' '}
                      and{' '}
                      <a
                        href="/terms-of-use"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 underline"
                      >
                        Terms of Use
                      </a>
                      .
                      <span className="block text-xs text-gray-500 mt-1">
                        Required if you provide a phone number.
                      </span>
                    </span>
                  </label>
                  {fieldErrors.smsTransactional && (
                    <p className="field-error-message mt-2 pl-0 sm:pl-7">
                      {fieldErrors.smsTransactional}
                    </p>
                  )}
                </div>
              </section>

              {/* Section 3: Secondary Contact (optional, collapsible) */}
              <section className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  3. Secondary Contact{' '}
                  <span className="text-sm font-normal text-gray-500">(Optional)</span>
                </h3>
                {!showSecondary ? (
                  <button
                    type="button"
                    onClick={() => setShowSecondary(true)}
                    className="self-start text-primary-600 hover:text-primary-700 underline text-sm"
                  >
                    + Add a secondary contact
                  </button>
                ) : (
                  <>
                    <div className="contact-form-grid">
                      <div>
                        <label htmlFor="secondaryName" className="contact-form-label">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="secondaryName"
                          name="secondaryName"
                          value={formData.secondaryName}
                          onChange={handleInputChange}
                          className="input"
                          placeholder="Secondary Contact Full Name"
                        />
                      </div>
                      <div>
                        <label htmlFor="secondaryTitle" className="contact-form-label">
                          Title / Role
                        </label>
                        <input
                          type="text"
                          id="secondaryTitle"
                          name="secondaryTitle"
                          value={formData.secondaryTitle}
                          onChange={handleInputChange}
                          className="input"
                          placeholder="Secondary Contact Title / Role"
                        />
                      </div>
                    </div>
                    <div className="contact-form-grid">
                      <div>
                        <label htmlFor="secondaryEmail" className="contact-form-label">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="secondaryEmail"
                          name="secondaryEmail"
                          value={formData.secondaryEmail}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={`input ${fieldErrors.secondaryEmail ? 'input-error' : ''}`}
                          placeholder="secondary@example.gov"
                        />
                        {fieldErrors.secondaryEmail && (
                          <p className="field-error-message">{fieldErrors.secondaryEmail}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="secondaryPhone" className="contact-form-label">
                          Phone Number
                        </label>
                        <IMaskInput
                          mask="(000) 000-0000"
                          type="tel"
                          id="secondaryPhone"
                          name="secondaryPhone"
                          value={formData.secondaryPhone}
                          onAccept={(value) => {
                            const event = {
                              target: { name: 'secondaryPhone', value, type: 'tel' },
                            } as React.ChangeEvent<HTMLInputElement>
                            handleInputChange(event)
                          }}
                          onBlur={() => {
                            const event = {
                              target: {
                                name: 'secondaryPhone',
                                value: formData.secondaryPhone,
                                type: 'tel',
                              },
                            } as React.FocusEvent<HTMLInputElement>
                            handleBlur(event)
                          }}
                          className={`input ${fieldErrors.secondaryPhone ? 'input-error' : ''}`}
                          placeholder="(555) 123-4567"
                          unmask={false}
                        />
                        {fieldErrors.secondaryPhone && (
                          <p className="field-error-message">{fieldErrors.secondaryPhone}</p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSecondary(false)
                        setFormData((prev) => ({
                          ...prev,
                          secondaryName: '',
                          secondaryTitle: '',
                          secondaryEmail: '',
                          secondaryPhone: '',
                        }))
                        setFieldErrors((prev) => {
                          const next = { ...prev }
                          delete next.secondaryEmail
                          delete next.secondaryPhone
                          return next
                        })
                      }}
                      className="self-start text-gray-500 hover:text-gray-700 underline text-sm"
                    >
                      − Remove secondary contact
                    </button>
                  </>
                )}
              </section>

              {/* Section 4: Infrastructure Details */}
              <section className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  4. Infrastructure Details
                </h3>
                <div>
                  <label htmlFor="numberOfFacilities" className="contact-form-label">
                    Number of Facilities / Buildings *
                  </label>
                  <input
                    type="number"
                    id="numberOfFacilities"
                    name="numberOfFacilities"
                    min="1"
                    value={formData.numberOfFacilities}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    className={`input ${fieldErrors.numberOfFacilities ? 'input-error' : ''}`}
                    placeholder="e.g. 12"
                  />
                  {fieldErrors.numberOfFacilities && (
                    <p className="field-error-message">{fieldErrors.numberOfFacilities}</p>
                  )}
                </div>
                <div>
                  <label className="contact-form-label">Types of Facilities *</label>
                  <p className="text-xs text-gray-500 mb-2">Select all that apply.</p>
                  <div
                    className={`grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-lg border ${
                      fieldErrors.facilityTypes ? 'border-red-500 bg-red-50/50' : 'border-gray-200'
                    }`}
                  >
                    {FACILITY_TYPE_OPTIONS.map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-2 cursor-pointer text-sm text-gray-700"
                      >
                        <input
                          type="checkbox"
                          name="facilityTypes"
                          value={opt}
                          checked={formData.facilityTypes.includes(opt)}
                          onChange={() => toggleFacilityType(opt)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                  {fieldErrors.facilityTypes && (
                    <p className="field-error-message">{fieldErrors.facilityTypes}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="existingMonitoring" className="contact-form-label">
                    Existing Drain / Overflow Monitoring Systems
                  </label>
                  <textarea
                    id="existingMonitoring"
                    name="existingMonitoring"
                    rows={3}
                    value={formData.existingMonitoring}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Describe any current drain, overflow, alarm, or monitoring systems"
                  />
                </div>
              </section>

              {/* Section 5: Interest & Participation */}
              <section className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  5. Interest &amp; Participation
                </h3>
                <div>
                  <label className="contact-form-label">Attended COAA Event? *</label>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-1" role="radiogroup">
                    {ATTENDED_OPTIONS.map((opt) => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="attendedEvent"
                          value={opt}
                          checked={formData.attendedEvent === opt}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                  {fieldErrors.attendedEvent && (
                    <p className="field-error-message">{fieldErrors.attendedEvent}</p>
                  )}
                </div>
                <div className="rounded-xl border border-emerald-200/90 bg-gradient-to-b from-emerald-50/95 via-white to-white p-4 shadow-sm ring-1 ring-emerald-100/60 sm:p-5">
                  <div className="flex gap-3 sm:gap-4">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 shadow-sm ring-1 ring-emerald-200/60"
                      aria-hidden
                    >
                      <SparklesIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-3">
                      <div>
                        <span className="mb-2 inline-flex items-center rounded-full bg-emerald-600/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-emerald-800 ring-1 ring-inset ring-emerald-600/15">
                          Conference offer
                        </span>
                        <p id="specialOfferQuestion" className="contact-form-label !mb-0 !mt-2">
                          Interested in the COAA 2026 conference free wifi monitoring service offer? *
                        </p>
                      </div>
                      <div
                        id="specialOfferDetails"
                        className="flex flex-col gap-3 rounded-lg border border-emerald-100/90 bg-white/90 p-3 shadow-sm sm:p-4"
                      >
                        <p className="m-0 text-sm leading-snug text-gray-700">
                          If you attended the COAA 2026 Annual Education Conference, eligible
                          municipalities or parishes may qualify for{' '}
                          <strong>complimentary Wi-Fi monitoring</strong> during the conference
                          promotion window; the offer is tied to the{' '}
                          <strong>AC Drain Wiz Wi-Fi Sensor Switch</strong>.{' '}
                          <strong>This is not a purchase or funding step</strong>—it only signals
                          interest so we can follow up with your team to discuss fit, scope, and timing
                          before any next steps.
                        </p>
                        <ul className="m-0 list-disc space-y-1 pl-5 text-sm leading-snug text-gray-700">
                          <li>
                            Applies to qualifying municipal or parish entities; we verify eligibility
                            before enrollment.
                          </li>
                          <li>
                            The conference offer is structured around the AC Drain Wiz Wi-Fi Sensor
                            Switch—our team will walk through what participation looks like and answer
                            questions when we connect.
                          </li>
                        </ul>
                        <p className="m-0 border-t border-emerald-100/80 pt-2 text-xs leading-snug text-gray-500">
                          <strong className="text-gray-600">Important:</strong> Subject to
                          eligibility verification—submitting this form does not guarantee you
                          qualify. Information must be accurate; false or misleading information may
                          void eligibility. Offer is for the COAA 2026 Annual Education Conference
                          period only; we may change or end it. This step does not create a financial
                          commitment; any formal terms would be confirmed later, only if you choose to
                          move forward.
                        </p>
                      </div>
                      <div
                        className="flex flex-wrap gap-x-6 gap-y-2 rounded-lg border border-dashed border-emerald-200/90 bg-emerald-50/50 px-3 py-3 sm:px-4"
                        role="radiogroup"
                        aria-labelledby="specialOfferQuestion"
                        aria-describedby="specialOfferDetails"
                      >
                        {INTERESTED_OPTIONS.map((opt) => (
                          <label key={opt} className="flex cursor-pointer items-center gap-2">
                            <input
                              type="radio"
                              name="interestedInOffer"
                              value={opt}
                              checked={formData.interestedInOffer === opt}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                              className="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-sm font-medium text-gray-800">{opt}</span>
                          </label>
                        ))}
                      </div>
                      {fieldErrors.interestedInOffer && (
                        <p className="field-error-message">{fieldErrors.interestedInOffer}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="contact-form-grid">
                  <div>
                    <label htmlFor="unitsNeeded" className="contact-form-label">
                      Estimated Number of Units Needed
                    </label>
                    <input
                      type="number"
                      id="unitsNeeded"
                      name="unitsNeeded"
                      min="1"
                      value={formData.unitsNeeded}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`input ${fieldErrors.unitsNeeded ? 'input-error' : ''}`}
                      placeholder="e.g. 25"
                    />
                    {fieldErrors.unitsNeeded && (
                      <p className="field-error-message">{fieldErrors.unitsNeeded}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="installationTimeline" className="contact-form-label">
                      Preferred Installation Timeline *
                    </label>
                    <select
                      id="installationTimeline"
                      name="installationTimeline"
                      value={formData.installationTimeline}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      className={`input ${fieldErrors.installationTimeline ? 'input-error' : ''}`}
                    >
                      <option value="">Select Installation Timeline</option>
                      {TIMELINE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.installationTimeline && (
                      <p className="field-error-message">{fieldErrors.installationTimeline}</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Section 6: Program Enrollment */}
              <section className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  6. Program Enrollment
                </h3>
                <div>
                  <label className="contact-form-label">
                    Agrees to Purchase Wi-Fi Sensor Switch? *
                  </label>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-1" role="radiogroup">
                    {AGREES_OPTIONS.map((opt) => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="agreesToPurchase"
                          value={opt}
                          checked={formData.agreesToPurchase === opt}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                  {fieldErrors.agreesToPurchase && (
                    <p className="field-error-message">{fieldErrors.agreesToPurchase}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="message" className="contact-form-label">
                    Notes / Special Requirements
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    maxLength={MESSAGE_MAX_LENGTH}
                    className="input"
                    placeholder="Notes, requirements, installation needs, or special considerations"
                  />
                  <div className="contact-form-char-count">
                    <span
                      className={`contact-form-char-count-text ${
                        formData.message.length > MESSAGE_MAX_LENGTH * 0.9
                          ? 'contact-form-char-count-warning'
                          : ''
                      }`}
                    >
                      {formData.message.length} / {MESSAGE_MAX_LENGTH} characters
                    </span>
                  </div>
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
                    <h3 className="contact-success-modal-title">Submission Received!</h3>
                    <p className="contact-success-modal-message">
                      Thank you for enrolling. We've received your municipal intake form and will
                      reach out shortly to coordinate next steps.
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
                {isSubmitting ? 'Submitting...' : 'Submit Municipal Intake'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
