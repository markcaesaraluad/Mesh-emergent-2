<template>

    <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
    
        <div class="fixed z-10 inset-0">
        
            <div class="bg-white h-screen w-full sm:w-full sm:h-full m-auto sm:absolute sm:left-0 sm:right-0 sm:top-0 sm:bottom-0 flex flex-col fadeIn overflow-y-auto scrollbar">

            <div class="space-y-4 flex flex-col p-8">


                <div class="flex-none">
                    <p class="text-center w-full tracking-wider text-xl sm:text-2xl font-thin fadeInSlide">{{ data.description }}</p>
                </div>

                <div class="flex-none">
                    <p class="text-left w-full tracking-wider text-xl font-thin fadeInSlide">Select package</p>
                </div>
                
                <div class="flex-none grid grid-cols-1 sm:grid-cols-2 gap-2 h-40 sm:h-auto overflow-y-auto scrollbar">
                    <div v-for="i in allrates" v-bind:key="i.id" class="border border-gray-300 p-4 rounded-md fadeInSlide cursor-pointer duration-200" :class="selected_package == i.id ? 'bg-biege-700 text-white' : 'bg-white text-gray-800'" @click="selectPackage(i)">
                        <div class="flex items-center">
                            <span class="flex-auto ">{{ i.description }}</span>
                            <span class="flex-none font-bold">₱{{ i.rate }}</span>
                        </div>
                        <div class="flex items-center">
                            <span class="flex-auto"></span>
                            <span class="flex-none"><i class="mr-2">Exceed rate: </i>₱{{ i.exceed }}</span>
                        </div>
                    </div>
                </div>

                <div class="flex-none">
                    <img :src="getImgSeatUrl(data.seat_pic)" class="h-auto sm:h-96 w-auto mx-auto fadeInSlide"/>
                </div>

                <div class="flex-none">
                    <p class="flex-none text-left tracking-wider text-xl font-thin fadeInSlide">Select Seat</p>
                    <input v-model="selected_date" type="date" @change="findRooms" class="flex-none text-left tracking-wider text-xl font-thin fadeInSlide rounded-sm"/>
                    <VueTimepicker v-model="selected_time" format="hh:mm A"></VueTimepicker>
                </div>

                <div class="flex-none">
                    <!-- Visual Seat Map -->
                    <SeatMap 
                        :area-type="getAreaType(data.description)"
                        :available-seats="allrooms"
                        :selected-seat="selected_room"
                        @seat-selected="selectSeatFromMap"
                    />
                    
                    <!-- Fallback: Original seat list for areas not yet mapped -->
                    <div v-if="!isVisualMappingSupported(data.description)" class="mt-4 p-3 bg-yellow-50 rounded-md">
                        <p class="text-sm text-yellow-700 mb-3">Visual map not available for this area. Please select from the list below:</p>
                        <div class="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2 h-40 sm:h-auto overflow-y-auto scrollbar">
                            <div v-for="i in allrooms" v-bind:key="i.id" class="border border-gray-300 p-4 rounded-md fadeInSlide cursor-pointer duration-200" :class="selected_room == i.id ? 'bg-biege-700 text-white' : 'bg-white text-gray-800'" @click="selectRoom(i)">
                                <div class="flex items-center">
                                    <span class="flex-auto">Seat #{{ i.num }}</span>
                                    <span class="flex-none bg-green-600 text-white rounded-sm px-4 py-2 text-sm" v-if="i.is_reserved">Reserved</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex-none flex flex-col sm:flex-row items-center gap-2">
                    <div class="flex-auto flex items-center">
                        Available Credits :  <span class="font-bold ml-2">{{ changeMonetaryFormat(available_credits) }}</span>
                    </div>
                    <div class="flex-none flex items-center">
                        Payment Type : 
                        <select v-model="payment_type" class="ml-2 font-bold">
                            <option value="1">Credits</option>
                            <option value="2">E-cash Screenshot</option>
                        </select>

                        <input v-if="payment_type == 2" type="file" id="fileupload" ref="fileupload" @change="onFileChange" class="ml-2 border border-gray-300 w-auto rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"/>
                
                    </div>
                    <button type="button" @click="confirmAction" class="flex-2 inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 sm:text-lg w-full sm:w-auto">Book now!</button>
                    <button type="button" @click="closeModal" class="flex-2 inline-flex items-center justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 font-medium text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 sm:text-lg w-full sm:w-auto">Close</button>
                </div>
            </div>
    
            </div>
        </div>
    
    </div>
        
    
    
    
        
    </template>
    
    <script>
    import axios from 'axios';
    import VueTimepicker from 'vue3-timepicker';
    import 'vue3-timepicker/dist/VueTimepicker.css';
    import SeatMap from '../SeatMap.vue';

    export default{
        props: {
            item_data : Object,
            refreshData : Function,
            showNotification : Function,
        },
        data(){
            return{
                available_credits : 0,
                allrates : '',
                allrooms : '',
                title : '',
                action : '',
                total_amount : 0,
                payment_type : 1,
                selected_date : '',
                selected_time : '',
                selected_package : 0,
                selected_room : 0,
                attachment_file : '',
                attachment_name : '',
                data : {
                    id : 0,
                    description : '',
                    status : 0,
                    profile_pic : '',
                    seat_pic : '',
                    rates : {
                        description : '',
                        duration : 0,
                        rate : 0,
                        exceed : 0,
                    }
                },
                btn_name : '',
                errors : {
                    description : '',
                },
                
            }
        },
        components: {
            VueTimepicker,
            SeatMap
        },
        methods: {
            changeMonetaryFormat(val){
                return "₱" + val.toFixed(2);
            },
            getImgUrl(imagePath) {
                return process.env.VUE_APP_BASE_URL + "/areas/get_img/" + imagePath;
            },
            getImgSeatUrl(imagePath) {
                return process.env.VUE_APP_BASE_URL + "/areas/get_seat/" + imagePath;
            },
            selectPackage(i){
                this.selected_package = i.id;
                this.total_amount = i.rate;
            },
            selectRoom(i){
                if(!i.is_reserved) this.selected_room = i.id;
            },
            onFileChange(e){
                var fileData =  e.target.files[0];
                if(fileData){
                    var fileName = "";
                    var fileExt = "";
                    var fileArray = fileData.name.split(".");
                    
                    for(var i = 0; i < fileArray.length; i++){
                        fileArray[i] = fileArray[i].replaceAll(",", '');
                            if(i == fileArray.length - 2){
                            fileArray[i] = fileArray[i].replace(/[^a-zA-Z0-9 _-]/g, '');
                            fileName += fileArray[i];
                            }
                            else{
                                fileName += fileArray[i] + "."; 
                            }
                            if(i == fileArray.length - 2) break;

                    }


                    fileExt = fileArray[fileArray.length - 1].toLowerCase().trim();
                    if(fileExt != "jpg" && fileExt != "jpeg" && fileExt != "png"){
                        this.showNotification(0,'Invalid file extension','Please upload only image files.');
                        this.$refs.fileupload.value = null;
                    }
                    else{
                        const today = new Date();
                        const date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
                        fileName = this.$store.state.user.user_id + "_ " + date;
                        this.attachment_name = fileName + "."+ fileExt;

                        const formdata = new FormData();
                        var file_input = document.getElementById('fileupload').files[0];
                        
                        formdata.append("file", file_input, this.attachment_name);
                        this.attachment_file = formdata;
                    }
                }
        },
            getCredits(){
                axios.get(process.env.VUE_APP_BASE_URL + '/user/find/' + this.$store.state.user.id)
                .then((res)=>{
                
                    if(res.status == 200){
                
                        this.available_credits = res.data.credits;
                    }
                    
                });
            },
            findData(){
                axios.get(process.env.VUE_APP_BASE_URL + '/areas/find/' + this.data.id)
                .then((res)=>{
                
                    if(res.status == 200){
                
                        this.data.id = res.data.id;
                        this.data.description = res.data.description;
                        this.data.status = res.data.status;
                        this.data.profile_pic = res.data.profile_pic;
                        this.data.seat_pic = res.data.seat_pic;

                        this.findRates();
                        this.findRooms();
                    }
                    
                });
            },
            findRates(){
                axios.get(process.env.VUE_APP_BASE_URL + '/rates/find_area/' + this.data.id)
                .then((res)=>{
                
                    if(res.status == 200){
                
                        this.allrates = res.data;

                    }
                    
                });
            },
            findRooms(){
                this.selected_room = 0;
                axios.get(process.env.VUE_APP_BASE_URL + '/area_rooms/find_seats/' + this.data.id + '/' + this.selected_date)
                .then((res)=>{
                
                    if(res.status == 200){
                
                        this.allrooms = res.data;

                    }
                    
                });
            },
            confirmAction(){

                const today = new Date();
                const date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
                const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                const timestamp = date + ' ' + time;

                var valid = true;

                if(this.selected_package == 0){
                    this.showNotification(0,"Please select package","");
                    valid = false;
                }
                else if(this.selected_room == 0){
                    this.showNotification(0,"Please select room","");
                    valid = false;
                }
                else if(this.total_amount > this.available_credits && this.payment_type == 1){
                    this.showNotification(0,"Insufficient credits","Selected package rate is higher than your credits. Please load your credits. Thank you!");
                    valid = false;
                } 
                else if(this.attachment_name == '' && this.payment_type == 2){
                    this.showNotification(0,"No attachment","Please upload screenshot. Thank you!");
                    valid = false;
                } 



                
                
                    
                    
                    if(valid){

                        var data = {
                            user_id : this.$store.state.user.id,
                            area_id : this.data.id,
                            rate_id : this.selected_package,
                            area_room_id : this.selected_room,
                            status : 0,
                            datetime_reserved : this.selected_date + " " + this.selected_time,
                            datetime_added : timestamp,
                            amount_paid : this.total_amount,
                            payment_type : this.payment_type,
                            file_attachment : null
                        }

                        if(this.attachment_file){
                            data.file_attachment = this.attachment_name;      
                        }



                        axios.post(process.env.VUE_APP_BASE_URL + '/area_rooms_reservation/add', data)
                        .then((res)=>{

                            if(res.status == 201){

                                if(this.attachment_file){

                                    axios.post(process.env.VUE_APP_BASE_URL + '/area_rooms_reservation/upload_screenshot', this.attachment_file)
                                .then((res)=>{

                                    if(res.status == 201){
                                        //
                                    }
                                    
                                });

                                }

                                this.showNotification(1,"Book Successful!","Please approach establishment upon said date. Thank you!");
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

                const today = new Date();
                const date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
                const timestamp = date;
                
                this.selected_date = timestamp;
                this.data.id = val.id;

                this.getCredits();
                this.findData();

                

            
                
            },
            immediate:true
          }
        }
    }
        
    </script>