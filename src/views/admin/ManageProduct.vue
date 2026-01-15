<template>
  <div class="flex-grow-1 overflow-auto">
    <div class="p-4">
      <!-- Header Section -->
      <div
        class="d-flex flex-column flex-md-row align-items-md-center justify-content-md-between gap-3 mb-4"
      >
        <h2 class="h4 fw-semibold text-dark">
          All Products
          <span v-if="pagination" class="text-muted small">
            ({{ pagination.total }})
          </span>
        </h2>
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
              v-model="filters.search"
              type="text"
              placeholder="Search by name, SKU or description"
              class="form-control form-control-sm border-0"
              @input="debouncedSearch"
            />
          </span>
        </div>
        <select v-model="filters.category" class="form-select form-select-sm w-25" @change="loadProducts">
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat._id || cat.id" :value="cat._id || cat.id">
            {{ cat.name }}
          </option>
        </select>
        <select v-model="filters.status" class="form-select form-select-sm w-25" @change="loadProducts">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="draft">Draft</option>
        </select>
        <select v-model="filters.sortBy" class="form-select form-select-sm w-25" @change="loadProducts">
          <option value="createdAt">Sort By: Date</option>
          <option value="name">Sort By: Name</option>
          <option value="price">Sort By: Price</option>
          <option value="stock">Sort By: Stock</option>
          <option value="rating">Sort By: Rating</option>
        </select>
        <button
          @click="toggleSortOrder"
          class="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
          type="button"
        >
          <i :class="filters.sortOrder === 'asc' ? 'bi bi-sort-down-alt' : 'bi bi-sort-down'"></i>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="productApi.loading.value" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="productApi.error.value" class="alert alert-danger">
        <i class="bi bi-exclamation-circle"></i>
        {{ productApi.error.value }}
        <button @click="loadProducts" class="btn btn-sm btn-outline-danger ms-2">Retry</button>
      </div>

      <!-- Table -->
      <div v-else class="table-responsive rounded-2 border border-top bg-white">
        <table class="table table-hover mb-0">
          <thead>
            <tr class="table-light">
              <th class="px-4 py-3 text-uppercase text-muted small fw-semibold">Product Name</th>
              <th class="px-4 py-3 text-uppercase text-muted small fw-semibold">Price</th>
              <th class="px-4 py-3 text-uppercase text-muted small fw-semibold">Category</th>
              <th class="px-4 py-3 text-uppercase text-muted small fw-semibold">Added Date</th>
              <th class="px-4 py-3 text-uppercase text-muted small fw-semibold">Stock</th>
              <th class="px-4 py-3 text-uppercase text-muted small fw-semibold">Status</th>
              <th class="px-4 py-3 text-uppercase text-muted small fw-semibold">Rating</th>
              <th class="px-4 py-3 text-uppercase text-muted small fw-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in products"
              :key="product._id || product.id"
              @dblclick="viewProductDetails(product)"
              style="cursor: pointer"
            >
              <td class="px-4 py-3">
                <div class="d-flex align-items-center gap-3">
                  <img
                    :src="getProductImageUrl(product)"
                    :alt="product.name"
                    class="rounded"
                    style="width: 48px; height: 48px; object-fit: cover"
                    @error="handleImageError"
                  />
                  <div>
                    <p class="fw-medium text-dark text-sm mb-0">{{ product.name }}</p>
                    <p class="text-muted small mb-0">{{ product.sku }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-dark small">${{ product.price }}</td>
              <td class="px-4 py-3 text-dark small">
                {{ getCategoryName(product.category) }}
              </td>
              <td class="px-4 py-3 text-dark small">
                {{ formatDate(product.createdAt || product.addedDate) }}
              </td>
              <td class="px-4 py-3 text-dark small">{{ product.stock }}</td>
              <td class="px-4 py-3">
                <span
                  :class="[
                    'badge',
                    product.status === 'active' ? 'bg-success' : product.status === 'inactive' ? 'bg-danger' : 'bg-secondary'
                  ]"
                >
                  {{ product.status || 'active' }}
                </span>
              </td>
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
                    @click="deleteProduct(product._id || product.id)"
                    title="Delete Product"
                    class="btn btn-sm btn-outline-danger"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="products.length === 0">
              <td colspan="8" class="text-center py-5 text-muted">
                No products found
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination && pagination.totalPages > 1" class="d-flex align-items-center justify-content-center gap-2 mt-4 pt-2 border-top">
        <button
          @click="goToPage(pagination.page - 1)"
          :disabled="!pagination.hasPrevPage"
          class="btn btn-sm btn-outline-secondary"
        >
          <i class="bi bi-caret-left-fill"></i>
          <span class="ms-0.5">PREV</span>
        </button>
        <div class="d-flex align-items-center gap-1">
          <button
            v-for="page in pagination.totalPages"
            :key="page"
            @click="goToPage(page)"
            :class="['btn btn-sm', pagination.page === page ? 'btn-primary' : 'btn-outline-secondary']"
          >
            {{ page }}
          </button>
        </div>
        <button
          @click="goToPage(pagination.page + 1)"
          :disabled="!pagination.hasNextPage"
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
          <div class="modal-header">
            <h2 class="modal-title">Product Details</h2>
            <button
              @click="selectedProduct = null"
              type="button"
              class="btn-close"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="text-center mb-4">
              <img
                :src="getProductImageUrl(selectedProduct)"
                :alt="selectedProduct.name"
                class="rounded"
                style="width: 192px; height: 192px; object-fit: cover"
              />
            </div>
            <div class="mb-4">
              <h3 class="h5 fw-semibold text-dark mb-2">{{ selectedProduct.name }}</h3>
              <p class="text-muted small">SKU: {{ selectedProduct.sku }}</p>
            </div>
            <div class="d-flex align-items-center gap-2 mb-4">
              <div class="d-flex align-items-center gap-1">
                <svg class="text-warning" style="width: 20px; height: 20px" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="h6 fw-semibold text-dark mb-0">{{ selectedProduct.rating }}</span>
              </div>
            </div>
            <div class="row g-4 border-top border-bottom py-4">
              <div class="col-md-6">
                <p class="text-muted small fw-medium mb-2">Price</p>
                <p class="h5 fw-semibold text-dark mb-0">${{ selectedProduct.price }}</p>
              </div>
              <div class="col-md-6">
                <p class="text-muted small fw-medium mb-2">Category</p>
                <p class="h6 text-dark mb-0">{{ getCategoryName(selectedProduct.category) }}</p>
              </div>
              <div class="col-md-6">
                <p class="text-muted small fw-medium mb-2">Stock Available</p>
                <p
                  class="h6 fw-semibold mb-0"
                  :class="selectedProduct.stock > 10 ? 'text-success' : 'text-warning'"
                >
                  {{ selectedProduct.stock }} units
                </p>
              </div>
              <div class="col-md-6">
                <p class="text-muted small fw-medium mb-2">Status</p>
                <p class="h6 text-dark mb-0">
                  <span :class="['badge', selectedProduct.status === 'active' ? 'bg-success' : 'bg-secondary']">
                    {{ selectedProduct.status || 'active' }}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="selectedProduct = null" type="button" class="btn btn-secondary">Close</button>
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
          <div class="modal-header bg-light">
            <h3 class="modal-title">
              {{ editingProduct ? 'Edit Product' : 'Add New Product' }}
            </h3>
            <button
              @click="closeModal"
              type="button"
              class="btn-close"
              aria-label="Close"
              :disabled="isSubmitting"
            ></button>
          </div>

          <form @submit.prevent="saveProduct" class="modal-body">
            <div v-if="submitMessage" :class="['alert', `alert-${submitMessage.type}`]">
              <i :class="`bi bi-${submitMessage.type === 'success' ? 'check-circle' : 'exclamation-circle'}`"></i>
              {{ submitMessage.text }}
            </div>

            <!-- Product Name & SKU -->
            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <label class="form-label">Product Name <span class="text-danger">*</span></label>
                <input
                  v-model="formData.name"
                  type="text"
                  :class="['form-control', { 'is-invalid': errors.name }]"
                  placeholder="Enter product name"
                />
                <small v-if="errors.name" class="text-danger">{{ errors.name }}</small>
              </div>
              <div class="col-md-6">
                <label class="form-label">SKU <span class="text-danger">*</span></label>
                <input
                  v-model="formData.sku"
                  type="text"
                  :class="['form-control', { 'is-invalid': errors.sku }]"
                  placeholder="Enter SKU"
                />
                <small v-if="errors.sku" class="text-danger">{{ errors.sku }}</small>
              </div>
            </div>

            <!-- Price & Category -->
            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <label class="form-label">Price ($) <span class="text-danger">*</span></label>
                <input
                  v-model.number="formData.price"
                  type="number"
                  min="0"
                  step="0.01"
                  :class="['form-control', { 'is-invalid': errors.price }]"
                />
                <small v-if="errors.price" class="text-danger">{{ errors.price }}</small>
              </div>
              <div class="col-md-6">
                <label class="form-label">Category <span class="text-danger">*</span></label>
                <select
                  v-model="formData.category"
                  :class="['form-select', { 'is-invalid': errors.category }]"
                >
                  <option value="">Select a category</option>
                  <option v-for="cat in categories" :key="cat._id || cat.id" :value="cat._id || cat.id">
                    {{ cat.name }}
                  </option>
                </select>
                <small v-if="errors.category" class="text-danger">{{ errors.category }}</small>
              </div>
            </div>

            <!-- Stock & Rating -->
            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <label class="form-label">Stock <span class="text-danger">*</span></label>
                <input
                  v-model.number="formData.stock"
                  type="number"
                  min="0"
                  :class="['form-control', { 'is-invalid': errors.stock }]"
                />
                <small v-if="errors.stock" class="text-danger">{{ errors.stock }}</small>
              </div>
              <div class="col-md-6">
                <label class="form-label">Rating (0-5)</label>
                <input
                  v-model.number="formData.rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  :class="['form-control', { 'is-invalid': errors.rating }]"
                />
                <small v-if="errors.rating" class="text-danger">{{ errors.rating }}</small>
              </div>
            </div>

            <!-- Additional Fields -->
            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <label class="form-label">Brand</label>
                <input v-model="formData.brand" type="text" class="form-control" placeholder="Enter brand name" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Original Price ($)</label>
                <input
                  v-model.number="formData.originalPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  class="form-control"
                />
              </div>
            </div>

            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <label class="form-label">Discount (%)</label>
                <input
                  v-model.number="formData.discount"
                  type="number"
                  min="0"
                  max="100"
                  class="form-control"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Status</label>
                <select v-model="formData.status" class="form-select">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div class="row g-3 mb-4">
              <div class="col-md-12">
                <label class="form-label">Description</label>
                <textarea
                  v-model="formData.description"
                  class="form-control"
                  rows="3"
                  placeholder="Enter product description"
                ></textarea>
              </div>
            </div>

            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <div class="d-flex gap-3">
                  <div class="form-check">
                    <input
                      v-model="formData.isNew"
                      type="checkbox"
                      class="form-check-input"
                      id="isNew"
                    />
                    <label class="form-check-label" for="isNew">New Product</label>
                  </div>
                  <div class="form-check">
                    <input
                      v-model="formData.inStock"
                      type="checkbox"
                      class="form-check-input"
                      id="inStock"
                    />
                    <label class="form-check-label" for="inStock">In Stock</label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Image Upload -->
            <div class="mb-4">
              <label class="form-label fw-semibold">Product Image <span class="text-danger">*</span></label>
              <FileUpload
                v-model="formData.image"
                alt-text="Product image"
                @update:model-value="(val) => (formData.image = val)"
              />
              <small v-if="errors.image" class="text-danger d-block mt-2">{{ errors.image }}</small>
            </div>

            <div class="modal-footer mt-4">
              <button
                @click="closeModal"
                type="button"
                class="btn btn-secondary"
                :disabled="isSubmitting"
              >
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
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
import { ref, computed, onMounted } from 'vue'
import type { Product, Category } from '@/types/product'
import FileUpload from '@/components/common/FileUpload.vue'
import { useFormState } from '@/composables/useFormState'
import { useProductApi } from '@/composables/useProductApi'
import { useCategoryApi } from '@/composables/useCategoryApi'

