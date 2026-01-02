'use client'

import { usePathname } from 'next/navigation'
import { AuthProvider } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  return (
    <AuthProvider>
      {isLoginPage ? (
        // Login page - no protection, no admin layout, no site header/footer
        <div className="min-h-screen">
          {children}
        </div>
      ) : (
        // Other admin pages - protected with admin layout
        <ProtectedRoute requireAdmin={true}>
          <AdminLayout>{children}</AdminLayout>
        </ProtectedRoute>
      )}
    </AuthProvider>
  )
}

