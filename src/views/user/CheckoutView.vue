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
              <div class="d-flex flex-column align-items-center">
                <div :class="['step-pill', { 'active': step >= 1 }]">1</div>
                <span :class="['step-label', { 'active': step >= 1 }]">Address</span>
              </div>
              <div class="step-line d-none d-sm-block"></div>
              <div class="d-flex flex-column align-items-center">
                <div :class="['step-pill', { 'active': step >= 2 }]">2</div>
                <span :class="['step-label', { 'active': step >= 2 }]">Payment</span>
              </div>
              <div class="step-line d-none d-sm-block"></div>
              <div class="d-flex flex-column align-items-center">
                <div :class="['step-pill', { 'active': step >= 3 }]">3</div>
                <span :class="['step-label', { 'active': step >= 3 }]">Review</span>
              </div>
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
              <!-- Credit Card Option -->
              <div
                class="payment-option"
                :class="{ 'active': form.paymentMethod === 'card' }"
                @click="form.paymentMethod = 'card'"
              >
                <div class="d-flex align-items-center gap-3">
                  <input type="radio" :checked="form.paymentMethod === 'card'">
                  <div>
                    <div class="fw-bold">Credit/Debit Card</div>
                    <small class="text-muted">Pay securely with your card</small>
                  </div>
                </div>
                <svg style="width: 24px; height: 24px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                </svg>
              </div>

              <!-- Cash on Delivery Option -->
              <div
                class="payment-option"
                :class="{ 'active': form.paymentMethod === 'cash' }"
                @click="form.paymentMethod = 'cash'"
              >
                <div class="d-flex align-items-center gap-3">
                  <input type="radio" :checked="form.paymentMethod === 'cash'">
                  <div>
                    <div class="fw-bold">Cash on Delivery</div>
                    <small class="text-muted">Pay when you receive</small>
                  </div>
                </div>
                <svg style="width: 24px; height: 24px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>

              <!-- QR Code Option -->
              <div
                class="payment-option"
                :class="{ 'active': form.paymentMethod === 'qr' }"
                @click="form.paymentMethod = 'qr'"
              >
                <div class="d-flex align-items-center gap-3">
                  <input type="radio" :checked="form.paymentMethod === 'qr'">
                  <div>
                    <div class="fw-bold">Scan QR Code</div>
                    <small class="text-muted">Pay via mobile banking</small>
                  </div>
                </div>
                <svg style="width: 24px; height: 24px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
                </svg>
              </div>
            </div>

            <!-- Card Details Form -->
            <div v-if="form.paymentMethod === 'card'" class="mt-4 p-3 bg-light rounded border border-2 shadow-sm">
               <div class="mb-3">
                <label class="form-label small fw-bold">Card Number</label>
                <input type="text" class="form-control custom-input" placeholder="0000 0000 0000 0000">
              </div>
              <div class="row g-2">
                <div class="col-6">
                  <label class="form-label small fw-bold">Expiry Date</label>
                  <input type="text" class="form-control custom-input" placeholder="MM/YY">
                </div>
                <div class="col-6">
                  <label class="form-label small fw-bold">CVV</label>
                  <input type="password" class="form-control custom-input" placeholder="123">
                </div>
              </div>
            </div>

            <!-- Cash on Delivery Info -->
            <div v-if="form.paymentMethod === 'cash'" class="mt-4 p-3 bg-light rounded border border-2">
              <div class="d-flex align-items-start gap-2">
                <svg style="width: 20px; height: 20px; flex-shrink: 0; margin-top: 2px;" class="text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
                <div>
                  <p class="mb-1 fw-bold small">Cash on Delivery Available</p>
                  <p class="mb-0 text-muted small">Please keep exact change ready. Our delivery partner will collect the payment when your order arrives.</p>
                </div>
              </div>
            </div>

            <!-- QR Code Display -->
            <div v-if="form.paymentMethod === 'qr'" class="mt-4 p-4 bg-light rounded border border-2 text-center">
              <p class="fw-bold mb-3">Scan to Pay</p>
              <div class="qr-code-container mx-auto mb-3">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Payment:${{ cartStore.grandTotal.toFixed(2) }}"
                  alt="QR Code for Payment"
                  class="w-100 h-100"
                  style="object-fit: contain;"
                />
              </div>
              <p class="text-muted small mb-0">Use your banking app to scan and complete payment</p>
              <p class="text-muted small">Total: <span class="fw-bold text-dark">${{ cartStore.grandTotal.toFixed(2) }}</span></p>
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

            <div class="bg-light p-3 rounded mb-4 border border-1">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="fw-bold mb-1 text-primary">Payment Method:</h6>
                  <p class="mb-0 small fw-bold">
                    {{ form.paymentMethod === 'card' ? 'Credit/Debit Card' : form.paymentMethod === 'cash' ? 'Cash on Delivery' : 'QR Code Payment' }}
                  </p>
                </div>
                <button class="btn btn-sm btn-outline-dark px-3" @click="step = 2">Edit</button>
              </div>
            </div>

            <div class="cart-items-preview">
              <div v-for="item in cartStore.items" :key="item._id" class="d-flex align-items-center gap-3 py-3 border-bottom">
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
              <!-- Coupon Input -->
              <div class="mb-3">
                <label class="form-label fw-bold">Coupon Code</label>
                <div class="input-group">
                  <input
                    v-model="couponInput"
                    type="text"
                    class="form-control"
                    placeholder="Enter coupon code"
                    :disabled="couponLoading || couponApplied"
                  />
                  <button
                    class="btn btn-outline-primary"
                    @click="applyCoupon"
                    :disabled="couponLoading || couponApplied || !couponInput"
                  >
                    <span v-if="couponLoading" class="spinner-border spinner-border-sm"></span>
                    <span v-else>{{ couponApplied ? 'Applied' : 'Apply' }}</span>
                  </button>
                </div>
                <div v-if="couponMessage" :class="['mt-2', couponMessage.type === 'success' ? 'text-success' : 'text-danger', 'small']">
                  <template v-if="couponMessage.type === 'success' && appliedCoupon">
                    <i class="bi bi-check-circle"></i>
                    Coupon '<b>{{ appliedCoupon.code }}</b>' applied: -{{ appliedCoupon.discount }}%
                  </template>
                  <template v-else>
                    {{ couponMessage.text }}
                  </template>
                </div>
              </div>
              <!-- Order Summary -->
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Subtotal</span>
                <span class="fw-bold">${{ cartStore.itemTotal.toFixed(2) }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Shipping</span>
                <span class="text-success fw-bold">{{ cartStore.shippingCost === 0 ? 'Free' : '$' + cartStore.shippingCost }}</span>
              </div>
              <div v-if="discountAmount > 0" class="d-flex justify-content-between mb-2">
                <span class="text-muted">Discount</span>
                <span class="text-danger fw-bold">-${{ discountAmount.toFixed(2) }}</span>
              </div>
              <hr class="my-3">
              <div class="d-flex justify-content-between align-items-end mb-0">
                <div>
                  <span class="fw-bold h5 mb-0">Total</span>
                  <p class="text-muted small mb-0">Inc. taxes</p>
                </div>
                <span class="fw-bold h3 text-primary mb-0">${{ finalTotal.toFixed(2) }}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/auth'
import { API_BASE_URL, getUploadUrl } from '@/config/api'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const step = ref(1)
const isProcessing = ref(false)

const API_URL = API_BASE_URL

const form = reactive({
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  zip: '',
  paymentMethod: 'card'
})

const couponInput = ref('')
const couponLoading = ref(false)
const couponApplied = ref(false)
const couponMessage = ref<{ type: 'success' | 'danger', text: string } | null>(null)
const appliedCoupon = ref<any>(null)

const discountAmount = computed(() => {
  if (appliedCoupon.value && appliedCoupon.value.discount) {
    return (cartStore.itemTotal * appliedCoupon.value.discount) / 100
  }
  return 0
})

const finalTotal = computed(() => {
  return cartStore.itemTotal + cartStore.shippingCost - discountAmount.value
})

const goBack = () => {
  if (step.value > 1) step.value--
  else router.push('/cart')
}

const nextStep = () => {
  step.value++
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const applyCoupon = async () => {
  couponMessage.value = null
  couponLoading.value = true
  try {
    const code = couponInput.value.trim().toUpperCase()
    const res = await axios.get(`${API_URL}/coupons/code/${code}`)
    if (res.data && res.data.success && res.data.data && res.data.data.length > 0) {
      appliedCoupon.value = res.data.data[0]
      couponApplied.value = true
      couponMessage.value = { type: 'success', text: '' }
    } else {
      couponMessage.value = { type: 'danger', text: 'Coupon not found.' }
    }
  } catch (err: any) {
    couponMessage.value = { type: 'danger', text: err.response?.data?.message || 'Coupon not found.' }
  } finally {
    couponLoading.value = false
  }
}

// Redeem coupon after order placed
const redeemCoupon = async () => {
  if (!appliedCoupon.value) return
  try {
    await axios.post(`${API_URL}/coupons/redeem/${appliedCoupon.value.code}`)
  } catch (e) {
    // Ignore error, coupon will be expired if limit reached
  }
}

const placeOrder = async () => {
  isProcessing.value = true

  try {
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    const orderDate = new Date()
    const deliveryDate = new Date()
    deliveryDate.setDate(deliveryDate.getDate() + 7)

    const shippingMethod = cartStore.shippingMethod || 'shipping'
    const shippingCost = shippingMethod === 'pickup' ? 0 : (cartStore.shippingCost || 2.5)

    const subtotalAll = cartStore.itemTotal
    const discountPercentage = appliedCoupon.value?.discount || 0
    const totalDiscountAmount = (subtotalAll * discountPercentage) / 100
    const subtotalAfterDiscount = subtotalAll - totalDiscountAmount
    const grandTotal = subtotalAfterDiscount + shippingCost

    // Get logged-in user info
    const currentUser = authStore.user
    const userId = currentUser?.id || null
    const userEmail = currentUser?.email || (form as any).email || ''

    const orderPromises = cartStore.items.map(async (item) => {
      const itemSubtotal = (item.price || item.originalPrice) * item.quantity
      const itemProportion = itemSubtotal / subtotalAll
      const itemDiscountAmount = totalDiscountAmount * itemProportion
      const itemShippingCost = shippingCost * itemProportion
      const itemTotal = itemSubtotal - itemDiscountAmount + itemShippingCost

      // Get product image URL
      const productImage = getProductImageUrl(item)

      const orderData = {
        orderNumber: `${orderNumber}-${item._id}`,
        user: userId,
        product: item._id,
        productName: item.name,
        productImage: productImage, // Add product image
        quantity: item.quantity,
        customerName: `${form.firstName} ${form.lastName}`,
        customerEmail: userEmail,
        customerLocation: `${form.address}, ${form.city}, ${form.zip}, ${userEmail}`,
        amount: itemSubtotal,
        shippingMethod: shippingMethod,
        shippingCost: parseFloat(itemShippingCost.toFixed(2)),
        couponCode: appliedCoupon.value?.code || '',
        discountPercent: discountPercentage,
        discountAmount: parseFloat(itemDiscountAmount.toFixed(2)),
        subtotal: parseFloat(itemSubtotal.toFixed(2)),
        totalAmount: parseFloat(itemTotal.toFixed(2)),
        paymentMethod: form.paymentMethod,
        orderDate: orderDate.toISOString(),
        orderTime: orderDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        deliveryDate: deliveryDate.toISOString(),
        deliveryTime: shippingMethod === 'pickup' ? 'Pickup from store' : '10:00 AM - 6:00 PM',
        status: 'pending'
      }

      return axios.post(`${API_URL}/orders`, orderData)
    })

    await Promise.all(orderPromises)

    if (appliedCoupon.value) {
      await redeemCoupon()
    }

    cartStore.$reset()

    setTimeout(() => {
      isProcessing.value = false
      router.push({
        name: 'OrderSuccess',
        query: {
          orderNumber,
          total: grandTotal.toFixed(2)
        }
      })
    }, 1000)

  } catch (error: any) {
    isProcessing.value = false
    console.error('Order placement failed:', error)

    const errorMsg = error.response?.data?.message || 'Failed to place order. Please try again.'
    alert(errorMsg)

    if (errorMsg.includes('Insufficient stock')) {
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }
  }
}

// Helper function to get product image URL
const getProductImageUrl = (item: any): string => {
  // If image is a full URL, return it
  if (item.image && typeof item.image === 'string') {
    if (item.image.startsWith('http')) return item.image
    // If image is a filename, build the backend URL
    return getUploadUrl(`products/${item.image}`)
  }
  // If images array exists and has at least one image
  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    const img = item.images[0]
    if (typeof img === 'string') {
      if (img.startsWith('http')) return img
      return getUploadUrl(`products/${img}`)
    }
  }
  // Fallback to placeholder
  return '/placeholder-image.jpg'
}

</script>

<style scoped>
.main-header {
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.sticky-summary {
  position: sticky;
  top: 90px;
  z-index: 1000;
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

.step-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #888;
  margin-top: 0.35rem;
  transition: all 0.3s ease;
}

.step-label.active {
  color: #000;
}

.step-line {
  height: 2px;
  width: 30px;
  background: #f1f1f1;
  margin-bottom: 20px;
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

/* QR Code Styling */
.qr-code-container {
  width: 200px;
  height: 200px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.qr-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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
