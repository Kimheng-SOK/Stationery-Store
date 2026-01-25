<template>
  <section class="banner-slider">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="spinner"></div>
    </div>

    <!-- No Banners State -->
    <div v-else-if="heroSlides.length === 0" class="no-banners">
      <p>No active banners available</p>
    </div>

    <!-- Carousel -->
    <div v-else class="carousel-container">
      <!-- Banner Slides -->
      <div class="slides-wrapper">
        <div
          v-for="(slide, index) in heroSlides"
          :key="slide.id"
          class="slide"
          :class="{ active: currentSlide === index }"
        >
          <img
            :src="slide.image"
            :alt="`Banner ${index + 1}`"
            class="slide-image"
            @error="handleImageError"
          >
          <div class="slide-overlay"></div>
          <div class="slide-content">
            <div class="container">
              <div class="row">
                <div class="col-lg-7">
                  <div class="content-box">
                    <h1 class="slide-title">
                      Fresh & Organic <span class="highlight">Products</span>
                    </h1>
                    <p class="slide-subtitle">Special offers on premium quality products</p>
                    <button class="btn btn-shop" @click="goToLink(slide.link)">
                      Shop Now
                      <i class="bi bi-arrow-right ms-2"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Arrows -->
      <button
        v-if="heroSlides.length > 1"
        class="nav-btn nav-btn-prev"
        @click="prevSlide"
        aria-label="Previous slide"
      >
        <i class="bi bi-chevron-left"></i>
      </button>
      <button
        v-if="heroSlides.length > 1"
        class="nav-btn nav-btn-next"
        @click="nextSlide"
        aria-label="Next slide"
      >
        <i class="bi bi-chevron-right"></i>
      </button>

      <!-- Dots Indicator -->
      <div v-if="heroSlides.length > 1" class="dots-container">
        <button
          v-for="(slide, index) in heroSlides"
          :key="`dot-${slide.id}`"
          class="dot"
          :class="{ active: currentSlide === index }"
          @click="goToSlide(index)"
          :aria-label="`Go to slide ${index + 1}`"
        ></button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useHeroSectionStore } from '@/stores/heroSection';

const router = useRouter();
const heroStore = useHeroSectionStore();

const currentSlide = ref(0);
let autoPlayInterval: number | null = null;

// Get data from store
const heroSlides = computed(() => heroStore.heroSlides);
const isLoading = computed(() => heroStore.isLoading);

const handleImageError = (event: Event) => {
  console.error('Image failed to load:', (event.target as HTMLImageElement).src);
};

const nextSlide = () => {
  if (heroSlides.value.length === 0) return;
  currentSlide.value = (currentSlide.value + 1) % heroSlides.value.length;
  console.log('Next slide:', currentSlide.value);
};

const prevSlide = () => {
  if (heroSlides.value.length === 0) return;
  currentSlide.value = currentSlide.value === 0
    ? heroSlides.value.length - 1
    : currentSlide.value - 1;
  console.log('Previous slide:', currentSlide.value);
};

const goToSlide = (index: number) => {
  stopAutoPlay(); // Stop autoplay when user manually clicks
  currentSlide.value = index;
  console.log('🎯 Clicked dot, go to slide:', index);

  // Restart autoplay after 3 seconds of inactivity
  setTimeout(() => {
    startAutoPlay();
  }, 3000);
};

const goToLink = (link: string) => {
  if (link) {
    router.push(link);
  }
};

const startAutoPlay = () => {
  if (heroSlides.value.length <= 1) return;
  stopAutoPlay(); // Clear any existing interval
  autoPlayInterval = window.setInterval(() => {
    nextSlide();
  }, 5000);
  console.log('▶️ Autoplay started');
};

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
    console.log('⏸️ Autoplay stopped');
  }
};

// Watch for changes in slides and restart autoplay
watch(heroSlides, (newSlides) => {
  console.log('📊 Slides changed:', newSlides.length);
  if (newSlides.length > 0) {
    currentSlide.value = 0;
    startAutoPlay();
  }
}, { immediate: false });

