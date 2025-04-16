<template>
  <div>

    <div>

      <p class="text-2xl text-gray-800 mb-4">Daily Stats</p>

      <div class="flex flex-col sm:flex-row items-center gap-2">

        <div class="flex-auto w-full sm:flex-none sm:w-1/4 flex items-center bg-white p-6 rounded-lg fadeInSlide shadow">
          <img src="../assets/icon_sitting.png" class="flex-none h-20 w-auto"/>
          <div class="flex-none flex flex-col px-8">
            <span class="flex-none text-gray-800">Total Customers Occupied</span>
            <span class="flex-none text-3xl font-bold text-gray-800">0</span>
          </div>
        </div>

        <div class="flex-auto w-full sm:flex-none sm:w-1/4  flex items-center bg-white p-6 rounded-lg fadeInSlide shadow">
          <img src="../assets/icon_visit.png" class="flex-none h-20 w-auto"/>
          <div class="flex-none flex flex-col px-8">
            <span class="flex-none text-gray-800">Total Customers Visited</span>
            <span class="flex-none text-3xl font-bold text-gray-800">0</span>
          </div>
        </div>

      </div>

      <div>
        <div class="flex sm:flex-row flex-col items-center my-4">
          <span class="flex-auto text-2xl text-gray-800">On Going Customer Sessions</span>
          <select v-model="search_type" class="flex-none mx-2 rounded-md" @change="getSessions(search_type,null)">
            <option value="login">Logged In</option>
            <option value="logout">Logged Out</option>
            <option value="pause">Paused</option>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
          <button class="flex-none w-auto bg-gray-600 hover:bg-gray-700 rounded-lg px-24 py-2 cursor-pointer text-white text-center fadeInSlide" @click="showCustomerSessionModal" autofocus>
            Scan ID
        </button>
        </div>

        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3 w-auto text-left">
                  ID#
                </th>
                <th scope="col" class="px-6 py-3 w-auto text-left">
                  Time Remaining
                </th>
                <th scope="col" class="px-6 py-3 w-48 text-center">
                  Status
                </th>
                <th scope="col" class="py-3 text-center w-48">
                  Date & Time
                </th>
              </tr>
          </thead>
          <tbody>
    
            <tr v-if="allsessiondata.length == 0">
              <td colspan="7" class="py-5 px-5">
                <!-- <img src="../assets/icon_empty_document.png" class="mx-auto h-24"/> -->
                <p class="w-full text-center mt-4 text-gray-500 text-sm">There are no items yet.</p>
              </td>
            </tr>
    
              <tr v-for="i in allsessiondata" v-bind:key="i.id" class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-200">
                    <td class="px-6 py-2 w-auto text-left">
                      {{i.user_id.user_id}}
                    </td>
                    <td class="px-6 py-2 w-auto text-left">
                      {{ getTimeRemaining(i.datetime_added) }}
                    </td>
                    <td class="px-6 py-2 w-48 text-center">
                      <span :class="i.status == 1 ? 'bg-green-500' : 'bg-red-500'" class="text-white px-8 py-1 rounded-lg">
                        {{i.status == 1 ? 'Logged In' : 'Logged Out'}}
                      </span>
                    </td>
                    <td class="px-2 py-2 text-center w-48">
                      {{getDateTimeFormat(i.datetime_added)}}
                    </td>
              </tr>
              
          </tbody>
      </table>


      </div>

      <div>

      <div class="flex flex-col my-4 gap-2">
        <span class="flex-auto text-2xl text-gray-800">Pending Accounts</span>

        <table class="min-w-full divide-y divide-gray-300 w-full">
          <thead class="bg-white">
          <tr class="text-white">
              <th scope="col" class="py-4 px-4 text-gray-500 font-bold text-left text-sm sm:pl-4 w-auto">Name</th>
              <th scope="col" class="py-4 px-4 text-gray-500 font-bold text-center text-sm w-1/4">Date & Time Added</th>
              <th scope="col" class="py-4 px-4 text-gray-500 font-bold text-center text-sm w-16">Actions</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">

            <tr v-if="allpending.length == 0">
                  <td colspan="3" class="py-5 px-5">
                    <!-- <img src="../assets/icon_empty_document.png" class="mx-auto h-24"/> -->
                    <p class="w-full text-center mt-4 text-gray-500 text-md">There are no pending accounts yet.</p>
                  </td>
                </tr>

          <tr v-for="i in allpending" v-bind:key="i.id" class="hover:bg-gray-200">

            <td class="py-4 px-4 text-sm text-gray-500 sm:pl-6 w-auto">{{changeFormatUser(i)}}</td>
            <td class="py-4 px-4 text-sm text-gray-500 sm:pl-6 w-1/4 text-center">{{getDateTimeFormat(i.datetime_added)}}</td>
            <td class="py-4 px-4 text-center w-16">
                <img src="../assets/action_icon_edit.png" @click="showPendingModal(i.id, 'edit')" class="h-4 w-auto cursor-pointer mx-auto">
            </td>
          </tr>

          </tbody>
      </table>

      </div>

      </div>

      <div>

        <div class="flex flex-col my-4 gap-2">
          <span class="flex-auto text-2xl text-gray-800">Wallet Transactions</span>

          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead class="text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" class="px-6 py-3 w-auto text-left">
                      Credit amount
                    </th>
                    <th scope="col" class="px-6 py-3 w-40 text-left">
                      Credit amount
                    </th>
                    <th scope="col" class="px-6 py-3 w-48 text-center">
                      Status
                    </th>
                    <th scope="col" class="py-3 text-center w-1/4">
                      Date & Time
                    </th>
                    <th scope="col" class="py-3 text-center w-20">
                      
                    </th>
                  </tr>
              </thead>
              <tbody>
        
                <tr v-if="allwallettransactions.length == 0">
                  <td colspan="7" class="py-5 px-5">
                    <!-- <img src="../assets/icon_empty_document.png" class="mx-auto h-24"/> -->
                    <p class="w-full text-center mt-4 text-gray-500 text-md">There are no transactions yet.</p>
                  </td>
                </tr>
        
                  <tr v-for="i in allwallettransactions" v-bind:key="i.id" class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-200 text-sm cursor-pointer" @click="showWalletModal(i)">
                        <td class="px-6 py-2 w-40 text-left">
                          {{changeFormatUser(i.user_id)}}
                        </td>
                        <td class="px-6 py-2 w-40 text-left">
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
                        <td class="px-2 py-2 text-center w-20">
                          <button @click="viewFile(i.file_attachment)" class="bg-blue-500 text-white text-xs px-4 py-2 rounded-md w-full">View</button>
                        </td>
                  </tr>
                  
              </tbody>
          </table>
        </div>
        
      </div>

      <p class="text-2xl text-gray-800 my-4">Appointments</p>

      <!-- <p class="text-2xl text-gray-800 my-4">On Going Customer Sessions</p> -->

      <FullCalendar :options='calendarOptions' ref="cc" class="bg-white rounded-md p-4 my-4 fadeInSlide">
          <template v-slot:eventContent='arg'>
            <b>{{ arg.timeText }}</b>
            <i>{{ arg.event.title }}</i>
          </template>
        </FullCalendar>

        <div>


