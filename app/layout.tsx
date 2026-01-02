import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import ConditionalLayout from '@/components/ConditionalLayout'

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
          <ConditionalLayout>{children}</ConditionalLayout>
        </CartProvider>
      </body>
    </html>
  )
}

