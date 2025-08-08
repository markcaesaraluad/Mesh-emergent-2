<template>
  <div>
    <div
      v-if="showDisablePage"
      class="fixed z-10 inset-0 grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8"
    >
      <div class="text-center">
        <img
          class="mx-auto h-auto sm:h-20 w-auto mb-4"
          src="../../assets/icon_no_access.png"
          alt="Your Company"
        />
        <h1
          class="mt-4 text-3xl font-bold tracking-tight text-green-600 sm:text-5xl"
        >
          Access Denied: Permission Required
        </h1>
        <p class="mt-6 text-base leading-7 text-gray-600">
          Sorry, you are not allowed to access this page.
        </p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <button
            class="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            @click="$router.go(-1)"
          >
            Go back
          </button>
          <!-- <a href="#" class="text-sm font-semibold text-gray-900">Contact support <span aria-hidden="true">&rarr;</span></a> -->
        </div>
      </div>
    </div>
  
    <div v-if="!showDisablePage" class="flex h-screen bg-gray-100 bodyTemp">
      <!-- sidebar -->
      <div
        class="hidden md:flex md:flex-col md:flex-none bg-biege-600 border-r-2"
      >
        <DashboardSidebar
          :openSidebar="openSidebar"
          :class="[openSidebar ? 'md:flex md:w-0' : 'hidden md:flex md:w-auto']"
        />
      </div>
  
      <!-- Main content -->
      <div class="flex flex-col flex-auto overflow-y-auto">
        <div>
          <DashboardNavbar />
        </div>
  
        <div class="p-4">
          <router-view
            :nightMode="nightMode"
            :showNotification="showNotification"
            :insertLogs="insertLogs"
            class="h-auto"
          ></router-view>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import DashboardNavbar from "../Navbars/DashboardNavbar.vue";
import DashboardSidebar from "../Navbars/DashboardSidebar.vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import axios from "axios";

export default {
  name: "DashboardLayout",
  data() {
    return {
      showDisablePage: false,
      showNotif: false,
      type: "",
      msg: "",
      msg_title: "",

      nightMode: false,
      openSidebar: true,
      nightClass: "bg-gray-500",
      dayClass: "bg-white",
    };
  },
  components: {
    DashboardNavbar,
    DashboardSidebar,
  },

  methods: {
    insertLogs(action, description) {
      //For Logs
      // Check if user exists before accessing user properties
      if (!this.$store.state.user || !this.$store.state.user.id) {
        console.error('User not available for logging');
        return;
      }

      const today = new Date();
      const date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      const time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      const timestamp = date + " " + time;

      var log_data = {
        user_id: "",
        action: "",
        description: "",
        datetime_added: "",
      };

      log_data.user_id = this.$store.state.user.id;
      log_data.action = action;
      log_data.description = description;
      log_data.datetime_added = timestamp;

      // axios.get(process.env.VUE_APP_BASE_URL + '/logs/register', this.log_data)
      // .then((res)=>{

      //     if(res.status == 201){

      //     }

      // })
    },
    checkModuleAvailable() {
      var data = {
        ut_id: this.$store.state.user.ut_id.id,
        link: this.$route.fullPath,
      };

      axios
        .post(process.env.VUE_APP_BASE_URL + "/user_types_menu/check", data)
        .then((res) => {
          if (res.data.check_data === 0) this.showDisablePage = true;
          else this.showDisablePage = false;
        });
    },
    showNotification(type, msg_title, msg) {
      var msg_holder = "<b>" + msg_title + "</b><br>" + msg;

      if (type == 0) {
        toast(msg_holder, {
          autoClose: 3000,
          dangerouslyHTMLString: true,
          type: "warning",
        });
      } else if (type == 1) {
        toast(msg_holder, {
          autoClose: 3000,
          dangerouslyHTMLString: true,
          type: "success",
        });
      }

      // if(this.showNotif){
      //     this.showNotif = false;
      // }
      // else{
      //     this.showNotif = true;
      // }
    },
    openCloseSidebar() {
      if (this.openSidebar) {
        this.openSidebar = false;
      } else {
        this.openSidebar = true;
      }
    },
    clickOpenCloseSidebar() {
      if (screen.width <= 760) {
        if (this.openSidebar) {
          this.openSidebar = false;
        } else {
          this.openSidebar = true;
        }
      }
    },
    changeFormatName(data) {
      alert(data);
    },
  },
  mounted() {
    this.checkModuleAvailable();
  },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");

.bodyTemp {
  font-family: "Roboto";
}

.bgColor {
  background: "#28821a";
}

.fontColor {
  color: "28821a";
}

.fadeIn {
  animation: fadeIn 0.5s ease;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fadeInSlide {
  animation: fadeInSlide 0.5s ease;
}
@keyframes fadeInSlide {
  from {
    opacity: 0;
    transform: translate3d(10%, 10%, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.fade {
  animation: fade 0.5s ease;
}

@keyframes fade {
  to {
    opacity: 0.25;
  }
}

.slideOut {
  animation: slideOut 0.5s ease-out;
}
@keyframes slideOut {
  from {
    width: 0;
  }
  to {
    width: 10rem;
  }
}

.slideIn {
  animation: slideIn 0.5s ease;
}
@keyframes slideIn {
  from {
    width: 10rem;
  }
  to {
    width: 0;
  }
}

.slideDown {
  animation: slideDown 0.5s ease forwards;
}
@keyframes slideDown {
  from {
    height: 0;
    max-height: 0;
    transition: max-height 1s cubic-bezier(0, 1, 0, 1);
  }
  to {
    max-height: 1000px;
    transition: max-height 1s ease;
  }
}

.slideUp {
  animation: slideUp 0.5s ease;
}
@keyframes slideUp {
  from {
    height: 8rem;
  }
  to {
    height: 0;
    max-height: 1000px;
  }
}

.slideFromDownToUp {
  animation: slideFromDownToUp 0.5s ease;
}
@keyframes slideFromDownToUp {
  from {
    height: 0;
  }
  to {
    height: 100%;
    max-height: 1000px;
  }
}
</style>
