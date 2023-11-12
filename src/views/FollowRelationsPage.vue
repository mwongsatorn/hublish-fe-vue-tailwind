<script setup lang="ts"></script>

<template>
  <main>
    <section class="mx-auto max-w-7xl">
      <div class="flex items-center">
        <RouterLink
          class="p-4 grow text-center bg-gray-100 hover:bg-gray-200"
          :to="{ name: 'UserFollowers' }"
        >
          Followers
        </RouterLink>
        <RouterLink
          class="p-4 grow text-center bg-gray-100 hover:bg-gray-200"
          :to="{ name: 'UserFollowings' }"
        >
          Followings
        </RouterLink>
      </div>
    </section>
    <RouterView> </RouterView>
  </main>
</template>
