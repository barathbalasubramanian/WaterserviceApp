<template>
<div>
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
                    <input type="text" v-model='order.customername' required>
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
            <div class='form'>
                <button @click="writeUserData(order.customername,order.address,order.ph_num,this.count)">order</button>
            </div>
        </form>
        <div class="view-btn"><button @click="view()">VIEW ORDER</button></div>
    </div>

                                <!----------------- VIEW ORDER --------------------------->
    <div v-if="activeView">
        <div class="header">Your Order</div>
        <div v-for="( data, id ) in this.orderDetails" :key= 'id'  class="main-div">
            <div v-for='( i , index) in data' :key="index" class="sub-div"> 

                <router-link :to='`/customer/${index}`'><span class="material-symbols-outlined edit" style="color: #fff">edit</span></router-link>
                <div style="color: #1a87f4">{{i.name}}</div>
                <div style="width: 12em;">{{i.address}}</div>
                <div>{{i.ph_num}}</div>
                <div class="orders">{{i.count}}</div>

            </div>
        </div>
        <div class="order-btn"><button @click="Order()">Place Order</button></div>
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
            count : 1
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
                    count : count
                });
                this.order.customername = ''
                this.order.address = ''
                this.order.ph_num = ''
                this.count = 1
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
                
            } else {
                console.log("No data available");
            }
            }).catch((error) => {
            console.error(error);
            });
        },

    view() {
        this.orderDetails = []
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
    form{
        margin: 20px;
        display: flex;
        flex-direction: column;
    }
    .form {
        padding: 8px 0;
        display: flex;
        align-items: center;
        flex-direction: row;
        column-gap: 20px;
    }
    .form label {
        display: flex;
        margin: 1px 0 0 0;
        align-items: center;
        color: rgb(107, 105, 105);
    }
    .form input {
        border: none;
        border-bottom: 2px solid #5f89df;
        width: 14em;
        outline : none;
        font-size: 20px;
        background: none;
        color: #fff;
    }
    .form button, .view-btn button , .order-btn button {
        width: 40%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: auto;
        margin: 15px auto;
        padding: 10px 15px;
        font-size: 20px;
        border-radius: 50vh;
        background-color: #5f89df;
        border: none;
        outline:none;
        color: #232323;
        opacity: 1;
        z-index: 10;
    }
    .count {
        display: flex;
        width: 90%;
        align-items: center;
        justify-content: space-between;
        margin: 14px auto;
    }
    .count button{
        width: 2em;
        border: none;
        border-radius: 1px;
        color: #5f89df;
        background: none;
        margin: 0;
    }
    .view-btn , .order-btn{
        position: fixed;
        bottom: 0;
        width: 100%;
        z-index: 999;
        background-color: transparent;
    }
    .main-div {
        margin-top: 10vh;
        overflow: scroll;
        background-color: #232323;
    }
    .sub-div {
        position: relative;
        display: flex;
        flex-direction: column;
        background-color: #343434;
        padding: 12px;
        margin: 1em;
        border-radius: 15px 0px 15px 15px;
        color: #fff;
    }
    .orders {
        position: absolute;
        bottom: -1px;
        right: -1px;
        padding: 8px 16px;
        background-color: #1a87f4;
        color: #fff;
        border-radius: 50%;
        overflow: hidden;
        font-size: 1.2em;
    }
    .edit {
        padding: 5px;
        position: absolute;
        top: 0;
        right: 0;
    }
    
</style>

