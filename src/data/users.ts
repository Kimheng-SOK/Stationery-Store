import type { User } from '@/types/user'

export const users: User[] = [
  // Admin Accounts
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@stationerybox.com',
    password: 'admin123',
    role: 'admin',
    createdAt: '2025-01-01'
  },
  {
    id: '2',
    name: 'Super Admin',
    email: 'heng@gmail.com',
    password: '123',
    role: 'admin',
    createdAt: '2025-01-01'
  },

  // Regular User Accounts
  {
    id: '3',
    name: 'John Doe',
    email: 'heng1@gmail.com',
    password: '1234',
    role: 'user',
    createdAt: '2025-01-05'
  },
  {
    id: '4',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: 'user123',
    role: 'user',
    createdAt: '2025-01-06'
  },
  {
    id: '5',
    name: 'Mike Wilson',
    email: 'mike.wilson@example.com',
    password: 'user123',
    role: 'user',
    createdAt: '2025-01-08'
  },
  {
    id: '6',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    password: 'user123',
    role: 'user',
    createdAt: '2025-01-10'
  }
]

// Helper function to find user by email
export const findUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email.toLowerCase() === email.toLowerCase())
}

// Helper function to authenticate user
export const authenticateUser = (email: string, password: string): User | null => {
  const user = findUserByEmail(email)
  if (user && user.password === password) {
    return user
  }
  return null
}
