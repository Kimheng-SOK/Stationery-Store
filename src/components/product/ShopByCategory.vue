<template>
  <section class="shop-by-category py-5 bg-light">
    <div class="container">
      <!-- Section Header -->
      <div class="text-center mb-5">
        <h2 class="section-title mb-2">Shop by Category</h2>
        <p class="section-subtitle text-muted">Find exactly what you're looking for</p>
      </div>

      <!-- Categories Carousel -->
      <div class="carousel-container position-relative">
        <!-- Previous Button -->
        <button
          class="carousel-btn carousel-btn-prev"
          @click="scrollCarousel('prev')"
          :disabled="isAtStart"
        >
          <i class="bi bi-chevron-left"></i>
        </button>

        <!-- Categories Slider -->
        <div
          class="categories-slider"
          ref="sliderRef"
          @mousedown="startDrag"
          @mousemove="drag"
          @mouseup="stopDrag"
          @mouseleave="stopDrag"
          @touchstart="startDrag"
          @touchmove="drag"
          @touchend="stopDrag"
        >
          <div v-for="category in categories" :key="category.id" class="category-slide">
            <div class="category-card" @click="goToCategory(category)">
              <div class="category-image-wrapper">
                <img :src="category.image" :alt="category.name" class="category-image" />
              </div>
              <h5 class="category-name">{{ category.name }}</h5>
            </div>
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
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

interface Category {
  id: number
  name: string
  image: string
  slug: string
}

const router = useRouter()
const sliderRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)
const currentDot = ref(0)

const categories = ref<Category[]>([
  {
    id: 1,
    name: 'Notebooks',
    image: '/public/images/notebooks/book1.jpg',
    slug: 'notebooks',
  },
  {
    id: 2,
    name: 'Pens & Pencils',
    image: '/public/images/pens&pencils/pen1.jpg',
    slug: 'pens-pencils',
  },
  {
    id: 3,
    name: 'Office Supplies',
    image: '/public/images/officeSupplies/office1.jpg',
    slug: 'office-supplies',
  },
  {
    id: 4,
    name: 'Art Supplies',
    image: '/public/images/artSupplies/art1.jpg',
    slug: 'art-supplies',
  },
  {
    id: 5,
    name: 'Sticky Notes',
    image: '/public/images/stickyNote/stick1.jpg',
    slug: 'sticky-notes',
  },
])

onMounted(() => {
  if (sliderRef.value) {
    sliderRef.value.addEventListener('scroll', updateCurrentDot)
  }
})

const totalDots = computed(() => {
  return Math.ceil(categories.value.length / 4)
})

const isAtStart = computed(() => {
  return currentDot.value === 0
})

const isAtEnd = computed(() => {
  return currentDot.value >= totalDots.value - 1
})

const scrollCarousel = (direction: 'prev' | 'next') => {
  if (!sliderRef.value) return

  const slideWidth = sliderRef.value.querySelector('.category-slide')?.clientWidth || 0
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

  const slideWidth = sliderRef.value.querySelector('.category-slide')?.clientWidth || 0
  const gap = 16
  const scrollAmount = (slideWidth + gap) * 4 * index

  sliderRef.value.scrollTo({ left: scrollAmount, behavior: 'smooth' })
}

const updateCurrentDot = () => {
  if (!sliderRef.value) return

  const slideWidth = sliderRef.value.querySelector('.category-slide')?.clientWidth || 0
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

const goToCategory = (category: Category) => {
  router.push({
    path: '/shop',
    query: { category: category.slug },
  })
}
</script>

<style scoped>
.shop-by-category {
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

.categories-slider {
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

.categories-slider::-webkit-scrollbar {
  display: none;
}

.categories-slider:active {
  cursor: grabbing;
}

.category-slide {
  flex: 0 0 calc(25% - 0.75rem);
  min-width: 250px;
}

.category-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  text-align: center;
  padding-bottom: 1.5rem;
  height: 100%;
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.category-image-wrapper {
  width: 100%;
  height: 250px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.category-card:hover .category-image {
  transform: scale(1.1);
}

.category-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #212529;
  margin: 0;
  padding: 0 1rem;
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
  background: #6c757d;
  width: 24px;
  border-radius: 5px;
}

@media (max-width: 1200px) {
  .category-slide {
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

  .category-slide {
    flex: 0 0 calc(50% - 0.5rem);
    min-width: 200px;
  }

  .category-image-wrapper {
    height: 200px;
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
  .category-slide {
    flex: 0 0 calc(100% - 0rem);
    min-width: 280px;
  }

  .carousel-container {
    padding: 0 40px;
  }
}
</style>
