<template>
  <div class="profile-page">
    <div class="container py-4">
      <div class="info-card">
        <div class="info-card-header">
          <h5 class="mb-0">Edit Profile</h5>
          <button class="btn btn-sm btn-outline-secondary" @click="goBack">
            <i class="bi bi-arrow-left me-1"></i>Back
          </button>
        </div>
        <div class="info-card-body">
          <form @submit.prevent="handleSubmit">
            <div class="text-center mb-4">
              <div v-if="!formData.avatar" class="edit-avatar-placeholder mb-3">
                {{ getInitials(formData.name) }}
              </div>
              <img v-else :src="formData.avatar" alt="Avatar" class="edit-avatar mb-3" />
              <div>
                <button type="button" class="btn btn-outline-primary btn-sm" @click="triggerFileUpload">
                  <i class="bi bi-camera me-1"></i>Change Photo
                </button>
                <button 
                  v-if="formData.avatar" 
                  type="button" 
                  class="btn btn-outline-danger btn-sm ms-2" 
                  @click="removeAvatar"
                >
                  <i class="bi bi-trash me-1"></i>Remove
                </button>
              </div>
              <input 
                ref="fileInput" 
                type="file" 
                accept="image/*" 
                @change="handleAvatarUpload" 
                style="display: none;"
              />
            </div>

            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Full Name *</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-person"></i>
                  </span>
                  <input 
                    v-model="formData.name" 
                    type="text" 
                    class="form-control" 
                    placeholder="Enter your full name"
                    required 
                  />
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Email Address *</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-envelope"></i>
                  </span>
                  <input 
                    v-model="formData.email" 
                    type="email" 
                    class="form-control" 
                    placeholder="your@email.com"
                    required 
                  />
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Phone Number</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-telephone"></i>
                  </span>
                  <input 
                    v-model="formData.phone" 
                    type="tel" 
                    class="form-control" 
                    placeholder="(+855) 111 222 333"
                  />
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Date of Birth</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-calendar"></i>
                  </span>
                  <input 
                    v-model="formData.dateOfBirth" 
                    type="date" 
                    class="form-control"
                  />
                </div>
              </div>

              <div class="col-12">
                <label class="form-label">Address</label>
                <div class="input-group">
                  <span class="input-group-text align-items-start pt-2">
                    <i class="bi bi-geo-alt"></i>
                  </span>
                  <textarea 
                    v-model="formData.address" 
                    class="form-control" 
                    rows="3"
                    placeholder="Enter your address"
                  ></textarea>
                </div>
              </div>

              <div class="col-12">
                <div class="d-flex gap-3 justify-content-end">
                  <button type="button" class="btn btn-outline-secondary" @click="goBack">
                    Cancel
                  </button>
                  <button type="submit" class="btn btn-primary" :disabled="isSaving">
                    <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-check-circle me-1"></i>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

interface FormData {
  name: string
  email: string
  phone: string
  avatar: string
  dateOfBirth: string
  address: string
}

interface ExtendedUser {
  name: string
  email: string
  phone?: string
  avatar?: string
  dateOfBirth?: string
  address?: string
  [key: string]: unknown
}

const router = useRouter()
const authStore = useAuthStore()
const fileInput = ref<HTMLInputElement | null>(null)
const isSaving = ref(false)

const formData = ref<FormData>({
  name: '',
  email: '',
  phone: '',
  avatar: '',
  dateOfBirth: '',
  address: ''
})

onMounted(() => {
  if (authStore.user) {
    const user = authStore.user as ExtendedUser
    formData.value = {
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      avatar: user.avatar || '',
      dateOfBirth: user.dateOfBirth || '',
      address: user.address || ''
    }
  }
})

function getInitials(name: string): string {
  if (!name) return 'U'
  const parts = name.trim().split(' ').filter(part => part.length > 0)
  
  if (parts.length === 0) return 'U'
  if (parts.length === 1) {
    return parts[0]?.[0]?.toUpperCase() || 'U'
  }
  
  const firstInitial = parts[0]?.[0]?.toUpperCase() || ''
  const lastInitial = parts[parts.length - 1]?.[0]?.toUpperCase() || ''
  
  return (firstInitial + lastInitial) || 'U'
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleAvatarUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      formData.value.avatar = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeAvatar = () => {
  if (confirm('Are you sure you want to remove your profile photo?')) {
    formData.value.avatar = ''
  }
}

const handleSubmit = async () => {
  if (!formData.value.name || !formData.value.email) {
    alert('Please fill in all required fields')
    return
  }

  isSaving.value = true

  try {
    if (authStore.user) {
      const user = authStore.user as ExtendedUser
      
      // Update basic fields
      user.name = formData.value.name
      user.email = formData.value.email
      user.phone = formData.value.phone
      user.avatar = formData.value.avatar
      user.dateOfBirth = formData.value.dateOfBirth
      user.address = formData.value.address
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(authStore.user))
    }
    
    alert('Profile updated successfully!')
    router.push('/profile')
  } catch (error) {
    console.error('Failed to update profile:', error)
    alert('Failed to update profile. Please try again.')
  } finally {
    isSaving.value = false
  }
}

const goBack = () => {
  router.back()
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
  max-width: 900px;
}

.info-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow: hidden;
}

.info-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.info-card-header .btn {
  padding: 0.4rem 1rem;
  font-size: 0.875rem;
}

.info-card-body {
  padding: 2rem;
}

.edit-avatar, .edit-avatar-placeholder {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 4px solid #e9ecef;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin: 0 auto;
}

.edit-avatar {
  object-fit: cover;
}

.edit-avatar-placeholder {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  font-weight: 700;
  text-transform: uppercase;
}

.form-label {
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.5rem;
}

.input-group-text {
  background: #f8f9fa;
  border-right: none;
  width: 45px;
  justify-content: center;
}

.input-group .form-control {
  border-left: none;
}

.input-group:focus-within .input-group-text {
  border-color: #86b7fe;
  background: #e7f1ff;
}

.input-group:focus-within .form-control {
  border-color: #86b7fe;
}

.btn-primary {
  background-color: #141B3E;
  border-color: #141B3E;
  padding: 0.5rem 1.2rem;
  font-size: 0.9rem;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0d1228;
  border-color: #0d1228;
}

.btn-outline-primary {
  color: #141B3E;
  border-color: #141B3E;
  padding: 0.4rem 1rem;
  font-size: 0.875rem;
}

.btn-outline-primary:hover {
  background-color: #141B3E;
  border-color: #141B3E;
  color: white;
}

.btn-outline-secondary,
.btn-outline-danger {
  padding: 0.4rem 1rem;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .profile-page {
    padding-top: 1rem;
  }

  .info-card-body {
    padding: 1.5rem;
  }

  .edit-avatar, .edit-avatar-placeholder {
    width: 120px;
    height: 120px;
  }

  .edit-avatar-placeholder {
    font-size: 2.5rem;
  }

  .info-card-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .info-card-header .btn {
    width: 100%;
  }

  .d-flex.gap-3 {
    flex-direction: column;
  }

  .d-flex.gap-3 .btn {
    width: 100%;
  }
}
</style>