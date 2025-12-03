<template>
  <aside class="bg-dark px-3 py-1 h-100 sidebar-sticky">
    <nav class="nav flex-column gap-2">
      <!-- Dashboard -->
      <a href="#" class="nav-link d-flex align-items-center gap-2 text-white opacity-100 active">
        <i class="bi bi-speedometer2 nav-icon"></i>
        <span class="fw-semibold small">Dashboard</span>
      </a>

      <!-- Users -->
      <a href="#" class="nav-link d-flex align-items-center gap-2 text-white opacity-75">
        <i class="bi bi-people nav-icon"></i>
        <span class="fw-semibold small">Users</span>
      </a>

      <!-- Products -->
      <a href="#" class="nav-link d-flex align-items-center gap-2 text-white opacity-75">
        <i class="bi bi-box-seam nav-icon"></i>
        <span class="fw-semibold small">Products</span>
        <i class="bi bi-chevron-down ms-auto" style="color: #c4c4c4"></i>
      </a>

      <!-- Orders -->
      <a href="#" class="nav-link d-flex align-items-center gap-2 text-white opacity-75">
        <i class="bi bi-bag-check nav-icon"></i>
        <span class="fw-semibold small">Orders</span>
        <i class="bi bi-chevron-down ms-auto" style="color: #c4c4c4"></i>
      </a>

      <!-- Categories -->
      <a href="#" class="nav-link d-flex align-items-center gap-2 text-white opacity-75">
        <i class="bi bi-tags nav-icon"></i>
        <span class="fw-semibold small">Categories</span>
      </a>

      <!-- Advertisement -->
      <a href="#" class="nav-link d-flex align-items-center gap-2 text-white opacity-75">
        <i class="bi bi-megaphone nav-icon"></i>
        <span class="fw-semibold small">Advertisement</span>
      </a>

      <!-- Reward -->
      <a href="#" class="nav-link d-flex align-items-center gap-2 text-white opacity-75">
        <i class="bi bi-gift nav-icon"></i>
        <span class="fw-semibold small">Reward</span>
      </a>

      <!-- Review And Ratings -->
      <a href="#" class="nav-link d-flex align-items-center gap-2 text-white opacity-75">
        <i class="bi bi-star-half nav-icon"></i>
        <span class="fw-semibold small">Reviews</span>
      </a>

      <!-- Shipping
      <a href="#" class="nav-link d-flex align-items-center gap-2 text-white opacity-75">
        <i class="bi bi-truck nav-icon"></i>
        <span class="fw-semibold small">Shipping</span>
      </a> -->

      <!-- Reports -->
      <a href="#" class="nav-link d-flex align-items-center gap-2 text-white opacity-75">
        <i class="bi bi-bar-chart-line nav-icon"></i>
        <span class="fw-semibold small">Reports</span>
      </a>

      <!-- Top Statistics -->
      <a href="#" class="nav-link d-flex align-items-center gap-2 text-white opacity-75">
        <i class="bi bi-graph-up-arrow nav-icon"></i>
        <span class="fw-semibold small">Top Statistics</span>
      </a>

      <!-- Team -->
      <a href="#" class="nav-link d-flex align-items-center gap-2 text-white opacity-75">
        <i class="bi bi-people-fill nav-icon"></i>
        <span class="fw-semibold small">Team</span>
      </a>
    </nav>
  </aside>
</template>

<script setup lang="ts"></script>

<style scoped>
.sidebar-sticky {
  position: sticky;
  top: 72px; /* Match header height in layout */
  height: 100vh;
  align-self: flex-start;
  z-index: 2;
}
.nav-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}
.nav-link.active,
.nav-link.active .nav-icon {
  color: #ff4f5a !important;
  opacity: 1 !important;
}
.nav-link {
  transition:
    opacity 0.2s,
    color 0.2s;
}
.nav-link:hover {
  opacity: 0.9;
}
@media (max-width: 768px) {
  aside.bg-dark {
    width: 100% !important;
    min-height: auto;
    padding: 16px !important;
  }
  .sidebar-sticky {
    position: static;
    height: auto;
    top: unset;
  }
}
</style>
