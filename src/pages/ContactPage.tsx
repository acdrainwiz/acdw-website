import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IMaskInput } from 'react-imask'
import { DayPicker } from 'react-day-picker'
import { 
  BuildingOfficeIcon,
  QuestionMarkCircleIcon,
  ShoppingCartIcon,
  WrenchScrewdriverIcon,
  PresentationChartLineIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import {
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/solid'
import { validateEmail } from '../utils/emailValidation'
import { useRecaptcha } from '../hooks/useRecaptcha'

type ContactFormType = 'general' | 'support' | 'sales' | 'installer' | 'demo'

// Character limit for message field
const MESSAGE_MAX_LENGTH = 2000

interface FormData {
  firstName: string
  lastName: string
  email: string
  company: string
  phone: string
  customerType: string
  message: string
  referralSource: string
  consent: boolean
  // Support-specific
  product?: string
  issueType?: string
  priority?: string
  // Sales-specific
  role?: string
  annualVolume?: string
  interest?: string
  // Installer-specific
  location?: string
  preferredContact?: string
  productToInstall?: string
  // Demo-specific
  demoType?: string
  preferredDate?: string
  preferredTime?: string
  city?: string
  state?: string
  zip?: string
  productsOfInterest?: string[]
  numberOfAttendees?: string
  portfolioSize?: string
  demoFocus?: string
}

const formTypeConfig: Record<ContactFormType, {
  title: string
  description: string
  icon: typeof EnvelopeIcon
  buttonText: string
}> = {
  general: {
    title: 'General Contact',
    description: 'Send us a message and we\'ll get back to you as soon as possible.',
    icon: EnvelopeIcon,
    buttonText: 'Send Message'
  },
  support: {
    title: 'Support Request',
    description: 'Need help with your product? Our support team is here to assist you.',
    icon: QuestionMarkCircleIcon,
    buttonText: 'Submit Support Request'
  },
  sales: {
    title: 'Sales Inquiry',
    description: 'Interested in bulk pricing or becoming a partner? Let\'s talk.',
    icon: ShoppingCartIcon,
    buttonText: 'Request Information'
  },
  installer: {
    title: 'Find an Installer',
    description: 'Looking for a certified installer in your area? We can help connect you.',
    icon: WrenchScrewdriverIcon,
    buttonText: 'Find Installer'
  },
  demo: {
    title: 'Request Demo',
    description: 'Schedule a demo to see AC Drain Wiz products in action.',
    icon: PresentationChartLineIcon,
    buttonText: 'Schedule Demo'
  }
}

export function ContactPage() {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Get form type from URL parameter
  const getFormTypeFromURL = (): ContactFormType => {
    const params = new URLSearchParams(location.search)
    const type = params.get('type')
    
    // Map URL types to form types
    switch (type) {
      case 'support':
        return 'support'
      case 'sales':
        return 'sales'
      case 'installer':
        return 'installer'
      case 'demo-request':
        return 'demo'
      case 'case-study':
        // Case study links go to general contact
        return 'general'
      default:
        return 'general'
    }
  }

  const [activeFormType, setActiveFormType] = useState<ContactFormType>(getFormTypeFromURL())
  const { getRecaptchaToken } = useRecaptcha()
    const [formLoadTime] = useState<number>(Date.now()) // Set when component mounts for behavioral analysis
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    customerType: '',
    message: '',
    referralSource: '',
    consent: false,
    productsOfInterest: []
  })

  // Update form type when URL changes
  useEffect(() => {
    const newType = getFormTypeFromURL()
    setActiveFormType(newType)
  }, [location.search])

  // Update URL when tab changes (without reload)
  const handleTabChange = (type: ContactFormType) => {
    setActiveFormType(type)
    const typeMap: Record<ContactFormType, string> = {
      general: '',
      support: 'support',
      sales: 'sales',
      installer: 'installer',
      demo: 'demo-request'
    }
    const urlType = typeMap[type]
    navigate(`/contact${urlType ? `?type=${urlType}` : ''}`, { replace: true })
  }

  // Validation function
  const validateField = (name: string, value: string | boolean): string => {
    switch (name) {
      case 'firstName':
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
          return 'Please enter your first name'
        }
        break
      case 'lastName':
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
          return 'Please enter your last name'
        }
        break
      case 'email':
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
          return 'Please enter your email address'
        } else if (typeof value === 'string') {
          const emailError = validateEmail(value)
          if (emailError) {
            return emailError
          }
        }
        break
      case 'phone':
        if (typeof value === 'string' && value.length > 0 && value.replace(/\D/g, '').length < 10) {
          return 'Please enter a valid phone number'
        }
        break
      case 'company':
        if ((activeFormType === 'sales' || activeFormType === 'demo') && (!value || (typeof value === 'string' && value.trim().length === 0))) {
          return 'Please enter your company name'
        }
        break
      case 'message':
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
          return 'Please enter a message'
        }
        break
      case 'product':
        if (activeFormType === 'support' && (!value || (typeof value === 'string' && value.trim().length === 0))) {
          return 'Please select a product'
        }
        break
      case 'issueType':
        if (activeFormType === 'support' && (!value || (typeof value === 'string' && value.trim().length === 0))) {
          return 'Please select an issue type'
        }
        break
      case 'role':
        if (activeFormType === 'sales' && (!value || (typeof value === 'string' && value.trim().length === 0))) {
          return 'Please select your role'
        }
        break
      case 'interest':
        if (activeFormType === 'sales' && (!value || (typeof value === 'string' && value.trim().length === 0))) {
          return 'Please select an interest type'
        }
        break
      case 'location':
        if (activeFormType === 'installer' && (!value || (typeof value === 'string' && value.trim().length === 0))) {
          return 'Please enter your location'
        }
        break
      case 'productToInstall':
        if (activeFormType === 'installer' && (!value || (typeof value === 'string' && value.trim().length === 0))) {
          return 'Please select a product to be installed'
        }
        break
      case 'demoType':
        if (activeFormType === 'demo' && (!value || (typeof value === 'string' && value.trim().length === 0))) {
          return 'Please select a demo type'
        }
        break
      case 'consent':
        if (!value) {
          return 'Please accept the privacy policy to continue'
        }
        break
    }
    return ''
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    // Enforce character limit for message field
    if (name === 'message' && value.length > MESSAGE_MAX_LENGTH) {
      return
    }
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
      // Validate checkbox
      if (touchedFields[name]) {
        const error = validateField(name, checked)
        setFieldErrors(prev => ({
          ...prev,
          [name]: error
        }))
      }
    } else {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
      // Clear error when user starts typing
      if (fieldErrors[name]) {
        setFieldErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[name]
          return newErrors
        })
      }
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setTouchedFields(prev => ({ ...prev, [name]: true }))
    
    // Validate on blur
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    const error = validateField(name, fieldValue)
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      // Format date as YYYY-MM-DD for form submission (without timezone issues)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const formattedDate = `${year}-${month}-${day}`
      
      const event = {
        target: { name: 'preferredDate', value: formattedDate, type: 'text' }
      } as React.ChangeEvent<HTMLInputElement>
      handleInputChange(event)
      
      // Clear error when date is selected
      if (fieldErrors.preferredDate) {
        setFieldErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.preferredDate
          return newErrors
        })
      }
      
      // Close calendar after selection
      setTimeout(() => setShowCalendar(false), 100)
    }
  }
  
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return ''
    // Parse YYYY-MM-DD as local date to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }
  
  const stringToDate = (dateString: string | undefined): Date | undefined => {
    if (!dateString) return undefined
    // Parse YYYY-MM-DD as local date to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})
  const [showCalendar, setShowCalendar] = useState(false)

  // Close calendar when clicking outside
  useEffect(() => {
    if (!showCalendar) return
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.calendar-popup') && !target.closest('#preferredDate')) {
        setShowCalendar(false)
      }
    }
    
    // Add slight delay before attaching listener to avoid immediate trigger
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 100)
    
    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showCalendar])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')
    
    // Validate all fields
    const errors: Record<string, string> = {}
    const fieldsToValidate = ['firstName', 'lastName', 'email', 'message', 'consent']
    
    // Add form-specific required fields
    if (activeFormType === 'sales' || activeFormType === 'demo') {
      fieldsToValidate.push('company')
    }
    if (activeFormType === 'support') {
      fieldsToValidate.push('product', 'issueType')
    }
    if (activeFormType === 'sales') {
      fieldsToValidate.push('role', 'interest')
    }
    if (activeFormType === 'installer') {
      fieldsToValidate.push('location', 'productToInstall')
    }
    if (activeFormType === 'demo') {
      fieldsToValidate.push('demoType', 'city', 'state', 'zip', 'numberOfAttendees')
    }
    
    // Validate each field
    fieldsToValidate.forEach(fieldName => {
      const value = formData[fieldName as keyof FormData]
      const error = validateField(fieldName, value as string | boolean)
      if (error) {
        errors[fieldName] = error
        setTouchedFields(prev => ({ ...prev, [fieldName]: true }))
      }
    })
    
    // Special validation for productsOfInterest (array field)
    if (activeFormType === 'demo') {
      if (!formData.productsOfInterest || formData.productsOfInterest.length === 0) {
        errors.productsOfInterest = 'Please select at least one product of interest'
        setTouchedFields(prev => ({ ...prev, productsOfInterest: true }))
      }
    }
    
    // If there are validation errors, stop submission
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setIsSubmitting(false)
      return
    }
    
    // Check honeypot fields - if filled, it's likely a bot
    const botField = (document.querySelector('input[name="bot-field"]') as HTMLInputElement)?.value
    const honeypot1 = (document.querySelector('input[name="honeypot-1"]') as HTMLInputElement)?.value
    const honeypot2 = (document.querySelector('input[name="honeypot-2"]') as HTMLInputElement)?.value
    
    if (botField || honeypot1 || honeypot2) {
      // Honeypot fields were filled - likely a bot, silently reject
      console.warn('Bot detected: honeypot fields were filled')
      setSubmitError('Invalid submission detected.')
      setIsSubmitting(false)
      return
    }
    
      const recaptchaResult = await getRecaptchaToken(`contact_${activeFormType}`)
      if (!recaptchaResult.success) {
          setSubmitError(recaptchaResult.error)
          setIsSubmitting(false)
          return
      }
    
    // Prepare form data for Netlify
    const formName = `contact-${activeFormType}`
    
    // Build form data object manually from state to ensure all fields are included
    const submissionData: Record<string, string> = {
      'form-name': formName,
      'form-type': `contact-${activeFormType}`, // Include specific form type for validation
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      company: formData.company || '',
      phone: formData.phone || '',
      customerType: formData.customerType,
      message: formData.message,
      referralSource: formData.referralSource || '',
      consent: formData.consent ? 'yes' : 'no',
      'form-load-time': formLoadTime.toString(), // Include form load time for behavioral analysis
        'recaptcha-token': recaptchaResult.token,
    }
    
    // Add form-specific fields
    if (formData.product) submissionData.product = formData.product
    if (formData.issueType) submissionData.issueType = formData.issueType
    if (formData.priority) submissionData.priority = formData.priority
    if (formData.role) submissionData.role = formData.role
    if (formData.annualVolume) submissionData.annualVolume = formData.annualVolume
    if (formData.interest) submissionData.interest = formData.interest
    if (formData.location) submissionData.location = formData.location
    if (formData.preferredContact) submissionData.preferredContact = formData.preferredContact
    if (formData.productToInstall) submissionData.productToInstall = formData.productToInstall
    if (formData.demoType) submissionData.demoType = formData.demoType
    if (formData.preferredDate) submissionData.preferredDate = formData.preferredDate
    if (formData.preferredTime) submissionData.preferredTime = formData.preferredTime
    if (formData.city) submissionData.city = formData.city
    if (formData.state) submissionData.state = formData.state
    if (formData.zip) submissionData.zip = formData.zip
    if (formData.productsOfInterest && formData.productsOfInterest.length > 0) {
      submissionData.productsOfInterest = formData.productsOfInterest.join(', ')
    }
    if (formData.numberOfAttendees) submissionData.numberOfAttendees = formData.numberOfAttendees
    if (formData.portfolioSize) submissionData.portfolioSize = formData.portfolioSize
    if (formData.demoFocus) submissionData.demoFocus = formData.demoFocus
    
    // Check if we're in development mode (multiple checks for reliability)
    const isDevelopment = 
      import.meta.env.DEV || 
      import.meta.env.MODE === 'development' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.port === '5173'
    
    // In development, simulate submission without making network request
    if (isDevelopment) {
      console.log('📝 [DEV MODE] Form submission simulated:', {
        formName,
        formType: activeFormType,
        data: submissionData
      })
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' })
      
      // Simulate success
      setSubmitSuccess(true)
    // Reset form
    setFormData({
        firstName: '',
        lastName: '',
      email: '',
      company: '',
      phone: '',
      customerType: '',
        message: '',
        referralSource: '',
        consent: false,
        product: '',
        issueType: '',
        priority: '',
        role: '',
        annualVolume: '',
        interest: '',
        location: '',
        preferredContact: '',
        productToInstall: '',
        demoType: '',
        preferredDate: '',
        preferredTime: '',
        city: '',
        state: '',
        zip: '',
        productsOfInterest: [],
        numberOfAttendees: '',
        portfolioSize: '',
        demoFocus: ''
      })
      // Reset errors
      setFieldErrors({})
      setTouchedFields({})
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000)
      setIsSubmitting(false)
      return
    }
    
    // Production: Submit through validation function first
    try {
      const response = await fetch('/.netlify/functions/validate-form-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(submissionData).toString()
      })
      
      const responseData = await response.json()
      
      if (response.ok && responseData.success) {
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' })
        
        setSubmitSuccess(true)
    // Reset form
    setFormData({
          firstName: '',
          lastName: '',
      email: '',
      company: '',
      phone: '',
      customerType: '',
          message: '',
          referralSource: '',
          consent: false,
          product: '',
          issueType: '',
          priority: '',
          role: '',
          annualVolume: '',
          interest: '',
          location: '',
          preferredContact: '',
          productToInstall: '',
          demoType: '',
          preferredDate: '',
          preferredTime: '',
          city: '',
          state: '',
          zip: '',
          productsOfInterest: [],
          numberOfAttendees: '',
          portfolioSize: '',
          demoFocus: ''
        })
        // Reset errors
        setFieldErrors({})
        setTouchedFields({})
        
        // Reset success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000)
      } else {
        // Handle error response from validation function
        const errorMessage = responseData.message || responseData.error || 'Failed to submit form. Please try again.'
        setSubmitError(errorMessage)
        console.error('Form submission error:', {
          status: response.status,
          statusText: response.statusText,
          error: responseData.error,
          message: responseData.message,
          errors: responseData.errors,
          fullResponse: responseData
        })
        
        // If there are field-specific errors, add them to fieldErrors
        if (responseData.errors && Array.isArray(responseData.errors)) {
          const newErrors: Record<string, string> = {}
          responseData.errors.forEach((error: string) => {
            // Try to match error to field (basic matching)
            if (error.toLowerCase().includes('email')) newErrors.email = error
            else if (error.toLowerCase().includes('first name')) newErrors.firstName = error
            else if (error.toLowerCase().includes('last name')) newErrors.lastName = error
            else if (error.toLowerCase().includes('message')) newErrors.message = error
          })
          if (Object.keys(newErrors).length > 0) {
            setFieldErrors(prev => ({ ...prev, ...newErrors }))
          }
        }
      }
    } catch (error) {
      console.error('Form submission error:', {
        error: error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      })
      setSubmitError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const activeConfig = formTypeConfig[activeFormType]
  const ActiveIcon = activeConfig.icon

  return (
    <div className="contact-page-container">
      <div className="container py-16">
        {/* Header */}
        <div className="contact-page-header">
          <h1 className="heading-1 mb-6">Contact AC Drain Wiz</h1>
          <p className="text-large max-w-3xl mx-auto">
            Get in touch with our team for product information, pricing, technical support, 
            or to schedule a demo. We're here to help with your AC drain line maintenance needs.
          </p>
        </div>

        <div className="contact-content-wrapper">
          {/* Tabs */}
          <div className="contact-tabs-container">
            <h3 className="contact-tabs-subhead">Choose the contact form that best fits your inquiry</h3>
            <div className="contact-tabs-wrapper">
              {Object.entries(formTypeConfig).map(([type, config]) => {
                const Icon = config.icon
                const isActive = activeFormType === type
                return (
                  <button
                    key={type}
                    onClick={() => handleTabChange(type as ContactFormType)}
                    className={`contact-tab-button ${isActive ? 'contact-tab-button-active' : 'contact-tab-button-inactive'}`}
                  >
                    <Icon className="contact-tab-icon" />
                    <span>{config.title}</span>
                  </button>
                )
              })}
              </div>
            </div>

          <div className="contact-layout-grid">
            {/* Form Section */}
            <div className="contact-form-section">
              <div className="contact-form-card">
                <div className="contact-form-header">
                  <div className="contact-form-icon-wrapper">
                    <ActiveIcon className="contact-form-icon" />
                  </div>
                  <div className="contact-form-title-section">
                    <h2 className="contact-form-title">{activeConfig.title}</h2>
                    <p className="contact-form-description">{activeConfig.description}</p>
                  </div>
                  </div>

                <form 
                  onSubmit={handleSubmit} 
                  className="contact-form-field"
                  name={`contact-${activeFormType}`}
                  data-netlify-honeypot="bot-field"
                  noValidate
                >
                  {/* Hidden Fields for Netlify */}
                  <input type="hidden" name="form-name" value={`contact-${activeFormType}`} />
                  
                  {/* Honeypot Fields - Hidden from users, bots will fill these */}
                  <div style={{ display: 'none' }} aria-hidden="true">
                    <input type="text" name="bot-field" tabIndex={-1} autoComplete="off" />
                    <input type="text" name="honeypot-1" tabIndex={-1} autoComplete="off" />
                    <input type="text" name="honeypot-2" tabIndex={-1} autoComplete="off" />
              </div>
                  <input type="hidden" name="form-type" value={activeFormType} />
                  
                  {/* Honeypot field for spam protection (hidden from users) */}
                  <div style={{ display: 'none' }}>
                    <label>
                      Don't fill this out if you're human: <input name="bot-field" />
                    </label>
            </div>
                  
                  {/* Common Fields */}
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
                        required
                        className={`input ${fieldErrors.firstName ? 'input-error' : ''}`}
                        placeholder="First name"
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
                    required
                        className={`input ${fieldErrors.lastName ? 'input-error' : ''}`}
                        placeholder="Last name"
                  />
                      {fieldErrors.lastName && (
                        <p className="field-error-message">{fieldErrors.lastName}</p>
                      )}
                </div>
                </div>

                  <div className="contact-form-field">
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
                    placeholder="your.email@example.com"
                  />
                  {fieldErrors.email && (
                    <p className="field-error-message">{fieldErrors.email}</p>
                  )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                      <label htmlFor="phone" className="contact-form-label">
                        Phone Number
                      </label>
                      <IMaskInput
                        mask="(000) 000-0000"
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onAccept={(value) => {
                          const event = {
                            target: { name: 'phone', value, type: 'tel' }
                          } as React.ChangeEvent<HTMLInputElement>
                          handleInputChange(event)
                        }}
                        onBlur={() => {
                          const event = {
                            target: { name: 'phone', value: formData.phone, type: 'tel' }
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
                    {activeFormType !== 'installer' && (
                      <div>
                        <label htmlFor="company" className="contact-form-label">
                          Company {activeFormType === 'sales' || activeFormType === 'demo' ? '*' : ''}
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                          onBlur={handleBlur}
                          required={activeFormType === 'sales' || activeFormType === 'demo'}
                          className={`input ${fieldErrors.company ? 'input-error' : ''}`}
                    placeholder="Your company name"
                  />
                        {fieldErrors.company && (
                          <p className="field-error-message">{fieldErrors.company}</p>
                        )}
                </div>
                    )}
                </div>

                  {/* How did you hear about us - for general, sales, and demo */}
                  {(activeFormType === 'general' || activeFormType === 'sales' || activeFormType === 'demo') && (
                <div>
                      <label htmlFor="referralSource" className="contact-form-label">
                        How did you hear about us?
                  </label>
                      <select
                        id="referralSource"
                        name="referralSource"
                        value={formData.referralSource}
                    onChange={handleInputChange}
                    className="input"
                      >
                        <option value="">Select an option</option>
                        <option value="search-engine">Search Engine (Google, Bing, etc.)</option>
                        <option value="social-media">Social Media</option>
                        <option value="hvac-contractor">Referred by HVAC Contractor</option>
                        <option value="friend-family">Friend or Family</option>
                        <option value="trade-show">Trade Show or Event</option>
                        <option value="online-ad">Online Advertisement</option>
                        <option value="article-blog">Article or Blog Post</option>
                        <option value="other">Other</option>
                      </select>
                </div>
                  )}

                  {/* Form Type Specific Fields */}
                  {activeFormType === 'general' && (
                    <>
              <div>
                        <label htmlFor="customerType" className="contact-form-label">
                  Customer Type
                </label>
                <select
                  id="customerType"
                  name="customerType"
                  value={formData.customerType}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="">Select your customer type</option>
                  <option value="homeowner">Homeowner</option>
                  <option value="hvac-contractor">HVAC Contractor</option>
                          <option value="property-manager">Property Manager</option>
                  <option value="city-official">City/Code Official</option>
                  <option value="other">Other</option>
                </select>
              </div>
                    </>
                  )}

                  {activeFormType === 'support' && (
                    <>
              <div>
                        <label htmlFor="customerType" className="contact-form-label">
                  Customer Type
                </label>
                <select
                  id="customerType"
                  name="customerType"
                  value={formData.customerType}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="">Select your customer type</option>
                  <option value="homeowner">Homeowner</option>
                  <option value="hvac-contractor">HVAC Contractor</option>
                          <option value="property-manager">Property Manager</option>
                  <option value="city-official">City/Code Official</option>
                  <option value="other">Other</option>
                </select>
              </div>
                      <div className="contact-form-grid">
                        <div>
                          <label htmlFor="product" className="contact-form-label">
                            Product *
                          </label>
                          <select
                            id="product"
                            name="product"
                            value={formData.product || ''}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                            className={`input ${fieldErrors.product ? 'input-error' : ''}`}
                          >
                            <option value="">Select a product</option>
                            <option value="mini">AC Drain Wiz Mini</option>
                            <option value="sensor">AC Drain Wiz Sensor</option>
                            <option value="mini-sensor">Mini + Sensor Combo</option>
                            <option value="core-1.0">Core 1.0</option>
                            <option value="other">Other</option>
                          </select>
                          {fieldErrors.product && (
                            <p className="field-error-message">{fieldErrors.product}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="issueType" className="contact-form-label">
                            Issue Type *
                          </label>
                          <select
                            id="issueType"
                            name="issueType"
                            value={formData.issueType || ''}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                            className={`input ${fieldErrors.issueType ? 'input-error' : ''}`}
                          >
                            <option value="">Select issue type</option>
                            <option value="installation">Installation Help</option>
                            <option value="technical">Technical Issue</option>
                            <option value="warranty">Warranty Question</option>
                            <option value="parts">Replacement Parts</option>
                            <option value="other">Other</option>
                          </select>
                          {fieldErrors.issueType && (
                            <p className="field-error-message">{fieldErrors.issueType}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label htmlFor="priority" className="contact-form-label">
                          Priority
                        </label>
                        <select
                          id="priority"
                          name="priority"
                          value={formData.priority || ''}
                          onChange={handleInputChange}
                          className="input"
                        >
                          <option value="low">Low - General question</option>
                          <option value="medium">Medium - Need help soon</option>
                          <option value="high">High - Urgent issue</option>
                        </select>
                      </div>
                    </>
                  )}

                  {activeFormType === 'sales' && (
                    <>
              <div>
                        <label htmlFor="customerType" className="contact-form-label">
                          Customer Type
                        </label>
                        <select
                          id="customerType"
                          name="customerType"
                          value={formData.customerType}
                          onChange={handleInputChange}
                          className="input"
                        >
                          <option value="">Select your customer type</option>
                          <option value="hvac-contractor">HVAC Contractor</option>
                          <option value="property-manager">Property Manager</option>
                          <option value="distributor-wholesaler">Distributor/Wholesaler</option>
                          <option value="city-official">City/Code Official</option>
                          <option value="facility-manager">Facility Manager</option>
                          <option value="building-owner">Building Owner</option>
                          <option value="maintenance-company">Maintenance Company</option>
                          <option value="real-estate-developer">Real Estate Developer</option>
                          <option value="construction-company">Construction Company</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="contact-form-grid">
                        <div>
                          <label htmlFor="role" className="contact-form-label">
                            Your Role *
                          </label>
                          <select
                            id="role"
                            name="role"
                            value={formData.role || ''}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                            className={`input ${fieldErrors.role ? 'input-error' : ''}`}
                          >
                            <option value="">Select your role</option>
                            <option value="business-owner">Business Owner</option>
                            <option value="hvac-contractor">HVAC Contractor</option>
                            <option value="property-manager">Property Manager</option>
                            <option value="operations-manager">Operations Manager</option>
                            <option value="facility-manager">Facility Manager</option>
                            <option value="maintenance-manager">Maintenance Manager</option>
                            <option value="purchasing-manager">Purchasing Manager</option>
                            <option value="procurement-manager">Procurement Manager</option>
                            <option value="sales-manager">Sales Manager</option>
                            <option value="project-manager">Project Manager</option>
                            <option value="retailer">Retailer</option>
                            <option value="distributor-wholesaler">Distributor/Wholesaler</option>
                            <option value="other">Other</option>
                          </select>
                          {fieldErrors.role && (
                            <p className="field-error-message">{fieldErrors.role}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="annualVolume" className="contact-form-label">
                            Annual Volume
                          </label>
                          <select
                            id="annualVolume"
                            name="annualVolume"
                            value={formData.annualVolume || ''}
                            onChange={handleInputChange}
                            className="input"
                          >
                            <option value="">Select volume range</option>
                            <option value="1-50">1-50 units/year</option>
                            <option value="51-200">51-200 units/year</option>
                            <option value="201-500">201-500 units/year</option>
                            <option value="500+">500+ units/year</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="interest" className="contact-form-label">
                          Interest Type *
                        </label>
                        <select
                          id="interest"
                          name="interest"
                          value={formData.interest || ''}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          required
                          className={`input ${fieldErrors.interest ? 'input-error' : ''}`}
                        >
                          <option value="">Select interest type</option>
                          <option value="bulk-pricing">Bulk Pricing</option>
                          <option value="partner-program">Partner Program</option>
                          <option value="portfolio-installation">Portfolio Installation</option>
                          <option value="custom-solution">Custom Solution</option>
                          <option value="other">Other</option>
                        </select>
                        {fieldErrors.interest && (
                          <p className="field-error-message">{fieldErrors.interest}</p>
                        )}
                      </div>
                    </>
                  )}

                  {activeFormType === 'installer' && (
                    <>
                      <div>
                        <label htmlFor="location" className="contact-form-label">
                          Location (ZIP or City) *
                        </label>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={formData.location || ''}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          required
                          className={`input ${fieldErrors.location ? 'input-error' : ''}`}
                          placeholder="ZIP code or city name"
                        />
                        {fieldErrors.location && (
                          <p className="field-error-message">{fieldErrors.location}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="productToInstall" className="contact-form-label">
                          Product to be installed *
                        </label>
                        <select
                          id="productToInstall"
                          name="productToInstall"
                          value={formData.productToInstall || ''}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          required
                          className={`input ${fieldErrors.productToInstall ? 'input-error' : ''}`}
                        >
                          <option value="">Select a product</option>
                          <option value="mini">ACDW Mini</option>
                          <option value="sensor">ACDW Sensor</option>
                          <option value="mini-sensor">ACDW Mini & Sensor Combo</option>
                        </select>
                        {fieldErrors.productToInstall && (
                          <p className="field-error-message">{fieldErrors.productToInstall}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="preferredContact" className="contact-form-label">
                          Preferred Contact Method
                        </label>
                        <select
                          id="preferredContact"
                          name="preferredContact"
                          value={formData.preferredContact || ''}
                          onChange={handleInputChange}
                          className="input"
                        >
                          <option value="">Select method</option>
                          <option value="email">Email</option>
                          <option value="phone">Phone</option>
                          <option value="either">Either</option>
                        </select>
                      </div>
                    </>
                  )}

                  {activeFormType === 'demo' && (
                    <>
                      <div>
                        <label htmlFor="customerType" className="contact-form-label">
                          Customer Type
                        </label>
                        <select
                          id="customerType"
                          name="customerType"
                          value={formData.customerType}
                          onChange={handleInputChange}
                          className="input"
                        >
                          <option value="">Select your customer type</option>
                          <option value="hvac-contractor">HVAC Contractor</option>
                          <option value="property-manager">Property Manager</option>
                          <option value="distributor-wholesaler">Distributor/Wholesaler</option>
                          <option value="city-official">City/Code Official</option>
                          <option value="facility-manager">Facility Manager</option>
                          <option value="building-owner">Building Owner</option>
                          <option value="maintenance-company">Maintenance Company</option>
                          <option value="real-estate-developer">Real Estate Developer</option>
                          <option value="construction-company">Construction Company</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="contact-form-grid">
                        <div>
                          <label htmlFor="demoType" className="contact-form-label">
                            Demo Type *
                          </label>
                          <select
                            id="demoType"
                            name="demoType"
                            value={formData.demoType || ''}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                            className={`input ${fieldErrors.demoType ? 'input-error' : ''}`}
                          >
                            <option value="">Select demo type</option>
                            <option value="in-person">In-Person Demo</option>
                            <option value="virtual">Virtual Demo</option>
                            <option value="product-showcase">Product Showcase</option>
                            <option value="compliance-review">Compliance Review</option>
                          </select>
                          {fieldErrors.demoType && (
                            <p className="field-error-message">{fieldErrors.demoType}</p>
                          )}
                        </div>
                        <div className="relative">
                          <label htmlFor="preferredDate" className="contact-form-label">
                            Preferred Date
                          </label>
                          <input
                            type="text"
                            id="preferredDate"
                            name="preferredDate"
                            value={formData.preferredDate ? formatDisplayDate(formData.preferredDate) : ''}
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowCalendar(true)
                            }}
                            readOnly
                            placeholder="Select a date"
                            className={`input cursor-pointer ${fieldErrors.preferredDate ? 'input-error' : ''}`}
                          />
                          {showCalendar && (
                            <div className="calendar-popup">
                              <DayPicker
                                mode="single"
                                selected={stringToDate(formData.preferredDate)}
                                onSelect={handleDateChange}
                                disabled={[
                                  { before: new Date() },
                                  { dayOfWeek: [0, 6] } // Disable Sunday (0) and Saturday (6)
                                ]}
                                showOutsideDays
                                className="rdp-custom"
                                modifiersClassNames={{
                                  selected: 'my-selected',
                                  today: 'my-today'
                                }}
                                styles={{
                                  root: { width: '100%' },
                                  months: { width: '100%' },
                                  month: { width: '100%' },
                                  caption: { width: '100%' },
                                  table: { width: '100%' },
                                  head: { width: '100%' },
                                  tbody: { width: '100%' }
                                }}
                              />
                            </div>
                          )}
                          {fieldErrors.preferredDate && (
                            <p className="field-error-message">{fieldErrors.preferredDate}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label htmlFor="preferredTime" className="contact-form-label">
                          Preferred Time
                        </label>
                        <select
                          id="preferredTime"
                          name="preferredTime"
                          value={formData.preferredTime || ''}
                          onChange={handleInputChange}
                          className="input"
                        >
                          <option value="">Select time</option>
                          <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                          <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                          <option value="Flexible">Flexible</option>
                        </select>
                      </div>
                      
                      {/* Priority 1: Location Fields */}
                      <div className="contact-form-grid">
                        <div>
                          <label htmlFor="demo-city" className="contact-form-label">
                            City *
                          </label>
                          <input
                            type="text"
                            id="demo-city"
                            name="city"
                            value={formData.city || ''}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                            className={`input ${fieldErrors.city ? 'input-error' : ''}`}
                            placeholder="City"
                          />
                          {fieldErrors.city && (
                            <p className="field-error-message">{fieldErrors.city}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="demo-state" className="contact-form-label">
                            State *
                          </label>
                          <select
                            id="demo-state"
                            name="state"
                            value={formData.state || ''}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                            className={`input ${fieldErrors.state ? 'input-error' : ''}`}
                          >
                            <option value="">Select state</option>
                            <option value="FL">Florida</option>
                            <option value="AL">Alabama</option>
                            <option value="AK">Alaska</option>
                            <option value="AZ">Arizona</option>
                            <option value="AR">Arkansas</option>
                            <option value="CA">California</option>
                            <option value="CO">Colorado</option>
                            <option value="CT">Connecticut</option>
                            <option value="DE">Delaware</option>
                            <option value="GA">Georgia</option>
                            <option value="HI">Hawaii</option>
                            <option value="ID">Idaho</option>
                            <option value="IL">Illinois</option>
                            <option value="IN">Indiana</option>
                            <option value="IA">Iowa</option>
                            <option value="KS">Kansas</option>
                            <option value="KY">Kentucky</option>
                            <option value="LA">Louisiana</option>
                            <option value="ME">Maine</option>
                            <option value="MD">Maryland</option>
                            <option value="MA">Massachusetts</option>
                            <option value="MI">Michigan</option>
                            <option value="MN">Minnesota</option>
                            <option value="MS">Mississippi</option>
                            <option value="MO">Missouri</option>
                            <option value="MT">Montana</option>
                            <option value="NE">Nebraska</option>
                            <option value="NV">Nevada</option>
                            <option value="NH">New Hampshire</option>
                            <option value="NJ">New Jersey</option>
                            <option value="NM">New Mexico</option>
                            <option value="NY">New York</option>
                            <option value="NC">North Carolina</option>
                            <option value="ND">North Dakota</option>
                            <option value="OH">Ohio</option>
                            <option value="OK">Oklahoma</option>
                            <option value="OR">Oregon</option>
                            <option value="PA">Pennsylvania</option>
                            <option value="RI">Rhode Island</option>
                            <option value="SC">South Carolina</option>
                            <option value="SD">South Dakota</option>
                            <option value="TN">Tennessee</option>
                            <option value="TX">Texas</option>
                            <option value="UT">Utah</option>
                            <option value="VT">Vermont</option>
                            <option value="VA">Virginia</option>
                            <option value="WA">Washington</option>
                            <option value="WV">West Virginia</option>
                            <option value="WI">Wisconsin</option>
                            <option value="WY">Wyoming</option>
                            <option value="DC">District of Columbia</option>
                          </select>
                          {fieldErrors.state && (
                            <p className="field-error-message">{fieldErrors.state}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="demo-zip" className="contact-form-label">
                            ZIP Code *
                          </label>
                          <input
                            type="text"
                            id="demo-zip"
                            name="zip"
                            value={formData.zip || ''}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                            className={`input ${fieldErrors.zip ? 'input-error' : ''}`}
                            placeholder="ZIP Code"
                            maxLength={5}
                            pattern="[0-9]{5}"
                          />
                          {fieldErrors.zip && (
                            <p className="field-error-message">{fieldErrors.zip}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Priority 1: Products of Interest */}
                      <div>
                        <label className="contact-form-label">
                          Products of Interest *
                        </label>
                        <div className="contact-form-checkbox-group">
                          <label className="contact-form-checkbox-label">
                            <input
                              type="checkbox"
                              name="productsOfInterest"
                              value="mini"
                              checked={formData.productsOfInterest?.includes('mini') || false}
                              onChange={(e) => {
                                const current = formData.productsOfInterest || []
                                const updated = e.target.checked
                                  ? [...current, 'mini']
                                  : current.filter(p => p !== 'mini')
                                setFormData({ ...formData, productsOfInterest: updated })
                                if (fieldErrors.productsOfInterest) {
                                  setFieldErrors({ ...fieldErrors, productsOfInterest: '' })
                                }
                              }}
                              className="contact-form-checkbox"
                            />
                            <span>AC Drain Wiz Mini</span>
                          </label>
                          <label className="contact-form-checkbox-label">
                            <input
                              type="checkbox"
                              name="productsOfInterest"
                              value="sensor"
                              checked={formData.productsOfInterest?.includes('sensor') || false}
                              onChange={(e) => {
                                const current = formData.productsOfInterest || []
                                const updated = e.target.checked
                                  ? [...current, 'sensor']
                                  : current.filter(p => p !== 'sensor')
                                setFormData({ ...formData, productsOfInterest: updated })
                                if (fieldErrors.productsOfInterest) {
                                  setFieldErrors({ ...fieldErrors, productsOfInterest: '' })
                                }
                              }}
                              className="contact-form-checkbox"
                            />
                            <span>AC Drain Wiz Sensor</span>
                          </label>
                          <label className="contact-form-checkbox-label">
                            <input
                              type="checkbox"
                              name="productsOfInterest"
                              value="bundle"
                              checked={formData.productsOfInterest?.includes('bundle') || false}
                              onChange={(e) => {
                                const current = formData.productsOfInterest || []
                                const updated = e.target.checked
                                  ? [...current, 'bundle']
                                  : current.filter(p => p !== 'bundle')
                                setFormData({ ...formData, productsOfInterest: updated })
                                if (fieldErrors.productsOfInterest) {
                                  setFieldErrors({ ...fieldErrors, productsOfInterest: '' })
                                }
                              }}
                              className="contact-form-checkbox"
                            />
                            <span>Mini + Sensor Bundle</span>
                          </label>
                        </div>
                        {fieldErrors.productsOfInterest && (
                          <p className="field-error-message">{fieldErrors.productsOfInterest}</p>
                        )}
                      </div>
                      
                      {/* Priority 1: Number of Attendees */}
                      <div>
                        <label htmlFor="numberOfAttendees" className="contact-form-label">
                          Number of Attendees *
                        </label>
                        <select
                          id="numberOfAttendees"
                          name="numberOfAttendees"
                          value={formData.numberOfAttendees || ''}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          required
                          className={`input ${fieldErrors.numberOfAttendees ? 'input-error' : ''}`}
                        >
                          <option value="">Select number of attendees</option>
                          <option value="1-2">1-2 people</option>
                          <option value="3-5">3-5 people</option>
                          <option value="6-10">6-10 people</option>
                          <option value="10+">10+ people</option>
                        </select>
                        {fieldErrors.numberOfAttendees && (
                          <p className="field-error-message">{fieldErrors.numberOfAttendees}</p>
                        )}
                      </div>
                      
                      {/* Priority 2: Portfolio Size */}
                      <div>
                        <label htmlFor="portfolioSize" className="contact-form-label">
                          Property/Portfolio Size
                        </label>
                        <select
                          id="portfolioSize"
                          name="portfolioSize"
                          value={formData.portfolioSize || ''}
                          onChange={handleInputChange}
                          className="input"
                        >
                          <option value="">Select portfolio size (if applicable)</option>
                          <option value="1-10">1-10 units</option>
                          <option value="11-50">11-50 units</option>
                          <option value="51-100">51-100 units</option>
                          <option value="101-250">101-250 units</option>
                          <option value="251-500">251-500 units</option>
                          <option value="500+">500+ units</option>
                          <option value="not-applicable">Not Applicable</option>
                        </select>
                      </div>
                      
                      {/* Priority 2: Demo Focus */}
                      <div>
                        <label htmlFor="demoFocus" className="contact-form-label">
                          Demo Focus
                        </label>
                        <select
                          id="demoFocus"
                          name="demoFocus"
                          value={formData.demoFocus || ''}
                          onChange={handleInputChange}
                          className="input"
                        >
                          <option value="">What would you like to see? (optional)</option>
                          <option value="installation">Installation Process</option>
                          <option value="monitoring">Monitoring & Alerts</option>
                          <option value="compliance">Code Compliance</option>
                          <option value="roi">ROI & Business Case</option>
                          <option value="product-features">Product Features Overview</option>
                          <option value="custom">Custom/Other</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* Message Field */}
              <div>
                    <label htmlFor="message" className="contact-form-label">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                      rows={3}
                      maxLength={MESSAGE_MAX_LENGTH}
                  className={`input ${fieldErrors.message ? 'input-error' : ''}`}
                      placeholder={
                        activeFormType === 'support' ? 'Describe your issue or question...' :
                        activeFormType === 'sales' ? 'Tell us about your needs and how we can help...' :
                        activeFormType === 'installer' ? 'Any specific requirements or preferences...' :
                        activeFormType === 'demo' ? 'Additional details about your demo request...' :
                        'Tell us about your needs, questions, or how we can help...'
                      }
                    />
                    {fieldErrors.message && (
                      <p className="field-error-message">{fieldErrors.message}</p>
                    )}
                    <div className="contact-form-char-count">
                      <span className={`contact-form-char-count-text ${
                        formData.message.length > MESSAGE_MAX_LENGTH * 0.9 
                          ? 'contact-form-char-count-warning' 
                          : ''
                      }`}>
                        {formData.message.length} / {MESSAGE_MAX_LENGTH} characters
                      </span>
                    </div>
              </div>

                  {/* Privacy Consent */}
                  <div className="mt-6">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        required
                        className={`mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded ${fieldErrors.consent ? 'border-red-500' : ''}`}
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        I agree to the <button type="button" onClick={() => navigate('/privacy-policy')} className="text-primary-600 hover:text-primary-700 underline">Privacy Policy</button> and consent to AC Drain Wiz contacting me via email or phone regarding my inquiry. *
                      </span>
                    </label>
                    {fieldErrors.consent && (
                      <p className="field-error-message ml-6">{fieldErrors.consent}</p>
                    )}
                  </div>

                  {/* Animated Success Modal */}
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
                            <circle 
                              cx="12" 
                              cy="12" 
                              r="10" 
                              className="contact-success-modal-circle"
                            />
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              d="M9 12l2 2 4-4" 
                              className="contact-success-modal-checkmark"
                            />
                          </svg>
                        </div>
                        <h3 className="contact-success-modal-title">Message Sent Successfully!</h3>
                        <p className="contact-success-modal-message">
                          Thank you for contacting us. We've received your message and will get back to you within 24 hours.
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

                  {/* Error Message */}
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
                    {isSubmitting ? 'Sending...' : activeConfig.buttonText}
              </button>
            </form>
              </div>
            </div>

            {/* Contact Information Sidebar */}
            <div className="contact-sidebar">
              <div className="contact-sidebar-card">
                <h2 className="contact-sidebar-title">Get in Touch</h2>
                
                {/* Leadership Contact */}
                <div className="contact-leadership-section">
                  <h3 className="contact-leadership-title">Leadership</h3>
                  <div className="contact-leadership-content">
                    <div className="contact-leadership-avatar">
                      <BuildingOfficeIcon className="contact-leadership-icon" />
                    </div>
                    <div>
                      <h4 className="contact-leadership-name">Alan Riddle</h4>
                      <p className="contact-leadership-role">Founder & CEO</p>
                      <div className="contact-leadership-links">
                        <a 
                          href="mailto:ariddle@acdrainwiz.com" 
                          className="contact-leadership-link"
                        >
                          <EnvelopeIcon className="contact-leadership-link-icon" />
                          <span>ariddle@acdrainwiz.com</span>
                        </a>
                        <a 
                          href="tel:+12342237246" 
                          className="contact-leadership-link"
                        >
                          <PhoneIcon className="contact-leadership-link-icon" />
                          <span>(234) AC DRAIN</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Contact Info */}
                <div className="contact-quick-info-section">
                  <h3 className="contact-quick-info-title">Quick Contact</h3>
                  <div className="contact-quick-info-list">
                    <p><strong>Email:</strong> info@acdrainwiz.com</p>
                    <p><strong>Phone:</strong> (234) AC DRAIN</p>
                    <p><strong>Hours:</strong> Mon-Fri, 9:00 AM - 5:00 PM EST</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8 max-w-6xl mx-auto">
          <h2 className="heading-2 mb-6 text-center">Why Choose AC Drain Wiz?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <EnvelopeIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Expert Support</h3>
              <p className="text-sm text-gray-600">Professional technical support and guidance from our experienced team</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BuildingOfficeIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Industry Expertise</h3>
              <p className="text-sm text-gray-600">Deep understanding of HVAC maintenance challenges and solutions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PhoneIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quick Response</h3>
              <p className="text-sm text-gray-600">Fast response times to help you get back to work quickly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
