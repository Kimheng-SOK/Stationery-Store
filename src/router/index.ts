import { createRouter, createWebHistory } from 'vue-router'
import Privacy from '@/views/Privacy.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/privacy',name: 'Privacy',component: Privacy}
  ],
})

export default router
