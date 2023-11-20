<script setup lang="ts"></script>

<template>
  <Transition
    mode="out-in"
    enter-active-class="transition duration-300"
    leave-active-class="transition duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-1"
    leave-from-class="opacity-1"
    leave-to-class="opacity-0"
  >
    <slot></slot>
  </Transition>
</template>
