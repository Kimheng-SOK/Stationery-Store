

<template>
  <div class="cart-container">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6 text-center">
          <!-- Cart Icon with Wind Effect -->
          <div class="cart-icon-wrapper">
            <!-- Wind Lines -->
            <div class="wind-lines">
              <!-- <img src="../assets/image/ph_wind-light.png" alt=""> -->
            </div>

            <!-- <img src="../assets/image/Combined-Shape.png" alt=""> -->

            <!-- Shadow -->
            <!-- <img src="../assets/image/EllipseBlue.png" alt="" class="cart-shadow"> -->
          </div>

          <!-- Text Content -->
          <h1>{{ title }}</h1>
          <p class="subtitle">{{ subtitle }}</p>

          <!-- Explore Button -->
           <router-link to="/shop">
            <button class="explore-btn" @click="exploreProducts">
              {{ buttonText }}
              <span class="arrow">→</span>
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';

export default {
  name: 'EmptyCart',
  setup() {
    const title = ref('Hey, The cart feels light !');
    const subtitle = ref('Explore products and add your favorite items');
    const buttonText = ref('Explore');

    const exploreProducts = () => {
      console.log('Exploring products...');
      alert('Redirecting to products page...');
    };

    onMounted(() => {
      console.log('Empty Cart component mounted!');
    });

    return {
      title,
      subtitle,
      buttonText,
      exploreProducts
    };
  }
};
</script>

<style scoped>
.cart-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.cart-icon-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 2rem;
  animation: float 3s ease-in-out infinite;
}

.cart-icon {
  width: 140px;
  height: 140px;
}

.cart-base {
  fill: none;
  stroke: #2c3e50;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.cart-line {
  fill: none;
  stroke: #2c3e50;
  stroke-width: 2.5;
  stroke-linecap: round;
}

.cart-wheel {
  fill: #2c3e50;
}

.wind-lines {
  position: absolute;
  left: -60px;
  top: 50%;
  transform: translateY(-50%);
}

.wind-line {
  fill: none;
  stroke: #cbd5e0;
  stroke-width: 2;
  stroke-linecap: round;
  opacity: 0.6;
}

.cart-shadow {
   padding-right: 20%;
}

h1 {
  color: #2c3e50;
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.subtitle {
  color: #6c757d;
  font-size: 1rem;
  margin-bottom: 2rem;
}

.explore-btn {
  background-color: #1e293b;
  color: white;
  border: none;
  padding: 0.875rem 2.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.explore-btn:hover {
  background-color: #0f172a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 41, 59, 0.3);
}

.arrow {
  font-size: 1.25rem;
  transition: transform 0.3s ease;
}

.explore-btn:hover .arrow {
  transform: translateX(4px);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>

