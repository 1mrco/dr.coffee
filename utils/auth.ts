/**
 * Authentication utility functions
 * Check if user is logged in and has valid token
 */

export const isLoggedIn = (): boolean => {
  if (typeof window === 'undefined') return false
  const token = localStorage.getItem('jwt_token')
  return !!token
}

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('jwt_token')
}

export const getUserRole = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('user_role')
}

export const isAdmin = (): boolean => {
  if (typeof window === 'undefined') return false
  const token = getToken()
  const role = getUserRole()
  // Only return true if user has a valid token AND is Admin/Manager
  // This prevents showing admin mode if just a role is stored without a valid session
  return !!(token && (role === 'Admin' || role === 'Manager'))
}

export const clearAuth = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('jwt_token')
  localStorage.removeItem('user_email')
  localStorage.removeItem('user_firstName')
  localStorage.removeItem('user_lastName')
  localStorage.removeItem('user_role')
}


