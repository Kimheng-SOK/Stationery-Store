import ClientAdminLayout from '../layouts/ClientLayout.vue'
import Dashboard from '../views/admin/AdminDashBoard.vue'

export default [
  {
    path: '/user',
    component: ClientAdminLayout,
    children: [
      { path: 'dashboard', name: 'AdminDashboard', component: Dashboard },
      // Add more children here: Products, Orders, etc.
    ],
  },
]
