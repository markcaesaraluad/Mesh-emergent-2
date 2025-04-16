<template>

    <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
    
        <div class="fixed z-10 inset-0 overflow-y-auto my-4" @click="closeModal">
        
        <div class="flex items-center sm:items-center justify-center min-h-full px-8 py-2 sm:p-0">
        
            <div class="bg-white shadow rounded-lg w-1/3">
            <div class="p-6">
                <h3 class="text-md font-bold leading-6 text-gray-900">{{title}}</h3>

                <div class="my-2 flex">
                    <img :src="data.profile_pic" class="h-24 w-24 mr-4 rounded-2xl"/>
                    <div class="flex flex-col">
                        <p class="text-lg font-bold">{{ data.fullname}}</p>
                        <p class="text-sm">Office: <span class="font-bold">{{ data.office }}</span></p>
                        <p class="text-sm">Position: <span class="font-bold">{{ data.position }}</span></p>
                        <p class="text-sm">Status: <span class="font-bold">{{ checkBoolean(data.isActive) }}</span></p>
                    </div>
                </div>

                


                <div class="mt-5 grid grid-cols-2 gap-2">
                    <button type="button" @click.stop.prevent="testfunc()" class="inline-flex items-center justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-xs">Reset password</button>
                    <button type="button" class="inline-flex items-center justify-center rounded-md border border-transparent bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:text-xs">Deactivate password</button>
                </div>
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
                    profile_pic : '',
                    fullname : '',
                    position : '',
                    office : '',
                    isActive : '',
                    datetime_added : '',
                },
                btn_name : '',
                errors : {
                    description : '',
                },
                
            }
        },
        methods: {
            testfunc(){
                alert("hi");
            },
            findData(){
                axios.get(process.env.VUE_APP_BASE_URL + '/user/find_user/' + this.data.id)
                .then((res)=>{
                
                    if(res.status == 200){


                        this.data.id = res.data.id;
                        this.data.fullname = res.data.fname + " " + res.data.mname + " " + res.data.lname;
                        this.data.position = res.data.position_id.description;
                        this.data.office = res.data.office_id.description;
                        this.data.isActive = res.data.isActive;
                        this.data.profile_pic = process.env.VUE_APP_BASE_URL + "/user/get_img/"+res.data.profile_pic+"/profile_pic";
                        
                    }
                    
                });
            },
            checkBoolean(val){
                if(val == 0) return "Inactive";
                else return "Active";
            },
            closeModal(){
                this.$emit('close-modal');
            }
        },
        watch: {
            item_data: {
            handler(val){
                this.data.id = val.id;
                this.findData();
                
            },
            immediate:true
          }
        }
    }
        
    </script>