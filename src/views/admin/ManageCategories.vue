<template>
  <div class="categories-admin">
    <div class="header-section mb-4">
      <h2 class="h5 fw-semibold mb-0">
        Category Management
        <span v-if="categories.length">({{ categories.length }})</span>
      </h2>
      <button class="btn btn-primary" @click="openAddModal">
        <i class="bi bi-plus-circle me-2"></i>Add New Category
      </button>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
      <i class="bi bi-check-circle me-2"></i>{{ successMessage }}
      <button type="button" class="btn-close" @click="successMessage = ''"></button>
    </div>
    <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
      <i class="bi bi-exclamation-circle me-2"></i>{{ errorMessage }}
      <button type="button" class="btn-close" @click="errorMessage = ''"></button>
    </div>

    <!-- Categories Table -->
    <div class="card">
      <div class="card-body">
        <div v-if="categoryApi.loading.value && !categories.length" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div v-else-if="categories.length === 0" class="text-center py-5">
          <i class="bi bi-inbox" style="font-size: 3rem; color: #ccc;"></i>
          <p class="text-muted mt-3">No categories found. Add your first category!</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="category in categories" :key="category._id">
                <td>
                  <img
                    :src="getImageUrl(category.image)"
                    :alt="category.name"
                    class="category-image"
                    @error="handleImageError"
                  />
                </td>
                <td>{{ category.name }}</td>
                <td>{{ category.description || 'N/A' }}</td>
                <td><span class="badge bg-secondary">{{ category.slug }}</span></td>
                <td>
                  <span :class="['badge', category.isActive ? 'bg-success' : 'bg-warning']">
                    {{ category.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>{{ formatDate(category.createdAt) }}</td>
                <td>
                  <button class="btn btn-sm btn-outline-primary me-2" @click="openEditModal(category)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(category)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div class="modal fade" id="categoryModal" tabindex="-1" ref="modalRef">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditMode ? 'Edit Category' : 'Add New Category' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="handleSubmit">
            <div class="modal-body">
              <!-- Name -->
              <div class="mb-3">
                <label class="form-label">Category Name *</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.name"
                  required
                  placeholder="Enter category name"
                />
              </div>

              <!-- Description -->
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea
                  class="form-control"
                  v-model="formData.description"
                  rows="3"
                  placeholder="Enter category description"
                ></textarea>
              </div>

              <!-- Active Status -->
              <div class="mb-3">
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="isActiveSwitch"
                    v-model="formData.isActive"
                  >
                  <label class="form-check-label" for="isActiveSwitch">
                    Active
                  </label>
                </div>
              </div>

              <!-- Image Upload -->
              <div class="mb-3">
                <label class="form-label">Category Image</label>
                <input
                  type="file"
                  class="form-control"
                  @change="handleImageChange"
                  accept="image/*"
                  ref="fileInputRef"
                />
                <small class="text-muted">Recommended: 500x500px, Max 2MB</small>
              </div>

              <!-- Image Preview -->
              <div v-if="imagePreview || formData.existingImage" class="mb-3">
                <label class="form-label">Preview</label>
                <div class="image-preview-container">
                  <img
                    :src="imagePreview || getImageUrl(formData.existingImage)"
                    alt="Preview"
                    class="img-fluid"
                    @error="handleImageError"
                  />
                  <button
                    type="button"
                    class="btn btn-sm btn-danger remove-image"
                    @click="removeImage"
                  >
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="categoryApi.loading.value">
                <span v-if="categoryApi.loading.value" class="spinner-border spinner-border-sm me-2"></span>
                {{ isEditMode ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1" ref="deleteModalRef">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Delete</h5>
            <button type="button" class="btn-close" @click="closeDeleteModal"></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete "{{ categoryToDelete?.name }}"?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeDeleteModal">Cancel</button>
            <button type="button" class="btn btn-danger" @click="handleDelete" :disabled="categoryApi.loading.value">
              <span v-if="categoryApi.loading.value" class="spinner-border spinner-border-sm me-2"></span>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useCategoryApi, type Category } from '@/composables/useCategoryApi'
import { Modal } from 'bootstrap'

const categoryApi = useCategoryApi()
const categories = computed(() => categoryApi.categories.value)

const modalRef = ref<HTMLElement | null>(null)
const deleteModalRef = ref<HTMLElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
let modalInstance: Modal | null = null
let deleteModalInstance: Modal | null = null

const isEditMode = ref(false)
const formData = ref({
  name: '',
  description: '',
  isActive: true,
  existingImage: '',
})
const selectedImage = ref<File | null>(null)
const imagePreview = ref<string>('')
const categoryToDelete = ref<Category | null>(null)
const successMessage = ref('')
const errorMessage = ref('')
const editingCategoryId = ref<string | null>(null)

onMounted(async () => {
  await categoryApi.fetchCategories()
  if (modalRef.value) {
    modalInstance = new Modal(modalRef.value)
  }
  if (deleteModalRef.value) {
    deleteModalInstance = new Modal(deleteModalRef.value)
  }
})

const openAddModal = () => {
  isEditMode.value = false
  resetForm()
  modalInstance?.show()
}

const openEditModal = (category: Category) => {
  isEditMode.value = true
  editingCategoryId.value = category._id
  formData.value = {
    name: category.name,
    description: category.description || '',
    isActive: category.isActive ?? true,
    existingImage: category.image || '',
  }
  imagePreview.value = ''
  selectedImage.value = null
  modalInstance?.show()
}

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      errorMessage.value = 'Image size must be less than 2MB'
      setTimeout(() => { errorMessage.value = '' }, 3000)
      if (fileInputRef.value) fileInputRef.value.value = ''
      return
    }

    selectedImage.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  selectedImage.value = null
  imagePreview.value = ''
  formData.value.existingImage = ''
  if (fileInputRef.value) fileInputRef.value.value = ''
}

const handleSubmit = async () => {
  try {
    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.value.name)
    formDataToSend.append('description', formData.value.description)
    formDataToSend.append('isActive', formData.value.isActive.toString())

    if (selectedImage.value) {
      formDataToSend.append('image', selectedImage.value)
    }

    if (isEditMode.value && editingCategoryId.value) {
      await categoryApi.updateCategory(editingCategoryId.value, formDataToSend)
      successMessage.value = 'Category updated successfully!'
    } else {
      await categoryApi.createCategory(formDataToSend)
      successMessage.value = 'Category created successfully!'
    }

    closeModal()
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err: unknown) {
    errorMessage.value = (err instanceof Error && err.message) ? err.message : 'Operation failed'
    setTimeout(() => { errorMessage.value = '' }, 3000)
  }
}

