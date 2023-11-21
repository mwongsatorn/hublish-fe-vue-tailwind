<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppLink from '@/components/AppLink.vue'
import TransitionFade from '@/components/TransitionFade.vue'

const route = useRoute()
const searchQuery = ref('')

watch(
  () => route.query.query,
  (newQuery, oldQuery) => {
    if (newQuery) searchQuery.value = newQuery as string
    else searchQuery.value = oldQuery as string
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
          :to="{ name: 'SearchArticles', query: route.query }"
        >
          Articles
        </AppLink>
        <AppLink
          active-class="font-bold underline underline-offset-4 text-green-500"
          inactive-class="hover:text-green-500 font-bold"
          :to="{ name: 'SearchTags', query: route.query }"
        >
          Tags
        </AppLink>
        <AppLink
          active-class="font-bold underline underline-offset-4 text-green-500"
          inactive-class="hover:text-green-500 font-bold"
          :to="{ name: 'SearchPeople', query: route.query }"
        >
          People
        </AppLink>
      </div>

      <RouterView v-slot="{ Component, route }">
        <template v-if="Component">
          <TransitionFade>
            <KeepAlive>
              <Suspense>
                <component :is="Component" :key="`${route.name as string}-${searchQuery}`">
                </component>
              </Suspense>
            </KeepAlive>
          </TransitionFade>
        </template>
      </RouterView>
    </section>
  </main>
</template>
