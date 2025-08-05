<template>
  <div class="flex items-center justify-center h-auto bg-biege-700">
        <div class="flex items-center m-auto">
          <img class="flex-none h-16 w-auto m-auto" src="../../assets/logo_width.png" alt="Workflow">
          <!-- <span class="flex-auto flex flex-col text-white text-sm">
            <p class="text-center tracking-wide w-full text-lg px-2" v-if="openSidebar">Meshconnect</p>
          </span> -->
        </div>
  </div>

  <div class="flex flex-col flex-1 overflow-y-auto scrollbar overflow-x-hidden">
      <nav class="flex-auto px-2 py-4 bg-transparent">

          <div v-for="(i, index) in alldata" v-bind:key="i.id" class="w-full p-0.5" :class="i.show_children == 1 ? 'border-green-600' : 'bg-none'">
          
          <span class="w-auto flex items-center hover:bg-biege-700 hover:text-white hover:transition-all duration-500 cursor-pointer" :class="[$route.path === i.um_id.link ? parent_activeClass : parent_inactiveClass]" @click="changePage(i,index)">
            <img :src="getImgUrl(i.um_id.profile_pic)" class="m-1 px-2 py-1 w-10 flex-none fadeInSlide" :class="openSidebar ? 'mx-1' : 'mx-auto'">
            <div :class="openSidebar ? 'slideOut w-full z-0' : 'slideIn w-0 z-[-1]'">
              <div class="flex items-center">
                <span class="flex-auto pl-4 pr-8 tracking-wider fadeInSlide">{{ i.um_id.name }}</span>
              <img v-if="i.children != null && i.show_children == 0" src="../../assets/menu_dropdown.png" class="flex-none w-8 h-auto mx-2 fadeInSlide"/>
              <img v-if="i.children != null && i.show_children == 1" src="../../assets/menu_up.png" class="flex-none w-8 h-auto mx-2 fadeInSlide"/>
              </div>
            </div>
          </span>

          <!-- <div class="bg-white" :class="i.show_children == 1 ? 'opacity-100 visible h-auto flex flex-col transition-all duration-500 ease' : 'opacity-0 invisible fixed z-[-1]'"> -->

          <div class="bg-white rounded-b-md max-h-full w-full" :class="i.show_children == 1 ? 'slideDown z-0 h-full' : 'h-0 z-[-1] slideUp'">
            <div v-for="(i2, index2) in i.children" v-bind:key="i2.id">
              <div v-if="i.show_children == 1">
                <span :class="[$route.path === i2.um_id.link ? activeClass : inactiveClass]" @click="changePage(i2,index2)" class="flex items-center cursor-pointer">
                  <img :src="getImgUrl(i2.um_id.profile_pic)" class="m-1 px-2 py-1 w-10 fadeInSlide"  :class="openSidebar ? 'mx-1' : 'mx-auto'">
                  <span class="pl-4 text-gray-800 text-md flex-auto fadeInSlide" v-if="openSidebar">{{ i2.um_id.name }}</span>
                </span>
              </div>
            
          </div>
         
          </div>


          

          

        </div>
      </nav>
  </div>
</template>

<script>

import axios from 'axios';
import * as arrayToTree from 'array-to-tree';

export default{
  props: {
    openSidebar : Boolean
  },
  data(){
    return{
      alldata : [],
      activeClass : 'bg-gray-200 text-white font-bold hover:font-bold w-auto',
      inactiveClass : 'bg-none text-gray-800 hover:font-bold w-auto',
      parent_activeClass : 'bg-biege-700 text-white w-auto rounded-md',
      parent_inactiveClass : 'bg-none text-gray-700 w-auto rounded-md',
      padding : ['pl-0','pl-4','pl-8'],
    }
  },
  _methods: {
    changePage(data,index) {

      

      if (data.children != null) {

        for(var i = 0; i < this.alldata.length; i++){
          if(this.alldata[i].id == this.alldata[index].id) continue;
          this.alldata[i].show_children = 0;
        }

        if(data.show_children == 0) this.alldata[index].show_children = 1;
        else this.alldata[index].show_children = 0;

      }
      else {

       

        if(data.parent_id != 0) this.$router.push({ path : data.um_id.link, params : {name : data.um_id.link}});
        else this.$router.push(data.um_id.link);
      }

      

    },
    getImgUrl(imagePath) {
      // return require('@/assets/' + imagePath);
      return process.env.VUE_APP_BASE_URL + "/user_menu/get_file/" + imagePath + "/png";
      // return require('../../assets/' + imagePath);
    },
    getAll() {

      // Check if user exists in store
      if (!this.$store.state.user) {
        console.error('No user in store state, redirecting to login');
        this.$router.push('/');
        return;
      }

      // Check if user has ut_id
      if (!this.$store.state.user.ut_id || !this.$store.state.user.ut_id.id) {
        console.error('User ut_id not found:', this.$store.state.user);
        return;
      }

      console.log('Getting menu for user type:', this.$store.state.user.ut_id.id);

      axios.get(process.env.VUE_APP_BASE_URL + '/user_types_menu/get_menu/' + this.$store.state.user.ut_id.id)
        .then((res) => {

          if (res.status == 200) {

            res.data.forEach((para) => {

              this.alldata.push({
                  id : para.id,
                  ut_id : para.ut_id,
                  um_id : para.um_id,
                  datetime_added : para.datetime_added,
                  order_num : para.order_num,
                  parent_id : para.parent_id,
                  position : para.position,
                  show_children : 0,
                });
            

            });

            
            this.alldata = arrayToTree(this.alldata);


            const itemFilter = items => items
              .map(item => item.children
                ? { ...item, children: itemFilter(item.children) }
                : item
              )
              .filter(item => item.position);

            const itemSorter = items => items
              .map(item => item.children
                ? { ...item, children: itemSorter(item.children) }
                : item
              )
              .sort((i1, i2) => i1.order_num - i2.order_num);

            this.alldata = itemSorter(itemFilter(this.alldata));

          }

        })
        .catch((error) => {
          console.error('Error loading menu:', error);
        });
    },
    goToProfile() {
      this.$router.push('/profile');
    },
  },
  get methods() {
    return this._methods;
  },
  set methods(value) {
    this._methods = value;
  },
  mounted(){
    this.getAll();
    // this.findUserInTransaction();
  }
}
</script>

<style scoped>

</style>
