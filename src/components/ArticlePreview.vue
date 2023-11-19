<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user.store'
import { useRouter } from 'vue-router'
import { type Article } from '@/schemas/article'
import IconHeart from '@/components/icons/Heart.vue'
import axios from 'axios'

const props = defineProps<{
  article: Article
}>()

const router = useRouter()
const userStore = useUserStore()

const isFavourited = ref(props.article.favourited)
const favCount = ref(props.article.favouriteCount)

async function toggleFavourite() {
  if (!userStore.isLoggedIn) return router.push({ name: 'Login' })
  if (!isFavourited.value) {
    const response = await axios.post(`/api/articles/${props.article.slug}/favourite`)
    if (response.status !== 200) return
    isFavourited.value = !isFavourited.value
    favCount.value++
  } else {
    const response = await axios.delete(`/api/articles/${props.article.slug}/favourite`)
    if (response.status !== 200) return
    isFavourited.value = !isFavourited.value
    favCount.value--
  }
}
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-[calc(60%-0.5rem)_calc(40%-0.5rem)] px-4 py-2 gap-4">
    <div class="">
      <div class="flex items-center justify-between gap-x-4">
        <RouterLink
          :to="{ name: 'Profile', params: { username: props.article.author.username } }"
          class="flex items-center gap-x-4 overflow-hidden"
        >
          <img :src="props.article.author.image" class="h-12 w-12 rounded-full bg-gray-200" />
          <div class="overflow-hidden">
            <div class="font-bold truncate hover:underline">{{ props.article.author.name }}</div>
            <div class="text-sm truncate">@{{ props.article.author.username }}</div>
          </div>
        </RouterLink>
        <button
          @click="toggleFavourite"
          :class="[isFavourited ? 'bg-rose-500 text-white' : 'bg-gray-200']"
          class="flex items-center gap-x-2 rounded-lg px-4 py-2 hover:bg-gray-400 hover:text-white transition-colors"
        >
          <span>
            {{ favCount }}
          </span>
          <IconHeart class="h-6 w-6 text-white"></IconHeart>
        </button>
      </div>
      <div class="space-y-4 mt-4">
        <p class="text-3xl font-bold">{{ props.article.title }}</p>
        <div class="flex items-center gap-x-4">
          <span>Tags: </span>
          <Router-Link
            class="font-bold px-2 py-1 bg-gray-200 rounded-lg text-sm"
            :to="{ name: 'SearchTags', query: { query: tag } }"
            v-for="(tag, index) in props.article.tags"
            :key="index"
          >
            {{ tag }}
          </Router-Link>
        </div>
        <p class="line-clamp-2">{{ props.article.content }}</p>

        <RouterLink
          class="bg-gray-200 rounded-lg px-4 py-2 block w-fit"
          :to="{ name: 'ArticleDetails', params: { slug: props.article.slug } }"
        >
          Read more
        </RouterLink>
      </div>
    </div>
    <div class="bg-green-500 min-h-[250px] order-first sm:order-none"></div>
  </div>
</template>
