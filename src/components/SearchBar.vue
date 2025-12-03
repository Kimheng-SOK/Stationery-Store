<template>
  <div class="input-group search-container bg-white rounded shadow-sm">
    <span class="input-group-text bg-white border-0">
      <!-- Replaced the image with Bootstrap Icon -->
      <i class="bi bi-search search-icon"></i>
    </span>
    <input 
      type="text" 
      class="form-control border-0 search-input"
      placeholder="Search products..."
      aria-label="Search products"
    />
  </div>
</template>

<script>
export default {
  name: 'SearchBar'
}
</script>

<style scoped>
.search-container {
  max-width: 380px;
  min-width: 300px;
  width: 100%;
  flex: 1;
}

.input-group-text {
  padding: 10px 8px 10px 16px;
}

.search-icon {
  font-size: 18px; 
  opacity: 0.5;
}

.search-input {
  padding: 10px 16px 10px 4px;
  font-size: 14px;
  color: #1f2937;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-input:focus {
  box-shadow: none;
}

/* Make sure it works well in the navbar */
@media (max-width: 1024px) {
  .search-container {
    max-width: 100%;
    min-width: 250px;
  }
}
</style>
