import type { CustomersResponse, Customer } from '@/types/customer'
import axios from 'axios'

// Configure axios
axios.defaults.withCredentials = true
const API_URL = 'http://localhost:5000'

export const customerDataService = {
  getCustomers: async (page: number = 1, pageSize: number = 20): Promise<CustomersResponse> => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/customers`, {
        params: { page, pageSize },
        withCredentials: true
      })

      return {
        data: response.data.data,
        total: response.data.total,
        page: response.data.page || page,
        pageSize: pageSize,
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
      throw error
    }
  },

  searchCustomers: async (query: string): Promise<Customer[]> => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/customers`, {
        params: { search: query },
        withCredentials: true
      })
      return response.data.data
    } catch (error) {
      console.error('Error searching customers:', error)
      throw error
    }
  },

  getCustomerById: async (id: string): Promise<Customer | null> => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/customers/${id}`, {
        withCredentials: true
      })
      return response.data.data
    } catch (error) {
      console.error('Error fetching customer:', error)
      return null
    }
  },
}
