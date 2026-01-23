<template>
  <div class="product-card">
    <!-- Badges -->
    <div v-if="product.badges && product.badges.length > 0" class="product-badges">
      <span
        v-for="badgeType in product.badges"
        :key="badgeType"
        :class="['badge', getBadgeClass(badgeType)]"
      >
        {{ getBadgeText(badgeType) }}
      </span>
    </div>

    <!-- Product Image -->
    <div class="product-image-container" @click="viewDetails" style="cursor: pointer;">
      <img :src="product.image" :alt="product.name" class="product-image" />
    </div>

    <!-- Product Info -->
    <div class="product-info">
      <h6 class="product-title" @click="viewDetails" style="cursor: pointer;">{{ product.name }}</h6>
      <div class="product-rating mb-2">
        <span class="stars">{{ renderStars(product.rating) }}</span>
        <span class="rating-count">({{ product.reviewCount }})</span>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <span class="product-price">${{ product.price }}</span>
          <span v-if="product.originalPrice" class="product-original-price">
            ${{ product.originalPrice }}
          </span>
        </div>
        <button 
          class="btn btn-sm btn-outline-primary" 
          @click="addToCart"
          :disabled="!product.inStock || addingToCart"
        >
          <i :class="addingToCart ? 'bi bi-hourglass-split' : 'bi bi-cart-plus'"></i>
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
import type { Product, BadgeType } from '@/types/product'

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

const getBadgeClass = (badgeType: BadgeType): string => {
  const classes: Record<BadgeType, string> = {
    'new': 'bg-success',
    'hot': 'bg-danger',
    'popular': 'bg-warning',
    'instock': 'bg-info',
    'discount': 'bg-primary'
  }
  return classes[badgeType] || 'bg-secondary'
}

const getBadgeText = (badgeType: BadgeType): string => {
  const texts: Record<BadgeType, string> = {
    'new': 'NEW',
    'hot': 'HOT',
    'popular': 'POPULAR',
    'instock': 'IN STOCK',
    'discount': props.product.discount ? `-${props.product.discount}%` : 'SALE'
  }
  return texts[badgeType] || badgeType.toUpperCase()
}

const addToCart = async () => {
  if (!props.product.inStock) {
    return
  }

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
  router.push({ name: 'ProductDetail', params: { id: props.product.id } })
}
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
}

.product-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.product-badges {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  max-width: calc(100% - 20px);
}

.product-badges .badge {
  font-size: 0.7rem;
  padding: 0.35em 0.65em;
  font-weight: 600;
}

.product-image-container {
  position: relative;
  overflow: hidden;
  padding-top: 100%;
  background: #f8f9fa;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.08);
}

.product-info {
  padding: 1rem;
}

.product-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #212529;
  min-height: 2.4em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stars {
  color: #ffc107;
  font-size: 0.85rem;
}

.rating-count {
  font-size: 0.8rem;
  color: #6c757d;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #198754;
}

.product-original-price {
  font-size: 0.85rem;
  color: #6c757d;
  text-decoration: line-through;
  margin-left: 0.5rem;
}

.btn-outline-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Success Toast */
.success-toast {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #198754;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 20;
  animation: slideUp 0.3s ease-out;
  display: flex;
  align-items: center;
  white-space: nowrap;
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