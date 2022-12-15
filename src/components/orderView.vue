<template>
<div>
    <form>
        <div>
            <label >Name</label>
            <input type="text" v-model='order.customername'>
        </div>
        <div>
            <label >No of water cans</label>
            <input type="number" v-model='order.count'>
        </div>
        <div>
            <button @click="writeUserData(order.customername,order.count)">order</button>
        </div>
    </form>

    <div v-if="active">
        <div v-for="( data, id ) in this.orderDetails" :key= 'id'>
            <div v-for='( i , index) in data' :key="index"> 
                <div>{{i.name}}</div>
                <div>{{i.count}}</div>
            </div>
        </div>
    </div>

</div>
</template>

<script>

import { ref, set , child, get} from "firebase/database";
import { db , auth , dbref } from "../firebase"
import { onAuthStateChanged } from "firebase/auth";


export default {
    
    data() {
        return{
            order : {customername : '' , count : ''},
            orderDetails : [],
            active : false
        }
    },
    mounted : function() {
        this.getuser()
    },
    methods : 
    {
        writeUserData  (customername, count)  {
            console.log("saving" , customername , count)
            try {
                let date = Date.now()
                set(ref(db, this.email+'/' + date), {
                    name: customername,
                    count : count
                });
            }
            catch (err) {
                console.log("error :", err)
            }
        },
    
    getuser(){
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    const uid = user.email;
                    let email = uid.split('@')[0]
                    this.getData(email)
                } else {
                  console.log("Can't get user e-mail")
                }
            });
        },

    async getData(email) {
            
            await get(child(dbref, email+'/' )).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                this.orderDetails.push(snapshot.val())
                console.log(this.orderDetails)
                this.active = true
            } else {
                console.log("No data available");
            }
            }).catch((error) => {
            console.error(error);
            });
        }
    }
}

</script>

<style scoped>

</style>