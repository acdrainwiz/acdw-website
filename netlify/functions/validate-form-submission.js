
// Import utilities
const { checkRateLimit, getRateLimitHeaders, getClientIP } = require('./utils/rate-limiter')
const { sanitizeFormData } = require('./utils/input-sanitizer')
const { getSecurityHeaders } = require('./utils/cors-config')
const { 
  logFormSubmission, 
  logBotDetected, 
  logRecaptcha, 
  logRateLimit, 
  logInjectionAttempt,
  EVENT_TYPES 
} = require('./utils/security-logger')

const { validateRequestFingerprint } = require('./utils/request-fingerprint')
const { validateIP, addToBlacklist } = require('./utils/ip-reputation')
const { validateSubmissionBehavior } = require('./utils/behavioral-analysis')
const { validateEmailDomain } = require('./utils/email-domain-validator')
const { initBlobsStores } = require('./utils/blobs-store')
const ghlClient = require('./utils/ghl-client')

// Comma-separated origin allowlist for preview/branch deploys. Supports glob `*`.
// e.g. EXTRA_ALLOWED_ORIGINS=https://*--lucky-frangollo-bf579b.netlify.app
const EXTRA_ORIGIN_ENTRIES = (process.env.EXTRA_ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

function originAllowedByExtra(origin) {
  if (!origin) return false
  for (const entry of EXTRA_ORIGIN_ENTRIES) {
    if (entry.includes('*')) {
      const pattern = '^' + entry.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*') + '$'
      if (new RegExp(pattern).test(origin)) return true
    } else if (origin.startsWith(entry)) {
      return true
    }
  }
  return false
}

// form-name values from the frontend → ghl-field-map.js config keys
const FORM_NAME_TO_GHL_TYPE = {
  'contact-general': 'contact-general',
  'contact-support': 'contact-support',
  'contact-sales': 'contact-sales',
  'contact-installer': 'contact-installer',
  'contact-demo': 'contact-demo',
  'core-upgrade': 'core-upgrade',
  'unsubscribe': 'unsubscribe',
  'ep-x7k9m2': 'email-preferences',
  'municipal-intake': 'municipal-intake',
  'municipal-quick-intake': 'municipal-quick-intake',
}


const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY

const verifyRecaptcha = async (token) => {
  if (!RECAPTCHA_SECRET_KEY) {
    console.warn('reCAPTCHA secret key not configured - skipping verification')
    return { success: false, score: 0, error: 'Not configured' }
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET_KEY,
        response: token
      }).toString()
    })

    const data = await response.json()
    return {
      success: data.success || false,
      score: data.score || 0,
      action: data.action || '',
      challenge_ts: data.challenge_ts,
      hostname: data.hostname,
      'error-codes': data['error-codes'] || []
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error)
    return { success: false, score: 0, error: error.message }
  }
}

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const trimmedEmail = email?.trim() || ''
  
  if (!trimmedEmail) {
    return { valid: false, error: 'Email is required' }
  }
  
  if (!emailRegex.test(trimmedEmail)) {
    return { valid: false, error: 'Invalid email format' }
  }
  
  return { valid: true, email: trimmedEmail }
}

