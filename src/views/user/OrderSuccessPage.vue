<template>
  <div class="w-100 min-vh-100 bg-white d-flex align-items-center justify-content-center" style="font-family: Quicksand, sans-serif;">
    <div class="container text-center">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="mb-4 no-print">
            <div class="success-checkmark">
              <div class="check-icon">
                <span class="icon-line line-tip"></span>
                <span class="icon-line line-long"></span>
                <div class="icon-circle"></div>
                <div class="icon-fix"></div>
              </div>
            </div>
          </div>

          <h2 class="fw-bold mb-3 no-print">Order Placed Successfully!</h2>
          <p class="text-muted mb-4 px-lg-5 no-print">
            Thank you for your purchase. We've sent a confirmation email to 
            <span class="text-dark fw-bold">customer@example.com</span> with your order details.
          </p>

          <!-- Printable Receipt Section -->
          <div class="receipt-content">
            <div class="print-header">
              <svg class="print-checkmark" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="25" fill="none" stroke="#4CAF50" stroke-width="2"/>
                <path fill="none" stroke="#4CAF50" stroke-width="3" stroke-linecap="round" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
              <h1 class="print-title">Order Placed Successfully!</h1>
              <p class="print-subtitle">
                Thank you for your purchase. We've sent a confirmation email to 
                <strong>customer@example.com</strong> with your order details.
              </p>
            </div>

            <div class="card border-2 shadow-none mb-4 bg-light">
              <div class="card-body p-4">
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted small fw-bold text-uppercase">Order Number</span>
                  <span class="fw-bold text-dark">#ORD-{{ orderNumber }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted small fw-bold text-uppercase">Date</span>
                  <span class="fw-bold text-dark">{{ currentDate }}</span>
                </div>
                <div class="d-flex justify-content-between">
                  <span class="text-muted small fw-bold text-uppercase">Est. Delivery</span>
                  <span class="fw-bold text-primary">Jan 25 - Jan 28, 2026</span>
                </div>
              </div>
            </div>
          </div>

          <div class="d-grid gap-3 no-print">
            <button class="btn btn-dark btn-lg fw-bold py-3" @click="router.push('/shop')">
              Continue Shopping
            </button>
            <button class="btn btn-outline-dark btn-lg fw-bold py-3" @click="printReceipt">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-printer me-2" viewBox="0 0 16 16">
                <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"/>
                <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1"/>
              </svg>
              Print Receipt
            </button>
          </div>
          
          <p class="mt-5 text-muted small no-print">
            Having trouble? <a href="#" class="text-dark fw-bold">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// Generate a random order number for realism
const orderNumber = Math.floor(100000 + Math.random() * 900000)
const currentDate = new Date().toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})

const printReceipt = () => {
  window.print()
}
</script>

<style scoped>
/* Success Animation Styles */
.success-checkmark {
    width: 80px;
    height: 115px;
    margin: 0 auto;
}

.check-icon {
    width: 80px;
    height: 80px;
    position: relative;
    border-radius: 50%;
    box-sizing: content-box;
    border: 4px solid #4CAF50;
}

.check-icon::before {
    top: 3px;
    left: -2px;
    width: 30px;
    transform-origin: 100% 50%;
    border-radius: 100px 0 0 100px;
}

.check-icon::after {
    top: 0;
    left: 30px;
    width: 60px;
    transform-origin: 0 50%;
    border-radius: 0 100px 100px 0;
    animation: rotate-circle 4.25s ease-in;
}

.icon-line {
    height: 5px;
    background-color: #4CAF50;
    display: block;
    border-radius: 2px;
    position: absolute;
    z-index: 10;
}

.line-tip {
    top: 46px;
    left: 14px;
    width: 25px;
    transform: rotate(45deg);
    animation: icon-line-tip 0.75s;
}

.line-long {
    top: 38px;
    right: 8px;
    width: 47px;
    transform: rotate(-45deg);
    animation: icon-line-long 0.75s;
}

.icon-circle {
    top: -4px;
    left: -4px;
    z-index: 10;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 4px solid rgba(76, 175, 80, .5);
    box-sizing: content-box;
    position: absolute;
}

@keyframes icon-line-tip {
    0% { width: 0; left: 1px; top: 19px; }
    54% { width: 0; left: 1px; top: 19px; }
    70% { width: 50px; left: -8px; top: 37px; }
    84% { width: 17px; left: 21px; top: 48px; }
    100% { width: 25px; left: 14px; top: 46px; }
}

@keyframes icon-line-long {
    0% { width: 0; right: 46px; top: 54px; }
    65% { width: 0; right: 46px; top: 54px; }
    84% { width: 55px; right: 0px; top: 35px; }
    100% { width: 47px; right: 8px; top: 38px; }
}

/* Print-only header styles */
.print-header {
  display: none;
}

.print-checkmark {
  display: none;
}

/* Print Styles */
@media print {
  /* Hide everything except receipt content */
  .no-print {
    display: none !important;
  }

  /* Show print-only header */
  .print-header {
    display: block;
    text-align: center;
    margin-bottom: 2rem;
  }

  .print-checkmark {
    display: block;
    width: 60px;
    height: 60px;
    margin: 0 auto 1rem;
  }

  .print-title {
    font-size: 1.75rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #000;
  }

  .print-subtitle {
    font-size: 0.95rem;
    color: #666;
    margin-bottom: 1.5rem;
  }

  /* Reset page styles for print */
  body {
    background: white !important;
  }

  .receipt-content {
    max-width: 600px;
    margin: 0 auto;
  }

  /* Ensure card looks good in print */
  .card {
    border: 2px solid #e0e0e0 !important;
    page-break-inside: avoid;
  }

  /* Remove browser's default header and footer */
  @page {
    margin: 0.5cm;
    size: auto;
  }

  /* Hide browser default headers/footers */
  html, body {
    margin: 0 !important;
    padding: 0 !important;
  }
}
</style>