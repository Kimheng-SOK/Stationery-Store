import { defineStore } from 'pinia'

// Updated interface to handle backend _id (string)
export interface CartItem {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  sku: string;
  category: string;
  brand?: string;
  badge?: string;
  description?: string;
  delivery: string;
  stock: number;
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    couponCode: '',
    shippingMethod: 'shipping' as 'shipping' | 'pickup',
    deliverTogether: false,
    baseUrl: 'http://localhost:5000' 
  }),

  getters: {
    totalItems: (state) => {
      return state.items.reduce((sum, item) => sum + item.quantity, 0)
    },

   itemTotal: (state) => {
      return state.items.reduce((sum, item) => {
        const price = item.price && item.price > 0 ? item.price : (item.originalPrice || 0)
        return sum + (price * item.quantity)
      }, 0)
    },

    discount: () => {
      return 2.50
    },

    shippingCost: (state) => {
      return state.shippingMethod === 'shipping' ? 2.50 : 0
    },

    grandTotal(): number {
      const total = this.itemTotal - this.discount + this.shippingCost
      return total > 0 ? total : 0
    },

    isInCart: (state) => (productId: string) => {
      return state.items.some(item => item._id === productId)
    },

    getCartItem: (state) => (productId: string) => {
      return state.items.find(item => item._id === productId)
    }
  },

  actions: {
    addToCart(product: any, quantity: number = 1) {
      const pId = product._id || product.id;
      
      const existingItem = this.items.find(item => item._id === pId)

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity
        if (newQuantity <= (product.stock || 999)) {
          existingItem.quantity = newQuantity
        } else {
          alert(`Sorry, only ${product.stock || 999} units available in stock.`)
        }
      } else {
        const formattedImage = product.image?.startsWith('http') 
          ? product.image 
          : `${this.baseUrl}${product.image?.replace(/^\/?public/, '')}`

        const cartItem: CartItem = {
          _id: pId,
          name: product.name || 'Unnamed Product',
          price: product.price || 0,
          originalPrice: product.originalPrice,
          image: formattedImage || '/placeholder.jpg',
          quantity: quantity,
          sku: product.sku || 'N/A',
          category: product.categoryName || product.category || 'General',
          brand: product.brand || 'Premium',
          badge: product.isNew ? 'New' : undefined,
          description: product.description || 'Quality Stationery Product',
          delivery: this.calculateDeliveryDate(),
          stock: product.stock || 999
        }
        
        this.items.push(cartItem)
      }
    },

    removeFromCart(index: number) {
      if (index >= 0 && index < this.items.length) {
        this.items.splice(index, 1)
      }
    },

    updateQuantity(index: number, quantity: number) {
      const item = this.items[index]
      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(index)
        } else if (quantity <= item.stock) {
          item.quantity = quantity
        } else {
          alert(`Only ${item.stock} items available.`)
        }
      }
    },

    increaseQuantity(index: number) {
      const item = this.items[index]
      if (item && item.quantity < item.stock) {
        item.quantity++
      } else {
        alert("Maximum stock reached")
      }
    },

    decreaseQuantity(index: number) {
      const item = this.items[index]
      if (item && item.quantity > 1) {
        item.quantity--
      }
    },

    clearCart() {
      this.items = []
      this.couponCode = ''
    },

    applyCoupon(code: string) {
      this.couponCode = code
    },

    setShippingMethod(method: 'shipping' | 'pickup') {
      this.shippingMethod = method
    },

    setDeliverTogether(value: boolean) {
      this.deliverTogether = value
    },

    calculateDeliveryDate(): string {
      const date = new Date()
      date.setDate(date.getDate() + 5)
      return date.toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      })
    }
  },

  persist: {
    key: 'user-cart',
    storage: localStorage,
  }
})