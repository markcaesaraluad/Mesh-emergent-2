<template>
    <div>

      <div class="sm:flex items-center sm:space-x-4 space-y-4 sm:space-y-0">

        <input v-model="search_name" type="text" class="flex-auto border rounded-md px-8 text-sm" placeholder="Search" @keyup.enter="getAll('search',search_name)">

          <button @click="showAddModal(0, 'add')" class="bg-green-500 border rounded-md px-6 py-2 text-sm sm:flex-none sm:w-auto text-white font-medium hover:bg-green-600">
            + Add
        </button>


      </div>
  
      
  
  
  <div class="bg-white p-2 rounded-md mt-4 fadeInSlide">

    <div class="flex items-center justify-between bg-white px-4 py-3 sm:px-6">
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

    <div v-if="alldata.length > 0">
      <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
        <span @click="changePageByClick('minus')" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
          <span class="sr-only">Previous</span>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
          </svg>
        </span>
        <span v-for="i in page_list" v-bind:key="i.id" aria-current="page" class="relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:cursor-pointer" :class="page == i.id ? 'bg-biege-700 focus-visible:outline-gray-600 text-white' : 'bg-white text-gray-700 ring-gray-300 ring-1 ring-inset'" @click="changePage(i.id)">{{ i.id }}</span>

        <!-- <span v-if="alldata.length > 7" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">...</span> -->

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
                              <th scope="col" class="py-4 px-4 text-gray-500 font-bold text-center text-sm w-1/4">Date & Time Added</th>
                              <th scope="col" class="py-4 px-4 text-gray-500 font-bold text-center text-sm w-16">Actions</th>
                          </tr>
                          </thead>
                          <tbody class="divide-y divide-gray-200 bg-white">
                          <tr v-for="i in alldata" v-bind:key="i.id" class="hover:bg-gray-200">
  
                            <td class="py-4 px-4 text-sm text-gray-500 sm:pl-6 w-auto">{{formatUserName(i)}}</td>
                            <td class="py-4 px-4 text-sm text-gray-500 sm:pl-6 w-1/4 text-center">{{getDateTimeFormat(i.datetime_added)}}</td>
                            <td class="py-4 px-4 text-center w-16">
                                <img src="../assets/action_icon_edit.png" @click="showAddModal(i.id, 'edit')" class="h-4 w-auto cursor-pointer mx-auto">
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

    <div v-if="alldata.length > 0">
      <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
        <span @click="changePageByClick('minus')" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
          <span class="sr-only">Previous</span>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
          </svg>
        </span>
        <span v-for="i in page_list" v-bind:key="i.id" aria-current="page" class="relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:cursor-pointer" :class="page == i.id ? 'bg-biege-700 focus-visible:outline-gray-600 text-white' : 'bg-white text-gray-700 ring-gray-300 ring-1 ring-inset'" @click="changePage(i.id)">{{ i.id }}</span>

        <!-- <span v-if="alldata.length > 7" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">...</span> -->

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
  
  <PromptModal v-if="show_PromptModal" @close-modal="show_PromptModal = false" :refreshData="refreshData" :prompt_data="prompt_data" :showNotification="showNotification"/>
  <AddEmployeeModal v-if="show_AddModal" @close-modal="show_AddModal = false" :refreshData="refreshData" :item_data="item_data" :showNotification="showNotification"/>
  
    </div>
  </template>
  
  <script>
  
  import axios from 'axios';
  import moment from 'moment';
  import PromptModal from '../components/Modals/PromptModal.vue';
  import AddEmployeeModal from '../components/Modals/AddEmployeeModal.vue';

  export default{
  data(){
    return {
      search_name : '',
      alldata : '',
      activeClass : 'bg-biege-700 text-white',
      inactiveClass : 'bg-none text-gray-600',
      selected_id : 0,
      page: 1,
    total_cnt: 0,
    total_pages : 0,
    page_list : [],
    page_limit : 100,
    show_UserModal : true,

      //data
      item_data : {
        id: '',
        action: '',
        ut_id : '', 
      },
      prompt_data : {
        data : '',
        type : '',
      },

      //toggles
      show_PromptModal : false,
      show_AddModal : false,
    }
  },
  props: {
    showNotification : Function
  },
  components : {
    PromptModal,
    AddEmployeeModal,
  },
  methods: {
    getParamType(){
      axios.get(process.env.VUE_APP_BASE_URL + '/user_types/find_by_name/receptionist')
      .then((res)=>{

        if(res.status == 200){
            this.item_data.ut_id = res.data.id;
            this.refreshData();
        }
        
      })
    },
    refreshData(){
    this.getAll(null,null);
    
  },
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
  getCountTotal(cnt){
  
    this.total_cnt = cnt;

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
    checkDataIfEmpty(val){
      if(val == null || val == '') return "Not defined";
      else return val;
    },
    changeBgColor(status){
                  if(status == 0) return 'bg-red-500 hover:bg-red-600'; //pending
                  else if(status == 1) return 'bg-green-500 hover:bg-green-600'; //accepted
          },
    getDateTimeFormat(value){
      return moment(value).format('MMMM DD, YYYY hh:mm a');
    },
    showSubModal(data,action){
      this.show_PromptModal = true;

      this.prompt_data = {
        data : data,
        action : action,
      };

    },
    showAddModal(id, action){
        this.item_data.id = id;
        this.item_data.action = action;
        this.show_AddModal = true;
    },
    showAddHeadModal(i){
        this.item_data.id = i.id;
        this.item_data.office_name = i.description;
        this.show_AddHeadModal = true;
    },
    showHierarchyModal(){
      this.show_HeirarchyModal = true;
    },
  getAll(type,name){


    if(name){

      axios.get(process.env.VUE_APP_BASE_URL + '/user/get_all_filter/' + this.page + '/' + this.page_limit + '/' + 'receptionist' + '/' + type + '/' + name)
      .then((res)=>{
      
        if(res.status == 200){
      
          this.alldata = res.data[0];
          this.getCountTotal(res.data[1]);
      
        }
        
      })

    }
    else{

      axios.get(process.env.VUE_APP_BASE_URL + '/user/get_all/' + this.page + '/' + this.page_limit + '/' + 'receptionist')
      .then((res)=>{
      
        if(res.status == 200){
      
          this.alldata = res.data[0];
          this.getCountTotal(res.data[1]);
      
        }
        
      })

    }
  
  
  },
  checkOfficeType(type){
    if(type == 1) return "Admin";
    else return "Academic Unit";
  },
  checkType(type){
    if(type == 1) return "Internal";
    else return "External";
  }
  },
  mounted: function(){
    this.getParamType();
  },
  watch: {
    
    search_name : {
      // immediate:true,
        handler(val){
  
          if(val == '') this.refreshData();
        },
    }
    
    }
  }
  
  </script>