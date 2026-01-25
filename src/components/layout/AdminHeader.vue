<template>
  <!-- Modern Admin Header with Enhanced Design -->
  <nav class="navbar navbar-expand-lg navbar-dark admin-navbar shadow-sm">
    <div class="container-fluid px-4">
      <!-- Left Section: Logo & Brand -->
      <router-link to="/admin" class="navbar-brand d-flex align-items-center gap-3 me-4">
        <div class="logo-wrapper">
          <img src="/logo.png" alt="logo" class="logo-img" />
        </div>
        <div class="brand-info d-none d-lg-block">
          <span class="brand-text">StationeryBox</span>
          <span class="brand-subtitle">Admin Panel</span>
        </div>
      </router-link>

      <!-- Center Section: Search Bar (Desktop) -->
      <div class="search-section d-none d-lg-flex flex-grow-1 mx-4" style="max-width: 500px;">
        <SearchBar v-model="searchQuery" />
      </div>

      <!-- Right Section: Notifications & User -->
      <div class="d-flex align-items-center gap-3">
        <!-- Notification Bell -->
        <div class="notification-wrapper position-relative">
          <button class="btn btn-icon" @click="toggleNotifications">
            <i class="bi bi-bell-fill"></i>
            <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
          </button>
        </div>

        <!-- User Dropdown -->
        <div class="dropdown user-dropdown">
          <button
            class="btn d-flex align-items-center gap-2 user-btn"
            type="button"
            id="userDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <div class="user-avatar">
              <i class="bi bi-person-circle"></i>
            </div>
            <div class="user-info d-none d-lg-block text-start">
              <span class="user-name">{{ authStore.user?.name || 'Admin User' }}</span>
              <span class="user-role">Administrator</span>
            </div>
            <i class="bi bi-chevron-down d-none d-lg-inline"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0" aria-labelledby="userDropdown">
            <li class="dropdown-header">
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-person-circle fs-3"></i>
                <div>
                  <div class="fw-bold">{{ authStore.user?.name || 'Admin User' }}</div>
                  <small class="text-muted">{{ authStore.user?.email || 'admin@example.com' }}</small>
                </div>
              </div>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <router-link to="/admin/profile" class="dropdown-item">
                <i class="bi bi-person me-2"></i>My Profile
              </router-link>
            </li>
            <li>
              <router-link to="/admin/settings" class="dropdown-item">
                <i class="bi bi-gear me-2"></i>Settings
              </router-link>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <a class="dropdown-item text-danger" @click="handleLogout" style="cursor: pointer;">
                <i class="bi bi-box-arrow-right me-2"></i>Logout
              </a>
            </li>
          </ul>
        </div>

        <!-- Mobile Menu Toggle -->
        <button
          class="btn btn-icon d-lg-none"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#mobileSidebar"
          aria-controls="mobileSidebar"
        >
          <i class="bi bi-list fs-3"></i>
        </button>
      </div>
    </div>
  </nav>

  <!-- Mobile Sidebar -->
  <div class="offcanvas offcanvas-start admin-sidebar" tabindex="-1" id="mobileSidebar">
    <div class="offcanvas-header">
      <div class="d-flex align-items-center gap-2">
        <img src="/logo.png" alt="logo" class="logo-img-mobile" />
        <div>
          <h5 class="offcanvas-title mb-0 text-white">StationeryBox</h5>
          <small class="text-white-50">Admin Panel</small>
        </div>
      </div>
      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
    </div>
    <div class="offcanvas-body p-0">
      <!-- Mobile Search -->
      <div class="p-3 border-bottom border-secondary">
        <SearchBar v-model="searchQuery" />
      </div>

      <!-- Mobile User Info -->
      <div class="p-3 bg-dark bg-opacity-25">
        <div class="d-flex align-items-center gap-3 mb-3">
          <div class="user-avatar-mobile">
            <i class="bi bi-person-circle"></i>
          </div>
          <div class="text-white">
            <div class="fw-bold">{{ authStore.user?.name || 'Admin User' }}</div>
            <small class="text-white-50">{{ authStore.user?.email }}</small>
          </div>
        </div>
        <button @click="handleLogout" class="btn btn-danger btn-sm w-100">
          <i class="bi bi-box-arrow-right me-2"></i>Logout
        </button>
      </div>
    </div>
  </div>

  <!-- Notifications Dropdown (Modal for mobile) -->
  <div v-if="showNotifications" class="notifications-panel shadow-lg">
    <div class="notifications-header">
      <h6 class="mb-0 fw-bold">Notifications</h6>
      <button class="btn-close btn-sm" @click="showNotifications = false"></button>
    </div>
    <div class="notifications-body">
      <div v-if="notifications.length === 0" class="text-center py-4">
        <i class="bi bi-bell-slash text-muted" style="font-size: 2rem;"></i>
        <p class="text-muted mt-2 mb-0">No new notifications</p>
      </div>
      <div v-else>
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="notification-item"
          :class="{ 'unread': !notification.read }"
        >
          <div class="notification-icon" :class="`bg-${notification.type}-subtle`">
            <i :class="`bi bi-${notification.icon} text-${notification.type}`"></i>
          </div>
          <div class="notification-content">
            <div class="notification-title">{{ notification.title }}</div>
            <div class="notification-message">{{ notification.message }}</div>
            <div class="notification-time">{{ notification.time }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="notifications-footer">
      <a href="#" class="text-primary text-decoration-none small">View all notifications</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SearchBar from '../SearchBar.vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const searchQuery = ref('')
const showNotifications = ref(false)
const unreadCount = ref(3)

const notifications = ref([
  {
    id: 1,
    title: 'New Order',
    message: 'You have a new order #ORD-12345',
    time: '5 minutes ago',
    icon: 'bag-check',
    type: 'success',
    read: false
  },
  {
    id: 2,
    title: 'Low Stock Alert',
    message: 'Product "Blue Pen" is running low on stock',
    time: '1 hour ago',
    icon: 'exclamation-triangle',
    type: 'warning',
    read: false
  },
  {
    id: 3,
    title: 'New Customer',
    message: 'John Doe just registered',
    time: '2 hours ago',
    icon: 'person-plus',
    type: 'info',
    read: false
  }
])

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const handleLogout = () => {
  authStore.logout()
  router.push('/signin')
}
</script>

<style scoped>
.admin-navbar {
  background: linear-gradient(135deg, #0d1228 0%, #1a2642 100%) !important;
  border-bottom: 3px solid #d4af37;
  min-height: 70px;
  position: sticky;
  top: 0;
  z-index: 1030;
}

/* Logo Section */
.logo-wrapper {
  position: relative;
}

.logo-img {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
  border: 2px solid #d4af37;
}

.brand-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-text {
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  line-height: 1;
}

.brand-subtitle {
  color: #d4af37;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Icon Buttons */
.btn-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all 0.3s;
  position: relative;
}

.btn-icon:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: #d4af37;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

/* Notification Badge */
.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
  border: 2px solid #0d1228;
  min-width: 20px;
  text-align: center;
}

/* User Button */
.user-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 6px 12px;
  color: white;
  transition: all 0.3s;
}

