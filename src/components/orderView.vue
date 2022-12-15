<template>
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
</template>

<script>

import { ref, set } from "firebase/database";
import { db , auth} from "../firebase"
import { onAuthStateChanged } from "firebase/auth";

export default {
    
    data() {
        return{
            order : {customername : '' , count : ''},
            email : ''
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
                    this.email = uid.split('@')[0]
                } else {
                  console.log("Can't get user e-mail")
                }
            });
        }
    }
}
</script>

<style scoped>

</style>