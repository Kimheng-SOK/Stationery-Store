/**
 * Category API Composable
 * Handles all category-related API calls
 */

import { ref } from 'vue'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export interface Category {
  id: number
  name: string
  description?: string
  image?: string
  createdAt?: string
  updatedAt?: string
}

export const useCategoryApi = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const categories = ref<Category[]>([])

  /**
   * Fetch all categories
   */
  const fetchCategories = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`${API_URL}/categories`)
      categories.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch categories'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Get single category by ID
   */
  const getCategoryById = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`${API_URL}/categories/${id}`)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch category'
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
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create category'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update category
   */
  const updateCategory = async (id: number, formData: FormData) => {
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
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update category'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete category
   */
  const deleteCategory = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.delete(`${API_URL}/categories/${id}`)
      await fetchCategories() // Refresh the list
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete category'
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
