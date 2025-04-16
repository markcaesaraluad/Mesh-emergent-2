<template>
  <div>

    <p class="font-bold text-lg text-gray-700 mb-4">Accounts</p>

    <div class="sm:flex items-center sm:space-x-4 space-y-4 sm:space-y-0">

      
      <input type="text" class="flex-auto border rounded-2xl px-8 text-sm" placeholder="Search user here...">

<button class="bg-green-500 border rounded-3xl px-6 py-2 text-sm sm:flex-none sm:w-auto text-white font-medium hover:bg-green-600">
    Search
</button>



</div>


<div class="bg-white p-2 rounded-2xl mt-4">

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

    <div v-if="allusers.length > 0">
      <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
        <span @click="changePageByClick('minus')" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
          <span class="sr-only">Previous</span>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
          </svg>
        </span>
        <span v-for="i in page_list" v-bind:key="i.id" aria-current="page" class="relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:cursor-pointer" :class="page == i.id ? 'bg-green-500 focus-visible:outline-green-600 text-white' : 'bg-white text-gray-700 ring-gray-300 ring-1 ring-inset'" @click="changePage(i.id)">{{ i.id }}</span>

        <!-- <span v-if="allusers.length > 7" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">...</span> -->

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

  <table class="min-w-full divide-y divide-gray-300">
                        <thead class="bg-white">
                        <tr class="text-white">
                            <th scope="col" class="py-4 px-4 text-gray-500 font-bold text-left text-sm sm:pl-4 w-auto">Name</th>
                            <th scope="col" class="py-4 px-4 text-gray-500 font-bold text-center text-sm sm:pl-6 w-20">Status</th>
                        </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 bg-white">
                        <tr v-for="i in allusers" v-bind:key="i.id" class="hover:bg-gray-200 hover:cursor-pointer" @click="checkUser(i)">

                          <td class="py-4 px-4 text-sm text-gray-500 sm:pl-6">{{i.lname + ', ' + i.fname}}</td>
                          <td class="py-4 px-4 text-sm text-gray-500 sm:pl-6 text-center">
                            <span :class="changeBgColor(i.isApproved)" class="px-8 py-1 text-white rounded-2xl">
                              <span v-if="i.isActive == 0">Inactive</span>
                              <span v-if="i.isActive == 1">Active</span>
                            </span>
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

    <div v-if="allusers.length > 0">
      <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
        <span @click="changePageByClick('minus')" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
          <span class="sr-only">Previous</span>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
          </svg>
        </span>
        <span v-for="i in page_list" v-bind:key="i.id" aria-current="page" class="relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:cursor-pointer" :class="page == i.id ? 'bg-green-500 focus-visible:outline-green-600 text-white' : 'bg-white text-gray-700 ring-gray-300 ring-1 ring-inset'" @click="changePage(i.id)">{{ i.id }}</span>

        <!-- <span v-if="allusers.length > 7" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">...</span> -->

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

<ViewUserModal v-if="show_UserModal" @close-modal="show_UserModal = false" :refreshData="refreshData" :item_data="item_data" :showNotification="showNotification"/>

  </div>
</template>

<script>

import axios from 'axios';
import moment from 'moment';
import ViewUserModal from '../components/Modals/ViewUserModal.vue';

export default{
data(){
  return {
    allusers : '',
    activeClass : 'bg-green-600 text-white',
    inactiveClass : 'bg-none text-gray-600',
    selected_id : 0,
    page: 1,
    total_cnt: 0,
    total_pages : 0,
    page_list : [],
    page_limit : 25,
    item_data : {
      id : ''
    },
    show_UserModal : false,
  }
},
components: {
  ViewUserModal
},
methods: {
  refreshData(){
    this.getAllUsers();
    this.getCountTotal();
  },
  generatePages(){
    if(this.page_list.length > 0) this.page_list.splice(0);

    this.total_pages = Math.ceil(this.total_cnt/this.page_limit);
    for(var i = 1; i <= this.total_pages; i++){
      this.page_list.push({
        id : i
      });
    }
  },
  getCountTotal(){
  
  axios.get(process.env.VUE_APP_BASE_URL + '/user/get_count')
  .then((res)=>{
  
    if(res.status == 200){
  
      this.total_cnt = res.data.total_cnt;
      this.generatePages();
    }
    
  })
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
  changeBgColor(status){
                if(status == 0) return 'bg-red-500 hover:bg-red-600'; //pending
                else if(status == 1) return 'bg-green-500 hover:bg-green-600'; //accepted
        },
  getDateTimeFormat(value){
    return moment(value).format('MMMM DD, YYYY HH:MM:SS a');
  },
  checkUser(val){
    this.item_data.id = val.id
    this.show_UserModal = true;
  },
getAllUsers(){

axios.get(process.env.VUE_APP_BASE_URL + '/user/get_users_by_page/' + this.page + '/' + this.page_limit)
.then((res)=>{

  if(res.status == 200){

    this.allusers = res.data;

  }
  
})
},
},
mounted: function(){
  this.refreshData();
}
}

</script>