const productApi = useProductApi()
const categoryApi = useCategoryApi()

const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const pagination = ref<any>(null)
const showAddModal = ref(false)
const editingProduct = ref<Product | null>(null)
const selectedProduct = ref<Product | null>(null)
const imageFile = ref<File | null>(null)

const filters = ref({
  page: 1,
  limit: 10,
  search: '',
  category: '',
  status: '',
  sortBy: 'createdAt',
  sortOrder: 'desc' as 'asc' | 'desc',
})

const initialFormData = {
  name: '',
  sku: '',
  price: 0,
  originalPrice: 0,
  discount: 0,
  isNew: false,
  inStock: true,
  brand: '',
  category: '',
  stock: 0,
  rating: 0,
  image: '',
  description: '',
  status: 'active' as 'active' | 'inactive' | 'draft',
}

const {
  formData,
  errors,
  isSubmitting,
  submitMessage,
  validateForm,
  resetForm,
  showSuccess,
  showError,
  clearErrors,
} = useFormState(initialFormData)

// Load products from API
const loadProducts = async () => {
  try {
    const response = await productApi.getProducts(filters.value)
    if (response.success && response.data) {
      products.value = response.data.data || []
      pagination.value = response.data.pagination
    }
  } catch (error: any) {
    showError(error.message || 'Failed to load products')
  }
}

