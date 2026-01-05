<template>
  <!-- Overlay Background -->
  <div v-if="isVisible" class="overlay" @click.self="handleNotNow">
    <!-- Review Box -->
    <div class="modal-box bg-white rounded p-4 p-md-5 position-relative">
      <!-- Close Button -->
      <button class="btn-close position-absolute top-0 end-0 m-3" @click="handleNotNow"></button>

      <!-- Title -->
      <h2 class="text-center fw-semibold mb-4 title">Review</h2>

      <!-- User Info -->
      <div class="text-center mb-4">
        <div
          class="avatar text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center fw-semibold"
        >
          {{ userName.charAt(0) }}
        </div>
        <h3 class="fs-5 fw-semibold mb-2">{{ userName }}</h3>
        <p class="text-muted small mb-0">Rate the care provided {{ serviceDate }}</p>
      </div>

      <!-- Star Rating -->
      <div class="d-flex justify-content-center gap-2 mb-4">
        <span
          v-for="star in 5"
          :key="star"
          class="star"
          @click="rating = star"
          @mouseenter="hoveredRating = star"
          @mouseleave="hoveredRating = 0"
        >
          <span v-if="star <= (hoveredRating || rating)" class="text-warning">★</span>
          <span v-else class="text-secondary opacity-25">★</span>
        </span>
      </div>

      <!-- Comments -->
      <textarea
        v-model="comments"
        class="form-control mb-4"
        placeholder="Additional Comments..."
        rows="4"
      >
      </textarea>

      <!-- Buttons -->
      <div class="row g-2">
        <div class="col-6">
          <button class="btn btn-outline-dark w-100 btn-theme" @click="handleNotNow">
            Not Now
          </button>
        </div>
        <div class="col-6">
          <button
            class="btn btn-dark w-100 btn-theme"
            @click="handleSubmit"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Submitting...' : 'Submit Review' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ReviewForm',

  props: {
    userName: { type: String, default: 'Guest User' },
    serviceDate: { type: String, default: 'today' },
    delay: { type: Number, default: 6000 },
    apiUrl: { type: String, required: true },
  },

  data() {
    return {
      isVisible: false,
      rating: 0,
      hoveredRating: 0,
      comments: '',
      isSubmitting: false,
      timer: null as number | null,
    }
  },

  mounted() {
    this.timer = setTimeout(() => {
      this.isVisible = true
    }, this.delay)
  },

  beforeUnmount() {
    if (this.timer) clearTimeout(this.timer)
  },

  methods: {
    async handleSubmit() {
      if (this.rating === 0) {
        alert('Please select a rating')
        return
      }

      this.isSubmitting = true

      const reviewData = {
        userName: this.userName,
        serviceDate: this.serviceDate,
        rating: this.rating,
        comments: this.comments.trim(),
        submittedAt: new Date().toISOString(),
      }

      try {
        const res = await fetch(this.apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reviewData),
        })

        if (res.ok) {
          alert('Thank you! Your review was submitted.')
          this.$emit('submit', reviewData)
        } else {
          alert('Submit failed.')
        }
      } catch (e) {
        console.error(e)
        this.$emit('submit', reviewData)
      } finally {
        this.isSubmitting = false
        this.isVisible = false
        this.rating = 0
        this.comments = ''
      }
    },

    handleNotNow() {
      this.isVisible = false
      this.$emit('close')
    },
  },
}
</script>

<style scoped>
/* Overlay */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* Modal */
.modal-box {
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

/* Title color */
.title {
  color: #1e293b;
}

/* Avatar */
.avatar {
  width: 80px;
  height: 80px;
  font-size: 32px;
  background-color: #1e293b;
}

/* Stars */
.star {
  font-size: 48px;
  cursor: pointer;
  user-select: none;
}

/* Bootstrap buttons with custom color */
.btn-theme.btn-dark {
  background-color: #1e293b;
  border-color: #1e293b;
}

.btn-theme.btn-dark:hover {
  background-color: #0f172a;
  border-color: #0f172a;
}

.btn-theme.btn-outline-dark {
  color: #1e293b;
  border-color: #1e293b;
}

.btn-theme.btn-outline-dark:hover {
  background-color: #1e293b;
  color: #ffffff;
}

/* Animation */
@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
