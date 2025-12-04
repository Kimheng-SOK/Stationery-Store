<script lang="ts">
import Footer from './components/Footer.vue'
import NavBar from './components/NavBar.vue'
import AdminSideBar from './components/layout/AdminSideBar.vue'
import TermCondition from './views/TermCondition.vue'

export default {
  name: 'App',
  components: {
    NavBar,
    Footer,
    AdminSideBar,
    TermCondition,
  },
}
</script>

<template>
  <router-view />
  <TermCondition />
</template>
