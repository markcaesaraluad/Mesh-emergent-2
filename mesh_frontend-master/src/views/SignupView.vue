<template>
  
    <div class="bg-white h-screen w-full sm:w-1/4 sm:h-2/3 m-auto px-8 sm:rounded-lg sm:absolute sm:left-0 sm:right-0 sm:top-0 sm:bottom-0 flex flex-col fadeInSlide overflow-y-auto scrollbar border-gray-200 border">
  

  
  <form class="space-y-4 flex-none pt-4 flex flex-col" method="POST" @submit.prevent>

    <div class="flex-none">
        <p class="text-lg font-bold text-gray-700">Sign up an account</p>
      </div>

    <div class="flex-none">
        <p class="text-sm text-gray-700">First name</p>
        <input v-model="data.fname" type="text" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 duration-300">
      </div>

      <div class="flex-none">
        <p class="text-sm text-gray-700">Middle name (optional)</p>
        <input v-model="data.mname" type="text" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 duration-300">
      </div>

      <div class="flex-none flex items-center gap-2">
        <div class="flex-1">
            <p class="text-sm text-gray-700">Last name</p>
            <input v-model="data.lname" type="text" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 duration-300">
        </div>     
        <div class="flex-1">
            <p class="text-sm text-gray-700">Suffix</p>
            <select v-model="data.suffix" type="text" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 duration-300">
                <option value="">None</option>
                <option value="Jr.">Jr.</option>
                <option value="Sr.">Sr.</option>
                <option value="I">I</option>
                <option value="II">II</option>
                <option value="III">III</option>
                <option value="IV">IV</option>
                <option value="V">V</option>
            </select>
        </div>      
      </div>

      <div class="flex-none">
        <p class="text-sm text-gray-700">Contact Number</p>
        <input v-model="data.contact_num" type="text" maxlength="11" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 duration-300">
      </div>

      <div class="flex-none">
        <p class="text-sm text-gray-700">Address</p>
        <input v-model="data.address" type="text" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 duration-300">
      </div>

      <div class="flex-none">
        <p class="text-sm text-gray-700">User name</p>
        <input v-model="data.username" type="text" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 duration-300">
      </div>
  
      <div class="flex-none">
        <p class="text-sm text-gray-700">Email address</p>
        <input v-model="data.email" type="email" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 duration-300">
      </div>
  
      <div class="flex-none">
        <p class="text-sm text-gray-700">Password</p>
        <input v-model="data.password" type="password" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 duration-300">
      </div>
  
      <div class="flex-none">
        <button type="submit" class="flex w-full justify-center rounded-md bg-biege-700 px-3 py-2 text-xs font-semibold leading-6 text-white shadow-sm hover:bg-biege-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 mt-4" @click="signUp">FINISH PRE-REGISTRATION</button>
      </div>
  
  </form>
  
  <div class="flex-none">
    
  
      <div class="text-center mt-2">
      <span class="text-red-500 text-xs" :class="alertMsg ? 'fadeInSlide' : ''">{{ alertMsg }}</span>
    </div>
  </div>
  
  
  <div class="flex-auto justify-center flex flex-col pb-8">
  
    <p class="text-center text-sm text-gray-500">
    Already have an account?
    <router-link class="font-semibold leading-6 text-biege-700 hover:text-biege-600" to="/login">Sign in here!</router-link>
  </p>
  

  
    </div>
  
  
  </div>
  
  <LoadingView v-show="loadingViewShown"/>
  
    </template>
    
    
    <script>
  
    import axios from 'axios';
    import moment from 'moment';
    import LoadingView from "./LoadingView.vue";
    import { toast } from 'vue3-toastify';
    import 'vue3-toastify/dist/index.css';
  
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

        data : {
            fname : '',
            mname : '',
            lname : '',
            suffix : '',
            contact_num : '',
            address : '',
            username : '',
            email : '',
            password : '',
            u_type : 1,
            ut_id : 3,
            profile_pic : 'default_pic.png',
            datetime_added : '',
            status : 0,
            qr_img : null,
            credits : 0,
        }
      }
    },
    components: {
      LoadingView
    },
    methods: {
        showNotification(type, msg_title, msg){
  
        var msg_holder = "<b>" + msg_title +"</b><br>" + msg;

        if(type == 0){
        toast(msg_holder, {
            autoClose: 3000,
            dangerouslyHTMLString: true,
            type : "warning"
        })
        }
        else if(type == 1){
        toast(msg_holder, {
            autoClose: 3000,
            dangerouslyHTMLString: true,
            type : "success"
        })
        }

        // if(this.showNotif){
        //     this.showNotif = false;
        // }
        // else{
        //     this.showNotif = true;
        // }
        },  
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
      // signUp(){

      //   const today = new Date();
      //   const date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
      //   const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      //   const timestamp = date + ' ' + time;
       
      //   this.data.datetime_added = timestamp;

      //   console.log(this.data);
      //   axios.post(process.env.VUE_APP_BASE_URL + '/user/register', this.data)
      //   .then((res)=>{
      //   console.log(res);

      //       if(res.status == 201){

      //           this.showNotification(1,"Success!","You have successfully registered. Please wait for approval");
      //           this.$router.push('/login');
      //       }
            
      //   });
      //   }

async signUp() {
  try {
    // Format date properly for MySQL
    const today = new Date();
    const date = today.toISOString().slice(0, 19).replace('T', ' ');
    
    // Prepare data
    const userData = {
      ...this.data,
      datetime_added: date
    };

    console.log('Sending user data:', userData);

    // Make the API call
    const response = await axios.post(
      `${process.env.VUE_APP_BASE_URL}/user/register`, 
      userData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Server response:', response);

    if (response.status === 201) {
      this.showNotification(1,"Success!","You have successfully registered. Please wait for approval");
      this.$router.push('/login');
    }

  } catch (error) {
    console.error('Registration error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    let errorMessage = "Registration failed. Please try again.";

    if (error.response) {
      // Server responded with an error
      errorMessage = error.response.data.message || errorMessage;
    } else if (error.request) {
      // Request made but no response received
      errorMessage = "No response from server. Please check your connection.";
    }

    this.showNotification(
      0,  // Assuming 0 is for error notifications
      "Error",
      errorMessage
    );
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
    