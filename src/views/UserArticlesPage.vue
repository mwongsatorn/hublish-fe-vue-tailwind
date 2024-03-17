<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import ArticlePreview from '@/components/ArticlePreview.vue'
import PreviewContainer from '@/components/PreviewContainer.vue'
import PaginationController from '@/components/PaginationController.vue'
import type { Article, PageResult } from '@/types/index'

const props = defineProps<{ username: string }>()
const route = useRoute()
const articles = ref<Article[] | null>(null)
const totalPages = ref(0)
const page = parseInt(route.query.page as string) || 1

const endpoint = {
  UserCreatedArticles: `/api/articles/${props.username}/created`,
  UserFavouriteArticles: `/api/articles/${props.username}/favourite`,
  UserFeedArticles: '/api/articles/feed'
} as const

const response = await axios.get<PageResult<Article>>(
  endpoint[route.name as keyof typeof endpoint],
  {
    params: { page: page }
  }
)
articles.value = response.data.results
totalPages.value = response.data.total_pages
</script>

<template>
  <div v-if="articles?.length" class="space-y-4">
    <PreviewContainer>
      <ArticlePreview :article="article" v-for="(article, index) in articles" :key="index">
      </ArticlePreview>
    </PreviewContainer>
    <PaginationController :total_pages="totalPages"> </PaginationController>
  </div>
  <p class="px-4 text-rose-800 font-bold" v-else>There is no article to display.</p>
</template>
