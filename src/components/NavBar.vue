<template>
  <!-- ORIGINAL NAVBAR – untouched on desktop -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark py-3">
    <div class="container-fluid px-4" style="max-width: 1400px; margin: 0 auto">
      <!-- Logo (still an image) -->
      <router-link to="/" class="navbar-brand d-flex align-items-center">
        <img
          src="/logo.png"
          alt="logo"
          class="rounded-circle me-2"
          style="width: 40px; height: 40px"
        />
        <span class="fw-semibold fs-5">StationeryBox</span>
      </router-link>

      <!-- Desktop content – exactly as original -->
      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
          <li class="nav-item">
            <router-link to="/user/shop" class="nav-link px-3">Shop All</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/user/new-arrival" class="nav-link px-3">New Arrival</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/user/categories" class="nav-link px-3">Categories</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/user/hots" class="nav-link px-3">Hots</router-link>
          </li>
        </ul>

        <div class="d-flex align-items-center flex-grow-1 mx-lg-3" style="max-width: 380px">
          <SearchBar />
        </div>

        <div class="d-flex align-items-center gap-3 mt-3 mt-lg-0">
          <!-- Account Icon -->
          <button class="btn btn-link p-2 text-white border-0">
            <i class="bi bi-person-circle fs-4"></i>
          </button>

          <!-- Cart Icon -->
          <button class="btn btn-link p-2 text-white border-0 position-relative">
            <i class="bi bi-cart3 fs-4"></i>
            <span
              class="position-absolute badge rounded-pill bg-danger"
              style="
                font-size: 0.65rem;
                top: 0;
                right: 0;
                min-width: 16px;
                height: 16px;
                padding: 2px 5px;
              "
            >
              {{ CartNum }}
            </span>
          </button>
        </div>
      </div>

      <!-- Mobile Right Icons: Account → Cart → Hamburger -->
      <div class="d-flex align-items-center gap-3 d-lg-none">
        <!-- Account -->
        <button class="btn btn-link p-2 text-white border-0">
          <i class="bi bi-person-circle"></i>
        </button>

        <!-- Cart -->
        <button class="btn btn-link p-2 text-white border-0 position-relative">
          <i class="bi bi-cart3"></i>
          <span
            class="position-absolute badge rounded-pill bg-danger"
            style="
              font-size: 0.65rem;
              top: 0;
              right: 0;
              min-width: 16px;
              height: 16px;
              padding: 2px 5px;
            "
          >
            {{ CartNum }}
          </span>
        </button>

        <!-- Hamburger -->
        <button
          class="navbar-toggler border-0 p-2"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#mobileSidebar"
        >
          <i class="bi bi-list"></i>
        </button>
      </div>
    </div>
  </nav>

  <!-- Mobile Sidebar -->
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
      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
    </div>

    <div class="offcanvas-body p-0">
      <!-- Search bar FIRST, right under logo -->
      <div class="p-4 pb-3">
        <SearchBar />
      </div>

      <!-- Menu items -->
      <div class="d-flex flex-column">
        <a href="#" class="px-4 py-3 text-white text-decoration-none hover-bg">Shop All</a>
        <a href="#" class="px-4 py-3 text-white text-decoration-none hover-bg">New Arrival</a>
        <a href="#" class="px-4 py-3 text-white text-decoration-none hover-bg">Categories</a>
        <a href="#" class="px-4 py-3 text-white text-decoration-none hover-bg">Hots</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore: no declaration file for .vue SFC; add proper shims (e.g. src/shims-vue.d.ts) to fix this properly
import SearchBar from '../components/SearchBar.vue'

export default {
  name: 'NavBar',
  components: { SearchBar },
  props: {
    CartNum: { type: Number, default: 1 },
  },
}
</script>

<style scoped>
.navbar {
  background-color: #1e293b !important;
}

.nav-link {
  color: white !important;
  transition: opacity 0.2s;
}
.nav-link:hover,
.btn-link:hover {
  opacity: 0.8;
}

.hover-bg:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

@media (min-width: 992px) {
  .navbar-collapse {
    align-items: center;
  }
}
</style>
