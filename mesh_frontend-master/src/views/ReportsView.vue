<template>
    <div>

      <p class="text-2xl text-gray-800 mb-4">Reports</p>

      <div class="flex flex-col w-full space-y-2">
        <div class="flex-none">
          <p>Select report</p>
          <select v-model="report_type" class="w-1/5 rounded-md">
            <option value="sales_report">Sales</option>
            <option value="sales_report_yearly">Sales Yearly</option>
            <option value="tm">Time Monitoring</option>
          </select>
        </div>

        <div v-if="report_type == 'tm'" class="flex-none">
          <p>Select receptionist</p>
          <select v-model="receptionist_id" class="w-1/5 rounded-md">
            <option v-for="i in allreceptionist" v-bind:key="i.id" v-bind:value="i.id ">{{ i.lname + ', ' + i.fname }}</option>
          </select>
        </div>

        <div v-if="report_type == 'sales_report' || report_type == 'tm'" class="flex-none space-y-2 ">
          <p>Date Range</p>
              <div class="flex items-center gap-2">
                <div class="flex-none flex flex-col">
                <p>From</p>
                <input v-model="date_from" type="date" class="w-full rounded-md">
              </div>
              <div class="flex-none flex flex-col">
                <p>To</p>
                <input v-model="date_to" type="date" class="w-full rounded-md">
              </div>
          </div>
        </div>

        <select v-model="year_selected" v-if="report_type == 'sales_report_yearly'" class="w-1/5 rounded-md">
        <option v-for="i in years" v-bind:key="i.id" :value="i.year">
          {{ i.year }}
        </option>
      </select>

        <div class="flex-none">
          <button @click="generateReport" class="bg-biege-700 text-white px-4 py-2 rounded-md">Generate Report</button>
        </div>

      </div>

    </div>

  </template>

<script>

import moment from 'moment';
import axios from 'axios';

export default{
  data(){
    return{
     
      report_type : 'sales_report',
      receptionist_id : '',
      date_from : '',
      date_to : '',
      year_selected : 2024,
      user : [],

      years : [],

    }
  },
  props: {
    showNotification : Function
  },
  methods: {
    getUserInfo(){
      try {
        axios.get(process.env.VUE_APP_BASE_URL + '/user/find/' + this.$store.state.user.id)
        .then((res)=>{
          this.user = res.data.fname + ' ' + res.data.lname;
        });
      }
      catch (e){
        console.log(e);
      }
    },

    generateReport(){
      this.getUserInfo();

      if(!this.user){
        return;
      }

      // const today = new Date();
      // const date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
      // const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      // const timestamp = date + ' ' + time;

      var details = {
        data : [],
        type : 0,
        file : {
          file_name : '',
        },
        username : '',
       // prepared_by : this.$store.state.user.lname + ',' + this.$store.state.user.fname,
        prepared_by : encodeURIComponent(this.user)
      }

      details.file.file_name = this.report_type.toUpperCase() + "_" + this.date_from + "_" + this.date_to + ".pdf";
      if(this.report_type == 'sales_report'){

        details.type = 1;
        
        axios.get(process.env.VUE_APP_BASE_URL + '/user_packages/get_sales/' + this.date_from + '/' + this.date_to + '/' + details.prepared_by)
        .then((res)=>{
        
            if(res.status == 200){
              
              window.open(process.env.VUE_APP_BASE_URL + "/user_packages/get_report/" + details.file.file_name);
              
        
            }
            
        });

      }
      else if(this.report_type == 'sales_report_yearly'){
      details.type = 3;

      details.file.file_name = this.report_type.toUpperCase() + "_" + this.year_selected + ".pdf";

      axios.get(process.env.VUE_APP_BASE_URL + '/user_packages/get_sales_yearly/' + this.year_selected + '/' + details.prepared_by)
      .then((res)=>{

          if(res.status == 200){
            
            window.open(process.env.VUE_APP_BASE_URL + "/user_packages/get_report/" + details.file.file_name);
            

          }
          
      });

      }
      else if(this.report_type == 'tm'){

        details.file.file_name = this.report_type.toUpperCase() + "_" + this.receptionist_id + "_" + this.date_from + "_" + this.date_to + ".pdf";

      axios.get(process.env.VUE_APP_BASE_URL + '/employee_sessions/get_time_monitoring/' + this.date_from + '/' + this.date_to + '/' + this.receptionist_id + '/' + details.prepared_by)
      .then((res)=>{

          if(res.status == 200){

            window.open(process.env.VUE_APP_BASE_URL + "/employee_sessions/get_report/" + details.file.file_name);
             

          }
          
      });


      }
      
    },
    getReceptionist(){
      axios.get(process.env.VUE_APP_BASE_URL + '/user/get_all/' + 1 + '/' + 1000+ '/' + 'receptionist')
      .then((res)=>{
      
        if(res.status == 200){
      
          this.allreceptionist = res.data[0];
      
        }
        
      })
    },

    getDateTimeFormat(value){
      return moment(value).format('MMMM DD, YYYY h:mm a');
    },  
    refreshData(){

      this.years.splice(0);


        var start_year = 2016;

        var startDate = new Date();

        for(var i = startDate.getFullYear(); i >= start_year; i--){
          this.years.push({
            year : i
          });
        }


      this.getReceptionist();
      // this.getAppointment(moment(new Date()).format('YYYY-MM-DD'));
      // this.getCredits();
      // this.getAppointmentCounts();
    }
  },
  mounted: function(){
    this.refreshData();
    this.getUserInfo();
  }
}


</script>