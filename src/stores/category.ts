import { defineStore } from 'pinia'
import { apiGet } from '@/services/api'
import type { Category } from '@/types/category'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [] as Category[],
    loading: false,
    error: null as string | null,
    isFetched: false,
  }),

  getters: {
    getCategories: (state) => state.categories,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    hasCategories: (state) => state.categories.length > 0,
  },

  actions: {
    async fetchCategories(force = false) {
      // Prevent duplicate fetches unless forced
      if (this.isFetched && !force) return

      this.loading = true
      this.error = null

      try {
        console.log('Fetching categories...')
        const response = await apiGet<Category[]>('/categories')

        console.log('Categories API Response:', response)

        // Handle different response structures
        this.categories = response.data
          ? Array.isArray(response.data)
            ? response.data
            : (response.data as any).data || []
          : []

        this.isFetched = true
        console.log('Categories loaded:', this.categories.length, this.categories)
      } catch (err: any) {
        this.error = err.message || 'Failed to load categories'
        console.error('Error fetching categories:', err)
      } finally {
        this.loading = false
      }
    },

    clearCategories() {
      this.categories = []
      this.isFetched = false
      this.error = null
    },
  },
})