// Load categories from API
const loadCategories = async () => {
  try {
    const response = await categoryApi.getCategories({ isActive: true, nested: false })
    if (response.success && response.data) {
      categories.value = response.data.data || []
    }
  } catch (error: any) {
    console.error('Failed to load categories:', error)
  }
}

// Debounced search
let searchTimeout: ReturnType<typeof setTimeout>
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    filters.value.page = 1
    loadProducts()
  }, 500)
}

// Toggle sort order
const toggleSortOrder = () => {
  filters.value.sortOrder = filters.value.sortOrder === 'asc' ? 'desc' : 'asc'
  loadProducts()
}

// Pagination
const goToPage = (page: number) => {
  if (page >= 1 && pagination.value && page <= pagination.value.totalPages) {
    filters.value.page = page
    loadProducts()
  }
}

// View product details
const viewProductDetails = (product: Product) => {
  selectedProduct.value = product
}

// Edit product
const editProduct = (product: Product) => {
  editingProduct.value = product
  const categoryId = typeof product.category === 'object' ? product.category._id : product.category
  Object.assign(formData, {
    name: product.name,
    sku: product.sku,
    price: product.price,
    originalPrice: product.originalPrice ?? 0,
    discount: product.discount ?? 0,
    isNew: product.isNew ?? false,
    inStock: product.inStock ?? true,
    brand: product.brand ?? '',
    category: categoryId || '',
    stock: product.stock,
    rating: product.rating,
    image: getProductImageUrl(product),
    description: product.description || '',
    status: product.status || 'active',
  })
  clearErrors()
  showAddModal.value = true
}

