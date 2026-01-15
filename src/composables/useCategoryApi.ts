/**
 * Category API Composable
 * Handles all category-related API calls
 */

import { ref } from 'vue'
import { apiGet, apiPost, apiPut, apiDelete, type ApiResponse } from '@/services/api'

export interface Category {
  _id: string
  name: string
  slug?: string
  description?: string
  image?: string
  parent?: Category | string | null
  children?: Category[]
  isActive?: boolean
  order?: number
  productCount?: number
  createdAt?: string
  updatedAt?: string
}

interface CategoryFilters {
  parent?: string
  isActive?: boolean
  nested?: boolean
  includeProducts?: boolean
}

interface CategoryResponse {
  data: Category[]
  count?: number
}

export function useCategoryApi() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Get all categories with optional filters
   */
  const getCategories = async (filters: CategoryFilters = {}) => {
    loading.value = true
    error.value = null

    try {
      const queryParams: Record<string, string> = {}
      if (filters.parent !== undefined) queryParams.parent = filters.parent
      if (filters.isActive !== undefined) queryParams.isActive = String(filters.isActive)
      if (filters.nested !== undefined) queryParams.nested = String(filters.nested)
      if (filters.includeProducts !== undefined) queryParams.includeProducts = String(filters.includeProducts)

      const response = await apiGet<CategoryResponse>('/categories', queryParams)
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch categories'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Get single category by ID
   */
  const getCategory = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await apiGet<{ data: Category }>(`/categories/${id}`)
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch category'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Create new category
   */
  const createCategory = async (categoryData: Partial<Category>) => {
    loading.value = true
    error.value = null

    try {
      const response = await apiPost<{ data: Category }>('/categories', categoryData)
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to create category'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update category
   */
  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    loading.value = true
    error.value = null

    try {
      const response = await apiPut<{ data: Category }>(`/categories/${id}`, categoryData)
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to update category'
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
      await apiDelete(`/categories/${id}`)
    } catch (err: any) {
      error.value = err.message || 'Failed to delete category'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}
