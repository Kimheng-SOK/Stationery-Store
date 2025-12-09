<template>
  <aside class="bg-dark px-3 py-1 h-100 sidebar-sticky">
    <nav class="nav flex-column gap-2">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav-link d-flex align-items-center gap-2 text-white"
        :class="[$route.path === item.to ? 'active opacity-100' : 'opacity-75']"
      >
        <i :class="['bi', item.icon, 'nav-icon']"></i>
        <span class="fw-semibold small">{{ item.label }}</span>
      </router-link>
      <!-- ...existing code for other static/dynamic items... -->
    </nav>
  </aside>
</template>

<script setup lang="ts">
const navItems = [
  { label: 'Dashboard', icon: 'bi-speedometer2', to: '/admin/dashboard' },
  { label: 'Users', icon: 'bi-people', to: '/admin/users' },
  { label: 'Products', icon: 'bi-box-seam', to: '/admin/products' },
  { label: 'Orders', icon: 'bi-bag-check', to: '/admin/orders' },
  { label: 'Categories', icon: 'bi-tags', to: '/admin/categories' },
  { label: 'Advertisement', icon: 'bi-megaphone', to: '/admin/advertisement' },
  { label: 'Reward', icon: 'bi-gift', to: '/admin/reward' },
  // { label: 'Reviews', icon: 'bi-star-half', to: '/admin/reviews' },
  // { label: 'Shipping', icon: 'bi-truck', to: '/admin/shipping' },
  // { label: 'Reports', icon: 'bi-bar-chart-line', to: '/admin/reports' },
  // { label: 'Top Statistics', icon: 'bi-graph-up-arrow', to: '/admin/statistics' },
  { label: 'Team', icon: 'bi-people-fill', to: '/admin/teams' },
]
</script>

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
  color: #ff4f5a;
  opacity: 1;
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
