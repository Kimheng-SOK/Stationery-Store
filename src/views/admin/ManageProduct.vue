<template>
  <div class="flex-grow-1 overflow-auto">
    <div class="p-4">
      <!-- Header Section -->
      <div
        class="d-flex flex-column flex-md-row align-items-md-center justify-content-md-between gap-3 mb-4"
      >
        <h2 class="h4 fw-semibold text-dark">All Products ({{ filteredProducts.length }})</h2>
        <button @click="showAddModal = true" class="btn btn-primary">
          <i class="bi bi-plus-square-dotted"></i>
          <span class="ms-2">Add New Product</span>
        </button>
      </div>

      <!-- Filters Section -->
      <div class="d-flex flex-column flex-md-row gap-2 mb-4">
        <div class="flex-grow-1">
          <span class="input-group-text bg-white border-0 rounded-2 shadow-sm gap-2">
            <i class="bi bi-search"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name, category or sku"
              class="form-control form-control-sm"
            />
          </span>
        </div>
        <select v-model="selectedCategory" class="form-select form-select-sm w-25">
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.name">
            {{ cat.name }}
          </option>
        </select>
        <select v-model="sortBy" class="form-select form-select-sm w-25">
          <option value="rating">Sort By: Most Popular</option>
          <option value="price">Sort By: Price</option>
          <option value="stock">Sort By: Stock</option>
          <option value="name">Sort By: Name</option>
          <option value="date">Sort By: Date</option>
        </select>

        <!-- sort order -->
        <button
          @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
          class="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2 w-10"
          type="button"
        >
          <span>
            <i :class="sortOrder === 'asc' ? 'bi bi-sort-down-alt' : 'bi bi-sort-down'"></i>
          </span>
        </button>
      </div>

      <!-- Table -->
      <div class="table-responsive rounded-2 border border-top bg-white">
        <table class="table table-hover mb-0">
          <thead>
            <tr class="table-light">
              <th class="px-4 py-3 text-uppercase text-muted small fw-semibold">Product Name</th>
              <th class="px-4 py-3 text-uppercase text-muted small fw-semibold">Price</th>
              <th class="px-4 py-3 text-uppercase text-muted small fw-semibold">Category</th>
              <th class="px-4 py-3 text-uppercase text-muted small fw-semibold">Added Date</th>
              <th class="px-4 py-3 text-uppercase text-muted small fw-semibold">Stock</th>
              <th class="px-4 py-3 text-uppercase text-muted small fw-semibold">Rating</th>
              <th class="px-4 py-3 text-uppercase text-muted small fw-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in paginatedProducts"
              :key="product.id"
              @dblclick="viewProductDetails(product)"
              style="cursor: pointer"
            >
              <td class="px-4 py-3">
                <div class="d-flex align-items-center gap-3">
                  <img
                    :src="product.image"
                    :alt="product.name"
                    class="rounded"
                    style="width: 48px; height: 48px; object-fit: cover"
                  />
                  <div>
                    <p class="fw-medium text-dark text-sm mb-0">{{ product.name }}</p>
                    <p class="text-muted small mb-0">{{ product.sku }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-dark small">${{ product.price }}</td>
              <td class="px-4 py-3 text-dark small">{{ product.category }}</td>
              <td class="px-4 py-3 text-dark small">{{ product.addedDate }}</td>
              <td class="px-4 py-3 text-dark small">{{ product.stock }}</td>
              <td class="px-4 py-3">
                <div class="d-flex align-items-center gap-1">
                  <svg
                    class="text-warning"
                    style="width: 16px; height: 16px"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                  <span class="fw-medium text-dark small">{{ product.rating }}</span>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="d-flex align-items-center gap-2">
                  <button
                    @click="editProduct(product)"
                    title="Edit Product"
                    class="btn btn-sm btn-outline-primary"
                  >
                    <i class="bi bi-pencil-square" style="height: auto; width: auto"></i>
                  </button>
                  <button
                    @click="deleteProduct(product.id)"
                    title="Delete Product"
                    class="btn btn-sm btn-outline-danger"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="d-flex align-items-center justify-content-center gap-2 mt-4 pt-2 border-top">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="btn btn-sm btn-outline-secondary"
        >
          <i class="bi bi-caret-left-fill"></i>
          <span class="ms-0.5">PREV</span>
        </button>
        <div class="d-flex align-items-center gap-1">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            :class="['btn btn-sm', currentPage === page ? 'btn-primary' : 'btn-outline-secondary']"
          >
            {{ page }}
          </button>
        </div>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="btn btn-sm btn-outline-secondary"
        >
          <span class="ms-0.5">NEXT</span>
          <i class="bi bi-caret-right-fill"></i>
        </button>
      </div>
    </div>

    <!-- Product Details View Modal -->
    <div v-if="selectedProduct" class="modal d-block" style="background-color: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <!-- Header -->
          <div class="modal-header">
            <h2 class="modal-title">Product Details</h2>
            <button
              @click="selectedProduct = null"
              type="button"
              class="btn-close"
              aria-label="Close"
            ></button>
          </div>

          <!-- Content -->
          <div class="modal-body">
            <!-- Product Image -->
            <div class="text-center mb-4">
              <img
                :src="selectedProduct.image"
                :alt="selectedProduct.name"
                class="rounded"
                style="width: 192px; height: 192px; object-fit: cover"
              />
            </div>

            <!-- Product Name and SKU -->
            <div class="mb-4">
              <h3 class="h5 fw-semibold text-dark mb-2">{{ selectedProduct.name }}</h3>
              <p class="text-muted small">SKU: {{ selectedProduct.sku }}</p>
            </div>

            <!-- Rating -->
            <div class="d-flex align-items-center gap-2 mb-4">
              <div class="d-flex align-items-center gap-1">
                <svg
                  class="text-warning"
                  style="width: 20px; height: 20px"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <span class="h6 fw-semibold text-dark mb-0">{{ selectedProduct.rating }}</span>
              </div>
              <span class="text-muted small">(Excellent)</span>
            </div>

            <!-- Product Details Grid -->
            <div class="row g-4 border-top border-bottom py-4">
              <!-- Price -->
              <div class="col-md-6">
                <p class="text-muted small fw-medium mb-2">Price</p>
                <p class="h5 fw-semibold text-dark mb-0">${{ selectedProduct.price }}</p>
              </div>

              <!-- Category -->
              <div class="col-md-6">
                <p class="text-muted small fw-medium mb-2">Category</p>
                <p class="h6 text-dark mb-0">{{ selectedProduct.category }}</p>
              </div>

              <!-- Stock -->
              <div class="col-md-6">
                <p class="text-muted small fw-medium mb-2">Stock Available</p>
                <p
                  class="h6 fw-semibold mb-0"
                  :class="selectedProduct.stock > 10 ? 'text-success' : 'text-warning'"
                >
                  {{ selectedProduct.stock }} units
                </p>
              </div>

              <!-- Added Date -->
              <div class="col-md-6">
                <p class="text-muted small fw-medium mb-2">Added Date</p>
                <p class="h6 text-dark mb-0">{{ selectedProduct.addedDate }}</p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="modal-footer">
            <button @click="selectedProduct = null" type="button" class="btn btn-secondary">
              Close
            </button>
            <button
              @click="(editProduct(selectedProduct), (selectedProduct = null))"
              type="button"
              class="btn btn-primary"
            >
              Edit Product
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal" class="modal d-block" style="background-color: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <!-- Header -->
          <div class="modal-header bg-light">
            <h3 class="modal-title">
              {{ editingProduct ? 'Edit Product' : 'Add New Product' }}
            </h3>
            <button @click="closeModal" type="button" class="btn-close" aria-label="Close"></button>
          </div>

          <form @submit.prevent="saveProduct" class="modal-body">
            <!-- Product Name & SKU -->
            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <label class="form-label">Product Name</label>
                <input v-model="formData.name" type="text" required class="form-control" />
              </div>

              <div class="col-md-6">
                <label class="form-label">SKU</label>
                <input v-model="formData.sku" type="text" required class="form-control" />
              </div>
            </div>

            <!-- Price & Category -->
            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <label class="form-label">Price ($)</label>
                <input
                  v-model.number="formData.price"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  class="form-control"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">Category</label>
                <select v-model="formData.category" required class="form-select">
                  <option value="">Select a category</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.name">
                    {{ cat.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Stock & Rating -->
            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <label class="form-label">Stock</label>
                <input
                  v-model.number="formData.stock"
                  type="number"
                  required
                  min="0"
                  class="form-control"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">Rating (0-5)</label>
                <input
                  v-model.number="formData.rating"
                  type="number"
                  required
                  min="0"
                  max="5"
                  step="0.1"
                  class="form-control"
                />
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="modal-footer mt-4">
              <button @click="closeModal" type="button" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary">
                {{ editingProduct ? 'Update' : 'Add' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Product } from '@/types/product'
import { products as initialProducts, categories } from '@/data/products'

const products = ref<Product[]>(initialProducts)
const showAddModal = ref(false)
const editingProduct = ref<Product | null>(null)
const selectedProduct = ref<Product | null>(null)
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('rating')
const sortOrder = ref<'asc' | 'desc'>('desc')
const currentPage = ref(1)
const itemsPerPage = 10

const formData = ref({
  name: '',
  sku: '',
  price: 0,
  originalPrice: 0,
  discount: 0,
  isNew: false,
  inStock: false,
  brand: '',
  category: '',
  stock: 0,
  rating: 0,
  image: '',
})

const filteredProducts = computed(() => {
  let filtered = products.value.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.sku.includes(searchQuery.value)
    const matchesCategory = !selectedCategory.value || product.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })

  // Sort
  if (sortBy.value === 'rating' && sortOrder.value === 'desc') {
    filtered.sort((a, b) => b.rating - a.rating)
  } else if (sortBy.value === 'rating' && sortOrder.value === 'asc') {
    filtered.sort((a, b) => a.rating - b.rating)
  } else if (sortBy.value === 'price' && sortOrder.value === 'desc') {
    filtered.sort((a, b) => b.price - a.price)
  } else if (sortBy.value === 'price' && sortOrder.value === 'asc') {
    filtered.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'stock' && sortOrder.value === 'desc') {
    filtered.sort((a, b) => b.stock - a.stock)
  } else if (sortBy.value === 'stock' && sortOrder.value === 'asc') {
    filtered.sort((a, b) => a.stock - b.stock)
  } else if (sortBy.value === 'name' && sortOrder.value === 'desc') {
    filtered.sort((a, b) => b.name.localeCompare(a.name))
  } else if (sortBy.value === 'name' && sortOrder.value === 'asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'date' && sortOrder.value === 'desc') {
    filtered.sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())
  } else if (sortBy.value === 'date' && sortOrder.value === 'asc') {
    filtered.sort((a, b) => new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime())
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredProducts.value.slice(start, start + itemsPerPage)
})

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const viewProductDetails = (product: Product) => {
  selectedProduct.value = product
}

const editProduct = (product: Product) => {
  editingProduct.value = product
  formData.value = {
    name: product.name,
    sku: product.sku,
    price: product.price,
    originalPrice: product.originalPrice ?? 0,
    discount: product.discount ?? 0,
    isNew: product.isNew ?? false,
    inStock: product.inStock ?? false,
    brand: product.brand ?? '',
    category: product.category ?? '',
    stock: product.stock,
    rating: product.rating,
    image: product.image ?? '',
  }
  showAddModal.value = true
}

const deleteProduct = (id: number) => {
  if (confirm('Are you sure you want to delete this product?')) {
    products.value = products.value.filter((p) => p.id !== id)
    currentPage.value = 1
  }
}

const saveProduct = () => {
  if (editingProduct.value) {
    const index = products.value.findIndex((p) => p.id === editingProduct.value!.id)
    if (index !== -1) {
      products.value[index] = {
        ...formData.value,
        id: editingProduct.value.id,
        addedDate: products.value[index]?.addedDate ?? new Date().toLocaleDateString(),
        image:
          products.value[index]?.image ??
          'https://api.builder.io/api/v1/image/assets/TEMP/default-product.png?width=120',
      }
    }
  } else {
    const newProduct: Product = {
      ...formData.value,
      id: Date.now(),
      addedDate: new Date().toLocaleDateString(),
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/default-product.png?width=120',
    }
    products.value.unshift(newProduct)
  }
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  editingProduct.value = null
  formData.value = {
    name: '',
    sku: '',
    price: 0,
    originalPrice: 0,
    discount: 0,
    isNew: false,
    inStock: false,
    brand: '',
    category: '',
    stock: 0,
    rating: 0,
    image: '',
  }
}
</script>

<style scoped></style>
