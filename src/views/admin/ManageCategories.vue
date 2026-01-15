<template>
  <div class="categories-page">
    <div class="categories-container">
      <div class="categories-header">
        <h2 class="categories-title">Categories</h2>
        <button class="btn btn-add-new" @click="openAddModal">Add New</button>
      </div>
      <div class="categories-divider"></div>

      <!-- Loading State -->
      <div v-if="categoryApi.loading.value" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="categoryApi.error.value" class="alert alert-danger m-3">
        <i class="bi bi-exclamation-circle"></i>
        {{ categoryApi.error.value }}
        <button @click="loadCategories" class="btn btn-sm btn-outline-danger ms-2">Retry</button>
      </div>

      <!-- Category Cards -->
      <div v-else class="categories-list">
        <div v-if="categories.length === 0" class="text-center py-5 text-muted">
          <p>No categories found. Click "Add New" to create one.</p>
        </div>

        <!-- Nested Category View -->
        <div v-for="category in categories" :key="category._id || category.id" class="category-card">
          <div class="category-image-wrapper">
            <img
              v-if="category.image"
              :src="getCategoryImageUrl(category)"
              :alt="category.name"
              class="category-image"
            />
            <div v-else class="category-image-placeholder">
              <i class="bi bi-folder"></i>
            </div>
          </div>
          <div class="category-content">
            <div class="d-flex align-items-center gap-2 mb-2">
              <h3 class="category-name mb-0">{{ category.name }}</h3>
              <span
                :class="[
                  'badge',
                  category.isActive ? 'bg-success' : 'bg-secondary',
                  'badge-sm'
                ]"
              >
                {{ category.isActive ? 'Active' : 'Inactive' }}
              </span>
              <span v-if="category.productCount !== undefined" class="badge bg-info badge-sm">
                {{ category.productCount }} products
              </span>
            </div>
            <div class="category-subcategories">
              <p class="sub-label">Description</p>
              <p class="category-description">
                {{ category.description || 'No description added' }}
              </p>
            </div>
            <!-- Parent Category Info -->
            <div v-if="category.parent" class="mt-2">
              <p class="sub-label">Parent Category</p>
              <p class="category-description small">
                {{ getCategoryName(category.parent) }}
              </p>
            </div>
            <!-- Children Categories -->
            <div v-if="category.children && category.children.length > 0" class="mt-3">
              <p class="sub-label">Subcategories ({{ category.children.length }})</p>
              <div class="sub-tags">
                <span
                  v-for="child in category.children"
                  :key="child._id || child.id"
                  class="sub-tag"
                >
                  {{ child.name }}
                </span>
              </div>
            </div>
          </div>
          <div class="category-actions">
            <button class="btn btn-edit" @click="editCategory(category)">Edit</button>
            <button class="btn btn-delete" @click="confirmDelete(category)">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="modal d-block" style="background-color: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">
              {{ editingCategory ? 'Edit Category' : 'Add New Category' }}
            </h3>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
              :disabled="isSubmitting"
            ></button>
          </div>

          <form @submit.prevent="saveCategory" class="modal-body">
            <!-- Success/Error Message -->
            <div v-if="submitMessage" :class="['alert', `alert-${submitMessage.type}`]">
              <i :class="`bi bi-${submitMessage.type === 'success' ? 'check-circle' : 'exclamation-circle'}`"></i>
              {{ submitMessage.text }}
            </div>

            <!-- Category Name -->
            <div class="mb-3">
              <label class="form-label">Category Name <span class="text-danger">*</span></label>
              <input
                v-model="formData.name"
                type="text"
                :class="['form-control', { 'is-invalid': errors.name }]"
                placeholder="e.g., Notebooks, Pens & Pencils"
              />
              <small v-if="errors.name" class="text-danger">{{ errors.name }}</small>
            </div>

            <!-- Parent Category -->
            <div class="mb-3">
              <label class="form-label">Parent Category (Optional)</label>
              <select v-model="formData.parent" class="form-select">
                <option value="">None (Top-level category)</option>
                <option
                  v-for="cat in availableParentCategories"
                  :key="cat._id || cat.id"
                  :value="cat._id || cat.id"
                >
                  {{ cat.name }}
                </option>
              </select>
              <small class="text-muted">Select a parent category to create a nested category</small>
            </div>

            <!-- Description -->
            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea
                v-model="formData.description"
                class="form-control"
                rows="3"
                placeholder="Enter category description (optional)"
              ></textarea>
            </div>

            <!-- Status -->
            <div class="mb-3">
              <label class="form-label">Status</label>
              <div class="form-check form-switch">
                <input
                  v-model="formData.isActive"
                  class="form-check-input"
                  type="checkbox"
                  id="isActive"
                />
                <label class="form-check-label" for="isActive">
                  {{ formData.isActive ? 'Active' : 'Inactive' }}
                </label>
              </div>
            </div>

            <!-- Order -->
            <div class="mb-3">
              <label class="form-label">Display Order</label>
              <input
                v-model.number="formData.order"
                type="number"
                min="0"
                class="form-control"
                placeholder="0"
              />
              <small class="text-muted">Lower numbers appear first</small>
            </div>

            <!-- Category Image -->
            <div class="mb-3">
              <label class="form-label fw-semibold">Category Image</label>
              <FileUpload
                v-model="formData.image"
                alt-text="Category image"
                @update:model-value="(val) => (formData.image = val)"
              />
              <small v-if="errors.image" class="text-danger d-block mt-2">{{ errors.image }}</small>
            </div>

            <!-- Action Buttons -->
            <div class="modal-footer mt-4">
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeModal"
                :disabled="isSubmitting"
              >
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                {{ editingCategory ? 'Update' : 'Add' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal d-block" style="background-color: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Delete</h5>
            <button type="button" class="btn-close" @click="showDeleteModal = false"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete <strong>{{ categoryToDelete?.name }}</strong>?</p>
            <p class="text-muted small">This action cannot be undone.</p>
            <div v-if="categoryToDelete?.productCount && categoryToDelete.productCount > 0" class="alert alert-warning mt-3">
              <i class="bi bi-exclamation-triangle"></i>
              This category has {{ categoryToDelete.productCount }} product(s). Please reassign or delete products first.
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="deleteCategory"
              :disabled="categoryToDelete?.productCount && categoryToDelete.productCount > 0"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import FileUpload from '@/components/common/FileUpload.vue'
import { useFormState } from '@/composables/useFormState'
import { useCategoryApi, type Category } from '@/composables/useCategoryApi'

const categoryApi = useCategoryApi()

const categories = ref<Category[]>([])
const allCategories = ref<Category[]>([]) // For parent selection
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingCategory = ref<Category | null>(null)
const categoryToDelete = ref<Category | null>(null)

const initialFormData = {
  name: '',
  description: '',
  image: '',
  parent: '',
  isActive: true,
  order: 0,
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

// Available parent categories (exclude current category if editing)
const availableParentCategories = computed(() => {
  if (!editingCategory.value) return allCategories.value
  return allCategories.value.filter(
    (cat) => (cat._id || cat.id) !== (editingCategory.value!._id || editingCategory.value!.id)
  )
})

// Load categories from API
const loadCategories = async () => {
  try {
    // Load nested structure for display
    const response = await categoryApi.getCategories({
      nested: true,
      includeProducts: true,
    })
    if (response.success && response.data) {
      categories.value = response.data.data || []
    }

    // Load flat list for parent selection
    const flatResponse = await categoryApi.getCategories({
      nested: false,
    })
    if (flatResponse.success && flatResponse.data) {
      allCategories.value = flatResponse.data.data || []
    }
  } catch (error: any) {
    showError(error.message || 'Failed to load categories')
  }
}

const openAddModal = () => {
  editingCategory.value = null
  resetForm()
  clearErrors()
  showModal.value = true
}

const editCategory = (category: Category) => {
  editingCategory.value = category
  const parentId = typeof category.parent === 'object' && category.parent
    ? category.parent._id
    : category.parent || ''
  
  Object.assign(formData, {
    name: category.name,
    description: category.description || '',
    image: category.image ? getCategoryImageUrl(category) : '',
    parent: parentId,
    isActive: category.isActive !== undefined ? category.isActive : true,
    order: category.order || 0,
  })
  clearErrors()
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingCategory.value = null
  resetForm()
}

const confirmDelete = (category: Category) => {
  categoryToDelete.value = category
  showDeleteModal.value = true
}

const saveCategory = async () => {
  const validationRules = {
    name: { required: true, minLength: 3, maxLength: 100 },
  }

  if (!validateForm(validationRules)) {
    showError('Please fix the errors in the form')
    return
  }

  isSubmitting.value = true

  try {
    const categoryData: any = {
      name: formData.name,
      description: formData.description || undefined,
      parent: formData.parent || null,
      isActive: formData.isActive,
      order: formData.order || 0,
    }

    // Handle image if it's a data URL (convert to file or URL)
    // For now, we'll send it as-is if it's a URL, or skip if it's a data URL
    // In production, you'd want to upload the image separately or convert data URL to file
    if (formData.image && !formData.image.startsWith('data:')) {
      categoryData.image = formData.image
    }

    if (editingCategory.value) {
      const categoryId = editingCategory.value._id || editingCategory.value.id
      await categoryApi.updateCategory(String(categoryId), categoryData)
      showSuccess('Category updated successfully')
    } else {
      await categoryApi.createCategory(categoryData)
      showSuccess('Category added successfully')
    }

    closeModal()
    loadCategories()
  } catch (error: any) {
    showError(error.message || 'Failed to save category')
  } finally {
    isSubmitting.value = false
  }
}

const deleteCategory = async () => {
  if (!categoryToDelete.value) return

  try {
    const categoryId = categoryToDelete.value._id || categoryToDelete.value.id
    await categoryApi.deleteCategory(String(categoryId))
    showSuccess('Category deleted successfully')
    showDeleteModal.value = false
    categoryToDelete.value = null
    loadCategories()
  } catch (error: any) {
    showError(error.message || 'Failed to delete category')
  }
}

// Helper functions
const getCategoryName = (category: any): string => {
  if (!category) return 'N/A'
  if (typeof category === 'string') {
    const cat = allCategories.value.find((c) => (c._id || c.id) === category)
    return cat?.name || category
  }
  return category.name || 'N/A'
}

const getCategoryImageUrl = (category: Category): string => {
  if (!category.image) return ''
  if (category.image.startsWith('http')) return category.image
  return `http://localhost:5000/uploads/categories/${category.image}`
}

// Initialize
onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.categories-page {
  margin-left: 0px;
  margin-top: 0px;
  background: #f2f2f2;
  min-height: calc(100vh - 65px);
  padding: 20px 30px;
}

.categories-container {
  background: #fff;
  border-radius: 5px;
  padding: 0;
}

.categories-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 25px;
  position: relative;
}

.categories-title {
  color: #1c1a1a;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.btn-add-new {
  background: #ff4f5a;
  border: none;
  border-radius: 5px;
  color: #fff;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 13px;
  font-weight: 700;
  line-height: 22px;
  padding: 6px 20px;
  height: 34px;
}

.btn-add-new:hover {
  background: #ff3945;
}

.categories-divider {
  width: 100%;
  height: 1px;
  background: #f2f2f2;
}

.categories-list {
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.category-card {
  display: flex;
  align-items: flex-start;
  gap: 19px;
  padding: 26px;
  border-radius: 5px;
  border: 1px solid #d3d3d3;
  background: #fff;
  box-shadow: 0 0 30px 3px rgba(0, 0, 0, 0.03);
  position: relative;
}

.category-image-wrapper {
  width: 150px;
  height: 150px;
  border-radius: 5px;
  border: 1px dashed #d3d3d3;
  background: #fff;
  position: relative;
  overflow: hidden;
  padding: 0;
  flex-shrink: 0;
}

.category-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.category-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #d3d3d3;
}

.category-content {
  flex: 1;
  min-width: 0;
}

.category-name {
  color: #1c1a1a;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 15px 0;
  padding-top: 5px;
}

.category-subcategories {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sub-label {
  color: #9b9b9b;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 12px;
  font-weight: 400;
  margin: 0;
}

.sub-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: flex-start;
}

.sub-tag {
  display: inline-flex;
  padding: 2px 9px;
  align-items: center;
  border-radius: 4px;
  background: #f5f5f5;
  color: #454545;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 24px;
  white-space: nowrap;
}

.category-actions {
  display: flex;
  gap: 15px;
  flex-shrink: 0;
  padding-top: 1px;
}

.btn-edit,
.btn-delete {
  border-radius: 3px;
  border: 1px solid #ff4f5a;
  background: #fff;
  color: #ff4f5a;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 22px;
  padding: 3px 15px;
  height: 28px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit:hover,
.btn-delete:hover {
  background: #ff4f5a;
  color: #fff;
}

.category-description {
  color: #495057;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.badge-sm {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}
</style>
