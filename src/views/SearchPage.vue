<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <main>
    <section class="mx-auto max-w-7xl py-12">
      <h1 class="px-4 text-3xl font-bold">Your results for "{{ route.query.query }}"</h1>
      <div class="flex gap-x-4 px-4 mt-4">
        <RouterLink
          active-class="font-bold underline text-green-500"
          class="hover:text-green-500"
          :to="{ name: 'SearchArticles', query: route.query }"
        >
          Articles
        </RouterLink>
        <RouterLink
          active-class="font-bold underline text-green-500"
          class="hover:text-green-500"
          :to="{ name: 'SearchTags', query: route.query }"
        >
          Tags
        </RouterLink>
        <RouterLink
          active-class="font-bold underline text-green-500"
          class="hover:text-green-500"
          :to="{ name: 'SearchPeople', query: route.query }"
        >
          People
        </RouterLink>
      </div>
      <RouterView></RouterView>
    </section>
  </main>
</template>
