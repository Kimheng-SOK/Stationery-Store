import ClientAdminLayout from '../layouts/ClientLayout.vue'
import ShopView from '../views/user/ShopView.vue'
import NewArrivalView from '../views/user/NewArrivalView.vue'
import ShopByCategory from '@/components/product/ShopByCategory.vue'
import PopularProduct from '@/components/product/PopularProduct.vue'
import HomePageView from '@/views/user/HomePageView.vue'
import Privacy from '@/views/user/Privacy.vue'
import TermCondition from '@/views/user/TermCondition.vue'
import Checkout from '@/views/user/CheckoutView.vue'
import CartView from '@/views/user/CartPage.vue'
import EmptyProduct from '@/views/user/EmptyProduct.vue'
import ProductDetailView from '@/views/user/ProductDetailView.vue'

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
      { path: '/categories', name: 'ShopByCategory', component: ShopByCategory },
      { path: '/hots', name: 'PopularProduct', component: PopularProduct },
      { path: '/home', name: 'HomePageView', component: HomePageView},
      { path: '/privacy', name: 'Privacy', component:Privacy},
      { path: '/TermCondition', name: 'TermCondition', component: TermCondition},
      { path: '/checkout', name: 'Checkout', component: Checkout },
      { path: '/cart', name: 'Cart', component: CartView},
      { path: '/empty-product', name: 'EmptyProduct', component: EmptyProduct},
      { path: '/product/:id', name: 'ProductDetail', component: ProductDetailView}
    ],
  },
]
