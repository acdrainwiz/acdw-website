import { useState } from 'react'
import { IMaskInput } from 'react-imask'
import { isValidEmail } from '../utils/emailValidation'
import { InstructionModal } from '../components/email-signature/InstructionModal'

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
  
  // Modal state
  const [desktopModalOpen, setDesktopModalOpen] = useState(false)
  const [office365ModalOpen, setOffice365ModalOpen] = useState(false)

  // Instruction guide content
  const desktopGuideContent = `# How to Add/Update Your Email Signature in Outlook Desktop

Follow these steps to add or update your email signature in the Outlook desktop application (Windows or Mac).

## Step 1: Generate Your Signature

1. Go to **https://acdrainwiz.com/email-signature**
2. Fill in all the required fields:
   - **Full Name** (required)
   - **Job Title** (required)
   - **Role/Department** (required) - Select from dropdown or choose "Custom"
   - **Mobile Phone** (optional) - Will auto-format as you type
   - **Email Address** (required)
3. Review the preview to make sure everything looks correct
4. Click **"Copy Signature to Clipboard"**
   - If you see validation errors, fix them first before copying

## Step 2: Open Outlook Signature Settings

### For Windows:
1. Open **Outlook**
2. Click **File** in the top menu
3. Click **Options** (or **Account Settings** → **Email** in some versions)
4. Click **Mail** in the left sidebar
5. Click **Signatures...** button

### For Mac:
1. Open **Outlook**
2. Click **Outlook** in the top menu bar
3. Click **Preferences**
4. Click **Signatures** (under Email section)

## Step 3: Create or Edit Your Signature

### Creating a New Signature:
1. Click **New** button
2. Type a name for your signature (e.g., "AC Drain Wiz Signature")
3. Click **OK**

### Editing an Existing Signature:
1. Select your existing signature from the list
2. Click **Edit** (or just click in the editor area)

## Step 4: Paste Your Signature

### Method 1: Using Source/HTML View (Recommended)
1. In the signature editor, look for one of these buttons:
   - **"Source"** button
   - **"</>"** (HTML icon)
   - **"HTML"** button
   - Or right-click in the editor and look for **"View Source"** or **"Edit HTML"**
2. Click the button to switch to HTML/Source view
3. **Delete any existing content** in the editor
4. Paste your copied signature (Ctrl+V / Cmd+V)
5. Click the Source/HTML button again to see the preview
6. Verify the signature looks correct

### Method 2: Direct Paste (If Source View Not Available)
1. Click in the signature editor area
2. Paste your copied signature (Ctrl+V / Cmd+V)
3. The signature should paste as formatted HTML
4. If it shows as code, try Method 1 instead

## Step 5: Set as Default Signature

1. Under **"Choose default signature"** section:
   - **New messages:** Select your signature from the dropdown
   - **Replies/forwards:** Select your signature from the dropdown (optional)
2. Click **OK** to save

## Step 6: Test Your Signature

1. Create a new email message
2. Your signature should automatically appear
3. Verify:
   - Logo displays correctly
   - All text is formatted properly
   - Links work (email and website)
   - Colors and spacing look correct

## Troubleshooting

### Logo Not Showing?
- Make sure you're connected to the internet
- The logo loads from https://acdrainwiz.com/images/ac-drain-wiz-logo-signature.png
- If it still doesn't show, try refreshing Outlook or restarting the application

### Signature Shows as Code Instead of Formatted?
- Use Method 1 (Source/HTML view) to paste the signature
- Make sure you're pasting the copied HTML, not typing it manually

### Formatting Looks Wrong?
- Try using the Source/HTML view method
- Make sure you deleted all existing content before pasting
- If issues persist, try copying from the signature generator again

### Can't Find Source/HTML Button?
- Some Outlook versions hide this option
- Try right-clicking in the editor area
- Or use Method 2 (direct paste) - it should work in most cases

## Need Help?

If you encounter any issues:
1. Try copying the signature from the generator again
2. Make sure all required fields are filled in
3. Contact IT support or your team lead

---

**Quick Reference:**
- Signature Generator: https://acdrainwiz.com/email-signature
- Logo URL: https://acdrainwiz.com/images/ac-drain-wiz-logo-signature.png`

  const office365GuideContent = `# How to Add/Update Your Email Signature in Outlook 365 (Web)

Follow these steps to add or update your email signature in Outlook 365 (the web-based version).

## Step 1: Generate Your Signature

1. Go to **https://acdrainwiz.com/email-signature**
2. Fill in all the required fields:
   - **Full Name** (required)
   - **Job Title** (required)
   - **Role/Department** (required) - Select from dropdown or choose "Custom"
   - **Mobile Phone** (optional) - Will auto-format as you type
   - **Email Address** (required)
3. Review the preview to make sure everything looks correct
4. Click **"Copy Signature to Clipboard"**
   - If you see validation errors, fix them first before copying

## Step 2: Open Outlook 365

1. Go to **https://outlook.office.com** (or your organization's Office 365 portal)
2. Sign in with your work email and password
3. Click on **Mail** if you're not already in the mail view

## Step 3: Access Signature Settings

1. Click the **Settings** icon (gear icon) in the top right corner
2. In the Settings panel, type **"signature"** in the search box
3. Click on **"Email signature"** from the search results
   - Or navigate to: **Settings** → **Mail** → **Compose and reply** → **Email signature**

## Step 4: Create or Edit Your Signature

### Creating a New Signature:
1. You'll see a text editor box for your email signature
2. If there's existing content, select all and delete it (Ctrl+A / Cmd+A, then Delete)

### Editing an Existing Signature:
1. Select all existing content in the signature editor
2. Delete it (or just click and start typing)

## Step 5: Paste Your Signature

### Method 1: Using HTML Source View (Recommended)
1. In the signature editor, look for formatting toolbar buttons
2. Find and click the **"</>"** (code/HTML) button or **"Source"** button
   - This may be in a "..." menu or toolbar dropdown
3. **Delete any existing content** in the HTML view
4. Paste your copied signature (Ctrl+V / Cmd+V)
5. Click the HTML/Source button again to return to visual view
6. Verify the signature looks correct

### Method 2: Direct Paste (If HTML View Not Available)
1. Click in the signature editor area
2. Paste your copied signature (Ctrl+V / Cmd+V)
3. The signature should paste as formatted HTML
4. If it shows as code, try Method 1 instead

### Method 3: Using Browser Developer Tools (Advanced)
If the above methods don't work:
1. Right-click in the signature editor
2. Select **"Inspect"** or **"Inspect Element"**
3. Look for the editor's content area in the HTML
4. Find the div or textarea element that contains the signature
5. Right-click it and select **"Edit as HTML"**
6. Paste your signature HTML
7. Click outside the developer tools to close them

## Step 6: Configure Signature Settings

1. **Automatically include my signature on new messages I compose:**
   - Check this box if you want the signature on all new emails
   
2. **Automatically include my signature on messages I forward or reply to:**
   - Check this box if you want the signature on replies/forwards (optional)

3. Click **Save** at the top of the Settings panel

## Step 7: Test Your Signature

1. Click **New message** to create a new email
2. Your signature should automatically appear (if you enabled auto-include)
3. Or manually insert it: Click the **"..."** menu in the compose window → **"Insert signature"**
4. Verify:
   - Logo displays correctly
   - All text is formatted properly
   - Links work (email and website)
   - Colors and spacing look correct

## Troubleshooting

### Logo Not Showing?
- Make sure you're connected to the internet
- The logo loads from https://acdrainwiz.com/images/ac-drain-wiz-logo-signature.png
- Some email clients block external images - recipients may need to "Download images" or "Show images"
- Try refreshing the page or clearing browser cache

### Signature Shows as Code Instead of Formatted?
- Use Method 1 (HTML/Source view) to paste the signature
- Make sure you're pasting the copied HTML, not typing it manually
- Try Method 3 (Developer Tools) if available

### Formatting Looks Wrong?
- Try using the HTML/Source view method
- Make sure you deleted all existing content before pasting
- Outlook 365 may strip some formatting - this is normal for web-based email
- If issues persist, try copying from the signature generator again

### Can't Find HTML/Source Button?
- Outlook 365's interface varies by organization
- Try Method 2 (direct paste) - it should work in most cases
- Or use Method 3 (Developer Tools) for more control

### Signature Not Appearing Automatically?
- Check your signature settings (Step 6)
- Make sure "Automatically include my signature" is checked
- Try manually inserting it using the "Insert signature" option

## Browser-Specific Notes

### Chrome/Edge:
- HTML view is usually available in the formatting toolbar
- Developer Tools (F12) work well for Method 3

### Firefox:
- Similar to Chrome, HTML view should be available
- Developer Tools work the same way

### Safari:
- May have limited HTML editing options
- Try direct paste method first
- Developer Tools available but may work differently

## Need Help?

If you encounter any issues:
1. Try copying the signature from the generator again
2. Make sure all required fields are filled in
3. Try a different browser (Chrome or Edge usually work best)
4. Contact IT support or your team lead

---

**Quick Reference:**
- Signature Generator: https://acdrainwiz.com/email-signature
- Outlook 365: https://outlook.office.com
- Logo URL: https://acdrainwiz.com/images/ac-drain-wiz-logo-signature.png`

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
            <h3 className="font-semibold text-gray-900 mb-4">Setup Instructions:</h3>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <button
                onClick={() => setDesktopModalOpen(true)}
                className="px-4 py-2 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors text-sm"
              >
                📧 Outlook Desktop Guide
              </button>
              <button
                onClick={() => setOffice365ModalOpen(true)}
                className="px-4 py-2 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors text-sm"
              >
                🌐 Outlook 365 (Web) Guide
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Click the buttons above to view detailed step-by-step instructions for adding your signature to Outlook.
            </p>
          </div>
        </div>
      </div>

      {/* Instruction Modals */}
      <InstructionModal
        isOpen={desktopModalOpen}
        onClose={() => setDesktopModalOpen(false)}
        title="Outlook Desktop Setup Guide"
        content={desktopGuideContent}
      />
      <InstructionModal
        isOpen={office365ModalOpen}
        onClose={() => setOffice365ModalOpen(false)}
        title="Outlook 365 (Web) Setup Guide"
        content={office365GuideContent}
      />
    </div>
  )
}
