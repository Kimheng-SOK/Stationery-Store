export interface Banner {
  id: number
  requestedDate: string
  image: string
  days: number
  startDate: string
  endDate: string
  link: string
  status: 'active' | 'inactive' | 'pending' | 'expired'
}

export type BannerStatus = Banner['status']
