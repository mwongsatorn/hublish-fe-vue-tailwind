<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.store'
import { type ZodFormattedError } from 'zod'
import { LogInSchema, type LogIn } from '@/schemas/user'

const router = useRouter()

const loginForm = ref<LogIn>({
  username: '',
  password: ''
})

const formError = ref<ZodFormattedError<LogIn> | null>(null)
const loginError = ref('')

async function loginSubmit() {
  try {
    const validate = LogInSchema.safeParse(loginForm.value)
    if (!validate.success) {
      formError.value = validate.error.format()
      return
    }
    const user = useUserStore()
    await user.login(validate.data)

    router.push('/')
  } catch (e: any) {
    loginError.value = e.response.data.error
  }
}

watch(loginForm.value, () => {
  if (!formError.value || !loginError.value) {
    formError.value = null
    loginError.value = ''
  }
})
</script>

<template>
  <div
    class="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-7xl items-center justify-center py-12"
  >
    <div class="w-full max-w-md space-y-4 border bg-white px-4 py-12 shadow-lg">
      <h1 class="text-center text-3xl font-bold">Log in</h1>
      <p class="text-center text-red-700" v-if="loginError">** {{ loginError }} **</p>
      <form class="space-y-4" @submit.prevent="loginSubmit()">
        <div class="space-y-2">
          <label for="username">Username</label>
          <input
            v-model="loginForm.username"
            id="username"
            class="block w-full border-2 px-4 py-1.5"
            placeholder="Username"
            type="text"
          />
          <p class="text-red-700" v-if="formError?.username">
            ** {{ formError.username._errors[0] }} **
          </p>
        </div>
        <div class="space-y-2">
          <label for="password">Password</label>
          <input
            v-model="loginForm.password"
            id="password"
            class="block w-full border-2 px-4 py-2"
            placeholder="Password"
            type="password"
          />
          <p class="text-red-700" v-if="formError?.password">
            ** {{ formError.password._errors[0] }} **
          </p>
        </div>
        <button class="ml-auto mt-8 block rounded-lg bg-green-500 px-4 py-2 text-white">
          Log in
        </button>
      </form>
    </div>
  </div>
</template>
