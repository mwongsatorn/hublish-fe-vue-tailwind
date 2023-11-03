<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores/user.store'
import { type ZodFormattedError } from 'zod'
import {
  ChangeEmailSchema,
  ChangePasswordSchema,
  ChangeProfileSchema,
  type ChangeEmail,
  type ChangePassword,
  type ChangeProfile
} from '@/schemas/user'
import { USER_IMAGES } from '@/constants/images'
import axios from 'axios'

const userStore = useUserStore()

const emailFormError = ref<ZodFormattedError<ChangeEmail> | null>(null)
const passwordFormError = ref<ZodFormattedError<ChangePassword> | null>(null)
const profileFormError = ref<ZodFormattedError<ChangeProfile> | null>(null)
const changeSettingsError = ref('')

const choseImage = ref<keyof typeof USER_IMAGES | ''>('')

const emailForm = ref({
  password: '',
  newEmail: ''
})
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const changeEmail = ref(false)
const changePassword = ref(false)

watch(changePassword, () => {
  if (changePassword.value === false) {
    passwordForm.value.currentPassword = ''
    passwordForm.value.newPassword = ''
    passwordForm.value.confirmPassword = ''
    passwordFormError.value = null
    changeSettingsError.value = ''
  }
})

watch(changeEmail, () => {
  if (changeEmail.value === false) {
    emailForm.value.newEmail = ''
    emailForm.value.password = ''
    emailFormError.value = null
    changeSettingsError.value = ''
  }
})

watch(userStore.user!, () => {
  if (!profileFormError.value || !changeSettingsError.value) {
    profileFormError.value = null
    changeSettingsError.value = ''
  }
})

watch(passwordForm.value, () => {
  if (!passwordFormError.value || !changeSettingsError.value) {
    passwordFormError.value = null
    changeSettingsError.value = ''
  }
})

watch(emailForm.value, () => {
  if (!emailFormError.value || !changeSettingsError.value) {
    emailFormError.value = null
    changeSettingsError.value = ''
  }
})

async function emailSubmit() {
  const validate = ChangeEmailSchema.safeParse(emailForm.value)
  if (!validate.success) {
    emailFormError.value = validate.error.format()
    return
  }
  const response = await axios.put('/api/users/settings/email', validate.data)
  if (response.status !== 200 && response.status !== 409) {
    changeSettingsError.value = 'Something went wrong.'
    return
  }
  if (response.status === 409) {
    changeSettingsError.value = 'This email is already used by other user.'
    return
  }
  alert('Successfully changed your email')
  changeEmail.value = false
  userStore.user!.email = validate.data.newEmail
}

async function passwordSubmit() {
  const validate = ChangePasswordSchema.safeParse(passwordForm.value)
  if (!validate.success) {
    passwordFormError.value = validate.error.format()
    return
  }
  const response = await axios.put('/api/users/settings/password', validate.data)
  if (response.status !== 200) {
    changeSettingsError.value = 'Something went wrong.'
    return
  }

  alert('Successfully changed your password')
  changePassword.value = false
}

async function profileSubmit() {
  const validate = ChangeProfileSchema.safeParse({
    name: userStore.user!.name,
    bio: userStore.user!.bio,
    ...(choseImage.value && { image: USER_IMAGES[choseImage.value] })
  })
  if (!validate.success) {
    profileFormError.value = validate.error.format()
    return
  }
  const response = await axios.put('/api/users/settings/profile', validate.data)
  if (response.status !== 200) {
    changeSettingsError.value = 'Something went wrong.'
    return
  }

  alert('Successfully changed your profile')
  userStore.user!.name = validate.data.name
  userStore.user!.bio = validate.data.bio
  userStore.user!.image = validate.data.image || userStore.user!.image
}
</script>

