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

<!-- Add/Edit Modal - Simple & Cool -->
    <div class="modal fade" id="categoryModal" tabindex="-1" ref="modalRef">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <!-- Simple Header -->
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold">
              <i :class="isEditMode ? 'bi bi-pencil-square me-2' : 'bi bi-plus-circle me-2'" style="color: #667eea;"></i>
              {{ isEditMode ? 'Edit Category' : 'New Category' }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>

          <form @submit.prevent="handleSubmit">
            <div class="modal-body pt-3">
              <!-- Image Upload -->
              <div class="mb-3">
                <label class="form-label small text-muted">Image</label>
                <div class="text-center">
                  <div v-if="imagePreview || formData.existingImage" class="position-relative d-inline-block mb-2">
                    <img
                      :src="imagePreview || getImageUrl(formData.existingImage)"
                      alt="Preview"
                      class="rounded"
                      style="width: 120px; height: 120px; object-fit: cover; border: 2px solid #e9ecef;"
                      @error="handleImageError"
                    />
                    <button type="button"
                            class="btn btn-sm btn-danger rounded-circle position-absolute"
                            @click="removeImage"
                            style="top: -8px; right: -8px; width: 28px; height: 28px; padding: 0;"
                            title="Remove">
                      <i class="bi bi-x" style="font-size: 1.1rem;"></i>
                    </button>
                  </div>

                  <label v-else for="fileInput"
                         class="d-block border rounded p-4 text-center bg-light"
                         style="cursor: pointer; transition: all 0.2s;">
                    <i class="bi bi-image text-muted d-block mb-2" style="font-size: 2rem;"></i>
                    <span class="text-muted small">Click to upload</span>
                  </label>
                  <input
                    type="file"
                    id="fileInput"
                    class="d-none"
                    @change="handleImageChange"
                    accept="image/*"
                    ref="fileInputRef"
                  />
                </div>
              </div>

              <!-- Name -->
              <div class="mb-3">
                <label class="form-label small text-muted">Name <span class="text-danger">*</span></label>
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.name"
                  required
                  placeholder="Category name"
                  autofocus
                />
              </div>

              <!-- Description -->
              <div class="mb-3">
                <label class="form-label small text-muted">Description</label>
                <textarea
                  class="form-control"
                  v-model="formData.description"
                  placeholder="Optional description"
                  maxlength="120"
                  rows="2"
                  style="resize: none;"
                ></textarea>
                <div class="text-end">
                  <small class="text-muted">{{ formData.description.length }}/120</small>
                </div>
              </div>

              <!-- Status -->
              <div class="d-flex justify-content-between align-items-center py-2">
                <div>
                  <label class="form-label small text-muted mb-0">Active</label>
                  <p class="text-muted mb-0" style="font-size: 0.8rem;">
                    {{ formData.isActive ? 'Visible to users' : 'Hidden' }}
                  </p>
                </div>
                <div class="form-check form-switch" style="font-size: 1.5rem;">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="statusSwitch"
                    v-model="formData.isActive"
                    style="cursor: pointer;"
                  >
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="modal-footer border-0 pt-0">
              <button type="button" class="btn btn-light" @click="closeModal">Cancel</button>
              <button type="submit"
                      class="btn btn-primary"
                      :disabled="categoryApi.loading.value">
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
import { useCategoryApi } from '@/composables/useCategoryApi'
import type { Category } from '@/types/category'
import { Modal } from 'bootstrap'
import { formatDate, getImageUrl, handleImageError } from '@/utils/categoryUtils'

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
  if (!categoryToDelete.value || !categoryToDelete.value._id) return

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
