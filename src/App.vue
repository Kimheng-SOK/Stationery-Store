<script lang="ts">
import Footer from './components/Footer.vue'
import NavBar from './components/NavBar.vue'
import AdminSideBar from './components/layout/AdminASide.vue'
import ProductDetails from './components/product/ProductDetails.vue';
export default {
  name: 'App',
  components: {
    NavBar,
    Footer,
    AdminSideBar,
  },
}
</script>

<template>
  <ProductDetails/>
  <router-view />
</template>
