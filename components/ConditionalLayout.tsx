'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileCTA from '@/components/MobileCTA'
import ParallaxBackground from '@/components/ParallaxBackground'

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminLogin = pathname === '/admin/login'
  const isAdminRoute = pathname?.startsWith('/admin') && !isAdminLogin

  // Hide header/footer for admin login page
  if (isAdminLogin) {
    return <>{children}</>
  }

  // Hide header/footer for admin dashboard (it has its own layout)
  if (isAdminRoute) {
    return <>{children}</>
  }

  // Show full layout for public pages
  return (
    <>
      <ParallaxBackground />
      <Header />
      <main className="relative z-10">{children}</main>
      <Footer />
      <MobileCTA />
    </>
  )
}


