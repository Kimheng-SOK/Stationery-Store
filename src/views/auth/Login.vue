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


    <div class="w-100 d-flex justify-content-center align-items-center p-3 p-sm-4 p-lg-5">
      <div class="text-center w-100 " style="max-width: 85%;">
        <h1 class="fs-2 fs-sm-1 fw-bold text-dark">Welcome Back</h1>
        <h1 class="fs-5 fs-sm-4 mt-2" style="color: var(--main-color1); font-family: 'Quicksand', sans-serif;">Create your account to start shopping</h1>

        <form>
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

          <div class="position-relative mb-2">
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

          <router-link to="/forgotpassword" class="text-decoration-none">
            <p class="small fs-sm-6 text-start mb-4" style="color: var(--main-color1); font-family: 'Quicksand', sans-serif;">
              Forget Password?
            </p>
          </router-link>
        </form>

        <div class="">
          <button
            @click="handSignin()"
            class="btn w-100 text-white fw-bold fs-4 fs-sm-3 px-3 px-sm-4 px-lg-5 rounded-3"
            style="background-color: var(--main-color2); height: 3.5rem;"
          >
            Sign In
          </button>
        </div>


        <router-link to="/signup" class="text-decoration-none">
          <p class="small fs-sm-6 mt-2" style="color: var(--main-color1); font-family: 'Quicksand', sans-serif;">
            Don't have account?
            <span class="fw-semibold" style="color: var(--main-color2);">Sign Up</span>
          </p>
        </router-link>

        <hr class="mx-auto my-4 my-sm-5" style="max-width: 70%; border: 1.2px solid var(--main-color1);">

        <div class="d-flex justify-content-center gap-3 gap-sm-4 gap-lg-5 mt-3 mt-sm-4">
          <img
            :src="assets.google"
            alt=""
            class="border rounded-3 p-2 p-sm-3"
            style="width: 3rem; height: 3rem; border-color: var(--main-color1) !important; cursor: pointer;"
          >
          <img
            :src="assets.facebook"
            alt=""
            class="border rounded-3 p-2 p-sm-3"
            style="width: 3rem; height: 3rem; border-color: var(--main-color1) !important; cursor: pointer;"
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
      message: '',
      email: '',
      password : '',
      showPassword : false
    }
  },

  methods: {

    togglePassword () {
      this.showPassword= !this.showPassword;
    },

    handSignin() {
      if (!this.email || !this.password) {
        alert("Fill the Form");
        return
      }

      if(this.email && this.password) {
        alert("Sign In Successfully!!!");
        this.$router.push('/signup')
      }
    }
  }

}
</script>

<style scoped>

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
