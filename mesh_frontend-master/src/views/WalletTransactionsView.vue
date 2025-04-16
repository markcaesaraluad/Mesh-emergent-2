<template>
    <div>

      <div class="flex flex-col space-y-4 flex-1 bg-white p-8 rounded-md">



        <div>

            <div class="flex items-center justify-between bg-white px-4 py-3 sm:px-6" >
  <div class="flex flex-1 justify-between sm:hidden">
    <span @click="changePageByClick('minus')" class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</span>
    <span @click="changePageByClick('add')" class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</span>
  </div>
  <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
    <div>
      <p class="text-sm text-gray-700">
        Showing
        <span class="font-medium">1</span>
        to
        <span>
          <select v-model="page_limit" @change="refreshData" class="text-xs pl-2 pr-8 py-1 mx-2 rounded-lg">
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="250">250</option>
            <option value="500">500</option>
          </select>
        </span>
        of
        <span class="font-bold">{{total_cnt}}</span>
        results
      </p>
    </div>

    <div v-if="alltransactions.length > 0">
      <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
        <span @click="changePageByClick('minus')" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
          <span class="sr-only">Previous</span>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
          </svg>
        </span>
        <span v-for="i in page_list" v-bind:key="i.id" aria-current="page" class="relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:cursor-pointer" :class="page == i.id ? 'bg-biege-700 focus-visible:outline-green-600 text-white' : 'bg-white text-gray-700 ring-gray-300 ring-1 ring-inset'" @click="changePage(i.id)">{{ i.id }}</span>

        <!-- <span v-if="alltransactions.length > 7" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">...</span> -->

        <span @click="changePageByClick('add')" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
          <span class="sr-only">Next</span>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
          </svg>
        </span>
      </nav>
    </div>

  </div>
</div>

          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3 w-auto text-left">
                  Name
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
    
            <tr v-if="alltransactions.length == 0">
              <td colspan="7" class="py-5 px-5">
                <!-- <img src="../assets/icon_empty_document.png" class="mx-auto h-24"/> -->
                <p class="w-full text-center mt-4 text-gray-500 text-md">There are no transactions yet.</p>
              </td>
            </tr>
    
              <tr v-for="i in alltransactions" v-bind:key="i.id" class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-200 text-sm cursor-pointer" @click="showViewModal(i)">
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

      <div class="flex items-center justify-between bg-white px-4 py-3 sm:px-6" >
  <div class="flex flex-1 justify-between sm:hidden">
    <span @click="changePageByClick('minus')" class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</span>
    <span @click="changePageByClick('add')" class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</span>
  </div>
  <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
    <div>
      <p class="text-sm text-gray-700">
        Showing
        <span class="font-medium">1</span>
        to
        <span>
          <select v-model="page_limit" @change="refreshData" class="text-xs pl-2 pr-8 py-1 mx-2 rounded-lg">
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="250">250</option>
            <option value="500">500</option>
          </select>
        </span>
        of
        <span class="font-bold">{{total_cnt}}</span>
        results
      </p>
    </div>

    <div v-if="alltransactions.length > 0">
      <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
        <span @click="changePageByClick('minus')" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
          <span class="sr-only">Previous</span>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
          </svg>
        </span>
        <span v-for="i in page_list" v-bind:key="i.id" aria-current="page" class="relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:cursor-pointer" :class="page == i.id ? 'bg-biege-700 focus-visible:outline-green-600 text-white' : 'bg-white text-gray-700 ring-gray-300 ring-1 ring-inset'" @click="changePage(i.id)">{{ i.id }}</span>

        <!-- <span v-if="alltransactions.length > 7" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">...</span> -->

        <span @click="changePageByClick('add')" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
          <span class="sr-only">Next</span>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
          </svg>
        </span>
      </nav>
    </div>

  </div>
</div>

        </div>


      </div>

      <ViewWalletRequestModal v-if="showModal_View" @close-modal="showModal_View = false" :refreshData="refreshData" :item_data="item_data" :showNotification="showNotification"/>

    </div>

  </template>

<script>

import moment from 'moment';
import axios from 'axios';
import ViewWalletRequestModal from '@/components/Modals/ViewWalletRequestModal.vue';

export default{
  data(){
    return{
      available_credits : 0,

      alltransactions : '',

      item_data : {
        id : ''
      },

      data: {
        user_id : this.$store.state.user.id,
        payment : 0,
        input_credit : 0,
        datetime_added : '',
        file_attachment : '',
        file : null,
      },

        page: 1,
        total_cnt: 0,
        total_pages : 0,
        page_list : [],
        page_limit : 25,

        showModal_View : false
    }
  },
  components: {
    ViewWalletRequestModal
  },
  props: {
    showNotification : Function
  },
  methods: {
    showViewModal(data){
        this.item_data.id = data.id;
        this.showModal_View = true;
    },
    generatePages(val){

        this.total_cnt = val;
    if(this.page_list.length > 0) this.page_list.splice(0);

    this.total_pages = Math.ceil(this.total_cnt/this.page_limit);
    for(var i = 1; i <= this.total_pages; i++){
      this.page_list.push({
        id : i
      });
    }
  },
  changePageByClick(type){
    if(type == "add"){
      if(this.page != this.total_pages){
        this.page++;
        this.refreshData();
      }
      
    }
    else if(type == "minus"){
      if(this.page != 1){
        this.page--;
        this.refreshData();
      }
    }
  },
  changePage(val){
    this.page = val;
    this.refreshData();
  },
    changeFormatUser(data){
        return data.user_id + ', ' + data.fname;
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

      axios.get(process.env.VUE_APP_BASE_URL + '/user_wallet_transaction/get_all/' + this.page + '/' + this.page_limit)
      .then((res)=>{
      
          if(res.status == 200){

            this.alltransactions = res.data[0];
            this.generatePages(res.data[1]);
          
          }
          
      });
    
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
    getDateTimeFormat(value){
      return moment(value).format('MMMM DD, YYYY h:mm a');
    },  
    refreshData(){
      this.getTransactions();
    }
  },
  mounted: function(){
    this.refreshData();
  }
}


</script>