const confirmDelete = (category: Category) => {
  categoryToDelete.value = category
  deleteModalInstance?.show()
}

const handleDelete = async () => {
  if (!categoryToDelete.value) return

  try {
    await categoryApi.deleteCategory(categoryToDelete.value._id)
    successMessage.value = 'Category deleted successfully!'
    closeDeleteModal()
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err: unknown) {
    errorMessage.value = (err instanceof Error && err.message) ? err.message : 'Operation failed'
    setTimeout(() => { errorMessage.value = '' }, 3000)
  }
}

const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
    isActive: true,
    existingImage: '',
  }
  selectedImage.value = null
  imagePreview.value = ''
  editingCategoryId.value = null
  if (fileInputRef.value) fileInputRef.value.value = ''
}

const closeModal = () => {
  modalInstance?.hide()
  resetForm()
}

const closeDeleteModal = () => {
  deleteModalInstance?.hide()
  categoryToDelete.value = null
}

const formatDate = (date?: string) => {
  if (!date) return 'N/A'
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (error) {
    console.error('Date formatting error:', error, date)
    return 'Invalid Date'
  }
}

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return '/placeholder.png'

  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }

  // If it's a relative path from your API
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  return `${baseUrl}${imagePath}`
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder.png'
}
</script>

<style scoped>
.categories-admin {
  padding: 2rem;
  font-family: 'Quicksand', sans-serif;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
}

.image-preview-container {
  position: relative;
  display: inline-block;
  max-width: 200px;
}

.image-preview-container img {
  max-width: 100%;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
}

.remove-image {
  position: absolute;
  top: -10px;
  right: -10px;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

.btn-primary {
  background: linear-gradient(135deg, var(--main-color2, #007bff) 0%, #0056b3 100%);
  border: none;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }
}
</style>
