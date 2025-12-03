// src/router/admin.ts
import AdminLayout from '../layouts/AdminLayout.vue'
import Dashboard from '../views/admin/AdminDashBoard.vue'

export default [
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAdmin: true },
    children: [
      { path: 'dashboard', name: 'AdminDashboard', component: Dashboard },
      // Add more children here: Products, Orders, etc.
    ],
  },
]
