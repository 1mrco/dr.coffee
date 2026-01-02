'use client'

/**
 * Admin Products Management Page
 * Allows admins to manage products, categories, and customization options
 */

import { useState, useEffect, useCallback } from 'react'
import { apiService } from '@/services/api'
import { Plus, Edit2, Trash2, X, Save, AlertCircle, Loader2, Search, Beaker } from 'lucide-react'
import AdminToast, { ToastType } from '@/components/AdminToast'
import type {
  ApiProduct,
  ApiCategory,
  ApiCustomizationOption,
  ProductFormData,
  CustomizationOptionFormData,
} from '@/types'

export default function ProductsPage() {
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [customizationOptions, setCustomizationOptions] = useState<ApiCustomizationOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditPriceModal, setShowEditPriceModal] = useState(false)
  const [showCustomizationModal, setShowCustomizationModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ApiProduct | null>(null)
  const [selectedCustomization, setSelectedCustomization] = useState<ApiCustomizationOption | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [isUpdatingPrice, setIsUpdatingPrice] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Form states
  const [formData, setFormData] = useState<ProductFormData>({
    productCode: '',
    nameEn: '',
    nameAr: '',
    imageUrl: '',
    categoryId: 0,
    caffeineIndex: 0,
    isCustomizable: false,
    isActive: true,
    prices: [{ size: 'medium', price: 0 }],
    tags: ['Cold'],
    flavors: [],
    customizationOptionIds: [],
  })

  const [priceEditData, setPriceEditData] = useState<{
    productId: number
    prices: Array<{ size: string; price: number }>
  } | null>(null)

  useEffect(() => {
    loadData()
  }, [loadData])

  /**
   * Load all data from API (products, categories, customization options)
   * @param showLoading - Whether to show loading state
   */
  const loadData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true)
      }
      setError('')

      const [productsData, categoriesData, customizationData] = await Promise.all([
        apiService.getProducts(),
        apiService.getCategories(),
        apiService.getCustomizationOptionsAdmin(),
      ])

      setProducts(productsData)
      setCategories(categoriesData)
      setCustomizationOptions(customizationData)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string }; status?: number }; message?: string }
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to load data'
      setError(errorMessage)

      if (error.response?.status === 401) {
        setToast({ message: 'Session expired. Please login again.', type: 'error' })
      } else {
        setToast({ message: errorMessage, type: 'error' })
      }
    } finally {
      if (showLoading) {
        setIsLoading(false)
      }
    }
  }, [])

  /**
   * Handle product creation
   */
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiService.createProduct(formData)
      setShowAddModal(false)
      resetForm()
      await loadData()
      setToast({ message: 'Product created successfully!', type: 'success' })
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string }
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to create product'
      setError(errorMessage)
      setToast({ message: errorMessage, type: 'error' })
    }
  }

  const handleEditPrice = (product: Product) => {
    setSelectedProduct(product)
    setPriceEditData({
      productId: product.productId,
      prices: product.prices.map((p) => ({ size: p.size, price: p.price })),
    })
    setShowEditPriceModal(true)
  }

  const handleUpdatePrice = async () => {
    if (!priceEditData || !selectedProduct) return

    try {
      setIsUpdatingPrice(true)
      setError('')
      
      // Validate prices
      const hasInvalidPrices = priceEditData.prices.some(p => p.price <= 0)
      if (hasInvalidPrices) {
        setToast({ message: 'Please enter valid prices (greater than 0)', type: 'warning' })
        setIsUpdatingPrice(false)
        return
      }

      // Prepare the update payload - use camelCase (ASP.NET Core handles both)
      const updatePayload = {
        prices: priceEditData.prices.map(p => ({
          size: p.size,
          price: p.price
        }))
      }

      const response = await apiService.updateProduct(selectedProduct.productId, updatePayload)
      
      // Close modal
      setShowEditPriceModal(false)
      setPriceEditData(null)
      const updatedProduct = response
      setSelectedProduct(null)
      
      // Update local state immediately with response data
      if (updatedProduct && updatedProduct.prices) {
        setProducts(prevProducts => 
          prevProducts.map(p => 
            p.productId === selectedProduct.productId 
              ? { 
                  ...p, 
                  prices: updatedProduct.prices.map((price: any) => ({
                    productPriceId: price.productPriceId || 0,
                    size: price.size,
                    price: price.price,
                    isActive: price.isActive !== undefined ? price.isActive : true
                  }))
                }
              : p
          )
        )
      }
      
      // Show success message
      setToast({ message: 'Product prices updated successfully!', type: 'success' })
      
      // Reload data to ensure everything is in sync (without showing loading spinner)
      await loadData(false)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string }; status?: number }; message?: string }
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update prices'
      setError(errorMessage)
      
      // Show error toast with appropriate message based on status
      if (error.response?.status === 401) {
        setToast({ message: 'Unauthorized. Please login again.', type: 'error' })
      } else if (error.response?.status === 403) {
        setToast({ message: 'You do not have permission to update products.', type: 'error' })
      } else if (error.response?.status && error.response.status >= 500) {
        setToast({ message: 'Server error. Please try again later.', type: 'error' })
      } else {
        setToast({ message: errorMessage, type: 'error' })
      }
    } finally {
      setIsUpdatingPrice(false)
    }
  }

  /**
   * Handle product deletion
   */
  const handleDelete = async (id: number) => {
    try {
      await apiService.deleteProduct(id)
      setDeleteConfirm(null)
      await loadData()
      setToast({ message: 'Product deleted successfully!', type: 'success' })
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string }
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete product'
      setError(errorMessage)
      setToast({ message: errorMessage, type: 'error' })
    }
  }

  // Customization Options handlers
  const [customizationFormData, setCustomizationFormData] = useState<CustomizationOptionFormData>({
    optionCode: '',
    nameEn: '',
    nameAr: '',
    price: 0,
    isActive: true,
    displayOrder: 0,
  })

  /**
   * Open edit modal for a customization option
   */
  const handleEditCustomization = (option: ApiCustomizationOption) => {
    setSelectedCustomization(option)
    setCustomizationFormData({
      optionCode: option.optionCode,
      nameEn: option.nameEn,
      nameAr: option.nameAr,
      price: option.price,
      isActive: option.isActive,
      displayOrder: option.displayOrder,
    })
    setShowCustomizationModal(true)
  }

  /**
   * Handle customization option creation
   */
  const handleAddCustomization = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiService.createCustomizationOption(customizationFormData)
      setShowCustomizationModal(false)
      resetCustomizationForm()
      await loadData()
      setToast({ message: 'Customization option added successfully!', type: 'success' })
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string }
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to create customization option'
      setError(errorMessage)
      setToast({ message: errorMessage, type: 'error' })
    }
  }

  /**
   * Handle customization option update
   */
  const handleUpdateCustomization = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCustomization) return
    try {
      await apiService.updateCustomizationOption(
        selectedCustomization.customizationOptionId,
        customizationFormData
      )
      setShowCustomizationModal(false)
      setSelectedCustomization(null)
      resetCustomizationForm()
      await loadData()
      setToast({ message: 'Customization option updated successfully!', type: 'success' })
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string }
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to update customization option'
      setError(errorMessage)
      setToast({ message: errorMessage, type: 'error' })
    }
  }

  /**
   * Handle customization option deletion
   */
  const handleDeleteCustomization = async (id: number) => {
    try {
      await apiService.deleteCustomizationOption(id)
      await loadData()
      setToast({ message: 'Customization option deleted successfully!', type: 'success' })
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string }
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to delete customization option'
      setError(errorMessage)
      setToast({ message: errorMessage, type: 'error' })
    }
  }

  /**
   * Reset customization form to initial state
   */
  const resetCustomizationForm = () => {
    setCustomizationFormData({
      optionCode: '',
      nameEn: '',
      nameAr: '',
      price: 0,
      isActive: true,
      displayOrder: 0,
    })
  }



  const resetForm = () => {
    setFormData({
      productCode: '',
      nameEn: '',
      nameAr: '',
      imageUrl: '',
      categoryId: 0,
      caffeineIndex: 0,
      isCustomizable: false,
      isActive: true,
      prices: [{ size: 'medium', price: 0 }],
      tags: ['Cold'],
      flavors: [],
      customizationOptionIds: [],
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-heading font-bold text-primary">Products Management</h2>
          <p className="text-coffee/70 mt-1">Manage your coffee shop products</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus size={20} />
          Add New Product
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={() => setError('')}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-coffee/40" />
          <input
            type="text"
            placeholder="Search by name (English or Arabic)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-coffee/40"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-coffee/40 hover:text-coffee/70"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Products Count */}
      {searchQuery && (
        <div className="text-sm text-coffee/70">
          {products.filter((product) => {
            const query = searchQuery.toLowerCase()
            return (
              product.nameEn.toLowerCase().includes(query) ||
              product.nameAr.toLowerCase().includes(query) ||
              product.productCode.toLowerCase().includes(query)
            )
          }).length}{' '}
          product(s) found
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Prices</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-primary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(() => {
                const filteredProducts = products.filter((product) => {
                  if (!searchQuery.trim()) return true
                  const query = searchQuery.toLowerCase()
                  return (
                    product.nameEn.toLowerCase().includes(query) ||
                    product.nameAr.toLowerCase().includes(query) ||
                    product.productCode.toLowerCase().includes(query)
                  )
                })

                if (filteredProducts.length === 0) {
                  return (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <p className="text-coffee/70">
                          {searchQuery
                            ? 'No products found matching your search.'
                            : 'No products available.'}
                        </p>
                      </td>
                    </tr>
                  )
                }

                return filteredProducts.map((product) => (
                <tr key={product.productId} className="hover:bg-cream/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-primary">{product.nameEn}</p>
                      <p className="text-sm text-coffee/70">{product.nameAr}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-coffee/70">{product.categoryName}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {product.prices.map((price) => (
                        <div key={price.productPriceId} className="text-sm">
                          <span className="font-medium">{price.size}:</span>{' '}
                          <span className="text-primary">{price.price.toLocaleString()} IQD</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditPrice(product)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Edit Price"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product.productId)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customization Options Section */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Beaker className="w-6 h-6 text-primary" />
            <div>
              <h3 className="text-2xl font-heading font-bold text-primary">Customization Options</h3>
              <p className="text-sm text-coffee/70">Manage product customization options (Extra Syrup, Almond Milk, etc.)</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Code</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Name (EN)</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Name (AR)</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Order</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-primary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customizationOptions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-coffee/70">
                    No customization options found. Add your first option!
                  </td>
                </tr>
              ) : (
                customizationOptions.map((option) => (
                  <tr key={option.customizationOptionId} className="hover:bg-cream/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-primary">{option.optionCode}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-primary">{option.nameEn}</td>
                    <td className="px-6 py-4 text-coffee/70">{option.nameAr}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-primary">{option.price.toLocaleString()} IQD</span>
                    </td>
                    <td className="px-6 py-4 text-coffee/70">{option.displayOrder}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          option.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {option.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditCustomization(option)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${option.nameEn}"?`)) {
                              handleDeleteCustomization(option.customizationOptionId)
                            }
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-2xl font-heading font-bold text-primary">Add New Product</h3>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  resetForm()
                }}
                className="text-coffee/70 hover:text-coffee"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Product Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.productCode}
                    onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                    className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Category *</label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value={0}>Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Name (Arabic) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Prices *</label>
                {formData.prices.map((price, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Size (e.g., medium)"
                      value={price.size}
                      onChange={(e) => {
                        const newPrices = [...formData.prices]
                        newPrices[index].size = e.target.value
                        setFormData({ ...formData, prices: newPrices })
                      }}
                      className="flex-1 px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      required
                      value={price.price}
                      onChange={(e) => {
                        const newPrices = [...formData.prices]
                        newPrices[index].price = Number(e.target.value)
                        setFormData({ ...formData, prices: newPrices })
                      }}
                      className="w-32 px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {formData.prices.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newPrices = formData.prices.filter((_, i) => i !== index)
                          setFormData({ ...formData, prices: newPrices })
                        }}
                        className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      prices: [...formData.prices, { size: '', price: 0 }],
                    })
                  }}
                  className="text-sm text-primary hover:text-primary/80"
                >
                  + Add Price
                </button>
              </div>
              {/* Customization Options Selection */}
              {formData.isCustomizable && (
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Available Customization Options
                  </label>
                  <div className="border border-primary/20 rounded-lg p-4 max-h-48 overflow-y-auto">
                    {customizationOptions.length === 0 ? (
                      <p className="text-sm text-coffee/70">No customization options available. Add them in the Customization Options section below.</p>
                    ) : (
                      <div className="space-y-2">
                        {customizationOptions
                          .filter(opt => opt.isActive)
                          .map((option) => (
                            <label
                              key={option.customizationOptionId}
                              className="flex items-center gap-3 p-2 hover:bg-cream/50 rounded-lg cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={formData.customizationOptionIds.includes(option.customizationOptionId)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData({
                                      ...formData,
                                      customizationOptionIds: [
                                        ...formData.customizationOptionIds,
                                        option.customizationOptionId,
                                      ],
                                    })
                                  } else {
                                    setFormData({
                                      ...formData,
                                      customizationOptionIds: formData.customizationOptionIds.filter(
                                        (id) => id !== option.customizationOptionId
                                      ),
                                    })
                                  }
                                }}
                                className="rounded"
                              />
                              <div className="flex-1">
                                <span className="text-sm font-semibold text-primary">{option.nameEn}</span>
                                <span className="text-xs text-coffee/70 ml-2">({option.nameAr})</span>
                              </div>
                              <span className="text-sm text-primary font-semibold">
                                +{option.price.toLocaleString()} IQD
                              </span>
                            </label>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isCustomizable}
                    onChange={(e) => setFormData({ ...formData, isCustomizable: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-primary">Customizable</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-primary">Active</span>
                </label>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Create Product
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                  className="px-6 py-3 border border-primary/20 text-primary rounded-lg hover:bg-primary/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Price Modal */}
      {showEditPriceModal && priceEditData && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-2xl font-heading font-bold text-primary">
                Edit Prices - {selectedProduct.nameEn}
              </h3>
              <button
                onClick={() => {
                  setShowEditPriceModal(false)
                  setPriceEditData(null)
                  setSelectedProduct(null)
                }}
                className="text-coffee/70 hover:text-coffee"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {priceEditData.prices.map((price, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-primary mb-1">
                      {price.size.charAt(0).toUpperCase() + price.size.slice(1)}
                    </label>
                    <input
                      type="number"
                      value={price.price}
                      onChange={(e) => {
                        const newPrices = [...priceEditData.prices]
                        newPrices[index].price = Number(e.target.value)
                        setPriceEditData({ ...priceEditData, prices: newPrices })
                      }}
                      className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              ))}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleUpdatePrice}
                  disabled={isUpdatingPrice}
                  className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingPrice ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowEditPriceModal(false)
                    setPriceEditData(null)
                    setSelectedProduct(null)
                  }}
                  disabled={isUpdatingPrice}
                  className="px-6 py-3 border border-primary/20 text-primary rounded-lg hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-heading font-bold text-primary mb-4">
              Confirm Delete
            </h3>
            <p className="text-coffee/70 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-6 py-3 border border-primary/20 text-primary rounded-lg hover:bg-primary/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customization Option Modal (Full Edit) */}
      {showCustomizationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-2xl font-heading font-bold text-primary">
                {selectedCustomization ? 'Edit Customization Option' : 'Add Customization Option'}
              </h3>
              <button
                onClick={() => {
                  setShowCustomizationModal(false)
                  setSelectedCustomization(null)
                  setCustomizationFormData({
                    optionCode: '',
                    nameEn: '',
                    nameAr: '',
                    price: 0,
                    isActive: true,
                    displayOrder: 0,
                  })
                }}
                className="text-coffee/70 hover:text-coffee"
              >
                <X size={24} />
              </button>
            </div>
            <form
              onSubmit={selectedCustomization ? handleUpdateCustomization : handleAddCustomization}
              className="p-6 space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Option Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={customizationFormData.optionCode}
                    onChange={(e) =>
                      setCustomizationFormData({ ...customizationFormData, optionCode: e.target.value })
                    }
                    placeholder="e.g., extra_syrup"
                    disabled={!!selectedCustomization}
                    className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Display Order</label>
                  <input
                    type="number"
                    value={customizationFormData.displayOrder}
                    onChange={(e) =>
                      setCustomizationFormData({
                        ...customizationFormData,
                        displayOrder: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={customizationFormData.nameEn}
                    onChange={(e) =>
                      setCustomizationFormData({ ...customizationFormData, nameEn: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Name (Arabic) *
                  </label>
                  <input
                    type="text"
                    required
                    value={customizationFormData.nameAr}
                    onChange={(e) =>
                      setCustomizationFormData({ ...customizationFormData, nameAr: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Price (IQD) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={customizationFormData.price}
                  onChange={(e) =>
                    setCustomizationFormData({
                      ...customizationFormData,
                      price: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={customizationFormData.isActive}
                    onChange={(e) =>
                      setCustomizationFormData({
                        ...customizationFormData,
                        isActive: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm text-primary">Active</span>
                </label>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  {selectedCustomization ? 'Update Option' : 'Create Option'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomizationModal(false)
                    setSelectedCustomization(null)
                    setCustomizationFormData({
                      optionCode: '',
                      nameEn: '',
                      nameAr: '',
                      price: 0,
                      isActive: true,
                      displayOrder: 0,
                    })
                  }}
                  className="px-6 py-3 border border-primary/20 text-primary rounded-lg hover:bg-primary/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <AdminToast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

