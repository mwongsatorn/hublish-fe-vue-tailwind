<script setup lang="ts">
import { ref } from 'vue'
import { type ShortUser } from '@/schemas/user'
import axios from 'axios'
import UserPreview from '@/components/UserPreview.vue'

const props = defineProps<{ username: string }>()

const followers = ref<ShortUser[] | null>(null)
const response = await axios.get(`/api/users/${props.username}/followers`)
followers.value = response.data
</script>

<template>
  <section class="mx-auto max-w-7xl">
    <UserPreview v-for="user in followers" :user="user" :key="user.id"></UserPreview>
  </section>
</template>
