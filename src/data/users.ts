import type { User } from '@/types/user'

export const users: User[] = [
  // Admin Accounts
  {
    id: 1,
    username: 'admin',
    email: 'admin@stationerybox.com',
    password: 'admin123',
    role: 'admin',
    fullName: 'Admin User',
    createdAt: '2025-01-01'
  },
  {
    id: 2,
    username: 'superadmin',
    email: 'heng@gmail.com',
    password: '123',
    role: 'admin',
    fullName: 'Super Admin',
    createdAt: '2025-01-01'
  },

  // Regular User Accounts
  {
    id: 3,
    username: 'john_doe',
    email: 'heng1@gmail.com',
    password: '1234',
    role: 'user',
    fullName: 'John Doe',
    createdAt: '2025-01-05'
  },
  {
    id: 4,
    username: 'jane_smith',
    email: 'jane.smith@example.com',
    password: 'user123',
    role: 'user',
    fullName: 'Jane Smith',
    createdAt: '2025-01-06'
  },
  {
    id: 5,
    username: 'mike_wilson',
    email: 'mike.wilson@example.com',
    password: 'user123',
    role: 'user',
    fullName: 'Mike Wilson',
    createdAt: '2025-01-08'
  },
  {
    id: 6,
    username: 'sarah_johnson',
    email: 'sarah.johnson@example.com',
    password: 'user123',
    role: 'user',
    fullName: 'Sarah Johnson',
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
