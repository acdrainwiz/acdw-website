import { useState } from 'react'
import { IMaskInput } from 'react-imask'

export function EmailSignaturePage() {
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [role, setRole] = useState('')
  const [customRole, setCustomRole] = useState('')
  const [isCustomRole, setIsCustomRole] = useState(false)
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')

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
                  <span style="color: #1e3a8a; font-size: 14px;">${displayRole} | AC Drain Wiz</span>
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
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., John Smith"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., VP of Sales"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role/Department
              </label>
              <select
                value={isCustomRole ? 'Custom' : role}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  onChange={(e) => handleCustomRoleChange(e.target.value)}
                  placeholder="Enter custom department/role"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                />
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
                onAccept={(value) => setMobile(value)}
                placeholder="e.g., (305) 318-5611"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., yourname@acdrainwiz.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
