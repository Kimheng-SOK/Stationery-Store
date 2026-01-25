<template>
  <div class="profile-page">
    <div class="container py-4">
      <!-- Filter Tabs -->
      <div class="info-card mb-3">
        <div class="filter-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.value"
            class="filter-tab"
            :class="{ active: activeTab === tab.value }"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
            <span v-if="getTabCount(tab.value) > 0" class="badge bg-primary ms-2">
              {{ getTabCount(tab.value) }}
            </span>
          </button>
        </div>
      </div>

      <!-- Orders List -->
      <div class="info-card">
        <div v-if="isLoading" class="loading-state">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3">Loading your orders...</p>
        </div>

        <div v-else-if="filteredOrders.length === 0" class="empty-state">
          <i class="bi bi-cart-x"></i>
          <h4>No {{ activeTab !== 'all' ? activeTab : '' }} orders found</h4>
          <p class="text-muted">
            {{ activeTab === 'all' 
              ? "You haven't placed any orders yet" 
              : `You don't have any ${activeTab} orders` 
            }}
          </p>
          <router-link to="/shop" class="btn btn-primary btn-sm">
            <i class="bi bi-shop"></i>
            <span>Start Shopping</span>
          </router-link>
        </div>

        <div v-else class="orders-list">
          <div v-for="order in filteredOrders" :key="order.id" class="order-card">
            <div class="order-header">
              <div>
                <h6 class="order-id mb-1">{{ order.id }}</h6>
                <small class="text-muted">{{ formatDate(order.date) }}</small>
              </div>
              <span class="badge" :class="getStatusClass(order.status)">
                {{ order.status }}
              </span>
            </div>
            
            <div class="order-items">
              <div v-for="item in order.items" :key="item.id" class="order-item">
                <div class="item-details">
                  <div class="item-name">{{ item.name }}</div>
                  <div class="item-meta">Qty: {{ item.quantity }} × ${{ item.price.toFixed(2) }}</div>
                </div>
                <div class="item-total">${{ (item.quantity * item.price).toFixed(2) }}</div>
              </div>
            </div>

            <div class="order-footer">
              <div class="order-total">
                <span>Total:</span>
                <strong>${{ order.total.toFixed(2) }}</strong>
              </div>
              <div class="order-actions">
                <button 
                  class="btn btn-sm btn-outline-primary"
                  @click="viewOrderDetails(order.id)"
                >
                  View Details
                </button>
                <button 
                  v-if="order.status === 'Delivered'"
                  class="btn btn-sm btn-primary"
                  @click="reorder(order.id)"
                >
                  Order Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface Order {
  id: string
  date: string
  status: string
  total: number
  items: OrderItem[]
}

const router = useRouter()
const activeTab = ref('all')
const orders = ref<Order[]>([])
const isLoading = ref(true)

const tabs = [
  { label: 'All Orders', value: 'all' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' }
]

onMounted(async () => {
  await loadOrders()
})

async function loadOrders() {
  try {
    const saved = localStorage.getItem('orders')
    if (saved) {
      orders.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('Failed to load orders:', error)
  } finally {
    isLoading.value = false
  }
}

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return orders.value
  return orders.value.filter(order => 
    order.status.toLowerCase() === activeTab.value.toLowerCase()
  )
})

function getTabCount(tabValue: string): number {
  if (tabValue === 'all') return orders.value.length
  return orders.value.filter(order => 
    order.status.toLowerCase() === tabValue.toLowerCase()
  ).length
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
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

function viewOrderDetails(orderId: string) {
  router.push(`/profile/orders/${orderId}`)
}

function reorder(orderId: string) {
  alert('Reorder functionality coming soon!')
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.container {
  max-width: 1200px;
}

.info-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow: hidden;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  flex-wrap: wrap;
}

.filter-tab {
  padding: 0.4rem 1rem;
  border: 1px solid #dee2e6;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 0.9rem;
}

.filter-tab:hover {
  background: #f8f9fa;
}

.filter-tab.active {
  background: #141B3E;
  color: white;
  border-color: #141B3E;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 3rem 2rem;
}

.empty-state i {
  font-size: 3.5rem !important;
  opacity: 0.2;
  color: #6c757d;
  margin-bottom: 1rem;
}

.empty-state h4 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #212529;
}

.empty-state p {
  font-size: 0.95rem;
  margin-bottom: 1.25rem;
  color: #6c757d;
}

/* CRITICAL: Small button for empty state */
.empty-state .btn {
  padding: 0.35rem 0.9rem !important;
  font-size: 0.85rem !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 0.35rem !important;
  text-decoration: none !important;
  width: auto !important;
}

.empty-state .btn i {
  font-size: 0.85rem !important;
  margin: 0 !important;
}

.orders-list {
  padding: 1.5rem;
}

.order-card {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.order-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border-color: #141B3E;
}

.order-card:last-child {
  margin-bottom: 0;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.order-id {
  font-weight: 700;
  margin: 0;
  color: #212529;
}

.order-items {
  margin-bottom: 1rem;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: background 0.2s;
}

.order-item:hover {
  background: #f8f9fa;
}

.item-details {
  flex: 1;
}

.item-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #212529;
}

.item-meta {
  font-size: 0.875rem;
  color: #6c757d;
}

.item-total {
  font-weight: 700;
  color: #141B3E;
  font-size: 1.1rem;
}

.order-footer {
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-total {
  font-size: 1.125rem;
}

.order-total strong {
  font-size: 1.5rem;
  margin-left: 0.5rem;
  color: #141B3E;
}

.order-actions {
  display: flex;
  gap: 0.5rem;
}

.order-actions .btn {
  padding: 0.35rem 0.9rem;
  font-size: 0.85rem;
}

.btn-primary {
  background-color: #141B3E !important;
  border-color: #141B3E !important;
}

.btn-primary:hover {
  background-color: #0d1228 !important;
  border-color: #0d1228 !important;
}

.btn-outline-primary {
  color: #141B3E;
  border-color: #141B3E;
}

.btn-outline-primary:hover {
  background-color: #141B3E;
  border-color: #141B3E;
  color: white;
}

.bg-primary {
  background-color: #141B3E !important;
}

@media (max-width: 768px) {
  .profile-page {
    padding-top: 1rem;
  }

  .filter-tabs {
    padding: 0.75rem;
  }

  .filter-tab {
    font-size: 0.875rem;
    padding: 0.35rem 0.8rem;
  }

  .orders-list {
    padding: 1rem;
  }

  .order-card {
    padding: 1rem;
  }

  .order-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .order-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .order-actions {
    flex-direction: column;
  }

  .order-actions .btn {
    width: 100%;
  }

  .item-total {
    font-size: 1rem;
  }

  .order-total strong {
    font-size: 1.25rem;
  }
}

@media (max-width: 576px) {
  .order-item {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .item-total {
    align-self: flex-end;
  }
}
</style>