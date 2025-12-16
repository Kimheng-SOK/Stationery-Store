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
}

export interface Category {
  id: number
  name: string
}
