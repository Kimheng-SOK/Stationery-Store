import type { Banner } from '@/types/banner'

export const mockBanners: Banner[] = [
  {
    id: 1,
    requestedDate: '2025-12-28',
    image: '/images/banner/ban1.jpg',
    days: 90,
    startDate: '2025-12-30',
    endDate: '2026-03-30',
    link: 'www.stationerybox.com/collections/new',
    status: 'active',
  },
  {
    id: 2,
    requestedDate: '2025-12-28',
    image: '/images/banner/ban2.jpg',
    days: 120,
    startDate: '2025-12-30',
    endDate: '2026-04-30',
    link: 'www.stationerybox.com/collections/featured',
    status: 'active',
  },
  {
    id: 3,
    requestedDate: '2025-12-28',
    image: '/images/banner/ban3.jpg',
    days: 120,
    startDate: '2025-12-30',
    endDate: '2026-04-30',
    link: 'www.stationerybox.com/collections/premium-notebooks',
    status: 'active',
  },
  {
    id: 4,
    requestedDate: '2025-12-28',
    image: '/images/banner/ban4.jpg',
    days: 120,
    startDate: '2025-12-30',
    endDate: '2026-04-30',
    link: 'www.stationerybox.com/collections/desk-essentials',
    status: 'active',
  },
]
