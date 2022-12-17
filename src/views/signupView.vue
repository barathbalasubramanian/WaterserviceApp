<template>
<div>
  <div class="auth">
    <div class="card">SIGN UP</div>
    <form @submit.prevent='signup()' >
      	<div class="input" >
      	  	<input class="field" type="text" v-model="form.name" required><br>
      	  	<label class="label">USERNAME</label>
      	  	<div class="req0"></div>
      	</div>
      	<div class="input">
      	  	<input class="field" type="name" v-model="form.email" required><br>
      	  	<label class="label">EMAIL</label>
      	  	<div class="req1"></div>
      	</div>
      	<div class="input">
      	  	<input class='field' type="password" v-model="form.pass1" required><br> 
      	  	<label class="label">PASSWORD</label>
      	  	<div class="req2"></div>
      	</div>
      	<div class="input" >
			      <input class='field' type="password" v-model="form.pass2" required><br> 
      	  	<label class="label">CONFORM PASSWORD</label>
      	  	<div class="req3"></div>
      	</div>
      	<div class="btn">
      	  	<button type="submit">Signup</button>
      	  	<router-link to='/signin'><button type="submit" class="button">Sign in</button></router-link>
      	</div>
    </form>
  </div>
</div>

</template>

<script>
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '@/firebase.js'
export default {
  data() {
    return {
      form:{name:'',email:'',pass1:'',pass2:''}
    }
  },
  methods: {
    //!preg_match('/^[0-9a-zA-Z\xe0-\xef\x80-\xbf._-]+$/i'
    signup() {
      let fields = document.querySelectorAll('.field')
      let reqdiv = ['req0','req1','req2','req3']
      for ( let i =0 ; i< fields.length ; i++) {
        let values = fields[i].value
        if (values === '') {
          let reqfield = '.'+reqdiv[i]
          let req = document.querySelector(reqfield)
          req.classList.add('reqfield')
          req.innerHTML = 'This field is required !!!'
          return
        } 
    }
    for ( let i =0 ; i< reqdiv.length ; i++) 
    {
        let req_field = '.'+reqdiv[i]
        let req = document.querySelector(req_field)
        req.innerHTML = null
    }
    this.signupsave()
    },
    signupsave()
    { 
    if (this.form.pass1 == this.form.pass2) {
      
      createUserWithEmailAndPassword(auth, this.form.email, this.form.pass1)
      .then((userCredential) => {
        const user = userCredential.user;
        let loc = window.location.href 
        console.log(loc)
        window.location.href = loc + 'signin'
      })
      .catch((error) => {
        let req  = document.querySelector('.req3')
        req.innerHTML = error
        req.classList.add('reqfield')
      });
    }
    else {
      let req  = document.querySelector('.req3')
      req.innerHTML = "Password didn't match "
      req.classList.add('reqfield')
      return
    }
    },
  }
}
</script>
