<template>
  <div class="w-100 min-vh-100 bg-white" style="font-family: Quicksand, sans-serif;">
    <!-- Header with Progress -->
    <div class="border-bottom py-3">
      <div class="container-fluid">
        <div class="d-flex align-items-center fw-bold">
          <button class="btn btn-link text-dark text-decoration-none d-flex align-items-center gap-2 p-0">
            <svg style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            <span class="fw-bold">Back to shopping</span>
          </button>

          <div class="d-flex align-items-center gap-4 position-absolute start-50 translate-middle-x">
            <div class="d-flex align-items-center gap-2 step-item"
                :class="{ active: currentStep === 'cart' }"
                @click="currentStep = 'cart'"
                style="cursor: pointer;">
              <span :class="currentStep === 'cart' ? 'fw-bold text-dark' : 'text-muted'">Cart</span>
            </div>

            <div class="text-muted" style="font-size: 0.875rem;">- - - - - - - - - -</div>

            <div class="d-flex align-items-center gap-2 step-item"
                :class="{ active: currentStep === 'address' }"
                @click="currentStep = 'address'"
                style="cursor: pointer;">
              <span :class="currentStep === 'address' ? 'fw-bold text-dark' : 'text-muted'">Address</span>
            </div>

            <div class="text-muted" style="font-size: 0.875rem;">- - - - - - - - - -</div>

            <div class="d-flex align-items-center gap-2 step-item"
                :class="{ active: currentStep === 'payment' }"
                @click="currentStep = 'payment'"
                style="cursor: pointer;">
              <span :class="currentStep === 'payment' ? 'fw-bold text-dark' : 'text-muted'">Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid py-4">
      <div class="row g-4">
        <!-- Cart Items -->
        <div class="col-lg-7">
          <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
            <h2 class="h6 fw-bold mb-0">Product</h2>
            <div class="d-flex gap-5 me-12">
              <span class="h6 fw-bold mb-0 me-8" style="width: 80px; text-align: center;">Quantity</span>
              <span class="h6 fw-bold mb-0 me-3" style="width: 80px; text-align: right;">Total</span>
            </div>
          </div>

          <!-- Cart Item -->
          <div v-for="(item, index) in cartItems" :key="index" class="d-flex gap-3 mb-3 pb-3 border-bottom position-relative">
            <div v-if="item.badge" class="position-absolute start-0 top-0 bg-warning text-white px-2 py-1 rounded-bottom border border-white" style="font-size: 0.75rem; font-weight: 600; z-index: 1;">
              {{ item.badge }}
            </div>

            <div class="position-relative" style="width: 150px; height: 150px; flex-shrink: 0;">
              <img :src="item.image" alt="Product" class="w-100 h-100 rounded" style="object-fit: cover;">
            </div>

            <div class="flex-grow-1">
              <h3 class="fw-bold mb-1" style="font-size: 0.9rem;">{{ item.name }}</h3>
              <p class="text-muted fw-bold mb-2" style="font-size: 0.8rem;">{{ item.description }}</p>
              <div class="d-flex gap-3 align-items-center">
                <span class="fw-bold">${{ item.price.toFixed(2) }}</span>
                <span class="text-muted text-decoration-line-through" style="font-size: 0.85rem;">{{ item.originalPrice.toFixed(2) }}</span>
              </div>
              <p class="text-muted fw-bold mb-0" style="font-size: 0.75rem;">SKU: {{ item.sku }}</p>
              <p class="text-muted fw-bold mb-0" style="font-size: 0.75rem;">Delivery by {{ item.delivery }}</p>
            </div>

            <div class="d-flex align-items-center gap-4 ">
              <div class="addbtn d-flex align-items-center gap-2 border-0 px-2 h-25 me-8" style="height: 32px;">
                <button @click="decreaseItemQuantity(index)" class="btn btn-link p-0 text-dark text-decoration-none " style="width: 30px; height: 30px; font-size: 1.6rem; line-height: 1;">
                  −
                </button>
                <span class="fw-bold " style="min-width: 30px; text-align: center; font-size: 1.3rem;">{{ item.quantity }}</span>
                <button @click="increaseItemQuantity(index)" class="btn btn-link p-0 text-dark text-decoration-none " style="width: 30px; height: 30px; font-size: 1.6rem; line-height: 1;">
                  +
                </button>
              </div>

              <span class="fw-bold me-4" style="width: 80px; text-align: right;">${{ (item.price * item.quantity).toFixed(2) }}</span>

              <button @click="removeItem(index)" class="btn btn-link p-0 text-dark bg-secondary-subtle h-full  ">
                <svg style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="col-lg-5">
          <div class="border rounded p-4 bg-light " >

            <h2 class="h5 fw-bold mb-4 " >Order Summary</h2>
           <hr class="opacity-100" style="border-top: 2px solid var(--main-color2);">
            <div class="d-flex align-items-start gap-2 mb-3 p-3 rounded relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="42" height="22" fill="currentColor" class="bi bi-check-circle-fill text-success absolute left-0 top-2" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="42" fill="currentColor" class="bi bi-truck text-secondary  " viewBox="0 0 16 16">
                <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
              </svg>
              <p class="mb-0 small text-dark pt-2 fs-5 fw-bold">
                Yay! Free shipping available on this order.
              </p>
            </div>

            <div class="mb-3">
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted text-main-color2 fw-bold">Item Total ({{ totalItems }} Items)</span>
                <span class="fw-medium">{{ itemTotal.toFixed(2) }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted text-main-color2 fw-bold">Discount</span>
                <span class="fw-medium text-secondary">2.50</span>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="d-flex align-items-center gap-2">
                  <input type="radio" name="shipping" value="shipping" style="color: var(--main-color2);" checked>
                  <span class="text-muted text-main-color2 fw-bold">Shipping</span>
                </div>
                <span class="fw-medium">2.50</span>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="d-flex align-items-center gap-2">
                  <input type="radio" name="shipping" value="pickup">
                  <span class="text-muted text-main-color2 fw-bold">Local Pickup</span>
                </div>
                <span class="fw-medium">Free</span>
              </div>

            <div class="d-flex mb-3 coupon-wrapper position-relative">
              <input type="text" class="form-control fw-bold px-5" style="background-color:#eef0fb; width: 90% ; height: 50px;" placeholder="Coupon code" v-model="couponCode">
              <button class="w-25 btn btn-primary px-4 position-absolute right-0" style="background-color: var(--main-color2); height: 50px;">Apply</button>
            </div>

              <hr class="opacity-100" style="border-top: 2px solid var(--main-color2);">
              <div class="d-flex justify-content-between align-items-center pt-3 " style="color: var(--main-color2); ">
                <span class="h5 fw-bold mb-0 text-main-color2">Grand Total</span>
                <span class="h5 fw-bold mb-0">{{ grandTotal.toFixed(2) }} $</span>
              </div>
            </div>

            <div class="form-check mb-3">
              <input class="form-check-input " type="checkbox" v-model="deliverTogether" id="deliverTogether">
              <label class="form-check-label small fw-bold" for="deliverTogether">
                Deliver all together
              </label>
            </div>

            <div class="text-center">
              <p class="text-muted mb-2 fw-bold" style="font-size: 0.7rem;">
                (estimated delivery by 17 Oct 2025)
              </p>
              <div class="d-flex justify-content-center">
                <button class="btn btn-success fw-semibold rounded-3 fs-4 d-flex align-items-center justify-content-center"
                        style="background-color: var(--main-color3); width: 75%; height: 50px;">
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { assets } from '../assets/assets'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const cartItems = ref([
  {
    image: assets.book_details,
    name: 'Brand Name - Product name,',
    description: 'its specifications and all other details of it',
    price: 3.80,
    originalPrice: 0.00,
    quantity: 1,
    sku: '890142503192​6',
    delivery: '4 Jun 2025',
    badge: 'Xmas'
  },
  {
    image: assets.book_details,
    name: 'Brand Name - Product name,',
    description: 'its specifications and all other details of other...',
    price: 3.80,
    originalPrice: 0.00,
    quantity: 1,
    sku: '890142503192​6',
    delivery: '4 Jun 2025',
    badge: null
  },
  {
    image: assets.book_details,
    name: 'Brand Name - Product name,',
    description: 'its specifications and all other details of it',
    price: 3.80,
    originalPrice: 0.00,
    quantity: 1,
    sku: '890142503192​6',
    delivery: '4 Jun 2025',
    badge: null
  },
  {
    image: assets.book_details,
    name: 'Brand Name - Product name,',
    description: 'its specifications and all other details of it',
    price: 3.80,
    originalPrice: 0.00,
    quantity: 1,
    sku: '890142503192​6',
    delivery: '4 Jun 2025',
    badge: 'Sold out'
  }
])

const couponCode = ref('')
const deliverTogether = ref(false)
const currentStep = ref('cart');
const totalItems = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

const itemTotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const grandTotal = computed(() => {
  return itemTotal.value - 2.50 + 2.50
})

const increaseItemQuantity = (index: number) => {
  cartItems.value[index].quantity++;
}

const decreaseItemQuantity = (index: number) => {
  if (cartItems.value[index].quantity > 1) {
    cartItems.value[index].quantity--;
  }
}

const removeItem = (index: number) => {
  cartItems.value.splice(index, 1)
}
</script>

<style>
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

.coupon-wrapper .form-control {
  border-top-left-radius: 50px;
  border-bottom-left-radius: 50px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: 0;
}

.coupon-wrapper .btn {
  border-top-left-radius: 50px;
  border-bottom-left-radius: 50px;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
  margin-left: -1px;
}

.coupon-wrapper .form-control {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

.coupon-wrapper .form-control:focus {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

.form-check-input:checked {
  background-color: #141B3E;
  border-color: #141B3E;
}
.addbtn {
  border: 1.5px solid #6c757d;
  border-color: var(--bs-secondary) !important;
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

.form-check-input:focus {
  border-color: #141B3E;
  box-shadow: 0 0 0 0.25rem rgba(20, 27, 62, 0.25);
}


.scrollbar-hide::-webkit-scrollbar { height: 8px; }
.scrollbar-hide::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.3); border-radius: 4px; }
.scrollbar-hide::-webkit-scrollbar-track { background: transparent; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: thin; }
</style>
