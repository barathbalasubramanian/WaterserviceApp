<template>
<div>
                                    <!---------------- Loading ----------------->
    <div v-if="isloading">
        <div class="container">
            <div class="bar"></div>
        </div>
    </div>
                                    <!----------------- ORDER ---------------->
    <div v-if="activeOrder"> 
        <div class="header header-order">Order Here</div>
        <form>
            <div class='form'>
                <div>
                    <label>
                        <span class="material-symbols-outlined">person</span>
                    </label>
                </div>
                <div> 
                    <input type="text" v-model='order.customername' placeholder="Name">
                </div>
            </div>
            <div class='form'>
                <div>
                    <label> 
                        <span class="material-symbols-outlined">location_on</span>
                    </label>
                </div>
                <div>
                    <input type="text" v-model="order.address" placeholder="Address">
                </div>
            </div>
            <div class='form'>
                <div>
                    <label>
                        <span class="material-symbols-outlined">call</span>
                    </label>
                </div>
                <div>
                    <input type="number" v-model="order.ph_num" placeholder="Mobile num">
                </div>
            </div>
            <div class='form count'>
                <button @click="subtract()"><span class="material-symbols-outlined">remove</span></button>
                <div id="count" style="color: #fff">{{ this.count }}</div>
                <button @click="add()"><span class="material-symbols-outlined">add</span></button>
            </div>
            <div class='form'>
                <button @click="writeUserData(order.customername,order.address,order.ph_num,this.count)">Order</button>
            </div>
        </form>
        <div class="view-btn"><button @click="view()">View Order</button></div>
    </div>

                                <!----------------- VIEW ORDER --------------------------->
    <div v-if="activeView">
        <div class="header">Your Order</div>
        <div v-for="( data, id ) in this.orderDetails" :key= 'id'  class="main-div">
            <div v-for='( i , index) in data' :key="index" class="sub-div"> 
                
                
                <router-link :to='`/customer/${index}`' v-if = 'i.ORDER'>
                    <span class="material-symbols-outlined edit" style="color: #fff">edit</span>
                </router-link>
                <span v-if = "i.ORDER != this.ORDER" class="edit cancelled">Cancelled</span>
                <div style="color: #1a87f4">{{i.name}}</div>
                <div style="width: 12em;">{{i.address}}</div>
                <div>{{i.ph_num}}</div>
                <div class="orders">{{i.count}}</div>

            </div>
        </div>
        <div class="order-btn"><button @click="Order()">Place Order</button></div>
    </div>

    <div class="dialogue-box">
        <span></span>
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
            order : {customername : '' , address : '' , ph_num : '' },
            orderDetails : [],
            activeOrder : false,
            activeView : true,
            email : null,
            count : 1,
            isloading : true,
            ORDER : true
        }
    },
    mounted : function() {
        this.getuser()
    },
    methods : 
    {
        writeUserData  (customername, address , ph_num , count)  {
            try {
                let date = Date.now()
                set(ref(db, this.email+'/' + date ), {
                    name: customername,
                    address : address,
                    ph_num : ph_num,
                    count : count,
                    ORDER : false
                });
                this.order.customername = ''
                this.order.address = ''
                this.order.ph_num = ''
                this.count = 1
                let dialogue = document.querySelector(".dialogue-box")
                dialogue.innerHTML = 'Order Placed'
                dialogue.classList.add('dia-active')
                setTimeout( () => { dialogue.classList.remove('dia-active'); dialogue.innerHTML = null}, 1000)
                
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
                    this.getData(this.email)
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
                this.isloading = false
            } else {
                console.log("No data available");
                this.isloading = false
            }
            }).catch((error) => {
            console.error(error);
            });
        },

    view() {
        this.orderDetails = []
        this.isloading = true 
        this.getuser()
        this.activeView = true
        this.activeOrder = false
        },

    Order() {
        this.activeView = false
        this.activeOrder = true
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
    *::-webkit-scrollbar {
        display: none;
    }
    .header {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2em;
        background-color: #242424;
        color: white;
        padding: 7px 0 10px 0;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10;
        width: 100vw;
    }
    .header-order {
        position: initial;
    }
    .view-btn , .order-btn{
        position: fixed;
        bottom: 0;
        width: 100%;
        z-index: 999;
        background-color: transparent;
    }
    
</style>

