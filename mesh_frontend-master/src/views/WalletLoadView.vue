<template>
    <div>

      <div class="flex flex-col space-y-4 flex-1 bg-white p-8 rounded-md">

        <div class="flex-auto w-full sm:flex-none sm:w-1/4 flex items-center bg-white p-6 rounded-lg fadeInSlide shadow">
        <img src="../assets/peso.png" class="flex-none h-20 w-auto"/>
        <div class="flex-none flex flex-col px-8">
          <span class="flex-none text-gray-800">Current Credits</span>
          <span class="flex-none text-3xl font-bold text-gray-800 flex items-center">{{ changeMonetaryFormat(available_credits) }} </span>
        </div>
      </div>

      <p class="text-2xl text-gray-800 mb-4">Select Amount</p>


        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div @click="addToAmount(100)" class="p-4 cursor-pointer hover:bg-biege-700 rounded-md bg-biege-600">
            <b class="font-bold text-2xl">₱100</b>
          </div>

          <div @click="addToAmount(200)" class="p-4 cursor-pointer hover:bg-biege-700 rounded-md bg-biege-600">
            <b class="font-bold text-2xl">₱200</b>
          </div>

          <div @click="addToAmount(500)" class="p-4 cursor-pointer hover:bg-biege-700 rounded-md bg-biege-600">
            <b class="font-bold text-2xl">₱500</b>
          </div>

          <div @click="addToAmount(1000)" class="p-4 cursor-pointer hover:bg-biege-700 rounded-md bg-biege-600">
            <b class="font-bold text-2xl">₱1000</b>
          </div>

          <div @click="addToAmount(2000)" class="p-4 cursor-pointer hover:bg-biege-700 rounded-md bg-biege-600">
            <b class="font-bold text-2xl">₱2000</b>
          </div>

          <div @click="addToAmount(5000)" class="p-4 cursor-pointer hover:bg-biege-700 rounded-md bg-biege-600">
            <b class="font-bold text-2xl">₱5000</b>
          </div>

        </div>


        <div class="flex items-center gap-4">
          <div class="flex flex-col">
            <b>Enter Amount: </b>
            <span>Min Amount (₱100) </span>
          </div>
          <input v-model="data.input_credit" type="number" class="rounded-md w-1/5"/>
          <input type="file" id="fileupload" ref="fileupload" @change="onFileChange" class="ml-2 border border-gray-300 w-auto rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"/>
          <button class="cursor-pointer hover:bg-blue-700 rounded-md bg-blue-600 px-8 py-2 text-white h-auto text-center" @click="loadAccount()">
            Load
          </button>
        </div>

        <div>

          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3 w-auto text-left">
                  Credit amount
                </th>
                <th scope="col" class="px-6 py-3 w-48 text-center">
                  Status
                </th>
                <th scope="col" class="py-3 text-center w-1/4">
                  Date & Time
                </th>
                <th scope="col" class="py-3 text-center w-40">
                  
                </th>
              </tr>
          </thead>
          <tbody>
    
            <tr v-if="alltransactions.length == 0">
              <td colspan="7" class="py-5 px-5">
                <!-- <img src="../assets/icon_empty_document.png" class="mx-auto h-24"/> -->
                <p class="w-full text-center mt-4 text-gray-500 text-md">There are no transactions yet.</p>
              </td>
            </tr>
    
              <tr v-for="i in alltransactions" v-bind:key="i.id" class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-200 text-lg cursor-pointer">
                    <td class="px-6 py-2 w-auto text-left">
                      {{changeMonetaryFormat(i.input_credit)}}
                    </td>
                    <td class="px-6 py-2 w-48 text-center">
                      <span :class="changeStatusStyle(i.isApproved)" class="text-white px-8 py-1 rounded-lg">
                        {{ changeStatus(i.isApproved) }}
                      </span>
                    </td>
                    <td class="px-2 py-2 text-center w-1/4">
                      {{getDateTimeFormat(i.datetime_added)}}
                    </td>
                    <td class="px-2 py-2 text-center w-40">
                      <button @click="viewFile(i.file_attachment)" class="bg-blue-500 text-white text-xs px-4 py-2 rounded-md w-full">View attachment</button>
                    </td>
              </tr>
              
          </tbody>
      </table>

        </div>


      </div>



    </div>

  </template>

<script>

import moment from 'moment';
import axios from 'axios';
import { io } from "socket.io-client";

