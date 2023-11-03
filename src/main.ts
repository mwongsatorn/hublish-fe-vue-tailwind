import './assets/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios, { AxiosError } from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
axios.defaults.withCredentials = true

import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/user.store'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const userStore = useUserStore()

axios.interceptors.request.use((config) => {
  if (userStore.accessToken) {
    config.headers.Authorization = `Bearer ${userStore.accessToken}`
  }
  return config
})

axios.interceptors.response.use(
  (response) => response,
  async (err) => {
    if (err instanceof AxiosError) {
      if (err.response?.status === 401 && err.response?.data.error === 'Token expired') {
        await userStore.refreshAccessToken()
        return axios(err.response.config)
      }
      return Promise.reject(err)
    } else return Promise.reject(err)
  }
)

app.mount('#app')
