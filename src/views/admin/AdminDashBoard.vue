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
        <a href="#" class="text-danger fw-semibold small text-decoration-none">View All</a>
      </div>
      <div class="row g-3">
        <div class="col-12 col-md-6 col-xl-3" v-for="(prod, i) in products" :key="i">
          <div class="card h-100 border-0 rounded-4 shadow-sm product-hover">
            <div
              class="bg-white d-flex align-items-center justify-content-center rounded-top-4"
              style="height: 180px"
            >
              <img
                :src="prod.img"
                :alt="prod.name"
                class="img-fluid"
                style="max-height: 120px; object-fit: contain"
              />
            </div>
            <div class="card-body">
              <p class="text-danger text-uppercase small fw-bold mb-1">{{ prod.brand }}</p>
              <h3 class="h6 fw-semibold mb-2">{{ prod.name }}</h3>
              <div v-if="prod.old" class="d-flex align-items-center gap-2">
                <span class="fw-bold">${{ prod.price }}</span>
                <span class="text-decoration-line-through text-secondary">${{ prod.old }}</span>
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
        <a href="#" class="text-danger fw-semibold small text-decoration-none">View All</a>
      </div>
      <div class="d-flex flex-column gap-3">
        <div
          v-for="(cus, i) in customers"
          :key="i"
          class="d-flex align-items-center gap-3 p-2 rounded-3 bg-white shadow-sm customer-hover"
        >
          <img
            :src="cus.img"
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
import ChartSection from '../../components/common/ChartComponent.vue'

// Example dataset structure for easy API integration
const dataset = [
  {
    year: 2025,
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    sales: [120, 150, 170, 140, 180, 200, 220, 210, 190, 230, 250, 270],
  },
  {
    year: 2024,
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    sales: [100, 130, 160, 120, 160, 180, 200, 190, 170, 210, 230, 250],
  },
  {
    year: 2023,
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    sales: [90, 110, 140, 100, 120, 150, 170, 160, 140, 180, 200, 220],
  },
]

const stats = [
  { icon: 'bi-people-fill', bg: 'bg-danger', value: '5,583', label: 'Customers' },
  { icon: 'bi-bag-check', bg: 'bg-primary', value: '539', label: 'Order' },
  { icon: 'bi-truck', bg: 'bg-pink', value: '105', label: 'Delivery Partners' },
  { icon: 'bi-currency-dollar', bg: 'bg-warning', value: '20,835', label: 'Revenue' },
]
const products = [
  {
    img: 'https://api.builder.io/api/v1/image/assets/TEMP/c9e15809575ecaf144fc9222abbe48a51d8c9c0f?width=260',
    brand: 'By Refco Bags Ltd',
    name: 'Women Tan Shoulder Bag Extra Spacious',
    price: 70,
  },
  {
    img: 'https://api.builder.io/api/v1/image/assets/TEMP/bfa853f06e86f57c7fde15e6b114ade53ee06c29?width=260',
    brand: 'By Silverstart Mobile',
    name: 'WH-CH510 Wireless Headphones',
    price: 30,
    old: 120,
  },
  {
    img: 'https://api.builder.io/api/v1/image/assets/TEMP/e0920ab2de5a317a73e94d6e20e3f897585632ee?width=420',
    brand: 'By Kitty Shop',
    name: 'Multi Color Canvas Kids Fancy Shoes',
    price: 60,
  },
  {
    img: 'https://api.builder.io/api/v1/image/assets/TEMP/bdd81c4669d090b425b771f469814a2a90c56fd3?width=400',
    brand: 'By Brand Factory',
    name: 'Adidas PU Lace Up Mens Sports Shoes (Laceup)',
    price: 120,
  },
]
const customers = [
  {
    img: 'https://api.builder.io/api/v1/image/assets/TEMP/b5d49fee03d23f7d7ee89ba211888ab18de2b1a3?width=80',
    name: 'Kigen pieterson',
    email: 'kegenpet980@gmail.com',
  },
  {
    img: 'https://api.builder.io/api/v1/image/assets/TEMP/b1152ef786a83052f412b2a8312aaedea015f3fe?width=80',
    name: 'Brandon Walsh',
    email: 'iambrandon90@hotmail.com',
  },
  {
    img: 'https://api.builder.io/api/v1/image/assets/TEMP/c5290e6a2340feb161380ef0ef986cbc77054b56?width=80',
    name: 'Sam Wilson',
    email: 'samwilson@reppideducation.com',
  },
  {
    img: 'https://api.builder.io/api/v1/image/assets/TEMP/25e0817195e7ab63dbb616c0af9e5da69d7eacfa?width=80',
    name: 'Dean Mayer',
    email: 'dmayer1987@gmail.com',
  },
  {
    img: 'https://api.builder.io/api/v1/image/assets/TEMP/0e209ab00f7b497f56b9a75308d9e8962b194785?width=80',
    name: 'Kagiso Morris',
    email: 'kgmorrison@hotmail.com',
  },
]
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
