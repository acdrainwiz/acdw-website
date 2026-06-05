import { useState, useEffect, useMemo, type ChangeEvent, type FormEvent } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { IMaskInput } from 'react-imask'
import {
  CheckCircleIcon,
  GiftIcon,
  EnvelopeIcon,
  LockClosedIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'
import { validateEmail } from '../utils/emailValidation'
import { useRecaptcha } from '../hooks/useRecaptcha'
import { isLocalDevEnvironment } from '../utils/isLocalDevEnvironment'
import {
  applyComplimentaryMiniPageSeo,
  finalizeComplimentaryMiniSubmission,
  isComplimentaryMiniSubmissionComplete,
  resolveComplimentaryMiniAccess,
} from '../utils/complimentaryMiniAccess'
import { PageHeroMeshBackdrop } from '../components/layout/PageHeroMeshBackdrop'
import {
  COMPLIMENTARY_MINI_CONTACT_TYPE_OPTIONS,
  COMPLIMENTARY_MINI_REQUEST,
} from '../config/complimentaryMiniRequestCopy'

const copy = COMPLIMENTARY_MINI_REQUEST

const MOBILE_MAX_WIDTH_PX = 767

const SCROLL_ORDER: readonly string[] = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'organization',
  'street',
  'city',
  'state',
  'zip',
  'contactType',
  'consent',
]

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  organization: string
  street: string
  city: string
  state: string
  zip: string
  contactType: string
  consent: boolean
  smsTransactional: boolean
  smsMarketing: boolean
}

const INITIAL_FORM_DATA: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  organization: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  contactType: '',
  consent: false,
  smsTransactional: false,
  smsMarketing: false,
}

