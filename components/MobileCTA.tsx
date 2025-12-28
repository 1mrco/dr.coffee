'use client'

import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import Cart from './Cart'

export default function MobileCTA() {
  const { getItemCount } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const itemCount = getItemCount()

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-primary text-white p-4 shadow-2xl">
        <button
          onClick={() => setIsCartOpen(true)}
          className="w-full bg-white text-primary px-6 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:bg-cream transition-colors relative"
        >
          <ShoppingCart size={24} />
          {itemCount > 0 ? (
            <span>View Cart ({itemCount})</span>
          ) : (
            <span>ORDER NOW</span>
          )}
        </button>
      </div>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsCartOpen(false)} />
          <div className="absolute inset-0 flex items-end">
            <div className="w-full max-h-[85vh] bg-cream rounded-t-3xl overflow-hidden flex flex-col">
              <Cart isMobile={true} onClose={() => setIsCartOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

