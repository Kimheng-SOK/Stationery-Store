/**
 * API Service Utility
 * Handles all HTTP requests to the backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Make an API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { requiresAuth = false, ...fetchOptions } = options

  const url = `${API_BASE_URL}${endpoint}`
  const headers: HeadersInit = {
    ...fetchOptions.headers,
  }

  // Add Content-Type for JSON requests (not for FormData)
  if (!(fetchOptions.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const config: RequestInit = {
    ...fetchOptions,
    headers,
    credentials: 'include', // Important for session cookies
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(
        data.message || 'An error occurred',
        response.status,
        data
      )
    }

    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      'Network error or server unavailable',
      0,
      error
    )
  }
}

/**
 * GET request
 */
export async function apiGet<T>(
  endpoint: string,
  queryParams?: Record<string, string | number | boolean>
): Promise<ApiResponse<T>> {
  let url = endpoint
  if (queryParams) {
    const params = new URLSearchParams()
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value))
      }
    })
    url += `?${params.toString()}`
  }

  return apiRequest<T>(url, {
    method: 'GET',
  })
}

/**
 * POST request
 */
export async function apiPost<T>(
  endpoint: string,
  body?: any,
  isFormData = false
): Promise<ApiResponse<T>> {
  let requestBody: BodyInit | undefined

  if (body) {
    if (isFormData) {
      requestBody = body as FormData
    } else {
      requestBody = JSON.stringify(body)
    }
  }

  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: requestBody,
  })
}

/**
 * PUT request
 */
export async function apiPut<T>(
  endpoint: string,
  body?: any,
  isFormData = false
): Promise<ApiResponse<T>> {
  let requestBody: BodyInit | undefined

  if (body) {
    if (isFormData) {
      requestBody = body as FormData
    } else {
      requestBody = JSON.stringify(body)
    }
  }

  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: requestBody,
  })
}

/**
 * DELETE request
 */
export async function apiDelete<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'DELETE',
  })
}

export { ApiError, type ApiResponse }
