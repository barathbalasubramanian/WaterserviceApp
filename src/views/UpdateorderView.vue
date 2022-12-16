<template>
<div>
    <div class="header">Edit Order</div>
        
        <div v-for='( i , index) in data' :key="index" class="sub-div"> 

            <router-link :to='`/customer/${index}`'><span class="material-symbols-outlined edit" style="color: #fff">edit</span></router-link>
            <div style="color: #1a87f4">{{i.name}}</div>
            <div style="width: 12em;">{{i.address}}</div>
            <div>{{i.ph_num}}</div>
            <div class="orders">{{i.count}}</div>

        </div>
        <div>
            <div class="order-btn"><button @click="Order()">Change Order</button></div>
            <div><button>Cancel</button></div>
        </div>
</div>
</template>

<script>

import { useRoute } from 'vue-router'
import { child, get} from "firebase/database";
import { auth , dbref } from "../firebase"
import { onAuthStateChanged } from "firebase/auth";

export default {
    data(){
        return{
            currentOrder : [],
            email : null
        }
    },
    mounted : function() {
        this.getuser()
    },
    methods :
    {    
        getuser(){
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    const uid = user.email;
                    this.email = uid.split('@')[0]
                    this.getData(this.email)
                } else {
                  console.log("Can't get user e-mail")
                }
            });
        },
        async getData(email) {
            const route = useRoute()
            let user_key = route.params.customerid
            console.log(user_key)
            // await get(child(dbref, email+'/'+user_key+'/' )).then((snapshot) => {
            // if (snapshot.exists()) {
            //     console.log(snapshot.val());
            //     // this.orderDetails.push(snapshot.val())
                
            // } else {
            //     console.log("No data available");
            // }
            // }).catch((error) => {
            // console.error(error);
            // });
        }
    }
}
</script>

<style scoped>

</style>