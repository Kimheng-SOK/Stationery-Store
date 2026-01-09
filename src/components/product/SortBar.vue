<template>
  <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
    <div class="text-muted small">
      Showing {{ shownCount }} of {{ totalCount }} products
    </div>

    <div class="d-flex align-items-center gap-2">
      <span class="text-muted small">Sort by:</span>
      <select
        v-model="localSortBy"
        class="form-select form-select-sm"
        style="width: auto; min-width: 150px"
      >
        <option value="newest">Newest First</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating">Highest Rated</option>
        <option value="popular">Most Popular</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  sortBy: string
  shownCount: number
  totalCount: number
}>()

const emit = defineEmits<{
  (e: 'update:sortBy', value: string): void
}>()

const localSortBy = computed({
  get: () => props.sortBy,
  set: (value) => emit('update:sortBy', value),
})
</script>
