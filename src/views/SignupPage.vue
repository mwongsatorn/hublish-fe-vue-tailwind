<script setup lang="ts">
import { ref, watch } from 'vue'
import { type ZodFormattedError } from 'zod'
import { SignUpSchema, type SignUp } from '@/schemas/user'

const signUpForm = ref<SignUp>({
  username: '',
  password: '',
  confirmPassword: '',
  email: ''
})

const formError = ref<ZodFormattedError<SignUp> | null>(null)

function signupSubmit() {
  const result = SignUpSchema.safeParse(signUpForm.value)
  if (!result.success) {
    formError.value = result.error.format()
    return
  }
}

watch(signUpForm.value, () => {
  formError.value = null
})
</script>

<template>
  <main>
    <section
      class="max-w-7xl mx-auto w-full px-4 py-12 min-h-[calc(100vh-56px)] flex items-center justify-center"
    >
      <div class="max-w-md w-full py-12 px-6 shadow-lg border">
        <h1 class="font-bold text-2xl text-center">Sign up</h1>
        <form class="" @submit.prevent="signupSubmit()">
          <div class="mt-4">
            <label for="email">Email</label>
            <input
              v-model="signUpForm.email"
              id="email"
              class="block w-full mt-2 border-2 px-4 py-1.5"
              :class="formError?.email ? 'border-red-700' : ''"
              placeholder="Email"
              type="email"
            />
            <p class="text-red-700" v-if="formError?.email">
              ** {{ formError.email._errors[0] }} **
            </p>
          </div>
          <div class="mt-4">
            <label for="username">Username</label>
            <input
              v-model="signUpForm.username"
              id="username"
              class="block w-full mt-2 border-2 px-4 py-1.5"
              :class="formError?.username ? 'border-red-700' : ''"
              placeholder="Username"
              type="text"
            />
            <p class="text-red-700" v-if="formError?.username">
              ** {{ formError.username._errors[0] }} **
            </p>
          </div>
          <div class="mt-4">
            <label for="password">Password</label>
            <input
              v-model="signUpForm.password"
              id="password"
              class="block w-full mt-2 border-2 px-4 py-2"
              :class="formError?.password ? 'border-red-700' : ''"
              placeholder="Password"
              type="password"
            />
            <p class="text-red-700" v-if="formError?.password">
              ** {{ formError.password._errors[0] }} **
            </p>
          </div>
          <div class="mt-4">
            <label for="password">Confirm password</label>
            <input
              v-model="signUpForm.confirmPassword"
              id="confirm-password"
              class="block w-full mt-2 border-2 px-4 py-2"
              :class="formError?.confirmPassword ? 'border-red-700' : ''"
              placeholder="Confirm your password"
              type="password"
            />
            <p class="text-red-700" v-if="formError?.confirmPassword">
              ** {{ formError.confirmPassword._errors[0] }} **
            </p>
          </div>
          <button class="ml-auto rounded-lg mt-8 block bg-green-500 px-4 py-2 text-white">
            Sign up
          </button>
        </form>
      </div>
    </section>
  </main>
</template>
