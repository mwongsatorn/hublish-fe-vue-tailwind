<script setup lang="ts">
import axios, { AxiosError } from 'axios'
import { ref, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/user.store'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import { type Article } from '@/types/index'
import { formatDate } from '@/helpers/formatDate'
import IconEdit from '@/components/icons/Edit.vue'
import IconDelete from '@/components/icons/Delete.vue'
import IconMore from '@/components/icons/More.vue'
import IconHeart from '@/components/icons/Heart.vue'
import ArticleCommentSection from '@/components/ArticleCommentSection.vue'
import AppLink from '@/components/AppLink.vue'

const props = defineProps<{ slug: string }>()
const route = useRoute()
const router = useRouter()
const article = ref<Article | null>(null)
const userStore = useUserStore()
const isMenuOpened = ref(false)
const menu = ref<HTMLElement | null>(null)

try {
  const response = await axios.get<Article>(`/api/articles/${props.slug}`)
  article.value = response.data
} catch (e) {
  if (e instanceof AxiosError) {
    if (e.response?.status === 404) {
      router.push({
        name: 'NotFound',
        params: { pathMatch: route.path.substring(1).split('/') },
        query: route.query,
        hash: route.hash
      })
    }
  }
}

async function deleteArticle() {
  const deleteSubmit = confirm('Are you sure you want to delete this article')

  if (deleteSubmit) {
    const response = await axios.delete(`/api/articles/${article.value?.slug}`)
    if (response.status !== 204) return console.log('error')
    router.push({ name: 'Profile', params: { username: userStore.user?.username } })
  }
}

async function toggleFavourite() {
  if (!userStore.isLoggedIn) return router.push({ name: 'Login' })
  if (!article.value?.favourited) {
    const response = await axios.post(`/api/articles/${article.value?.slug}/favourite`)
    if (response.status !== 201) return
    article.value!.favourited = true
    article.value!.favouriteCount++
  } else {
    const response = await axios.delete(`/api/articles/${article.value?.slug}/favourite`)
    if (response.status !== 200) return
    article.value!.favourited = false
    article.value!.favouriteCount--
  }
}

function handleClickOutside(e: MouseEvent) {
  if (e.target instanceof HTMLElement && !menu.value?.contains(e.target)) isMenuOpened.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

useHead({
  title: `${article.value?.title}`
})
</script>

<template>
  <div v-if="article" class="mx-auto min-h-[calc(100vh-56px)] max-w-2xl divide-y-2 bg-white">
    <section class="px-4 py-8">
      <div class="space-y-4">
        <h1 class="text-3xl font-bold">{{ article?.title }}</h1>
        <div class="flex items-center justify-between gap-x-4">
          <div class="flex flex-wrap items-center gap-x-4 gap-y-2.5">
            <span>Tags: </span>
            <RouterLink
              :to="{ name: 'SearchTags', query: { query: tag } }"
              class="rounded-lg bg-gray-200 px-2 py-1 text-sm font-bold hover:bg-green-500 hover:text-white"
              v-for="(tag, index) in article?.tags"
              :key="index"
            >
              {{ tag }}
            </RouterLink>
          </div>
          <div class="flex shrink-0 items-center gap-x-4">
            <span>{{ formatDate(article!.createdAt) }}</span>
          </div>
        </div>
        <div class="flex w-full flex-nowrap items-center justify-between gap-x-8">
          <AppLink
            :to="{ name: 'Profile', params: { username: article?.author.username } }"
            class="flex items-center gap-x-4 overflow-hidden"
          >
            <img :src="article?.author.image" class="aspect-square w-12 rounded-full sm:w-16" />
            <div class="overflow-hidden">
              <div class="truncate font-bold hover:underline">{{ article?.author.name }}</div>
              <div class="space-x-4 truncate text-sm">
                <span>@{{ article?.author.username }}</span>
              </div>
            </div>
          </AppLink>
          <div class="flex items-center justify-end gap-x-2">
            <button
              @click="toggleFavourite"
              :class="[article?.favourited ? 'bg-rose-500 text-white' : 'bg-gray-200']"
              class="flex items-center gap-x-2 rounded-lg px-4 py-2 transition-colors hover:bg-gray-400 hover:text-white"
            >
              <span>
                {{ article?.favouriteCount }}
              </span>
              <IconHeart class="h-6 w-6 text-white"></IconHeart>
            </button>
            <div
              ref="menu"
              class="relative flex self-stretch"
              v-if="userStore.user?.id === article?.author_id"
            >
              <button @click="isMenuOpened = true">
                <IconMore class="h-6 w-6 text-black"></IconMore>
              </button>
              <div v-if="isMenuOpened" class="absolute right-0 top-0 bg-white shadow-lg">
                <AppLink
                  class="flex items-center justify-between gap-x-2 px-8 py-4 hover:bg-gray-200"
                  :to="{ name: 'EditArticle', params: { slug: article?.slug } }"
                >
                  <span>Edit</span>
                  <IconEdit class="h-5 w-5"></IconEdit>
                </AppLink>

                <button
                  @click="deleteArticle"
                  class="flex items-center justify-between gap-x-2 px-8 py-4 hover:bg-rose-600 hover:text-white"
                >
                  <span>Delete</span>
                  <IconDelete class="h-5 w-5"></IconDelete>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p class="mt-8 whitespace-pre-wrap">
        {{ article?.content }}
      </p>
    </section>
    <ArticleCommentSection :image="article?.author.image!" :slug="props.slug">
    </ArticleCommentSection>
  </div>
</template>
