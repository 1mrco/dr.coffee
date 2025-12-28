import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileCTA from '@/components/MobileCTA'
import ParallaxBackground from '@/components/ParallaxBackground'
import { CartProvider } from '@/contexts/CartContext'

export const metadata: Metadata = {
  title: 'Dr.Coffee - Start Your Day The Right Way',
  description: 'Fresh coffee. Bold flavors. Crafted to keep you energized and focused.',
  keywords: 'coffee, cold coffee, Dr.Coffee, energy drinks, fresh coffee',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="relative">
        <CartProvider>
          <ParallaxBackground />
          <Header />
          <main className="relative z-10">{children}</main>
          <Footer />
          <MobileCTA />
        </CartProvider>
      </body>
    </html>
  )
}

