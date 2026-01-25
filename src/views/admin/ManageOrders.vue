<template>
  <div class="manage-orders-container">
    <div class="orders-card">
      <!-- Enhanced Header Section -->
      <div class="card-header bg-white border-0">
        <div class="container-fluid">
          <div class="row align-items-center">
            <div class="col-md-6 mb-3 mb-md-0">
              <div class="d-flex align-items-center gap-3">
                <div class="icon-box">
                  <i class="bi bi-box-seam"></i>
                </div>
                <div>
                  <h2 class="header-title mb-1">Manage Orders</h2>
                  <p class="text-muted mb-0 small">Track and manage all your orders</p>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="d-flex gap-2 justify-content-md-end">
                <div class="search-box flex-grow-1 flex-md-grow-0">
                  <i class="bi bi-search search-icon"></i>
                  <input
                    type="text"
                    class="search-input"
                    placeholder="Search orders..."
                    v-model="searchQuery"
                  />
                  <button v-if="searchQuery" class="clear-search" @click="searchQuery = ''">
                    <i class="bi bi-x"></i>
                  </button>
                </div>
                <button class="btn btn-theme btn-refresh d-flex align-items-center gap-2" @click="fetchOrders" :disabled="loading">
                  <i class="bi bi-arrow-clockwise" :class="{ 'spin': loading }"></i>
                  <span class="d-none d-lg-inline">Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Stats Cards -->
      <div class="stats-section">
        <div class="container-fluid">
          <div class="row g-3">
            <div class="col-sm-6 col-xl-3">
              <div class="stat-card stat-pending">
                <div class="stat-card-inner">
                  <div class="stat-icon-wrapper">
                    <div class="stat-icon">
                      <i class="bi bi-clock-history"></i>
                    </div>
                  </div>
                  <div class="stat-content">
                    <div class="stat-label">Pending Orders</div>
                    <div class="stat-value">{{ stats.pending }}</div>
                    <div class="stat-badge">
                      <i class="bi bi-arrow-up"></i>
                      <span class="badge bg-primary rounded-pill">{{ orders.length }} Total</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-sm-6 col-xl-3">
              <div class="stat-card stat-progress">
                <div class="stat-card-inner">
                  <div class="stat-icon-wrapper">
                    <div class="stat-icon">
                      <i class="bi bi-truck"></i>
                    </div>
                  </div>
                  <div class="stat-content">
                    <div class="stat-label">In Progress</div>
                    <div class="stat-value">{{ stats.inProgress }}</div>
                    <div class="stat-badge">
                      <i class="bi bi-graph-up"></i>
                      <span>Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-sm-6 col-xl-3">
              <div class="stat-card stat-completed">
                <div class="stat-card-inner">
                  <div class="stat-icon-wrapper">
                    <div class="stat-icon">
                      <i class="bi bi-check-circle"></i>
                    </div>
                  </div>
                  <div class="stat-content">
                    <div class="stat-label">Completed</div>
                    <div class="stat-value">{{ stats.completed }}</div>
                    <div class="stat-badge">
                      <i class="bi bi-check2"></i>
                      <span>Done</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-sm-6 col-xl-3">
              <div class="stat-card stat-cancelled">
                <div class="stat-card-inner">
                  <div class="stat-icon-wrapper">
                    <div class="stat-icon">
                      <i class="bi bi-x-circle"></i>
                    </div>
                  </div>
                  <div class="stat-content">
                    <div class="stat-label">Cancelled</div>
                    <div class="stat-value">{{ stats.cancelled }}</div>
                    <div class="stat-badge">
                      <i class="bi bi-x"></i>
                      <span>Void</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="filter-bar">
        <div class="filter-group">
          <label class="filter-label">Status:</label>
          <select v-model="filterStatus" class="filter-select">
            <option value="">All Orders</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div class="results-count">
          Showing <strong>{{ filteredAndSortedOrders.length }}</strong> of <strong>{{ orders.length }}</strong> orders
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner-border text-primary mb-3" role="status"></div>
        <p class="text-muted">Loading orders...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredAndSortedOrders.length === 0" class="empty-state">
        <i class="bi bi-inbox display-1 text-muted mb-3"></i>
        <h5 class="text-muted">No orders found</h5>
        <p class="text-muted mb-0">{{ searchQuery ? 'Try adjusting your search' : 'No orders available yet' }}</p>
      </div>

      <!-- Table Section -->
      <div v-else class="orders-table">
        <!-- Table Header -->
        <div class="table-header">
          <div class="col-product-name">Product</div>
          <div class="col-order-id">Order ID</div>
          <div class="col-customer">Customer</div>
          <div class="col-amount sortable" @click="sortBy('amount')">
            <span>Amount</span>
            <i v-if="sortField === 'amount'" :class="sortOrder === 'asc' ? 'bi bi-sort-up' : 'bi bi-sort-down'"></i>
            <i v-else class="bi bi-arrow-down-up text-muted"></i>
          </div>
          <div class="col-order-date">Order Date</div>
          <div class="col-delivery-date sortable" @click="sortBy('deliveryDate')">
            <span>Delivery</span>
            <i v-if="sortField === 'deliveryDate'" :class="sortOrder === 'asc' ? 'bi bi-sort-up' : 'bi bi-sort-down'"></i>
            <i v-else class="bi bi-arrow-down-up text-muted"></i>
          </div>
          <div class="col-status">Status</div>
          <div class="col-actions">Actions</div>
        </div>

        <!-- Table Body -->
        <div class="table-body">
          <div
            v-for="order in filteredAndSortedOrders"
            :key="order._id"
            class="table-row"
            :class="{ 'editing': editingOrderId === order._id }"
            @dblclick="viewOrderDetails(order)"
            :title="editingOrderId !== order._id ? 'Double-click to view details' : ''"
            style="cursor: pointer;"
          >
            <!-- Product Name Column -->
            <div class="col-product-name">
              <div class="product-info">
                <img :src="order.productImage || '/placeholder.jpg'" :alt="order.productName" class="product-image" />
                <div class="product-details">
                  <div class="product-name text-truncate" style="max-width: 150px;" :title="order.productName">
                    {{ order.productName }}
                  </div>
                  <div class="product-quantity">
                    <i class="bi bi-box me-1"></i>Qty: {{ order.quantity }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Order # Column -->
            <div class="col-order-id" data-label="Order ID">
              <span class="order-number text-truncate d-inline-block" style="max-width: 120px;" :title="order.orderNumber">
                <i class="bi bi-hash"></i>{{ order.orderNumber }}
              </span>
            </div>

            <!-- Customer Column -->
            <div class="col-customer" data-label="Customer">
              <div class="customer-info">
                <div class="customer-name text-truncate" style="max-width: 150px;" :title="order.customerName">
                  <i class="bi bi-person-fill me-1"></i>{{ order.customerName }}
                </div>
                <div class="customer-location text-truncate" style="max-width: 150px;" :title="order.customerLocation">
                  <i class="bi bi-geo-alt me-1"></i>{{ order.customerLocation }}
                </div>
              </div>
            </div>

            <!-- Amount Column -->
            <div class="col-amount" data-label="Amount">
              <span class="amount">${{ order.totalAmount.toFixed(2) }}</span>
            </div>

            <!-- Order Date Column -->
            <div class="col-order-date" data-label="Order Date">
              <div class="date-info">
                <div class="date-text">
                  <i class="bi bi-calendar3 me-1"></i>{{ formatDate(order.orderDate) }}
                </div>
                <div class="time-text">
                  <i class="bi bi-clock me-1"></i>{{ order.orderTime }}
                </div>
              </div>
            </div>

            <!-- Delivery Date Column -->
            <div class="col-delivery-date" data-label="Delivery Date">
              <div class="date-info" v-if="editingOrderId !== order._id">
                <div class="date-text">
                  <i class="bi bi-truck me-1"></i>{{ formatDate(order.deliveryDate) }}
                </div>
                <div class="time-text">{{ order.deliveryTime }}</div>
              </div>
              <div class="date-edit-form" v-else>
                <input
                  type="date"
                  v-model="editDeliveryDate"
                  :min="today"
                  class="form-control form-control-sm"
                />
                <input
                  type="text"
                  v-model="editDeliveryTime"
                  class="form-control form-control-sm mt-1"
                  placeholder="10:00 AM - 6:00 PM"
                />
              </div>
            </div>

            <!-- Status Column -->
            <div class="col-status" data-label="Status">
              <span v-if="editingOrderId !== order._id" :class="['status-badge', `status-${order.status}`]">
                <i :class="getStatusIcon(order.status)"></i>
                {{ formatStatus(order.status) }}
              </span>
              <select v-else class="form-select form-select-sm" v-model="editStatus">
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <!-- Actions Column -->
            <div class="col-actions">
              <template v-if="editingOrderId === order._id">
                <div class="btn-group btn-group-sm" role="group">
                  <button
                    type="button"
                    class="btn btn-success"
                    @click="saveOrderChanges(order._id)"
                    :disabled="updating"
                    title="Save Changes"
                  >
                    <i class="bi bi-check-lg"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-secondary"
                    @click="cancelEdit"
                    title="Cancel"
                  >
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>
              </template>
              <template v-else>
                <div class="btn-group btn-group-sm" role="group">
                  <button
                    type="button"
                    class="btn btn-outline-primary"
                    @click.stop="startEdit(order)"
                    title="Edit Order"
                  >
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-danger"
                    @click.stop="confirmDelete(order)"
                    title="Delete Order"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </template>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- View Details Modal - Bootstrap Offcanvas with Theme Colors -->
    <div
      v-if="showDetailsModal"
      class="offcanvas offcanvas-end show"
      tabindex="-1"
      id="detailsOffcanvas"
      style="visibility: visible;"
    >
      <div class="offcanvas-header border-bottom theme-bg-gradient text-white">
        <h5 class="offcanvas-title fw-bold">
          <i class="bi bi-info-circle me-2"></i>Order Details
        </h5>
        <button
          type="button"
          class="btn-close btn-close-white"
          @click="showDetailsModal = false"
        ></button>
      </div>
      <div class="offcanvas-body p-0" v-if="selectedOrder">
        <!-- Order Header -->
        <div class="p-4 bg-light border-bottom">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h6 class="text-muted small mb-1">ORDER NUMBER</h6>
              <h5 class="fw-bold theme-text">{{ selectedOrder.orderNumber }}</h5>
            </div>
            <span :class="['badge', `bg-${getStatusColor(selectedOrder.status)}`, 'p-2']">
              <i :class="getStatusIcon(selectedOrder.status)"></i>
              {{ formatStatus(selectedOrder.status) }}
            </span>
          </div>
        </div>

        <!-- Details Sections -->
        <div class="p-4">
          <!-- Order Information Card - Enhanced -->
          <div class="card border-0 bg-light mb-3 theme-card">
            <div class="card-header bg-white border-0 p-3">
              <h6 class="fw-bold theme-text mb-0">
                <i class="bi bi-receipt me-2"></i>Order Information
              </h6>
            </div>
            <div class="card-body p-3">
              <div class="row g-3">
                <div class="col-12">
                  <small class="text-muted d-block mb-1">Order Date</small>
                  <div class="fw-semibold">
                    <i class="bi bi-calendar3 me-2 theme-text"></i>
                    {{ formatDate(selectedOrder.orderDate) }} at {{ selectedOrder.orderTime }}
                  </div>
                </div>
                <div class="col-12">
                  <small class="text-muted d-block mb-1">Payment Method</small>
                  <div class="fw-semibold">
                    <i class="bi bi-credit-card me-2 theme-gold"></i>
                    <span class="text-capitalize">{{ selectedOrder.paymentMethod }}</span>
                  </div>
                </div>
                <div class="col-12">
                  <small class="text-muted d-block mb-1">Shipping Method</small>
                  <div class="fw-semibold">
                    <i :class="selectedOrder.shippingMethod === 'pickup' ? 'bi bi-shop me-2' : 'bi bi-truck me-2'" class="theme-text"></i>
                    <span class="text-capitalize">
                      {{ selectedOrder.shippingMethod === 'pickup' ? 'Store Pickup' : 'Home Delivery' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Product Information Card -->
          <div class="card border-0 bg-light mb-3 theme-card">
            <div class="card-header bg-white border-0 p-3">
              <h6 class="fw-bold theme-text mb-0">
                <i class="bi bi-box-seam me-2"></i>Product Information
              </h6>
            </div>
            <div class="card-body p-3">
              <div class="d-flex gap-3 mb-3">
                <img
                  :src="selectedOrder.productImage || '/placeholder.jpg'"
                  alt="Product"
                  class="rounded"
                  style="width: 80px; height: 80px; object-fit: cover; border: 2px solid #0d1228;"
                />
                <div class="flex-grow-1">
                  <h6 class="fw-bold mb-1">{{ selectedOrder.productName }}</h6>
                  <small class="text-muted d-block mb-2">
                    <i class="bi bi-box me-1"></i>Quantity: {{ selectedOrder.quantity }}
                  </small>
                  <div class="fw-bold theme-gold">
                    <i class="bi bi-tag me-1"></i>${{ selectedOrder.amount.toFixed(2) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pricing Information Card - New -->
          <div class="card border-0 bg-light mb-3 theme-card">
            <div class="card-header bg-white border-0 p-3">
              <h6 class="fw-bold theme-text mb-0">
                <i class="bi bi-calculator me-2"></i>Price Breakdown
              </h6>
            </div>
            <div class="card-body p-3">
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Subtotal</span>
                <span class="fw-semibold">${{ (selectedOrder.subtotal || selectedOrder.amount).toFixed(2) }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Shipping</span>
                <span :class="selectedOrder.shippingCost > 0 ? 'fw-semibold' : 'text-success fw-semibold'">
                  {{ selectedOrder.shippingCost > 0 ? '$' + selectedOrder.shippingCost.toFixed(2) : 'Free' }}
                </span>
              </div>
              <div v-if="selectedOrder.couponCode" class="d-flex justify-content-between mb-2">
                <span class="text-muted">
                  Coupon ({{ selectedOrder.couponCode }})
                  <span class="badge bg-success ms-1">-{{ selectedOrder.discountPercent }}%</span>
                </span>
                <span class="text-danger fw-semibold">-${{ (selectedOrder.discountAmount || 0).toFixed(2) }}</span>
              </div>
              <hr class="my-2">
              <div class="d-flex justify-content-between">
                <span class="fw-bold theme-text">Total Amount</span>
                <span class="fw-bold theme-gold fs-5">${{ (selectedOrder.totalAmount || selectedOrder.amount).toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <!-- Customer Information Card -->
          <div class="card border-0 bg-light mb-3 theme-card">
            <div class="card-header bg-white border-0 p-3">
              <h6 class="fw-bold theme-text mb-0">
                <i class="bi bi-person me-2"></i>Customer Information
              </h6>
            </div>
            <div class="card-body p-3">
              <div class="row g-2">
                <div class="col-12">
                  <small class="text-muted d-block mb-1">Customer Name</small>
                  <div class="fw-semibold">
                    <i class="bi bi-person-fill me-2 theme-text"></i>
                    {{ selectedOrder.customerName }}
                  </div>
                </div>
                <div class="col-12">
                  <small class="text-muted d-block mb-1">Location</small>
                  <div class="fw-semibold">
                    <i class="bi bi-geo-alt me-2 text-danger"></i>
                    {{ selectedOrder.customerLocation }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Delivery Information Card -->
          <div class="card border-0 bg-light mb-4 theme-card">
            <div class="card-header bg-white border-0 p-3">
              <h6 class="fw-bold theme-text mb-0">
                <i class="bi bi-truck me-2"></i>Delivery Information
              </h6>
            </div>
            <div class="card-body p-3">
              <div class="row g-2">
                <div class="col-12">
                  <small class="text-muted d-block mb-1">Delivery Date</small>
                  <div class="fw-semibold">
                    <i class="bi bi-calendar-check me-2 theme-gold"></i>
                    {{ formatDate(selectedOrder.deliveryDate) }}
                  </div>
                </div>
                <div class="col-12">
                  <small class="text-muted d-block mb-1">Delivery Time</small>
                  <div class="fw-semibold">
                    <i class="bi bi-clock me-2 text-secondary"></i>
                    {{ selectedOrder.deliveryTime || 'Not specified' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="offcanvas-footer border-top p-3 d-flex gap-2 bg-white">
        <button
          type="button"
          class="btn btn-secondary flex-grow-1"
          @click="showDetailsModal = false"
        >
          <i class="bi bi-x-lg me-2"></i>Close
        </button>
        <button
          type="button"
          class="btn theme-btn flex-grow-1"
          @click="startEditFromDetails"
        >
          <i class="bi bi-pencil me-2"></i>Edit Order
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal - Bootstrap Modal -->
    <div
      v-if="showDeleteModal"
      class="modal fade show d-block"
      tabindex="-1"
      style="background: rgba(0, 0, 0, 0.5);"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header border-0 bg-danger text-white">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-exclamation-triangle me-2"></i>Confirm Deletion
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="showDeleteModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <p class="mb-3">Are you sure you want to delete this order?</p>
            <div class="alert alert-warning d-flex align-items-center mb-0">
              <i class="bi bi-exclamation-circle me-3 fs-5"></i>
              <div>
                <strong>Order #{{ deletingOrder?.orderNumber }}</strong><br>
                <small>This action cannot be undone.</small>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0 p-3 bg-light">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showDeleteModal = false"
            >
              <i class="bi bi-x me-1"></i>Cancel
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="deleteOrder"
            >
              <i class="bi bi-trash me-1"></i>Delete Order
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

interface Order {
  _id: string
  orderNumber: string
  productName: string
  productImage: string
  quantity: number
  customerName: string
  customerLocation: string
  amount: number
  shippingMethod: 'shipping' | 'pickup'
  shippingCost: number
  couponCode: string
  discountPercent: number
  discountAmount: number
  subtotal: number
  totalAmount: number
  paymentMethod: 'card' | 'cash' | 'qr'
  orderDate: string
  orderTime: string
  deliveryDate: string
  deliveryTime: string
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
}

// State
const orders = ref<Order[]>([])
const loading = ref(false)
const updating = ref(false)
const searchQuery = ref('')
const filterStatus = ref('')
const showDetailsModal = ref(false)
const selectedOrder = ref<Order | null>(null)
const showDeleteModal = ref(false)
const deletingOrder = ref<Order | null>(null)

// Sorting state
const sortField = ref<'amount' | 'deliveryDate' | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')

// Edit state
const editingOrderId = ref<string | null>(null)
const editStatus = ref<string>('pending')
const editDeliveryDate = ref('')
const editDeliveryTime = ref('')

// Stats
const stats = computed(() => ({
  pending: orders.value.filter(o => o.status === 'pending').length,
  inProgress: orders.value.filter(o => o.status === 'in-progress').length,
  completed: orders.value.filter(o => o.status === 'completed').length,
  cancelled: orders.value.filter(o => o.status === 'cancelled').length
}))

// Computed
const filteredOrders = computed(() => {
  let result = orders.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (order) =>
        order.productName.toLowerCase().includes(query) ||
        order.orderNumber.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query),
    )
  }

  // Filter by status
  if (filterStatus.value) {
    result = result.filter(order => order.status === filterStatus.value)
  }

  return result
})

const filteredAndSortedOrders = computed(() => {
  let result = [...filteredOrders.value]

  if (sortField.value === 'amount') {
    result.sort((a, b) => {
      const aVal = a.amount
      const bVal = b.amount
      return sortOrder.value === 'asc' ? aVal - bVal : bVal - aVal
    })
  } else if (sortField.value === 'deliveryDate') {
    result.sort((a, b) => {
      const aDate = new Date(a.deliveryDate).getTime()
      const bDate = new Date(b.deliveryDate).getTime()
      return sortOrder.value === 'asc' ? aDate - bDate : bDate - aDate
    })
  }

  return result
})

// Fetch Orders from API
const fetchOrders = async () => {
  loading.value = true
  try {
    const { data } = await axios.get(`${API_URL}/orders`)
    orders.value = data.data
  } catch (error: any) {
    console.error('Failed to fetch orders:', error)
    alert(error.response?.data?.message || 'Failed to fetch orders')
  } finally {
    loading.value = false
  }
}

// Methods
const sortBy = (field: 'amount' | 'deliveryDate') => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'in-progress': 'In Progress',
    'completed': 'Completed',
    'pending': 'Pending',
    'cancelled': 'Cancelled',
  }
  return statusMap[status] || status
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const startEdit = (order: Order) => {
  editingOrderId.value = order._id
  editStatus.value = order.status
  editDeliveryDate.value = order.deliveryDate.split('T')[0]
  editDeliveryTime.value = order.deliveryTime
}

const saveOrderChanges = async (orderId: string) => {
  updating.value = true
  try {
    const { data } = await axios.put(`${API_URL}/orders/${orderId}`, {
      status: editStatus.value,
      deliveryDate: editDeliveryDate.value,
      deliveryTime: editDeliveryTime.value
    })

    const orderIndex = orders.value.findIndex((o) => o._id === orderId)
    if (orderIndex !== -1) {
      orders.value[orderIndex] = data.data
    }

    editingOrderId.value = null
    console.log('Order updated successfully!')
  } catch (error: any) {
    console.error('Failed to update order:', error)
    alert(error.response?.data?.message || 'Failed to update order')
  } finally {
    updating.value = false
  }
}

const cancelEdit = () => {
  editingOrderId.value = null
}

const confirmDelete = (order: Order) => {
  deletingOrder.value = order
  showDeleteModal.value = true
}

const deleteOrder = async () => {
  if (!deletingOrder.value) return

  try {
    await axios.delete(`${API_URL}/orders/${deletingOrder.value._id}`)
    orders.value = orders.value.filter(o => o._id !== deletingOrder.value!._id)
    showDeleteModal.value = false
    deletingOrder.value = null
    // Show success toast
    console.log('Order deleted successfully!')
  } catch (error: any) {
    console.error('Failed to delete order:', error)
    alert(error.response?.data?.message || 'Failed to delete order')
  }
}

const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    'pending': 'bi bi-clock-history',
    'in-progress': 'bi bi-truck',
    'completed': 'bi bi-check-circle-fill',
    'cancelled': 'bi bi-x-circle-fill'
  }
  return icons[status] || 'bi bi-circle'
}

const viewOrderDetails = (order: Order) => {
  selectedOrder.value = order
  showDetailsModal.value = true
}

const startEditFromDetails = () => {
  if (selectedOrder.value) {
    showDetailsModal.value = false
    startEdit(selectedOrder.value)
  }
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'pending': 'primary',
    'in-progress': 'warning',
    'completed': 'success',
    'cancelled': 'danger'
  }
  return colors[status] || 'secondary'
}

const today = computed(() => {
  const now = new Date()
  return now.toISOString().split('T')[0]
})

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.manage-orders-container {
  padding: 1.5rem;
  background: #f8f9fa;
  min-height: 100vh;
}

.orders-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

/* Enhanced Header Section */
.card-header {
  padding: 2rem 0;
  border-bottom: 1px solid #e9ecef !important;
}

.icon-box {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0d1228 0%, #1a2642 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.header-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0d1228;
  margin: 0;
}

/* Search Box */
.search-box {
  position: relative;
  width: 280px;
}

.search-input {
  width: 100%;
  padding: 0.625rem 2.5rem 0.625rem 2.75rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  background: #f8f9fa;
  font-size: 0.875rem;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #0d1228;
  background: white;
  box-shadow: 0 0 0 4px rgba(13, 18, 40, 0.1);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 1rem;
}

.clear-search {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: #999;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  line-height: 1;
  border-radius: 6px;
  transition: all 0.2s;
}

.clear-search:hover {
  background: #f3f4f6;
  color: #666;
}

.btn-theme {
  background: linear-gradient(135deg, #0d1228 0%, #1a2642 100%);
  border: none;
  color: white;
  padding: 0.625rem 1.25rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-theme:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 18, 40, 0.3);
  background: linear-gradient(135deg, #1a2642 0%, #0d1228 100%);
  color: white;
}

.btn-theme:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Enhanced Stats Section */
.stats-section {
  padding: 2rem 0;
  background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
  border-bottom: 1px solid #e9ecef;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  height: 100%;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, transparent 0%, currentColor 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: transparent;
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-pending { color: #3b82f6; }
.stat-progress { color: #f59e0b; }
.stat-completed { color: #10b981; }
.stat-cancelled { color: #ef4444; }

.stat-card-inner {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.stat-icon-wrapper {
  flex-shrink: 0;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  position: relative;
}

.stat-pending .stat-icon {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.stat-progress .stat-icon {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.stat-completed .stat-icon {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.stat-cancelled .stat-icon {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #0d1228;
  line-height: 1;
  margin-bottom: 0.75rem;
}

.stat-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.stat-badge i {
  font-size: 0.875rem;
}

/* Filter Bar */
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  margin: 0;
}

.filter-select {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.results-count {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Loading & Empty States */
.loading-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

/* Table Section */
.orders-table {
  overflow-x: auto;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1.2fr 1.5fr 0.8fr 1fr 1fr 1fr 1.2fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #6b7280;
  letter-spacing: 0.5px;
}

.table-body {
  min-height: 400px;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1.2fr 1.5fr 0.8fr 1fr 1fr 1fr 1.2fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
  align-items: center;
  transition: all 0.2s;
  border-left: 3px solid transparent;
  cursor: pointer;
  user-select: none;
}

.table-row:hover:not(.editing) {
  background: #f9fafb;
  border-left-color: #667eea;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.table-row.editing {
  background: #eff6ff;
  border-left-color: #3b82f6;
  cursor: default;
}

.table-row:active:not(.editing) {
  transform: scale(0.995);
}

.sortable {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s;
  user-select: none;
}

.sortable:hover {
  color: #667eea;
}

/* Product Column */
.product-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
  border: 1px solid #e9ecef;
}

.product-name {
  font-weight: 600;
  font-size: 0.875rem;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.product-quantity {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Order Number */
.order-number {
  font-size: 0.8rem;
  font-weight: 600;
  color: #667eea;
  font-family: monospace;
}

/* Customer Column */
.customer-name {
  font-weight: 600;
  font-size: 0.875rem;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.customer-location {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Amount */
.amount {
  font-weight: 700;
  font-size: 0.9rem;
  color: #1f2937;
}

/* Date Info */
.date-text {
  font-size: 0.8rem;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.time-text {
  font-size: 0.7rem;
  color: #6b7280;
}

/* Status Badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  white-space: nowrap;
}

.status-pending {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.status-in-progress {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.status-completed {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.status-cancelled {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item strong {
  color: #6b7280;
  font-size: 0.875rem;
  min-width: 140px;
}

/* Action Buttons Group */
.btn-group {
  display: flex;
  gap: 0;
}

.btn-group .btn {
  border-radius: 0;
  flex: 1;
}

.btn-group .btn:first-child {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}

.btn-group .btn:last-child {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}

/* Offcanvas Styling */
.offcanvas {
  width: 450px !important;
}

.offcanvas-header {
  border-bottom: 2px solid rgba(13, 18, 40, 0.1);
}

.offcanvas-footer {
  border-top: 2px solid rgba(13, 18, 40, 0.1);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

@media (max-width: 576px) {
  .offcanvas {
    width: 100% !important;
  }
}

/* Responsive */
@media (max-width: 1200px) {
  .table-header,
  .table-row {
    grid-template-columns: 1.8fr 1fr 1.3fr 0.7fr 0.9fr 0.9fr 0.9fr 1fr;
    gap: 0.75rem;
  }
}

@media (max-width: 992px) {
  .card-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .header-left {
    justify-content: space-between;
  }

  .header-actions {
    width: 100%;
  }

  .search-box {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .filter-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .table-header {
    display: none;
  }

  .table-row {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 1.25rem;
    border-left: 3px solid #667eea;
  }

  .table-row > div::before {
    content: attr(data-label);
    font-weight: 700;
    font-size: 0.75rem;
    color: #6b7280;
    text-transform: uppercase;
    display: block;
    margin-bottom: 0.375rem;
  }

  .col-product-name::before {
    display: none;
  }
}

@media (max-width: 576px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .product-image {
    width: 60px;
    height: 60px;
  }
}
</style>

/* Theme Colors */
.theme-text {
  color: #0d1228 !important;
}

.theme-gold {
  color: #d4af37 !important;
}

.theme-bg-gradient {
  background: #0d1228 !important;
}

.theme-btn {
  background: #0d1228 !important;
  border: none;
  color: white;
  transition: all 0.3s ease;
}

.theme-btn:hover {
  background: #1a2642 !important;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 18, 40, 0.3);
}

.theme-card {
  border-left: 3px solid #0d1228 !important;
  transition: all 0.3s ease;
}

.theme-card:hover {
  box-shadow: 0 4px 12px rgba(13, 18, 40, 0.1);
}

/* Action Buttons - Icon Only */
.btn-group .btn {
  padding: 0.375rem 0.5rem;
  min-width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-group .btn i {
  font-size: 1rem;
}

/* Offcanvas Styling */
.offcanvas {
  width: 450px !important;
}

.offcanvas-header {
  border-bottom: 2px solid #0d1228 !important;
}

.offcanvas-footer {
  border-top: 2px solid #0d1228 !important;
  box-shadow: 0 -2px 10px rgba(13, 18, 40, 0.1);
}

@media (max-width: 576px) {
  .offcanvas {
    width: 100% !important;
  }
}

/* Responsive */
@media (max-width: 1200px) {
  .table-header,
  .table-row {
    grid-template-columns: 1.8fr 1fr 1.3fr 0.7fr 0.9fr 0.9fr 0.9fr 1fr;
    gap: 0.75rem;
  }
}

@media (max-width: 992px) {
  .card-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .header-left {
    justify-content: space-between;
  }

  .header-actions {
    width: 100%;
  }

  .search-box {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .filter-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .table-header {
    display: none;
  }

  .table-row {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 1.25rem;
    border-left: 3px solid #667eea;
  }

  .table-row > div::before {
    content: attr(data-label);
    font-weight: 700;
    font-size: 0.75rem;
    color: #6b7280;
    text-transform: uppercase;
    display: block;
    margin-bottom: 0.375rem;
  }

  .col-product-name::before {
    display: none;
  }
}

@media (max-width: 576px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .product-image {
    width: 60px;
    height: 60px;
  }
}
