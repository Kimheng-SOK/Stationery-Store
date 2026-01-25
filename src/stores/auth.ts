import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types/user'
import { useAuthApi } from '@/composables/useAuthApi'

export const useAuthStore = defineStore('auth', () => {
  const authApi = useAuthApi()
  const user = ref<User | null>(null)
  const isInitialized = ref(false)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isUser = computed(() => user.value?.role === 'customer')

  async function login(userData: User) {
    user.value = userData
    // Session is managed by cookies, no need to store token
  }

  async function logout() {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      user.value = null
    }
  }

  async function initializeAuth() {
    if (isInitialized.value) return

    try {
      const response = await authApi.getCurrentUser()
      if (response?.user) {
        user.value = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role === 'admin' ? 'admin' : 'user',
          phone: response.user.phone,
          avatar: response.user.avatar,
          dateOfBirth: response.user.dateOfBirth,
          address: response.user.address,
          createdAt: response.user.createdAt || new Date().toISOString()
        }
      }
    } catch (error) {
      // Not authenticated, clear user
      user.value = null
    } finally {
      isInitialized.value = true
    }
  }

  async function refreshUser() {
    try {
      const response = await authApi.getCurrentUser()
      if (response?.user) {
        user.value = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role === 'admin' ? 'admin' : 'user',
          phone: response.user.phone,
          avatar: response.user.avatar,
          dateOfBirth: response.user.dateOfBirth,
          address: response.user.address,
          createdAt: response.user.createdAt || new Date().toISOString()
        }
      }
    } catch (error) {
      user.value = null
    }
  }

  // ADD THIS NEW METHOD
  function updateUser(updates: Partial<User>) {
    if (user.value) {
      user.value = {
        ...user.value,
        ...updates
      }
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    isUser,
    isInitialized,
    login,
    logout,
    initializeAuth,
    refreshUser,
    updateUser 
  }
})