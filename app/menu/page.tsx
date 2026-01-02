'use client'

/**
 * Menu Page - Displays all available products with filtering and search
 */

import { useState, useMemo, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Snowflake, Flame, Coffee, Shield, Search, X } from 'lucide-react'
import MenuItemCard from '@/components/MenuItemCard'
import menuData from '@/data/menu.json'
import { isAdmin } from '@/utils/auth'
import { apiService } from '@/services/api'
import type { ApiProduct, MenuItem, FilterType, ApiCustomizationOption } from '@/types'

type FilterType = 'all' | 'Cold' | 'Hot' | 'caffeine-free'

export default function MenuPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isUserAdmin, setIsUserAdmin] = useState(false)
  const [products, setProducts] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [allCustomizationOptions, setAllCustomizationOptions] = useState<ApiCustomizationOption[]>([])

  // Fix hydration error by checking admin status in useEffect
  useEffect(() => {
    setIsUserAdmin(isAdmin())
  }, [])

  // Fetch products and customization options from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const [apiProducts, customizationOptions] = await Promise.all([
          apiService.getProducts(),
          apiService.getCustomizationOptions(),
        ])

        // Store all customization options for later use
        setAllCustomizationOptions(customizationOptions)

        if (!apiProducts || apiProducts.length === 0) {
          setProducts(menuData.items as MenuItem[])
          setError('No products found in database. Using fallback data.')
          return
        }
        
        // Transform API products to MenuItem format
        const transformedProducts: MenuItem[] = apiProducts
          .filter(p => p.isActive) // Only show active products
          .map((product) => {
            // Convert prices array to Record<string, number>
            const pricesRecord: Record<string, number> = {}
            product.prices
              .filter(pp => pp.isActive)
              .forEach(pp => {
                pricesRecord[pp.size.toLowerCase()] = Number(pp.price)
              })

            return {
              id: product.productCode,
              name_en: product.nameEn,
              name_ar: product.nameAr,
              category: product.categoryName,
              tags: product.tags || [],
              caffeine_index: product.caffeineIndex,
              customizable: product.isCustomizable,
              prices: pricesRecord,
              flavors: product.flavors || [],
              image: product.imageUrl,
              customizationOptionIds: product.customizationOptionIds || [] // Include linked customization option IDs
            }
          })

        setProducts(transformedProducts)
      } catch (err: unknown) {
        const error = err as {
          message?: string
          response?: { data?: { message?: string }; status?: number }
          config?: { url?: string }
        }
        const errorMessage =
          error.response?.data?.message || error.message || 'Unknown error'
        setError(`Failed to load products: ${errorMessage}. Using fallback data.`)

        // Fallback to menu.json if API fails
        setProducts(menuData.items as MenuItem[])
        setAllCustomizationOptions(menuData.customizationOptions || [])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((item) => item.category)))
    return ['all', ...cats]
  }, [products])

  // Filter items
  const filteredItems = useMemo(() => {
    let filtered = products

    // Filter by search query (name in English or Arabic)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.name_en.toLowerCase().includes(query) ||
          item.name_ar.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query)
      )
    }

    // Filter by temperature
    if (activeFilter === 'Cold') {
      filtered = filtered.filter((item) => item.tags.includes('Cold'))
    } else if (activeFilter === 'Hot') {
      filtered = filtered.filter((item) => item.tags.includes('Hot'))
    } else if (activeFilter === 'caffeine-free') {
      filtered = filtered.filter((item) => item.caffeine_index === 0)
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    return filtered
  }, [products, searchQuery, activeFilter, selectedCategory])

  const filters = [
    { id: 'all' as FilterType, label: 'All', icon: Coffee },
    { id: 'Cold' as FilterType, label: 'Cold', icon: Snowflake },
    { id: 'Hot' as FilterType, label: 'Hot', icon: Flame },
    { id: 'caffeine-free' as FilterType, label: 'Caffeine Free', icon: Coffee },
  ]

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 relative z-10"
        >
          <div className="glassy-card rounded-3xl p-8 md:p-12 backdrop-blur-md">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary">
                Our Menu
              </h1>
              {isUserAdmin && (
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                  <Shield size={20} className="text-primary" />
                  <span className="text-sm font-semibold text-primary">Admin Mode</span>
                </div>
              )}
            </div>
            <p className="text-lg text-coffee/70 max-w-2xl mx-auto">
              Carefully crafted drinks made to energize your day.<br />
              Customise like a chemist.
              {isUserAdmin && (
                <span className="block mt-2 text-sm text-primary/80">
                  💡 Hover over prices to edit them directly
                </span>
              )}
            </p>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mb-8 relative z-10"
        >
          <div className="glassy-card rounded-2xl p-4 backdrop-blur-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-coffee/40" />
              <input
                type="text"
                placeholder="Search by name (English or Arabic)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-xl border border-primary/20 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-coffee/40"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-coffee/40 hover:text-coffee/70 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Temperature Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-8 relative z-10"
        >
          {filters.map((filter) => {
            const Icon = filter.icon
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${
                  activeFilter === filter.id
                    ? filter.id === 'Cold'
                      ? 'bg-purple-500 text-white shadow-lg'
                      : filter.id === 'Hot'
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-primary text-white shadow-lg'
                    : 'bg-white/80 text-primary border-2 border-primary/20 hover:border-primary/50 glassy-card'
                }`}
              >
                <Icon size={18} />
                {filter.label}
              </button>
            )
          })}
        </motion.div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 overflow-x-auto relative z-10"
          >
            <div className="flex gap-2 pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-white/80 text-primary border border-primary/20 hover:border-primary/50 glassy-card'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Results Count */}
        {(searchQuery || activeFilter !== 'all' || selectedCategory !== 'all') && !isLoading && !error && (
          <div className="text-center mb-4 relative z-10">
            <p className="text-sm text-coffee/70">
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>
        )}

        {/* Products Grid */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-coffee/70 text-lg">Loading menu...</p>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-red-500 text-lg mb-2">{error}</p>
            <p className="text-coffee/70">Showing fallback data.</p>
          </motion.div>
                ) : filteredItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 relative z-10 mb-12">
                    {filteredItems.map((item, index) => {
                      // Get only the customization options linked to this specific product
                      const productCustomizationOptions = item.customizationOptionIds && item.customizationOptionIds.length > 0
                        ? allCustomizationOptions.filter(opt => {
                            const optId = opt.customizationOptionId || opt.id
                            return item.customizationOptionIds?.includes(
                              typeof optId === 'number' ? optId : Number(optId)
                            )
                          })
                        : []
                      
                      return (
                        <MenuItemCard 
                          key={item.id} 
                          item={item} 
                          index={index}
                          availableCustomizationOptions={productCustomizationOptions}
                        />
                      )
                    })}
                  </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-coffee/70 text-lg">
              {searchQuery
                ? `No items found matching "${searchQuery}". Try a different search.`
                : 'No items found. Try different filters.'}
            </p>
          </motion.div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glassy-card rounded-3xl p-8 md:p-12 backdrop-blur-md relative z-10 mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-6 text-center">
            Customise Like a Chemist
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {(allCustomizationOptions.length > 0 ? allCustomizationOptions : menuData.customizationOptions).map((option: any) => (
              <div
                key={option.customizationOptionId || option.id}
                className="text-center p-4 rounded-2xl bg-primary/5"
              >
                <p className="font-semibold text-primary mb-1">{option.nameEn || option.name_en}</p>
                <p className="text-sm text-coffee/70 mb-2">{option.nameAr || option.name_ar}</p>
                <p className="text-primary font-bold">+{(option.price || 0).toLocaleString()} IQD</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center relative z-10"
        >
          <div className="glassy-card rounded-3xl p-8 md:p-12 backdrop-blur-md">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-6">
              Ready to Order?
            </h2>
            <a
              href="/how-to-order"
              className="btn-primary bg-primary text-white px-8 py-4 rounded-full font-semibold text-lg inline-block"
            >
              How to Order
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
