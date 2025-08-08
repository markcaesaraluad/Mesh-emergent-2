<template>
  <div
    class="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow w-auto p-4"
  >
    <button
      @click="this.$parent.openCloseSidebar"
      type="button"
      class="px-4 text-gray-700 flex-none"
    >
      <span class="sr-only">Open sidebar</span>
      <!-- Heroicon name: outline/menu-alt-2 -->
      <img src="../../assets/icon_menu.png" class="h-8 w-auto p-0.5" />
    </button>
    <div class="flex-auto px-4 flex items-center justify-center">
      <div class="flex-auto">
        <div class="w-full flex lg:flex md:ml-0">
          <div class="w-full text-gray-400">
            <!-- 
                <input v-model="search_nav" @keyup="searchName" @click="getListByClick" @focusout="search_nav_list.splice(0)" id="search-field" class="relative w-1/3 py-1 border-gray-200 border-none rounded-lg text-sm" placeholder="Search module here.." type="search" name="search">

                <div v-if="search_nav_list.length != 0" class="fadeInSlide absolute bg-white w-auto h-auto max-h-64 overflow-y-auto scrollbar gap-2 px-2 py-1 rounded-lg my-2">
                  <div v-for="i in search_nav_list" v-bind:key="i.id" class="flex items-center cursor-pointer text-sm hover:bg-gray-200 hover:font-bold duration-300 rounded-md p-2" @click="changePage(i.link)" @pointerdown.prevent>
                    <img :src="getImgUrl(i.profile_pic)" class="m-1 px-2 py-1 text-xl text-center w-10 bg-gray-200 rounded-xl" >
                    <div class="flex flex-col pl-2">
                      <span class="text-gray-800">{{ i.title }}</span>
                      <span class="text-gray-600 italic">{{ i.description }}</span>
                    </div>
                  </div>
                  

              </div> -->
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-none items-center px-4">
      
      <!-- Profile dropdown -->
      <div class="mx-3 relative">
        <div>
          <button
            @click="showNotifDropDown()"
            type="button"
            class="max-w-xs flex items-center text-sm rounded-full"
            id="user-menu-button"
            aria-expanded="false"
            aria-haspopup="true"
          >
            <!-- <span class="sr-only">Open user menu</span>
            <img src="../../assets/icon_bell.png" class="h-8 w-auto p-0.5" />
           
            <span class="relative flex h-3 w-3" v-if="cnt_unread > 0">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
              ></span>
              <span
                class="relative inline-flex rounded-full h-3 w-3 bg-red-500"
                >{{ cnt_unread }}</span
              >
            </span> -->
            <div class="relative p-2 rounded-lg">
              <svg
                class="w-8 h-8 text-teal-600 animate-wiggle"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 21 21"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.585 15.5H5.415A1.65 1.65 0 0 1 4 13a10.526 10.526 0 0 0 1.5-5.415V6.5a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v1.085c0 1.907.518 3.78 1.5 5.415a1.65 1.65 0 0 1-1.415 2.5zm1.915-11c-.267-.934-.6-1.6-1-2s-1.066-.733-2-1m-10.912 3c.209-.934.512-1.6.912-2s1.096-.733 2.088-1M13 17c-.667 1-1.5 1.5-2.5 1.5S8.667 18 8 17"
                />
              </svg>

              <div
                v-if="getUnreadNotifCnt > 0"
                class="px-1 py-0.5 bg-red-500 min-w-5 rounded-full text-center text-white text-xs absolute top-1 end-2.5 translate-x-1/4 text-nowrap"
              >
                <div
                  class="absolute top-0 start-0 rounded-full -z-10 animate-ping bg-teal-200 w-full h-full"
                ></div>
                {{ getUnreadNotifCnt > 99 ? "99+" : getUnreadNotifCnt }}
              </div>
            </div>
          </button>
        </div>

        <div
          v-show="notifDropdown"
          class="fadeInSlide absolute right-0 md:absolute md:origin-top-right md:right-0 mt-5 md:mt-2 w-screen md:w-96 h-screen md:h-auto rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
          tabindex="-1"
        >
          <!-- Active: "bg-gray-100", Not Active: "" -->
          <div v-if="allnotifications.length == 0" class="px-4 py-2">
            <p class="text-sm">No notifications.</p>
          </div>
          <div
            v-if="allnotifications.length > 0"
            class="flow-root px-4 py-2 h-64 overflow-y-auto scrollbar"
          >
            <ul role="list" class="-my-5 divide-y divide-gray-200">
              <li v-for="i in allnotifications" :key="i.id" class="py-5">
                <div
                  @click="readNotif(i)"
                  class="relative"
                  :class="i.hasRead == 0 ? 'font-bold' : ''"
                >
                  <h3 class="text-sm font-semibold text-gray-800">
                    <a href="#" class="hover:underline focus:outline-none">
                      <!-- Extend touch target to entire panel -->
                       <div class="flex items-center gap-2">
                         <span class="flex items-center uppercase text-sm" :class="{ 'font-semibold': i.hasRead == 0, 'font-normal': i.hasRead == 1 }">
                           {{ i.sender_Name }}
                           <span class="rounded-2xl bg-red-500 p-1 h-2 w-2 ml-2" v-if="i.hasRead == 0"></span>
                         </span>
                         {{ i.title }}
                         <p class="font-thin text-gray-400 text-xs">
                           {{ getFromNow(i.datetime_added) }}
                         </p>
                       </div>
                    </a>
                  </h3>
                  <p class="mt-1 text-sm text-gray-600 line-clamp-2">
                    {{ i.description }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div class="my-2 mx-4 space-y-2">
            <button
              class="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              @click="showAllNotif = true"
            >
              View all
            </button>
            <button
              v-if="getUnreadNotifCnt > 0"
              class="flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
              @click="markAllAsRead"
            >
              Mark All as Read ({{ getUnreadNotifCnt }})
            </button>
            <!-- <router-link
              to="/notifications"
              class="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >View all</router-link
            > -->
          </div>
        </div>
      </div>

      <!-- Profile dropdown -->
      <div class="ml-3 relative">
        <div>
          <button
            @click="showProfileDropDown()"
            type="button"
            class="duration-300 max-w-xs bg-none flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
            id="user-menu-button"
            aria-expanded="false"
            aria-haspopup="true"
          >
            <span class="sr-only">Open user menu</span>
            <img
              class="h-10 w-10 rounded-full object-cover bg-white"
              :src="profilePic"
            />
            <div class="hidden sm:flex sm:flex-col text-left mx-2">
              <span class="font-bold text-gray-800 tracking-widest">{{
                fullName
              }}</span>
            </div>
          </button>
        </div>

        <div
          v-show="profileDropdown"
          class="fadeInSlide origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
          tabindex="-1"
        >
          <!-- Active: "bg-gray-100", Not Active: "" -->
          <router-link
            @click="profileDropdown = false"
            to="/profile"
            class="block px-4 py-2 text-sm text-gray-700"
            role="menuitem"
            tabindex="-1"
            id="user-menu-item-0"
            >Your Profile</router-link
          >

          <router-link
            @click="profileDropdown = false"
            to="/security"
            class="block px-4 py-2 text-sm text-gray-700"
            role="menuitem"
            tabindex="0"
            id="user-menu-item-1"
            >Settings</router-link
          >

          <b
            @click="logoutAccount()"
            class="block px-4 py-2 text-sm text-red-700 hover:cursor-pointer"
            role="menuitem"
            tabindex="1"
            id="user-menu-item-2"
            >Log out</b
          >
        </div>
      </div>
    </div>

    <!-- modal enabling audio notification -->
    <div
      class="relative z-10"
      v-if="showModal"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      ></div>

      <div class="fixed z-10 inset-0">
        <div
          class="bg-white h-1/4 w-full sm:w-1/3 sm:h-1/4 m-auto px-8 sm:rounded-lg sm:absolute sm:left-0 sm:right-0 sm:top-0 sm:bottom-0 flex flex-col fadeInSlide overflow-y-auto scrollbar"
        >
          <div class="p-4 space-y-4 flex flex-col m-auto">
            <div class="flex flex-col items-center justify-center gap-5">
              <div class="text-center">
                <h3 class="text-xl">Enable Notification Audio</h3>
                <span class="text-sm text-gray-400">This is for sounded notification realtime.</span>
              </div>
              <div class="flex-none text-end">
              <button
                type="button"
                @click="acceptAudio()"
                class="inline-flex items-center justify-center rounded-md border border-transparent bg-green-500 px-6 py-2 font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Enable
              </button>
              <!-- <button type="button" @click="closeModal" class="inline-flex items-center justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 font-medium text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 sm:text-xs ml-2">Cancel</button> -->
            </div>
            </div>
            <!-- <h3 class="flex-none text-md font-bold leading-6 text-gray-900">
              Enable Notification Audio
            </h3>

            <div class="flex-none text-end">
              <button
                type="button"
                @click="acceptAudio()"
                class="inline-flex items-center justify-center rounded-md border border-transparent bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:text-xs"
              >
                Enable
              </button>
              <button type="button" @click="closeModal" class="inline-flex items-center justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 font-medium text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 sm:text-xs ml-2">Cancel</button>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <!-- end modal -->

    <!-- modal view individual notification -->
     

    <div
      class="relative z-10"
      v-if="showIndividualNotif"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      ></div>

      <div class="fixed z-10 inset-0">
        

        
        <div
        class="h-1/4 w-full sm:w-1/3 sm:h-1/4 m-auto px-8 sm:rounded-lg sm:absolute sm:left-0 sm:right-0 sm:top-0 sm:bottom-0 flex flex-col fadeInSlide"
        >
        <div class="max-w-md w-full m-auto my-auto p-6 bg-white border border-gray-200 rounded-lg shadow">
            <h5 class="text-xl font-semibold text-gray-900 uppercase tracking-wider">{{ notifToRead.sender_Name ?? 'Admin' }}</h5>
            <span class="text-sm text-gray-400">{{ getFromNow(notifToRead.datetime_added) }}</span>
            <p class="mb-3 font-normal py-5 text-gray-700 dark:text-gray-400">{{ notifToRead.description }}</p>
            <a href="#" class="inline-flex float-right px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" @click="closeIndividualNotif()">
                Close
                <!-- <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg> -->
            </a>
        </div>
        <div class="p-6 space-y-4 flex flex-col"></div>

          <!-- <div>
            <h3 class="text-sm font-semibold text-gray-800">
              <a href="#" class="hover:underline focus:outline-none">
                Extend touch target to entire panel
                <span class="font-bold flex items-center">{{
                  notifToRead.sender_Name
                }}</span>
                <p class="text-green-500">
                  {{ i.sender_id.ut_id.description }}
                </p>
                {{ notifToRead.title }}
                <p class="font-thin text-blue-500">
                  {{ getFromNow(notifToRead.datetime_added) }}
                </p>
              </a>
            </h3>
            <p class="mt-1 text-sm text-gray-600 line-clamp-2 pa-4">
              {{ notifToRead.description }}
            </p>
          </div>
          <div class="flex-none text-end">
            <button
              type="button"
              @click="closeIndividualNotif()"
              class="inline-flex items-center justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:text-xs"
            >
              Close
            </button>
          </div> -->
        </div>
      </div>
    </div>
    <!-- end modal -->

    <!-- modal viewing all notification -->
    <div
      class="relative z-10"
      v-if="showAllNotif"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      ></div>

      <div class="fixed z-10 inset-0">
        <div
          class="bg-white h-screen w-full m-auto sm:rounded-lg sm:absolute sm:left-0 sm:right-0 sm:top-0 sm:bottom-0 flex flex-col fadeInSlide overflow-y-auto scrollbar"
        >
          <div
            class="p-6 space-y-4 flex flex-col"
            style="position:fixed; top:0; right:0; border:1px solid #d3d3d3;width:100%"
          >
            <div class="flex justify-between">
              <h3 class="flex-none text-md font-bold leading-6 text-gray-900">
                Notifications
              </h3>
              <button
                @click="showAllNotif = !showAllNotif"
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <svg
                  class="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
                <span class="sr-only">Icon description</span>
              </button>
            </div>
          </div>
          <div
            v-if="allnotifications.length > 0"
            style="position: fixed; top: 100px; width: 100%"
            class="flow-root px-4 py-2 h-3/4 overflow-y-auto scrollbar"
          >
            <ul role="list" class="divide-y divide-gray-200">
              <li
                @click="readNotif(i)"
                v-for="i in allnotifications"
                :key="i.id"
                class="py-5"
              >
                <div
                  class="relative focus-within:ring-2 focus-within:ring-indigo-500"
                  :class="i.hasRead == 0 ? 'font-bold' : ''"
                >
                  <h3 class="text-sm font-semibold text-gray-800">
                    <a href="#" class="hover:underline focus:outline-none">
                      <!-- Extend touch target to entire panel -->
                      <b>From: </b
                      ><span class="font-bold flex items-center"
                        >{{ i.sender_Name
                        }}<span
                          class="rounded-2xl bg-red-500 p-1 h-2 w-2 ml-2"
                          v-if="i.hasRead == 0"
                        ></span
                      ></span>
                      <p class="text-green-500">
                        <!-- {{ i.sender_id.ut_id.description }} -->
                      </p>
                      {{ i.title }}
                      <p class="font-thin text-blue-500">
                        {{ getFromNow(i.datetime_added) }}
                      </p>
                    </a>
                  </h3>
                  <p class="mt-1 text-sm text-gray-600 line-clamp-2 pa-4">
                    {{ i.description }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- end modal -->
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
import { inject, toRefs } from "vue";

import { io } from "socket.io-client";

export default {
  data() {
    return {
      interval: null,
      time: null,
      profileDropdown: false,
      notifDropdown: false,
      sidebarOpen: true,
      dateTime: "",
      fullName: "",
      email: "",
      profilePic: "",
      allnotifications: [],
      cnt_unread: 0,
      search_nav: "",
      search_nav_list: [],
      mySocket: null,
      socketID: null,
      audioF: null,
      showModal: false,
      showAllNotif: false,
      showIndividualNotif: false,
      notifToRead: null,
    };
  },
  computed: {
    getUnreadNotifCnt() {
      let notifCnt = 0;
      for (let i = 0; i < this.allnotifications.length; i++) {
        if (this.allnotifications[i].hasRead == 0) {
          notifCnt++;
        }
      }

      return notifCnt;
    },
  },
  mounted: function () {
    // Check if user exists before accessing user properties
    if (!this.$store.state.user) {
      console.error('No user in store state, redirecting to login');
      this.$router.push('/');
      return;
    }

    this.getUserInfo();
    this.socket.emit(
      "loadMyNotifs",
      { userID: this.$store.state.user.id },
      (response) => {
        this.allnotifications = response;
      }
    );

    this.socket.on(`myNotifs_${this.$store.state.user.id}`, (res) => {
      this.allnotifications.push(res.data);
      this.notifyAudio();
    });
  },
  created() {
    // this.audioF = document.getElementById("myAudio");
    this.showModal = true;
    this.socket = io(process.env.VUE_APP_BASE_URL);
    this.mySocket = this.socket.id;
  },
  setup(props) {
    const { isSignIn } = toRefs(props);
    const Vue3GoogleOauth = inject("Vue3GoogleOauth");
    return {
      Vue3GoogleOauth,
      isSignIn,
    };
  },
  methods: {
    readNotif(item) {
      this.showAllNotif = false;
      for (let i = 0; i < this.allnotifications.length; i++) {
        if (this.allnotifications[i].id == item.id) {
          this.allnotifications[i].hasRead = 1;
        }
      }

      axios
        .patch(process.env.VUE_APP_BASE_URL + "/notifications/read/" + item.id)
        .then((res) => {
          if (res.status == 200) {
            this.notifToRead = item;
            this.showIndividualNotif = true;
          }
        });
    },

    closeIndividualNotif() {
      this.notifToRead = null;
      this.showIndividualNotif = false;
    },

    async markAllAsRead() {
      try {
        // Mark all notifications as read in the local array
        this.allnotifications.forEach(notification => {
          notification.hasRead = 1;
        });

        // Make API call to mark all as read
        if (this.$store.state.user && this.$store.state.user.id) {
          await axios.patch(
            `${process.env.VUE_APP_BASE_URL}/notifications/mark_all_read/${this.$store.state.user.id}`
          );
          
          console.log('All notifications marked as read');
        }
      } catch (error) {
        console.error('Error marking all notifications as read:', error);
        
        // If API fails, you might want to revert the local changes
        // But for now we'll keep the UI updated for better UX
      }
    },
    acceptAudio() {
      this.showModal = false;
      this.audioF = new Audio(
        require("../../assets/audio/mixkit-software.wav")
      );
      this.audioF.currentTime = 0;
      this.audioF.volume = 1;
      // this.audioF.play();
    },

    playSound() {},

    play1() {
      this.audioF.play();
    },
    notifyAudio() {
      this.audioF.volume = 1;
      this.audioF.currentTime = 0;
      this.audioF.play();
    },
    formatUserName(i) {
      var result = "";

      if (i != null) {
        result += i.fname;
        if (i.mname != null) result += " " + i.mname.substring(0, 1) + ".";
        result += " " + i.lname;
        if (i.suffix != null) result += " " + i.suffix;
      } else {
        return "-";
      }

      return result;
    },

    created() {
      // update the time every second
      this.interval = setInterval(() => {
        // Concise way to format time according to system locale.
        // In my case this returns "3:48:00 am"
        this.time = Intl.DateTimeFormat(navigator.language, {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        }).format();
      }, 1000);
    },
    showProfileDropDown() {
      if (this.notifDropdown) {
        this.notifDropdown = false;
        this.profileDropdown = true;
      } else if (this.profileDropdown) {
        this.profileDropdown = false;
      } else {
        this.profileDropdown = true;
      }
    },
    showNotifDropDown() {
      if (this.profileDropdown) {
        this.profileDropdown = false;
        this.notifDropdown = true;
      } else if (this.notifDropdown) {
        this.notifDropdown = false;
        this.profileDropdown = false;
      } else {
        this.notifDropdown = true;
      }
    },
    openSidebar() {
      if (this.sidebarOpen) {
        this.sidebarOpen = false;
      } else {
        this.sidebarOpen = true;
      }
      // alert(this.sidebarOpen);
    },
    getDateTime() {
      const today = new Date();
      const date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      const timestamp = date;

      this.dateTime = moment(String(timestamp)).format("MMMM DD, YYYY");
    },
    changeMiddleName(name) {
      if (name != "") return name.charAt(0) + ".";
      else return name;
    },
    getNotifications() {
      // Check if user exists before making API call
      if (!this.$store.state.user || !this.$store.state.user.id) {
        console.error('User not found in store, cannot get notifications');
        return;
      }

      axios
        .get(
          process.env.VUE_APP_BASE_URL +
            "/notifications/find_user/" +
            this.$store.state.user.id
        )
        .then((res) => {
          if (res.status == 200) {
            this.allnotifications = res.data;

            for (var i = 0; i < this.allnotifications.length; i++) {
              if (this.allnotifications[i].hasRead == 0) this.cnt_unread++;
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching notifications:', error);
        });
    },
    changePage(link) {
      this.search_nav_list.splice(0);
      this.search_nav = "";
      this.$router.push(link);
    },
    getImgUrl(imagePath) {
      // return require('@/assets/' + imagePath);
      return (
        process.env.VUE_APP_BASE_URL +
        "/user_menu/get_file/" +
        imagePath +
        "/png"
      );
      // return require('../../assets/' + imagePath);
    },
    getListByClick() {
      // Check if user exists before making API call
      if (!this.$store.state.user || !this.$store.state.user.ut_id || !this.$store.state.user.ut_id.id) {
        console.error('User ut_id not found in store, cannot get list');
        return;
      }

      this.search_nav_list.splice(0);

      axios
        .get(
          process.env.VUE_APP_BASE_URL +
            "/user_type_menu/get_list_click/" +
            this.$store.state.user.ut_id.id
        )
        .then((res) => {
          if (res.status == 200) {
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].um_id.isTitle != 1) {
                this.search_nav_list.push({
                  id: res.data[i].id,
                  name: res.data[i].um_id.name,
                  profile_pic: res.data[i].um_id.profile_pic,
                  link: res.data[i].um_id.link,
                  description: res.data[i].um_id.description,
                  title: res.data[i].um_id.title,
                });
              }
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching menu list:', error);
        });
    },
    searchName() {
      this.search_nav_list.splice(0);

      if (this.search_nav != "" && this.$store.state.user && this.$store.state.user.ut_id && this.$store.state.user.ut_id.id) {
        axios
          .get(
            process.env.VUE_APP_BASE_URL +
              "/user_type_menu/search_nav/" +
              this.search_nav +
              "/" +
              this.$store.state.user.ut_id.id
          )
          .then((res) => {
            if (res.status == 200) {
              for (var i = 0; i < res.data.length; i++) {
                if (res.data[i].um_id.isTitle != 1) {
                  this.search_nav_list.push({
                    id: res.data[i].id,
                    name: res.data[i].um_id.name,
                    profile_pic: res.data[i].um_id.profile_pic,
                    link: res.data[i].um_id.link,
                    description: res.data[i].um_id.description,
                    title: res.data[i].um_id.title,
                  });
                }
              }
            }
          })
          .catch((error) => {
            console.error('Error searching menu:', error);
          });
      }
    },
    getUserInfo() {
      // Check if user exists before making API call
      if (!this.$store.state.user || !this.$store.state.user.id) {
        console.error('User not found in store, cannot get user info');
        return;
      }

      axios
        .get(
          process.env.VUE_APP_BASE_URL +
            "/user/find/" +
            this.$store.state.user.id
        )
        .then((res) => {
          if (res.status == 200) {
            this.profilePic =
              process.env.VUE_APP_BASE_URL +
              "/user/get_img/" +
              res.data.profile_pic;
            this.fullName = res.data.lname + ", " + res.data.fname;
            this.email = res.data.email;
          }
        })
        .catch((error) => {
          console.error('Error fetching user info:', error);
        });
    },
    getFromNow(value) {
      return moment(value).fromNow();
    },
    async logoutAccount() {
      // Check if user exists before accessing user type
      if (!this.$store.state.user || !this.$store.state.user.ut_id || !this.$store.state.user.ut_id.id) {
        // Default logout route if user type is not available
        this.$router.push('/');
        return;
      }

      if (this.$store.state.user.ut_id.id == 1) this.$router.push("/admin");
      else if (this.$store.state.user.ut_id.id == 2)
        this.$router.push("/admin");
      else if (this.$store.state.user.ut_id.id == 3)
        this.$router.push("/login");
    },
  },
};
</script>
s
