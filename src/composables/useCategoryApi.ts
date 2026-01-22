/**
 * Category API Composable
 * Handles all category-related API calls
 */

import { ref } from 'vue'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export interface Category {
  _id: string
  name: string
  description?: string
  image?: string
  parent?: string | null
  isActive?: boolean
  order?: number
  slug?: string
  createdAt?: string
  updatedAt?: string
  __v?: number
}

export const useCategoryApi = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const categories = ref<Category[]>([])
  let fetchPromise: Promise<unknown> | null = null

  /**
   * Fetch all categories
   */
  const fetchCategories = async (force = false) => {
    // Return existing promise if already fetching
    if (fetchPromise && !force) {
      return fetchPromise
    }

    loading.value = true
    error.value = null

    fetchPromise = axios.get(`${API_URL}/categories`)
      .then(response => {
        // Handle both direct array and wrapped response
        const data = response.data.data || response.data
        categories.value = Array.isArray(data) ? data : [data]
        console.log('Categories loaded:', categories.value.length, 'items', categories.value)
        return categories.value
      })
      .catch((err: unknown) => {
        if (axios.isAxiosError(err)) {
          error.value = err.response?.data?.message || 'Failed to fetch categories'
          console.error('API Error:', err.response?.data)
        } else {
          error.value = 'Failed to fetch categories'
          console.error('Error:', err)
        }
        throw err
      })
      .finally(() => {
        loading.value = false
        fetchPromise = null
      })

    return fetchPromise
  }

  /**
   * Get single category by ID
   */
  const getCategoryById = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`${API_URL}/categories/${id}`)
      return response.data
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data?.message || 'Failed to fetch category'
      } else {
        error.value = 'Failed to fetch category'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Create new category
   */
  const createCategory = async (formData: FormData) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.post(`${API_URL}/categories`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      await fetchCategories() // Refresh the list
      return response.data
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data?.message || 'Failed to create category'
      } else {
        error.value = 'Failed to create category'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update category
   */
  const updateCategory = async (id: string, formData: FormData) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.put(`${API_URL}/categories/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      await fetchCategories() // Refresh the list
      return response.data
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data?.message || 'Failed to update category'
      } else {
        error.value = 'Failed to update category'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete category
   */
  const deleteCategory = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.delete(`${API_URL}/categories/${id}`)
      await fetchCategories() // Refresh the list
      return response.data
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data?.message || 'Failed to delete category'
      } else {
        error.value = 'Failed to delete category'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    categories,
    fetchCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}
