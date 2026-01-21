import ClientAdminLayout from '../layouts/ClientLayout.vue'
import ShopView from '../views/user/ShopView.vue'
import NewArrivalView from '../views/user/NewArrivalView.vue'
// import ShopByCategory from '@/components/product/ShopByCategory.vue'
// import PopularProduct from '@/components/product/PopularProduct.vue'
import HomePageView from '@/views/user/HomePageView.vue'
import Privacy from '@/views/user/Privacy.vue'
import TermCondition from '@/views/user/TermCondition.vue'
import Checkout from '@/views/user/CheckoutView.vue'
import CartView from '@/views/user/CartPage.vue'
import EmptyProduct from '@/views/user/EmptyProduct.vue'
import ProductDetailView from '@/views/user/ProductDetailView.vue'
import PopularPage from '@/views/user/PopularPage.vue'
import CategoriesPage from '@/views/user/CategoriesPage.vue'

import ProfileMain from '@/views/profile/ProfileMain.vue'
import EditProfile from '@/views/profile/EditProfile.vue'
import OrdersView from '@/views/profile/OrdersView.vue'
import WishlistView from '@/views/profile/WishlistView.vue'
import AddressView from '@/views/profile/AddressView.vue'
import PaymentView from '@/views/profile/PaymentView.vue'
import NotificationView from '@/views/profile/NotificationView.vue'
import SettingsView from '@/views/profile/SettingView.vue'
export default [
  {
    path: '/',
    redirect: '/home', // route to home page  or landing page
  },

  {
    path: '/user',
    component: ClientAdminLayout,
    children: [
      { path: '', redirect: '/home' },
      { path: '/shop', name: 'Shop', component: ShopView },
      { path: '/new-arrival', name: 'NewArrival', component: NewArrivalView },
      { path: '/categories', name: 'ShopByCategory', component: CategoriesPage },
      { path: '/hots', name: 'PopularProduct', component: PopularPage },
      { path: '/home', name: 'HomePageView', component: HomePageView},
      { path: '/privacy', name: 'Privacy', component:Privacy},
      { path: '/terms', name: 'TermCondition', component: TermCondition},
      { path: '/checkout', name: 'Checkout', component: Checkout },
      { path: '/cart', name: 'Cart', component: CartView},
      { path: '/empty-product', name: 'EmptyProduct', component: EmptyProduct},
      { path: '/product/:id', name: 'ProductDetail', component: ProductDetailView},

      { path: '/profile', name: 'Profile', component: ProfileMain },
      { path: '/profile/edit', name: 'ProfileEdit', component: EditProfile },
      { path: '/profile/orders', name: 'ProfileOrders', component: OrdersView },
      { path: '/profile/wishlist', name: 'ProfileWishlist', component: WishlistView },
      { path: '/profile/address', name: 'ProfileAddress', component: AddressView },
      { path: '/profile/payment', name: 'ProfilePayment', component: PaymentView },
      { path: '/profile/notification', name: 'ProfileNotification', component: NotificationView },
      { path: '/profile/settings', name: 'ProfileSettings', component: SettingsView }
    ],
  },
]
