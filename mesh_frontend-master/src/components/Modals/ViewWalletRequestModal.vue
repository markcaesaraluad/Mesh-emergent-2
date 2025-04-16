<template>

    <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
    
        <div class="fixed z-10 inset-0">

        
        
            <div class="bg-white h-screen w-full sm:w-1/3 sm:h-2/3 m-auto sm:rounded-2xl sm:absolute sm:left-0 sm:right-0 sm:top-0 sm:bottom-0 flex flex-col fadeInSlide">
        
            <div class="flex items-center py-6 px-8 bg-biege-600 sm:rounded-t-2xl">
                <div class="flex-auto"></div>
                <div class="flex-none">
                    <img src="../../assets/icon_close.png" class="h-6 w-auto cursor-pointer" @click="closeModal"/>
                </div>
            </div>

            <div class="py-6 px-8 space-y-4 flex flex-col overflow-y-auto scrollbar">
                
                <div class="flex-none fadeInSlide">
                    <p class="text-left w-full text-lg font-thin text-gray-700">Status</p>
                    <p class="text-left w-full tracking-wider text-xl font-bold">{{  checkStatus(data.isApproved) }}</p>
                </div>

                <div class="flex-none fadeInSlide">
                    <p class="text-left w-full text-lg font-thin text-gray-700">ID#</p>
                    <p class="text-left w-full tracking-wider text-xl font-bold">{{  data.user_id.user_id }}</p>
                </div>

                <div class="flex-none fadeInSlide">
                    <p class="text-left w-full text-lg font-thin text-gray-700">Requested by</p>
                    <p class="text-left w-full tracking-wider text-xl font-bold">{{  formatUserName(data.user_id) }}</p>
                </div>

                <div class="flex-none fadeInSlide">
                    <p class="text-left w-full text-lg font-thin text-gray-700">Credit Requested</p>
                    <p class="text-left w-full tracking-wider text-xl font-bold">{{  changeMonetaryFormat(data.input_credit) }}</p>
                </div>

           
                <hr>

                <div class="flex-auto w-full text-center fadeInSlide">
                    <img :src="getImg(data.file_attachment)" class="mx-auto h-auto sm:h-96 w-auto"/>
                </div>

                <div class="flex-none flex flex-col sm:flex-row items-center gap-2" v-if="data.isApproved == 0">
                    <button type="button" @click="updateAppointment(1)" class="flex-1 inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 sm:text-lg w-full sm:w-auto">Approve Request</button>
                    <button type="button" @click="updateAppointment(2)" class="flex-1 inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2 sm:text-lg w-full sm:w-auto">Deny Request</button>
                </div>
                

            </div>
    
            </div>
        </div>
    
    </div>
        
    
    
    
        
    </template>
    
    <script>
    import axios from 'axios';
    import moment from 'moment';

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
                available_credits : 0,
                data : {
                    id : 0,
                    user_id : 0,
                    input_credit : 0,
                    isApproved : 0,
                    datetime_added : '',
                    file_attachment : '',
                },
                btn_name : '',
                errors : {
                    description : '',
                },

                show_cancelBtn : true,
                
            }
        },
        methods: {
            getImg(imagePath) {
                return process.env.VUE_APP_BASE_URL + "/user_wallet_transaction/get_screenshot/" + imagePath;
            },
            checkStatus(val){
                if(val == 1) return "Approved";
                else if(val == 2) return "Denied";
                else return "Pending";
            },
            changeMonetaryFormat(val){
                return "₱" + val.toFixed(2);
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

            return result;

            },
            findData(){
                axios.get(process.env.VUE_APP_BASE_URL + '/user_wallet_transaction/find/' + this.data.id)
                .then((res)=>{
                
                    if(res.status == 200){
                
                        this.data.id = res.data.id;
                        this.data.user_id = res.data.user_id;
                        this.data.input_credit = res.data.input_credit;
                        this.data.isApproved = res.data.isApproved;
                        this.data.datetime_added = res.data.datetime_added;
                        this.data.file_attachment = res.data.file_attachment;
                        this.getCredits(res.data.user_id.id);
                       
                
                    }
                    
                });
            },
            getDateFormat(value){
                return moment(value).format('MMMM DD, YYYY');
            },
            getDateTimeFormat(value){
                return moment(value).format('MMMM DD, YYYY hh:MM a');
            },
            updateAppointment(status){

                var data = {
                    id : this.data.id,
                    isApproved : status,
                    user_id : this.$store.state.user.id,
                }

                axios.post(process.env.VUE_APP_BASE_URL + '/user_wallet_transaction/update_wallet', data)
                .then((res)=>{

                    if(res.status == 201){

                        var data2 = {
                            id : this.data.user_id.id,
                            credits : this.available_credits + this.data.input_credit
                        }

                        axios.post(process.env.VUE_APP_BASE_URL + '/user/update_credit', data2)
                        .then((res)=>{

                            if(res.status == 201){

                                this.showNotification(1,"Success","Credits updated!");
                                this.refreshData();
                                this.closeModal();
                                
                            }
                            
                        });

                        
                    }
                    
                });
            },
            getCredits(id){
                axios.get(process.env.VUE_APP_BASE_URL + '/user/find/' + id)
                .then((res)=>{
                
                    if(res.status == 200){
                
                        this.available_credits = res.data.credits;
                    }
                    
                });
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