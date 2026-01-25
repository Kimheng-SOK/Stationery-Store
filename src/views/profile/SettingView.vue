<template>
  <div class="profile-page">
    <div class="container py-4">
      <div class="info-card mb-3">
        <div class="info-card-header">
          <h5 class="mb-0">Account Settings</h5>
        </div>
        <div class="info-card-body">
          <div class="setting-section">
            <h6 class="mb-3">Change Password</h6>
            <form @submit.prevent="changePassword">
              <div class="mb-3">
                <label class="form-label">Current Password</label>
                <div class="input-group">
                  <input 
                    v-model="passwordForm.current" 
                    :type="showCurrentPassword ? 'text' : 'password'"
                    class="form-control" 
                    required 
                  />
                  <button 
                    class="btn btn-outline-secondary" 
                    type="button"
                    @click="showCurrentPassword = !showCurrentPassword"
                  >
                    <i :class="showCurrentPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">New Password</label>
                <div class="input-group">
                  <input 
                    v-model="passwordForm.new" 
                    :type="showNewPassword ? 'text' : 'password'"
                    class="form-control" 
                    required 
                    minlength="8"
                  />
                  <button 
                    class="btn btn-outline-secondary" 
                    type="button"
                    @click="showNewPassword = !showNewPassword"
                  >
                    <i :class="showNewPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                <small class="text-muted">Password must be at least 8 characters</small>
              </div>
              <div class="mb-3">
                <label class="form-label">Confirm New Password</label>
                <div class="input-group">
                  <input 
                    v-model="passwordForm.confirm" 
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="form-control" 
                    required 
                  />
                  <button 
                    class="btn btn-outline-secondary" 
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                    <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
              </div>
              <button type="submit" class="btn btn-primary" :disabled="isUpdatingPassword">
                <span v-if="isUpdatingPassword" class="spinner-border spinner-border-sm me-2"></span>
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>

      <div class="info-card">
        <div class="info-card-header bg-danger bg-opacity-10">
          <h5 class="mb-0 text-danger">Danger Zone</h5>
        </div>
        <div class="info-card-body">
          <div class="alert alert-danger mb-0">
            <h6 class="alert-heading">Delete Account</h6>
            <p class="mb-3">Once you delete your account, there is no going back. Please be certain.</p>
            <button class="btn btn-danger" @click="confirmDelete">
              <i class="bi bi-exclamation-triangle me-2"></i>Delete My Account
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const isUpdatingPassword = ref(false)

const changePassword = async () => {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    alert('New passwords do not match!')
    return
  }

  if (passwordForm.value.new.length < 8) {
    alert('Password must be at least 8 characters long')
    return
  }

  isUpdatingPassword.value = true
  
  try {
    // TODO: API call to change password
    // await fetch('/api/auth/change-password', {
    //   method: 'PUT',
    //   body: JSON.stringify({
    //     currentPassword: passwordForm.value.current,
    //     newPassword: passwordForm.value.new
    //   })
    // })
    
    alert('Password updated successfully!')
    passwordForm.value = { current: '', new: '', confirm: '' }
  } catch (error) {
    console.error('Failed to change password:', error)
    alert('Failed to update password. Please check your current password and try again.')
  } finally {
    isUpdatingPassword.value = false
  }
}

const confirmDelete = () => {
  const confirmed = confirm(
    'Are you absolutely sure you want to delete your account? This action cannot be undone.\n\n' +
    'All your data including orders, wishlist, and addresses will be permanently deleted.'
  )
  
  if (confirmed) {
    const doubleConfirmed = confirm(
      'This is your last chance. Are you really sure you want to permanently delete your account?'
    )
    
    if (doubleConfirmed) {
      deleteAccount()
    }
  }
}

const deleteAccount = async () => {
  try {
    // TODO: API call to delete account
    // await fetch('/api/auth/delete-account', { method: 'DELETE' })
    
    alert('Your account has been deleted.')
    authStore.logout()
    router.push('/')
  } catch (error) {
    console.error('Failed to delete account:', error)
    alert('Failed to delete account. Please try again or contact support.')
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
  max-width: 800px;
}

.info-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow: hidden;
}

.info-card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.info-card-body {
  padding: 1.5rem;
}

.setting-section {
  padding: 1rem 0;
}

.btn-primary {
  background-color: #141B3E;
  border-color: #141B3E;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0d1228;
  border-color: #0d1228;
}

.input-group .btn-outline-secondary {
  border-left: none;
}

.input-group:focus-within .form-control,
.input-group:focus-within .btn-outline-secondary {
  border-color: #86b7fe;
}

@media (max-width: 768px) {
  .profile-page {
    padding-top: 1rem;
  }

  .info-card-body {
    padding: 1rem;
  }
}

</style>