<template>
  <div class="manage-users-container">
    <div class="users-card">
      <!-- Enhanced Header Section -->
      <div class="card-header bg-white border-0">
        <div class="container-fluid">
          <div class="row align-items-center">
            <div class="col-md-6 mb-3 mb-md-0">
              <div class="d-flex align-items-center gap-3">
                <div class="icon-box">
                  <i class="bi bi-people"></i>
                </div>
                <div>
                  <h2 class="header-title mb-1">Manage Customers</h2>
                  <p class="text-muted mb-0 small">View and manage customer accounts</p>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="d-flex gap-2 justify-content-md-end">
                <div class="search-box flex-grow-1 flex-md-grow-0">
                  <i class="bi bi-search search-icon"></i>
                  <input
                    v-model="searchQuery"
                    type="text"
                    class="search-input"
                    placeholder="Search by name, email or phone"
                    @input="handleSearch"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Stats Section -->
      <div class="stats-section">
        <div class="container-fluid">
          <div class="row g-3">
            <div class="col-sm-6 col-xl-3">
              <div class="stat-card stat-total">
                <div class="stat-card-inner">
                  <div class="stat-icon-wrapper">
                    <div class="stat-icon">
                      <i class="bi bi-people"></i>
                    </div>
                  </div>
                  <div class="stat-content">
                    <div class="stat-label">Total Customers</div>
                    <div class="stat-value">{{ totalCustomers }}</div>
                    <div class="stat-badge">
                      <i class="bi bi-person-check"></i>
                      <span>All Users</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-sm-6 col-xl-3">
              <div class="stat-card stat-active">
                <div class="stat-card-inner">
                  <div class="stat-icon-wrapper">
                    <div class="stat-icon">
                      <i class="bi bi-person-check-fill"></i>
                    </div>
                  </div>
                  <div class="stat-content">
                    <div class="stat-label">Active Members</div>
                    <div class="stat-value">{{ stats.activeMembers }}</div>
                    <div class="stat-badge">
                      <i class="bi bi-arrow-up"></i>
                      <span>This Month</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-sm-6 col-xl-3">
              <div class="stat-card stat-orders">
                <div class="stat-card-inner">
                  <div class="stat-icon-wrapper">
                    <div class="stat-icon">
                      <i class="bi bi-bag-check-fill"></i>
                    </div>
                  </div>
                  <div class="stat-content">
                    <div class="stat-label">Total Orders</div>
                    <div class="stat-value">{{ stats.totalOrders }}</div>
                    <div class="stat-badge">
                      <i class="bi bi-graph-up"></i>
                      <span>Purchases</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-sm-6 col-xl-3">
              <div class="stat-card stat-rewards">
                <div class="stat-card-inner">
                  <div class="stat-icon-wrapper">
                    <div class="stat-icon">
                      <i class="bi bi-star-fill"></i>
                    </div>
                  </div>
                  <div class="stat-content">
                    <div class="stat-label">Reward Points</div>
                    <div class="stat-value">{{ stats.totalRewards }}</div>
                    <div class="stat-badge">
                      <i class="bi bi-award"></i>
                      <span>Earned</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="table-responsive rounded-2 border border-top bg-white">
        <table class="table table-hover mb-0">
          <thead>
            <tr class="table-light">
              <th class="px-2 py-3 text-uppercase text-muted small fw-semibold">Name</th>
              <th class="px-4 py-3 text-uppercase text-muted small fw-semibold">Phone Number</th>
              <th class="px-4 py-3 text-uppercase text-muted small fw-semibold">Email Address</th>
              <th class="px-4 py-3 text-uppercase text-muted small fw-semibold">Member Since</th>
              <th class="px-4 py-3 text-uppercase text-muted small fw-semibold">Purchased Items</th>
              <th class="px-4 py-3 text-uppercase text-muted small fw-semibold">Reward Point</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="customer in displayedCustomers"
              :key="customer.id"
              class="user-row border-bottom hover-bg-light align-middle"
              style="cursor: pointer"
              @click="showProfile(customer)"
            >
              <td class="px-2 py-3">
                <div class="d-flex align-items-center gap-3">
                  <div
                    v-if="!customer.avatar"
                    class="rounded-circle bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center"
                    style="width: 40px; height: 40px"
                  >
                    <i class="bi bi-person-fill text-secondary" style="font-size: 1.2rem"></i>
                  </div>
                  <img
                    v-else
                    :src="customer.avatar"
                    :alt="customer.name"
                    class="rounded-circle"
                    style="width: 40px; height: 40px; object-fit: cover"
                  />
                  <span class="fw-medium text-dark text-sm mb-0">{{ customer.name }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-dark small">{{ customer.phone }}</td>
              <td class="px-4 py-3 text-dark small">{{ customer.email }}</td>
              <td class="px-4 py-3 text-dark small">{{ customer.memberSince }}</td>
              <td class="px-4 py-3 text-dark small">
                <span class="badge bg-primary">{{ customer.purchasedItems }} Items</span>
              </td>
              <td class="px-4 py-3 text-dark small">
                <span class="badge bg-warning text-dark">{{ customer.rewardPoints }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="d-flex justify-content-center align-items-center mt-4 gap-2 pt-2 border-top">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="btn btn-sm btn-outline-secondary"
        >
          <i class="bi bi-caret-left-fill"></i>
          <span class="ms-0.5">PREV</span>
        </button>
        <div class="d-flex align-items-center gap-1">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
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
          <span class="ms-0.5">NEXT</span>
          <i class="bi bi-caret-right-fill"></i>
        </button>
      </div>
    </div>

    <!-- Profile Modal -->
    <div
      v-if="showModal"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.6)"
      @click.self="closeModal"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg" style="max-width: 800px">
        <div class="modal-content border-0 shadow-lg" style="border-radius: 16px; overflow: hidden">

          <!-- Profile Header Section with Dark Navy Background -->
          <div class="position-relative" style="background: linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%); padding: 40px 50px">
            <button
              type="button"
              class="btn-close btn-close-white position-absolute top-0 end-0 m-3"
              @click="closeModal"
              aria-label="Close"
            ></button>

            <div class="d-flex align-items-center gap-4" v-if="selectedCustomer">
              <!-- Avatar with Camera Icon and fallback to grey default -->
              <div class="position-relative">
                <!-- Default grey avatar if no image -->
                <div
                  v-if="!selectedCustomer.avatar"
                  class="rounded-circle bg-light d-flex align-items-center justify-content-center border border-4 border-white"
                  style="width: 140px; height: 140px"
                >
                  <i class="bi bi-person-fill text-secondary" style="font-size: 4rem"></i>
                </div>
                <!-- User avatar if exists -->
                <img
                  v-else
                  :src="selectedCustomer.avatar"
                  :alt="selectedCustomer.name"
                  class="rounded-circle border border-4 border-white"
                  style="width: 140px; height: 140px; object-fit: cover"
                />

              </div>

              <!-- Name and Email -->
              <div class="text-white">
                <h3 class="fw-bold mb-2">{{ selectedCustomer.name }}</h3>
                <p class="mb-0 opacity-75">{{ selectedCustomer.email }}</p>
              </div>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="modal-body p-4" v-if="selectedCustomer" style="background-color: #f8f9fa">

            <!-- Stats Cards -->
            <div class="row g-3 mb-4">
              <div class="col-6">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-body p-4">
                    <div class="d-flex align-items-start gap-3">
                      <div class="bg-primary bg-opacity-10 rounded-3 p-3">
                        <i class="bi bi-bag-check-fill text-primary" style="font-size: 1.5rem"></i>
                      </div>
                      <div>
                        <h2 class="fw-bold mb-0">{{ selectedCustomer.purchasedItems }}</h2>
                        <p class="text-muted mb-0 small">Total Orders</p>
                        <p class="text-success mb-0 small fw-semibold">+3 this month</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-6">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-body p-4">
                    <div class="d-flex align-items-start gap-3">
                      <div class="bg-success bg-opacity-10 rounded-3 p-3">
                        <i class="bi bi-wallet-fill text-success" style="font-size: 1.5rem"></i>
                      </div>
                      <div>
                        <h2 class="fw-bold mb-0">${{ (selectedCustomer.rewardPoints * 0.4).toFixed(0) }}</h2>
                        <p class="text-muted mb-0 small">Total Spent</p>
                        <p class="text-muted mb-0 small">Gold Member Status</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Personal Information Card -->
            <div class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <h5 class="fw-bold mb-0">Personal Information</h5>
                </div>

                <div class="row g-4">
                  <!-- Full Name -->
                  <div class="col-md-6">
                    <label class="text-muted small mb-2 d-block">Full Name</label>
                    <div class="d-flex align-items-center gap-2">
                      <i class="bi bi-person-fill text-muted"></i>
                      <span class="fw-medium">{{ selectedCustomer.name }}</span>
                    </div>
                  </div>

                  <!-- Email Address -->
                  <div class="col-md-6">
                    <label class="text-muted small mb-2 d-block">Email Address</label>
                    <div class="d-flex align-items-center gap-2">
                      <i class="bi bi-envelope-fill text-muted"></i>
                      <span class="fw-medium">{{ selectedCustomer.email }}</span>
                    </div>
                  </div>

                  <!-- Phone Number -->
                  <div class="col-md-6">
                    <label class="text-muted small mb-2 d-block">Phone Number</label>
                    <div class="d-flex align-items-center gap-2">
                      <i class="bi bi-telephone-fill text-muted"></i>
                      <span class="fw-medium">{{ selectedCustomer.phone }}</span>
                    </div>
                  </div>

                  <!-- Member Since -->
                  <div class="col-md-6">
                    <label class="text-muted small mb-2 d-block">Member Since</label>
                    <div class="d-flex align-items-center gap-2">
                      <i class="bi bi-calendar-check-fill text-muted"></i>
                      <span class="fw-medium">{{ selectedCustomer.memberSince }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Customer } from '@/types/customer'
import { customerDataService } from '@/stores/customerService'

const customers = ref<Customer[]>([])
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalCustomers = ref(0)
const isLoading = ref(false)
const showModal = ref(false)
const selectedCustomer = ref<Customer | null>(null)

const totalPages = computed(() => Math.ceil(totalCustomers.value / pageSize.value))
const displayedCustomers = computed(() => customers.value)

// Add stats computed property
const stats = computed(() => ({
  activeMembers: customers.value.filter(c => c.purchasedItems > 0).length,
  totalOrders: customers.value.reduce((sum, c) => sum + c.purchasedItems, 0),
  totalRewards: customers.value.reduce((sum, c) => sum + c.rewardPoints, 0)
}))

const showProfile = (customer: Customer) => {
  selectedCustomer.value = customer
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedCustomer.value = null
}

const handleSearch = async () => {
  isLoading.value = true
  try {
    if (searchQuery.value.trim()) {
      const results = await customerDataService.searchCustomers(searchQuery.value)
      customers.value = results
      totalCustomers.value = results.length
      currentPage.value = 1
    } else {
      await loadCustomers(1)
    }
  } finally {
    isLoading.value = false
  }
}

const loadCustomers = async (page: number) => {
  isLoading.value = true
  try {
    const response = await customerDataService.getCustomers(page, pageSize.value)
    customers.value = response.data
    totalCustomers.value = response.total
    currentPage.value = page
  } finally {
    isLoading.value = false
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    loadCustomers(currentPage.value + 1)
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    loadCustomers(currentPage.value - 1)
  }
}

const goToPage = (page: number) => {
  loadCustomers(page)
}

// Initial load
loadCustomers(1)
</script>

<style scoped>
.manage-users-container {
  padding: 1.5rem;
  background: #f8f9fa;
  min-height: 100vh;
}

.users-card {
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
  width: 320px;
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

.stat-total { color: #3b82f6; }
.stat-active { color: #10b981; }
.stat-orders { color: #f59e0b; }
.stat-rewards { color: #8b5cf6; }

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
}

.stat-total .stat-icon {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.stat-active .stat-icon {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.stat-orders .stat-icon {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.stat-rewards .stat-icon {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
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

.user-row {
  height: 44px;
}

.modal.show {
  display: block;
}

.card {
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .header-title {
    font-size: 1.5rem;
  }

  .icon-box {
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .search-box {
    width: 100%;
  }
}
</style>
