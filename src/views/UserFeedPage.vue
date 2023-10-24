<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import axios from 'axios'
import ArticleCard from '@/components/ArticleCard.vue'
import { ArticleSchema, type Article } from '@/schemas/article'

const feedArticles = ref<Article[] | null>(null)
const response = await axios.get('/api/articles/feed')
if (response.status === 200) {
  const validateRes = z.array(ArticleSchema).safeParse(response.data)
  if (!validateRes.success) throw 'Error'

  feedArticles.value = validateRes.data
}
</script>

<template>
  <div class="space-y-4">
    <ArticleCard :article="article" v-for="(article, index) in feedArticles" :key="index">
    </ArticleCard>
  </div>
</template>
