<template>
  <div class="new-arrival-view">
    <div class="container-fluid px-4">
      <div v-if="productStore.loading" class="text-center py-5">
        <div class="spinner-border text-success" role="status"></div>
        <p class="mt-2 text-muted">Fetching latest arrivals...</p>
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
          <div class="page-header mb-4">
            <h3 class="mb-2">New Arrivals</h3>
            <p class="text-muted mb-0">Shop our freshest drops and latest stationery</p>
          </div>

          <SortBar
            v-model:sortBy="sortBy"
            :shown-count="paginatedProducts.length"
            :total-count="newArrivals.length"
          />

          <div v-if="paginatedProducts.length > 0" class="row g-4 mb-4">
            <div
              v-for="product in paginatedProducts"
              :key="product._id"
              class="col-lg-4 col-md-6 col-sm-6"
            >
              <ProductCard
                :product="productStore.formatProduct(product)"
                @add-to-cart="handleAddToCart(product)"
              />
            </div>
          </div>

          <div v-else class="text-center py-5">
            <i class="bi bi-box-seam" style="font-size: 4rem; color: #ccc"></i>
            <h5 class="mt-3 text-muted">No new arrivals found</h5>
            <p class="text-muted">Try adjusting your filters or check back later!</p>
          </div>

          <nav v-if="totalPages > 1" aria-label="Product pagination" class="mt-4">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
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
                <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
              </li>
            </ul>
          </nav>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/product'
import { useCategoryStore } from '@/stores/category'
import SidebarFilter from '@/components/product/SidebarFilter.vue'
import SortBar from '@/components/product/SortBar.vue'
import ProductCard from '@/components/product/ProductCard.vue'

const productStore = useProductStore()
const categoryStore = useCategoryStore()

// UI State
const selectedCategoryName = ref('')
const selectedBrand = ref('')
const selectedRating = ref(0)
const priceRange = ref({ min: 0, max: 2000 })
const sortBy = ref('newest')
const currentPage = ref(1)
const itemsPerPage = 9

// Map categories from backend for the sidebar
const categoryOptions = computed(() => categoryStore.categories.map(c => c.name))
const selectedCategoryId = computed(() => 
  categoryStore.categories.find(c => c.name === selectedCategoryName.value)?._id
)

/**
 * Filter logic: Get products from store, then filter for isNew = true
 */
const newArrivals = computed(() => {
  // First, use the professional filter we built in the store
  const allFiltered = productStore.getFilteredProducts({
    categoryId: selectedCategoryId.value,
    brand: selectedBrand.value,
    rating: selectedRating.value,
    priceRange: priceRange.value,
    sortBy: sortBy.value
  })

  // Second, restrict strictly to new arrivals
  return allFiltered.filter(p => p.isNew === true)
})

// Pagination Logic
const totalPages = computed(() => Math.ceil(newArrivals.value.length / itemsPerPage))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return newArrivals.value.slice(start, start + itemsPerPage)
})

const displayPages = computed(() => {
  const pages = []
  for (let i = 1; i <= totalPages.value; i++) pages.push(i)
  return pages
})

// Methods
const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handleAddToCart = (product: any) => {
  console.log('Added to cart:', product.name)
}

const clearFilters = () => {
  selectedCategoryName.value = ''
  selectedBrand.value = ''
  selectedRating.value = 0
  priceRange.value = { min: 0, max: 2000 }
  sortBy.value = 'newest'
  currentPage.value = 1
}

// Fetch data on load
onMounted(async () => {
  await categoryStore.fetchCategories()
  // Fetch all active products from backend
  await productStore.fetchProducts({ status: 'active' })
})
</script>

<style scoped>
.new-arrival-view {
  padding: 2rem 0;
  min-height: 80vh;
  background-color: #f8f9fa;
}

.page-header h3 {
  font-weight: 700;
  color: #2d3748;
}

.page-item.active .page-link {
  background-color: #10b981;
  border-color: #10b981;
  color: white;
}

.page-link {
  color: #4a5568;
}
</style>