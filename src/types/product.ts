export type BadgeType = 'new' | 'hot' | 'popular' | 'instock' | 'discount'

export interface Product {
  id: number
  name: string
  sku: string
  price: number
  originalPrice?: number
  discount?: number
  reviewCount?: number
  isNew: boolean
  inStock: boolean
  brand?: string
  category: string
  addedDate: string
  stock: number
  rating: number
  image: string
  description?: string
  badges?: BadgeType[]
}

export interface Category {
  id: number
  name: string
}
