<template>
  <aside class="profile-sidebar">
    <nav class="nav flex-column">
      <router-link 
        v-for="item in menuItems" 
        :key="item.id"
        :to="item.route"
        class="nav-link"
        :class="{ 'logout-link': item.id === 'logout' }"
        @click="item.id === 'logout' ? handleLogout($event) : null"
      >
        <img :src="item.icon" :alt="item.label" class="nav-icon" />
        <span>{{ item.label }}</span>
        <span v-if="item.badge" class="badge bg-danger ms-auto">{{ item.badge }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

const router = useRouter();

const menuItems = ref<MenuItem[]>([
  { id: 'profile', label: 'My Profile', icon: '/images/icons/profile.jpg', route: '/profile' },
  { id: 'orders', label: 'My Orders', icon: '/images/icons/orders.jpg', route: '/profile/orders', badge: 2 },
  { id: 'wishlist', label: 'Wishlist', icon: '/images/icons/wishlist.jpg', route: '/profile/wishlist' },
  { id: 'address', label: 'Address', icon: '/images/icons/address.jpg', route: '/profile/address' },
  { id: 'payment', label: 'Payment Methods', icon: '/images/icons/payment.jpg', route: '/profile/payment' },
  { id: 'notification', label: 'Notification', icon: '/images/icons/notification.jpg', route: '/profile/notification' },
  { id: 'setting', label: 'Setting', icon: '/images/icons/setting.jpg', route: '/profile/settings' },
  { id: 'logout', label: 'Logout', icon: '/images/icons/logout.jpg', route: '#' }
]);

const handleLogout = (event: Event) => {
  event.preventDefault();
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('user');
    router.push('/login');
  }
};
</script>

<style scoped>
.profile-sidebar {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  position: sticky;
  top: 100px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.875rem 1rem;
  color: #6c757d;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  text-decoration: none;
  position: relative;
}

.nav-icon {
  width: 24px;
  height: 24px;
  margin-right: 0.75rem;
  object-fit: contain;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: #f8f9fa;
  color: #212529;
}
.nav-link.router-link-active:not(.logout-link) {
  background-color: #141B3E;
  color: white;
}
.nav-link.router-link-active:not(.logout-link) .nav-icon {
}

.logout-link {
  color: #dc3545;
  margin-top: 1rem;
  border-top: 1px solid #e9ecef;
  padding-top: 1.5rem;
}

.logout-link:hover {
  background-color: #dc3545;
  color: white;
}

.logout-link:hover .nav-icon {
  filter: brightness(0) invert(1);
}

.badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

@media (max-width: 768px) {
  .profile-sidebar {
    position: static;
    margin-bottom: 1.5rem;
  }
}
</style>