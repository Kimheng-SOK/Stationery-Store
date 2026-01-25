<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark py-3 sticky-top main-navbar">
    <div class="container-fluid px-4" style="max-width: 1400px; margin: 0 auto">
      
      <router-link to="/" class="navbar-brand d-flex align-items-center">
        <img
          src="/logo.png"
          alt="logo"
          class="rounded-circle me-2 brand-logo"
          style="width: 42px; height: 42px; object-fit: cover; border: 2px solid rgba(255,255,255,0.1);"
        />
        <div class="brand-text">
          <span class="fw-bold fs-5 d-block">StationeryBox</span>
          <small class="text-muted d-none d-sm-block" style="font-size: 0.7rem; letter-spacing: 1px;">PREMIUM STORE</small>
        </div>
      </router-link>

      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-5">
          <li class="nav-item">
            <router-link to="/shop" class="nav-link px-3" active-class="active-nav-link">
              Shop All
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/new-arrival" class="nav-link px-3" active-class="active-nav-link">
              New Arrival
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/categories" class="nav-link px-3" active-class="active-nav-link">
              Categories
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/hots" class="nav-link px-3" active-class="active-nav-link">
              Hots
              <span class="hot-badge"></span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/about-us" class="nav-link px-3" active-class="active-nav-link">
              About Us
            </router-link>
          </li>
        </ul>

        <div class="d-flex align-items-center flex-grow-1 mx-lg-4 d-none d-lg-flex" style="max-width: 400px">
          <SearchBar v-model="searchQuery" />
        </div>

        <div class="d-none d-lg-flex align-items-center gap-2">
          <template v-if="authStore.isAuthenticated">
            <div class="dropdown profile-dropdown-container" ref="dropdownRef">
              <button
                class="btn btn-profile-toggle text-white d-flex align-items-center gap-2"
                type="button"
                @click="toggleDropdown"
                :class="{ 'active': showDropdown }"
              >
                <div v-if="!authStore.user?.avatar" class="avatar-circle">
                  {{ getInitials(authStore.user?.name || 'User') }}
                </div>
                <img 
                  v-else 
                  :src="authStore.user.avatar" 
                  alt="Avatar" 
                  class="avatar-circle-img"
                />
                <div class="user-meta text-start">
                  <span class="d-block fw-semibold text-capitalize">{{ authStore.user?.name || 'User' }}</span>
                </div>
                <i class="bi bi-chevron-down small dropdown-arrow" :class="{ 'rotated': showDropdown }"></i>
              </button>

              <transition name="dropdown-fade">
                <ul
                  v-show="showDropdown"
                  class="dropdown-menu dropdown-menu-end show shadow-lg"
                >
                  <li class="dropdown-header border-bottom pb-2 mb-2">
                    <span class="text-uppercase fw-bold text-muted small">Account Overview</span>
                  </li>
                  
                  <li>
                    <router-link to="/profile" class="dropdown-item d-flex align-items-center" @click="closeDropdown">
                      <img src="/images/icons/profile.jpg" class="drop-icon me-3" />
                      <span>My Profile</span>
                    </router-link>
                  </li>

                  <li>
                    <router-link to="/profile/orders" class="dropdown-item d-flex align-items-center justify-content-between" @click="closeDropdown">
                      <div class="d-flex align-items-center">
                        <img src="/images/icons/orders.jpg" class="drop-icon me-3" />
                        <span>My Orders</span>
                      </div>
                      <span v-if="orderCount > 0" class="badge rounded-pill bg-danger">{{ orderCount }}</span>
                    </router-link>
                  </li>

                  <li>
                    <router-link to="/profile/wishlist" class="dropdown-item d-flex align-items-center" @click="closeDropdown">
                      <img src="/images/icons/wishlist.jpg" class="drop-icon me-3" />
                      <span>Wishlist</span>
                    </router-link>
                  </li>

                  <li>
                    <router-link to="/profile/address" class="dropdown-item d-flex align-items-center" @click="closeDropdown">
                      <img src="/images/icons/address.jpg" class="drop-icon me-3" />
                      <span>Addresses</span>
                    </router-link>
                  </li>

                  <li>
                    <router-link to="/profile/payment" class="dropdown-item d-flex align-items-center" @click="closeDropdown">
                      <img src="/images/icons/payment.jpg" class="drop-icon me-3" />
                      <span>Payment Methods</span>
                    </router-link>
                  </li>

                  <li>
                    <router-link to="/profile/notification" class="dropdown-item d-flex align-items-center" @click="closeDropdown">
                      <img src="/images/icons/notification.jpg" class="drop-icon me-3" />
                      <span>Notifications</span>
                    </router-link>
                  </li>

                  <li>
                    <router-link to="/profile/settings" class="dropdown-item d-flex align-items-center" @click="closeDropdown">
                      <img src="/images/icons/setting.jpg" class="drop-icon me-3" />
                      <span>Settings</span>
                    </router-link>
                  </li>

                  <li><hr class="dropdown-divider mx-2"></li>

                  <li>
                    <a @click="handleLogout" class="dropdown-item d-flex align-items-center text-danger" style="cursor: pointer">
                      <img src="/images/icons/logout.jpg" class="drop-icon me-3" />
                      <span class="fw-bold">Logout</span>
                    </a>
                  </li>
                </ul>
              </transition>
            </div>
          </template>

          <template v-else>
            <router-link to="/signin" class="btn btn-outline-light rounded-pill px-4 btn-signin">
              Sign In
            </router-link>
          </template>

          <router-link to="/cart" class="btn-cart position-relative text-white ms-2">
            <i class="bi bi-cart3 fs-4"></i>
            <span v-if="cartStore.totalItems > 0" class="cart-badge-count">
              {{ cartStore.totalItems }}
            </span>
          </router-link>
        </div>
      </div>

      <div class="d-lg-none d-flex align-items-center gap-2">
        <template v-if="authStore.isAuthenticated">
          <button @click="handleLogout" class="btn btn-link p-2 text-danger border-0 mobile-icon-btn">
            <i class="bi bi-box-arrow-right mobile-icon"></i>
          </button>
        </template>
        <template v-else>
          <router-link to="/signin" class="btn btn-link p-2 text-white border-0 mobile-icon-btn">
            <i class="bi bi-person-circle mobile-icon"></i>
          </router-link>
        </template>

        <router-link to="/cart" class="text-white position-relative p-2">
          <i class="bi bi-cart3 fs-3"></i>
          <span
            v-if="cartStore.totalItems > 0"
            class="cart-badge-count small"
          >
            {{ cartStore.totalItems }}
          </span>
        </router-link>
        <button
          class="navbar-toggler border-0 p-2"
          type="button"
          @click="toggleMobileSidebar"
        >
          <i class="bi bi-list fs-1 text-white"></i>
        </button>
      </div>
    </div>
  </nav>

  <div class="offcanvas offcanvas-start bg-dark-sidebar text-white" tabindex="-1" id="mobileSidebar" ref="mobileSidebarRef" style="width: 300px;">
    <div class="offcanvas-header border-bottom border-secondary py-4">
      <h5 class="offcanvas-title d-flex align-items-center fw-bold">
        <img src="/logo.png" alt="logo" class="rounded-circle me-3" style="width: 35px; height: 35px" />
        StationeryBox
      </h5>
      <button type="button" class="btn-close btn-close-white shadow-none" @click="closeMobileSidebar"></button>
    </div>

    <div class="offcanvas-body p-0">
      <div class="p-4"><SearchBar /></div>
      
      <div class="mobile-menu-list">
        <div class="menu-group-label px-4 text-muted small text-uppercase fw-bold mb-2">Store</div>
        <router-link to="/shop" class="mobile-link" active-class="active" @click="closeMobileSidebar">Shop All</router-link>
        <router-link to="/new-arrival" class="mobile-link" active-class="active" @click="closeMobileSidebar">New Arrival</router-link>
        <router-link to="/categories" class="mobile-link" active-class="active" @click="closeMobileSidebar">Categories</router-link>
        <router-link to="/hots" class="mobile-link" active-class="active" @click="closeMobileSidebar">Hot Items</router-link>
        <router-link to="/about-us" class="mobile-link" active-class="active" @click="closeMobileSidebar">About Us</router-link>

        <template v-if="authStore.isAuthenticated">
          <div class="menu-group-label px-4 text-muted small text-uppercase fw-bold mt-4 mb-2">My Account</div>
          <router-link to="/profile" class="mobile-link d-flex align-items-center" @click="closeMobileSidebar">
            <img src="/images/icons/profile.jpg" class="drop-icon me-3 rounded" /> Profile
          </router-link>
          <router-link to="/profile/orders" class="mobile-link d-flex align-items-center justify-content-between" @click="closeMobileSidebar">
            <div class="d-flex align-items-center">
              <img src="/images/icons/orders.jpg" class="drop-icon me-3 rounded" /> Orders
            </div>
            <span v-if="orderCount > 0" class="badge bg-danger">{{ orderCount }}</span>
          </router-link>
          <router-link to="/profile/wishlist" class="mobile-link d-flex align-items-center" @click="closeMobileSidebar">
            <img src="/images/icons/wishlist.jpg" class="drop-icon me-3 rounded" /> Wishlist
          </router-link>
          <router-link to="/profile/address" class="mobile-link d-flex align-items-center" @click="closeMobileSidebar">
            <img src="/images/icons/address.jpg" class="drop-icon me-3 rounded" /> Addresses
          </router-link>
          <router-link to="/profile/payment" class="mobile-link d-flex align-items-center" @click="closeMobileSidebar">
            <img src="/images/icons/payment.jpg" class="drop-icon me-3 rounded" /> Payment
          </router-link>
          <router-link to="/profile/notification" class="mobile-link d-flex align-items-center" @click="closeMobileSidebar">
            <img src="/images/icons/notification.jpg" class="drop-icon me-3 rounded" /> Notifications
          </router-link>
          <router-link to="/profile/settings" class="mobile-link d-flex align-items-center" @click="closeMobileSidebar">
            <img src="/images/icons/setting.jpg" class="drop-icon me-3 rounded" /> Settings
          </router-link>
          <a @click="handleLogoutMobile" class="mobile-link text-danger d-flex align-items-center border-0 bg-transparent">
            <img src="/images/icons/logout.jpg" class="drop-icon me-3 rounded" /> Sign Out
          </a>
        </template>
        
        <div v-else class="p-4 mt-2">
          <router-link to="/signin" class="btn btn-primary w-100 rounded-pill py-3" @click="closeMobileSidebar">Sign In / Register</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchBar from '@/components/SearchBar.vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cartStore'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()
