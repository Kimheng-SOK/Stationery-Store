import type { CustomersResponse, Customer } from '@/types/customer'
import { customers } from '@/data/customers'

export const customerDataService = {
  getCustomers: async (page: number = 1, pageSize: number = 20): Promise<CustomersResponse> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedData = customers.slice(start, end)

    return {
      data: paginatedData,
      total: customers.length,
      page,
      pageSize,
    }
  },

  searchCustomers: async (query: string): Promise<Customer[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    const lowerQuery = query.toLowerCase()
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(lowerQuery) ||
        customer.email.toLowerCase().includes(lowerQuery) ||
        customer.phone.includes(query),
    )
  },

  getCustomerById: async (id: string): Promise<Customer | null> => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return customers.find((customer) => customer.id === id) || null
  },
}
