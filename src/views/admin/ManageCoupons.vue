<template>
  <div class="rewards-container">
    <div class="rewards-card">
      <!-- Header -->
      <div class="rewards-header">
        <h2 class="rewards-title">Rewards ({{ coupons.length }})</h2>
        <button class="btn-add-new" @click="openAddModal">Add New</button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-danger" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Coupons Grid -->
      <div v-else class="coupons-grid">
        <div
          v-if="coupons.length === 0"
          class="text-center py-5 text-muted"
          style="grid-column: 1 / -1"
        >
          <p>No coupons found. Click "Add New" to create one.</p>
        </div>

        <div v-for="(coupon, index) in coupons" :key="coupon._id" class="coupon-card">
          <div class="coupon-content">
            <div class="coupon-number-section">
              <div class="coupon-number">{{ index + 1 }}</div>
              <div class="coupon-label">No.</div>
            </div>
            <div class="divider"></div>
              <div class="coupon-text">
              <div class="coupon-code">{{ coupon.code }}</div>
              <div class="discount-text">Discount {{ coupon.discount }}%</div>
              <div class="usage-info">
                <span class="usage-text">
                  <i class="bi bi-ticket-perforated"></i>
                  <!-- Coupon: {{ coupon.usageLimit }}/{{ (coupon.usageLimit) - (coupon.usedCount) }} -->
                   Coupon: {{ coupon.usedCount }}/{{ coupon.usageLimit }}
                </span>
              </div>
              <div class="status-badge">
                <span
                  :class="['badge', 'badge-clickable', getStatusClass(coupon.status)]"
                  @click="toggleStatus(coupon)"
                  :title="coupon.status === 'expired' ? 'Expired (cannot change)' : 'Click to toggle status'"
                >
                  {{ coupon.status }}
                </span>
              </div>
            </div>
            <div class="coupon-actions">
              <button class="btn-edit" @click="editCoupon(coupon)">Edit</button>
              <button class="btn-delete" @click="confirmDelete(coupon)">Delete</button>
            </div>
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
              {{ editingCoupon ? 'Edit Coupon' : 'Add New Coupon' }}
            </h3>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
              :disabled="isSubmitting"
            ></button>
          </div>

          <form @submit.prevent="saveCoupon" class="modal-body">
            <!-- Success/Error Message -->
            <div v-if="submitMessage" :class="['alert', `alert-${submitMessage.type}`]">
              <i :class="`bi bi-${submitMessage.type === 'success' ? 'check-circle' : 'exclamation-circle'}`"></i>
              {{ submitMessage.text }}
            </div>

            <!-- Coupon Code & Discount -->
            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="form-label">Coupon Code <span class="text-danger">*</span></label>
                <input
                  v-model="formData.code"
                  type="text"
                  :class="['form-control', { 'is-invalid': errors.code }]"
                  placeholder="e.g., HAPPYNEWYEAR"
                  @input="formData.code = formData.code.toUpperCase()"
                  :disabled="isSubmitting"
                />
                <small v-if="errors.code" class="text-danger">{{ errors.code }}</small>
                <small class="text-muted d-block mt-1">Coupon code (uppercase automatically)</small>
              </div>

              <div class="col-md-6">
                <label class="form-label">Discount Percentage (%) <span class="text-danger">*</span></label>
                <div class="input-group">
                  <input
                    v-model.number="formData.discount"
                    type="number"
                    :class="['form-control', { 'is-invalid': errors.discount }]"
                    placeholder="e.g., 15"
                    min="0"
                    max="100"
                    step="0.01"
                    :disabled="isSubmitting"
                  />
                  <span class="input-group-text">%</span>
                </div>
                <small v-if="errors.discount" class="text-danger">{{ errors.discount }}</small>
              </div>
            </div>

            <!-- Start Date & Validity Days -->
            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="form-label">Start Date</label>
                <input
                  v-model="formData.startDate"
                  type="date"
                  :class="['form-control', { 'is-invalid': errors.startDate }]"
                  :disabled="isSubmitting"
                />
                <small v-if="errors.startDate" class="text-danger">{{ errors.startDate }}</small>
                <small class="text-muted d-block mt-1">Leave empty for immediate start</small>
              </div>

              <div class="col-md-6">
                <label class="form-label">Validity Days <span class="text-danger">*</span></label>
                <input
                  v-model.number="formData.validityDays"
                  type="number"
                  :class="['form-control', { 'is-invalid': errors.validityDays }]"
                  placeholder="e.g., 30"
                  min="1"
                  :disabled="isSubmitting"
                />
                <small v-if="errors.validityDays" class="text-danger">{{ errors.validityDays }}</small>
                <small class="text-muted d-block mt-1">Number of days coupon is valid</small>
              </div>
            </div>

            <!-- Status & Usage Limit -->
            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="form-label">Status</label>
                <select
                  :class="['form-select', { 'is-invalid': errors.status }]"
                  v-model="formData.status"
                  :disabled="isSubmitting"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <small v-if="errors.status" class="text-danger">{{ errors.status }}</small>
              </div>

              <div class="col-md-6">
                <label class="form-label">Usage Limit (optional)</label>
                <input
                  v-model.number="formData.usageLimit"
                  type="number"
                  :class="['form-control', { 'is-invalid': errors.usageLimit }]"
                  placeholder="e.g., 100 (leave empty for unlimited)"
                  min="1"
                  :disabled="isSubmitting"
                />
                <small v-if="errors.usageLimit" class="text-danger">{{ errors.usageLimit }}</small>
                <small class="text-muted d-block mt-1">Maximum number of times this coupon can be used</small>
              </div>
            </div>

            <!-- Description -->
            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea
                v-model="formData.description"
                class="form-control"
                rows="3"
                placeholder="e.g., New Year Special Offer"
                :disabled="isSubmitting"
              ></textarea>
            </div>

            <!-- End Date Display (calculated) -->
            <div v-if="calculatedEndDate" class="mb-3">
              <div class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                <strong>End Date:</strong> {{ formatDate(calculatedEndDate) }}
              </div>
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
                {{ editingCoupon ? 'Update' : 'Add' }}
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
            <p>
              Are you sure you want to delete the coupon <strong>{{ couponToDelete?.code }}</strong>?
            </p>
            <p class="text-muted small">This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">
              Cancel
            </button>
            <button type="button" class="btn btn-danger" @click="deleteCoupon" :disabled="isDeleting">
              <span v-if="isDeleting" class="spinner-border spinner-border-sm me-2"></span>
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
import axios from 'axios'

