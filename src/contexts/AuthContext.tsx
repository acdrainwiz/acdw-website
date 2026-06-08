/**
 * Authentication Context (Clerk-based)
 * 
 * Uses Clerk for authentication and role management.
 * 
 * SECURITY: Clerk handles JWT tokens, session management, and role validation.
 */

import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react'
import type { User, AuthState, LoginCredentials, SignupData } from '../types/auth'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  hasRole: (role: User['role']) => boolean
  hasAnyRole: (roles: User['role'][]) => boolean
  isSessionValid: () => boolean
  sessionError: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// AuthProvider that uses Clerk (only when ClerkProvider is present)
function AuthProviderWithClerk({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded: userLoaded } = useUser()
  const { signOut, isSignedIn, getToken } = useClerkAuth()
  const [sessionError, setSessionError] = useState<string | null>(null)

  // Convert Clerk user to our User type
  const user: User | null = clerkUser
    ? {
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        // Read role from unsafeMetadata (set during signup) or publicMetadata
        role: (clerkUser.unsafeMetadata?.role || clerkUser.publicMetadata?.role || 'homeowner') as User['role'],
        company: (clerkUser.unsafeMetadata?.company || clerkUser.publicMetadata?.company) as string | undefined,
        name: clerkUser.fullName || undefined,
        // Read verification data from unsafeMetadata
        verification: clerkUser.unsafeMetadata?.verification as User['verification'] | undefined,
      }
    : null

  const isAuthenticated = !!user && !!isSignedIn
  const isLoading = !userLoaded
  
  // Session validation: Check if Clerk session is still valid
  useEffect(() => {
    if (userLoaded && !isSignedIn && clerkUser) {
      // User object exists but Clerk says not signed in - session expired
      setSessionError('Your session has expired. Please sign in again.')
      console.warn('⚠️ Session expired - Clerk user exists but isSignedIn is false')
    }
  }, [userLoaded, isSignedIn, clerkUser])
  
  // Validate session periodically (every 5 minutes)
  useEffect(() => {
    if (!isAuthenticated) return
    
    const validateSession = async () => {
      try {
        const token = await getToken()
        if (!token) {
          setSessionError('Your session has expired. Please sign in again.')
          console.warn('⚠️ Session validation failed - No token available')
        }
      } catch (error) {
        console.error('Session validation error:', error)
        setSessionError('Your session has expired. Please sign in again.')
      }
    }
    
    // Check session every 5 minutes
    const intervalId = setInterval(validateSession, 5 * 60 * 1000)
    
    return () => clearInterval(intervalId)
  }, [isAuthenticated, getToken])

  const login = async (_credentials: LoginCredentials) => {
    throw new Error('Use Clerk SignIn component for login')
  }

  const signup = async (_data: SignupData) => {
    throw new Error('Use Clerk SignUp component for signup')
  }

  const logout = async () => {
    await signOut()
  }

  const refreshToken = async () => {
    // Clerk handles token refresh automatically
    // But we can force a check by getting a new token
    try {
      await getToken({ skipCache: true })
      setSessionError(null)
    } catch (error) {
      console.error('Token refresh failed:', error)
      setSessionError('Your session has expired. Please sign in again.')
    }
  }

  const isSessionValid = (): boolean => {
    return isAuthenticated && !sessionError
  }

  const hasRole = (role: User['role']): boolean => {
    return user?.role === role
  }

  const hasAnyRole = (roles: User['role'][]): boolean => {
    return user ? roles.includes(user.role) : false
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error: null,
        login,
        signup,
        logout,
        refreshToken,
        hasRole,
        hasAnyRole,
        isSessionValid,
        sessionError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// AuthProvider without Clerk (fallback when ClerkProvider is not present)
function AuthProviderWithoutClerk({ children }: { children: ReactNode }) {
  const user: User | null = null
  const isAuthenticated = false
  const isLoading = false

  const login = async (_credentials: LoginCredentials) => {
    throw new Error('Authentication is not configured. Please set VITE_CLERK_PUBLISHABLE_KEY')
  }

  const signup = async (_data: SignupData) => {
    throw new Error('Authentication is not configured. Please set VITE_CLERK_PUBLISHABLE_KEY')
  }

  const logout = async () => {
    // No-op when Clerk is not available
  }

  const refreshToken = async () => {
    // No-op when Clerk is not available
  }

  const hasRole = (_role: User['role']): boolean => {
    return false
  }

  const hasAnyRole = (_roles: User['role'][]): boolean => {
    return false
  }
  
  const isSessionValid = (): boolean => {
    return false
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error: null,
        login,
        signup,
        logout,
        refreshToken,
        hasRole,
        hasAnyRole,
        isSessionValid,
        sessionError: null,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Main AuthProvider that conditionally uses Clerk based on environment
export function AuthProvider({ children }: { children: ReactNode }) {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  
  // Only use Clerk hooks if ClerkProvider is present (checked in main.tsx)
  // If clerkPubKey exists, ClerkProvider wraps App, so we can use Clerk hooks
  if (clerkPubKey) {
    return <AuthProviderWithClerk>{children}</AuthProviderWithClerk>
  }
  
  // Fallback when Clerk is not configured
  return <AuthProviderWithoutClerk>{children}</AuthProviderWithoutClerk>
}

// Co-located with its provider per React's Context docs; this is a Fast Refresh
// hint only, so the hook export is intentionally kept in this file.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
