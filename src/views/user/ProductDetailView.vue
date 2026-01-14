<template>
  <div class="product-detail-page">
    <div class="container py-5">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/home">Home</router-link>
          </li>
          <li class="breadcrumb-item">
            <router-link to="/shop">Shop</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">{{ product?.name }}</li>
        </ol>
      </nav>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <!-- Product Details -->
      <div v-else-if="product" class="row">
        <!-- Product Images -->
        <div class="col-lg-6 mb-4">
          <div class="product-images">
            <div class="main-image-container mb-3">
              <img 
                :src="selectedImage || product.image" 
                :alt="product.name" 
                class="main-image img-fluid rounded"
              />
              <!-- Badges -->
              <div class="position-absolute top-0 start-0 p-3">
                <span v-if="product.isNew" class="badge bg-success me-2">New</span>
                <span v-if="product.discount" class="badge bg-danger">
                  -{{ product.discount }}%
                </span>
              </div>
            </div>

            <!-- Thumbnail Images (if you have multiple images) -->
            <div class="thumbnail-images d-flex gap-2">
              <img 
                :src="product.image" 
                alt="Thumbnail" 
                class="thumbnail-image img-thumbnail"
                :class="{ active: selectedImage === product.image }"
                @click="selectedImage = product.image"
              />
            </div>
          </div>
        </div>

        <!-- Product Info -->
        <div class="col-lg-6">
          <div class="product-info">
            <!-- Product Name -->
            <h1 class="product-name mb-3">{{ product.name }}</h1>

            <!-- Rating & Reviews -->
            <div class="rating-section mb-3 d-flex align-items-center">
              <div class="stars text-warning me-2">
                <i v-for="i in 5" :key="i" 
                   :class="i <= product.rating ? 'bi bi-star-fill' : 'bi bi-star'">
                </i>
              </div>
              <span class="text-muted">({{ product.reviewCount || 0 }} reviews)</span>
            </div>

            <!-- SKU & Brand -->
            <div class="product-meta mb-3">
              <p class="mb-1"><strong>SKU:</strong> {{ product.sku }}</p>
              <p class="mb-1" v-if="product.brand">
                <strong>Brand:</strong> {{ product.brand }}
              </p>
              <p class="mb-1"><strong>Category:</strong> {{ product.category }}</p>
            </div>

            <!-- Price -->
            <div class="price-section mb-4">
              <h3 class="current-price text-primary mb-2">
                ${{ product.price.toFixed(2) }}
              </h3>
              <div v-if="product.originalPrice && product.originalPrice > product.price">
                <span class="original-price text-muted text-decoration-line-through me-2">
                  ${{ product.originalPrice.toFixed(2) }}
                </span>
                <span class="save-amount text-success">
                  Save ${{ (product.originalPrice - product.price).toFixed(2) }}
                </span>
              </div>
            </div>

            <!-- Stock Status -->
            <div class="stock-status mb-4">
              <span v-if="product.inStock" class="badge bg-success-subtle text-success">
                <i class="bi bi-check-circle"></i> In Stock ({{ product.stock }} available)
              </span>
              <span v-else class="badge bg-danger-subtle text-danger">
                <i class="bi bi-x-circle"></i> Out of Stock
              </span>
            </div>

            <!-- Quantity Selector -->
            <div class="quantity-section mb-4">
              <label class="form-label fw-semibold">Quantity:</label>
              <div class="input-group w-50">
                <button 
                  class="btn btn-outline-secondary" 
                  type="button"
                  @click="decreaseQuantity"
                  :disabled="quantity <= 1"
                >
                  <i class="bi bi-dash"></i>
                </button>
                <input 
                  type="number" 
                  class="form-control text-center" 
                  v-model.number="quantity"
                  min="1"
                  :max="product.stock"
                />
                <button 
                  class="btn btn-outline-secondary" 
                  type="button"
                  @click="increaseQuantity"
                  :disabled="quantity >= product.stock"
                >
                  <i class="bi bi-plus"></i>
                </button>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons d-flex gap-3 mb-4">
              <button 
                class="btn btn-primary btn-lg flex-grow-1"
                @click="addToCart"
                :disabled="!product.inStock"
              >
                <i class="bi bi-cart-plus"></i> Add to Cart
              </button>
              <button 
                class="btn btn-outline-secondary btn-lg"
                @click="toggleWishlist"
              >
                <i :class="isInWishlist ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
              </button>
            </div>

            <!-- Product Description -->
            <div class="product-description">
              <h5 class="mb-3">Product Description</h5>
              <p class="text-muted">
                {{ product.description || 'High-quality stationery product perfect for your office or school needs. Durable, reliable, and designed to meet your everyday requirements.' }}
              </p>
            </div>

            <!-- Additional Info -->
            <div class="additional-info mt-4">
              <div class="accordion" id="productAccordion">
                <div class="accordion-item">
                  <h2 class="accordion-header">
                    <button 
                      class="accordion-button collapsed" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#specifications"
                    >
                      Specifications
                    </button>
                  </h2>
                  <div id="specifications" class="accordion-collapse collapse" data-bs-parent="#productAccordion">
                    <div class="accordion-body">
                      <ul class="list-unstyled">
                        <li><strong>Product ID:</strong> {{ product.id }}</li>
                        <li><strong>Added Date:</strong> {{ formatDate(product.addedDate) }}</li>
                        <li><strong>Category:</strong> {{ product.category }}</li>
                        <li v-if="product.brand"><strong>Brand:</strong> {{ product.brand }}</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div class="accordion-item">
                  <h2 class="accordion-header">
                    <button 
                      class="accordion-button collapsed" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#shipping"
                    >
                      Shipping & Returns
                    </button>
                  </h2>
                  <div id="shipping" class="accordion-collapse collapse" data-bs-parent="#productAccordion">
                    <div class="accordion-body">
                      <p>Free shipping on orders over $50.</p>
                      <p>30-day return policy. Items must be unused and in original packaging.</p>
                      <p>Express shipping available at checkout.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products Section -->
      <div v-if="relatedProducts.length > 0" class="related-products mt-5">
        <h3 class="mb-4">Related Products</h3>
        <div class="row g-4">
          <div 
            v-for="relatedProduct in relatedProducts" 
            :key="relatedProduct.id"
            class="col-md-3 col-sm-6"
          >
            <div class="card h-100">
              <img 
                :src="relatedProduct.image" 
                class="card-img-top" 
                :alt="relatedProduct.name"
                style="height: 200px; object-fit: cover; cursor: pointer;"
                @click="navigateToProduct(relatedProduct.id)"
              />
              <div class="card-body">
                <h6 class="card-title">{{ relatedProduct.name }}</h6>
                <p class="card-text text-primary fw-bold">
                  ${{ relatedProduct.price.toFixed(2) }}
                </p>
                <button 
                  class="btn btn-sm btn-outline-primary w-100"
                  @click="navigateToProduct(relatedProduct.id)"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Product } from '@/types/product'
