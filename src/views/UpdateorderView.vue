<template>
<div v-if="active">
    <router-link to="/customer">
        <div class="close"><span class="material-symbols-outlined">close</span></div>
    </router-link>

    <div class="header">Edit Order</div>
        <form>
            <div class='form'>
                <div>
                    <label>
                        <span class="material-symbols-outlined">person</span>
                    </label>
                </div>
                <div> 
                    <input type="text" v-model="order.name" required>
                </div>
            </div>
            <div class='form'>
                <div>
                    <label> 
                        <span class="material-symbols-outlined">location_on</span>
                    </label>
                </div>
                <div>
                    <input type="text" v-model="order.address" required>
                </div>
            </div>
            <div class='form'>
                <div>
                    <label>
                        <span class="material-symbols-outlined">call</span>
                    </label>
                </div>
                <div>
                    <input type="number" v-model="order.ph_num" required>
                </div>
            </div>
            <div class='form count'>
                <button @click="subtract()"><span class="material-symbols-outlined">remove</span></button>
                <div id="count" style="color: #fff">{{ this.count }}</div>
                <button @click="add()"><span class="material-symbols-outlined">add</span></button>
            </div>
            <div class='form btn'>
                <button @click="editOrder(order.name , order.address , order.ph_num )">Save</button>
                <button @click="Cancel()">Cancel</button>
            </div>
        </form>
</div>
</template>

<script>

import { useRoute } from 'vue-router'
import { child, get , ref , update ,remove } from "firebase/database";
import { auth , dbref , db } from "../firebase"
import { onAuthStateChanged } from "firebase/auth";


export default {
    data(){
        return{
            currOrder : [],
            order : { name : '' , address : '' , ph_num : '' } ,
            email : null,
            active : false,
            count : null,
            id : null
        }
    },
    
    mounted : function() {
        this.getuser()
    },

    methods :
    {   
        editOrder(name, address, ph_num) {
        const postData = {
            name : name,
            address : address,
            ph_num : ph_num,
            count : this.count

        };

        const updates = {};
        updates[this.email+'/' + this.id+'/'] = postData;
        return update(ref(db), updates);
        },

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
            let user_key = this.$route.params.id
            this.id = user_key
            await get(child(dbref, email+'/'+user_key+'/' )).then((snapshot) => {
            if (snapshot.exists()) {
                
                this.currOrder.push(snapshot.val()) 
                this.order.name = this.currOrder[0]['name']
                this.order.address = this.currOrder[0]['address']
                this.order.ph_num = this.currOrder[0]['ph_num']
                this.count = this.currOrder[0]['count']
                this.active = true
                
            } else {
                console.log("No data available");
            }
            }).catch((error) => {
                console.error(error);
            });
        },

        add() {
            let count = document.querySelector('#count')
            this.count = this.count + 1
        },

        subtract() {
            let count = document.querySelector('#count')
            if (this.count > 0) {
                this.count = this.count - 1
                }   
        }
    }
}
</script>

<style scoped>
    .header {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2em;
        background-color: #242424;
        color: white;
        padding: 7px 0 10px 0;
    }
    .close {
        position: fixed;
        top: 0;
        right: 0;
        padding: 15px;
        color: red;
        background: none;
    }
    .close span {
        font-size: 2.2em;
    }

</style>