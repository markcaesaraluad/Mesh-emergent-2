<template>

    
<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
    
        <div class="fixed z-10 inset-0">
        
            <div class="bg-white h-screen w-full sm:w-1/3 sm:h-2/4 m-auto sm:rounded-2xl sm:absolute sm:left-0 sm:right-0 sm:top-0 sm:bottom-0 flex flex-col fadeInSlide">
        
            <div class="flex items-center py-6 px-8 bg-biege-600 sm:rounded-t-2xl">
                <div class="flex-auto"></div>
                <div class="flex-none">
                    <img src="../../assets/icon_close.png" class="h-6 w-auto cursor-pointer" @click="closeModal"/>
                </div>
            </div>

            <div class="py-6 px-8 space-y-4 flex flex-col overflow-y-auto scrollbar">

                <div class="flex-none fadeInSlide">
                    <p class="text-left w-full text-lg font-thin text-gray-700">Description</p>
                    <input v-model="data.description" type="text" class="text-left w-full tracking-wider text-xl font-bold rounded-md"/>
                </div>

                <div class="flex-none fadeInSlide">
                    <p class="text-left w-full text-lg font-thin text-gray-700">Duration (minutes)</p>
                    <input v-model="data.duration" type="number" class="text-left w-full tracking-wider text-xl font-bold rounded-md"/>
                </div>

                <div class="flex-none fadeInSlide">
                    <p class="text-left w-full text-lg font-thin text-gray-700">Rate</p>
                    <input v-model="data.rate" type="number" class="text-left w-full tracking-wider text-xl font-bold rounded-md"/>
                </div>

                <div class="flex-none fadeInSlide">
                    <p class="text-left w-full text-lg font-thin text-gray-700">Rate Type</p>
                    <!-- <input v-model="data.rate" type="number" class="text-left w-full tracking-wider text-xl font-bold rounded-md"/> -->
                    <select v-model="data.rate_type" class="text-left w-full tracking-wider text-xl font-bold rounded-md">
                        <option selected value="1">Student</option>
                        <option value="2">Regular</option>
                    </select>
                </div>

                <div class="flex-none fadeInSlide">
                    <p class="text-left w-full text-lg font-thin text-gray-700">Exceed Rate</p>
                    <input v-model="data.exceed" type="number" class="text-left w-full tracking-wider text-xl font-bold rounded-md"/>
                </div>

                <hr>


                <div class="flex-none flex flex-col sm:flex-row items-center gap-2" >
                    <div class="flex-auto"></div>
                    <button type="button" @click="confirmAction" class="flex-2 inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 sm:text-lg w-full sm:w-auto">{{ btn_name }}</button>
                </div>
                

            </div>
    
            </div>
        </div>
    
    </div>
    
    
        
    </template>
    
    <script>
    import axios from 'axios';

    export default{
        props: {
            item_data : Object,
            refreshData : Function,
            showNotification : Function,
        },
        data(){
            return{
                title : '',
                action : '',
                data : {
                    id : 0,
                    description : '',
                    duration : 0,
                    area_id : 0,
                    rate : 0,
                    exceed : 0,
                    datetime_added : '',
                    type : 0
                },
                btn_name : '',
                errors : {
                    description : '',
                },
                
            }
        },
        methods: {
            changeMonetaryFormat(val){
                return "₱" + val.toFixed(2);
            },
            findData(){
                axios.get(process.env.VUE_APP_BASE_URL + '/rates/find/' + this.data.id)
                .then((res)=>{
                
                    if(res.status == 200){
                
                        this.data.id = res.data.id;
                        this.data.description = res.data.description;
                        this.data.rate = res.data.rate;
                        this.data.rate_type = res.data.rate_type;
                        this.data.exceed = res.data.exceed;
                        this.data.duration = res.data.duration;
                        // this.data.description = res.data.description;
                
                    }
                    
                });
            },
            confirmAction(){

                const today = new Date();
                const date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
                const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                const timestamp = date + ' ' + time;

                var valid = true;

                if(this.action == "add"){

                    this.data.datetime_added = timestamp;
                    
                    if(valid){
                        axios.post(process.env.VUE_APP_BASE_URL + '/rates/add', this.data)
                        .then((res)=>{

                            if(res.status == 201){

                                this.showNotification(1,"Success","Rate added!");
                                this.refreshData();
                                this.closeModal();
                                
                            }
                            
                        });
                    }
                    
                }
                else if(this.action == "edit"){
                    axios.post(process.env.VUE_APP_BASE_URL + '/rates/edit', this.data)
                    .then((res)=>{

                        if(res.status == 201){
                            
                            this.showNotification(1,"Success","Rate updated!");
                            this.refreshData();
                            this.closeModal();

                        }
                        
                    });
                }

                
                
            },
            closeModal(){
                this.$emit('close-modal');
            }
        },
        watch: {
            item_data: {
            handler(val){
                this.data.id = val.id;
                this.data.area_id = val.area_id;
                this.data.rate_type = val.rate_type;
                this.action = val.action;

                if(this.action == "add"){
                    this.title = "Add Area";
                    this.btn_name = "Add";
                }
                else if(this.action == "edit"){
                    this.title = "Edit Area";
                    this.btn_name = "Edit";
                    this.findData();
                } 
                
            },
            immediate:true
          }
        }
    }
        
    </script>