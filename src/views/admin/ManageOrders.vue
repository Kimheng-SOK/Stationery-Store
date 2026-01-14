<template>
  <div class="manage-orders-container">
    <div class="orders-card">
      <!-- Header Section -->
      <div class="card-header">
        <h2 class="header-title">In Progress Orders ({{ orders.length }})</h2>
        <div class="search-box">
          <i class="bi bi-search search-icon"></i>
          <input
            type="text"
            class="search-input"
            placeholder="Search by name or order Id"
            v-model="searchQuery"
          />
        </div>
      </div>

      <!-- Table Section -->
      <div class="orders-table">
        <!-- Table Header -->
        <div class="table-header">
          <div class="col-product-name">Product Name</div>
          <div class="col-order-id">Order #</div>
          <div class="col-customer">Customer</div>
          <div class="col-amount sortable" @click="sortBy('amount')">
            Amount
            <span class="sort-icon" v-if="sortField === 'amount'">
              <i :class="sortOrder === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
            </span>
          </div>
          <div class="col-order-date">Order Date</div>
          <div class="col-delivery-date sortable" @click="sortBy('deliveryDate')">
            Delivery Date
            <span class="sort-icon" v-if="sortField === 'deliveryDate'">
              <i :class="sortOrder === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
            </span>
          </div>
          <div class="col-status">Status</div>
          <div class="col-actions">Actions</div>
        </div>

        <!-- Table Body -->
        <div class="table-body">
          <div v-for="order in filteredAndSortedOrders" :key="order.id" class="table-row">
            <!-- Product Name Column -->
            <div class="col-product-name">
              <div class="product-info">
                <img :src="order.productImage" :alt="order.productName" class="product-image" />
                <div class="product-details">
                  <div class="product-name">{{ order.productName }}</div>
                  <div class="product-quantity">Quantity : {{ order.quantity }}</div>
                </div>
              </div>
            </div>

            <!-- Order # Column -->
            <div class="col-order-id" data-label="Order #">
              <span class="order-number">{{ order.orderNumber }}</span>
            </div>

            <!-- Customer Column -->
            <div class="col-customer" data-label="Customer">
              <div class="customer-info">
                <div class="customer-name">{{ order.customerName }}</div>
                <div class="customer-location">{{ order.customerLocation }}</div>
              </div>
            </div>

            <!-- Amount Column -->
            <div class="col-amount" data-label="Amount">
              <span class="amount">${{ order.amount }}</span>
            </div>

            <!-- Order Date Column -->
            <div class="col-order-date" data-label="Order Date">
              <div class="date-info">
                <div class="date-text">{{ order.orderDate }}</div>
                <div class="time-text">{{ order.orderTime }}</div>
              </div>
            </div>

            <!-- Delivery Date Column -->
            <div class="col-delivery-date" data-label="Delivery Date">
              <div class="date-info" v-if="editingOrderId !== order.id">
                <div class="date-text">{{ order.deliveryDate }}</div>
                <div class="time-text">{{ order.deliveryTime }}</div>
              </div>
              <div class="date-edit-form" v-else>
                <input type="date" v-model="editDeliveryDate" class="date-input" />
                <input type="time" v-model="editDeliveryTime" class="time-input" />
              </div>
            </div>

            <!-- Status Column -->
            <div class="col-status" data-label="Status">
              <div class="status-container" v-if="editingOrderId !== order.id">
                <span :class="['status-badge', `status-${order.status}`]">
                  {{ formatStatus(order.status) }}
                </span>
              </div>
              <select v-else class="status-select" v-model="editStatus">
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <!-- Actions Column -->
            <div class="col-actions">
              <template v-if="editingOrderId === order.id">
                <button class="btn-save" @click="saveOrderChanges(order.id)">Save</button>
                <button class="btn-cancel" @click="cancelEdit">Cancel</button>
              </template>
              <template v-else>
                <button class="btn-edit" @click="startEdit(order)">Edit</button>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination Section -->
      <div class="d-flex align-items-center justify-content-center gap-2 mt-4 pt-3 border-top">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="btn btn-sm btn-outline-secondary"
        >
          <i class="bi bi-caret-left-fill"></i>
          <span class="ms-2">PREV</span>
        </button>
        <div class="d-flex align-items-center gap-1">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            :class="['btn btn-sm', currentPage === page ? 'btn-primary' : 'btn-outline-secondary']"
          >
            {{ page }}
          </button>
        </div>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="btn btn-sm btn-outline-secondary"
        >
          <span class="ms-2">NEXT</span>
          <i class="bi bi-caret-right-fill"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { mockOrders } from '@/data/orders'
import type { Order, OrderStatus } from '@/types/order'

// State
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 15
const orders = ref<Order[]>(JSON.parse(JSON.stringify(mockOrders)))

