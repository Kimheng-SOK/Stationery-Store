<template>
  <div class="login-container d-flex min-vh-100">
    <!-- Left Side - Image -->
    <div class="login-image-section d-none d-lg-flex">
      <img src="@/assets/image/pfp.png" alt="Access Image" />
    </div>

    <!-- Right Side - Form -->
    <div class="login-form-section d-flex justify-content-center align-items-center">
      <div class="login-form-wrapper">
        <div class="text-center mb-5">
          <h1 class="login-title fw-bold mb-2">Create Account</h1>
          <p class="login-subtitle">Sign up to start your shopping journey</p>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="alert alert-danger mb-4" role="alert">
          <i class="bi bi-exclamation-circle me-2"></i>
          {{ errorMessage }}
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="alert alert-success mb-4" role="alert">
          <i class="bi bi-check-circle me-2"></i>
          {{ successMessage }}
        </div>

        <form @submit.prevent="handleSignUp" class="login-form">
          <!-- Name Input -->
          <div class="form-group mb-4">
            <label class="form-label">Full Name <span class="text-danger">*</span></label>
            <div class="input-group-custom">
              <span class="input-icon">
                <i class="bi bi-person"></i>
              </span>
              <input
                type="text"
                placeholder="Enter your full name"
                v-model="name"
                :class="['form-control form-control-custom', { 'is-invalid': errors.name }]"
                required
                @blur="validateName"
              />
            </div>
            <small v-if="errors.name" class="text-danger">{{ errors.name }}</small>
          </div>

          <!-- Email Input -->
          <div class="form-group mb-4">
            <label class="form-label">Email Address <span class="text-danger">*</span></label>
            <div class="input-group-custom">
              <span class="input-icon">
                <i class="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                placeholder="Enter your email"
                v-model="email"
                :class="['form-control form-control-custom', { 'is-invalid': errors.email }]"
                required
                @blur="validateEmail"
              />
            </div>
            <small v-if="errors.email" class="text-danger">{{ errors.email }}</small>
          </div>

          <!-- Phone Input -->
          <div class="form-group mb-4">
            <label class="form-label">Phone Number (Optional)</label>
            <div class="input-group-custom">
              <span class="input-icon">
                <i class="bi bi-telephone"></i>
              </span>
              <input
                type="tel"
                placeholder="Enter your phone number"
                v-model="phone"
                class="form-control form-control-custom"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div class="form-group mb-4">
            <label class="form-label">Password <span class="text-danger">*</span></label>
            <div class="input-group-custom">
              <span class="input-icon">
                <i class="bi bi-lock"></i>
              </span>
              <input
                placeholder="Enter your password (min 6 characters)"
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                :class="['form-control form-control-custom', { 'is-invalid': errors.password }]"
                required
                @blur="validatePassword"
              />
              <span class="input-icon-right" @click="togglePassword">
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </span>
            </div>
            <small v-if="errors.password" class="text-danger">{{ errors.password }}</small>
          </div>

          <!-- Confirm Password Input -->
          <div class="form-group mb-4">
            <label class="form-label">Confirm Password <span class="text-danger">*</span></label>
            <div class="input-group-custom">
              <span class="input-icon">
                <i class="bi bi-lock"></i>
              </span>
              <input
                placeholder="Confirm your password"
                :type="showConfirmPassword ? 'text' : 'password'"
                v-model="confirmPassword"
                :class="['form-control form-control-custom', { 'is-invalid': errors.confirmPassword }]"
                required
                @blur="validateConfirmPassword"
              />
              <span class="input-icon-right" @click="toggleConfirmPassword">
                <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </span>
            </div>
            <small v-if="errors.confirmPassword" class="text-danger">{{ errors.confirmPassword }}</small>
          </div>

          <!-- Terms and Privacy -->
          <div class="text-center mb-4">
            <p class="terms-text">
              By signing up you agree to our
              <router-link to="/TermCondition" class="terms-link">Terms of Service</router-link>
              and
              <router-link to="/privacy" class="terms-link">Privacy Policy</router-link>
            </p>
          </div>

          <!-- Sign Up Button -->
          <button type="submit" class="btn btn-signin w-100 mb-4" :disabled="isLoading">
            <span class="btn-text">{{ isLoading ? 'Creating Account...' : 'Sign Up' }}</span>
            <i class="bi bi-arrow-right ms-2" v-if="!isLoading"></i>
            <span class="spinner-border spinner-border-sm ms-2" v-if="isLoading"></span>
          </button>

          <!-- Sign In Link -->
          <div class="text-center">
            <p class="signup-text">
              Already have an account?
              <router-link to="/signin" class="signup-link"> Sign In </router-link>
            </p>
          </div>

          <!-- Divider -->
          <div class="divider my-4">
            <span class="divider-text">Or continue with</span>
          </div>

          <!-- Social Login -->
          <div class="social-login d-flex gap-3">
            <button type="button" class="btn btn-social flex-fill" disabled>
              <i class="bi bi-google me-2"></i>
              Google
            </button>
            <button type="button" class="btn btn-social flex-fill" disabled>
              <i class="bi bi-facebook me-2"></i>
              Facebook
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAuthApi } from '@/composables/useAuthApi'

