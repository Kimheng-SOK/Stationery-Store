<template>
  <div class="profile-page">
    <div class="container py-4">
      <div class="info-card">
        <div class="info-card-header">
          <h5 class="mb-0">My Wishlist</h5>
          <span class="badge bg-primary">{{ wishlistItems.length }} items</span>
        </div>
        
        <div v-if="isLoading" class="loading-state">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3">Loading your wishlist...</p>
        </div>

        <div v-else-if="wishlistItems.length === 0" class="empty-state">
          <i class="bi bi-heart"></i>
          <h4 class="mt-3">Your wishlist is empty</h4>
          <p class="text-muted">Start adding products you love!</p>
          <router-link to="/shop" class="btn btn-primary btn-sm">
            <i class="bi bi-shop"></i>
            <span>Browse Products</span>
          </router-link>
        </div>

        <div v-else class="wishlist-grid">
          <div v-for="item in wishlistItems" :key="item.id" class="wishlist-item">
            <button class="remove-btn" @click="removeItem(item.id)" title="Remove from wishlist">
              <i class="bi bi-x-lg"></i>
            </button>
            
            <div class="item-image">
              <img v-if="item.image" :src="item.image" :alt="item.name" />
              <div v-else class="placeholder-image">
                <i class="bi bi-image"></i>
              </div>
            </div>
            
            <div class="item-info">
              <div class="item-category">{{ item.category }}</div>
              <h6 class="item-name">{{ item.name }}</h6>
              <div class="item-price">${{ item.price.toFixed(2) }}</div>
              <div class="item-stock" :class="item.inStock ? 'text-success' : 'text-danger'">
                <i :class="item.inStock ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'" class="me-1"></i>
                {{ item.inStock ? 'In Stock' : 'Out of Stock' }}
              </div>
            </div>
            
            <button 
              class="btn btn-primary btn-sm w-100" 
              @click="addToCart(item)"
              :disabled="!item.inStock"
            >
              <i class="bi bi-cart-plus me-2"></i>
              {{ item.inStock ? 'Add to Cart' : 'Out of Stock' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

interface WishlistItem {
  id: number
  name: string
  price: number
  image: string
  category: string
  inStock: boolean
}

const router = useRouter()
const wishlistItems = ref<WishlistItem[]>([])
const isLoading = ref(true)

onMounted(async () => {
  await loadWishlist()
})

async function loadWishlist() {
  try {
    const saved = localStorage.getItem('wishlist')
    if (saved) {
      wishlistItems.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('Failed to load wishlist:', error)
  } finally {
    isLoading.value = false
  }
}

const removeItem = async (id: number) => {
  if (confirm('Remove this item from your wishlist?')) {
    try {
      wishlistItems.value = wishlistItems.value.filter(item => item.id !== id)
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems.value))
    } catch (error) {
      console.error('Failed to remove item:', error)
      alert('Failed to remove item. Please try again.')
    }
  }
}

const addToCart = async (item: WishlistItem) => {
  if (!item.inStock) {
    alert('This item is currently out of stock')
    return
  }

  try {
    alert(`${item.name} has been added to your cart!`)
    router.push('/cart')
  } catch (error) {
    console.error('Failed to add to cart:', error)
    alert('Failed to add item to cart. Please try again.')
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.container {
  max-width: 1400px;
}

.info-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow: hidden;
}

.info-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 3rem 2rem;
}

.empty-state i {
  font-size: 3.5rem !important;
  opacity: 0.2;
  color: #6c757d;
  margin-bottom: 1rem;
}

.empty-state h4 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #212529;
}

.empty-state p {
  font-size: 0.95rem;
  margin-bottom: 1.25rem;
  color: #6c757d;
}

/* CRITICAL: Small button for empty state */
.empty-state .btn {
  padding: 0.35rem 0.9rem !important;
  font-size: 0.85rem !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 0.35rem !important;
  text-decoration: none !important;
  width: auto !important;
}

.empty-state .btn i {
  font-size: 0.85rem !important;
  margin: 0 !important;
}

.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
}

.wishlist-item {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1rem;
  position: relative;
  transition: all 0.3s ease;
  background: white;
}

.wishlist-item:hover {
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  transform: translateY(-4px);
  border-color: #141B3E;
}

.remove-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #dc3545;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
}

.remove-btn:hover {
  background: #bb2d3b;
  transform: scale(1.1);
}

.item-image {
  width: 100%;
  height: 220px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.placeholder-image i {
  font-size: 3rem;
  color: #adb5bd;
}

.wishlist-item:hover .item-image img {
  transform: scale(1.05);
}

.item-info {
  margin-bottom: 1rem;
}

.item-category {
  font-size: 0.75rem;
  color: #141B3E;
  background: rgba(20, 27, 62, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  display: inline-block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.item-name {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #212529;
  font-size: 1rem;
  line-height: 1.4;
  min-height: 2.8rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #141B3E;
  margin-bottom: 0.5rem;
}

.item-stock {
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.btn-primary {
  background-color: #141B3E !important;
  border-color: #141B3E !important;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0d1228 !important;
  border-color: #0d1228 !important;
}

.btn-primary:disabled {
  background-color: #6c757d;
  border-color: #6c757d;
  cursor: not-allowed;
}

.bg-primary {
  background-color: #141B3E !important;
}

@media (max-width: 1200px) {
  .wishlist-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (max-width: 768px) {
  .profile-page {
    padding-top: 1rem;
  }

  .wishlist-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    padding: 1rem;
  }

  .item-image {
    height: 180px;
  }

  .info-card-header {
    padding: 1rem;
  }
}

@media (max-width: 576px) {
  .wishlist-grid {
    grid-template-columns: 1fr;
  }

  .empty-state {
    padding: 3rem 1rem;
  }
}
</style>