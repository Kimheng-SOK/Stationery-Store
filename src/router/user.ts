import ClientAdminLayout from '../layouts/ClientLayout.vue'
import ShopView from '../views/user/ShopView.vue'
import NewArrivalView from '../views/user/NewArrivalView.vue'
import ShopByCategory from '@/components/product/ShopByCategory.vue'
import PopularProduct from '@/components/product/PopularProduct.vue'

export default [
  {
    path: '/',
    redirect: '/shop', // route to home page  or landing page
  },

  {
    path: '/user',
    component: ClientAdminLayout,
    children: [
      { path: '', redirect: '/shop' },
      { path: '/shop', name: 'Shop', component: ShopView },
      { path: '/new-arrival', name: 'NewArrival', component: NewArrivalView },
      { path: '/categories', name: 'ShopByCategory', component: ShopByCategory },
      { path: '/hots', name: 'PopularProduct', component: PopularProduct },

      {
        path: '/terms',
        name: 'Terms',
        component: () => import('@/views/TermCondition.vue'),
      },
      {
        path: '/privacy',
        name: 'Privacy',
        component: () => import('@/views/Privacy.vue'),
      },
    ],
  },
]
