/**
 * Shared TypeScript types and interfaces for Dr.Coffee application
 */

// ==================== API Types ====================

export interface ApiProduct {
  productId: number
  productCode: string
  nameEn: string
  nameAr: string
  imageUrl?: string
  categoryId: number
  categoryName: string
  caffeineIndex: number
  isCustomizable: boolean
  isActive: boolean
  prices: Array<{
    productPriceId: number
    size: string
    price: number
    isActive: boolean
  }>
  tags: string[]
  flavors: string[]
  customizationOptionIds: number[]
}

export interface ApiCategory {
  categoryId: number
  name: string
  displayOrder?: number
}

export interface ApiCustomizationOption {
  customizationOptionId: number
  optionCode: string
  nameEn: string
  nameAr: string
  price: number
  isActive: boolean
  displayOrder: number
  createdAt?: string
  updatedAt?: string
}

export interface ApiOrder {
  orderId: number
  orderNumber: string
  orderDate: string
  totalAmount: number
  orderStatus: string
  customerId?: number
  customerName?: string
  customerPhone?: string
}

// ==================== Frontend Types ====================

export interface MenuItem {
  id: string
  name_en: string
  name_ar: string
  category: string
  tags: string[]
  caffeine_index: number
  customizable: boolean
  prices: Record<string, number>
  flavors?: string[]
  image?: string
  customizationOptionIds?: number[]
}

export interface ProductFormData {
  productCode: string
  nameEn: string
  nameAr: string
  imageUrl: string
  categoryId: number
  caffeineIndex: number
  isCustomizable: boolean
  isActive: boolean
  prices: Array<{ size: string; price: number }>
  tags: string[]
  flavors: string[]
  customizationOptionIds: number[]
}

export interface CustomizationOptionFormData {
  optionCode: string
  nameEn: string
  nameAr: string
  price: number
  isActive: boolean
  displayOrder: number
}

export interface CustomizationOptionDisplay {
  id: string
  name_en: string
  name_ar: string
  price: number
}

// ==================== Request/Response Types ====================

export interface CreateProductRequest {
  productCode: string
  nameEn: string
  nameAr: string
  imageUrl?: string
  categoryId: number
  caffeineIndex: number
  isCustomizable: boolean
  isActive: boolean
  prices: Array<{ size: string; price: number }>
  tags: string[]
  flavors: string[]
  customizationOptionIds: number[]
}

export interface UpdateProductRequest {
  nameEn?: string
  nameAr?: string
  imageUrl?: string
  categoryId?: number
  caffeineIndex?: number
  isCustomizable?: boolean
  isActive?: boolean
  prices?: Array<{ size: string; price: number }>
  tags?: string[]
  flavors?: string[]
  customizationOptionIds?: number[]
}

export interface CreateCustomizationOptionRequest {
  optionCode: string
  nameEn: string
  nameAr: string
  price: number
  isActive: boolean
  displayOrder: number
}

export interface UpdateCustomizationOptionRequest {
  nameEn?: string
  nameAr?: string
  price?: number
  isActive?: boolean
  displayOrder?: number
}

// ==================== Error Types ====================

export interface ApiError {
  message: string
  status?: number
  errors?: Record<string, string[]>
}

// ==================== Utility Types ====================

export type FilterType = 'all' | 'Cold' | 'Hot' | 'caffeine-free'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

