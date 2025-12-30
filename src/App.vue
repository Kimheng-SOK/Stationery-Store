<script lang="ts">
import Footer from './components/Footer.vue'
import NavBar from './components/NavBar.vue'
import AdminSideBar from './components/layout/AdminASide.vue'
import ProductDetails from './components/product/ProductDetails.vue' // Correct path

export default {
  name: 'App',
  components: {
    NavBar,
    Footer,
    AdminSideBar,
    ProductDetails, // Add to components
  },
}
</script>

<template>
  <ProductDetails/>
  <router-view />
</template>
