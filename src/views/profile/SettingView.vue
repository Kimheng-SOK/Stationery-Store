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
              <h5 class="mb-0">Account Settings</h5>
            </div>
            <div class="info-card-body">
              <div class="setting-section">
                <h6 class="mb-3">Change Password</h6>
                <form @submit.prevent="changePassword">
                  <div class="mb-3">
                    <label class="form-label">Current Password</label>
                    <input v-model="passwordForm.current" type="password" class="form-control" required />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">New Password</label>
                    <input v-model="passwordForm.new" type="password" class="form-control" required />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Confirm New Password</label>
                    <input v-model="passwordForm.confirm" type="password" class="form-control" required />
                  </div>
                  <button type="submit" class="btn btn-primary">Update Password</button>
                </form>
              </div>
            </div>
          </div>

          <div class="info-card">
            <div class="info-card-header">
              <h5 class="mb-0">Danger Zone</h5>
            </div>
            <div class="info-card-body">
              <div class="alert alert-danger">
                <h6 class="alert-heading">Delete Account</h6>
                <p class="mb-2">Once you delete your account, there is no going back. Please be certain.</p>
                <button class="btn btn-danger" @click="deleteAccount">Delete My Account</button>
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

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})

const changePassword = () => {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    alert('Passwords do not match!')
    return
  }
  alert('Password updated successfully!')
  passwordForm.value = { current: '', new: '', confirm: '' }
}

const deleteAccount = () => {
  if (confirm('Are you absolutely sure? This action cannot be undone.')) {
    alert('Account deleted')
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
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.info-card-body {
  padding: 1.5rem;
}

.setting-section {
  padding: 1rem 0;
}
</style>