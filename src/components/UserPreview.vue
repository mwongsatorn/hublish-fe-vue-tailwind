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
  <div class="flex px-4 py-2">
    <AppLink
      class="flex grow items-start gap-x-6"
      :to="{ name: 'Profile', params: { username: user.username } }"
    >
      <div class="shrink-0">
        <img class="h-16 w-16 sm:h-20 sm:w-20" :src="props.user.image" alt="" />
      </div>
      <div class="overflow-hidden">
        <p class="truncate font-bold hover:underline">{{ props.user.name }}</p>
        <p class="truncate text-gray-600">{{ props.user.username }}</p>
        <p class="line-clamp-2">{{ props.user.bio }}</p>
      </div>
    </AppLink>
    <button
      @click="followHandler"
      v-if="userStore.user?.username !== user.username"
      :class="[followed ? 'hover:bg-rose-600 hover:text-white' : 'hover:bg-gray-200']"
      class="ml-auto flex items-center gap-x-4 self-center rounded-lg bg-gray-100 px-4 py-2"
    >
      <span class="hidden sm:inline-block">{{ followStatusText }}</span>
      <component class="h-4 w-4" :is="followStatusIcon[followStatusText]"></component>
    </button>
  </div>
</template>
