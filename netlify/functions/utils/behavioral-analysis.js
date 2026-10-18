/**
 * Behavioral Analysis Utility
 * 
 * Detects automated submission patterns by analyzing timing and frequency
 */

const { logBotDetected } = require('./security-logger')
const { getBehavioralPatternsStore, isBlobsAvailable } = require('./blobs-store')

// In-memory pattern storage fallback
const inMemoryPatterns = new Map()

/**
 * Analyze submission pattern for suspicious behavior
 */
async function analyzeSubmissionPattern(ip, email, formType) {
  // Get Blobs store (must be initialized in handler context)
  const kvStore = getBehavioralPatternsStore()
  
  const patternKey = `submission-pattern:${ip}`
  
  try {
    let pattern
    
    if (kvStore) {
      // Use Netlify KV (persistent)
      pattern = await kvStore.get(patternKey) || {
        count: 0,
        emails: [],
        timestamps: [],
        firstSeen: Date.now()
      }
    } else {
      // Use in-memory fallback
      pattern = inMemoryPatterns.get(patternKey) || {
        count: 0,
        emails: [],
        timestamps: [],
        firstSeen: Date.now()
      }
    }
    
    // Update pattern
    pattern.count++
    if (!pattern.emails.includes(email)) {
      pattern.emails.push(email)
    }
    pattern.timestamps.push(Date.now())
    
    // Keep only last 50 timestamps (prevent memory bloat)
    if (pattern.timestamps.length > 50) {
      pattern.timestamps = pattern.timestamps.slice(-50)
    }
    
    // Analysis 1: Too many submissions in short time
    const oneMinuteAgo = Date.now() - 60000
    const recentSubmissions = pattern.timestamps.filter(ts => ts > oneMinuteAgo)
    
    if (recentSubmissions.length > 5) {
      return {
        suspicious: true,
        reason: 'Too many submissions per minute',
        details: {
          count: recentSubmissions.length,
          limit: 5,
          timeWindow: '1 minute'
        }
      }
    }
    
    // Analysis 2: Too many different emails from same IP
    if (pattern.emails.length > 10) {
      return {
        suspicious: true,
        reason: 'Too many different emails from same IP',
        details: {
          uniqueEmails: pattern.emails.length,
          limit: 10
        }
      }
    }
    
    // Analysis 3: Submissions at exact intervals (bot pattern)
    if (pattern.timestamps.length > 3) {
      const intervals = []
      for (let i = 1; i < pattern.timestamps.length; i++) {
        intervals.push(pattern.timestamps[i] - pattern.timestamps[i - 1])
      }
      
      if (intervals.length > 0) {
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
        const variance = intervals.reduce((sum, interval) => {
          return sum + Math.pow(interval - avgInterval, 2)
        }, 0) / intervals.length
        
        // If variance is very low, submissions are at exact intervals (bot)
        if (variance < 1000 && avgInterval < 10000) { // Less than 1 second variance, less than 10 second average
          return {
            suspicious: true,
            reason: 'Submissions at exact intervals',
            details: {
              avgInterval: Math.round(avgInterval),
              variance: Math.round(variance),
              intervals: intervals.length
            }
          }
        }
      }
    }
    
    // Save updated pattern
    if (kvStore) {
      await kvStore.set(patternKey, pattern, { expirationTtl: 3600 }) // 1 hour
    } else {
      inMemoryPatterns.set(patternKey, pattern)
    }
    
    return { suspicious: false, pattern }
  } catch (error) {
    // Error analyzing pattern - allow request (fail open)
    console.warn('⚠️ Behavioral analysis failed:', error.message)
    return { suspicious: false, reason: 'Analysis error' }
  }
}

/**
 * Validate form load time (real users take time to fill forms)
 */
function validateFormLoadTime(formLoadTime) {
  if (!formLoadTime) {
    // No form load time provided - suspicious (bot may not have loaded form)
    return {
      suspicious: true,
      reason: 'No form load time provided',
      details: {
        message: 'Form load time is required for security verification'
      }
    }
  }
  
  const loadTime = parseInt(formLoadTime)
  if (isNaN(loadTime) || loadTime <= 0) {
    return {
      suspicious: true,
      reason: 'Invalid form load time',
      details: {
        provided: formLoadTime
      }
    }
  }
  
  const timeSinceLoad = Date.now() - loadTime
  
  // Real users take at least 2-3 seconds to fill form
  if (timeSinceLoad < 2000) {
    return {
      suspicious: true,
      reason: 'Submission too fast',
      details: {
        timeSinceLoad,
        minimum: 2000,
        message: 'Form submitted too quickly after loading'
      }
    }
  }
  
  return {
    suspicious: false,
    timeSinceLoad
  }
}

/**
 * Validate submission behavior
 */
async function validateSubmissionBehavior(ip, email, formType, formLoadTime) {
  // Exempt Stripe endpoints
  const STRIPE_ENDPOINTS = [
    'stripe-webhook',
    'create-checkout',
    'get-checkout-session',
    'get-price-id',
    'calculate-shipping',
    'save-shipping-address'
  ]
  
  if (STRIPE_ENDPOINTS.some(endpoint => formType.includes(endpoint))) {
    return { allowed: true, reason: 'Stripe endpoint - exempted' }
  }
  
  // Validate form load time
  if (formLoadTime) {
    const loadTimeCheck = validateFormLoadTime(formLoadTime)
    if (loadTimeCheck.suspicious) {
      logBotDetected(formType, 'behavioral-load-time', ip, 'unknown', loadTimeCheck.details)
      
      return {
        allowed: false,
        reason: loadTimeCheck.reason,
        details: loadTimeCheck.details
      }
    }
  }
  
  // Analyze submission pattern
  const patternAnalysis = await analyzeSubmissionPattern(ip, email, formType)
  if (patternAnalysis.suspicious) {
    logBotDetected(formType, 'behavioral-pattern', ip, 'unknown', patternAnalysis.details)
    
    return {
      allowed: false,
      reason: patternAnalysis.reason,
      details: patternAnalysis.details
    }
  }
  
  return {
    allowed: true,
    loadTimeCheck: formLoadTime ? validateFormLoadTime(formLoadTime) : null,
    patternAnalysis
  }
}

module.exports = {
  analyzeSubmissionPattern,
  validateFormLoadTime,
  validateSubmissionBehavior
}
