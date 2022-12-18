<template>
<div>
                                    <!---------------- Loading ------------->
    <div v-if="isloading">
        <div class="container">
            <div class="bar"></div>
        </div>
    </div>
                                    <!---------------- No order yet  ------------->
    <div v-if="noOrder">
        <down-arrow/>
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
                <div @click="subtract()"><span class="material-symbols-outlined" style="color; #fff">remove</span></div>
                <div id="count" style="color: #fff">{{ this.count }}</div>
                <div @click="add()"><span class="material-symbols-outlined" style="color; #fff">add</span></div>
            </div>
            <div class='form'>
                <button @click="writeUserData(order.customername,order.address,order.ph_num,this.count)">Order</button>
            </div>
        </form>
        <div class="view-btn"><button @click="view()">View Order</button></div>
    </div>

                                    <!----------------- VIEW ORDER ------------>
    <div v-if="activeView" class="view-ord"> 
        <div>
            <div>
                <div class="header">Your Order</div>
                <div class="logout-btn" @click='logout()'><span class="material-symbols-outlined">logout</span></div>
            </div>
            
            <div v-for="( data, id ) in this.orderDetails" :key= 'id'  class="main-div">
                <div v-for='( i , index) in data' :key="index" > 
                    
                    <div v-if="i.ORDER" class="sub-div"> 
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
            </div>
            <div class="order-btn"><button @click="Order()">Place Order</button></div>
        </div>
        <div>
            <div v-for="( data, id ) in this.orderDetails" :key= 'id'  class="main-div">
                <div v-for='( i , index) in data' :key="index" > 

                    <div v-if = 'i.ORDER != this.ORDER' class="sub-div">
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
            </div>
        </div>
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
import Router from '../router'
import downArrow from '../components/downArrow.vue'

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
            ORDER : true,
            noOrder : false
        }
    },
    components : {
        downArrow
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
                    ORDER : true
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
                  Router.push('/signup')
                }
            });
        },

    async getData(email) {
            
            await get(child(dbref, email+'/' )).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                this.orderDetails.push(snapshot.val())
                this.isloading = false
                this.noOrder = false
            } else {
                if (this.email === 'barath') { Router.push("/owner") }
                console.log("No data available");
                this.isloading = false
                this.noOrder = true
            }
            }).catch((error) => {
                console.error(error);
            });
        },

    view() {
        this.orderDetails = []
        this.noOrder = false
        this.isloading = true 
        this.getuser()
        this.activeView = true
        this.activeOrder = false
        },

    Order() {
        this.activeView = false
        this.noOrder = false
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
        },
    logout() {
        const logoutBtn = document.querySelector('.logout-btn');
        logoutBtn.addEventListener('click', e => {
        e.preventDefault();
        auth.signOut();
        console.log('User signed out!');
        })
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
    .noOrder {
        color: #fff;
        margin: 5em 0 0 0;
        display: flex;
        align-items: center;
        justify-content: center;
        scale: 1;
        transition: 1s;
    }
    .placeOrder {
        position: absolute;
        bottom: 20%;
        left: 25%;
        color: #fff;
        transition: .35s;
        scale: 1;

    }
    .logout-btn {
        position: fixed;
        top: 0;
        z-index: 999;
        right: 0;
        color: #1a87f4;
        padding: 16px;
    }
    .logout-btn span {
        font-size: 2em;
    }
    .main-div {
        width: 100vw;
        max-height: 90vh;
    }
    .view-ord {
        width: 100vw;
        display: flex;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
    }
    .view-ord :nth-child(1) , .view-ord :nth-child(2) {
        scroll-snap-align: end;
    }
    .next-page {
        margin-top:10vh ;
        color: white;
        min-width: 100vw;
        height: auto;
        background-color: red;
    }

</style>

