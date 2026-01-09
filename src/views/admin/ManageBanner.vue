<template>
  <div class="manage-banner-container">
    <div class="card">
      <!-- Header -->
      <div class="card-header bg-white border-bottom">
        <div class="header-content">
          <div>
            <h2 class="header-title mb-0">Banners</h2>
            <p class="text-muted small mb-0">Manage your advertising banners and campaigns</p>
          </div>
          <button class="btn btn-primary btn-lg" @click="openAddModal">
            <i class="bi bi-plus-circle me-2"></i>Add New Banner
          </button>
        </div>
      </div>

      <div class="card-body p-0">
        <!-- Filters & Search -->
        <div class="filters-section">
          <div class="search-box">
            <i class="bi bi-search"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by link or date..."
              class="form-control form-control-sm"
            />
          </div>

          <div class="status-filter">
            <label class="filter-label">Status:</label>
            <div class="filter-options">
              <button
                v-for="status in statusOptions"
                :key="status.value"
                :class="['filter-btn', { active: selectedStatus === status.value }]"
                @click="selectedStatus = status.value"
              >
                <span :class="`status-badge status-${status.value}`"></span>
                {{ status.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Stats Row -->
        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-label">Total Banners</span>
            <span class="stat-value">{{ banners.length }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Active</span>
            <span class="stat-value text-success">{{ activeCount }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Pending</span>
            <span class="stat-value text-warning">{{ pendingCount }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Inactive</span>
            <span class="stat-value text-secondary">{{ inactiveCount }}</span>
          </div>
        </div>

        <!-- Banners Grid/List -->
        <div class="banners-list">
          <div v-if="filteredBanners.length === 0" class="empty-state">
            <i class="bi bi-inbox text-muted mb-2"></i>
            <p class="text-muted">No banners found</p>
          </div>

          <div v-for="banner in filteredBanners" :key="banner.id" class="banner-card">
            <!-- Left Section: Image -->
            <div class="banner-card-image">
              <img
                :src="banner.image"
                :alt="banner.link"
                class="banner-image"
              />
              <span :class="`status-badge-card status-${banner.status}`">
                {{ formatStatus(banner.status) }}
              </span>
            </div>

            <!-- Middle Section: Details -->
            <div class="banner-card-content">
              <!-- Campaign Link -->
              <div class="banner-link-section">
                <a :href="`https://${banner.link}`" target="_blank" class="banner-link">
                  {{ banner.link }}
                  <i class="bi bi-box-arrow-up-right"></i>
                </a>
                <small class="text-muted">{{ banner.requestedDate }}</small>
              </div>

              <!-- Timeline -->
              <div class="banner-timeline">
                <div class="timeline-item">
                  <i class="bi bi-calendar-event"></i>
                  <div class="timeline-content">
                    <small class="label">Start</small>
                    <p class="text-muted">{{ banner.startDate }}</p>
                  </div>
                </div>
                <div class="timeline-divider">
                  <span class="timeline-arrow">→</span>
                </div>
                <div class="timeline-item">
                  <i class="bi bi-calendar-event"></i>
                  <div class="timeline-content">
                    <small class="label">End</small>
                    <p class="text-muted">{{ banner.endDate }}</p>
                  </div>
                </div>
              </div>

              <!-- Stats -->
              <div class="banner-stats">
                <div class="stat">
                  <i class="bi bi-hourglass-split"></i>
                  <span>{{ banner.days }} days</span>
                </div>
                <div class="stat">
                  <i class="bi bi-display"></i>
                  <span>Hero section</span>
                </div>
              </div>
            </div>

            <!-- Right Section: Actions -->
            <div class="banner-card-actions">
              <button
                @click="editBanner(banner)"
                class="btn-action btn-edit"
                title="Edit Banner"
              >
                <i class="bi bi-pencil-fill"></i>
                <span>Edit</span>
              </button>
              <button
                @click="confirmDelete(banner)"
                class="btn-action btn-delete"
                title="Delete Banner"
              >
                <i class="bi bi-trash-fill"></i>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="modal d-block" style="background-color: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-bottom">
            <div>
              <h5 class="modal-title">{{ isEditing ? 'Edit Banner' : 'Create New Banner' }}</h5>
              <small class="text-muted d-block mt-1">
                {{ isEditing ? 'Update banner details and settings' : 'Add a new banner to your campaigns' }}
              </small>
            </div>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
              :disabled="isSubmitting"
            ></button>
          </div>

          <form @submit.prevent="saveBanner" class="modal-body">
            <!-- Success/Error Message -->
            <div v-if="submitMessage" :class="['alert', `alert-${submitMessage.type}`]">
              <i :class="`bi bi-${submitMessage.type === 'success' ? 'check-circle' : 'exclamation-circle'}`"></i>
              {{ submitMessage.text }}
            </div>

            <!-- Banner Image -->
            <div class="form-section mb-4">
              <label class="form-label fw-semibold d-flex align-items-center gap-2">
                <i class="bi bi-image text-primary"></i>
                Banner Image
              </label>
              <FileUpload
                v-model="formData.image"
                alt-text="Banner image"
                @update:model-value="(val) => (formData.image = val)"
              />
              <small v-if="errors.image" class="text-danger d-block mt-2">{{ errors.image }}</small>
            </div>

            <!-- Campaign Dates -->
            <div class="form-section mb-4">
              <label class="form-label fw-semibold d-flex align-items-center gap-2">
                <i class="bi bi-calendar-event text-primary"></i>
                Campaign Period
              </label>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label small">Start Date</label>
                  <input
                    type="date"
                    :class="['form-control', { 'is-invalid': errors.startDate }]"
                    v-model="formData.startDate"
                  />
                  <small v-if="errors.startDate" class="text-danger">{{ errors.startDate }}</small>
                </div>
                <div class="col-md-6">
                  <label class="form-label small">End Date</label>
                  <input
                    type="date"
                    :class="['form-control', { 'is-invalid': errors.endDate }]"
                    v-model="formData.endDate"
                  />
                  <small v-if="errors.endDate" class="text-danger">{{ errors.endDate }}</small>
                </div>
              </div>
            </div>

            <!-- Campaign Details -->
            <div class="form-section mb-4">
              <label class="form-label fw-semibold d-flex align-items-center gap-2">
                <i class="bi bi-info-circle text-primary"></i>
                Campaign Details
              </label>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label small">Request Date</label>
                  <input
                    type="date"
                    :class="['form-control', { 'is-invalid': errors.requestedDate }]"
                    v-model="formData.requestedDate"
                  />
                  <small v-if="errors.requestedDate" class="text-danger">{{ errors.requestedDate }}</small>
                </div>
                <div class="col-md-6">
                  <label class="form-label small">Duration (Days)</label>
                  <input
                    type="number"
                    :class="['form-control', { 'is-invalid': errors.days }]"
                    v-model.number="formData.days"
                    min="1"
                  />
                  <small v-if="errors.days" class="text-danger">{{ errors.days }}</small>
                </div>
              </div>
            </div>

            <!-- Link -->
            <div class="form-section mb-4">
              <label class="form-label fw-semibold d-flex align-items-center gap-2">
                <i class="bi bi-link-45deg text-primary"></i>
                Destination Link
              </label>
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label small">Campaign Link</label>
                  <input
                    type="text"
                    :class="['form-control', { 'is-invalid': errors.link }]"
                    v-model="formData.link"
                    placeholder="example.com"
                  />
                  <small v-if="errors.link" class="text-danger">{{ errors.link }}</small>
                </div>
              </div>
            </div>

            <!-- Status -->
            <div class="form-section mb-4">
              <label class="form-label fw-semibold d-flex align-items-center gap-2">
                <i class="bi bi-toggle-on text-primary"></i>
                Status
              </label>
              <div class="status-radio-group">
                <div v-for="status in statusOptions" :key="status.value" class="form-check">
                  <input
                    type="radio"
                    :id="`status-${status.value}`"
                    :value="status.value"
                    v-model="formData.status"
                    class="form-check-input"
                  />
                  <label :for="`status-${status.value}`" class="form-check-label">
                    <span :class="`status-badge status-${status.value}`"></span>
                    {{ status.label }}
                  </label>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="modal-footer border-top mt-4">
              <button
                type="button"
                class="btn btn-light"
                @click="closeModal"
                :disabled="isSubmitting"
              >
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                {{ isEditing ? 'Update Banner' : 'Create Banner' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal d-block" style="background-color: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-bottom">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle text-danger me-2"></i>Delete Banner
            </h5>
            <button type="button" class="btn-close" @click="showDeleteModal = false"></button>
          </div>
          <div class="modal-body">
            <p class="mb-2">Are you sure you want to delete this banner?</p>
            <p class="text-muted small">This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" @click="showDeleteModal = false">
              Cancel
            </button>
            <button type="button" class="btn btn-danger" @click="deleteBanner">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { mockBanners } from '@/data/banners'
import type { Banner, BannerStatus } from '@/types/banner'
import FileUpload from '@/components/common/FileUpload.vue'
import { useFormState } from '@/composables/useFormState'

// State
const banners = ref<Banner[]>(JSON.parse(JSON.stringify(mockBanners)))
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const bannerToDelete = ref<Banner | null>(null)
const searchQuery = ref('')
const selectedStatus = ref<BannerStatus | 'all'>('all')

// Status options
const statusOptions = [
  { value: 'active' as BannerStatus, label: 'Active' },
  { value: 'pending' as BannerStatus, label: 'Pending' },
  { value: 'inactive' as BannerStatus, label: 'Inactive' },
  { value: 'expired' as BannerStatus, label: 'Expired' },
]

// Form Data
const defaultFormData = {
  id: 0,
  requestedDate: '',
  image: '',
  days: 7,
  startDate: '',
  endDate: '',
  link: '',
  status: 'active' as BannerStatus,
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
} = useFormState(defaultFormData)

// Computed
const filteredBanners = computed(() => {
  return banners.value.filter((banner) => {
    const matchesSearch =
      banner.link.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      banner.startDate.includes(searchQuery.value) ||
      banner.endDate.includes(searchQuery.value)
    const matchesStatus = selectedStatus.value === 'all' || banner.status === selectedStatus.value
    return matchesSearch && matchesStatus
  })
})

const activeCount = computed(() => banners.value.filter((b) => b.status === 'active').length)
const pendingCount = computed(() => banners.value.filter((b) => b.status === 'pending').length)
const inactiveCount = computed(() => banners.value.filter((b) => b.status === 'inactive').length)

// Methods
const formatStatus = (status: BannerStatus): string => {
  const map: Record<BannerStatus, string> = {
    active: 'Active',
    pending: 'Pending',
    inactive: 'Inactive',
    expired: 'Expired',
  }
  return map[status]
}

const openAddModal = () => {
  isEditing.value = false
  resetForm()
  clearErrors()
  showModal.value = true
}

const editBanner = (banner: Banner) => {
  isEditing.value = true
  Object.assign(formData, banner)
  clearErrors()
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const saveBanner = async () => {
  const validationRules = {
    requestedDate: { required: true },
    image: { required: true },
    days: { required: true, min: 1 },
    startDate: { required: true },
    endDate: { required: true },
    link: { required: true, minLength: 3 },
    status: { required: true },
  }

  if (!validateForm(validationRules)) {
    showError('Please fix the errors in the form')
    return
  }

  isSubmitting.value = true

  try {
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (isEditing.value) {
      const index = banners.value.findIndex((b) => b.id === formData.id)
      if (index !== -1) {
        banners.value[index] = { ...formData } as Banner
      }
      showSuccess('Banner updated successfully')
    } else {
      const newBanner = {
        ...formData,
        id: Math.max(...banners.value.map((b) => b.id), 0) + 1,
      } as Banner
      banners.value.unshift(newBanner)
      showSuccess('Banner created successfully')
    }

    closeModal()
  } catch (error) {
    showError('Failed to save banner')
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = (banner: Banner) => {
  bannerToDelete.value = banner
  showDeleteModal.value = true
}

const deleteBanner = async () => {
  if (!bannerToDelete.value) return

  try {
    await new Promise((resolve) => setTimeout(resolve, 300))
    banners.value = banners.value.filter((b) => b.id !== bannerToDelete.value!.id)
    showSuccess('Banner deleted successfully')
    showDeleteModal.value = false
    bannerToDelete.value = null
  } catch (error) {
    showError('Failed to delete banner')
  }
}
</script>

<style scoped>
.manage-banner-container {
  padding: 1.5rem;
  background: #f8f9fa;
  min-height: calc(100vh - 65px);
}

.card {
  border-radius: 0.5rem;
  border: none;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.card-header {
  padding: 2rem 1.75rem;
  background: #fff;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.header-content h2,
.header-content p {
  margin: 0;
}

.header-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1c1a1a;
  margin-bottom: 0.25rem;
}

/* Filters Section */
.filters-section {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background: #fff;
}

.search-box {
  position: relative;
  margin-bottom: 1.5rem;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  pointer-events: none;
}

.search-box .form-control {
  padding-left: 2.5rem;
  border-color: #e9ecef;
}

.search-box .form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
}

.status-filter {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-label {
  font-weight: 600;
  color: #495057;
  white-space: nowrap;
}

.filter-options {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #dee2e6;
  background: #fff;
  border-radius: 0.375rem;
  color: #495057;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: #0d6efd;
  color: #0d6efd;
}

.filter-btn.active {
  background: #0d6efd;
  border-color: #0d6efd;
  color: #fff;
}

/* Status Badge - Filter buttons */
.status-badge {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.status-badge.status-active {
  background: #28a745;
}

.status-badge.status-pending {
  background: #ffc107;
}

.status-badge.status-inactive {
  background: #6c757d;
}

.status-badge.status-expired {
  background: #dc3545;
}

/* Stats Row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background: #fff;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6c757d;
  font-weight: 500;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1c1a1a;
}

.stat-value.text-success {
  color: #28a745;
}

.stat-value.text-warning {
  color: #ffc107;
}

.stat-value.text-secondary {
  color: #6c757d;
}

/* Banners List */
.banners-list {
  padding: 1.5rem;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.banners-list .empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6c757d;
}

.banners-list .empty-state i {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.banners-list .empty-state p {
  margin: 0;
  font-size: 1rem;
}

/* Banner Card */
.banner-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1.5rem;
  align-items: center;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.banner-card:hover {
  border-color: #dee2e6;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  background: linear-gradient(135deg, #ffffff 0%, #ffffff 100%);
}

/* Image Section */
.banner-card-image {
  position: relative;
  width: 260px;
  height: 140px;
  flex-shrink: 0;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.status-badge-card {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #fff;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.status-badge-card.status-active {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
}

.status-badge-card.status-pending {
  background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
}

.status-badge-card.status-inactive {
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
}

.status-badge-card.status-expired {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
}

/* Content Section */
.banner-card-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-width: 0;
}

.banner-link-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.banner-link {
  color: #0d6efd;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  word-break: break-word;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s;
}

.banner-link:hover {
  color: #0a58ca;
  text-decoration: underline;
}

.banner-link i {
  font-size: 0.75rem;
}

.banner-link-section small {
  font-size: 0.8125rem;
  color: #6c757d;
}

/* Timeline */
.banner-timeline {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.timeline-item i {
  color: #0d6efd;
  font-size: 1rem;
  flex-shrink: 0;
}

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.timeline-content .label {
  font-weight: 600;
  color: #495057;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.timeline-content p {
  margin: 0;
  font-size: 0.875rem;
  color: #6c757d;
}

.timeline-divider {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin: 0 0.25rem;
  color: #dee2e6;
  font-weight: 700;
}

/* Stats */
.banner-stats {
  display: flex;
  gap: 1.5rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #f0f3ff;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #0d6efd;
  font-weight: 500;
}

.stat i {
  font-size: 1rem;
}

/* Actions Section */
.banner-card-actions {
  display: flex;
  gap: 0.75rem;
  flex-direction: column;
  flex-shrink: 0;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  text-transform: capitalize;
}

.btn-action i {
  font-size: 0.9rem;
}

.btn-edit {
  color: #0d6efd;
  background: #e7f1ff;
  border: 1px solid #0d6efd;
}

.btn-edit:hover {
  background: #0d6efd;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
}

.btn-delete {
  color: #dc3545;
  background: #ffe7ea;
  border: 1px solid #dc3545;
}

.btn-delete:hover {
  background: #dc3545;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.btn-action:active {
  transform: translateY(0);
}

/* Modal Improvements */
.modal {
  animation: fadeIn 0.15s ease-in;
}

.modal-content {
  border-radius: 0.5rem;
  border: none;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 1.5rem;
  background: #fff;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1c1a1a;
}

.modal-body {
  padding: 2rem;
  background: #fff;
}

.form-section {
  padding-bottom: 1rem;
}

.form-section .form-label {
  color: #1c1a1a;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.form-section .form-label i {
  font-size: 1.1rem;
}

.form-label.small {
  font-weight: 500;
  color: #495057;
  font-size: 0.875rem;
}

.status-radio-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.status-radio-group .form-check {
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.status-radio-group .form-check:hover {
  border-color: #0d6efd;
  background: #f8f9fa;
}

.status-radio-group .form-check-input:checked ~ .form-check-label {
  color: #0d6efd;
}

.modal-footer {
  padding: 1.5rem;
  background: #f8f9fa;
}

.btn-light {
  border-color: #dee2e6;
  color: #495057;
}

.btn-light:hover {
  background: #e9ecef;
  border-color: #dee2e6;
  color: #212529;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 992px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .manage-banner-container {
    padding: 1rem;
  }

  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .banner-card {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .banner-card-image {
    width: 100%;
    height: 210px;
  }

  .banner-card-actions {
    flex-direction: row;
  }

  .banner-timeline {
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .status-filter {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-options {
    width: 100%;
  }

  .filter-btn {
    flex: 1;
  }

  .modal-dialog {
    margin: 1rem 0;
  }

  .status-radio-group {
    grid-template-columns: repeat(2, 1fr);
  }

  .header-title {
    font-size: 1.5rem;
  }

  .banner-card {
    padding: 1rem;
    gap: 0.75rem;
  }

  .banner-card-image {
    width: 100%;
    height: 185px;
  }

  .banner-link {
    font-size: 0.9375rem;
  }

  .banner-stats {
    gap: 1rem;
  }

  .banner-timeline {
    gap: 0.5rem;
    padding: 0.5rem;
  }

  .timeline-content p {
    font-size: 0.8125rem;
  }
}

@media (max-width: 576px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    padding: 1rem;
  }

  .stat-label {
    font-size: 0.75rem;
  }

  .stat-value {
    font-size: 1.25rem;
  }

  .banner-card {
    padding: 0.75rem;
    gap: 0.75rem;
    border-radius: 0.5rem;
  }

  .banner-card-image {
    width: 100%;
    height: 165px;
  }

  .banner-image {
    border-radius: 0.375rem;
  }

  .banner-link {
    font-size: 0.875rem;
  }

  .banner-link-section small {
    font-size: 0.75rem;
  }

  .banner-timeline {
    flex-direction: column;
    gap: 0.5rem;
  }

  .timeline-item {
    width: 100%;
  }

  .timeline-divider {
    display: none;
  }

  .banner-stats {
    flex-direction: column;
    gap: 0.5rem;
  }

  .stat {
    width: 100%;
    padding: 0.5rem;
  }

  .banner-card-actions {
    flex-direction: row;
    gap: 0.5rem;
  }

  .btn-action {
    flex: 1;
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }

  .btn-action span {
    display: none;
  }

  .btn-action i {
    font-size: 1rem;
  }

  .banners-list {
    padding: 0.75rem;
    gap: 0.75rem;
  }

  .header-content {
    flex-direction: column;
    width: 100%;
    gap: 1rem;
  }

  .header-content button {
    width: 100%;
  }
}
</style>
