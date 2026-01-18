<template>
  <div class="profile-page">
    <div class="container py-4">
      <div class="row g-4">
        <div class="col-lg-3 col-md-4">
          <ProfileSidebar />
        </div>

        <main class="col-lg-9 col-md-8">
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
                  <img :src="formData.avatar" alt="Avatar" class="edit-avatar mb-3" />
                  <div>
                    <button type="button" class="btn btn-outline-primary btn-sm" @click="triggerFileUpload">
                      <i class="bi bi-camera me-1"></i>Change Photo
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
                    <label class="form-label">Full Name</label>
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
                    <label class="form-label">Email Address</label>
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
                        required 
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
                      <span class="input-group-text">
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
                      <button type="submit" class="btn btn-primary">
                        <i class="bi bi-check-circle me-1"></i>Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProfileSidebar from '@/components/ProfileSidebar.vue'

interface FormData {
  name: string
  email: string
  phone: string
  avatar: string
  dateOfBirth: string
  address: string
}

const router = useRouter()
const fileInput = ref<HTMLInputElement | null>(null)

const formData = ref<FormData>({
  name: 'Robert Ford',
  email: 'robertford@gmail.com',
  phone: '(+855) 111 222 333',
  avatar: 'https://i.pravatar.cc/150?img=12',
  dateOfBirth: '1995-05-15',
  address: '123 Main Street, Phnom Penh, Cambodia'
})

onMounted(() => {
  const savedUser = localStorage.getItem('userData')
  if (savedUser) {
    const userData = JSON.parse(savedUser)
    formData.value = { ...formData.value, ...userData }
  }
})

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

const handleSubmit = () => {
  if (!formData.value.name || !formData.value.email || !formData.value.phone) {
    alert('Please fill in all required fields')
    return
  }

  localStorage.setItem('userData', JSON.stringify(formData.value))
  
  alert('Profile updated successfully!')
  router.push('/profile')
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

.info-card-body {
  padding: 2rem;
}

.edit-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e9ecef;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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

@media (max-width: 768px) {
  .info-card-body {
    padding: 1.5rem;
  }

  .edit-avatar {
    width: 120px;
    height: 120px;
  }
}
</style>