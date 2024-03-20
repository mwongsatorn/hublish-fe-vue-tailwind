<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import { type ShortUser } from '@/types'
import axios, { AxiosError } from 'axios'
import UserPreview from '@/components/UserPreview.vue'
import PreviewContainer from '@/components/PreviewContainer.vue'

const props = defineProps<{ username: string; finishedLoading: () => void }>()
const route = useRoute()
const router = useRouter()

const endpoint = {
  UserFollowers: `/api/users/${props.username}/followers`,
  UserFollowings: `/api/users/${props.username}/followings`
} as const

const users = ref<ShortUser[] | null>(null)

try {
  console.log('hello')
  const response = await axios.get(endpoint[route.name as keyof typeof endpoint])
  users.value = response.data
  props.finishedLoading()
} catch (e) {
  if (e instanceof AxiosError) {
    if (e.response?.status === 404) {
      router.push({
        name: 'NotFound',
        params: { pathMatch: route.path.substring(1).split('/') },
        query: route.query,
        hash: route.hash
      })
    }
  }
}

useHead({
  title: () =>
    route.name === 'UserFollowers'
      ? `Followers (@${props.username})`
      : `Followings (@${props.username})`
})
</script>

<template>
  <div class="py-8">
    <PreviewContainer>
      <UserPreview v-for="user in users" :user="user" :key="user.id"></UserPreview>
    </PreviewContainer>
  </div>
</template>
