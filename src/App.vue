<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <AppHeader></AppHeader>
  <Suspense>
    <RouterView></RouterView>
  </Suspense>
</template>

<style></style>
