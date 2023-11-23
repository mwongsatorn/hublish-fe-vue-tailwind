<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { ShortUser } from '@/types/index'
import axios from 'axios'
import { useUserStore } from '@/stores/user.store'
import IconFollow from '@/components/icons/Follow.vue'
import IconUnfollow from '@/components/icons/Unfollow.vue'
import AppLink from './AppLink.vue'

const props = defineProps<{ user: ShortUser }>()
const userStore = useUserStore()
const router = useRouter()
const followed = ref(props.user.followed!)
const followStatusText = computed(() => {
  if (followed.value) return 'Unfollow'
  else return 'Follow'
})

const followStatusIcon = {
  Follow: IconFollow,
  Unfollow: IconUnfollow
}

async function followHandler() {
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
  <AppLink
    :to="{ name: 'Profile', params: { username: user.username } }"
    class="flex items-start gap-x-6 px-4 py-2"
  >
    <div class="shrink-0">
      <img class="sm:h-20 sm:w-20 h-16 w-16" :src="props.user.image" alt="" />
    </div>
    <div class="overflow-hidden">
      <p class="font-bold hover:underline truncate">{{ props.user.name }}</p>
      <p class="text-gray-600 truncate">{{ props.user.username }}</p>
      <p class="line-clamp-2">{{ props.user.bio }}</p>
    </div>
    <button
      @click="followHandler"
      v-if="userStore.user?.username !== user.username"
      :class="[followed ? 'hover:bg-rose-600 hover:text-white' : 'hover:bg-gray-200']"
      class="ml-auto self-center flex items-center gap-x-4 px-4 py-2 bg-gray-100 rounded-lg"
    >
      <span class="hidden sm:inline-block">{{ followStatusText }}</span>
      <component class="h-4 w-4" :is="followStatusIcon[followStatusText]"></component>
    </button>
  </AppLink>
</template>
