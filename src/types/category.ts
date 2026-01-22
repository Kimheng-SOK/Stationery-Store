// Category interface (matches backend)
export interface Category {
  _id: string
  name: string
  slug?: string
  description?: string
  image: string
  parent: Category | string | null
  children: Category[]
  isActive: boolean
  order: number
  createdAt?: string
  updatedAt?: string
  __v?: number
}
