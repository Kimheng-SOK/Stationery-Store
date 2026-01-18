<template>
  <div class="profile-page">
    <div class="container py-4">
      <div class="row g-4">
        <!-- Sidebar Navigation -->
        <div class="col-lg-3 col-md-4">
          <ProfileSidebar />
        </div>

        <!-- Main Content -->
        <main class="col-lg-9 col-md-8">
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
                <span v-if="tab.count" class="badge bg-primary ms-2">{{ tab.count }}</span>
              </button>
            </div>
          </div>

          <!-- Orders List -->
          <div class="info-card">
            <div v-if="filteredOrders.length === 0" class="empty-state">
              <h4>No orders found</h4>
              <p class="text-muted">You haven't placed any orders yet</p>
            </div>

            <div v-else class="orders-list">
              <div v-for="order in filteredOrders" :key="order.id" class="order-card">
                <div class="order-header">
                  <div>
                    <h6 class="order-id mb-1">{{ order.id }}</h6>
                    <small class="text-muted">{{ order.date }}</small>
                  </div>
                  <span class="badge" :class="getStatusClass(order.status)">
                    {{ order.status }}
                  </span>
                </div>
                
                <div class="order-items">
                  <div v-for="item in order.items" :key="item.id" class="order-item">
                    <div class="item-details">
                      <div class="item-name">{{ item.name }}</div>
                      <div class="item-meta">Qty: {{ item.quantity }} × ${{ item.price }}</div>
                    </div>
                    <div class="item-total">${{ (item.quantity * item.price).toFixed(2) }}</div>
                  </div>
                </div>

                <div class="order-footer">
                  <div class="order-total">
                    <span>Total:</span>
                    <strong>${{ order.total.toFixed(2) }}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProfileSidebar from '@/components/ProfileSidebar.vue'

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

const activeTab = ref('all')

const tabs = [
  { label: 'All Orders', value: 'all', count: 5 },
  { label: 'Processing', value: 'processing', count: 2 },
  { label: 'Shipped', value: 'shipped', count: 1 },
  { label: 'Delivered', value: 'delivered', count: 2 }
]

const orders = ref<Order[]>([
  {
    id: '#ORD2024001',
    date: 'Dec 28, 2024',
    status: 'Delivered',
    total: 127.50,
    items: [
      { id: 1, name: 'Premium Notebook', price: 29.99, quantity: 2 },
      { id: 2, name: 'Gel Pen Set', price: 15.50, quantity: 3 }
    ]
  },
  {
    id: '#ORD2024002',
    date: 'Dec 25, 2024',
    status: 'Processing',
    total: 85.00,
    items: [
      { id: 3, name: 'Art Supplies Kit', price: 45.00, quantity: 1 },
      { id: 4, name: 'Markers Pack', price: 20.00, quantity: 2 }
    ]
  }
])

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return orders.value
  return orders.value.filter(order => order.status.toLowerCase() === activeTab.value)
})

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
  padding: 0.5rem 1rem;
  border: 1px solid #dee2e6;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-tab:hover {
  background: #f8f9fa;
}

.filter-tab.active {
  background: #0d6efd;
  color: white;
  border-color: #0d6efd;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.orders-list {
  padding: 1.5rem;
}

.order-card {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.order-id {
  font-weight: 700;
  margin: 0;
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
}

.item-meta {
  font-size: 0.875rem;
  color: #6c757d;
}

.item-total {
  font-weight: 700;
  color: #0d6efd;
}

.order-footer {
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.order-total {
  font-size: 1.125rem;
}

.order-total strong {
  font-size: 1.5rem;
  margin-left: 0.5rem;
}
</style>