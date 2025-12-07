<template>
  <section class="new-arrival-preview py-5 bg-light">
    <div class="container">
      <!-- Section Header -->
      <div class="text-center mb-5">
        <h2 class="section-title mb-2">New Arrival Products</h2>
        <p class="section-subtitle text-muted">Check out our latest additions</p>
      </div>

      <!-- Products Carousel -->
      <div class="carousel-container position-relative">
        <!-- Previous Button -->
        <button
          class="carousel-btn carousel-btn-prev"
          @click="scrollCarousel('prev')"
          :disabled="isAtStart"
        >
          <i class="bi bi-chevron-left"></i>
        </button>

        <!-- Products Slider -->
        <div
          class="products-slider"
          ref="sliderRef"
          @mousedown="startDrag"
          @mousemove="drag"
          @mouseup="stopDrag"
          @mouseleave="stopDrag"
          @touchstart="startDrag"
          @touchmove="drag"
          @touchend="stopDrag"
        >
          <div v-for="product in newArrivalProducts" :key="product.id" class="product-slide">
            <ProductCard
              :product="product"
              :badge="{ text: 'NEW', type: 'success' }"
              @quick-view="handleQuickView(product)"
              @add-to-cart="handleAddToCart(product)"
            />
          </div>
        </div>

        <!-- Next Button -->
        <button
          class="carousel-btn carousel-btn-next"
          @click="scrollCarousel('next')"
          :disabled="isAtEnd"
        >
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>

      <!-- Dots Indicator -->
      <div class="carousel-dots text-center mt-4">
        <span
          v-for="(dot, index) in totalDots"
          :key="index"
          class="dot"
          :class="{ active: index === currentDot }"
          @click="goToSlide(index)"
        ></span>
      </div>

      <!-- View All Button -->
      <div class="text-center mt-4">
        <router-link to="/new-arrival" class="btn btn-success btn-lg">
          View All New Arrivals
          <i class="bi bi-arrow-right ms-2"></i>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import ProductCard from './ProductCard.vue'

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  image: string
}

const newArrivalProducts = ref<Product[]>([])
const sliderRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)
const currentDot = ref(0)

onMounted(() => {
  newArrivalProducts.value = [
    {
      id: 201,
      name: 'Premium Leather Notebook',
      price: 24.99,
      originalPrice: 34.99,
      rating: 5,
      reviewCount: 156,
      image: '/public/images/notebooks/book1.jpg',
    },
    {
      id: 202,
      name: 'Colorful Sticky Notes Set',
      price: 19.99,
      originalPrice: 29.99,
      rating: 4,
      reviewCount: 89,
      image: '/public/images/notebooks/book2.jpg',
    },
    {
      id: 203,
      name: 'Designer Journal',
      price: 24.99,
      rating: 5,
      reviewCount: 234,
      image: '/public/images/notebooks/book3.jpg',
    },
    {
      id: 204,
      name: 'Elegant Planner',
      price: 24.99,
      originalPrice: 34.99,
      rating: 4,
      reviewCount: 178,
      image: '/public/images/notebooks/book4.jpg',
    },
    {
      id: 204,
      name: 'Elegant Planner',
      price: 24.99,
      originalPrice: 34.99,
      rating: 4,
      reviewCount: 178,
      image: '/public/images/notebooks/book5.jpg',
    },
  ]

  if (sliderRef.value) {
    sliderRef.value.addEventListener('scroll', updateCurrentDot)
  }
})

const totalDots = computed(() => {
  return Math.ceil(newArrivalProducts.value.length / 4)
})

const isAtStart = computed(() => {
  return currentDot.value === 0
})

const isAtEnd = computed(() => {
  return currentDot.value >= totalDots.value - 1
})

const scrollCarousel = (direction: 'prev' | 'next') => {
  if (!sliderRef.value) return

  const slideWidth = sliderRef.value.querySelector('.product-slide')?.clientWidth || 0
  const gap = 16
  const scrollAmount = (slideWidth + gap) * 4

  if (direction === 'next') {
    sliderRef.value.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  } else {
    sliderRef.value.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
  }
}

const goToSlide = (index: number) => {
  if (!sliderRef.value) return

  const slideWidth = sliderRef.value.querySelector('.product-slide')?.clientWidth || 0
  const gap = 16
  const scrollAmount = (slideWidth + gap) * 4 * index

  sliderRef.value.scrollTo({ left: scrollAmount, behavior: 'smooth' })
}

const updateCurrentDot = () => {
  if (!sliderRef.value) return

  const slideWidth = sliderRef.value.querySelector('.product-slide')?.clientWidth || 0
  const gap = 16
  const scrollPosition = sliderRef.value.scrollLeft
  const slideGroup = (slideWidth + gap) * 4

  currentDot.value = Math.round(scrollPosition / slideGroup)
}

const startDrag = (e: MouseEvent | TouchEvent) => {
  if (!sliderRef.value) return

  isDragging.value = true
  sliderRef.value.style.cursor = 'grabbing'

  const pageX = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX
  startX.value = pageX - sliderRef.value.offsetLeft
  scrollLeft.value = sliderRef.value.scrollLeft
}

const drag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value || !sliderRef.value) return

  e.preventDefault()

  const pageX = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX
  const x = pageX - sliderRef.value.offsetLeft
  const walk = (x - startX.value) * 2
  sliderRef.value.scrollLeft = scrollLeft.value - walk
}

const stopDrag = () => {
  isDragging.value = false
  if (sliderRef.value) {
    sliderRef.value.style.cursor = 'grab'
  }
}

const handleQuickView = (product: Product) => {
  console.log('Quick view:', product)
}

const handleAddToCart = (product: Product) => {
  console.log('Add to cart:', product)
}
</script>

<style scoped>
.new-arrival-preview {
  background-color: #f8f9fa;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #212529;
}

.section-subtitle {
  font-size: 1rem;
  color: #6c757d;
}

.carousel-container {
  position: relative;
  padding: 0 50px;
}

.products-slider {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  cursor: grab;
  user-select: none;
  padding: 1rem 0;

  scrollbar-width: none;
  -ms-overflow-style: none;
}

.products-slider::-webkit-scrollbar {
  display: none;
}

.products-slider:active {
  cursor: grabbing;
}

.product-slide {
  flex: 0 0 calc(25% - 0.75rem);
  min-width: 250px;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: white;
  border: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.carousel-btn:hover:not(:disabled) {
  background: #f8f9fa;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.carousel-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.carousel-btn-prev {
  left: 0;
}

.carousel-btn-next {
  right: 0;
}

.carousel-btn i {
  font-size: 1.25rem;
  color: #212529;
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #dee2e6;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot:hover {
  background: #adb5bd;
}

.dot.active {
  background: #198754;
  width: 24px;
  border-radius: 5px;
}

@media (max-width: 1200px) {
  .product-slide {
    flex: 0 0 calc(33.333% - 0.67rem);
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.5rem;
  }

  .carousel-container {
    padding: 0 35px;
  }

  .product-slide {
    flex: 0 0 calc(50% - 0.5rem);
    min-width: 200px;
  }

  .carousel-btn {
    width: 35px;
    height: 35px;
  }

  .carousel-btn i {
    font-size: 1rem;
  }
}

@media (max-width: 576px) {
  .product-slide {
    flex: 0 0 calc(100% - 0rem);
    min-width: 280px;
  }

  .carousel-container {
    padding: 0 40px;
  }
}
</style>
