<template>
  <div class="carousel-wrapper">
    <div class="carousel-container position-relative">
      <!-- Previous Button -->
      <button
        v-if="showNavigation"
        class="carousel-btn carousel-btn-prev"
        @click="scrollCarousel('prev')"
        :disabled="isAtStart"
      >
        <i class="bi bi-chevron-left"></i>
      </button>

      <!-- Carousel Slider -->
      <div
        class="carousel-slider"
        ref="sliderRef"
        @mousedown="startDrag"
        @mousemove="drag"
        @mouseup="stopDrag"
        @mouseleave="stopDrag"
        @touchstart="startDrag"
        @touchmove="drag"
        @touchend="stopDrag"
      >
        <div
          v-for="(item, index) in items"
          :key="index"
          class="carousel-slide"
          :style="slideStyle"
        >
          <slot name="item" :item="item" :index="index">
            <!-- Default slot content if no slot provided -->
            <div class="default-slide-content">{{ item }}</div>
          </slot>
        </div>
      </div>

      <!-- Next Button -->
      <button
        v-if="showNavigation"
        class="carousel-btn carousel-btn-next"
        @click="scrollCarousel('next')"
        :disabled="isAtEnd"
      >
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>

    <!-- Dots Indicator -->
    <div v-if="showDots" class="carousel-dots text-center mt-4">
      <span
        v-for="(dot, index) in totalDots"
        :key="index"
        class="dot"
        :class="{ active: index === currentDot }"
        @click="goToSlide(index)"
      ></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'

interface Props {
  items: unknown[]
  itemsPerSlide?: number
  gap?: number
  showNavigation?: boolean
  showDots?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
  minSlideWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  itemsPerSlide: 4,
  gap: 16,
  showNavigation: true,
  showDots: true,
  autoPlay: false,
  autoPlayInterval: 3000,
  minSlideWidth: 250,
})

const sliderRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)
const currentDot = ref(0)
let autoPlayTimer: ReturnType<typeof setInterval> | null = null

const slideStyle = computed(() => ({
  flex: `0 0 calc(${100 / props.itemsPerSlide}% - ${(props.gap * (props.itemsPerSlide - 1)) / props.itemsPerSlide}px)`,
  minWidth: `${props.minSlideWidth}px`,
}))

const totalDots = computed(() => {
  return Math.ceil(props.items.length / props.itemsPerSlide)
})

const isAtStart = computed(() => {
  return currentDot.value === 0
})

const isAtEnd = computed(() => {
  return currentDot.value >= totalDots.value - 1
})

const scrollCarousel = (direction: 'prev' | 'next') => {
  if (!sliderRef.value) return

  const slideWidth = sliderRef.value.querySelector('.carousel-slide')?.clientWidth || 0
  const scrollAmount = (slideWidth + props.gap) * props.itemsPerSlide

  if (direction === 'next') {
    sliderRef.value.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  } else {
    sliderRef.value.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
  }
}

const goToSlide = (index: number) => {
  if (!sliderRef.value) return

  const slideWidth = sliderRef.value.querySelector('.carousel-slide')?.clientWidth || 0
  const scrollAmount = (slideWidth + props.gap) * props.itemsPerSlide * index

  sliderRef.value.scrollTo({ left: scrollAmount, behavior: 'smooth' })
}

const updateCurrentDot = () => {
  if (!sliderRef.value) return

  const slideWidth = sliderRef.value.querySelector('.carousel-slide')?.clientWidth || 0
  const scrollPosition = sliderRef.value.scrollLeft
  const slideGroup = (slideWidth + props.gap) * props.itemsPerSlide

  currentDot.value = Math.round(scrollPosition / slideGroup)
}

const startDrag = (e: MouseEvent | TouchEvent) => {
  if (!sliderRef.value) return

  isDragging.value = true
  sliderRef.value.style.cursor = 'grabbing'

  let pageX: number
  if (e instanceof MouseEvent) {
    pageX = e.pageX
  } else if ('touches' in e && Array.isArray(e.touches) ? e.touches.length > 0 : (e.touches && e.touches.length > 0)) {
    pageX = e.touches && e.touches[0] ? e.touches[0].pageX : 0
    if (!e.touches || !e.touches[0]) return
  } else {
    return
  }
  startX.value = pageX - (sliderRef.value.offsetLeft ?? 0)
  scrollLeft.value = sliderRef.value.scrollLeft ?? 0
}

const drag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value || !sliderRef.value) return

  e.preventDefault()

  let pageX: number
  if (e instanceof MouseEvent) {
    pageX = e.pageX
  } else if ('touches' in e && Array.isArray(e.touches) && e.touches.length > 0) {
    pageX = e.touches[0].pageX
  } else {
    return
  }
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

const startAutoPlay = () => {
  if (props.autoPlay && !autoPlayTimer) {
    autoPlayTimer = setInterval(() => {
      if (isAtEnd.value) {
        goToSlide(0)
      } else {
        scrollCarousel('next')
      }
    }, props.autoPlayInterval)
  }
}

const stopAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

onMounted(() => {
  if (sliderRef.value) {
    sliderRef.value.addEventListener('scroll', updateCurrentDot)
  }
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
  if (sliderRef.value) {
    sliderRef.value.removeEventListener('scroll', updateCurrentDot)
  }
})
</script>

<style scoped>
.carousel-wrapper {
  width: 100%;
}

.carousel-container {
  position: relative;
  padding: 0 50px;
}

.carousel-slider {
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

.carousel-slider::-webkit-scrollbar {
  display: none;
}

.carousel-slider:active {
  cursor: grabbing;
}

.carousel-slide {
  flex-shrink: 0;
}

.default-slide-content {
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
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

@media (max-width: 768px) {
  .carousel-container {
    padding: 0 35px;
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
  .carousel-container {
    padding: 0 40px;
  }
}
</style>
