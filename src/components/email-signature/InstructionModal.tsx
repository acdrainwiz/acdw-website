import { useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface InstructionModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
}

export function InstructionModal({ isOpen, onClose, title, content }: InstructionModalProps) {
  useEffect(() => {
    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Convert markdown-like content to HTML
  const formatContent = (text: string) => {
    const lines = text.split('\n')
    let html = ''
    let inList = false
    let listType = ''

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmed = line.trim()

      // Headers
      if (trimmed.startsWith('# ')) {
        if (inList) {
          html += `</${listType}>`
          inList = false
        }
        html += `<h1 class="text-2xl font-bold text-gray-900 mt-6 mb-4">${trimmed.substring(2)}</h1>`
        continue
      }
      if (trimmed.startsWith('## ')) {
        if (inList) {
          html += `</${listType}>`
          inList = false
        }
        html += `<h2 class="text-xl font-semibold text-gray-900 mt-5 mb-3">${trimmed.substring(3)}</h2>`
        continue
      }
      if (trimmed.startsWith('### ')) {
        if (inList) {
          html += `</${listType}>`
          inList = false
        }
        html += `<h3 class="text-lg font-semibold text-gray-800 mt-4 mb-2">${trimmed.substring(4)}</h3>`
        continue
      }

      // List items
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList || listType !== 'ul') {
          if (inList) html += `</${listType}>`
          html += '<ul class="list-disc list-inside space-y-2 mb-4 ml-4">'
          inList = true
          listType = 'ul'
        }
        const content = trimmed.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        html += `<li class="text-gray-700 mb-1">${content}</li>`
        continue
      }
      if (/^\d+\.\s/.test(trimmed)) {
        if (!inList || listType !== 'ol') {
          if (inList) html += `</${listType}>`
          html += '<ol class="list-decimal list-inside space-y-2 mb-4 ml-4">'
          inList = true
          listType = 'ol'
        }
        const content = trimmed.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        html += `<li class="text-gray-700 mb-1">${content}</li>`
        continue
      }

      // Close list if we hit a non-list item
      if (inList && trimmed !== '') {
        html += `</${listType}>`
        inList = false
      }

      // Horizontal rule
      if (trimmed === '---') {
        html += '<hr class="my-6 border-gray-300" />'
        continue
      }

      // Empty lines
      if (trimmed === '') {
        if (!inList) {
          html += '<br />'
        }
        continue
      }

      // Regular paragraphs with inline formatting
      let paragraph = trimmed
      // Bold text
      paragraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Code/inline code
      paragraph = paragraph.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
      // Links (basic)
      paragraph = paragraph.replace(/https?:\/\/[^\s]+/g, '<a href="$&" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$&</a>')
      
      html += `<p class="text-gray-700 mb-3 leading-relaxed">${paragraph}</p>`
    }

    // Close any open list
    if (inList) {
      html += `</${listType}>`
    }

    return html
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: formatContent(content) }}
          />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
