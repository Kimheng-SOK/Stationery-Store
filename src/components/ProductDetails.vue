<template>
  <div class="container-fluid my-5 px-4">

    <!-- TOP SECTION -->
    <div class="row g-4 align-items-start main-row">

      <!-- LEFT : IMAGE -->
      <div class="col-12 col-md-6 left-container">
        <div class="left-wrapper">
          <div class="image-box">

            <button class="back-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
              </svg>
            </button>

            <div class="image-container">
              <img
                src="../assets/image/book_details.png"
                alt="Product Image"
              />
            </div>

            <button class="icon-btn favorite-btn" :class="{ 'active': isFavorite }" @click="toggleMainFavorite">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path v-if="!isFavorite" d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                <path v-else d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
              </svg>
            </button>

            <button class="icon-btn fullscreen-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707zm0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707zm-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707z"/>
              </svg>
            </button>

          </div>
        </div>
      </div>

      <!-- RIGHT : CONTENT -->
      <div class="col-12 col-md-6 content-box right-container mt-5">

        <div class="breadcrumb-text">
          Books → Medicine → <strong>Surgery</strong>
        </div>

        <h3 class="product-title">
          Brand Name - Product name,<br />
          its specifications and all other details of it
        </h3>

        <div class="price-section">
          <div class="price-info">
            <span class="price-label">Unit Price:</span>
            <span class="unit-price">{{ currency }}{{ basePrice.toFixed(2) }}</span>
          </div>
          <h2 class="product-price">Total: {{ currency }}{{ totalPrice.toFixed(2) }}</h2>
        </div>

        <div class="d-flex align-items-center gap-3 qty-cart-wrapper">
          <div class="qty-box">
            <button class="qty-btn" @click="decreaseQty">−</button>
            <span class="qty-number">{{ qty }}</span>
            <button class="qty-btn" @click="increaseQty">+</button>
          </div>

          <button class="btn-add-cart">
            Add to cart
          </button>
        </div>

        <p class="barcode-text">
          Barcode: 8901425031926
        </p>

        <!-- DESCRIPTION -->
        <div class="description-box">
          <h4 class="font-bold">Description</h4>
          <p class="description-text">
            Vestibulum eu quam nec neque pellentesque efficitur id eget nisl.
            Proin porta est convallis lacus blandit pretium sed non enim.
            Maecenas lacinia non orci at aliquam. Donec finibus, urna bibendum
            ultricies laoreet, augue eros luctus sapien, ut euismod leo tortor ac
            enim. In hac habitasse platea dictumst. Sed cursus venenatis tellus,
            non lobortis diam vulutpat sit amet. Sed tellus augue, hendrerit eu
            rutrum in, porttitor at metus. Mauris ac hendrerit metus. Phasellus
            mattis lectus commodo felis egestas, id accumsan justo ultrices.
            Phasellus aliquet, sem a placerat dapibus, enim purus dictum lacus,
          </p>
        </div>

      </div>
    </div>

    <!-- PRODUCT DETAILS - FULL WIDTH -->
    <div class="row mt-48">
      <div class="col-12">
        <div class="product-details-box">
          <h4 class="font-bold">Product details</h4>
          <div class="details-list">
            <div 
              class="detail-item" 
              v-for="(detail, index) in productDetails" 
              :key="index"
            >
              <span class="detail-label">{{ detail.label }}</span>
              <span class="detail-value">{{ detail.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- RELATED PRODUCTS -->
    <div class="row mt-5">
      <div class="col-12">
        <h4 class="related-title">Related products</h4>
        <div class="related-products-wrapper">
          <div class="related-products-scroll">
            <div 
              class="product-card" 
              v-for="product in relatedProducts" 
              :key="product.id"
              @click="viewProduct(product.id)"
            >
              <div class="product-card-image">
                <img :src="product.image" :alt="product.name" />
                <button class="card-icon-btn favorite" :class="{ 'active': product.isFavorite }" @click.stop="toggleFavorite(product.id)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path v-if="!product.isFavorite" d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                    <path v-else d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                  </svg>
                </button>
                <button class="card-icon-btn cart" @click.stop="addToCart(product.id)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                  </svg>
                </button>
              </div>
              <div class="product-card-info">
                <h5 class="product-card-name">{{ product.name }}</h5>
                <p class="product-card-description">{{ product.description }}</p>
                <p class="product-card-price">{{ product.price }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
// Import image - using book_details.png for all products for now
// TODO: Replace with actual product images (book1.png, book2.png, etc.)
import bookImage from '../assets/image/book_details.png';

export default {
  name: "ProductDetail",
  data() {
    return {
      qty: 1,
      basePrice: 20, // Base price per unit
      currency: '$',
      isFavorite: false, // Main product favorite state
      productDetails: [
        { label: 'ISBN :', value: '978-3-16-148410-0' },
        { label: 'Weight:', value: '270 g' },
        { label: 'Author:', value: 'Judy DeFilippo, Charles Skidmore' },
        { label: 'Dimensions:', value: '210 × 276 × 10 mm' },
        { label: 'Pages:', value: '120' },
        { label: 'Published in:', value: 'Upper Saddle River United States' }
      ],
      relatedProducts: [
        {
          id: 1,
          image: bookImage,
          name: 'Brand Name - Acrylic painting pad',
          description: 'A4 | 360 gsm',
          price: 'AED 4.17',
          isFavorite: false
        },
        {
          id: 2,
          image: bookImage,
          name: 'Brand Name - Acrylic painting pad',
          description: 'A4 | 250 gsm',
          price: 'AED 3.97',
          isFavorite: false
        },
        {
          id: 3,
          image: bookImage,
          name: 'Brand Name - Acrylic painting pad',
          description: 'A3 | 360 gsm',
          price: 'AED 5.85',
          isFavorite: false
        },
        {
          id: 4,
          image: bookImage,
          name: 'Brand Name - Acrylic painting pad',
          description: 'A5 | 200 gsm',
          price: 'AED 3.25',
          isFavorite: false
        },
        {
          id: 5,
          image: bookImage,
          name: 'Brand Name - Acrylic painting pad',
          description: 'A4 | 300 gsm',
          price: 'AED 4.50',
          isFavorite: false
        },
        {
          id: 6,
          image: bookImage,
          name: 'Brand Name - Acrylic painting pad',
          description: 'A3 | 400 gsm',
          price: 'AED 6.20',
          isFavorite: false
        }
      ]
    };
  },
  computed: {
    // Calculate total price based on quantity
    totalPrice() {
      return this.basePrice * this.qty;
    }
  },
  methods: {
    increaseQty() {
      this.qty++;
    },
    decreaseQty() {
      if (this.qty > 1) {
        this.qty--;
      }
    },
    toggleMainFavorite() {
      this.isFavorite = !this.isFavorite;
      console.log('Main product favorite:', this.isFavorite);
    },
    toggleFavorite(productId) {
      const product = this.relatedProducts.find(p => p.id === productId);
      if (product) {
        product.isFavorite = !product.isFavorite;
        console.log(`Product ${productId} favorite:`, product.isFavorite);
      }
    },
    addToCart(productId) {
      console.log('Add to cart:', productId);
      // Add to cart logic here
    },
    viewProduct(productId) {
      console.log('View product:', productId);
      // Navigate to product detail page
    }
  }
};
</script>

<style scoped>
/* MAIN ROW */
.main-row {
  display: flex;
  flex-wrap: nowrap;
  min-height: 85vh;
  max-height: 85vh;
}

/* CONTAINER WIDTHS */
.left-container {
  width: 50%;
  max-width: 50%;
  flex: 0 0 50%;
  height: 100vh;
}

.left-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.right-container {
  width: 50%;
  max-width: 50%;
  flex: 0 0 50%;
  height: 100vh;
  overflow-y: auto;
}

/* IMAGE BOX */
.image-box {
  position: relative;
  flex: 1;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* IMAGE */
.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 2rem;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* ICON BUTTONS */
.back-btn,
.icon-btn {
  position: absolute;
  width: 44px;
  height: 44px;
  background: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.back-btn {
  top: 1rem;
  left: 1rem;
  border-radius: 10px;
}

.favorite-btn {
  bottom: 1rem;
  right: 4rem;
}

.favorite-btn.active {
  color: #ff4757;
}

.favorite-btn.active:hover {
  color: #ee5a6f;
}

.fullscreen-btn {
  bottom: 1rem;
  right: 1rem;
}

/* PAGINATION DOTS */
.pagination-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 1rem;
}

/* RIGHT CONTENT */
.content-box {
  padding-left: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.breadcrumb-text {
  font-size: 0.9rem;
  color: #666;
}

.product-title {
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 1.6;
  color: #1a1a1a;
}

/* PRICE SECTION */
.price-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.price-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-label {
  font-size: 0.95rem;
  color: #666;
}

.unit-price {
  font-size: 1rem;
  color: #666;
  font-weight: 500;
}

.product-price {
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

/* QTY AND CART WRAPPER */
.qty-cart-wrapper {
  display: flex !important;
  flex-direction: row !important;
  align-items: center;
  gap: 1rem;
  flex-wrap: nowrap;
}

/* QTY */
.qty-box {
  display: flex;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  flex-shrink: 0;
}

.qty-btn {
  width: 45px;
  height: 45px;
  border: none;
  background: white;
  cursor: pointer;
  font-size: 1.2rem;
  color: #333;
  transition: background 0.2s;
}

.qty-btn:hover {
  background: #f5f5f5;
}

.qty-number {
  width: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

/* ADD TO CART */
.btn-add-cart {
  background: #6dbb57;
  color: white;
  border: none;
  padding: 0.75rem 2.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-add-cart:hover {
  background: #5da849;
}

/* BARCODE */
.barcode-text {
  font-size: 0.9rem;
  color: #333;
  margin: 0;
}

/* DESCRIPTION */
.description-box {
  max-width: 100%;
  padding-top: 1rem;
}

.description-box h4 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a1a1a;
}

.description-text {
  color: #444;
  line-height: 1.8;
  font-size: 0.95rem;
}

/* PRODUCT DETAILS */
.product-details-box {
  max-width: 100%;
  padding-top: 2rem;
}

.product-details-box h4 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1a1a1a;
}

.details-list {
  display: flex;
  flex-direction: column;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #e5e5e5;
}

.detail-item:first-child {
  padding-top: 0;
}

.detail-label {
  font-size: 0.95rem;
  color: #1a1a1a;
  font-weight: 400;
}

.detail-value {
  font-size: 0.95rem;
  color: #1a1a1a;
  text-align: right;
}

/* RELATED PRODUCTS */
.related-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1a1a1a;
}

.related-products-wrapper {
  width: 100%;
  overflow: hidden;
}

.related-products-scroll {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 1rem;
  scroll-behavior: smooth;
}

.related-products-scroll::-webkit-scrollbar {
  height: 8px;
}

.related-products-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.related-products-scroll::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.related-products-scroll::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.product-card {
  min-width: 280px;
  max-width: 280px;
  flex-shrink: 0;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.product-card-image {
  position: relative;
  width: 100%;
  height: 280px;
  background: #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-icon-btn {
  position: absolute;
  width: 40px;
  height: 40px;
  background: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s;
}

.card-icon-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.card-icon-btn.favorite {
  top: 1rem;
  right: 1rem;
}

.card-icon-btn.favorite.active {
  color: #ff4757;
}

.card-icon-btn.favorite.active:hover {
  color: #ee5a6f;
}

.card-icon-btn.cart {
  bottom: 1rem;
  right: 1rem;
  background: #2c3e50;
  color: white;
}

.card-icon-btn.cart:hover {
  background: #1a252f;
}

.product-card-info {
  padding: 1rem;
}

.product-card-name {
  font-size: 1rem;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.product-card-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.75rem;
}

.product-card-price {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

/* MOBILE */
@media (max-width: 768px) {
  .main-row {
    flex-wrap: wrap;
    min-height: auto;
    max-height: none;
  }

  .left-container,
  .right-container {
    width: 100%;
    max-width: 100%;
    flex: 0 0 100%;
    height: auto;
    overflow-y: visible;
  }

  .left-wrapper {
    height: auto;
  }

  .image-box {
    height: 450px;
  }

  .content-box {
    padding-left: 0;
    margin-top: 2rem;
  }

  .image-container img {
    width: 90%;
  }

  .product-title {
    font-size: 1.2rem;
  }

  .product-price {
    font-size: 1.75rem;
  }

  .related-title {
    font-size: 1.3rem;
  }

  .product-card {
    min-width: 240px;
    max-width: 240px;
  }

  .product-card-image {
    height: 240px;
  }
}
</style>