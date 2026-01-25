import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Banner } from '@/types/banner'

const API_URL = 'http://localhost:5000/api/banners'

const parseDate = (value: string): Date | null => {
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const normalizeDate = (date: Date): Date => {
  // Reset to midnight for accurate date-only comparison
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

const isBannerLive = (banner: Banner, today: Date): boolean => {
  // Must be active status
  if (banner.status !== 'active') return false

  const start = parseDate(banner.startDate)
  const end = parseDate(banner.endDate)

  if (!start || !end) return false

  // Normalize all dates to midnight for fair comparison
  const todayNormalized = normalizeDate(today)
  const startNormalized = normalizeDate(start)
  const endNormalized = normalizeDate(end)

  // Check if today is within the banner's date range
  // startDate <= today <= endDate
  return startNormalized <= todayNormalized && todayNormalized <= endNormalized
}

const getImageUrl = (image: string): string => {
  if (!image) return ''
  if (image.startsWith('http') || image.startsWith('data:')) {
    return image
  }
  return `http://localhost:5000/uploads/banners/${image}`
}

export const useHeroSectionStore = defineStore('heroSection', () => {
  const banners = ref<Banner[]>([])
  const now = ref(new Date())
  const isLoading = ref(false)

  // Fetch banners from API
  const fetchBanners = async () => {
    isLoading.value = true
    try {
      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server did not return JSON response')
      }

      const result = await response.json()

      if (result.success) {
        banners.value = result.data
      }
    } catch (error) {
      console.error('Failed to fetch banners:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Only banners that are:
  // 1. Status is "active"
  // 2. Today is >= startDate
  // 3. Today is <= endDate (automatically respects the "days" field)
  const liveBanners = computed(() =>
    banners.value.filter((banner) => isBannerLive(banner, now.value))
  )

  // This will show live banners only
  const displayBanners = computed(() => liveBanners.value)

  const heroSlides = computed(() =>
    displayBanners.value.map((banner) => ({
      id: banner.id,
      image: getImageUrl(banner.image),
      link: banner.link,
    }))
  )

  const setBanners = (next: Banner[]) => {
    banners.value = [...next]
  }

  const refreshNow = (date: Date = new Date()) => {
    now.value = date
  }

  return {
    banners,
    liveBanners,
    displayBanners,
    heroSlides,
    isLoading,
    setBanners,
    refreshNow,
    fetchBanners,
  }
})
