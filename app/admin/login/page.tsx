'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Coffee, Lock, Mail, AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      console.log('🔐 Login page: Attempting login...')
      await login(email, password)
      console.log('✅ Login page: Login successful')
      // Navigation is handled by AuthContext after successful login
    } catch (err: any) {
      console.error('❌ Login page: Login failed:', err)
      const errorMessage = err.message || 'Login failed. Please check your credentials and API connection.'
      setError(errorMessage)
      
      // Show more helpful error messages
      if (err.message?.includes('connect') || err.message?.includes('Network')) {
        setError('Cannot connect to server. Please check: 1) API is running, 2) API URL is correct in .env.local')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-cream to-primary/5 p-4">
      <div className="w-full max-w-md">
        <div className="glassy-card rounded-3xl p-8 md:p-10 backdrop-blur-md shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
              <Coffee className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-primary mb-2">
              Admin Login
            </h1>
            <p className="text-coffee/70">Sign in to manage Dr.Coffee</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-primary mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-coffee/40" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-primary/20 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-coffee/40"
                  placeholder="admin@drcoffee.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-coffee/40" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-primary/20 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-coffee/40"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Default credentials hint (remove in production) */}
          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <p className="text-xs text-coffee/70 text-center">
              Default: admin@drcoffee.com / Admin@123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

