<template>
  <div class="profile-page">
    <div class="container py-4">
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
          <button class="btn btn-sm btn-outline-secondary" @click="cancelForm">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="info-card-body">
          <form @submit.prevent="addCard">
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label">Card Number *</label>
                <input 
                  v-model="newCard.number" 
                  type="text" 
                  class="form-control" 
                  placeholder="1234 5678 9012 3456"
                  maxlength="19"
                  @input="formatCardNumber"
                  required 
                />
              </div>
              <div class="col-12">
                <label class="form-label">Cardholder Name *</label>
                <input v-model="newCard.name" type="text" class="form-control" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">Expiry Date *</label>
                <input 
                  v-model="newCard.expiry" 
                  type="text" 
                  class="form-control" 
                  placeholder="MM/YY"
                  maxlength="5"
                  @input="formatExpiry"
                  required 
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">CVV *</label>
                <input 
                  v-model="newCard.cvv" 
                  type="text" 
                  class="form-control" 
                  placeholder="123"
                  maxlength="4"
                  required 
                />
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
                <button type="submit" class="btn btn-primary btn-sm">
                  <i class="bi bi-check-circle me-2"></i>Save Card
                </button>
                <button type="button" class="btn btn-outline-secondary btn-sm ms-2" @click="cancelForm">Cancel</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="info-card">
        <div class="loading-state">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3">Loading payment methods...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="cards.length === 0 && !showAddCard" class="info-card">
        <div class="empty-state">
          <i class="bi bi-credit-card"></i>
          <h4 class="mt-3">No payment methods saved</h4>
          <p class="text-muted">Add a payment method for faster checkout</p>
          <button class="btn btn-primary btn-sm" @click="showAddCard = true">
            <i class="bi bi-plus-circle"></i>
            <span>Add Card</span>
          </button>
        </div>
      </div>

      <!-- Cards List -->
      <div v-else-if="!showAddCard" class="row g-3">
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
              <button 
                v-if="!card.isDefault" 
                class="btn btn-sm btn-outline-light me-2"
                @click="setDefault(card.id)"
              >
                Set as Default
              </button>
              <button class="btn btn-sm btn-outline-light" @click="deleteCard(card.id)">
                <i class="bi bi-trash me-1"></i>Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Card {
  id: number
  type: string
  last4: string
  name: string
  expiry: string
  isDefault: boolean
}

const showAddCard = ref(false)
const cards = ref<Card[]>([])
const isLoading = ref(true)

const newCard = ref({
  number: '',
  name: '',
  expiry: '',
  cvv: '',
  isDefault: false
})

onMounted(async () => {
  await loadCards()
})

async function loadCards() {
  try {
    const saved = localStorage.getItem('cards')
    if (saved) {
      cards.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('Failed to load cards:', error)
  } finally {
    isLoading.value = false
  }
}

function formatCardNumber(event: Event) {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\s/g, '')
  let formatted = value.match(/.{1,4}/g)?.join(' ') || value
  newCard.value.number = formatted
}

function formatExpiry(event: Event) {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2, 4)
  }
  newCard.value.expiry = value
}

function getCardType(number: string): string {
  const cleanNumber = number.replace(/\s/g, '')
  if (cleanNumber.startsWith('4')) return 'Visa'
  if (cleanNumber.startsWith('5')) return 'Mastercard'
  if (cleanNumber.startsWith('3')) return 'American Express'
  return 'Card'
}

const addCard = async () => {
  try {
    const cardType = getCardType(newCard.value.number)
    const last4 = newCard.value.number.replace(/\s/g, '').slice(-4)
    
    const card: Card = {
      id: Date.now(),
      type: cardType,
      last4: last4,
      name: newCard.value.name,
      expiry: newCard.value.expiry,
      isDefault: newCard.value.isDefault
    }
    
    cards.value.push(card)
    localStorage.setItem('cards', JSON.stringify(cards.value))
    cancelForm()
  } catch (error) {
    console.error('Failed to add card:', error)
    alert('Failed to add card. Please try again.')
  }
}

const setDefault = async (id: number) => {
  try {
    cards.value.forEach(card => {
      card.isDefault = card.id === id
    })
    localStorage.setItem('cards', JSON.stringify(cards.value))
  } catch (error) {
    console.error('Failed to set default:', error)
    alert('Failed to set default card. Please try again.')
  }
}

const deleteCard = async (id: number) => {
  if (confirm('Are you sure you want to remove this card?')) {
    try {
      cards.value = cards.value.filter(c => c.id !== id)
      localStorage.setItem('cards', JSON.stringify(cards.value))
    } catch (error) {
      console.error('Failed to delete card:', error)
      alert('Failed to remove card. Please try again.')
    }
  }
}

const cancelForm = () => {
  showAddCard.value = false
  newCard.value = {
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    isDefault: false
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.container {
  max-width: 1200px;
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

.info-card-header .btn {
  padding: 0.35rem 0.9rem;
  font-size: 0.85rem;
}

.info-card-body {
  padding: 1.5rem;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 3rem 2rem;
}

.empty-state i {
  font-size: 3.5rem !important;
  opacity: 0.2;
  color: #6c757d;
  margin-bottom: 1rem;
}

.empty-state h4 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #212529;
}

.empty-state p {
  font-size: 0.95rem;
  margin-bottom: 1.25rem;
  color: #6c757d;
}

/* CRITICAL: Small button for empty state */
.empty-state .btn {
  padding: 0.35rem 0.9rem !important;
  font-size: 0.85rem !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 0.35rem !important;
  width: auto !important;
}

.empty-state .btn i {
  font-size: 0.85rem !important;
  margin: 0 !important;
}

.btn-primary {
  background-color: #141B3E !important;
  border-color: #141B3E !important;
}

.btn-primary:hover {
  background-color: #0d1228 !important;
  border-color: #0d1228 !important;
}

.card-item {
  background: linear-gradient(135deg, #141B3E 0%, #0d1228 100%);
  color: white;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  height: 100%;
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
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.card-footer-custom .btn {
  padding: 0.35rem 0.9rem;
  font-size: 0.85rem;
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

@media (max-width: 768px) {
  .profile-page {
    padding-top: 1rem;
  }

  .info-card-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .info-card-header .btn {
    width: 100%;
  }

  .card-footer-custom {
    flex-direction: column;
  }

  .card-footer-custom .btn {
    width: 100%;
  }
}
</style>