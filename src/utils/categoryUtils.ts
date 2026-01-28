export function formatDate(date?: string): string {
  if (!date) return 'N/A'
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (error) {
    console.error('Date formatting error:', error, date)
    return 'Invalid Date'
  }
}

import { API_SERVER_URL } from '@/config/api'

export function getImageUrl(imagePath?: string): string {
  if (!imagePath) return '/placeholder.png'

  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }

  // If it's a relative path from your API
  const baseUrl = API_SERVER_URL
  return `${baseUrl}${imagePath}`
}

export function handleImageError(event: Event): void {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder.png'
}
