import { defineStore } from 'pinia'
import axios from 'axios'
import { z } from 'zod'
import { LogInResponseSchema, ProfileSchema } from '@/schemas/user'

interface UserState {
  user: {
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
      email: '',
      username: '',
      name: '',
      bio: '',
      accessToken: ''
    }
  }),
  actions: {
    async login(details: { username: string; password: string }) {
      const response = await axios.post('/api/users/login', details)
      const result = LogInResponseSchema.safeParse(response.data)

      if (!result.success) {
        return { status: false, error: 'Something went wrong please try again later' }
      }
      const { data } = result
      if (data.status) {
        this.user = data.user
        this.isLoggedIn = true
      }
      return data
    },
    async getUserProfile() {
      const response = await axios.get('/api/users/profile', {
        headers: {
          Authorization: `Bearer ${this.user.accessToken}`
        }
      })
      if (response.status === 403) {
        await this.refreshAccessToken()
      }
      const result = ProfileSchema.safeParse(response.data)
      if (!result.success) return 'Something went wrong'
      const { data } = result
      this.user.email = data.profile.email
      this.user.bio = data.profile.bio
      this.user.username = data.profile.username
      this.user.name = data.profile.name
    },
    async refreshAccessToken() {
      const response = await axios.get('/api/users/refresh')
      if (response.status !== 200) return
      const result = z.object({ accessToken: z.string() }).safeParse(response.data)
      if (!result.success) return 'Something went wrong'
      this.user.accessToken = result.data.accessToken
      await this.getUserProfile()
      this.isLoggedIn = true
    }
  }
})
