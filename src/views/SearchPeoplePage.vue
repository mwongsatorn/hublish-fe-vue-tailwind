<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import type { ShortUser, PageResult } from '@/types/index'
import UserPreview from '@/components/UserPreview.vue'
import PreviewContainer from '@/components/PreviewContainer.vue'
import PaginationController from '@/components/PaginationController.vue'

const searchPeople = ref<ShortUser[] | []>([])
const route = useRoute()
const totalPages = ref(0)

if (route.query.query !== '') {
  if (route.query.page && route.query.page !== '1') {
    const response = await axios.get<PageResult<ShortUser>>('/api/users', {
      params: { query: route.query.query, page: route.query.page }
    })
    searchPeople.value = response.data.results
    totalPages.value = response.data.total_pages
  } else {
    const peopleFirstPage = JSON.parse(sessionStorage.getItem('peopleFirstPage')!)
    searchPeople.value = peopleFirstPage.results
    totalPages.value = peopleFirstPage.total_pages
  }
}
</script>

<template>
  <div>
    <template v-if="searchPeople.length > 0">
      <PreviewContainer>
        <UserPreview :user="user" v-for="user in searchPeople" :key="user.id"></UserPreview>
      </PreviewContainer>
      <PaginationController :total_pages="totalPages" />
    </template>
    <p class="px-4 mt-8" v-else>No result found. Make sure all the words spell correctly.</p>
  </div>
</template>
