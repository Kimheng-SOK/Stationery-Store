<template>
  <div class="reviews-wrapper d-flex align-items-center justify-content-center bg-light">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-10 col-lg-8 text-center">
          <h2 class="section-title">What Our Customers Say</h2>
          <p class="section-subtitle">Join thousands of satisfied customers worldwide</p>

          <!-- Loading Spinner -->
          <div v-if="loading" class="d-flex justify-content-center py-5">
            <div
              class="spinner-border text-primary"
              style="width: 3rem; height: 3rem"
              role="status"
            ></div>
          </div>

          <!-- Reviews -->
          <div v-else-if="reviews.length" class="review-card-container mx-auto">
            <div
              class="review-card-wrapper"
              :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
            >
              <div
                v-for="review in reviews"
                :key="review.id"
                class="review-card text-center p-4 shadow-sm bg-white rounded-4"
              >
                <!-- Stars -->
                <div class="d-flex justify-content-center mb-3">
                  <i
                    v-for="n in review.rating"
                    :key="n"
                    class="bi bi-star-fill text-warning fs-5 mx-1"
                  ></i>
                </div>

                <p class="fst-italic text-secondary mb-4">"{{ review.text }}"</p>

                <!-- Reviewer -->
                <div class="d-flex justify-content-center align-items-center gap-3">
                  <img :src="review.avatar" class="rounded-circle" width="50" height="50" />
                  <div class="text-start">
                    <p class="mb-0 fw-semibold">{{ review.author }}</p>
                    <small class="text-muted">{{ review.role }}</small>
                  </div>
                </div>
              </div>
            </div>

            <!-- Dots -->
            <div class="d-flex justify-content-center gap-2 mt-4">
              <button
                v-for="(_, i) in reviews"
                :key="i"
                class="dot btn p-0"
                :class="{ active: i === currentIndex }"
                @click="currentIndex = i"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { Review } from '@/types/review'

export default {
  name: 'CustomerReviewsCarousel',
  data() {
    return {
      reviews: [] as Review[],
      currentIndex: 0,
      loading: true,
      autoPlayInterval: null as number | null,
    }
  },

  async mounted() {
    await this.loadReviews()

    // Auto slide every 5 seconds
    this.autoPlayInterval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.reviews.length
    }, 5000)
  },

  beforeUnmount() {
    if (this.autoPlayInterval) clearInterval(this.autoPlayInterval)
  },

  methods: {
    async loadReviews() {
      try {
        // Try to get real data from API
        const res = await fetch('https://your-api.com/reviews') // Change this later
        // For testing now, we'll just use fake data below
        throw new Error('Using fake data') // Force fake data
      } catch (error) {
        // Use beautiful fake reviews (always shows these 3 for testing)
        this.reviews = [
          {
            id: 1,
            text: 'Absolutely love this product! The quality is amazing and delivery was super fast. Highly recommend!',
            author: 'Emma Wilson',
            role: 'Happy Customer',
            avatar: 'https://i.pravatar.cc/150?img=68',
            rating: 5,
          },
          {
            id: 2,
            text: "Best purchase I've made this year. Customer service went above and beyond. Will definitely buy again!",
            author: 'James Martinez',
            role: 'Loyal Customer',
            avatar: 'https://i.pravatar.cc/150?img=56',
            rating: 5,
          },
          {
            id: 3,
            text: 'Exceeded all my expectations! Great value for money and the packaging was eco-friendly too.',
            author: 'Sophia Anderson',
            role: 'Verified Buyer',
            avatar: 'https://i.pravatar.cc/150?img=32',
            rating: 5,
          },
        ]
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.reviews-wrapper {
  height: 80vh;
}
.review-card-container {
  max-width: 650px;
  overflow: hidden;
}

.review-card-wrapper {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.review-card {
  min-width: 100%;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #d1d5db;
  border: none;
}

.dot.active {
  background-color: #0d6efd;
}
</style>