<table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
<thead class="text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    <tr>
      <th scope="col" class="px-6 py-3 w-40 text-left">
        User #
      </th>
      <th scope="col" class="px-6 py-3 w-48 text-center">
        Status
      </th>
      <th scope="col" class="py-3 text-center w-1/4">
        Date & Time
      </th>
    </tr>
</thead>
<tbody>

  <tr v-if="alldata.length == 0">
    <td colspan="7" class="py-5 px-5">
      <!-- <img src="../assets/icon_empty_document.png" class="mx-auto h-24"/> -->
      <p class="w-full text-center mt-4 text-gray-500 text-md">There are no transactions yet.</p>
    </td>
  </tr>

    <tr v-for="i in alldata" v-bind:key="i.id" class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-200 text-sm cursor-pointer" @click="showViewModal(i.id)">
          <td class="px-6 py-2 w-40 text-left">
            {{changeFormatUser(i.user_id)}}
          </td>
          <td class="px-2 py-2 text-center w-1/4">
            <span :class="changeStatusStyle(i.status)" class="text-white px-8 py-1 rounded-lg">
              {{ changeStatus(i.status) }}
            </span>
          </td>
          <td class="px-2 py-2 text-center w-20">
            {{getDateTimeFormat(i.datetime_added)}}
          </td>
    </tr>
    
</tbody>
</table>

</div>

    </div>

    <ViewAppointmentModal v-if="show_ViewModal" @close-modal="show_ViewModal = false" :refreshData="refreshData" :item_data="item_data" :showNotification="showNotification"/>
    <AddCustomerSession v-if="show_CustomerSession" @close-modal="show_CustomerSession = false" :refreshData="refreshData" :item_data="item_data" :showNotification="showNotification"/>

    <ViewWalletRequestModal v-if="showWalletModal_View" @close-modal="showWalletModal_View = false" :refreshData="refreshData" :item_data="item_data" :showNotification="showNotification"/>
    <AddCustomerModal v-if="show_CustomerModal" @close-modal="show_CustomerModal = false" :refreshData="refreshData" :item_data="item_data" :showNotification="showNotification"/>
  </div>
  </template>

