<template>
    <div>

      <p class="text-2xl text-gray-800 mb-4">Select Employee</p>

      <div class="flex flex-col w-full space-y-2">

        <div class="flex-none">
          <p>Select receptionist</p>
          <select v-model="receptionist_id" class="w-1/5 rounded-md">
            <option v-for="i in allreceptionist" v-bind:key="i.id" v-bind:value="i.id ">{{ i.lname + ', ' + i.fname }}</option>
          </select>
        </div>

        <div class="flex-none">
          <p>Select month and year</p>
          <input v-model="selected_date" type="month" class="w-auto rounded-md"/>
            
        </div>


        <div class="flex-none">
          <button @click="generateReport" class="bg-biege-700 text-white px-4 py-2 rounded-md">Generate Data</button>
        </div>

      </div>

      <div class="bg-white p-2 rounded-md mt-4 fadeInSlide" v-if="alldata.length > 0">


        <table class="min-w-full divide-y divide-gray-300">
                            <thead class="bg-white">
                            <tr class="text-white">
                                <th scope="col" class="py-4 px-4 text-gray-500 font-bold text-left text-sm w-auto">Date & Time Added</th>
                                <th scope="col" class="py-4 px-4 text-gray-500 font-bold text-left text-sm sm:pl-4 w-auto">Time In</th>
                                <th scope="col" class="py-4 px-4 text-gray-500 font-bold text-left text-sm sm:pl-4 w-auto">Time Out</th>
                            </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                            <tr v-for="i in alldata" v-bind:key="i.id" class="hover:bg-gray-200">

                                <td class="py-4 px-4 text-sm text-gray-500 sm:pl-6 w-auto text-left">{{ getDateTimeFormat(i.datetime_added) }}</td>
                                <td class="py-4 px-4 text-sm text-gray-500 sm:pl-6 w-auto text-left">{{ getTimeInOutFormat(i.time_in)}}</td>
                                <td class="py-4 px-4 text-sm text-gray-500 sm:pl-6 w-auto text-left">{{ getTimeInOutFormat(i.time_out)}}</td>
                            </tr>

                            </tbody>
                        </table>


        </div>

    </div>

  </template>

<script>

import moment from 'moment';
import axios from 'axios';

export default{
  data(){
    return{
        
    alldata : '',
    selected_date : '',
    receptionist_id : '',

    }
  },
  props: {
    showNotification : Function
  },
  methods: {
    formatUserName(i){

var result = '';

if(i){

    result += i.fname;
    if(i.mname) result += ' ' + i.mname.substring(0,1) + '.';
    result += ' ' + i.lname;
    if(i.suffix) result += ' ' + i.suffix;
}
else{
    return '-';
}

return result.toUpperCase();

},
    generateReport(){

        this.selected_date += '-00';

      axios.get(process.env.VUE_APP_BASE_URL + '/employee_sessions/get_time_monitoring_list/' + this.selected_date + '/' + this.receptionist_id)
      .then((res)=>{

          if(res.status == 200){

                this.alldata = res.data; 

          }
          
      });


      
    },
    getReceptionist(){
      axios.get(process.env.VUE_APP_BASE_URL + '/user/get_all/' + 1 + '/' + 1000+ '/' + 'receptionist')
      .then((res)=>{
      
        if(res.status == 200){
      
          this.allreceptionist = res.data[0];
          this.receptionist_id = this.allreceptionist[0].id;
        }
        
      })
    },

    getDateTimeFormat(value){
      return moment(value).format('MMMM DD, YYYY h:mm a');
    },  
    getTimeInOutFormat(value){
      if(value){
        return moment(value).format('hh:mm a');
      }
      else{
        return "Missing";
      }
    },  
    refreshData(){


      this.getReceptionist();
      // this.getAppointment(moment(new Date()).format('YYYY-MM-DD'));
      // this.getCredits();
      // this.getAppointmentCounts();
    }
  },
  mounted: function(){
    this.refreshData();
  }
}


</script>