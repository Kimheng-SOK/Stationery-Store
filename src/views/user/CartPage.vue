<template>
  <div class="w-100 min-vh-100 bg-white" style="font-family: Quicksand, sans-serif;">
    <!-- Header with Progress -->
    <div class="border-bottom py-3">
      <div class="container-fluid">
        <div class="d-flex align-items-center fw-bold">
          <button 
            class="btn btn-link text-dark text-decoration-none d-flex align-items-center gap-2 p-0"
            @click="goToShopping"
          >
            <svg style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            <span class="fw-bold">Back to shopping</span>
          </button>

        </div>
      </div>
    </div>

    <div class="container-fluid py-4">
      <div class="row g-4">
        <!-- Cart Items Section -->
        <div class="col-lg-7">
          <!-- Empty Cart Message -->
          <div v-if="cartStore.items.length === 0" class="text-center py-5">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="100" 
              height="100" 
              fill="currentColor" 
              class="bi bi-cart-x text-muted mb-3" 
              viewBox="0 0 16 16"
            >
              <path d="M7.354 5.646a.5.5 0 1 0-.708.708L7.793 7.5 6.646 8.646a.5.5 0 1 0 .708.708L8.5 8.207l1.146 1.147a.5.5 0 0 0 .708-.708L9.207 7.5l1.147-1.146a.5.5 0 0 0-.708-.708L8.5 6.793z"/>
              <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
            </svg>
            <h3 class="text-muted">Your cart is empty</h3>
            <p class="text-muted">Add some items to get started!</p>
            <button class="btn btn-primary" @click="goToShopping">
              Continue Shopping
            </button>
          </div>

          <!-- Cart Items List -->
          <template v-else>
            <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <h2 class="h6 fw-bold mb-0">Product</h2>
              <div class="d-flex gap-5 me-12">
                <span class="h6 fw-bold mb-0 me-8" style="width: 80px; text-align: center;">Quantity</span>
                <span class="h6 fw-bold mb-0 me-3" style="width: 80px; text-align: right;">Total</span>
              </div>
            </div>

            <CartItem
              v-for="(item, index) in cartStore.items"
              :key="item.id"
              :item="item"
              @increase="cartStore.increaseQuantity(index)"
              @decrease="cartStore.decreaseQuantity(index)"
              @remove="handleRemoveItem(index)"
            />
          </template>
        </div>

        <!-- Order Summary Section -->
        <div class="col-lg-5">
          <OrderSummary
            :total-items="cartStore.totalItems"
            :item-total="cartStore.itemTotal"
            :discount="cartStore.discount"
            :shipping-cost="cartStore.shippingCost"
            :grand-total="cartStore.grandTotal"
            :shipping-method="cartStore.shippingMethod"
            :deliver-together="cartStore.deliverTogether"
            :coupon-code="cartStore.couponCode"
            @update:shipping-method="cartStore.setShippingMethod"
            @update:deliver-together="cartStore.setDeliverTogether"
            @apply-coupon="cartStore.applyCoupon"
            @checkout="handleCheckout"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import CartItem from '@/components/product/CartItem.vue'
import OrderSummary from '@/components/product/OrderSummary.vue'

const router = useRouter()
const cartStore = useCartStore()
const currentStep = ref('cart')

const goToShopping = () => {
  router.push('/shop')
}

const handleRemoveItem = (index: number) => {
  if (confirm('Are you sure you want to remove this item from your cart?')) {
    cartStore.removeFromCart(index)
  }
}

const handleCheckout = () => {
  if (cartStore.items.length === 0) {
    alert('Your cart is empty!')
    return
  }
  // Change step to 'address' (optional if you stay on page)
  currentStep.value = 'address'
  
  // NAVIGATE TO THE NEW PAGE
  router.push('/checkout') 
}
</script>

<style scoped>
.text-main-color2 {
  color: var(--main-color2) !important;
}

.step-item {
  position: relative;
  padding-bottom: 4px;
}

.step-item.active span {
  border-bottom: 2px solid #141B3E;
  padding-bottom: 2px;
}

.step-item:hover {
  opacity: 0.8;
}
</style>