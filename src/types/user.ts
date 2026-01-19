export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'customer'
  phone?: string
  avatar?: string
  lastLogin?: string
  createdAt?: string
}
