<template>
  <div class="profile-page">
    <div class="container py-4">
      <div class="row g-4">
        <div class="col-lg-3 col-md-4">
          <ProfileSidebar />
        </div>

        <main class="col-lg-9 col-md-8">
          <div class="info-card mb-3">
            <div class="info-card-header">
              <h5 class="mb-0">Payment Methods</h5>
              <button class="btn btn-primary btn-sm" @click="showAddCard = true">
                <i class="bi bi-plus-circle me-2"></i>Add Card
              </button>
            </div>
          </div>

          <!-- Add Card Form -->
          <div v-if="showAddCard" class="info-card mb-3">
            <div class="info-card-header">
              <h6 class="mb-0">Add New Card</h6>
              <button class="btn btn-sm btn-outline-secondary" @click="showAddCard = false">
                <i class="bi bi-x"></i>
              </button>
            </div>
            <div class="info-card-body">
              <form @submit.prevent="addCard">
                <div class="row g-3">
                  <div class="col-12">
                    <label class="form-label">Card Number</label>
                    <input v-model="newCard.number" type="text" class="form-control" placeholder="1234 5678 9012 3456" required />
                  </div>
                  <div class="col-12">
                    <label class="form-label">Cardholder Name</label>
                    <input v-model="newCard.name" type="text" class="form-control" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Expiry Date</label>
                    <input v-model="newCard.expiry" type="text" class="form-control" placeholder="MM/YY" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">CVV</label>
                    <input v-model="newCard.cvv" type="text" class="form-control" placeholder="123" required />
                  </div>
                  <div class="col-12">
                    <div class="form-check">
                      <input v-model="newCard.isDefault" class="form-check-input" type="checkbox" id="defaultCard">
                      <label class="form-check-label" for="defaultCard">
                        Set as default payment method
                      </label>
                    </div>
                  </div>
                  <div class="col-12">
                    <button type="submit" class="btn btn-primary">Save Card</button>
                    <button type="button" class="btn btn-outline-secondary ms-2" @click="showAddCard = false">Cancel</button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <!-- Cards List -->
          <div class="row g-3">
            <div v-for="card in cards" :key="card.id" class="col-md-6">
              <div class="card-item">
                <div class="card-header-custom">
                  <div class="d-flex align-items-center">
                    <i class="bi bi-credit-card me-2" style="font-size: 1.5rem;"></i>
                    <div>
                      <h6 class="mb-0">{{ card.type }}</h6>
                      <small class="text-muted">**** **** **** {{ card.last4 }}</small>
                    </div>
                  </div>
                  <span v-if="card.isDefault" class="badge bg-success">Default</span>
                </div>
                <div class="card-body-custom">
                  <p class="mb-1"><strong>{{ card.name }}</strong></p>
                  <p class="mb-0 text-muted">Expires: {{ card.expiry }}</p>
                </div>
                <div class="card-footer-custom">
                  <button class="btn btn-sm btn-outline-light" @click="deleteCard(card.id)">
                    <i class="bi bi-trash me-1"></i>Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProfileSidebar from '@/components/ProfileSidebar.vue'

interface Card {
  id: number
  type: string
  last4: string
  name: string
  expiry: string
  isDefault: boolean
}

const showAddCard = ref(false)
const newCard = ref({
  number: '',
  name: '',
  expiry: '',
  cvv: '',
  isDefault: false
})

const cards = ref<Card[]>([
  {
    id: 1,
    type: 'Visa',
    last4: '4242',
    name: 'Robert Ford',
    expiry: '12/25',
    isDefault: true
  },
  {
    id: 2,
    type: 'Mastercard',
    last4: '5555',
    name: 'Robert Ford',
    expiry: '08/26',
    isDefault: false
  }
])

const addCard = () => {
  const card: Card = {
    id: Date.now(),
    type: 'Visa',
    last4: newCard.value.number.slice(-4),
    name: newCard.value.name,
    expiry: newCard.value.expiry,
    isDefault: newCard.value.isDefault
  }
  cards.value.push(card)
  showAddCard.value = false
  newCard.value = {
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    isDefault: false
  }
}

const deleteCard = (id: number) => {
  if (confirm('Are you sure you want to remove this card?')) {
    cards.value = cards.value.filter(c => c.id !== id)
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-top: 2rem;
}

.info-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.info-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.info-card-body {
  padding: 1.5rem;
}

.btn-primary {
  background-color: #141B3E;
  border-color: #141B3E;
}

.btn-primary:hover {
  background-color: #0d1228;
  border-color: #0d1228;
}

.card-item {
  background: linear-gradient(135deg, #141B3E 0%, #0d1228 100%);
  color: white;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.card-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(20, 27, 62, 0.3);
}

.card-header-custom {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.card-header-custom .text-muted {
  color: rgba(255, 255, 255, 0.7) !important;
}

.card-body-custom {
  margin-bottom: 1rem;
}

.card-body-custom .text-muted {
  color: rgba(255, 255, 255, 0.7) !important;
}

.card-footer-custom {
  padding-top: 1rem;
  border-top: 1px solid rgba(255,255,255,0.2);
}

.btn-outline-light {
  color: white;
  border-color: rgba(255, 255, 255, 0.5);
}

.btn-outline-light:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: white;
  color: white;
}
</style>