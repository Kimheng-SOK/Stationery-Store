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
    <div class="table-responsive border-top">
      <table class="table table-sm table-borderless align-middle">
        <thead class="table-light mb-2">
          <tr class="border-bottom">
            <th class="text-uppercase text-muted small fw-semibold">Name</th>
            <th class="text-uppercase text-muted small fw-semibold">Phone Number</th>
            <th class="text-uppercase text-muted small fw-semibold">Email Address</th>
            <th class="text-uppercase text-muted small fw-semibold">Member Since</th>
            <th class="text-uppercase text-muted small fw-semibold">Purchased Items</th>
            <th class="text-uppercase text-muted small fw-semibold">Reward Point</th>
            <th class="text-uppercase text-muted small fw-semibold">Actions</th>
          </tr>
        </thead>
        <tbody class="mb-2 table-group-divider">
          <tr
            v-for="customer in displayedCustomers"
            :key="customer.id"
            class="user-row border-bottom hover-bg-light"
          >
            <td class="small">
              <div class="d-flex align-items-center gap-3">
                <img
                  :src="customer.avatar"
                  :alt="customer.name"
                  class="rounded-circle"
                  style="width: 30px; height: 30px; object-fit: cover"
                />
                <span class="fw-semibold">{{ customer.name }}</span>
              </div>
            </td>
            <td class="small">{{ customer.phone }}</td>
            <td class="small">{{ customer.email }}</td>
            <td class="small">{{ customer.memberSince }}</td>
            <td class="small">
              <span class="text-danger">{{ customer.purchasedItems }} Items</span>
            </td>
            <td class="small">{{ customer.rewardPoints }}</td>
            <td class="small">
              <button class="btn btn-sm btn-outline-danger">View Profile</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="d-flex justify-content-end align-items-center mt-auto gap-2 pt-2 border-top">
      <button
        class="btn btn-link btn-sm text-decoration-none text-muted"
        :disabled="currentPage === 1"
        @click="previousPage"
      >
        Prev
      </button>
      <nav aria-label="Page navigation">
        <ul class="pagination pagination-sm mb-0">
          <li v-for="page in totalPages" :key="page" class="page-item">
            <button
              :class="['page-link', { active: page === currentPage }]"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </li>
        </ul>
      </nav>
      <button
        class="btn btn-link btn-sm text-decoration-none text-muted"
        :disabled="currentPage === totalPages"
        @click="nextPage"
      >
        Next
      </button>
    </div>
  </div>
</template>

<style scoped>
.user-row {
  height: 44px; /* Fixed height for each row */
}
</style>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { customerDataService } from '@/stores/customerData'

export interface Customer {
  id: string
  name: string
  phone: string
  email: string
  memberSince: string
  purchasedItems: number
  rewardPoints: number
  avatar: string
}

const customers = ref<Customer[]>([])
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalCustomers = ref(0)
const isLoading = ref(false)

const totalPages = computed(() => Math.ceil(totalCustomers.value / pageSize.value))

// const displayedCustomers = computed(() => {
//   if (searchQuery.value) {
//     return customers.value
//   }
//   const start = (currentPage.value - 1) * pageSize.value
//   const end = start + pageSize.value
//   return customers.value.slice(start, end)
// })

const displayedCustomers = computed(() => customers.value)

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
