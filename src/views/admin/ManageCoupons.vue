<template>
  <div class="rewards-container">
    <div class="rewards-card">
      <!-- Header -->
      <div class="rewards-header">
        <h2 class="rewards-title">Rewards</h2>
        <button class="btn-add-new" @click="openAddModal">Add New</button>
      </div>

      <!-- Coupons Grid -->
      <div class="coupons-grid">
        <div
          v-if="coupons.length === 0"
          class="text-center py-5 text-muted"
          style="grid-column: 1 / -1"
        >
          <p>No coupons found. Click "Add New" to create one.</p>
        </div>

        <div v-for="(coupon, index) in coupons" :key="coupon.id" class="coupon-card">
          <div class="coupon-content">
            <div class="coupon-number-section">
              <div class="coupon-number">{{ index + 1 }}</div>
              <div class="coupon-label">No.</div>
            </div>
            <div class="divider"></div>
            <div class="coupon-text">
              <div class="coupon-code">{{ coupon.code }}</div>
              <div class="discount-text">Discount {{ coupon.discount }}%</div>
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

            <!-- Coupon Code -->
            <div class="mb-3">
              <label class="form-label">Coupon Code</label>
              <input
                v-model="formData.code"
                type="text"
                :class="['form-control', { 'is-invalid': errors.code }]"
                placeholder="e.g., HAPPYNEWYEAR"
                @input="formData.code = formData.code.toUpperCase()"
              />
              <small v-if="errors.code" class="text-danger">{{ errors.code }}</small>
              <small class="text-muted d-block mt-1">Coupon code (uppercase automatically)</small>
            </div>

            <!-- Discount -->
            <div class="mb-3">
              <label class="form-label">Discount Percentage (%)</label>
              <div class="input-group">
                <input
                  v-model.number="formData.discount"
                  type="number"
                  :class="['form-control', { 'is-invalid': errors.discount }]"
                  placeholder="e.g., 15"
                  min="0"
                  max="100"
                />
                <span class="input-group-text">%</span>
              </div>
              <small v-if="errors.discount" class="text-danger">{{ errors.discount }}</small>
            </div>

            <!-- Description -->
            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea
                v-model="formData.description"
                class="form-control"
                rows="3"
                placeholder="e.g., New Year Special Offer"
              ></textarea>
            </div>

            <!-- Start Date & End Date -->
            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="form-label">Start Date</label>
                <input
                  v-model="formData.startDate"
                  type="date"
                  :class="['form-control', { 'is-invalid': errors.startDate }]"
                />
                <small v-if="errors.startDate" class="text-danger">{{ errors.startDate }}</small>
              </div>

              <div class="col-md-6">
                <label class="form-label">End Date</label>
                <input
                  v-model="formData.endDate"
                  type="date"
                  :class="['form-control', { 'is-invalid': errors.endDate }]"
                />
                <small v-if="errors.endDate" class="text-danger">{{ errors.endDate }}</small>
              </div>
            </div>

            <!-- Status -->
            <div class="mb-3">
              <label class="form-label">Status</label>
              <select :class="['form-select', { 'is-invalid': errors.status }]" v-model="formData.status">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
              </select>
              <small v-if="errors.status" class="text-danger">{{ errors.status }}</small>
            </div>

            <!-- Usage Limit -->
            <div class="mb-3">
              <label class="form-label">Usage Limit (optional)</label>
              <input
                v-model.number="formData.usageLimit"
                type="number"
                class="form-control"
                placeholder="e.g., 100 (leave empty for unlimited)"
                min="1"
              />
              <small class="text-muted d-block mt-1">Maximum number of times this coupon can be used</small>
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
              Are you sure you want to delete the coupon <strong>{{ couponToDelete?.code }}</strong
              >?
            </p>
            <p class="text-muted small">This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">
              Cancel
            </button>
            <button type="button" class="btn btn-danger" @click="deleteCoupon">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFormState } from '@/composables/useFormState'

interface Coupon {
  id: number
  code: string
  discount: number
  description?: string
  startDate?: string
  endDate?: string
  status: 'active' | 'inactive' | 'expired'
  usageLimit?: number
}

// Sample data
const initialCoupons: Coupon[] = [
  {
    id: 1,
    code: 'HAPPYNEWYEAR',
    discount: 15,
    description: 'New Year Special Offer',
    status: 'active',
  },
  {
    id: 2,
    code: 'MERRYCHRISTMAS',
    discount: 15,
    description: 'Christmas Special',
    status: 'active',
  },
  {
    id: 3,
    code: 'SAVE40',
    discount: 40,
    description: 'Big Savings',
    status: 'active',
  },
  {
    id: 4,
    code: 'WELCOME10',
    discount: 10,
    description: 'Welcome Offer',
    status: 'active',
  },
  {
    id: 5,
    code: 'STUDENT10',
    discount: 10,
    description: 'Student Discount',
    status: 'active',
  },
  {
    id: 6,
    code: 'CLEARANCE25',
    discount: 30,
    description: 'Clearance Sale',
    status: 'active',
  },
  {
    id: 7,
    code: 'HALLOWEEN',
    discount: 5,
    description: 'Halloween Special',
    status: 'active',
  },
  {
    id: 8,
    code: 'ANNIVERSARY10',
    discount: 50,
    description: 'Anniversary Special',
    status: 'active',
  },
]

const coupons = ref<Coupon[]>(initialCoupons)
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingCoupon = ref<Coupon | null>(null)
const couponToDelete = ref<Coupon | null>(null)

const initialFormData = {
  id: 0,
  code: '',
  discount: 0,
  description: '',
  startDate: '',
  endDate: '',
  status: 'active' as const,
  usageLimit: undefined as number | undefined,
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
  editingCoupon.value = null
  resetForm()
  clearErrors()
  showModal.value = true
}

const editCoupon = (coupon: Coupon) => {
  editingCoupon.value = coupon
  Object.assign(formData, coupon)
  clearErrors()
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingCoupon.value = null
  resetForm()
}

const confirmDelete = (coupon: Coupon) => {
  couponToDelete.value = coupon
  showDeleteModal.value = true
}

const saveCoupon = async () => {
  const validationRules = {
    code: { required: true, minLength: 3, maxLength: 50 },
    discount: { required: true, min: 0, max: 100 },
    status: { required: true },
  }

  if (!validateForm(validationRules)) {
    showError('Please fix the errors in the form')
    return
  }

  isSubmitting.value = true

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (editingCoupon.value) {
      const index = coupons.value.findIndex((c) => c.id === editingCoupon.value!.id)
      if (index !== -1) {
        coupons.value[index] = { ...formData } as Coupon
      }
      showSuccess('Coupon updated successfully')
    } else {
      const newCoupon: Coupon = {
        ...formData,
        id: Math.max(...coupons.value.map((c) => c.id), 0) + 1,
      } as Coupon
      coupons.value.unshift(newCoupon)
      showSuccess('Coupon added successfully')
    }

    closeModal()
  } catch (error) {
    showError('Failed to save coupon')
  } finally {
    isSubmitting.value = false
  }
}

const deleteCoupon = async () => {
  if (!couponToDelete.value) return

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300))

    coupons.value = coupons.value.filter((c) => c.id !== couponToDelete.value!.id)
    showSuccess('Coupon deleted successfully')
    showDeleteModal.value = false
    couponToDelete.value = null
  } catch (error) {
    showError('Failed to delete coupon')
  }
}
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
  height: 70px;
}

.coupon-content {
  display: flex;
  align-items: center;
  padding: 1px 27px;
  height: 100%;
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
  height: 68px;
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