const validateFormFields = (formType, formData) => {
  const errors = []
  
  if (formType.startsWith('contact-')) {
    const contactSubType = formType.replace('contact-', '')
    const firstName = formData.get('firstName')?.trim() || ''
    const lastName = formData.get('lastName')?.trim() || ''
    const message = formData.get('message')?.trim() || ''
    
    if (!firstName) errors.push('First name is required')
    if (!lastName) errors.push('Last name is required')
    if (!message) errors.push('Message is required')
    const contactPrivacyConsent = formData.get('consent')
    if (contactPrivacyConsent !== 'yes') {
      errors.push('You must accept the Privacy Policy to continue')
    }
    if (message && message.length > 2000) {
      errors.push('Message must be 2000 characters or less')
    }
    
    switch (contactSubType) {
      case 'support':
        const product = formData.get('product')?.trim() || ''
        const issueType = formData.get('issueType')?.trim() || ''
        if (!product) errors.push('Product is required')
        if (!issueType) errors.push('Issue type is required')
        break
        
      case 'sales':
        // Sales form requires: company, role, interest
        const company = formData.get('company')?.trim() || ''
        const role = formData.get('role')?.trim() || ''
        const interest = formData.get('interest')?.trim() || ''
        if (!company) errors.push('Company is required')
        if (!role) errors.push('Role is required')
        if (!interest) errors.push('Interest type is required')
        break
        
      case 'installer':
        // Installer form requires: location, productToInstall
        const location = formData.get('location')?.trim() || ''
        const productToInstall = formData.get('productToInstall')?.trim() || ''
        if (!location) errors.push('Location is required')
        if (!productToInstall) errors.push('Product to install is required')
        break
        
      case 'demo':
        // Demo form requires: company, demoType, city, state, zip, numberOfAttendees, productsOfInterest
        const demoCompany = formData.get('company')?.trim() || ''
        const demoType = formData.get('demoType')?.trim() || ''
        const demoCity = formData.get('city')?.trim() || ''
        const demoState = formData.get('state')?.trim() || ''
        const demoZip = formData.get('zip')?.trim() || ''
        const numberOfAttendees = formData.get('numberOfAttendees')?.trim() || ''
        const productsOfInterest = formData.get('productsOfInterest')?.trim() || ''
        if (!demoCompany) errors.push('Company is required')
        if (!demoType) errors.push('Demo type is required')
        if (!demoCity) errors.push('City is required')
        if (!demoState) errors.push('State is required')
        if (!demoZip) errors.push('ZIP code is required')
        if (demoZip && !/^\d{5}$/.test(demoZip)) {
          errors.push('ZIP code must be 5 digits')
        }
        if (!numberOfAttendees) errors.push('Number of attendees is required')
        if (!productsOfInterest) errors.push('At least one product of interest is required')
        break
        
      case 'general':
        // General form - no additional required fields beyond common ones
        break
        
      default:
        console.warn(`Unknown contact form subtype: ${contactSubType}`)
    }
  } else {
    // Handle other form types
    switch (formType) {
      case 'hero-email':
      case 'promo':
        // Email-only forms - email validation handled separately
        break
        
      case 'upgrade':
        // Core 1.0 upgrade form requires: firstName, lastName, email, phone, street, city, state, zip, consent, photoUrl
        const upgradeFirstName = formData.get('firstName')?.trim() || ''
        const upgradeLastName = formData.get('lastName')?.trim() || ''
        const upgradeEmail = formData.get('email')?.trim() || ''
        const upgradePhone = formData.get('phone')?.trim() || ''
        const upgradeStreet = formData.get('street')?.trim() || ''
        const upgradeCity = formData.get('city')?.trim() || ''
        const upgradeState = formData.get('state')?.trim() || ''
        const upgradeZip = formData.get('zip')?.trim() || ''
        const upgradeConsent = formData.get('consent')
        const upgradePhotoUrl = formData.get('photoUrl')?.trim() || '' // Now expecting URL instead of file
        
        if (!upgradeFirstName) errors.push('First name is required')
        if (!upgradeLastName) errors.push('Last name is required')
        if (!upgradeEmail) {
          errors.push('Email is required')
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(upgradeEmail)) {
          errors.push('Invalid email format')
        }
        if (!upgradePhone) errors.push('Phone is required')
        if (!upgradeStreet) errors.push('Street address is required')
        if (!upgradeCity) errors.push('City is required')
        if (!upgradeState) errors.push('State is required')
        if (!upgradeZip) {
          errors.push('ZIP code is required')
        } else if (!/^\d{5}$/.test(upgradeZip)) {
          errors.push('ZIP code must be 5 digits')
        }
        if (!upgradeConsent || upgradeConsent !== 'yes') {
          errors.push(
            'You must confirm you understand the review, payment link, and shipping timeline to continue'
          )
        }
        if (!upgradePhotoUrl) {
          errors.push('Photo is required. Please upload a photo of your installed Core 1.0.')
        } else if (!upgradePhotoUrl.startsWith('data:image/') && !upgradePhotoUrl.startsWith('https://res.cloudinary.com/')) {
          // Validate that photoUrl is either a data URL or a Cloudinary URL
          errors.push('Invalid photo format. Please upload a valid image file.')
        }
        break
        
      case 'unsubscribe':
        // Unsubscribe form requires: email, reason (optional but must be valid if provided)
        const unsubscribeReason = formData.get('reason')?.trim() || ''
        if (unsubscribeReason) {
          // SECURITY: Validate dropdown value - prevent malformed email injection
          const ALLOWED_UNSUBSCRIBE_REASONS = [
            'too-many-emails',
            'not-relevant',
            'never-signed-up',
            'other'
          ]
          
          if (!ALLOWED_UNSUBSCRIBE_REASONS.includes(unsubscribeReason)) {
            // Check if reason looks like a malformed email (bot attack pattern)
            if (unsubscribeReason.includes('-') && !unsubscribeReason.includes('@')) {
              errors.push('Invalid reason selected - suspicious pattern detected')
              console.warn('🚨 Bot attack detected: Malformed email in unsubscribe reason field', {
                reason: unsubscribeReason,
              })
            } else {
              errors.push('Invalid reason selected')
            }
          }
        }
        break
        
      case 'email-preferences':
        // Email preferences form - email validation handled separately
        break

      case 'municipal-intake': {
        const muniFirstName = formData.get('firstName')?.trim() || ''
        const muniLastName = formData.get('lastName')?.trim() || ''
        const muniEmail = formData.get('email')?.trim() || ''
        const muniPhone = formData.get('phone')?.trim() || ''
        const muniMunicipality = formData.get('municipalityName')?.trim() || ''
        const muniState = formData.get('state')?.trim() || ''
        const muniParish = formData.get('parishCounty')?.trim() || ''
        const muniRole = formData.get('role')?.trim() || ''
        const muniNumberOfFacilities = formData.get('numberOfFacilities')?.trim() || ''
        const muniFacilityTypes = formData.get('facilityTypes')?.trim() || ''
        const muniAttendedEvent = formData.get('attendedEvent')?.trim() || ''
        const muniInterestedInOffer = formData.get('interestedInOffer')?.trim() || ''
        const muniInstallationTimeline = formData.get('installationTimeline')?.trim() || ''
        const muniAgreesToPurchase = formData.get('agreesToPurchase')?.trim() || ''
        const muniConsent = formData.get('consent')

        // Allowed dropdown / radio values — must match GHL field options exactly.
        const ALLOWED_STATES = ['FL', 'LA', 'AL', 'GA', 'MS', 'TX', 'Other']
        const ALLOWED_TIMELINES = [
          'Immediately', '1-30 Days', '31-60 Days', '61-90 Days', '90+ Days', 'Not Sure Yet',
        ]
        const ALLOWED_ATTENDED = ['Yes', 'No', 'Not Sure']
        const ALLOWED_INTERESTED = ['Yes', 'No', 'Maybe / Need More Information']
        const ALLOWED_AGREES = ['Yes', 'No', 'Pending Approval']

        if (!muniFirstName) errors.push('First name is required')
        if (!muniLastName) errors.push('Last name is required')
        if (!muniEmail) errors.push('Email is required')
        if (!muniPhone) errors.push('Phone is required')
        if (!muniMunicipality) errors.push('Municipality name is required')
        if (!muniState) {
          errors.push('State is required')
        } else if (!ALLOWED_STATES.includes(muniState)) {
          errors.push('Invalid state selected')
        }
        if (!muniParish) errors.push('Parish/County is required')
        if (!muniRole) errors.push('Primary contact title/role is required')
        if (!muniNumberOfFacilities) errors.push('Number of facilities is required')
        if (!muniFacilityTypes) errors.push('At least one facility type is required')
        if (!muniAttendedEvent) {
          errors.push('Attended COAA event answer is required')
        } else if (!ALLOWED_ATTENDED.includes(muniAttendedEvent)) {
          errors.push('Invalid value for Attended COAA Event')
        }
        if (!muniInterestedInOffer) {
          errors.push('COAA 2026 conference free Wi-Fi monitoring service offer interest answer is required')
        } else if (!ALLOWED_INTERESTED.includes(muniInterestedInOffer)) {
          errors.push('Invalid value for COAA 2026 conference free Wi-Fi monitoring service offer interest')
        }
        if (!muniInstallationTimeline) {
          errors.push('Preferred installation timeline is required')
        } else if (!ALLOWED_TIMELINES.includes(muniInstallationTimeline)) {
          errors.push('Invalid installation timeline selected')
        }
        if (!muniAgreesToPurchase) {
          errors.push('Agreement to purchase answer is required')
        } else if (!ALLOWED_AGREES.includes(muniAgreesToPurchase)) {
          errors.push('Invalid value for Agrees to Purchase')
        }
        if (muniConsent !== 'yes') {
          errors.push('You must accept the Privacy Policy to continue')
        }

        // Optional secondary contact: if email provided, validate format
        const muniSecondaryEmail = formData.get('secondaryEmail')?.trim() || ''
        if (muniSecondaryEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(muniSecondaryEmail)) {
          errors.push('Secondary contact email format is invalid')
        }
        break
      }

      case 'municipal-quick-intake': {
        const quickFirstName = formData.get('firstName')?.trim() || ''
        const quickLastName  = formData.get('lastName')?.trim()  || ''
        const quickEmail     = formData.get('email')?.trim()     || ''
        const quickStreet    = formData.get('street')?.trim()    || ''
        const quickCity      = formData.get('city')?.trim()      || ''
        const quickState     = formData.get('state')?.trim()     || ''
        const quickZip       = formData.get('zip')?.trim()       || ''
        const quickConsent   = formData.get('consent')

        if (!quickFirstName) errors.push('First name is required')
        if (!quickLastName)  errors.push('Last name is required')
        if (!quickEmail) {
          errors.push('Email is required')
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(quickEmail)) {
          errors.push('Invalid email format')
        }
        if (!quickStreet) errors.push('Street address is required')
        if (!quickCity)   errors.push('City is required')
        if (!quickState)  errors.push('State is required')
        if (!quickZip) {
          errors.push('ZIP code is required')
        } else if (!/^\d{5}$/.test(quickZip)) {
          errors.push('ZIP code must be 5 digits')
        }
        if (quickConsent !== 'yes') {
          errors.push('You must accept the Privacy Policy to continue')
        }
        break
      }

      default:
        console.warn(`Unknown form type: ${formType}`)
    }
  }
  
  return errors
}

