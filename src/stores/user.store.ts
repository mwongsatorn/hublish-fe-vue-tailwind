import { defineStore } from 'pinia'
import axios from 'axios'
import { type User } from '@/types/index'

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
      const { accessToken, ...user } = response.data
      this.user = user
      this.accessToken = accessToken!
      this.isLoggedIn = true
    },

    async getUserProfile() {
      const response = await axios.get<User>('/api/users/current')
      this.user = response.data
    },

    async refreshAccessToken() {
      const response = await axios.get<{ accessToken: string }>('/api/auth/refresh')
      this.accessToken = response.data.accessToken
      if (!this.user) await this.getUserProfile()
      this.isLoggedIn = true
    },

    async logOut() {
      const response = await axios.delete('/api/auth/logout')
      if (response.status !== 204) throw 'Something went wrong'
      this.isLoggedIn = false
      this.user = null
      this.accessToken = null
    }
  }
})