const route = useRoute()

const showDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const mobileSidebarRef = ref<HTMLElement | null>(null)
const orderCount = ref(0)

// Get user initials for avatar - FIXED VERSION
const getInitials = (name: string): string => {
  if (!name) return 'U'
  const parts = name.trim().split(' ').filter(part => part.length > 0)
  
  if (parts.length === 0) return 'U'
  if (parts.length === 1) {
    return parts[0]?.[0]?.toUpperCase() || 'U'
  }
  
  const firstInitial = parts[0]?.[0]?.toUpperCase() || ''
  const lastInitial = parts[parts.length - 1]?.[0]?.toUpperCase() || ''
  
  return (firstInitial + lastInitial) || 'U'
}

// Core Logic Functions
const toggleDropdown = (event: MouseEvent) => {
  event.stopPropagation()
  showDropdown.value = !showDropdown.value
}

const closeDropdown = () => {
  showDropdown.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showDropdown.value = false
  }
}

const handleLogout = () => {
  if (confirm('Are you sure you want to sign out?')) {
    authStore.logout()
    closeDropdown()
    router.push('/signin')
  }
}

const toggleMobileSidebar = () => {
  if (mobileSidebarRef.value) {
    mobileSidebarRef.value.classList.add('show')
    document.body.style.overflow = 'hidden'
    
    // Add backdrop
    const backdrop = document.createElement('div')
    backdrop.className = 'offcanvas-backdrop fade show'
    backdrop.onclick = closeMobileSidebar
    document.body.appendChild(backdrop)
  }
}