exports.handler = async (event, context) => {

    let blobsInit = { initialized: false }
  try {
    blobsInit = initBlobsStores(context)
  } catch (blobsError) {
    // Blobs initialization failed - log but continue (fail-open)
    console.warn('⚠️ Blobs initialization error (continuing with fallback):', blobsError.message)
  }
  
    const headers = getSecurityHeaders(event)

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
    }

    // Rate limiting
    const ip = getClientIP(event)
    const rateLimitResult = await checkRateLimit(ip, 'form', context)
    if (!rateLimitResult.allowed) {
        return {
            statusCode: 429,
            headers: {
                ...headers,
                ...getRateLimitHeaders(rateLimitResult)
            },
            body: JSON.stringify({
                error: 'Too many form submissions. Please wait and try again.',
                retryAfter: rateLimitResult.retryAfter
            }),
        }
    }

  try {
    // SECURITY: Check if this is a webhook endpoint (exempt from some validations)
    const isWebhookEndpoint = (path) => {
      return path && (path.includes('stripe-webhook') || path.includes('webhook'))
    }
    
    const isCheckoutEndpoint = (path) => {
      return path && (path.includes('create-checkout') || path.includes('get-checkout-session') || path.includes('get-price-id'))
    }
    
    const path = event.path || ''

      const contentType = event.headers['content-type'] || event.headers['Content-Type'] || ''
    
      if (contentType.includes('multipart/form-data')) {
      console.warn(' Multipart form data received - this should not happen with new flow')
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid form data format',
          message: 'Please use the standard form submission. File uploads should be handled separately.'
        }),
      }
    }
    

      const formData = new URLSearchParams(event.body)
    

      const formName = formData.get('form-name') || ''
    const formType = formData.get('form-type') || 'contact'
    

      const ALLOWED_FORM_NAMES = [
      'contact-general',
      'contact-support',
      'contact-sales',
      'contact-installer',
      'contact-demo',
      'ep-x7k9m2',
      'unsubscribe',
      'promo-signup',
      'core-upgrade',
      'hero-email',
      'municipal-intake',
      'municipal-quick-intake'
    ]
    
    if (!isWebhookEndpoint(path) && !isCheckoutEndpoint(path)) {
      if (formName && !ALLOWED_FORM_NAMES.includes(formName)) {
        console.warn(' Invalid form name rejected:', {
          formName,
          ip: getClientIP(event),
          userAgent: event.headers['user-agent'] || 'unknown',
          path
        })
        logBotDetected(formType, 'invalid-form-name', getClientIP(event), event.headers['user-agent'] || 'unknown', {
          formName,
          allowedNames: ALLOWED_FORM_NAMES
        })
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Invalid form name',
            message: 'Form submission rejected'
          }),
        }
      }
    }
    
    if (!isWebhookEndpoint(path) && !isCheckoutEndpoint(path)) {
      const ALLOWED_ORIGINS = [
        'https://www.acdrainwiz.com',
        'https://acdrainwiz.com'
      ]

      const origin = event.headers.origin || event.headers.referer || ''
      const isValidOrigin = !origin
        || ALLOWED_ORIGINS.some(allowed => origin.startsWith(allowed))
        || originAllowedByExtra(origin)

      if (!isValidOrigin) {
        console.warn('❌ Invalid origin rejected:', {
          origin,
          ip: getClientIP(event),
          userAgent: event.headers['user-agent'] || 'unknown',
          path
        })
        logBotDetected(formType, 'invalid-origin', getClientIP(event), event.headers['user-agent'] || 'unknown', {
          origin,
          allowedOrigins: ALLOWED_ORIGINS
        })
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ 
            error: 'Invalid origin',
            message: 'Request rejected'
          }),
        }
      }
    }
    
    // SECURITY: User-Agent validation (exempt webhooks)
    if (!isWebhookEndpoint(path)) {
      const BOT_USER_AGENTS = [
        'curl',
        'wget',
        'python-requests',
        'go-http-client',
        'java/',
        'scrapy',
        'bot',
        'crawler',
        'spider',
        'httpie',
        'postman'
      ]
      
      const userAgent = event.headers['user-agent'] || ''
      const isBotUserAgent = BOT_USER_AGENTS.some(bot => userAgent.toLowerCase().includes(bot.toLowerCase()))
      
      if (isBotUserAgent) {
        console.warn('❌ Bot user agent rejected:', {
          userAgent,
          ip: getClientIP(event),
          path
        })
        logBotDetected(formType, 'bot-user-agent', getClientIP(event), userAgent, {
          userAgent,
          detectedBots: BOT_USER_AGENTS.filter(bot => userAgent.toLowerCase().includes(bot.toLowerCase()))
        })
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ 
            error: 'Bot detected',
            message: 'Request rejected'
          }),
        }
      }
    }
    
    // Get honeypot fields (field names may vary by form)
    const botField = formData.get('bot-field') || formData.get('website') || formData.get('url') || ''
    const honeypot1 = formData.get('honeypot-1') || ''
    const honeypot2 = formData.get('honeypot-2') || ''
    
    // Get reCAPTCHA token
    const recaptchaToken = formData.get('recaptcha-token') || ''
    
    // Get email for validation (before sanitization)
    const rawEmail = formData.get('email') || ''
    
    // Get request metadata for logging
    const ip = getClientIP(event)
    const userAgent = event.headers['user-agent'] || 'unknown'
    const origin = event.headers['origin'] || event.headers['referer'] || 'unknown'
    
    // ============================================
    // PHASE 1: Request Fingerprinting
    // ============================================
    // Only apply to form endpoints (not webhooks/checkout)
    if (!isWebhookEndpoint(path) && !isCheckoutEndpoint(path)) {
      try {
        const fingerprintCheck = validateRequestFingerprint(event, ip, userAgent)
        if (fingerprintCheck.isBot) {
          logBotDetected(formType, 'request-fingerprint-failed', ip, userAgent, {
            reason: fingerprintCheck.reason,
            details: fingerprintCheck.details,
            formName
          })
          // Return success to bot (honeypot technique)
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
              success: true,
              message: 'Form submitted successfully'
            }),
          }
        }
      } catch (fingerprintError) {
        // Fail open - allow if check fails
        console.error('Fingerprint check error:', fingerprintError.message)
      }
    }
    
    // ============================================
    // PHASE 2: IP Reputation & Blacklist
    // ============================================
    // Only apply to form endpoints (not webhooks/checkout)
    if (!isWebhookEndpoint(path) && !isCheckoutEndpoint(path)) {
      try {
        const ipValidation = await validateIP(ip, userAgent, formType)
        if (!ipValidation.allowed) {
          logBotDetected(formType, 'ip-validation-failed', ip, userAgent, {
            reason: ipValidation.reason,
            details: ipValidation.details,
            formName
          })
          // Return success to bot (honeypot technique)
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
              success: true,
              message: 'Form submitted successfully'
            }),
          }
        }
      } catch (ipCheckError) {
        // Fail open - allow if check fails
        console.error('IP validation error:', ipCheckError.message)
      }
    }
    
    const BOT_USER_AGENTS = [
      'curl', 'wget', 'python-requests', 'python', 'go-http-client',
      'java/', 'scrapy', 'bot', 'crawler', 'spider', 'headless',
      'phantom', 'selenium', 'postman', 'insomnia', 'httpie'
    ]
    
    const lowerUserAgent = userAgent.toLowerCase()
    if (BOT_USER_AGENTS.some(bot => lowerUserAgent.includes(bot))) {
      logBotDetected(formType, 'bot-user-agent', ip, userAgent, {
        detectedPattern: BOT_USER_AGENTS.find(bot => lowerUserAgent.includes(bot)),
        formName
      })
      console.warn('🚫 Bot detected: User-Agent match', {
        userAgent,
        ip,
        formType,
        formName
      })
      // Return success to bot to prevent detection, but don't forward to Netlify
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true,
          message: 'Form submitted successfully'
        }),
      }
    }
    
    // SECURITY: Validate Origin/Referer (Phase 2 - Origin Validation)
    // Must be from our domain to prevent CSRF and direct POST attacks
    const ALLOWED_ORIGINS = [
      'https://www.acdrainwiz.com',
      'https://acdrainwiz.com',
      'http://localhost:5173', // Development
      'http://localhost:8888', // Netlify dev
    ]

    const hasValidOrigin = ALLOWED_ORIGINS.some(allowedOrigin =>
      origin.startsWith(allowedOrigin)
    ) || originAllowedByExtra(origin)

    if (!hasValidOrigin && origin !== 'unknown') {
      logBotDetected(formType, 'invalid-origin', ip, userAgent, {
        origin,
        allowedOrigins: ALLOWED_ORIGINS,
        formName
      })
      console.warn('🚫 Bot detected: Invalid origin', {
        origin,
        ip,
        userAgent,
        formType,
        formName
      })
      // Return success to bot to prevent detection, but don't forward to Netlify
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true,
          message: 'Form submitted successfully'
        }),
      }
    }

    // Rate limiting check
    const rateLimitType = formType === 'upgrade' ? 'strict' : 'form'
    const rateLimitResult = await checkRateLimit(ip, rateLimitType, context)
    
    if (!rateLimitResult.allowed) {
      logRateLimit(ip, rateLimitType, rateLimitResult.limit, rateLimitResult.remaining, true)
      
      return {
        statusCode: 429,
        headers: {
          ...headers,
          ...getRateLimitHeaders(rateLimitResult)
        },
        body: JSON.stringify({
          success: false,
          error: 'Too many requests. Please try again later.',
          retryAfter: rateLimitResult.retryAfter
        })
      }
    }

    // Sanitize all text inputs (convert URLSearchParams to object for sanitization)
    const formDataObj = {}
    for (const [key, value] of formData.entries()) {
      // All values are strings now (no files - files converted to URLs on client)
      formDataObj[key] = String(value || '')
    }
    
    // Sanitize form data
    const sanitizedData = sanitizeFormData(formDataObj, formType)
    
    // Get sanitized email for validation
    const email = sanitizedData.email || rawEmail

    // Validation errors array
    const errors = []
    
    // 0. Verify reCAPTCHA token (if provided and configured)
    let recaptchaResult = null
    if (recaptchaToken) {
      recaptchaResult = await verifyRecaptcha(recaptchaToken)
      
      if (!recaptchaResult.success) {
        logRecaptcha(false, 0, recaptchaResult.action, ip, userAgent, recaptchaResult['error-codes'])
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Security verification failed',
            message: 'Please refresh and try again'
          }),
        }
      }
      
      const scoreThreshold = formType === 'unsubscribe' 
        ? parseFloat(process.env.RECAPTCHA_SCORE_THRESHOLD || '0.7')
        : parseFloat(process.env.RECAPTCHA_SCORE_THRESHOLD || '0.5')
      
      if (recaptchaResult.score < scoreThreshold) {
        logRecaptcha(true, recaptchaResult.score, recaptchaResult.action, ip, userAgent)
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Suspicious activity detected',
            message: 'Please try again'
          }),
        }
      }
      
      if (recaptchaResult.action) {

          const expectedAction = formType === 'unsubscribe' ? 'unsubscribe' : formType.replace(/-/g, '_')
        if (recaptchaResult.action !== expectedAction && recaptchaResult.action !== 'submit') {

            logBotDetected(formType, 'invalid-recaptcha-action', ip, userAgent, {
            expected: expectedAction,
            received: recaptchaResult.action,
            formName
          })

        }
      }
      
      logRecaptcha(true, recaptchaResult.score, recaptchaResult.action, ip, userAgent)
    } else if (RECAPTCHA_SECRET_KEY) {

        console.warn(' reCAPTCHA token missing (but configured)', {
        formType,
        ip,
        userAgent,
        email: email ? email.substring(0, 3) + '***' : 'none' 
      })

    }


      if (botField || honeypot1 || honeypot2) {
      logBotDetected(formType, 'honeypot', ip, userAgent, {
        botField: !!botField,
        honeypot1: !!honeypot1,
        honeypot2: !!honeypot2,
      })
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid submission',
          message: 'Bot detected'
        }),
      }
    }


      const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      errors.push(emailValidation.error)
    } else if (email && !isWebhookEndpoint(path) && !isCheckoutEndpoint(path)) {

        try {
        const domainValidation = await validateEmailDomain(email, ip, userAgent, formType)
        if (!domainValidation.valid) {
          logBotDetected(formType, 'email-domain-validation-failed', ip, userAgent, {
            reason: domainValidation.reason,
            details: domainValidation.details,
            formName
          })
          errors.push(domainValidation.details?.message || domainValidation.reason)
        }
      } catch (emailValidationError) {

            console.error('Email domain validation error:', emailValidationError.message)
      }
    }

      const formErrors = validateFormFields(formType, formData)
    errors.push(...formErrors)
    
    // SECURITY: Additional validation for unsubscribe form - dropdown value validation
    if (formType === 'unsubscribe' || formName === 'unsubscribe') {
      const unsubscribeReason = formData.get('reason')?.trim() || ''
      const unsubscribeEmail = formData.get('email')?.trim() || ''
      
      // Validate email format strictly - detect malformed email pattern
      const malformedEmailPattern = /^[a-z0-9]+-[a-z0-9]+-com$/i
      if (malformedEmailPattern.test(unsubscribeEmail)) {
        logBotDetected(formType, 'malformed-email-pattern', ip, userAgent, {
          email: unsubscribeEmail,
          formName
        })
        console.warn('🚨 Bot attack detected: Malformed email pattern in email field', {
          email: unsubscribeEmail,
          ip,
          userAgent,
          formName
        })
        errors.push('Invalid email format')
      }
      
      // Validate reason dropdown
      if (unsubscribeReason) {
        const ALLOWED_UNSUBSCRIBE_REASONS = [
          'too-many-emails',
          'not-relevant',
          'never-signed-up',
          'spam',
          'privacy-concerns',
          'other'
        ]
        
        if (!ALLOWED_UNSUBSCRIBE_REASONS.includes(unsubscribeReason)) {
          // Check if reason looks like a malformed email (bot attack pattern)
          if (unsubscribeReason.includes('-') && !unsubscribeReason.includes('@') && unsubscribeReason.length > 10) {
            errors.push('Invalid reason selected - suspicious pattern detected')
            logBotDetected(formType, 'malformed-email-in-dropdown', ip, userAgent, {
              reason: unsubscribeReason,
              formName,
              email: rawEmail.substring(0, 20) + '***'
            })
            console.warn('🚨 Bot attack detected: Malformed email in unsubscribe reason field', {
              reason: unsubscribeReason,
              formName,
              ip,
              userAgent
            })
          } else {
            errors.push('Invalid reason selected')
          }
        }
      }
    }

    // 4. Check for suspicious patterns
    if (email && !email.includes('@')) {
      errors.push('Invalid email format')
    }
    
    // ============================================
    // PHASE 3: Behavioral Analysis
    // ============================================
    // Only apply to form endpoints (not webhooks/checkout)
    if (!isWebhookEndpoint(path) && !isCheckoutEndpoint(path)) {
      const formLoadTime = formData.get('form-load-time')
      try {
        const behaviorValidation = await validateSubmissionBehavior(ip, email, formType, formLoadTime)
        if (!behaviorValidation.allowed) {
          logBotDetected(formType, 'behavioral-validation-failed', ip, userAgent, {
            reason: behaviorValidation.reason,
            details: behaviorValidation.details,
            formName
          })
          
          // Add to blacklist if suspicious
          await addToBlacklist(ip, behaviorValidation.reason, userAgent)
          
          // Return success to bot (honeypot technique)
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
              success: true,
              message: 'Form submitted successfully'
            }),
          }
        }
      } catch (behaviorError) {
        // Fail open - allow if check fails
        console.error('Behavioral analysis error:', behaviorError.message)
      }
    }

    // If validation failed, reject
    if (errors.length > 0) {
      // SECURITY: Don't log full email - only log first 3 characters for debugging
      const emailPrefix = email ? email.substring(0, 3) + '***' : 'none'
      console.warn('❌ Validation failed:', {
        formType,
        errors,
        email: emailPrefix, // Sanitized - only first 3 chars
        ip,
        userAgent,
        formName
      })
      
      // Add to blacklist if multiple errors (likely bot)
      if (errors.length > 2 && !isWebhookEndpoint(path) && !isCheckoutEndpoint(path)) {
        await addToBlacklist(ip, `Multiple validation errors: ${errors.join(', ')}`, userAgent)
      }
      
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Validation failed',
          errors: errors
        }),
      }
    }

    // Route to GoHighLevel — contact upsert + tag writes. GHL workflows handle
    // confirmation emails and staff notifications downstream.
    const ghlFormType = FORM_NAME_TO_GHL_TYPE[formName] || null
    if (!ghlFormType) {
      console.error('❌ No GHL form-type mapping for formName:', formName)
      logFormSubmission(formType, email, ip, userAgent, false, ['unmapped form name'])
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid form', message: 'Form submission rejected' }),
      }
    }

    // A2P 10DLC: SMS consent must be optional. For every form that can collect SMS
    // consent, normalize to explicit yes/no so GHL records a clear opt-out, and stamp
    // audit-trail metadata (timestamp, source URL, IP) when the user opted in.
    const SMS_CAPABLE_FORMS = new Set([
      'contact-general', 'contact-support', 'contact-sales', 'contact-installer', 'contact-demo',
      'core-upgrade', 'municipal-intake',
    ])
    if (SMS_CAPABLE_FORMS.has(ghlFormType)) {
      sanitizedData.smsTransactional = sanitizedData.smsTransactional === 'yes' ? 'yes' : 'no'
      sanitizedData.smsMarketing = sanitizedData.smsMarketing === 'yes' ? 'yes' : 'no'
      if (sanitizedData.smsTransactional === 'yes' || sanitizedData.smsMarketing === 'yes') {
        sanitizedData.smsConsentTimestamp = new Date().toISOString()
        sanitizedData.smsConsentSourceUrl = event.headers.referer || event.headers.origin || ''
        sanitizedData.smsConsentIp = ip
      }
    }

    try {
      const result = await ghlClient.submitForm(ghlFormType, sanitizedData)
      logFormSubmission(formType, email, ip, userAgent, true)
      console.log('✅ GHL submission succeeded', {
        formType: ghlFormType,
        contactId: result.contactId,
        isNew: result.isNew,
        traceId: result.traceId,
        warnings: result.warnings.length || 0,
      })
      if (result.warnings.length > 0) {
        console.warn('⚠️ GHL submission warnings:', result.warnings)
      }
    } catch (ghlErr) {
      console.error('❌ GHL submission failed:', {
        formType: ghlFormType,
        errorName: ghlErr && ghlErr.name,
        message: ghlErr && ghlErr.message,
        status: ghlErr && ghlErr.status,
        traceId: ghlErr && ghlErr.traceId,
        responseBody: ghlErr && ghlErr.responseBody,
        email: email ? email.substring(0, 3) + '***' : 'none',
        sanitizedData,
      })
      logFormSubmission(formType, email, ip, userAgent, false, [
        `ghl-submission-failed: ${ghlErr && ghlErr.message}`,
      ])
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Form submitted successfully',
      }),
    }

  } catch (error) {
    console.error('❌ Validation error:', {
      message: error.message,
      stack: error.stack,
      contentType: event.headers['content-type'] || event.headers['Content-Type'],
      bodyType: typeof event.body,
      bodyLength: event.body ? (Buffer.isBuffer(event.body) ? event.body.length : String(event.body).length) : 0,
      isBase64Encoded: event.isBase64Encoded,
      path: event.path
    })
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Server error',
        message: 'An error occurred processing your request',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
    }
  }
}

