import { createRouter, createWebHashHistory } from 'vue-router'
import signUpView from '../views/signupView.vue'
import signinView from '../views/signinView.vue'
import ownerView from '../views/ownerView.vue'
import customerView from '../views/customerView.vue'
import UpdateorderView from '../views/UpdateorderView.vue'
import { getAuth , onAuthStateChanged } from 'firebase/auth'
import Router from '../router'

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
    meta: {
      requiresAuth: true
    }
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

const getCurrentUser = () => {
	return Promise( (resolve,reject)  => {
		const removeListener =  onAuthStateChanged(
			getAuth(),
			(user) => { removeListener(); console.log("USER : ",user); resolve(user) },
			reject
		)
	});
}

router.beforeEach(async(to, from ,next) => {
	if (to.matched.some((record) => record.meta.requiresAuth)) {
		
		if (await getCurrentUser()) {
			console.log('ok')
			// next()
		} else {
			alert('Create Your account');
			// next('/')
		}
	} else {

		console.log('NOT AUTH')
		next()
	}
})

export default router