<template>
    <div>
  
      <div class="sm:flex items-center sm:space-x-4 space-y-4 sm:space-y-0 my-4">
  
        <div class="flex-auto">
  
        </div>
  
        <!-- <button class="flex-none bg-green-500 rounded-3xl px-10 py-2 text-white text-sm">
          Upload file
        </button> -->
  
        <button class="flex-none w-auto bg-green-600 hover:bg-green-700 rounded-lg px-5 py-2 cursor-pointer text-white text-center fadeInSlide" @click="openCreate('add',0)">
            Add
        </button>
  
        
  
  
  
      </div>
  
  <div class="bg-white p-2 rounded-md mt-4 fadeInSlide">
  
  
  
  <div class="relative overflow-x-auto scrollbar sm:rounded-lg border border-1">
  
  <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3 w-auto text-left">
                    Description
                  </th>
                  <th scope="col" class="py-3 text-center w-48">
                    Date & Time added
                  </th>
                  <th scope="col" class="px-6 py-3 text-center w-24">
                    Actions
                  </th>
            </tr>
        </thead>
        <tbody>
  
          <tr v-if="allmydata.length == 0">
            <td colspan="7" class="py-5 px-5">
              <!-- <img src="../assets/icon_empty_document.png" class="mx-auto h-24"/> -->
              <p class="w-full text-center mt-4 text-gray-500 text-sm">There are no items yet.</p>
            </td>
          </tr>
  
            <tr v-for="i in allmydata" v-bind:key="i.id" class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-200">
                  <td class="px-6 py-2 w-auto text-left">
                    {{i.description}}
                  </td>
                  <td class="px-2 py-2 text-center w-48">
                    {{getDateTimeFormat(i.datetime_added)}}
                  </td>
                <td class="px-6 py-2 w-24">
                  <span class="space-x-2 mx-auto flex items-center">
                    <img src="../assets/action_icon_edit.png" class="h-4 w-auto cursor-pointer mx-auto" @click="openCreate('edit',i.id)">
                  </span>
  
                </td>
            </tr>
            
        </tbody>
    </table>
                      
  </div>
  
  
  
  </div>
  
  <AddRateModal v-if="show_AddModal" @close-modal="show_AddModal = false" :refreshData="refreshData" :item_data="item_data" :showNotification="showNotification"/>
  
    </div>
  </template>
  
  <script>
  
  
  import axios from 'axios';
  import moment from 'moment';
  import AddRateModal from '../components/Modals/AddRateModal.vue';
  
  
  
  
  export default{
  data(){
    return {
      years : [],
      filter_type : 'SM',
      allfiletypes : [],
      allrecordtypes : '',
      allmydata : '',
      activeClass : 'bg-green-600 text-white',
      inactiveClass : 'bg-none text-gray-600',
      selected_id : 0,
      search_name : '',
      param_name : '',
      page: 1,
      total_cnt: 0,
      total_pages : 0,
      page_list : [],
      page_limit : 25,
  
      //data
      item_data : {
        id: '',
        area_id: '',
        action: '',
        name : '',
      },
      prompt_data : {
        data : '',
        type : '',
      },
  
  
      area_id : 0,
      ft_name : '',
      isCampusWide : 0,
  
      //toggles
      show_AddModal : false,
    }
  },
  props: {
      showNotification : Function,
  },
  components: {
    AddRateModal,
  },
  methods: {
    refreshData(){
  
      var set_param_name = this.$route.params.name.split('_');
  
      this.param_name = set_param_name.join(' '); 
      this.ft_name = this.param_name;

      
      this.getAllAreas();
      
    },
    openCreate(action,id){
        this.item_data.id = id;
        this.item_data.area_id = this.area_id;
        this.item_data.action = action; 
        this.item_data.name = this.ft_name;
        this.show_AddModal = true;
      
    },
    getDateTimeFormat(value){
      return moment(value).format('MMMM DD, YYYY h:mm a');
    },
  getAllAreas(){
  
  
      axios.get(process.env.VUE_APP_BASE_URL + '/rates/find_by_name/' + this.param_name )
      .then((res)=>{
  
        if(res.status == 200){
  
          this.allmydata = res.data;
          this.area_id = res.data[0].area_id.id;
          
        }
        
      })
  
    
  
  
  },
  },
  mounted: function(){
    
    this.refreshData();
  },
  watch: {
    
    '$route': {
        // immediate:true,
        handler(){
          this.refreshData();
        },
    },
    search_name : {
      immediate:true,
        handler(val){
          if(val == '') this.refreshData();
        },
    }
    
    }
  }
  
  </script>