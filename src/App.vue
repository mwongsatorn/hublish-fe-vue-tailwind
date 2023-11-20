<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import TransitionFade from './components/TransitionFade.vue'
</script>

<template>
  <AppHeader></AppHeader>
  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <TransitionFade>
        <Suspense>
          <component :is="Component"></component>
        </Suspense>
      </TransitionFade>
    </template>
  </RouterView>
</template>

<style></style>
