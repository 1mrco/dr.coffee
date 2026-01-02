'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to products page by default
    router.replace('/admin/products')
  }, [router])

  return null
}


