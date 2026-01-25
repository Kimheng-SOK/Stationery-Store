export interface Customer {
  _id?: string
  id?: string
  name: string
  email: string
  phone?: string
  avatar?: string
  memberSince: string
  purchasedItems?: number
  rewardPoints?: number
  stats?: {
    totalOrders: number
    totalRevenue: number
    completedOrders: number
    isActive: boolean
    rewardPoints?: number
  }
}

export interface CustomersResponse {
  data: Customer[]
  total: number
  page: number
  pageSize: number
}
