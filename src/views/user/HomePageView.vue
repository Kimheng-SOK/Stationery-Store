<script lang="ts">
import FeaturedProduct from '@/components/product/FeaturedProduct.vue'
import HeroSection from '@/components/product/HeroSection.vue'
import NewArrivalPreview from '@/components/product/NewArrivalPreview.vue'
import PopularProduct from '@/components/product/PopularProduct.vue'
import ShopByCategory from '@/components/product/ShopByCategory.vue'
import ReviewWebCard from '@/components/Review/ReviewWebCard.vue'

export default {
  name: 'HomePageView',
  components: {
    HeroSection,
    ShopByCategory,
    FeaturedProduct,
    PopularProduct,
    NewArrivalPreview,
    ReviewWebCard,
  },
}
</script>

<template>
  <div>
    <HeroSection />
    <ShopByCategory />
    <FeaturedProduct />
    <PopularProduct />
    <NewArrivalPreview />
    <ReviewWebCard />
  </div>
</template>