// Sorting state
const sortField = ref<'amount' | 'deliveryDate' | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')

// Edit state
const editingOrderId = ref<number | null>(null)
const editStatus = ref<OrderStatus>('in-progress')
const editDeliveryDate = ref('')
const editDeliveryTime = ref('')

// Computed
const filteredOrders = computed(() => {
  if (!searchQuery.value) {
    return orders.value
  }
  const query = searchQuery.value.toLowerCase()
  return orders.value.filter(
    (order) =>
      order.productName.toLowerCase().includes(query) ||
      order.orderNumber.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query),
  )
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

const totalPages = computed(() => Math.ceil(filteredAndSortedOrders.value.length / itemsPerPage))

// Methods
const sortBy = (field: 'amount' | 'deliveryDate') => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

const formatStatus = (status: OrderStatus): string => {
  const statusMap: Record<OrderStatus, string> = {
    'in-progress': 'In Progress',
    'completed': 'Completed',
    'pending': 'Pending',
    'cancelled': 'Cancelled',
  }
  return statusMap[status]
}

const startEdit = (order: Order) => {
  editingOrderId.value = order.id
  editStatus.value = order.status
  editDeliveryDate.value = order.deliveryDate
  editDeliveryTime.value = order.deliveryTime
}

const saveOrderChanges = (orderId: number) => {
  const orderIndex = orders.value.findIndex((o) => o.id === orderId)
  if (orderIndex !== -1) {
    orders.value[orderIndex].status = editStatus.value
    orders.value[orderIndex].deliveryDate = editDeliveryDate.value
    orders.value[orderIndex].deliveryTime = editDeliveryTime.value
  }
  editingOrderId.value = null
}

const cancelEdit = () => {
  editingOrderId.value = null
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}
</script>

<style scoped>
.manage-orders-container {
  padding: 1.5rem;
  background: #f5f5f5;
  min-height: 100vh;
}

.orders-card {
  background: #fff;
  border-radius: 5px;
  overflow: hidden;
}

/* Header Section */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 1.5625rem;
  border-bottom: 1px solid #f2f2f2;
}

.header-title {
  font-family: 'Source Sans Pro', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1c1a1a;
  margin: 0;
}

.search-box {
  position: relative;
  width: 250px;
}

.search-icon {
  position: absolute;
  left: 0.6875rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
  color: #9b9b9b;
}

.search-input {
  width: 100%;
  height: 34px;
  padding: 0 0.6875rem 0 2.125rem;
  border: 1px solid #ebebeb;
  border-radius: 5px;
  background: #fff;
  font-family: 'Source Sans Pro', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 0.8125rem;
  color: #454545;
}

.search-input::placeholder {
  color: #9b9b9b;
}

.search-input:focus {
  outline: none;
  border-color: #ff4f5a;
}

/* Table Section */
.orders-table {
  width: 100%;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1.3fr 0.8fr 1fr 1fr 0.9fr 1fr;
  gap: 1rem;
  padding: 0.6875rem 1.5625rem;
  background: #f9f9f9;
  border-bottom: 1px solid #f2f2f2;
}

.table-header > div {
  font-family: 'Source Sans Pro', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 0.6875rem;
  font-weight: 600;
  color: #9b9b9b;
  text-transform: uppercase;
}

.sortable {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  user-select: none;
  transition: color 0.2s;
}

.sortable:hover {
  color: #ff4f5a;
}

.sort-icon {
  font-size: 0.625rem;
  display: inline-flex;
  align-items: center;
}

.table-body {
  min-height: 400px;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1.3fr 0.8fr 1fr 1fr 0.9fr 1fr;
  gap: 1rem;
  padding: 0.6875rem 1.5625rem;
  border-bottom: 1px solid #ebebeb;
  align-items: center;
  transition: background-color 0.2s;
}

.table-row:hover {
  background: #fafafa;
}

/* Product Name Column */
.col-product-name .product-info {
  display: flex;
  align-items: center;
  gap: 0.9375rem;
}

