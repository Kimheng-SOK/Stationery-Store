<template>
  <div class="manage-products-container">
    <div class="products-card">
      <!-- Enhanced Header Section -->
      <div class="card-header bg-white border-0">
        <div class="container-fluid">
          <div class="row align-items-center">
            <div class="col-md-6 mb-3 mb-md-0">
              <div class="d-flex align-items-center gap-3">
                <div class="icon-box">
                  <i class="bi bi-box-seam"></i>
                </div>
                <div>
                  <h2 class="header-title mb-1">Product Management</h2>
                  <p class="text-muted mb-0 small">Manage your product inventory</p>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="d-flex gap-2 justify-content-md-end">
                <button @click="showAddModal = true" class="btn btn-theme d-flex align-items-center gap-2">
                  <i class="bi bi-plus-square-dotted"></i>
                  <span>Add Product</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Stats Section -->
      <div class="stats-section">
        <div class="container-fluid">
          <div class="row g-3">
            <div class="col-sm-6 col-xl-3">
              <div class="stat-card stat-total">
                <div class="stat-card-inner">
                  <div class="stat-icon-wrapper">
                    <div class="stat-icon">
                      <i class="bi bi-box-seam"></i>
                    </div>
                  </div>
                  <div class="stat-content">
                    <div class="stat-label">Total Products</div>
                    <div class="stat-value">{{ stats.total }}</div>
                    <div class="stat-badge">
                      <i class="bi bi-archive"></i>
                      <span>All Items</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-sm-6 col-xl-3">
              <div class="stat-card stat-active">
                <div class="stat-card-inner">
                  <div class="stat-icon-wrapper">
                    <div class="stat-icon">
                      <i class="bi bi-check-circle"></i>
                    </div>
                  </div>
                  <div class="stat-content">
                    <div class="stat-label">Active Products</div>
                    <div class="stat-value">{{ stats.active }}</div>
                    <div class="stat-badge">
                      <i class="bi bi-check2"></i>
                      <span>Available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-sm-6 col-xl-3">
              <div class="stat-card stat-low-stock">
                <div class="stat-card-inner">
                  <div class="stat-icon-wrapper">
                    <div class="stat-icon">
                      <i class="bi bi-exclamation-triangle"></i>
                    </div>
                  </div>
                  <div class="stat-content">
                    <div class="stat-label">Low Stock</div>
                    <div class="stat-value">{{ stats.lowStock }}</div>
                    <div class="stat-badge">
                      <i class="bi bi-arrow-down"></i>
                      <span>&lt; 10 units</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-sm-6 col-xl-3">
              <div class="stat-card stat-draft">
                <div class="stat-card-inner">
                  <div class="stat-icon-wrapper">
                    <div class="stat-icon">
                      <i class="bi bi-file-earmark"></i>
                    </div>
                  </div>
                  <div class="stat-content">
                    <div class="stat-label">Draft Products</div>
                    <div class="stat-value">{{ stats.draft }}</div>
                    <div class="stat-badge">
                      <i class="bi bi-pencil"></i>
                      <span>Pending</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="filters-section">
        <div class="container-fluid">
          <div class="row g-3">
            <div class="col-md-4">
              <div class="search-box">
                <i class="bi bi-search search-icon"></i>
                <input
                  v-model="filters.search"
                  type="text"
                  class="search-input"
                  placeholder="Search by name, SKU or description"
                  @input="debouncedSearch"
                />
              </div>
            </div>
            <div class="col-md-2">
              <select v-model="filters.category" class="filter-select" @change="loadProducts">
                <option value="">All Categories</option>
                <option v-for="cat in categories" :key="cat._id" :value="cat._id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
            <div class="col-md-2">
              <select v-model="filters.status" class="filter-select" @change="loadProducts">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div class="col-md-3">
              <select v-model="filters.sortBy" class="filter-select" @change="loadProducts">
                <option value="createdAt">Sort By: Date</option>
                <option value="name">Sort By: Name</option>
                <option value="price">Sort By: Price</option>
                <option value="stock">Sort By: Stock</option>
                <option value="rating">Sort By: Rating</option>
              </select>
            </div>
            <div class="col-md-1">
              <button
                @click="toggleSortOrder"
                class="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center"
                type="button"
              >
                <i :class="filters.sortOrder === 'asc' ? 'bi bi-sort-up' : 'bi bi-sort-down'"></i>
              </button>
            </div>
          </div>
        </div>
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
              :key="product._id"
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
                  :class="['badge', product.status === 'active' ? 'bg-success' : product.status === 'inactive' ? 'bg-danger' : 'bg-secondary']"
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
                  v-if="product._id !== null && product._id !== undefined"
                    @click="deleteProduct(product._id)"
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
            <h3 class="modal-title d-flex align-items-center gap-2">
              <i class="bi bi-box-seam"></i>
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

            <!-- MVP Card Section: Basic Info -->
            <div class="card shadow-sm mb-4">
              <div class="card-header bg-white border-bottom-0">
                <span class="fw-semibold"><i class="bi bi-info-circle me-2"></i>Basic Info</span>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="form-floating">
                      <input
                        v-model="formData.name"
                        type="text"
                        class="form-control"
                        id="productName"
                        placeholder="Product Name"
                        :class="{ 'is-invalid': errors.name }"
                      />
                      <label for="productName">Product Name</label>
                      <small v-if="errors.name" class="text-danger">{{ errors.name }}</small>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-floating">
                      <input
                        v-model="formData.sku"
                        type="text"
                        class="form-control"
                        id="productSKU"
                        placeholder="SKU"
                        :class="{ 'is-invalid': errors.sku }"
                      />
                      <label for="productSKU">SKU</label>
                      <small v-if="errors.sku" class="text-danger">{{ errors.sku }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- MVP Card Section: Pricing & Category -->
            <div class="card shadow-sm mb-4">
              <div class="card-header bg-white border-bottom-0">
                <span class="fw-semibold"><i class="bi bi-cash-coin me-2"></i>Pricing & Category</span>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  <!-- <div class="col-md-4">
                    <div class="form-floating">
                      <input
                        v-model.number="formData.price"
                        type="number"
                        min="0"
                        step="0.01"
                        class="form-control"
                        id="productPrice"
                        placeholder="Price"
                        :class="{ 'is-invalid': errors.price }"
                      />
                      <label for="productPrice">Price ($)</label>
                      <small v-if="errors.price" class="text-danger">{{ errors.price }}</small>
                    </div>
                  </div> -->
                  <div class="col-md-4">
                    <div class="form-floating">
                      <input
                        v-model.number="formData.originalPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        class="form-control"
                        id="productOriginalPrice"
                        placeholder="Original Price"
                      />
                      <label for="productOriginalPrice">Original Price ($)</label>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-floating">
                      <select
                        v-model="formData.category"
                        class="form-select"
                        id="productCategory"
                        :class="{ 'is-invalid': errors.category }"
                      >
                        <option value="">Select a category</option>
                        <option v-for="cat in categories" :key="cat._id" :value="cat._id">
                          {{ cat.name }}
                        </option>
                      </select>
                      <label for="productCategory">Category</label>
                      <small v-if="errors.category" class="text-danger">{{ errors.category }}</small>
                    </div>
                  </div>
                </div>
                <div class="row g-3 mt-2">
                  <div class="col-md-4">
                    <div class="form-floating">
                      <input
                        v-model.number="formData.discount"
                        type="number"
                        min="0"
                        max="100"
                        class="form-control"
                        id="productDiscount"
                        placeholder="Discount"
                      />
                      <label for="productDiscount">Discount (%)</label>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-floating">
                      <input
                        v-model="formData.brand"
                        type="text"
                        class="form-control"
                        id="productBrand"
                        placeholder="Brand"
                      />
                      <label for="productBrand">Brand</label>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-floating">
                      <select v-model="formData.status" class="form-select" id="productStatus">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="draft">Draft</option>
                      </select>
                      <label for="productStatus">Status</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- MVP Card Section: Inventory & Rating -->
            <div class="card shadow-sm mb-4">
              <div class="card-header bg-white border-bottom-0">
                <span class="fw-semibold"><i class="bi bi-archive me-2"></i>Inventory & Rating</span>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  <div class="col-md-4">
                    <div class="form-floating">
                      <input
                        v-model.number="formData.stock"
                        type="number"
                        min="0"
                        class="form-control"
                        id="productStock"
                        placeholder="Stock"
                        :class="{ 'is-invalid': errors.stock }"
                      />
                      <label for="productStock">Stock</label>
                      <small v-if="errors.stock" class="text-danger">{{ errors.stock }}</small>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-floating">
                      <input
                        v-model.number="formData.rating"
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        class="form-control"
                        id="productRating"
                        placeholder="Rating"
                        :class="{ 'is-invalid': errors.rating }"
                      />
                      <label for="productRating">Rating (0-5)</label>
                      <small v-if="errors.rating" class="text-danger">{{ errors.rating }}</small>
                    </div>
                  </div>
                  <div class="col-md-4 d-flex align-items-center gap-4">
                    <div class="form-check">
                      <input
                        v-model="formData.isNew"
                        type="checkbox"
                        class="form-check-input"
                        id="isNew"
                      />
                      <label class="form-check-label" for="isNew"><i class="bi bi-star-fill text-warning"></i> New Product</label>
                    </div>
                    <div class="form-check">
                      <input
                        v-model="formData.inStock"
                        type="checkbox"
                        class="form-check-input"
                        id="inStock"
                      />
                      <label class="form-check-label" for="inStock"><i class="bi bi-check-circle text-success"></i> In Stock</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- MVP Card Section: Badges -->
            <!-- <div class="card shadow-sm mb-4">
              <div class="card-header bg-white border-bottom-0">
                <span class="fw-semibold"><i class="bi bi-bookmark-star me-2"></i>Badges</span>
              </div>
              <div class="card-body">
                <div class="mb-2">
                  <label class="form-label">Select Badges</label>
                  <select v-model="formData.badges" class="form-select" multiple>
                    <option v-for="badge in BADGE_OPTIONS" :key="badge" :value="badge">
                      {{ badge }}
                    </option>
                  </select>
                  <small class="text-muted">Hold Ctrl (Windows) or Cmd (Mac) to select multiple badges.</small>
                </div>
                <div class="mt-2">
                  <span v-for="badge in formData.badges" :key="badge" class="badge rounded-pill bg-primary me-2">
                    <i class="bi bi-bookmark"></i> {{ badge }}
                  </span>
                </div>
              </div>
            </div> -->

            <!-- MVP Card Section: Description -->
            <div class="card shadow-sm mb-4">
              <div class="card-header bg-white border-bottom-0">
                <span class="fw-semibold"><i class="bi bi-card-text me-2"></i>Description</span>
              </div>
              <div class="card-body">
                <div class="form-floating">
                  <textarea
                    v-model="formData.description"
                    class="form-control"
                    id="productDescription"
                    style="min-height: 80px"
                    placeholder="Enter product description"
                  ></textarea>
                  <label for="productDescription">Description</label>
                </div>
              </div>
            </div>

            <!-- MVP Card Section: Image Upload -->
            <div class="card shadow-sm mb-4">
              <div class="card-header bg-white border-bottom-0">
                <span class="fw-semibold"><i class="bi bi-image me-2"></i>Product Images</span>
              </div>
              <div class="card-body">
                <div class="mb-3">
                  <label class="form-label fw-semibold">Upload Images <span class="text-danger">*</span></label>
                  <input
                    type="file"
                    class="form-control"
                    multiple
                    @change="onImagesChange"
                  />
                  <small v-if="errors.images" class="text-danger d-block mt-2">{{ errors.images }}</small>
                </div>
                <div v-if="formData.images && formData.images.length" class="d-flex flex-wrap gap-3 mt-2">
                  <div v-for="(img, idx) in formData.images" :key="idx" class="text-center">
                    <img
                      v-if="img && typeof img === 'object' && 'type' in img && img.type && img.type.startsWith('image/')"
                      :src="window.URL.createObjectURL(img)"
                      alt="Preview"
                      class="rounded border"
                      style="max-width: 120px; max-height: 120px; object-fit: cover"
                    />
                    <img
                      v-else-if="typeof img === 'string' && (img.endsWith('.jpg') || img.endsWith('.jpeg') || img.endsWith('.png') || img.endsWith('.gif') || img.endsWith('.webp') || img.endsWith('.bmp') || img.endsWith('.svg'))"
                      :src="img"
                      alt="Preview"
                      class="rounded border"
                      style="max-width: 120px; max-height: 120px; object-fit: cover"
                    />
                    <div v-else class="text-muted small mt-1">
                      <i class="bi bi-file-earmark"></i> {{ img?.name || img }}
                    </div>
                    <div class="text-muted small mt-1">File {{ idx + 1 }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- MVP Card Section: Actions -->
            <div class="d-flex justify-content-end gap-2 mt-3">
              <button
                @click="closeModal"
                type="button"
                class="btn btn-outline-secondary"
                :disabled="isSubmitting"
              >
                <i class="bi bi-x-lg"></i> Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                <i :class="editingProduct ? 'bi bi-save' : 'bi bi-plus-lg'"></i>
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
import type { Product, BadgeType } from '@/types/product'
import { useFormState } from '@/composables/useFormState'
import { useProductApi } from '@/composables/useProductApi'
import { useCategoryApi } from '@/composables/useCategoryApi'

const productApi = useProductApi()
const categoryApi = useCategoryApi()
const categories = computed(() => categoryApi.categories.value)

const products = ref<Product[]>([])
const pagination = ref<unknown>(null)
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

const BADGE_OPTIONS: BadgeType[] = ['new', 'popular', 'instock', 'discount']

const initialFormData = {
  name: '',
  sku: '',
  originalPrice: 0,
  discount: 0,
  isNew: false,
  inStock: true,
  brand: '',
  category: '',
  stock: 0,
  rating: 0,
  images: [] as File[],
  description: '',
  status: 'active' as 'active' | 'inactive' | 'draft',
  badges: [] as BadgeType[],
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
    if (!response) {
      products.value = []
      pagination.value = null
      return
    }

    let items: Product[] = []
    let pag: any = null

    if (Array.isArray(response.data)) {
      items = response.data
      pag = response.pagination ?? null
    } else if (response.data && Array.isArray(response.data.data)) {
      items = response.data.data
      pag = response.data.pagination ?? response.pagination ?? null
    } else {
      items = Array.isArray(response) ? response : []
      pag = null
    }

    products.value = items || []
    pagination.value = pag
  } catch (error: unknown) {
    // ignore aborted/canceled requests (axios uses code 'ERR_CANCELED')
    const errAny = error as any
    const isCanceled = errAny?.code === 'ERR_CANCELED' || errAny?.name === 'CanceledError' || errAny?.name === 'AbortError'
    if (!isCanceled) {
      showError(error instanceof Error ? error.message : 'Failed to load products')
    } else {
      // silent ignore of canceled request
    }
  }
}

// Load categories from API
const loadCategories = async () => {
  try {
    // Let categoryApi handle its internal categories state.
    await categoryApi.fetchCategories()
    // No assignment to `categories.value` since `categories` is a computed wrapper
  } catch (error: unknown) {
    console.error('Failed to load categories:', error instanceof Error ? error.message : 'Unknown error')
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
    originalPrice: product.originalPrice ?? 0,
    discount: product.discount ?? 0,
    isNew: product.isNew ?? false,
    inStock: product.inStock ?? true,
    brand: product.brand ?? '',
    category: categoryId || '',
    stock: product.stock,
    rating: product.rating,
    description: product.description || '',
    status: product.status || 'active',
    badges: product.badges || [],
    images: product.images || [],
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
  } catch (error: unknown) {
    showError(error instanceof Error ? error.message : 'Failed to delete product')
  }
}

// Save product
const saveProduct = async () => {
  const validationRules = {
    name: { required: true, minLength: 3, maxLength: 200 },
    sku: { required: true, minLength: 3 },
    category: { required: true },
    stock: { required: true, min: 0 },
  }

  if (!formData.images || formData.images.length === 0) {
    errors.images = 'At least one product image/file is required'
    showError('At least one product image/file is required')
    return
  } else {
    errors.images = ''
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
    // formDataToSend.append('price', String(formData.price))
    formDataToSend.append('stock', String(formData.stock))
    formDataToSend.append('category', formData.category)
    formDataToSend.append('isNew', String(formData.isNew))
    formDataToSend.append('inStock', String(formData.inStock))
    formDataToSend.append('rating', String(formData.rating || 0))
    formDataToSend.append('status', formData.status)
    if (formData.originalPrice) formDataToSend.append('originalPrice', String(formData.originalPrice))
    if (formData.discount) formDataToSend.append('discount', String(formData.discount))
    if (formData.brand) formDataToSend.append('brand', formData.brand)
    if (formData.description) formDataToSend.append('description', formData.description)
    // Handle badges as array
    if (formData.badges && formData.badges.length > 0) {
      formData.badges.forEach(badge => formDataToSend.append('badges[]', badge))
    }
    // Handle images array (multiple)
    if (formData.images && Array.isArray(formData.images) && formData.images.length > 0) {
      formData.images.forEach((img: any) => {
        if (img instanceof File) {
          formDataToSend.append('images', img)
        }
      })
    }

    if (editingProduct.value) {
      const productId = editingProduct.value._id
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
    const cat = categories.value.find(c => (c._id) === category)
    return cat?.name || category
  }
  return category.name || 'N/A'
}

const getProductImageUrl = (product: Product): string => {
  // If image is a full URL, use it
  if (product.image && typeof product.image === 'string') {
    if (product.image.startsWith('http')) return product.image
    // If image is a filename, build the backend URL
    return `http://localhost:5000/uploads/products/${product.image}`
  }
  // If images array exists and has at least one image
  if (product.images && product.images.length > 0) {
    const img = product.images[0]
    if (typeof img === 'string' && img.startsWith('http')) return img
    return `http://localhost:5000/uploads/products/${img}`
  }
  // Otherwise, fallback to placeholder
  return '/placeholder-image.jpg'
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-image.jpg'
}

const formatDate = (date: string | undefined): string => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

function onImagesChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    formData.images = Array.from(input.files)
    errors.images = ''
  } else {
    formData.images = []
  }
}

