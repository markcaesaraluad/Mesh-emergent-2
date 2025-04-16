<template>
    <div>

      <div class="sm:flex items-center sm:space-x-4 space-y-4 sm:space-y-0">

        <div class="flex-auto">

        </div>

          <button @click="showAddModal(0, 'add')" class="bg-green-700 border rounded-md px-6 py-2 text-sm sm:flex-none sm:w-auto text-white font-medium hover:bg-green-600">
            + Add
        </button>


      </div>
  
      
  
  


    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-2xl fadeInSlide mt-2">

      <div v-for="i in alldata" v-bind:key="i.id" class="bg-biege-700 rounded-lg flex flex-col hover:cursor-pointer duration-200 hover:opacity-50" @click="showAddModal(i.id, 'edit')">
          <img class="flex-none h-48 max-w-full object-cover rounded-t-lg" :src="getImgUrl(i.profile_pic)" alt="">
          <div class="flex-none flex items-center w-full">
            <p class="flex-auto m-2 tracking-wider text-white">{{ i.description }}</p>
            <span class="flex-none m-2 rounded-2xl text-white text-xs px-4 py-1 tracking-wider" :class="i.status == 1 ? 'bg-gray-700' : 'bg-gray-700'">{{ checkStatus(i.status) }}</span>
          </div>
      </div>

    </div>



  
  <PromptModal v-if="show_PromptModal" @close-modal="show_PromptModal = false" :refreshData="refreshData" :prompt_data="prompt_data" :showNotification="showNotification"/>
  <AddAreaModal v-if="show_AddModal" @close-modal="show_AddModal = false" :refreshData="refreshData" :item_data="item_data" :showNotification="showNotification"/>
  
    </div>
  </template>
  
  <script>
  
  import axios from 'axios';
  import moment from 'moment';
  import PromptModal from '../components/Modals/PromptModal.vue';
  import AddAreaModal from '../components/Modals/AddAreaModal.vue';

  export default{
  data(){
    return {
      search_name : '',
      alldata : '',
      activeClass : 'bg-biege-600 text-white',
      inactiveClass : 'bg-none text-gray-600',
      selected_id : 0,
      page: 1,
    total_cnt: 0,
    total_pages : 0,
    page_list : [],
    page_limit : 25,
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
    AddAreaModal,
  },
  methods: {
    checkStatus(val){
      if(val == 1) return 'AVAILABLE';
      else return 'NOT AVAILABLE';
    },
    getImgUrl(imagePath) {
        return process.env.VUE_APP_BASE_URL + "/areas/get_img/" + imagePath;
       
      },
    getParamType(){
      axios.get(process.env.VUE_APP_BASE_URL + '/user_types/find_by_name/customer')
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

      axios.get(process.env.VUE_APP_BASE_URL + '/areas/get_all/' + this.page + '/' + this.page_limit + '/' + 1 + '/' + type + '/' + name)
      .then((res)=>{
      
        if(res.status == 200){
      
          this.alldata = res.data[0];
          this.getCountTotal(res.data[1]);
      
        }
        
      })

    }
    else{

      axios.get(process.env.VUE_APP_BASE_URL + '/areas/get_all/' + this.page + '/' + this.page_limit + '/')
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