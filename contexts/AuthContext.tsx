'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { apiService } from '@/services/api'

interface User {
  email: string
  firstName: string
  lastName: string
  roles: string[]
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in on mount
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('jwt_token')
      const email = localStorage.getItem('user_email')
      const role = localStorage.getItem('user_role')

      if (token && email && role) {
        setUser({
          email,
          firstName: localStorage.getItem('user_firstName') || '',
          lastName: localStorage.getItem('user_lastName') || '',
          roles: [role],
        })
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 AuthContext: Starting login...')
      const response = await apiService.login(email, password)
      console.log('✅ AuthContext: Login response received:', response)
      
      if (!response || !response.token) {
        throw new Error('Invalid response from server')
      }
      
      // Store token and user info
      localStorage.setItem('jwt_token', response.token)
      localStorage.setItem('user_email', response.email)
      localStorage.setItem('user_firstName', response.firstName)
      localStorage.setItem('user_lastName', response.lastName)
      localStorage.setItem('user_role', response.roles[0] || '')

      setUser({
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        roles: response.roles,
      })

      console.log('✅ AuthContext: User data stored, redirecting...')
      router.push('/admin')
    } catch (error: any) {
      console.error('❌ AuthContext: Login error:', error)
      
      // Provide more detailed error messages
      if (error.response) {
        // Server responded with error
        const status = error.response.status
        const message = error.response.data?.message || error.response.data?.error || 'Login failed'
        
        if (status === 401) {
          throw new Error('Invalid email or password')
        } else if (status === 404) {
          throw new Error('API endpoint not found. Please check API URL configuration.')
        } else if (status === 500) {
          throw new Error('Server error. Please try again later.')
        } else {
          throw new Error(message)
        }
      } else if (error.request) {
        // Request was made but no response
        throw new Error('Cannot connect to server. Please check API URL and ensure server is running.')
      } else {
        // Error in request setup
        throw new Error(error.message || 'Login failed. Please check your connection.')
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('user_email')
    localStorage.removeItem('user_firstName')
    localStorage.removeItem('user_lastName')
    localStorage.removeItem('user_role')
    setUser(null)
    router.push('/admin/login')
  }

  const isAuthenticated = user !== null
  const isAdmin = user?.roles.includes('Admin') || user?.roles.includes('Manager') || false

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

