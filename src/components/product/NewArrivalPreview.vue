<template>
  <section class="py-5 bg-light">
    <div class="container">
      <div class="text-center mb-4">
        <h2 class="section-title">Popular Products</h2>
        <p class="text-muted">Trending now</p>
      </div>

      <ProductCarousel :items="popularProducts">
        <template #item="{ item }">
          <ProductCard
            :product="item"
            :badge="{ text: 'HOT', type: 'danger' }"
          />
        </template>
      </ProductCarousel>

      <div class="text-center mt-4">
        <RouterLink to="/hots">
          <button class="btn btn-outline-danger">See More</button>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { products } from '@/data/products'
import ProductCarousel from '@/components/product/ProductCarousel.vue'
import ProductCard from '@/components/product/ProductCard.vue'

const popularProducts = products.filter(p =>
  p.badges?.includes('hot') || p.badges?.includes('popular')
)
</script>
