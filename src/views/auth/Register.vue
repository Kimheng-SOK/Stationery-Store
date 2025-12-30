<template>
  <div class="d-flex flex-column flex-lg-row w-100 min-vh-100">

    <div class="w-100 d-flex justify-content-center align-items-center" style="height: 16rem; height: 20rem; height: 100vh;">
      <img
        src="../assets/image/pfp.png"
        alt="Access Image"
        class="w-100 h-100"
        style="object-fit: cover;"
      >
    </div>


    <div class="w-100 d-flex justify-content-center align-items-center p-3 ">
      <div class="text-center w-100" style="max-width: 85%;">
        <h1 class="fs-2 fs-sm-1 fw-bold text-dark">Sign Up</h1>
        <h1 class="fs-5 fs-sm-4 mt-2" style="color: var(--main-color1); font-family: 'Quicksand', sans-serif;">Create your account to start shopping</h1>

        <form action="text" class="pt-3 pt-sm-4 ">
          <div class="mb-3 mb-sm-4 mb-lg-5">
            <input
              type="text"
              placeholder="Username"
              v-model="username"
              class="form-control fs-5 fs-sm-4 px-3 px-sm-4 px-lg-5"
              style="border: 1.5px solid var(--main-color1); height: 3rem; color: var(--main-color1); font-family: 'Quicksand', sans-serif;"
              required
            />
          </div>

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

          <div class="position-relative mb-3 mb-sm-4 mb-lg-5">
            <input
              placeholder="Password"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              class="form-control fs-5 fs-sm-4 px-3 px-sm-4 px-lg-5"
              style="border: 1.5px solid var(--main-color1); height: 3rem; color: var(--main-color1); font-family: 'Quicksand', sans-serif;"
              required
            />
            <i
              class="fa position-absolute top-50 translate-middle-y end-0 me-3 me-sm-4 me-lg-5"
              style="color: var(--main-color1); cursor: pointer;"
              :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"
              @click="togglePassword"
              aria-hidden="true"
            ></i>
          </div>

          <div class="position-relative mb-3 mb-sm-4 mb-lg-5">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="confirmPassword"
              placeholder="Confirm Password"
              class="form-control fs-5 fs-sm-4 px-3 px-sm-4 px-lg-5"
              style="border: 1.5px solid var(--main-color1); height: 3rem; color: var(--main-color1); font-family: 'Quicksand', sans-serif;"
              required
            />
            <i
              class="fa position-absolute top-50 translate-middle-y end-0 me-3 me-sm-4 me-lg-5"
              style="color: var(--main-color1); cursor: pointer;"
              :class="showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'"
              @click="toggleConfirmPassword"
              aria-hidden="true"
            ></i>
          </div>
        </form>

        <div class="">
          <button
            @click="handleSignUp()"
            class="btn w-100 text-white fw-bold fs-4 fs-sm-3 px-3 px-sm-4 px-lg-5 rounded-3"
            style="background-color: var(--main-color2); height: 3.5rem;"
          >
            Sign Up
          </button>
        </div>

        <router-link to="/signin" class="text-decoration-none">
          <p class="small fs-sm-6 mt-2" style="color: var(--main-color1); font-family: 'Quicksand', sans-serif;">
            Already have your account?
            <span class="fw-semibold" style="color: var(--main-color2);">Sign In</span>
          </p>
        </router-link>

        <p class="small mt-2" style="color: var(--main-color1); font-family: 'Quicksand', sans-serif;">
          By signing up you agree to our
          <span class="text-decoration-underline" style="color: var(--main-color1);">Terms of Service</span>
          and
          <br class="d-none d-sm-inline">
          <span class="text-decoration-underline" style="color: var(--main-color1);">Privacy Policy</span>
        </p>

        <hr class="mx-auto my-4 " style="max-width: 70%; border: 1.2px solid var(--main-color1);">

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
    </div>
  </div>
</template>

<script lang="ts">
import { assets } from '../assets/assets'

export default {
  data() {
    return {
      assets: assets,
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
      this.showPassword = !this.showPassword;
    },

    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },

    handleSignUp() {

      if(!this.username || !this.email || !this.password || !this.confirmPassword){
        alert("Please Fill the Form")
        return
      }
      if(this.password !== this.confirmPassword){
        alert("The Password is not Matching")
         return
      }


      alert("Sign up Successfully!!!")
        this.$router.push('/signin')

    },

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
</style>
