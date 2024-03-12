<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import ArticlePreview from '@/components/ArticlePreview.vue'
import PreviewContainer from '@/components/PreviewContainer.vue'
import PaginationController from '@/components/PaginationController.vue'
import type { Article, PageResult } from '@/types/index'

const articles = ref<Article[] | null>(null)
const route = useRoute()
const totalPages = ref(0)
const page = parseInt(route.query.page as string) || 1

const response = await axios.get<PageResult<Article>>(`/api/articles/feed`, {
  params: { page: page }
})
articles.value = response.data.results
totalPages.value = response.data.total_pages
</script>

<template>
  <div>
    <PreviewContainer>
      <ArticlePreview :article="article" v-for="(article, index) in articles" :key="index">
      </ArticlePreview>
    </PreviewContainer>
    <PaginationController :total_pages="totalPages"></PaginationController>
  </div>
</template>