export default{
  data(){
    return{
      available_credits : 0,

      alltransactions : '',

      data: {
        user_id : this.$store.state.user.id,
        payment : 0,
        input_credit : 0,
        datetime_added : '',
        file_attachment : '',
        file : null,
        socket: null,
      }
    }
  },
  props: {
    showNotification : Function
  },
  created() {
    this.initializeSocket();
  },
  beforeUnmount() {
    this.disconnectSocket();
  },
  methods: {
    initializeSocket() {
      // Initialize the socket connection
      this.socket = io(process.env.VUE_APP_BASE_URL);
      
      // Set up listener for transaction updates
      this.socket.on(`transactionUpdate_${this.$store.state.user.id}`, (data) => {
        console.log('New transaction update received:', data);
        // Refresh transactions when notification is received
        this.getTransactions();
        this.getCredits();
      });
      
      // You can also listen for general notifications that might affect transactions
      this.socket.on(`myNotifs_${this.$store.state.user.id}`, (res) => {
        console.log('New notification received:', res);
        // Check if the notification is related to transactions
        if (res.data) {
          this.getTransactions();
          this.getCredits();
        }
      });
    },
    disconnectSocket() {
      if (this.socket) {
        // Remove listeners to prevent memory leaks
        this.socket.off(`transactionUpdate_${this.$store.state.user.id}`);
        this.socket.off(`myNotifs_${this.$store.state.user.id}`);
        this.socket.disconnect();
      }
    },
    viewFile(imagePath){
        window.open(process.env.VUE_APP_BASE_URL + "/user_wallet_transaction/get_screenshot/" + imagePath);
    },
    changeStatus(val){
      if(val == 2) return "Disapproved";
      else if(val == 1) return "Approved";
      else return "Pending"
    },
    changeStatusStyle(val){
      if(val == 2) return "bg-red-500";
      else if(val == 1) return "bg-green-500";
      else return "bg-orange-500"
    },
    getTransactions(){

      axios.get(process.env.VUE_APP_BASE_URL + '/user_wallet_transaction/find_by_user/' + this.$store.state.user.id)
      .then((res)=>{
      
          if(res.status == 200){

            this.alltransactions = res.data;
          
          }
          
      });
    
  },
    onFileChange(e){
                var fileData =  e.target.files[0];
                if(fileData){
                    var fileName = "";
                    var fileExt = "";
                    var fileArray = fileData.name.split(".");
                    
                    for(var i = 0; i < fileArray.length; i++){
                        fileArray[i] = fileArray[i].replaceAll(",", '');
                            if(i == fileArray.length - 2){
                            fileArray[i] = fileArray[i].replace(/[^a-zA-Z0-9 _-]/g, '');
                            fileName += fileArray[i];
                            }
                            else{
                                fileName += fileArray[i] + "."; 
                            }
                            if(i == fileArray.length - 2) break;

                    }


                    fileExt = fileArray[fileArray.length - 1].toLowerCase().trim();
                    if(fileExt != "jpg" && fileExt != "jpeg" && fileExt != "png"){
                        this.showNotification(0,'Invalid file extension','Please upload only image files.');
                        this.$refs.fileupload.value = null;
                    }
                    else{
                        const today = new Date();
                        const date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
                        fileName = this.$store.state.user.user_id + "_ " + date;
                        this.data.file_attachment = fileName + "."+ fileExt;

                        const formdata = new FormData();
                        var file_input = document.getElementById('fileupload').files[0];
                        
                        formdata.append("file", file_input, this.data.file_attachment);
                        this.data.file = formdata;
                    }
                }
        },
    loadAccount(){
      var valid = true;

      const today = new Date();
      const date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
      const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      const timestamp = date + ' ' + time;

      this.data.datetime_added = timestamp;
      
      if(this.data.file_attachment == ''){
        this.showNotification(0,"No screenshot", "Please upload payment screenshot");
        valid = false;
      }
      else if(this.data.input_credit < 100){
        this.showNotification(0,"Not valid amount", "Amount must not be less than 100");
        valid = false;
      }

      if(valid){
        axios.post(process.env.VUE_APP_BASE_URL + '/user_wallet_transaction/add', this.data)
        .then((res)=>{

            if(res.status == 201){

                if(this.data.file){

                    axios.post(process.env.VUE_APP_BASE_URL + '/user_wallet_transaction/upload_screenshot', this.data.file)
                .then((res)=>{

                    if(res.status == 201){
                        
                        this.showNotification(1,"Pre-load Successful!","Please wait for the admin to confirm payment. Thank you!");
                        this.refreshData();

                    }
                    
                });

                }

                
            }
            
        });
      }

        

      
    },
    addToAmount(val){
      this.data.input_credit = val;
    },
    changeMonetaryFormat(val){
        return "₱" + val.toFixed(2);
    },
    getCredits(){
        axios.get(process.env.VUE_APP_BASE_URL + '/user/find/' + this.$store.state.user.id)
        .then((res)=>{
        
            if(res.status == 200){
        
                this.available_credits = res.data.credits;
            }
            
        });
    },
    getDateTimeFormat(value){
      return moment(value).format('MMMM DD, YYYY h:mm a');
    },  
    refreshData(){
      this.data.input_credit = 0;
      this.$refs.fileupload.value = null;
      this.getCredits();
      this.getTransactions();
    }
  },
  mounted: function(){
    this.refreshData();
  }
}


</script>