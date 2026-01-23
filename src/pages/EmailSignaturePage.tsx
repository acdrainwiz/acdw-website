import { useState } from 'react'
import { IMaskInput } from 'react-imask'
import { isValidEmail } from '../utils/emailValidation'

export function EmailSignaturePage() {
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [role, setRole] = useState('')
  const [customRole, setCustomRole] = useState('')
  const [isCustomRole, setIsCustomRole] = useState(false)
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const departments = [
    'Sales & Marketing',
    'Product Management',
    'Product Design',
    'Engineering',
    'Operations',
    'Customer Success / Support',
    'Finance & Accounting',
    'Human Resources',
    'Business Development',
    'Executive / Leadership',
    'Custom'
  ]

  const handleRoleChange = (value: string) => {
    if (value === 'Custom') {
      setIsCustomRole(true)
      setRole('')
    } else {
      setIsCustomRole(false)
      setRole(value)
      setCustomRole('')
    }
  }

  const handleCustomRoleChange = (value: string) => {
    setCustomRole(value)
    setRole(value)
  }

  const displayRole = isCustomRole ? customRole : role

  // Validation functions
  const validateName = (value: string): string | null => {
    if (!value || value.trim().length === 0) {
      return 'Name is required'
    }
    if (value.trim().length < 2) {
      return 'Name must be at least 2 characters'
    }
    return null
  }

  const validateTitle = (value: string): string | null => {
    if (!value || value.trim().length === 0) {
      return 'Job title is required'
    }
    return null
  }

  const validateRole = (): string | null => {
    if (!displayRole || displayRole.trim().length === 0) {
      return 'Department/Role is required'
    }
    if (isCustomRole && (!customRole || customRole.trim().length === 0)) {
      return 'Please enter a custom department/role'
    }
    return null
  }

  const validatePhone = (value: string): string | null => {
    // Remove formatting characters to check digit count
    const digitsOnly = value.replace(/\D/g, '')
    if (digitsOnly.length > 0 && digitsOnly.length < 10) {
      return 'Please enter a complete phone number'
    }
    return null
  }

  const validateEmailField = (value: string): string | null => {
    if (!value || value.trim().length === 0) {
      return 'Email is required'
    }
    if (!isValidEmail(value)) {
      return 'Please enter a valid email address'
    }
    return null
  }

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    const nameError = validateName(name)
    if (nameError) newErrors.name = nameError
    
    const titleError = validateTitle(title)
    if (titleError) newErrors.title = titleError
    
    const roleError = validateRole()
    if (roleError) newErrors.role = roleError
    
    const phoneError = validatePhone(mobile)
    if (phoneError) newErrors.mobile = phoneError
    
    const emailError = validateEmailField(email)
    if (emailError) newErrors.email = emailError
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle field blur for validation
  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true })
    
    let error: string | null = null
    switch (field) {
      case 'name':
        error = validateName(name)
        break
      case 'title':
        error = validateTitle(title)
        break
      case 'role':
        error = validateRole()
        break
      case 'mobile':
        error = validatePhone(mobile)
        break
      case 'email':
        error = validateEmailField(email)
        break
    }
    
    if (error) {
      setErrors({ ...errors, [field]: error })
    } else {
      const newErrors = { ...errors }
      delete newErrors[field]
      setErrors(newErrors)
    }
  }

  const signatureHTML = `
<table border="0" cellpadding="0" cellspacing="0" class="sig-main-table" style="font-family: 'Poppins', Arial, Helvetica, sans-serif; font-size: 12px; color: #1e3a8a; line-height: 1.5; max-width: 600px;">
  <tr>
    <td style="padding: 0;">
      <!-- Top Section: Logo and Personal Info -->
      <table border="0" cellpadding="0" cellspacing="0" class="sig-top-section" width="100%">
        <tr>
          <!-- Logo Column -->
          <td class="sig-logo-column" style="padding-right: 20px; vertical-align: top; width: 200px;">
            <img src="https://acdrainwiz.com/images/ac-drain-wiz-logo-signature.png" alt="AC Drain Wiz Logo" width="180" height="auto" style="display: block; max-width: 180px; height: auto;" />
          </td>
          <!-- Personal Info Column -->
          <td class="sig-info-column" style="vertical-align: top; padding-left: 0; text-align: left;">
            <table border="0" cellpadding="0" cellspacing="0" class="sig-info-inner-table" style="font-family: 'Poppins', Arial, Helvetica, sans-serif;">
              <tr>
                <td style="padding-bottom: 4px; text-align: left;">
                  <span style="font-weight: bold; font-size: 18px; color: #1e3a8a;">${name}</span>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 4px; text-align: left;">
                  <span style="color: #1e3a8a; font-size: 14px;">${title}</span>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 0; text-align: left;">
                  <span style="color: #1e3a8a; font-size: 14px;">${displayRole}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      
      <!-- Orange Separator Line (only in right column) -->
      <table border="0" cellpadding="0" cellspacing="0" class="sig-separator" width="100%" style="margin-top: 12px; margin-bottom: 12px;">
        <tr>
          <!-- Empty Logo Column (to maintain alignment) -->
          <td style="padding-right: 20px; vertical-align: top; width: 200px;">
            &nbsp;
          </td>
          <!-- Separator Line Column (aligned with name/title) -->
          <td style="vertical-align: top; padding-left: 0;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="border-top: 2px solid #ef5123; padding: 0;"></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      
      <!-- Bottom Section: Logo Column (empty) and Contact Info Column -->
      <table border="0" cellpadding="0" cellspacing="0" class="sig-bottom-section" width="100%">
        <tr>
          <!-- Empty Logo Column (to maintain alignment) -->
          <td class="sig-bottom-logo-column" style="padding-right: 20px; vertical-align: top; width: 200px;">
            &nbsp;
          </td>
          <!-- Contact Information Column (aligned with name/title) -->
          <td class="sig-contact-column" style="vertical-align: top; padding-left: 0; text-align: left;">
            <table border="0" cellpadding="0" cellspacing="0" class="sig-contact-inner-table" style="font-family: 'Poppins', Arial, Helvetica, sans-serif;">
              <tr>
                <td style="padding-bottom: 4px; text-align: left;">
                  <span style="color: #1e3a8a; font-size: 14px; font-weight: bold;">Mobile: </span>
                  <span style="color: #1e3a8a; font-size: 14px;">${mobile}</span>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 4px; text-align: left;">
                  <span style="color: #1e3a8a; font-size: 14px; font-weight: bold;">Email: </span>
                  <a href="mailto:${email}" style="color: #2563eb; text-decoration: underline; font-size: 14px;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 0; text-align: left;">
                  <span style="color: #1e3a8a; font-size: 14px; font-weight: bold;">Web: </span>
                  <a href="https://www.acdrainwiz.com" style="color: #2563eb; text-decoration: underline; font-size: 14px;">www.acdrainwiz.com</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
  `.trim()

  const handleCopy = async () => {
    // Validate form before copying
    if (!validateForm()) {
      // Mark all fields as touched to show errors
      setTouched({
        name: true,
        title: true,
        role: true,
        mobile: true,
        email: true
      })
      alert('Please fix the errors in the form before copying your signature.')
      return
    }

    try {
      // Use the modern Clipboard API if available
      if (navigator.clipboard && navigator.clipboard.write) {
        // Create a blob with HTML content
        const blob = new Blob([signatureHTML], { type: 'text/html' })
        const clipboardItem = new ClipboardItem({ 'text/html': blob })
        await navigator.clipboard.write([clipboardItem])
        alert('Signature copied! Paste it into Outlook\'s signature editor.')
      } else {
        // Fallback: Create a temporary div to render the HTML
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = signatureHTML
        tempDiv.style.position = 'absolute'
        tempDiv.style.left = '-9999px'
        document.body.appendChild(tempDiv)
        
        // Select the rendered content
        const range = document.createRange()
        range.selectNodeContents(tempDiv)
        const selection = window.getSelection()
        selection?.removeAllRanges()
        selection?.addRange(range)
        
        try {
          document.execCommand('copy')
          alert('Signature copied! Paste it into Outlook\'s signature editor.')
        } catch (err) {
          console.error('Failed to copy:', err)
          // Show the HTML in a textarea for manual copy
          const textarea = document.createElement('textarea')
          textarea.value = signatureHTML
          textarea.style.position = 'fixed'
          textarea.style.opacity = '0'
          document.body.appendChild(textarea)
          textarea.select()
          document.execCommand('copy')
          document.body.removeChild(textarea)
          alert('HTML code copied! Paste it into Outlook\'s signature editor.')
        }
        
        document.body.removeChild(tempDiv)
      }
    } catch (err) {
      console.error('Failed to copy:', err)
      alert('Please select the preview above and copy it manually (Ctrl+C / Cmd+C)')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Signature Generator</h1>
          <p className="text-gray-600 mb-8">
            Customize your signature below, then copy and paste it into Outlook.
          </p>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (touched.name) {
                    const error = validateName(e.target.value)
                    if (error) {
                      setErrors({ ...errors, name: error })
                    } else {
                      const newErrors = { ...errors }
                      delete newErrors.name
                      setErrors(newErrors)
                    }
                  }
                }}
                onBlur={() => handleBlur('name')}
                placeholder="e.g., John Smith"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  touched.name && errors.name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {touched.name && errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (touched.title) {
                    const error = validateTitle(e.target.value)
                    if (error) {
                      setErrors({ ...errors, title: error })
                    } else {
                      const newErrors = { ...errors }
                      delete newErrors.title
                      setErrors(newErrors)
                    }
                  }
                }}
                onBlur={() => handleBlur('title')}
                placeholder="e.g., VP of Sales"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  touched.title && errors.title
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {touched.title && errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role/Department <span className="text-red-500">*</span>
              </label>
              <select
                value={isCustomRole ? 'Custom' : role}
                onChange={(e) => {
                  handleRoleChange(e.target.value)
                  if (touched.role) {
                    setTimeout(() => {
                      const error = validateRole()
                      if (error) {
                        setErrors({ ...errors, role: error })
                      } else {
                        const newErrors = { ...errors }
                        delete newErrors.role
                        setErrors(newErrors)
                      }
                    }, 0)
                  }
                }}
                onBlur={() => handleBlur('role')}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  touched.role && errors.role
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              >
                <option value="">Select a department...</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {isCustomRole && (
                <input
                  type="text"
                  value={customRole}
                  onChange={(e) => {
                    handleCustomRoleChange(e.target.value)
                    if (touched.role) {
                      setTimeout(() => {
                        const error = validateRole()
                        if (error) {
                          setErrors({ ...errors, role: error })
                        } else {
                          const newErrors = { ...errors }
                          delete newErrors.role
                          setErrors(newErrors)
                        }
                      }, 0)
                    }
                  }}
                  onBlur={() => handleBlur('role')}
                  placeholder="Enter custom department/role"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 mt-2 ${
                    touched.role && errors.role
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
              )}
              {touched.role && errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Phone
              </label>
              <IMaskInput
                mask="(000) 000-0000"
                type="tel"
                value={mobile}
                onAccept={(value) => {
                  setMobile(value)
                  if (touched.mobile) {
                    const error = validatePhone(value)
                    if (error) {
                      setErrors({ ...errors, mobile: error })
                    } else {
                      const newErrors = { ...errors }
                      delete newErrors.mobile
                      setErrors(newErrors)
                    }
                  }
                }}
                onBlur={() => handleBlur('mobile')}
                placeholder="e.g., (305) 318-5611"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  touched.mobile && errors.mobile
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {touched.mobile && errors.mobile && (
                <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (touched.email) {
                    const error = validateEmailField(e.target.value)
                    if (error) {
                      setErrors({ ...errors, email: error })
                    } else {
                      const newErrors = { ...errors }
                      delete newErrors.email
                      setErrors(newErrors)
                    }
                  }
                }}
                onBlur={() => handleBlur('email')}
                placeholder="e.g., yourname@acdrainwiz.com"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  touched.email && errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Preview</h2>
            <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
              <div 
                dangerouslySetInnerHTML={{ __html: signatureHTML }}
                className="email-signature-preview"
              />
            </div>
          </div>

          {/* Copy Button */}
          <div className="flex justify-center">
            <button
              onClick={handleCopy}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              Copy Signature to Clipboard
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">How to Use:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Fill in your information above</li>
              <li>Review the preview to make sure it looks correct</li>
              <li>Click "Copy Signature to Clipboard"</li>
              <li>Open Outlook → File → Options → Mail → Signatures</li>
              <li>Create a new signature or edit an existing one</li>
              <li>Paste the copied signature (Ctrl+V / Cmd+V)</li>
              <li>Save and set as your default signature</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
