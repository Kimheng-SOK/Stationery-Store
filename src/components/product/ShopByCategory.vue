<template>
  <section class="shop-by-category py-5 bg-light">
    <div class="container">
      <!-- Section Header -->
      <div class="text-center mb-5">
        <h2 class="section-title mb-2">Shop by Category</h2>
        <p class="section-subtitle text-muted">
          Find exactly what you're looking for
        </p>
      </div>

      <!-- Category Carousel -->
      <ProductCarousel :items="categoryCards">
        <template #item="{ item }">
          <div class="category-card" @click="goToCategory(item)">
            <div class="category-image-wrapper">
              <img
                :src="item.image"
                :alt="item.name"
                class="category-image"
              />
            </div>
            <h5 class="category-name">{{ item.name }}</h5>
          </div>
        </template>
      </ProductCarousel>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import ProductCarousel from '@/components/product/ProductCarousel.vue'
import { categories } from '@/data/products'

interface CategoryCard {
  id: number
  name: string
  image: string
  slug: string
}

const router = useRouter()

/**
 * Build category cards directly from categories data
 * (images are now included in the categories array)
 */
const categoryCards = computed<CategoryCard[]>(() =>
  categories.map(category => ({
    id: category.id,
    name: category.name,
    image: category.image,
    slug: category.name.toLowerCase().replace(/\s+/g, '-'),
  }))
)

const goToCategory = (category: CategoryCard) => {
  router.push({
    path: '/shop',
    query: { category: category.slug },
  })
}
</script>

<style scoped>
.shop-by-category {
  background-color: #f8f9fa;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
}

.section-subtitle {
  font-size: 1rem;
}

.category-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  text-align: center;
  padding-bottom: 1.5rem;
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.category-image-wrapper {
  width: 100%;
  height: 250px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.category-card:hover .category-image {
  transform: scale(1.1);
}

.category-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}
</style>