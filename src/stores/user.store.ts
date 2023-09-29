import { defineStore } from 'pinia'
import axios from 'axios'
import { LogInResponseSchema } from '@/schemas/user'

interface UserState {
  user: {
    email: string
    username: string
    name: string
    bio: string
    accessToken: string
  } | null
  isLoggedIn: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    isLoggedIn: false,
    user: null
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
    }
  }
})
