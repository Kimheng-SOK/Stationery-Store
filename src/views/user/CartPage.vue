<template>
  <div class="w-100 min-vh-100 bg-white" style="font-family: Quicksand, sans-serif;">
    <div class="border-bottom py-3">
      <div class="container-fluid px-4">
        <button
          class="btn btn-link text-dark text-decoration-none d-flex align-items-center gap-2 p-0"
          @click="goToShopping"
        >
          <i class="bi bi-chevron-left"></i>
          <span class="fw-bold">Back to shopping</span>
        </button>
      </div>
    </div>

    <div class="container-fluid py-4 px-4">
      <div class="row g-4">
        <div class="col-lg-8">
          <div v-if="cartStore.items.length === 0" class="text-center py-5">
            <i class="bi bi-cart-x text-muted" style="font-size: 5rem;"></i>
            <h3 class="text-muted mt-3">Your cart is empty</h3>
            <p class="text-muted">Add some items to get started!</p>
            <button class="btn btn-success px-4" @click="goToShopping">
              Continue Shopping
            </button>
          </div>

          <template v-else>
            <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <h2 class="h6 fw-bold mb-0">Product Details</h2>
              <span class="text-muted small">{{ cartStore.totalItems }} Items</span>
            </div>

            <CartItem
              v-for="(item, index) in cartStore.items"
              :key="item._id"
              :item="item"
              @increase="cartStore.increaseQuantity(index)"
              @decrease="cartStore.decreaseQuantity(index)"
              @remove="handleRemoveItem(index)"
            />
          </template>
        </div>

        <div class="col-lg-4 ms-auto">
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

    <div v-if="showAuthModal" class="auth-overlay">
      <div class="auth-modal shadow-lg">
        <div class="text-center">
          <div class="icon-box mb-3">
            <i class="bi bi-person-circle"></i>
          </div>
          <h4 class="fw-bold mb-2" style="color: #141B3E;">Please Login</h4>
          <p class="text-muted mb-4">You need to be logged in to continue with your purchase.</p>

          <div class="d-grid gap-2">
            <button class="btn btn-primary py-2 fw-bold" style="background-color: #141B3E; border: none;" @click="router.push('/signin')">
              Login
            </button>
            <button class="btn btn-outline-secondary py-2 fw-bold" @click="router.push('/signup')">
              Register
            </button>
            <button class="btn btn-link text-muted mt-2" @click="showAuthModal = false">Cancel</button>
          </div>
        </div>
      </div>
    </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue' // Added ref
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/auth' // Added authStore
import CartItem from '@/components/product/CartItem.vue'
import OrderSummary from '@/components/product/OrderSummary.vue'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore() // Added

const showAuthModal = ref(false) // Added

const goToShopping = () => {
  router.push('/shop')
}

const handleRemoveItem = (index: number) => {
  if (confirm('Remove this item from your cart?')) {
    cartStore.removeFromCart(index)
  }
}

// Updated handleCheckout only
const handleCheckout = () => {
  if (cartStore.items.length === 0) return

  if (!authStore.isAuthenticated) {
    showAuthModal.value = true
  } else {
    router.push('/checkout')
  }
}
</script>

<style scoped>
/* Original styles kept */
.text-main-color2 { color: var(--main-color2) !important; }
.step-item { position: relative; padding-bottom: 4px; }
.step-item.active span { border-bottom: 2px solid #141B3E; padding-bottom: 2px; }
.step-item:hover { opacity: 0.8; }

/* New Modal Styles matching your theme */
.auth-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 9999;
}
.auth-modal {
  background: white;
  padding: 2.5rem;
  border-radius: 15px;
  max-width: 400px;
  width: 90%;
}
.icon-box {
  font-size: 3.5rem;
  color: #141B3E;
}
</style>
