<template>
  <section class="hero-section">
    <div
      v-if="slides.length"
      id="heroCarousel"
      ref="carouselEl"
      class="carousel slide carousel-fade"
      data-bs-ride="carousel"
    >
      <div class="carousel-inner">
        <div
          v-for="(slide, index) in slides"
          :key="slide.id ?? index"
          :class="['carousel-item', { active: index === 0 }]"
        >
          <img :src="slide.image" class="d-block w-100" :alt="`Slide ${index + 1}`">
        </div>
      </div>

      <div class="carousel-indicators">
        <button
          v-for="(slide, index) in slides"
          :key="`indicator-${slide.id ?? index}`"
          type="button"
          data-bs-target="#heroCarousel"
          :data-bs-slide-to="index"
          :class="{ active: index === 0 }"
          :aria-current="index === 0 ? 'true' : 'false'"

        ></button>
      </div>
    </div>

    <div class="hero-content">
      <div class="container">
        <div class="row">
          <div class="col-lg-6 col-md-8">
            <h1 class="display-4 fw-light text-white mb-3">
              Welcome to<br>
              <span class="fw-bold text-primary">StationeryBox</span> Shop
            </h1>
            <router-link to="/shop">
              <button class="btn btn-success btn-lg">Shop Collection →</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useHeroSectionStore } from '@/stores/heroSection'

const heroStore = useHeroSectionStore()
const slides = computed(() => heroStore.heroSlides)
const carouselEl = ref<HTMLElement | null>(null)
let carouselInstance: any = null

// MANUAL NAVIGATION FIX:
// This ensures the button click works even if Bootstrap's data-attributes fail
const goToSlide = (index: number) => {
  if (carouselInstance) {
    carouselInstance.to(index)
  }
}

const initCarousel = async () => {
  await nextTick()

  // Guard for TypeScript error: ensure element exists before passing to Bootstrap
  if (!carouselEl.value || slides.value.length === 0 || !window.bootstrap) return

  if (carouselInstance) {
    carouselInstance.dispose()
  }

  // Initializing with the element reference directly
  carouselInstance = new window.bootstrap.Carousel(carouselEl.value, {
    interval: 3000,
    ride: 'carousel',
    wrap: true
  })
}

onMounted(async () => {
  await heroStore.fetchBanners()
  await initCarousel()
})

onUnmounted(() => {
  if (carouselInstance) {
    carouselInstance.dispose()
  }
})

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

.hero-content {
  pointer-events: none;
}

.hero-content button,
.hero-content a {
  pointer-events: auto;
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
