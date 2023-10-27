import { defineStore } from 'pinia'
import axios from 'axios'
import { type User } from '@/schemas/user'

interface UserState {
  user: User | null
  accessToken: string | null
  isLoggedIn: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    isLoggedIn: false,
    user: null,
    accessToken: null
  }),
  actions: {
    async login(details: { username: string; password: string }) {
      const response = await axios.post<User>('/api/auth/login', details)

      if (response.status === 401) throw 'Username or password is incorrect'
      this.user = response.data
    },

    async getUserProfile() {
      const response = await axios.get<User>('/api/users/current')
      if (response.status === 401) {
        await this.refreshAccessToken()
      }
      this.user = response.data
    },

    async refreshAccessToken() {
      const response = await axios.get<{ accessToken: string }>('/api/auth/refresh')
      if (response.status !== 200) return
      this.accessToken = response.data.accessToken
      await this.getUserProfile()
      this.isLoggedIn = true
    },

    async logOut() {
      const response = await axios.delete('/api/auth/logout')
      if (response.status !== 204) throw 'Something went wrong'
      this.isLoggedIn = false
      this.user = null
    }
  }
})