interface Coupon {
  _id: string
  code: string
  discount: number
  description?: string
  startDate: string
  endDate: string
  validityDays: number
  status: 'active' | 'inactive' | 'expired'
  usageLimit: number
  usedCount: number
  createdAt: string
  updatedAt: string
}

interface CouponFormData {
  code: string
  discount: number | string
  description?: string
  startDate?: string
  validityDays: number | string
  status: 'active' | 'inactive'
  usageLimit: number | string
}

const API_URL = 'http://localhost:5000/api/coupons'

const coupons = ref<Coupon[]>([])
const loading = ref(false)
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingCoupon = ref<Coupon | null>(null)
const couponToDelete = ref<Coupon | null>(null)
const isSubmitting = ref(false)
const isDeleting = ref(false)

const initialFormData: CouponFormData = {
  code: '',
  discount: '',
  description: '',
  startDate: '',
  validityDays: 30,
  status: 'active',
  usageLimit: '',
}

const formData = ref<CouponFormData>({ ...initialFormData })
const errors = ref<Record<string, string>>({})
const submitMessage = ref<{ type: 'success' | 'danger'; text: string } | null>(null)

// Calculated end date based on start date and validity days
const calculatedEndDate = computed(() => {
  if (!formData.value.validityDays) return null

  const startDate = formData.value.startDate
    ? new Date(formData.value.startDate)
    : new Date()

  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + Number(formData.value.validityDays))

  return endDate
})

// Format date for display
const formatDate = (date: Date | string) => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Get status badge class
const getStatusClass = (status: string) => {
  const classes = {
    active: 'bg-success',
    inactive: 'bg-secondary',
    expired: 'bg-danger'
  }
  return classes[status as keyof typeof classes] || 'bg-secondary'
}

// Toggle status
const toggleStatus = async (coupon: Coupon) => {
  // Don't allow toggling expired coupons
  if (coupon.status === 'expired') {
    return
  }

  const newStatus = coupon.status === 'active' ? 'inactive' : 'active'

  try {
    const response = await axios.put(`${API_URL}/${coupon._id}`, {
      code: coupon.code,
      discount: coupon.discount,
      description: coupon.description,
      startDate: coupon.startDate,
      validityDays: coupon.validityDays,
      status: newStatus,
      usageLimit: coupon.usageLimit,
    })

    if (response.data.success) {
      // Update the coupon in the list
      const index = coupons.value.findIndex(c => c._id === coupon._id)
      if (index !== -1 && coupons.value[index]) {
        coupons.value[index].status = newStatus
      }
    }
  } catch (error: any) {
    console.error('Error toggling status:', error)
    alert(error.response?.data?.message || 'Failed to update status')
  }
}

