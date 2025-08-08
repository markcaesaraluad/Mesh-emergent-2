<template>
  <div>

    <div>

      <!-- Daily Stats section removed as requested -->

      <!-- Restructured layout: 3-column layout for Pending Accounts, Wallet Transactions, and Sessions -->

      <!-- Restructured layout: 3-column layout for main sections -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
        
        <!-- Column 1: On Going Customer Sessions -->
        <div class="bg-white rounded-lg p-4 shadow">
          <div class="flex sm:flex-row flex-col items-center my-4">
            <span class="flex-auto text-xl text-gray-800 mb-2 sm:mb-0">Customer Sessions</span>
            <select v-model="search_type" class="flex-none mx-2 rounded-md text-sm" @change="getSessions(search_type,null)">
              <option value="latest" selected>Latest</option>
              <option value="login">Logged In</option>
              <option value="logout">Logged Out</option>
              <option value="pause">Paused</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-xs text-left text-gray-500">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" class="px-2 py-2 text-left">ID#</th>
                    <th scope="col" class="px-2 py-2 text-left">Time</th>
                    <th scope="col" class="px-2 py-2 text-center">Status</th>
                  </tr>
              </thead>
              <tbody>
                <tr v-if="allsessiondata.length == 0">
                  <td colspan="3" class="py-5 px-2 text-center text-gray-500 text-xs">No items yet.</td>
                </tr>
                <tr v-for="i in allsessiondata.slice(0, 5)" v-bind:key="i.id" class="odd:bg-white even:bg-gray-50 border-b hover:bg-gray-100">
                  <td class="px-2 py-1 text-xs">{{i.user_id.user_id}}</td>
                  <td class="px-2 py-1 text-xs">{{ getTimeRemaining(i.datetime_added) }}</td>
                  <td class="px-2 py-1 text-center">
                    <span :class="i.status == 1 ? 'bg-green-500' : 'bg-red-500'" class="text-white px-2 py-1 rounded text-xs">
                      {{i.status == 1 ? 'In' : 'Out'}}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <button class="w-full bg-gray-600 hover:bg-gray-700 rounded-lg px-4 py-2 cursor-pointer text-white text-center text-sm mt-3" @click="showCustomerSessionModal">
            Scan ID
          </button>
        </div>

        <!-- Column 2: Pending Accounts -->
        <div class="bg-white rounded-lg p-4 shadow">
          <div class="flex flex-col my-4 gap-2">
            <span class="text-xl text-gray-800">Pending Accounts</span>

            <div class="overflow-x-auto">
              <table class="w-full text-xs">
                <thead class="bg-white">
                  <tr>
                    <th scope="col" class="py-2 px-2 text-gray-500 font-bold text-left text-xs">Name</th>
                    <th scope="col" class="py-2 px-2 text-gray-500 font-bold text-center text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-if="allpending.length == 0">
                    <td colspan="2" class="py-5 px-2 text-center text-gray-500 text-xs">No pending accounts yet.</td>
                  </tr>
                  <tr v-for="i in allpending.slice(0, 5)" v-bind:key="i.id" class="hover:bg-gray-100">
                    <td class="py-2 px-2 text-xs text-gray-500">{{changeFormatUser(i)}}</td>
                    <td class="py-2 px-2 text-center">
                      <button @click="showPendingModal(i.id, 'edit')" class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs">
                        Edit
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Column 3: Pending Appointments/Bookings -->
        <div class="bg-white rounded-lg p-4 shadow">
          <div class="flex flex-col my-4 gap-2">
            <span class="text-xl text-gray-800">Pending Appointments</span>

            <div class="overflow-x-auto">
              <table class="w-full text-xs text-left text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" class="px-2 py-2 text-left">Customer</th>
                    <th scope="col" class="px-2 py-2 text-left">Area</th>
                    <th scope="col" class="px-2 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="allappointments.length == 0">
                    <td colspan="3" class="py-5 px-2 text-center text-gray-500 text-xs">No pending appointments yet.</td>
                  </tr>
                  <tr v-for="i in allappointments.slice(0, 5)" v-bind:key="i.id" class="odd:bg-white even:bg-gray-50 border-b hover:bg-gray-100">
                    <td class="px-2 py-1 text-xs">{{changeFormatUser(i.user_id)}}</td>
                    <td class="px-2 py-1 text-xs">{{i.area_id.description}}</td>
                    <td class="px-2 py-1 text-center">
                      <button @click="approveAppointment(i.id)" class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs mr-1">
                        Approve
                      </button>
                      <button @click="rejectAppointment(i.id)" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">
                        Reject
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
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

      search_type : 'latest',

      alldata : '',
      allpending : '',
      allsessiondata : '',
      allappointments : '',
      allwallettransactions : '',
      total_myfiles : 0,
      total_trash : 0,
      fullName : this.$store.state.user ? (this.$store.state.user.fname + ' ' + (this.$store.state.user.mname || '') + ' ' + this.$store.state.user.lname) : '',
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

    getAppointments(){
      // Get pending appointments (status = 0 means pending)
      axios.get(process.env.VUE_APP_BASE_URL + '/area_rooms_reservation/get_all/1/10')
      .then((res)=>{

        if(res.status == 200){
          // Filter only pending appointments (status = 0)
          this.allappointments = res.data[0].filter(appointment => appointment.status === 0);
        }

      })
      .catch((error) => {
        console.error('Error fetching appointments:', error);
        // Fallback to empty array if endpoint doesn't exist
        this.allappointments = [];
      });
    },

    async approveAppointment(appointmentId) {
      try {
        // Update appointment status to approved (status = 1)
        const response = await axios.patch(
          `${process.env.VUE_APP_BASE_URL}/area_rooms_reservation/update/${appointmentId}`,
          { status: 1 }
        );
        
        if (response.status === 200) {
          this.showNotification(1, 'Success', 'Appointment approved successfully');
          this.refreshData(); // Refresh to remove from pending list
        }
      } catch (error) {
        console.error('Error approving appointment:', error);
        this.showNotification(0, 'Error', 'Failed to approve appointment');
      }
    },

    async rejectAppointment(appointmentId) {
      try {
        // Update appointment status to rejected (status = 2)  
        const response = await axios.patch(
          `${process.env.VUE_APP_BASE_URL}/area_rooms_reservation/update/${appointmentId}`,
          { status: 2 }
        );
        
        if (response.status === 200) {
          this.showNotification(1, 'Success', 'Appointment rejected');
          this.refreshData(); // Refresh to remove from pending list
        }
      } catch (error) {
        console.error('Error rejecting appointment:', error);
        this.showNotification(0, 'Error', 'Failed to reject appointment');
      }
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

              // update the time every second - fix language tag issue
    this.interval = setInterval(() => {
      try {
        // Use a safe locale or fallback to en-US
        const locale = navigator.language && navigator.language.indexOf('@') === -1 ? navigator.language : 'en-US';
        this.time = new Intl.DateTimeFormat(locale, {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        }).format(new Date());
      } catch (error) {
        // Fallback to simple time format if Intl fails
        const now = new Date();
        this.time = now.toLocaleTimeString('en-US');
      }
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
      this.getAppointments();

    }

  },
  mounted: function(){
    // Check if user exists before proceeding
    if (!this.$store.state.user) {
      console.error('No user in store state, redirecting to login');
      this.$router.push('/');
      return;
    }

    this.getDateTime();
    this.refreshData();
  }
}


</script>