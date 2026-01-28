export interface Category {
  _id: string
  name: string
  slug: string
  image: string | null
  isActive: boolean
  parent?: string | null
  order: number
  description?: string
  createdAt?: string
}

// Export Category as both named and default export for compatibility
export type { Category as default }
