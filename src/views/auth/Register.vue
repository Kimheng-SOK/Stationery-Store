<template>
  <div class="login-bg d-flex align-items-center justify-content-center min-vh-100">
    <div class="card shadow-lg rounded-4 overflow-hidden w-100" style="max-width: 800px">
      <div class="row g-0 align-items-stretch">
        <div class="col-lg-6 d-flex align-items-center justify-content-center bg-light">
          <img
            src="../../assets/image/pfp.png"
            alt="Access Image"
            class="img-fluid w-100 h-100 object-fit-cover"
            style="object-fit: cover"
          />
        </div>
        <div class="col-12 col-lg-6 d-flex align-items-center justify-content-center p-4 p-md-5">
          <div class="w-100" style="max-width: 340px">
            <div class="text-center mb-4">
              <h1 class="fw-bold text-dark mb-1" style="font-size: 2.2rem">Sign Up</h1>
              <p class="text-secondary mb-0">Create your account to start shopping</p>
            </div>
            <form class="mb-3">
              <div class="mb-3">
                <input
                  type="text"
                  placeholder="Username"
                  v-model="username"
                  class="form-control form-control-lg rounded-3 border-2 border-secondary"
                  required
                />
              </div>
              <div class="mb-3">
                <input
                  type="email"
                  placeholder="Email"
                  v-model="email"
                  class="form-control form-control-lg rounded-3 border-2 border-secondary"
                  required
                />
              </div>
              <div class="mb-3 position-relative">
                <input
                  placeholder="Password"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  class="form-control form-control-lg rounded-3 border-2 border-secondary"
                  required
                />
                <i
                  class="bi position-absolute end-0 top-50 translate-middle-y me-3 text-secondary cursor-pointer"
                  :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"
                  @click="togglePassword"
                  aria-hidden="true"
                  style="right: 16px; font-size: 1.3rem"
                ></i>
              </div>
              <div class="mb-3 position-relative">
                <input
                  :type="showConfirmPassword ? 'text' : 'password'"
                  v-model="confirmPassword"
                  placeholder="Confirm Password"
                  class="form-control form-control-lg rounded-3 border-2 border-secondary"
                  required
                />
                <i
                  class="bi position-absolute end-0 top-50 translate-middle-y me-3 text-secondary cursor-pointer"
                  :class="showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'"
                  @click="toggleConfirmPassword"
                  aria-hidden="true"
                  style="right: 16px; font-size: 1.3rem"
                ></i>
              </div>
            </form>
            <button
              @click="handleSignUp()"
              class="btn btn-primary w-100 py-3 fw-bold fs-5 rounded-3 mb-3"
            >
              Sign Up
            </button>
            <router-link to="/signin" class="d-block text-center mb-2 text-secondary">
              <small>
                Already have your account?
                <span class="text-primary fw-semibold text-decoration-underline">Sign In</span>
              </small>
            </router-link>
            <p class="text-xs text-secondary text-center mb-2">
              By signing up you agree to our
              <span class="text-primary text-decoration-underline">
                <router-link to="/terms">Terms of Service</router-link>
              </span>
              and
              <span class="text-primary text-decoration-underline">
                <router-link to="/privacy">Privacy Policy</router-link>
              </span>
            </p>
            <hr class="w-100 mx-auto border border-secondary mb-3" />
            <div class="d-flex justify-content-center gap-3 mb-2">
              <button
                class="btn border-0 shadow-sm rounded-circle d-flex align-items-center justify-content-center bg-white social-btn"
                style="width: 48px; height: 48px"
                aria-label="Sign up with Google"
              >
                <i class="bi bi-google fs-4 text-danger"></i>
              </button>
              <button
                class="btn border-0 shadow-sm rounded-circle d-flex align-items-center justify-content-center bg-white social-btn"
                style="width: 48px; height: 48px"
                aria-label="Sign up with Facebook"
              >
                <i class="bi bi-facebook fs-4 text-primary"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'SignUp',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
    }
  },

  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword
    },

    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword
    },

    handleSignUp() {
      if (!this.username || !this.email || !this.password || !this.confirmPassword) {
        alert('Please Fill the Form')
        return
      }
      if (this.password !== this.confirmPassword) {
        alert('The Password is not Matching')
        return
      }

      alert('Sign up Successfully!!!')
      this.$router.push('/signin')
    },
  },
}
</script>

<style>
.login-bg {
  background: linear-gradient(120deg, #e0e7ff 0%, #f8fafc 100%);
}
.social-btn:hover {
  background: #f1f5f9 !important;
  box-shadow: 0 2px 8px rgba(30, 41, 59, 0.1);
}
body {
  font-family: 'Inter', sans-serif;
}
.font-quicksand {
  font-family: 'Quicksand', sans-serif;
}
</style>
