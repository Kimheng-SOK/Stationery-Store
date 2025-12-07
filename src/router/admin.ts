// src/router/admin.ts
import AdminLayout from '../layouts/AdminLayout.vue'
import Dashboard from '../views/admin/AdminDashBoard.vue'
import ManageUsers from '../views/admin/ManageUsers.vue'
import ManageProducts from '../views/admin/ManageProduct.vue'
import ManageOrders from '../views/admin/ManageOrders.vue'
import ManageCategories from '../views/admin/ManageCategories.vue'
import ManageAdvertisement from '../views/admin/ManageBanner.vue'
import ManageRewards from '../views/admin/ManageCoupons.vue'
import Team from '../views/admin/ManageTeams.vue'

export default [
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAdmin: true },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'AdminDashboard', component: Dashboard },
      { path: 'users', name: 'ManageUsers', component: ManageUsers },
      { path: 'products', name: 'ManageProducts', component: ManageProducts },
      { path: 'orders', name: 'ManageOrders', component: ManageOrders },
      { path: 'categories', name: 'ManageCategories', component: ManageCategories },
      { path: 'advertisement', name: 'ManageAdvertisement', component: ManageAdvertisement },
      { path: 'reward', name: 'ManageRewards', component: ManageRewards },
      { path: 'teams', name: 'ManageTeam', component: Team },

      // Add more children here: Products, Orders, etc.
    ],
  },
]
