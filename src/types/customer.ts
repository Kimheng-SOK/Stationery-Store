export interface Customer {
  id: string
  name: string
  phone: string
  email: string
  memberSince: string
  purchasedItems: number
  rewardPoints: number
  avatar: string
}

export interface CustomersResponse {
  data: Customer[]
  total: number
  page: number
  pageSize: number
}