onMounted(async () => {
  console.log('🎬 Carousel component mounted');

  // Fetch banners from API
  await heroStore.fetchBanners();

  console.log('📊 Total slides loaded:', heroSlides.value.length);
  console.log('🖼️ Slides data:', heroSlides.value);

  // Start autoplay if we have slides
  if (heroSlides.value.length > 0) {
    startAutoPlay();
  } else {
    console.warn('⚠️ No slides available to display');
  }
});

onUnmounted(() => {
  console.log('🛑 Carousel component unmounted');
  stopAutoPlay();
});
</script>

<style scoped>
.banner-slider {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 500px;
}

.slides-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.8s ease-in-out, visibility 0.8s ease-in-out;
}

.slide.active {
  opacity: 1;
  visibility: visible;
  z-index: 1;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 40%, transparent 70%);
  z-index: 2;
}

.slide-content {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  transform: translateY(-50%);
  z-index: 3;
}

.content-box {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(8px);
  padding: 2.5rem 2rem;
  border-radius: 8px;
  max-width: 600px;
}

.slide-title {
  font-size: 2.5rem;
  font-weight: 400;
  line-height: 1.3;
  margin-bottom: 1rem;
  color: #1e293b;
}

.slide-title .highlight {
  font-weight: 700;
  color: #0f172a;
  display: block;
}

.slide-subtitle {
  font-size: 1rem;
  margin-bottom: 1.5rem;
  color: #334155;
  line-height: 1.6;
}

.btn-shop {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 0.75rem 1.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-shop:hover {
  background-color: #059669;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* Navigation Arrows */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  border: none;
  color: #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.nav-btn-prev {
  left: 1.5rem;
}

.nav-btn-next {
  right: 1.5rem;
}

.nav-btn i {
  font-size: 1.25rem;
}

/* Dots Indicator */
.dots-container {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 10;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.dot:hover {
  background: rgba(255, 255, 255, 0.9);
}

.dot.active {
  background: white;
  width: 28px;
  border-radius: 5px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
  background: #f8f9fa;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e5e7eb;
  border-top-color: #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.no-banners {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
  background: #f8f9fa;
  color: #6b7280;
  font-size: 1.1rem;
}

/* Responsive Design */
@media (max-width: 992px) {
  .carousel-container {
    height: 450px;
  }

  .content-box {
    padding: 2rem 1.5rem;
  }

  .slide-title {
    font-size: 2rem;
  }

  .slide-subtitle {
    font-size: 0.95rem;
  }

  .nav-btn {
    width: 40px;
    height: 40px;
  }

  .nav-btn i {
    font-size: 1.1rem;
  }

  .nav-btn-prev {
    left: 1rem;
  }

  .nav-btn-next {
    right: 1rem;
  }
}

@media (max-width: 768px) {
  .carousel-container {
    height: 400px;
  }

  .content-box {
    padding: 1.5rem 1.25rem;
    background: rgba(255, 255, 255, 0.85);
  }

  .slide-title {
    font-size: 1.75rem;
  }

  .slide-subtitle {
    font-size: 0.9rem;
  }

  .btn-shop {
    padding: 0.65rem 1.5rem;
    font-size: 0.9rem;
  }

  .slide-overlay {
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 50%, transparent 80%);
  }
}

@media (max-width: 576px) {
  .carousel-container {
    height: 350px;
  }

  .content-box {
    padding: 1.25rem 1rem;
    background: rgba(255, 255, 255, 0.9);
  }

  .slide-title {
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
  }

  .slide-subtitle {
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }

  .nav-btn {
    width: 35px;
    height: 35px;
  }

  .nav-btn i {
    font-size: 1rem;
  }

  .nav-btn-prev {
    left: 0.5rem;
  }

  .nav-btn-next {
    right: 0.5rem;
  }

  .dots-container {
    bottom: 1rem;
  }
}
</style>
