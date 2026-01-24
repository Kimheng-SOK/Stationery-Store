<template>
  <div class="product-detail-page">
    <div class="container py-5">
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
          <li class="breadcrumb-item"><router-link to="/shop">Shop</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">{{ displayProduct?.name }}</li>
        </ol>
      </nav>

      <div v-if="productStore.loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div v-else-if="error" class="alert alert-danger text-center">
        <i class="bi bi-exclamation-triangle me-2"></i> {{ error }}
        <div class="mt-3">
          <button class="btn btn-outline-danger btn-sm" @click="router.push('/shop')">Back to Shop</button>
        </div>
      </div>

      <div v-else-if="rawProduct" class="row">
        <div class="col-lg-6 mb-4">
          <div class="product-images">
            <div class="main-image-container mb-3 position-relative">
              <img 
                :src="selectedImage || displayProduct.image" 
                :alt="displayProduct.name" 
                class="main-image img-fluid rounded"
              />
              <div class="badges-overlay">
                <span v-if="rawProduct.isNew" class="badge bg-success">NEW</span>
                <span v-if="rawProduct.discount" class="badge bg-primary">-{{ rawProduct.discount }}%</span>
                <span v-if="rawProduct.rating >= 4.5" class="badge bg-warning text-dark">POPULAR</span>
              </div>
            </div>

            <div class="thumbnail-images d-flex gap-2">
              <img 
                :src="displayProduct.image" 
                class="thumbnail-image img-thumbnail"
                :class="{ active: !selectedImage || selectedImage === displayProduct.image }"
                @click="selectedImage = displayProduct.image"
              />
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="product-info shadow-sm border-0">
            <h1 class="product-name mb-2">{{ displayProduct.name }}</h1>
            
            <div class="rating-section mb-3 d-flex align-items-center">
              <div class="stars text-warning me-2">
                <i v-for="i in 5" :key="i" 
                   :class="i <= Math.round(rawProduct.rating) ? 'bi bi-star-fill' : 'bi bi-star'">
                </i>
              </div>
              <span class="text-muted small">({{ rawProduct.reviewCount || 0 }} reviews)</span>
            </div>

            <div class="price-section mb-4">
              <h3 class="current-price text-success mb-0">
                ${{ displayProduct.displayPrice }}
              </h3>
              <div v-if="displayProduct.showStrikePrice" class="mt-1">
                <span class="text-muted text-decoration-line-through me-2">${{ rawProduct.originalPrice }}</span>
                <span class="badge bg-danger-subtle text-danger">Save ${{ (rawProduct.originalPrice - rawProduct.price).toFixed(2) }}</span>
              </div>
            </div>

            <p class="product-description text-muted mb-4">
              {{ rawProduct.description || 'No description available for this premium stationery item.' }}
            </p>

            <div class="product-meta-grid mb-4">
              <div class="meta-item"><strong>Brand:</strong> {{ rawProduct.brand || 'Stationery Co' }}</div>
              <div class="meta-item"><strong>Category:</strong> {{ rawProduct.categoryName || 'General' }}</div>
              <div class="meta-item"><strong>In Stock:</strong> {{ rawProduct.stock }} units</div>
            </div>

            <div class="d-flex align-items-end gap-3 mb-4">
              <div class="quantity-wrapper">
                <label class="form-label small fw-bold">Quantity</label>
                <div class="input-group">
                  <button class="btn btn-outline-secondary btn-sm" @click="quantity > 1 ? quantity-- : null">-</button>
                  <input type="number" class="form-control text-center bg-white" v-model="quantity" readonly style="max-width: 60px;">
                  <button class="btn btn-outline-secondary btn-sm" @click="quantity < rawProduct.stock ? quantity++ : null">+</button>
                </div>
              </div>

              <button 
                class="btn btn-primary btn-lg flex-grow-1"
                @click="handleAddToCart"
                :disabled="!rawProduct.inStock || addingToCart"
              >
                <i :class="addingToCart ? 'bi bi-arrow-repeat spin' : 'bi bi-cart-plus'"></i>
                {{ addingToCart ? 'Adding...' : 'Add to Cart' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="relatedProducts.length > 0" class="mt-5">
        <h4 class="mb-4 fw-bold">You Might Also Like</h4>
        <div class="row g-4">
          <div v-for="rp in relatedProducts" :key="rp._id" class="col-md-3 col-6">
            <ProductCard :product="productStore.formatProduct(rp)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useCartStore } from '@/stores/cartStore'
import ProductCard from '@/components/product/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()

const rawProduct = ref<any>(null)
const error = ref<string | null>(null)
const quantity = ref(1)
const selectedImage = ref('')
const addingToCart = ref(false)

// Use the store's formatter for UI display logic
const displayProduct = computed(() => {
  return rawProduct.value ? productStore.formatProduct(rawProduct.value) : null
})

// Find products in the same category
const relatedProducts = computed(() => {
  if (!rawProduct.value) return []
  return productStore.products
    .filter(p => p.category === rawProduct.value.category && p._id !== rawProduct.value._id)
    .slice(0, 4)
})

const loadProduct = async () => {
  try {
    error.value = null
    const id = route.params.id as string
    
    // Ensure store is populated
    if (!productStore.isFetched) {
      await productStore.fetchProducts()
    }

    const found = productStore.products.find(p => p._id === id || p.id === id)
    if (found) {
      rawProduct.value = found
      selectedImage.value = '' // reset for new product
      quantity.value = 1
    } else {
      error.value = "Product not found."
    }
  } catch (err) {
    error.value = "Could not load product details."
  }
}

const handleAddToCart = async () => {
  addingToCart.value = true
  try {
    await cartStore.addToCart(rawProduct.value, quantity.value)
    alert('Added to cart successfully!')
  } finally {
    addingToCart.value = false
  }
}

// Watch for route changes (e.g., clicking a related product)
watch(() => route.params.id, () => loadProduct())

onMounted(() => loadProduct())
</script>

<style scoped>
.product-detail-page { background-color: #fbfcfd; min-height: 100vh; }
.main-image-container { background: white; border-radius: 12px; overflow: hidden; height: 500px; display: flex; align-items: center; justify-content: center; border: 1px solid #edf2f7; }
.main-image { max-height: 100%; object-fit: contain; }
.badges-overlay { position: absolute; top: 15px; left: 15px; display: flex; gap: 8px; }
.product-info { background: white; padding: 40px; border-radius: 16px; height: 100%; }
.product-name { font-weight: 800; color: #1a202c; font-size: 2.2rem; }
.current-price { font-size: 2.5rem; font-weight: 800; }
.thumbnail-image { width: 80px; height: 80px; cursor: pointer; object-fit: cover; border-radius: 8px; }
.thumbnail-image.active { border: 2px solid #10b981; }
.product-meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.95rem; border-top: 1px solid #edf2f7; padding-top: 20px; }
.spin { animation: spin 1s linear infinite; display: inline-block; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

@media (max-width: 991px) {
  .product-name { font-size: 1.8rem; }
  .main-image-container { height: 350px; }
}
</style>