defineComponent({
  name: 'SignUp',
})

const router = useRouter()
const authStore = useAuthStore()
const authApi = useAuthApi()

const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const errors = ref<{
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}>({})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const validateName = () => {
  if (!name.value.trim()) {
    errors.value.name = 'Name is required'
    return false
  }
  if (name.value.trim().length < 2) {
    errors.value.name = 'Name must be at least 2 characters'
    return false
  }
  if (name.value.trim().length > 100) {
    errors.value.name = 'Name cannot exceed 100 characters'
    return false
  }
  delete errors.value.name
  return true
}

const validateEmail = () => {
  if (!email.value) {
    errors.value.email = 'Email is required'
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    errors.value.email = 'Please enter a valid email address'
    return false
  }
  delete errors.value.email
  return true
}

const validatePassword = () => {
  if (!password.value) {
    errors.value.password = 'Password is required'
    return false
  }
  if (password.value.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
    return false
  }
  delete errors.value.password
  return true
}

const validateConfirmPassword = () => {
  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Please confirm your password'
    return false
  }
  if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Passwords do not match'
    return false
  }
  delete errors.value.confirmPassword
  return true
}

const handleSignUp = async () => {
  // Clear previous messages
  errorMessage.value = ''
  successMessage.value = ''
  errors.value = {}

  // Validate all fields
  const isNameValid = validateName()
  const isEmailValid = validateEmail()
  const isPasswordValid = validatePassword()
  const isConfirmPasswordValid = validateConfirmPassword()

  if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
    errorMessage.value = 'Please fix the errors in the form'
    return
  }

  isLoading.value = true

  try {
    const response = await authApi.signup({
      name: name.value.trim(),
      email: email.value.trim().toLowerCase(),
      password: password.value,
      phone: phone.value.trim() || undefined,
    })

    if (response?.user) {
      // Update auth store
      await authStore.login({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role === 'admin' ? 'admin' : 'user',
        phone: response.user.phone,
        avatar: response.user.avatar,
      })

      successMessage.value = `Welcome, ${response.user.name}! Account created successfully.`

      // Redirect based on role
      setTimeout(() => {
        if (response.user.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/')
        }
      }, 1500)
    }
  } catch (error: unknown) {
    errorMessage.value = error instanceof Error ? error.message : authApi.error.value || 'Sign up failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  overflow: hidden;
}

/* Left Side - Image Section */
.login-image-section {
  flex: 0 0 50%;
  max-width: 50%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.login-image-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* Right Side - Form Section */
.login-form-section {
  flex: 0 0 50%;
  max-width: 50%;
  height: 100vh;
  padding: 2rem;
  background: white;
  overflow-y: auto;
}

.login-form-wrapper {
  width: 100%;
  max-width: 450px;
  padding: 2rem;
}

.login-title {
  font-size: 2rem;
  color: #1a1a1a;
  font-family: 'Quicksand', sans-serif;
}

.login-subtitle {
  color: #6c757d;
  font-size: 1rem;
  font-family: 'Quicksand', sans-serif;
}

/* Form Elements */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-family: 'Quicksand', sans-serif;
  display: block;
}

