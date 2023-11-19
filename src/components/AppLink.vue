<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useLink, type RouterLinkProps } from 'vue-router'

interface Props extends RouterLinkProps {
  inactiveClass?: string
}
const props = defineProps<Props>()

const { isActive, isExactActive } = useLink(props)

const isActiveClass = computed(() => {
  return isActive.value && props.activeClass ? props.activeClass : null
})

const isExactActiveClass = computed(() => {
  return isExactActive.value && props.exactActiveClass ? props.exactActiveClass : null
})

const inactiveClass = computed(() => {
  return !isActive.value && !isExactActive.value ? props.inactiveClass : null
})
</script>

<template>
  <RouterLink :class="[isActiveClass, isExactActiveClass, inactiveClass]" :to="props.to">
    <slot></slot>
  </RouterLink>
</template>
