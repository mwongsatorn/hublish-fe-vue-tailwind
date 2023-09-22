import { defineStore } from 'pinia'
import axios from 'axios'
import { LogInResponseSchema } from '@/schemas/user'

interface UserState {
  accessToken: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    accessToken: null
  }),
  actions: {
    async login(details: { username: string; password: string }) {
      const response = await axios.post('/api/users/login', details)
      const result = LogInResponseSchema.safeParse(response.data)
      if (!result.success) {
        return { status: false, error: 'Something went wrong please try again later' }
      }
      const { data } = result
      if (data.status) this.accessToken = data.accessToken
      return data
    }
  }
})
