<script setup lang="ts">
import axios from 'axios'
import { ref, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/user.store'
import { useRouter } from 'vue-router'
import { type Article } from '@/schemas/article'
import { formatDate } from '@/helpers/formatDate'
import IconEdit from '@/components/icons/Edit.vue'
import IconDelete from '@/components/icons/Delete.vue'
import IconMore from '@/components/icons/More.vue'
import ArticleCommentSection from '@/components/ArticleCommentSection.vue'

const props = defineProps<{ slug: string }>()
const router = useRouter()
const article = ref<Article | null>(null)
const userStore = useUserStore()
const isMenuOpened = ref(false)
const menu = ref<HTMLElement | null>(null)

const response = await axios.get(`/api/articles/${props.slug}`)
if (response.status === 200) {
  console.log(response.data.createdAt)
  article.value = response.data as Article
}

async function deleteArticle() {
  const deleteSubmit = confirm('Are you sure you want to delete this article')

  if (deleteSubmit) {
    const response = await axios.delete(`/api/articles/${article.value?.slug}`)
    if (response.status !== 204) return console.log('error')
    router.push({ name: 'Profile', params: { username: userStore.user?.username } })
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
</script>

<template>
  <main>
    <section class="max-w-2xl mx-auto px-4 my-12">
      <div class="space-y-4">
        <h1 class="sm:text-4xl text-2xl font-bold">{{ article?.title }}</h1>
        <div class="flex items-center justify-between gap-x-4">
          <div class="flex items-center gap-x-4 flex-wrap">
            <span>Tags: </span>
            <div
              class="font-bold px-2 py-1 bg-gray-200 rounded-lg text-sm"
              v-for="(tag, index) in article?.tags"
              :key="index"
            >
              {{ tag }}
            </div>
          </div>
          <div class="flex items-center gap-x-4 shrink-0">
            <span>{{ formatDate(article!.createdAt) }}</span>
          </div>
        </div>
        <div class="flex items-center justify-between w-full gap-x-8 flex-nowrap">
          <RouterLink
            :to="{ name: 'Profile', params: { username: article?.author.username } }"
            class="flex items-center gap-x-4 overflow-hidden"
          >
            <img :src="article?.author.image" class="aspect-square sm:w-16 w-12 rounded-full" />
            <div class="overflow-hidden">
              <div class="truncate hover:underline font-bold">{{ article?.author.name }}</div>
              <div class="space-x-4 truncate text-sm">
                <span>@{{ article?.author.username }}</span>
              </div>
            </div>
          </RouterLink>
          <div class="flex items-center justify-end gap-x-2">
            <div
              ref="menu"
              class="flex self-stretch relative"
              v-if="userStore.user!.id === article?.author_id!"
            >
              <button @click="isMenuOpened = true">
                <IconMore class="w-6 h-6 text-black"></IconMore>
              </button>
              <div v-if="isMenuOpened" class="absolute right-0 top-0 shadow-lg bg-white">
                <RouterLink
                  class="px-8 py-4 flex items-center justify-between gap-x-2 hover:bg-gray-200"
                  :to="{ name: 'EditArticle', params: { slug: article?.slug } }"
                >
                  <span>Edit</span>
                  <IconEdit class="w-5 h-5"></IconEdit>
                </RouterLink>

                <button
                  @click="deleteArticle"
                  class="px-8 py-4 flex items-center justify-between gap-x-2 hover:bg-rose-600 hover:text-white"
                >
                  <span>Delete</span>
                  <IconDelete class="w-5 h-5"></IconDelete>
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
    <ArticleCommentSection :image="article!.author.image" :slug="props.slug">
    </ArticleCommentSection>
  </main>
</template>
