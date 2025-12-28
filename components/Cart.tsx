'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import Image from 'next/image'

interface CartProps {
  onClose?: () => void
  isMobile?: boolean
}

export default function Cart({ onClose, isMobile = false }: CartProps) {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart()
  const [isOpen, setIsOpen] = useState(isMobile ? true : false)

  const handleClose = () => {
    setIsOpen(false)
    if (onClose) onClose()
  }

  const formatOrderMessage = () => {
    let message = '🍵 *Dr.Coffee Order*\n\n'
    
    items.forEach((item, index) => {
      const customizationPrice = item.customizations.reduce((sum, cust) => sum + cust.price, 0)
      const itemTotal = (item.price + customizationPrice) * item.quantity
      
      message += `${index + 1}. *${item.name_en}* (${item.size})\n`
      message += `   Quantity: ${item.quantity}\n`
      message += `   Price: ${item.price.toLocaleString()} IQD\n`
      
      if (item.customizations.length > 0) {
        message += `   Customizations:\n`
        item.customizations.forEach(cust => {
          message += `   - ${cust.name_en} (+${cust.price.toLocaleString()} IQD)\n`
        })
      }
      
      message += `   *Subtotal: ${itemTotal.toLocaleString()} IQD*\n\n`
    })
    
    message += `━━━━━━━━━━━━━━━━\n`
    message += `*Total: ${getTotal().toLocaleString()} IQD*\n\n`
    message += `Thank you! 🙏`
    
    return encodeURIComponent(message)
  }

  const handleOrder = () => {
    const message = formatOrderMessage()
    const whatsappUrl = `https://wa.me/9647772270005?text=${message}`
    window.open(whatsappUrl, '_blank')
    clearCart()
    handleClose()
  }

  if (isMobile) {
    return (
      <div className="h-full flex flex-col min-h-0">
        {/* Header */}
        <div className="glassy-card backdrop-blur-md p-6 border-b border-primary/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-heading font-bold text-primary">
              Shopping Cart
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-primary/10 rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X size={24} className="text-primary" />
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart size={64} className="text-primary/30 mb-4" />
              <p className="text-coffee/70 text-lg">Your cart is empty</p>
              <p className="text-coffee/50 text-sm mt-2">
                Add items from the menu to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const customizationPrice = item.customizations.reduce(
                  (sum, cust) => sum + cust.price,
                  0
                )
                const itemTotal = (item.price + customizationPrice) * item.quantity

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glassy-card rounded-2xl p-4 backdrop-blur-md"
                  >
                    <div className="flex gap-4">
                      {item.image && (
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-cream/50 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name_en}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-primary text-sm sm:text-base">
                              {item.name_en}
                            </h3>
                            <p className="text-xs text-coffee/70">{item.size}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} className="text-red-500" />
                          </button>
                        </div>

                        {item.customizations.length > 0 && (
                          <div className="mb-2">
                            <p className="text-xs text-coffee/60 mb-1">Customizations:</p>
                            <div className="flex flex-wrap gap-1">
                              {item.customizations.map((cust) => (
                                <span
                                  key={cust.id}
                                  className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                                >
                                  +{cust.name_en}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-primary text-sm sm:text-base">
                            {itemTotal.toLocaleString()} IQD
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} className="text-primary" />
                            </button>
                            <span className="w-8 text-center font-semibold text-primary">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} className="text-primary" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="glassy-card backdrop-blur-md p-6 border-t border-primary/10 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-primary">Total:</span>
              <span className="text-2xl font-bold text-primary">
                {getTotal().toLocaleString()} IQD
              </span>
            </div>
            <button
              onClick={() => {
                const message = formatOrderMessage()
                const whatsappUrl = `https://wa.me/9647772270005?text=${message}`
                window.open(whatsappUrl, '_blank')
                clearCart()
                handleClose()
              }}
              className="w-full bg-primary text-white py-4 rounded-full font-semibold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} />
              Order via WhatsApp
            </button>
            <button
              onClick={clearCart}
              className="w-full mt-2 text-coffee/70 text-sm hover:text-coffee transition-colors"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-primary hover:opacity-80 transition-opacity"
        aria-label="Shopping Cart"
      >
        <ShoppingCart size={24} />
        {items.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-accent-orange text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {items.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        )}
      </button>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/50 z-50"
            />
            
            {/* Cart Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-cream z-50 shadow-2xl flex flex-col min-h-0"
            >
              {/* Header */}
              <div className="glassy-card backdrop-blur-md p-6 border-b border-primary/10 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-heading font-bold text-primary">
                    Shopping Cart
                  </h2>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-primary/10 rounded-full transition-colors"
                    aria-label="Close cart"
                  >
                    <X size={24} className="text-primary" />
                  </button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 min-h-0">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingCart size={64} className="text-primary/30 mb-4" />
                    <p className="text-coffee/70 text-lg">Your cart is empty</p>
                    <p className="text-coffee/50 text-sm mt-2">
                      Add items from the menu to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => {
                      const customizationPrice = item.customizations.reduce(
                        (sum, cust) => sum + cust.price,
                        0
                      )
                      const itemTotal = (item.price + customizationPrice) * item.quantity

                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="glassy-card rounded-2xl p-4 backdrop-blur-md"
                        >
                          <div className="flex gap-4">
                            {/* Item Image */}
                            {item.image && (
                              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-cream/50 flex-shrink-0">
                                <Image
                                  src={item.image}
                                  alt={item.name_en}
                                  fill
                                  className="object-contain p-1"
                                />
                              </div>
                            )}
                            
                            {/* Item Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold text-primary text-sm sm:text-base">
                                    {item.name_en}
                                  </h3>
                                  <p className="text-xs text-coffee/70">{item.size}</p>
                                </div>
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="p-1 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
                                  aria-label="Remove item"
                                >
                                  <Trash2 size={16} className="text-red-500" />
                                </button>
                              </div>

                              {/* Customizations */}
                              {item.customizations.length > 0 && (
                                <div className="mb-2">
                                  <p className="text-xs text-coffee/60 mb-1">Customizations:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {item.customizations.map((cust) => (
                                      <span
                                        key={cust.id}
                                        className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                                      >
                                        +{cust.name_en}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Price and Quantity */}
                              <div className="flex items-center justify-between mt-2">
                                <span className="font-bold text-primary text-sm sm:text-base">
                                  {itemTotal.toLocaleString()} IQD
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity - 1)
                                    }
                                    className="w-7 h-7 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus size={14} className="text-primary" />
                                  </button>
                                  <span className="w-8 text-center font-semibold text-primary">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity + 1)
                                    }
                                    className="w-7 h-7 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus size={14} className="text-primary" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Footer with Total and Order Button */}
              {items.length > 0 && (
                <div className="glassy-card backdrop-blur-md p-6 border-t border-primary/10 flex-shrink-0">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-primary">Total:</span>
                    <span className="text-2xl font-bold text-primary">
                      {getTotal().toLocaleString()} IQD
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const message = formatOrderMessage()
                      const whatsappUrl = `https://wa.me/9647772270005?text=${message}`
                      window.open(whatsappUrl, '_blank')
                      clearCart()
                      handleClose()
                    }}
                    className="w-full bg-primary text-white py-4 rounded-full font-semibold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={20} />
                    Order via WhatsApp
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full mt-2 text-coffee/70 text-sm hover:text-coffee transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

