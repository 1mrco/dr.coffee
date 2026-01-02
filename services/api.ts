/**
 * API Service - Centralized API client for Dr.Coffee application
 * Handles all HTTP requests to the backend API with authentication
 */

import axios, { AxiosInstance, AxiosError } from 'axios'
import type {
  ApiProduct,
  ApiCategory,
  ApiCustomizationOption,
  ApiOrder,
  CreateProductRequest,
  UpdateProductRequest,
  CreateCustomizationOptionRequest,
  UpdateCustomizationOptionRequest,
  ApiError,
} from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7022/api'

/**
 * Centralized API service class
 * Handles authentication, error handling, and all API endpoints
 */
class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    })

    this.setupInterceptors()
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor: Add JWT token to all requests
    this.api.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('jwt_token')
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor: Handle errors globally
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        const isLoginEndpoint = error.config?.url?.includes('/auth/login')

        // Handle 401 Unauthorized (except for login endpoint)
        if (error.response?.status === 401 && !isLoginEndpoint) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('jwt_token')
            localStorage.removeItem('user_role')
            localStorage.removeItem('user_email')
            window.location.href = '/admin/login'
          }
        }

        return Promise.reject(error)
      }
    )
  }

  // ==================== Auth Endpoints ====================

  /**
   * Login user with email and password
   * @param email - User email
   * @param password - User password
   * @returns Login response with token and user data
   */
  async login(email: string, password: string): Promise<{
    token: string
    email: string
    role: string
    firstName?: string
    lastName?: string
  }> {
    const response = await this.api.post('/auth/login', { email, password })
    return response.data
  }

  // ==================== Product Endpoints ====================

  /**
   * Get all active products (public endpoint)
   * @returns Array of active products
   */
  async getProducts(): Promise<ApiProduct[]> {
    const response = await this.api.get('/products')
    return response.data
  }

  /**
   * Get product by ID (admin endpoint)
   * @param id - Product ID
   * @returns Product details
   */
  async getProduct(id: number): Promise<ApiProduct> {
    const response = await this.api.get(`/admin/products/${id}`)
    return response.data
  }

  /**
   * Get product by product code (public endpoint)
   * @param productCode - Product code
   * @returns Product details or null if not found
   */
  async getProductByCode(productCode: string): Promise<ApiProduct | null> {
    try {
      const response = await this.api.get(`/products/by-code/${productCode}`)
      return response.data
    } catch (error) {
      // Fallback: search in all products
      const products = await this.getProducts()
      return products.find((p) => p.productCode === productCode) || null
    }
  }

  /**
   * Create a new product (admin endpoint)
   * @param productData - Product data
   * @returns Created product
   */
  async createProduct(productData: CreateProductRequest): Promise<ApiProduct> {
    const response = await this.api.post('/admin/products', productData)
    return response.data
  }

  /**
   * Update a product (admin endpoint)
   * @param id - Product ID
   * @param productData - Updated product data
   * @returns Updated product
   */
  async updateProduct(id: number, productData: UpdateProductRequest): Promise<ApiProduct> {
    const response = await this.api.put(`/admin/products/${id}`, productData)
    return response.data
  }

  /**
   * Delete a product (admin endpoint)
   * @param id - Product ID
   */
  async deleteProduct(id: number): Promise<void> {
    await this.api.delete(`/admin/products/${id}`)
  }

  // ==================== Category Endpoints ====================

  /**
   * Get all categories (admin endpoint)
   * @returns Array of categories
   */
  async getCategories(): Promise<ApiCategory[]> {
    const response = await this.api.get('/admin/categories')
    return response.data
  }

  /**
   * Create a new category (admin endpoint)
   * @param categoryData - Category data
   * @returns Created category
   */
  async createCategory(categoryData: { name: string; displayOrder: number }): Promise<ApiCategory> {
    const response = await this.api.post('/admin/categories', categoryData)
    return response.data
  }

  /**
   * Update a category (admin endpoint)
   * @param id - Category ID
   * @param categoryData - Updated category data
   * @returns Updated category
   */
  async updateCategory(id: number, categoryData: Partial<ApiCategory>): Promise<ApiCategory> {
    const response = await this.api.put(`/admin/categories/${id}`, categoryData)
    return response.data
  }

  /**
   * Delete a category (admin endpoint)
   * @param id - Category ID
   */
  async deleteCategory(id: number): Promise<void> {
    await this.api.delete(`/admin/categories/${id}`)
  }

  // ==================== Order Endpoints ====================

  /**
   * Get all orders (admin endpoint)
   * @returns Array of orders
   */
  async getOrders(): Promise<ApiOrder[]> {
    const response = await this.api.get('/admin/orders')
    return response.data
  }

  /**
   * Get order by ID (admin endpoint)
   * @param id - Order ID
   * @returns Order details
   */
  async getOrder(id: number): Promise<ApiOrder> {
    const response = await this.api.get(`/admin/orders/${id}`)
    return response.data
  }

  /**
   * Update order status (admin endpoint)
   * @param id - Order ID
   * @param status - New order status
   * @returns Updated order
   */
  async updateOrderStatus(id: number, status: string): Promise<ApiOrder> {
    const response = await this.api.put(`/admin/orders/${id}/status`, {
      orderStatus: status,
    })
    return response.data
  }

  /**
   * Get orders by status (admin endpoint)
   * @param status - Order status
   * @returns Array of orders with the specified status
   */
  async getOrdersByStatus(status: string): Promise<ApiOrder[]> {
    const response = await this.api.get(`/admin/orders/status/${status}`)
    return response.data
  }

  // ==================== Customization Option Endpoints ====================

  /**
   * Get all active customization options (public endpoint)
   * @returns Array of active customization options
   */
  async getCustomizationOptions(): Promise<ApiCustomizationOption[]> {
    const response = await this.api.get('/customizationoptions')
    return response.data
  }

  /**
   * Get all customization options including inactive (admin endpoint)
   * @returns Array of all customization options
   */
  async getCustomizationOptionsAdmin(): Promise<ApiCustomizationOption[]> {
    const response = await this.api.get('/customizationoptions/admin')
    return response.data
  }

  /**
   * Create a new customization option (admin endpoint)
   * @param optionData - Customization option data
   * @returns Created customization option
   */
  async createCustomizationOption(
    optionData: CreateCustomizationOptionRequest
  ): Promise<ApiCustomizationOption> {
    const response = await this.api.post('/customizationoptions', optionData)
    return response.data
  }

  /**
   * Update a customization option (admin endpoint)
   * @param id - Customization option ID
   * @param optionData - Updated customization option data
   * @returns Updated customization option
   */
  async updateCustomizationOption(
    id: number,
    optionData: UpdateCustomizationOptionRequest
  ): Promise<ApiCustomizationOption> {
    const response = await this.api.put(`/customizationoptions/${id}`, optionData)
    return response.data
  }

  /**
   * Delete a customization option (admin endpoint)
   * @param id - Customization option ID
   */
  async deleteCustomizationOption(id: number): Promise<void> {
    await this.api.delete(`/customizationoptions/${id}`)
  }
}

// Export singleton instance
export const apiService = new ApiService()
