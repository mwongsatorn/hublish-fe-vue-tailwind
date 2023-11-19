<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { ShortUser } from '@/schemas/user'
import axios from 'axios'
import { useUserStore } from '@/stores/user.store'

const props = defineProps<{ user: ShortUser }>()
const userStore = useUserStore()
const router = useRouter()
const followed = ref(props.user.followed!)
const followStatus = computed(() => {
  if (followed.value) return 'Unfollow'
  else return 'Follow'
})

async function clickHandler() {
  if (!userStore.isLoggedIn) return router.push({ name: 'Login' })
  if (followed.value) {
    const unfollow = confirm('Are you sure you want to unfollow this person')
    if (!unfollow) return
    await axios.delete(`/api/users/${props.user.username}/follow`)
    followed.value = false
  } else {
    await axios.post(`/api/users/${props.user.username}/follow`)
    followed.value = true
  }
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
      @click="clickHandler"
      v-if="userStore.user?.username !== user.username"
      :class="[followed ? 'hover:bg-rose-600 hover:text-white' : 'hover:bg-gray-200']"
      class="ml-auto self-center flex items-center gap-x-4 px-4 py-2 bg-gray-100 rounded-lg"
    >
      <span class="hidden sm:inline-block">{{ followStatus }}</span>
    </button>
  </div>
</template>
