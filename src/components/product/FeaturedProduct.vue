<template>
  <section class="py-5 bg-light">
    <div class="container">
      <div class="text-center mb-4">
        <h2 class="section-title">Featured Products</h2>
        <p class="text-muted">Our most popular items</p>
      </div>

      <ProductCarousel :items="featuredProducts">
        <template #item="{ item }">
          <ProductCard
            :product="item"
            :badge="{ text: 'POPULAR', type: 'primary' }"
          />
        </template>
      </ProductCarousel>

      <div class="text-center mt-4">
        <RouterLink to="/shop">
          <button class="btn btn-outline-primary">See More</button>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { products } from '@/data/products'
import ProductCarousel from '@/components/product/ProductCarousel.vue'
import ProductCard from '@/components/product/ProductCard.vue'

const featuredProducts = products.filter(p =>
  p.badges?.includes('popular')
)
</script>
