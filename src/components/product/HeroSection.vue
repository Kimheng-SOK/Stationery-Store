<template>
  <section class="hero-section">
    <div
      v-if="slides.length"
      id="heroCarousel"
      class="carousel slide carousel-fade"
      data-bs-ride="carousel"
      data-bs-interval="3000"
    >
      <!-- Background Slides -->
      <div class="carousel-inner">
        <div
          v-for="(slide, index) in slides"
          :key="slide.id ?? index"
          :class="['carousel-item', { active: index === 0 }]"
        >
          <img :src="slide.image" class="d-block w-100" :alt="`Slide ${index + 1}`">
        </div>
      </div>

      <!-- Indicators -->
      <div class="carousel-indicators">
        <button
          v-for="(slide, index) in slides"
          :key="`indicator-${slide.id ?? index}`"
          type="button"
          data-bs-target="#heroCarousel"
          :data-bs-slide-to="index"
          :class="{ active: index === 0 }"
        ></button>
      </div>
    </div>

    <!-- Static Content (stays in place) -->
    <div class="hero-content">
      <div class="container">
        <div class="row">
          <div class="col-lg-6 col-md-8">
            <h1 class="display-4 fw-light text-white mb-3">
              Welcome to<br>
              <span class="fw-bold text-primary">StationeryBox</span> Shop
            </h1>
            <p class="lead text-white mb-4">
              Discover premium notebooks, elegant pens, and thoughtfully designed
              desk accessories for the modern professional
            </p>
            <button class="btn btn-success btn-lg">
              Shop Collection →
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHeroSectionStore } from '@/stores/heroSection'

const heroStore = useHeroSectionStore()

const slides = computed(() => heroStore.heroSlides)
</script>

<style scoped>
.hero-section {
  position: relative;
  height: 500px;
}

.carousel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.carousel-item {
  height: 500px;
}

.carousel-item img {
  height: 500px;
  width: 100%;
  object-fit: cover;
  filter: brightness(0.6);
}

.hero-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 50px 0;
}

.btn-success {
  background-color: #7fb069;
  border-color: #7fb069;
}

.btn-success:hover {
  background-color: #6a9c57;
  border-color: #6a9c57;
}

.text-primary {
  color: #1e3a5f !important;
}

@media (max-width: 768px) {
  .hero-section {
    height: 400px;
  }

  .carousel-item {
    height: 400px;
  }

  .carousel-item img {
    height: 400px;
  }

  .display-4 {
    font-size: 2rem;
  }
}
</style>
