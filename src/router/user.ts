import ClientAdminLayout from '../layouts/ClientLayout.vue'
import ShopView from '../views/user/ShopView.vue'
import NewArrivalView from '../views/user/NewArrivalView.vue'

export default [
  {
    path: '/',
    redirect: '/user/shop', // route to home page  or landing page
  },

  {
    path: '/user',
    component: ClientAdminLayout,
    children: [
      { path: '', redirect: 'user/shop' },
      { path: 'shop', name: 'Shop', component: ShopView },
      { path: 'new-arrival', name: 'NewArrival', component: NewArrivalView },
    ],
  },
]
