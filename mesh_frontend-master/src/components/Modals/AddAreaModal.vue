<template>

    <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
    
        <div class="fixed z-10 inset-0">
        
            <div class="bg-white h-screen w-full sm:w-1/3 sm:h-2/3 m-auto px-8 sm:rounded-lg sm:absolute sm:left-0 sm:right-0 sm:top-0 sm:bottom-0 flex flex-col fadeInSlide overflow-y-auto scrollbar">
        
            <div class="p-6 space-y-4 flex flex-col">
                <h3 class="flex-none text-md font-bold leading-6 text-gray-900">{{title}}</h3>

                <div class="flex-auto w-full text-center">
                    <img src="../../assets/default_pic.png" class="mx-auto h-40 w-auto"/>
                </div>

                <div class="flex-none">
                    <b class="text-gray-500 text-md italic">Area Information</b>
                </div>

                <div class="flex-none">
                    <p class="text-sm text-gray-600 flex items-center">Status</p>
                    <select v-model="data.status" class="font-bold border-gray-300 w-auto rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500">
                        <option value="1">Active</option>
                        <option value="2">Inactive</option>
                    </select>
                </div>


                <div class="flex-none">
                    <p class="text-sm text-gray-600 flex items-center">Description  <span class="text-xs text-red-500 ml-2">{{ errors.description }}</span></p>
                    <input type="text" v-model="data.description" class="font-bold border-gray-300 w-full rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500">
                </div>

                <div class="flex-none text-end">
                    <button type="button" @click="confirmAction" class="inline-flex items-center justify-center rounded-md border border-transparent bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:text-xs">{{ btn_name }}</button>
                    <button type="button" @click="closeModal" class="inline-flex items-center justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 font-medium text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 sm:text-xs ml-2">Cancel</button>
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
                    status : 1,
                },
                btn_name : '',
                errors : {
                    description : '',
                },
                
            }
        },
        methods: {
            findData(){
                axios.get(process.env.VUE_APP_BASE_URL + '/areas/find/' + this.data.id)
                .then((res)=>{
                
                    if(res.status == 200){
                
                        this.data.id = res.data.id;
                        this.data.description = res.data.description;
                        this.data.status = res.data.status;
                
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
                        axios.post(process.env.VUE_APP_BASE_URL + '/areas/add', this.data)
                        .then((res)=>{

                            if(res.status == 201){

                                this.showNotification(1,"Success","Area added!");
                                this.refreshData();
                                this.closeModal();
                                
                            }
                            
                        });
                    }
                    
                }
                else if(this.action == "edit"){
                    axios.post(process.env.VUE_APP_BASE_URL + '/areas/edit', this.data)
                    .then((res)=>{

                        if(res.status == 201){
                            
                            this.showNotification(1,"Success","Customer updated!");
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