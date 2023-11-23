<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import ArticlePreview from '@/components/ArticlePreview.vue'
import { type Article } from '@/types/index'

const props = defineProps<{ username: string }>()

const userArticles = ref<Article[] | null>(null)
const response = await axios.get(`/api/articles/${props.username}/created`)
userArticles.value = response.data
</script>

<template>
  <div class="space-y-4">
    <ArticlePreview :article="article" v-for="(article, index) in userArticles" :key="index">
    </ArticlePreview>
  </div>
</template>
