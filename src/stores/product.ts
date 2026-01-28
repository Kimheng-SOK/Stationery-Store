import { defineStore } from 'pinia'
import { apiGet } from '@/services/api'
import type { Product, ProductQueryParams } from '@/types/product'
import { API_SERVER_URL } from '@/config/api'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[],
    currentProduct: null as Product | null,
    loading: false,
    error: null as string | null,
    isFetched: false,
    totalProducts: 0,
    currentPage: 1,
    totalPages: 1,
  }),

  getters: {
    getProducts: (state) => state.products,
    isLoading: (state) => state.loading,

    // Unique brands for the sidebar
    getBrands: (state) => {
      const brands = state.products
        .map(p => p.brand)
        .filter((brand): brand is string => Boolean(brand))
      return [...new Set(brands)].sort()
    },

    /**
     * Getter: Filters products based on UI selection
     */
    getFilteredProducts: (state) => (filters: {
      categoryId?: string,
      brand?: string,
      rating?: number,
      priceRange?: { min: number, max: number },
      sortBy?: string,
      searchTerm?: string
    }) => {
      let result = state.products.filter(p => p.status === 'active')

      if (filters.categoryId) {
        result = result.filter(p => {
          let pCatId
          if (typeof p.category === 'object' && p.category !== null) {
            // Handle both { _id: ... } and { $oid: ... }
            pCatId = p.category._id || (p.category as any).$oid
          } else {
            pCatId = p.category
          }
          return String(pCatId) === String(filters.categoryId)
        })
      }

      if (filters.brand) {
        result = result.filter(p => p.brand === filters.brand)
      }

      if (filters.priceRange) {
        result = result.filter(p => {
          const price = Number(p.price || p.originalPrice)
          return price >= filters.priceRange!.min && price <= filters.priceRange!.max
        })
      }

      if (filters.rating && filters.rating > 0) {
        result = result.filter(p => Math.floor(Number(p.rating)) === Number(filters.rating))
      }

      if (filters.searchTerm && filters.searchTerm.trim()) {
        const q = filters.searchTerm.trim().toLowerCase()
        result = result.filter(p => {
          const name = String(p.name || '').toLowerCase()
          const brand = String(p.brand || '').toLowerCase()
          const catName = (typeof p.category === 'object' && p.category ? String(p.category.name || '') : '').toLowerCase()
          const sku = String((p as any).sku || '').toLowerCase()
          return name.includes(q) || brand.includes(q) || catName.includes(q) || sku.includes(q)
        })
      }

      const sorted = [...result]
      switch (filters.sortBy) {
        case 'price-asc': sorted.sort((a, b) => Number(a.price || a.originalPrice) - Number(b.price || b.originalPrice)); break
        case 'price-desc': sorted.sort((a, b) => Number(b.price || b.originalPrice) - Number(a.price || a.originalPrice)); break
        case 'rating': sorted.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0)); break
        case 'newest': sorted.sort((a, b) => Number(new Date(b.createdAt as any)) - Number(new Date(a.createdAt as any))); break
      }
      return sorted
    },

    /**
     * Getter: Formats a single product for the UI
     * Fixes: Images, reviewCount, and Price logic
     */
    formatProduct: () => (product: Product) => {
      const BASE_URL = API_SERVER_URL

      // Image Construction
      let imageUrl = '/placeholder.jpg'
      const filename = product.images && product.images.length > 0 ? product.images[0] : null

      if (filename) {
        if (filename.startsWith('http')) {
          imageUrl = filename
        } else {
          const cleanFilename = filename.startsWith('/') ? filename : `/${filename}`
          // Uses the /uploads/products subfolder from your backend
          imageUrl = `${BASE_URL}/uploads/products${cleanFilename}`
        }
      }

      // Price logic: If price is 0 or null, use originalPrice
      const hasValidPrice = product.price !== undefined && product.price !== null && product.price !== 0

      return {
        ...product, // Spreading ensures reviewCount is preserved
        id: product._id,
        image: imageUrl,
        displayPrice: hasValidPrice ? product.price : product.originalPrice,
        showStrikePrice: hasValidPrice && (product.originalPrice || 0) > 0,
        categoryName: typeof product.category === 'object' && product.category !== null ? product.category.name : product.category
      }
    }
  },

  actions: {
    async fetchProducts(params: ProductQueryParams = {}, force = false) {
      if (this.isFetched && !force && Object.keys(params).length === 0) return

      this.loading = true
      this.error = null

      try {
        const queryParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== '' && value !== null) queryParams.append(key, value.toString())
        })

        const endpoint = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
        const response = await apiGet<Product[]>(endpoint)

        if (response.data) {
          this.products = Array.isArray(response.data) ? response.data : (response.data as any).data || []
          this.totalProducts = response.total || (response as any).pagination?.total || this.products.length
          this.totalPages = response.pages || (response as any).pagination?.totalPages || 1
        }
        this.isFetched = true
      } catch (err: any) {
        this.error = err.message || 'Failed to load products'
        this.products = []
      } finally {
        this.loading = false
      }
    }
  }
})
