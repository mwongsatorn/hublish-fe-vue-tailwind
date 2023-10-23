import { defineStore } from 'pinia'
import axios from 'axios'
import { z } from 'zod'
import { CurrentUserSchema, LogInResponseSchema } from '@/schemas/user'

interface UserState {
  user: {
    id: string
    email: string
    username: string
    name: string
    bio: string
    accessToken: string
  }
  isLoggedIn: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    isLoggedIn: false,
    user: {
      id: '',
      email: '',
      username: '',
      name: '',
      bio: '',
      accessToken: ''
    }
  }),
  actions: {
    async login(details: { username: string; password: string }) {
      const response = await axios.post('/api/auth/login', details)

      if (response.status === 401) throw 'Username or password is incorrect'

      const validateRes = LogInResponseSchema.safeParse(response.data)

      if (!validateRes.success) throw 'Something went wrong. Please try again later.'

      this.user = validateRes.data.user
      this.isLoggedIn = true
    },

    async getUserProfile() {
      const response = await axios.get('/api/users/current')
      if (response.status === 401) {
        await this.refreshAccessToken()
      }
      const validateRes = CurrentUserSchema.safeParse(response.data)
      if (!validateRes.success) throw 'Something went wrong'
      const { data } = validateRes
      this.user.id = data.user.id
      this.user.email = data.user.email
      this.user.bio = data.user.bio
      this.user.username = data.user.username
      this.user.name = data.user.name
    },

    async refreshAccessToken() {
      const response = await axios.get('/api/auth/refresh')
      if (response.status !== 200) return
      const result = z.object({ accessToken: z.string() }).safeParse(response.data)
      if (!result.success) throw 'Something went wrong'
      this.user.accessToken = result.data.accessToken
      await this.getUserProfile()
      this.isLoggedIn = true
    },

    async logOut() {
      const response = await axios.delete('/api/auth/logout')
      if (response.status !== 200) throw 'Something went wrong'
      this.isLoggedIn = false
      this.user = {
        id: '',
        email: '',
        username: '',
        accessToken: '',
        bio: '',
        name: ''
      }
    }
  }
})
