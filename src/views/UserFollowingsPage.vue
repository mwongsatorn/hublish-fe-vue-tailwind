<script setup lang="ts">
import { ref } from 'vue'
import { type ShortUser } from '@/types'
import axios from 'axios'
import UserPreview from '@/components/UserPreview.vue'
import PreviewContainer from '@/components/PreviewContainer.vue'

const props = defineProps<{ username: string }>()

const followings = ref<ShortUser[] | null>(null)
const response = await axios.get(`/api/users/${props.username}/followings`)
followings.value = response.data
</script>

<template>
  <section class="mx-auto max-w-7xl">
    <PreviewContainer>
      <UserPreview v-for="user in followings" :user="user" :key="user.id"></UserPreview>
    </PreviewContainer>
  </section>
</template>
