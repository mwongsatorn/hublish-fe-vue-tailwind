<script lang="ts" setup>
import axios from 'axios'
import { ref } from 'vue'
import { type Article } from '@/types/index'
import ArticlePreview from '@/components/ArticlePreview.vue'

const latestArticles = ref<Article[] | null>(null)

const response = await axios.get(`/api/articles`)

latestArticles.value = response.data.results
</script>

<template>
  <main>
    <section class="px-4 py-36 text-white space-y-4 bg-green-400">
      <div class="mx-auto max-w-7xl">
        <div class="font-bold text-5xl uppercase px-4">Lorem ipsum dolor sit amet consectetur</div>
        <div class="w-1/2 px-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum totam minima quod maiores
          eos saepe adipisci molestiae tenetur maxime nulla!
        </div>
      </div>
    </section>
    <section class="max-w-7xl mx-auto py-12 space-y-4">
      <h1 class="px-4 sm:text-4xl text-2xl font-bold">Latest articles</h1>
      <div class="mt-8">
        <ArticlePreview :article="article" v-for="article in latestArticles" :key="article.id">
        </ArticlePreview>
      </div>
    </section>
  </main>
</template>
