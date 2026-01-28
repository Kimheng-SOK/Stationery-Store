<template>
  <div class="product-detail-page">
    <div class="container py-5">
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

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div v-else-if="product" class="row">
        <div class="col-lg-6 mb-4">
          <div class="product-images">
            <div class="main-image-container mb-3">
              <img
                :src="selectedImage || product.image"
                :alt="product.name"
                class="main-image img-fluid rounded"
              />
              <div class="position-absolute top-0 start-0 p-3">
                <span v-if="product.isNew" class="badge bg-success me-2">New</span>
                <span v-if="calculateDiscount() > 0" class="badge bg-danger">
                  -{{ calculateDiscount() }}%
                </span>
              </div>
            </div>

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

        <div class="col-lg-6">
          <div class="product-info">
            <h1 class="product-name mb-3">{{ product.name }}</h1>

            <div class="rating-section mb-3 d-flex align-items-center">
              <div class="stars text-warning me-2">
                <i v-for="i in 5" :key="i"
                   :class="i <= Math.round(reviewStore.averageRating) ? 'bi bi-star-fill' : 'bi bi-star'">
                </i>
              </div>
              <span class="fw-bold me-1">{{ reviewStore.averageRating }}</span>
              <span class="text-muted">({{ reviewStore.totalReviews }} reviews)</span>
            </div>

            <div class="product-meta mb-3">
              <p class="mb-1"><strong>SKU:</strong> {{ product.sku }}</p>
              <p class="mb-1" v-if="product.brand">
                <strong>Brand:</strong> {{ product.brand }}
              </p>
              <p class="mb-1"><strong>Category:</strong> {{ product.categoryName }}</p>
            </div>

            <div class="price-section mb-4">
              <template v-if="!product.price || product.price === 0">
                <h3 class="current-price text-primary mb-2">
                  ${{ (product.originalPrice || 0).toFixed(2) }}
                </h3>
              </template>
              <template v-else>
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
              </template>
            </div>

            <div class="stock-status mb-4">
              <span v-if="product.stock > 0" class="badge bg-success-subtle text-success">
                <i class="bi bi-check-circle"></i> In Stock ({{ product.stock }} available)
              </span>
              <span v-else class="badge bg-danger-subtle text-danger">
                <i class="bi bi-x-circle"></i> Out of Stock
              </span>
            </div>

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

            <div class="action-buttons d-flex gap-3 mb-4">
              <button
                class="btn btn-primary btn-lg flex-grow-1"
                @click="addToCart"
                :disabled="product.stock <= 0"
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
                {{ product.description || 'High-quality stationery product perfect for your office or school needs.' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="relatedProducts.length > 0" class="related-products mt-5">
        <h3 class="mb-4">Related Products</h3>
        <div class="row g-4">
          <div
            v-for="relatedProduct in relatedProducts"
            :key="relatedProduct._id || relatedProduct.id"
            class="col-md-3 col-sm-6"
          >
            <div class="card h-100">
              <img
                :src="relatedProduct.image"
                class="card-img-top"
                :alt="relatedProduct.name"
                style="height: 200px; object-fit: cover; cursor: pointer;"
                @click="navigateToProduct(relatedProduct._id || relatedProduct.id || '')"
              />
              <div class="card-body">
                <h6 class="card-title">{{ relatedProduct.name }}</h6>
                <p class="card-text text-primary fw-bold">
                  ${{ (relatedProduct.displayPrice || 0).toFixed(2) }}
                </p>
                <button
                  class="btn btn-sm btn-outline-primary w-100"
                  @click="navigateToProduct(relatedProduct._id || '')"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-5 border-top pt-5">
        <div class="col-lg-5 mb-4">
          <div v-if="authStore.isAuthenticated">
            <ReviewProductForm
              :productId="productId"
              :user="authStore.user"
              @submit="handleNewReview"
            />
          </div>
          <div v-else class="card bg-light border-0 text-center p-5">
             <i class="bi bi-lock fs-1 text-muted"></i>
             <h5 class="mt-3">Log in to Review</h5>
             <p class="text-muted small">You must be logged in to share your experience.</p>
             <router-link to="/login" class="btn btn-sm btn-primary mt-2">Login Now</router-link>
          </div>
        </div>
        <div class="col-lg-7">
          <h3 class="mb-4">Customer Experience</h3>
          <div v-if="reviewStore.loading" class="text-center">
            <div class="spinner-border text-success" role="status"></div>
          </div>
          <ReviewProductCard v-else :reviews="reviewStore.reviews" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useProductStore } from '@/stores/product'
import { useReviewStore } from '@/stores/reviewStore'
import { useAuthStore } from '@/stores/auth'
import ReviewProductForm from '@/components/Review/ReviewProductForm.vue'
import ReviewProductCard from '@/components/Review/ReviewProductCard.vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const productStore = useProductStore()
const reviewStore = useReviewStore()
const authStore = useAuthStore()

const product = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const quantity = ref(1)
const selectedImage = ref<string>('')
const isInWishlist = ref(false)

const productId = computed(() => route.params.id as string)

const relatedProducts = computed(() => {
  if (!product.value) return []
  const currentCategoryId = typeof product.value.category === 'object' && product.value.category !== null
    ? product.value.category._id
    : product.value.category

  const filtered = productStore.products.filter(p => {
    const pCategoryId = typeof p.category === 'object' && p.category !== null ? p.category._id : p.category
    return String(pCategoryId) === String(currentCategoryId) && String(p._id) !== String(product.value._id)
  })
  return filtered.slice(0, 4).map(p => productStore.formatProduct(p))
})

watch(() => route.params.id, (newId) => {
  if (newId) {
    loadProduct()
    reviewStore.fetchReviews(newId as string)
  }
})

onMounted(async () => {
  await authStore.initializeAuth()
  loadProduct()
  reviewStore.fetchReviews(productId.value)
})

const loadProduct = async () => {
  try {
    loading.value = true
    error.value = null
    const id = route.params.id as string

    if (!productStore.isFetched) {
      await productStore.fetchProducts()
    }

    const foundProduct = productStore.products.find(p => String(p._id) === String(id))

    if (foundProduct) {
      product.value = productStore.formatProduct(foundProduct)
      selectedImage.value = product.value.image
      quantity.value = 1
      // product.value = foundProduct
      // selectedImage.value = foundProduct.image

    } else {
      error.value = 'Product not found'
    }
  } catch (err) {
    error.value = 'Failed to load product'
  } finally {
    loading.value = false
  }
}

const handleNewReview = async (payload: any) => {
  const result = await reviewStore.submitReview(payload)
  if (!result?.success) {
    reviewStore.fetchReviews(productId.value)
  } else {
    loadProduct()
    reviewStore.fetchReviews(productId.value)
  }
}

const calculateDiscount = () => {
  if (!product.value?.originalPrice || !product.value?.price) return 0
  if (product.value.originalPrice <= product.value.price) return 0
  return Math.round(((product.value.originalPrice - product.value.price) / product.value.originalPrice) * 100)
}

const increaseQuantity = () => {
  if (product.value && quantity.value < product.value.stock) quantity.value++
}

const decreaseQuantity = () => {
  if (quantity.value > 1) quantity.value--
}

const addToCart = () => {
  if (product.value) {
    cartStore.addToCart(product.value, quantity.value)
    console.log(`${quantity.value} ${product.value.name}(s) added to cart!`)
  }
}

const toggleWishlist = () => {
  isInWishlist.value = !isInWishlist.value
}

const navigateToProduct = (id: string | number) => {
  router.push({ name: 'ProductDetail', params: { id } })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// const formatDate = (dateString: string) => {
//   if (!dateString) return 'N/A'
//   const date = new Date(dateString)
//   return date.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric'
//   })
// }

</script>

<style scoped>
.product-detail-page { background-color: #f8f9fa; min-height: 100vh; }
.main-image-container { position: relative; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.main-image { width: 100%; height: auto; max-height: 500px; object-fit: contain; }
.thumbnail-image { width: 80px; height: 80px; object-fit: cover; cursor: pointer; border: 2px solid transparent; }
.thumbnail-image.active { border-color: #0d6efd; }
.product-info { background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.product-name { font-size: 2rem; font-weight: 600; }
.current-price { font-size: 2.5rem; font-weight: 700; }
</style>
