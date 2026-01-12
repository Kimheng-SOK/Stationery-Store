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

        <!-- Step 1: Enter Email -->
        <div v-if="step === 1">
          <div class="text-center mb-5">
            <div class="icon-circle mb-3">
              <i class="fas fa-lock"></i>
            </div>
            <h1 class="login-title fw-bold mb-2">Forgot Password?</h1>
            <p class="login-subtitle">Enter your email and we'll send you a verification code</p>
          </div>

          <form @submit.prevent="sendVerificationCode" class="login-form">
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

            <button type="submit" class="btn btn-signin w-100 mb-3">
              <span class="btn-text">Send Verification Code</span>
              <i class="fas fa-arrow-right ms-2"></i>
            </button>

            <router-link to="/signin" class="text-decoration-none">
              <button type="button" class="btn btn-back w-100">
                <i class="fas fa-arrow-left me-2"></i>
                Back to Sign In
              </button>
            </router-link>
          </form>

          <div class="divider my-4">
            <span class="divider-text">Or continue with</span>
          </div>

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
        </div>

        <!-- Step 2: Enter Verification Code -->
        <div v-if="step === 2">
          <div class="text-center mb-5">
            <div class="icon-circle mb-3">
              <i class="fas fa-envelope"></i>
            </div>
            <h1 class="login-title fw-bold mb-2">Check Your Email</h1>
            <p class="login-subtitle">
              We sent a verification code to<br>
              <strong>{{ email }}</strong>
            </p>
          </div>

          <form @submit.prevent="verifyCode" class="login-form">
            <div class="form-group mb-4">
              <label class="form-label">Verification Code</label>
              <input
                type="text"
                placeholder="Enter 6-digit code"
                v-model="verificationCode"
                class="form-control form-control-code"
                maxlength="6"
                required
              />
            </div>

            <button type="submit" class="btn btn-signin w-100 mb-4">
              <span class="btn-text">Verify Code</span>
              <i class="fas fa-arrow-right ms-2"></i>
            </button>

            <div class="text-center">
              <p class="resend-text mb-2">Didn't receive the code?</p>
              <button
                type="button"
                @click="resendCode"
                class="btn-resend"
                :disabled="resendTimer > 0"
              >
                {{ resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Step 3: Reset Password -->
        <div v-if="step === 3">
          <div class="text-center mb-5">
            <div class="icon-circle mb-3">
              <i class="fas fa-key"></i>
            </div>
            <h1 class="login-title fw-bold mb-2">Set New Password</h1>
            <p class="login-subtitle">Your new password must be different from previously used passwords</p>
          </div>

          <form @submit.prevent="resetPassword" class="login-form">
            <div class="form-group mb-4">
              <label class="form-label">New Password</label>
              <div class="input-group-custom">
                <span class="input-icon">
                  <i class="fas fa-lock"></i>
                </span>
                <input
                  placeholder="Enter new password"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="newPassword"
                  class="form-control form-control-custom"
                  required
                />
                <span class="input-icon-right" @click="showPassword = !showPassword">
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </span>
              </div>
            </div>

            <div class="form-group mb-4">
              <label class="form-label">Confirm Password</label>
              <div class="input-group-custom">
                <span class="input-icon">
                  <i class="fas fa-lock"></i>
                </span>
                <input
                  placeholder="Confirm new password"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  v-model="confirmPassword"
                  class="form-control form-control-custom"
                  required
                />
                <span class="input-icon-right" @click="showConfirmPassword = !showConfirmPassword">
                  <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </span>
              </div>
            </div>

            <div class="password-requirements mb-4">
              <p class="requirements-title">Password must contain:</p>
              <ul class="requirements-list">
                <li :class="newPassword.length >= 8 ? 'valid' : ''">
                  <i :class="newPassword.length >= 8 ? 'fas fa-check-circle' : 'far fa-circle'"></i>
                  At least 8 characters
                </li>
                <li :class="/[A-Z]/.test(newPassword) ? 'valid' : ''">
                  <i :class="/[A-Z]/.test(newPassword) ? 'fas fa-check-circle' : 'far fa-circle'"></i>
                  One uppercase letter
                </li>
                <li :class="/[a-z]/.test(newPassword) ? 'valid' : ''">
                  <i :class="/[a-z]/.test(newPassword) ? 'fas fa-check-circle' : 'far fa-circle'"></i>
                  One lowercase letter
                </li>
                <li :class="/[0-9]/.test(newPassword) ? 'valid' : ''">
                  <i :class="/[0-9]/.test(newPassword) ? 'fas fa-check-circle' : 'far fa-circle'"></i>
                  One number
                </li>
              </ul>
            </div>

            <button type="submit" class="btn btn-signin w-100">
              <span class="btn-text">Reset Password</span>
              <i class="fas fa-arrow-right ms-2"></i>
            </button>
          </form>
        </div>

        <!-- Step 4: Success -->
        <div v-if="step === 4">
          <div class="text-center mb-5">
            <div class="icon-circle success mb-3">
              <i class="fas fa-check"></i>
            </div>
            <h1 class="login-title fw-bold mb-2">Password Reset!</h1>
            <p class="login-subtitle">
              Your password has been successfully reset.<br>
              You can now sign in with your new password
            </p>
          </div>

          <div class="login-form">
            <router-link to="/signin" class="text-decoration-none">
              <button type="button" class="btn btn-signin w-100">
                <span class="btn-text">Continue to Sign In</span>
                <i class="fas fa-arrow-right ms-2"></i>
              </button>
            </router-link>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center mt-4">
          <p class="signup-text">
            Don't have an account?
            <router-link to="/signup" class="signup-link">
              Sign Up
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ForgotPassword',
  data() {
    return {
      step: 1,
      email: '',
      verificationCode: '',
      newPassword: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      resendTimer: 0,
      correctCode: '123456'
    }
  },

  methods: {
    sendVerificationCode() {
      if (!this.email) {
        alert("Please enter your email")
        return
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailPattern.test(this.email)) {
        alert("Please enter a valid email address")
        return
      }

      alert(`Verification code sent to ${this.email}`)
      this.step = 2
      this.startResendTimer()
    },

    verifyCode() {
      if (!this.verificationCode) {
        alert("Please enter the verification code")
        return
      }

      if (this.verificationCode.length !== 6) {
        alert("Verification code must be 6 digits")
        return
      }

      if (this.verificationCode === this.correctCode) {
        this.step = 3
      } else {
        alert("Invalid verification code. Please try again.")
      }
    },

    resetPassword() {
      if (!this.newPassword || !this.confirmPassword) {
        alert("Please fill in both password fields")
        return
      }

      if (this.newPassword.length < 8) {
        alert("Password must be at least 8 characters long")
        return
      }

      if (this.newPassword !== this.confirmPassword) {
        alert("Passwords do not match")
        return
      }

      if (!/[A-Z]/.test(this.newPassword) ||
          !/[a-z]/.test(this.newPassword) ||
          !/[0-9]/.test(this.newPassword)) {
        alert("Password must contain uppercase, lowercase, and number")
        return
      }

      this.step = 4
    },

    resendCode() {
      alert(`New verification code sent to ${this.email}`)
      this.startResendTimer()
    },

    startResendTimer() {
      this.resendTimer = 60
      const interval = setInterval(() => {
        this.resendTimer--
        if (this.resendTimer <= 0) {
          clearInterval(interval)
        }
      }, 1000)
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

/* Icon Circle */
.icon-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(0, 123, 255, 0.1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.icon-circle i {
  font-size: 2rem;
  color: var(--main-color2, #007bff);
}

.icon-circle.success {
  background: rgba(40, 167, 69, 0.1);
}

.icon-circle.success i {
  color: #28a745;
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
  line-height: 1.5;
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

.form-control-code {
  width: 100%;
  height: 3.5rem;
  padding: 0 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 0.75rem;
  font-size: 1.2rem;
  text-align: center;
  letter-spacing: 0.5em;
  transition: all 0.3s ease;
  font-family: 'Quicksand', sans-serif;
  outline: none;
}

.form-control-custom:focus,
.form-control-code:focus {
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

/* Password Requirements */
.password-requirements {
  background: #f8f9fa;
  border-radius: 0.75rem;
  padding: 1rem;
}

.requirements-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  font-family: 'Quicksand', sans-serif;
}

.requirements-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.85rem;
  font-family: 'Quicksand', sans-serif;
}

.requirements-list li {
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.requirements-list li.valid {
  color: #28a745;
}

.requirements-list li i {
  margin-right: 0.5rem;
  font-size: 0.75rem;
}

/* Buttons */
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

.btn-back {
  height: 3rem;
  border: 2px solid #e0e0e0;
  border-radius: 0.75rem;
  background: white;
  color: #495057;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  font-family: 'Quicksand', sans-serif;
}

.btn-back:hover {
  border-color: #6c757d;
  color: #6c757d;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Resend Code */
.resend-text {
  color: #6c757d;
  font-size: 0.9rem;
  font-family: 'Quicksand', sans-serif;
}

.btn-resend {
  background: none;
  border: none;
  color: var(--main-color2, #007bff);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
  font-family: 'Quicksand', sans-serif;
  transition: color 0.3s ease;
}

.btn-resend:hover:not(:disabled) {
  color: #0056b3;
  text-decoration: underline;
}

.btn-resend:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

  .icon-circle {
    width: 60px;
    height: 60px;
  }

  .icon-circle i {
    font-size: 1.5rem;
  }

  .form-label {
    font-size: 0.85rem;
  }

  .form-control-custom {
    height: 2.8rem;
    font-size: 0.9rem;
  }

  .form-control-code {
    height: 3rem;
    font-size: 1.25rem;
  }

  .btn-signin {
    height: 3rem;
    font-size: 1rem;
  }

  .btn-back {
    height: 2.5rem;
    font-size: 0.9rem;
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