// Load all coupons from backend
const loadCoupons = async () => {
  loading.value = true
  try {
    const response = await axios.get(API_URL)
    if (response.data.success) {
      // Sort coupons by creation date (oldest first)
      coupons.value = response.data.data.sort((a: Coupon, b: Coupon) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      })
    }
  } catch (error: any) {
    console.error('Error loading coupons:', error)
    showErrorMessage(error.response?.data?.message || 'Failed to load coupons')
  } finally {
    loading.value = false
  }
}

// Validate form
const validateForm = (): boolean => {
  errors.value = {}

  if (!formData.value.code || formData.value.code.trim().length < 3) {
    errors.value.code = 'Coupon code must be at least 3 characters'
  }

  const discount = Number(formData.value.discount)
  if (!formData.value.discount || discount < 0 || discount > 100) {
    errors.value.discount = 'Discount must be between 0 and 100'
  }

  const validityDays = Number(formData.value.validityDays)
  if (!formData.value.validityDays || validityDays < 1) {
    errors.value.validityDays = 'Validity days must be at least 1'
  }

  // REMOVED - No validation for usageLimit, it's optional
  // Only validate if user enters a value
  if (formData.value.usageLimit) {
    const usageLimit = Number(formData.value.usageLimit)
    if (isNaN(usageLimit) || usageLimit < 1) {
      errors.value.usageLimit = 'Usage limit must be at least 1'
    }
  }

  return Object.keys(errors.value).length === 0
}

// Open add modal
const openAddModal = () => {
  editingCoupon.value = null
  formData.value = { ...initialFormData }
  errors.value = {}
  submitMessage.value = null
  showModal.value = true
}

// Edit coupon
const editCoupon = (coupon: Coupon) => {
  editingCoupon.value = coupon
  formData.value = {
    code: coupon.code,
    discount: coupon.discount,
    description: coupon.description || '',
    startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split('T')[0] : '',
    validityDays: coupon.validityDays,
    status: coupon.status === 'expired' ? 'inactive' : coupon.status,
    usageLimit: coupon.usageLimit || '',
  }
  errors.value = {}
  submitMessage.value = null
  showModal.value = true
}

// Close modal
const closeModal = () => {
  showModal.value = false
  editingCoupon.value = null
  formData.value = { ...initialFormData }
  errors.value = {}
  submitMessage.value = null
}

// Show error message
const showErrorMessage = (message: string) => {
  submitMessage.value = { type: 'danger', text: message }
  setTimeout(() => {
    submitMessage.value = null
  }, 5000)
}

// Show success message
const showSuccessMessage = (message: string) => {
  submitMessage.value = { type: 'success', text: message }
  setTimeout(() => {
    submitMessage.value = null
  }, 3000)
}

// Save coupon (create or update)
const saveCoupon = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  submitMessage.value = null

  try {
    const payload = {
      code: formData.value.code.toUpperCase(),
      discount: Number(formData.value.discount),
      description: formData.value.description || undefined,
      startDate: formData.value.startDate || undefined,
      validityDays: Number(formData.value.validityDays),
      status: formData.value.status,
      usageLimit: Number(formData.value.usageLimit),
    }

    if (editingCoupon.value) {
      // Update existing coupon
      const response = await axios.put(`${API_URL}/${editingCoupon.value._id}`, payload)
      if (response.data.success) {
        showSuccessMessage('Coupon updated successfully')
        await loadCoupons()
        setTimeout(() => {
          closeModal()
        }, 1500)
      }
    } else {
      // Create new coupon
      const response = await axios.post(API_URL, payload)
      if (response.data.success) {
        showSuccessMessage('Coupon created successfully')
        await loadCoupons()
        setTimeout(() => {
          closeModal()
        }, 1500)
      }
    }
  } catch (error: any) {
    console.error('Error saving coupon:', error)
    const errorMessage = error.response?.data?.message || 'Failed to save coupon'
    showErrorMessage(errorMessage)
  } finally {
    isSubmitting.value = false
  }
}

// Confirm delete
const confirmDelete = (coupon: Coupon) => {
  couponToDelete.value = coupon
  showDeleteModal.value = true
}

// Delete coupon
const deleteCoupon = async () => {
  if (!couponToDelete.value) return

  isDeleting.value = true

  try {
    const response = await axios.delete(`${API_URL}/${couponToDelete.value._id}`)
    if (response.data.success) {
      await loadCoupons()
      showDeleteModal.value = false
      couponToDelete.value = null
    }
  } catch (error: any) {
    console.error('Error deleting coupon:', error)
    alert(error.response?.data?.message || 'Failed to delete coupon')
  } finally {
    isDeleting.value = false
  }
}

// Load coupons on mount
onMounted(() => {
  loadCoupons()
})
</script>

<style scoped>
.rewards-container {
  background: #f2f2f2;
  padding: 20px;
  min-height: calc(100vh - 65px);
}

.rewards-card {
  background: #fff;
  border-radius: 5px;
  padding: 10px 0;
}

