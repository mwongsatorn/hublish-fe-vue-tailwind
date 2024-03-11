<script setup lang="ts">
import type { Article, PageResult } from '@/types/index'
import axios from 'axios'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import ArticlePreview from '@/components/ArticlePreview.vue'
import PreviewContainer from '@/components/PreviewContainer.vue'
import PaginationController from '@/components/PaginationController.vue'

const searchArticles = ref<Article[] | []>([])
const route = useRoute()
const totalPages = ref<number>(0)

if (route.query.query !== '') {
  if (route.query.page && route.query.page !== '1') {
    const response = await axios.get<PageResult<Article>>('/api/articles', {
      params: { title: route.query.query, page: route.query.page }
    })
    searchArticles.value = response.data.results
    totalPages.value = response.data.total_pages
  } else {
    const articlesFirstPage: PageResult<Article> = JSON.parse(
      sessionStorage.getItem('articlesFirstPage')!
    )
    searchArticles.value = articlesFirstPage.results
    totalPages.value = articlesFirstPage.total_pages
  }
}
</script>

<template>
  <div>
    <template v-if="searchArticles.length > 0">
      <PreviewContainer>
        <ArticlePreview :article="article" v-for="article in searchArticles" :key="article.id">
        </ArticlePreview>
      </PreviewContainer>
      <PaginationController :total_pages="totalPages" />
    </template>
    <p class="px-4 mt-8" v-else>No result found. Make sure all the words spell correctly.</p>
  </div>
</template>