.input-group-custom {
  position: relative;
  display: flex;
  align-items: center;
}

.form-control-custom {
  width: 100%;
  height: 3.2rem;
  padding-left: 3rem;
  padding-right: 3rem;
  border: 2px solid #e0e0e0;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: 'Quicksand', sans-serif;
  outline: none;
}

.form-control-custom:focus {
  border-color: var(--main-color2, #007bff);
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.1);
  outline: none;
}

.form-control-custom.is-invalid {
  border-color: #dc3545;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: #6c757d;
  z-index: 10;
  pointer-events: none;
  font-size: 1rem;
}

.input-icon-right {
  position: absolute;
  right: 1rem;
  color: #6c757d;
  cursor: pointer;
  z-index: 10;
  transition: color 0.3s ease;
  font-size: 1rem;
  padding: 0.5rem;
}

.input-icon-right:hover {
  color: var(--main-color2, #007bff);
}

.input-icon-right:active {
  transform: scale(0.95);
}

/* Terms Text */
.terms-text {
  color: #6c757d;
  font-size: 0.85rem;
  margin: 0;
  font-family: 'Quicksand', sans-serif;
  line-height: 1.5;
}

.terms-link {
  color: var(--main-color2, #007bff);
  text-decoration: underline;
  transition: color 0.3s ease;
}

.terms-link:hover {
  color: #0056b3;
}

/* Sign Up Button */
.btn-signin {
  height: 3.5rem;
  background: linear-gradient(135deg, var(--main-color2, #007bff) 0%, #0056b3 100%);
  border: none;
  border-radius: 0.75rem;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Quicksand', sans-serif;
}

.btn-signin:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 123, 255, 0.3);
}

.btn-signin:active:not(:disabled) {
  transform: translateY(0);
}

.btn-signin:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-signin .btn-text {
  flex: 1;
  text-align: center;
}

/* Sign In Link */
.signup-text {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0;
  font-family: 'Quicksand', sans-serif;
}

.signup-link {
  color: var(--main-color2, #007bff);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.signup-link:hover {
  color: #0056b3;
  text-decoration: underline;
}

/* Divider */
.divider {
  position: relative;
  text-align: center;
  margin: 2rem 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e0e0e0;
}

.divider-text {
  position: relative;
  background: white;
  padding: 0 1rem;
  color: #6c757d;
  font-size: 0.85rem;
  font-family: 'Quicksand', sans-serif;
}

/* Social Login */
.social-login {
  display: flex;
  gap: 1rem;
}

.btn-social {
  height: 3rem;
  border: 2px solid #e0e0e0;
  border-radius: 0.75rem;
  background: white;
  color: #495057;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Quicksand', sans-serif;
}

.btn-social i {
  font-size: 1.2rem;
}

.btn-social:hover:not(:disabled) {
  border-color: var(--main-color2, #007bff);
  color: var(--main-color2, #007bff);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-social:active:not(:disabled) {
  transform: translateY(0);
}

.btn-social:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive Styles */
@media (max-width: 991.98px) {
  .login-form-section {
    flex: 1;
    max-width: 100%;
    height: auto;
    min-height: 100vh;
  }
}

@media (max-width: 575.98px) {
  .login-container {
    flex-direction: column;
  }

  .login-image-section {
    display: none !important;
  }

  .login-form-section {
    padding: 1.5rem;
    flex: 1;
    max-width: 100%;
  }

  .login-form-wrapper {
    padding: 1rem;
  }

  .login-title {
    font-size: 1.75rem;
  }

  .login-subtitle {
    font-size: 0.875rem;
  }

  .form-label {
    font-size: 0.85rem;
  }

  .form-control-custom {
    height: 2.8rem;
    font-size: 0.9rem;
  }

  .btn-signin {
    height: 3rem;
    font-size: 1rem;
  }

  .signup-text {
    font-size: 0.85rem;
  }

  .terms-text {
    font-size: 0.8rem;
  }

  .divider {
    margin: 1.5rem 0;
  }

  .social-login {
    flex-direction: column;
  }

  .btn-social {
    width: 100%;
  }
}
</style>
