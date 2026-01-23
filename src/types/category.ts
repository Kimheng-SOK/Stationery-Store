export interface Category {
  _id: string
  name: string
  slug: string
  image: string | null
  isActive: boolean
  parent?: string | null
  order: number
}
