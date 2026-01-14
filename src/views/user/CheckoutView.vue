<template>
  <div class="checkout-page">

    <div class="checkout-header bg-dark text-white py-3">
      <div class="container">
        <h4 class="mb-0">Checkout</h4>
      </div>
    </div>

    <div class="container my-5">

      <div class="mb-4">
        <router-link to="/shop" class="text-decoration-none text-dark">
          <i class="bi bi-chevron-left"></i> Back to shopping
        </router-link>
      </div>


      <div class="progress-steps mb-5">
        <div class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
          <div class="step-circle">
            <span v-if="currentStep > 1"><i class="bi bi-check"></i></span>
            <span v-else>1</span>
          </div>
          <div class="step-label">Cart</div>
        </div>
        <div class="step-line" :class="{ active: currentStep >= 2 }"></div>
        <div class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
          <div class="step-circle">
            <span v-if="currentStep > 2"><i class="bi bi-check"></i></span>
            <span v-else>2</span>
          </div>
          <div class="step-label">Address</div>
        </div>
        <div class="step-line" :class="{ active: currentStep >= 3 }"></div>
        <div class="step" :class="{ active: currentStep >= 3 }">
          <div class="step-circle">3</div>
          <div class="step-label">Payment</div>
        </div>
      </div>


      <div class="row g-4">

        <div class="col-lg-7">
          <h3 class="mb-4">Checkout</h3>
          <div class="checkout-section mb-4">
            <div class="section-header d-flex align-items-center mb-3">
              <i class="bi bi-person-circle me-2 fs-5"></i>
              <h5 class="mb-0">Contact Information</h5>
            </div>
            <div class="section-content">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="formData.email"
                  placeholder="your@email.com"
                  required
                >
              </div>
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="firstName" class="form-label">First Name</label>
                  <input
                    type="text"
                    class="form-control"
                    id="firstName"
                    v-model="formData.firstName"
                    required
                  >
                </div>
                <div class="col-md-6">
                  <label for="lastName" class="form-label">Last Name</label>
                  <input
                    type="text"
                    class="form-control"
                    id="lastName"
                    v-model="formData.lastName"
                    required
                  >
                </div>
              </div>
              <div class="mt-3">
                <label for="phone" class="form-label">Phone</label>
                <input
                  type="tel"
                  class="form-control"
                  id="phone"
                  v-model="formData.phone"
                  placeholder="+855100000000"
                  required
                >
              </div>
            </div>
          </div>


          <div class="checkout-section mb-4">
            <div class="section-header d-flex align-items-center mb-3">
              <i class="bi bi-geo-alt me-2 fs-5"></i>
              <h5 class="mb-0">Shipping Address</h5>
            </div>
            <div class="section-content">
              <div class="mb-3">
                <label for="street" class="form-label">Street Address</label>
                <input
                  type="text"
                  class="form-control"
                  id="street"
                  v-model="formData.street"
                  required
                >
              </div>
              <div class="row g-3">
                <div class="col-md-4">
                  <label for="city" class="form-label">City</label>
                  <input
                    type="text"
                    class="form-control"
                    id="city"
                    v-model="formData.city"
                    placeholder="122 Main st"
                    required
                  >
                </div>
                <div class="col-md-4">
                  <label for="state" class="form-label">State</label>
                  <input
                    type="text"
                    class="form-control"
                    id="state"
                    v-model="formData.state"
                    required
                  >
                </div>
                <div class="col-md-4">
                  <label for="zipCode" class="form-label">Zip Code</label>
                  <input
                    type="text"
                    class="form-control"
                    id="zipCode"
                    v-model="formData.zipCode"
                    required
                  >
                </div>
              </div>
            </div>
          </div>


          <button
            class="btn btn-success btn-lg w-100"
            @click="placeOrder"
            :disabled="!isFormValid || isProcessing"
          >
            <span v-if="isProcessing">
              <span class="spinner-border spinner-border-sm me-2"></span>
              Processing...
            </span>
            <span v-else>
              Place order ${{ orderTotal.toFixed(2) }}
            </span>
          </button>
        </div>

        <div class="col-lg-5">
          <div class="order-summary">
            <h5 class="mb-4">Order Summary</h5>

            <div class="cart-items mb-4">
              <div
                v-for="item in cartItems"
                :key="item.id"
                class="cart-item d-flex mb-3"
              >
                <div class="item-image me-3">
                  <img :src="item.image" :alt="item.name" class="img-fluid rounded">
                  <span class="item-quantity">{{ item.quantity }}</span>
                </div>
                <div class="item-details flex-grow-1">
                  <h6 class="mb-1">{{ item.name }}</h6>
                  <p class="text-muted mb-0 small">Qty: {{ item.quantity }}</p>
                </div>
                <div class="item-price">
                  <strong>${{ (item.price * item.quantity).toFixed(2) }}</strong>
                </div>
              </div>
            </div>

            <div class="order-totals">
              <div class="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="d-flex justify-content-between mb-3">
                <span>Shipping:</span>
                <span class="text-success">{{ shipping === 0 ? 'Free' : '$' + shipping.toFixed(2) }}</span>
              </div>
              <hr>
              <div class="d-flex justify-content-between fs-5">
                <strong>Total:</strong>
                <strong>${{ orderTotal.toFixed(2) }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="successModal"
      tabindex="-1"
      ref="successModalRef"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body text-center py-5">
            <div class="success-icon mb-4">
              <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
            </div>
            <h3 class="mb-3">Order Placed Successfully!</h3>
            <p class="text-muted mb-4">
              Thank you for your purchase. Your order has been received and will be processed soon.
            </p>
            <p class="mb-4">
              <strong>Order ID:</strong> #{{ orderId }}
            </p>
            <button class="btn btn-primary" @click="goToHome">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

const router = useRouter();
const currentStep = ref(2);
const isProcessing = ref(false);
const orderId = ref('');
const successModalRef = ref<HTMLElement | null>(null);

const formData = ref<FormData>({
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  zipCode: ''
});

const cartItems = ref<CartItem[]>([
  {
    id: 1,
    name: 'Premium Leather Notebook',
    price: 45.00,
    quantity: 1,
    image: '/public/images/notebooks/book1.jpg'
  }
]);

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const shipping = computed(() => {
  return subtotal.value > 50 ? 0 : 5.00;
});

const orderTotal = computed(() => {
  return subtotal.value + shipping.value;
});

const isFormValid = computed(() => {
  return formData.value.email &&
         formData.value.firstName &&
         formData.value.lastName &&
         formData.value.phone &&
         formData.value.street &&
         formData.value.city &&
         formData.value.state &&
         formData.value.zipCode;
});

const placeOrder = async () => {
  if (!isFormValid.value) {
    alert('Please fill in all required fields');
    return;
  }

  isProcessing.value = true;

  setTimeout(() => {
    orderId.value = 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase();
    isProcessing.value = false;


    alert(`Order Placed Successfully! Order ID: ${orderId.value}`);
    router.push('/');
  }, 2000);
};

const goToHome = () => {
  router.push('/');
};
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.checkout-header {
  background-color: #1e293b !important;
}

.progress-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e9ecef;
  border: 2px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #6c757d;
  transition: all 0.3s ease;
}