function scrollMobileToFirstError(form: HTMLFormElement, errors: Record<string, string>) {
  if (typeof window === 'undefined') return
  if (!window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH_PX}px)`).matches) return

  const fieldKey =
    SCROLL_ORDER.find((key) => errors[key]) ?? Object.keys(errors).find((key) => errors[key])
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

function ComplimentaryMiniAccessDenied() {
  const gate = copy.accessGate

  return (
    <div className="contact-page-container">
      <div className="container py-16 md:py-24">
        <div className="mx-auto max-w-lg">
          <div className="contact-form-card text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <LockClosedIcon className="h-6 w-6 text-blue-600" aria-hidden />
            </div>
            <h1 className="heading-2 mb-3">{gate.deniedTitle}</h1>
            <p className="text-sm leading-relaxed text-gray-600">{gate.deniedMessage}</p>
            <Link to={gate.contactHref} className="contact-form-submit-button mt-8 inline-flex">
              {gate.contactLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function ComplimentaryMiniSubmissionComplete() {
  const form = copy.form

  return (
    <div className="contact-page-container">
      <div className="container py-16 md:py-24">
        <div className="mx-auto max-w-lg">
          <div className="contact-form-card text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircleIcon className="h-8 w-8 text-green-600" aria-hidden />
            </div>
            <h1 className="heading-2 mb-3">{form.successTitle}</h1>
            <p className="text-sm font-medium leading-relaxed text-gray-800">{form.successLead}</p>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">{form.successBody}</p>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">{form.successNextSteps}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link to={form.successPrimaryHref} className="contact-form-submit-button inline-flex">
                {form.successPrimaryCta}
              </Link>
              <Link
                to={form.successSecondaryHref}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50"
              >
                {form.successSecondaryCta}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ComplimentaryMiniConfirmedStale() {
  const stale = copy.confirmedStale

  return (
    <div className="contact-page-container">
      <div className="container py-16 md:py-24">
        <div className="mx-auto max-w-lg">
          <div className="contact-form-card text-center">
            <h1 className="heading-2 mb-3">{stale.title}</h1>
            <p className="text-sm leading-relaxed text-gray-600">{stale.message}</p>
            <Link to={stale.contactHref} className="contact-form-submit-button mt-8 inline-flex">
              {stale.contactLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ComplimentaryMiniRequestPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { getRecaptchaToken } = useRecaptcha()
  const isConfirmedRoute = location.pathname === copy.confirmedRoute
  const submissionComplete = isComplimentaryMiniSubmissionComplete()
  const access = useMemo(
    () => (isConfirmedRoute ? { granted: false, token: null } : resolveComplimentaryMiniAccess(searchParams)),
    [isConfirmedRoute, searchParams],
  )

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [formLoadTime] = useState<number>(() => Date.now())

  useEffect(() => {
    if (!isConfirmedRoute && submissionComplete) {
      navigate(copy.confirmedRoute, { replace: true })
    }
  }, [isConfirmedRoute, submissionComplete, navigate])

  useEffect(() => {
    let pageTitle: string = copy.pageTitle
    if (isConfirmedRoute) {
      pageTitle = submissionComplete ? copy.form.successPageTitle : copy.confirmedStale.pageTitle
    } else if (!access.granted) {
      pageTitle = copy.accessGate.deniedPageTitle
    }
    return applyComplimentaryMiniPageSeo(pageTitle)
  }, [isConfirmedRoute, submissionComplete, access.granted])

  if (isConfirmedRoute) {
    return submissionComplete ? <ComplimentaryMiniSubmissionComplete /> : <ComplimentaryMiniConfirmedStale />
  }

  if (!access.granted) {
    return <ComplimentaryMiniAccessDenied />
  }

  const validateField = (name: string, value: string | boolean): string => {
    const isEmptyString = typeof value === 'string' && value.trim().length === 0

    switch (name) {
      case 'firstName':
        if (isEmptyString) return 'Please enter your first name'
        break
      case 'lastName':
        if (isEmptyString) return 'Please enter your last name'
        break
      case 'email': {
        if (isEmptyString) return 'Please enter your email address'
        const emailError = validateEmail(String(value))
        if (emailError) return emailError
        break
      }
      case 'phone': {
        if (isEmptyString) return 'Please enter your phone number'
        const digits = String(value).replace(/\D/g, '')
        if (digits.length < 10) return 'Please enter a valid phone number'
        break
      }
      case 'street':
        if (isEmptyString) return 'Please enter your mailing address'
        break
      case 'city':
        if (isEmptyString) return 'Please enter your city'
        break
      case 'state':
        if (isEmptyString) return 'Please enter your state'
        break
      case 'zip': {
        if (isEmptyString) return 'Please enter your ZIP code'
        const zip = String(value).trim()
        if (!/^\d{5}(-\d{4})?$/.test(zip)) {
          return 'Please enter a valid 5-digit ZIP code'
        }
        break
      }
      case 'contactType':
        if (isEmptyString) return 'Please select a contact type'
        else if (
          !COMPLIMENTARY_MINI_CONTACT_TYPE_OPTIONS.includes(
            value as (typeof COMPLIMENTARY_MINI_CONTACT_TYPE_OPTIONS)[number],
          )
        ) {
          return 'Please select a valid contact type'
        }
        break
      case 'consent':
        if (value !== true) return 'You must accept the Privacy Policy to continue'
        break
      default:
        break
    }

    return ''
  }

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = event.target
    const nextValue =
      type === 'checkbox' ? (event.target as HTMLInputElement).checked : value

    setFormData((prev) => ({ ...prev, [name]: nextValue }))

    if (touchedFields[name]) {
      const error = validateField(name, nextValue)
      setFieldErrors((prev) => {
        const next = { ...prev }
        if (error) next[name] = error
        else delete next[name]
        return next
      })
    }
  }

  const handleBlur = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = event.target
    const fieldValue =
      type === 'checkbox' ? (event.target as HTMLInputElement).checked : value

    setTouchedFields((prev) => ({ ...prev, [name]: true }))
    const error = validateField(name, fieldValue)
    setFieldErrors((prev) => {
      const next = { ...prev }
      if (error) next[name] = error
      else delete next[name]
      return next
    })
  }

  const handleSubmitSuccess = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    finalizeComplimentaryMiniSubmission()
    navigate(copy.confirmedRoute, { replace: true })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError('')
    setIsSubmitting(true)

    const errors: Record<string, string> = {}
    ;(Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      const error = validateField(key, formData[key])
      if (error) errors[key] = error
    })

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setTouchedFields((prev) => {
        const next = { ...prev }
        Object.keys(errors).forEach((key) => {
          next[key] = true
        })
        return next
      })
      setIsSubmitting(false)
      scrollMobileToFirstError(event.currentTarget, errors)
      return
    }

    const botField = (document.querySelector('input[name="bot-field"]') as HTMLInputElement)?.value
    const hp1 = (document.querySelector('input[name="honeypot-1"]') as HTMLInputElement)?.value
    const hp2 = (document.querySelector('input[name="honeypot-2"]') as HTMLInputElement)?.value
    if (botField || hp1 || hp2) {
      setSubmitError('Invalid submission detected.')
      setIsSubmitting(false)
      return
    }

    let recaptchaToken = ''
    if (!isLocalDevEnvironment()) {
      const recaptchaResult = await getRecaptchaToken(copy.recaptchaAction)
      if (!recaptchaResult.success) {
        setSubmitError(recaptchaResult.error)
        setIsSubmitting(false)
        return
      }
      recaptchaToken = recaptchaResult.token
    }

    const submissionData: Record<string, string> = {
      'form-name': copy.formName,
      'form-type': copy.formType,
      access: access.token || '',
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      company: formData.organization.trim(),
      street: formData.street.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      zip: formData.zip.trim(),
      contactType: formData.contactType,
      eventName: 'Conference / event follow-up',
      consent: formData.consent ? 'yes' : 'no',
      smsTransactional: formData.smsTransactional ? 'yes' : 'no',
      smsMarketing: formData.smsMarketing ? 'yes' : 'no',
      'form-load-time': formLoadTime.toString(),
      'recaptcha-token': recaptchaToken,
    }

    if (isLocalDevEnvironment()) {
      console.log('[DEV MODE] Complimentary Mini request simulated:', submissionData)
      await new Promise((resolve) => setTimeout(resolve, 800))
      handleSubmitSuccess()
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
        handleSubmitSuccess()
      } else {
        const errorMessage =
          responseData.message || responseData.error || 'Failed to submit form. Please try again.'
        setSubmitError(errorMessage)
      }
    } catch (error) {
      console.error('Complimentary Mini request submission error:', error)
      setSubmitError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="contact-page-container">
      <div className="support-hero complimentary-mini-hero">
        <PageHeroMeshBackdrop />
        <div className="support-hero-content">
          <div className="complimentary-mini-hero-layout">
            <h1 className="support-hero-title complimentary-mini-hero-title">{copy.hero.title}</h1>

            <aside
              className="complimentary-mini-hero-product"
              aria-label={`${copy.productName} included with this offer`}
            >
              <span className="complimentary-mini-hero-product-ribbon">{copy.hero.productRibbon}</span>
              <div className="complimentary-mini-hero-product-stage">
                <span className="complimentary-mini-hero-product-glow" aria-hidden />
                <picture>
                  <source media="(max-width: 767px)" srcSet={copy.hero.productImage.srcMobile} />
                  <img
                    src={copy.hero.productImage.src}
                    alt={copy.hero.productImage.alt}
                    className="complimentary-mini-hero-product-img"
                    width={640}
                    height={640}
                    loading="eager"
                    decoding="async"
                  />
                </picture>
              </div>
              <p className="complimentary-mini-hero-product-name">{copy.productName}</p>
              <p className="complimentary-mini-hero-product-note">{copy.hero.productNote}</p>
            </aside>

            <p className="support-hero-subtitle complimentary-mini-hero-subtitle">
              {copy.hero.subtitle}
            </p>

            <div className="support-hero-badge-row complimentary-mini-hero-badge-row">
              {copy.hero.badges.map((badge) => (
                <span key={badge} className="support-hero-badge">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="contact-form-card">
            <div className="contact-form-header">
              <div className="contact-form-icon-wrapper">
                <GiftIcon className="contact-form-icon" />
              </div>
              <div className="contact-form-title-section">
                <h2 className="contact-form-title">{copy.form.title}</h2>
                <p className="contact-form-description">{copy.form.description}</p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6"
              name={copy.formName}
              data-netlify-honeypot="bot-field"
              noValidate
              aria-describedby="coaa-mini-required-legend"
            >
              <input type="hidden" name="form-name" value={copy.formName} />
              <input type="hidden" name="form-type" value={copy.formType} />

              <div style={{ display: 'none' }} aria-hidden="true">
                <input type="text" name="bot-field" tabIndex={-1} autoComplete="off" />
                <input type="text" name="honeypot-1" tabIndex={-1} autoComplete="off" />
                <input type="text" name="honeypot-2" tabIndex={-1} autoComplete="off" />
              </div>

              <p id="coaa-mini-required-legend" className="text-xs text-gray-500">
                Fields marked with * are required.
              </p>

              <div className="contact-form-grid">
                <div className="contact-form-field">
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
                    autoComplete="given-name"
                    className={`input ${fieldErrors.firstName ? 'input-error' : ''}`}
                    placeholder="Enter your first name"
                  />
                  {fieldErrors.firstName && (
                    <p className="field-error-message">{fieldErrors.firstName}</p>
                  )}
                </div>

                <div className="contact-form-field">
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
                    autoComplete="family-name"
                    className={`input ${fieldErrors.lastName ? 'input-error' : ''}`}
                    placeholder="Enter your last name"
                  />
                  {fieldErrors.lastName && (
                    <p className="field-error-message">{fieldErrors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="contact-form-field">
                <label htmlFor="email" className="contact-form-label">
                  Email *
                </label>
                <div className="relative">
                  <EnvelopeIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                    aria-hidden
                  />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    autoComplete="email"
                    className={`input pl-10 ${fieldErrors.email ? 'input-error' : ''}`}
                    placeholder="your@email.com"
                  />
                </div>
                {fieldErrors.email && <p className="field-error-message">{fieldErrors.email}</p>}
              </div>

              <div className="contact-form-field">
                <label htmlFor="phone" className="contact-form-label">
                  Phone *
                </label>
                <IMaskInput
                  mask="(000) 000-0000"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onAccept={(value: string) => {
                    setFormData((prev) => ({ ...prev, phone: value }))
                    if (touchedFields.phone) {
                      const error = validateField('phone', value)
                      setFieldErrors((prev) => {
                        const next = { ...prev }
                        if (error) next.phone = error
                        else delete next.phone
                        return next
                      })
                    }
                  }}
                  onBlur={handleBlur}
                  autoComplete="tel"
                  className={`input ${fieldErrors.phone ? 'input-error' : ''}`}
                  placeholder="+1 (555) 000-0000"
                  unmask={false}
                />
                {fieldErrors.phone && <p className="field-error-message">{fieldErrors.phone}</p>}
                <div
                  id="complimentary-mini-sms-program-disclosure"
                  className="text-xs text-gray-500 mt-2 leading-relaxed space-y-2"
                >
                  <p>{copy.smsProgramDisclosure.lead}</p>
                  <p>{copy.smsProgramDisclosure.footer}</p>
                </div>
              </div>

              <div className="contact-form-field">
                <label htmlFor="organization" className="contact-form-label">
                  Organization / Jurisdiction
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  autoComplete="organization"
                  className="input"
                />
              </div>

              <section
                className="complimentary-mini-mailing-section"
                aria-labelledby="complimentary-mini-mailing-heading"
              >
                <div className="complimentary-mini-mailing-section-header">
                  <div className="complimentary-mini-mailing-section-icon-wrap" aria-hidden>
                    <MapPinIcon className="complimentary-mini-mailing-section-icon" />
                  </div>
                  <div>
                    <h3
                      id="complimentary-mini-mailing-heading"
                      className="complimentary-mini-mailing-section-title"
                    >
                      {copy.form.mailingSection.title}
                    </h3>
                    <p className="complimentary-mini-mailing-section-hint">
                      {copy.form.mailingSection.hint}
                    </p>
                  </div>
                </div>

                <div className="complimentary-mini-mailing-section-fields">
                  <div className="contact-form-field">
                    <label htmlFor="street" className="contact-form-label">
                      Mailing Address *
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      autoComplete="street-address"
                      className={`input complimentary-mini-mailing-input ${fieldErrors.street ? 'input-error' : ''}`}
                      placeholder="Enter your full address"
                    />
                    {fieldErrors.street && (
                      <p className="field-error-message">{fieldErrors.street}</p>
                    )}
                  </div>

                  <div className="contact-form-grid">
                    <div className="contact-form-field">
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
                        autoComplete="address-level2"
                        className={`input complimentary-mini-mailing-input ${fieldErrors.city ? 'input-error' : ''}`}
                        placeholder="Enter your city"
                      />
                      {fieldErrors.city && (
                        <p className="field-error-message">{fieldErrors.city}</p>
                      )}
                    </div>

                    <div className="contact-form-field">
                      <label htmlFor="state" className="contact-form-label">
                        State *
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        autoComplete="address-level1"
                        className={`input complimentary-mini-mailing-input ${fieldErrors.state ? 'input-error' : ''}`}
                        placeholder="Enter your state"
                      />
                      {fieldErrors.state && (
                        <p className="field-error-message">{fieldErrors.state}</p>
                      )}
                    </div>
                  </div>

                  <div className="contact-form-field">
                    <label htmlFor="zip" className="contact-form-label">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      id="zip"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      autoComplete="postal-code"
                      inputMode="numeric"
                      className={`input complimentary-mini-mailing-input ${fieldErrors.zip ? 'input-error' : ''}`}
                      placeholder="e.g. 33101"
                    />
                    {fieldErrors.zip && <p className="field-error-message">{fieldErrors.zip}</p>}
                  </div>
                </div>
              </section>

              <div className="contact-form-field">
                <label htmlFor="contactType" className="contact-form-label">
                  Contact Type *
                </label>
                <select
                  id="contactType"
                  name="contactType"
                  value={formData.contactType}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`input ${fieldErrors.contactType ? 'input-error' : ''}`}
                >
                  <option value="">Select contact type</option>
                  {COMPLIMENTARY_MINI_CONTACT_TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {fieldErrors.contactType && (
                  <p className="field-error-message">{fieldErrors.contactType}</p>
                )}
              </div>

              <div className="flex flex-col gap-4">
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
                      aria-describedby="complimentary-mini-sms-program-disclosure"
                      className="mt-1 h-4 w-4 shrink-0 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600 leading-snug">
                      {copy.smsTransactional}
                      <span className="block text-xs text-gray-500 mt-1">
                        {copy.smsTransactionalOptional}
                      </span>
                    </span>
                  </label>
                  {fieldErrors.smsTransactional && (
                    <p className="field-error-message mt-2 pl-0 sm:pl-7">
                      {fieldErrors.smsTransactional}
                    </p>
                  )}
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="smsMarketing"
                    checked={formData.smsMarketing}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="mt-1 h-4 w-4 shrink-0 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-600 leading-snug">
                    {copy.smsMarketing}
                    <span className="block text-xs text-gray-500 mt-1">{copy.smsMarketingOptional}</span>
                  </span>
                </label>
              </div>

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

              <p className="rounded-lg border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-sm leading-snug text-amber-950/90">
                {copy.form.shareReminder}
              </p>

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
                {isSubmitting ? 'Submitting...' : copy.form.submitLabel}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