.product-image {
  width: 54px;
  height: 54px;
  object-fit: cover;
  border-radius: 3px;
  flex-shrink: 0;
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.product-name {
  font-family: 'Source Sans Pro', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #454545;
  line-height: 1.125rem;
}

.product-quantity {
  font-family: 'Source Sans Pro', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 0.8125rem;
  font-weight: 400;
  color: #454545;
  line-height: 1.125rem;
}

/* Order # Column */
.order-number {
  font-family: 'Source Sans Pro', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 0.8125rem;
  font-weight: 400;
  color: #454545;
  text-align: center;
  display: block;
}

/* Customer Column */
.customer-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.customer-name {
  font-family: 'Source Sans Pro', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 0.8125rem;
  font-weight: 400;
  color: #454545;
}

.customer-location {
  font-family: 'Source Sans Pro', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 0.75rem;
  font-weight: 400;
  color: #9b9b9b;
}

/* Amount Column */
.amount {
  font-family: 'Source Sans Pro', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 0.8125rem;
  font-weight: 400;
  color: #454545;
  text-align: center;
  display: block;
}

/* Date Columns */
.date-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.date-text {
  font-family: 'Source Sans Pro', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 0.8125rem;
  font-weight: 400;
  color: #454545;
}

.time-text {
  font-family: 'Source Sans Pro', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 0.75rem;
  font-weight: 400;
  color: #9b9b9b;
}

.date-edit-form {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.date-input,
.time-input {
  padding: 0.375rem 0.5rem;
  border: 1px solid #ff4f5a;
  border-radius: 3px;
  font-family: 'Source Sans Pro', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 0.75rem;
  color: #454545;
}

.date-input:focus,
.time-input:focus {
  outline: none;
  border-color: #ff4f5a;
  box-shadow: 0 0 0 2px rgba(255, 79, 90, 0.1);
}

/* Status Column */
.status-container {
  display: flex;
  justify-content: center;
}

.status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-family: 'Source Sans Pro', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-in-progress {
  background: rgba(255, 193, 7, 0.15);
  color: #ffc107;
}

.status-completed {
  background: rgba(76, 175, 80, 0.15);
  color: #4caf50;
}

.status-pending {
  background: rgba(33, 150, 243, 0.15);
  color: #2196f3;
}

.status-cancelled {
  background: rgba(244, 67, 54, 0.15);
  color: #f44336;
}

.status-select {
  padding: 0.375rem 0.5rem;
  border: 1px solid #ff4f5a;
  border-radius: 3px;
  font-family: 'Source Sans Pro', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 0.75rem;
  color: #454545;
  background: #fff;
  cursor: pointer;
}

.status-select:focus {
  outline: none;
  border-color: #ff4f5a;
  box-shadow: 0 0 0 2px rgba(255, 79, 90, 0.1);
}

/* Actions Column */
.btn-edit,
.btn-save,
.btn-cancel {
  padding: 0.375rem 0.75rem;
  border: 1px solid #ff4f5a;
  border-radius: 3px;
  background: #fff;
  color: #ff4f5a;
  font-family: 'Source Sans Pro', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-edit:hover,
.btn-save:hover {
  background: #ff4f5a;
  color: #fff;
}

.btn-cancel {
  background: #f5f5f5;
  border-color: #d0d0d0;
  color: #454545;
  margin-left: 0.5rem;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .table-header,
  .table-row {
    grid-template-columns: 1.6fr 0.9fr 1.1fr 0.7fr 0.9fr 0.9fr 0.8fr 0.9fr;
    gap: 0.75rem;
  }

  .product-image {
    width: 48px;
    height: 48px;
  }
}

@media (max-width: 992px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .search-box {
    width: 100%;
  }

  .table-header {
    display: none;
  }

  .table-row {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 1rem 1.5625rem;
    position: relative;
  }

  .table-row::before {
    content: '';
    position: absolute;
    left: 1.5625rem;
    right: 1.5625rem;
    top: 0;
    height: 1px;
    background: #ebebeb;
  }

  .col-product-name,
  .col-order-id,
  .col-customer,
  .col-amount,
  .col-order-date,
  .col-delivery-date,
  .col-status,
  .col-actions {
    display: flex;
    align-items: center;
  }

  .col-order-id::before,
  .col-customer::before,
  .col-amount::before,
  .col-order-date::before,
  .col-delivery-date::before,
  .col-status::before {
    content: attr(data-label);
    font-family: 'Source Sans Pro', -apple-system, Roboto, Helvetica, sans-serif;
    font-size: 0.6875rem;
    font-weight: 600;
    color: #9b9b9b;
    text-transform: uppercase;
    width: 120px;
    flex-shrink: 0;
  }

  .col-order-id {
    justify-content: flex-start;
  }

  .order-number {
    text-align: left;
  }

  .amount {
    text-align: left;
  }

  .btn-edit,
  .btn-save,
  .btn-cancel {
    width: 100%;
    margin-left: 0 !important;
  }

  .status-container {
    justify-content: flex-start;
  }
}

@media (max-width: 576px) {
  .manage-orders-container {
    padding: 1rem;
  }

  .card-header {
    padding: 0.75rem 1rem;
  }

  .table-row {
    padding: 0.875rem 1rem;
  }

  .table-row::before {
    left: 1rem;
    right: 1rem;
  }

  .header-title {
    font-size: 1rem;
  }

  .product-image {
    width: 42px;
    height: 42px;
  }
}
</style>
