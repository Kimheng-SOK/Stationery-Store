<template>
  <div class="review-form-container">
    <div class="card shadow-sm">
      <div class="card-body p-4">
        <h4 class="card-title mb-4">Write a Review</h4>
        
        <form @submit.prevent="submitReview">
          <!-- Rating Section -->
          <div class="mb-4">
            <label class="form-label fw-semibold">Your Rating *</label>
            <div class="star-rating">
              <i 
                v-for="star in 5" 
                :key="star"
                class="bi fs-4 me-1"
                :class="star <= rating ? 'bi-star-fill text-warning' : 'bi-star'"
                @click="rating = star"
                @mouseover="hoverRating = star"
                @mouseleave="hoverRating = 0"
                style="cursor: pointer;"
              ></i>
            </div>
          </div>

          <!-- Name Input -->
          <div class="mb-3">
            <label for="reviewerName" class="form-label fw-semibold">Name *</label>
            <input 
              type="text" 
              class="form-control" 
              id="reviewerName"
              v-model="formData.name"
              placeholder="Enter your name"
              required
            >
          </div>

          <!-- Email Input -->
          <div class="mb-3">
            <label for="reviewerEmail" class="form-label fw-semibold">Email *</label>
            <input 
              type="email" 
              class="form-control" 
              id="reviewerEmail"
              v-model="formData.email"
              placeholder="Enter your email"
              required
            >
          </div>

          <!-- Review Title -->
          <div class="mb-3">
            <label for="reviewTitle" class="form-label fw-semibold">Review Title *</label>
            <input 
              type="text" 
              class="form-control" 
              id="reviewTitle"
              v-model="formData.title"
              placeholder="Sum up your review in one line"
              required
            >
          </div>

          <!-- Review Content -->
          <div class="mb-3">
            <label for="reviewContent" class="form-label fw-semibold">Your Review *</label>
            <textarea 
              class="form-control" 
              id="reviewContent"
              v-model="formData.content"
              rows="5"
              placeholder="Share your experience with this product"
              required
            ></textarea>
            <small class="text-muted">Minimum 50 characters</small>
          </div>

          <!-- Image Upload -->
          <div class="mb-4">
            <label class="form-label fw-semibold">Add Photos (Optional)</label>
            <input 
              type="file" 
              class="form-control" 
              accept="image/*"
              multiple
              @change="handleFileUpload"
            >
            <small class="text-muted">You can upload up to 3 images</small>
            
            <!-- Preview uploaded images -->
            <div v-if="previewImages.length > 0" class="mt-3 d-flex gap-2 flex-wrap">
              <div v-for="(img, index) in previewImages" :key="index" class="position-relative">
                <img :src="img" alt="Preview" class="img-thumbnail" style="width: 100px; height: 100px; object-fit: cover;">
                <button 
                  type="button" 
                  class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle p-1"
                  @click="removeImage(index)"
                  style="width: 25px; height: 25px; line-height: 1;"
                >
                  <i class="bi bi-x"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary px-4" :disabled="isSubmitting">
              <span v-if="isSubmitting">
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                Submitting...
              </span>
              <span v-else>Submit Review</span>
            </button>
            <button type="button" class="btn btn-outline-secondary px-4" @click="resetForm">
              Cancel
            </button>
          </div>
        </form>

        <!-- Success Message -->
        <div v-if="showSuccess" class="alert alert-success mt-3" role="alert">
          <i class="bi bi-check-circle-fill me-2"></i>
          Thank you! Your review has been submitted successfully.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReviewProductForm',
  props: {
    productId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      rating: 0,
      hoverRating: 0,
      formData: {
        name: '',
        email: '',
        title: '',
        content: ''
      },
      uploadedFiles: [],
      previewImages: [],
      isSubmitting: false,
      showSuccess: false
    }
  },
  methods: {
    handleFileUpload(event) {
      const files = Array.from(event.target.files);
      
      if (this.previewImages.length + files.length > 3) {
        alert('You can only upload up to 3 images');
        return;
      }

      files.forEach(file => {
        if (file && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.previewImages.push(e.target.result);
            this.uploadedFiles.push(file);
          };
          reader.readAsDataURL(file);
        }
      });
    },
    removeImage(index) {
      this.previewImages.splice(index, 1);
      this.uploadedFiles.splice(index, 1);
    },
    async submitReview() {
      if (this.rating === 0) {
        alert('Please select a rating');
        return;
      }

      if (this.formData.content.length < 50) {
        alert('Review must be at least 50 characters long');
        return;
      }

      this.isSubmitting = true;

      try {
        const reviewData = {
          productId: this.productId,
          rating: this.rating,
          name: this.formData.name,
          email: this.formData.email,
          title: this.formData.title,
          content: this.formData.content,
          images: this.uploadedFiles,
          createdAt: new Date().toISOString()
        };

        // Emit event to parent component with review data
        this.$emit('submit-review', reviewData);

        // Show success message
        this.showSuccess = true;
        setTimeout(() => {
          this.showSuccess = false;
          this.resetForm();
        }, 3000);

      } catch (error) {
        console.error('Error submitting review:', error);
        alert('Failed to submit review. Please try again.');
      } finally {
        this.isSubmitting = false;
      }
    },
    resetForm() {
      this.rating = 0;
      this.formData = {
        name: '',
        email: '',
        title: '',
        content: ''
      };
      this.uploadedFiles = [];
      this.previewImages = [];
      this.$emit('cancel');
    }
  }
}
</script>

<style scoped>
.review-form-container {
  max-width: 700px;
  margin: 0 auto;
}

.card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.form-label {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.form-control {
  border: 1px solid #ced4da;
  border-radius: 6px;
  padding: 0.75rem;
}

.form-control:focus {
  border-color: #198754;
  box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25);
}

.star-rating i {
  transition: all 0.2s ease;
}

.star-rating i:hover {
  transform: scale(1.1);
}

.btn-primary {
  background-color: #198754;
  border-color: #198754;
}

.btn-primary:hover {
  background-color: #157347;
  border-color: #146c43;
}

.btn-primary:disabled {
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-outline-secondary {
  color: #6c757d;
  border-color: #6c757d;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  color: white;
}

textarea.form-control {
  resize: vertical;
  min-height: 120px;
}

.img-thumbnail {
  border-radius: 6px;
}
</style>