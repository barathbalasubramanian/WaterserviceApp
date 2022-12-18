import { createRouter, createWebHashHistory } from 'vue-router'
import signUpView from '../views/signupView.vue'
import signinView from '../views/signinView.vue'
import ownerView from '../views/ownerView.vue'
import customerView from '../views/customerView.vue'
import UpdateorderView from '../views/UpdateorderView.vue'

const routes = [
  {
    path: '/',
    component : customerView
  },
  {
    path: '/signin',
    component : signinView
  },
  {
    path: '/owner',
    component : ownerView,

  },
  {
    path : '/signup',
    component : signUpView
  },
  {
    path : '/customer/:id',
    component : UpdateorderView
  }
]

const router = createRouter({
	history: createWebHashHistory(),
	routes
  })

export default router