<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import TransitionFade from './components/TransitionFade.vue'
</script>

<template>
  <AppHeader></AppHeader>
  <RouterView v-slot="{ Component, route }">
    <template v-if="Component">
      <TransitionFade>
        <Suspense>
          <component :is="Component" :key="route.params.username"></component>
        </Suspense>
      </TransitionFade>
    </template>
  </RouterView>
</template>

<style></style>
