<template>
  <!-- Modern Admin Header with Bootstrap utilities -->
  <nav class="navbar h-auto navbar-expand-lg navbar-dark admin-navbar shadow-sm">
    <div class="container-fluid px-4" style="max-width: 1400px; margin: 0 auto">
      <!-- Logo -->
      <router-link to="/admin" class="navbar-brand d-flex align-items-center gap-2">
        <img src="/logo.png" alt="logo" class="rounded-circle logo-img" />
        <span class="fw-bold fs-4 brand-text">StationeryBox</span>
      </router-link>

      <!-- Desktop Search -->
      <div class="d-flex align-items-center flex-grow-1 mx-lg-3" style="max-width: 380px">
        <SearchBar />
      </div>

      <!-- User Section using Bootstrap utilities -->
      <div class="d-flex align-items-center bg-opacity-75 px-3 py-2 gap-3 shadow-sm">
        <span class="text-white fw-semibold me-2">{{ authStore.user?.username || 'Admin' }}</span>
        <span
          @click="handleLogout"
          class="text-danger fw-semibold me-2 logout-text text-decoration-underline-hover"
          tabindex="0"
          style="cursor: pointer"
          >Logout</span
        >
        <button
          class="btn rounded-circle border-0 d-flex align-items-center justify-content-center"
        >
          <i class="bi bi-person-circle text-white fs-3"></i>
        </button>
      </div>
    </div>
  </nav>

  <!-- Mobile Sidebar -->
  <div class="offcanvas offcanvas-start admin-sidebar text-white" tabindex="-1" id="mobileSidebar">
    <div class="offcanvas-header border-bottom border-secondary">
      <h5 class="offcanvas-title d-flex align-items-center mb-0">
        <img src="/logo.png" alt="logo" class="rounded-circle logo-img" />
        <span class="ms-2 brand-text">StationeryBox</span>
      </h5>
      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
    </div>
    <div class="offcanvas-body p-0">
      <div class="p-4 pb-3">
        <SearchBar />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-expect-error: no declaration file for .vue SFC; add proper shims (e.g. src/shims-vue.d.ts) to fix this properly
import SearchBar from '../SearchBar.vue'
// import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'NavBar',
  components: { SearchBar },
  props: {
    CartNum: { type: Number, default: 1 },
  },
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()

    const handleLogout = () => {
      authStore.logout()
      router.push('/signin')
    }

    return {
      authStore,
      handleLogout
    }
  }
}
</script>

<style scoped>
.admin-navbar {
  background: linear-gradient(90deg, #1e293b 60%, #334155 100%) !important;
  border-bottom: 1px solid #334155;
}

.logo-img {
  width: 44px;
  height: 44px;
  box-shadow: 0 2px 8px rgba(30, 41, 59, 0.15);
}
.brand-text {
  color: #ffffff;
  letter-spacing: 1px;
}
.logout-text {
  transition: color 0.2s;
  cursor: pointer;
}
.logout-text:hover,
.logout-text:focus {
  color: #ef4444 !important;
  text-decoration: underline;
}
.admin-sidebar {
  background-color: #1e293b !important;
  width: 300px;
}
@media (min-width: 992px) {
  .navbar-collapse {
    align-items: center;
  }
}
</style>