// Add stats computed property BEFORE onMounted
const stats = computed(() => ({
  total: products.value.length,
  active: products.value.filter(p => p.status === 'active').length,
  lowStock: products.value.filter(p => p.stock < 10).length,
  draft: products.value.filter(p => p.status === 'draft').length
}))

// Initialize
onMounted(() => {
  loadProducts()
  loadCategories()
})
</script>

<style scoped>
.manage-products-container {
  padding: 1.5rem;
  background: #f8f9fa;
  min-height: 100vh;
}

.products-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

/* Enhanced Header Section */
.card-header {
  padding: 2rem 0;
  border-bottom: 1px solid #e9ecef !important;
}

.icon-box {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0d1228 0%, #1a2642 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.header-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0d1228;
  margin: 0;
}

.btn-theme {
  background: linear-gradient(135deg, #0d1228 0%, #1a2642 100%);
  border: none;
  color: white;
  padding: 0.625rem 1.25rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-theme:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 18, 40, 0.3);
  background: linear-gradient(135deg, #1a2642 0%, #0d1228 100%);
  color: white;
}

/* Enhanced Stats Section */
.stats-section {
  padding: 2rem 0;
  background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
  border-bottom: 1px solid #e9ecef;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  height: 100%;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, transparent 0%, currentColor 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: transparent;
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-total { color: #3b82f6; }
.stat-active { color: #10b981; }
.stat-low-stock { color: #f59e0b; }
.stat-draft { color: #6b7280; }

.stat-card-inner {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.stat-icon-wrapper {
  flex-shrink: 0;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-total .stat-icon {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.stat-active .stat-icon {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.stat-low-stock .stat-icon {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.stat-draft .stat-icon {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #0d1228;
  line-height: 1;
  margin-bottom: 0.75rem;
}

.stat-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.stat-badge i {
  font-size: 0.875rem;
}

/* Filters Section */
.filters-section {
  padding: 1.5rem 0;
  background: white;
  border-bottom: 1px solid #e9ecef;
}

.search-box {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 0.625rem 2.5rem 0.625rem 2.75rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  background: #f8f9fa;
  font-size: 0.875rem;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #0d1228;
  background: white;
  box-shadow: 0 0 0 4px rgba(13, 18, 40, 0.1);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 1rem;
}

.filter-select {
  width: 100%;
  padding: 0.625rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  background: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-select:focus {
  outline: none;
  border-color: #0d1228;
  box-shadow: 0 0 0 4px rgba(13, 18, 40, 0.1);
}

@media (max-width: 768px) {
  .header-title {
    font-size: 1.5rem;
  }

  .icon-box {
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }
}
</style>
