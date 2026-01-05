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
                <div class="product-image-container">
                  <img 
                    :src="product.image" 
                    :alt="product.name"
                    class="product-image"
                  >
                  <div class="product-overlay">
                    <button class="btn btn-light btn-sm">
                      <i class="bi bi-eye"></i> Quick View
                    </button>
                  </div>
                </div>
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
import { ref, computed, onMounted } from 'vue';
import SidebarFilter from '@/components/product/SidebarFilter.vue';
import SortBar from '@/components/product/SortBar.vue';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  brand: string;
}

// State
const products = ref<Product[]>([]);
const selectedCategory = ref<string>('');
const selectedBrand = ref<string>('');
const selectedRating = ref<number>(0);
const priceRange = ref({ min: 0, max: 1000 });
const sortBy = ref<string>('default');
const currentPage = ref<number>(1);
const itemsPerPage = 9;

// Mock categories and brands
const categories = ['NoteBook', 'Pens & Pencils', 'Office Supplies', 'Sticky Notes', 'Art Supplies'];
const brands = ['Premium Brand', 'Creative Co', 'Office Pro', 'Artisan'];

// Initialize mock data with placeholder images
onMounted(() => {
  products.value = [
    {
      id: 1,
      name: 'Premium Leather Journal',
      price: 45.00,
      originalPrice: 55.00,
      rating: 5,
      reviewCount: 738,
      image: '/public/images/notebooks/book1.jpg',
      category: 'NoteBook',
      brand: 'Premium Brand'
    },
    {
      id: 2,
      name: 'Premium Pen Collection',
      price: 35.00,
      originalPrice: 45.00,
      rating: 4,
      reviewCount: 634,
      image: '/public/images/pens&pencils/pen1.jpg',
      category: 'Pens & Pencils',
      brand: 'Creative Co'
    },
    {
      id: 3,
      name: 'Bamboo Desk Organizer',
      price: 65.00,
      rating: 5,
      reviewCount: 145,
      image: '/public/images/officeSupplies/office1.jpg',
      category: 'Office Supplices',
      brand: 'Office Pro'
    },
    {
      id: 4,
      name: 'Colorful Sticky Notes Set',
      price: 15.00,
      originalPrice: 25.00,
      rating: 4,
      reviewCount: 423,
      image: '/public/images/notebooks/book2.jpg',
      category: 'Sticky Notes',
      brand: 'Creative Co'
    },
    {
      id: 5,
      name: 'Professional Pen Set 2024',
      price: 28.00,
      rating: 5,
      reviewCount: 267,
      image: '/public/images/notebooks/book3.jpg',
      category: 'Pens & Pencils',
      brand: 'Artisan'
    },
    {
      id: 6,
      name: 'Gel Pens Set - All Colors',
      price: 22.00,
      originalPrice: 30.00,
      rating: 4,
      reviewCount: 512,
      image: '/public/images/notebooks/book4.jpg',
      category: 'Pens & Pencil',
      brand: 'Creative Co'
    },
    {
      id: 7,
      name: 'Watercolor Paint Set',
      price: 42.00,
      rating: 5,
      reviewCount: 891,
      image: '/public/images/notebooks/book5.jpg',
      category: 'Art Supplies',
      brand: 'Artisan'
    },
    {
      id: 8,
      name: 'Desk Calendar 2025',
      price: 18.00,
      rating: 4,
      reviewCount: 234,
      image: '/public/images/notebooks/book6.jpg',
      category: 'Office Supplices',
      brand: 'Office Pro'
    },
    {
      id: 9,
      name: 'Highlighter Set - Pastel',
      price: 12.00,
      originalPrice: 18.00,
      rating: 5,
      reviewCount: 567,
      image: '/public/images/notebooks/book7.jpg',
      category: 'Pens and Pencils',
      brand: 'Creative Co'
    },

    {
    id: 10,
    name: 'Notebook Set - Premium',
    price: 32.00,
    rating: 4,
    reviewCount: 189,
    image: '/public/images/notebooks/book8.jpg',
    category: 'NoteBook',
    brand: 'Premium Brand'
    },
    {
    id: 11,
    name: 'Desk Lamp Modern',
    price: 55.00,
    originalPrice: 70.00,
    rating: 5,
    reviewCount: 334,
    image: '/public/images/notebooks/book9.jpg',
    category: 'Office Supplies',
    brand: 'Office Pro'
    },
    {
    id: 12,
    name: 'Marker Set - Vibrant',
    price: 19.00,
    rating: 4,
    reviewCount: 456,
    image: '/public/images/notebooks/book10.jpg',
    category: 'Pens & Pencils',
    brand: 'Creative Co'
    }
    
  ];
});

// Computed properties
const filteredProducts = computed(() => {
  let result = products.value;

  // Category filter
  if (selectedCategory.value) {
    result = result.filter(p => p.category === selectedCategory.value);
  }

  // Brand filter
  if (selectedBrand.value) {
    result = result.filter(p => p.brand === selectedBrand.value);
  }

  // Price filter
  result = result.filter(p => 
    p.price >= priceRange.value.min && p.price <= priceRange.value.max
  );

  // Rating filter
  if (selectedRating.value > 0) {
    result = result.filter(p => p.rating === selectedRating.value);
  }

  // Sorting
  switch (sortBy.value) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      result.sort((a, b) => b.id - a.id);
      break;
  }

  return result;
});

const totalPages = computed(() => 
  Math.ceil(filteredProducts.value.length / itemsPerPage)
);

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredProducts.value.slice(start, end);
});

// Methods
const renderStars = (rating: number): string => {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
};

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const clearFilters = () => {
  selectedCategory.value = '';
  selectedBrand.value = '';
  selectedRating.value = 0;
  priceRange.value = { min: 0, max: 1000 };
  sortBy.value = 'default';
  currentPage.value = 1;
};
</script>

<style scoped>
.shop-view {
  padding: 2rem 0;
  min-height: calc(100vh - 300px);
  background-color: #f8f9fa;
}

.stars {
  color: #ffc107;
  font-size: 0.85rem;
}

.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.product-card:hover {
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  transform: translateY(-4px);
}

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

.product-card:hover .product-image {
  transform: scale(1.08);
}

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
  transition: opacity 0.3s ease;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.product-info {
  padding: 1rem;
}

.product-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #212529;
  min-height: 2.4em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating-count {
  font-size: 0.8rem;
  color: #6c757d;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #198754;
}

.product-original-price {
  font-size: 0.85rem;
  color: #6c757d;
  text-decoration: line-through;
  margin-left: 0.5rem;
}

.pagination {
  margin-top: 2rem;
}

.no-products {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
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
  .shop-view {
    padding: 1rem 0;
  }

  .product-card {
    margin-bottom: 1rem;
  }
}
</style>