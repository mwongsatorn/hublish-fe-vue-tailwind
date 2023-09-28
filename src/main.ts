import './assets/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
axios.defaults.validateStatus = null
axios.defaults.withCredentials = true

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
