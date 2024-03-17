<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { type ShortUser } from '@/types'
import axios from 'axios'
import UserPreview from '@/components/UserPreview.vue'
import PreviewContainer from '@/components/PreviewContainer.vue'

const props = defineProps<{ username: string }>()
const route = useRoute()

const endpoint = {
  UserFollowers: `/api/users/${props.username}/followers`,
  UserFollowings: `/api/users/${props.username}/followings`
} as const

const users = ref<ShortUser[] | null>(null)
const response = await axios.get(endpoint[route.name as keyof typeof endpoint])
users.value = response.data
</script>

<template>
  <div class="py-8">
    <PreviewContainer>
      <UserPreview v-for="user in users" :user="user" :key="user.id"></UserPreview>
    </PreviewContainer>
  </div>
</template>
