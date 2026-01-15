<template>
  <div class="profile-page">
    <div class="container py-4">
      <div class="row g-4">
        <div class="col-lg-3 col-md-4">
          <ProfileSidebar />
        </div>

        <main class="col-lg-9 col-md-8">
          <div class="info-card">
            <div class="info-card-header">
              <h5 class="mb-0">Notification Preferences</h5>
            </div>
            <div class="info-card-body">
              <div class="notification-item" v-for="setting in notificationSettings" :key="setting.id">
                <div class="notification-info">
                  <div class="d-flex align-items-center mb-2">
                    <i :class="setting.icon" class="notification-icon me-3"></i>
                    <h6 class="mb-0">{{ setting.title }}</h6>
                  </div>
                  <p class="text-muted mb-0 small">{{ setting.description }}</p>
                </div>
                <label class="toggle-switch">
                  <input 
                    v-model="setting.enabled" 
                    type="checkbox"
                    @change="handleToggle(setting)"
                  >
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProfileSidebar from '@/components/ProfileSidebar.vue'

interface NotificationSetting {
  id: string
  title: string
  description: string
  icon: string
  enabled: boolean
}

const notificationSettings = ref<NotificationSetting[]>([
  {
    id: 'order',
    title: 'Order Updates',
    description: 'Get notified about your order status changes',
    icon: 'bi bi-box-seam',
    enabled: true
  },
  {
    id: 'promo',
    title: 'Promotions & Offers',
    description: 'Receive special offers and promotional emails',
    icon: 'bi bi-tag',
    enabled: true
  },
  {
    id: 'newsletter',
    title: 'Newsletter',
    description: 'Weekly newsletter with new products and tips',
    icon: 'bi bi-envelope',
    enabled: false
  },
  {
    id: 'wishlist',
    title: 'Wishlist Alerts',
    description: 'Get notified when wishlist items go on sale',
    icon: 'bi bi-heart',
    enabled: true
  }
])

const handleToggle = (setting: NotificationSetting) => {
  console.log(`${setting.title} is now ${setting.enabled ? 'enabled' : 'disabled'}`)
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-top: 2rem;
}

.info-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.info-card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.info-card-body {
  padding: 1.5rem;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background-color: #f8f9fa;
}

.notification-info {
  flex: 1;
  padding-right: 1rem;
}

.notification-icon {
  font-size: 1.75rem;
  color: #141B3E;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 27, 62, 0.1);
  border-radius: 10px;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
  margin: 0;
  cursor: pointer;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 30px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.toggle-switch input:checked + .toggle-slider {
  background-color: #141B3E;
}

.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(30px);
}

.toggle-switch:hover .toggle-slider {
  box-shadow: 0 0 8px rgba(20, 27, 62, 0.3);
}

@media (max-width: 768px) {
  .notification-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .notification-info {
    padding-right: 0;
  }

  .toggle-switch {
    align-self: flex-end;
  }
}
</style>