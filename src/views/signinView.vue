<template>
	<div>
		<div class="auth">
			<div class="card">SIGN IN</div>
			<form @submit.prevent="signin()">
			
			<div class="input">
				<input type="email" v-model="form.email" required><br>
				<label>EMAIL</label>
			</div>

			<div class="input">
				<input type="password" v-model="form.password" required><br>
				<label>PASSWORD</label>
				<div class="reqfield"></div>
			</div>

			<div class="error"></div>
			<div class=".btn" style="display : flex ; align-itms : center ; justify-content : center ; marigin: auto">
				<button type="submit" style="width : 100%  ;">sign in</button>
			</div>
			
			</form>
		</div>
	</div>
</template>

<script>
	import { signInWithEmailAndPassword } from "firebase/auth";
	import { auth } from '@/firebase.js'
	import Router from '../router'

	export default {
	
	data(){
		return {
		form:{name:'',email:'',password:''}
		}
	},
	methods: {

		signin(){
			signInWithEmailAndPassword(auth, this.form.email, this.form.password)
			.then((userCredential) => {
				const user = userCredential.user;
				this.ownerpage(user.email)
			})
			.catch((error) => {
				let err = document.querySelector('.reqfield')
				err.innerHTML = 'E-mail or Password is incorrect'
			});
			},

		ownerpage(email){
			if (email === 'barath@gmail.com') {
				console.log('owner')
				Router.push('/owner')
			}
			else {
				Router.push('/')
			}
		}
	},
	}
</script>
