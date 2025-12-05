<template>
  <div class="app bg-white min-vh-100">
    <div class="h-100 sticky-top" style="z-index: 1030">
      <HeaderNav />
    </div>
    <div class="app-body">
      <aside class="admin-sidebar d-none d-md-block bg-white shadow-sm border-end h-100">
        <AsideNavigation />
      </aside>
      <main class="main-content bg-white shadow-sm">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderNav from '../components/layout/AdminHeader.vue'
import AsideNavigation from '../components/layout/AdminASide.vue'
</script>

<style scoped>
.app {
  min-height: 100vh;
}

.app-body {
  display: flex;
  padding-top: 5px;
  min-height: calc(100vh - 5px);
}

.admin-sidebar {
  width: 215px;
  height: calc(100vh - 72px);
  overflow-y: auto;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  box-shadow: 2px 0 8px rgba(30, 41, 59, 0.04);
  z-index: 0;
  position: fixed;
  left: 0;
  align-self: flex-start;
}

.main-content {
  flex: 1;
  padding: 32px 30px;
  overflow-y: auto;
  margin-left: 215px;
  background: #fff;
  box-shadow: 0 2px 16px rgba(30, 41, 59, 0.06);
}

@media (max-width: 991.98px) {
  .admin-sidebar {
    display: none;
  }
  .main-content {
    margin-left: 0;
  }
}

@media (max-width: 768px) {
  .app-body {
    flex-direction: column;
    padding-top: 56px;
  }
  .main-content {
    margin-left: 0;
    padding: 24px 8px;
    border-radius: 1rem;
  }
}
</style>
