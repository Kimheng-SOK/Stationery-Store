export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'customer'
  phone?: string
  avatar?: string
  lastLogin?: string
  createdAt?: string
  password?: string // For login/register (not returned from API)
  dateOfBirth?: string
  address?: string
}

export interface AuthResponse {
  success: boolean
  message?: string
  data: {
    user: User
    token?: string
  }
}
