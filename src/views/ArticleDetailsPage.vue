<script setup lang="ts">
import axios from 'axios'
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user.store'
import { type Article } from '@/schemas/article'

const props = defineProps<{ slug: string }>()
const article = ref<Article | null>(null)
const userStore = useUserStore()

const response = await axios.get(`/api/articles/${props.slug}`)
if (response.status === 200) {
  console.log(response.data.createdAt)
  article.value = response.data as Article
}

const createdDate = computed(() => {
  const d = new Date(article.value?.createdAt as Date)
  return d.toLocaleDateString('en', { day: '2-digit', month: 'long', year: 'numeric' })
})
</script>

<template>
  <main>
    <section class="max-w-2xl mx-auto px-4 py-12 min-h-[calc(100vh-56px)]">
      <div class="space-y-4">
        <h1 class="sm:text-4xl text-2xl font-bold">{{ article?.title }}</h1>
        <div class="flex items-center gap-x-4">
          <span>Tags: </span>
          <div
            class="font-bold px-2 py-1 bg-gray-200 rounded-lg text-sm"
            v-for="(tag, index) in article?.tags"
            :key="index"
          >
            {{ tag }}
          </div>
        </div>
        <div class="flex items-center justify-between flex-wrap gap-x-8">
          <div class="flex items-center gap-x-4">
            <div class="h-20 w-20 rounded-full bg-gray-300"></div>
            <div class="text-sm">
              <div class="text-lg">{{ article?.author.name }}</div>
              <div class="space-x-4">
                <span>@{{ article?.author.username }}</span>
                <span>{{ createdDate }}</span>
              </div>
            </div>
          </div>
          <div class="flex gap-x-2 text-sm" v-if="article?.author_id === userStore.user.id">
            <button class="px-2 py-1.5 bg-gray-200 rounded-lg">Edit</button>
            <button class="px-2 py-1.5 bg-rose-500 rounded-lg text-white">Delete</button>
          </div>
        </div>
      </div>
      <p class="mt-8">
        {{ article?.content }}
      </p>
    </section>
  </main>
</template>
