// Example dataset structure for easy API integration
import type { DataSet } from '@/types/chart'

export const dataset: DataSet[] = [
  {
    year: 2025,
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    sales: [120, 150, 170, 140, 180, 200, 220, 210, 190, 230, 250, 270],
  },
  {
    year: 2024,
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    sales: [100, 130, 160, 120, 160, 180, 200, 190, 170, 210, 230, 250],
  },
  {
    year: 2023,
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    sales: [90, 110, 140, 100, 120, 150, 170, 160, 140, 180, 200, 220],
  },
]
