<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import type { ShortUser } from '@/schemas/user'
import UserPreview from '@/components/UserPreview.vue'

const searchPeople = ref<ShortUser[] | []>([])
const route = useRoute()

if (route.query.query !== '') {
  const response = await axios.get('/api/users', { params: { query: route.query.query } })
  searchPeople.value = response.data
}
</script>

<template>
  <div v-if="searchPeople.length > 0" class="mt-8">
    <UserPreview :user="user" v-for="user in searchPeople" :key="user.id"></UserPreview>
  </div>
  <p class="px-4 mt-8" v-else>No result found. Make sure all the words spell correctly.</p>
</template>
