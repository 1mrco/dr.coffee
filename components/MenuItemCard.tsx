'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Beaker, ShoppingCart } from 'lucide-react'
import CaffeineBar from './CaffeineBar'
import Customizer from './Customizer'
import { useCart } from '@/contexts/CartContext'
import Toast from './Toast'
import menuData from '@/data/menu.json'
import InlineEditablePrice from './InlineEditablePrice'
import { useProductMapping } from '@/hooks/useProductMapping'

interface MenuItem {
  id: string
  name_en: string
  name_ar: string
  category: string
  tags: string[]
  caffeine_index: number
  customizable: boolean
  prices: Record<string, number>
  flavors?: string[]
}

interface MenuItemCardProps {
  item: MenuItem
  index?: number
  image?: string
  availableCustomizationOptions?: Array<{
    customizationOptionId?: number
    id?: string
    nameEn?: string
    name_en?: string
    nameAr?: string
    name_ar?: string
    price?: number
  }>
}

export default function MenuItemCard({ item, index = 0, image, availableCustomizationOptions }: MenuItemCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>([])
  const [addedCustomizations, setAddedCustomizations] = useState<typeof menuData.customizationOptions>([])
  const [showToast, setShowToast] = useState(false)
  const [localPrices, setLocalPrices] = useState<Record<string, number>>(item.prices)
  const { addItem } = useCart()
  const { getProductId } = useProductMapping()
  
  const productId = getProductId(item.id)

  const isCold = item.tags.includes('Cold')
  const isHot = item.tags.includes('Hot')

  // Get available sizes
  const availableSizes = Object.keys(item.prices).filter(
    (key) => !key.includes('cream') && !key.includes('with') && !key.includes('without')
  )

  // Initialize selected size
  useEffect(() => {
    if (!selectedSize && availableSizes.length > 0) {
      setSelectedSize(availableSizes[0])
    }
  }, [item.id, availableSizes, selectedSize])

  const basePrice = selectedSize ? localPrices[selectedSize] || 0 : 0
  const customizationPrice = addedCustomizations.reduce((sum, opt) => sum + opt.price, 0)
  const totalPrice = basePrice + customizationPrice

  const handlePriceUpdate = (size: string, newPrice: number) => {
    setLocalPrices(prev => ({
      ...prev,
      [size]: newPrice
    }))
  }

  const handleCustomize = () => {
    setShowCustomizer(true)
  }

  const handleAddCustomization = (option: typeof menuData.customizationOptions[0]) => {
    if (addedCustomizations.find((opt) => opt.id === option.id)) {
      // Remove if already added
      setAddedCustomizations(addedCustomizations.filter((opt) => opt.id !== option.id))
      setSelectedCustomizations(selectedCustomizations.filter((id) => id !== option.id))
    } else {
      // Add if not present
      setAddedCustomizations([...addedCustomizations, option])
      setSelectedCustomizations([...selectedCustomizations, option.id])
    }
  }

  const handleAddToCart = () => {
    if (!selectedSize) return

    const cartItemId = `${item.id}-${selectedSize}-${JSON.stringify(addedCustomizations.map(c => c.id).sort())}`
    
    addItem({
      id: cartItemId,
      name_en: item.name_en,
      name_ar: item.name_ar,
      size: selectedSize,
      price: basePrice,
      customizations: addedCustomizations.map(cust => ({
        id: cust.id,
        name_en: cust.name_en,
        name_ar: cust.name_ar,
        price: cust.price,
      })),
      image: getImagePath(),
    })

    setShowToast(true)
  }

  const getImagePath = () => {
    if (image) return image
    // Default image based on index
    const imageFiles = [
      'Photoroom_20251225_043102.PNG',
      'Photoroom_20251225_043117.PNG',
      'Photoroom_20251225_043450.PNG',
      'Photoroom_20251225_043515.PNG',
      'Photoroom_20251225_043530.PNG',
      'Photoroom_20251225_043606.PNG',
      'Photoroom_20251225_043643.PNG',
      'Photoroom_20251225_043655.PNG',
      'Photoroom_20251225_043712.PNG',
      'Photoroom_20251225_043731.PNG',
      'Photoroom_20251225_043749.PNG',
      'Photoroom_20251225_043921.PNG',
    ]
    const imageIndex = index % imageFiles.length
    return `/image/drinks images/${imageFiles[imageIndex]}`
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.05 }}
        className={`glassy-card rounded-2xl sm:rounded-3xl p-3 sm:p-6 backdrop-blur-md border ${
          isCold
            ? 'bg-purple-500/10 border-purple-300/30'
            : isHot
            ? 'bg-orange-500/10 border-orange-300/30'
            : 'bg-white/80 border-white/50'
        } shadow-lg hover:shadow-xl transition-all duration-300`}
      >
        {/* Image */}
        <div className="relative w-full h-48 sm:h-56 mb-2 sm:mb-4 rounded-xl sm:rounded-2xl overflow-hidden bg-cream/50">
          <Image
            src={getImagePath()}
            alt={item.name_en}
            fill
            className="object-contain p-2"
            sizes="(max-width: 768px) 192px, 224px"
          />
        </div>

        {/* Name - Fixed height to maintain consistent spacing */}
        <div className="mb-2 sm:mb-3 min-h-[48px] sm:min-h-[60px]">
          <h3 className="text-sm sm:text-xl font-heading font-semibold text-primary mb-0.5 sm:mb-1 line-clamp-2">
            {item.name_en}
          </h3>
          <p className="text-xs sm:text-sm text-coffee/70 line-clamp-1">{item.name_ar}</p>
        </div>

        {/* Caffeine Bar - Always show to maintain consistent spacing */}
        <div className="mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2 min-h-[20px] sm:min-h-[24px]">
          <span className="text-[10px] sm:text-xs text-coffee/60">Caffeine:</span>
          <CaffeineBar level={item.caffeine_index || 0} />
        </div>

        {/* Size Selection - Always reserve space to maintain consistent spacing */}
        <div className="mb-2 sm:mb-3 flex gap-1 sm:gap-2 min-h-[28px] sm:min-h-[36px]">
          {availableSizes.length > 1 ? (
            availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold transition-all ${
                  selectedSize === size
                    ? isCold
                      ? 'bg-purple-500 text-white'
                      : isHot
                      ? 'bg-orange-500 text-white'
                      : 'bg-primary text-white'
                    : 'bg-white/50 text-primary border border-primary/20'
                }`}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            ))
          ) : (
            <div className="px-2 sm:px-3 py-0.5 sm:py-1 invisible" aria-hidden="true">
              <span className="text-[10px] sm:text-xs">Size</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mb-2 sm:mb-4">
          <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
            {productId && selectedSize ? (
              <InlineEditablePrice
                productId={productId}
                productCode={item.id}
                size={selectedSize}
                currentPrice={basePrice}
                onPriceUpdate={(newPrice) => handlePriceUpdate(selectedSize, newPrice)}
                className="flex-shrink-0"
              />
            ) : (
              <span className="text-base sm:text-2xl font-bold text-primary">
                {basePrice.toLocaleString()} IQD
              </span>
            )}
            {customizationPrice > 0 && (
              <span className="text-xs sm:text-sm text-coffee/60">
                (+{customizationPrice.toLocaleString()})
              </span>
            )}
          </div>
          {/* Show all prices for admin editing (collapsed view) */}
          {productId && Object.keys(localPrices).length > 1 && (
            <details className="mt-2 text-xs sm:text-sm">
              <summary className="cursor-pointer text-coffee/70 hover:text-primary transition-colors">
                Edit all prices ({Object.keys(localPrices).length} sizes)
              </summary>
              <div className="mt-2 space-y-2 pl-2 border-l-2 border-primary/20">
                {Object.entries(localPrices).map(([size, price]) => (
                  <div key={size} className="flex items-center justify-between gap-2">
                    <span className="text-coffee/70 capitalize font-medium">{size}:</span>
                    <InlineEditablePrice
                      productId={productId}
                      productCode={item.id}
                      size={size}
                      currentPrice={price}
                      onPriceUpdate={(newPrice) => handlePriceUpdate(size, newPrice)}
                      className="text-sm"
                    />
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>

        {/* Customizations Display */}
        {addedCustomizations.length > 0 && (
          <div className="mb-2 sm:mb-3 flex flex-wrap gap-0.5 sm:gap-1">
            {addedCustomizations.map((opt) => (
              <span
                key={opt.id}
                className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-primary/10 text-primary"
              >
                +{opt.name_en}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-1 sm:gap-2">
          {/* Customise Button - Always reserve space to keep Add to Cart in same position */}
          {item.customizable ? (
            <button
              onClick={handleCustomize}
              className={`w-full py-1.5 sm:py-2 px-2 sm:px-4 rounded-full text-[10px] sm:text-sm font-semibold flex items-center justify-center gap-1 sm:gap-2 transition-all ${
                isCold
                  ? 'bg-purple-500/20 text-purple-700 hover:bg-purple-500/30'
                  : isHot
                  ? 'bg-orange-500/20 text-orange-700 hover:bg-orange-500/30'
                  : 'bg-primary/10 text-primary hover:bg-primary/20'
              }`}
            >
              <Beaker size={12} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Customise</span>
              <span className="sm:hidden">Custom</span>
            </button>
          ) : (
            <div className="w-full py-1.5 sm:py-2 px-2 sm:px-4 invisible" aria-hidden="true">
              <div className="flex items-center justify-center gap-1 sm:gap-2">
                <Beaker size={12} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Customise</span>
                <span className="sm:hidden">Custom</span>
              </div>
            </div>
          )}
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className={`w-full py-1.5 sm:py-2 px-2 sm:px-4 rounded-full text-[10px] sm:text-sm font-semibold text-center transition-all flex items-center justify-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              isCold
                ? 'bg-purple-500 text-white hover:bg-purple-600'
                : isHot
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            <ShoppingCart size={12} className="sm:w-4 sm:h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </motion.div>

      {/* Customizer Modal */}
      {showCustomizer && (
        <Customizer
          options={
            availableCustomizationOptions && availableCustomizationOptions.length > 0
              ? availableCustomizationOptions.map(opt => ({
                  id: String(opt.customizationOptionId || opt.id || ''),
                  name_en: opt.nameEn || opt.name_en || '',
                  name_ar: opt.nameAr || opt.name_ar || '',
                  price: opt.price || 0
                }))
              : menuData.customizationOptions
          }
          onClose={() => setShowCustomizer(false)}
          onAdd={handleAddCustomization}
          selectedOptions={selectedCustomizations}
        />
      )}

      {/* Toast Notification */}
      <Toast
        message="Item added to cart!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  )
}

