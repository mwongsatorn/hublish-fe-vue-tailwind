<script setup lang="ts">
import { ref } from 'vue'
const username = ref('')
const password = ref('')

function loginSubmit() {
  alert(username.value + ' has logged in')
  username.value = ''
  password.value = ''
}
</script>

<template>
  <main>
    <section
      class="max-w-7xl mx-auto w-full px-4 h-[calc(100vh-56px)] flex items-center justify-center"
    >
      <div class="max-w-md w-full py-12 px-6 shadow-lg border">
        <h1 class="font-bold text-xl">Log in</h1>
        <form class="" @submit.prevent="loginSubmit()">
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
          <button class="ml-auto rounded-lg mt-8 block bg-green-500 px-4 py-2 text-white">
            Log in
          </button>
        </form>
      </div>
    </section>
  </main>
</template>
