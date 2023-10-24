<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import axios from 'axios'
import ArticleCard from '@/components/ArticleCard.vue'
import { ArticleSchema, type Article } from '@/schemas/article'

const props = defineProps<{ user_id: string }>()

const userArticles = ref<Article[] | null>(null)
const response = await axios.get(`/api/articles/${props.user_id}/created`)
if (response.status === 200) {
  const validateRes = z.array(ArticleSchema).safeParse(response.data)
  if (!validateRes.success) throw 'Error'

  userArticles.value = validateRes.data
}
</script>

<template>
  <div class="space-y-4">
    <ArticleCard :article="article" v-for="(article, index) in userArticles" :key="index">
    </ArticleCard>
  </div>
</template>
