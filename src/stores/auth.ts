import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types/user'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(null)
  const userRole = ref<'admin' | 'user' | null>(localStorage.getItem('userRole') as 'admin' | 'user' | null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => userRole.value === 'admin')
  const isUser = computed(() => userRole.value === 'user')

  function login(authToken: string, userData: User, role: 'admin' | 'user') {
    token.value = authToken
    user.value = userData
    userRole.value = role
    localStorage.setItem('token', authToken)
    localStorage.setItem('userRole', role)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function logout() {
    token.value = null
    user.value = null
    userRole.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('user')
  }

  function initializeAuth() {
    const storedToken = localStorage.getItem('token')
    const storedRole = localStorage.getItem('userRole') as 'admin' | 'user' | null
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedRole && storedUser) {
      token.value = storedToken
      userRole.value = storedRole
      user.value = JSON.parse(storedUser)
    }
  }

  return {
    token,
    user,
    userRole,
    isAuthenticated,
    isAdmin,
    isUser,
    login,
    logout,
    initializeAuth
  }
})
