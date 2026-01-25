<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark py-2 py-lg-3 sticky-top">
    <div class="container-fluid px-3 px-md-4" style="max-width: 1400px; margin: 0 auto">
      <router-link to="/" class="navbar-brand d-flex align-items-center p-0">
        <img
          src="/logo.png"
          alt="logo"
          class="logo-img rounded-circle me-2"
          style="width: 32px; height: 32px"
        />
        <span class="fw-semibold brand-text">StationeryBox</span>
      </router-link>

      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
          <li class="nav-item">
            <router-link
              to="/shop"
              class="nav-link px-2 px-lg-3"
              active-class="active-nav-link"
            >
              Shop All
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/new-arrival"
              class="nav-link px-2 px-lg-3"
              active-class="active-nav-link"
            >
              New Arrival
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/categories"
              class="nav-link px-2 px-lg-3"
              active-class="active-nav-link"
            >
              Categories
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/hots"
              class="nav-link px-2 px-lg-3"
              active-class="active-nav-link"
            >
              Hots
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/about-us"
              class="nav-link px-2 px-lg-3"
              active-class="active-nav-link"
            >
              About Us
            </router-link>
          </li>
        </ul>

        <div class="d-none d-lg-flex align-items-center flex-grow-1 mx-3" style="max-width: 380px">
          <SearchBar v-model="searchQuery" />
        </div>

        <div class="d-none d-lg-flex align-items-center gap-2">
          <template v-if="authStore.isAuthenticated">
            <div class="dropdown" ref="dropdownRef" style="position: relative;">
              <button
                class="btn btn-link p-2 text-white border-0 dropdown-toggle user-btn"
                type="button"
                @click="toggleDropdown"
                :aria-expanded="showDropdown"
              >
                <i class="bi bi-person-circle icon-size"></i>
                <span class="ms-2 user-name">{{ authStore.user?.name || 'User' }}</span>
              </button>
              <ul
                v-show="showDropdown"
                class="dropdown-menu dropdown-menu-end show"
                style="display: block; position: absolute; right: 0; top: 100%; min-width: 180px;"
              >
                <li><router-link to="/profile" class="dropdown-item" @click="closeDropdown">Profile</router-link></li>
                <li><router-link to="/orders" class="dropdown-item" @click="closeDropdown">My Orders</router-link></li>
                <li><hr class="dropdown-divider"></li>
                <li><a @click="handleLogout" class="dropdown-item text-danger" style="cursor: pointer">Logout</a></li>
              </ul>
            </div>
          </template>
          <template v-else>
            <router-link to="/signin" class="btn btn-link p-2 text-white border-0 user-btn">
              <i class="bi bi-person-circle icon-size"></i>
              <span class="ms-2 user-name">Sign In</span>
            </router-link>
          </template>

          <router-link to="/cart" class="btn btn-link p-2 text-white border-0 position-relative cart-btn">
            <i class="bi bi-cart3 icon-size"></i>
            <span
              v-if="cartStore.totalItems > 0"
              class="position-absolute badge rounded-pill bg-danger cart-badge"
            >
              {{ cartStore.totalItems }}
            </span>
          </router-link>
        </div>
      </div>

      <div class="d-flex align-items-center gap-2 d-lg-none">
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

        <router-link to="/cart" class="btn btn-link p-2 text-white border-0 position-relative mobile-icon-btn">
          <i class="bi bi-cart3 mobile-icon"></i>
          <span
            v-if="cartStore.totalItems > 0"
            class="position-absolute badge rounded-pill bg-danger mobile-cart-badge"
          >
            {{ cartStore.totalItems }}
          </span>
        </router-link>

        <button
          class="navbar-toggler border-0 p-2"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#mobileSidebar"
          aria-controls="mobileSidebar"
        >
          <i class="bi bi-list mobile-menu-icon text-white"></i>
        </button>
      </div>
    </div>
  </nav>

  <div
    class="offcanvas offcanvas-start text-white mobile-sidebar"
    tabindex="-1"
    id="mobileSidebar"
  >
    <div class="offcanvas-header border-bottom border-secondary py-3">
      <h5 class="offcanvas-title d-flex align-items-center mb-0">
        <img
          src="/logo.png"
          alt="logo"
          class="rounded-circle me-2"
          style="width: 36px; height: 36px"
        />
        <span class="fw-semibold">StationeryBox</span>
      </h5>
      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>

    <div class="offcanvas-body p-0">
      <div class="p-3 pb-2">
        <SearchBar v-model="searchQuery" />
      </div>

      <div class="d-flex flex-column">
        <router-link
          to="/shop"
          class="mobile-link"
          active-class="active-mobile-link"
        >
          Shop All
        </router-link>
        <router-link
          to="/new-arrival"
          class="mobile-link"
          active-class="active-mobile-link"
        >
          New Arrival
        </router-link>
        <router-link
          to="/categories"
          class="mobile-link"
          active-class="active-mobile-link"
        >
          Categories
        </router-link>
        <router-link
          to="/hots"
          class="mobile-link"
          active-class="active-mobile-link"
        >
          Hots
        </router-link>
        <router-link
          to="/about-us"
          class="mobile-link"
          active-class="active-mobile-link"
        >
          About Us
        </router-link>

        <template v-if="authStore.isAuthenticated">
          <hr class="border-secondary mx-3 my-2">
          <router-link
            to="/profile"
            class="mobile-link"
            active-class="active-mobile-link"
          >
            <i class="bi bi-person me-2"></i> Profile
          </router-link>
          <router-link
            to="/orders"
            class="mobile-link"
            active-class="active-mobile-link"
          >
            <i class="bi bi-box-seam me-2"></i> My Orders
          </router-link>
          <a @click="handleLogout" class="mobile-link text-danger" style="cursor: pointer">
            <i class="bi bi-box-arrow-right me-2"></i> Logout
          </a>
        </template>
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

