<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores/user.store'
import { z, type ZodFormattedError } from 'zod'
import {
  ChangeEmailSchema,
  ChangePasswordSchema,
  ChangeProfileSchema,
  type ChangeEmail,
  type ChangePassword,
  type ChangeProfile
} from '@/schemas/user'

const userStore = useUserStore()

const emailFormError = ref<ZodFormattedError<ChangeEmail> | null>(null)
const passwordFormError = ref<ZodFormattedError<ChangePassword> | null>(null)
const profileFormError = ref<ZodFormattedError<ChangeProfile> | null>(null)
const changeProfileError = ref('')
const changeEmailError = ref('')
const changePasswordError = ref('')

const emailForm = ref({
  password: '',
  newEmail: ''
})
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const profileForm = ref({
  name: userStore.user.name,
  bio: userStore.user.bio
})

const changeEmail = ref(false)
const changePassword = ref(false)

watch(changePassword, () => {
  if (changePassword.value === false) {
    passwordForm.value.currentPassword = ''
    passwordForm.value.newPassword = ''
    passwordForm.value.confirmPassword = ''
  }
})

watch(changeEmail, () => {
  if (changeEmail.value === false) {
    emailForm.value.newEmail = ''
    emailForm.value.password = ''
  }
})
</script>

<template>
  <main>
    <section class="max-w-7xl mx-auto px-4 py-12 min-h-[calc(100vh-56px)]">
      <h1 class="font-bold text-2xl text-center">Settings</h1>
      <div>
        <p class="mt-4 text-red-700 text-center" v-if="changeEmailError">
          {{ changeEmailError }}
        </p>
        <p class="mt-4 text-red-700 text-center" v-if="changePasswordError">
          {{ changePasswordError }}
        </p>
        <p class="mt-4 text-red-700 text-center" v-if="changeProfileError">
          {{ changeProfileError }}
        </p>
        <div v-if="!changeEmail" class="mt-4">
          <label for="email">Email</label>
          <div class="flex mt-2">
            <input
              v-model="userStore.user.email"
              id="email"
              class="block w-full border-2 border-r-0 px-4 py-1.5"
              placeholder=""
              disabled
            />
            <button @click="changeEmail = true" class="px-4 py-1.5 border-2">Edit</button>
          </div>
        </div>
        <form v-else>
          <div class="mt-4">
            <label for="new-email">New Email</label>
            <input
              v-model="emailForm.newEmail"
              id="new-email"
              class="block w-full mt-2 border-2 px-4 py-1.5"
              placeholder="Enter your new email"
              type="text"
            />
            <p class="text-red-700" v-if="emailFormError?.password">
              ** {{ emailFormError.password._errors[0] }} **
            </p>
          </div>
          <div class="mt-4">
            <label for="password">Password</label>
            <input
              v-model="emailForm.password"
              id="password"
              class="block w-full mt-2 border-2 px-4 py-1.5"
              placeholder="Enter your password"
              type="text"
            />
            <p class="text-red-700" v-if="emailFormError?.newEmail">
              ** {{ emailFormError.newEmail._errors[0] }} **
            </p>
          </div>
          <div class="flex items-center justify-end gap-x-4">
            <button type="submit" class="rounded-lg mt-8 block bg-green-500 px-4 py-2 text-white">
              Submit
            </button>
            <button
              @click="changeEmail = false"
              type="reset"
              class="rounded-lg mt-8 block bg-rose-500 px-4 py-2 text-white"
            >
              Cancel
            </button>
          </div>
        </form>
        <div v-if="!changePassword" class="mt-4">
          <label for="name">Password</label>
          <div class="flex mt-2">
            <input
              v-model="passwordForm.currentPassword"
              id="current-password"
              class="block w-full border-2 border-r-0 px-4 py-1.5"
              placeholder=""
              type="password"
              disabled
            />
            <button @click="changePassword = true" class="px-4 py-1.5 border-2">Edit</button>
            <p class="text-red-700" v-if="passwordFormError?.currentPassword">
              ** {{ passwordFormError.currentPassword._errors[0] }} **
            </p>
          </div>
        </div>
        <form v-else>
          <div class="mt-4">
            <label for="current-password">Current password</label>
            <input
              v-model="passwordForm.currentPassword"
              id="current=password"
              class="block w-full mt-2 border-2 px-4 py-1.5"
              type="password"
              placeholder="Enter your current password"
            />
          </div>
          <div class="mt-4">
            <label for="new-password">New password</label>
            <input
              v-model="passwordForm.newPassword"
              class="block w-full mt-2 border-2 px-4 py-1.5"
              type="password"
              placeholder="Enter your new password"
            />
          </div>
          <div class="mt-4">
            <label for="confirm-password">Confirm password</label>
            <input
              v-model="passwordForm.confirmPassword"
              class="block w-full mt-2 border-2 px-4 py-1.5"
              type="password"
              placeholder="Confirm your new password"
            />
          </div>
          <div class="flex items-center justify-end gap-x-4">
            <button type="submit" class="rounded-lg mt-8 block bg-green-500 px-4 py-2 text-white">
              Submit
            </button>
            <button
              @click="changePassword = false"
              type="reset"
              class="rounded-lg mt-8 block bg-rose-500 px-4 py-2 text-white"
            >
              Cancel
            </button>
          </div>
        </form>
        <form id="main-form">
          <div class="mt-4">
            <label for="name">Name</label>
            <input
              v-model="profileForm.name"
              id="name"
              class="block w-full mt-2 border-2 px-4 py-1.5"
              placeholder="Name"
              type="text"
            />
            <p class="text-red-700" v-if="profileFormError?.name">
              ** {{ profileFormError.name._errors[0] }} **
            </p>
          </div>
          <div class="mt-4">
            <label for="bio">Bio</label>
            <textarea
              v-model="profileForm.bio"
              id="bio"
              class="block w-full h-24 mt-2 border-2 px-4 py-2 resize-none"
              placeholder="Tell me more about yourself"
            />
            <p class="text-red-700" v-if="profileFormError?.bio">
              ** {{ profileFormError.bio._errors[0] }} **
            </p>
          </div>
          <button class="ml-auto rounded-lg mt-8 block bg-green-500 px-4 py-2 text-white">
            Submit
          </button>
        </form>
      </div>
    </section>
  </main>
</template>
