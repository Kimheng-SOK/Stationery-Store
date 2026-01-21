<template>
  <div class="checkout-page w-100 min-vh-100 bg-light">
    <header class="bg-white border-bottom py-3 main-header">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-4">
            <button class="btn btn-link text-dark text-decoration-none d-flex align-items-center gap-2 p-0" @click="goBack">
              <svg style="width: 18px; height: 18px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              <span class="fw-bold d-none d-md-inline">Back</span>
            </button>
          </div>

          <div class="col-4 d-flex justify-content-center">
            <div class="d-flex align-items-center gap-2 gap-md-3">
              <div :class="['step-pill', { 'active': step >= 1 }]">1</div>
              <div class="step-line d-none d-sm-block"></div>
              <div :class="['step-pill', { 'active': step >= 2 }]">2</div>
              <div class="step-line d-none d-sm-block"></div>
              <div :class="['step-pill', { 'active': step >= 3 }]">3</div>
            </div>
          </div>
          
          <div class="col-4 text-end">
             <span class="small fw-bold d-none d-md-inline">Secured Checkout</span>
          </div>
        </div>
      </div>
    </header>

    <main class="container py-4 py-md-5">
      <div class="row g-4">
        <div class="col-lg-8">
          
          <div v-if="step === 1" class="checkout-card slide-in">
            <h4 class="fw-bold mb-4">Shipping Address</h4>
            <form @submit.prevent="nextStep">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label small fw-bold">First Name</label>
                  <input v-model="form.firstName" type="text" class="form-control custom-input" required placeholder="John">
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold">Last Name</label>
                  <input v-model="form.lastName" type="text" class="form-control custom-input" required placeholder="Doe">
                </div>
                <div class="col-12">
                  <label class="form-label small fw-bold">Street Address</label>
                  <input v-model="form.address" type="text" class="form-control custom-input" required placeholder="123 Main St">
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold">City</label>
                  <input v-model="form.city" type="text" class="form-control custom-input" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold">Postal Code</label>
                  <input v-model="form.zip" type="text" class="form-control custom-input" required>
                </div>
              </div>
              <button type="submit" class="btn btn-dark w-100 mt-4 py-3 fw-bold checkout-btn">
                Continue to Payment
              </button>
            </form>
          </div>

          <div v-if="step === 2" class="checkout-card slide-in">
            <h4 class="fw-bold mb-4">Payment Method</h4>
            <div class="payment-grid">
              <div 
                class="payment-option" 
                :class="{ 'active': form.paymentMethod === 'card' }"
                @click="form.paymentMethod = 'card'"
              >
                <div class="d-flex align-items-center gap-3">
                  <input type="radio" :checked="form.paymentMethod === 'card'">
                  <span class="fw-bold">Credit Card</span>
                </div>
                <div class="payment-icons">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" height="18">
                </div>
              </div>

              <div 
                class="payment-option" 
                :class="{ 'active': form.paymentMethod === 'paypal' }"
                @click="form.paymentMethod = 'paypal'"
              >
                <div class="d-flex align-items-center gap-3">
                  <input type="radio" :checked="form.paymentMethod === 'paypal'">
                  <span class="fw-bold">PayPal</span>
                </div>
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" height="15" alt="Paypal">
              </div>
            </div>

            <div v-if="form.paymentMethod === 'card'" class="mt-4 p-3 bg-light rounded border border-2 shadow-sm">
               <div class="mb-3">
                <label class="form-label small fw-bold">Card Number</label>
                <input type="text" class="form-control custom-input" placeholder="0000 0000 0000 0000">
              </div>
              <div class="row g-2">
                <div class="col-6">
                  <input type="text" class="form-control custom-input" placeholder="MM/YY">
                </div>
                <div class="col-6">
                  <input type="password" class="form-control custom-input" placeholder="CVV">
                </div>
              </div>
            </div>

            <div class="row g-2 mt-4">
              <div class="col-6">
                <button @click="step = 1" class="btn btn-outline-dark w-100 py-3 fw-bold">Back</button>
              </div>
              <div class="col-6">
                <button @click="step = 3" class="btn btn-dark w-100 py-3 fw-bold checkout-btn">Review Order</button>
              </div>
            </div>
          </div>

          <div v-if="step === 3" class="checkout-card slide-in">
            <h4 class="fw-bold mb-4">Review Your Order</h4>
            <div class="bg-light p-3 rounded mb-4 border border-1">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h6 class="fw-bold mb-1 text-primary">Shipping To:</h6>
                  <p class="mb-0 small fw-bold">{{ form.firstName }} {{ form.lastName }}</p>
                  <p class="mb-0 small text-muted">{{ form.address }}, {{ form.city }} {{ form.zip }}</p>
                </div>
                <button class="btn btn-sm btn-outline-dark px-3" @click="step = 1">Edit</button>
              </div>
            </div>

            <div class="cart-items-preview">
              <div v-for="item in cartStore.items" :key="item.id" class="d-flex align-items-center gap-3 py-3 border-bottom">
                <img :src="item.image" class="rounded border" width="60" height="60" style="object-fit: cover; background: #fff;">
                <div class="flex-grow-1">
                  <h6 class="mb-0 fw-bold small">{{ item.name }}</h6>
                  <small class="text-muted">Quantity: {{ item.quantity }}</small>
                </div>
                <span class="fw-bold small">${{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>

            <button @click="placeOrder" class="btn btn-success w-100 mt-4 py-3 fw-bold checkout-btn shadow-sm" :disabled="isProcessing">
              <span v-if="isProcessing" class="spinner-border spinner-border-sm me-2"></span>
              {{ isProcessing ? 'Confirming Order...' : 'Place Order Now' }}
            </button>
          </div>
        </div>

        <div class="col-lg-4">
          <aside class="sticky-summary">
            <div class="card border-0 shadow-sm p-4 rounded-4">
              <h5 class="fw-bold mb-4">Order Summary</h5>
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Subtotal</span>
                <span class="fw-bold">${{ cartStore.itemTotal.toFixed(2) }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Shipping</span>
                <span class="text-success fw-bold">{{ cartStore.shippingCost === 0 ? 'Free' : '$' + cartStore.shippingCost }}</span>
              </div>
              <div v-if="cartStore.discount > 0" class="d-flex justify-content-between mb-2">
                <span class="text-muted">Discount</span>
                <span class="text-danger fw-bold">-${{ cartStore.discount.toFixed(2) }}</span>
              </div>
              <hr class="my-3">
              <div class="d-flex justify-content-between align-items-end mb-0">
                <div>
                  <span class="fw-bold h5 mb-0">Total</span>
                  <p class="text-muted small mb-0">Inc. taxes</p>
                </div>
                <span class="fw-bold h3 text-primary mb-0">${{ cartStore.grandTotal.toFixed(2) }}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'

const router = useRouter()
const cartStore = useCartStore()
const step = ref(1)
const isProcessing = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  zip: '',
  paymentMethod: 'card'
})

const goBack = () => {
  if (step.value > 1) step.value--
  else router.push('/cart')
}

const nextStep = () => {
  step.value++
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const placeOrder = async () => {
  isProcessing.value = true
  
  // Simulating real API delay
  setTimeout(() => {
    isProcessing.value = false
    
    // EMPTY THE CART HERE
    cartStore.$reset() 
    
    // NAVIGATE TO SUCCESS PAGE
    router.push('/order-success')
  }, 1800)
}
</script>

<style scoped>
.main-header {
  position: sticky !important;
  top: 0;
  z-index: 2000 !important; /* Higher z-index to stay above sidebar */
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.sticky-summary {
  position: sticky;
  top: 90px; 
  z-index: 1000; /* Lower z-index so it slides under header */
}

/* Form & UI Styling */
.checkout-card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.custom-input {
  border: 2px solid #f1f1f1;
  padding: 0.75rem;
  font-size: 0.95rem;
  border-radius: 8px;
}

.custom-input:focus {
  border-color: #000;
  box-shadow: 0 0 0 4px rgba(0,0,0,0.05);
}

/* Progress Step UI */
.step-pill {
  width: 32px;
  height: 32px;
  background: #f1f1f1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.85rem;
  color: #888;
  transition: all 0.3s ease;
}

.step-pill.active {
  background: #000;
  color: #fff;
}

.step-line {
  height: 2px;
  width: 30px;
  background: #f1f1f1;
}

/* Payment Layout */
.payment-grid {
  display: grid;
  gap: 1rem;
}

.payment-option {
  border: 2px solid #f1f1f1;
  padding: 1.25rem;
  border-radius: 0.75rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.2s;
}

.payment-option:hover {
  border-color: #ccc;
}

.payment-option.active {
  border-color: #0d6efd;
  background-color: #f8fbff;
}

/* Responsive Fixes */
@media (max-width: 991.98px) {
  .sticky-summary {
    position: static; 
    margin-top: 2rem;
  }
  .checkout-card {
    padding: 1.5rem;
  }
}

.checkout-btn {
  transition: all 0.2s;
}

.checkout-btn:active {
  transform: scale(0.98);
}

.slide-in {
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>