import { defineStore } from 'pinia'
import { apiGet } from '@/services/api'
import type { Product } from '@/types/product'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[],
    loading: false,
    error: null as string | null,
    isFetched: false,
  }),

  getters: {
    getAllProducts: (state) => state.products,

    getProductsByCategory: (state) => {
      return (categorySlug: string) =>
        state.products.filter(p => p.categorySlug === categorySlug)
    },

    getPopularProducts: (state) => {
      return state.products.filter(p => (p.countSold ?? 0) > 10)
    },

    getBrands: (state) => {
      return [...new Set(state.products.map(p => p.brand).filter(Boolean))]
    },
  },

  actions: {
    async fetchProducts(force = false) {
      if (this.isFetched && !force) return

      this.loading = true
      this.error = null

      try {
        const response = await apiGet('/products')
        this.products = response.data ? (Array.isArray(response.data) ? response.data : response.data.data || response.data) : []
        this.isFetched = true
        console.log('Products loaded:', this.products.length, this.products)
      } catch (err: any) {
        this.error = err.message || 'Failed to load products'
        console.error('Error fetching products:', err)
      } finally {
        this.loading = false
      }
    },

    clearProducts() {
      this.products = []
      this.isFetched = false
    },
  },
})
