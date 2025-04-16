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
                    <p class="text-left w-full tracking-wider text-xl font-bold">{{  checkStatus(data.status) }}</p>
                </div>

                <div class="flex-none fadeInSlide">
                    <p class="text-left w-full text-lg font-thin text-gray-700">Selected Area</p>
                    <p class="text-left w-full tracking-wider text-xl font-bold">{{  data.area_name }}</p>
                </div>

                <div class="flex-none fadeInSlide">
                    <p class="text-left w-full text-lg font-thin text-gray-700">Selected Package</p>
                    <p class="text-left w-full tracking-wider text-xl font-bold">{{  data.rate_name }}</p>
                </div>

                <div class="flex-none fadeInSlide">
                    <p class="text-left w-full text-lg font-thin text-gray-700">Selected Seat</p>
                    <p class="text-left w-full tracking-wider text-xl font-bold">Seat #{{  data.seat_num }}</p>
                </div>

                <div class="flex-none fadeInSlide">
                    <p class="text-left w-full text-lg font-thin text-gray-700">Payment Type</p>
                    <p class="text-left w-full tracking-wider text-xl font-bold">{{ data.payment_type ==  1 ? 'Credits' : 'E-cash Screenshot'}}</p>
                </div>

                <div v-if="data.payment_type == 1" class="flex-none fadeInSlide">
                    <p class="text-left w-full text-lg font-thin text-gray-700">Paid Amount</p>
                    <p class="text-left w-full tracking-wider text-xl font-bold">{{  changeMonetaryFormat(data.amount_paid) }}</p>
                </div>

                <div v-if="data.payment_type == 2" class="flex-none fadeInSlide">
                    <p class="text-left w-full text-lg font-thin text-gray-700">Payment Screenshot</p>
                    <p class="text-center w-20 tracking-wider rounded-md bg-gray-500 text-sm text-white cursor-pointer" @click="viewScreenshot">View file</p>
                </div>

                <div class="flex-none fadeInSlide">
                    <p class="text-left w-full text-lg font-thin text-gray-700">Reservation Date</p>
                    <p class="text-left w-full tracking-wider text-xl font-bold">{{  getDateTimeFormat(data.datetime_reserved) }}</p>
                </div>

                <div class="flex-none fadeInSlide">
                    <p class="text-left w-full text-lg font-thin text-gray-700">Date & Time Reserved</p>
                    <p class="text-left w-full tracking-wider text-xl font-bold">{{  getDateTimeFormat(data.datetime_added) }}</p>
                </div>

                <hr>

                <div class="flex-auto w-full text-center fadeInSlide">
                    <img :src="getImgSeatUrl(data.seat_pic)" class="mx-auto h-auto sm:h-96 w-auto"/>
                </div>

                <div class="flex-none flex flex-col sm:flex-row items-center gap-2" v-if="data.status == 0">
                    <div class="flex-auto"></div>
                    <button v-if="show_cancelBtn" type="button" @click="cancelAppointment" class="flex-2 inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2 sm:text-lg w-full sm:w-auto">Cancel Appointment</button>
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
                data : {
                    id : 0,
                    area_name : '',
                    rate_name : '',
                    seat_num : 0,
                    amount_paid : 0,
                    seat_pic : '',
                    datetime_added : '',
                    datetime_reserved : '',
                    status : 0,
                    file_attachment : '',
                    payment_type : 0,
                },
                btn_name : '',
                errors : {
                    description : '',
                },

                show_cancelBtn : true,
                
            }
        },
        methods: {
            viewScreenshot(){
                window.open(process.env.VUE_APP_BASE_URL + "/area_rooms_reservation/get_screenshot/" + this.data.file_attachment);
            },
            getImgSeatUrl(imagePath) {
                return process.env.VUE_APP_BASE_URL + "/areas/get_seat/" + imagePath;
            },
            checkStatus(val){
                if(val == 1) return "Approved";
                else if(val == 2) return "Denied";
                else return "Pending";
            },
            changeMonetaryFormat(val){
                return "₱" + val.toFixed(2);
            },
            findData(){
                axios.get(process.env.VUE_APP_BASE_URL + '/area_rooms_reservation/find/' + this.data.id)
                .then((res)=>{
                
                    if(res.status == 200){
                
                        this.data.id = res.data.id;
                        this.data.seat_pic = res.data.area_id.seat_pic;
                        this.data.area_name = res.data.area_id.description;
                        this.data.rate_name = res.data.rate_id.description;
                        this.data.seat_num = res.data.area_room_id.num;
                        this.data.amount_paid = res.data.amount_paid;
                        this.data.datetime_added = res.data.datetime_added;
                        this.data.datetime_reserved = res.data.datetime_reserved;
                        this.data.status = res.data.status;
                        this.data.payment_type = res.data.payment_type;
                        this.data.file_attachment = res.data.file_attachment;

                        let a = moment(res.data.datetime_added);
                        let b = moment();
                        
                        let total = a.diff(b, "hours");
                        
                        if(total < 0) total *= -1

                        if(total >= 24) this.show_cancelBtn = false;
                        // this.data.description = res.data.description;
                        // this.data.status = res.data.status;
                
                    }
                    
                });
            },
            getDateFormat(value){
                return moment(value).format('MMMM DD, YYYY');
            },
            getDateTimeFormat(value){
                return moment(value).format('MMMM DD, YYYY hh:MM a');
            },
            cancelAppointment(){

                var data = {
                    id : this.data.id
                }
                axios.post(process.env.VUE_APP_BASE_URL + '/area_rooms_reservation/cancel', data)
                .then((res)=>{

                    if(res.status == 201){

                        this.showNotification(1,"Success","Cancelled appointment!");
                        this.refreshData();
                        this.closeModal();
                        
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