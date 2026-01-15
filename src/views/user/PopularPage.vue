<template>
  <section class="popular-products py-5">
    <div class="container">
      <!-- Section Header -->
      <div class="text-center mb-5">
        <h2 class="section-title mb-2">Popular Products</h2>
        <p class="section-subtitle text-muted">Hot Selling Items This Month</p>
      </div>

      <!-- Products Grid -->
      <div v-if="hotProducts.length > 0" class="row g-4 mb-4">
        <div
          v-for="product in hotProducts"
          :key="product.id"
          class="col-lg-3 col-md-4 col-sm-6"
        >
          <ProductCard
            :product="product"
            @add-to-cart="handleAddToCart(product)"
          />
        </div>
      </div>

      <!-- No Products Message -->
      <div v-else class="no-products">
        <div class="text-center py-5">
          <i class="bi bi-inbox" style="font-size: 4rem; color: #dee2e6;"></i>
          <h5 class="mt-3 text-muted">No hot products available at the moment!</h5>
          <p class="text-muted">Check back soon for our latest hot deals.</p>
        </div>
      </div>

      <!-- View All Button -->
      <div class="text-center mt-5">
        <router-link to="/shop" class="btn btn-primary btn-lg">
          Explore More Products
          <i class="bi bi-arrow-right ms-2"></i>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProductCard from '@/components/product/ProductCard.vue'
import { products } from '@/data/products'
import type { Product } from '@/types/product'

const hotProducts = ref<Product[]>([])

onMounted(() => {
  // Filter products with 'hot' badge
  const filteredProducts = products
    .filter(p => p.badges?.some(badge => badge === 'hot'))
    // Sort by popularity score (rating * reviewCount) descending
    .sort((a, b) => {
      const scoreA = a.rating * (a.reviewCount || 0)
      const scoreB = b.rating * (b.reviewCount || 0)
      return scoreB - scoreA
    })
    // Map to fix image paths
    .map(p => ({
      ...p,
      image: p.image.replace(/^\/public/, '')
    }))

  hotProducts.value = filteredProducts
})

const handleAddToCart = (product: Product) => {
  console.log('Add to cart:', product)
  alert(`${product.name} added to cart!`)
}
</script>

<style scoped>
.popular-products {
  background-color: #f8f9fa;
  min-height: calc(100vh - 300px);
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #212529;
}

.section-subtitle {
  font-size: 1rem;
  color: #6c757d;
}

.no-products {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.btn-primary {
  background-color: #198754;
  border-color: #198754;
  padding: 0.75rem 2rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #157347;
  border-color: #146c43;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 135, 84, 0.3);
}

@media (max-width: 768px) {
  .popular-products {
    padding: 2rem 0 !important;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .section-subtitle {
    font-size: 0.9rem;
  }
}

@media (max-width: 576px) {
  .btn-primary {
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>