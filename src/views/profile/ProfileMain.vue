<template>
  <div class="profile-page">
    <div class="container py-4">
      <div class="row g-4">
        <main class="col-12">
          <!-- Profile Header Card -->
          <div class="profile-header-card mb-4">
            <div class="profile-cover">
              <div class="profile-info-on-cover">
                <div class="profile-avatar-wrapper">
                  <div v-if="!user.avatar" class="profile-avatar-placeholder">
                    {{ getInitials(user.name) }}
                  </div>
                  <img
                    v-else
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
                  <h3 class="stat-value">{{ stats.totalOrders }}</h3>
                  <p class="stat-label">Total Orders</p>
                  <small class="text-success" v-if="stats.recentOrders > 0">+{{ stats.recentOrders }} this month</small>
                  <small class="text-muted" v-else>No recent orders</small>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="stat-card">
                <div class="stat-icon bg-success">
                  <i class="bi bi-wallet2"></i>
                </div>
                <div class="stat-content">
                  <h3 class="stat-value">${{ stats.totalSpent.toFixed(2) }}</h3>
                  <p class="stat-label">Total Spent</p>
                  <small class="text-muted">{{ getMemberStatus() }}</small>
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
                      {{ user.phone || 'Not provided' }}
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="info-item">
                    <label class="info-label">Date of Birth</label>
                    <div class="info-value">
                      <i class="bi bi-calendar-check me-2 text-muted"></i>
                      {{ formatDateOfBirth(user.dateOfBirth) }}
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="info-item">
                    <label class="info-label">Address</label>
                    <div class="info-value">
                      <i class="bi bi-geo-alt me-2 text-muted"></i>
                      {{ user.address || 'Not provided' }}
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="info-item">
                    <label class="info-label">Member Since</label>
                    <div class="info-value">
                      <i class="bi bi-calendar-check me-2 text-muted"></i>
                      {{ formatDate(user.createdAt) }}
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
            <div v-if="recentOrders.length === 0" class="empty-orders">
              <i class="bi bi-cart-x"></i>
              <h5 class="mt-3 mb-2">No Orders Yet</h5>
              <p class="text-muted mb-3">Start shopping to see your orders here</p>
              <router-link to="/shop" class="btn btn-primary btn-sm">
                <i class="bi bi-shop"></i>
                <span>Browse Products</span>
              </router-link>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in recentOrders" :key="order.id">
                    <td>
                      <div class="d-flex align-items-center gap-2">
                        <img
                          :src="order.image || '/placeholder-image.jpg'"
                          :alt="order.productName"
                          class="order-product-image"
                          @error="handleImageError"
                        />
                        <span class="text-truncate" style="max-width: 150px;">
                          {{ order.productName }}
                        </span>
                      </div>
                    </td>
                    <td><strong>{{ order.id }}</strong></td>
                    <td>{{ order.date }}</td>
                    <td>{{ order.items }} items</td>
                    <td><strong>${{ order.total.toFixed(2) }}</strong></td>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

interface ExtendedUser {
  name: string
  email: string
  phone?: string
  avatar?: string
  dateOfBirth?: string
  address?: string
  createdAt?: string
  [key: string]: unknown
}

interface Order {
  id: string
  date: string
  items: number
  total: number
  status: string
  productName?: string
  image?: string
}

const router = useRouter()
const authStore = useAuthStore()
const fileInput = ref<HTMLInputElement | null>(null)
const recentOrders = ref<Order[]>([])
const isLoading = ref(true)

const user = computed(() => {
  const currentUser = authStore.user as ExtendedUser | null
  return currentUser || {
    name: 'Guest User',
    email: 'guest@example.com',
    phone: '',
    avatar: '',
    dateOfBirth: '',
    address: '',
    createdAt: new Date().toISOString()
  }
})

const stats = computed(() => {
  const totalOrders = recentOrders.value.length
  const totalSpent = recentOrders.value.reduce((sum, order) => sum + order.total, 0)
  const now = new Date()
  const thisMonth = recentOrders.value.filter(order => {
    const orderDate = new Date(order.date)
    return orderDate.getMonth() === now.getMonth() &&
           orderDate.getFullYear() === now.getFullYear()
  }).length

  return {
    totalOrders,
    totalSpent,
    recentOrders: thisMonth
  }
})

onMounted(async () => {
  await loadUserOrders()
})

