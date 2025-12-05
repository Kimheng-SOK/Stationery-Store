import { createRouter, createWebHistory } from 'vue-router'
import Privacy from '@/views/Privacy.vue'

import adminRoutes from './admin'
import userRoutes from './user' // if any
const requiresAdmin = true

const router = createRouter({
  history: createWebHistory(),
  routes: [...userRoutes, ...adminRoutes],
})

// // Optional navigation guard
// router.beforeEach((to, from, next) => {
//   if (to.meta.requiresAdmin) {
//     const token = localStorage.getItem('admin_token')
//     if (!token) return next('/admin/login')
//   }
//   next()
// })

export default router
