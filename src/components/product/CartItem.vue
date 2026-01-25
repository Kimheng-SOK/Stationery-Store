<template>
  <div class="d-flex gap-3 mb-3 pb-3 border-bottom position-relative cart-item flex-column flex-md-row">
    <!-- Badge -->
    <div
      v-if="item.badge"
      class="position-absolute start-0 top-0 bg-warning text-white px-2 py-1 rounded-bottom border border-white"
      style="font-size: 0.75rem; font-weight: 600; z-index: 1;"
    >
      {{ item.badge }}
    </div>

    <!-- First Row (Mobile) / Left Section (Desktop): Image and Product Details -->
    <div class="d-flex gap-3 flex-grow-1">
      <!-- Product Image -->
      <div class="position-relative" style="width: 150px; height: 150px; flex-shrink: 0;">
        <img
          :src="item.image"
          :alt="item.name"
          class="w-100 h-100 rounded"
          style="object-fit: cover; cursor: pointer;"
          @click="goToProduct"
        />
      </div>

        <!-- Product Details -->
      <div class="flex-grow-1">
        <h3
          class="fw-bold mb-1"
          style="font-size: 0.9rem; cursor: pointer;"
          @click="goToProduct"
        >
          {{ item.name }}
        </h3>
        <p class="text-muted fw-bold mb-2" style="font-size: 0.8rem;">
          {{ item.description }}
        </p>
        <div class="d-flex gap-3 align-items-center">
          <!-- If price is 0 or null, show only originalPrice -->
          <template v-if="!item.price || item.price === 0">
            <span class="fw-bold">${{ (item.originalPrice || 0).toFixed(2) }}</span>
          </template>
          <!-- If both price and originalPrice exist, show both -->
          <template v-else>
            <span class="fw-bold">${{ item.price.toFixed(2) }}</span>
            <span 
              v-if="item.originalPrice" 
              class="text-muted text-decoration-line-through" 
              style="font-size: 0.85rem;"
            >
              ${{ item.originalPrice.toFixed(2) }}
            </span>
          </template>
        </div>
        <p class="text-muted fw-bold mb-0" style="font-size: 0.75rem;">
          SKU: {{ item.sku }}
        </p>
        <p class="text-muted fw-bold mb-0" style="font-size: 0.75rem;">
          Delivery by {{ item.delivery }}
        </p>
      </div>
    </div>

    <!-- Second Row (Mobile) / Right Section (Desktop): Quantity & Total -->
    <div class="d-flex align-items-center gap-3 justify-content-between justify-content-md-end">
      <!-- Quantity Controls -->
      <div class="quantity-controls d-flex align-items-center gap-2 border px-2" style="height: 32px;">
        <button
          @click="$emit('decrease')"
          class="btn btn-link p-0 text-dark text-decoration-none"
          style="width: 30px; height: 30px; font-size: 1.6rem; line-height: 1;"
          :disabled="item.quantity <= 1"
        >
          −
        </button>
        <span class="fw-bold" style="min-width: 30px; text-align: center; font-size: 1.3rem;">
          {{ item.quantity }}
        </span>
        <button
          @click="$emit('increase')"
          class="btn btn-link p-0 text-dark text-decoration-none"
          style="width: 30px; height: 30px; font-size: 1.6rem; line-height: 1;"
          :disabled="item.quantity >= item.stock"
        >
          +
        </button>
      </div>

      <!-- Total Price -->
      <span class="fw-bold" style="width: 80px; text-align: right;">
        ${{ ((item.price && item.price > 0 ? item.price : item.originalPrice || 0) * item.quantity).toFixed(2) }}
      </span>

      <!-- Remove Button -->
      <button
        @click="$emit('remove')"
        class="btn btn-link p-0 text-dark bg-secondary-subtle"
        title="Remove item"
        style="padding: 8px !important;"
      >
        <svg style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { CartItem } from '@/stores/cartStore'

interface Props {
  item: CartItem
}

const props = defineProps<Props>()

defineEmits<{
  increase: []
  decrease: []
  remove: []
}>()

const router = useRouter()

const goToProduct = () => {
  router.push({ name: 'ProductDetail', params: { id: props.item._id } })
}
</script>

<style scoped>
.cart-item {
  transition: background-color 0.2s ease;
}

.cart-item:hover {
  background-color: #f8f9fa;
}

.quantity-controls {
  border: 1.5px solid #6c757d;
  border-radius: 4px;
}

.quantity-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
