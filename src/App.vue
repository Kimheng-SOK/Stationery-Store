<script lang="ts">
import EmptyProduct from './components/product/EmptyProduct.vue';


export default {
  name: 'App',
  components: {
    EmptyProduct, 
  },
}
</script>

<template>
  <EmptyProduct/>
  <router-view />
</template>
