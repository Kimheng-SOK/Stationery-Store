// stores/cartStore.ts
import { defineStore } from 'pinia'
import type { Product } from '@/types/product'
import axios from 'axios'

export interface CartItem {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  quantity: number
  sku: string
  category: string
  brand?: string
  badge?: string
  description?: string
  delivery: string
  stock: number
}

export interface AppliedCoupon {
  _id: string
  code: string
  discount: number
  description?: string
  status: string
  usedCount: number
  usageLimit: number
  startDate: string
  endDate: string
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    couponCode: '',
    appliedCoupon: null as AppliedCoupon | null,
    couponDiscount: 0,
    shippingMethod: 'shipping' as 'shipping' | 'pickup',
    deliverTogether: false
  }),

  getters: {
    totalItems: (state) => {
      return state.items.reduce((sum, item) => sum + item.quantity, 0)
    },

    itemTotal: (state) => {
      return state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    },

    discount: () => {
      return 2.50
    },

    shippingCost: (state) => {
      return state.shippingMethod === 'shipping' ? 2.50 : 0
    },

    grandTotal(state): number {
      return this.itemTotal - this.discount - state.couponDiscount + this.shippingCost
    },

    isInCart: (state) => (productId: number) => {
      return state.items.some(item => item.id === productId)
    },

    getCartItem: (state) => (productId: number) => {
      return state.items.find(item => item.id === productId)
    }
  },

  actions: {
    addToCart(product: Product, quantity: number = 1) {
      const existingItem = this.items.find(item => item.id === product.id)

      if (existingItem) {
        // Update quantity if item already exists
        const newQuantity = existingItem.quantity + quantity
        if (newQuantity <= product.stock) {
          existingItem.quantity = newQuantity
        } else {
          throw new Error(`Cannot add more than ${product.stock} items`)
        }
      } else {
        // Add new item
        const cartItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          quantity: quantity,
          sku: product.sku,
          category: product.category,
          brand: product.brand,
          badge: product.isNew ? 'New' : undefined,
          description: `${product.brand || ''} - ${product.category}`,
          delivery: this.calculateDeliveryDate(),
          stock: product.stock
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
        }
      }
    },

    increaseQuantity(index: number) {
      const item = this.items[index]
      if (item && item.quantity < item.stock) {
        item.quantity++
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
      this.appliedCoupon = null
      this.couponDiscount = 0
    },

   async applyCoupon(code: string) {
  this.couponCode = code

  try {
    const res = await axios.get(`http://localhost:5000/api/coupons/code/${code.toUpperCase()}`)

    if (res.data.success) {
      const coupon = res.data.data[0]

      // Check if coupon exists
      if (!coupon) {
        this.couponCode = ''
        this.appliedCoupon = null
        this.couponDiscount = 0
        throw new Error('Coupon not found')
      }

      // Check status
      if (coupon.status !== 'active') {
        this.couponCode = ''
        this.appliedCoupon = null
        this.couponDiscount = 0
        throw new Error('This coupon is not active')
      }

      // Check date validity
      const now = new Date()
      const startDate = new Date(coupon.startDate)
      const endDate = new Date(coupon.endDate)

      if (now < startDate) {
        this.couponCode = ''
        this.appliedCoupon = null
        this.couponDiscount = 0
        throw new Error('This coupon is not yet active. It will be available from ' +
          startDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }))
      }

      if (now > endDate) {
        this.couponCode = ''
        this.appliedCoupon = null
        this.couponDiscount = 0
        throw new Error('This coupon has expired')
      }

      // Check usage limit
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        this.couponCode = ''
        this.appliedCoupon = null
        this.couponDiscount = 0
        throw new Error('This coupon usage limit has been reached')
      }

      // Calculate discount
      const subTotal = this.itemTotal - this.discount
      const couponDiscountAmount = (subTotal * coupon.discount) / 100

      this.couponCode = coupon.code
      this.appliedCoupon = coupon
      this.couponDiscount = couponDiscountAmount

      return {
        success: true,
        message: `Coupon "${coupon.code}" applied! You saved $${couponDiscountAmount.toFixed(2)} (${coupon.discount}% off)`
      }
    }
  } catch (error: any) {
    this.couponCode = ''
    this.appliedCoupon = null
    this.couponDiscount = 0

    const errorMessage = error.message || error.response?.data?.message || 'Invalid or expired coupon code'
    throw new Error(errorMessage)
  }
},

     async incrementUsageCoupon(){
            if (this.appliedCoupon) {
              try {
          await axios.put(
            `http://localhost:5000/api/coupons/${this.appliedCoupon._id}`,
            {
              usedCount: this.appliedCoupon.usedCount + 1
            }
          )
        } catch (error) {
          console.error('Error incrementing coupon usage:', error)
        }
      }
    },



    setShippingMethod(method: 'shipping' | 'pickup') {
      this.shippingMethod = method
    },

    setDeliverTogether(value: boolean) {
      this.deliverTogether = value
    },

    calculateDeliveryDate(): string {
      const date = new Date()
      date.setDate(date.getDate() + 7) // Add 7 days
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    }
  },

  persist: true // Enable persistence with pinia-plugin-persistedstate
})
