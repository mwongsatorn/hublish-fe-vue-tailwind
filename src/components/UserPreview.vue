<script setup lang="ts">
import { ref } from 'vue'
import type { ShortUser } from '@/schemas/user'
import axios from 'axios'

const props = defineProps<{ user: ShortUser }>()
const followed = ref(props.user.followed!)

async function followUser() {
  const response = await axios.post(`/api/users/${props.user.username}/follow`)
  if (response.status !== 201) {
    console.log('Error')
    return
  }
  console.log(response)
  followed.value = true
}

async function unfollowUser() {
  const unfollow = confirm('Are you sure you want to unfollow this person')
  if (!unfollow) return
  const response = await axios.delete(`/api/users/${props.user.username}/follow`)
  if (response.status !== 200) {
    console.log('Error')
    console.log(response)
    return
  }
  followed.value = false
}
</script>

<template>
  <div class="flex items-start gap-x-6 px-4 py-2">
    <div>
      <img class="sm:h-20 sm:w-20 h-16 w-16" :src="props.user.image" alt="" />
    </div>
    <div>
      <p class="font-bold hover:underline">{{ props.user.name }}</p>
      <p class="text-gray-600">{{ props.user.username }}</p>
      <p>{{ props.user.bio }}</p>
    </div>
    <button
      @click="followUser"
      v-if="!followed"
      class="ml-auto self-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
    >
      Follow
    </button>
    <button
      @click="unfollowUser"
      v-else
      class="ml-auto self-center px-4 py-2 bg-gray-100 hover:bg-rose-600 hover:text-white rounded-lg"
    >
      Unfollow
    </button>
  </div>
</template>
