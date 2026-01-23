<template>
  <section class="py-5 bg-light">
    <div class="container">
      <div class="text-center mb-4">
        <h2 class="section-title">New Arrivals</h2>
        <p class="text-muted">Just landed in our store</p>
      </div>

      <div v-if="productStore.loading" class="text-center py-5">
        <div class="spinner-border text-success" role="status"></div>
      </div>

      <ProductCarousel v-else-if="newArrivalProducts.length > 0" :items="newArrivalProducts">
        <template #item="{ item }">
          <ProductCard
            :product="item"
            @add-to-cart="handleAddToCart(item)"
          />
        </template>
      </ProductCarousel>

      <div v-else class="text-center py-4">
        <p class="text-muted">No new arrivals at the moment.</p>
      </div>

      <div class="text-center mt-4">
        <RouterLink to="/new-arrivals">
          <button class="btn btn-outline-success px-4">View All New</button>
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

const newArrivalProducts = computed(() => {
  return productStore.products
    .filter(p => p.status === 'active' && p.isNew === true)
    .map(p => productStore.formatProduct(p))
    .slice(0, 7)
})

const handleAddToCart = (product: any) => {
  console.log('New arrival added to cart:', product.name)
}

onMounted(async () => {
  if (!productStore.isFetched) {
    await productStore.fetchProducts({ status: 'active' })
  }
})
</script>

<style scoped>
.section-title {
  font-weight: 800;
  color: #1a202c;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-outline-success {
  border-width: 2px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.2s ease-in-out;
}

.btn-outline-success:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(25, 135, 84, 0.2);
}
</style>