import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Banner } from '@/types/banner'
import { mockBanners } from '@/data/banners'

const parseDate = (value: string): Date | null => {
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const isBannerLive = (banner: Banner, today: Date): boolean => {
  if (banner.status !== 'active') return false
  const start = parseDate(banner.startDate)
  const end = parseDate(banner.endDate)
  if (!start || !end) return false
  return start <= today && today <= end
}

export const useHeroSectionStore = defineStore('heroSection', () => {
  const banners = ref<Banner[]>([...mockBanners])
  const now = ref(new Date())

  const liveBanners = computed(() =>
    banners.value.filter((banner) => isBannerLive(banner, now.value))
  )

  const activeRegardlessDate = computed(() =>
    banners.value.filter((banner) => banner.status === 'active')
  )

  // Prefer date-valid active banners; if none, fall back to active banners ignoring date
  // so admin-provided mock data still shows in the hero.
  const displayBanners = computed(() =>
    liveBanners.value.length ? liveBanners.value : activeRegardlessDate.value
  )

  const heroSlides = computed(() =>
    displayBanners.value.map((banner) => ({
      id: banner.id,
      image: banner.image,
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
    setBanners,
    refreshNow,
  }
})
