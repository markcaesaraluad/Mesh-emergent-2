<template>
  <div>

    <div class="flex flex-col sm:flex-col p-4">

      
      <div class="flex flex-col flex-none w-full py-4 px-4 bg-gray-200 rounded-md fadeInSlide">

        <!-- <FullCalendar :options="calendarOptions" class="bg-white p-4 rounded-md fadeInSlide"/> -->

        <FullCalendar :options='calendarOptions' ref="cc" class="bg-white rounded-md p-4">
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

    </div>

    <ViewAppointmentModal v-if="show_ViewModal" @close-modal="show_ViewModal = false" :refreshData="refreshData" :item_data="item_data" :showNotification="showNotification"/>
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

export default{
  data(){
    return{
      total_myfiles : 0,
      total_trash : 0,
      fullName : this.$store.state.user.fname,
      dateTime : '',
      interval : null,
      time : '00:00:00 AA',

      item_data : {
        id: '',
      },

      //data
      alldata : '',
      
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
    ViewAppointmentModal
  },
  props: {
    showNotification : Function
  },
  methods: {
    showViewModal(data){
      this.item_data.id = data;
      this.show_ViewModal = true;
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
    refreshData(){
      this.getAppointment(moment(new Date()).format('YYYY-MM-DD'));
    }
  },
  mounted: function(){
    this.getDateTime();
    this.refreshData();
  }
}


</script>