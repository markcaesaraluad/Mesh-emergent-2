import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './index.css';
import JsonExcel from "vue-json-excel3";

// createApp(App).use(store).use(router).mount('#app')

const app = createApp(App);

app
.component("downloadExcel", JsonExcel)
.use(store)
.use(router)
.mount('#app')
