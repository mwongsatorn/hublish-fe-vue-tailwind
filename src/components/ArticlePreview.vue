<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user.store'
import { useRouter } from 'vue-router'
import { type Article } from '@/types/index'
import IconHeart from '@/components/icons/Heart.vue'
import IconImage from '@/components/icons/Image.vue'
import AppLink from './AppLink.vue'
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
    if (response.status !== 201) return
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
  <div class="grid grid-cols-1 gap-4 px-4 py-4 md:grid-cols-[calc(57%-0.5rem)_calc(43%-0.5rem)]">
    <div class="space-y-4">
      <div class="flex items-center justify-between gap-x-4">
        <AppLink
          :to="{ name: 'Profile', params: { username: props.article.author.username } }"
          class="flex items-center gap-x-4 overflow-hidden"
        >
          <img :src="props.article.author.image" class="h-12 w-12 rounded-full bg-gray-200" />
          <div class="overflow-hidden">
            <div class="truncate font-bold hover:underline">{{ props.article.author.name }}</div>
            <div class="truncate text-sm">@{{ props.article.author.username }}</div>
          </div>
        </AppLink>
        <button
          @click="toggleFavourite"
          :class="[isFavourited ? 'bg-rose-500 text-white' : 'bg-gray-200']"
          class="flex items-center gap-x-2 rounded-lg px-4 py-2 transition-colors hover:bg-gray-400 hover:text-white"
        >
          <span>
            {{ favCount }}
          </span>
          <IconHeart class="h-6 w-6 text-white"></IconHeart>
        </button>
      </div>
      <div class="space-y-4">
        <p class="text-3xl font-bold">{{ props.article.title }}</p>
        <div class="flex items-center gap-x-4">
          <span>Tags: </span>
          <AppLink
            class="rounded-lg bg-gray-200 px-2 py-1 text-sm font-bold hover:bg-green-500 hover:text-white"
            :to="{ name: 'SearchTags', query: { query: tag } }"
            v-for="(tag, index) in props.article.tags"
            :key="index"
          >
            {{ tag }}
          </AppLink>
        </div>
        <p class="line-clamp-2 whitespace-pre-wrap">{{ props.article.content }}</p>

        <AppLink
          class="block w-fit rounded-lg bg-gray-200 px-4 py-2 hover:bg-green-500 hover:text-white"
          :to="{ name: 'ArticleDetails', params: { slug: props.article.slug } }"
        >
          Read more
        </AppLink>
      </div>
    </div>
    <div
      class="order-first flex min-h-[250px] items-center justify-center bg-gray-400 opacity-75 md:order-none"
    >
      <IconImage class="size-20 text-white"></IconImage>
    </div>
  </div>
</template>
