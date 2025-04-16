<template>

    <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
    
        <div class="fixed z-10 inset-0 overflow-y-auto my-4">
        
        <div class="flex items-center sm:items-center justify-center min-h-full px-8 py-2 sm:p-0">
        
            <div class="bg-white shadow rounded-lg w-1/3 fadeInSlide">
            <div class="p-6">
                <h3 class="text-md font-bold leading-6 text-gray-900">{{title}}</h3>

                <div class="my-2">
                    <p class="text-sm text-gray-600 mb-2 flex items-center">User ID <span class="text-xs text-red-500 ml-2">{{ errors.name }}</span></p>
        
                    <input type="text" ref="user_id" v-model="add_data.user_id" class="font-bold border-gray-300 w-full rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 py-8 text-center" placeholder="ABC-#####" @keyup.enter="searchUser" autofocus>
                </div>

                <div v-if="ifExist" class="my-2">
                        <p class="text-sm text-gray-600 mb-2 flex items-center">Name</p>
            
                        <p class="font-bold border-gray-300 w-full rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500">
                            {{data.fullname}}
                        </p>
                    </div>

                <div v-if="ifExist">

                    

                    <div v-if="hasData">
                        <p class="text-sm text-gray-600 mb-2 flex items-center font-bold">Package Details</p>

                        <div class="my-2">
                            <p class="text-sm text-gray-600 mb-2 flex items-center">Name</p>
                
                            <p class="font-bold border-gray-300 w-full rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500">
                                {{info_data.package_name}}
                            </p>
                        </div>

                        <div class="my-2">
                            <p class="text-sm text-gray-600 mb-2 flex items-center">Rate</p>
                
                            <p class="font-bold border-gray-300 w-full rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500">
                                {{changeMoneyFormat(info_data.rate)}}
                            </p>
                        </div>

                        <div class="my-2">
                            <p class="text-sm text-gray-600 mb-2 flex items-center">Consumed Time</p>
                
                            <p class="font-bold border-gray-300 w-full rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500">
                                {{info_data.consumed_time}}
                            </p>
                        </div>

                        <div class="my-2">
                            <p class="text-sm text-gray-600 mb-2 flex items-center">Seat location</p>
                
                            <p class="font-bold border-gray-300 w-full rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500">
                                {{info_data.area_seat_num}}
                            </p>
                        </div>

                        <p class="text-sm text-gray-600 mb-2 flex items-center font-bold">Payment Details</p>

                        <div class="my-2">
                            <p class="text-sm text-gray-600 mb-2 flex items-center">Consumed Rate</p>
                
                            <p class="font-bold border-gray-300 w-full rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500">
                                {{changeMoneyFormat(info_data.consumed_rate)}}
                            </p>
                        </div>

                        <div class="my-2">
                            <p class="text-sm text-gray-600 mb-2 flex items-center">Payment Type</p>
                
                            <select v-model="info_data.payment_type" class="font-bold border-gray-300 w-auto rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500">
                                <option value="1">Cash</option>
                                <option value="2">E-Wallet (GCash, Paymaya, etc.)</option>
                            </select>
                        </div>

                        <!-- <div class="my-2">
                            <p class="text-sm text-gray-600 mb-2 flex items-center">Input Payment</p>
                
                            <input v-model="info_data.input_payment" type="number" class="font-bold border-gray-300 w-full rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"/>
                             
                        </div> -->

                    </div>

                    <div v-if="!hasData">
                        <div class="my-2">
                            <p class="text-sm text-gray-600 mb-2 flex items-center">Customer Type</p>

                            <select v-model="add_data.rate_type" @change="selectPackage()" class="font-bold border-gray-300 w-full rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500">
                                <option value="1">Student</option>
                                <option value="2">Regular</option>
                            </select>
                
                        </div>

                        <div class="my-2">
                            <p class="text-sm text-gray-600 mb-2 flex items-center">Area Name</p>

                            <select v-model="add_data.area_id" @change="selectPackage()" class="font-bold border-gray-300 w-full rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500">
                                <option v-for="i in allarea" v-bind:key="i.id" v-bind:value="i.id">{{ i.description }}</option>
                            </select>
                
                        </div>

                        <div class="my-2">
                            <p class="text-sm text-gray-600 mb-2 flex items-center">Package Name</p>

                            <select v-model="add_data.package_id" class="font-bold border-gray-300 w-full rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500">
                                <option v-for="i in allpackage" v-bind:key="i.id" v-bind:value="i.id">{{ i.description }}</option>
                            </select>
                
                        </div>

                        <div class="my-2">
                            <p class="text-sm text-gray-600 mb-2 flex items-center">Seat #</p>

                            <select v-model="add_data.area_seat_num" class="font-bold border-gray-300 w-auto rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500">
                                <option v-for="i in allrooms" v-bind:key="i.id" v-bind:value="i.num">{{ i.num }}</option>
                            </select>
                
                        </div>
                    </div>

                    <div class="my-2">
                        <p class="text-sm text-gray-600 mb-2 flex items-center">Remarks</p>

                        <textarea v-model="data.remarks" rows="2" class="font-bold border-gray-300 w-full rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500">
                        </textarea>
                    </div>

                </div>

                <!-- <div class="my-2">
                    <p class="text-sm text-gray-600 mb-2 flex items-center">Type</p>

                    <select v-model="data.isTitle" @change="disableText()" class="font-bold border-gray-300 w-full rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500">
                        <option value="0">Module</option>
                        <option value="1">Parent Module</option>
                    </select>
        
                </div> -->

                

                <div class="mt-5 text-end space-x-2">
                    <button v-if="!hasData" type="button" @click="confirmAction('login')" class="inline-flex items-center justify-center rounded-md border border-transparent bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:text-xs">Login</button>
                    <button v-if="hasData" type="button" @click="confirmAction(update_btn_name)" class="inline-flex items-center justify-center rounded-md border border-transparent bg-gray-500 px-4 py-2 font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:text-xs uppercase">{{ update_btn_name }}</button>
                    <button v-if="hasData" type="button" @click="confirmAction('signout')" class="inline-flex items-center justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-xs">Signout</button>
                    <button type="button" @click="closeModal" class="inline-flex items-center justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 font-medium text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 sm:text-xs ml-2">Cancel</button>
                </div>
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

                allarea : '',
                allpackage : '',
                allrooms : '',

                update_btn_name : '',
                
                title : '',
                action : '',
                add_data : {
                    rate_type : 2,
                    area_id : 0,
                    package_id : 0,
                    area_seat_num : null,
                },
                data : {
                    id : 0,
                    user_id : 0,
                    package_id : 0,
                    datetime_added : '',
                    status : null,
                    remarks : 'No remarks',
                    area_seat_num : '',

                  
                },

                info_data : {
                    package_id : 0,
                    package_name : '',
                    rate : 0,
                    consumed_time : '',
                    consumed_rate : 0,
                    payment_type : 1,
                    input_payment : 0,
                    area_seat_num : '',
                },
                btn_name : '',
                errors : {
                    name : '',
                    title: '',
                    link : '',
                    profile_pic : '',
                    description : '',
                },
                ifExist : false,
                hasData : false,
                
            }
        },
        methods: {
            changeMoneyFormat(val){
                return "₱" + val.toFixed(2);
            },
            getAreas(){
                axios.get(process.env.VUE_APP_BASE_URL + '/areas/all')
                .then((res)=>{
                
                    if(res.status == 200){

                        this.allarea = res.data;
                        this.add_data.area_id = res.data[0].id;

                        this.selectPackage();
                
                    }
                    
                });
            },
            getSeats(){
                const today = new Date();
                const date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
                const timestamp = date;
                axios.get(process.env.VUE_APP_BASE_URL + '/area_rooms/find_seats/' + this.add_data.area_id + '/' + timestamp)
                .then((res)=>{
                
                    if(res.status == 200){
                
                        if(res.data){

                            var temp = [];

                            for(var i = 0; i < res.data.length; i++){
                                if(res.data[i].is_reserved == null) temp.push(res.data[i]);
                            }
                            this.allrooms = temp;
                            this.add_data.area_seat_num = this.allrooms[0].id;
                        }
                        else{
                            this.allrooms = '';
                        }

                    }
                    
                });
            },
            selectPackage(){
                axios.get(process.env.VUE_APP_BASE_URL + '/rates/find_by_package/' + this.add_data.rate_type + '/' + this.add_data.area_id)
                    .then((res)=>{
                    
                        if(res.status == 200){

                            if(res.data){
                                
                                this.allpackage = res.data;
                                this.add_data.package_id = res.data[0].id;
                                this.getSeats();
                            }
                            else{
                                this.allpackage = '';
                            }
                            
                            
                    
                        }
                        
                    });
            },
            searchUser(){

                if(this.add_data.user_id){
                    axios.get(process.env.VUE_APP_BASE_URL + '/user/find_by_number/' + this.add_data.user_id)
                    .then((res)=>{
                    
                        if(res.status == 200){

                            if(res.data){
                                this.ifExist = true;
                                this.data.fullname = res.data.lname + ', ' + res.data.fname;
                                this.data.user_id = res.data.id;

                                this.checkPackage(res.data.id)
                            }
                            else{
                                this.ifExist = false;
                                this.showNotification(0,'Error','Inputted # does not exist');
                            }
                    
                            
                            
                    
                        }
                        
                    });
                }
                else{
                    this.ifExist = false;
                }
                
            },
            checkPackage(user_id){

                axios.get(process.env.VUE_APP_BASE_URL + '/user_packages/check_package/' + user_id)
                .then((res)=>{
                
                    if(res.status == 200){
                        
                        if(res.data){
                            
                            this.hasData = true;

                            this.info_data.package_id = res.data.id;
                            this.info_data.package_name = res.data.rate_id.description;
                            this.info_data.rate = res.data.rate_id.rate;

                            var now = moment(new Date()); //todays date
                            var end = moment(res.data.datetime_added); // another date

                            var duration = moment.duration(now.diff(end));
                            var difference = duration.asMinutes();

                            var rate_duration = res.data.rate_id.duration + 10;

                            var cnt = 1;
                            var cnt_check = Math.floor(parseInt(parseFloat(difference / rate_duration).toFixed(2)));
                            

                            if(cnt_check <= 0){
                                this.info_data.consumed_rate = parseFloat(cnt * res.data.rate_id.rate);
                            }
                            else{
                                // var total_pr_pe = ((cnt * res.data.rate_id.rate) + (cnt_check * res.data.rate_id.exceed) );
                                this.info_data.consumed_rate = (cnt * res.data.rate_id.rate) + (cnt_check * res.data.rate_id.exceed);

                            }
                            
                            

                            var hours = Math.floor(difference / 60);          
                            var minutes = difference % 60;

                            this.info_data.consumed_time = parseInt(hours) + "hrs " + parseInt(minutes) + "mins";
                            // this.data.fullname = res.data.lname + ', ' + res.data.fname;

                            axios.get(process.env.VUE_APP_BASE_URL + '/user_sessions/get_max/' + this.data.user_id)
                            .then((res)=>{

                                if(res.status == 200){

                                    this.info_data.area_seat_num = res.data.area_seat_num;

                                    if(res.data.status == 1) {
                                        this.update_btn_name = "logout";
                                    }
                                    else{
                                        this.update_btn_name = "login";
                                    }
                                    
                                    
                                }
                                
                            });

                        }
                        else{
                            this.hasData = false;
                            this.getAreas();
                        }
                
                
                    }
                    
                });

            },
            disableText(){
                if(this.data.isTitle == 1){
                    this.data.link = '/';
                }
                else{
                    this.data.link = '/';
                }
            },
            viewFile(){
                window.open(process.env.VUE_APP_BASE_URL + "/user_menu/get_file/" + this.data.profile_pic + '/png');
            },
            onFileChange(e){

                var fileData =  e.target.files[0];

                if(fileData != '' || fileData != null){

                    var fileName = "";
                    var fileExt = "";

                    var fileArray = fileData.name.split(".");

                    for(var i = 0; i < fileArray.length; i++){
                
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

                    if(fileExt != "png"){
                        this.showNotification(0,'Invalid file extension','Please upload only PNG files.');
                    }
                    else{
                        this.data.profile_pic = fileName + "."+ fileExt;
                    }

                }
                

                

            },
            findData(){
                axios.get(process.env.VUE_APP_BASE_URL + '/user_menu/find/' + this.data.id)
                .then((res)=>{
                
                    if(res.status == 200){
                
                        this.data.name = res.data.name;
                        this.data.title = res.data.title;
                        this.data.link = res.data.link;
                        this.data.profile_pic = res.data.profile_pic;
                        this.data.isTitle = res.data.isTitle;
                        this.data.description = res.data.description;
                        
                
                    }
                    
                });
            },
            confirmAction(action){

                const today = new Date();
                const date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
                const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                const timestamp = date + ' ' + time;


                    if(!this.hasData){

                        var data_package = {
                            user_id : this.data.user_id,
                            rate_id: this.add_data.package_id,
                            employee_id : this.$store.state.user.id,
                            datetime_added : timestamp,
                            isDone : 0,
                            payment : 0,
                            payment_type : 1,
                        }

                        axios.post(process.env.VUE_APP_BASE_URL + '/user_packages/add', data_package)
                        .then((res)=>{

                            if(res.status == 201){

                                axios.get(process.env.VUE_APP_BASE_URL + '/user_packages/get_max')
                                .then((res)=>{

                                    if(res.status == 200){

                                        var maxid = res.data.id;

                                        var data_session = {
                                        user_id : this.data.user_id,
                                        package_id: maxid,
                                        datetime_added : timestamp,
                                        status : 1,
                                        remarks : this.data.remarks,
                                        area_seat_num : this.add_data.area_seat_num
                                        };

                                        axios.post(process.env.VUE_APP_BASE_URL + '/user_sessions/add', data_session)
                                        .then((res)=>{

                                            if(res.status == 201){

                                                this.showNotification(1,"Success!","User has been logged in");
                                                this.refreshData();
                                                this.closeModal();
                                              
                                                
                                            }
                                            
                                        });
                                        
                                        
                                    }
                                    
                                });
                                
                                
                            }
                            
                        });
                    }
                    else{


                                   

                        if(action == 'logout'){


                            axios.get(process.env.VUE_APP_BASE_URL + '/user_packages/get_max')
                            .then((res)=>{

                                if(res.status == 200){
                                    
                                    var data_session = {
                                    user_id : this.data.user_id,
                                    package_id: this.info_data.package_id,
                                    datetime_added : timestamp,
                                    status : 0,
                                    remarks : this.data.remarks,
                                    area_seat_num : this.add_data.area_seat_num
                                    };

                                    axios.post(process.env.VUE_APP_BASE_URL + '/user_sessions/add', data_session)
                                    .then((res)=>{

                                        if(res.status == 201){

                                            this.showNotification(1,"Success!","User has been logged out");
                                            this.refreshData();
                                            this.closeModal();
                                            
                                            
                                        }
                                        
                                    });
                                    
                                    
                                }
                                
                            });


                        }
                        else if(action == 'login'){


                        axios.get(process.env.VUE_APP_BASE_URL + '/user_packages/get_max')
                        .then((res)=>{

                            if(res.status == 200){
                                
                                var data_session = {
                                user_id : this.data.user_id,
                                package_id: this.info_data.package_id,
                                datetime_added : timestamp,
                                status : 1,
                                remarks : this.data.remarks,
                                area_seat_num : this.add_data.area_seat_num
                                };

                                axios.post(process.env.VUE_APP_BASE_URL + '/user_sessions/add', data_session)
                                .then((res)=>{

                                    if(res.status == 201){

                                        this.showNotification(1,"Success!","User has been logged in");
                                        this.refreshData();
                                        this.closeModal();
                                        
                                        
                                    }
                                    
                                });
                                
                                
                            }
                            
                        });


                        }
                        else if(action == 'signout'){
                            
                            var valid = true;

                            if(valid){
                                axios.get(process.env.VUE_APP_BASE_URL + '/user_packages/get_max')
                                .then((res)=>{

                                    if(res.status == 200){
                                        
                                        var data_session = {
                                        user_id : this.data.user_id,
                                        package_id: this.info_data.package_id,
                                        datetime_added : timestamp,
                                        status : 0,
                                        remarks : this.data.remarks,
                                        area_seat_num : this.add_data.area_seat_num
                                        };

                                        axios.post(process.env.VUE_APP_BASE_URL + '/user_sessions/add', data_session)
                                        .then((res)=>{

                                            if(res.status == 201){

                                                var data = {
                                                    id : this.info_data.package_id,
                                                    isDone: 1,
                                                    payment: 0,
                                                    payment_type : this.info_data.payment_type
                                                }

                                                axios.post(process.env.VUE_APP_BASE_URL + '/user_packages/update', data)
                                                .then((res)=>{

                                                    if(res.status == 201){

                                                        this.showNotification(1,"Success!","User has been signed out in");
                                                        this.refreshData();
                                                        this.closeModal();
                                                        
                                                        
                                                    }
                                                    
                                                });
                                                        
                                                
                                            }
                                            
                                        });
                                        
                                        
                                    }
                                    
                                });
                            }

                        

                        //
                        }


                  
                                
                                
                            
                            
                    }

         

                
                
            },
            closeModal(){
                this.$emit('close-modal');
            },
        },
        watch: {
            item_data: {
            handler(val){
                this.data.id = val.id;

                this.action = val.action;

                if(this.action == "add"){
                    this.title = "Add Menu";
                    this.btn_name = "Add";
                }
                else if(this.action == "edit"){
                    this.title = "Edit Menu";
                    this.btn_name = "Edit";
                    this.findData();
                }

                setTimeout(() => {
                    this.$refs.user_id.focus()
                }, 250);
                
                
            },
            immediate:true
          }
        }
    }
        
    </script>