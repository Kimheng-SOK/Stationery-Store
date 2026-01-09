<template>
  <div class="container py-5">
    <div class="row">
      <!-- Left: Form (Sticky) -->
      <div class="col-lg-5 mb-4">
        <div class="sticky-form">
          <ReviewProductForm 
            :productId="productId"
            @submit-review="addReview"
            @cancel="showForm = false"
          />
        </div>
      </div>

      <!-- Right: Show All Reviews -->
      <div class="col-lg-6">
        <ReviewProductCard 
          :reviews="allReviews"
          :averageRating="average"
          :totalReviews="allReviews.length"
          :ratingDistribution="distribution"
        />
      </div>
    </div>
    
  </div>

</template>

<script>
import ReviewProductForm from './ReviewProductForm.vue'
import ReviewProductCard from './ReviewProductCard.vue'
import ReviewWebForm from './ReviewWebForm.vue'
import ReviewWebCard from './ReviewWebCard.vue'

export default {
  components: { ReviewProductForm, ReviewProductCard, ReviewWebCard, ReviewWebForm },
  data() {
    return {
      productId: 'PROD123',
      showForm: true,
      allReviews: []
    }
  },
  computed: {
    average() {
      if (this.allReviews.length === 0) return 0
      const sum = this.allReviews.reduce((a, r) => a + r.rating, 0)
      return (sum / this.allReviews.length).toFixed(1)
    },
    distribution() {
      return {
        5: this.allReviews.filter(r => r.rating === 5).length,
        4: this.allReviews.filter(r => r.rating === 4).length,
        3: this.allReviews.filter(r => r.rating === 3).length,
        2: this.allReviews.filter(r => r.rating === 2).length,
        1: this.allReviews.filter(r => r.rating === 1).length
      }
    }
  },
  methods: {
    addReview(reviewData) {
      const imageUrls = reviewData.images.map(file => URL.createObjectURL(file))

      const newReview = {
        id: Date.now(),
        name: reviewData.name,
        rating: reviewData.rating,
        title: reviewData.title,
        content: reviewData.content,
        createdAt: new Date().toISOString().split('T')[0],
        verified: false,
        images: imageUrls,
        helpfulCount: 0
      }

      this.allReviews.unshift(newReview)
      alert('Thank you! Your review is now visible below 👇')
    }
  }
}
</script>

<style scoped>
.container { 
  max-width: 1400px;
  padding: 60px 30px; /* Bigger margin */
}

.row {
  gap: 40px; /* Space between columns */
}

.sticky-form {
  position: sticky;
  top: 20px; /* Distance from top when scrolling */
  z-index: 10;
}

@media (max-width: 991px) {
  .sticky-form {
    position: static; /* Remove sticky on mobile */
  }
}
</style>