<script setup lang="ts" generic="T extends Article">
import { type Article } from '@/schemas/article'
import IconHeart from '@/components/icons/Heart.vue'

const props = defineProps<{
  article: T
}>()
</script>

<template>
  <RouterLink
    class="grid grid-cols-1 sm:grid-cols-[calc(60%-0.5rem)_calc(40%-0.5rem)] px-4 py-2 gap-4"
    :to="{ name: 'ArticleDetails', params: { slug: `${props.article.slug}` } }"
  >
    <div class="">
      <div class="flex items-center justify-between flex-wrap gap-x-4">
        <div class="flex items-center gap-x-4">
          <div class="h-10 w-10 rounded-full bg-gray-200"></div>
          <span>
            {{ props.article.author.name }}
          </span>
        </div>
        <div class="flex items-center gap-x-2">
          <span>
            {{ props.article.favouriteCount }}
          </span>
          <IconHeart class="h-6 w-6 text-transparent"></IconHeart>
        </div>
      </div>
      <div class="space-y-4 mt-4">
        <p class="text-3xl font-bold">{{ props.article.title }}</p>
        <div class="flex items-center gap-x-4">
          <span>Tags: </span>
          <Router-Link
            class="font-bold px-2 py-1 bg-gray-200 rounded-lg text-sm"
            to="/"
            v-for="(tag, index) in props.article.tags"
            :key="index"
          >
            {{ tag }}
          </Router-Link>
        </div>
        <p class="line-clamp-2">{{ props.article.content }}</p>
      </div>
    </div>
    <div class="bg-green-500 h-[250px] order-first sm:order-none"></div>
  </RouterLink>
</template>
