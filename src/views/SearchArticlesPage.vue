<script setup lang="ts">
import type { Article } from '@/schemas/article'
import axios from 'axios'
import { ref } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import ArticleCard from '@/components/ArticleCard.vue'

const searchArticles = ref<Article[] | []>([])
const route = useRoute()

if (route.query.query !== '') {
  const response = await axios.get('/api/articles', { params: { title: route.query.query } })
  searchArticles.value = response.data
}

onBeforeRouteUpdate(async (to) => {
  if (route.query.query !== to.query.query && to.query.query !== '') {
    const response = await axios.get('/api/articles', { params: { title: to.query.query } })
    searchArticles.value = response.data
  }
})
</script>

<template>
  <div v-if="searchArticles.length > 0" class="mt-8">
    <ArticleCard :article="article" v-for="article in searchArticles" :key="article.id">
    </ArticleCard>
  </div>
  <p class="px-4 mt-8" v-else>No result found. Make sure all the words spell correctly.</p>
</template>
