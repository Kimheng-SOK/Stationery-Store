/**
 * Centralized API configuration
 * Uses environment variable VITE_API_URL for production deployment
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
export const API_SERVER_URL = API_BASE_URL.replace('/api', '')

/**
 * Helper function to get full URL for uploaded files
 * @param path - Relative path to the uploaded file
 * @returns Full URL to access the file
 */
export const getUploadUrl = (path: string): string => {
  if (!path) return '/placeholder-image.jpg'
  if (path.startsWith('http')) return path
  return `${API_SERVER_URL}/uploads/${path}`
}
