import { useState, useEffect } from 'react'
import { LockClosedIcon } from '@heroicons/react/24/outline'

interface PasswordProtectionProps {
  children: React.ReactNode
  correctPassword: string
}

export function PasswordProtection({ children, correctPassword }: PasswordProtectionProps) {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)

  // Check if already authenticated (stored in sessionStorage)
  useEffect(() => {
    const authStatus = sessionStorage.getItem('email-signature-auth')
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true)
    }
  }, [])

  // Check for lock status
  useEffect(() => {
    const lockUntil = localStorage.getItem('email-signature-lock-until')
    if (lockUntil) {
      const lockTime = parseInt(lockUntil, 10)
      if (Date.now() < lockTime) {
        setIsLocked(true)
        const remainingMinutes = Math.ceil((lockTime - Date.now()) / 60000)
        setError(`Too many failed attempts. Please try again in ${remainingMinutes} minute(s).`)
      } else {
        localStorage.removeItem('email-signature-lock-until')
        localStorage.removeItem('email-signature-attempts')
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Check if locked
    const lockUntil = localStorage.getItem('email-signature-lock-until')
    if (lockUntil && Date.now() < parseInt(lockUntil, 10)) {
      return
    }

    if (password === correctPassword) {
      setIsAuthenticated(true)
      sessionStorage.setItem('email-signature-auth', 'authenticated')
      // Reset attempts on successful login
      localStorage.removeItem('email-signature-attempts')
      localStorage.removeItem('email-signature-lock-until')
      setAttempts(0)
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      
      // Lock after 5 failed attempts for 15 minutes
      if (newAttempts >= 5) {
        const lockUntil = Date.now() + 15 * 60 * 1000 // 15 minutes
        localStorage.setItem('email-signature-lock-until', lockUntil.toString())
        localStorage.setItem('email-signature-attempts', newAttempts.toString())
        setIsLocked(true)
        setError('Too many failed attempts. Please try again in 15 minutes.')
      } else {
        localStorage.setItem('email-signature-attempts', newAttempts.toString())
        setError(`Incorrect password. ${5 - newAttempts} attempt(s) remaining.`)
      }
      setPassword('')
    }
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <LockClosedIcon className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Email Signature Generator</h2>
          <p className="mt-2 text-sm text-gray-600">
            This page is password protected. Please enter the password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLocked}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                error
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              } ${isLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder="Enter password"
              autoFocus
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLocked || !password.trim()}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isLocked || !password.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {isLocked ? 'Locked' : 'Access'}
          </button>
        </form>

        <p className="mt-4 text-xs text-center text-gray-500">
          This is an internal tool for AC Drain Wiz team members only.
        </p>
      </div>
    </div>
  )
}
