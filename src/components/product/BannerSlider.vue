<template>
  <section class="banner-slider">
    <div class="carousel-container">
      <!-- Banner Slides -->
      <div class="slides-wrapper">
        <div 
          v-for="(banner, index) in banners" 
          :key="banner.id"
          class="slide"
          :class="{ active: currentSlide === index }"
        >
          <img :src="banner.image" :alt="banner.title" class="slide-image">
          <div class="slide-overlay"></div>
          <div class="slide-content">
            <div class="container">
              <div class="row">
                <div class="col-lg-7">
                  <div class="content-box">
                    <h1 class="slide-title" v-html="banner.title"></h1>
                    <p class="slide-subtitle">{{ banner.subtitle }}</p>
                    <button class="btn btn-shop" @click="goToLink(banner.link)">
                      {{ banner.buttonText }}
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
      <button class="nav-btn nav-btn-prev" @click="prevSlide" aria-label="Previous slide">
        <i class="bi bi-chevron-left"></i>
      </button>
      <button class="nav-btn nav-btn-next" @click="nextSlide" aria-label="Next slide">
        <i class="bi bi-chevron-right"></i>
      </button>

      <!-- Dots Indicator -->
      <div class="dots-container">
        <button
          v-for="(banner, index) in banners"
          :key="`dot-${banner.id}`"
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
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  buttonText: string;
}

const router = useRouter();
const currentSlide = ref(0);
let autoPlayInterval: number | null = null;

const banners = ref<Banner[]>([
  {
    id: 1,
    title: 'Welcome to<br><span class="highlight">StationeryBox Shop</span>',
    subtitle: 'Discover premium notebooks, elegant pens, and thoughtfully designed desk accessories for the modern professional',
    image: '/public/images/banner/ban1.jpg',
    link: '/shop',
    buttonText: 'Shop Collection'
  },
  {
    id: 2,
    title: 'New Arrival<br><span class="highlight">Collection 2025</span>',
    subtitle: 'Discover our latest premium notebooks and pens designed for creativity and productivity',
    image: '/public/images/banner/ban2.jpg',
    link: '/new-arrival',
    buttonText: 'Explore New Arrivals'
  },
  {
    id: 3,
    title: 'Premium Quality<br><span class="highlight">Art Supplies</span>',
    subtitle: 'Unleash your creativity with professional-grade materials and artistic tools',
    image: '/public/images/banner/ban3.jpg',
    link: '/shop',
    buttonText: 'Shop Art Supplies'
  },
  {
    id: 4,
    title: 'Up to 50% OFF<br><span class="highlight">Limited Time Offer</span>',
    subtitle: 'Save big on selected office supplies and premium stationery items',
    image: '/public/images/banner/ban4.jpg',
    link: '/shop',
    buttonText: 'Shop Sale'
  }
]);

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % banners.value.length;
};

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 
    ? banners.value.length - 1 
    : currentSlide.value - 1;
};

const goToSlide = (index: number) => {
  currentSlide.value = index;
};

const goToLink = (link: string) => {
  router.push(link);
};

const startAutoPlay = () => {
  autoPlayInterval = window.setInterval(() => {
    nextSlide();
  }, 5000);
};

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
  }
};

onMounted(() => {
  startAutoPlay();
});

onUnmounted(() => {
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