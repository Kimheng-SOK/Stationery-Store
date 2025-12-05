<template>
  <div class="flex flex-col lg:flex-row w-full min-h-screen">

    <div class="w-full lg:w-1/2 flex justify-center items-center h-64 sm:h-80 lg:h-screen">
      <img
        src="../assets/image/pfp.png"
        alt="Access Image"
        class="w-full h-full object-cover"
      >
    </div>


    <div class="w-full lg:w-1/2 flex justify-center items-center p-6 sm:p-10 lg:p-16">
      <div class="text-center w-full sm:w-[85%] md:w-[75%] lg:w-[70%]">
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-main-black">Sign Up</h1>
        <h1 class="text-base sm:text-lg lg:text-xl text-(--main-color1) font-quicksand mt-2">Create your account to start shopping</h1>

        <form action="" class="pt-4 sm:pt-6 space-y-4 sm:space-y-5 lg:space-y-7 py-5">
          <input type="text" placeholder="Username" v-model="username" class="id border-[1.5px] border-(--main-color1) rounded-md h-12 sm:h-14 lg:h-15 w-full px-4 sm:px-6 lg:px-7 text-base sm:text-lg lg:text-xl text-(--main-color1) font-quicksand" required/>
          <input type="email" placeholder="Email" v-model="email" class="id border-[1.5px] border-(--main-color1) rounded-md h-12 sm:h-14 lg:h-15 w-full px-4 sm:px-6 lg:px-7 text-base sm:text-lg lg:text-xl text-(--main-color1) font-quicksand" required/>

          <div class="flex relative">
            <input placeholder="Password" :type="showPassword ? 'text' : 'password'" v-model="password" class="pw border-[1.5px] border-(--main-color1) rounded-md h-12 sm:h-14 lg:h-15 w-full px-4 sm:px-6 lg:px-7 text-base sm:text-lg lg:text-xl text-(--main-color1) font-quicksand" required/>
            <i class="fa absolute right-4 sm:right-6 lg:right-8 top-4 sm:top-[18px] lg:top-5 text-(--main-color1) cursor-pointer"  :class="showPassword ? 'fa-eye-slash' : 'fa-eye'" @click="togglePassword" aria-hidden="true"></i>
          </div>

          <div class="flex relative">
            <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword" placeholder="confirm Password"  class="confirmPw border-[1.5px] border-(--main-color1) rounded-md h-12 sm:h-14 lg:h-15 w-full px-4 sm:px-6 lg:px-7 text-base sm:text-lg lg:text-xl text-(--main-color1) font-quicksand" required/>
            <i class="fa absolute right-4 sm:right-6 lg:right-8 top-4 sm:top-[18px] lg:top-5 text-(--main-color1) cursor-pointer" :class="showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'" @click="toggleConfirmPassword"  aria-hidden="true"></i>
          </div>
        </form>

        <div class="py-2">
         <button @click="handleSignUp()" class="bg-(--main-color2) rounded-2xl h-12 sm:h-14 lg:h-15 w-full px-4 sm:px-6 lg:px-7 text-lg sm:text-xl lg:text-2xl text-white font-bold">Sign In</button>
        </div>

        <router-link to="/signin"><p class="text-sm sm:text-base lg:text-md font-quicksand text-(--main-color1) mt-2">Already have your account? <span class="text-(--main-color2) font-semibold hover:text-blue-800">Sign In</span></p></router-link>
        <p class="text-xs sm:text-sm lg:text-md font-quicksand text-(--main-color1) pt-2">By signing up you agree to our <span class="text-(--main-color1) underline">Terms of Service</span> and <br class="hidden sm:inline"> <span class="text-(--main-color1) underline">Privacy Policy</span></p>
        <hr class="w-full sm:w-70 mx-auto border-[1.2px] border-(--main-color1) mt-6 sm:mt-8">

         <div class="flex justify-center gap-4 mt-4 sm:mt-6">
          <div class="flex gap-3 sm:gap-4 lg:gap-6">
            <img :src="assets.google" alt="" class="w-15 h-15 border border-(--main-color1) p-3 rounded-xl cursor-pointer">
            <img :src="assets.facebook" alt="" class="w-15 h-15 border border-(--main-color1) p-3 rounded-xl cursor-pointer">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" >
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

<style>

</style>
