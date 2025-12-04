<script lang="ts">
import Footer from './components/Footer.vue'
import NavBar from './components/NavBar.vue'
import AdminSideBar from './components/layout/AdminASide.vue'

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
  <router-view />
</template>
