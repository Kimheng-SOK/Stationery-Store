export type BadgeType = 'new' | 'hot' | 'popular' | 'instock' | 'discount'
export type ProductStatus = 'active' | 'inactive' | 'draft'

// Backend Product Model (from API)
export interface Product {
  _id?: string
  name: string
  sku: string
  price: number
  originalPrice?: number
  discount?: number
  reviewCount?: number
  isNew: boolean
  inStock: boolean
  brand?: string
  category: string | { _id: string; name: string; slug?: string; parent?: any } // Can be string (old) or populated object
  addedDate?: string
  createdAt?: string
  updatedAt?: string
  stock: number
  rating: number
  image?: string
  images?: string[]
  description?: string
  status?: ProductStatus
  badges?: BadgeType[]
}