import { products } from '@/data/products'

const route = useRoute()
const router = useRouter()

const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const quantity = ref(1)
const selectedImage = ref<string>('')
const isInWishlist = ref(false)

// Related products based on category
const relatedProducts = computed(() => {
  if (!product.value) return []
  return products
    .filter(p => p.category === product.value?.category && p.id !== product.value?.id)
    .slice(0, 4)
})

onMounted(() => {
  loadProduct()
})

const loadProduct = () => {
  try {
    loading.value = true
    const productId = Number(route.params.id)
    
    // Find product from data
    const foundProduct = products.find(p => p.id === productId)
    
    if (foundProduct) {
      product.value = foundProduct
      selectedImage.value = foundProduct.image
    } else {
      error.value = 'Product not found'
    }
  } catch (err) {
    error.value = 'Failed to load product'
    console.error('Error loading product:', err)
  } finally {
    loading.value = false
  }
}

const increaseQuantity = () => {
  if (product.value && quantity.value < product.value.stock) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = () => {
  if (product.value) {
    // TODO: Implement cart functionality
    console.log('Adding to cart:', {
      product: product.value,
      quantity: quantity.value
    })
    
    // Show success message
    alert(`${quantity.value} ${product.value.name}(s) added to cart!`)
  }
}

const toggleWishlist = () => {
  isInWishlist.value = !isInWishlist.value
  const message = isInWishlist.value 
    ? 'Added to wishlist' 
    : 'Removed from wishlist'
  console.log(message)
}

const navigateToProduct = (productId: number) => {
  router.push({ name: 'ProductDetail', params: { id: productId } })
  // Reload product data
  loadProduct()
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}
</script>

<style scoped>
.product-detail-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.breadcrumb {
  background-color: transparent;
  padding: 0;
}

.breadcrumb-item a {
  color: #6c757d;
  text-decoration: none;
}

.breadcrumb-item a:hover {
  color: #0d6efd;
}

.main-image-container {
  position: relative;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.main-image {
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: contain;
}

.thumbnail-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.thumbnail-image:hover,
.thumbnail-image.active {
  border-color: #0d6efd;
}

.product-info {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-name {
  font-size: 2rem;
  font-weight: 600;
  color: #212529;
}

.stars i {
  font-size: 1.1rem;
}

.current-price {
  font-size: 2.5rem;
  font-weight: 700;
}

.original-price {
  font-size: 1.5rem;
}

.save-amount {
  font-size: 1rem;
  font-weight: 600;
}

.quantity-section input[type="number"]::-webkit-inner-spin-button,
.quantity-section input[type="number"]::-webkit-outer-spin-button {
  opacity: 1;
}

.action-buttons .btn-lg {
  padding: 12px 24px;
  font-size: 1.1rem;
}

.product-description p {
  line-height: 1.8;
  font-size: 1rem;
}

.accordion-button:not(.collapsed) {
  background-color: #e7f1ff;
  color: #0d6efd;
}

.related-products {
  padding: 40px 0;
}

.related-products .card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.related-products .card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .product-name {
    font-size: 1.5rem;
  }
  
  .current-price {
    font-size: 2rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-buttons .btn-lg {
    width: 100%;
  }
}
</style>
