<template>
  <section class="popular-products py-5">
    <div class="container">
      <div class="text-center mb-5">
        <h2 class="section-title mb-2">Popular Products</h2>
        <p class="section-subtitle">Hot Selling Items This Month</p>
      </div>

      <div v-if="productStore.loading" class="text-center py-5">
        <div class="spinner-border text-warning" role="status"></div>
      </div>

      <div v-else-if="hotProducts.length > 0" class="row g-4 mb-4">
        <div
          v-for="product in hotProducts"
          :key="product._id"
          class="col-lg-3 col-md-4 col-sm-6"
        >
          <ProductCard
            :product="productStore.formatProduct(product)"
            @add-to-cart="handleAddToCart(product)"
          />
        </div>
      </div>

      <div v-else class="no-products text-center py-5">
        <i class="bi bi-fire" style="font-size: 4rem; color: #dee2e6;"></i>
        <h5 class="mt-3 text-muted">No high-rated products yet!</h5>
        <p class="text-muted">Check back later for our customer favorites.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import ProductCard from '@/components/product/ProductCard.vue'
import { useProductStore } from '@/stores/product'

const productStore = useProductStore()

// Compute "Hot" products from the store data
const hotProducts = computed(() => {
  return productStore.products
    // 1. Filter: Rating must be 4.5 or above
    .filter(p => p.status === 'active' && p.rating >= 4.5)
    // 2. Sort: Popularity Score = rating * reviewCount
    .sort((a, b) => {
      const scoreA = (a.rating || 0) * (a.reviewCount || 0)
      const scoreB = (b.rating || 0) * (b.reviewCount || 0)
      return scoreB - scoreA
    })
    // 3. Limit: Usually popular sections only show the top 4 or 8
    .slice(0, 8)
})

const handleAddToCart = (product: any) => {
  console.log('Added to cart:', product.name)
}

onMounted(async () => {
  // Ensure we have products in the store
  if (!productStore.isFetched) {
    await productStore.fetchProducts({ status: 'active' })
  }
})
</script>

<style scoped>
.popular-products {
  background-color: #f8f9fa;
}

.section-title {
  font-size: 2.25rem;
  font-weight: 800;
  color: #1a202c;
  letter-spacing: -0.025em;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #718096;
}

.no-products {
  background: white;
  border-radius: 12px;
  border: 1px dashed #e2e8f0;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.75rem;
  }
}
</style>