<script setup lang="ts">
import type { Article, ShortUser, PageResult } from '@/types/index'
import axios from 'axios'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import ArticlePreview from '@/components/ArticlePreview.vue'
import UserPreview from '@/components/UserPreview.vue'
import PreviewContainer from '@/components/PreviewContainer.vue'
import PaginationController from '@/components/PaginationController.vue'

const searchItems = ref<Article[] | ShortUser[] | []>([])
const route = useRoute()
const totalPages = ref<number>(0)

const routeName = route.name as keyof typeof info

const info = {
  SearchUsers: {
    params: { query: route.query.query, page: route.query.page },
    endpoint: '/api/users',
    firstpage: 'usersFirstPage',
    component: UserPreview
  },
  SearchArticles: {
    params: { title: route.query.query, page: route.query.page },
    endpoint: '/api/articles',
    component: ArticlePreview,
    firstpage: 'articlesFirstPage'
  },
  SearchTags: {
    params: { tags: route.query.query, page: route.query.page },
    endpoint: '/api/articles',
    component: ArticlePreview,
    firstpage: 'tagsFirstPage'
  }
}

if (route.query.query !== '') {
  if (route.query.page && route.query.page !== '1') {
    const response = await axios.get<PageResult<Article> | PageResult<ShortUser>>(
      info[routeName].endpoint,
      {
        params: info[routeName].params
      }
    )
    searchItems.value = response.data.results
    totalPages.value = response.data.total_pages
  } else {
    const articlesFirstPage: PageResult<Article> = JSON.parse(
      sessionStorage.getItem(info[routeName].firstpage)!
    )
    searchItems.value = articlesFirstPage.results
    totalPages.value = articlesFirstPage.total_pages
  }
}

function getProp(item: any) {
  if (routeName === 'SearchUsers') return { user: item }
  return { article: item }
}
</script>

<template>
  <div class="py-4">
    <template v-if="searchItems.length > 0">
      <PreviewContainer>
        <component
          :is="info[routeName].component"
          v-bind="getProp(item) as any"
          v-for="item in searchItems"
          :key="item.id"
        >
        </component>
      </PreviewContainer>
      <PaginationController :total_pages="totalPages" />
    </template>
    <p class="px-4" v-else>No result found. Make sure all the words spell correctly.</p>
  </div>
</template>
