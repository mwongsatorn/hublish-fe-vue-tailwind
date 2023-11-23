<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, onBeforeRouteUpdate } from 'vue-router'
import { useUserStore } from '@/stores/user.store'
import axios from 'axios'
import ArticlePreview from '@/components/ArticlePreview.vue'
import { type Article } from '@/types/index'

const props = defineProps<{ username: string }>()

const router = useRouter()

const userStore = useUserStore()

const feedArticles = ref<Article[] | null>(null)
const response = await axios.get('/api/articles/feed')
feedArticles.value = response.data

onBeforeRouteUpdate((to) => {
  if (userStore.user?.username !== to.params.username) {
    router.replace({ name: 'UserArticles', params: { username: to.params.username } })
  }
})
</script>

<template>
  <div class="space-y-4">
    <ArticlePreview :article="article" v-for="(article, index) in feedArticles" :key="index">
    </ArticlePreview>
  </div>
</template>
