<template>
  <div class="card shadow-sm">
    <div class="card-body p-4">
      <h4 class="card-title mb-4">Write a Review</h4>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="form-label fw-semibold">Your Rating *</label>
          <div class="star-rating">
            <i v-for="star in 5" :key="star" class="bi fs-4 me-1"
               :class="star <= rating ? 'bi-star-fill text-warning' : 'bi-star'"
               @click="rating = star" style="cursor: pointer;"></i>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Review Title *</label>
          <input type="text" class="form-control" v-model="formData.title" 
                 placeholder="Summarize your experience" required>
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Review *</label>
          <textarea class="form-control" v-model="formData.text" rows="4" 
                    placeholder="Write your thoughts here..." required></textarea>
        </div>

        <button type="submit" class="btn btn-success px-4" :disabled="isSubmitting">
          {{ isSubmitting ? 'Posting...' : 'Submit Review' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: ['productId', 'user'], // Receiving user from parent
  data() {
    return {
      rating: 0,
      formData: { 
        title: '', 
        text: '' 
      },
      isSubmitting: false
    }
  },
  methods: {
    async handleSubmit() {
      if (this.rating === 0) return alert('Please select a rating');
      
      this.isSubmitting = true;
      
      const payload = {
        productId: this.productId,
        rating: this.rating,
        title: this.formData.title,
        text: this.formData.text,
        author: this.user?.name || 'Anonymous', // Auto-fill from Auth
        email: this.user?.email || ''
      };

      this.$emit('submit', payload);
      
      this.isSubmitting = false;
      this.rating = 0;
      this.formData = { title: '', text: '' };
    }
  }
}
</script>