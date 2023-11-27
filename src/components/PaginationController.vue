<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const props = defineProps<{ total_pages: number }>()
const adjacentSize = ref(2)
const currentPage = parseInt(route.query.page as string) || 1
const pageDisplay = (() => {
  const start = Math.max(1, currentPage - adjacentSize.value)
  const end = Math.min(props.total_pages, currentPage + adjacentSize.value)
  const range = []
  for (let i = start; i <= end; i++) {
    range.push(i)
  }
  return range
})()

function goToPage(page: number) {
  router.push({ name: route.name as string, query: { query: route.query.query, page: page } })
}

function changeAdjacentSize() {
  if (window.innerWidth < 640 && adjacentSize.value !== 1) adjacentSize.value = 1
  if (window.innerWidth > 640 && adjacentSize.value !== 2) adjacentSize.value = 2
}

onMounted(() => {
  changeAdjacentSize()
  window.addEventListener('resize', changeAdjacentSize)
})
onUnmounted(() => {
  window.removeEventListener('resize', changeAdjacentSize)
})
</script>

<template>
  <div class="flex items-center mt-8 px-4 justify-end gap-x-4">
    <div class="flex">
      <button
        @click="goToPage(1)"
        :disabled="currentPage === 1"
        :class="[currentPage === 1 ? 'bg-gray-500' : 'bg-green-600']"
        class="h-8 w-8 flex items-center justify-center text-white border"
      >
        &#60;&#60;
      </button>
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        :class="[currentPage === 1 ? 'bg-gray-500' : 'bg-green-600']"
        class="h-8 w-8 flex items-center justify-center text-white border"
      >
        &#60;
      </button>
    </div>
    <div v-if="pageDisplay[0] > 1">...</div>
    <div
      :class="[currentPage === page ? 'text-green-600' : '']"
      v-for="page in pageDisplay"
      :key="page"
    >
      {{ page }}
    </div>
    <div v-if="pageDisplay[pageDisplay.length - 1] < props.total_pages">...</div>
    <div class="flex">
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === props.total_pages"
        :class="[currentPage === props.total_pages ? 'bg-gray-500' : 'bg-green-600']"
        class="h-8 w-8 flex items-center justify-center text-white border"
      >
        &#62;
      </button>
      <button
        @click="goToPage(props.total_pages)"
        :disabled="currentPage === props.total_pages"
        :class="[currentPage === props.total_pages ? 'bg-gray-500' : 'bg-green-600']"
        class="h-8 w-8 flex items-center justify-center text-white border"
      >
        &#62;&#62;
      </button>
    </div>
  </div>
</template>
