<script setup lang="ts">
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const repeatedPassword = ref('')
const email = ref('')

function signupSubmit() {
  alert(username.value + ' has signed up')
  username.value = ''
  password.value = ''
  repeatedPassword.value = ''
  email.value = ''
}
</script>

<template>
  <main>
    <section
      class="max-w-7xl mx-auto w-full px-4 h-[calc(100vh-56px)] flex items-center justify-center"
    >
      <div class="max-w-md w-full py-12 px-6 shadow-lg border">
        <h1 class="font-bold text-xl">Sign up</h1>
        <form class="" @submit.prevent="signupSubmit()">
          <div class="mt-4">
            <label for="email">Email</label>
            <input
              v-model="email"
              id="email"
              class="block w-full mt-2 border-2 px-4 py-1.5"
              placeholder="Email"
              type="email"
            />
          </div>
          <div class="mt-4">
            <label for="username">Username</label>
            <input
              v-model="username"
              id="username"
              class="block w-full mt-2 border-2 px-4 py-1.5"
              placeholder="Username"
              type="text"
            />
          </div>
          <div class="mt-4">
            <label for="password">Password</label>
            <input
              v-model="password"
              id="password"
              class="block w-full mt-2 border-2 px-4 py-2"
              placeholder="Password"
              type="password"
            />
          </div>
          <div class="mt-4">
            <label for="password">Repeat password</label>
            <input
              v-model="repeatedPassword"
              id="repeat-password"
              class="block w-full mt-2 border-2 px-4 py-2"
              placeholder="Repeat your password"
              type="password"
            />
          </div>
          <button class="ml-auto rounded-lg mt-8 block bg-green-500 px-4 py-2 text-white">
            Sign up
          </button>
        </form>
      </div>
    </section>
  </main>
</template>
