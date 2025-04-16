<template>
    <div class="bodyTemp flex flex-col sm:h-screen justify-between">
      <!-- <IndexNavbar/> -->
      <router-view></router-view>
        
    </div>
  </template>
  
  <script>
  
    export default{
      
    }
  
  </script>

  <style scoped>

@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

    .bodyTemp{
      background: url('../../assets/index_bg.png') no-repeat;
        background-size: cover;
        font-family: "Roboto";
    }



  </style>