.step.active .step-circle {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: white;
}

.step.completed .step-circle {
  background-color: #198754;
  border-color: #198754;
  color: white;
}

.step-label {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6c757d;
  font-weight: 500;
}

.step.active .step-label {
  color: #0d6efd;
}

.step-line {
  width: 100px;
  height: 2px;
  background-color: #e9ecef;
  margin: 0 1rem;
  transition: all 0.3s ease;
}

.step-line.active {
  background-color: #198754;
}

.checkout-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.section-header h5 {
  color: #1e293b;
}

.section-content {
  padding-left: 2rem;
}


.order-summary {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  position: sticky;
  top: 100px;
}

.cart-item {
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  position: relative;
  width: 80px;
  height: 80px;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-quantity {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #dc3545;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.item-details h6 {
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.order-totals {
  margin-top: 1.5rem;
}

.success-icon {
  animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

@media (max-width: 992px) {
  .order-summary {
    position: static;
    margin-top: 2rem;
  }

  .section-content {
    padding-left: 0;
  }

  .step-line {
    width: 60px;
  }
}

@media (max-width: 576px) {
  .progress-steps {
    padding: 1rem 0;
  }

  .step-circle {
    width: 35px;
    height: 35px;
    font-size: 0.875rem;
  }

  .step-label {
    font-size: 0.75rem;
  }

  .step-line {
    width: 40px;
  }
}
</style>
