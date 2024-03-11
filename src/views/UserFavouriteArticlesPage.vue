<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import ArticlePreview from '@/components/ArticlePreview.vue'
import PreviewContainer from '@/components/PreviewContainer.vue'
import { type Article } from '@/types/index'

const props = defineProps<{ username: string }>()

const userFavouriteArticles = ref<Article[] | null>(null)
const response = await axios.get(`/api/articles/${props.username}/favourite`)

userFavouriteArticles.value = response.data
</script>

<template>
  <PreviewContainer>
    <ArticlePreview
      :article="article"
      v-for="(article, index) in userFavouriteArticles"
      :key="index"
    >
    </ArticlePreview>
  </PreviewContainer>
</template>
