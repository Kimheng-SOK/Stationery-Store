<template>
  <NavBar />
  <Footer />
</template>
<script lang="ts">
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'
export default {
  name: 'ClientLayout',
  components: {
    NavBar,
    Footer,
  },
}
</script>
<style scoped></style>
