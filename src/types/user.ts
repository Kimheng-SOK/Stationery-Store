export interface User {
  id: number
  username: string
  email: string
  password: string
  role: 'admin' | 'user'
  fullName: string
  createdAt: string
}
