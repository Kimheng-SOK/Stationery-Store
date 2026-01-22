<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark py-3 sticky-top">
    <div class="container-fluid px-4" style="max-width: 1400px; margin: 0 auto">
      <router-link to="/" class="navbar-brand d-flex align-items-center">
        <img
          src="/logo.png"
          alt="logo"
          class="rounded-circle me-2"
          style="width: 40px; height: 40px"
        />
        <span class="fw-semibold fs-5">StationeryBox</span>
      </router-link>

      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
          <li class="nav-item">
            <router-link
              to="/shop"
              class="nav-link px-3"
              active-class="active-nav-link"
            >
              Shop All
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/new-arrival"
              class="nav-link px-3"
              active-class="active-nav-link"
            >
              New Arrival
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/categories"
              class="nav-link px-3"
              active-class="active-nav-link"
            >
              Categories
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/hots"
              class="nav-link px-3"
              active-class="active-nav-link"
            >
              Hots
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/about-us"
              class="nav-link px-3"
              active-class="active-nav-link"
            >
              About Us
            </router-link>
          </li>
        </ul>

        <div class="d-flex align-items-center flex-grow-1 mx-lg-3 d-none d-lg-flex" style="max-width: 380px">
          <SearchBar />
        </div>

        <div class="d-none d-lg-flex align-items-center gap-3">
          <template v-if="authStore.isAuthenticated">
            <div class="dropdown" ref="dropdownRef" style="position: relative;">
              <button
                class="btn btn-link p-2 text-white border-0 dropdown-toggle"
                type="button"
                @click="toggleDropdown"
                :aria-expanded="showDropdown"
              >
                <i class="bi bi-person-circle fs-4"></i>
                <span class="ms-2">{{ authStore.user?.name || 'User' }}</span>
              </button>
              <ul
                v-show="showDropdown"
                class="dropdown-menu dropdown-menu-end show"
                style="display: block; position: absolute; right: 0; top: 100%;"
              >
                <li><router-link to="/profile" class="dropdown-item" @click="closeDropdown">Profile</router-link></li>
                <li><router-link to="/orders" class="dropdown-item" @click="closeDropdown">My Orders</router-link></li>
                <li><hr class="dropdown-divider"></li>
                <li><a @click="handleLogout" class="dropdown-item text-danger" style="cursor: pointer">Logout</a></li>
              </ul>
            </div>
          </template>
          <template v-else>
            <router-link to="/signin" class="btn btn-link p-2 text-white border-0">
              <i class="bi bi-person-circle fs-4"></i>
              <span class="ms-2">Sign In</span>
            </router-link>
          </template>

          <router-link to="/cart" class="btn btn-link p-2 text-white border-0 position-relative">
            <i class="bi bi-cart3 fs-4"></i>
            <span
              v-if="cartStore.totalItems > 0"
              class="position-absolute badge rounded-pill bg-danger"
              style="font-size: 0.65rem; top: 0; right: 0; min-width: 16px; height: 16px; padding: 2px 5px;"
            >
              {{ cartStore.totalItems }}
            </span>
          </router-link>
        </div>
      </div>

      <div class="d-flex align-items-center gap-2 d-lg-none">
        <template v-if="authStore.isAuthenticated">
          <button @click="handleLogout" class="btn btn-link p-2 text-danger border-0">
            <i class="bi bi-box-arrow-right fs-4"></i>
          </button>
        </template>
        <template v-else>
          <router-link to="/signin" class="btn btn-link p-2 text-white border-0">
            <i class="bi bi-person-circle fs-4"></i>
          </router-link>
        </template>

        <router-link to="/cart" class="btn btn-link p-2 text-white border-0 position-relative">
          <i class="bi bi-cart3 fs-4"></i>
          <span
            v-if="cartStore.totalItems > 0"
            class="position-absolute badge rounded-pill bg-danger"
            style="font-size: 0.65rem; top: 0; right: 0; min-width: 16px; height: 16px; padding: 2px 5px;"
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
          <i class="bi bi-list fs-2 text-white"></i>
        </button>
      </div>
    </div>
  </nav>

  <div
    class="offcanvas offcanvas-start text-white"
    style="background-color: #1e293b; width: 300px"
    tabindex="-1"
    id="mobileSidebar"
  >
    <div class="offcanvas-header border-bottom border-secondary">
      <h5 class="offcanvas-title d-flex align-items-center mb-0">
        <img
          src="/logo.png"
          alt="logo"
          class="rounded-circle me-2"
          style="width: 36px; height: 36px"
        />
        StationeryBox
      </h5>
      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>

    <div class="offcanvas-body p-0">
      <div class="p-4 pb-3">
        <SearchBar />
      </div>

      <div class="d-flex flex-column">
        <router-link
          to="/shop"
          class="px-4 py-3 text-white text-decoration-none hover-bg"
          active-class="active-mobile-link"
        >
          Shop All
        </router-link>
        <router-link
          to="/new-arrival"
          class="px-4 py-3 text-white text-decoration-none hover-bg"
          active-class="active-mobile-link"
        >
          New Arrival
        </router-link>
        <router-link
          to="/categories"
          class="px-4 py-3 text-white text-decoration-none hover-bg"
          active-class="active-mobile-link"
        >
          Categories
        </router-link>
        <router-link
          to="/hots"
          class="px-4 py-3 text-white text-decoration-none hover-bg"
          active-class="active-mobile-link"
        >
          Hots
        </router-link>

        <template v-if="authStore.isAuthenticated">
          <hr class="border-secondary mx-3">
          <router-link
            to="/profile"
            class="px-4 py-3 text-white text-decoration-none hover-bg"
            active-class="active-mobile-link"
          >
            Profile
          </router-link>
          <router-link
            to="/orders"
            class="px-4 py-3 text-white text-decoration-none hover-bg"
            active-class="active-mobile-link"
          >
            My Orders
          </router-link>
          <a @click="handleLogout" class="px-4 py-3 text-danger text-decoration-none hover-bg" style="cursor: pointer">
            Logout
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
import { useRouter } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()

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
</script>

<style scoped>
.navbar {
  background-color: #1e293b !important;
}

.nav-link {
  color: rgba(255, 255, 255, 0.75) !important;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 500;
}

.nav-link:hover {
  color: white !important;
}

.nav-link.active-nav-link {
  color: white !important;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
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

.hover-bg {
  transition: all 0.3s ease;
}

.hover-bg:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white !important;
}

.active-mobile-link {
  background-color: rgba(255, 255, 255, 0.15) !important;
  color: white !important;
  border-left: 3px solid white;
  font-weight: 600;
}

.btn-link:hover {
  opacity: 0.8;
}

.badge {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@media (min-width: 992px) {
  .navbar-collapse {
    align-items: center;
  }
}
</style>
