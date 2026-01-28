<template>
  <div class="filter-sidebar">
    <h5 class="mb-3">Filters</h5>

    <!-- Category Filter -->
    <div class="filter-section mb-4">
      <h6 class="filter-title">All Categories</h6>
      <select :value="selectedCategory" @change="$emit('update:selectedCategory', ($event.target as HTMLSelectElement).value)" class="form-select form-select-sm">
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>

    <!-- Price Filter -->
    <div class="filter-section mb-4">
      <h6 class="filter-title">Price</h6>
      <div class="price-inputs">
        <input
          :value="priceRange.min"
          @input="$emit('update:priceRange', { ...priceRange, min: Number(($event.target as HTMLInputElement).value) })"
          type="number"
          class="form-control form-control-sm mb-2"
          placeholder="Min"
        >
        <input
          :value="priceRange.max"
          @input="$emit('update:priceRange', { ...priceRange, max: Number(($event.target as HTMLInputElement).value) })"
          type="number"
          class="form-control form-control-sm"
          placeholder="Max"
        >
      </div>
    </div>

    <!-- Brand Filter -->
    <div class="filter-section mb-4">
      <h6 class="filter-title">Brand</h6>
      <select :value="selectedBrand" @change="$emit('update:selectedBrand', ($event.target as HTMLSelectElement).value)" class="form-select form-select-sm">
        <option value="">All Brands</option>
        <option v-for="brand in brands" :key="brand" :value="brand">
          {{ brand }}
        </option>
      </select>
    </div>

    <!-- Rating Filter -->
    <div class="filter-section mb-4">
      <h6 class="filter-title">Rating</h6>
      <div class="form-check" v-for="rating in [5, 4, 3, 2, 1]" :key="rating">
        <input
          class="form-check-input"
          type="radio"
          :id="`rating-${rating}`"
          :value="rating"
          :checked="selectedRating === rating"
          @change="$emit('update:selectedRating', rating)"
          name="rating-filter"
        >
        <label class="form-check-label" :for="`rating-${rating}`">
          <span class="stars">{{ '★'.repeat(rating) }}{{ '☆'.repeat(5 - rating) }}</span>
        </label>
      </div>
    </div>

    <!-- Availability Filter (optional) -->
    <div v-if="showAvailability" class="filter-section mb-4">
      <h6 class="filter-title">Availability</h6>
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          id="inStock"
          :checked="showInStockOnly"
          @change="$emit('update:showInStockOnly', ($event.target as HTMLInputElement).checked)"
        />
        <label class="form-check-label" for="inStock"> In Stock Only </label>
      </div>
    </div>

    <!-- Clear Filters -->
    <button @click="$emit('clearFilters')" class="btn btn-outline-secondary btn-sm w-100">
      Clear Filters
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  selectedCategory: string;
  selectedBrand: string;
  selectedRating: number;
  priceRange: { min: number; max: number };
  categories: string[];
  brands: string[];
  showAvailability?: boolean;
  showInStockOnly?: boolean;
}>();

defineEmits<{
  'update:selectedCategory': [value: string];
  'update:selectedBrand': [value: string];
  'update:selectedRating': [value: number];
  'update:priceRange': [value: { min: number; max: number }];
  'update:showInStockOnly': [value: boolean];
  'clearFilters': [];
}>();
</script>

<style scoped>
.filter-sidebar {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}

.filter-title {
  font-weight: 600;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  color: #495057;
}

.filter-section {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 1rem;
}

.filter-section:last-of-type {
  border-bottom: none;
}

.price-inputs input {
  font-size: 0.875rem;
}

.stars {
  color: #ffc107;
  font-size: 0.85rem;
}

.form-check-label {
  font-size: 0.875rem;
  cursor: pointer;
}

@media (max-width: 768px) {
  .filter-sidebar {
    position: static;
    margin-bottom: 2rem;
  }
}
</style>
