<template>
  <div class="new-arrival-view">
    <div class="container-fluid px-4">
      <div class="row">
        <!-- Sidebar Filter -->
        <aside class="col-lg-3 col-md-4 mb-4">
          <SidebarFilter
            v-model:selected-category="selectedCategory"
            v-model:selected-brand="selectedBrand"
            v-model:selected-rating="selectedRating"
            v-model:price-range="priceRange"
            v-model:show-in-stock-only="showInStockOnly"
            :categories="categories"
            :brands="brands"
            :show-availability="true"
            @clear-filters="clearFilters"
          />
        </aside>

        <!-- Main Content -->
        <main class="col-lg-9 col-md-8">
          <!-- Page Header -->
          <div class="page-header mb-4">
            <h3 class="mb-2">New Arrival</h3>
            <p class="text-muted mb-0">Discover our latest products</p>
          </div>

          <!-- Sort Bar -->
          <SortBar
            v-model:sortBy="sortBy"
            :shown-count="paginatedProducts.length"
            :total-count="filteredProducts.length"
          />

          <!-- Products Grid -->
          <div class="row g-4 mb-4">
            <div
              v-for="product in paginatedProducts"
              :key="product.id"
              class="col-lg-4 col-md-6 col-sm-6"
            >
              <ProductCard
                :product="product"
                @add-to-cart="handleAddToCart(product)"
              />
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredProducts.length === 0" class="text-center py-5">
            <i class="bi bi-box-seam" style="font-size: 4rem; color: #ccc"></i>
            <h5 class="mt-3 text-muted">No products found</h5>
            <p class="text-muted">Try adjusting your filters</p>
          </div>

          <!-- Pagination -->
          <nav v-if="totalPages > 1" aria-label="Product pagination" class="mt-4">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
                  Previous
                </a>
              </li>
              <li
                v-for="page in displayPages"
                :key="page"
                class="page-item"
                :class="{ active: currentPage === page }"
              >
                <a class="page-link" href="#" @click.prevent="changePage(page)">
                  {{ page }}
                </a>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SidebarFilter from '@/components/product/SidebarFilter.vue'
import SortBar from '@/components/product/SortBar.vue'
import ProductCard from '@/components/product/ProductCard.vue'

// Import fake data
import { products as fakeProducts } from '@/data/products'
import type { Product as ProductType } from '@/types/product'

// State
const products = ref<ProductType[]>(fakeProducts.map(p => ({
  ...p,
  // Fix image paths
  image: p.image.replace(/^\/public/, ''),
  // Normalize categories
  category: (p.category || '')
    .replace(/NoteBooks/i, 'NoteBook')
    .replace(/Pens& Pencils|Pens & Pencil|Pens and Pencils/i, 'Pens & Pencils')
    .replace(/Office Supplices/i, 'Office Supplies'),
  // Ensure reviewCount exists
  reviewCount: p.reviewCount ?? 0,
})))

const selectedCategory = ref<string>('')
const selectedBrand = ref<string>('')
const selectedRating = ref<number>(0)
const priceRange = ref({ min: 0, max: 1000 })
const sortBy = ref<string>('newest')
const currentPage = ref<number>(1)
const showInStockOnly = ref<boolean>(false)
const itemsPerPage = 9

// Mock categories and brands
const categories = ['NoteBook', 'Pens & Pencils', 'Office Supplies', 'Sticky Notes', 'Art Supplies']
const brands = ['Premium Brand', 'Creative Co', 'Office Pro', 'Artisan']

// Computed properties
const filteredProducts = computed(() => {
  let result = products.value.filter(p => p.isNew)

  // Category filter
  if (selectedCategory.value) {
    result = result.filter(p => p.category === selectedCategory.value)
  }

  // Brand filter
  if (selectedBrand.value) {
    result = result.filter(p => p.brand === selectedBrand.value)
  }

  // Price filter
  result = result.filter(p => p.price >= priceRange.value.min && p.price <= priceRange.value.max)

  // Rating filter
  if (selectedRating.value > 0) {
    result = result.filter(p => p.rating >= selectedRating.value)
  }

  // Stock filter
  if (showInStockOnly.value) {
    result = result.filter(p => p.inStock)
  }

  // Sorting
  switch (sortBy.value) {
    case 'newest':
      result.sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())
      break
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    case 'popular':
      result.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
      break
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))

const displayPages = computed(() => {
  const pages = []
  const maxPagesToShow = 5

  if (totalPages.value <= maxPagesToShow) {
    for (let i = 1; i <= totalPages.value; i++) pages.push(i)
  } else {
    let startPage = Math.max(1, currentPage.value - 2)
    const endPage = Math.min(totalPages.value, startPage + maxPagesToShow - 1)

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    for (let i = startPage; i <= endPage; i++) pages.push(i)
  }

  return pages
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

// Methods
const renderStars = (rating: number): string => {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

const handleAddToCart = (product: ProductType) => {
  console.log('Add to cart:', product)
  alert(`${product.name} added to cart!`)
}

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const clearFilters = () => {
  selectedCategory.value = ''
  selectedBrand.value = ''
  selectedRating.value = 0
  priceRange.value = { min: 0, max: 1000 }
  sortBy.value = 'newest'
  currentPage.value = 1
  showInStockOnly.value = false
}
</script>


<script lang="ts">
export default {
  name: 'NewArrivalView',
}
</script>

<style scoped>
.new-arrival-view {
  padding: 2rem 0;
  min-height: calc(100vh - 300px);
  background-color: #f8f9fa;
}

.page-header h3 {
  font-weight: 700;
  color: #212529;
}

.pagination {
  margin-top: 2rem;
}

.page-link {
  color: #495057;
  border-color: #dee2e6;
}

.page-link:hover {
  color: #198754;
  background-color: #e9ecef;
  border-color: #dee2e6;
}

.page-item.active .page-link {
  background-color: #198754;
  border-color: #198754;
}

@media (max-width: 768px) {
  .new-arrival-view {
    padding: 1rem 0;
  }
}
</style>
