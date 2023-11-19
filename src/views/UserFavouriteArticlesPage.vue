<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import axios from 'axios'
import ArticlePreview from '@/components/ArticlePreview.vue'
import { ArticleSchema, type Article } from '@/schemas/article'

const props = defineProps<{ username: string }>()

const userFavouriteArticles = ref<Article[] | null>(null)
const response = await axios.get(`/api/articles/${props.username}/favourite`)
if (response.status === 200) {
  const validateRes = z.array(ArticleSchema).safeParse(response.data)
  if (!validateRes.success) throw 'Error'

  userFavouriteArticles.value = validateRes.data
}
</script>

<template>
  <div class="space-y-4">
    <ArticlePreview
      :article="article"
      v-for="(article, index) in userFavouriteArticles"
      :key="index"
    >
    </ArticlePreview>
  </div>
</template>
