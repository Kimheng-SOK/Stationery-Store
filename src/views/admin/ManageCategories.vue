<template>
  <div class="categories-page">
    <div class="categories-container">
      <div class="categories-header">
        <h2 class="categories-title">Categories</h2>
        <button class="btn btn-add-new" @click="openAddModal">Add New</button>
      </div>
      <div class="categories-divider"></div>

      <!-- Category Cards -->
      <div class="categories-list">
        <div v-if="categories.length === 0" class="text-center py-5 text-muted">
          <p>No categories found. Click "Add New" to create one.</p>
        </div>

        <div v-for="category in categories" :key="category.id" class="category-card">
          <div class="category-image-wrapper">
            <img
              :src="category.image"
              :alt="category.name"
              class="category-image"
            />
          </div>
          <div class="category-content">
            <h3 class="category-name">{{ category.name }}</h3>
            <div class="category-subcategories">
              <p class="sub-label">Description</p>
              <p class="category-description">{{ category.description || 'No description added' }}</p>
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
              <label class="form-label">Category Name</label>
              <input
                v-model="formData.name"
                type="text"
                :class="['form-control', { 'is-invalid': errors.name }]"
                placeholder="e.g., Notebooks, Pens & Pencils"
              />
              <small v-if="errors.name" class="text-danger">{{ errors.name }}</small>
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
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">
              Cancel
            </button>
            <button type="button" class="btn btn-danger" @click="deleteCategory">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FileUpload from '@/components/common/FileUpload.vue'
import { useFormState } from '@/composables/useFormState'

interface Category {
  id: number
  name: string
  description?: string
  image: string
}

// Sample data - in production, this would come from an API
const initialCategories: Category[] = [
  {
    id: 1,
    name: 'NoteBooks',
    description: 'Wide range of premium notebooks for all purposes',
    image: '/public/images/notebooks/book4.jpg',
  },
  {
    id: 2,
    name: 'Pens & Pencils',
    description: 'Quality writing instruments for professionals and students',
    image: '/public/images/pens&pencils/pen2.jpg',
  },
  {
    id: 3,
    name: 'Office Supplies',
    description: 'Essential office equipment and accessories',
    image: '/public/images/officeSupplies/office1.jpg',
  },
  {
    id: 4,
    name: 'Art Supplies',
    description: 'Professional art materials for creative professionals',
    image: '/public/images/artSupplies/art1.jpg',
  },
  {
    id: 5,
    name: 'Sticky Notes',
    description: 'Colorful and practical sticky note collections',
    image: '/public/images/stickyNote/stick1.jpg',
  },
]

const categories = ref<Category[]>(initialCategories)
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingCategory = ref<Category | null>(null)
const categoryToDelete = ref<Category | null>(null)

const initialFormData = {
  id: 0,
  name: '',
  description: '',
  image: '',
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

const openAddModal = () => {
  editingCategory.value = null
  resetForm()
  clearErrors()
  showModal.value = true
}

const editCategory = (category: Category) => {
  editingCategory.value = category
  Object.assign(formData, category)
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
    image: { required: true },
  }

  if (!validateForm(validationRules)) {
    showError('Please fix the errors in the form')
    return
  }

  isSubmitting.value = true

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (editingCategory.value) {
      const index = categories.value.findIndex((c) => c.id === editingCategory.value!.id)
      if (index !== -1) {
        categories.value[index] = { ...formData } as Category
      }
      showSuccess('Category updated successfully')
    } else {
      const newCategory: Category = {
        ...formData,
        id: Math.max(...categories.value.map((c) => c.id), 0) + 1,
      } as Category
      categories.value.unshift(newCategory)
      showSuccess('Category added successfully')
    }

    closeModal()
  } catch (error) {
    showError('Failed to save category')
  } finally {
    isSubmitting.value = false
  }
}

const deleteCategory = async () => {
  if (!categoryToDelete.value) return

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300))

    categories.value = categories.value.filter((c) => c.id !== categoryToDelete.value!.id)
    showSuccess('Category deleted successfully')
    showDeleteModal.value = false
    categoryToDelete.value = null
  } catch (error) {
    showError('Failed to delete category')
  }
}
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
</style>
