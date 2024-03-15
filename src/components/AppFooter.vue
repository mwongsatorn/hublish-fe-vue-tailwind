<script setup type="ts">
import IconGithub from '@/components/icons/Github.vue'
</script>

<template>
  <footer class="relative w-full border-t-2 mt-auto bg-gray-700">
    <div class="mx-auto max-w-7xl px-4 py-4 flex items-center justify-center">
      <a
        class="flex gap-x-4 font-bold text-xl text-white hover:underline-offset-2 hover:underline"
        href="https://github.com/mwongsatorn/hublish"
      >
        View all codes on Github
        <IconGithub class="size-8 text-white"></IconGithub>
      </a>
    </div>
  </footer>
</template>
