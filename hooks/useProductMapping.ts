'use client'

import { useState, useEffect } from 'react'
import { apiService } from '@/services/api'
import { isAdmin } from '@/utils/auth'

interface ProductMapping {
  [productCode: string]: number // productCode -> productId
}

export function useProductMapping() {
  const [mapping, setMapping] = useState<ProductMapping>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadMapping = async () => {
      // Only load if user is admin
      if (!isAdmin()) return

      try {
        setIsLoading(true)
        const products = await apiService.getProducts()
        const productMap: ProductMapping = {}
        
        products.forEach((product: any) => {
          productMap[product.productCode] = product.productId
        })
        
        setMapping(productMap)
      } catch (error) {
        console.error('Failed to load product mapping:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMapping()
  }, [])

  const getProductId = (productCode: string): number | null => {
    return mapping[productCode] || null
  }

  return { mapping, getProductId, isLoading }
}


