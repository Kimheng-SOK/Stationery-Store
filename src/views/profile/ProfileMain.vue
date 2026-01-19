<template>
  <div class="profile-page">
    <div class="container py-4">
      <div class="row g-4">
        <!-- Sidebar -->
        <div class="col-lg-3 col-md-4">
          <ProfileSidebar />
        </div>

        <!-- Main Content -->
        <main class="col-lg-9 col-md-8">
          <!-- Profile Header Card -->
          <div class="profile-header-card mb-4">
            <div class="profile-cover">
              
              <div class="profile-info-on-cover">
                <div class="profile-avatar-wrapper">
                  <img 
                    :src="user.avatar" 
                    alt="Profile"
                    class="profile-avatar"
                  >
                  <button class="avatar-edit-btn" @click="triggerFileUpload">
                    <i class="bi bi-camera-fill"></i>
                  </button>
                  <input 
                    ref="fileInput" 
                    type="file" 
                    accept="image/*" 
                    @change="handleAvatarUpload" 
                    style="display: none;"
                  />
                </div>
                <div class="profile-text-info">
                  <h3 class="profile-name">{{ user.name }}</h3>
                  <p class="profile-email">{{ user.email }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Stats Cards -->
          <div class="row g-3 mb-4">
            <div class="col-md-6">
              <div class="stat-card">
                <div class="stat-icon bg-primary">
                  <i class="bi bi-bag-check"></i>
                </div>
                <div class="stat-content">
                  <h3 class="stat-value">{{ user.stats.totalOrders }}</h3>
                  <p class="stat-label">Total Orders</p>
                  <small class="text-success">+3 this month</small>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="stat-card">
                <div class="stat-icon bg-success">
                  <i class="bi bi-wallet2"></i>
                </div>
                <div class="stat-content">
                  <h3 class="stat-value">${{ user.stats.totalSpent }}</h3>
                  <p class="stat-label">Total Spent</p>
                  <small class="text-muted">Gold Member Status</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Personal Information Card -->
          <div class="info-card mb-4">
            <div class="info-card-header">
              <h5 class="mb-0">Personal Information</h5>
              <button class="btn btn-sm btn-outline-secondary" @click="goToEdit">
                <i class="bi bi-pencil me-1"></i>Edit
              </button>
            </div>
            <div class="info-card-body">
              <div class="row g-4">
                <div class="col-md-6">
                  <div class="info-item">
                    <label class="info-label">Full Name</label>
                    <div class="info-value">
                      <i class="bi bi-person me-2 text-muted"></i>
                      {{ user.name }}
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="info-item">
                    <label class="info-label">Email Address</label>
                    <div class="info-value">
                      <i class="bi bi-envelope me-2 text-muted"></i>
                      {{ user.email }}
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="info-item">
                    <label class="info-label">Phone Number</label>
                    <div class="info-value">
                      <i class="bi bi-telephone me-2 text-muted"></i>
                      {{ user.phone }}
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="info-item">
                    <label class="info-label">Member Since</label>
                    <div class="info-value">
                      <i class="bi bi-calendar-check me-2 text-muted"></i>
                      {{ user.memberSince }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Orders -->
          <div class="info-card">
            <div class="info-card-header">
              <h5 class="mb-0">Recent Orders</h5>
              <router-link to="/profile/orders" class="btn btn-sm btn-link">View All</router-link>
            </div>
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in recentOrders" :key="order.id">
                    <td><strong>{{ order.id }}</strong></td>
                    <td>{{ order.date }}</td>
                    <td>{{ order.items }} items</td>
                    <td><strong>${{ order.total }}</strong></td>
                    <td>
                      <span class="badge" :class="getStatusClass(order.status)">
                        {{ order.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ProfileSidebar from '@/components/ProfileSidebar.vue'

interface User {
  name: string
  email: string
  phone: string
  avatar: string
  memberSince: string
  stats: {
    totalOrders: number
    totalSpent: number
  }
}

interface Order {
  id: string
  date: string
  items: number
  total: number
  status: string
}

const router = useRouter()
const fileInput = ref<HTMLInputElement | null>(null)

const user = ref<User>({
  name: 'Robert Ford',
  email: 'robertford@gmail.com',
  phone: '(+855) 111 222 333',
  avatar: 'https://i.pravatar.cc/150?img=12',
  memberSince: 'November 2025',
  stats: {
    totalOrders: 10,
    totalSpent: 1000
  }
})

const recentOrders = ref<Order[]>([
  {
    id: '#ORD2024001',
    date: 'Dec 28, 2024',
    items: 3,
    total: 127.50,
    status: 'Delivered'
  },
  {
    id: '#ORD2024002',
    date: 'Dec 25, 2024',
    items: 2,
    total: 85.00,
    status: 'Processing'
  },
  {
    id: '#ORD2024003',
    date: 'Dec 20, 2024',
    items: 1,
    total: 45.00,
    status: 'Shipped'
  }
])

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleAvatarUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      user.value.avatar = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const goToEdit = () => {
  router.push('/profile/edit')
}

const getStatusClass = (status: string) => {
  const statusMap: Record<string, string> = {
    'Delivered': 'bg-success',
    'Processing': 'bg-warning text-dark',
    'Shipped': 'bg-info',
    'Cancelled': 'bg-danger'
  }
  return statusMap[status] || 'bg-secondary'
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-top: 2rem;
}

.profile-header-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.profile-cover {
  height: 200px;
  background: #141B3E;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 2rem;
}

.profile-info-on-cover {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
}

.profile-avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid white;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.avatar-edit-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #0d6efd;
  color: white;
  border: 3px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-edit-btn:hover {
  background: #0b5ed7;
  transform: scale(1.1);
}

.profile-text-info {
  color: white;
}

.profile-name {
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
  line-height: 1.2;
}

.profile-email {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.stat-content {
  flex-grow: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: #212529;
}

.stat-label {
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.info-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow: hidden;
}

.info-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.info-card-body {
  padding: 1.5rem;
}

.info-label {
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
  display: block;
}

.info-value {
  font-size: 1rem;
  color: #212529;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.table thead th {
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  color: #6c757d;
  border-bottom: 2px solid #e9ecef;
  padding: 1rem;
}

.table tbody td {
  padding: 1rem;
  vertical-align: middle;
}

@media (max-width: 768px) {
  .profile-info-on-cover {
    flex-direction: column;
    align-items: flex-start;
    padding-top: 2rem;
  }

  .profile-cover {
    height: auto;
    min-height: 250px;
    padding: 2rem 1.5rem;
  }

  .profile-name {
    font-size: 1.5rem;
  }
}
</style>