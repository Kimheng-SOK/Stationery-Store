import { ref } from 'vue'
import axios from 'axios'
import { API_BASE_URL } from '@/config/api'

const API_URL = API_BASE_URL

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

export function useProductApi() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const axiosInstance = axios.create({ baseURL: API_URL })
  let currentController: AbortController | null = null

  // Get all products with filters (cancels previous in-flight request)
  const getProducts = async (filters: ProductFilters = {}) => {
    // cancel previous
    if (currentController) {
      try { currentController.abort() } catch { /* ignore */ }
      currentController = null
    }

    currentController = new AbortController()
    loading.value = true
    error.value = null
    try {
      const res = await axiosInstance.get('/products', {
        params: filters,
        signal: currentController.signal,
      })
      return res.data
    } catch (err: any) {
      // mark canceled requests with axios code
      const isCanceled = err?.code === 'ERR_CANCELED' || err?.name === 'CanceledError' || err?.name === 'AbortError'
      const message = isCanceled ? 'Request canceled' : err?.response?.data?.message || err?.message || 'Failed to fetch products'
      if (!isCanceled) error.value = message
      throw err
    } finally {
      loading.value = false
      currentController = null
    }
  }

  // Get single product by ID
  const getProduct = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const res = await axiosInstance.get(`/products/${id}`)
      return res.data // expected shape: { success: true, data: { ...product } } or similar
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || 'Failed to fetch product'
      error.value = message
      throw new Error(message)
    } finally {
      loading.value = false
    }
  }

  // Create new product (multipart)
  const createProduct = async (productData: FormData) => {
    loading.value = true
    error.value = null
    try {
      const res = await axiosInstance.post('/products', productData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || 'Failed to create product'
      error.value = message
      throw new Error(message)
    } finally {
      loading.value = false
    }
  }

  // Update product (multipart)
  const updateProduct = async (id: string, productData: FormData) => {
    loading.value = true
    error.value = null
    try {
      const res = await axiosInstance.put(`/products/${id}`, productData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || 'Failed to update product'
      error.value = message
      throw new Error(message)
    } finally {
      loading.value = false
    }
  }

  // Delete product
  const deleteProduct = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const res = await axiosInstance.delete(`/products/${id}`)
      return res.data
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || 'Failed to delete product'
      error.value = message
      throw new Error(message)
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
