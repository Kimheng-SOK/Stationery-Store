<template>
  <!-- ORIGINAL NAVBAR – untouched on desktop -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark py-3">
    <div class="container-fluid px-4" style="max-width: 1400px; margin: 0 auto;">

      <!-- Logo (always visible) -->
      <a class="navbar-brand d-flex align-items-center" href="#">
        <img src="/logo.png" alt="logo" class="rounded-circle me-2" style="width: 40px; height: 40px;">
        <span class="fw-semibold fs-5">StationeryBox</span>
      </a>

      <!-- Desktop content – exactly as you had it -->
      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
          <li class="nav-item"><a class="nav-link px-3" href="#">Shop All</a></li>
          <li class="nav-item"><a class="nav-link px-3" href="#">New Arrival</a></li>
          <li class="nav-item"><a class="nav-link px-3" href="#">Categories</a></li>
          <li class="nav-item"><a class="nav-link px-3" href="#">Hots</a></li>
        </ul>

        <div class="d-flex align-items-center flex-grow-1 mx-lg-3" style="max-width: 380px;">
          <SearchBar />
        </div>

        <div class="d-flex align-items-center gap-3 mt-3 mt-lg-0">
          <button class="btn btn-link p-2 text-white border-0">
            <img src="/acc.png" alt="account" style="width: 20px; height: 20px;">
          </button>
          <button class="btn btn-link p-2 text-white border-0 position-relative">
            <img src="/shopping-cart.png" alt="cart" style="width: 24px; height: 24px;">
            <span class="position-absolute badge rounded-pill bg-danger"
                  style="font-size: 0.65rem; top: 0; right: 0; min-width: 16px; height: 16px; padding: 2px 5px;">
              {{ CartNum }}
            </span>
          </button>
        </div>
      </div>

      <!-- Mobile Right Icons: Account → Cart → Hamburger -->
      <div class="d-flex align-items-center gap-3 d-lg-none">
        <!-- Account -->
        <button class="btn btn-link p-2 text-white border-0">
          <img src="/acc.png" alt="account" style="width: 20px; height: 20px;">
        </button>

        <!-- Cart with badge -->
        <button class="btn btn-link p-2 text-white border-0 position-relative">
          <img src="/shopping-cart.png" alt="cart" style="width: 24px; height: 24px;">
          <span class="position-absolute badge rounded-pill bg-danger"
                style="font-size: 0.65rem; top: 0; right: 0; min-width: 16px; height: 16px; padding: 2px 5px;">
            {{ CartNum }}
          </span>
        </button>

        <!-- Hamburger (now next to cart) -->
        <button class="navbar-toggler border-0 p-2"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#mobileSidebar">
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>

    </div>
  </nav>

  <!-- Mobile Sidebar -->
  <div class="offcanvas offcanvas-start text-white"
       style="background-color: #1e293b; width: 300px;"
       tabindex="-1"
       id="mobileSidebar">
    <div class="offcanvas-header border-bottom border-secondary">
      <h5 class="offcanvas-title d-flex align-items-center mb-0">
        <img src="/logo.png" alt="logo" class="rounded-circle me-2" style="width: 36px; height: 36px;">
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
import SearchBar from './SearchBar.vue'

export default {
  name: 'NavBar',
  components: { SearchBar },
  props: {
    CartNum: { type: Number, default: 1 }
  }
}
</script>

<style scoped>
.navbar { background-color: #1e293b !important; }

.nav-link { color: white !important; transition: opacity .2s; }
.nav-link:hover, .btn-link:hover { opacity: .8; }

.hover-bg:hover { background-color: rgba(255,255,255,.1); }

@media (min-width: 992px) {
  .navbar-collapse { align-items: center; }
}
</style>