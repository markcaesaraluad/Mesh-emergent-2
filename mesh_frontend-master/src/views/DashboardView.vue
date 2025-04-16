<template>
  <div>
    
    <div>

      <div class="flex flex-col sm:flex-row items-center gap-2">

        <div class="flex-auto w-full sm:flex-none sm:w-1/4 flex items-center bg-white p-6 rounded-lg fadeInSlide shadow">
          <img src="../assets/peso.png" class="flex-none h-20 w-auto"/>
          <div class="flex-none flex flex-col px-8">
            <span class="flex-none text-gray-800">Current Credits</span>
            <span class="flex-none text-3xl font-bold text-gray-800 flex items-center">{{ changeMonetaryFormat(available_credits) }} <img @click="goToWallet" src="../assets/small_action_icon_add.png" class="flex-none h-auto w-auto ml-2 cursor-pointer"/></span>
          </div>
        </div>

        <div class="flex-auto w-full sm:flex-none sm:w-1/4  flex items-center bg-white p-6 rounded-lg fadeInSlide shadow">
          <img src="../assets/icon_pending.png" class="flex-none h-20 w-auto"/>
          <div class="flex-none flex flex-col px-8">
            <span class="flex-none text-gray-800">Incoming Appointments</span>
            <span class="flex-none text-3xl font-bold text-gray-800">{{ total_incoming_appointments }}</span>
          </div>
        </div>

        <div class="flex-auto w-full sm:flex-none sm:w-1/4  flex items-center bg-white p-6 rounded-lg fadeInSlide shadow">
          <img src="../assets/booking.png" class="flex-none h-20 w-auto"/>
          <div class="flex-none flex flex-col px-8">
            <span class="flex-none text-gray-800">Finished Appointments</span>
            <span class="flex-none text-3xl font-bold text-gray-800">{{ total_finished_appointments }}</span>
          </div>
        </div>

       

      </div>

      <FullCalendar :options='calendarOptions' ref="cc" class="bg-white rounded-md p-4 my-4">
              <template v-slot:eventContent='arg'>
                <b>{{ arg.timeText }}</b>
                <i>{{ arg.event.title }}</i>
              </template>
            </FullCalendar>

    </div>

    <ViewMyAppointmentModal v-if="show_ViewModal" @close-modal="show_ViewModal = false" :refreshData="refreshData" :item_data="item_data" :showNotification="showNotification"/>
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
import ViewMyAppointmentModal from '../components/Modals/ViewMyAppointmentModal.vue';
import { io } from "socket.io-client";

export default{
  data(){
    return{
      available_credits : 0,
      total_incoming_appointments : 0,
      total_finished_appointments : 0,
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
      //toggles
      show_ViewModal : false,

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
    ViewMyAppointmentModal
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
        this.getCredits();
      });
      
      // You can also listen for general notifications that might affect transactions
      this.socket.on(`myNotifs_${this.$store.state.user.id}`, (res) => {
        console.log('New notification received:', res);
        // Check if the notification is related to transactions
        if (res.data) {
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
    goToWallet(){
      this.$router.push('/wallet');
    },
    showViewModal(data){
      this.item_data.id = data;
      this.show_ViewModal = true;
    },
    getAppointment(input_date){
        axios.get(process.env.VUE_APP_BASE_URL + '/area_rooms_reservation/find_user/' + this.$store.state.user.id + '/' + input_date)
        .then((res)=>{
        
            if(res.status == 200){

              

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
    getAppointmentCounts(){
        axios.get(process.env.VUE_APP_BASE_URL + '/area_rooms_reservation/get_incoming_appointments/' + this.$store.state.user.id + '/' + 0)
        .then((res)=>{
        
            if(res.status == 200){
        
                this.total_incoming_appointments = res.data.total_cnt;
            }
            
        });

        axios.get(process.env.VUE_APP_BASE_URL + '/area_rooms_reservation/get_incoming_appointments/' + this.$store.state.user.id + '/' + 1)
        .then((res)=>{
        
            if(res.status == 200){
        
                this.total_finished_appointments = res.data.total_cnt;
            }
            
        });
    },
checkHasCode(val){
      if(val.abbre != '') return val.abbre;
      else return val.description;
    },
    checkStatusClass(status){
      if(status == 1) return "bg-green-500";
      else return "bg-orange-500";
    },
    checkStatus(status){
      if(status == 1) return "OUT";
      else return "IN";
    },
    checkForwarded(id){
      if(id == null) return "-";
      else return id.abbre;
    },
    getDateTimeFormat(value){
      return moment(value).format('MMMM DD, YYYY h:mm a');
    },  
    refreshData(){
      this.getAppointment(moment(new Date()).format('YYYY-MM-DD'));
      this.getCredits();
      this.getAppointmentCounts();
    }
  },
  mounted: function(){
    this.getDateTime();
    this.refreshData();
  }
}


</script>