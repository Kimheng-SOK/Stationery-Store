<template>
  <div class="product-card">
    <div class="product-badges">
      <span v-if="product.isNew" class="badge badge-new">
        NEW
      </span>

      <span v-if="product.discount && product.discount > 0" class="badge badge-discount">
        -{{ product.discount }}%
      </span>

      <span v-if="product.rating && product.rating >= 4" class="badge badge-popular">
        <i class="bi bi-star-fill me-1"></i> POPULAR
      </span>

      <span v-if="!product.inStock" class="badge badge-out">
        OUT OF STOCK
      </span>
    </div>

    <div class="product-image-container" @click="viewDetails">
      <img :src="product.image" :alt="product.name" class="product-image" loading="lazy" />
      <div class="image-overlay">
        <span class="view-text">View Details</span>
      </div>
    </div>

    <div class="product-info">
      <p class="product-category text-uppercase">{{ typeof product.category === 'object' ? product.category.name : product.category }}</p>

      <h6 class="product-title" @click="viewDetails">{{ product.name }}</h6>

      <div class="product-rating mb-3">
        <span class="stars">{{ renderStars(Math.round(product.rating || 0)) }}</span>
        <span class="rating-count">({{ product.reviewCount || 0 }})</span>
      </div>

      <div class="d-flex justify-content-between align-items-center mt-auto">
        <div class="price-wrapper">
          <span class="product-price">${{ product.displayPrice || product.price }}</span>
          <span
            v-if="product.discount && product.discount > 0"
            class="product-original-price"
          >
            ${{ product.originalPrice }}
          </span>
        </div>
        <button
          class="btn btn-sm btn-outline-primary"
          @click="addToCart"
          :disabled="!product.inStock || addingToCart"
          :class="{ 'loading': addingToCart }"
        >
          <i :class="addingToCart ? 'bi bi-arrow-repeat spin' : 'bi bi-bag-plus'"></i>
        </button>
      </div>
    </div>

    <!-- Success Toast Message -->
    <div
      v-if="showSuccessMessage"
      class="success-toast"
    >
      <i class="bi bi-check-circle-fill me-2"></i>
      Added to cart!
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import type { Product } from '@/types/product'

interface Props {
  product: Product
}

const props = defineProps<Props>()
const router = useRouter()
const cartStore = useCartStore()

const addingToCart = ref(false)
const showSuccessMessage = ref(false)

const renderStars = (rating: number): string => {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

const addToCart = async () => {
  if (!props.product.inStock) return

  addingToCart.value = true
  try {
    addingToCart.value = true

    // Add to cart with quantity of 1
    cartStore.addToCart(props.product, 1)

    // Show success message
    showSuccessMessage.value = true

    // Hide message after 2 seconds
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 2000)
  } catch (err) {
    if (err instanceof Error) {
      alert(err.message)
    }
  } finally {
    addingToCart.value = false
  }
}

const viewDetails = () => {
  router.push({ name: 'ProductDetail', params: { id: props.product._id } })
}
</script>

<style scoped>
.product-card {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #edf2f7;
  position: relative;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Badges Styling */
.product-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 5;
  display: flex;
  flex-direction: row; /* Changed from column to row */
  flex-wrap: nowrap;   /* Keeps them in one line */
  gap: 6px;
  max-width: calc(100% - 24px); /* Prevents badges from overshooting the card edge */
  overflow: hidden;    /* Clips if they are somehow too long */
}

.badge {
  padding: 4px 10px;
  font-size: 10px;     /* Slightly smaller to fit better in one line */
  font-weight: 700;
  border-radius: 6px;
  letter-spacing: 0.5px;
  border: none;
  white-space: nowrap; /* Ensures text like "IN STOCK" doesn't break into two lines */
  display: flex;
  align-items: center;
}

.badge-new { background: #10b981; color: white; }
.badge-discount { background: #3b82f6; color: white; }
.badge-popular { background: #f59e0b; color: white; }
.badge-out { background: #64748b; color: white; }

/* Image Section */
.product-image-container {
  position: relative;
  aspect-ratio: 1 / 1;
  background: #f7fafc;
  cursor: pointer;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.product-card:hover .product-image {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.product-card:hover .image-overlay {
  opacity: 1;
}

.view-text {
  color: white;
  background: rgba(0, 0, 0, 0.6);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

/* Info Section */
.product-info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-category {
  font-size: 11px;
  color: #a0aec0;
  margin-bottom: 4px;
  font-weight: 600;
}

.product-title {
  font-size: 15px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
  line-height: 1.4;
  cursor: pointer;
}

.product-title:hover { color: #3182ce; }

.stars { color: #ecc94b; letter-spacing: 2px; }
.rating-count { font-size: 12px; color: #718096; margin-left: 6px; }

/* Price and Button */
.product-price {
  font-size: 18px;
  font-weight: 700;
  color: #2d3748;
}

.product-original-price {
  font-size: 13px;
  color: #a0aec0;
  text-decoration: line-through;
  margin-left: 8px;
}

.btn-add-cart {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: #ebf8ff;
  color: #3182ce;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.btn-add-cart:hover:not(:disabled) {
  background: #3182ce;
  color: white;
}

.btn-add-cart:disabled {
  background: #f7fafc;
  color: #cbd5e0;
  cursor: not-allowed;
}

.spin {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Success Toast */
.success-toast {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(45, 55, 72, 0.95);
  color: white;
  padding: 10px 20px;
  border-radius: 30px;
  font-size: 13px;
  white-space: nowrap;
  z-index: 100;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
