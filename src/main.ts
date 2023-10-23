import './assets/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
axios.defaults.validateStatus = null
axios.defaults.withCredentials = true

import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/user.store'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const userStore = useUserStore()
axios.interceptors.request.use((config) => {
  if (userStore.user.accessToken) {
    config.headers.Authorization = `Bearer ${userStore.user.accessToken}`
  }
  return config
})

app.mount('#app')