<template>
  <main>
    <section class="max-w-7xl mx-auto px-4 py-12 min-h-[calc(100vh-56px)]">
      <h1 class="font-bold text-2xl text-center">Settings</h1>
      <div class="grid md:grid-cols-[40%_60%] grid-cols-1 gap-4">
        <div>
          <p>Profile image</p>
          <div class="flex items-center gap-4 flex-wrap mt-4 overflow-y-auto max-h-[300px]">
            <button
              @click="choseImage = key"
              v-for="(image, key) in USER_IMAGES"
              class="basis-[calc(25%-1rem)] h-auto rounded-full"
              :class="choseImage === key ? 'border-4 border-gray-800' : ''"
              :key="key"
            >
              <img :src="image" alt="" />
            </button>
          </div>
        </div>
        <div>
          <p class="mt-4 text-red-700 text-center" v-if="changeSettingsError">
            {{ changeSettingsError }}
          </p>
          <div v-if="!changeEmail" class="mt-4">
            <label for="email">Email</label>
            <div class="flex mt-2">
              <input
                v-model="userStore.user!.email"
                id="email"
                class="block w-full border-2 border-r-0 px-4 py-1.5"
                placeholder=""
                disabled
              />
              <button @click="changeEmail = true" class="px-4 py-1.5 border-2">Edit</button>
            </div>
          </div>
          <form @submit.prevent="emailSubmit" v-else>
            <div class="mt-4">
              <label for="new-email">New Email</label>
              <input
                v-model="emailForm.newEmail"
                id="new-email"
                class="block w-full mt-2 border-2 px-4 py-1.5"
                placeholder="Enter your new email"
                type="text"
              />
              <p class="text-red-700" v-if="emailFormError?.newEmail">
                ** {{ emailFormError.newEmail._errors[0] }} **
              </p>
            </div>
            <div class="mt-4">
              <label for="password">Password</label>
              <input
                v-model="emailForm.password"
                id="password"
                class="block w-full mt-2 border-2 px-4 py-1.5"
                placeholder="Enter your password"
                type="password"
              />
              <p class="text-red-700" v-if="emailFormError?.password">
                ** {{ emailFormError.password._errors[0] }} **
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
            </div>
          </div>
          <form @submit.prevent="passwordSubmit" v-else>
            <div class="mt-4">
              <label for="current-password">Current password</label>
              <input
                v-model="passwordForm.currentPassword"
                id="current=password"
                class="block w-full mt-2 border-2 px-4 py-1.5"
                type="password"
                placeholder="Enter your current password"
              />
              <p class="text-red-700" v-if="passwordFormError?.currentPassword">
                ** {{ passwordFormError.currentPassword._errors[0] }} **
              </p>
            </div>
            <div class="mt-4">
              <label for="new-password">New password</label>
              <input
                v-model="passwordForm.newPassword"
                class="block w-full mt-2 border-2 px-4 py-1.5"
                type="password"
                placeholder="Enter your new password"
              />
              <p class="text-red-700" v-if="passwordFormError?.newPassword">
                ** {{ passwordFormError.newPassword._errors[0] }} **
              </p>
            </div>
            <div class="mt-4">
              <label for="confirm-password">Confirm password</label>
              <input
                v-model="passwordForm.confirmPassword"
                class="block w-full mt-2 border-2 px-4 py-1.5"
                type="password"
                placeholder="Confirm your new password"
              />
              <p class="text-red-700" v-if="passwordFormError?.confirmPassword">
                ** {{ passwordFormError.confirmPassword._errors[0] }} **
              </p>
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
          <form @submit.prevent="profileSubmit" id="main-form">
            <div class="mt-4">
              <label for="name">Name</label>
              <input
                v-model="userStore.user!.name"
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
                v-model="userStore.user!.bio"
                id="bio"
                class="block w-full h-24 mt-2 border-2 px-4 py-2 resize-none"
                placeholder="Tell me more about yourself"
              />
              <p class="text-red-700" v-if="profileFormError?.bio">
                ** {{ profileFormError.bio._errors[0] }} **
              </p>
            </div>
            <div class="flex items-center justify-end gap-x-4">
              <button
                type="submit"
                class="ml-auto rounded-lg mt-8 block bg-green-500 px-4 py-2 text-white"
              >
                Submit
              </button>
              <RouterLink
                :to="{ name: 'Profile', params: { username: userStore.user!.username } }"
                class="rounded-lg mt-8 block bg-rose-500 px-4 py-2 text-white"
              >
                Cancel
              </RouterLink>
            </div>
          </form>
        </div>
      </div>
    </section>
  </main>
</template>
