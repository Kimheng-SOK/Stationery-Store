<template>
  <section class="py-5 bg-light">
    <div class="container">
      <div class="text-center mb-4">
        <h2 class="section-title">Featured Products</h2>
        <p class="text-muted">Our top picks for you</p>
      </div>

      <div v-if="productStore.loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <ProductCarousel v-else-if="featuredProducts.length > 0" :items="featuredProducts">
        <template #item="{ item }">
          <ProductCard
            :product="item"
            @add-to-cart="handleAddToCart(item as Product)"
          />
        </template>
      </ProductCarousel>

      <div v-else class="text-center py-4">
        <p class="text-muted">No featured products available.</p>
      </div>

      <div class="text-center mt-4">
        <RouterLink to="/shop">
          <button class="btn btn-outline-primary px-4">See More</button>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/product'
import ProductCarousel from '@/components/product/ProductCarousel.vue'
import ProductCard from '@/components/product/ProductCard.vue'
import type { Product } from '@/types/product'

const productStore = useProductStore()

const featuredProducts = computed(() => {
  return productStore.products
    .filter(p => p.status === 'active')
    .slice(0, 7) // Take exactly the first 7 products
    .map(p => productStore.formatProduct(p)) // Apply image/price formatting
})

const handleAddToCart = (product: Product) => {
  console.log('Featured product added to cart:', product.name)
}

onMounted(async () => {
  // Fetch if products aren't already in state
  if (!productStore.isFetched) {
    await productStore.fetchProducts({ status: 'active' })
  }
})
</script>

<style scoped>
.section-title {
  font-weight: 700;
  color: #212529;
}

.btn-outline-primary {
  border-width: 2px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-outline-primary:hover {
  transform: translateY(-2px);
}
</style>
