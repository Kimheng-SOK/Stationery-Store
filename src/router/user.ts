import ClientAdminLayout from '../layouts/ClientLayout.vue'
import Dashboard from '../views/admin/AdminDashBoard.vue'

export default [
  {
    path: '/user',
    component: ClientAdminLayout,
    children: [
      { path: '', redirect: '/user/dashboard' },
      { path: 'dashboard', name: 'AdminDashboard', component: Dashboard },
      { path: 'shop', name: 'Shop', component: () => import('@/views/user/ShopView.vue') },
    ],
  },
]
