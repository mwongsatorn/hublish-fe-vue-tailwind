import { defineStore } from 'pinia'
import axios from 'axios'
import { z } from 'zod'
import { UserSchema, type User } from '@/schemas/user'

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
      const response = await axios.post('/api/auth/login', details)

      if (response.status === 401) throw 'Username or password is incorrect'

      const validateRes = UserSchema.safeParse(response.data)

      if (!validateRes.success) throw 'Something went wrong. Please try again later.'
      const { data } = validateRes
      this.user = data
    },

    async getUserProfile() {
      const response = await axios.get('/api/users/current')
      if (response.status === 401) {
        await this.refreshAccessToken()
      }
      const validateRes = UserSchema.safeParse(response.data)
      if (!validateRes.success) throw 'Something went wrong'
      const { data } = validateRes
      this.user = data
    },

    async refreshAccessToken() {
      const response = await axios.get('/api/auth/refresh')
      if (response.status !== 200) return
      const result = z.object({ accessToken: z.string() }).safeParse(response.data)
      if (!result.success) throw 'Something went wrong'
      this.accessToken = result.data.accessToken
      await this.getUserProfile()
      this.isLoggedIn = true
    },

    async logOut() {
      const response = await axios.delete('/api/auth/logout')
      if (response.status !== 200) throw 'Something went wrong'
      this.isLoggedIn = false
      this.user = null
    }
  }
})
