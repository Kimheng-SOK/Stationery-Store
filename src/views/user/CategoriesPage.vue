<template>
  <section class="shop-by-category py-5">
    <div class="container">
      <!-- Section Header -->
      <div class="text-center mb-5">
        <h2 class="section-title mb-2">Shop by Category</h2>
        <p class="section-subtitle text-muted">Find exactly what you're looking for</p>
      </div>

      <!-- Categories Grid -->
      <div v-if="categoriesWithImages.length > 0" class="row g-4 mb-4">
        <div
          v-for="category in categoriesWithImages"
          :key="category.id"
          class="col-lg-3 col-md-4 col-sm-6"
        >
          <div class="category-card" @click="goToCategory(category)">
            <div class="category-image-wrapper">
              <img :src="category.image" :alt="category.name" class="category-image" />
            </div>
            <div class="category-info">
              <h5 class="category-name">{{ category.name }}</h5>
            </div>
          </div>
        </div>
      </div>

      <!-- No Categories Message -->
      <div v-else class="no-categories">
        <div class="text-center py-5">
          <i class="bi bi-inbox" style="font-size: 4rem; color: #dee2e6;"></i>
          <h5 class="mt-3 text-muted">No categories available!</h5>
          <p class="text-muted">Check back soon for new categories.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { categories, products } from '@/data/products'

interface CategoryWithImage {
  id: number
  name: string
  image: string
  productCount: number
}

const router = useRouter()
const categoriesWithImages = ref<CategoryWithImage[]>([])

// Helper function to normalize category names for matching
const normalizeCategory = (categoryName: string): string => {
  return categoryName
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\s+/g, ' ')
    .trim()
}

// Helper function to check if categories match
const categoriesMatch = (cat1: string, cat2: string): boolean => {
  const normalized1 = normalizeCategory(cat1)
  const normalized2 = normalizeCategory(cat2)
  
  return normalized1.includes(normalized2) || normalized2.includes(normalized1)
}

onMounted(() => {
  // Map categories with images from products and product counts
  categoriesWithImages.value = categories.map(category => {
    // Find the first product that matches this category
    const matchingProduct = products.find(product => 
      product.category && categoriesMatch(product.category, category.name)
    )
    
    // Count products in this category
    const productCount = products.filter(product => {
      return product.category && categoriesMatch(product.category, category.name)
    }).length

    return {
      id: category.id,
      name: category.name,
      // Use the image from the first matching product, or fallback to category's default image
      image: matchingProduct?.image || category.image || '/images/notebooks/book1.jpg',
      productCount
    }
  })
})

const goToCategory = (category: CategoryWithImage) => {
  // Navigate to shop page with category filter
  router.push({
    path: '/shop',
    query: { category: category.name }
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
  position: relative;
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
  background: white;
}

.category-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #212529;
  margin: 0;
  letter-spacing: 0.5px;
}

.no-categories {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

@media (max-width: 768px) {
  .shop-by-category {
    padding: 2rem 0 !important;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .section-subtitle {
    font-size: 0.9rem;
  }

  .category-image-wrapper {
    height: 220px;
  }

  .category-name {
    font-size: 1.1rem;
  }

  .category-info {
    padding: 1.25rem;
  }
}

@media (max-width: 576px) {
  .category-image-wrapper {
    height: 200px;
  }

  .category-info {
    padding: 1rem;
  }

  .category-name {
    font-size: 1rem;
  }
}
</style>