<script setup lang="ts">
import type { Article, PageResult } from '@/types/index'
import axios from 'axios'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import ArticlePreview from '@/components/ArticlePreview.vue'

const searchArticles = ref<Article[] | []>([])
const route = useRoute()

if (route.query.query !== '') {
  const response = await axios.get<PageResult<Article>>('/api/articles', {
    params: { tags: route.query.query }
  })
  searchArticles.value = response.data.results
}
</script>

<template>
  <div v-if="searchArticles.length > 0" class="mt-8">
    <ArticlePreview :article="article" v-for="article in searchArticles" :key="article.id">
    </ArticlePreview>
  </div>
  <p class="px-4 mt-8" v-else>No result found. Make sure all the words spell correctly.</p>
</template>
