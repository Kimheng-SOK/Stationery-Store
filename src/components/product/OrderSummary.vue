<template>
  <div class="border rounded p-4 bg-light order-summary">
    <h2 class="h5 fw-bold mb-4">Order Summary</h2>
    <hr class="opacity-100" style="border-top: 2px solid var(--main-color2);">

    <!-- Free Shipping Banner -->
    <div class="d-flex align-items-start gap-2 mb-3 p-3 rounded position-relative">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="42" 
        height="22" 
        fill="currentColor" 
        class="bi bi-check-circle-fill text-success position-absolute start-0 top-2" 
        viewBox="0 0 16 16"
      >
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
      </svg>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="48" 
        height="42" 
        fill="currentColor" 
        class="bi bi-truck text-secondary" 
        viewBox="0 0 16 16"
      >
        <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
      </svg>
      <p class="mb-0 small text-dark pt-2 fs-5 fw-bold">
        Yay! Free shipping available on this order.
      </p>
    </div>

    <!-- Price Breakdown -->
    <div class="mb-3">
      <div class="d-flex justify-content-between mb-2">
        <span class="text-muted text-main-color2 fw-bold">
          Item Total ({{ totalItems }} Items)
        </span>
        <span class="fw-medium">${{ itemTotal.toFixed(2) }}</span>
      </div>
      <div class="d-flex justify-content-between mb-2">
        <span class="text-muted text-main-color2 fw-bold">Discount</span>
        <span class="fw-medium text-secondary">-${{ discount.toFixed(2) }}</span>
      </div>

      <!-- Shipping Options -->
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="d-flex align-items-center gap-2">
          <input 
            type="radio" 
            name="shipping" 
            value="shipping" 
            v-model="localShippingMethod"
            @change="$emit('update:shippingMethod', 'shipping')"
            id="shipping-option"
          >
          <label for="shipping-option" class="text-muted text-main-color2 fw-bold mb-0">
            Shipping
          </label>
        </div>
        <span class="fw-medium">$2.50</span>
      </div>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div class="d-flex align-items-center gap-2">
          <input 
            type="radio" 
            name="shipping" 
            value="pickup"
            v-model="localShippingMethod"
            @change="$emit('update:shippingMethod', 'pickup')"
            id="pickup-option"
          >
          <label for="pickup-option" class="text-muted text-main-color2 fw-bold mb-0">
            Local Pickup
          </label>
        </div>
        <span class="fw-medium">Free</span>
      </div>

      <!-- Coupon Input -->
      <div class="d-flex mb-3 coupon-wrapper position-relative">
        <input 
          type="text" 
          class="form-control fw-bold px-5" 
          style="background-color:#eef0fb; width: 90%; height: 50px;" 
          placeholder="Coupon code" 
          v-model="localCouponCode"
        >
        <button 
          class="w-25 btn btn-primary px-4 position-absolute end-0 coupon-apply-btn" 
          style="height: 50px;"
          @click="$emit('applyCoupon', localCouponCode)"
        >
          Apply
        </button>
      </div>

      <hr class="opacity-100" style="border-top: 2px solid var(--main-color2);">
      
      <!-- Grand Total -->
      <div class="d-flex justify-content-between align-items-center pt-3" style="color: var(--main-color2);">
        <span class="h5 fw-bold mb-0 text-main-color2">Grand Total</span>
        <span class="h5 fw-bold mb-0">${{ grandTotal.toFixed(2) }}</span>
      </div>
    </div>

    <!-- Deliver Together Option -->
    <div class="form-check mb-3">
      <input 
        class="form-check-input" 
        type="checkbox" 
        :checked="deliverTogether"
        @change="$emit('update:deliverTogether', ($event.target as HTMLInputElement).checked)"
        id="deliverTogether"
      >
      <label class="form-check-label small fw-bold" for="deliverTogether">
        Deliver all together
      </label>
    </div>

    <!-- Checkout Section -->
    <div class="text-center">
      <p class="text-muted mb-3 fw-bold" style="font-size: 0.75rem;">
        <i class="bi bi-truck me-1"></i>
        Estimated delivery by {{ estimatedDelivery }}
      </p>
      <button 
        class="btn checkout-btn fw-bold fs-5"
        @click="$emit('checkout')"
        :disabled="totalItems === 0"
      >
        <i class="bi bi-bag-check me-2"></i>
        Proceed to Checkout
        <i class="bi bi-arrow-right ms-2"></i>
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

const emit = defineEmits<{
  'update:shippingMethod': [method: 'shipping' | 'pickup']
  'update:deliverTogether': [value: boolean]
  'applyCoupon': [code: string]
  'checkout': []
}>()

const localShippingMethod = ref(props.shippingMethod)
const localCouponCode = ref(props.couponCode)

watch(() => props.shippingMethod, (newVal) => {
  localShippingMethod.value = newVal
})

watch(() => props.couponCode, (newVal) => {
  localCouponCode.value = newVal
})

const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  .toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
</script>

<style scoped>
.text-main-color2 {
  color: var(--main-color2) !important;
}

.coupon-wrapper .form-control {
  border-top-left-radius: 50px;
  border-bottom-left-radius: 50px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: 0;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

.coupon-wrapper .btn {
  border-top-left-radius: 50px;
  border-bottom-left-radius: 50px;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
  margin-left: -1px;
}

.coupon-apply-btn {
  background-color: white !important;
  border: 2px solid #0d6efd !important;
  color: #0d6efd !important;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: none !important;
}

.coupon-apply-btn:hover {
  background-color: #0d6efd !important;
  color: white !important;
}

.coupon-apply-btn:focus,
.coupon-apply-btn:active {
  background-color: white !important;
  color: #0d6efd !important;
  box-shadow: none !important;
}

.checkout-btn {
  width: 100%;
  height: 56px;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
  border-radius: 12px;
  color: white;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
  position: relative;
  overflow: hidden;
}

.checkout-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
  background: linear-gradient(135deg, #20c997 0%, #28a745 100%);
}

.checkout-btn:active:not(:disabled) {
  transform: translateY(0);
}

.checkout-btn:disabled {
  background: linear-gradient(135deg, #6c757d 0%, #adb5bd 100%);
  cursor: not-allowed;
  opacity: 0.6;
}

.checkout-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.checkout-btn:hover:not(:disabled)::before {
  left: 100%;
}

.form-check-input {
  border: 1.5px solid #6c757d;
  border-color: var(--bs-secondary) !important;
}

.form-check-input:checked {
  background-color: var(--main-color2);
  border-color: var(--main-color2) !important;
}

.form-check-input:focus {
  border-color: var(--main-color2);
  box-shadow: 0 0 0 0.25rem rgba(20, 27, 62, 0.25);
}

input[type="radio"] {
  border: 1.5px solid #6c757d;
}

input[type="radio"]:checked {
  background-color: var(--main-color2);
  border-color: var(--main-color2);
}
</style>