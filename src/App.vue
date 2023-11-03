<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onBeforeMount } from 'vue'
import { useUserStore } from './stores/user.store'
import AppHeader from '@/components/AppHeader.vue'

const userStore = useUserStore()

onBeforeMount(async () => {
  await userStore.refreshAccessToken().catch((e) => {})
})
</script>

<template>
  <AppHeader></AppHeader>
  <Suspense>
    <RouterView></RouterView>
  </Suspense>
</template>

<style></style>
