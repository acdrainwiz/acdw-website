/**
 * Input Sanitization Utility
 * 
 * Provides functions to sanitize and validate user inputs
 * Prevents XSS attacks, SQL injection, and other injection attacks
 */

/**
 * Sanitize string input - removes potentially dangerous characters
 * @param {string} input - Input string to sanitize
 * @param {Object} options - Sanitization options
 * @returns {string} - Sanitized string
 */
const sanitizeString = (input, options = {}) => {
  if (typeof input !== 'string') {
    return String(input || '')
  }
  
  const {
    maxLength = 10000,
    allowNewlines = false,
    allowHTML = false,
    trim = true
  } = options
  
  let sanitized = input
  
  // Trim whitespace if requested
  if (trim) {
    sanitized = sanitized.trim()
  }
  
  // Remove null bytes and control characters (except newlines if allowed)
  if (allowNewlines) {
    sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
  } else {
    sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '')
  }
  
  // Remove HTML tags if not allowed
  if (!allowHTML) {
    // Remove HTML tags and decode HTML entities
    sanitized = sanitized
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, '/')
      .replace(/&#x60;/g, '`')
      .replace(/&#x3D;/g, '=')
  }
  
  // Remove potentially dangerous JavaScript patterns
  sanitized = sanitized
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '') // Remove event handlers like onclick=
    .replace(/<script/gi, '')
    .replace(/<\/script>/gi, '')
    .replace(/<iframe/gi, '')
    .replace(/<object/gi, '')
    .replace(/<embed/gi, '')
  
  // Enforce max length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength)
  }
  
  return sanitized
}

/**
 * Sanitize email address
 * @param {string} email - Email to sanitize
 * @returns {string} - Sanitized email
 */
const sanitizeEmail = (email) => {
  if (typeof email !== 'string') {
    return ''
  }
  
  // Basic email sanitization - remove dangerous characters but keep valid email format
  return email
    .trim()
    .toLowerCase()
    .replace(/[<>\"'`]/g, '') // Remove potentially dangerous characters
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .substring(0, 254) // Email max length
}

/**
 * Sanitize phone number
 * @param {string} phone - Phone number to sanitize
 * @returns {string} - Sanitized phone number (digits, spaces, dashes, parentheses, plus only)
 */
const sanitizePhone = (phone) => {
  if (typeof phone !== 'string') {
    return ''
  }
  
  // Keep only digits, spaces, dashes, parentheses, plus, and x for extensions
  return phone.replace(/[^\d\s\-\(\)\+x]/gi, '').trim()
}

/**
 * Sanitize ZIP code
 * @param {string} zip - ZIP code to sanitize
 * @returns {string} - Sanitized ZIP code (digits only)
 */
const sanitizeZip = (zip) => {
  if (typeof zip !== 'string') {
    return ''
  }
  
  // Keep only digits
  return zip.replace(/\D/g, '').substring(0, 10) // Max 10 digits for ZIP+4
}

/**
 * Sanitize name (first name, last name, company name)
 * @param {string} name - Name to sanitize
 * @returns {string} - Sanitized name
 */
const sanitizeName = (name) => {
  if (typeof name !== 'string') {
    return ''
  }
  
  // Allow letters, spaces, hyphens, apostrophes, periods
  return name
    .trim()
    .replace(/[^a-zA-Z\s\-'\.]/g, '')
    .replace(/\s+/g, ' ') // Normalize multiple spaces
    .substring(0, 100) // Max length
}

/**
 * Sanitize address fields
 * @param {string} address - Address to sanitize
 * @returns {string} - Sanitized address
 */
const sanitizeAddress = (address) => {
  if (typeof address !== 'string') {
    return ''
  }
  
  // Allow alphanumeric, spaces, common address characters
  return sanitizeString(address, {
    maxLength: 200,
    allowNewlines: false,
    allowHTML: false,
    trim: true
  })
    .replace(/[<>\"'`]/g, '') // Remove potentially dangerous characters
}

/**
 * Sanitize message/textarea content
 * @param {string} message - Message to sanitize
 * @returns {string} - Sanitized message
 */
const sanitizeMessage = (message) => {
  if (typeof message !== 'string') {
    return ''
  }
  
  return sanitizeString(message, {
    maxLength: 5000,
    allowNewlines: true, // Allow newlines in messages
    allowHTML: false,
    trim: true
  })
}

/**
 * Sanitize form data object
 * @param {Object} data - Form data object
 * @param {string} formType - Type of form (for type-specific sanitization)
 * @returns {Object} - Sanitized form data
 */
const sanitizeFormData = (data, formType = 'general') => {
  const sanitized = {}
  
  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) {
      sanitized[key] = ''
      continue
    }
    
    // Type-specific sanitization
    switch (key.toLowerCase()) {
      case 'email':
        sanitized[key] = sanitizeEmail(value)
        break
      case 'phone':
        sanitized[key] = sanitizePhone(value)
        break
      case 'zip':
      case 'zipcode':
        sanitized[key] = sanitizeZip(value)
        break
      case 'firstname':
      case 'lastname':
      case 'name':
        sanitized[key] = sanitizeName(value)
        break
      case 'company':
      case 'organization':
        sanitized[key] = sanitizeName(value) // Company names can use same rules
        break
      case 'street':
      case 'address':
      case 'city':
      case 'state':
        sanitized[key] = sanitizeAddress(value)
        break
      case 'message':
      case 'description':
      case 'notes':
      case 'storybody':
        sanitized[key] = sanitizeMessage(value)
        break
      case 'damageimpact':
      case 'fullName':
      case 'fullname':
      case 'citystate':
      case 'instagramhandle':
      case 'rulesconsent':
        sanitized[key] = sanitizeString(String(value), {
          maxLength: 500,
          allowNewlines: false,
          allowHTML: false,
          trim: true,
        })
        break
      case 'mediaurl':
        sanitized[key] = sanitizeString(String(value), {
          maxLength: 4096,
          allowNewlines: false,
          allowHTML: false,
          trim: true,
        })
        break
      case 'audience':
        sanitized[key] = sanitizeString(String(value), {
          maxLength: 64,
          allowNewlines: false,
          allowHTML: false,
          trim: true,
        })
        break
      default:
        // Default sanitization for other fields
        sanitized[key] = sanitizeString(String(value), {
          maxLength: 500,
          allowNewlines: false,
          allowHTML: false,
          trim: true
        })
    }
  }
  
  return sanitized
}

/**
 * Validate file upload
 * @param {Object} file - File object
 * @param {Object} options - Validation options
 * @returns {Object} - { valid: boolean, error?: string }
 */
const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  } = options
  
  if (!file || !file.name || file.size === undefined) {
    return { valid: false, error: 'Invalid file' }
  }
  
  // Check file size
  if (file.size > maxSize) {
    return { valid: false, error: `File size exceeds ${maxSize / 1024 / 1024}MB limit` }
  }
  
  // Check file type
  if (file.type && !allowedTypes.includes(file.type.toLowerCase())) {
    return { valid: false, error: 'File type not allowed' }
  }
  
  // Check file extension
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
  if (!allowedExtensions.includes(extension)) {
    return { valid: false, error: 'File extension not allowed' }
  }
  
  // Check for dangerous file names
  if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
    return { valid: false, error: 'Invalid file name' }
  }
  
  return { valid: true }
}

module.exports = {
  sanitizeString,
  sanitizeEmail,
  sanitizePhone,
  sanitizeZip,
  sanitizeName,
  sanitizeAddress,
  sanitizeMessage,
  sanitizeFormData,
  validateFile
}

