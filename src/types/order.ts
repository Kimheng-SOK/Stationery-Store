export interface Order {
  id: number
  orderNumber: string
  productName: string
  productImage: string
  quantity: number
  customerName: string
  customerLocation: string
  amount: number
  orderDate: string
  orderTime: string
  deliveryDate: string
  deliveryTime: string
  status: 'in-progress' | 'completed' | 'pending' | 'cancelled'
}

export type OrderStatus = Order['status']
