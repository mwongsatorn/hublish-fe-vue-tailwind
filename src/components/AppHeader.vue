<script lang="ts" setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <header class="shadow-lg">
    <div class="max-w-7xl mx-auto flex items-center h-[56px] px-4">
      <span class="font-bold text-xl uppercase">Hublish</span>
      <div class="ml-auto flex items-center gap-x-4">
        <RouterLink class="hover:text-green-500" to="/login">
          Log in
        </RouterLink>
        <RouterLink class="hover:text-green-500" to="/signup">
          Sign up
        </RouterLink>
      </div>
    </div>
  </header>
</template>
