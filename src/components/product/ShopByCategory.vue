<template>
  <section class="shop-by-category py-5 bg-light">
    <div class="container">
      <div class="text-center mb-5">
        <h2 class="section-title mb-2">Shop by Category</h2>
        <p class="section-subtitle text-muted">
          Find exactly what you're looking for
        </p>
      </div>

      <ProductCarousel :items="categoryCards">
        <template #item="{ item }">
          <div class="category-card" @click="goToCategory(item as CategoryCard)">
            <div class="category-image-wrapper">
              <img
                :src="(item as CategoryCard).image"
                :alt="(item as CategoryCard).name"
                class="category-image"
                loading="lazy"
              />
            </div>
            <h5 class="category-name">{{ (item as CategoryCard).name }}</h5>
          </div>
        </template>
      </ProductCarousel>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProductCarousel from '@/components/product/ProductCarousel.vue'
import { useCategoryStore } from '@/stores/category'
import type { Category } from '@/types/category'

interface CategoryCard {
  id: string
  name: string
  image: string
  slug: string
}

const router = useRouter()
const categoryStore = useCategoryStore()

// Fetch categories from API
onMounted(async () => {
  if (categoryStore.categories.length === 0) {
    try {
      await categoryStore.fetchCategories()
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }
})

// Build category cards from store data
import { API_SERVER_URL } from '@/config/api'
const BASE_URL = API_SERVER_URL

const categoryCards = computed<CategoryCard[]>(() =>
  categoryStore.categories.map((category: Category) => ({
    id: category._id,
    name: category.name,
    image: category.image
      ? `${BASE_URL}${category.image}`
      : '/placeholder.jpg',
    slug: category.slug || category.name.toLowerCase().replace(/\s+/g, '-'),
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
