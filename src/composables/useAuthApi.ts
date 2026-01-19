/**
 * Authentication API Composable
 * Handles all authentication-related API calls
 */

import { ref } from 'vue'
import { apiGet, apiPost, apiPut, type ApiResponse } from '@/services/api'

export interface User {
  id: string
  name: string
  email: string
  role: 'customer' | 'admin'
  phone?: string
  avatar?: string
  lastLogin?: string
  createdAt?: string
}

interface SignupData {
  name: string
  email: string
  password: string
  phone?: string
  role?: 'customer' | 'admin'
}

interface LoginData {
  email: string
  password: string
}

interface AuthResponse {
  user: User
  session?: {
    userId: string
    userRole: string
    userEmail: string
    userName: string
  }
}

export function useAuthApi() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Sign up (Register) a new user
   */
  const signup = async (data: SignupData) => {
    loading.value = true
    error.value = null

    try {
      const response = await apiPost<{ data: AuthResponse }>('/auth/signup', data)
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to sign up'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Login user
   */
  const login = async (data: LoginData) => {
    loading.value = true
    error.value = null

    try {
      const response = await apiPost<{ data: AuthResponse }>('/auth/login', data)
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to login'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Logout user
   */
  const logout = async () => {
    loading.value = true
    error.value = null

    try {
      await apiPost('/auth/logout')
    } catch (err: any) {
      error.value = err.message || 'Failed to logout'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Get current authenticated user
   */
  const getCurrentUser = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await apiGet<{ data: AuthResponse }>('/auth/me')
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to get user'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update user profile
   */
  const updateProfile = async (data: { name?: string; phone?: string; avatar?: string }) => {
    loading.value = true
    error.value = null

    try {
      const response = await apiPut<{ data: { user: User } }>('/auth/profile', data)
      return response.data.user
    } catch (err: any) {
      error.value = err.message || 'Failed to update profile'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Change password
   */
  const changePassword = async (currentPassword: string, newPassword: string) => {
    loading.value = true
    error.value = null

    try {
      await apiPut('/auth/change-password', {
        currentPassword,
        newPassword,
      })
    } catch (err: any) {
      error.value = err.message || 'Failed to change password'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    signup,
    login,
    logout,
    getCurrentUser,
    updateProfile,
    changePassword,
  }
}
