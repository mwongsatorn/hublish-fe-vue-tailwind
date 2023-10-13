<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { type Article } from '@/schemas/article'

const props = defineProps<{ slug: string }>()
const article = ref<Article | null>(null)

const response = await axios.get(`/api/articles/${props.slug}`)
if (response.status === 200) {
  console.log(response.data)
  article.value = response.data as Article
} 
</script>

<template>
  <main>
    <section class="max-w-7xl mx-auto px-4 py-12 min-h-[calc(100vh-56px)]">
      <h1>{{ article?.title }}</h1>
      <div>{{ article?.tags }}</div>
      <p>
        {{ article?.content }}
      </p>
    </section>
  </main>
</template>
