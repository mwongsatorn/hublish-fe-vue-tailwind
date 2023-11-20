<script setup lang="ts">
import { useRoute } from 'vue-router'
import AppLink from '@/components/AppLink.vue'

const route = useRoute()
</script>

<template>
  <main>
    <section class="mx-auto max-w-7xl py-12">
      <h1 class="px-4 text-3xl font-bold">Your results for "{{ route.query.query }}"</h1>
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
      <RouterView></RouterView>
    </section>
  </main>
</template>
