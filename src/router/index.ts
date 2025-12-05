import { createRouter, createWebHistory } from 'vue-router'
import SignIn from '@/views/auth/Login.vue'
import SignUp from '@/views/auth/Register.vue'
import adminRoutes from './admin'
import userRoutes from './user' // if any
const requiresAdmin = true

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...userRoutes,
    ...adminRoutes,
    { path: '/signin', name: 'SignIn', component: SignIn },
    { path: '/signup', name: 'SignUp', component: SignUp },
  ],
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