const closeMobileSidebar = () => {
  if (mobileSidebarRef.value) {
    mobileSidebarRef.value.classList.remove('show')
    document.body.style.overflow = ''
    
    // Remove backdrop
    const backdrop = document.querySelector('.offcanvas-backdrop')
    if (backdrop) {
      backdrop.remove()
    }
  }
}

const handleLogoutMobile = () => {
  if (confirm('Are you sure you want to sign out?')) {
    authStore.logout()
    closeMobileSidebar()
    router.push('/signin')
  }
}

// Load order count
const loadOrderCount = async () => {
  try {
    // Get orders from localStorage
    const saved = localStorage.getItem('orders')
    if (saved) {
      const orders = JSON.parse(saved)
      // Count only processing/shipped orders
      orderCount.value = orders.filter((order: any) => 
        order.status === 'Processing' || order.status === 'Shipped'
      ).length
    } else {
      orderCount.value = 0
    }
  } catch (error) {
    console.error('Failed to load order count:', error)
    orderCount.value = 0
  }
}

// Lifecycle Hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  if (authStore.isAuthenticated) {
    loadOrderCount()
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Reset dropdown on route change
watch(() => router.currentRoute.value.path, () => {
  closeDropdown()
})

// Reload order count when user logs in
watch(() => authStore.isAuthenticated, (isAuth) => {
  if (isAuth) {
    loadOrderCount()
  } else {
    orderCount.value = 0
  }
const handleLogout = () => {
  authStore.logout()
  router.push('/signin')
}
const searchQuery = ref((route.query.search as string) || '')

// Watch searchQuery and push to URL for live filtering
watch(searchQuery, (newVal) => {
  router.push({ 
    path: '/shop', 
    query: { ...route.query, search: newVal.trim() || undefined } 
  })
})

// Sync search bar if URL changes (like clicking clear filters)
watch(() => route.query.search, (newSearch) => {
  searchQuery.value = (newSearch as string) || ''
})
</script>

<style scoped>
/* Main Layout & Navigation Styles */
.navbar {
  background-color: #1e293b !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  transition: all 0.3s ease;
  z-index: 1050;
}

/* Desktop Nav Links */
.nav-link {
  color: rgba(255, 255, 255, 0.7) !important;
  transition: all 0.3s ease;
  font-weight: 500;
  position: relative;
}

.nav-link:hover {
  color: #fff !important;
  transform: translateY(-1px);
}

.active-nav-link {
  color: #fff !important;
  font-weight: 700 !important;
}

.active-nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 15%;
  width: 70%;
  height: 3px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(255,255,255,0.5);
}

/* Profile Dropdown Component */
.profile-dropdown-container {
  position: relative;
}

.btn-profile-toggle {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 6px 16px;
  border-radius: 50px;
  transition: all 0.3s;
}

.btn-profile-toggle:hover, .btn-profile-toggle.active {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.avatar-circle {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  color: white;
  text-transform: uppercase;
}

.avatar-circle-img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.dropdown-menu {
  display: block;
  position: absolute;
  top: 120%;
  right: 0;
  min-width: 260px;
  background: #ffffff;
  border-radius: 15px;
  padding: 12px;
  border: none;
  transform-origin: top right;
}

.drop-icon {
  width: 24px;
  height: 24px;
  object-fit: cover;
  border-radius: 4px;
}

.dropdown-item {
  padding: 10px 15px;
  border-radius: 10px;
  color: #334155;
  font-weight: 500;
  transition: all 0.2s;
  margin-bottom: 2px;
}

.dropdown-item:hover {
  background-color: #f1f5f9;
  color: #141B3E;
  padding-left: 20px;
}

/* Cart & Badges */
.btn-cart {
  text-decoration: none;
  padding: 8px;
  transition: transform 0.2s;
}

.btn-cart:hover {
  transform: scale(1.1);
}

.cart-badge-count {
  position: absolute;
  top: 0;
  right: 0;
  background: #ef4444;
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #1e293b;
  animation: pulse 2s infinite;
}

/* Animations */
.dropdown-fade-enter-active {
  animation: slide-in 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.dropdown-fade-leave-active {
  animation: slide-in 0.2s reverse ease-in;
}

.dropdown-arrow {
  transition: transform 0.3s ease;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

@keyframes slide-in {
  from { opacity: 0; transform: translateY(10px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* Mobile Sidebar Specifics */
.bg-dark-sidebar {
  background-color: #0f172a !important;
}

.mobile-link {
  display: block;
  padding: 14px 24px;
  color: #94a3b8;
  text-decoration: none;
  font-weight: 500;
  border-left: 4px solid transparent;
  transition: all 0.3s;
}

.mobile-link:hover, .mobile-link.active {
  background: rgba(255,255,255,0.05);
  color: #fff;
  border-left-color: #141B3E;
}

.hot-badge {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  margin-left: 4px;
  box-shadow: 0 0 8px #ef4444;
}

.btn-signin {
  padding: 0.5rem 1.5rem;
  font-size: 0.9rem;
}

.btn-primary {
  background-color: #141B3E;
  border-color: #141B3E;
}

.btn-primary:hover {
  background-color: #0d1228;
  border-color: #0d1228;
}

/* Mobile Responsive */
@media (max-width: 991px) {
  .navbar-brand .brand-text span {
    font-size: 1.1rem;
  }
}

@media (max-width: 576px) {
  .navbar-brand img {
    width: 35px !important;
    height: 35px !important;
  }
  
  .navbar-brand .brand-text span {
    font-size: 1rem;
  }
}
</style>