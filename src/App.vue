<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { RouterView } from 'vue-router'
import { useUserStore } from './stores/user.store'
import AppHeader from '@/components/AppHeader.vue'

const userStore = useUserStore()

onBeforeMount(async () => {
  if (!userStore.isLoggedIn) await userStore.refreshAccessToken()
})
</script>

<template>
  <AppHeader></AppHeader>
  <RouterView></RouterView>
</template>

<style></style>
