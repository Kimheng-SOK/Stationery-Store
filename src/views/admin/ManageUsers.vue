<template>
  <div class="d-flex flex-column bg-white rounded px-4 h-100 py-3 shadow-sm">
    <!-- Header Section -->
    <div class="mb-3 border-bottom pb-2">
      <div class="d-flex justify-content-between align-items-center gap-3">
        <h1 class="h5 fw-semibold mb-0">All Customers ({{ totalCustomers }})</h1>
        <div class="position-relative" style="width: 280px">
          <i
            class="bi bi-search position-absolute start-0 top-50 translate-middle-y ps-2 text-secondary"
            style="font-size: 1rem"
          ></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, email or phone"
            class="form-control form-control-sm ps-5"
            @input="handleSearch"
          />
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="table-responsive border-top rounded-2 border bg-white">
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
                <!-- Avatar with fallback to grey default -->
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
              <span class="px-4 py-3 text-danger">{{ customer.purchasedItems }} Items</span>
            </td>
            <td class="px-4 py-3 text-dark small">{{ customer.rewardPoints }}</td>
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

<style scoped>
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
</style>

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
