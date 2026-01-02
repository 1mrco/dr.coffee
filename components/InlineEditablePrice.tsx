'use client'

import { useState, useRef, useEffect } from 'react'
import { Edit2, Save, X, Loader2 } from 'lucide-react'
import { isAdmin } from '@/utils/auth'
import { apiService } from '@/services/api'
import AdminToast, { ToastType } from './AdminToast'

interface InlineEditablePriceProps {
  productId: number
  productCode: string
  size: string
  currentPrice: number
  onPriceUpdate?: (newPrice: number) => void
  className?: string
}

export default function InlineEditablePrice({
  productId,
  productCode,
  size,
  currentPrice,
  onPriceUpdate,
  className = '',
}: InlineEditablePriceProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [price, setPrice] = useState(currentPrice.toString())
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const isUserAdmin = isAdmin()

  useEffect(() => {
    setPrice(currentPrice.toString())
  }, [currentPrice])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleEdit = () => {
    if (!isUserAdmin) return
    setIsEditing(true)
    setPrice(currentPrice.toString())
  }

  const handleCancel = () => {
    setIsEditing(false)
    setPrice(currentPrice.toString())
  }

  const handleSave = async () => {
    const newPrice = parseFloat(price)
    
    if (isNaN(newPrice) || newPrice <= 0) {
      setToast({ message: 'Please enter a valid price (greater than 0)', type: 'warning' })
      return
    }

    if (newPrice === currentPrice) {
      setIsEditing(false)
      return
    }

    try {
      setIsSaving(true)
      
      // Get current product to update all prices
      const product = await apiService.getProduct(productId)
      
      if (!product || !product.prices) {
        throw new Error('Product data not found')
      }
      
      // Update the specific price in the prices array
      const updatedPrices = product.prices.map((p: any) =>
        p.size === size 
          ? { size: p.size, price: newPrice } 
          : { size: p.size, price: p.price }
      )

      console.log('Updating price for product:', productId, 'size:', size, 'new price:', newPrice)
      console.log('Updated prices array:', updatedPrices)

      // Send update request
      const response = await apiService.updateProduct(productId, {
        prices: updatedPrices,
      })

      console.log('Update response:', response)

      // Update local state immediately
      if (onPriceUpdate) {
        onPriceUpdate(newPrice)
      }

      setIsEditing(false)
      setToast({ message: 'Price updated successfully!', type: 'success' })
    } catch (error: any) {
      console.error('Error updating price:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update price'
      
      if (error.response?.status === 401) {
        setToast({ message: 'Unauthorized. Please login again.', type: 'error' })
      } else if (error.response?.status === 403) {
        setToast({ message: 'You do not have permission to update prices.', type: 'error' })
      } else {
        setToast({ message: errorMessage, type: 'error' })
      }
      
      // Revert to original price on error
      setPrice(currentPrice.toString())
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (!isUserAdmin) {
    // Regular user - just show the price
    return (
      <span className={`text-base sm:text-2xl font-bold text-primary ${className}`}>
        {currentPrice.toLocaleString()} IQD
      </span>
    )
  }

  // Admin user - show editable price
  if (isEditing) {
    return (
      <>
        <div className={`flex items-center gap-2 ${className}`}>
          <input
            ref={inputRef}
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSaving}
            className="w-24 sm:w-32 px-2 py-1 text-base sm:text-xl font-bold text-primary border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            min="0"
            step="100"
          />
          <span className="text-base sm:text-xl font-bold text-primary">IQD</span>
          <div className="flex items-center gap-1">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Save"
            >
              {isSaving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Cancel"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        {toast && (
          <AdminToast
            message={toast.message}
            type={toast.type}
            isVisible={!!toast}
            onClose={() => setToast(null)}
          />
        )}
      </>
    )
  }

  // Admin user - show price with edit icon (clickable)
  return (
    <div className={`flex items-center gap-2 group ${className}`}>
      <button
        onClick={handleEdit}
        className="flex items-center gap-1 text-base sm:text-2xl font-bold text-primary hover:text-primary/80 transition-colors group/edit"
        title="Click to edit price"
      >
        <span>{currentPrice.toLocaleString()} IQD</span>
        <Edit2 size={14} className="sm:w-5 sm:h-5 opacity-0 group-hover/edit:opacity-100 transition-opacity" />
      </button>
    </div>
  )
}

