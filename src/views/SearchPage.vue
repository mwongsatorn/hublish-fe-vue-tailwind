<script setup lang="ts">
import { ref, watch } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import type { PageResult, Article, ShortUser } from '@/types'
import AppLink from '@/components/AppLink.vue'
import TransitionFade from '@/components/TransitionFade.vue'
import axios from 'axios'

const route = useRoute()
const articlesTotalResults = ref(0)
const tagsTotalResults = ref(0)
const peopleTotalResults = ref(0)
const searchQuery = ref('')

route.query.query && (await fetchFirstPages(route.query.query as string))

async function fetchFirstPages(query: string) {
  const [articlesFirstPageResponse, tagsFirstPageResponse, peopleFirstPageResponse] =
    await Promise.all([
      axios.get<PageResult<Article>>('/api/articles', {
        params: { title: query }
      }),
      axios.get<PageResult<Article>>('/api/articles', {
        params: { tags: query }
      }),
      axios.get<PageResult<ShortUser>>('/api/users', {
        params: { query: query }
      })
    ])

  sessionStorage.setItem('articlesFirstPage', JSON.stringify(articlesFirstPageResponse.data))
  sessionStorage.setItem('tagsFirstPage', JSON.stringify(tagsFirstPageResponse.data))
  sessionStorage.setItem('peopleFirstPage', JSON.stringify(peopleFirstPageResponse.data))

  articlesTotalResults.value = articlesFirstPageResponse.data.total_results
  tagsTotalResults.value = tagsFirstPageResponse.data.total_results
  peopleTotalResults.value = peopleFirstPageResponse.data.total_results
}

onBeforeRouteUpdate(async (to, from) => {
  if (to.query.query) {
    if (to.query.query !== from.query.query) {
      await fetchFirstPages(to.query.query as string)
    }
  } else {
    articlesTotalResults.value = 0
    tagsTotalResults.value = 0
    peopleTotalResults.value = 0
  }
})
watch(
  () => route.query.query,
  (newQuery) => {
    if (route.name?.toString().includes('Search')) searchQuery.value = newQuery as string
  },
  { immediate: true }
)
</script>

<template>
  <main>
    <section class="mx-auto max-w-7xl py-12">
      <h1 class="px-4 text-3xl font-bold">Your results for "{{ searchQuery }}"</h1>
      <div class="flex gap-x-4 px-4 mt-4">
        <AppLink
          active-class="font-bold underline underline-offset-4 text-green-500"
          inactive-class="hover:text-green-500 font-bold"
          :to="{ name: 'SearchArticles', query: { query: route.query.query } }"
        >
          Articles: {{ articlesTotalResults }}
        </AppLink>
        <AppLink
          active-class="font-bold underline underline-offset-4 text-green-500"
          inactive-class="hover:text-green-500 font-bold"
          :to="{ name: 'SearchTags', query: { query: route.query.query } }"
        >
          Tags: {{ tagsTotalResults }}
        </AppLink>
        <AppLink
          active-class="font-bold underline underline-offset-4 text-green-500"
          inactive-class="hover:text-green-500 font-bold"
          :to="{ name: 'SearchPeople', query: { query: route.query.query } }"
        >
          People: {{ peopleTotalResults }}
        </AppLink>
      </div>

      <RouterView v-slot="{ Component, route }">
        <template v-if="Component">
          <TransitionFade>
            <Suspense>
              <component :is="Component" :key="route.fullPath"> </component>
            </Suspense>
          </TransitionFade>
        </template>
      </RouterView>
    </section>
  </main>
</template>
