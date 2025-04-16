<template>
  
  <div class="bg-white h-screen w-full sm:w-1/5 sm:h-2/3 m-auto px-8 sm:rounded-3xl sm:absolute sm:left-0 sm:right-0 sm:top-0 sm:bottom-0 flex flex-col fadeInSlide overflow-y-auto scrollbar">


<img class="mx-auto h-28 sm:h-48 w-auto mt-8 mb-2 flex-none " src="../assets/logo_single.png" alt="Your Company">

<div class="flex-none rounded-md px-4 h-auto w-full">
  <span class="mx-auto text-center bg-orange-500">
    <p class="text-sm font-thin text-gray-700">{{ dateTime }}</p>
    <p class="text-lg font-bold text-gray-700">{{ time }}</p> 
  </span>
</div>

<form class="space-y-4 flex-none pt-4 flex flex-col" method="POST" @submit.prevent>

    <div class="flex-none">
      <p class="text-sm text-gray-700">Email address</p>
      <input id="email" v-model="email" name="email" type="email" autocomplete="email" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 duration-300" :class="errorEmail ? 'ring-red-500 focus:ring-red-500' : 'ring-gray-300'">
    </div>

    <div class="flex-none">
      <p class="text-sm text-gray-700">Password</p>
      <input id="password" v-model="password" name="password" type="password" autocomplete="current-password" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 duration-300" :class="errorEmail ? 'ring-red-500 focus:ring-red-500' : 'ring-gray-300'">
    </div>

    <div class="flex-none">
      <button type="submit" class="flex w-full justify-center rounded-md bg-biege-700 px-3 py-2 text-xs font-semibold leading-6 text-white shadow-sm hover:bg-biege-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 mt-4" @click="loginUser">SIGN IN</button>
    </div>

</form>

<div class="flex-none">
  

    <div class="text-center mt-2">
    <span class="text-red-500 text-xs" :class="alertMsg ? 'fadeInSlide' : ''">{{ alertMsg }}</span>
  </div>
</div>




</div>

<LoadingView v-show="loadingViewShown"/>

  </template>
  
  
  <script>

  import axios from 'axios';
  import moment from 'moment';
  import LoadingView from "./LoadingView.vue";

  export default{
    data(){
    return{
      loadingViewShown : false,
      email : '',
      password : '',
      errorEmail : false,
      errorPassword : false,
      alertMsg : '',
      dateTime : '',
      interval : null,
      time : '00:00:00 AA',
    }
  },
  components: {
    LoadingView
  },
  methods: {
    getDateTime(){
      const today = new Date();
      const date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
      const timestamp = date;

      this.dateTime = moment(String(timestamp)).format('dddd, MMMM DD, YYYY');

      // update the time every second
      this.interval = setInterval(() => {
        // Concise way to format time according to system locale.
        // In my case this returns "3:48:00 am"
        this.time = Intl.DateTimeFormat(navigator.language, {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        }).format()
      }, 1000)

    },
    loginUser(){
      this.errorEmail = false;
      this.errorPassword = false;
      if(this.email == ""){
        this.errorEmail = true;
      }
      else if(this.password == ""){
        this.errorPassword = true;
      }
      else{
        this.loadingViewShown = true;
        this.alertMsg = '';

        let user_data = {
          email : this.email,
          password : this.password,
        };

          this.email = "";
          this.password = "";

        axios.post(process.env.VUE_APP_BASE_URL + '/auth/login', user_data)
            .then((res)=>{
                
                if(res.data.status == 302){
                this.loadingViewShown = false;
                this.email = "";
                this.password = "";
                this.$store.commit('UPDATE_USER',res.data.user);
                this.$router.push('/admin_dashboard');
                }
                else if(res.data.status == 404){
                  this.loadingViewShown = false;
                  this.alertMsg = res.data.message;
                }
            })
      }
      
    }
  },
  mounted(){
    this.getDateTime();
  }
  }
  </script>

<style>

.fadeInSlide {
    animation: fadeInSlide 1s ease forwards;
  }
  @keyframes fadeInSlide {
    from {
      opacity: 0;
      transform: translate3d(10%, 10%, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  .fade {
    animation: fade 1s ease forwards;
  }

  @keyframes fade {
    to {
      opacity: 0.25;
    }
  }

</style>
  