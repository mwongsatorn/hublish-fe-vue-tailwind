<script lang="ts" setup>
import axios from 'axios'
import { ref } from 'vue'
import { useHead } from '@unhead/vue'
import { type Article } from '@/types/index'
import ArticlePreview from '@/components/ArticlePreview.vue'
import PreviewContainer from '@/components/PreviewContainer.vue'

const latestArticles = ref<Article[] | null>(null)

const response = await axios.get(`/api/articles`)

latestArticles.value = response.data.results

useHead({
  title: 'Home'
})
</script>

<template>
  <div>
    <section class="relative bg-[url('/paper-background.jpg')] bg-cover py-36 text-white">
      <div
        class="absolute left-0 top-0 size-full bg-gradient-to-r from-green-900/65 to-green-400/65"
      ></div>
      <div class="relative w-full bg-gray-900/50 py-16 backdrop-blur-sm">
        <div class="mx-auto max-w-7xl">
          <div class="w-full space-y-4 px-4">
            <div
              class="text-balance text-center text-[clamp(2.5rem,_8vw,_5rem)] font-black uppercase leading-[1]"
            >
              Discover the world through text
            </div>
            <div class="text-center text-[clamp(1.25rem,4vw,_2.5rem)]">
              Explore diverse stories and perspectives on our platform.
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="mx-auto max-w-7xl space-y-4 bg-white py-8">
      <h1 class="px-4 text-3xl font-bold">Latest Articles</h1>
      <PreviewContainer>
        <ArticlePreview :article="article" v-for="article in latestArticles" :key="article.id">
        </ArticlePreview>
      </PreviewContainer>
    </section>
  </div>
</template>
