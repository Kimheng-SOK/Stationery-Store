<template>
  <div class="review-display">
    <div v-for="review in reviews" :key="review._id" class="card shadow-sm mb-3">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start">
          <div class="d-flex align-items-center mb-2">
            <img :src="`https://ui-avatars.com/api/?name=${review.author}&background=random`" 
                 class="rounded-circle me-2" width="40">
            <div>
              <h6 class="mb-0">{{ review.author }}</h6>
              <small class="text-muted">{{ formatDate(review.createdAt) }}</small>
            </div>
          </div>
          <div class="text-warning">
            <i v-for="n in 5" :key="n" class="bi" 
               :class="n <= review.rating ? 'bi-star-fill' : 'bi-star'"></i>
          </div>
        </div>
        
        <h6 class="mt-3 fw-bold text-dark">{{ review.title }}</h6>
        <p class="text-muted mt-1">{{ review.text }}</p>
      </div>
    </div>
    <div v-if="reviews.length === 0" class="text-center py-4 text-muted">
      No reviews yet for this product.
    </div>
  </div>
</template>

<script>
export default {
  props: ['reviews'],
  methods: {
    formatDate(date) {
      if (!date) return 'Recently';
      return new Date(date).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      });
    }
  }
}
</script>