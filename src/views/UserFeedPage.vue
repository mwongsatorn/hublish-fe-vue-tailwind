<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, onBeforeRouteUpdate } from 'vue-router'
import { useUserStore } from '@/stores/user.store'
import { z } from 'zod'
import axios from 'axios'
import ArticlePreview from '@/components/ArticlePreview.vue'
import { ArticleSchema, type Article } from '@/schemas/article'

const props = defineProps<{ username: string }>()

const router = useRouter()

const userStore = useUserStore()

const feedArticles = ref<Article[] | null>(null)
const response = await axios.get('/api/articles/feed')
if (response.status === 200) {
  const validateRes = z.array(ArticleSchema).safeParse(response.data)
  if (!validateRes.success) throw 'Error'

  feedArticles.value = validateRes.data
}

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
