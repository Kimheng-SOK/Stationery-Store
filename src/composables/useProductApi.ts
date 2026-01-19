/**
 * Product API Composable
 * Handles all product-related API calls
 */

import { ref } from 'vue'
import { apiGet, apiPost, apiPut, apiDelete, type ApiResponse } from '@/services/api'
import type { Product } from '@/types/product'

interface ProductFilters {
  page?: number
  limit?: number
  search?: string
  category?: string
  status?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

interface ProductResponse {
  data: Product[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export function useProductApi() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Get all products with filters
   */
  const getProducts = async (filters: ProductFilters = {}) => {
    loading.value = true
    error.value = null

    try {
      const response = await apiGet<ProductResponse>('/products', filters)
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch products'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Get single product by ID
   */
  const getProduct = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await apiGet<{ data: Product }>(`/products/${id}`)
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch product'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Create new product
   */
  const createProduct = async (productData: FormData) => {
    loading.value = true
    error.value = null

    try {
      const response = await apiPost<{ data: Product }>('/products', productData, true)
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to create product'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update product
   */
  const updateProduct = async (id: string, productData: FormData) => {
    loading.value = true
    error.value = null

    try {
      const response = await apiPut<{ data: Product }>(`/products/${id}`, productData, true)
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to update product'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete product
   */
  const deleteProduct = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await apiDelete(`/products/${id}`)
    } catch (err: any) {
      error.value = err.message || 'Failed to delete product'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}
