import { createRouter, createWebHistory } from 'vue-router'
import ForgotPassword from '@/views/auth/ForgotPassword.vue'
import SignIn from '@/views/auth/Login.vue'
import SignUp from '@/views/auth/Register.vue'
import adminRoutes from './admin'
import userRoutes from './user'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Auth routes FIRST (no layout, standalone pages)
    {
      path: '/signin',
      name: 'SignIn',
      component: SignIn,
      meta: { requiresGuest: true }
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp,
      meta: { requiresGuest: true }
    },
    {
      path: '/forgotpassword',
      name: 'ForgotPassword',
      component: ForgotPassword,
      meta: { requiresGuest: true }
    },
    // Then other routes with layouts
    ...adminRoutes,
    ...userRoutes,
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()


  // Only initialize auth if not already initialized
  if (!authStore.isInitialized) {
    await authStore.initializeAuth()
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)

  // If route requires authentication
  if (requiresAuth && !authStore.isAuthenticated) {
    next('/signin')
    return
  }

  // If route requires admin role
  if (requiresAdmin && !authStore.isAdmin) {
    next('/signin')
    return
  }

  // If route requires guest (already logged in)
  if (requiresGuest && authStore.isAuthenticated) {
    if (authStore.isAdmin) {
      next('/admin')
    } else {
      next('/')
    }
    return
  }

  next()
})

export default router
