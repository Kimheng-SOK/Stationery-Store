<template>
  <div class="profile-page">
    <div class="container py-4">
      <div class="row g-4">
        <div class="col-lg-3 col-md-4">
          <ProfileSidebar />
        </div>

        <main class="col-lg-9 col-md-8">
          <div class="info-card mb-3">
            <div class="info-card-header">
              <h5 class="mb-0">My Addresses</h5>
              <button class="btn btn-primary btn-sm" @click="showAddForm = true">
                <i class="bi bi-plus-circle me-2"></i>Add New Address
              </button>
            </div>
          </div>

          <!-- Add Address Form -->
          <div v-if="showAddForm" class="info-card mb-3">
            <div class="info-card-header">
              <h6 class="mb-0">Add New Address</h6>
              <button class="btn btn-sm btn-outline-secondary" @click="showAddForm = false">
                <i class="bi bi-x"></i>
              </button>
            </div>
            <div class="info-card-body">
              <form @submit.prevent="addAddress">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Full Name</label>
                    <input v-model="newAddress.name" type="text" class="form-control" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Phone Number</label>
                    <input v-model="newAddress.phone" type="tel" class="form-control" required />
                  </div>
                  <div class="col-12">
                    <label class="form-label">Street Address</label>
                    <input v-model="newAddress.street" type="text" class="form-control" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">City</label>
                    <input v-model="newAddress.city" type="text" class="form-control" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Postal Code</label>
                    <input v-model="newAddress.postalCode" type="text" class="form-control" required />
                  </div>
                  <div class="col-12">
                    <div class="form-check">
                      <input v-model="newAddress.isDefault" class="form-check-input" type="checkbox" id="defaultAddress">
                      <label class="form-check-label" for="defaultAddress">
                        Set as default address
                      </label>
                    </div>
                  </div>
                  <div class="col-12">
                    <button type="submit" class="btn btn-primary">Save Address</button>
                    <button type="button" class="btn btn-outline-secondary ms-2" @click="showAddForm = false">Cancel</button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <!-- Address List -->
          <div class="row g-3">
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
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProfileSidebar from '@/components/ProfileSidebar.vue'

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
const newAddress = ref({
  name: '',
  phone: '',
  street: '',
  city: '',
  postalCode: '',
  isDefault: false
})

const addresses = ref<Address[]>([
  {
    id: 1,
    name: 'Robert Ford',
    phone: '(+855) 111 222 333',
    street: '123 Main Street, Apt 4B',
    city: 'Phnom Penh',
    postalCode: '12000',
    isDefault: true
  },
  {
    id: 2,
    name: 'Robert Ford',
    phone: '(+855) 444 555 666',
    street: '456 Second Avenue',
    city: 'Siem Reap',
    postalCode: '17000',
    isDefault: false
  }
])

const addAddress = () => {
  const address: Address = {
    id: Date.now(),
    ...newAddress.value
  }
  addresses.value.push(address)
  showAddForm.value = false
  newAddress.value = {
    name: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    isDefault: false
  }
}

const editAddress = (address: Address) => {
  alert(`Edit address: ${address.name}`)
}

const deleteAddress = (id: number) => {
  if (confirm('Are you sure you want to delete this address?')) {
    addresses.value = addresses.value.filter(a => a.id !== id)
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-top: 2rem;
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

.info-card-body {
  padding: 1.5rem;
}

.address-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.address-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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
</style>