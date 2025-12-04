import ProductDetails from "@/components/ProductDetails.vue";
import SignIn from "@/components/SignIn.vue";
import SignUp from "@/components/SignUp.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/signup' , component: SignUp
    },
    {
      path: '/signin' , component: SignIn
    },
    {
      path:'/productdetails', component: ProductDetails
    },
  ]
})
export default router
