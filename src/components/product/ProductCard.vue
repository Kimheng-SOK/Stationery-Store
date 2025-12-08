<template>
  <div class="product-card">
    <!-- Badge -->
    <div v-if="badge" class="product-badge">
      <span :class="`badge bg-${badge.type}`">{{ badge.text }}</span>
    </div>

    <!-- Product Image -->
    <div class="product-image-container">
      <img :src="product.image" :alt="product.name" class="product-image" />
      <div class="product-overlay">
        <button class="btn btn-light btn-sm" @click="quickView">
          <i class="bi bi-eye"></i> Quick View
        </button>
      </div>
    </div>

    <!-- Product Info -->
    <div class="product-info">
      <h6 class="product-title">{{ product.name }}</h6>
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
interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  image: string
}

interface Badge {
  text: string
  type: 'success' | 'danger' | 'warning' | 'primary'
}

interface Props {
  product: Product
  badge?: Badge
}

defineProps<Props>()

const emit = defineEmits(['quick-view', 'add-to-cart'])

const renderStars = (rating: number): string => {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

const quickView = () => {
  emit('quick-view')
}

const addToCart = () => {
  emit('add-to-cart')
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

.product-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
}

.product-badge .badge {
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

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-overlay {
  opacity: 1;
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
