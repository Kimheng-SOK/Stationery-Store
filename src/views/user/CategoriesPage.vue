<template>
  <section class="shop-by-category py-5">
    <div class="container">

      <!-- Section Header -->
      <div class="text-center mb-5">
        <h2 class="section-title mb-2">Shop by Category</h2>
        <p class="section-subtitle text-muted">
          Find exactly what you're looking for
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="categoryStore.loading" class="text-center py-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">Loading categories...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="categoryStore.error"
        class="alert alert-danger"
        role="alert"
      >
        <i class="bi bi-exclamation-triangle"></i>
        {{ categoryStore.error }}
      </div>

      <!-- Categories Grid -->
      <div v-else-if="categoryCards.length > 0" class="row g-4 mb-4">
        <div
          v-for="category in categoryCards"
          :key="category.id"
          class="col-lg-3 col-md-4 col-sm-6"
        >
          <div class="category-card" @click="goToCategory(category)">
            <div class="category-image-wrapper">
              <img
                :src="category.image"
                :alt="category.name"
                class="category-image"
              />
            </div>
            <div class="category-info">
              <h5 class="category-name">{{ category.name }}</h5>
            </div>
          </div>
        </div>
      </div>

      <!-- No Categories -->
      <div v-else class="no-categories">
        <div class="text-center py-5">
          <i
            class="bi bi-inbox"
            style="font-size: 4rem; color: #dee2e6"
          ></i>
          <h5 class="mt-3 text-muted">No categories available!</h5>
          <p class="text-muted">Check back soon for new categories.</p>
        </div>
      </div>

    </div>
  </section>
</template>


<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
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

import { API_SERVER_URL } from '@/config/api'

onMounted(() => {
  categoryStore.fetchCategories()
})

const BASE_URL = API_SERVER_URL

const categoryCards = computed<CategoryCard[]>(() =>
  categoryStore.categories.map((category: Category) => ({
    id: category._id,
    name: category.name,
    image: category.image
      ? `${BASE_URL}${category.image}`
      : '/placeholder.jpg',
    slug:
      category.slug ||
      category.name.toLowerCase().replace(/\s+/g, '-'),
  }))
)

const goToCategory = (category: CategoryCard) => {
  if (!category.slug) {
    console.warn('Category slug is missing')
    return
  }

  router.push({
    path: '/shop',
    query: { category: category.slug },
  })
}
</script>



<style scoped>
.shop-by-category {
  background-color: #f5f5f5;
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

.category-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.category-image-wrapper {
  width: 100%;
  height: 280px;
  overflow: hidden;
}

.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.category-card:hover .category-image {
  transform: scale(1.05);
}

.category-info {
  padding: 1.5rem;
  text-align: center;
}

.category-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #212529;
  margin: 0;
}

.no-categories {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

@media (max-width: 768px) {
  .category-image-wrapper {
    height: 220px;
  }
}

@media (max-width: 576px) {
  .category-image-wrapper {
    height: 200px;
  }
}
</style>
