<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import axios from 'axios'
import { type ZodFormattedError } from 'zod'
import { SignUpSchema, type SignUp } from '@/schemas/user'

const router = useRouter()

const signupForm = ref<SignUp>({
  username: '',
  password: '',
  confirmPassword: '',
  email: ''
})

const formError = ref<ZodFormattedError<SignUp> | null>(null)
const signupError = ref('')

async function signupSubmit() {
  const validateForm = SignUpSchema.safeParse(signupForm.value)

  if (!validateForm.success) {
    formError.value = validateForm.error.format()
    return
  }
  const response = await axios.post('http://localhost:8080/api/auth/signup', validateForm.data)

  if (response.status !== 201) {
    signupError.value = response.data.error
    return
  }

  alert('Sign up successfully')
  router.push('/login')
}

watch(signupForm.value, () => {
  formError.value = null
})

useHead({
  title: 'Signup'
})
</script>

<template>
  <div
    class="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-7xl items-center justify-center py-12"
  >
    <div class="w-full max-w-md space-y-4 border bg-white px-4 py-12 shadow-lg">
      <h1 class="text-center text-3xl font-bold">Sign up</h1>
      <p class="text-red" v-if="signupError">
        {{ signupError }}
      </p>
      <form class="space-y-4" @submit.prevent="signupSubmit()">
        <div class="space-y-2">
          <label for="email">Email</label>
          <input
            v-model="signupForm.email"
            id="email"
            class="block w-full border-2 px-4 py-1.5"
            :class="formError?.email ? 'border-red-700' : ''"
            placeholder="Email"
            type="email"
          />
          <p class="text-red-700" v-if="formError?.email">** {{ formError.email._errors[0] }} **</p>
        </div>
        <div class="space-y-2">
          <label for="username">Username</label>
          <input
            v-model="signupForm.username"
            id="username"
            class="block w-full border-2 px-4 py-1.5"
            :class="formError?.username ? 'border-red-700' : ''"
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
            v-model="signupForm.password"
            id="password"
            class="block w-full border-2 px-4 py-2"
            :class="formError?.password ? 'border-red-700' : ''"
            placeholder="Password"
            type="password"
          />
          <p class="text-red-700" v-if="formError?.password">
            ** {{ formError.password._errors[0] }} **
          </p>
        </div>
        <div class="space-y-2">
          <label for="password">Confirm password</label>
          <input
            v-model="signupForm.confirmPassword"
            id="confirm-password"
            class="block w-full border-2 px-4 py-2"
            :class="formError?.confirmPassword ? 'border-red-700' : ''"
            placeholder="Confirm your password"
            type="password"
          />
          <p class="text-red-700" v-if="formError?.confirmPassword">
            ** {{ formError.confirmPassword._errors[0] }} **
          </p>
        </div>
        <button class="ml-auto mt-8 block rounded-lg bg-green-500 px-4 py-2 text-white">
          Sign up
        </button>
      </form>
    </div>
  </div>
</template>
