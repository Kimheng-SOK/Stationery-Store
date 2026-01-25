<template>
  <div class="shop-view">
    <div class="container-fluid px-2 px-md-4">
      <div v-if="productStore.loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-3">Loading your products...</p>
      </div>

      <div v-else class="row g-2 g-md-4">
        <aside class="col-lg-3 col-md-12 mb-4">
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

        <main class="col-lg-9 col-md-12">
          <SortBar 
            v-model:sortBy="sortBy" 
            :shown-count="paginatedProducts.length" 
            :total-count="filteredProducts.length" 
          />

          <div v-if="paginatedProducts.length > 0" class="row g-2 g-md-4 mb-4">
            <div
              v-for="product in paginatedProducts"
              :key="product._id"
              class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6"
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

          <nav v-if="totalPages > 1" aria-label="Product pagination" class="mt-4">
            <ul class="pagination pagination-custom justify-content-center">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">&lt;</a>
              </li>
              <li
                v-for="page in displayPages"
                :key="page"
                class="page-item"
                :class="{ active: currentPage === page }"
              >
                <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">&gt;</a>
              </li>
            </ul>
          </nav>
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

const selectedCategoryName = ref('')
const selectedBrand = ref('')
const selectedRating = ref(0)
const priceRange = ref({ min: 0, max: 2000 })
const sortBy = ref('default')
const currentPage = ref(1)

const categoryOptions = computed(() => categoryStore.categories.map(c => c.name))
const selectedCategoryId = computed(() => 
  categoryStore.categories.find(c => c.name === selectedCategoryName.value)?._id
)

// This extracts the search term from the URL Query ?search=...
const searchTerm = computed(() => (route.query.search as string) || '')

const filteredProducts = computed(() => {
  return productStore.getFilteredProducts({
    categoryId: selectedCategoryId.value,
    brand: selectedBrand.value,
    rating: selectedRating.value,
    priceRange: priceRange.value,
    sortBy: sortBy.value,
    searchTerm: searchTerm.value // Re-filters instantly when URL changes
  })
})

watch(() => route.query.search, () => { currentPage.value = 1 })

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / 9))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * 9
  return filteredProducts.value.slice(start, start + 9)
})

const displayPages = computed(() => {
  const pages = []
  for (let i = 1; i <= totalPages.value; i++) pages.push(i)
  return pages
})

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const syncQuery = () => {
  const categorySlug = route.query.category
  if (categorySlug && categoryStore.categories.length > 0) {
    const match = categoryStore.categories.find(c => c.slug === categorySlug)
    if (match) selectedCategoryName.value = match.name
  }
}

watch(() => route.query.category, syncQuery)
watch(() => categoryStore.categories, syncQuery)

const handleAddToCart = (product: any) => {
  console.log('Adding to cart:', product.name)
}

const clearFilters = () => {
  selectedCategoryName.value = ''; selectedBrand.value = ''; selectedRating.value = 0;
  priceRange.value = { min: 0, max: 2000 }; sortBy.value = 'default'
  // Logic to also clear the URL search
}

onMounted(async () => {
  await categoryStore.fetchCategories()
  await productStore.fetchProducts({ status: 'active' })
  syncQuery()
})
</script>

<style scoped>
.shop-view { padding: 2rem 0; min-height: 80vh; background-color: #f8f9fa; }
.no-products { background: white; border-radius: 8px; padding: 2rem; }
.pagination-custom .page-link { color: #374151; border: 1px solid #e5e7eb; padding: 0.5rem 0.85rem; font-size: 0.95rem; background-color: white; }
.pagination-custom .page-item.active .page-link { background-color: #10b981; border-color: #10b981; color: white; }
.pagination-custom .page-item.disabled .page-link { background-color: #f3f4f6; color: #9ca3af; }
@media (max-width: 576px) { .shop-view { padding: 1rem 0; } .row.g-2 { --bs-gutter-x: 0.5rem; --bs-gutter-y: 0.5rem; } .pagination-custom .page-link { padding: 0.4rem 0.7rem; font-size: 0.85rem; } }
</style>