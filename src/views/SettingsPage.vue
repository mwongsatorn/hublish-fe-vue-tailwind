<script setup lang="ts">
import { ref, watch } from 'vue'
import { z, type ZodFormattedError } from 'zod'

type Settings = z.infer<typeof SettingsSchema>
const SettingsSchema = z
  .object({
    name: z.string().max(70, {
      message: 'Your name can not be more than 70 characters.'
    }),
    bio: z.string().max(160, {
      message: 'Your bio can not be more than 160 characters.'
    }),
    currentPassword: z.string(),
    newPassword: z.string(),
    confirmPassword: z.string(),
    newEmail: z.string().email({
      message: 'This is not a valid email.'
    }),
    password: z.string()
  })
  .refine((schema) => schema.newPassword === schema.confirmPassword, {
    message: 'Password do not match.',
    path: ['confirmPassword']
  })

const formError = ref<ZodFormattedError<Settings> | null>(null)
const settingsError = ref('')
const settingsForm = ref({
  name: '',
  email: 'YourEmail@sfsdf.com',
  newEmail: '',
  bio: '',
  password: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const changeEmail = ref(false)
const changePassword = ref(false)

watch(changePassword, () => {
  if (changePassword.value === false) {
    settingsForm.value.currentPassword = ''
    settingsForm.value.newPassword = ''
    settingsForm.value.confirmPassword = ''
  }
})

watch(changeEmail, () => {
  if (changeEmail.value === false) {
    settingsForm.value.newEmail = ''
    settingsForm.value.password = ''
  }
})
</script>

<template>
  <main>
    <section class="max-w-7xl mx-auto px-4 py-12 min-h-[calc(100vh-56px)]">
      <h1 class="font-bold text-2xl text-center">Settings</h1>
      <!-- <p class="mt-4 text-red-700 text-center" v-if="loginError">
            {{ loginError }}
          </p> -->
      <div>
        <div v-if="!changeEmail" class="mt-4">
          <label for="email">Email</label>
          <div class="flex mt-2">
            <input
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
              v-model="settingsForm.newEmail"
              id="new-email"
              class="block w-full mt-2 border-2 px-4 py-1.5"
              placeholder="Enter your new email"
              type="text"
            />
          </div>
          <div class="mt-4">
            <label for="password">Password</label>
            <input
              v-model="settingsForm.password"
              id="password"
              class="block w-full mt-2 border-2 px-4 py-1.5"
              placeholder="Enter your password"
              type="text"
            />
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
              v-model="settingsForm.password"
              id="current-password"
              class="block w-full border-2 border-r-0 px-4 py-1.5"
              placeholder=""
              type="password"
              disabled
            />
            <button @click="changePassword = true" class="px-4 py-1.5 border-2">Edit</button>
            <p class="text-red-700" v-if="formError?.currentPassword">
              ** {{ formError.currentPassword._errors[0] }} **
            </p>
          </div>
        </div>
        <form v-else>
          <div class="mt-4">
            <label for="current-password">Current password</label>
            <input
              v-model="settingsForm.currentPassword"
              id="current=password"
              class="block w-full mt-2 border-2 px-4 py-1.5"
              type="password"
              placeholder="Enter your current password"
            />
          </div>
          <div class="mt-4">
            <label for="new-password">New password</label>
            <input
              v-model="settingsForm.newPassword"
              class="block w-full mt-2 border-2 px-4 py-1.5"
              type="password"
              placeholder="Enter your new password"
            />
          </div>
          <div class="mt-4">
            <label for="confirm-password">Confirm password</label>
            <input
              v-model="settingsForm.confirmPassword"
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
              v-model="settingsForm.name"
              id="name"
              class="block w-full mt-2 border-2 px-4 py-1.5"
              placeholder="Name"
              type="text"
            />
            <p class="text-red-700" v-if="formError?.name">** {{ formError.name._errors[0] }} **</p>
          </div>
          <div class="mt-4">
            <label for="bio">Bio</label>
            <textarea
              v-model="settingsForm.bio"
              id="bio"
              class="block w-full h-24 mt-2 border-2 px-4 py-2 resize-none"
              placeholder="Yell me more about yourself"
            />
            <p class="text-red-700" v-if="formError?.bio">** {{ formError.bio._errors[0] }} **</p>
          </div>
          <button class="ml-auto rounded-lg mt-8 block bg-green-500 px-4 py-2 text-white">
            Submit
          </button>
        </form>
      </div>
    </section>
  </main>
</template>
