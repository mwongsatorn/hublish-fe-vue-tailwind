<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user.store'
import { type Article } from '@/schemas/article'
import { formatDate } from '@/helpers/formatDate'
import ArticleCommentSection from '@/components/ArticleCommentSection.vue'

const props = defineProps<{ slug: string }>()
const article = ref<Article | null>(null)
const userStore = useUserStore()

const response = await axios.get(`/api/articles/${props.slug}`)
if (response.status === 200) {
  console.log(response.data.createdAt)
  article.value = response.data as Article
}
</script>

<template>
  <main>
    <section class="max-w-2xl mx-auto px-4 my-12">
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
          <span>{{ formatDate(article!.createdAt) }}</span>
        </div>
        <div class="flex items-center justify-between w-full gap-x-8 flex-nowrap">
          <RouterLink
            :to="{ name: 'Profile', params: { username: article?.author.username } }"
            class="flex items-center gap-x-4 overflow-hidden"
          >
            <img :src="article?.author.image" class="aspect-square sm:w-20 w-16 rounded-full" />
            <div class="overflow-hidden">
              <div class="truncate hover:underline font-bold">{{ article?.author.name }}</div>
              <div class="space-x-4 truncate text-sm">
                <span>@{{ article?.author.username }}</span>
              </div>
            </div>
          </RouterLink>
          <div
            class="flex gap-x-2 text-sm shrink-0"
            v-if="article?.author_id === userStore.user?.id"
          >
            <RouterLink
              :to="{ name: 'EditArticle', params: { slug: props.slug } }"
              class="px-2 py-1.5 bg-gray-200 rounded-lg"
            >
              Edit
            </RouterLink>
            <button class="px-2 py-1.5 bg-rose-500 rounded-lg text-white">Delete</button>
          </div>
        </div>
      </div>
      <p class="mt-8 whitespace-pre-wrap">
        {{ article?.content }}
      </p>
    </section>
    <ArticleCommentSection :image="article!.author.image" :slug="props.slug">
    </ArticleCommentSection>
  </main>
</template>
