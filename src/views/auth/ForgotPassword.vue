<template>
  <div class="d-flex flex-column flex-lg-row w-100 min-vh-100">

    <!-- Left Side - Image -->
    <div class="w-100 d-flex justify-content-center align-items-center" style="height: 100vh;">
      <img
        src="../assets/image/pfp.png"
        alt="Access Image"
        class="w-100 h-100"
        style="object-fit: cover;"
      >
    </div>

    <!-- Right Side - Form -->
    <div class="w-100 d-flex justify-content-center align-items-center p-3">
      <div class="text-center w-100" style="max-width: 85%;">

        <!-- Step 1: Enter Email -->
        <div v-if="step === 1">
          <div class="text-center mb-4">
            <div class="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                 style="width: 80px; height: 80px; background-color: rgba(102, 126, 234, 0.1);">
              <i class="fa fa-lock fs-1" style="color: #667eea;"></i>
            </div>
          </div>

          <h1 class="fs-2 fs-sm-1 fw-bold text-dark">Forgot Password?</h1>
          <h1 class="fs-5 fs-sm-4 mt-2" style="color: var(--main-color1); font-family: 'Quicksand', sans-serif;">
            Enter your email and we'll send you a verification code
          </h1>

          <form @submit.prevent="sendVerificationCode" class="pt-3 pt-sm-4 py-3">
            <div class="mb-3 mb-sm-4 mb-lg-5">
              <input
                type="email"
                placeholder="Email"
                v-model="email"
                class="form-control fs-5 fs-sm-4 px-3 px-sm-4 px-lg-5"
                style="border: 1.5px solid var(--main-color1); height: 3rem; color: var(--main-color1); font-family: 'Quicksand', sans-serif;"
                required
              />
            </div>

            <button
              type="submit"
              class="btn w-100 text-white fw-bold fs-4 fs-sm-3 px-3 px-sm-4 px-lg-5 rounded-3 mb-3"
              style="background-color: var(--main-color2); height: 3.5rem;"
            >
              Send Verification Code
            </button>

            <router-link to="/signin" class="text-decoration-none">
              <button
                type="button"
                class="btn w-100 btn-outline-secondary fw-semibold fs-5 rounded-3"
                style="height: 3.5rem;"
              >
                <i class="fa fa-arrow-left me-2"></i>
                Back to Sign In
              </button>
            </router-link>
          </form>

          <hr class="mx-auto my-4 my-sm-5" style="max-width: 70%; border: 1.2px solid var(--main-color1);">

          <div class="d-flex justify-content-center gap-3 gap-sm-4 gap-lg-5 mt-3 mt-sm-4">
            <img
              :src="assets.google"
              alt=""
              class="border rounded-3 p-3"
              style="width: 3.75rem; height: 3.75rem; border-color: var(--main-color1) !important; cursor: pointer;"
            >
            <img
              :src="assets.facebook"
              alt=""
              class="border rounded-3 p-3"
              style="width: 3.75rem; height: 3.75rem; border-color: var(--main-color1) !important; cursor: pointer;"
            >
          </div>
        </div>

        <!-- Step 2: Enter Verification Code -->
        <div v-if="step === 2">
          <div class="text-center mb-4">
            <div class="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                 style="width: 80px; height: 80px; background-color: rgba(102, 126, 234, 0.1);">
              <i class="fa fa-envelope fs-1" style="color: #667eea;"></i>
            </div>
          </div>

          <h1 class="fs-2 fs-sm-1 fw-bold text-dark">Check Your Email</h1>
          <h1 class="fs-5 fs-sm-4 mt-2" style="color: var(--main-color1); font-family: 'Quicksand', sans-serif;">
            We sent a verification code to<br>
            <strong>{{ email }}</strong>
          </h1>

          <form @submit.prevent="verifyCode" class="pt-3 pt-sm-4 py-3">
            <div class="mb-3 mb-sm-4 mb-lg-5">
              <input
                type="text"
                placeholder="Enter 6-digit code"
                v-model="verificationCode"
                class="form-control fs-3 text-center px-3 px-sm-4 px-lg-5"
                style="border: 1.5px solid var(--main-color1); height: 3.5rem; color: var(--main-color1); font-family: 'Quicksand', sans-serif; letter-spacing: 0.5em;"
                maxlength="6"
                required
              />
            </div>

            <button
              type="submit"
              class="btn w-100 text-white fw-bold fs-4 fs-sm-3 px-3 px-sm-4 px-lg-5 rounded-3 mb-3"
              style="background-color: var(--main-color2); height: 3.5rem;"
            >
              Verify Code
            </button>

            <div class="text-center">
              <p class="text-muted small mb-2" style="font-family: 'Quicksand', sans-serif;">Didn't receive the code?</p>
              <button
                type="button"
                @click="resendCode"
                class="btn btn-link text-decoration-none fw-semibold p-0"
                style="color: var(--main-color2);"
                :disabled="resendTimer > 0"
              >
                {{ resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Step 3: Reset Password -->
        <div v-if="step === 3">
          <div class="text-center mb-4">
            <div class="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                 style="width: 80px; height: 80px; background-color: rgba(102, 126, 234, 0.1);">
              <i class="fa fa-key fs-1" style="color: #667eea;"></i>
            </div>
          </div>

          <h1 class="fs-2 fs-sm-1 fw-bold text-dark">Set New Password</h1>
          <h1 class="fs-5 fs-sm-4 mt-2" style="color: var(--main-color1); font-family: 'Quicksand', sans-serif;">
            Your new password must be different from previously used passwords
          </h1>

          <form @submit.prevent="resetPassword" class="pt-3 pt-sm-4 py-3">
            <div class="position-relative mb-3 mb-sm-4 mb-lg-5">
              <input
                :type="showPassword ? 'text' : 'password'"
                placeholder="New Password"
                v-model="newPassword"
                class="form-control fs-5 fs-sm-4 px-3 px-sm-4 px-lg-5"
                style="border: 1.5px solid var(--main-color1); height: 3rem; color: var(--main-color1); font-family: 'Quicksand', sans-serif;"
                required
              />
              <i
                class="fa position-absolute top-50 translate-middle-y end-0 me-3 me-sm-4 me-lg-5"
                style="color: var(--main-color1); cursor: pointer;"
                :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"
                @click="showPassword = !showPassword"
                aria-hidden="true"
              ></i>
            </div>

            <div class="position-relative mb-3 mb-sm-4 mb-lg-5">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Confirm Password"
                v-model="confirmPassword"
                class="form-control fs-5 fs-sm-4 px-3 px-sm-4 px-lg-5"
                style="border: 1.5px solid var(--main-color1); height: 3rem; color: var(--main-color1); font-family: 'Quicksand', sans-serif;"
                required
              />
              <i
                class="fa position-absolute top-50 translate-middle-y end-0 me-3 me-sm-4 me-lg-5"
                style="color: var(--main-color1); cursor: pointer;"
                :class="showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'"
                @click="showConfirmPassword = !showConfirmPassword"
                aria-hidden="true"
              ></i>
            </div>

            <!-- Password Requirements -->
            <div class="mb-4 p-3 rounded-3 text-start" style="background-color: #f8f9fa;">
              <p class="small fw-semibold mb-2" style="font-family: 'Quicksand', sans-serif;">Password must contain:</p>
              <ul class="small mb-0 ps-3" style="font-family: 'Quicksand', sans-serif;">
                <li :class="newPassword.length >= 8 ? 'text-success' : 'text-muted'">At least 8 characters</li>
                <li :class="/[A-Z]/.test(newPassword) ? 'text-success' : 'text-muted'">One uppercase letter</li>
                <li :class="/[a-z]/.test(newPassword) ? 'text-success' : 'text-muted'">One lowercase letter</li>
                <li :class="/[0-9]/.test(newPassword) ? 'text-success' : 'text-muted'">One number</li>
              </ul>
            </div>

            <button
              type="submit"
              class="btn w-100 text-white fw-bold fs-4 fs-sm-3 px-3 px-sm-4 px-lg-5 rounded-3"
              style="background-color: var(--main-color2); height: 3.5rem;"
            >
              Reset Password
            </button>
          </form>
        </div>

        <!-- Step 4: Success -->
        <div v-if="step === 4">
          <div class="text-center mb-4">
            <div class="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                 style="width: 80px; height: 80px; background-color: rgba(40, 167, 69, 0.1);">
              <i class="fa fa-check fs-1 text-success"></i>
            </div>
          </div>

          <h1 class="fs-2 fs-sm-1 fw-bold text-dark">Password Reset!</h1>
          <h1 class="fs-5 fs-sm-4 mt-2" style="color: var(--main-color1); font-family: 'Quicksand', sans-serif;">
            Your password has been successfully reset.<br>
            You can now sign in with your new password
          </h1>

          <div class="py-3">
            <router-link to="/signin" class="text-decoration-none">
              <button
                type="button"
                class="btn w-100 text-white fw-bold fs-4 fs-sm-3 px-3 px-sm-4 px-lg-5 rounded-3"
                style="background-color: var(--main-color2); height: 3.5rem;"
              >
                Continue to Sign In
              </button>
            </router-link>
          </div>
        </div>

        <!-- Footer Text -->
        <p class="small mt-4" style="color: var(--main-color1); font-family: 'Quicksand', sans-serif;">
          Don't have an account?
          <router-link to="/signup" class="text-decoration-none">
            <span class="fw-semibold" style="color: var(--main-color2);">Sign Up</span>
          </router-link>
        </p>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { assets } from '../assets/assets'

export default {
  data() {
    return {
      assets: assets,
      step: 1,
      email: '',
      verificationCode: '',
      newPassword: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      resendTimer: 0,
      correctCode: '123456' // In real app, this comes from backend
    }
  },

  methods: {
    sendVerificationCode() {
      if(!this.email){
        alert("Please enter your email")
        return
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if(!emailPattern.test(this.email)){
        alert("Please enter a valid email address")
        return
      }

      // Simulate sending code (in real app, call API here)
      alert(`Verification code sent to ${this.email}`)
      this.step = 2
      this.startResendTimer()
    },

    verifyCode() {
      if(!this.verificationCode){
        alert("Please enter the verification code")
        return
      }

      if(this.verificationCode.length !== 6){
        alert("Verification code must be 6 digits")
        return
      }

      // In real app, verify with backend
      if(this.verificationCode === this.correctCode){
        this.step = 3
      } else {
        alert("Invalid verification code. Please try again.")
      }
    },

    resetPassword() {
      if(!this.newPassword || !this.confirmPassword){
        alert("Please fill in both password fields")
        return
      }

      if(this.newPassword.length < 8){
        alert("Password must be at least 8 characters long")
        return
      }

      if(this.newPassword !== this.confirmPassword){
        alert("Passwords do not match")
        return
      }

      // Password strength validation
      if(!/[A-Z]/.test(this.newPassword) ||
         !/[a-z]/.test(this.newPassword) ||
         !/[0-9]/.test(this.newPassword)){
        alert("Password must contain uppercase, lowercase, and number")
        return
      }

      // In real app, send new password to backend
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
        if(this.resendTimer <= 0){
          clearInterval(interval)
        }
      }, 1000)
    }
  }
}
</script>

<style scoped>
/* Additional responsive adjustments if needed */
@media (min-width: 576px) {
  .fs-sm-1 { font-size: 2.5rem !important; }
  .fs-sm-3 { font-size: 1.75rem !important; }
  .fs-sm-4 { font-size: 1.25rem !important; }
  .fs-sm-6 { font-size: 1rem !important; }
}

@media (min-width: 992px) {
  .p-lg-5 { padding: 4rem !important; }
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: var(--main-color2);
  box-shadow: 0 0 0 0.25rem rgba(20, 27, 62, 0.25);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
