import { ref, computed, watch, isRef, unref } from 'vue'

export interface UsePaginationOptions {
  itemsPerPage?: number
}

export function usePagination<T>(items: any, options: UsePaginationOptions = {}) {
  const { itemsPerPage = 10 } = options
  const currentPage = ref(1)

  // Get the actual array (handle both ref/computed and plain arrays)
  const getItems = () => unref(items)

  // Watch for changes in items length and reset page if needed
  watch(
    () => getItems().length,
    () => {
      // Reset to page 1 when filter changes
      if (currentPage.value > 1) {
        currentPage.value = 1
      }
    }
  )

  const totalPages = computed(() => {
    const itemsArray = getItems()
    return Math.ceil(itemsArray.length / itemsPerPage)
  })

  const paginatedItems = computed(() => {
    const itemsArray = getItems()
    const start = (currentPage.value - 1) * itemsPerPage
    return itemsArray.slice(start, start + itemsPerPage)
  })

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  const previousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  const goToPage = (page: number) => {
    const pageNum = Math.max(1, Math.min(page, totalPages.value))
    currentPage.value = pageNum
  }

  const reset = () => {
    currentPage.value = 1
  }

  return {
    currentPage,
    totalPages,
    paginatedItems,
    nextPage,
    previousPage,
    goToPage,
    reset,
  }
}
