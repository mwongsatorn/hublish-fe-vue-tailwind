<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import TransitionFade from './components/TransitionFade.vue'
import { useHead } from '@unhead/vue'

useHead({
  titleTemplate: '%s | Hublish'
})
</script>

<template>
  <AppHeader></AppHeader>
  <main class="min-h-[calc(100vh-56px)] bg-gray-100">
    <RouterView v-slot="{ Component, route }">
      <template v-if="Component">
        <TransitionFade>
          <Suspense>
            <component :is="Component" :key="route.params.username"></component>
          </Suspense>
        </TransitionFade>
      </template>
    </RouterView>
  </main>
  <AppFooter></AppFooter>
</template>

<style></style>
