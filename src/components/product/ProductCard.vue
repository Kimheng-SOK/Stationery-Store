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
        <button class="btn btn-sm btn-outline-primary" @click="addToCart">
          <i class="bi bi-cart-plus"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Product, BadgeType } from '@/types/product'

interface Props {
  product: Product
}

const props = defineProps<Props>()

const emit = defineEmits(['add-to-cart'])
const router = useRouter()

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

const addToCart = () => {
  emit('add-to-cart')
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
</style>
