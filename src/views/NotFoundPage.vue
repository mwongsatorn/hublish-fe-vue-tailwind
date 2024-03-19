<script setup lang="ts">
import { useHead } from '@unhead/vue'

useHead({
  title: 'Page Not Found'
})
</script>

<template>
  <div class="flex min-h-[calc(100vh-56px)] items-center justify-center">
    <div>
      <div
        class="bg-gradient-to-r from-green-800/75 to-green-400/75 bg-clip-text text-center text-[clamp(7rem,_20vw,_35rem)] font-black leading-[1] text-transparent"
      >
        <404>
      </div>
      <div class="text-center text-[clamp(2.75rem,_5vw,_15rem)] font-black text-gray-900">
        PAGE NOT FOUND
      </div>
    </div>
  </div>
</template>
