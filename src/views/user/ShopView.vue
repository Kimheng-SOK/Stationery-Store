<template>
  <div class="shop-view">
    <div class="container-fluid px-4">
      <div class="row">
        <!-- Sidebar Filter -->
        <aside class="col-lg-3 col-md-4 mb-4">
          <SidebarFilter
            v-model:selected-category="selectedCategory"
            v-model:selected-brand="selectedBrand"
            v-model:selected-rating="selectedRating"
            v-model:price-range="priceRange"
            :categories="categories"
            :brands="brands"
            @clear-filters="clearFilters"
          />
        </aside>

        <!-- Main Content -->
        <main class="col-lg-9 col-md-8">
          <!-- Page Header -->
          <div class="mb-4">
            <h3 class="mb-3">All Products</h3>

            <SortBar
              v-model:sortBy="sortBy"
              :shown-count="paginatedProducts.length"
              :total-count="filteredProducts.length"
            />
          </div>

          <!-- Products Grid -->
          <div v-if="paginatedProducts.length > 0" class="row g-4 mb-4">
            <div
              v-for="product in paginatedProducts"
              :key="product.id"
              class="col-lg-4 col-md-6 col-sm-6"
            >
              <div class="product-card">
                <!-- Product Image & Badges -->
                <div class="product-image-container">
                  <img :src="product.image" :alt="product.name" class="product-image">

                  <!-- Badge -->
                  <div class="product-badge-container">
                    <span v-if="product.isNew" class="badge bg-success">NEW</span>
                    <span v-if="product.discount" class="badge bg-danger ms-1">-{{ product.discount }}%</span>
                  </div>

                  <div class="product-overlay">
                    <button class="btn btn-light btn-sm">
                      <i class="bi bi-eye"></i> Quick View
                    </button>
                  </div>
                </div>

                <!-- Product Info -->
                <div class="product-info">
                  <h6 class="product-title">{{ product.name }}</h6>
                  <div class="product-rating mb-2">
                    <span class="stars">{{ renderStars(product.rating) }}</span>
                    <span class="rating-count">({{ product.reviewCount }})</span>
                  </div>
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <span class="product-price">${{ product.price }}</span>
                      <span v-if="product.originalPrice" class="product-original-price">
                        ${{ product.originalPrice }}
                      </span>
                    </div>
                    <button class="btn btn-sm btn-outline-primary">
                      <i class="bi bi-cart-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No Products Message -->
          <div v-else class="no-products">
            <div class="text-center py-5">
              <i class="bi bi-inbox" style="font-size: 4rem; color: #dee2e6;"></i>
              <h5 class="mt-3 text-muted">Oops, no products found!</h5>
              <p class="text-muted" v-if="selectedRating > 0">
                No products with {{ selectedRating }} star{{ selectedRating > 1 ? 's' : '' }} rating.
              </p>
              <p class="text-muted" v-else>
                Try adjusting your filters to see more results.
              </p>
              <button @click="clearFilters" class="btn btn-primary mt-3">
                Clear All Filters
              </button>
            </div>
          </div>

          <!-- Pagination -->
          <nav aria-label="Product pagination" class="mt-4">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
                  Previous
                </a>
              </li>
              <li
                v-for="page in totalPages"
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
import { products as fakeProducts, categories as fakeCategories } from '@/data/products'

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  image: string
  category: string
  brand: string
  isNew?: boolean
  discount?: number
}

// --- STATE ---
const products = ref<Product[]>(
  fakeProducts.map(p => ({
    ...p,
    image: p.image.replace(/^\/public/, ''),
    category: (p.category || '')
      .replace(/NoteBooks/i, 'NoteBook')
      .replace(/Pens& Pencils|Pens & Pencil|Pens and Pencils/i, 'Pens & Pencils')
      .replace(/Office Supplices/i, 'Office Supplies'),
  }))
)

const selectedCategory = ref<string>('')
const selectedBrand = ref<string>('')
const selectedRating = ref<number>(0)
const priceRange = ref({ min: 0, max: 1000 })
const sortBy = ref<string>('default')
const currentPage = ref<number>(1)
const itemsPerPage = 9

// Sidebar options
const categories = fakeCategories.map(c => c.name)
const brands = [...new Set(products.value.map(p => p.brand))]

// --- COMPUTED FILTER + SORT ---
const filteredProducts = computed(() => {
  let result = products.value

  if (selectedCategory.value) result = result.filter(p => p.category === selectedCategory.value)
  if (selectedBrand.value) result = result.filter(p => p.brand === selectedBrand.value)
  result = result.filter(p => p.price >= priceRange.value.min && p.price <= priceRange.value.max)
  if (selectedRating.value > 0) result = result.filter(p => p.rating === selectedRating.value)

  switch (sortBy.value) {
    case 'price-asc': result.sort((a, b) => a.price - b.price); break
    case 'price-desc': result.sort((a, b) => b.price - a.price); break
    case 'rating': result.sort((a, b) => b.rating - a.rating); break
    case 'popular': result.sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount)); break
    case 'newest': result.sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()); break
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredProducts.value.slice(start, start + itemsPerPage)
})

// --- METHODS ---
const renderStars = (rating: number): string =>
  '★'.repeat(rating) + '☆'.repeat(5 - rating)

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
  sortBy.value = 'default'
  currentPage.value = 1
}
</script>

<style scoped>
.shop-view { padding: 2rem 0; min-height: calc(100vh - 300px); background-color: #f8f9fa; }

.stars { color: #ffc107; font-size: 0.85rem; }

.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.product-card:hover { box-shadow: 0 8px 16px rgba(0,0,0,0.1); transform: translateY(-4px); }

.product-image-container {
  position: relative;
  overflow: hidden;
  padding-top: 100%;
  background: #f8f9fa;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.product-card:hover .product-image { transform: scale(1.08); }

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  z-index: 20; /* less than badge */
  transition: opacity 0.3s ease;
}
.product-card:hover .product-overlay { opacity: 1; }

.product-badge-container {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 30; /* above overlay */
  display: flex;
  gap: 5px;
}
.product-badge-container .badge {
  font-size: 0.7rem;
  padding: 0.35em 0.65em;
  font-weight: 600;
}

.product-info { padding: 1rem; }
.product-title { font-size: 0.95rem; font-weight: 600; margin-bottom: 0.5rem; color: #212529; min-height: 2.4em; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.product-rating { display: flex; align-items: center; gap: 0.5rem; }
.rating-count { font-size: 0.8rem; color: #6c757d; }
.product-price { font-size: 1.25rem; font-weight: 700; color: #198754; }
.product-original-price { font-size: 0.85rem; color: #6c757d; text-decoration: line-through; margin-left: 0.5rem; }

.pagination { margin-top: 2rem; }
.no-products { background: white; border-radius: 8px; padding: 2rem; margin-bottom: 2rem; }
.page-link { color: #495057; border-color: #dee2e6; }
.page-link:hover { color: #198754; background-color: #e9ecef; border-color: #dee2e6; }
.page-item.active .page-link { background-color: #198754; border-color: #198754; }

@media (max-width: 768px) {
  .shop-view { padding: 1rem 0; }
  .product-card { margin-bottom: 1rem; }
}
</style>
