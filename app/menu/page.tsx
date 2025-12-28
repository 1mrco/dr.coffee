'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Snowflake, Flame, Coffee } from 'lucide-react'
import MenuItemCard from '@/components/MenuItemCard'
import menuData from '@/data/menu.json'

type FilterType = 'all' | 'Cold' | 'Hot' | 'caffeine-free'

export default function MenuPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(menuData.items.map((item) => item.category)))
    return ['all', ...cats]
  }, [])

  // Filter items
  const filteredItems = useMemo(() => {
    let filtered = menuData.items

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
  }, [activeFilter, selectedCategory])

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
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary mb-4">
              Our Menu
            </h1>
            <p className="text-lg text-coffee/70 max-w-2xl mx-auto">
              Carefully crafted drinks made to energize your day.<br />
              Customise like a chemist.
            </p>
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

        {/* Products Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 relative z-10 mb-12">
            {filteredItems.map((item, index) => (
              <MenuItemCard key={item.id} item={item} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-coffee/70 text-lg">No items found. Try different filters.</p>
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
            {menuData.customizationOptions.map((option) => (
              <div
                key={option.id}
                className="text-center p-4 rounded-2xl bg-primary/5"
              >
                <p className="font-semibold text-primary mb-1">{option.name_en}</p>
                <p className="text-sm text-coffee/70 mb-2">{option.name_ar}</p>
                <p className="text-primary font-bold">+{option.price.toLocaleString()} IQD</p>
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
