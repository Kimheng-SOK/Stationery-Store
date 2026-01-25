import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export interface CustomerStats {
  totalOrders: number
  totalRevenue: number
  completedOrders: number
  pendingOrders?: number
  isActive: boolean
  averageOrderValue?: number
  rewardPoints: number
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  memberSince: string
  stats: CustomerStats
  // Legacy fields for compatibility
  purchasedItems: number
  rewardPoints: number
}

export const customerDataService = {
  async getCustomers(page: number = 1, pageSize: number = 10) {
    try {
      const response = await axios.get(`${API_URL}/users/stats`)
      const customers = response.data.data.map((user: any) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        memberSince: new Date(user.memberSince).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        stats: user.stats,
        // Legacy fields
        purchasedItems: user.stats.totalOrders,
        rewardPoints: user.stats.rewardPoints
      }))

      const start = (page - 1) * pageSize
      const end = start + pageSize
      const paginatedCustomers = customers.slice(start, end)

      return {
        data: paginatedCustomers,
        total: customers.length,
        page,
        pageSize
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error)
      throw error
    }
  },

  async searchCustomers(query: string) {
    try {
      const response = await axios.get(`${API_URL}/users/stats`)
      const customers = response.data.data.map((user: any) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        memberSince: new Date(user.memberSince).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        stats: user.stats,
        purchasedItems: user.stats.totalOrders,
        rewardPoints: user.stats.rewardPoints
      }))

      const lowerQuery = query.toLowerCase()
      return customers.filter((c: Customer) =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.email.toLowerCase().includes(lowerQuery) ||
        c.phone.includes(query)
      )
    } catch (error) {
      console.error('Failed to search customers:', error)
      throw error
    }
  },

  async getCustomerStats(customerId: string) {
    try {
      const response = await axios.get(`${API_URL}/users/${customerId}/stats`)
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch customer stats:', error)
      throw error
    }
  }
}
