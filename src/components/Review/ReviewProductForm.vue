<template>
  <div class="review-form-container">
    <div class="card shadow-sm border-0">
      <div class="card-body p-4">
        <h4 class="card-title mb-4 fw-bold">Write a Review</h4>
        
        <form @submit.prevent="submitReview">
          <div class="mb-4">
            <label class="form-label fw-semibold">Your Rating *</label>
            <div class="star-rating">
              <i 
                v-for="star in 5" :key="star"
                class="bi fs-3 me-1"
                :class="star <= (hoverRating || rating) ? 'bi-star-fill text-warning' : 'bi-star text-muted'"
                @click="rating = star"
                @mouseover="hoverRating = star"
                @mouseleave="hoverRating = 0"
                style="cursor: pointer;"
              ></i>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label fw-semibold">Name</label>
              <input type="text" class="form-control bg-light" v-model="formData.author" readonly>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label fw-semibold">Email</label>
              <input type="text" class="form-control bg-light" v-model="formData.email" readonly>
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
                      placeholder="Write your thoughts here (min 50 chars)..." required></textarea>
            <small :class="formData.text.length < 50 ? 'text-danger' : 'text-success'">
              {{ formData.text.length }}/50 characters
            </small>
          </div>

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-success px-4 fw-bold" 
                    :disabled="isSubmitting || formData.text.length < 50">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              Post Review
            </button>
            <button type="button" class="btn btn-light px-4" @click="resetForm">Clear</button>
          </div>
        </form>

        <div v-if="showSuccess" class="alert alert-success mt-3 border-0">
          Review posted successfully!
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReviewProductForm',
  props: {
    productId: { type: String, required: true },
    user: { type: Object, required: true }
  },
  data() {
    return {
      rating: 0,
      hoverRating: 0,
      formData: {
        author: '',
        email: '',
        title: '',
        text: ''
      },
      isSubmitting: false,
      showSuccess: false
    }
  },
  watch: {
    user: {
      immediate: true,
      handler(newUser) {
        if (newUser) {
          this.formData.author = newUser.name;
          this.formData.email = newUser.email;
        }
      }
    }
  },
  methods: {
    async submitReview() {
      if (this.rating === 0) return alert('Please select a rating');
      this.isSubmitting = true;

      const payload = {
        productId: this.productId,
        rating: this.rating,
        author: this.formData.author,
        email: this.formData.email,
        title: this.formData.title,
        text: this.formData.text
      };

      this.$emit('submit', payload);
      this.showSuccess = true;
      setTimeout(() => { this.showSuccess = false; this.resetForm(); }, 2000);
      this.isSubmitting = false;
    },
    resetForm() {
      this.rating = 0;
      this.formData.title = '';
      this.formData.text = '';
    }
  }
}
</script>

<style scoped>
.review-form-container { max-width: 100%; }
.star-rating i:hover { transform: scale(1.2); }
.form-control:focus { border-color: #198754; box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25); }
</style>