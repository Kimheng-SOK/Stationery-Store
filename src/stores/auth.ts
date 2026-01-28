import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, AuthResponse } from '@/types/user'
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
      const response = await authApi.getCurrentUser() as AuthResponse
      if (response?.data?.user) {
        user.value = {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role === 'admin' ? 'admin' : 'user',
          phone: response.data.user.phone,
          avatar: response.data.user.avatar,
          dateOfBirth: response.data.user.dateOfBirth,
          address: response.data.user.address,
          createdAt: response.data.user.createdAt || new Date().toISOString()
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
      const response = await authApi.getCurrentUser() as AuthResponse
      if (response?.data?.user) {
        user.value = {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role === 'admin' ? 'admin' : 'user',
          phone: response.data.user.phone,
          avatar: response.data.user.avatar,
          dateOfBirth: response.data.user.dateOfBirth,
          address: response.data.user.address,
          createdAt: response.data.user.createdAt || new Date().toISOString()
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
