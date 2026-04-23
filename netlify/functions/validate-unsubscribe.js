

const { checkRateLimit, getRateLimitHeaders, getClientIP } = require('./utils/rate-limiter')
const { sanitizeFormData } = require('./utils/input-sanitizer')
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
const { initBlobsStores, getUnsubscribeStore } = require('./utils/blobs-store')
const { getSecurityHeaders } = require('./utils/cors-config')
const ghlClient = require('./utils/ghl-client')

// Comma-separated origin allowlist for preview/branch deploys. Supports glob `*`.
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

exports.handler = async (event, context) => {

    const headers = getSecurityHeaders(event)

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    initBlobsStores(context)
    
    const formData = new URLSearchParams(event.body)
    const email = formData.get('email') || ''
    const reason = formData.get('reason') || ''
    const feedback = formData.get('feedback') || ''
    const botField = formData.get('bot-field') || ''
    const website = formData.get('website') || ''
    const url = formData.get('url') || ''
    const recaptchaToken = formData.get('recaptcha-token') || ''

    const ip = getClientIP(event)
    const userAgent = event.headers['user-agent'] || 'unknown'
    const origin = event.headers['origin'] || event.headers['referer'] || 'unknown'
    const path = event.path || ''
    
    const ALLOWED_REASONS = [
      '', // Empty is allowed (optional field)
      'too-many-emails',
      'not-relevant',
      'never-signed-up',
      'spam',
      'privacy-concerns',
      'other'
    ]
    
    try {
      const fingerprintCheck = validateRequestFingerprint(event, ip, userAgent)
      if (fingerprintCheck.isBot) {
        logBotDetected('unsubscribe', 'request-fingerprint-failed', ip, userAgent, {
          reason: fingerprintCheck.reason,
          details: fingerprintCheck.details
        })
        // Return success to bot (honeypot technique)
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true,
            message: 'Request processed'
          }),
        }
      }
    } catch (fingerprintError) {
      // Fail open - allow if check fails
      console.error('Fingerprint check error:', fingerprintError.message)
    }
    
    // ============================================
    // PHASE 2: IP Reputation & Blacklist
    // ============================================
    try {
      const ipValidation = await validateIP(ip, userAgent, 'unsubscribe')
      if (!ipValidation.allowed) {
        logBotDetected('unsubscribe', 'ip-validation-failed', ip, userAgent, {
          reason: ipValidation.reason,
          details: ipValidation.details
        })
        // Return success to bot (honeypot technique)
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true,
            message: 'Request processed'
          }),
        }
      }
    } catch (ipCheckError) {
      // Fail open - allow if check fails
      console.error('IP validation error:', ipCheckError.message)
    }
    
    // ============================================
    // PHASE 5: CSRF Token Validation
    // ============================================
    const csrfToken = formData.get('csrf-token') || event.headers['x-csrf-token'] || ''
    
    try {
      const csrfValidation = await validateCSRFToken(csrfToken, ip, userAgent, 'unsubscribe')
      if (!csrfValidation.valid) {
        logBotDetected('unsubscribe', 'csrf-validation-failed', ip, userAgent, {
          reason: csrfValidation.reason,
          details: csrfValidation.details
        })
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: csrfValidation.reason || 'Security token required',
            message: csrfValidation.details?.message || 'Please refresh the page and try again'
          }),
        }
      }
    } catch (csrfError) {
      // If validation fails, log but allow (fail open for legitimate users)
      // This prevents breaking forms if KV is not configured
      console.warn('⚠️ CSRF validation error (allowing request):', csrfError.message)
    }
    
    // SECURITY: Block known bot user agents
    const BOT_USER_AGENTS = [
      'curl', 'wget', 'python-requests', 'python', 'go-http-client',
      'java/', 'scrapy', 'bot', 'crawler', 'spider', 'headless',
      'phantom', 'selenium', 'postman', 'insomnia', 'httpie'
    ]
    
    const lowerUserAgent = userAgent.toLowerCase()
    if (BOT_USER_AGENTS.some(bot => lowerUserAgent.includes(bot))) {
      logBotDetected('unsubscribe', 'bot-user-agent', ip, userAgent, {
        detectedPattern: BOT_USER_AGENTS.find(bot => lowerUserAgent.includes(bot))
      })
      console.warn('🚫 Bot detected: User-Agent match', {
        userAgent,
        ip
      })
      // Return success to bot to prevent detection, but don't forward to Netlify
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true,
          message: 'Request processed'
        }),
      }
    }
    
    // SECURITY: Validate Origin/Referer (must be from our domain)
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
      logBotDetected('unsubscribe', 'invalid-origin', ip, userAgent, {
        origin,
        allowedOrigins: ALLOWED_ORIGINS
      })
      console.warn('🚫 Bot detected: Invalid origin', {
        origin,
        ip,
        userAgent
      })
      // Return success to bot to prevent detection, but don't forward to Netlify
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true,
          message: 'Request processed'
        }),
      }
    }
    
    // Rate limiting check (strict for unsubscribe)
    const rateLimitResult = await checkRateLimit(ip, 'strict')
    
    if (!rateLimitResult.allowed) {
      logRateLimit(ip, 'strict', rateLimitResult.limit, rateLimitResult.remaining, true)
      
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

    // Validation errors array
    const errors = []
    
    // 0. Verify reCAPTCHA token (if provided and configured)
    let recaptchaResult = null
    if (recaptchaToken) {
      recaptchaResult = await verifyRecaptcha(recaptchaToken)
      
      if (!recaptchaResult.success) {
        console.warn('🚫 reCAPTCHA verification failed', {
          ip,
          userAgent,
          errors: recaptchaResult['error-codes'],
          email: email.substring(0, 20) + '...'
        })
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Security verification failed',
            message: 'Please refresh and try again'
          }),
        }
      }
      
      // ============================================
      // PHASE 4: Enhanced reCAPTCHA (Stricter for unsubscribe)
      // ============================================
      // Check score (0.0 = bot, 1.0 = human)
      // Stricter threshold for unsubscribe form: 0.7 (up from 0.5)
      const scoreThreshold = parseFloat(process.env.RECAPTCHA_SCORE_THRESHOLD || '0.7')
      
      if (recaptchaResult.score < scoreThreshold) {
        console.warn('🚫 reCAPTCHA score too low', {
          score: recaptchaResult.score,
          threshold: scoreThreshold,
          ip,
          userAgent,
          email: email.substring(0, 20) + '...'
        })
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Suspicious activity detected',
            message: 'Please try again'
          }),
        }
      }
      
      // Verify reCAPTCHA action matches form type
      const expectedAction = 'unsubscribe'
      if (recaptchaResult.action && recaptchaResult.action !== expectedAction) {
        logBotDetected('unsubscribe', 'invalid-recaptcha-action', ip, userAgent, {
          expected: expectedAction,
          received: recaptchaResult.action
        })
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Security verification failed',
            message: 'Please refresh and try again'
          }),
        }
      }
      
      logRecaptcha(true, recaptchaResult.score, recaptchaResult.action, ip, userAgent)
      console.log('✅ reCAPTCHA verified', { 
        score: recaptchaResult.score,
        action: recaptchaResult.action,
        email: email.substring(0, 20) + '***'
      })
    } else if (RECAPTCHA_SECRET_KEY) {
      // Token missing but reCAPTCHA is configured - REJECT (stricter enforcement)
      logBotDetected('unsubscribe', 'missing-recaptcha', ip, userAgent, {
        email: trimmedEmail.substring(0, 20) + '***'
      })
      console.warn('🚫 reCAPTCHA token missing (bot likely)', {
        ip,
        userAgent,
        email: email.substring(0, 20) + '***'
      })
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Security verification required',
          message: 'Please enable JavaScript and try again'
        }),
      }
    }

    // 1. Check honeypot fields (if filled, it's a bot)
    if (botField || website || url) {
      logBotDetected('unsubscribe', 'honeypot', ip, userAgent, {
        botField: !!botField,
        website: !!website,
        url: !!url,
        email: email.substring(0, 20) + '***'
      })
      console.warn('🚫 Bot detected: honeypot fields filled', {
        botField: !!botField,
        website: !!website,
        url: !!url,
        ip,
        userAgent,
        email: email.substring(0, 20) + '***'
      })
      // Return success to bot to prevent detection, but don't forward to Netlify
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true,
          message: 'Request processed'
        }),
      }
    }

    // 2. Validate email format (strict regex)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const trimmedEmail = email.trim()
    
    if (!trimmedEmail) {
      errors.push('Email is required')
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.push('Invalid email format')
    } else {
      // ============================================
      // PHASE 6: Email Domain Validation
      // ============================================
      try {
        const domainValidation = await validateEmailDomain(trimmedEmail, ip, userAgent, 'unsubscribe')
        if (!domainValidation.valid) {
          logBotDetected('unsubscribe', 'email-domain-validation-failed', ip, userAgent, {
            reason: domainValidation.reason,
            details: domainValidation.details
          })
          errors.push(domainValidation.details?.message || domainValidation.reason)
        }
      } catch (emailValidationError) {
        // Fail open - allow if check fails
        console.error('Email domain validation error:', emailValidationError.message)
      }
    }

    // 3. Validate reason (if provided, must be from allowed list)
    // This blocks the bot attack where malformed emails are submitted in the reason field
    if (reason && !ALLOWED_REASONS.includes(reason)) {
      // SECURITY: Check if reason contains malformed email (bot attack pattern)
      if (reason.includes('-') && !reason.includes('@') && reason.length > 10) {
        logBotDetected('unsubscribe', 'malformed-email-in-dropdown', ip, userAgent, {
          reason,
          email: trimmedEmail.substring(0, 20) + '***'
        })
        console.warn('🚨 Bot attack detected: Malformed email in reason field', {
          reason,
          ip,
          userAgent
        })
        
        // Add to blacklist - this IP is actively attacking
        await addToBlacklist(ip, 'Bot attack: Malformed email in dropdown field', userAgent)
        
        errors.push('Invalid reason selected - suspicious pattern detected')
      } else {
        errors.push('Invalid reason selected')
      }
    }

    // 4. Check for suspicious patterns
    // Reject if email looks like a domain name (common bot pattern)
    if (trimmedEmail && !trimmedEmail.includes('@')) {
      logBotDetected('unsubscribe', 'invalid-email-format', ip, userAgent, {
        email: trimmedEmail.substring(0, 20) + '***'
      })
      errors.push('Invalid email format')
    }
    
    // 5. Additional bot pattern detection - malformed email in email field
    // Pattern: domain-name-com instead of email@domain.com
    const malformedEmailPattern = /^[a-z0-9]+-[a-z0-9]+-com$/i
    if (malformedEmailPattern.test(trimmedEmail)) {
      logBotDetected('unsubscribe', 'malformed-email-pattern', ip, userAgent, {
        email: trimmedEmail
      })
      console.warn('🚨 Bot attack detected: Malformed email pattern', {
        email: trimmedEmail,
        ip,
        userAgent
      })
      errors.push('Invalid email format')
    }

    // ============================================
    // PHASE 3: Behavioral Analysis
    // ============================================
    const formLoadTime = formData.get('form-load-time')
    try {
      const behaviorValidation = await validateSubmissionBehavior(ip, trimmedEmail, 'unsubscribe', formLoadTime)
      if (!behaviorValidation.allowed) {
        logBotDetected('unsubscribe', 'behavioral-validation-failed', ip, userAgent, {
          reason: behaviorValidation.reason,
          details: behaviorValidation.details
        })
        
        // Add to blacklist if suspicious
        await addToBlacklist(ip, behaviorValidation.reason, userAgent)
        
        // Return success to bot (honeypot technique)
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true,
            message: 'Request processed'
          }),
        }
      }
    } catch (behaviorError) {
      // Fail open - allow if check fails
      console.error('Behavioral analysis error:', behaviorError.message)
    }
    
    // If validation failed, reject
    if (errors.length > 0) {
      logFormSubmission('unsubscribe', trimmedEmail, false, ip, userAgent, {
        errors,
        reason
      })
      console.warn('❌ Validation failed:', {
        errors,
        email: trimmedEmail.substring(0, 20) + '***',
        ip,
        userAgent,
        reason
      })
      
      // Add to blacklist if multiple errors (likely bot)
      if (errors.length > 2) {
        await addToBlacklist(ip, `Multiple validation errors: ${errors.join(', ')}`, userAgent)
      }
      
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Validation failed',
          errors: errors,
          success: false
        }),
      }
    }

    // 5. If validation passed, store in Blobs and send notification via Resend
    // NO LONGER FORWARDING TO NETLIFY FORMS - This eliminates the bypass attack vector
    
    logFormSubmission('unsubscribe', trimmedEmail, true, ip, userAgent, {
      hasReason: !!reason,
      hasFeedback: !!feedback,
      recaptchaScore: recaptchaResult?.score
    })
    console.log('✅ Validation passed, processing unsubscribe (no Netlify Forms):', {
      email: trimmedEmail.substring(0, 20) + '***',
      ip,
      hasReason: !!reason,
      hasFeedback: !!feedback
    })
    
    // Sanitize form data
    const formDataObj = {
      email: trimmedEmail,
      reason: reason || null,
      feedback: feedback || null
    }
    const sanitizedData = sanitizeFormData(formDataObj, 'unsubscribe')
    
    // Store unsubscribe in Blobs for record-keeping
    const unsubscribeStore = getUnsubscribeStore()
    const timestamp = Date.now()
    const unsubscribeKey = `unsubscribe:${timestamp}:${trimmedEmail.replace(/[@.]/g, '_')}`
    
    const unsubscribeData = {
      email: sanitizedData.email,
      reason: sanitizedData.reason,
      feedback: sanitizedData.feedback,
      timestamp: new Date().toISOString(),
      ip,
      userAgent,
      recaptchaScore: recaptchaResult?.score || null
    }
    
    try {
      if (unsubscribeStore) {
        await unsubscribeStore.set(unsubscribeKey, JSON.stringify(unsubscribeData))
        console.log('✅ Unsubscribe stored in Blobs:', { key: unsubscribeKey })
      } else {
        console.warn('⚠️ Blobs store not available - skipping storage (unsubscribe still processed)')
      }
    } catch (blobError) {
      console.error('⚠️ Failed to store unsubscribe in Blobs:', blobError.message)
      // Don't fail the unsubscribe if Blobs fails - continue processing
    }
    
    // Route unsubscribe to GoHighLevel: sets DND on email channel + adds opted-out:all tag.
    // GHL workflow triggered by opted-out:all sends the final confirmation and halts campaigns.
    try {
      const ghlResult = await ghlClient.submitForm('unsubscribe', sanitizedData)
      console.log('✅ Unsubscribe routed to GHL:', {
        contactId: ghlResult.contactId,
        isNew: ghlResult.isNew,
        traceId: ghlResult.traceId,
        warnings: ghlResult.warnings.length || 0,
      })
      if (ghlResult.warnings.length > 0) {
        console.warn('⚠️ Unsubscribe GHL warnings:', ghlResult.warnings)
      }
    } catch (ghlErr) {
      console.error('❌ Unsubscribe GHL submission failed:', {
        errorName: ghlErr && ghlErr.name,
        message: ghlErr && ghlErr.message,
        status: ghlErr && ghlErr.status,
        traceId: ghlErr && ghlErr.traceId,
        responseBody: ghlErr && ghlErr.responseBody,
        email: trimmedEmail.substring(0, 3) + '***',
      })
    }
    
    // Success - return with rate limit headers
    return {
      statusCode: 200,
      headers: {
        ...headers,
        ...getRateLimitHeaders(rateLimitResult)
      },
      body: JSON.stringify({ 
        success: true,
        message: 'Unsubscribe request processed'
      }),
    }

  } catch (error) {
    console.error('❌ Validation error:', {
      message: error.message,
      stack: error.stack,
      body: event.body?.substring(0, 200)
    })
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Server error',
        message: 'An error occurred processing your request'
      }),
    }
  }
}

