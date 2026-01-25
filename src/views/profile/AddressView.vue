<template>
  <div class="profile-page">
    <div class="container py-4">
      <div class="info-card mb-3">
        <div class="info-card-header">
          <h5 class="mb-0">My Addresses</h5>
          <button class="btn btn-primary btn-sm" @click="showAddForm = true">
            <i class="bi bi-plus-circle me-2"></i>Add New
          </button>
        </div>
      </div>

      <!-- Add/Edit Address Form -->
      <div v-if="showAddForm" class="info-card mb-3">
        <div class="info-card-header">
          <h6 class="mb-0">{{ editingAddress ? 'Edit' : 'Add New' }} Address</h6>
          <button class="btn btn-sm btn-outline-secondary" @click="cancelForm">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="info-card-body">
          <form @submit.prevent="saveAddress">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Full Name *</label>
                <input v-model="formData.name" type="text" class="form-control" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">Phone Number *</label>
                <input v-model="formData.phone" type="tel" class="form-control" required />
              </div>
              <div class="col-12">
                <label class="form-label">Street Address *</label>
                <input v-model="formData.street" type="text" class="form-control" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">City *</label>
                <input v-model="formData.city" type="text" class="form-control" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">Postal Code *</label>
                <input v-model="formData.postalCode" type="text" class="form-control" required />
              </div>
              <div class="col-12">
                <div class="form-check">
                  <input v-model="formData.isDefault" class="form-check-input" type="checkbox" id="defaultAddress">
                  <label class="form-check-label" for="defaultAddress">
                    Set as default address
                  </label>
                </div>
              </div>
              <div class="col-12">
                <button type="submit" class="btn btn-primary btn-sm">
                  <i class="bi bi-check-circle me-2"></i>Save Address
                </button>
                <button type="button" class="btn btn-outline-secondary btn-sm ms-2" @click="cancelForm">Cancel</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="info-card">
        <div class="loading-state">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3">Loading addresses...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="addresses.length === 0 && !showAddForm" class="info-card">
        <div class="empty-state">
          <i class="bi bi-geo-alt"></i>
          <h4 class="mt-3">No addresses saved</h4>
          <p class="text-muted">Add your first address for faster checkout</p>
          <button class="btn btn-primary btn-sm" @click="showAddForm = true">
            <i class="bi bi-plus-circle"></i>
            <span>Add Address</span>
          </button>
        </div>
      </div>

      <!-- Address List -->
      <div v-else-if="!showAddForm" class="row g-3">
        <div v-for="address in addresses" :key="address.id" class="col-md-6">
          <div class="address-card">
            <div class="address-header">
              <h6 class="mb-0">{{ address.name }}</h6>
              <span v-if="address.isDefault" class="badge bg-primary">Default</span>
            </div>
            <div class="address-body">
              <p class="mb-1"><i class="bi bi-telephone me-2"></i>{{ address.phone }}</p>
              <p class="mb-1"><i class="bi bi-geo-alt me-2"></i>{{ address.street }}</p>
              <p class="mb-0 text-muted">{{ address.city }}, {{ address.postalCode }}</p>
            </div>
            <div class="address-footer">
              <button class="btn btn-sm btn-outline-primary" @click="editAddress(address)">
                <i class="bi bi-pencil me-1"></i>Edit
              </button>
              <button class="btn btn-sm btn-outline-danger" @click="deleteAddress(address.id)">
                <i class="bi bi-trash me-1"></i>Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Address {
  id: number
  name: string
  phone: string
  street: string
  city: string
  postalCode: string
  isDefault: boolean
}

const showAddForm = ref(false)
const editingAddress = ref<Address | null>(null)
const addresses = ref<Address[]>([])
const isLoading = ref(true)

const formData = ref({
  name: '',
  phone: '',
  street: '',
  city: '',
  postalCode: '',
  isDefault: false
})

onMounted(async () => {
  await loadAddresses()
})

async function loadAddresses() {
  try {
    const saved = localStorage.getItem('addresses')
    if (saved) {
      addresses.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('Failed to load addresses:', error)
  } finally {
    isLoading.value = false
  }
}

const saveAddress = async () => {
  try {
    if (editingAddress.value) {
      const index = addresses.value.findIndex(a => a.id === editingAddress.value!.id)
      if (index !== -1) {
        addresses.value[index] = { ...formData.value, id: editingAddress.value.id }
      }
    } else {
      const newAddress: Address = {
        id: Date.now(),
        ...formData.value
      }
      addresses.value.push(newAddress)
    }
    
    localStorage.setItem('addresses', JSON.stringify(addresses.value))
    cancelForm()
  } catch (error) {
    console.error('Failed to save address:', error)
    alert('Failed to save address. Please try again.')
  }
}

const editAddress = (address: Address) => {
  editingAddress.value = address
  formData.value = { ...address }
  showAddForm.value = true
}

const deleteAddress = async (id: number) => {
  if (confirm('Are you sure you want to delete this address?')) {
    try {
      addresses.value = addresses.value.filter(a => a.id !== id)
      localStorage.setItem('addresses', JSON.stringify(addresses.value))
    } catch (error) {
      console.error('Failed to delete address:', error)
      alert('Failed to delete address. Please try again.')
    }
  }
}

const cancelForm = () => {
  showAddForm.value = false
  editingAddress.value = null
  formData.value = {
    name: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    isDefault: false
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.container {
  max-width: 1200px;
}

.info-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.info-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.info-card-header .btn {
  padding: 0.35rem 0.9rem;
  font-size: 0.85rem;
}

.info-card-body {
  padding: 1.5rem;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 3rem 2rem;
}

.empty-state i {
  font-size: 3.5rem !important;
  opacity: 0.2;
  color: #6c757d;
  margin-bottom: 1rem;
}

.empty-state h4 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #212529;
}

.empty-state p {
  font-size: 0.95rem;
  margin-bottom: 1.25rem;
  color: #6c757d;
}

/* CRITICAL: Small button for empty state */
.empty-state .btn {
  padding: 0.35rem 0.9rem !important;
  font-size: 0.85rem !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 0.35rem !important;
  width: auto !important;
}

.empty-state .btn i {
  font-size: 0.85rem !important;
  margin: 0 !important;
}

.address-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  height: 100%;
}

.address-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-color: #141B3E;
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.address-body {
  margin-bottom: 1rem;
}

.address-body i {
  width: 20px;
  color: #6c757d;
}

.address-footer {
  display: flex;
  gap: 0.5rem;
}

.address-footer .btn {
  padding: 0.35rem 0.9rem;
  font-size: 0.85rem;
}

.btn-primary {
  background-color: #141B3E !important;
  border-color: #141B3E !important;
}

.btn-primary:hover {
  background-color: #0d1228 !important;
  border-color: #0d1228 !important;
}

.bg-primary {
  background-color: #141B3E !important;
}

.btn-outline-primary {
  color: #141B3E;
  border-color: #141B3E;
}

.btn-outline-primary:hover {
  background-color: #141B3E;
  border-color: #141B3E;
  color: white;
}

@media (max-width: 768px) {
  .profile-page {
    padding-top: 1rem;
  }

  .info-card-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .info-card-header .btn {
    width: 100%;
  }

  .address-footer {
    flex-direction: column;
  }

  .address-footer .btn {
    width: 100%;
  }
}
</style>