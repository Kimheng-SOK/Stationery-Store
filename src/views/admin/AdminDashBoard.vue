<template>
  <div class="container-fluid py-4 bg-light min-vh-100">
    <!-- Stats Cards -->
    <div class="row g-4 mb-4">
      <div class="col-12 col-md-6 col-xl-3" v-for="(stat, i) in stats" :key="i">
        <div
          class="card shadow-sm border-0 rounded-4 h-100 d-flex flex-row align-items-center p-3 gap-3 stat-hover"
        >
          <div
            :class="[
              'd-flex align-items-center justify-content-center rounded-circle',
              stat.bg,
              'me-2',
            ]"
            style="width: 58px; height: 58px"
          >
            <i :class="['bi', stat.icon, 'fs-2 text-white']"></i>
          </div>
          <div>
            <div class="fw-bold fs-4">{{ stat.value }}</div>
            <div class="text-secondary small">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Section -->
    <ChartSection :dataset="dataset" />

    <!-- Popular Products -->
    <div class="card shadow-sm border-0 rounded-4 mb-4 p-4">
      <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
        <h2 class="h5 mb-0">Popular Product</h2>
        <router-link to="/admin/products" class="text-danger fw-semibold small text-decoration-none"
          >View All</router-link
        >
      </div>
      <div class="row g-3">
        <div class="col-12 col-md-6 col-xl-3" v-for="(prod, i) in products" :key="i">
          <div class="card h-100 border-0 rounded-4 shadow-sm product-hover">
            <div
              class="bg-white d-flex align-items-center justify-content-center rounded-top-4"
              style="height: 180px"
            >
              <img
                :src="prod.imageUrl || prod.image || 'https://via.placeholder.com/120'"
                :alt="prod.name"
                class="img-fluid"
                style="max-height: 120px; object-fit: contain"
              />
            </div>
            <div class="card-body">
              <p class="text-danger text-uppercase small fw-bold mb-1">{{ prod.category?.name || prod.category }}</p>
              <h3 class="h6 fw-semibold mb-2">{{ prod.name }}</h3>
              <div v-if="prod.stock || null" class="d-flex align-items-center gap-2">
                <span class="fw-bold">${{ prod.price }}</span>
                <span class="text-decoration-line-through text-secondary">${{ prod.stock }}</span>
              </div>
              <div v-else class="fw-bold">${{ prod.price }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Customers -->
    <div class="card shadow-sm border-0 rounded-4 mb-4 p-4" style="max-width: 575px">
      <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
        <h2 class="h5 mb-0">New Customers</h2>
        <router-link to="/admin/users" class="text-danger fw-semibold small text-decoration-none"
          >View All</router-link
        >
      </div>
      <div class="d-flex flex-column gap-3">
        <div
          v-for="(cus, i) in customers"
          :key="i"
          class="d-flex align-items-center gap-3 p-2 rounded-3 bg-white shadow-sm customer-hover"
        >
          <img
           :src="cus.avatar || 'https://via.placeholder.com/40'"
            :alt="cus.name"
            class="rounded-circle"
            style="width: 40px; height: 40px; object-fit: cover"
          />
          <div class="flex-grow-1">
            <div class="fw-semibold">{{ cus.name }}</div>
            <div class="text-secondary small">{{ cus.email }}</div>
          </div>
          <i class="bi bi-arrow-right-circle fs-5 text-primary opacity-50"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ChartSection from '../../components/common/ChartComponent.vue'
import { dataset } from '@/data/chartData'
import axios from 'axios'


interface Product {
  _id?: string
  id?: string
  name: string
  price: number
  stock?: number
  imageUrl?: string
  image?: string
  category?: any
}

interface Customer {
  _id?: string
  id?: string
  name: string
  email: string
  avatar?: string
}

const products = ref<Product[]>([])
const customers = ref<Customer[]>([])

axios.defaults.withCredentials = true
const API_URL = 'http://localhost:5000'


const stats = ref([
  { icon: 'bi-people-fill', bg: 'bg-danger', value: '0', label: 'Customers' },
  { icon: 'bi-bag-check', bg: 'bg-primary', value: '0', label: 'Order' },
  { icon: 'bi-truck', bg: 'bg-pink', value: '0', label: 'Shipping' },
  { icon: 'bi-currency-dollar', bg: 'bg-warning', value: '0', label: 'Revenue' },
])

onMounted(async () => {
  try {
    const customersRes = await axios.get(`${API_URL}/api/auth/customers`, {
      params: { page: 1, pageSize: 5 },
      withCredentials: true
    })
    customers.value = customersRes.data.data.slice(0, 5)
    stats.value[0].value = customersRes.data.total.toString()

    const productsRes = await axios.get(`${API_URL}/api/products`, {
      params: { page: 1, pageSize: 4 },
      withCredentials: true
    })
    products.value = productsRes.data.data.slice(0, 4)
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'
import ApexCharts from 'vue3-apexcharts'
export default defineComponent({
  components: {
    apexchart: ApexCharts,
    ChartSection,
  },
})
</script>

<style scoped>
.stat-hover:hover {
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1) !important;
  transform: translateY(-2px) scale(1.03);
}
.product-hover:hover {
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.18) !important;
  transform: translateY(-2px) scale(1.03);
}
.customer-hover:hover {
  background: #e0e7ff !important;
  box-shadow: 0 8px 24px 0 rgba(31, 38, 135, 0.12) !important;
}
.bg-pink {
  background: linear-gradient(135deg, #ff4fe3 0%, #ffb6f9 100%) !important;
}
</style>
