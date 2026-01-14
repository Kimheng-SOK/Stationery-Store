<template>
  <div class="login-container d-flex min-vh-100">
    <!-- Left Side - Image -->
    <div class="login-image-section d-none d-lg-flex">
      <img
        src="@/assets/image/pfp.png"
        alt="Access Image"
      >
    </div>

    <!-- Right Side - Form -->
    <div class="login-form-section d-flex justify-content-center align-items-center">
      <div class="login-form-wrapper">
        <div class="text-center mb-5">
          <h1 class="login-title fw-bold mb-2">Welcome Back</h1>
          <p class="login-subtitle">Sign in to continue shopping</p>
        </div>

        <form @submit.prevent="handSignin" class="login-form">
          <!-- Email Input -->
          <div class="form-group mb-4">
            <label class="form-label">Email Address</label>
            <div class="input-group-custom">
              <span class="input-icon">
                <i class="fas fa-envelope"></i>
              </span>
              <input
                type="email"
                placeholder="Enter your email"
                v-model="email"
                class="form-control form-control-custom"
                required
              />
            </div>
          </div>

          <!-- Password Input -->
          <div class="form-group mb-3">
            <label class="form-label">Password</label>
            <div class="input-group-custom">
              <span class="input-icon">
                <i class="fas fa-lock"></i>
              </span>
              <input
                placeholder="Enter your password"
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                class="form-control form-control-custom"
                required
              />
              <span class="input-icon-right" @click="togglePassword">
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </span>
            </div>
          </div>

          <!-- Forgot Password -->
          <div class="text-end mb-4">
            <router-link to="/forgotpassword" class="forgot-password-link">
              Forgot Password?
            </router-link>
          </div>

          <!-- Sign In Button -->
          <button type="submit" class="btn btn-signin w-100 mb-4" :disabled="isLoading">
            <span class="btn-text">{{ isLoading ? 'Signing In...' : 'Sign In' }}</span>
            <i class="fas fa-arrow-right ms-2" v-if="!isLoading"></i>
            <span class="spinner-border spinner-border-sm ms-2" v-if="isLoading"></span>
          </button>

          <!-- Sign Up Link -->
          <div class="text-center">
            <p class="signup-text">
              Don't have an account?
              <router-link to="/signup" class="signup-link">
                Sign Up
              </router-link>
            </p>
          </div>

          <!-- Divider -->
          <div class="divider my-4">
            <span class="divider-text">Or continue with</span>
          </div>

          <!-- Social Login -->
          <div class="social-login d-flex gap-3">
            <button type="button" class="btn btn-social flex-fill">
              <i class="fab fa-google me-2"></i>
              Google
            </button>
            <button type="button" class="btn btn-social flex-fill">
              <i class="fab fa-facebook me-2"></i>
              Facebook
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authenticateUser } from '@/data/users'

export default {
  name: 'SignIn',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const email = ref('')
    const password = ref('')
    const showPassword = ref(false)
    const isLoading = ref(false)

    const togglePassword = () => {
      showPassword.value = !showPassword.value
    }

    const handSignin = async () => {
      if (!email.value || !password.value) {
        alert('Please fill in all fields')
        return
      }

      isLoading.value = true

      try {
        // Authenticate user with actual credentials
        const user = authenticateUser(email.value, password.value)

        if (!user) {
          alert('Invalid email or password')
          isLoading.value = false
          return
        }

        // Create user data for auth store
        const userData = {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
          password: user.password,
          createdAt: user.createdAt
        }

        // Login with auth store (token would come from backend API)
        const token = `jwt-token-${user.id}-${Date.now()}`
        authStore.login(token, userData, user.role)

        // Show success message
        alert(`Welcome back, ${user.fullName}!`)

        // Redirect based on role
        if (user.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/')
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        alert('Login failed. Please try again.')
      } finally {
        isLoading.value = false
      }
    }

    return {
      email,
      password,
      showPassword,
      isLoading,
      togglePassword,
      handSignin
    }
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
.form-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-family: 'Quicksand', sans-serif;
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

/* Forgot Password Link */
.forgot-password-link {
  color: var(--main-color2, #007bff);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.3s ease;
  font-family: 'Quicksand', sans-serif;
}

.forgot-password-link:hover {
  color: #0056b3;
  text-decoration: underline;
}

/* Sign In Button */
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

.btn-signin:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 123, 255, 0.3);
}

.btn-signin:active {
  transform: translateY(0);
}

.btn-signin .btn-text {
  flex: 1;
  text-align: center;
}

/* Sign Up Link */
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

.btn-social:hover {
  border-color: var(--main-color2, #007bff);
  color: var(--main-color2, #007bff);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-social:active {
  transform: translateY(0);
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