// Delete product
const deleteProduct = async (id: string | number) => {
  if (!confirm('Are you sure you want to delete this product?')) return

  try {
    await productApi.deleteProduct(String(id))
    showSuccess('Product deleted successfully')
    loadProducts()
  } catch (error: any) {
    showError(error.message || 'Failed to delete product')
  }
}

// Save product
const saveProduct = async () => {
  const validationRules = {
    name: { required: true, minLength: 3, maxLength: 200 },
    sku: { required: true, minLength: 3 },
    price: { required: true, min: 0 },
    category: { required: true },
    stock: { required: true, min: 0 },
  }

  if (!validateForm(validationRules)) {
    showError('Please fix the errors in the form')
    return
  }

  isSubmitting.value = true

  try {
    // Create FormData for multipart/form-data
    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.name)
    formDataToSend.append('sku', formData.sku)
    formDataToSend.append('price', String(formData.price))
    formDataToSend.append('stock', String(formData.stock))
    formDataToSend.append('category', formData.category)
    
    if (formData.originalPrice) formDataToSend.append('originalPrice', String(formData.originalPrice))
    if (formData.discount) formDataToSend.append('discount', String(formData.discount))
    if (formData.brand) formDataToSend.append('brand', formData.brand)
    if (formData.description) formDataToSend.append('description', formData.description)
    if (formData.status) formDataToSend.append('status', formData.status)
    formDataToSend.append('isNew', String(formData.isNew))
    formDataToSend.append('inStock', String(formData.inStock))
    formDataToSend.append('rating', String(formData.rating || 0))

    // Handle image upload
    if (formData.image) {
      // If image is a data URL, convert to File
      if (formData.image.startsWith('data:')) {
        const response = await fetch(formData.image)
        const blob = await response.blob()
        const file = new File([blob], 'product-image.jpg', { type: blob.type })
        formDataToSend.append('image', file)
      } else if (formData.image instanceof File) {
        formDataToSend.append('image', formData.image)
      }
    }

    if (editingProduct.value) {
      const productId = editingProduct.value._id || editingProduct.value.id
      await productApi.updateProduct(String(productId), formDataToSend)
      showSuccess('Product updated successfully')
    } else {
      await productApi.createProduct(formDataToSend)
      showSuccess('Product created successfully')
    }

    closeModal()
    loadProducts()
  } catch (error: any) {
    showError(error.message || 'Failed to save product')
  } finally {
    isSubmitting.value = false
  }
}

// Close modal
const closeModal = () => {
  showAddModal.value = false
  editingProduct.value = null
  imageFile.value = null
  resetForm()
}

// Helper functions
const getCategoryName = (category: any): string => {
  if (!category) return 'N/A'
  if (typeof category === 'string') {
    const cat = categories.value.find(c => (c._id || c.id) === category)
    return cat?.name || category
  }
  return category.name || 'N/A'
}

const getProductImageUrl = (product: Product): string => {
  if (!product.image) return '/placeholder-image.jpg'
  if (product.image.startsWith('http')) return product.image
  return `http://localhost:5000/uploads/products/${product.image}`
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-image.jpg'
}

const formatDate = (date: string | undefined): string => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

// Initialize
onMounted(() => {
  loadProducts()
  loadCategories()
})
</script>

<style scoped></style>
