<template>
  <div class="w-full min-h-screen bg-gray-50 font-quicksand">
    <div class="flex flex-col lg:flex-row">
      <div class="relative w-full lg:w-1/2 flex justify-center items-center h-96 lg:h-screen bg-white">
        <button
          v-if="images.length > 1"
          @click="prevSlide"
          class="absolute top-12 left-6 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-50 flex items-center justify-center text-gray-800 transition"
        >
          <i class="fa fa-arrow-left text-xl"></i>
        </button>

        <div class="relative w-full h-full overflow-hidden">
          <div
            v-for="(image, index) in images"
            :key="index"
            :class="[
              'absolute w-full h-full transition-opacity duration-700 ease-in-out',
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            ]"
          >
            <img :src="image" alt="Book Image" class="w-full h-full object-cover">
          </div>

          <button
            v-if="images.length > 1"
            @click="prevSlide"
            class="absolute top-1/2 left-8 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-50 flex items-center justify-center text-gray-800 transition"
          >
            <i class="fa fa-chevron-left text-xl"></i>
          </button>

          <button
            v-if="images.length > 1"
            @click="nextSlide"
            class="absolute top-1/2 right-8 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-50 flex items-center justify-center text-gray-800 transition"
          >
            <i class="fa fa-chevron-right text-xl"></i>
          </button>

          <div class="absolute bottom-8 right-8 z-10 flex flex-col gap-2">
            <button class="w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-50 flex items-center justify-center transition">
              <i :class="slideLiked ? 'fas fa-heart text-red-500 text-xl' : 'far fa-heart text-xl'" @click="toggleSlideHeart"></i>
            </button>
            <button class="w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-50 flex items-center justify-center transition">
              <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
              </svg>
            </button>
          </div>
          <div v-if="images.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            <button
              v-for="(image, index) in images"
              :key="index"
              @click="goToSlide(index)"
              :class="[
                'h-2 rounded-full transition duration-1000',
                index === currentSlide ? 'bg-indigo-600 w-8' : 'bg-white/50 w-2'
              ]"
            />
          </div>
        </div>
      </div>

      <div class="w-full lg:w-1/2 p-8 lg:p-16 bg-gray-50">
        <div class="flex items-center gap-2 text-sm text-gray-500 mb-8 font-bold">
          <span>Books</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
          <span>Medicine</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
          <span class="text-gray-900 font-medium">Surgery</span>
        </div>

        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Brand Name - Product name,
        </h1>
        <p class="text-gray-600 mb-8 font-bold">
          its specifications and all other details of it
        </p>
        <div class="text-4xl text-gray-900 mb-8 font-bold">
          20$
        </div>
        <div class="flex items-center gap-4 mb-8">
          <div class="flex items-center gap-3">
            <button @click="decreaseQuantity" class="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded transition">
              <svg class="w-5 h-5 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
              </svg>
            </button>
            <span class="text-lg font-bold w-8 text-center">{{ quantity }}</span>
            <button @click="increaseQuantity" class="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded transition">
              <svg class="w-5 h-5 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
            </button>
          </div>
          <button class="w-50 h-12 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-bold">
            Add to cart
          </button>
        </div>
        <div class="text-sm font-bold pt-10">
          <span class="font-bold text-black">Barcode:</span> 8901425031926
        </div>
      </div>
    </div>

    <div class="p-12">
      <div class="mt-12 w-1/2">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Description</h2>

        <!-- FIXED READ MORE SECTION -->
        <p class="text-gray-600 text-sm leading-relaxed mb-4">
          {{ showFullDescription ? descriptionPage.description : descriptionPage.description.substring(0, 100) + '...' }}
        </p>

        <button class="text-indigo-600 font-bold text-sm hover:text-indigo-700" @click="toggleDescription">
          {{ showFullDescription ? 'Read less' : 'Read more' }}
        </button>
      </div>

      <div class="mt-12">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Product details</h2>
        <div class="space-y-4">
          <div class="flex justify-between text-sm py-3 border-b border-gray-200">
            <span class="text-gray-600 font-bold">ISBN :</span>
            <span class="text-gray-900 font-medium">{{ product_details.ISBNNumber }}</span>
          </div>
          <div class="flex justify-between text-sm py-3 border-b border-gray-200">
            <span class="text-gray-600 font-bold">Weight:</span>
            <span class="text-gray-900 font-medium">{{ product_details.weight }} g</span>
          </div>
          <div class="flex justify-between text-sm py-3 border-b border-gray-200">
            <span class="text-gray-600 font-bold">Author:</span>
            <span class="text-gray-900 font-medium">{{ product_details.authorName }}</span>
          </div>
          <div class="flex justify-between text-sm py-3 border-b border-gray-200">
            <span class="text-gray-600 font-bold">Dimensions:</span>
            <span class="text-gray-900 font-medium">{{ product_details.dimensions }} mm</span>
          </div>
          <div class="flex justify-between text-sm py-3 border-b border-gray-200">
            <span class="text-gray-600 font-bold">Pages:</span>
            <span class="text-gray-900 font-medium">{{ product_details.pageNumber }}</span>
          </div>
          <div class="flex justify-between text-sm py-3">
            <span class="text-gray-600 font-bold">Published in:</span>
            <span class="text-gray-900 font-medium">{{ product_details.publishIn }}</span>
          </div>
        </div>
      </div>

      <div class="w-full  py-16 ">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">Related products</h2>
        <div class="flex gap-6 overflow-x-auto scrollbar-hide pb-12">
          <div
            v-for="(product, index) in products"
            :key="index"
            class="group relative bg-gray-100 rounded-lg overflow-hidden shrink-0"
          >
            <div class="relative aspect-square w-65 h-75">
              <img :src="product.image" alt="Product" class="w-full h-full object-cover">

              <button class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-md hover:bg-gray-50 flex items-center justify-center transition">
                <i
                  :class="product.liked ? 'fas fa-heart text-red-500 text-xl' : 'far fa-heart text-xl'"
                  @click="product.liked = !product.liked"
                ></i>
              </button>
              <button class="absolute bottom-4 right-4 w-12 h-12 rounded-xl border-2 border-white bg-blue-900 hover:bg-blue-800 text-white flex items-center justify-center transition">
                <i class="fa-solid fa-shopping-cart"></i>
              </button>
            </div>

            <div class="p-4">
              <h3 class="text-sm font-medium text-gray-900 mb-1">{{ product.name }}</h3>
              <p class="text-xs text-gray-600 mb-3">{{ product.description }}</p>
              <p class="text-lg font-bold text-gray-900">{{ product.price }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { assets } from '../assets/assets'

const descriptionPage = ref({
  description: "Vestibulum eu quam nec neque pellentesque efficitur id eget nisl. Proin porta est convallis lacus blandit pretium sed non enim. Maecenas lacinia non orci at aliquam. Donec finibus, urna bibendum ultricies laoreet, augue eros luctus sapien, ut euismod leo tortor ac enim. In hac habitasse platea dictumst. Sed cursus venenatis tellus, non lobortis diam volutpat sit amet. Sed tellus augue, hendrerit eu rutrum in, porttitor at metus. Mauris ac hendrerit metus. Phasellus mattis lectus commodo felis egestas, id accumsan justo ultrices. Phasellus aliquet, sem a placerat dapibus, enim purus dictum lacus, nec ultrices ante dui ac ante. Phasellus placerat, urna."
})

const product_details = ref(
  {
    ISBNNumber: '978-3-16-148410-0',
    weight: '270',
    authorName: 'Judy DeFilippo, Charles Skidmore',
    dimensions: '210 × 276 × 10',
    pageNumber: '120',
    publishIn: 'Upper Saddle River United States'
  }
)

const products = ref([
  { image: assets.book_details ,  name: 'Brand Name - Acrylic painting pad', description: 'A4 | 360 gsm', price: 'AED 4.17', liked: false },
  { image: assets.book_details, name: 'Brand Name - Sketch pad', description: 'A5 | 200 gsm', price: 'AED 3.50', liked: false },
  { image: assets.book_details, name: 'Brand Name - Canvas board', description: '12x12', price: 'AED 6.00', liked: false },
  { image: assets.book_details, name: 'Brand Name - Watercolor pad', description: 'A4 | 300 gsm', price: 'AED 5.25', liked: false },
  { image: assets.book_details, name: 'Brand Name - Drawing pad', description: 'A3 | 350 gsm', price: 'AED 7.10', liked: false },
  { image: assets.book_details, name: 'Brand Name - Mixed media pad', description: 'A4 | 300 gsm', price: 'AED 6.50', liked: false },
])

const images = [assets.book_details, assets.facebook, assets.access, assets.google]
const currentSlide = ref(0)
const slideLiked = ref(false)
const showFullDescription = ref(false)

const quantity = ref(1)
const increaseQuantity = () => { if(quantity.value>0) quantity.value++ }
const decreaseQuantity = () => { if(quantity.value>1) quantity.value-- }

const nextSlide = () => { currentSlide.value = (currentSlide.value + 1) % images.length }
const prevSlide = () => { currentSlide.value = (currentSlide.value - 1 + images.length) % images.length }
const goToSlide = (index: number) => { currentSlide.value = index }

const toggleSlideHeart = () => { slideLiked.value = !slideLiked.value }
const toggleDescription = () => { showFullDescription.value = !showFullDescription.value }
</script>

<style>
.scrollbar-hide::-webkit-scrollbar { height: 8px; }
.scrollbar-hide::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.3); border-radius: 4px; }
.scrollbar-hide::-webkit-scrollbar-track { background: transparent; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: thin; }
</style>
