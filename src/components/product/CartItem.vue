<template>
  <div class="card border rounded-3 mb-3 cart-item-card position-relative">
    <!-- Remove Button (Top Right) -->
    <button
      @click="showRemoveModal = true"
      class="btn-close position-absolute top-0 end-0 m-3"
      aria-label="Remove item"
      style="z-index: 10;"
    ></button>

    <div class="card-body p-3 pe-5">
      <div class="row g-3 align-items-center">
        <!-- Product Image -->
        <div class="col-auto">
          <div class="product-image rounded-2 overflow-hidden" @click="goToProduct" style="cursor: pointer;">
            <img :src="item.image" :alt="item.name" class="img-fluid" style="width: 100px; height: 100px; object-fit: cover;" />
          </div>
        </div>

        <!-- Product Details -->
        <div class="col">
          <h3 class="h6 mb-2 fw-semibold product-name" @click="goToProduct" style="cursor: pointer; color: #0d1228;">
            {{ item.name }}
          </h3>
          <p class="text-muted small mb-2">{{ item.description }}</p>

          <!-- Price -->
          <div class="d-flex align-items-center gap-2 mb-2">
            <template v-if="!item.price || item.price === 0">
              <span class="fw-bold">${{ (item.originalPrice || 0).toFixed(2) }}</span>
            </template>
            <template v-else>
              <span class="fw-bold">${{ item.price.toFixed(2) }}</span>
              <span v-if="item.originalPrice" class="text-muted text-decoration-line-through small">
                ${{ item.originalPrice.toFixed(2) }}
              </span>
            </template>
          </div>

          <span class="text-muted" style="font-size: 0.75rem;">SKU: {{ item.sku }}</span>
        </div>

        <!-- Quantity & Actions -->
        <div class="col-auto">
          <div class="d-flex flex-column align-items-end gap-3 pe-2">
            <!-- Quantity Controls -->
            <div class="input-group" style="width: 140px;">
              <button
                @click="$emit('decrease')"
                class="btn btn-outline-secondary"
                type="button"
                :disabled="item.quantity <= 1"
              >
                <i class="bi bi-dash"></i>
              </button>
              <input
                type="text"
                class="form-control text-center fw-semibold"
                :value="item.quantity"
                readonly
                style="max-width: 60px;"
              />
              <button
                @click="$emit('increase')"
                class="btn btn-outline-secondary"
                type="button"
                :disabled="item.quantity >= item.stock"
              >
                <i class="bi bi-plus"></i>
              </button>
            </div>

            <!-- Subtotal -->
            <div class="fw-bold fs-5" style="color: #0d1228;">
              ${{ ((item.price && item.price > 0 ? item.price : item.originalPrice || 0) * item.quantity).toFixed(2) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Remove Confirmation Modal -->
  <div v-if="showRemoveModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5);">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 shadow-lg">
        <div class="modal-header border-0 pb-0">
          <h5 class="modal-title fw-bold" style="color: #0d1228;">Remove Item</h5>
          <button type="button" class="btn-close" @click="showRemoveModal = false"></button>
        </div>
        <div class="modal-body">
          <p class="mb-0">Are you sure you want to remove <strong>{{ item.name }}</strong> from your cart?</p>
        </div>
        <div class="modal-footer border-0 pt-0">
          <button type="button" class="btn btn-secondary" @click="showRemoveModal = false">
            Cancel
          </button>
          <button type="button" class="btn btn-danger" @click="confirmRemove">
            <i class="bi bi-trash me-2"></i>Remove
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { CartItem } from '@/stores/cartStore'

interface Props {
  item: CartItem
}

const props = defineProps<Props>()

const emit = defineEmits<{
  increase: []
  decrease: []
  remove: []
}>()

const showRemoveModal = ref(false)
const router = useRouter()

const confirmRemove = () => {
  showRemoveModal.value = false
  emit('remove')
}

const goToProduct = () => {
  router.push({ name: 'ProductDetail', params: { id: props.item._id } })
}
</script>

<style scoped>
.cart-item-card {
  transition: box-shadow 0.2s ease;
}

.cart-item-card:hover {
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.08);
}

.product-name:hover {
  color: #1a2642 !important;
}

.btn-outline-secondary {
  border-color: #0d1228;
  color: #0d1228;
}

.btn-outline-secondary:hover:not(:disabled) {
  background-color: #0d1228;
  border-color: #0d1228;
  color: white;
}

.btn-outline-secondary:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-link:hover {
  text-decoration: underline !important;
}

.btn-close:hover {
  opacity: 1;
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .col-auto:last-child {
    width: 100%;
  }

  .col-auto:last-child > div {
    flex-direction: row !important;
    justify-content: space-between;
    align-items: center;
    padding-top: 0.75rem;
    border-top: 1px solid #e9ecef;
  }
}
</style>
