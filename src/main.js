import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/main.css'
import './services/auth' // Import auth service for interceptors

createApp(App).use(router).mount('#app')