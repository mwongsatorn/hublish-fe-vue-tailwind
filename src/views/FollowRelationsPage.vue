<script setup lang="ts">
import AppLink from '@/components/AppLink.vue'
</script>

<template>
  <main>
    <section class="mx-auto max-w-7xl">
      <div class="flex items-center">
        <AppLink
          active-class="bg-green-500 text-white font-bold"
          inactive-class="hover:bg-gray-200"
          class="p-4 grow text-center bg-gray-100"
          :to="{ name: 'UserFollowers' }"
        >
          Followers
        </AppLink>
        <AppLink
          active-class="bg-green-500 text-white font-bold"
          inactive-class="hover:bg-gray-200"
          class="p-4 grow text-center bg-gray-100"
          :to="{ name: 'UserFollowings' }"
        >
          Followings
        </AppLink>
      </div>
    </section>
    <RouterView> </RouterView>
  </main>
</template>