.user-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: #d4af37;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #0d1228;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  line-height: 1;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
}

.user-role {
  font-size: 0.7rem;
  color: #d4af37;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Dropdown Menu */
.dropdown-menu {
  margin-top: 0.75rem;
  border-radius: 12px;
  overflow: hidden;
  min-width: 260px;
}

.dropdown-header {
  background: #f8f9fa;
  padding: 1rem;
}

.dropdown-item {
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background: #f3f4f6;
  padding-left: 1.5rem;
}

.dropdown-item i {
  width: 20px;
}

/* Mobile Sidebar */
.admin-sidebar {
  background: linear-gradient(135deg, #0d1228 0%, #1a2642 100%) !important;
  width: 320px;
}

.logo-img-mobile {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 2px solid #d4af37;
}

.user-avatar-mobile {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #0d1228;
}

/* Notifications Panel */
.notifications-panel {
  position: fixed;
  top: 80px;
  right: 20px;
  width: 360px;
  max-height: 500px;
  background: white;
  border-radius: 16px;
  z-index: 1040;
  display: flex;
  flex-direction: column;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 2px solid #f3f4f6;
}

.notifications-body {
  flex: 1;
  overflow-y: auto;
  max-height: 400px;
}

.notification-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.2s;
  cursor: pointer;
}

.notification-item:hover {
  background: #f9fafb;
}

.notification-item.unread {
  background: #eff6ff;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  font-size: 0.875rem;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.notification-message {
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.notification-time {
  font-size: 0.7rem;
  color: #9ca3af;
}

.notifications-footer {
  padding: 0.75rem 1.25rem;
  border-top: 2px solid #f3f4f6;
  text-align: center;
}

/* Responsive */
@media (max-width: 991px) {
  .notifications-panel {
    right: 10px;
    left: 10px;
    width: auto;
  }
}

@media (max-width: 576px) {
  .admin-navbar {
    min-height: 60px;
  }

  .logo-img {
    width: 40px;
    height: 40px;
  }
}
</style>