.rewards-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 25px;
  border-bottom: 1px solid #f2f2f2;
  padding-bottom: 14px;
  margin-bottom: 25px;
}

.rewards-title {
  color: #1c1a1a;
  font-family: 'Source Sans Pro', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.btn-add-new {
  width: 90px;
  height: 34px;
  border-radius: 5px;
  background: #ff4f5a;
  border: none;
  color: #fff;
  font-family: 'Source Sans Pro', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 13px;
  font-weight: 700;
  line-height: 22px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-add-new:hover {
  background: #e63946;
}

.coupons-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 19px;
  padding: 0 25px;
}

.coupon-card {
  border-radius: 5px;
  border: 1px solid #d3d3d3;
  background: #fff;
  box-shadow: 0 0 30px 3px rgba(0, 0, 0, 0.03);
  min-height: 100px;
  margin-bottom: 20px;
}

.coupon-content {
  display: flex;
  align-items: center;
  padding: 1px 27px;
  min-height: 100px;
  position: relative;
}

.coupon-number-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 18px;
  margin-right: 26px;
}

.coupon-number {
  font-family: 'Source Sans Pro', -apple-system, Roboto, Helvetica, sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: #ff4f5a;
  line-height: 1;
}

.coupon-label {
  font-family: 'Source Sans Pro', -apple-system, Roboto, Helvetica, sans-serif;
  font-weight: 400;
  font-size: 12px;
  color: #9b9b9b;
  margin-top: 2px;
}

.divider {
  width: 1px;
  min-height: 100px;
  background: #ebebeb;
  margin-right: 21px;
}

.coupon-text {
  flex: 1;
  color: #454545;
  font-family: 'Source Sans Pro', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 13px;
  line-height: 17px;
}

.coupon-code {
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.5px;
}

.discount-text {
  font-weight: 600;
  margin-top: 2px;
}

/* Enhanced Badge Styling */
.status-badge {
  margin-top: 6px;
}

.status-badge .badge {
  font-size: 11px;
  padding: 4px 12px;
  font-weight: 600;
  border-radius: 12px;
  text-transform: capitalize;
  letter-spacing: 0.3px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

/* Active Badge - Green */
.status-badge .badge.bg-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

/* Inactive Badge - Gray */
.status-badge .badge.bg-secondary {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%) !important;
  border: 1px solid rgba(107, 114, 128, 0.3);
}

/* Expired Badge - Red */
.status-badge .badge.bg-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

/* Clickable Badge Hover Effects */
.badge-clickable {
  cursor: pointer;
  user-select: none;
}

.badge-clickable:not(.bg-danger):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.badge-clickable:not(.bg-danger):active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

/* Expired Badge - Not Clickable */
.badge-clickable.bg-danger {
  cursor: not-allowed;
  opacity: 0.75;
  filter: grayscale(0.2);
}

/* Optional: Add pulsing dot indicator for active status */
.status-badge .badge.bg-success::before {
  content: "●";
  font-size: 8px;
  animation: pulse-success 2s infinite;
}

.status-badge .badge.bg-secondary::before {
  content: "●";
  font-size: 8px;
}

.status-badge .badge.bg-danger::before {
  content: "●";
  font-size: 8px;
}

/* Pulse animation for active status */
@keyframes pulse-success {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.coupon-actions {
  display: flex;
  gap: 15px;
}

.btn-edit,
.btn-delete {
  height: 28px;
  border-radius: 3px;
  border: 1px solid #ff4f5a;
  background: #fff;
  color: #ff4f5a;
  font-family: 'Source Sans Pro', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 22px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit {
  width: 50px;
  padding: 3px 15px;
}

.btn-delete {
  width: 64px;
  padding: 3px 15px;
}

.btn-edit:hover,
.btn-delete:hover {
  background: #ff4f5a;
  color: #fff;
}

.usage-text {
  font-size: 12px;
  line-height: 16px;
}

/* Responsive design */
@media (max-width: 1200px) {
  .coupons-grid {
    gap: 15px;
  }
}

@media (max-width: 768px) {
  .coupons-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .rewards-container {
    padding: 15px;
  }

  .rewards-header {
    padding: 4px 15px;
  }

  .coupons-grid {
    padding: 0 15px;
  }
}

@media (max-width: 576px) {
  .coupon-content {
    padding: 1px 15px;
  }

  .coupon-number-section {
    margin-right: 15px;
  }

  .divider {
    margin-right: 15px;
  }

  .coupon-actions {
    gap: 10px;
  }

  .btn-edit,
  .btn-delete {
    font-size: 11px;
    padding: 3px 10px;
  }

  .btn-edit {
    width: 45px;
  }

  .btn-delete {
    width: 58px;
  }
}
</style>
