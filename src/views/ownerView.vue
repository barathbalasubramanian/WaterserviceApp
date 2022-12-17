<template>
    <div>
        <div v-if="isloading">
            <div class="container">
                <div class="bar"></div>
            </div>
        </div>

        <div v-if="activeView">
            <div class="header">Orders</div>
            <div v-for="( data, id ) in this.totalOrders" :key= 'id'  >
                <div v-for='( i , email) in data' :key="email"> 
                    <div class="orderFrom"> From {{email}} </div>
                    <div v-for= '( order , index) in i' :key="index" class="sub-div">
                        
                        <div v-if = "order.ORDER != this.ORDER" class="edit cancelled" >Order Cancelled</div>
                        <div style="color: #1a87f4">{{order['name']}}</div>
                        <div style="width: 12em;">{{order['address']}}</div>
                        <div>{{order['ph_num']}}</div>
                        <div class="orders">{{order['count']}}</div>

                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>

import { get } from "firebase/database";
import { dbref } from '../firebase'

export default {
    data() {
        return{
            totalOrders : [],
            activeView : true,
            isloading :false,
            ORDER : true
        }
    },

    mounted: function() {
        this.getData() 
    },

    methods : {

        async getData() {
            
            await get(dbref ).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                this.totalOrders.push(snapshot.val())
            } else {
                console.log("No data available");
                
            }
            }).catch((error) => {
                console.error(error);
            });
        },

    }
}
</script>

<style scoped>
    .orderFrom {
        display: flex;
        background-color: #1a87f4;
        color: #fff;
        width: fit-content;
        border-radius: 0 20px 20px 0;
        padding: 0.3em 1em 0.3em 0.3em;
    }

</style>