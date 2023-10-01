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
  } catch (e) {
    loginError.value = e as string
  }
}

watch(loginForm.value, () => {
  formError.value = null
})
</script>

<template>
  <main>
    <section
      class="max-w-7xl mx-auto w-full px-4 py-12 min-h-[calc(100vh-56px)] flex items-center justify-center"
    >
      <div class="max-w-md w-full py-12 px-6 shadow-lg border">
        <h1 class="font-bold text-2xl text-center">Log in</h1>
        <p class="mt-4 text-red-700 text-center" v-if="loginError">
          {{ loginError }}
        </p>
        <form class="" @submit.prevent="loginSubmit()">
          <div class="mt-4">
            <label for="username">Username</label>
            <input
              v-model="loginForm.username"
              id="username"
              class="block w-full mt-2 border-2 px-4 py-1.5"
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
              v-model="loginForm.password"
              id="password"
              class="block w-full mt-2 border-2 px-4 py-2"
              placeholder="Password"
              type="password"
            />
            <p class="text-red-700" v-if="formError?.password">
              ** {{ formError.password._errors[0] }} **
            </p>
          </div>
          <button class="ml-auto rounded-lg mt-8 block bg-green-500 px-4 py-2 text-white">
            Log in
          </button>
        </form>
      </div>
    </section>
  </main>
</template>
