<template>
  <div class="container py-5">
    <div class="row">
      <!-- Left: Form -->
      <div class="col-lg-5 mb-4">
        <ReviewProductForm 
          :productId="productId"
          @submit-review="addReview"
          @cancel="showForm = false"
        />
      </div>

      <!-- Right: Show All Reviews -->
      <div class="col-lg-7">
        <ReviewProductCard 
          :reviews="allReviews"
          :averageRating="average"
          :totalReviews="allReviews.length"
          :ratingDistribution="distribution"
        />
      </div>
    </div>
    
  </div>
   <ReviewWebCard />

    <ReviewWebForm userName="Ahmed Khan" serviceDate="Sunday, December 8" />
</template>

<script>
import ReviewProductForm from './ReviewProductForm.vue'
import ReviewProductCard from './ReviewProductCard.vue'
import ReviewWebForm from './ReviewWebForm.vue'
import ReviewWebCard from './ReviewWebCard.vue'

export default {
  components: { ReviewProductForm, ReviewProductCard , ReviewWebCard, ReviewWebForm},
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
//   methods: {
//     async addReview(reviewData) {
//         // Step 1: Show the review instantly (for good UX)
//         const imageUrls = reviewData.images.map(file => URL.createObjectURL(file))

//         const newReview = {
//         id: Date.now(),
//         name: reviewData.name,
//         rating: reviewData.rating,
//         title: reviewData.title,
//         content: reviewData.content,
//         createdAt: new Date().toISOString().split('T')[0],
//         verified: false,
//         images: imageUrls,           // shows photos right away
//         helpfulCount: 0
//         }
//         this.allReviews.unshift(newReview)   // ← appears instantly!

//         // Step 2: Send to your real server (uncomment when ready)
//         try {
//         const formData = new FormData()
//         formData.append('productId', this.productId)
//         formData.append('name', reviewData.name)
//         formData.append('email', reviewData.email)
//         formData.append('rating', reviewData.rating)
//         formData.append('title', reviewData.title)
//         formData.append('content', reviewData.content)
//         reviewData.images.forEach(file => formData.append('images', file))

//         const response = await fetch('https://your-website.com/api/reviews', {
//             method: 'POST',
//             body: formData
//         })

//         if (response.ok) {
//             alert('Review saved forever on the server!')
//         } else {
//             alert('Saved locally, but server is offline right now')
//         }
//         } catch (err) {
//         console.log('Server not connected (this is normal when testing offline)')
//         alert('Review saved locally – you’re testing offline! Everything works!')
//         }
//     }
//     }



  methods: {
    addReview(reviewData) {
      // Turn uploaded photos into URLs so they can be shown
      const imageUrls = reviewData.images.map(file => URL.createObjectURL(file))

      const newReview = {
        id: Date.now(),
        name: reviewData.name,
        rating: reviewData.rating,
        title: reviewData.title,
        content: reviewData.content,
        createdAt: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        verified: false,
        images: imageUrls,        // ← This makes photos appear!
        helpfulCount: 0
      }

      // Add new review to the top
      this.allReviews.unshift(newReview)

      // Success message
      alert('Thank you! Your review is now visible below 👇')
    }
  }
}
</script>

<style scoped>
.container { max-width: 1400px; }
</style>