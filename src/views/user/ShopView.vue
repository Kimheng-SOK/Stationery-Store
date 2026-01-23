<template>
  <div class="shop-view">
    <div class="container-fluid px-4">
      <div v-if="productStore.loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-3">Loading your products...</p>
      </div>

      <div v-else class="row">
        <aside class="col-lg-3 col-md-4 mb-4">
          <SidebarFilter
            v-model:selected-category="selectedCategoryName"
            v-model:selected-brand="selectedBrand"
            v-model:selected-rating="selectedRating"
            v-model:price-range="priceRange"
            :categories="categoryOptions"
            :brands="productStore.getBrands"
            @clear-filters="clearFilters"
          />
        </aside>

        <main class="col-lg-9 col-md-8">
          <SortBar 
            v-model:sortBy="sortBy" 
            :shown-count="paginatedProducts.length" 
            :total-count="filteredProducts.length" 
          />

          <div v-if="paginatedProducts.length > 0" class="row g-4 mb-4">
            <div
              v-for="product in paginatedProducts"
              :key="product._id"
              class="col-lg-4 col-md-6"
            >
              <ProductCard
                :product="productStore.formatProduct(product)"
                @add-to-cart="handleAddToCart"
              />
            </div>
          </div>

          <div v-else class="text-center py-5 no-products">
            <i class="bi bi-search" style="font-size: 3rem; color: #ccc;"></i>
            <h5 class="mt-3">No products found matching your filters.</h5>
            <button @click="clearFilters" class="btn btn-primary mt-2">Clear Filters</button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useCategoryStore } from '@/stores/category'
import SidebarFilter from '@/components/product/SidebarFilter.vue'
import SortBar from '@/components/product/SortBar.vue'
import ProductCard from '@/components/product/ProductCard.vue'

const route = useRoute()
const productStore = useProductStore()
const categoryStore = useCategoryStore()

// UI State
const selectedCategoryName = ref('')
const selectedBrand = ref('')
const selectedRating = ref(0)
const priceRange = ref({ min: 0, max: 2000 })
const sortBy = ref('default')
const currentPage = ref(1)

// Computed helpers
const categoryOptions = computed(() => categoryStore.categories.map(c => c.name))
const selectedCategoryId = computed(() => 
  categoryStore.categories.find(c => c.name === selectedCategoryName.value)?._id
)

// The Professional Filter Logic (from store)
const filteredProducts = computed(() => {
  return productStore.getFilteredProducts({
    categoryId: selectedCategoryId.value,
    brand: selectedBrand.value,
    rating: selectedRating.value,
    priceRange: priceRange.value,
    sortBy: sortBy.value
  })
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * 9
  return filteredProducts.value.slice(start, start + 9)
})

const handleAddToCart = (product: any) => {
  console.log('Adding to cart:', product.name)
}

const clearFilters = () => {
  selectedCategoryName.value = ''; selectedBrand.value = ''; selectedRating.value = 0;
  priceRange.value = { min: 0, max: 2000 }; sortBy.value = 'default'
}

onMounted(async () => {
  await categoryStore.fetchCategories()
  await productStore.fetchProducts({ status: 'active' })
})
</script>
<style scoped>
.shop-view { padding: 2rem 0; min-height: calc(100vh - 300px); background-color: #f8f9fa; }
.badge { font-size: 0.8rem; font-weight: 500; padding: 0.4rem 0.8rem; }
.spinner-border { width: 3rem; height: 3rem; }
.pagination { margin-top: 2rem; }
.no-products { background: white; border-radius: 8px; padding: 2rem; margin-bottom: 2rem; }
.page-link { color: #495057; border-color: #dee2e6; }
.page-item.active .page-link { background-color: #198754; border-color: #198754; color: white; }
@media (max-width: 768px) { .shop-view { padding: 1rem 0; } }
</style>