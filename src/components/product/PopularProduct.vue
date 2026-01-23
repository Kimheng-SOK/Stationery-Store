<template>
  <section class="py-5 bg-light">
    <div class="container">
      <div class="text-center mb-4">
        <h2 class="section-title">Popular Products</h2>
        <p class="text-muted">Trending customer favorites</p>
      </div>

      <div v-if="productStore.loading" class="text-center py-5">
        <div class="spinner-border text-danger" role="status"></div>
      </div>

      <ProductCarousel v-else-if="popularProducts.length > 0" :items="popularProducts">
        <template #item="{ item }">
          <ProductCard
            :product="item"
            @add-to-cart="handleAddToCart(item)"
          />
        </template>
      </ProductCarousel>

      <div v-else class="text-center py-4">
        <p class="text-muted">No high-rated products found at the moment.</p>
      </div>

      <div class="text-center mt-4">
        <RouterLink to="/hots">
          <button class="btn btn-outline-danger px-4">See More</button>
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

const productStore = useProductStore()

const popularProducts = computed(() => {
  return productStore.products
    .filter(p => p.status === 'active' && (p.rating || 0) >= 4.5)
    .map(p => productStore.formatProduct(p))
    .slice(0, 7)
})

const handleAddToCart = (product: any) => {
  console.log('Popular carousel item added:', product.name)
}

onMounted(async () => {
  // Only fetch if the store is empty
  if (!productStore.isFetched) {
    await productStore.fetchProducts({ status: 'active' })
  }
})
</script>

<style scoped>
.section-title {
  font-weight: 800;
  color: #1a202c;
}

.btn-outline-danger {
  border-width: 2px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-outline-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.2);
}
</style>