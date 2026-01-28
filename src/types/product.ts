export type BadgeType = 'new' | 'hot' | 'popular' | 'instock' | 'discount'
export type ProductStatus = 'active' | 'inactive' | 'draft'

// Backend Product Model (from API)
export interface Product {
  _id?: string
  id?: string // Alias for _id for backward compatibility
  name: string
  sku?: string
  price: number
  originalPrice?: number
  discount?: number
  reviewCount?: number
  isNew?: boolean
  inStock?: boolean
  brand?: string
  category: string | { _id: string; name: string; slug?: string; parent?: any } // Can be string (old) or populated object
  addedDate?: string
  createdAt?: string
  updatedAt?: string
  stock?: number
  rating?: number
  image?: string
  images?: string[]
  imageUrl?: string // Alternative image field
  description?: string
  status?: ProductStatus
  badges?: BadgeType[]
  displayPrice?: number // Computed display price
}

// Product query parameters for filtering
export interface ProductQueryParams {
  page?: number
  limit?: number
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  sort?: string
  status?: ProductStatus
}

// Product filter interface
export interface ProductFilters {
  page?: number
  limit?: number
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  sort?: string
  status?: string
}
