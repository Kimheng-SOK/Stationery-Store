<template>
  <div class="profile-page">
    <div class="container py-4">
      <div class="row g-4">
        <div class="col-lg-3 col-md-4">
          <ProfileSidebar />
        </div>

        <main class="col-lg-9 col-md-8">
          <div class="info-card">
            <div class="info-card-header">
              <h5 class="mb-0">My Wishlist</h5>
              <span class="badge bg-primary">{{ wishlistItems.length }} items</span>
            </div>
            
            <div v-if="wishlistItems.length === 0" class="empty-state">
              <i class="bi bi-heart" style="font-size: 5rem; opacity: 0.2; color: #6c757d;"></i>
              <h4 class="mt-3">Your wishlist is empty</h4>
              <p class="text-muted">Start adding products you love!</p>
              <router-link to="/shop" class="btn btn-primary mt-3">
                <i class="bi bi-shop me-2"></i>Browse Products
              </router-link>
            </div>

            <div v-else class="wishlist-grid">
              <div v-for="item in wishlistItems" :key="item.id" class="wishlist-item">
                <button class="remove-btn" @click="removeItem(item.id)" title="Remove from wishlist">
                  <i class="bi bi-x-lg"></i>
                </button>
                
                <div class="item-image">
                  <img :src="item.image" :alt="item.name" />
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
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProfileSidebar from '@/components/ProfileSidebar.vue'

interface WishlistItem {
  id: number
  name: string
  price: number
  image: string
  category: string
  inStock: boolean
}

const wishlistItems = ref<WishlistItem[]>([
  {
    id: 1,
    name: 'Premium Leather Notebook',
    price: 29.99,
    image: '',
    category: 'Notebooks',
    inStock: true
  },
  {
    id: 2,
    name: 'Luxury Fountain Pen Set',
    price: 89.99,
    image: '',
    category: 'Pens & Pencils',
    inStock: true
  },
  {
    id: 3,
    name: 'Modern Desk Organizer',
    price: 34.50,
    image: '',
    category: 'Office Supplies',
    inStock: true
  },
  {
    id: 4,
    name: 'Professional Art Supplies Kit',
    price: 125.00,
    image: '',
    category: 'Art Supplies',
    inStock: false
  },
  {
    id: 5,
    name: 'Colorful Sticky Notes Bundle',
    price: 18.99,
    image: '',
    category: 'Sticky Notes',
    inStock: true
  },
  {
    id: 6,
    name: 'Hardcover Journal A5',
    price: 24.50,
    image: '',
    category: 'Notebooks',
    inStock: true
  },
  {
    id: 7,
    name: 'Gel Pen Collection 24pc',
    price: 32.00,
    image: '',
    category: 'Pens & Pencils',
    inStock: true
  },
  {
    id: 8,
    name: 'File Folder Set with Labels',
    price: 15.99,
    image: '',
    category: 'Office Supplies',
    inStock: true
  },
  {
    id: 9,
    name: 'Watercolor Paint Set 48 Colors',
    price: 67.50,
    image: '',
    category: 'Art Supplies',
    inStock: false
  },
  {
    id: 10,
    name: 'Mini Sticky Notes Rainbow Pack',
    price: 12.99,
    image: '',
    category: 'Sticky Notes',
    inStock: true
  }
])

const removeItem = (id: number) => {
  if (confirm('Remove this item from your wishlist?')) {
    wishlistItems.value = wishlistItems.value.filter(item => item.id !== id)
  }
}

const addToCart = (item: WishlistItem) => {
  if (item.inStock) {
    alert(`${item.name} has been added to your cart!`)
  } else {
    alert('This item is currently out of stock')
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

.empty-state {
  text-align: center;
  padding: 5rem 2rem;
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
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
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
  background-color: #141B3E;
  border-color: #141B3E;
}

.btn-primary:hover {
  background-color: #0d1228;
  border-color: #0d1228;
}

.btn-primary:disabled {
  background-color: #6c757d;
  border-color: #6c757d;
  cursor: not-allowed;
}

@media (max-width: 1200px) {
  .wishlist-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (max-width: 768px) {
  .wishlist-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    padding: 1rem;
  }

  .item-image {
    height: 180px;
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