async function loadUserOrders() {
  isLoading.value = true
  try {
    const { data } = await axios.get(`${API_URL}/orders`)

    if (!data.data || !Array.isArray(data.data)) {
      recentOrders.value = []
      return
    }

    const userEmail = user.value.email.toLowerCase()
    const userOrders = data.data.filter((order: any) => {
      const orderEmail = order.customerEmail?.toLowerCase()
      return orderEmail === userEmail
    })

    recentOrders.value = userOrders
      .map((order: any) => ({
        id: order.orderNumber,
        date: new Date(order.orderDate).toISOString(),
        items: order.quantity || 1,
        total: order.totalAmount || order.amount,
        status: formatOrderStatus(order.status),
        productName: order.productName,
        image: order.productImage || '/placeholder-image.jpg'
      }))
      .sort((a: Order, b: Order) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)

  } catch (error) {
    console.error('Failed to load orders:', error)
    recentOrders.value = []
  } finally {
    isLoading.value = false
  }
}

function formatOrderStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'pending': 'Processing',
    'in-progress': 'Shipped',
    'completed': 'Delivered',
    'cancelled': 'Cancelled'
  }
  return statusMap[status] || 'Processing'
}

function getInitials(name: string): string {
  if (!name) return 'U'
  const parts = name.trim().split(' ').filter(part => part.length > 0)

  if (parts.length === 0) return 'U'
  if (parts.length === 1) {
    return parts[0]?.[0]?.toUpperCase() || 'U'
  }

  const firstInitial = parts[0]?.[0]?.toUpperCase() || ''
  const lastInitial = parts[parts.length - 1]?.[0]?.toUpperCase() || ''

  return (firstInitial + lastInitial) || 'U'
}

function getMemberStatus(): string {
  const spent = stats.value.totalSpent
  if (spent >= 1000) return 'Gold Member'
  if (spent >= 500) return 'Silver Member'
  if (spent >= 100) return 'Bronze Member'
  return 'New Member'
}

function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'N/A'
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  } catch {
    return 'N/A'
  }
}

function formatDateOfBirth(dateString?: string): string {
  if (!dateString) return 'Not provided'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Not provided'
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return 'Not provided'
  }
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleAvatarUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64Image = e.target?.result as string
      if (authStore.user) {
        authStore.updateUser({ avatar: base64Image })
      }
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

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-image.jpg'
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.profile-header-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.profile-cover {
  height: 200px;
  background: linear-gradient(135deg, #141B3E 0%, #0d1228 100%);
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

.profile-avatar, .profile-avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.profile-avatar {
  object-fit: cover;
}

.profile-avatar-placeholder {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  text-transform: uppercase;
}

.avatar-edit-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #141B3E;
  color: white;
  border: 3px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-edit-btn:hover {
  background: #0d1228;
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

.bg-primary {
  background-color: #141B3E !important;
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

.info-card-header .btn {
  padding: 0.35rem 0.9rem;
  font-size: 0.85rem;
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

/* CRITICAL: Empty Orders with SMALL button */
.empty-orders {
  text-align: center;
  padding: 3rem 2rem;
}

.empty-orders i {
  font-size: 3.5rem !important;
  opacity: 0.2;
  color: #6c757d;
  margin-bottom: 1rem;
}

.empty-orders h5 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #212529;
}

.empty-orders p {
  font-size: 0.95rem;
  margin-bottom: 1.25rem;
  color: #6c757d;
}

/* CRITICAL: Button MUST be small */
.empty-orders .btn {
  padding: 0.35rem 0.9rem !important;
  font-size: 0.85rem !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 0.35rem !important;
  text-decoration: none !important;
  min-width: auto !important;
  width: auto !important;
}

.empty-orders .btn i {
  font-size: 0.85rem !important;
  margin: 0 !important;
}

.btn-primary {
  background-color: #141B3E !important;
  border-color: #141B3E !important;
}

.btn-primary:hover {
  background-color: #0d1228 !important;
  border-color: #0d1228 !important;
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
    align-items: center;
    text-align: center;
    padding-top: 2rem;
  }

  .profile-cover {
    height: auto;
    min-height: 280px;
    padding: 2rem 1.5rem;
  }

  .profile-name {
    font-size: 1.5rem;
  }

  .profile-avatar, .profile-avatar-placeholder {
    width: 100px;
    height: 100px;
  }

  .profile-avatar-placeholder {
    font-size: 2rem;
  }

  .stat-card {
    padding: 1.25rem;
  }

  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .table-responsive {
    font-size: 0.875rem;
  }

  .table thead th,
  .table tbody td {
    padding: 0.75rem 0.5rem;
  }
}

@media (max-width: 576px) {
  .profile-page {
    padding-top: 1rem;
  }

  .info-card-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .info-card-header .btn {
    width: 100%;
  }
}
</style>
