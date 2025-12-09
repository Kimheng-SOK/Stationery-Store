<template>
  <div class="review-display-container">
    <!-- Review Summary -->
    <div class="review-summary card shadow-sm mb-4">
      <div class="card-body p-4">
        <div class="row align-items-center">
          <div class="col-md-4 text-center border-end">
            <div class="average-rating">
              <h1 class="display-3 fw-bold mb-0">{{ averageRating.toFixed(1) }}</h1>
              <div class="stars mb-2">
                <i v-for="star in 5" :key="star" class="bi fs-5"
                  :class="star <= Math.round(averageRating) ? 'bi-star-fill text-warning' : 'bi-star text-warning'"></i>
              </div>
              <p class="text-muted mb-0">Based on {{ reviews.length }} reviews</p>
            </div>
          </div>
          <div class="col-md-8 ps-md-4">
            <div class="rating-breakdown">
              <div v-for="star in [5,4,3,2,1]" :key="star" class="rating-bar-row mb-2">
                <div class="d-flex align-items-center">
                  <span class="rating-label me-2">{{ star }} star</span>
                  <div class="progress flex-grow-1 me-2" style="height: 8px;">
                    <div class="progress-bar bg-warning" :style="{ width: getPercentage(star) + '%' }"></div>
                  </div>
                  <span class="rating-count text-muted small">{{ getCount(star) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sort -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h5 class="mb-0">Customer Reviews</h5>
        <small class="text-muted">Showing {{ reviews.length }} reviews</small>
      </div>
      <select class="form-select form-select-sm" style="width: auto;" v-model="sortBy">
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="highest">Highest Rating</option>
        <option value="lowest">Lowest Rating</option>
      </select>
    </div>

    <!-- Review List -->
    <div class="reviews-list">
      <div v-for="review in sortedReviews" :key="review.id" class="review-card card shadow-sm mb-3">
        <div class="card-body p-4">

          <!-- Name + Avatar + Date + Rating -->
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div class="d-flex align-items-center">
              <img :src="getAvatar(review.name)" :alt="review.name"
                   class="rounded-circle me-3" style="width:50px;height:50px;object-fit:cover;">
              <div>
                <h6 class="mb-0 fw-semibold">
                  {{ review.name }}
                  <span v-if="review.verified" class="badge bg-success ms-2 small">Verified</span>
                </h6>
                <small class="text-muted">{{ getTimeAgo(review.createdAt) }}</small>
              </div>
            </div>
            <div class="text-end">
              <div class="stars mb-1">
                <i v-for="star in 5" :key="star" class="bi"
                  :class="star <= review.rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'"></i>
              </div>
            </div>
          </div>

          <!-- Title + Content -->
          <h6 class="fw-semibold mb-2">{{ review.title }}</h6>
          <p class="text-muted mb-3">{{ review.content }}</p>

          <!-- Images (if any) -->
          <div v-if="review.images && review.images.length" class="mb-3">
            <div class="d-flex gap-2 flex-wrap">
              <img v-for="(img, i) in review.images" :key="i" :src="img"
                   class="img-thumbnail"
                   style="width:100px;height:100px;object-fit:cover;cursor:pointer;">
            </div>
          </div>

          <!-- Helpful & Report buttons are GONE -->

        </div>
      </div>

      <!-- Empty state -->
      <div v-if="reviews.length === 0" class="text-center py-5 text-muted">
        <i class="bi bi-chat-square-text" style="font-size: 3rem;"></i>
        <p class="mt-3">No reviews yet. Be the first to write one!</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReviewProductCard',
  props: {
    reviews: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      sortBy: 'newest'
    }
  },
  computed: {
    averageRating() {
      if (!this.reviews.length) return 0
      const sum = this.reviews.reduce((a, r) => a + r.rating, 0)
      return sum / this.reviews.length
    },
    sortedReviews() {
      const list = [...this.reviews]
      if (this.sortBy === 'newest') return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      if (this.sortBy === 'oldest') return list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      if (this.sortBy === 'highest') return list.sort((a, b) => b.rating - a.rating)
      if (this.sortBy === 'lowest') return list.sort((a, b) => a.rating - b.rating)
      return list
    }
  },
  methods: {
    getCount(star) {
      return this.reviews.filter(r => r.rating === star).length
    },
    getPercentage(star) {
      return this.reviews.length ? (this.getCount(star) / this.reviews.length) * 100 : 0
    },
    getTimeAgo(date) {
      const days = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24))
      if (days === 0) return 'Today'
      if (days === 1) return 'Yesterday'
      if (days < 30) return `${days} days ago`
      if (days < 365) return `${Math.floor(days / 30)} month${days >= 60 ? 's' : ''} ago`
      return `${Math.floor(days / 365)} year${days >= 730 ? 's' : ''} ago`
    },
    getAvatar(name) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=198754&color=fff&size=50`
    }
  }
}
</script>

<style scoped>
.review-display-container { max-width: 900px; margin: 0 auto; }
.card { border: 1px solid #e0e0e0; border-radius: 8px; }
.progress { background-color: #e9ecef; border-radius: 4px; }
.img-thumbnail { border-radius: 6px; transition: transform .2s; }
.img-thumbnail:hover { transform: scale(1.05); }
</style>