const toggleDropdown = (event: MouseEvent) => {
  event.stopPropagation()
  showDropdown.value = !showDropdown.value
}

const closeDropdown = () => {
  showDropdown.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (
    dropdownRef.value &&
    !dropdownRef.value.contains(event.target as Node)
  ) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

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
.navbar {
  background-color: #1e293b !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Logo Scaling */
.logo-img {
  width: 32px;
  height: 32px;
  transition: transform 0.3s ease;
}

.logo-img:hover {
  transform: scale(1.1);
}

.brand-text {
  font-size: 1.1rem;
}

/* Desktop Nav Links */
.nav-link {
  color: rgba(255, 255, 255, 0.75) !important;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 500;
  font-size: 0.95rem;
}

.nav-link:hover {
  color: white !important;
}

.nav-link.active-nav-link {
  color: white !important;
}

.nav-link.active-nav-link::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background: white;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
}

/* Icon Sizes - Desktop */
.icon-size {
  font-size: 1.5rem;
}

.user-name {
  font-size: 0.9rem;
}

.user-btn, .cart-btn {
  transition: opacity 0.3s ease;
}

.user-btn:hover, .cart-btn:hover {
  opacity: 0.8;
}

/* Cart Badge - Desktop */
.cart-badge {
  font-size: 0.65rem;
  top: 0;
  right: 0;
  min-width: 18px;
  height: 18px;
  padding: 3px 6px;
  animation: pulse 2s infinite;
}

/* Mobile Icons */
.mobile-icon {
  font-size: 1.4rem;
}

.mobile-menu-icon {
  font-size: 1.8rem;
}

.mobile-icon-btn {
  padding: 0.4rem !important;
}

.mobile-cart-badge {
  font-size: 0.6rem;
  top: -2px;
  right: -2px;
  min-width: 16px;
  height: 16px;
  padding: 2px 5px;
}

/* Mobile Sidebar */
.mobile-sidebar {
  background-color: #1e293b;
  width: 280px;
}

.mobile-link {
  padding: 0.9rem 1.25rem;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  display: block;
}

.mobile-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.active-mobile-link {
  background-color: rgba(255, 255, 255, 0.15) !important;
  color: white !important;
  border-left: 3px solid white;
  font-weight: 600;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Responsive Breakpoints */
@media (max-width: 991px) {
  .navbar {
    padding: 0.6rem 0;
  }
}

@media (max-width: 576px) {
  .brand-text {
    font-size: 1rem;
  }
  
  .logo-img {
    width: 28px;
    height: 28px;
  }
  
  .mobile-icon {
    font-size: 1.3rem;
  }
  
  .mobile-menu-icon {
    font-size: 1.6rem;
  }
  
  .mobile-sidebar {
    width: 260px;
  }
  
  .mobile-link {
    font-size: 0.9rem;
    padding: 0.8rem 1rem;
  }
}

@media (max-width: 375px) {
  .brand-text {
    font-size: 0.9rem;
  }
  
  .logo-img {
    width: 26px;
    height: 26px;
  }
  
  .mobile-sidebar {
    width: 240px;
  }
}

/* Tablet Landscape */
@media (min-width: 768px) and (max-width: 991px) {
  .nav-link {
    font-size: 0.9rem;
    padding-left: 0.75rem !important;
    padding-right: 0.75rem !important;
  }
}
</style>