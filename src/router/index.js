import { createRouter, createWebHashHistory } from 'vue-router'
import signUpView from '../views/signupView.vue'
import signinView from '../views/signinView.vue'
import ownerView from '../views/ownerView.vue'
import customerView from '../views/customerView.vue'

const routes = [
  {
    path: '/',
    component : signUpView
  },
  {
    path: '/signin',
    component : signinView
  },
  {
    path: '/owner',
    component : ownerView,
    meta: {
      requiresAuth: true
    }
    
  },
  {
    path : '/customer',
    component : customerView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// router.beforeEach((to, from) => {
//   if (to.meta.requiresAuth && !auth.isLoggedIn()) {
//     return {
//       path: '/customer',
//       query: { redirect: to.fullPath },
//     }
//   }
// })

// router.beforeEach(async (to, from) => {
//   if ( !isAuthenticated && to.name !== 'Login' ) 
//   {
//     return { name: 'Login' }
//   }
// })

export default router