<script>

import moment from 'moment';
import axios from 'axios';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import ViewAppointmentModal from '../components/Modals/ViewAppointmentModal.vue';
import AddCustomerSession from '../components/Modals/AddCustomerSession.vue';
import ViewWalletRequestModal from '@/components/Modals/ViewWalletRequestModal.vue';
import AddCustomerModal from '@/components/Modals/AddCustomerModal.vue';
import { io } from "socket.io-client";



export default{
  data(){
    return{

      search_type : 'login',

      alldata : '',
      allpending : '',
      allsessiondata : '',
      allwallettransactions : '',
      total_myfiles : 0,
      total_trash : 0,
      fullName : this.$store.state.user.fname + ' ' + this.$store.state.user.mname + ' ' + this.$store.state.user.lname,
      dateTime : '',
      interval : null,
      time : null,
      socket: null,

      

      item_data : {
        id: '',
      },

      //data
      allmyrecords : '',
      updateTimer: null,
      //toggles
      //toggles
      show_ViewModal : false,
      show_CustomerSession : false,

      showWalletModal_View : false,
      show_CustomerModal : false,

      calendarOptions: {
              plugins: [dayGridPlugin,timeGridPlugin,listPlugin,interactionPlugin],
              initialView: 'dayGridMonth',
              headerToolbar: {
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,dayGridWeek,listDay'
              },
              allDaySlot : false,
              eventColor : '#3d4f6b',
              eventDisplay: "block",
              eventResizableFromStart  : true,
              eventDurationEditable : true,
              droppable : true,
              editable : true,
              selectable : true,
              contentHeight: 600,
              nextDayThreshold: '00:00:00',
              weekends: true,
              weekday: 'long',
              datesSet : (data) => {
                console.log(data);
                this.getAppointment(moment(new Date()).format('YYYY-MM-DD'))
              },
              select: (arg) => {
                const cal = arg.view.calendar;
                cal.unselect();

                
                // this.addActivity(moment(arg.start).format('YYYY-MM-DD hh:mm'),moment(arg.end).format('YYYY-MM-DD hh:mm'));
                
                // this.addActivity(arg.start,arg.end);

                // cal.addEvent(this.addActivity(moment(arg.start).format('YYYY-MM-DD hh:mm'),moment(arg.end).format('YYYY-MM-DD hh:mm')));
                // cal.addEvent({
                //     id : this.date_events[this.date_events.length - 1].id,
                //     title: `New event ${id.value}`,
                //     start: arg.start,
                //     end: arg.end,
                //     allDay: true,
                //     to_who : '',
                //     description : '',
                //     type : 0,
                // })
              },
              // eventResize: (arg) => {
              //   this.updateAnnouncements("resize",arg.event.id,arg.event.start,arg.event.end);
              // },
              // eventDrop: (arg) => {
              //   this.updateAnnouncements("drop",arg.event.id,arg.event.start,arg.event.end);
              //   //alert(arg.event.start + "" + arg.event.end);
              // },  
              eventClick: (arg) => {
                this.showViewModal(arg.event.id);
              },    
              events: []
          },
    }
  },
  components: {
    FullCalendar, // make the <FullCalendar> tag available
    ViewAppointmentModal,
    AddCustomerSession,
    ViewWalletRequestModal,
    AddCustomerModal
  },
  props: {
    showNotification : Function
  },
  created() {
    this.startUpdateTimer();
    this.initializeSocket();
  },

  beforeUnmount() {
    this.stopUpdateTimer();
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
      });
      
      // You can also listen for general notifications that might affect transactions
      this.socket.on(`myNotifs_${this.$store.state.user.id}`, (res) => {
        console.log('New notification received:', res);
        // Check if the notification is related to transactions
        if (res.data) {
          this.getTransactions();
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
    getTimeRemaining(value) {
      const now = moment();
      const sessionTime = moment(value);
      
      // For past times, show time elapsed
      const duration = moment.duration(now.diff(sessionTime));
      const days = Math.floor(duration.asDays());
      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();
      
      if (days > 0) {
        return `${days}d ${hours}h ago`;
      } else if (hours > 0) {
        return `${hours}h ${minutes}m ago`;
      } else if (minutes > 0) {
        return `${minutes}m ${seconds}s ago`;
      } else {
        return `${seconds}s ago`;
      }
    },
    startUpdateTimer() {
      // Update time remaining every minute
      this.updateTimer = setInterval(() => {
        this.$forceUpdate();
      }, 60000); // Update every minute
    },

    stopUpdateTimer() {
      if (this.updateTimer) {
        clearInterval(this.updateTimer);
        this.updateTimer = null;
      }
    },
      showPendingModal(id, action){
        this.item_data.id = id;
        this.item_data.action = action;
        this.show_CustomerModal = true;
    },
    showWalletModal(data){
        this.item_data.id = data.id;
        this.showWalletModal_View = true;
    },
    changeMonetaryFormat(val){
        return "₱" + val.toFixed(2);
    },
    changeFormatUser(data){
        return data.user_id + ', ' + data.fname;
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
    convertSeconds(count){
      if(count < 0){
        return "00:00:00";
      }
      else{
        var h = Math.floor(count / 3600).toString().padStart(2,'0');
        var m = Math.floor(count % 3600 / 60).toString().padStart(2,'0');
        var s = Math.floor(count % 60).toString().padStart(2,'0');

        return h + ":" + m + ":" + s;
      }
    },
    runTimer(ele,count,status){
      if(status != 2){
            setInterval(function(){

              ele.html(this.convertSeconds(count--));
            }, 1000);
          }
          else{
            ele.html(this.convertSeconds(count));
          }
    },
    showViewModal(data){
      this.item_data.id = data;
      this.show_ViewModal = true;
    },
    showCustomerSessionModal(data){
      this.item_data.id = data;
      this.show_CustomerSession = true;
    },
    getPending(){

      axios.get(process.env.VUE_APP_BASE_URL + '/user/get_all_pending/' + 1 + '/' + 10 + '/' + 'customer')
    .then((res)=>{
    
      if(res.status == 200){
    
        this.allpending = res.data[0];
    
      }
      
    })

    },
    getTransactions(){

      axios.get(process.env.VUE_APP_BASE_URL + '/user_wallet_transaction/get_all/' + 1 + '/' + 10)
      .then((res)=>{

          if(res.status == 200){

            this.allwallettransactions = res.data[0];
          
          }
          
      })
      .catch(error => {
          console.error('Error fetching transactions:', error);
        });

      },
    getSessions(type,name){


      if(type){
        axios.get(process.env.VUE_APP_BASE_URL + '/user_sessions/get_all_filter/1/10/' + type + '/' + name)
        .then((res)=>{
          // console.log(res);
        
          this.allsessiondata = res.data[0];
            // if(res.status == 200){

             
            // }
            
        });
      }
      else{
        axios.get(process.env.VUE_APP_BASE_URL + '/user_sessions/get_all/1/10')
        .then((res)=>{
        
            if(res.status == 200){

              this.allsessiondata = res.data[0];
             
            }
            
        });
      }
        
    },
    getAppointment(input_date){
        axios.get(process.env.VUE_APP_BASE_URL + '/area_rooms_reservation/get_appointments/' + input_date)
        .then((res)=>{
        
            if(res.status == 200){

              this.alldata = res.data;

              for(var i = 0; i < res.data.length; i++){

                var color = '';
                if(res.data[i].status == 2) color = 'red';
                else if(res.data[i].status == 1) color = 'green';
                else color = 'orange';

                  this.calendarOptions.events.push({
                  id : res.data[i].id,
                  title : res.data[i].area_id.description + ' - ' + res.data[i].rate_id.description,
                  description : '',
                  start : moment(res.data[i].datetime_reserved).format('YYYY-MM-DD hh:mm'),
                  end : moment(res.data[i].datetime_reserved).format('YYYY-MM-DD hh:mm'),
                  allDay : 1,
                  color : color
                })
              }
             
            }
            
        });
    },
    getDateTime(){
              const today = new Date();
              const date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
              const timestamp = date;

              this.dateTime = moment(String(timestamp)).format('MMMM DD, YYYY');

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
    getDateTimeFormat(value){
      return moment(value).format('MMMM DD, YYYY h:mm a');
    },
    viewFile(imagePath){
        window.open(process.env.VUE_APP_BASE_URL + "/user_wallet_transaction/get_screenshot/" + imagePath);
    },
    refreshData(){
      this.getAppointment(moment(new Date()).format('YYYY-MM-DD'));
      this.getSessions(null,null);
      this.getTransactions();
      this.getPending();

    }

  },
  mounted: function(){
    this.getDateTime();
    this.refreshData();
  }
}


</script>