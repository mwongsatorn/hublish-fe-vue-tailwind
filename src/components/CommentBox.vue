<script setup lang="ts">
import { type Comment } from '@/types/index'
import IconDelete from './icons/Delete.vue'
import AppLink from './AppLink.vue'
import { useUserStore } from '@/stores/user.store'
import { formatDate } from '@/helpers/formatDate'

interface Props {
  comment: Comment
}
const props = defineProps<Props>()
const emits = defineEmits<{
  deleteComment: []
}>()

const userStore = useUserStore()
</script>

<template>
  <div class="relative flex gap-x-4 border-y-2 p-4 [&_+_div]:border-t-0">
    <AppLink
      class="h-12 w-12 shrink-0 rounded-full"
      :to="{
        name: 'Profile',
        params: { username: `${props.comment.commentAuthor.username}` }
      }"
    >
      <img :src="props.comment.commentAuthor.image" />
    </AppLink>

    <div class="w-full overflow-hidden">
      <div class="flex gap-x-4 text-xs sm:text-sm">
        <AppLink
          class="block basis-[75%] overflow-hidden"
          :to="{
            name: 'Profile',
            params: { username: `${props.comment.commentAuthor.username}` }
          }"
        >
          <div class="truncate font-bold hover:underline">
            {{ props.comment.commentAuthor.name }}
          </div>
          <div class="truncate">@{{ props.comment.commentAuthor.username }}</div>
        </AppLink>

        <div class="min-w-[60px] basis-[25%] text-end">
          {{ formatDate(props.comment.createdAt) }}
        </div>
      </div>
      <p class="my-4 whitespace-pre-wrap pr-4 text-sm sm:text-base">
        {{ props.comment.body }}
      </p>
    </div>

    <button
      v-if="props.comment.commentAuthor_id === userStore.user?.id"
      @click="emits('deleteComment')"
      class="absolute bottom-4 right-4 text-rose-600"
    >
      <IconDelete class="h-4 w-4" />
    </button>
  </div>
</template>
