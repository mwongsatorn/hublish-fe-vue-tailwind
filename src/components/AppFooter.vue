<script setup type="ts">
import IconGithub from '@/components/icons/Github.vue'
</script>

<template>
  <footer class="relative mt-auto w-full border-t-2 bg-gray-700">
    <div class="mx-auto flex max-w-7xl items-center justify-center px-4 py-4">
      <a
        class="flex gap-x-4 text-xl font-bold text-white hover:underline hover:underline-offset-2"
        href="https://github.com/mwongsatorn/hublish"
      >
        View all codes on Github
        <IconGithub class="size-8 text-white"></IconGithub>
      </a>
    </div>
  </footer>
</template>
