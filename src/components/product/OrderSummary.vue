<template>
  <div class="card border-0 shadow-sm rounded-4 position-sticky" style="top: 20px;">
    <div class="card-body p-4">
      <!-- Header -->
      <div class="d-flex align-items-center gap-3 pb-3 mb-4 border-bottom border-2">
        <i class="bi bi-receipt-cutoff fs-3" style="color: #0d1228;"></i>
        <h2 class="h5 fw-bold mb-0">Order Summary</h2>
      </div>

      <!-- Free Shipping Banner -->
      <div
        v-if="grandTotal >= 50"
        class="alert alert-success border-0 rounded-3 mb-3 position-relative overflow-hidden"
        style="background: linear-gradient(135deg, #0d1228 0%, #1a2642 100%);"
      >
        <div class="position-absolute top-0 end-0 p-2">
          <i class="bi bi-check-circle-fill fs-5 text-white opacity-75"></i>
        </div>
        <div class="d-flex align-items-center gap-3 text-white">
          <i class="bi bi-truck-front" style="font-size: 2rem;"></i>
          <div>
            <p class="fw-bold mb-1">Free Shipping Available!</p>
            <p class="small mb-0 opacity-90">On all orders over $50</p>
          </div>
        </div>
      </div>

      <!-- Price Breakdown Card -->
      <div class="bg-light rounded-3 p-3 mb-3">
        <!-- Items Row -->
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-bag-check text-secondary"></i>
            <span class="text-muted fw-medium small">Items ({{ totalItems }})</span>
          </div>
          <span class="fw-semibold">${{ itemTotal.toFixed(2) }}</span>
        </div>

        <!-- Discount Row -->
        <div v-if="discount > 0 && grandTotal >= 50" class="d-flex justify-content-between align-items-center mb-2">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-tag" style="color: #d4af37;"></i>
            <span class="fw-medium small" style="color: #d4af37;">Discount</span>
          </div>
          <span class="fw-semibold" style="color: #d4af37;">-${{ discount.toFixed(2) }}</span>
        </div>

        <hr class="my-3">

        <!-- Shipping Options -->
        <div class="mb-3">
          <p class="text-uppercase small fw-semibold text-secondary mb-2" style="letter-spacing: 0.5px;">
            <i class="bi bi-box-seam me-1"></i>
            Delivery Method
          </p>

          <!-- Standard Shipping -->
          <label class="d-block mb-2">
            <input
              type="radio"
              name="shipping"
              value="shipping"
              v-model="localShippingMethod"
              @change="$emit('update:shippingMethod', 'shipping')"
              class="d-none"
            >
            <div
              class="border rounded-3 p-3 bg-white cursor-pointer transition-all shipping-option-box"
              :class="localShippingMethod === 'shipping' ? 'active-shipping' : 'border-2'"
              style="cursor: pointer; transition: all 0.3s ease;"
            >
              <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center gap-3">
                  <i class="bi bi-truck fs-4" :class="localShippingMethod === 'shipping' ? 'text-navy' : 'text-secondary'"></i>
                  <div>
                    <div class="fw-semibold small">Standard Shipping</div>
                    <div class="text-muted" style="font-size: 0.75rem;">Delivered in 5-7 days</div>
                  </div>
                </div>
                <span class="fw-bold">$2.50</span>
              </div>
            </div>
          </label>

          <!-- Local Pickup -->
          <label class="d-block">
            <input
              type="radio"
              name="shipping"
              value="pickup"
              v-model="localShippingMethod"
              @change="$emit('update:shippingMethod', 'pickup')"
              class="d-none"
            >
            <div
              class="border rounded-3 p-3 bg-white cursor-pointer transition-all shipping-option-box"
              :class="localShippingMethod === 'pickup' ? 'active-shipping' : 'border-2'"
              style="cursor: pointer; transition: all 0.3s ease;"
            >
              <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center gap-3">
                  <i class="bi bi-shop fs-4" :class="localShippingMethod === 'pickup' ? 'text-navy' : 'text-secondary'"></i>
                  <div>
                    <div class="fw-semibold small">Local Pickup</div>
                    <div class="text-muted" style="font-size: 0.75rem;">Pick up from store</div>
                  </div>
                </div>
                <span class="fw-bold" style="color: #d4af37;">Free</span>
              </div>
            </div>
          </label>
        </div>

        <hr class="my-3">

        <!-- Grand Total -->
        <div class="rounded-3 p-3 mt-3" style="background: linear-gradient(135deg, rgba(13, 18, 40, 0.05) 0%, rgba(13, 18, 40, 0.02) 100%);">
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-2">
              <i class="bi bi-calculator fs-5 text-navy"></i>
              <span class="fw-bold text-navy">Total Amount</span>
            </div>
            <div class="h4 fw-bold text-navy mb-0">${{ grandTotal.toFixed(2) }}</div>
          </div>
        </div>
      </div>

      <!-- Deliver Together Checkbox -->
      <div class="form-check mb-3">
        <input
          class="form-check-input custom-checkbox"
          type="checkbox"
          :checked="deliverTogether"
          @change="$emit('update:deliverTogether', ($event.target as HTMLInputElement).checked)"
          id="deliverTogether"
        >
        <label class="form-check-label fw-medium small" for="deliverTogether">
          <i class="bi bi-boxes me-1"></i>
          Deliver all items together
        </label>
      </div>

      <!-- Checkout Button -->
      <button
        class="btn btn-checkout w-100 py-3 fw-bold shadow-sm mb-3 position-relative overflow-hidden"
        style="letter-spacing: 0.5px;"
        @click="$emit('checkout')"
        :disabled="totalItems === 0"
      >
        <span class="d-flex align-items-center justify-content-center gap-2">
          <i class="bi bi-lock-fill"></i>
          <span>Secure Checkout</span>
          <i class="bi bi-arrow-right"></i>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  totalItems: number
  itemTotal: number
  discount: number
  shippingCost: number
  grandTotal: number
  shippingMethod: string
  deliverTogether: boolean
  couponCode: string
}

const props = defineProps<Props>()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits<{
  'update:shippingMethod': [method: 'shipping' | 'pickup']
  'update:deliverTogether': [value: boolean]
  'applyCoupon': [code: string]
  'checkout': []
}>()

const localShippingMethod = ref(props.shippingMethod)

watch(() => props.shippingMethod, (newVal) => {
  localShippingMethod.value = newVal
})
</script>

<style scoped>
/* Color variables */
.text-navy {
  color: #0d1228;
}

.text-gold {
  color: #d4af37;
}

/* Shipping options active state */
.active-shipping {
  border-color: #0d1228 !important;
  border-width: 2px !important;
  background: rgba(13, 18, 40, 0.02) !important;
}

/* Custom checkbox */
.custom-checkbox:checked {
  background-color: #0d1228;
  border-color: #0d1228;
}

/* Checkout button styles */
.btn-checkout {
  background: linear-gradient(135deg, #0d1228 0%, #1a2642 100%);
  border: none;
  color: white;
  transition: all 0.3s ease;
}

.btn-checkout:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(13, 18, 40, 0.4) !important;
  background: linear-gradient(135deg, #1a2642 0%, #0d1228 100%);
}

.btn-checkout:disabled {
  background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
  opacity: 0.6;
}

@media (max-width: 768px) {
  .position-sticky {
    position: static !important;
  }
}
</style>
